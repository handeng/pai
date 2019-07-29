// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';

import {
  CheckboxVisibility,
  DetailsList,
  DetailsListLayoutMode,
  Fabric,
  SelectionMode,
  Text,
  Stack,
} from 'office-ui-fabric-react';
import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {
  getNodesHealthInfo,
  getAllAvailableNodesName,
  getNodeAvailableGpu,
  getNodeTotalGpu,
  getNodeServices,
  getNodeJobGPUStatistics,
} from './conn';
import {get, isNil} from 'lodash';

const contentWrapper = document.getElementById('content-wrapper');

const columns = [
  {
    key: 'nodeName',
    name: 'Node Name',
    fieldName: 'nodeName',
    isResizable: true,
    // minWidth: columnWidth,
  },
  {
    key: 'nodeIP',
    name: 'Node IP',
    fieldName: 'nodeIP',
    // minWidth: columnWidth,
  },
  {
    key: 'gpuCap',
    name: 'GPU Capacity',
    fieldName: 'gpuCap',
    // minWidth: columnWidth,
  },
  {
    key: 'usedGPU',
    name: 'Used GPU',
    fieldName: 'usedGPU',
    // minWidth: columnWidth,
  },
  {
    key: 'AvalGPU',
    name: 'Avaliable GPU',
    fieldName: 'avalGPU',
    // minWidth: columnWidth,
  },
  {
    key: 'status',
    name: 'Status',
    fieldName: 'status',
    // minWidth: columnWidth,
  },
  {
    key: 'services',
    name: 'Services',
    isResizable: true,
    onRender: (nodeStatistics) => {
      const content = nodeStatistics.services.map((service, index) => {
        return (
          <Text key={index}>{service}</Text>
        );
      });
      return (
        <Stack>
          {content}
        </Stack>
      );
    },
    // minWidth: columnWidth,
  },
  {
    key: 'tasks',
    name: 'Tasks',
    isResizable: true,
    onRender: (nodeStatistics) => {
      const content = nodeStatistics.gpuStatistics.map(
        (jobGpuStatistics, index) => {
          let fontColor;
          if (jobGpuStatistics.gpuUsage < 5) {
            fontColor = 'red';
          }
          return (
            <Text key={index} styles={{root: {color: fontColor}}}>{`[${
              jobGpuStatistics.job_name
            }](gpu usage: ${jobGpuStatistics.gpuUsage}%)(gpu: #${
              jobGpuStatistics.gpuIndex
            })`}</Text>
          );
        }
      );
      return (
      <Stack>
        {content}
      </Stack>);
    },
    minWidth: 500,
  },
];

const NodeStatus = () => {
  const [value, setValue] = useState([]);

  useEffect(() => {
    Promise.all([
      getNodesHealthInfo(),
      getAllAvailableNodesName(),
      getNodeAvailableGpu(),
      getNodeTotalGpu(),
      getNodeServices(),
      getNodeJobGPUStatistics()]
    )
      .then((values) => {
        const nodeHealthInfo = values[0];
        const avaliableNodoName = values[1];
        const nodeAvaliableGpu = values[2];
        const nodeTotalGpu = values[3];
        const nodeServices = values[4];
        const nodeJobGPUStatistics = values[5];

        const nodeStatistics = Object.keys(nodeHealthInfo).map((nodeKey) => {
          const gpuCap = get(nodeTotalGpu, `${nodeKey}.totalGpu`);
          const avalGPU = get(nodeAvaliableGpu, `${nodeKey}.availableGpu`);
          const usedGpu = !isNil(gpuCap) && !isNil(avalGPU)? gpuCap - avalGPU: '';

          return {
            nodeName: get(avaliableNodoName, `${nodeKey}.nodeName`, ''),
            key: nodeKey,
            nodeIP: nodeHealthInfo[nodeKey].ip,
            status: nodeHealthInfo[nodeKey].unschedulable == 'false' ? 'OK' : 'unschedulable',
            gpuCap: get(nodeTotalGpu, `${nodeKey}.totalGpu`, ''),
            avalGPU: get(nodeAvaliableGpu, `${nodeKey}.availableGpu`, ''),
            usedGPU: usedGpu,
            services: get(nodeServices, `${nodeKey}.services`, []),
            gpuStatistics: get(nodeJobGPUStatistics, `${nodeKey}`, []),
          };
        });
        setValue(nodeStatistics);
      })
      .catch(alert);
  }, []);

  return (
    <Fabric style={{height: '100%'}}>
      <Stack gap='m' verticalFill>
        <Stack.Item>
          <Text variant='xLarge'>{'Node Status:'}</Text>
        </Stack.Item>
        <Stack.Item grow styles={{root: {height: 0, overflow: 'auto', backgroundColor: 'white', padding: 'm'}}}>
          <DetailsList
            items={value}
            columns={columns}
            // getKey={getKey}
            checkboxVisibility={CheckboxVisibility.hidden}
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selectionMode={SelectionMode.none}
          />
        </Stack.Item>
      </Stack>
    </Fabric>
  );
};

ReactDOM.render(<NodeStatus/>, contentWrapper);

document.getElementById('sidebar-menu--cluster-view').classList.add('active');
document.getElementById('sidebar-menu--cluster-view--node-status').classList.add('active');

function layout() {
  setTimeout(function() {
    contentWrapper.style.height = contentWrapper.style.minHeight;
  }, 10);
}

window.addEventListener('resize', layout);
window.addEventListener('load', layout);

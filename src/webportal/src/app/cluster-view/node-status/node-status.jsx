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
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {getNodeList, getNodesHealthInfo, getNodeServices, getNodeJobGPUStatistics} from './conn';

const contentWrapper = document.getElementById('content-wrapper');

const columns = [
  {
    key: 'nodeName',
    name: 'Node Name',
    fieldName: 'nodeName',
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
    fieldName: 'AvalGPU',
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
    fieldName: 'services',
    // minWidth: columnWidth,
  },
  {
    key: 'pods',
    name: 'Pods',
    fieldName: 'pods',
    // minWidth: columnWidth,
  },
];

const value = [
  {key: '1', name: 'name', value: 'value'},
  {key: '2', name: 'name', value: 'value'},
];

const NodeStatus = () => {
  useEffect(() => {
    getNodeJobGPUStatistics()
      .then((nodeList) => {
        console.log(nodeList);
      })
      .catch(alert);
  }, []);

  return (
    <Fabric>
      <Stack gap='m'>
        <Text variant='xLarge'>{'Node Status:'}</Text>
        <DetailsList
          items={value}
          columns={columns}
          // getKey={getKey}
          checkboxVisibility={CheckboxVisibility.hidden}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
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

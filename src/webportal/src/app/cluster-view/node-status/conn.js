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

import config from '../../config/webportal.config';
import {get, isNil} from 'lodash';

const username = cookies.get('user');
const token = cookies.get('token');

const prometheusUri = config.prometheusUri;

const getHostname = (host) => host.split(':', 1)[0];
const getInstanceName = (hostIP) => hostIP + '9102';

const metricReducer = (accumulator, currentValue) => {
  accumulator[currentValue.key] = currentValue;
  return accumulator;
};

export async function getNodesHealthInfo() {
  const res = await fetch(
    `${prometheusUri}/api/v1/query?query=pai_node_count`
  );

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    const nodeHealth = results
      .map((result) => {
        return {
          key: result.metric.name,
          ip: result.metric.name,
          ready: result.metric.ready,
          unschedulable: result.metric.unschedulable,
        };
      })
      .reduce(metricReducer, {});
    return nodeHealth;
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

export async function getAllAvailableNodesName() {
  const res = await fetch(
    `${prometheusUri}/api/v1/query?query=node_uname_info`
  );

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    return results.map((result) => {
      return {
        key: getHostname(result.metric.instance),
        instance: result.metric.instance,
        nodeIP: getHostname(result.metric.instance),
        nodeName: result.metric.nodename,
      };
    }).reduce(metricReducer, {});
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

export async function getAvailableGpuPerNode() {
  const res = await fetch(`${prometheusUri}/api/v1/query?query=yarn_node_gpu_available`);

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    return results.map((result) => {
      return {
        key: result.metric.node_ip,
        totolGpu: parseInt(result.value[1]),
      };
    }).reduce(metricReducer, {});
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

export async function getTotalGpuPerNode() {
  const res = await fetch(`${prometheusUri}/api/v1/query?query=yarn_node_gpu_total`);

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    return results.map((result) => {
      return {
        key: result.metric.node_ip,
        totolGpu: parseInt(result.value[1]),
      };
    }).reduce(metricReducer, {});
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

export async function getNodeServices() {
  const res = await fetch(`${prometheusUri}/api/v1/query?query=service_cpu_percent`);

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    return results
      .map((result) => {
        return {
          key: getHostname(result.metric.instance),
          serviceName: result.metric.name,
        };
      })
      .reduce((accumulator, currentValue) => {
        const obj = accumulator[currentValue.key];
        if (isNil(obj)) {
          accumulator[currentValue.key] = {
            key: currentValue.key,
            services: [currentValue.serviceName],
          };
        } else {
          obj['services'].push(currentValue.serviceName);
        }
        return accumulator;
      }, {});
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

export async function getNodeJobGPUStatistics() {
  const res = await fetch(`${prometheusUri}/api/v1/query?query=task_gpu_percent`);

  if (res.ok) {
    const json = await res.json();
    const results = get(json, 'data.result', []);
    return results
      .map((result) => {
        return {
          key: getHostname(result.metric.instance),
          job_name: result.metric.job_name,
          gpuIndex: result.metric.minor_number,
          roleName: result.metric.role_name,
          gpuUsage: parseInt(result.value[1]),
        };
      })
      .reduce((accumulator, currentValue) => {
        const obj = accumulator[currentValue.key];
        if (isNil(obj)) {
          accumulator[currentValue.key] = [
            currentValue,
          ];
        } else {
          obj.push(currentValue);
        }
        return accumulator;
      }, {});
  } else {
    const json = await res.json();
    throw new Error(json.error);
  }
}

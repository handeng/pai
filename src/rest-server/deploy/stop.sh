#!/bin/bash

# Copyright (c) Microsoft Corporation
# All rights reserved.
#
# MIT License
#
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
# documentation files (the "Software"), to deal in the Software without restriction, including without limitation
# the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
# to permit persons to whom the Software is furnished to do so, subject to the following conditions:
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

pushd $(dirname "$0") > /dev/null

if kubectl get daemonset | grep -q "rest-server-ds"; then
    kubectl delete ds rest-server-ds || exit $?
fi

if kubectl get configmap | grep -q "auth-configuration"; then
    kubectl delete configmap auth-configuration || exit $?
fi

if kubectl get configmap | grep -q "job-exit-spec-configuration"; then
    kubectl delete configmap job-exit-spec-configuration || exit $?
fi

if kubectl get configmap | grep -q "group-configuration"; then
    kubectl delete configmap group-configuration || exit $?
fi

if kubectl get ClusterRoleBinding | grep "rest-server-openpai"; then
    kubectl delete ClusterRoleBinding rest-server-openpai || exit $?
fi

if kubectl get ClusterRoleBinding | grep "rest-server-openpai-edit"; then
    kubectl delete ClusterRoleBinding rest-server-openpai-edit || exit $?
fi

if kubectl get ClusterRole | grep "rest-server-openpai"; then
    kubectl delete ClusterRole rest-server-openpai || exit $?
fi

if kubectl get ServiceAccount | grep "rest-server-openpai"; then
    kubectl delete ServiceAccount rest-server-openpai || exit $?
fi

popd > /dev/null

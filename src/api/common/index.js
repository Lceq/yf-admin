/*
*公共接口 */
/* 命名规则： 以get开头，request结尾 */

import { proxy } from '../../ajax/http';
// 工序列表接口(已审核、启用)
const getProcessListRequest = function () {
    return proxy.call('process.list', {
        auditState: 3,
        state: 1
    });
};

export {
    getProcessListRequest
};

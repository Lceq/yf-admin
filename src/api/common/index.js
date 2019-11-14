/*
*公共接口 */
/* 命名规则： 以request结尾 */

import { proxy } from '../../ajax/http';

export default {
    // 工序列表接口(已审核、启用)
    usableProcessListRequest () {
        return proxy.call('process.list', {
            auditState: 3,
            state: 1
        });
    }
};

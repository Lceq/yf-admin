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
    },
    // 登录人的信息
    userInfoRequest () {
        return proxy.call('user.info');
    },
    // 登录人默认车间及车间列表
    userWorkshopRequest () {
        return proxy.call('user.data.workshops2');
    },
    // 登录人默认工序及工序列表
    userDefaultProcessRequest () {
        return proxy.call('user.defaultProcess');
    },
    // 判断是否自动生成, 如: 是否自动生成物料编号
    paraListRequest (params) {
        return proxy.call('para.list', params);
    }
};

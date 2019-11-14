import {post, fetch, proxy} from '../../ajax/http';
// 人员信息
export default {
    getUserList (params) {
        return post('user/list', params);
    },
    // 获取登陆人员
    getUserInfo (params) {
        return post('user/info', params);
    },
    // 获取看台人员
    getUserMachineList (params) {
        return post('user/machine/list', params);
    },
    listHttp (params) {
        return post('user/search', params);
    },
    hrGroupList (params) {
        return proxy.call('hr.group.list', params);
    },
    // 班组管理-删除
    groupDeleteRequest (params) {
        return proxy.call('group.delete', params);
    },
    groupSaveRequest (params) {
        return proxy.call('group.save', params);
    },
    groupListRequest (params) {
        return proxy.call('group.list', params);
    },
    groupDetailRequest (params) {
        return proxy.call('group.detail', params);
    },
    // 添加员工
    userSaveRequest (params) {
        return proxy.call('user.save', params);
    },
    userListRequest (params) {
        return proxy.call('user.list', params);
    },
    // user同步list
    hrUserListRequest (params) {
        return proxy.call('hr.user.list', params);
    },
    hrUserStateCountRequest (params) {
        return proxy.call('hr.user.stateCount', params);
    },
    userSearchRequest (params) {
        return proxy.call('user.search', params);
    }
};

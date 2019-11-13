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
    }
};
const userSearchRequest = function (params) {
    return proxy.call('user.search', params);
};
export {
    userSearchRequest
};

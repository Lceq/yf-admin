import { post, fetch } from '../../ajax/http';

export default {
    // 获取列表
    listHttp (params) {
        return post('parts/replace/order/list', params);
    },
    // 新增
    saveHttp (params) {
        return post('parts/replace/order/save', params);
    },
    // 获取详情
    detailHttp (params) {
        return post('parts/replace/order/detail/id', params);
    },
    // 获取左侧菜单
    menuList (params) {
        return post('parts/replace/order/stateCount', params);
    },
    billSourceHttp () {
        return fetch('enum//bill/source/state');
    },
    // 提交的请求
    submitHttp (params) {
        return post('parts/replace/order/submit', params);
    },
    // 撤销的请求
    cancelHttp (params) {
        return post('parts/replace/order/cancel', params);
    },
    // 审核的请求
    approveHttp (params) {
        return post('parts/replace/order/approve', params);
    },
    // 反审核的请求
    unApproveHttp (params) {
        return post('parts/replace/order/unapprove', params);
    },
    // 获取保养的配件单列表
    upkeepPartsList (params) {
        return post('parts/replace/order/listBySourceCode', params);
    },
    // 反审核的请求
    deleteHttp (params) {
        return post('parts/replace/order/delete', params);
    }

};

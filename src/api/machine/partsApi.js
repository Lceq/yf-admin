import { post, fetch, proxy } from '../../ajax/http';

export default {
    // 获取列表
    listHttp (params) {
        return proxy.call('parts.replace.order.list', params);
    },
    // 新增
    saveHttp (params) {
        return proxy.call('parts.replace.order.save', params);
    },
    // 获取详情
    detailHttp (params) {
        return proxy.call('parts.replace.order.detail.id', params);
    },
    // 获取左侧菜单
    menuList (params) {
        return proxy.call('parts.replace.order.stateCount', params);
    },
    billSourceHttp () {
        return proxy.call('enum.bill.source.state');
    },
    // 提交的请求
    submitHttp (params) {
        return proxy.call('parts.replace.order.submit', params);
    },
    // 撤销的请求
    cancelHttp (params) {
        return proxy.call('parts.replace.order.cancel', params);
    },
    // 审核的请求
    approveHttp (params) {
        return proxy.call('parts.replace.order.approve', params);
    },
    // 反审核的请求
    unApproveHttp (params) {
        return proxy.call('parts.replace.order.unapprove', params);
    },
    // 获取保养的配件单列表
    upkeepPartsList (params) {
        return proxy.call('parts.replace.order.listBySourceCode', params);
    },
    // 反审核的请求
    deleteHttp (params) {
        return proxy.call('parts.replace.order.delete', params);
    }

};

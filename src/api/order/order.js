import { fetch, post, proxy } from '../../ajax/http';
// 生产订单
export default({
    saveHttp (params) {
        return proxy.call('prd.order.save', params);
    },
    stagingHttp (params) {
        return post('prd/order/save?staging=true', params);
    },
    detailHttp (params) {
        return proxy.call('prd.order.detail', params);
    },
    listHttp (params) {
        return proxy.call('prd.order.list', params);
    },
    submitHttp (params) {
        return proxy.call('prd.order.submit', params);
    },
    cancelHttp (params) {
        return proxy.call('prd.order.cancel', params);
    },
    approveHttp (params) {
        return proxy.call('prd.order.approve', params);
    },
    unapproveHttp (params) {
        return proxy.call('prd.order.unapprove', params);
    },
    closeHttp (params) {
        return proxy.call('prd.order.close', params);
    },
    uncloseHttp (params) {
        return proxy.call('prd.order.unclose', params);
    },
    deleteHttp (params) {
        return proxy.call('prd.order.delete', params);
    },
    auditStateListHttp (params) {
        return proxy.call('enum.audit.state', params);
    },
    leftMenuListHttp (params) {
        return proxy.call('prd.order.stateCount', params);
    },
    erpOrderClosedRequest (params) {
        return proxy.call('erp.order.closed', params);
    },
    erpOrderUnClosedRequest (params) {
        return proxy.call('erp.order.unClosed', params);
    }
});

import { fetch, post } from '../../ajax/http';
// 制造工单
export default({
    // 工艺检测状态
    processTestStateHttp (params) {
        return post('enum/processTestState', params);
    },
    // 开台状态
    openStateHttp (params) {
        return post('enum/openState', params);
    },
    leftMenuListHttp (params) {
        return post('prd/work/order/stateCount', params);
    }
    /* saveHttp (params) {
        return post('prd/order/save?staging=false', params);
    },
    stagingHttp (params) {
        return post('prd/order/save?staging=true', params);
    },
    detailHttp (params) {
        return post('prd/order/detail', params);
    },
    listHttp (params) {
        return post('prd/order/list', params);
    },
    submitHttp (params) {
        return post('prd/order/submit', params);
    },
    cancelHttp (params) {
        return post('prd/order/cancel', params);
    },
    approveHttp (params) {
        return post('prd/order/approve', params);
    },
    unapproveHttp (params) {
        return post('prd/order/unapprove', params);
    },
    closeHttp (params) {
        return post('prd/order/close', params);
    },
    uncloseHttp (params) {
        return post('prd/order/unclose', params);
    },
    deleteHttp (params) {
        return post('prd/order/delete', params);
    },
    auditStateListHttp (params) {
        return post('enum/audit/state', params);
    },
    leftMenuListHttp (params) {
        return post('prd/order/stateCount', params);
    } */
});

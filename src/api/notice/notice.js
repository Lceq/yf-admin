import { post, proxy } from '../../ajax/http';
// 工艺单
export default {
    listHttp (params) {
        return post('prd/notice/list', params);
    },
    saveHttp (params) {
        return post('prd/notice/save?staging=false', params);
    },
    submitHttp (params) {
        return post('prd/notice/submit', params);
    },
    stagingHttp (params) {
        return post('prd/notice/save?staging=true', params);
    },
    detailHttp (params) {
        return post('prd/notice/detail', params);
    },
    approveHttp (params) {
        return post('prd/notice/approve', params);
    },
    unapproveHttp (params) {
        return post('prd/notice/unapprove', params);
    },
    closeHttp (params) {
        return post('prd/notice/close', params);
    },
    uncloseHttp (params) {
        return post('prd/notice/unclose', params);
    },
    leftMenuListHttp (params) {
        return post('prd/notice/stateCount', params);
    },
    cancelHttp (params) {
        return post('prd/notice/cancel', params);
    },
    deleteHttp (params) {
        return post('prd/notice/delete', params);
    },
    prdBomProductDetail2Request (params) {
        return proxy.call('prd.bom.product.detail2', params);
    },
    workCenterMachineDrivingListRequest (params) {
        return proxy.call('work.center.machine.driving.list', params);
    }
};

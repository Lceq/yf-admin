import { post, proxy } from '../../ajax/http';
// 工艺单
export default {
    prdNoticeListRequest (params) {
        return proxy.call('prd.notice.list', params);
    },
    saveHttp (params) {
        return post('prd/notice/save?staging=false', params);
    },
    prdNoticeSubmitRequest (params) {
        return proxy.call('prd.notice.submit', params);
    },
    stagingHttp (params) {
        return post('prd/notice/save?staging=true', params);
    },
    prdNoticeDetailRequest (params) {
        return proxy.call('prd.notice.detail', params);
    },
    prdNoticeApproveRequest (params) {
        return proxy.call('prd.notice.approve', params);
    },
    prdNoticeUnapproveRequest (params) {
        return proxy.call('prd.notice.unapprove', params);
    },
    prdNoticeCloseRequest (params) {
        return proxy.call('prd.notice.close', params);
    },
    prdNoticeUncloseRequest (params) {
        return proxy.call('prd.notice.unclose', params);
    },
    prdNoticeStateCountRequest (params) {
        return proxy.call('prd.notice.stateCount', params);
    },
    prdNoticeCancelRequest (params) {
        return proxy.call('prd.notice.cancel', params);
    },
    prdNoticeDeleteRequest (params) {
        return proxy.call('prd.notice.delete', params);
    },
    prdBomProductDetail2Request (params) {
        return proxy.call('prd.bom.product.detail2', params);
    },
    workCenterMachineDrivingListRequest (params) {
        return proxy.call('work.center.machine.driving.list', params);
    },
    prdNoticeSaveRequest (params) {
        return proxy.call('prd.notice.save', params);
    },
    prdNoticeSpecDetailByNoticeIdRequest (params) {
        return proxy.call('prd.notice.spec.detailByNoticeId', params);
    },
    prdNoticeSpecSaveRequest (params) {
        return proxy.call('prd.notice.spec.save', params);
    }
};

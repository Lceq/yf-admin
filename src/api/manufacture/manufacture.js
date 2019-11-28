import { post, proxy } from '../../ajax/http';
// BOM
export default {
    // 标准bom接口
    bomSaveRequest (params) {
        return proxy.call('bom.save', params);
    },
    bomProcessPreviousStepRequest (params) {
        return proxy.call('bom.process.previousStep', params);
    },
    bomProcessSave (params) {
        return proxy.call('bom.process.save', params);
    },
    bomDeleteRequest (params) {
        return proxy.call('bom.delete', params);
    },
    bomCancelRequest (params) {
        return proxy.call('bom.cancel', params);
    },
    bomApproveRequest (params) {
        return proxy.call('bom.approve', params);
    },
    bomUnApproveRequest (params) {
        return proxy.call('bom.unapprove', params);
    },
    bomCloseRequest (params) {
        return proxy.call('bom.close', params);
    },
    bomUnCloseRequest (params) {
        return proxy.call('bom.unclose', params);
    },
    bomDetailRequest (params) {
        return proxy.call('bom.detail', params);
    },
    bomSubmitRequest (params) {
        return proxy.call('bom.submit', params);
    },
    bomUnapproveRequest (params) {
        return proxy.call('bom.unapprove', params);
    },

    // 制造bom接口
    listHttp (params) {
        return post('prd/bom/list', params);
    },
    saveHttp (params) {
        return post('prd/bom/save', params);
    },
    saveBomChild (params) {
        return post('prd/bom/process/save', params);
    },
    leftMenuListHttp (params) {
        return post('prd/bom/stateCount', params);
    },
    unapproveHttp (params) {
        return post('prd/bom/unapprove', params);
    },
    approveHttp (params) {
        return post('prd/bom/approve', params);
    },
    submitHttp (params) {
        return post('prd/bom/submit', params);
    },
    cancelHttp (params) {
        return post('prd/bom/cancel', params);
    },
    closeHttp (params) {
        return post('prd/bom/close', params);
    },
    uncloseHttp (params) {
        return post('prd/bom/unclose', params);
    },
    deleteHttp (params) {
        return post('prd/bom/delete', params);
    },
    bomDetailHttp (params) {
        return post('prd/bom/detail', params);
    },
    bomProcessDetailHttp (params) {
        return post('prd/bom/process/detail', params);
    },
    previousStepDetailHttp (params) {
        return post('prd/bom/process/previousStep', params);
    }
};

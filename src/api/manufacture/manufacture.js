import { post, fetch } from '../../ajax/http';
// 制造BOM
export default {
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

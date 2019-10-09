import { post, fetch } from '../../ajax/http';

// 供应商
export default {
    listHttp (params) {
        return post('supplier/list', params);
    },
    auditStateHttp (params) {
        return post('enum/audit/state3', params);
    },
    saveHttp (params) {
        return post('supplier/save', params);
    },
    detailHttp (params) {
        return post('supplier/detail', params);
    },
    cancelHttp (params) {
        return post('supplier/cancel', params);
    },
    approveHttp (params) {
        return post('supplier/approve', params);
    },
    deleteHttp (params) {
        return post('supplier/delete', params);
    }
};

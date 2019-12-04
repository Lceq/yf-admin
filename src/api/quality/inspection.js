import {post, proxy} from '../../ajax/http';

export default {
    getQmInspectionList (params) {
        return post('qm/inspection/list', params);
    },
    getQmInspectionSave (params) {
        return proxy.call('qm.inspection.save', params);
    },
    getQmInspectionDetail (params) {
        return post('qm/inspection/detail', params);
    },
    getQmInspectionSubmit (params) {
        return post('qm/inspection/submit', params);
    },
    getQmInspectionCancel (params) {
        return post('qm/inspection/cancel', params);
    },
    deleteQmInspection (params) {
        return post('qm/inspection/delete', params);
    }
};

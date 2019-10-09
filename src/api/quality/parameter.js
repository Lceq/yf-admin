import {post} from '../../ajax/http';

export default {
    getQmParamList (params) {
        return post('/qm/param/list', params);
    },
    getQmParamSave (params) {
        return post('/qm/param/save', params);
    },
    getQmParamDetail (params) {
        return post('/qm/param/detail', params);
    },
    getQmParamApprove (params) {
        return post('/qm/param/approve', params);
    },
    getQmParamUnApprove (params) {
        return post('/qm/param/unapprove', params);
    },
    deleteQmParam (params) {
        return post('/qm/param/delete', params);
    }
};

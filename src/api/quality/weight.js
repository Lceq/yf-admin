import {post} from '../../ajax/http';

export default {
    getQmWeightList (params) {
        return post('/qm/weight/list', params);
    },
    getQmWeightSave (params) {
        return post('/qm/weight/save', params);
    },
    getQmWeightDetail (params) {
        return post('/qm/weight/detail', params);
    },
    getQmWeightSubmit (params) {
        return post('/qm/weight/submit', params);
    },
    getQmWeightCancel (params) {
        return post('/qm/weight/cancel', params);
    },
    deleteQmWeight (params) {
        return post('/qm/weight/delete', params);
    }
};

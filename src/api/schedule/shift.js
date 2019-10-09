import { post } from '../../ajax/http';
// 工艺路线
export default {
    getShiftList (params) {
        return post('shift/list', params);
    },
    getShiftDetail (params) {
        return post('shift/detail', params);
    },
    getShiftApprove (params) {
        return post('shift/approve', params);
    },
    getShiftUnApprove (params) {
        return post('shift/unapprove', params);
    },
    getShiftDelete (params) {
        return post('shift/delete', params);
    }
};

import { post, fetch } from '../../ajax/http';
// 工艺路线
export default {
    listHttp (params) {
        return post('spec/path/list', params);
    },
    submitHttp (params) {
        return post('spec/path/submit', params);
    },
    cancelHttp (params) {
        return post('spec/path/cancel', params);
    },
    approveHttp (params) {
        return post('spec/path/approve', params);
    },
    unapproveHttp (params) {
        return post('spec/path/unapprove', params);
    },
    detailHttp (params) {
        return post('spec/path/detail', params);
    },
    saveHttp (params) {
        return post('spec/path/save', params);
    },
    deleteHttp (params) {
        return post('spec/path/delete', params);
    }
};

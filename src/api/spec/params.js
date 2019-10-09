import { post, fetch } from '../../ajax/http';
// 工艺参数
export default {
    // 工艺参数列表
    getSpecParamsList (params) {
        return post('spec/param/list', params);
    },
    getSpecParamsList2 (params) {
        return post('spec/param/list2', params);
    },
    getSpecParamsSave (params) {
        return post('spec/param/save', params);
    },
    getSpecParamsDetail (params) {
        return post('spec/param/detail', params);
    },
    getSpecParamsDelete (params) {
        return post('spec/param/delete', params);
    },
    getSpecParamsApprove (params) {
        return post('spec/param/approve', params);
    },
    getSpecParamsUnApprove (params) {
        return post('spec/param/unapprove', params);
    }
};

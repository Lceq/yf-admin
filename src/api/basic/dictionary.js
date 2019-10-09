import { fetch, post } from '../../ajax/http';
export default({
    // 获取存货类型
    getTubeColor () {
        return post('dict/list', {parentCode: 'tube_color'});
    },
    getTubeType () {
        return post('dict/list', {parentCode: 'tube_type'});
    },
    getStockType () {
        return post('dict/list', {parentCode: 'stock_type'});
    },
    // 获取质检类别
    getQmType () {
        return post('dict/list', {parentCode: 'qm_type'});
    },
    // 获取岗位类别
    getPostType () {
        return post('dict/list', {parentCode: 'post_type'});
    },
    // 获取工序类别
    getProcessType () {
        return post('dict/list', {parentCode: 'process_type'});
    },
    // 获取班制类别
    getShiftType () {
        return post('dict/list', {parentCode: 'shift_type'});
    },
    listHttp (params) {
        return post('dict/list', params);
    },
    // 获取纸管、纱管、筒圈
    tubeListHttp (params) {
        return post('dict/category/list/tube/color', params);
    }
});

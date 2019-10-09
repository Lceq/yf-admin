import { post, fetch } from '../../ajax/http';
// 物料分类
export default {
    // 物料分类列表
    listHttp (params) {
        return post('bom/list', params);
    },
    // 左侧菜单
    menuListHttp (params) {
        return post('bom/stateCount', params);
    },
    saveHttp (params) {
        return post('bom/save', params);
    },
    detailHttp (params) {
        return post('bom/detail', params);
    },
    submitHttp (params) {
        return post('bom/submit', params);
    },
    cancelHttp (params) {
        return post('bom/cancel', params);
    },
    approveHttp (params) {
        return post('bom/approve', params);
    },
    unapproveHttp (params) {
        return post('bom/unapprove', params);
    },
    disableHttp (params) {
        return post('bom/disable', params);
    },
    enableHttp (params) {
        return post('bom/enable', params);
    },
    deleteHttp (params) {
        return post('bom/delete', params);
    },
    productVersionHttp (params) {
        return post('bom/listByProductId', params);
    },
    versionChildMaterialHttp (params) {
        return post('bom/child/listByBomId', params);
    }
};

import { post } from '../../ajax/http';

export default {
    // 获取当前用户车间
    getUnitList (params) {
        return post(('unit/list'), params);
    },
    getUnitDetail (params) {
        return post(('unit/detail'), params);
    },
    getUnitSave (params) {
        return post(('unit/save'), params);
    },
    getUnitApprove (params) {
        return post(('unit/approve'), params);
    },
    getUnitUnApprove (params) {
        return post(('unit/unapprove'), params);
    },
    getUnitDelete (params) {
        return post(('unit/delete'), params);
    }
};

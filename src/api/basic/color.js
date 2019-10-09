import { post } from '../../ajax/http';

export default {
    // 获取当前用户车间
    getColorList (params) {
        return post(('color/list'), params);
    },
    getColorDetail (params) {
        return post(('color/detail'), params);
    },
    getColorSave (params) {
        return post(('color/save'), params);
    },
    getColorApprove (params) {
        return post(('color/approve'), params);
    },
    getColorUnApprove (params) {
        return post(('color/cancel'), params);
    },
    getColorDelete (params) {
        return post(('color/delete'), params);
    }
};

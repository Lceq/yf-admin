import { post } from '../../ajax/http';

export default {
    // 获取当前用户车间
    getParaList (params) {
        return post(('para/list'), params);
    },
    getParaValueList (params) {
        return post(('para/value/list'), params);
    },
    getParaSave (params) {
        return post(('para/save'), params);
    }
};

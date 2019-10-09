import { post } from '../../ajax/http';

export default {
    // 获取当前用户车间
    getServiceList (params) {
        return post(('service/list'), params);
    },
    getServiceHostList (params) {
        return post(('service/host/list'), params);
    },
    getServiceSave (params) {
        return post(('service/save'), params);
    },
    getServiceDelete (params) {
        return post(('service/delete'), params);
    },
    getServiceDetail (params) {
        return post(('service/detail'), params);
    }
};

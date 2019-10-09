import { fetch } from '../../ajax/http';
export default {
    // 获取故障原因
    getFaultType (params) {
        return fetch(('fault/type/list'), params);
    }
};

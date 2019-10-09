import {fetch, post} from '../../ajax/http';
export default {
    // 获取机台
    getMachineList (params) {
        return post(('machine/list'), params);
    }
};

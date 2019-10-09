import {fetch, post} from '../../ajax/http';
export default {
    // 获取机台
    getMachineOpenList (params) {
        return post(('machine/open/list'), params);
    },
    getMachineOpenDetail (params) {
        return post(('machine/open/detail'), params);
    },
    getMachineOpenDetail2 (params) {
        return post(('machine/open/detail2'), params);
    }
};

import { post, fetch } from '../../ajax/http';
// 设备机型
export default {
    listHttp (params) {
        return post('model/list', params);
    },
    getModelList2 (params) {
        return post('model/list2', params);
    }

};

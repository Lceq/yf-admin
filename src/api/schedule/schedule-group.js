import {post} from '../../ajax/http';

export default {
    getScheduleGroupList (params) {
        return post('schedule/group/list', params);
    }
};

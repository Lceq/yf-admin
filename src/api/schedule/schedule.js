import { post } from '../../ajax/http';
// 工艺路线
export default {
    getScheduleList (params) {
        return post('schedule/list', params);
    },
    getScheduleList2 (params) {
        return post('schedule/list2', params);
    },
    getScheduleSave (params) {
        return post('schedule/save', params);
    },
    getScheduleCurrentSchedule (params) {
        return post('schedule/current/schedule', params);
    },
    getScheduleAllocateMachineList (params) {
        return post('schedule/allocate/machine/list', params);
    }
};

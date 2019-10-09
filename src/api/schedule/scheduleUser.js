import {post} from '../../ajax/http';

export default {
    getScheduleUserList (params) {
        return post('schedule/user/list', params);
    },
    // 添加员工
    getScheduleUserAdd (params) {
        return post('schedule/user/add', params);
    },
    // 更新员工岗位
    getScheduleUserPostUpdate (params) {
        return post('schedule/user/post/update', params);
    },
    // 移除员工
    getScheduleUserRemove (params) {
        return post('schedule/user/remove', params);
    },
    // 当前班组人员机台信息
    getScheduleUserListMachine (params) {
        return post('schedule/user/list/machine', params);
    },
    // 当前员工-岗位分配的机台
    getScheduleUserList2 (params) {
        return post('schedule/user/machine/list2', params);
    },
    // 当前员工所在工序内的分配的机台
    getScheduleUserList3 (params) {
        return post('schedule/user/machine/list3', params);
    },
    // 保存机台分配
    getScheduleUserMachineSave (params) {
        return post('schedule/user/machine/save', params);
    }
};

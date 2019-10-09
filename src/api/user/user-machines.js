import { post } from '../../ajax/http';
// 人员信息
export default {
    // 获取看台人员
    getUserMachineList (params) {
        return post('user/machine/list', params);
    },
    // 查询当前人分配的机台
    getUserMachineList2 (params) {
        return post('user/machine/list2', params);
    },
    // 查询除当前人分配的机台以外已经分配的机台
    getUserMachineList3 (params) {
        return post('user/machine/list3', params);
    },
    // 查询除当前人分配的机台以外已经分配的机台
    getUserMachineSave (params) {
        return post('user/machine/save', params);
    }
};

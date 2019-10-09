import {post} from '../../ajax/http';
export default {
    // 工作中心列表
    getWorkCenterList (params) {
        return post('work/center/list', params);
    },
    // 工作中心详情
    getWorkCenterDetail (params) {
        return post('work/center/detail', params);
    },
    // 保存
    getWorkCenterSave (params) {
        return post('work/center/save', params);
    },
    // 审核
    approveWorkCenter (params) {
        return post('work/center/approve', params);
    },
    // 反审核
    unApproveWorkCenter (params) {
        return post('work/center/unapprove', params);
    },
    // 禁用
    disableWorkCenter (params) {
        return post('work/center/disable', params);
    },
    // 取消禁用
    enableWorkCenter (params) {
        return post('work/center/enable', params);
    },
    // 删除
    deleteWorkCenter (params) {
        return post('work/center/delete', params);
    },
    // 获取所有已经分配的机台
    getWorkCenterMachineList (params) {
        return post('work/center/machine/list', params);
    }
};

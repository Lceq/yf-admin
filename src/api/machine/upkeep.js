import { post, fetch } from '../../ajax/http';

export default {
    // 获取保养计划列表
    planListHttp (params) {
        return post('maintenance/plan/list', params);
    },
    // 获取设备保养单详情
    upkeepCodeDetailHttp (params) {
        return post('maintenance/order/detail/id', params);
    },
    // 获取保养计划的单据状态
    planCodeStateHttp () {
        return fetch('enum/maintenance/audit/state');
    },
    // 获取保养计划单中设备的保养状态
    planCodeUpkeepStateHttp () {
        return fetch('enum/maintenance/machine/state');
    },
    // 保养计划单的删除
    planCodeDeleteHttp (params) {
        return post('maintenance/plan/associated/delete', params);
    },
    // 保养计划单的提交
    planCodeSubmitHttp (params) {
        return post('maintenance/plan/submit', params);
    },
    // 保养计划单的撤销
    planCodeCancelHttp (params) {
        return post('maintenance/plan/cancel', params);
    },
    // 保养计划单的关闭
    planCodeCloseHttp (params) {
        return post('maintenance/plan/close', params);
    },
    // 保养计划单的反关闭
    planCodeUnCloseHttp (params) {
        return post('maintenance/plan/unclose', params);
    },
    // 保养计划单的审核
    planCodeApproveHttp (params) {
        return post('maintenance/plan/approve', params);
    },
    // 保养计划单的反审核
    planCodeUnApproveHttp (params) {
        return post('maintenance/plan/unapprove', params);
    },
    // 保养计划单的新增和保存
    planCodeSaveHttp (params) {
        return post('maintenance/plan/save', params);
    },
    // 保养类型列表
    upkeepTypeListHttp () {
        return fetch('maintenance/type/list');
    },
    // 保养机台列表
    upkeepMachineListHttp () {
        return fetch('machine/maintenance/repair/list');
    },
    // 保养计划详情
    planCodeDetailHttp (params) {
        return fetch('maintenance/plan/detail/' + params);
    },
    // 保养明细的列表
    upkeepScheduleListHttp (params) {
        return fetch('maintenance/plan/detail/list', params);
    },
    // 保养明细的开始保养
    upkeepScheduleBeginHttp (params) {
        return post('maintenance/order/begin/save', params);
    },
    // 保养明细的计划单和设备的详情
    upkeepScheduleMachineHttp (params) {
        return post('maintenance/plan/detail/order/id', params);
    },
    // 设备保养单的列表
    machineUpkeepCodeListHttp (params) {
        return fetch('maintenance/order/list', params);
    },
    // 设备保养单的保养状态
    machineUpkeepCodeStateHttp () {
        return fetch('enum/machine/maintenance/audit/state');
    },
    // 设备保养单的结束保养
    machineUpkeepCodeEndHttp (params) {
        return post('maintenance/order/end/save', params);
    },
    // 设备保养单的编辑
    machineUpkeepCodeEditHttp (params) {
        return post('maintenance/order/edit/save', params);
    },
    // 设备保养单的反关闭
    machineUpkeepCodeUncloseHttp (params) {
        return post('maintenance/order/cancel', params);
    },
    // 设备保养单的关闭
    machineUpkeepCodeCloseHttp (params) {
        return post('maintenance/order/close', params);
    },
    // 设备保养单的删除
    machineUpkeepCodeDeleteHttp (params) {
        return post('maintenance/order/delete/id', params);
    },
    // 保养项目的删除
    upkeepItemDeleteHttp (params) {
        return post('maintenance/item/delete', params);
    },
    // 保养项目的详情
    upkeepItemDetailHttp (params) {
        return fetch('maintenance/item/detail/' + params);
    },
    // 保养项目的保存
    upkeepItemSaveHttp (params) {
        return post('maintenance/item/save', params);
    },
    // 保养项目的列表
    upkeepItemListHttp (params) {
        return fetch('maintenance/item/list', params);
    }

};

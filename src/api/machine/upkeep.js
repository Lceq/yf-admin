import { proxy } from '../../ajax/http';

export default {
    // 获取保养计划列表
    planListHttp (params) {
        return proxy.call('maintenance.plan.list', params);
    },
    // 获取设备保养单详情
    upkeepCodeDetailHttp (params) {
        return proxy.call('maintenance.order.detail.id', params);
    },
    // 获取保养计划的单据状态
    planCodeStateHttp () {
        return proxy.call('enum.maintenance.audit.state');
    },
    // 获取保养计划单中设备的保养状态
    planCodeUpkeepStateHttp () {
        return proxy.call('enum.maintenance.machine.state');
    },
    // 保养计划单的删除
    planCodeDeleteHttp (params) {
        return proxy.call('maintenance.plan.associated.delete', params);
    },
    // 保养计划单的提交
    planCodeSubmitHttp (params) {
        return proxy.call('maintenance.plan.submit', params);
    },
    // 保养计划单的撤销
    planCodeCancelHttp (params) {
        return proxy.call('maintenance.plan.cancel', params);
    },
    // 保养计划单的关闭
    planCodeCloseHttp (params) {
        return proxy.call('maintenance.plan.close', params);
    },
    // 保养计划单的反关闭
    planCodeUnCloseHttp (params) {
        return proxy.call('maintenance.plan.unclose', params);
    },
    // 保养计划单的审核
    planCodeApproveHttp (params) {
        return proxy.call('maintenance.plan.approve', params);
    },
    // 保养计划单的反审核
    planCodeUnApproveHttp (params) {
        return proxy.call('maintenance.plan.unapprove', params);
    },
    // 保养计划单的新增和保存
    planCodeSaveHttp (params) {
        return proxy.call('maintenance.plan.save', params);
    },
    // 保养机台列表
    upkeepMachineListHttp () {
        return proxy.call('machine.maintenance.repair.list');
    },
    // 保养计划详情
    planCodeDetailHttp (params) {
        return proxy.call('maintenance.plan.detail' + params);
    },
    // 保养明细的列表
    upkeepScheduleListHttp (params) {
        return proxy.call('maintenance.plan.detail.list', params);
    },
    // 保养明细的开始保养
    upkeepScheduleBeginHttp (params) {
        return proxy.call('maintenance.order.begin.save', params);
    },
    // 保养明细的计划单和设备的详情
    upkeepScheduleMachineHttp (params) {
        return proxy.call('maintenance.plan.detail.order.id', params);
    },
    // 设备保养单的列表
    machineUpkeepCodeListHttp (params) {
        return proxy.call('maintenance.order.list', params);
    },
    // 设备保养单的保养状态
    machineUpkeepCodeStateHttp () {
        return proxy.call('enum.machine.maintenance.audit.state');
    },
    // 设备保养单的结束保养
    machineUpkeepCodeEndHttp (params) {
        return proxy.call('maintenance.order.end.save', params);
    },
    // 设备保养单的编辑
    machineUpkeepCodeEditHttp (params) {
        return proxy.call('maintenance.order.edit.save', params);
    },
    // 设备保养单的反关闭
    machineUpkeepCodeUncloseHttp (params) {
        return proxy.call('maintenance.order.cancel', params);
    },
    // 设备保养单的关闭
    machineUpkeepCodeCloseHttp (params) {
        return proxy.call('maintenance.order.close', params);
    },
    // 设备保养单的删除
    machineUpkeepCodeDeleteHttp (params) {
        return proxy.call('maintenance.order.delete.id', params);
    },
    // 保养项目的删除
    upkeepItemDeleteHttp (params) {
        return proxy.call('maintenance.item.delete', params);
    },
    // 保养项目的详情
    upkeepItemDetailHttp (params) {
        return proxy.call('maintenance.item.detail', params);
    },
    // 保养项目的保存
    upkeepItemSaveHttp (params) {
        return proxy.call('maintenance.item.save', params);
    },
    // 保养项目的列表
    upkeepItemListHttp (params) {
        return proxy.call('maintenance.item.list', params);
    },
    // 保养类型保存
    upkeepTypeSaveHttp (params) {
        return proxy.call('maintenance.type.save', params);
    },
    upkeepTypeDetailHttp (params) {
        return proxy.call('maintenance.type.detail', params);
    },
    upkeepTypeDeleteHttp (params) {
        return proxy.call('maintenance.type.delete', params);
    },
    upkeepTypeListHttp (params) {
        return proxy.call('maintenance.type.list', params);
    }

};

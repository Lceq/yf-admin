import { post, proxy } from '../../ajax/http';
// 维修工单
export default {
    // 故障呼叫、维修工单的编辑接口
    getRepairOrderSave (params) {
        return proxy.call(('repair.order.save'), params);
    },
    // 获取维修状态
    getCompletionState (params) {
        return proxy.call(('repair.order.stateCount'), params);
    },
    // 获取维修列表
    getRepairOrderList (params) {
        return proxy.call(('repair.order.list'), params);
    },
    // 接单  || 维修完成
    getRepairOrderTake (params) {
        return proxy.call(('repair.order.take'), params);
    },
    // 获取维修工单详情
    getRepairOrderDetail (params) {
        return proxy.call(('repair.order.detail'), params);
    },
    // 取消呼叫
    getRepairCancel (params) {
        return proxy.call(('repair.order.cancel'), params);
    },
    // 已完成的维修工单的关闭反关闭
    getRepairClose (params) {
        return proxy.call(('repair.order.close'), params);
    }
};

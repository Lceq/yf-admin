import { post, fetch } from '../../ajax/http';
// 数据状态和禁用状态
export default {
    // 物料档案数据状态
    enumAuditState2List () {
        return post('enum/audit/state2');
    },
    // 物料档案禁用状态
    enumEnableStateList () {
        return post('enum/enable/state');
    }
};

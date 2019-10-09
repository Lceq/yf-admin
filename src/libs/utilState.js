// 维修工单----维修状态
export const completionState = [
    {
        id: 0,
        name: '未接单'
    },
    {
        id: 1,
        name: '维修中'
    },
    {
        id: 2,
        name: '已完成'
    }
];
// 数据状态
// 工作中心、
export const auditStateList = [
    {
        id: 1,
        name: '创建'
    },
    {
        id: 3,
        name: '已审核'
    }
];
// 禁用状态
// 工作中心、
export const enableStateList = [
    {
        id: 1,
        name: '启用'
    },
    {
        id: 0,
        name: '禁用'
    }
];
// 启用状态
// 质量指标参数 // 条干检验 --- 是否保存
export const enableState = [
    {
        id: 1,
        name: '是'
    },
    {
        id: 0,
        name: '否'
    }
];
// -------------数据状态
// 质量指标参数
export const dataTypeStateList = [
    {
        id: 1,
        name: '数值型'
    },
    {
        id: 2,
        name: '字符型'
    }
];
// 参数类型 ---- 工艺参数
export const paramsTypeList = [
    {
        id: 1,
        name: '设备工艺'
    },
    {
        id: 2,
        name: '运转工艺'
    }
];
// -- 工序参数（是否业务参数）
export const paramsStateList = [
    {
        type: true,
        name: '是'
    },
    {
        type: false,
        name: '否'
    }
];
// 检验类型
// -- （重量质检）
export const checkoutTypeList = [
    {
        id: 1,
        name: '初试'
    },
    {
        id: 2,
        name: '复试'
    }
];
// --保存--提交的状态
// ---- （重量质检）
export const submissionTypeList = [
    {
        id: 1,
        name: '保存'
    },
    {
        id: 2,
        name: '已提交'
    }
];
/**
 * 保存-提交-审核-关闭的几个状态
 * as
 */

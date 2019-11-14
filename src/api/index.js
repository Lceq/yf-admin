// 基础资料
import dept from './basic/dept'; // 车间
import process from './basic/process.js';// 工序
import dictionary from './basic/dictionary.js';// 工序
import color from './basic/color.js';// 颜色
import unit from './basic/unit.js';// 计量单位
import para from './basic/para.js';// 计量单位
import service from './basic/service.js';// 计量单位
// 人员
import user from './user/user.js';// 人员
import userMachine from './user/user-machines.js';// 人员
import post from './user/post.js';// 岗位
import machine from './machine/machine'; // 设备
import machineOpen from './machine/machine-open'; // 设备
import repair from './machine/repair.js'; // 维修工单
import fault from './machine/fault.js'; // 故障原因
import parts from './machine/partsApi'; // 配件更换
import upkeep from './machine/upkeep'; // 保养
import workCenter from './machine/workCenter'; // 工作中心
import model from './machine/model'; // 设备机型
// 物料
import product from './product/product'; // 物料
import category from './product/category'; // 物料分类
import attr from './product/attr'; // 物料属性
import bom from './product/bom'; // 物料清单
import supplier from './product/supplier';
// 质量
import parameter from './quality/parameter';// 指标参数
import quota from './quality/quota'; // 质量指标
import weight from './quality/weight';// 重量质检
import inspection from './quality/inspection';// 条干质检
import specParams from './spec/params'; // 工艺
import path from './spec/path';
import specSheet from './spec/specSheet';
import order from './order/order'; // 生产订单
import notice from './notice/notice'; // 通知单
// 排班
import shift from './schedule/shift'; // 班制
import schedule from './schedule/schedule'; // 排班
import scheduleUser from './schedule/scheduleUser'; // 班制人员
import scheduleGroup from './schedule/schedule-group'; // 班组
import workOrder from './work-order/workOrder'; // 制造工单
import production from './schedule/production'; // 值班
// 数据状态
import state from './state/state';
import manufacture from './manufacture/manufacture';
// 通用api
import common from './common/index';
export default {
    // 通用
    common,
    // --------基础-------
    dept,
    process,
    dictionary,
    color,
    unit,
    para,
    service,
    // 员工管理
    user,
    post,
    userMachine,
    // --------设备 ------
    repair,
    fault,
    parts,
    upkeep,
    machine,
    machineOpen,
    workCenter,
    model,
    // --------物料----------
    product,
    category,
    attr,
    bom,
    supplier,
    // --------质量--------
    parameter,
    quota,
    weight,
    inspection,
    // 工艺
    specParams,
    path,
    specSheet,
    // 生产订单
    order,
    // 通知单
    notice,
    // 排班
    shift,
    schedule,
    scheduleUser,
    scheduleGroup,
    production,
    // 制造工单
    workOrder,
    state,
    // 制造BOM
    manufacture
};

/*
* 路由对照表*/
const routerReference = {
    //车间看板
    'tv-main': () => import('@/views/tv/process-machine/process-main.vue'),
    'nine-tv': () => import('@/views/tv/tv-nine/tv.vue'),
    //数据监测
    'charts': () => import('@/views/production-order/charts-indicate/chart.vue'),
    'productDetail': () => import('@/views/data-monitor/machine-detail/work-monitor.vue'),
    'energy-shows': () => import('@/views/data-monitor/energy-shows/index.vue'),
    //基础资料
    'enviroment':() => import('@/views/basicData/enviroment/enviroment.vue'),
    'dic': () => import('@/views/basicData/dictionary-mgmt.vue'),
    'process': () => import('@/views/basicData/process/process-mgmt.vue'),
    'process-warning': () => import('@/views/basicData/process-warning/process-warning.vue'),
    'color': () => import('@/views/basicData/color/color.vue'),
    'meas': () => import('@/views/basicData/unit/unit.vue'),
    //系统管理
    'notification': () => import('@/views/system/notification/list-notification.vue'),
    'scada-config': () => import('@/views/system/scada-config/index.vue'),
    'company': () => import('@/views/system/company-mgmt.vue'),
    'role': () => import('@/views/system/role/role.vue'),
    'module': () => import('@/views/system/module/module.vue'),
    'assembly': () => import('@/views/system/assembly/assembly.vue'),
    'para': () => import('@/views/system/para/para.vue'),
    'service': () => import('@/views/system/service/service.vue'),
    //人事管理
    'user': () => import('@/views/system/staff-mgmt.vue'),
    'post': () => import('@/views/basicData/post/post.vue'),
    'org': () => import('@/views/system/organization-structure.vue'),
    'OA-user': () => import('@/views/system/user/oa-user.vue'),
    'group-manage': () => import('@/views/system/group-manage/index.vue'),
    //物理管理
    'number': () => import('@/views/product/number/number.vue'),
    'erp-archives': () => import('@/views/product/erp-product/erp-product-archives.vue'),
    'product-archives': () => import('@/views/product/list-product.vue'),
    'category': () => import('@/views/product/category/category.vue'),
    'attr': () => import('@/views/product/attribute/materiel-attr.vue'),
    'batch': () => import('@/views/product/batch/batch.vue'),
    //排班管理
    'shift-analysis':  () => import('@/views/schedule/chart/chart.vue'),
    'schedule': () => import('@/views/schedule/schedule/schedule.vue'),
    'userMachine': () => import('@/views/schedule/user-machine/user-machine.vue'),
    'scheduleMachine': () => import('@/views/schedule/schedule-machine/schedule-machine.vue'),
    'allocate': () => import('@/views/schedule/allocate/allocate.vue'),
    'shift': () => import('@/views/schedule/shift/shift.vue'),
    'attendance': () => import('@/views/schedule/attendance-rules.vue'),
    //计件管理
    'piece-quota': () => import('@/views/schedule/piece-quota/piece-quota.vue'),
    'goal-output':  () => import('@/views/schedule/goal-output/list-goal-output.vue'),
    'auxiliary-quota': () => import('@/views/schedule/auxiliary-quota/auxiliary-quota.vue'),
    'product-time': () => import('@/views/schedule/product-time/product-time.vue'),
    'prd-examination': () => import('@/views/schedule/production-examination/list-prd-examination.vue'),
    'piecework': () => import('@/views/schedule/piecework/piecework-account.vue'),
    //包装管理
    'pack-report': () => import('@/views/pack/pack-report/xw-pack-report.vue'),
    'pack-analysis': () => import('@/views/pack/pack-analysis/xw-pack-analysis.vue'),
    'stock-audit': () => import('@/views/pack/stock/stock.vue'),
    'pack-list': () => import('@/views/pack/pack-list/pack-list.vue'),
    'user-pack': () => import('@/views/pack/view-pack/user-pack.vue'),
    'pack-color': () => import('@/views/pack/pack-color/list-pack-color.vue'),
    //工艺管理
    'processSheet': () => import('@/views/spec/process-sheet/process-sheet.vue'),
    'route': () => import('@/views/spec/process-route.vue'),
    'processParams': () => import('@/views/production-order/process-params/process-params.vue'),
    'processFormula': () => import('@/views/spec/process-hourly-formula.vue'),
    //生产管理
    'production-monitor': () => import('@/views/production-order/monitoring/production-monitor.vue'),
    'erp-order': () => import('@/views/production-order/erp-order/list-erp-order.vue'),
    'order': { meta: { keepAlive: true }, component: () => import('@/views/production-order/order/list-order.vue') },
    'manufactureBOM': () => import('@/views/production-order/manufacture/list-manufacture.vue'),
    'pre-arrange': () => import('@/views/production-order/machine-arrange/pre-arrange.vue'),
    'post-arrange': () => import('@/views/production-order/machine-arrange/post-arrange.vue'),
    'notice': () => import('@/views/production-order/notice/list-notice.vue'),
    'processModification': () => import('@/views/production-order/process-modification/process-modification.vue'),
    'rialInspection': () => import('@/views/production-order/rial-inspection/rial-inspection.vue'),
    'open': () => import('@/views/production-order/open/open-machine.vue'),
    'close': () => import('@/views/production-order/close/close-machine.vue'),
    'report': () => import('@/views/production-order/report/report.vue'),
    //计划排程
    'aps': () => import('@/views/public/aps-page.vue'),
    //设备管理
    'machine-chart': () => import('@/views/equipment-mgmt/chart/chart.vue'),
    'maintainPlan': () => import('@/views/equipment-mgmt/upkeep/upkeep-plan.vue'),
    'planDetail': () => import('@/views/equipment-mgmt/upkeep/upkeep-plan-detail.vue'),
    'machineMaintain': () => import('@/views/equipment-mgmt/upkeep/machine-maintain.vue'),
    'faultCall': () => import('@/views/equipment-mgmt/repair/fault-call.vue'),
    'repairOrder': () => import('@/views/equipment-mgmt/repair/tab-repair.vue'),
    'partsReplace': () => import('@/views/equipment-mgmt/parts-replace/parts-replace.vue'),
    'file': () => import('@/views/equipment-mgmt/equipmentFile-mgmt.vue'),
    'workCenter': () => import('@/views/equipment-mgmt/work-center/work-center.vue'),
    'fault': () => import('@/views/basicData/fault-cause.vue'),
    'machineModel': () => import('@/views/basicData/machine-model/machine-model.vue'),
    'upkeepItem': () => import('@/views/equipment-mgmt/upkeep/upkeep-item.vue'),
    'maintain': () => import('@/views/basicData/maintain-type.vue'),
    'fault-subclass': () => import('@/views/equipment-mgmt/fault-subclass/fault-subclass.vue'),
    'fault-mes': () => import('@/views/equipment-mgmt/fault-mes/fault-mes.vue'),
    //专件管理
    'parts-archives': () => import('@/views/equipment-mgmt/parts-archives/list-parts-archives.vue'),
    'special-replace': () => import('@/views/equipment-mgmt/special-replace/list-special-replace.vue'),
    'special-warning': () => import('@/views/equipment-mgmt/special-warning/list-special-warning.vue'),
    //回花管理
    'stock-apply': () => import('@/views/back-flower/stock-apply/list-stock-apply.vue'),
    //配棉管理
    'blend-archives': () => import('@/views/cotton-blend/archives/list-blend-archives.vue'),
    'pack-area': () => import('@/views/cotton-blend/pack-area/list-pack-area.vue'),
    'pack-chart': () => import('@/views/cotton-blend/pack-chart/list-cotton-pack.vue'),
    'list-material-apply': () => import('@/views/cotton-blend/material-apply/list-material-apply.vue'),
    'material-feed':  () => import('@/views/material/material-feed/material-feed.vue'),
    'cotton-cleaner-open':  () => import('@/views/cotton-blend/cotton-cleaner/cotton-cleaner-open.vue'),
    'cotton-cleaner-close': () => import('@/views/cotton-blend/cotton-cleaner/cotton-cleaner-close.vue'),
    'xw-analysis': () => import('@/views/cotton-blend/xw-analysis/xw-material-analysis.vue'),
    //条筒管理
    'online-material': () => import('@/views/barrel/online-mateial/list-online-material.vue'),
    'feed-alarm': () => import('@/views/barrel/feed-alarm/list-feed-alarm.vue'),
    'barrel-list': () => import('@/views/barrel/barrel-list/barrel-list.vue'),
    'barrel-upper': () => import('@/views/barrel/barrel-upper/barrel-upper.vue'),
    'barrel-lower': () => import('@/views/barrel/barrel-lower/barrel-lower.vue'),
    'upper-product': () => import('@/views/barrel/upper-product/upper-product.vue'),
    'barrel-product':  () => import('@/views/barrel/barrel-product/list-barrel-product.vue'),
    //质量管理
    'quality-chart ': () => import('@/views/quality/chart/chart.vue'),
    'quality-type': () => import('@/views/quality/type/type.vue'),
    'qualityParameter':  () => import('@/views/quality/parameter/quality-parameter.vue'),
    'qualityQuota':  () => import('@/views/quality/quota/quota.vue'),
    'qualityInspection': () => import('@/views/quality/inspection/inspection.vue'),
    'qualityWeight': () => import('@/views/quality/weight/weight.vue'),
    'qmStrength': () => import('@/views/quality/inspection/qmStrength.vue'),
    'qmTwist': () => import('@/views/quality/inspection/qmTwist.vue'),
    'hairiness': () => import('@/views/quality/inspection/hairiness.vue'),
    'renovate': () => import('@/views/quality/renovate/renovate.vue'),
    'quality-chart': () => import('@/views/quality/chart/chart.vue'),
    //统计分析
    'daily-accounting': () => import('@/views/analysis/daily-accounting.vue'),
    'daily-report': () => import('@/views/analysis/daily-output.vue'),
    'production-schedule': () => import('@/views/analysis/production-schedule.vue'),
    'machineReport': () => import('@/views/analysis/machineReport.vue'),
    'product-output': () => import('@/views/analysis/product-output.vue'),
    'group-output': () => import('@/views/analysis/group-output.vue'),
    'userReport': () => import('@/views/analysis/userReportSheet.vue'),
    'groupReport': () => import('@/views/analysis/shiftGroupReportSheet.vue'),
    'productReport': () => import('@/views/analysis/productReportSheet.vue'),
    // 计件核算
    'piecework-wages': () => import('@/views/schedule/piecework/piecework-account.vue'),
    //其他
    // 'user': () => import('@/views/system/staff-mgmt.vue'),
    // 'nine-tv': () => import('@/views/tv/tv-nine/tv.vue'),
    // 'process-tv': () => import('@/views/tv/process-machine/process-machine.vue'),
    // 'monitoring': () => import('@/views/production-order/monitoring/monitoring.vue')

};
export default routerReference;

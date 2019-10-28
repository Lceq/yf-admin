import Main from '@/views/Main.vue';
// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};
export const charts = {
    path: '/charts-top',
    title: '运转监测',
    name: 'charts-top',
    icon: 'arrow-swap',
    component: () => import('@/views/production-order/charts-indicate/chart-top.vue')
    // path: '/locking',
    // name: 'locking',
    // component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'layout', title: 'layout', name: 'layout', component: () => import('@/views/layout/layout.vue') },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: () => import('@/views/own-space/own-space.vue') },
        { path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue') },
        { meta: { keepAlive: true }, path:'addOrder',title:'新增生产订单',name:'addOrder',icon:'person-add', component: () => import('@/views/production-order/order/add-order.vue')},
        { meta: { keepAlive: true }, path:'add-erp-order',title:'ERP订单同步',name:'add-erp-order',icon:'person-add', component: () => import('@/views/production-order/erp-order/add-erp-order.vue')},
        { meta: { keepAlive: true }, path:'editOrder',title:'编辑生产订单',name:'editOrder',icon:'person-add', component: () => import('@/views/production-order/order/edit-order.vue')},
        { meta: { keepAlive: true }, path:'addProSheet',title:'新增品种工艺单',name:'addProSheet', component: () => import('@/views/spec/process-sheet/xw-add-processSheet.vue')},
        { meta: { keepAlive: true }, path:'editProSheet',title:'编辑品种工艺单',name:'editProSheet', component: () => import('@/views/spec/process-sheet/xw-edit-processSheet.vue')},
        { meta: { keepAlive: true }, path:'addNotice',title:'新增生产通知单',name:'addNotice',icon:'ios-paper', component: () => import('@/views/production-order/notice/add-notice.vue')},
        { meta: { keepAlive: true }, path:'editNotice',title:'编辑生产通知单',name:'editNotice',icon:'ios-paper', component: () => import('@/views/production-order/notice/edit-notice.vue')},
        { meta: { keepAlive: true }, path:'notice-detail',title:'生产通知单详情',name:'notice-detail',icon:'ios-paper', component: () => import('@/views/production-order/notice/detail-notice.vue')},
        { path:'inlineDetail',title:'在线产品详情',name:'inlineDetail',icon:'ios-paper', component: () => import('@/views/home/inline-product.vue')},
        { meta: { keepAlive: true }, path:'addUpkeep',title:'新增保养计划',name:'addUpkeep',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/add-upkeepPlan.vue') },
        { meta: { keepAlive: true }, path:'editUpkeep',title:'编辑保养计划',name:'editUpkeep',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/edit-upkeepPlan.vue') },
        { meta: { keepAlive: true }, path:'addPartsReplace',title:'新增配件更换',name:'addPartsReplace',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/parts-replace/add-partsReplace.vue') },
        { meta: { keepAlive: true }, path:'editPartsReplace',title:'编辑配件更换',name:'editPartsReplace',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/parts-replace/edit-partsReplace.vue') },
        { meta: { keepAlive: true }, path:'addManufactureBOM',title:'新增制造BOM',name:'addManufactureBOM',icon:'ios-paper', component: () => import('@/views/production-order/manufacture/add-manufacture.vue')},
        { meta: { keepAlive: true }, path:'editManufactureBOM',title:'编辑制造BOM',name:'editManufactureBOM',icon:'ios-paper', component: () => import('@/views/production-order/manufacture/edit-manufacture.vue')},
        { meta: { keepAlive: true }, path:'bomDetail',title:'制造BOM详情',name:'bomDetail',icon:'ios-paper', component: () => import('@/views/production-order/manufacture/detail-manufacture.vue') },
        { meta: { keepAlive: true }, path:'orderDetail',title:'生产订单详情',name:'orderDetail',icon:'ios-paper', component: () => import('@/views/production-order/order/detail-order.vue') },
        { meta: { keepAlive: true }, path:'add-blend',title:'新增配棉档案',name:'add-blend',icon:'ios-paper', component: () => import('@/views/cotton-blend/archives/add-blend-archives.vue') },
        { meta: { keepAlive: true }, path:'edit-blend',title:'编辑配棉档案',name:'edit-blend',icon:'ios-paper', component: () => import('@/views/cotton-blend/archives/edit-blend-archives.vue') },
        { meta: { keepAlive: true }, path:'detail-blend',title:'配棉档案详情',name:'detail-blend',icon:'ios-paper', component: () => import('@/views/cotton-blend/archives/detail-blend-archives.vue') },
        { meta: { keepAlive: true }, path:'addReport',title:'新增生产报工',name:'addReport',icon:'ios-paper', component: () => import('@/views/production-order/report/addReport.vue')},
        { meta: { keepAlive: true }, path:'editReport',title:'编辑生产报工',name:'editReport',icon:'ios-paper', component: () => import('@/views/production-order/report/editReport.vue')},
        { meta: { keepAlive: true }, path:'add-material-apply',title:'新增领料申请',name:'add-material-apply',icon:'ios-book', component: () => import('@/views/cotton-blend/material-apply/add-material-apply.vue')},
        { meta: { keepAlive: true }, path:'edit-material-apply',title:'编辑领料申请',name:'edit-material-apply',icon:'ios-book', component: () => import('@/views/cotton-blend/material-apply/edit-material-apply.vue')},
        { meta: { keepAlive: true }, path:'detail-material-apply',title:'领料申请详情',name:'detail-material-apply',icon:'ios-book', component: () => import('@/views/cotton-blend/material-apply/detail-material-apply.vue')},

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [];
/*export const appRouter = [
    {
        path:'',
        icon:'android-people',
        name:'data',
        title:'数据监测',
        component:Main,
        children:[
            { path: 'monitoring', title: '设备监测', name: 'monitoring', icon: 'arrow-swap', component: () => import('@/views/production-order/monitoring/monitoring.vue')},
            { path: 'b-nenghao', title: '能耗监测', name: 'b-nenghao', icon: 'arrow-swap'},
            { path: 'b-huanjing', title: '环境监测', name: 'b-huanjing', icon: 'arrow-swap'},
            { path: 'b-danding', title: '单锭监测', name: 'b-danding', icon: 'arrow-swap'},
            { path:'productDetail',title:'设备详情',name:'productDetail',icon:'ios-paper', component: () => import('@/views/data-monitor/machine-detail/work-monitor.vue')},
            { path: 'charts', title: '运转监测', name: 'charts', icon: 'arrow-swap', component: () => import('@/views/production-order/charts-indicate/chart.vue')},
            { path:'productMonitor',title:'设备监测',name:'productMonitor',icon:'ios-paper', component: () => import('@/views/home/monitor.vue')},
            { path:'dynamic-router/:aId',title:'动态页面',name:'dynamic-router',icon:'ios-paper', component: () => import('@/views/public/dynamic-page.vue')},
            { path:'scada-monitor',title:'SCADA监测',name:'scada-monitor',icon:'ios-paper', component: () => import('@/views/data-monitor/scada-monitor.vue')},
            { path:'energy-shows',title:'能耗看板',name:'energy-shows',icon:'ios-paper', component: () => import('@/views/data-monitor/energy-shows/index.vue')},
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'basicData',
        title:'基础资料',
        component:Main,
        children:[
            { path:'dic',title:'字典管理',name:'dic',icon:'ios-book', component: () => import('@/views/basicData/dictionary-mgmt.vue')},
            { path:'meas',title:'计量单位',name:'meas',icon:'edit', component: () => import('@/views/basicData/unit/unit.vue') },
            { path:'process',title:'工序管理',name:'process',icon:'wrench', component: () => import('@/views/basicData/process/process-mgmt.vue') },
            { path:'process-warning',title:'能耗预警设置',name:'process-warning',icon:'wrench', component: () => import('@/views/basicData/process-warning/process-warning.vue') },
            { path:'processCombinate',title:'工序组合',name:'processCombinate',icon:'wrench', component: () => import('@/views/basicData/process/process.vue') },
            { path:'color',icon: 'ios-color-wand',title:'色号管理',name:'color',component:() => import('@/views/basicData/color/color.vue')},
            { path:'enviroment',icon: 'ios-color-wand',title:'环境区域设置',name:'enviroment',component:() => import('@/views/basicData/enviroment/enviroment.vue')},
            { path:'b-pihao',icon: 'ios-color-wand',title:'批号管理',name:'b-pihao'}
        ]
    },
    {
        path: '',
        icon: 'android-checkbox',
        name: 'system',
        title: '系统管理',
        component: Main,
        children: [
            { path: 'company', title: '公司管理', name: 'company', icon: 'compose', component: () => import('@/views/system/company-mgmt.vue') },
            { path:'role',icon: 'android-contact',title:'角色管理',name:'role',component:() => import('@/views/system/role/role.vue')},
            { path:'module',icon: 'ios-photos',title:'模块管理',name:'module', component:() => import('@/views/system/module/module.vue')},
            { path:'assembly',icon: 'person',title:'权限项管理',name:'assembly',component:() => import('@/views/system/assembly/assembly.vue')},
            { path:'rule',icon: 'ionic',title:'编码规则',name:'rule',component:() => import('@/views/system/code-rule.vue')},
            { path:'para',icon: 'ionic',title:'系统设置',name:'para', component:() => import('@/views/system/para/para.vue')},
            { path:'service',icon: 'ionic',title:'服务配置',name:'service', component:() => import('@/views/system/service/service.vue')},
            { path:'notification',icon: 'ionic',title:'通知公告',name:'notification', component:() => import('@/views/system/notification/list-notification.vue')},
            { path:'scada-config',icon: 'ionic',title:'scada配置',name:'scada-config', component:() => import('@/views/system/scada-config/index.vue')},
            { path:'b-shuju',icon: 'ionic',title:'数据备份',name:'b-shuju'},
        ]
    },
    {
        path:'',
        icon:'android-people',
        name:'Personnel',
        title:'人事管理',
        component:Main,
        children:[
            { path: 'org', title: '组织架构', name: 'org', icon: 'arrow-swap', component: () => import('@/views/system/organization-structure.vue') },
            { path:'emp',icon: 'person',title:'员工管理',name:'emp',component:() => import('@/views/system/staff-mgmt.vue')},
            { path:'post',title:'岗位管理',name:'post',icon:'hammer', component: () => import('@/views/basicData/post/post.vue') },
            { path:'OA-user',title:'员工数据导入',name:'OA-user',icon:'hammer', component: () => import('@/views/system/user/oa-user.vue') }
        ]
    },
    {
        path:'',
        icon:'android-people',
        name:'schedule-mgmt',
        title:'排班管理',
        component:Main,
        children:[
            { path:'shift-analysis',title:'班次人员分析',name:'shift-analysis',icon:'ios-nutrition', component: () => import('@/views/schedule/chart/chart.vue')},
            { path:'schedule',title:'排班管理',name:'schedule',icon:'ios-nutrition', component: () => import('@/views/schedule/schedule/schedule.vue')},
            { path:'scheduleM',title:'机台分配',name:'scheduleM',icon:'android-clipboard', component: () => import('@/views/schedule/machine/schedule-machine.vue')},
            { path:'scheduleMachine',title:'机台分配',name:'scheduleMachine',icon:'android-clipboard', component: () => import('@/views/schedule/schedule-machine/schedule-machine.vue')},
            { path:'userMachine',title:'人员机台分配',name:'userMachine',icon:'android-clipboard', component: () => import('@/views/schedule/user-machine/user-machine.vue')},
            { path:'allocate',title:'人员机台查询',name:'allocate',icon:'android-clipboard', component: () => import('@/views/schedule/allocate/allocate.vue')},
            { path:'shiftManager',title:'班制管理',name:'shiftManager',icon:'social-instagram-outline', component: () => import('@/views/schedule/shift-manager.vue')},
            { path:'shift',title:'班制管理',name:'shift',icon:'social-instagram-outline', component: () => import('@/views/schedule/shift/shift.vue')},
            { path:'attendance',title:'考勤规则',name:'attendance',icon:'social-dropbox', component: () => import('@/views/schedule/attendance-rules.vue')},
            { path:'MachineProduction',title:'值班管理',name:'MachineProduction',icon:'social-dropbox', component: () => import('@/views/schedule/production/production.vue')}
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'WorkAttendance',
        title:'计件管理',
        component:Main,
        children:[
            { path:'b-jijian',title:'品种计件定额',name:'b-jijian',icon:'social-dropbox'},
            { meta: { keepAlive: true }, path:'piecework',title:'计件核算',name:'piecework',icon:'social-dropbox', component: () => import('@/views/schedule/piecework/piecework-account.vue')},
            { path:'goal-output',title:'目标产量配置',name:'goal-output',icon:'social-dropbox', component: () => import('@/views/schedule/goal-output/list-goal-output.vue')},
            { path:'piece-quota',title:'品种计件定额',name:'piece-quota',icon:'social-dropbox', component: () => import('@/views/schedule/piece-quota/piece-quota.vue')},
            { path:'auxiliary-quota',title:'辅助计件定额',name:'auxiliary-quota',icon:'social-dropbox', component: () => import('@/views/schedule/auxiliary-quota/auxiliary-quota.vue')},
            { path:'product-time',title:'生产计时',name:'product-time',icon:'social-dropbox', component: () => import('@/views/schedule/product-time/product-time.vue')},
            { path:'prd-examination',title:'生产考核',name:'prd-examination',icon:'social-dropbox', component: () => import('@/views/schedule/production-examination/list-prd-examination.vue')},
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'Technology',
        title:'工艺管理',
        component:Main,
        children:[
            { path:'route',title:'工艺路线',name:'route',icon:'android-map', component: () => import('@/views/spec/process-route.vue')},
            { path:'processParams',title:'工艺项目',name:'processParams',icon:'mouse', component: () => import('@/views/production-order/process-params/process-params.vue')},
            { path:'processFormula',title:'台时产公式',name:'processFormula',icon:'mouse', component: () => import('@/views/spec/process-hourly-formula.vue')},
            { meta: { keepAlive: true }, path:'processSheet',title:'品种工艺单',name:'processSheet',icon:'ios-paper', component: () => import('@/views/spec/process-sheet/process-sheet.vue')}
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'production',
        title:'生产管理',
        component:Main,
        children:[
            { meta: { keepAlive: true }, path:'order',title:'生产订单',name:'order',icon:'android-bookmark', component: () => import('@/views/production-order/order/list-order.vue')},
            { meta: { keepAlive: true }, path:'erp-order',title:'ERP生产订单',name:'erp-order',icon:'android-bookmark', component: () => import('@/views/production-order/erp-order/list-erp-order.vue')},
            { meta: { keepAlive: true }, path:'notice',title:'生产通知单',name:'notice',icon:'ios-paper', component: () => import('@/views/production-order/notice/list-notice.vue')},
            { path:'open',title:'品种开台',name:'open',icon:'ios-paper', component: () => import('@/views/production-order/open/open-machine.vue')},
            { path:'openSheet', title:'品种开台单',name:'openSheet',icon:'ios-paper', component: () => import('@/views/production-order/open/openSheet.vue')},
            { path:'close',title:'品种了机',name:'close',icon:'ios-paper', component: () => import('@/views/production-order/close/close-machine.vue')},
            { meta: { keepAlive: true }, path:'report',title:'生产报工',name:'report',icon:'ios-paper', component: () => import('@/views/production-order/report/report.vue')},
            { path:'report-detail',title:'生产报工详情',name:'report-detail',icon:'ios-paper', component: () => import('@/views/production-order/report/report-detail.vue')},
            { path:'orderTrace',title:'通知单追溯',name:'orderTrace',icon:'ios-paper', component: () => import('@/views/production-order/orderTrace/orderTrace.vue')},
            { path:'pre-arrange',title:'前纺排产',name:'pre-arrange',icon:'ios-paper', component: () => import('@/views/production-order/machine-arrange/pre-arrange.vue')},
            { path:'post-arrange',title:'后纺排产',name:'post-arrange',icon:'ios-paper', component: () => import('@/views/production-order/machine-arrange/post-arrange.vue')},
            { path:'processModification',title:'工艺翻改',name:'processModification',icon:'ios-paper', component: () => import('@/views/production-order/process-modification/process-modification.vue')},
            { path:'rialInspection',title:'试纺质检',name:'rialInspection',icon:'ios-paper', component: () => import('@/views/production-order/rial-inspection/rial-inspection.vue')},
            { path:'production-monitor',title:'生产监控看板',name:'production-monitor',icon:'ios-paper', component: () => import('@/views/production-order/monitoring/production-monitor.vue')},
            { meta: { keepAlive: true }, path:'manufactureBOM',title:'制造BOM',name:'manufactureBOM',icon:'ios-paper', component: () => import('@/views/production-order/manufacture/list-manufacture.vue')}
        ]
    },
    {
        path:'',
        icon:'ios-briefcase',
        name:'equipment-mgmt',
        title:'设备管理',
        component:Main,
        children:[
            { path:'machine-chart',title:'设备看板',name:'machine-chart',icon:'pricetag', component: () => import('@/views/equipment-mgmt/chart/chart.vue') },
            { path:'machineModel',title:'设备机型',name:'machineModel',icon:'pricetag', component: () => import('@/views/basicData/machine-model/machine-model.vue') },
            { path:'file',title:'设备档案',name:'file',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/equipmentFile-mgmt.vue')},
            { path:'workCenter',title:'工作中心',name:'workCenter',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/work-center/work-center.vue')},
            { path:'faultCall',title:'故障呼叫',name:'faultCall',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/repair/fault-call.vue')},
            { path:'repairOrder',title:'维修工单',name:'repairOrder',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/repair/tab-repair.vue')},
            { path:'maintain',title:'保养类型',name:'maintain',icon:'ios-flask', component: () => import('@/views/basicData/maintain-type.vue') },
            { path:'fault',title:'故障原因',name:'fault',icon:'ios-rose', component: () => import('@/views/basicData/fault-cause.vue') },
            { meta: { keepAlive: true }, path:'maintainPlan',title:'保养计划',name:'maintainPlan',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/upkeep-plan.vue') },
            { path:'machineMaintain',title:'设备保养',name:'machineMaintain',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/machine-maintain.vue') },
            { path:'planDetail',title:'计划明细',name:'planDetail',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/upkeep-plan-detail.vue') },
            { path:'upkeepItem',title:'保养项目',name:'upkeepItem',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/upkeep/upkeep-item.vue') },
            { meta: { keepAlive: true }, path:'partsReplace',title:'配件更换',name:'partsReplace',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/parts-replace/parts-replace.vue') },
            { path:'fault-subclass',title:'故障小类',name:'fault-subclass',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/fault-subclass/fault-subclass.vue') },
            { path:'fault-mes',title:'故障信息',name:'fault-mes',icon:'ios-rose', component: () => import('@/views/equipment-mgmt/fault-mes/fault-mes.vue') },
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'special-file',
        title:'专件管理',
        component:Main,
        children:[
            { path:'special-replace',title:'专件更换',name:'special-replace',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/special-replace/list-special-replace.vue')},
            { path:'parts-archives',title:'专件档案',name:'parts-archives',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/parts-archives/list-parts-archives.vue')},
            { path:'special-warning',title:'专件预警',name:'special-warning',icon:'ios-nutrition', component: () => import('@/views/equipment-mgmt/special-warning/list-special-warning.vue')},
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'warn',
        title:'预警管理',
        component:Main,
        children:[
            { path:'b-gongyi',title:'工艺预警',name:'b-gongyi',icon:'ios-book'},
            { path:'b-guzhang',title:'故障预警',name:'b-guzhang',icon:'ios-book'},
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'material',
        title:'物料管理',
        component:Main,
        children:[
            {path:'erp-archives',title:'ERP物料档案',name:'erp-archives',icon:'android-map', component: () => import('@/views/product/erp-product/erp-product-archives.vue')},
            { path:'product-archives',title:'物料档案',name:'product-archives',icon:'ios-book', component: () => import('@/views/product/list-product.vue')},
            { path:'attr',title:'物料属性',name:'attr',icon:'document-text', component: () => import('@/views/product/attribute/materiel-attr.vue')},
            { path:'category',title:'物料分类',name:'category',icon:'aperture', component: () => import('@/views/product/category/category.vue')},
            { path:'batch',title:'批号管理',name:'batch',icon:'aperture', component: () => import('@/views/product/batch/batch.vue')},
            { path:'number',title:'支数系数',name:'number',icon:'aperture', component: () => import('@/views/product/number/number.vue')},
            { path:'b-zhuisu',title:'物料追溯',name:'b-zhuisu',icon:'ios-book'},
            { path:'b-cusha',title:'粗纱库管理',name:'b-cusha',icon:'ios-book'},
            { path:'b-huihuam',title:'回花管理',name:'b-huihuam',icon:'ios-book'},
            { path:'b-beijianm',title:'备件管理',name:'b-beijianm',icon:'ios-book'}
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'back-flower',
        title:'回花管理',
        component:Main,
        children:[
            { path:'stock-apply',title:'入库申请',name:'stock-apply',icon:'ios-book', component: () => import('@/views/back-flower/stock-apply/list-stock-apply.vue') },
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'blend',
        title:'配棉管理',
        component:Main,
        children:[
            { path:'cotton-cleaner-open',title:'清花开台',name:'cotton-cleaner-open',icon:'pricetag', component: () => import('@/views/cotton-blend/cotton-cleaner/cotton-cleaner-open.vue') },
            { path:'cotton-cleaner-close',title:'清花了机',name:'cotton-cleaner-close',icon:'pricetag', component: () => import('@/views/cotton-blend/cotton-cleaner/cotton-cleaner-close.vue') },
            { path:'floral-disc',title:'清花圆盘',name:'floral-disc',icon:'ios-book', component: () => import('@/views/cotton-blend/floral-disc/floral-disc.vue')},
            { path:'pack-area',title:'排包区域',name:'pack-area',icon:'ios-book', component: () => import('@/views/cotton-blend/pack-area/list-pack-area.vue')},
            { path:'pack-chart',title:'配棉排包图',name:'pack-chart',icon:'ios-book', component: () => import('@/views/cotton-blend/pack-chart/list-cotton-pack.vue')},
            { meta: { keepAlive: true }, path:'blend-archives',title:'配棉档案',name:'blend-archives',icon:'ios-book', component: () => import('@/views/cotton-blend/archives/list-blend-archives.vue')},
            { path:'list-material-apply',title:'领料申请',name:'list-material-apply',icon:'ios-book', component: () => import('@/views/cotton-blend/material-apply/list-material-apply.vue')},
            { path:'xw-analysis',title:'原料报表',name:'xw-analysis',icon:'ios-book', component: () => import('@/views/cotton-blend/xw-analysis/xw-material-analysis.vue')},
            { path:'material-feed',title:'原料投料',name:'material-feed',icon:'android-map', component: () => import('@/views/material/material-feed/material-feed.vue')},
        ]
    },
    {
        path:'',
        icon:'clipboard',
        name:'plan',
        title:'计划排程',
        component:Main,
        children:[
            { path:'aps',title:'APS排程',name:'aps',icon:'ios-paper', component: () => import('@/views/public/aps-page.vue')},
            { path:'b-yunsuan',title:'排程运算',name:'b-yunsuan',icon:'ios-book',component: () => import('@/views/plan-scheduling/a.vue')},
            { path:'b-fabu',title:'排程发布',name:'b-fabu',icon:'ios-book',component: () => import('@/views/plan-scheduling/a.vue')},
            { path:'b-shitu',title:'排程视图',name:'b-shitu',icon:'ios-book',component: () => import('@/views/plan-scheduling/a.vue')},
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'quality',
        title:'质量管理',
        component:Main,
        children:[
            { path:'quality-type',title:'工序质检类别',name:'quality-type',icon:'ios-book',  component: () => import('@/views/quality/type/type.vue')},
            { path:'renovate',title:'停车翻改',name:'renovate',icon:'ios-book',  component: () => import('@/views/quality/renovate/renovate.vue')},
            { path:'quality-chart',title:'质量看板',name:'quality-chart',icon:'ios-book',  component: () => import('@/views/quality/chart/chart.vue')},
            { path:'qualityParameter',title:'质量指标参数',name:'qualityParameter',icon:'ios-book',  component: () => import('@/views/quality/parameter/quality-parameter.vue')},
            { path:'qualityQuota',title:'产品质量指标',name:'qualityQuota',icon:'ios-book', component: () => import('@/views/quality/quota/quota.vue')},
            { path:'qualityWeight',title:'重量检验',name:'qualityWeight',icon:'ios-book', component: () => import('@/views/quality/weight/weight.vue')},
            { path:'qualityInspection',title:'条干检验',name:'qualityInspection',icon:'ios-book', component: () => import('@/views/quality/inspection/inspection.vue')},
            { path:'qmStrength',title:'强度检验',name:'qmStrength',icon:'ios-book', component: () => import('@/views/quality/inspection/qmStrength.vue')},
            { path:'qmTwist',title:'捻度检验',name:'qmTwist',icon:'ios-book', component: () => import('@/views/quality/inspection/qmTwist.vue')},
            { path:'hairiness',title:'毛羽检验',name:'hairiness',icon:'ios-book', component: () => import('@/views/quality/inspection/hairiness.vue')},
            { path:'b-ziluo',title:'自络检验',name:'b-ziluo',icon:'ios-book'}
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'barrel',
        title:'条桶管理',
        component:Main,
        children:[
            { path:'barrel-list',title:'条桶档案',name:'barrel-list',icon:'ios-book',  component: () => import('@/views/barrel/barrel-list/barrel-list.vue')},
            { path:'barrel-upper',title:'上机筒位',name:'barrel-upper',icon:'ios-book', component: () => import('@/views/barrel/barrel-upper/barrel-upper.vue')},
            { path:'barrel-lower',title:'下机筒位',name:'barrel-lower',icon:'ios-book', component: () => import('@/views/barrel/barrel-lower/barrel-lower.vue')},
            { path:'upper-product',title:'上机物料',name:'upper-product',icon:'ios-book', component: () => import('@/views/barrel/upper-product/upper-product.vue')},
            { path:'barrel-product',title:'条桶产品查询',name:'barrel-product',icon:'ios-book', component: () => import('@/views/barrel/barrel-product/list-barrel-product.vue')},
            { path:'online-material',title:'在线物料查询',name:'online-material',icon:'ios-book', component: () => import('@/views/barrel/online-mateial/list-online-material.vue')},
            { path:'feed-alarm',title:'头并投料报警',name:'feed-alarm',icon:'ios-book', component: () => import('@/views/barrel/feed-alarm/list-feed-alarm.vue')}
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'cost',
        title:'成本分析',
        component:Main,
        children:[
            { path:'b-yuanliao',title:'原料定额',name:'b-yuanliao',icon:'ios-book'},
            { path:'b-zaichengpin',title:'在产品定额',name:'b-zaichengpin',icon:'ios-book'},
            { path:'b-cchengpin',title:'产成品定额',name:'b-cchengpin',icon:'ios-book'},
            { path:'b-mnenghao',title:'能耗定额',name:'b-mnenghao',icon:'ios-book'},
            { path:'b-dandinge',title:'单锭消耗定额',name:'b-dandinge',icon:'ios-book'},
            { path:'b-huihua',title:'回花定额',name:'b-huihua',icon:'ios-book'},
            { path:'b-zhicheng',title:'制成率定额',name:'b-zhicheng',icon:'ios-book'},
            { path:'b-tairi',title:'台日工费利润表',name:'b-tairi',icon:'ios-book'}
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'Analysis',
        title:'统计分析',
        access: 1,
        component:Main,
        children:[
            { path:'product-output',title:'品种产量分析',name:'product-output',icon:'android-map', component: () => import('@/views/analysis/product-output.vue')},
            { path:'group-output',title:'班组产量统计',name:'group-output',icon:'android-map', component: () => import('@/views/analysis/group-output.vue')},
            { path:'pieceworkReport',title:'计件产量报表',name:'pieceworkReport',icon:'android-map', component: () => import('@/views/analysis/pieceworkReport.vue')},
            { path:'machineReport',title:'机台产量报表',name:'machineReport',icon:'android-map', component: () => import('@/views/analysis/machineReport.vue')},
            { path:'userReport',title:'人员产量报表',name:'userReport',icon:'android-map', component: () => import('@/views/analysis/userReportSheet.vue')},
            { path:'groupReport',title:'班组产量报表',name:'groupReport',icon:'android-map', component: () => import('@/views/analysis/shiftGroupReportSheet.vue')},
            { path:'productReport',title:'品种产量报表',name:'productReport',icon:'android-map', component: () => import('@/views/analysis/productReportSheet.vue')},
            { path:'daily-report',title:'生产日报表',name:'daily-report',icon:'android-map', component: () => import('@/views/analysis/daily-output.vue')},
            { path:'daily-accounting',title:'生产日核算',name:'daily-accounting',icon:'android-map', component: () => import('@/views/analysis/daily-accounting.vue')},
            { path:'production-schedule',title:'生产进度表',name:'production-schedule',icon:'android-map', component: () => import('@/views/analysis/production-schedule.vue')},
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'pack',
        title:'包装管理',
        access: 1,
        component:Main,
        children:[
            { path:'pack-report',title:'包装报工',name:'pack-report',icon:'android-map', component: () => import('@/views/pack/pack-report/xw-pack-report.vue')},
            { path:'stock-audit',title:'入库审核',name:'stock-audit',icon:'android-map', component: () => import('@/views/pack/stock/stock.vue')},
            {path:'user-pack',title:'产品包装报工',name:'user-pack',icon:'android-map', component: () => import('@/views/pack/view-pack/user-pack.vue')},
            {path:'pack-list',title:'包装报表查询',name:'pack-list',icon:'android-map', component: () => import('@/views/pack/pack-list/pack-list.vue')},
            {path:'pack-color',title:'包装料颜色',name:'pack-color',icon:'android-map', component: () => import('@/views/pack/pack-color/list-pack-color.vue')},
            {path:'pack-analysis',title:'包装报表',name:'pack-analysis',icon:'android-map', component: () => import('@/views/pack/pack-analysis/xw-pack-analysis.vue')},
            {path:'xw-pack-analysis',title:'包装报表',name:'xw-pack-analysis',icon:'android-map', component: () => import('@/views/pack/pack-analysis/xw-pack-analysis.vue')},
        ]
    },
    {
        path:'',
        icon:'help-buoy',
        name:'tv',
        title:'车间看板',
        access: 1,
        component:Main,
        children:[
            { path:'tv-main',title:'工序机台中心',name:'tv-main',icon:'android-map', component: () => import('@/views/tv/process-machine/process-main.vue')},
            { path:'tv-process',title:'工序机台',name:'tv-process',icon:'android-map', component: () => import('@/views/tv/process-machine/process-machine.vue')},
            { path:'tv-process-xs',title:'工序机台',name:'tv-process-xs',icon:'android-map', component: () => import('@/views/tv/process-machine/process-machine-xs.vue')},
            { path:'tv-nine',title:'九图',name:'tv-nine',icon:'android-map', component: () => import('@/views/tv/tv-nine/tv.vue')},
            { path:'open-close',title:'开台了机',name:'open-close',icon:'android-map', component: () => import('@/views/tv/tv-nine/open-close.vue')},
            { path:'tv-order',title:'九-二',name:'tv-order',icon:'android-map', component: () => import('@/views/tv/tv-nine/tv-order.vue')},
            { path:'tv-four',title:'九-二',name:'tv-four',icon:'android-map', component: () => import('@/views/tv/tv-nine/tv-four.vue')},
            { path:'tv-six',title:'九-二',name:'tv-six',icon:'android-map', component: () => import('@/views/tv/tv-nine/tv-six.vue')},
            { path:'tv-month-qty',title:'九-二',name:'tv-month-qty',icon:'android-map', component: () => import('@/views/tv/tv-nine/tv-month-qty.vue')},
            { path:'tv-table',title:'九-二',name:'tv-table',icon:'android-map', component: () => import('@/views/tv/tv-nine/xw-tv/tv-open-close.vue')},
        ]
    }
];*/

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    charts,
    ...appRouter,
    page500,
    page403,
    page404
];

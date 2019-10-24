/*
* 路由对照表*/
const routerReference = {
    'roles': () => import('@/views/system/role/role.vue'),
    'module': () => import('@/views/system/module/module.vue'),
    'user': () => import('@/views/system/staff-mgmt.vue'),
    'nine-tv': () => import('@/views/tv/tv-nine/tv.vue'),
    'process-tv': () => import('@/views/tv/process-machine/process-machine.vue'),
    'scada-config': () => import('@/views/system/scada-config/index.vue'),

};
export default routerReference;

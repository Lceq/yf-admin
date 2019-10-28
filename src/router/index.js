import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import store from '@/store';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import getRoleModuleList from '../libs/permission';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    routes: routers
};
let addRouterArr = [];
export const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    addRouterArr = store.state.addRouterList;
    // 已登录
    if (Cookies.get('token')) { // 未登录且前往的页面不是登录页
        // 已经登录且前往的是登录页
        if (Cookies.get('user') && to.name === 'login') {
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            // 角色对应的模块存在的情况下
            if (addRouterArr && addRouterArr.length !== 0) {
                // 缓存打开的路由
                localStorage.setItem('activeRouteName', JSON.stringify({
                    name: to.name,
                    query: to.query,
                    params: to.params
                }));
                next();
            } else {
                // 获取角色对应的模块
                getRoleModuleList(to, next);
            };
        }
        iView.LoadingBar.finish();
    } else if (!Cookies.get('token')) {
        if (to.name === 'login') {
            next();
        } else {
            next({
                name: 'login'
            });
        };
        // 未登录
        iView.LoadingBar.finish();
    }

  /*  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {

    }*/
});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query, to);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

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
export const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    // 不是从login页来时(相反的，从在login页进入时，不能取路由上的token来自动登录，用于浏览器的回退)
    if (from.name !== 'login') {
        // 如果路由携带token
        if (to.query && to.query.token) {
            // 路由携带的和cookie的不同, 替换cookie的token
            if (Cookies.get('token') !== to.query.token) {
                Cookies.set('token', to.query.token);
            };
        };
    };
    // 已登录
    if (Cookies.get('token')) { // 未登录且前往的页面不是登录页
        // 已经登录且前往的是登录页
        if (Cookies.get('user') && to.name === 'login') {
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            // 已加载角色对应的模块的情况下
            if (store.state.isLoadModule) {
                next();
            } else {
                // 获取角色对应的模块
                getRoleModuleList(to, next);
            };
        }
        iView.LoadingBar.finish();
    } else if (!Cookies.get('token')) {
        if (to.name === 'login') {
            router.matcher = new VueRouter({ // 重置路由规则
                routes: routers
            }).matcher;
            next();
        } else {
            next({
                name: 'login',
                query: {},
                params: {}
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

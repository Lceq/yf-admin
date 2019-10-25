import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import store from '@/store';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import {fetch, post} from '../ajax/http';
import {getTrees} from '../libs/common'
import routerReference from "../libs/router-reference"
import getRoleModuleList from '../libs/permission';
Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    routes: routers
};
export const router = new VueRouter(RouterConfig);
router.beforeEach((to, from, next) => {
    let moduleAllList = [];
    let addRouterArr = store.state.addRouterList;
    // 这里获取权限设置
    iView.LoadingBar.start();
    // 已经存在动态路由
    if (addRouterArr && addRouterArr.length !== 0) {
        if (!Cookies.get('user') && to.name !== 'login' && !Cookies.get('routeName')) { // 未登录且前往的页面不是登录页
            iView.LoadingBar.finish();
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 已经登录且前往的是登录页
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            // 保存打开的路由名称
            localStorage.setItem('activeRouteName', JSON.stringify({
                name: to.name,
                query: to.query,
                params: to.params
            }));
            next();
        }
    } else {
        getRoleModuleList(to, next);
    };
  /*  if (Cookies.get('locking') === '1' && to.name !== 'locking') { // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'locking'
        });
    } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
        next(false);
    } else {
        console.log(1111)

    }*/

});

router.afterEach((to) => {
    Util.openNewPage(router.app, to.name, to.params, to.query, to);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

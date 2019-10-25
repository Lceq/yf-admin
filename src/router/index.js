import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import store from '@/store';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import {routers, otherRouter, appRouter} from './router';
import {fetch, post} from '../ajax/http';
import {getTrees} from '../libs/common'
import routerReference from "../libs/router-reference";
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
            console.log(22222)
            iView.LoadingBar.finish();
            next({
                name: 'login'
            });
        } else if (Cookies.get('user') && to.name === 'login') { // 已经登录且前往的是登录页
            console.log(33333)
            Util.title();
            next({
                name: 'home_index'
            });
        } else {
            console.log(66666, to)
            console.log('截取', to.path)
            console.log('截取2', to.path.substr(1))

            /*// 去的是error
            if (to.name === 'error-404' && JSON.parse(localStorage.getItem('activeRouteName' )).name !== to.name) {
                console.log('打开过的页面', to.name === 'error-404' && JSON.parse(localStorage.getItem('activeRouteName' )).name !== to.name)
                console.log('前往', to.name, JSON.parse(localStorage.getItem('activeRouteName' )).name)
                next({
                    name: to.path.substr(1),
                    query: to.query,
                    params: to.params,
                })
            } else {
                // console.log('没打开过的页面')
            };*/
            // 保存打开的路由名称
            localStorage.setItem('activeRouteName', JSON.stringify({
                name: to.name,
                query: to.query,
                params: to.params
            }));
            next();
        }
    } else {
        console.log(888888)
        // 不存在动态路由的情况下
        fetch('module/list').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                moduleAllList = content.res;
                fetch('module/right/list').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        let data = content.res;
                        let pId = moduleAllList.find(x => x.parentId === 0).id;
                        for (let i of content.res) {
                            if (i.parentId !== 0 && i.parentId !== pId && !data.map(x => x.id).includes(i.parentId)) {
                                data.push(moduleAllList.find(x => x.id === i.parentId));
                            }
                        }
                        let lst = data.sort((a, b) => a.sortNum - b.sortNum).map(moInfo => {
                            return {
                                code: moInfo.code,
                                icon: moInfo.iconUrl,
                                name: moInfo.navUrl,
                                path: moInfo.navUrl,
                                title: moInfo.name,
                                id: moInfo.id,
                                navUrl: moInfo.navUrl,
                                parentId: moInfo.parentId,
                                sortNum: parseInt(moInfo.sortNum),
                                children: []
                            };
                        });
                        getTrees(lst, pId);
                        addRouterArr = JSON.parse(JSON.stringify(getTrees(lst, pId)));
                        addRouterArr.forEach(item => {
                            item.component = () => import('@/views/Main.vue');
                            item.children.forEach(chilItem => {
                                chilItem.component = routerReference[chilItem.path];
                            });
                            item.path = '';
                        });
                        store.state.addRouterList = addRouterArr;//routers
                        store.state.app.routers = [...store.state.app.routers, ...addRouterArr];

                        router.addRoutes(addRouterArr);

                        if (to.name === 'home_index') {
                            console.log('去首页')
                            next();

                        } else {
                            console.log('不是去首页', to.name, localStorage.getItem('activeRouteName'))
                            next({...JSON.parse(localStorage.getItem('activeRouteName'))});

                        };
                    }
                });
            }
        });
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

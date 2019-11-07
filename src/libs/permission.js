    import {fetch} from '../ajax/http';
    import routerReference from './router-reference';
    import {router} from '../router';
    import store from '@/store';

    const getTrees = (list, parentId) => {
        let items = {};
        // 获取每个节点的直属子节点，*是直属，不是所有子节点
        for (let i = 0; i < list.length; i++) {
            let key = list[i].parentId;
            if (items[key]) {
                items[key].push(list[i]);
            } else {
                items[key] = [];
                items[key].push(list[i]);
            }
        }
        return formatTree(items, parentId);
    };
    const formatTree = (items, parentId) => {
        let result = [];
        if (!items[parentId]) {
            return result;
        }
        for (let t of items[parentId]) {
            t.children = formatTree(items, t.id);
            if (t.name.indexOf('/') !== -1) { // 路由存在"/"的在前面拼接'dynamic-router'
                t.name = 'dynamic-router' + t.name.substr(t.name.indexOf('/'));
                t.path = 'dynamic-router' + t.path.substr(t.path.indexOf('/'));
            };
            result.push(t);
        }
        return result;
    };

    const getRoleModuleList = (to, next) => {
        let content = [];
        let moduleAllList = [];
        let addRouterArr = [];
        fetch('module/list').then((res) => {
            content = res.data;
            if (content.status === 200) {
                moduleAllList = content.res;
                store.commit('ALL_MODULE_LIST', res.data.res);
            };
        }).then(() => {
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
                    addRouterArr = JSON.parse(JSON.stringify(getTrees(lst, pId)));
                    // 拼接component
                    addRouterArr.forEach(item => {
                        item.component = () => import('@/views/Main.vue');
                        item.children.forEach(chilItem => {
                            if (typeof routerReference[chilItem.path] === 'undefined') {
                                // 抛出异常路由
                                try {
                                    throw new Error(`not find router name: ${chilItem.path}`)
                                } catch (e) {
                                    console.error(e);
                                };
                            } else if (typeof routerReference[chilItem.path] === 'function') {
                                chilItem.component = routerReference[chilItem.path];
                            } else if (typeof routerReference[chilItem.path] === 'object') {
                                chilItem.meta = routerReference[chilItem.path].meta;
                                chilItem.component = routerReference[chilItem.path].component;
                            };
                        });
                        item.path = '';
                    });
                    store.commit('SET_ADD_ROUTER_LIST', addRouterArr);
                    store.state.app.routers = [...store.state.app.routers, ...addRouterArr];
                    let tagsList = [];
                    let addRouterList = [];
                    addRouterList = JSON.parse(JSON.stringify(store.state.addRouterList));
                    if (addRouterList && addRouterList.length !== 0) {
                        addRouterList.map((item) => {
                            item.children.length <= 1 ? tagsList.push(item.children[0]) : tagsList.push(...item.children);
                        });
                    };
                    store.commit('setTagsList', tagsList);
                    router.addRoutes(addRouterArr);
                    if (to.name === 'home_index') {
                        next();
                    } else {
                        if (to.name === 'error-404') {
                            next({
                                name: to.path.substr(1),
                                path: to.path.substr(1),
                                query: to.query,
                                params: to.params
                            });
                        } else {
                            next();
                        };
                    };
                }
            });
        });
    };
    export default getRoleModuleList;

import axios from 'axios';
import env from '../../build/env';
// import semver from 'semver';
// import packjson from '../../package.json';

let util = {

};

util.title = function (title) {
    title = title || 'Mes admin';
    window.document.title = title;
};

const ajaxUrl = env === 'development'
    ? 'http://localhost:8081'
    : env === 'production'
        ? '/'
        : '/';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000
});

util.get = function (url, params, callback, that) {
    util.ajax.get(url, params).then(function (res) {
        if (res.data.returnCode === '200') {
            callback(res.data);
        } else {
            that.$Modal.error({
                title: '服务端异常',
                content: res.data.message
            });
        }
    }).catch(function (error) {
        that.$Modal.error({
            title: '网络错误',
            content: error
        });
    });
};

util.post = function (url, data, callback, failcallback, that) {
    util.ajax.post(url, data).then(function (res) {
        if (res.data.returnCode === '200') {
            callback(res.data);
        } else {
            that.$Modal.error({
                title: '服务端异常',
                content: res.data.message
            });
            if (failcallback !== null) {
                failcallback(res.data.message);
            }
        }
    }).catch(function (error) {
        that.$Modal.error({
            title: '网络错误',
            content: error
        });
        if (failcallback !== null) {
            failcallback(error);
        }
    });
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
        return util.oneOf(currentAccess, itAccess);
    } else {
        return itAccess === currentAccess;
    }
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query, attr) {
    console.log('参数', name)
    console.log('参数', argu)
    console.log('参数', query)
    console.log('参数', attr)
    // 如果是动态路由，设置页面名称
    let moduleName = '';
    if (name.indexOf('dynamic-router') !== -1) {
        if (vm.$store.state.app.allMenuList && vm.$store.state.app.allMenuList.length !== 0) {
            vm.$store.state.app.allMenuList.forEach((item) => {
                if (`dynamic-router${item.navUrl.substr(item.navUrl.indexOf('/'))}` === `${vm.$route.name}/${vm.$route.params.aId}`) {
                    moduleName = item.name;
                    // 将最新的页面名称缓存下来
                    localStorage.setItem('currentModuleName', item.name);
                };
            });
        } else {
            // 刷新页面时，页面名称取缓存里的
            moduleName = localStorage.getItem('currentModuleName');
        };
    };
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === 'dynamic-router') { // 页面已经打开
            if (name === pageOpenedList[i].name && pageOpenedList[i].argu.aId === attr.params.aId) {
                vm.$store.commit('pageOpenedList', {
                    index: i,
                    argu: argu,
                    query: query
                });
                tagHasOpened = true;
                break;
            }
        } else {
            if (name === pageOpenedList[i].name) {
                vm.$store.commit('pageOpenedList', {
                    index: i,
                    argu: argu,
                    query: query
                });
                tagHasOpened = true;
                break;
            }
        };
        i++;
    }
    if (!tagHasOpened) { // 不存在
        // console.log('所有', vm.$store.state.app.tagsList)
        // console.log('名称', name)

        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                // return name === item.children[0].name;
            } else {
                // return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            moduleName ? tag.title = moduleName : false;
            vm.$store.commit('increateTag', tag);
        }
    }
    // vm.$route.meta.keepAlive = true;// 创建并缓存视图
    // vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

export default util;

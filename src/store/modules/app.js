import {otherRouter, appRouter} from '@/router/router';
import Main from '@/views/Main.vue';
import Util from '@/libs/util';
import Cookies from 'js-cookie';
import Vue from 'vue';
import { fetch } from '../../ajax/http';
Vue.prototype.$fetch = fetch;
const app = {
    state: {
        numberKey: null,
        allMenuList: [],
        cachePage: [],
        lang: '',
        isFullScreen: false,
        openedSubmenuArr: [], // 要展开的菜单数组
        menuTheme: 'dark', // 主题
        themeColor: '',
        pageOpenedList: [{
            title: '首页',
            path: '',
            name: 'home_index'
        }],
        currentPageName: '',
        currentPath: [
            {
                title: '首页',
                path: '',
                name: 'home_index'
            }
        ], // 面包屑数组
        routers: [
            otherRouter,
            ...appRouter,
            // ...JSON.parse(localStorage.getItem('addRouterList'))
        ],
        tagsList: [...otherRouter.children],
        messageCount: 0,
        dontCache: ['text-editor', 'artical-publish'] // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
    },
    mutations: {
        setNumberKey (state, number) {
            state.numberKey = number;
        },
        setAllMenuLsit (state, list) {
            state.allMenuList = list;
        },
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        updateMenulist (state) { /**/
            //      //  const _this = this;
            //      //  let accessCode = parseInt(Cookies.get('access'));
            //      //  let menuList = [];
            //      appRouter.forEach((item, index) => {
            //         // debugger
            //         if (item.access !== undefined) {
            //             if (Util.showThisRoute(item.access, accessCode)) {
            //                 if (item.children.length === 1) {
            //                     menuList.push(item);
            //                 } else {
            //                     let len = menuList.push(item);
            //                     let childrenArr = [];
            //                     childrenArr = item.children.filter(child => {
            //                         if (child.access !== undefined) {
            //                             if (child.access === accessCode) {
            //                                 return child;
            //                             }
            //                         } else {
            //                             return child;
            //                         }
            //                     });
            //                     menuList[len - 1].children = childrenArr;
            //                 }
            //             }
            //         } else {
            //             if (item.children.length === 1) {
            //                 menuList.push(item);
            //             } else {
            //                 let len = menuList.push(item);
            //                 let childrenArr = [];
            //                 childrenArr = item.children.filter(child => {
            //                     if (child.access !== undefined) {
            //                         if (Util.showThisRoute(child.access, accessCode)) {
            //                             return child;
            //                         }
            //                     } else {
            //                         return child;
            //                     }
            //                 });
            //                 if (childrenArr === undefined || childrenArr.length === 0) {
            //                     menuList.splice(len - 1, 1);
            //                 } else {
            //                     let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
            //                     handledItem.children = childrenArr;
            //                     menuList.splice(len - 1, 1, handledItem);
            //                 }
            //             }
            //         }
            //     });
            // state.menuList = menuList;
        },
        changeMenuTheme (state, theme) {
            state.menuTheme = theme;
        },
        changeMainTheme (state, mainTheme) {
            state.themeColor = mainTheme;
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        closePage (state, name) {
            // name是选项卡的路由名称(场景：新增时调整编辑页)
            if (new RegExp('[A-Za-z]+').test(name)) {
                state.cachePage.forEach((item, index) => {
                    if (item === name) {
                        state.cachePage.splice(index, 1);
                    }
                });
            } else { // name是选项卡的下标(场景：选项菜单的关闭事件)
                state.cachePage.splice(name, 1);
            };
        },
        initCachepage (state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },
        removeTag (state, name) {
            // name是选项卡的路由名称(场景：新增时调整编辑页)
            if (new RegExp('[A-Za-z]+').test(name)) {
                state.pageOpenedList.map((item, index) => {
                    if (item.name === name) {
                        state.pageOpenedList.splice(index, 1);
                    }
                });
            } else { // name是选项卡的下标(场景：选项菜单的关闭事件)
                state.pageOpenedList.splice(name, 1);
            };
        },
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
                // Cookies.set('routeName', openedPage.name);
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);

            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        setOpenedList (state) {
            // state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        setAvator (state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang (state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
        clearOpenedSubmenu (state) {
            state.openedSubmenuArr.length = 0;
        },
        setMessageCount (state, count) {
            state.messageCount = count;
        },
        increateTag (state, tagObj) { // 创建tag选项
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            };
            if (tagObj.name === 'dynamic-router') { // 动态路由单独push对象
                state.pageOpenedList.push({
                    name: 'dynamic-router',
                    title: tagObj.title,
                    argu: {
                        aId: tagObj.argu.aId
                    }
                });
            } else {
                state.pageOpenedList.push(tagObj);
            };
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;

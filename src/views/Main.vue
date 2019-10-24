<style lang="less">
    @import "./main.less";
    .logo-bar{
        position: fixed;
        padding: 8px;
        text-align: center;
        top: 0;
        left: 0px;
        z-index: 9999;
        background-color: #495060;
        color: #fff;
        font-size: 20px;
        img{
            height: 44px;
            width: auto;
        }
    }
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div v-if="menuOpenShow" class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <shrinkable-menu
                    :shrink="shrink"
                    @on-change="handleSubmenuChange"
                    :theme="menuTheme"
                    :before-push="beforePush"
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList">
                <!--<div slot="top" class="logo-bar">
                    <div v-show="!shrink" class="flex-left">
                        <img src="../images/menu-logo-min.png" key="min-logo" />
                        <p style="line-height: 50px;font-weight: bold;">{{mainTitle}}</p>
                    </div>
                    <img v-show="shrink" src="../images/menu-logo-min.png" key="min-logo" />
                </div>-->
                <div slot="top" class="logo-con">
                    <img v-show="!shrink" style="padding-right: 8px;" src="../images/menu-logo.png" key="max-logo" />
                    <img v-show="shrink" src="../images/menu-logo-min.png" key="min-logo" />
                </div>
            </shrinkable-menu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="toggleClick">
                        <Icon type="md-menu" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-avator-con">
                    <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
                    <lock-screen></lock-screen>
                    <message-tip v-model="mesCount"></message-tip>
                    <!--<theme-switch></theme-switch>-->
                    <div class="user-dropdown-menu-con" style="width: 155px;">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="md-arrow-dropdown" />
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsActiveName="pageTagsActiveName" :pageTagsList="pageTagsList"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <loading v-show="getLoading"></loading>
                <error-modal
                        :modal-state="getErrorStatus.bErrorStatus"
                        :tip-msg="getErrorStatus.bErrorMsg"
                        :status="getErrorStatus.status"
                ></error-modal>
                <!--<keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>-->
                <!--缓存的视图-->
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive" style="position: relative"></router-view>
                </keep-alive>
                <!--不缓存的视图-->
                <router-view v-if="!$route.meta.keepAlive" style="position: relative">
                </router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
    import tagsPageOpened from './main-components/tags-page-opened.vue';
    import breadcrumbNav from './main-components/breadcrumb-nav.vue';
    import fullScreen from './main-components/fullscreen.vue';
    import lockScreen from './main-components/lockscreen/lockscreen.vue';
    import messageTip from './main-components/message-tip.vue';
    import themeSwitch from './main-components/theme-switch/theme-switch.vue';
    import Cookies from 'js-cookie';
    import Main from '@/views/Main.vue';
    import util from '@/libs/util.js';
    import loading from '../loading/loading';
    import { mapGetters } from 'vuex';
    import errorModal from './components/error-modal/errorModal';
    import iView from 'iview';
    import routerReference from "../libs/router-reference";
    export default {
        components: {
            shrinkableMenu,
            tagsPageOpened,
            breadcrumbNav,
            fullScreen,
            lockScreen,
            messageTip,
            themeSwitch,
            loading,
            errorModal
        },
        data () {
            return {
                mainTitle: process.env.MAIN_TITLE,
                moduleAllList: [],
                menuOpenShow: false,
                menuList: [],
                shrink: false,
                userName: '',
                isFullScreen: false,
                openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
                pageTagsActiveName: '',
                // openedSubmenuArr: Array.of(Cookies.get('addOpenSubmenu'))
            };
        },
        computed: {
            ...mapGetters([
                'getLoading', 'getOrder', 'getErrorStatus', 'returnErrorMsg'
            ]),
            // menuList () {
            //     return this.$store.state.app.menuList;
            // },
            pageTagsList () {
                return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
            },
            currentPath () {
                return this.$store.state.app.currentPath; // 当前面包屑数组
            },
            avatorPath () {
                return localStorage.avatorImgPath;
            },
            cachePage () {
                return this.$store.state.app.cachePage;
            },
            lang () {
                return this.$store.state.app.lang;
            },
            menuTheme () {
                return this.$store.state.app.menuTheme;
            },
            mesCount () {
                return this.$store.state.app.messageCount;
            }
        },
        methods: {
            init () {
                let pathArr = util.setCurrentPath(this, this.$route.name);
                this.$store.commit('updateMenulist');
                if (pathArr.length >= 2) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                }
                this.userName = Cookies.get('user');
                let messageCount = 3;
                this.messageCount = messageCount.toString();
                this.checkTag(this.$route.name);
                this.$store.commit('setMessageCount', 3);
            },
            toggleClick () {
                this.shrink = !this.shrink;
            },
            handleClickUserDropdown (name) {
                if (name === 'ownSpace') {
                    util.openNewPage(this, 'ownspace_index');
                    this.$router.push({
                        name: 'ownspace_index'
                    });
                } else if (name === 'loginout') {
                    // 退出登录
                    // Cookies.remove('token');
                    Cookies.remove('routeName');
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({
                        name: 'login'
                    });
                    setTimeout(function () {
                        iView.LoadingBar.finish();
                    }, 0);
                }
            },
            checkTag (name) {
                let openpageHasTag = this.pageTagsList.some(item => {
                    if (item.name === name) {
                        return true;
                    }
                });
                if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                    util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
                }
            },
            handleSubmenuChange (selectRouterName) {
            },
            beforePush (name) {
                // if (name === 'accesstest_index') {
                //     return false;
                // } else {
                //     return true;
                // }
                return true;
            },
            fullscreenChange (isFullScreen) {},
            getModel () {
                const _this = this;
                this.$fetch('module/list').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.moduleAllList = content.res;
                        _this.getMenuList();
                    }
                });
            },
            getMenuList () {
                const _this = this;
                this.$fetch('module/right/list').then(res => {
                    this.$store.commit('setAllMenuLsit', res.data.res);
                    let content = res.data;
                    if (content.status === 200) {
                        let data = content.res;
                        let pId = this.moduleAllList.find(x => x.parentId === 0).id;
                        for (let i of content.res) {
                            if (i.parentId !== 0 && i.parentId !== pId && !data.map(x => x.id).includes(i.parentId)) {
                                data.push(_this.moduleAllList.find(x => x.id === i.parentId));
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
                        this.getTrees(lst, pId);
                        let arr = JSON.parse(JSON.stringify(this.getTrees(lst, pId)));
                        arr.forEach(item => {
                            item.component = () => import('@/views/Main.vue');
                            item.children.forEach(chilItem => {
                                chilItem.component = routerReference[chilItem.path];
                            });
                            item.path = ''
                        });
                        localStorage.setItem('addRouterList', JSON.stringify(arr));
                        console.log('路由后', arr)
                        this.menuList = arr;
                        // this.$router.options.routes = this.getTrees(lst, pId);
                        this.$router.addRoutes(arr);





                        this.menuOpenShow = true;
                    }
                });
            },
            getTrees (list, parentId) {
                let items = {};
                // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;
                    if (items[key]) {
                        items[key].push(list[i]);
                    } else {
                        items[key] = [];
                        items[key].push(list[i]);
                    }
                }
                return this.formatTree(items, parentId);
            },
            formatTree (items, parentId) {
                let result = [];
                if (!items[parentId]) {
                    return result;
                }
                for (let t of items[parentId]) {
                    t.children = this.formatTree(items, t.id);
                    if (t.name.indexOf('/') !== -1) { // 路由存在"/"的在前面拼接'dynamic-router'
                        t.name = 'dynamic-router' + t.name.substr(t.name.indexOf('/'));
                        t.path = 'dynamic-router' + t.path.substr(t.path.indexOf('/'));
                    };
                    result.push(t);
                }
                return this.menuList = result;
            }
        },
        watch: {
            '$route' (to) {
                if (to.name === 'dynamic-router') {
                    // this.pageTagsActiveName = to.path.substr(1);
                    this.pageTagsActiveName = `${to.name}/${to.params.aId}`;
                } else {
                    this.pageTagsActiveName = to.name;
                };
                if (to.name === 'home_index') {
                    Cookies.set('moduleCode', '');
                }
                this.$store.commit('setCurrentPageName', to.name);
                // Cookies.set('routeName', to.name);
                let pathArr = util.setCurrentPath(this, to.name);
                if (pathArr.length > 1) {
                    this.$store.commit('addOpenSubmenu', pathArr[1].name);
                    // Cookies.set('addOpenSubmenu', pathArr[1].name);
                }
                this.checkTag(to.name);
                localStorage.currentPageName = to.name;
            },
            lang () {
                util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
            }
        },
        mounted () {
            window.addEventListener('resize', () => {
                let Height = document.getElementsByClassName('single-page-con')[0].offsetHeight;
                this.$store.dispatch({type: 'calManiViewHeight', payload: Height});
                this.$store.commit('UPDATE_DOCUMENT_HEIGHT', Height);
            })
            this.init();
            this.getModel();
        },
        created () {
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
        }
    };
</script>

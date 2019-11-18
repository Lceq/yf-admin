<style lang="less">
    @import './styles/menu.less';
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <sidebar-menu
                v-show="!shrink"
                :menu-theme="theme"
                :menu-list="menuList"
                :active-name="$route.name==='dynamic-router'?`${$route.name}/${$route.params.aId}`:$route.name"
                @on-change="handleChange"
        ></sidebar-menu>
        <sidebar-menu-shrink
                v-show="shrink"
                :menu-theme="theme"
                :menu-list="menuList"
                :icon-color="shrinkIconColor"
                @on-change="handleChange"
        ></sidebar-menu-shrink>
    </div>
</template>

<script>
    import sidebarMenu from './components/sidebarMenu.vue';
    import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    export default {
        name: 'shrinkableMenu',
        components: {
            sidebarMenu,
            sidebarMenuShrink
        },
        props: {
            shrink: {
                type: Boolean,
                default: false
            },
            menuList: {
                type: Array,
                required: true
            },
            theme: {
                type: String,
                default: 'dark',
                validator (val) {
                    return util.oneOf(val, ['dark', 'light']);
                }
            },
            beforePush: {
                type: Function
            },
            openNames: {
                type: Array
            }
        },
        computed: {
            bgColor () {
                return this.theme === 'dark' ? '#495060' : '#fff';
            },
            shrinkIconColor () {
                return this.theme === 'dark' ? '#fff' : '#495060';
            }
        },
        methods: {
            handleChange (path) {
                let allModuleList = this.$store.state.allModuleList;
                let moduleItem = {};
                allModuleList.forEach(item => {
                    if (path === item.navUrl) {
                        moduleItem = item;
                    };
                });
                // 根据tag判断是内部还是外部项目(内部走router,外部走链接跳转)
                if (moduleItem.tag === 'mes1' || !moduleItem.tag) {
                    let willpush = true;
                    if (this.beforePush !== undefined) {
                        if (!this.beforePush(path)) willpush = false;
                    }
                    if (willpush) {
                        if (path.indexOf('/') !== -1) { // 如果是动态页面
                            this.$router.push({
                                name: 'dynamic-router',
                                params: {
                                    aId: path.substr(path.indexOf('/') + 1),
                                    query: {
                                        activated: true // true刷新缓存
                                    }
                                }
                            });
                        } else {
                            this.$router.push({
                                name: path,
                                query: {
                                    activated: true // true刷新缓存
                                }
                            });
                        };
                    }
                } else {
                    try {
                        if (moduleItem.navFullUrl.indexOf('?') !== -1) {
                            moduleItem.navFullUrl = moduleItem.navFullUrl + `&token=${Cookies.get('token')}`;
                            window.location.href = moduleItem.navFullUrl;
                        } else {
                            if (moduleItem.navFullUrl) {
                                moduleItem.navFullUrl = moduleItem.navFullUrl + `?token=${Cookies.get('token')}`;
                                window.location.href = moduleItem.navFullUrl;
                            } else {
                                this.$Message.error('模块尚未配置!');
                            };
                        };
                    } catch (e) {
                        throw new Error('invalid link');
                    }
                };
                // this.$route.meta.keepAlive = false; // 通过左侧菜单跳转的路由都走不缓存的视图view
                this.$emit('on-change', path);
            }
        }
    };
</script>

<style lang="less">
    @import '../styles/menu.less';
</style>

<template>
    <Menu class="rePosition" ref="sideMenu" :active-name="activeName" :open-names="openNames" :theme="menuTheme" width="auto" @on-select="changeMenu" accordion >
        <template v-if="menuList[0].path !== undefined" v-for="item in menuList">
            <Submenu :name="item.name" :key="item.code">
                <template slot="title">
                    <!--<Icon class="iconSize" :type="item.icon" :size="iconSize"></Icon>-->
                    <Icon v-if="item.icon.indexOf('sh-iconfont') === -1" class="iconSize" :type="item.icon" :size="iconSize"/>
                    <Icon v-if="item.icon.indexOf('sh-iconfont') !== -1" class="iconSize" :custom="item.icon" :size="iconSize"/>
                    <span v-if="itemName(item).indexOf('b-') !== -1" class="layout-text" style="color:#ccc">{{ itemTitle(item) }}</span>
                    <span v-if="itemName(item).indexOf('b-') === -1" class="layout-text">{{ itemTitle(item) }}</span>
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.path">
                        <!--<Icon class="iconSize" :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>-->
                        <Icon v-if="child.icon.indexOf('sh-iconfont') === -1 && itemName(child).indexOf('b-') !== -1" style="color:  #999"  class="iconSize" :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <Icon v-if="child.icon.indexOf('sh-iconfont') === -1 && itemName(child).indexOf('b-') === -1" class="iconSize" :type="child.icon" :size="iconSize" :key="'icon' + child.name"></Icon>
                        <!--<Icon v-if="item.icon.indexOf('sh-iconfont') === -1" class="iconStyle" :type="item.icon" :size="iconSize"/>-->
                        <Icon v-if="child.icon.indexOf('sh-iconfont') !== -1 && itemName(child).indexOf('b-') !== -1"  style="color:  #999" class="iconSize" :custom="child.icon" :size="iconSize" :key="'icon' + child.name"/>
                        <Icon v-if="child.icon.indexOf('sh-iconfont') !== -1 && itemName(child).indexOf('b-') === -1" class="iconSize" :custom="child.icon" :size="iconSize" :key="'icon' + child.name"/>
                        <span v-if="itemName(child).indexOf('b-') !== -1"  style="color: #999" class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                        <span v-if="itemName(child).indexOf('b-') === -1" class="layout-text" :key="'title' + child.name">{{ itemTitle(child) }}</span>
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>
<script>
// import Cookies from 'js-cookie';
export default {
    name: 'sidebarMenu',
    props: {
        menuList: Array,
        iconSize: Number,
        menuTheme: {
            type: String,
            default: 'dark'
        },
        activeName: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            moduleCode: ''
            // routeName: ''
            // routeName: Cookies.get('routeName')
        };
    },
    computed: {
        rightRoute () {
            // return this.store.state.
        }
    },
    watch: {
        activeName (name) {
            this.$nextTick(() => {
                this.$refs.sideMenu.updateOpened();
                this.$refs.sideMenu.updateActiveName();
                // console.log(this.openNames);
            });
            // debugger
            if (name === 'home_index' || name === 'home') {
                this.openNames = [];
            } else {
                // this.openedNames = this.getOpenedNamesByActiveName(name);
                // this.openedNames = name.split(' ');
                // this.openNames = [this.$route.matched[0].name];
                this.openNames = this.$route.matched[0].name.split(' ');

                // this.$nextTick(() => {
                //     this.$refs.sideMenu.updateOpened();
                //     this.$refs.sideMenu.updateActiveName();
                //     // this.$refs.sideMenu.updateOpened();
                //     console.log(this.openNames);
                // });
            }
            // console.log(this.openNames);
            // setTimeout(() => {
            //     this.openNames = this.$route.matched[0].name.split(' ');
            // }, 10);
            // console.log(this.openNames);
        }
        // openedNames (newNames) {
        // debugger
        // this.openNames = newNames;
        // }
    },
    created () {
        // debugger
        if (this.activeName === 'home_index' || this.activeName === 'home') {
            this.openNames = [];
        } else {
            this.openNames = this.$route.matched[0].name.split(' ');
        }
    },
    methods: {
        getUnion (arr1, arr2) {
            return Array.from(new Set([...arr1, ...arr2]));
        },
        changeMenu (active) {
            this.routeName = active;
            this.$emit('on-change', active);
        },
        changeSupMenu (val) {
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        },
        itemName (item) {
            if (typeof item.name === 'object') {
                return this.$t(item.name.i18n);
            } else {
                return item.name;
            }
        }
    },
    updated () {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                // this.$refs.sideMenu.updateOpened();
            }
        });
    }
};
</script>
<style scoped>
.rePosition{
    position: relative;
    top: 66px;
    left: 0;
}
.iconSize{
    width:10px;
    /*height: 10px;*/
    vertical-align: middle;
}
.iconSize:before{
    width: 10px;
}
.layout-text{
    padding-left: 5px;
    vertical-align: middle;
}
</style>

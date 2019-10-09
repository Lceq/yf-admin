<template>
    <div>
        <template v-if="menuList[0].path !== undefined" v-for="(item, index) in menuList">
            <div class="rePosition"  style="text-align: center;" :key="index">
                <Dropdown transfer  placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                        <!--<Icon :size="20" :color="iconColor" :type="item.icon"></Icon>-->
                        <!--<Icon :size="20" :color="iconColor" :type="item.icon"></Icon>-->
                        <Icon v-if="item.icon.indexOf('sh-iconfont') === -1" class="iconColor" :color="iconColor" :type="item.icon" :size="20"/>
                        <Icon v-if="item.icon.indexOf('sh-iconfont') !== -1" class="iconColor" :color="iconColor" :custom="item.icon" :size="20"/>
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.path" :key="i">
                                <!--<Icon :type="child.icon"></Icon>-->
                                <Icon v-if="child.icon.indexOf('sh-iconfont') === -1" :type="child.icon" />
                                <Icon v-if="child.icon.indexOf('sh-iconfont') !== -1" :custom="child.icon" />
                                <span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'grey'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
            Cookies.set('routeName', active);
            // this.getRightUserByUrl(active);
        },
        // getRightUserByUrl (navUrl) {
        //     if (navUrl === 'home_index') {
        //         return false;
        //     }
        //     // this.$post('right/users', {navUrl: navUrl}).then(res => {
        //     //     let content = res.data;
        //     //     if (content.status === 200) {
        //     //         this.$store.commit('UPDATE_MENU_RIGHTS', content.res);
        //     //     }
        //     // });
        // },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    },
    created () {
        // debugger
        // this.getRightUserByUrl(Cookies.get('routeName'));
    }
};
</script>
<style scoped>
.iconColor{
    color: #aaa!important;
}
.rePosition{
    position: relative;
    top: 66px;
    left: 0;
}
</style>

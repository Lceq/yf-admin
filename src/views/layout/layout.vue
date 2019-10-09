<template>
    <Card>
        <div class="layout">
            <div class="layout-menu">
                <!--<div class="layout-title">-->
                <!--<div><span class="mes-type-btn-text">{{ tabTitle }}</span></div>-->
                <!--</div>-->
                <div class="layout-list" :class="item.id === curTabStateId ? 'curTabStyle' : ''" v-for="(item, index) of stateList">
                    <div @click="setCurrentMesType(item)" class="layout-list-item"><span class="mes-type-btn-text">{{ item.name }}</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="item.count"></Badge></div>
                </div>
            </div>
            <div class="layout-content">
                <slot name="content"></slot>
            </div>
        </div>
    </Card>
</template>

<script>
// import { completionState } from '../../libs/utils';
export default {
    name: 'layout',
    props: {
        stateList: {
            type: Array
        },
        tabTitle: {
            type: String
        },
        curTabStateId: {
            type: Number,
            default: '0'
        }
    },
    data () {
        return {
        };
    },
    methods: {
        setCurrentMesType (item) {
            // this.curTabId = item.id;
            this.$emit('on-select', item);
        }
    },
    mounted () {
    }
};
</script>
<style scoped>
    @import 'layout.less';
</style>


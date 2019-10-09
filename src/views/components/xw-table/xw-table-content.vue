<template>
    <div>
        <div class="parentFlexBetween">
            <div class="xw-table-title" v-for="item of tableTitle" :style="'minWidth:' + item.minWidth">{{ item.title }}</div>
        </div>
        <div class="table-list-bar" :style="'height:' + height + 'px'">
            <div id="table-list-height">
                <div v-for="item of tableList" class="parentFlexBetween" :style="'top:' + top + 'px'">
                    <div  class="xw-table-list" v-for="(title, index) of tableTitle" :style="'minWidth:' + item.minWidth">
<!--                        <div v-if="title.key !== 'qty' && title.key !== 'number'">{{ item[title.key] }}</div>-->
                        <Input @on-focus="focusSubmit(title.key, index)" v-if="title.key === 'qty' || title.key === 'number'" v-model="item[title.key]"></Input>
                        <div v-else>{{ item[title.key] }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'xw-table-title',
    props: {
        height: {
            type: Number,
            default: 200
        },
        tableTitle: {
            type: Array,
            default: []
        },
        tableList: {
            type: Array,
            default: []
        },
        changeTableState: {
            type: Boolean,
            default: false
        },
        // fullFullCreen: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data () {
        return {
            top: 0
            // tableList: []
        };
    },
    methods: {
        getTableTurn (val) {
        },
        focusSubmit (key, index) {
            debugger
            this.$emit('focusSubmit', key, index);
        }
    },
    mounted () {
    },
    watch: {
        changeTableState (newData, oldData) {
            if (newData) {
                this.$nextTick(function () {
                    this.tableList = this.tableTitleList;
                });
            }
        }
        // this.changeTableState = true;
    }
};
</script>

<style scoped>
.parentFlexBetween{
    /*display: flex;*/
    /*justify-content: space-around;*/
    position: relative;
    font-size: 16px;
}
.xw-table-title{
    width: 100%;
    background-color: #f1f1f1;
    font-weight: bold;
    padding: 5px 5px;
    border: 1px solid #999999;
    border-left: none;
    text-align: center;
}
.xw-table-title:first-child{
    border-left: 1px solid #999999;
}
.xw-table-list{
    font-size: 14px;
    width: 100%;
    padding: 8px 5px;
    border: 1px solid #999999;
    border-left: none;
    overflow: hidden;
    word-wrap: break-word;
    word-break: normal;
    border-top: none;
    text-align: center;
}
.xw-table-list:last-child{
    /*border-right: none;*/
}
.xw-table-list:first-child{
    border-left: 1px solid #999999;
}
.table-list-bar{
    /*border-bottom: 1px solid #999999;*/
    /*border-left: 1px solid #999999;*/
    /*border-right: 1px solid #999999;*/
    overflow: overlay;
}
#table-list-height{
    /*position: relative;*/
    /*left: 0;*/
    /*transition: 2s;*/
    /*transform: 5s;*/
}
</style>
<template>
    <div :style="'height:' + height + 'px'">
        <div class="parentFlexBetween">
<!--            <div id="xw-table-title" class="xw-table-title" v-for="item of tableTitle" :style="'minWidth:' + item.minWidth">{{ item.title }}</div>-->
            <Row style="width: 100%; display: -webkit-box">
                <Col v-for="(item, index) of tableTitle" :key="index" class="xw-table-title" id="xw-table-title" :span="item.span">{{ item.title }}</Col>
            </Row>
        </div>
        <div class="table-list-bar" :style="'height:' + tHeight + 'px;'">
            <div id="table-list" :style="'top:' + top + 'px'">
                <Row class="xw-table-row" style="width: 100%; height: 100%;display: -webkit-box" v-for="(item, index) of tableList" :key="index">
                    <Col class="xw-table-list" v-for="(title, index) of tableTitle" :key="index" :style="'text-align:' + title.align" :span="title.span">{{ title.key === 'isAbsenteeism' ? '是' : item[title.key] }}</Col>
                </Row>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        turn: {
            type: Boolean
        },
        value: {
            type: Boolean
        },
        height: {
            type: Number,
            default: 0
        },
        top: {
            type: Number,
            default: 0
        },
        tableTitle: {
            type: Array,
            default: []
        },
        tableList: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            // top: 0,
            tHeight: '',
            tableMiddleList: []
        };
    },
    methods: {
        getTurn () {
            this.$nextTick(() => {
                let height = document.getElementById('table-list').clientHeight;
                // debugger
                let hei = document.getElementById('xw-table-title').clientHeight;
                this.tHeight = this.height - hei;
                let value = this.height - height - hei;
                // let value = this.height - height;
                this.$emit('topTurn', value);
            });
        }
    },
    mounted () {
    },
    watch: {
        turn (newData, oldData) {
            if (newData) {
                this.getTurn();
            }
        },
        value (newData, oldData) {
            if (newData) {
                this.getTurn();
            }
        }
    }
};
</script>

<style scoped>
.parentFlexBetween{
    /*display: flex;*/
    /*justify-content: space-around;*/
    position: relative;
    font-size: 16px;
    width: 100%;
}
.xw-table-title{
    /*width: 100%;*/
    background-color: #5B657E;
    font-weight: bold;
    padding: 10px 5px;
    font-size: 28px;
    /*border: 1px solid #999999;*/
    border-left: none;
    text-align: center;;
}
.xw-table-title:first-child{
    /*border-left: 1px solid #999999;*/
}
.xw-table-row{
    border-right: 1px solid #5B657E;
    border-bottom: 1px solid #5B657E;
}
#table-list{
    position: relative;
    left: 0;
}
.xw-table-list{
    font-size: 28px;
    /*width: 100%;*/
    /*display: block;*/
    /*height: 100%;*/
    word-break: break-all;
    padding: 12px 5px;
    border-right: 1px solid #5B657E;
    /*border-bottom: 1px solid #5B657E;*/
    /*border-left: none;*/
    overflow: hidden;
    word-wrap: break-word;
    /*word-break: normal;*/
    border-top: none;
    text-align: center;
}
#xw-table-row .xw-table-list:last-child{
    border-right: none;
}
.table-list-bar{
    /*border-bottom: 1px solid #999999;*/
    /*border-left: 1px solid #999999;*/
    /*border-right: 1px solid #999999;*/
    overflow: hidden;
}
#table-list-height{
    position: relative;
    left: 0;
    transition: 2s;
    /*transform: 5s;*/
}
.parent-around{
    display: flex;
    justify-content: space-around;
}
</style>

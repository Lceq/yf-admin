<template>
    <div>
        <div class="parentFlexBetween">
            <div class="xw-table-title" v-for="item of tableTitle" :style="'minWidth:' + item.minWidth">{{ item.title }}</div>
        </div>
        <div class="table-list-bar" :style="'height:' + height + 'px'">

            <div id="table-list-height" :style="'top:' + top + 'px'">
                <div v-for="item of tableList" class="parentFlexBetween">
                    <div class="xw-table-list" v-for="title of tableTitle" :style="'minWidth:' + item.minWidth">{{ item[title.key] }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'xw-table-title',
    props: {
        name: {
            type: Boolean
        },
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
        fullFullCreen: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            top: 0,
            tableMiddleList: []
        };
    },
    methods: {
        getTableTurn (val) {
            this.top = 0;
            const _this = this;
            const timer = setInterval(() => {
                if (this.top > val) {
                    _this.top += val / 160;
                } else {
                    clearTimeout(timer);
                }
            }, 100);
            setTimeout(() => {
                timer();
            }, 3000);
        }
    },
    mounted () {
    },
    watch: {
        fullFullCreen (newData, oldData) {
            this.$nextTick(() => {
                let tableHeight = document.getElementById('table-list-height').offsetHeight;
                let val = this.height - tableHeight;
                this.tableMiddleList = this.tableList;
                if (val < 0) {
                    this.getTableTurn(val);
                }
            });
        },
        name (newData, oldData) {
            this.top = 0;
            if (newData) {
                this.$nextTick(() => {
                    this.tableMiddleList = this.tableList;
                    this.tableList = [];
                    this.tableList = this.tableMiddleList;
                    let tableHeight = document.getElementById('table-list-height').offsetHeight;
                    let val = this.height - tableHeight;
                    this.tableMiddleList = this.tableList;
                    // console.log(this.top);
                    if (val < 0) {
                        this.getTableTurn(val);
                    }
                });
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
}
.xw-table-title{
    width: 100%;
    background-color: #f1f1f1;
    font-weight: bold;
    padding: 15px 5px;
    font-size: 16px;
    border: 1px solid #999999;
    border-left: none;
    text-align: center;
}
.xw-table-title:first-child{
    border-left: 1px solid #999999;
}
.xw-table-list{
    font-size: 16px;
    width: 100%;
    padding: 12px 5px;
    border: 1px solid #999999;
    border-left: none;
    overflow: hidden;
    word-wrap: break-word;
    word-break: normal;
    border-top: none;
    text-align: center;
}
.xw-table-list:last-child{
    border-right: none;
}
.table-list-bar{
    border-bottom: 1px solid #999999;
    border-left: 1px solid #999999;
    border-right: 1px solid #999999;
    overflow: hidden;
}
#table-list-height{
    position: relative;
    left: 0;
    transition: 2s;
    /*transform: 5s;*/
}
</style>

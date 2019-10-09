<template>
    <div>
        <div class="parentFlexBetween marginBottom">
            <div>
                <span class="">车间：</span>
                <Select class="formWidth textLeft" clearable v-model="workshopId">
                    <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
            </div>
            <!--<Button type="primary" shape="circle" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>-->
        </div>
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
    </div>
</template>

<script>
export default {
    name: 'name1',
    props: {
        workshopId: {
            type: Number
        },
        workshopList: {
            type: Array
        },
        height: {
            type: Number
        }
    },
    data () {
        return {
            top: 0,
            // workshopId: '',
            // workshopList: [],
            tableTitle: [
                {
                    title: '订单号',
                    key: 'prdOrderCode',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '产品',
                    key: 'productCode',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '纸管颜色',
                    key: 'paperTubeName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '腰绳颜色',
                    key: 'waistRopeName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '缝口颜色',
                    key: 'packingModeName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '编织袋规格',
                    key: 'packingBag',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '订单数量(Kg)',
                    key: 'productionQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '完成数量(Kg)',
                    key: 'completionQty',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '未完成数量(Kg)',
                    key: 'onCompletionQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '当班数量(Kg)',
                    key: 'totalQty',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '当班班组',
                    key: 'groupName',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            tableList: [
                {
                    prdOrderCode: '124123'
                }
            ]
        };
    },
    methods: {
        getPackCompoment () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('pack.report.list3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableList = content.res.map(x => {
                        x.paperTubeName = x.prdOrderPackingEntity.paperTubeName;
                        x.waistRopeName = x.prdOrderPackingEntity.waistRopeName;
                        x.packingModeName = x.prdOrderPackingEntity.packingModeName;
                        x.packingBag = x.prdOrderPackingEntity.packingBag;
                        return x;
                    });
                    this.tableList = this.tableList.concat(this.tableList).concat(this.tableList).concat(this.tableList).concat(this.tableList).concat(this.tableList).concat(this.tableList);
                }
            });
        },
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
    watch: {
        isName1 (newData, oldData) {
            if (newData) {
                console.log(this.tableList);
                debugger
                let tableHeight = document.getElementById('table-list-height').offsetHeight;
                let val = this.height - tableHeight;
                console.log(val);
                if (val < 0) {
                    this.getTableTurn(val);
                }
            } else {
                this.getPackCompoment();
                this.top = 0;
            }
        }
    },
    mounted () {
        this.getPackCompoment();
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

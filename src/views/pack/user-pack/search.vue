<template>
    <div>
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Table :height="tableHeight" border :data="packSearchList" :columns="packSearchColumns"></Table>
        <left-right
            v-if="leftRightShow"
            :pageTotal="pageTotal"
            :value="valueNumber"
            @leftRightClick="leftRightClick"
        ></left-right>
    </div>
</template>
<script>
import leftRight from './left-right';
import changeTime from './change-time';
import {curDate} from '../../../libs/tools';
export default {
    name: 'search',
    components: {
        leftRight,
        changeTime
    },
    props: {
        isSearchShow: {
            type: Boolean,
            default: false
        },
        loginMes: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            valueNumber: 1,
            tableHeight: '',
            leftRightShow: true,
            curTime: '',
            packSearchList: [
                {
                    belongDate: '2019-6-21',
                    groupName: '后纺甲班',
                    orderCode: '20190621',
                    productCode: 'T/R 65？35 40S',
                    batchCode: '20190621',
                    productNum: '3121911',
                    completeQty: '20111',
                    unCompleteQty: '201121',
                    time: '2019-6-21',
                    groupQty: '123123'
                }
            ],
            packSearchColumns: [
                {
                    title: '报工日期',
                    key: 'date',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '生产订单号',
                    key: 'prdOrderCode',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '产品',
                    key: 'productName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '订单数量(Kg)',
                    key: 'productionQty',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '完成数量(Kg)',
                    key: 'completionQty',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '未完成数量(Kg)',
                    key: 'onCompletionQty',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '预期交货时间',
                    key: 'deliveryDateTo',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '当班数量(Kg)',
                    key: 'totalQty',
                    minWidth: 90,
                    align: 'center'
                }
            ],
            pageIndex: 1,
            pageTotal: 1
        };
    },
    methods: {
        getLastNextDay (val) {
            this.curTime = val;
            this.pageIndex = 1;
            this.leftRightShow = false;
            setTimeout(() => {
                this.valueNumber = 1;
                this.leftRightShow = true;
            }, 10);
            this.getSearchList();
            // debugger
        },
        leftRightClick (val) {
            this.pageIndex = val;
            this.getSearchList();
        },
        getSearchList () {
            let params = {
                groupId: this.loginMes[0].groupId,
                date: this.curTime,
                workshopId: this.loginMes[0].workshopId,
                pageIndex: this.pageIndex,
                pageSize: 8
            };
            this.$call('pack.report.list2', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.pageTotal = Math.ceil(content.count / 8);
                    this.packSearchList = content.res;
                }
            });
        }
    },
    watch: {
        isSearchShow (newData, oldData) {
            if (newData) {
                this.curTime = curDate();
                this.getSearchList();
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableHeight = document.documentElement.clientHeight - 270;
            this.tableHeight = window.screen.height - 270;
        });
        window.onresize = () => {
            this.tableHeight = window.screen.height - 270;
        };
    }
};
</script>

<style scoped>

</style>
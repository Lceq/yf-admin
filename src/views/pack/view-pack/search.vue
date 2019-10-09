<template>
    <div id="view-pack" style="padding: 30px;">
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Table :height="tableHeight" border :data="packSearchList" :columns="packSearchColumns"></Table>
        <left-right
            :pageTotal="pageTotal"
            :pageIndex="pageIndex"
            @leftRightClick="leftRightClick"
        ></left-right>
    </div>
</template>
<script>
    import leftRight from './left-right';
    import changeTime from './change-time';
    import {curDate} from '../../../libs/tools';
    export default {
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
                type: Array
            }
        },
        data () {
            return {
                pageIndex: 1,
                tableHeight: '',
                leftRightShow: true,
                curTime: curDate(),
                packSearchList: [],
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
                pageTotal: 1
            };
        },
        methods: {
            getLastNextDay (val) {
                this.curTime = val;
                this.pageIndex = 1;
                this.leftRightShow = false;
                this.getSearchList();
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
                    pageSize: 12
                };
                this.$call('pack.report.list2', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.pageTotal = Math.ceil(content.count / 12);
                        this.packSearchList = content.res;
                    }
                });
            }
        },
        watch: {
            watch: {
                loginMes (newData, oldData) {
                    this.curTime = this.loginMes[0].date;
                    this.getSearchList();
                }
            },
            isSearchShow (newData, oldData) {
                if (newData) {
                    this.getSearchList();
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.tableHeight = window.screen.height - 300;
            });
            window.onresize = () => {
                this.tableHeight = window.screen.height - 300;
            };
        }
    };
</script>

<style scoped>

</style>

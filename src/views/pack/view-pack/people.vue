<template>
    <div style="padding: 30px;" id="view-pack">
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Table :height="tableHeight" border :data="tableData" :columns="tableHeader"></Table>
        <left-right
                :pageTotal="pageTotal"
                :value="valueNumber"
                @leftRightClick="leftRightClick"
        ></left-right>
    </div>
</template>

<script>
    import changeTime from './change-time';
    import leftRight from './left-right';
    import {curDate} from '../../../libs/tools';
    import {breakUpList} from "../../../libs/tools";

    export default {
        name: 'people',
        components: {
            changeTime,
            leftRight
        },
        props: {
            isPeopleShow: {
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
                leftRightShow: true,
                tableHeight: '',
                tableData: [
                    {
                        belongDate: '2019-6-21',
                        groupName: '后纺甲班',
                        userName: '张三',
                        productCode: 'T/R 65？35 40S',
                        completeQty: '20111',
                        unCompleteQty: '201121'
                    }
                ],
                tableHeader: [
                    {
                        title: '人员编号',
                        key: 'reporterCode',
                        minWidth: 110,
                        align: 'center'
                    },
                    {
                        title: '姓名',
                        key: 'reporterName',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 110,
                        align: 'center'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '已投包数',
                        key: 'packNumber',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '已投重量',
                        key: 'reportQty',
                        minWidth: 100,
                        align: 'center'
                    }
                    // {
                    //     title: '操作',
                    //     key: 'operation',
                    //     minWidth: 90,
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         return h('Button', {
                    //             props: {
                    //                 size: 'small'
                    //             },
                    //             on: {
                    //                 'click': () => {
                    //                     alert()
                    //                 }
                    //             }
                    //         }, '详情');
                    //     }
                    // }
                ],
                pageIndex: 1,
                pageTotal: 1,
                curTime: '',
                peopleListTotal: []
            };
        },
        watch: {
            loginMes (newData, oldData) {
                this.curTime = this.loginMes[0].date;
                this.getUserList();
            },
            isPeopleShow (newData, oldData) {
                if (newData) {
                    this.getUserList();
                }
            }
        },
        methods: {
            leftRightClick (val) {
                this.pageIndex = val;
                this.valueNumber = val;
                this.tableData = this.peopleListTotal[val - 1];
            },
            getLastNextDay (val) {
                this.valueNumber = 1;
                this.pageIndex = 1;
                this.curTime = val;
                this.getUserList();
            },
            getUserList () {
                let params = {
                    groupId: this.loginMes[0].groupId,
                    date: this.curTime
                };
                this.$call('pack.report.user.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.pageTotal = Math.ceil(content.res.length / 11);
                        this.peopleListTotal = breakUpList(content.res, 11);
                        this.tableData = this.peopleListTotal[0];
                    }
                });
            }
        },
        mounted () {
            this.getUserList();
            this.$nextTick(() => {
                this.tableHeight = window.screen.height - 340;
            });
            window.onresize = () => {
                this.tableHeight = window.screen.height - 340;
            };
        }
    };
</script>

<style scoped>
    .pack-size{
        font-size: 24px;
        margin-bottom: 10px;
    }
    .pack-size span {
        color: crimson;
    }
    .report-bar {
        width: 25%;
        display: inline-block;
    }
    .report-title{
        font-size: 24px;
    }
    .report-text {
        font-size: 16px;
    }
</style>

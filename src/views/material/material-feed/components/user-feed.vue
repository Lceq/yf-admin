<template>
    <div style="padding: 30px;" id="view-pack">
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Table :height="tableHeight" border :data="tableData" :columns="tableHeader" :loading="tableLoading"></Table>
       <!-- <left-right
                :pageTotal="pageTotal"
                :value="valueNumber"
                @leftRightClick="leftRightClick"
        ></left-right>-->
    </div>
</template>
<script>
    import {toDay} from '../../../../libs/common';
    import leftRight from '../../../pack/view-pack/left-right';
    import changeTime from '../../../pack/view-pack/change-time';
    export default {
        name: 'people',
        components: {changeTime, leftRight},
        props: {
            isUserFeed: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                loginMes: [],
                tableLoading: false,
                valueNumber: 1,
                leftRightShow: true,
                tableHeight: '',
                tableData: [],
                tableHeader: [
                    {
                        title: '人员编号',
                        key: 'userCode',
                        minWidth: 110
                    },
                    {
                        title: '姓名',
                        key: 'userName',
                        minWidth: 100
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 110
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        minWidth: 100
                    },
                    {
                        title: '已投量',
                        key: 'weightQty',
                        minWidth: 100,
                        align: 'right'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        minWidth: 90,
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                on: {
                                    'click': () => {
                                        this.$emit('to-user-feed-detail', params.row);
                                    }
                                }
                            }, '详情');
                        }
                    }
                ],
                pageIndex: 1,
                pageTotal: 1,
                curTime: toDay()
            };
        },
        watch: {
            loginMes (newData, oldData) {
                this.curTime = this.loginMes[0].date;
                // this.getUserList();
            },
            isUserFeed (newData, oldData) {
                if (newData) {
                    this.getUserList();
                }
            }
        },
        methods: {
            leftRightClick (val) {
                this.pageIndex = val;
                this.valueNumber = val;
            },
            getLastNextDay (val) {
                this.valueNumber = 1;
                this.pageIndex = 1;
                this.curTime = val;
                this.getUserList();
            },
            getUserList () {
                this.tableLoading = true;
                this.$call('user.get.post').then(res => {
                    if (res.data.status === 200) {
                        this.loginMes = res.data.res;
                        let params = {
                            groupId: this.loginMes[0].groupId,
                            workshopId: this.loginMes[0].workshopId,
                            date: this.curTime
                        };
                        this.$call('prd.material.feeding.userConsumeList', params).then(resItem => {
                            let responseData = resItem.data;
                            if (responseData.status === 200) {
                                this.pageTotal = Math.ceil(responseData.res.length / 11);
                                this.tableData = responseData.res.detailList;
                                this.tableLoading = false;
                            }
                        });
                    };
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

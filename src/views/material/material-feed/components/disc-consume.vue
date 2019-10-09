<template>
    <div id="view-pack" style="padding: 30px;">
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Row :gutter="2" class="disc-box margin-bottom-10">
            <Col v-for="(item, index) in discList" :key="index" span="2" :class="activeIndex===index?'textCenter disc-item-bar activeStyle':'textCenter disc-item-bar'">
                <p class="text-item" @click="getDiscIndexEvent(item.detailList, index)">{{item.name}}</p>
            </Col>
        </Row>
        <Table :height="tableHeight" border :data="tableData" :loading="tableLoading" :columns="tableHeader"></Table>
        <left-right
                :pageTotal="pageTotal"
                :pageIndex="pageIndex"
                @leftRightClick="leftRightClick"
        ></left-right>
    </div>
</template>
<script>
    import leftRight from '../../../pack/view-pack/left-right';
    import changeTime from '../../../pack/view-pack/change-time';
    import {curDate} from '../../../../libs/tools';
    export default {
        components: {leftRight, changeTime},
        props: {
            isDiscConsumeShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                loginMes: [],
                tableLoading: false,
                activeIndex: 0,
                dataList: [],
                discList: [],
                pageIndex: 1,
                tableHeight: '',
                leftRightShow: true,
                curTime: curDate(),
                tableData: [],
                tableHeader: [
                    {
                        title: '物料',
                        key: 'productName',
                        minWidth: 200
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '领出量',
                        key: 'leadOutQty',
                        minWidth: 110,
                        align: 'right'
                    },
                    {
                        title: '已投量',
                        key: 'feedingQty',
                        minWidth: 100,
                        align: 'right'
                    },
                    {
                        title: '剩余量',
                        key: 'surplusQty',
                        minWidth: 90,
                        align: 'center'
                    }
                ],
                pageTotal: 1
            };
        },
        methods: {
            getDiscIndexEvent (detailList, index) {
                this.activeIndex = index;
                this.dataList = detailList;
                this.pageIndex = 1;
                this.pageTotal = Math.ceil(detailList.length / 12);
                this.tableData = this.pagination(this.pageIndex, 12, detailList);
            },
            getLastNextDay (val) {
                this.curTime = val;
                this.pageIndex = 1;
                this.activeIndex = 0;
                this.pageTotal = 1;
                this.leftRightShow = false;
                this.getSearchList();
            },
            leftRightClick (val) {
                this.pageIndex = val;
                this.pageTotal = Math.ceil(this.dataList.length / 12);
                this.tableData = this.pagination(this.pageIndex, 12, this.dataList);
            },
            pagination (pageIndex, pageSize, array) {
                let offset = (pageIndex - 1) * pageSize;
                return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
            },
            getSearchList () {
                this.tableLoading = true;
                this.$call('user.get.post').then(resItem => {
                    if (resItem.data.status === 200) {
                        this.loginMes = resItem.data.res;
                        let params = {
                            // groupId: this.loginMes[0].groupId,
                            date: this.curTime,
                            workshopId: this.loginMes[0].workshopId
                            // pageIndex: this.pageIndex,
                            // pageSize: 12
                        };
                        this.$call('prd.material.feeding.diskConsumeList', params).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                this.discList = content.res.areaModelList;
                                this.pageTotal = Math.ceil(content.res.areaModelList[0].detailList.length / 12);
                                this.dataList = content.res.areaModelList[0].detailList;
                                this.tableData = this.pagination(this.pageIndex, 12, content.res.areaModelList[0].detailList);
                                this.tableLoading = false;
                            }
                        });
                    }
                });
            }
        },
        watch: {
            watch: {
                loginMes (newData, oldData) {
                    this.curTime = this.loginMes[0].date;
                }
            },
            isDiscConsumeShow (newData, oldData) {
                if (newData) {
                    this.getSearchList();
                }
            }
        },
        mounted () {
            this.getSearchList();
            this.$nextTick(() => {
                this.tableHeight = window.screen.height - 350;
            });
            window.onresize = () => {
                this.tableHeight = window.screen.height - 350;
            };
        }
    };
</script>

<style scoped lang="less">
    .activeStyle {
        transition: all .5s;
        box-shadow: 0 0 4px 2px;
        z-index: 99;
        border-radius: 6px;
    }
    .disc-box {
        height: 36px;
        .disc-item-bar {
            font-size: 24px;
            .text-item {
                background: #F1F1F1;
                border-radius: 6px;

            }
        }
    }
</style>

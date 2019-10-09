<template>
    <div id="view-pack" style="padding: 30px;">
        <change-time @getLastNextDay="getLastNextDay"></change-time>
        <Table :height="tableHeight" border :data="tableData" :columns="tableHeader" :loading="tableLoading"></Table>
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
            isSearchShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                loginMes: [],
                tableLoading: false,
                pageIndex: 1,
                tableHeight: '',
                leftRightShow: true,
                curTime: curDate(),
                tableData: [],
                tableHeader: [],
                initTableHeader: [
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
                            workshopId: this.loginMes[0].workshopId,
                            // pageIndex: this.pageIndex,
                            // pageSize: 12
                        };
                        this.$call('prd.material.feeding.materialConsumeList', params).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                let dynamicTableHeader = [];
                                content.res.areaList.forEach(item => {
                                    dynamicTableHeader.push({
                                        title: item.name,
                                        key: item.code,
                                        width: 100,
                                        align: 'right'
                                    });
                                });
                                this.tableHeader = [...this.initTableHeader, ...dynamicTableHeader];
                                this.pageTotal = Math.ceil(content.res.detailList.length / 12);
                                let dataList = JSON.parse(JSON.stringify(content.res.detailList));
                                dataList.forEach(allItem => {
                                    allItem.packingAreaList.forEach(areaItem => {
                                        allItem[areaItem.code] = areaItem.weightQty;
                                    });
                                });
                                this.tableData = this.pagination(this.pageIndex, 12, dataList);
                                this.tableLoading = false;
                            }
                        });
                    }
                });
            }
        },
        watch: {
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

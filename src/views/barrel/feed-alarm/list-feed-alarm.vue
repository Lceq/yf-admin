<template>
    <Card class="bg-color">
        <Row class="flex-between">
            <Col span="12" class="flex-left query-bar-left query-bar-left-item">
<!--                <p class="sh-label-title">车间：</p>-->
                <Select class="sh-select-width textLeft margin-right-10 selectBackground" v-model="workshopId">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Button type="primary" shape="circle" @click="fullScreenEvent" :icon="isPresentFullScreen ? 'ios-exit' : 'ios-expand'"></Button>
            </Col>
            <Col span="12" class="now-date-bar flex-end-center">
                <p class="now-date-label sh-label-title">当前时间：</p>
                <p class="now-date-value">{{dateValue}}</p>
            </Col>
        </Row>
        <sh-table
                :table-header="tableHeader"
                :table-data="tableData"
                :table-height="tableHeight"
        ></sh-table>
    </Card>
</template>
<script>
    import { toDaySeconds } from '../../../libs/common';
    import shTable from './components/sh-table';
    import { mapGetters } from 'vuex';
    let clearDate;
    let clearList;
    export default {
        name: 'feed-alarm',
        components: { shTable },
        data () {
            return {
                tableHeight: 0,
                workshopId: null,
                workshopList: [],
                isPresentFullScreen: false,
                dateValue: toDaySeconds(),
                tableData: [],
                tableHeader: [
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center',
                        span: '2'
                    },
                    {
                        title: '机台名称',
                        key: 'machineName',
                        span: '2'
                    },
                    {
                        title: '位置',
                        key: 'side',
                        span: '2'
                    },
                    {
                        title: '上机筒位',
                        key: 'positionNumber',
                        align: 'right',
                        span: '2'
                    },
                    {
                        title: '设定上机物料',
                        key: 'settingProductName',
                        span: '3'
                    },
                    {
                        title: '设定物料批号',
                        key: 'settingBatchCode',
                        span: '2'
                    },
                    {
                        title: '上机条筒',
                        key: 'machineName',
                        span: '2'
                    },
                    {
                        title: '上机物料',
                        key: 'productName',
                        span: '2'
                    },
                    {
                        title: '上机物料批号',
                        key: 'batchCode',
                        span: '2'
                    },
                    {
                        title: '上机时间',
                        key: 'collectTime',
                        span: '3'
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        span: '2'
                    }
                ]
            };
        },
        computed: {
            setTableCell () {
                return (tableHeaderItem) => {
                    if (tableHeaderItem.key === 'state') {
                        return {
                            textAlign: tableHeaderItem.align ? tableHeaderItem.align : 'left',
                            borderTop:'none',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }
                    } else {
                        return {
                            textAlign: tableHeaderItem.align ? tableHeaderItem.align : 'left',
                            borderTop:'none'
                        }
                    };
                };
            }
        },
        methods: {
            fullScreenEvent () {
                let main = document.getElementsByClassName('bg-color')[0];
                if (!this.isPresentFullScreen) {
                    if (main.requestFullscreen) {
                        main.requestFullscreen();
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen();
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen();
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen();
                    }
                    this.isPresentFullScreen = true;
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.isPresentFullScreen = false;
                };
            },
            getUserWorkshopRequest () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        this.workshopId = res.data.res.defaultDeptId;
                        this.workshopList = res.data.res.userData;
                    };
                })
            },
            getListRequest () {
                return this.$call('position.upper.product.alarmList', {
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res.map(item => {
                            !item.side ? item.side = '左': item.side = '右'
                            return item;
                        });
                    };
                });
            },
            async getDependentDataRequest () {
                await this.getUserWorkshopRequest();
                await this.getListRequest();
            },
            fullScreenChangeEvent () {
                if (document.isFullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen) {
                    this.$nextTick(() => {
                        let viewHeight = document.getElementsByClassName('single-page-con')[0].offsetHeight;
                        this.$store.dispatch({ type: 'calManiViewHeight', payload: viewHeight });
                        this.tableHeight = this.$store.getters.getManiViewHeight - 40;
                    });
                } else {
                    let viewHeight = document.getElementsByClassName('single-page-con')[0].offsetHeight;
                    this.$store.dispatch({ type: 'calManiViewHeight', payload: viewHeight });
                    this.$nextTick(() => this.tableHeight = this.$store.getters.getManiViewHeight - 140);
                    this.isPresentFullScreen = false;
                };
            },
            // 计算展示区的高度
            calViewHeight () {
                document.addEventListener('fullscreenchange', () => this.fullScreenChangeEvent());
                document.addEventListener('mozfullscreenchange', () => this.fullScreenChangeEvent());
                document.addEventListener('webkitfullscreenchange', () => this.fullScreenChangeEvent());
                document.addEventListener('msfullscreenchange', () => this.fullScreenChangeEvent());
                window.onresize = () => {
                    this.fullScreenChangeEvent();
                };
                this.$nextTick(() => this.tableHeight = this.$store.getters.getManiViewHeight - 140);
            }
        },
        created () {
            clearDate = setInterval(() => {
                this.dateValue = toDaySeconds();
            }, 1000);
            clearList = setInterval(() => {
                this.getListRequest();
            }, 30000);
            this.getDependentDataRequest();
        },
        mounted () {
            this.calViewHeight();
        },
        beforeRouteLeave (from, to, next) {
            clearInterval(clearDate);
            clearInterval(clearList);
            next();
        }
    };
</script>
<style lang="less">
    @import "feed-alarm";
</style>

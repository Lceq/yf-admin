<template>
    <div>
        <global-loading v-show="showGlobalLoading"></global-loading>
        <Card class="card-color">
            <Row class="margin-bottom-10 header-bar" type="flex" justify="space-between">
                <Col>
                    <span class="text-color">车间：</span>
                    <Select class="formWidth textLeft margin-right-10 selectBackground" v-model="workshopId">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Button type="primary" @click="searchButtonEvent" class="margin-right-10">搜索</Button>
                    <Button type="primary" @click="exportEvent" class="margin-right-10">导出统计结果</Button>
                    <Button type="primary" shape="circle" @click="fullScreenEvent" :icon="isPresentFullScreen ? 'ios-exit' : 'ios-expand'"></Button>
                </Col>
                <Col class="now-date-bar flex-left">
                    <p class="now-date-label text-color">当前时间：</p>
                    <p class="now-date-value">{{dateValue}}</p>
                </Col>
            </Row>
            <Row :gutter="10" class="margin-bottom-10 content-bar">
                <Col span="5">
                    <div class="border-circle flex-vertical-center">
                        <p :class="!isProductionQtySwitch ? 'productionQty-text-color total-item-font' : 'productionQty-text-color total-item-font qtyAnimation'">{{ totalProductionQtyNum }}</p>
                        <span class="total-small-bar">计划完成量</span>
                    </div>
                </Col>
                <Col span="5">
                    <div class="border-circle flex-vertical-center">
                        <p :class="!isCompletionQtySwitch ? 'completionQty-text-color total-item-font' : 'completionQty-text-color total-item-font qtyAnimation'">{{ totalCompletionQtyNum }}</p>
                        <span class="total-small-bar">累计完成量</span>
                    </div>
                </Col>
                <Col span="4">
                    <div class="border-circle flex-vertical-center">
                        <p :class="!isDifferenceSwitch ? 'difference-text-color total-item-font' : 'difference-text-color total-item-font qtyAnimation'">{{ totalDifferenceNum }}</p>
                        <span class="total-small-bar">差值</span>
                    </div>
                </Col>
                <Col span="5">
                    <div class="border-circle flex-vertical-center">
                        <p :class="!isMachineNumSwitch ? 'machine-number-text-color total-item-font' : 'machine-number-text-color total-item-font qtyAnimation'">{{ totalMachineNum }}</p>
                        <span class="total-small-bar total-item-font">细纱看台数</span>
                    </div>
                </Col>
                <Col span="5">
                    <div class="border-circle flex-vertical-center">
                        <p :class="!isInventoryQtySwitch ? 'inventoryQty-number-text-color total-item-font' : 'inventoryQty-number-text-color total-item-font qtyAnimation'">{{ totalInventoryQtyNum }}</p>
                        <span class="total-small-bar">入库数</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col class="table-color">
                    <p class="order-detail-bar">排产订单明细</p>
                    <div>
                        <Table class="myTable" :loading="tableLoading" border :height="tableHeight" size="small" :data="tableData" :columns="tableHeader" ref="tableCsv"></Table>
                    </div>
                </Col>
            </Row>
            <div>
                <order-progress-modal
                        :orderProgressModalState="orderProgressModalState"
                        :orderProgressModalData="orderProgressModalData"
                        :orderProgressModalLoading="orderProgressModalLoading"
                        @on-visible-change="getOrderProgressModalState"
                        @on-close="orderProgressModalCloseEvent"
                ></order-progress-modal>
            </div>
        </Card>
    </div>
</template>

<script>
    let dataTimer = null;
    let currentTimer = null;
    let _this = this;
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, toDay, toDaySeconds, formatDate } from '../../../libs/common';
    import mathJs from 'mathjs';
    import orderProgressModal from './order-progress-modal';
    export default {
        name: 'chart',
        components: { orderProgressModal },
        data () {
            return {
                isInventoryQtySwitch: false,
                isMachineNumSwitch: false,
                isDifferenceSwitch: false,
                isCompletionQtySwitch: false,
                isProductionQtySwitch: false,
                isPresentFullScreen: false,
                orderProgressModalState: false,
                tableLoading: false,
                showGlobalLoading: false,
                workshopId: null,
                dateValue: toDaySeconds(),
                tableHeight: null,
                tableHeader: [
                    {
                        title: '生产订单号',
                        key: 'code',
                        minWidth: 140,
                        fixed: 'left',
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    innerHTML: params.row.code
                                },
                                on: {
                                    'click': () => {
                                        this.getOrderProgressEvent(params.row.code)
                                    }
                                },
                                style: {
                                    color: '#fe9900'
                                }
                            })
                        }
                    },
                    {
                        title: '产品',
                        key: 'productCode',
                        minWidth: 200,
                        fixed: 'left',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productCode ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            })
                        }
                    },
                    {
                        title: '计量单位',
                        key: 'unitCode',
                        align: 'left',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitCode ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            })
                        }
                    },
                    {
                        title: '计划生产量',
                        key: 'productionQty',
                        align: 'right',
                        minWidth: 140
                    },
                    {
                        title: '累计完成量',
                        key: 'completionQty',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '完成率(%)',
                        key: 'completionRate',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '计划开工日期',
                        key: 'planStartDate',
                        minWidth: 140,
                        align: 'left',
                    },
                    {
                        title: '计划完工日期',
                        key: 'planFinishDate',
                        minWidth: 140,
                        align: 'left',
                    },
                    {
                        title: '计划完成天数',
                        key: 'planCompletionDay',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '剩余天数',
                        key: 'surplusDay',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '细纱开台数',
                        key: 'machineNumber',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '预计每小时的产量',
                        key: 'estimateHourOutput',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '当前每小时的产量',
                        key: 'currentHourOutput',
                        minWidth: 140,
                        align: 'right'
                    },
                    {
                        title: '入库数',
                        key: 'inventoryQty',
                        minWidth: 140,
                        align: 'right'
                    }
                ],
                tableData: [],
                workshopList: [],
                orderProgressModalData: {},
                totalProductionQtyNum: 0,
                totalCompletionQtyNum: 0,
                totalDifferenceNum: 0,
                totalMachineNum: 0,
                totalInventoryQtyNum: 0,
                orderProgressModalLoading: false
            };
        },
        methods: {
            // 全屏事件
            fullScreenEvent () {
                let main = document.getElementsByClassName('card-color')[0];
                let headerBarHeight = document.getElementsByClassName('header-bar')[0].offsetHeight;
                let contentBarHeight = document.getElementsByClassName('content-bar')[0].offsetHeight;
                let bodyHeight = document.body.offsetHeight;
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
            orderProgressModalCloseEvent () {
                this.orderProgressModalState = false;
            },
            getOrderProgressModalState (e) {
                this.orderProgressModalState = e;
            },
            // 获取订单进度详情
            getOrderProgressEvent (orderCode) {
                this.orderProgressModalState = true;
                this.orderProgressModalLoading = true;
                this.$call('prd.order.monitor.detail',{ code: orderCode, date: formatDate(this.dateValue) }).then(res => {
                    if (res.data.status === 200) {
                        this.orderProgressModalLoading = false;
                        this.orderProgressModalData = res.data.res;
                    };
                });
            },
            // 导出Excel事件
            exportEvent () {
                let dataList = JSON.parse(JSON.stringify(this.tableData));
                let item = {
                    code: '合计:',
                    productionQty: this.totalProductionQtyNum,
                    completionQty: this.totalCompletionQtyNum,
                    completionRate: this.totalDifferenceNum,
                    machineNumber: this.totalMachineNum,
                    inventoryQty: this.totalInventoryQtyNum
                };
                dataList.push(item);
                this.$refs.tableCsv.exportCsv({
                    filename: '排产订单明细',
                    columns: this.tableHeader,
                    data: dataList
                });
            },
            searchButtonEvent () {
                this.tableLoading = true;
                this.getListRequest();
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
                return this.$call('prd.order.monitor.list', {
                    date: formatDate(this.dateValue),
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.totalProductionQtyNum = 0; // 计划完成量
                        this.totalCompletionQtyNum = 0; // 累计完成量
                        this.totalDifferenceNum = 0; // 差值
                        this.totalMachineNum = 0; // 细纱看台数
                        this.totalInventoryQtyNum = 0; // 入库数
                        if (this.tableData && this.tableData.length !== 0) {
                            this.tableData.forEach((item) => {
                                this.totalProductionQtyNum = mathJsAdd(this.totalProductionQtyNum, item.productionQty);
                                this.totalCompletionQtyNum = mathJsAdd(this.totalCompletionQtyNum, item.completionQty);
                                this.totalMachineNum = mathJsAdd(this.totalMachineNum, item.machineNumber);
                                this.totalInventoryQtyNum = mathJsAdd(this.totalInventoryQtyNum, item.inventoryQty);
                            });
                        };
                        this.totalDifferenceNum = mathJsSub(this.totalProductionQtyNum, this.totalCompletionQtyNum);
                        this.tableLoading = false;
                        this.showGlobalLoading = false;
                    };
                })
            },
            fullScreenChangeEvent () {
                let headerBarHeight = document.getElementsByClassName('header-bar')[0].offsetHeight;
                let contentBarHeight = document.getElementsByClassName('content-bar')[0].offsetHeight;
                let bodyHeight = document.body.offsetHeight;
                // 全屏
                if (document.isFullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen) {
                    if (document.getElementsByClassName('card-color')[0].clientWidth >= document.body.offsetWidth - 100) {
                        this.isPresentFullScreen = true;
                        this.tableHeight = bodyHeight - headerBarHeight - contentBarHeight - 100;
                    } else {
                        this.tableHeight = document.documentElement.clientHeight - 350;
                    };
                } else {
                    // 火狐获取不到mozFullScreen，故判断是狐火的赋值表格高度
                    if (navigator.userAgent.indexOf('Firefox') !== -1) {
                        this.tableHeight = bodyHeight - headerBarHeight - contentBarHeight - 100;
                        this.isPresentFullScreen = false;
                    } else {
                        this.tableHeight = document.documentElement.clientHeight - 350;
                        this.isPresentFullScreen = false;
                    }
                };
            },
            // 获取依赖数据
            async getDependentDataRequest() {
                await this.getUserWorkshopRequest();
                await this.getListRequest();
            }
        },
        created () {
            this.showGlobalLoading = true;
            this.getDependentDataRequest();
        },
        mounted () {
            document.addEventListener('fullscreenchange', () => {
                this.fullScreenChangeEvent();
            });
            document.addEventListener('mozfullscreenchange', () => {
                this.fullScreenChangeEvent();
            });
            document.addEventListener('webkitfullscreenchange', () => {
                this.fullScreenChangeEvent();
            });
            document.addEventListener('msfullscreenchange', () => {
                this.fullScreenChangeEvent();
            });
           dataTimer = setInterval(()=>{
                this.dateValue = toDaySeconds();
                this.getListRequest();
            },5000);
            currentTimer = setInterval(()=>{
                this.dateValue = toDaySeconds();
            },1000);
            this.tableHeight = document.documentElement.clientHeight - 350;
            window.onresize = () => {
                if (!this.isPresentFullScreen) {
                    this.tableHeight = document.documentElement.clientHeight - 350;
                };
            };
        },
        beforeRouteLeave(from, to,next){
            next();
            clearInterval(dataTimer);
            clearInterval(currentTimer);
        },
        watch: {
            totalProductionQtyNum (newVal, oldVal) {
                this.isProductionQtySwitch = true;
                setTimeout(()=>{ this.isProductionQtySwitch = false; },4000)
            },
            totalCompletionQtyNum (newVal, oldVal) {
                this.isCompletionQtySwitch = true;
                setTimeout(()=>{ this.isCompletionQtySwitch = false; },4000)
            },
            totalDifferenceNum (newVal, oldVal) {
                this.isDifferenceSwitch = true;
                setTimeout(()=>{ this.isDifferenceSwitch = false; },4000)
            },
            totalMachineNum (newVal, oldVal) {
                this.isMachineNumSwitch = true;
                setTimeout(()=>{ this.isMachineNumSwitch = false; },4000)
            },
            totalInventoryQtyNum (newVal, oldVal) {
                this.isInventoryQtySwitch = true;
                setTimeout(()=>{ this.isInventoryQtySwitch = false; },4000)
            }
        }
    };
</script>
<style type="text/css" lang="less">
    .qtyAnimation {
        animation: myAnimation 4s;
        padding: 0 4px;
        background: orangered;
        border-radius: 6px;
    }
    @keyframes myAnimation {
        10% { background: pink; }
        50% { background: green; }
        100% { background: #fff; }
    }
    @font-face {
        font-family: 'sh-font-time';
        src: url("../../../styles/fonts/DIGITAL-Dreamfat.ttf");
    }
    .now-date-bar .now-date-label{
        font-size: 14px;
        line-height: 32px;
    }
    .total-item-font{
        font-size: 22px;
        font-weight: bold;
        font-family: 'sh-font-time';
    }
    .border-circle .inventoryQty-number-text-color {
        color: #06b2be;
    }
    .border-circle .machine-number-text-color {
        color: #9865e4;
    }
    .border-circle .difference-text-color {
        color: #19bf6b;
    }
    .border-circle .productionQty-text-color {
        color: #19bf6b;
    }
    .border-circle .completionQty-text-color{
        color: #e56cbb;
    }
    .text-color{
        color: #0acddf;
        font-weight: bold;
    }
    .now-date-bar .now-date-value {
        color: #bcbcbc;
        font-family: 'sh-font-time';
        font-size: 12px;
        line-height: 32px
    }
    .card-color .table-color {
        border: solid 1px #51576d;
        padding: 10px 0;
        border-radius: 4px;
        .ivu-table-wrapper {
            position: relative;
            border: 1px solid #515970;
            border-bottom: 0;
            border-right: 0;
            border-left: 0;
            overflow: hidden;
        }
        .ivu-table-fixed-body {
            overflow: hidden;
            position: relative;
            background: #22272D;
            z-index: 3;
        }
        .ivu-table-fixed-header {
            overflow: hidden;
            background: #5b657e;
            color: #fff;
        }
        .ivu-table{
            color: #fff;
            font-weight: normal;
            background: #22272d;
        }
        .ivu-table th{
            background-color: #5b657e;
        }
        .ivu-table tr{
            background-color: transparent !important;
        }
        .ivu-table td{
            background-color: transparent !important;
            z-index: 999;
        }
        .ivu-table-border td, .ivu-table-border th {
            border-right: 1px solid #515970;
        }
        .ivu-table td, .ivu-table th {
            min-width: 0;
            box-sizing: border-box;
            text-overflow: ellipsis;
            vertical-align: middle;
            border-bottom: 1px solid #515970;
        }
        .ivu-spin-fix {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 8;
            width: 100%;
            height: 100%;
            background-color: rgba(117, 115, 115, .9);
        }
        .ivu-select-selection {
            color: #fff;
            background-color: transparent !important;
        }
    }
    .total-small-bar {
        font-weight: 700;
        color: #9e9ea0;
        font-size: 14px;
    }
    .order-detail-bar {
        color: #0cffe9;
        font-size: 14px;
        font-weight: bold;
        margin-left: 20px;
        padding-bottom: 8px;
    }
    .flex-vertical-center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .border-circle {
        color: #fff;
        border: solid 1px #515970;
        border-radius: 4px;
        padding: 10px;
    }
    .title-bar {
        font-size: 32px;
        font-weight: 700;
        text-align: center;
        color: #0cffe9;
    }
    .margin-right-10{
        margin-right: 10px;
    }
    .card-color{
        background-color: #22272d;
        .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
            display: block;
            background: #2f343d;
            color: #fff;
            height: 30px;
            border: 1px solid #515970;
            line-height: 30px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-left: 8px;
            border-radius: 2px;
            padding-right: 24px;
        }
        .ivu-select-selection {
            display: block;
            box-sizing: border-box;
            outline: 0;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            cursor: pointer;
            position: relative;
            background-color: #fff;
            border-radius: 4px;
            transition: all .2s ease-in-out;
        }
        .ivu-select-dropdown {
            max-height: 200px;
            overflow:auto;
            margin: 5px 0;
            border: 1px solid #2f343d;
            padding: 5px 0;
            background-color: #2f343d;
            color: #fff;
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 1px 6px rgba(0,0,0,.2);
            z-index: 900
        }
        .ivu-select-item {
            margin: 0;
            line-height: normal;
            padding: 7px 16px;
            clear: both;
            color: gainsboro;
            font-size: 12px !important;
            white-space: nowrap;
            list-style: none;
            cursor: pointer;
            transition: background .2s ease-in-out;
        }
        .ivu-select-item:hover {
            margin: 0;
            line-height: normal;
            padding: 7px 16px;
            clear: both;
            color: #fff;
            font-size: 12px !important;
            white-space: nowrap;
            list-style: none;
            background: #616878;
            cursor: pointer;
            transition: background .2s ease-in-out;
        }
        .ivu-select-item-selected, .ivu-select-item-selected:hover {
            color: #2d8cf0;
            background: #616878;
        }
    }
</style>

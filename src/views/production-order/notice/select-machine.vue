<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择机台"
                :mask-closable="false"
                @on-visible-change="selectMachineModalStateChangeEvent"
                width="1600"
        >
            <div class="modal-content-bar">
                <modal-content-loading
                        :spinShow="spinShow"
                ></modal-content-loading>
                <Row type="flex" justify="space-between">
                    <Col>
                        <Button type="success" @click="selectMachineModalConfirmEvent">确认选择</Button>
                        <Tooltip content="点击查看产品对比色">
                            <Button shape="circle" type="success" ghost @click="contrastProductColorEvent" icon="ios-color-wand"></Button>
                        </Tooltip>
                        <Button type="primary" @click="exportEvent">导出</Button>
                    </Col>
                    <Col class="flex-left">
                        <!--<Select clearable v-model="workCenterValue" class="searchHurdles queryBarMarginRight" placeholder="请选择工作中心">
                            <Option v-for="item in selectMachineModalWorkCenterList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>-->
                        <!--<Input type="text" v-model="queryBarMachineCodeValue" class="searchHurdles queryBarMarginRight" placeholder="请输入机台编号或名称"/>-->
                        <Select clearable v-model="beginMachine" @on-clear="clearBeginMachineEvent" filterable placeholder="开始机台" class="searchHurdles queryBarMarginRight">
                            <Option v-for="(item, index) in queryBarMachineList" :value="item.machineCode" :key="index">{{ `${item.machineName}(${item.machineCode})` }}</Option>
                        </Select>
                        <Select clearable v-model="endMachine" @on-clear="clearEndMachineEvent" filterable placeholder="结束机台" class="searchHurdles queryBarMarginRight">
                            <Option v-for="(item, index) in queryBarMachineList" :value="item.machineCode" :key="index">{{ `${item.machineName}(${item.machineCode})` }}</Option>
                        </Select>
                        <Button @click="selectRangeMachineEvent" :loading="confirmMachineLoading" type="primary" class="queryBarMarginRight">搜索</Button>
                        <!--<Button icon="ios-search" type="primary" @click="selectMachineModalSearchBtnEvent">搜索</Button>-->
                    </Col>
                </Row>
                <Row class="machine-schedule-bar">
                    <Col span="24">
                        <Table ref="tableCsv" @on-selection-change="getCheckRowChangeEvent" :loading="tableLoading" :columns="selectMachineTableHeader" :data="sourceMachineList" :height="630" size="small" border></Table>
                    </Col>
                </Row>
            </div>
            <div slot="footer"></div>
        </Modal>
        <more-schedule-modal
                :more-schedule-modal-title="moreScheduleModalTitle"
                :more-schedule-modal-state="moreScheduleModalState"
                :more-schedule-modal-spin-show="moreScheduleModalSpinShow"
                :more-schedule-modal-data="moreScheduleModalData"
                @on-visible-change="moreScheduleModalChangeEvent"
                @close-modal-event="closeModalEvent"
        ></more-schedule-modal>
        <contrast-product-modal
                :contrast-product-color-modal-state="contrastProductColorModalState"
                :contrast-product-color-modal-table-data="productColorList"
                @on-visible-change="contrastProductColorModalStateChangeEvent"
        ></contrast-product-modal>
        <Modal v-model="showDetail" scrollable title="详情" :width="400">
            <div>
                <div class="flex-left">
                    <p class="label-name">产品编号：</p>
                    <span>{{detailData.productCode}}</span>
                </div>
                <div class="flex-left">
                    <p class="label-name">产品名称：</p>
                    <span>{{detailData.productName}}</span>
                </div>
                <div class="flex-left">
                    <p class="label-name">生产批号：</p>
                    <span>{{detailData.batchCode}}</span>
                </div>
                <div class="flex-left">
                    <p class="label-name">生产单号：</p>
                    <span>{{detailData.prdOrderCodes}}</span>
                </div>
                <div class="flex-left">
                    <p class="label-name">通知单号：</p>
                    <span>{{detailData.prdNoticeCode}}</span>
                </div>
            </div>
            <div slot="footer">
                <Button type="error" @click="detailCancelEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    import moreScheduleModal from './more-schedule-modal';
    import { noticeTips, clearSpace, emptyTips, formatDate } from '../../../libs/common';
    import machineSchedule from './machine-schedule';
    import contrastProductModal from './contrast-product-color';
    export default {
        components: { modalContentLoading, moreScheduleModal, contrastProductModal },
        props: {
            selectMachineModalState: {
                type: Boolean,
                default: false
            },
            selectMachineModalWorkCenterList: {
                type: Array
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            selectMachineModalTableData: {
                type: Array
            },
            selectMachineMachineAndDate: {
                type: Object
            }
        },
        data () {
            return {
                detailData: {},
                showDetail: false,
                tableLoading: false,
                confirmMachineLoading: false,
                contrastProductColorModalTableData: [],
                contrastProductColorModalState: false,
                productColorList: [],
                queryBarMachineList: [],
                sourceMachineList: [],
                beginMachine: '',
                endMachine: '',
                moreScheduleModalTitle: '',
                moreScheduleModalData: [],
                moreScheduleModalSpinShow: false,
                moreScheduleModalState: false,
                queryBarMachineCodeValue: '',
                defaultTableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '工作中心',
                        key: 'workCenterName',
                        align: 'left',
                        fixed: 'left',
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.workCenterName
                                },
                                style: {
                                    paddingLeft: '4px'
                                }
                            });
                        }
                    },
                    {
                        title: '机台',
                        key: 'machineName',
                        align: 'left',
                        fixed: 'left',
                        minWidth: 150,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.machineCode ? `${params.row.machineName}(${params.row.machineCode})` : ''
                                },
                                style: {
                                    color: params.row.machineCode.colorValue,
                                    paddingLeft: '4px'
                                }
                            });
                        }
                    },
                    {
                        title: '在纺产品',
                        key: 'productName',
                        align: 'left',
                        minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                },
                                style: {
                                    paddingLeft: '4px'
                                }
                            });
                        }
                    },
                    {
                        title: '预计了机时间',
                        key: 'planDateTo',
                        align: 'center',
                        minWidth: 130
                    }
                ],
                selectMachineTableHeader: [],
                showModal: false,
                workCenterValue: null,
                checkArray: [],
                lastProductItem: {
                    title: '最后待产产品',
                    key: 'lastProductName',
                    align: 'left',
                    minWidth: 200,
                    render: (h, params) => {
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    transfer: true,
                                    content: '点击查看排产详情'
                                }
                            }, [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.lastProductName ? `${params.row.lastProductName}(${params.row.lastProductCode})` : ''
                                    },
                                    style: {
                                        paddingLeft: '4px'
                                    },
                                    on: {
                                        click: () => {
                                            this.seeMoreSchedulingEvent(params.row.machineCode, params.row.machineId);
                                        }
                                    }
                                })
                            ])
                        ]);
                    }
                },
                lastProductItemTime: {
                    title: '最后了机时间',
                    key: 'lastPlanDateTo',
                    align: 'center',
                    minWidth: 130
                }
            };
        },
        methods: {
            detailCancelEvent () {
                this.showDetail = false;
            },
            // 导出数据
            exportEvent () {
                let exportSourceData = JSON.parse(JSON.stringify(this.sourceMachineList));
                exportSourceData.forEach((allItem) => {
                    for (let objItem in allItem) {
                        if (allItem[objItem] instanceof Array) {
                            if (allItem[objItem].length !== 0) {
                                let strProduct = '';
                                allItem[objItem].forEach(item => {
                                    strProduct = strProduct + `${item.productName}(${item.productCode})、`;
                                });
                                allItem[objItem] = strProduct;
                            } else {
                                allItem[objItem] = '';
                            };
                        };
                    };
                });
                this.$refs.tableCsv.exportCsv({
                    filename: '机台排产数据',
                    columns: this.selectMachineTableHeader,
                    data: exportSourceData
                });
            },
            clearBeginMachineEvent () {
                if (this.endMachine) {
                    this.checkArray = [];
                    this.selectMachineTableHeader = this.defaultTableHeader;
                    this.tableLoading = true;
                    setTimeout(() => {
                        // this.setTableHeader();
                        this.sourceMachineList = JSON.parse(JSON.stringify(this.queryBarMachineList));
                        this.tableLoading = false;
                    }, 0);
                };
            },
            clearEndMachineEvent () {
                if (this.beginMachine) {
                    this.checkArray = [];
                    this.selectMachineTableHeader = this.defaultTableHeader;
                    this.tableLoading = true;
                    setTimeout(() => {
                        // this.setTableHeader();
                        this.sourceMachineList = JSON.parse(JSON.stringify(this.queryBarMachineList));
                        this.tableLoading = false;
                    }, 0);
                };
            },
            // 设置表头
            setTableHeader () {
                let d = new Date();
                for (let i = 0; i < 30; i++) {
                    let tableHeaderValue = `${new Date(formatDate(d.getTime() + i * 24 * 60 * 60 * 1000)).getMonth() + 1}-${new Date(formatDate(d.getTime() + i * 24 * 60 * 60 * 1000)).getDate()}`;
                    this.selectMachineTableHeader.push({
                        title: tableHeaderValue,
                        key: tableHeaderValue,
                        align: 'center',
                        minWidth: 40,
                        render: (h, params) => {
                            if (params.row[tableHeaderValue] && params.row[tableHeaderValue].length !== 0) {
                                return h('div', [
                                    h(machineSchedule, {
                                        props: {
                                            productData: params.row[tableHeaderValue]
                                        },
                                        on: {
                                            'on-click': (e) => {
                                                this.detailData = e;
                                                this.showDetail = true;
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    });
                };
                // 将最后排产产品和时间放最后
                this.selectMachineTableHeader.push(this.lastProductItem);
                this.selectMachineTableHeader.push(this.lastProductItemTime);
            },
            contrastProductColorEvent () {
                this.contrastProductColorModalState = true;
            },
            // 监听产品对比色modal
            contrastProductColorModalStateChangeEvent (e) {
                this.contrastProductColorModalState = e;
            },
            colorRandom () {
                let r = Math.floor(Math.random() * 256);
                let g = Math.floor(Math.random() * 256);
                let b = Math.floor(Math.random() * 256);
                let color = '#' + r.toString(16) + g.toString(16) + b.toString(16);
                return color;
            },
            // 初始化勾选的机台
            initCheckMachineMethods () {
                this.sourceMachineList.forEach((item) => { item._disabled ? false : this.$set(item, '_checked', false); });
            },
            // 选择机台按钮事件
            selectRangeMachineEvent () {
                if (this.beginMachine) {
                    if (this.endMachine) {
                        this.tableLoading = true;
                        setTimeout(() => {
                            let beginIndex = null;
                            let endIndex = null;
                            let allMachineList = JSON.parse(JSON.stringify(this.queryBarMachineList));
                            let dataList = [];
                            allMachineList.forEach((item, index) => {
                                item.machineCode === this.beginMachine ? beginIndex = index : false;
                                item.machineCode === this.endMachine ? endIndex = index : false;
                            });
                            if (beginIndex <= endIndex) {
                                allMachineList.forEach((item, index) => {
                                    if (index >= beginIndex && index <= endIndex) {
                                        this.$set(item, '_checked', true);
                                        dataList.push(item);
                                    } else if (!item._disabled) {
                                        this.$set(item, '_checked', false);
                                    };
                                });
                                this.sourceMachineList = dataList;
                                this.checkArray = dataList;
                                this.tableLoading = false;
                            } else {
                                this.tableLoading = false;
                                this.initCheckMachineMethods();
                                this.sourceMachineList = [];
                                emptyTips(this, '开始机台不能早于结束机台!');
                            };
                        }, 0);
                    } else {
                        this.initCheckMachineMethods();
                        emptyTips(this, '请输入结束机台号!');
                    };
                } else {
                    this.initCheckMachineMethods();
                    emptyTips(this, '请输入开始机台号!');
                };
            },
            // 末排产modal
            closeModalEvent () {
                this.moreScheduleModalState = false;
            },
            moreScheduleModalChangeEvent (e) {
                if (e === false) {
                    this.moreScheduleModalSpinShow = false;
                }
                this.moreScheduleModalState = e;
            },
            // 查看末排产事件
            seeMoreSchedulingEvent (machineCode, machineId) {
                this.moreScheduleModalSpinShow = true;
                this.moreScheduleModalState = true;
                this.moreScheduleModalTitle = `${machineCode}排产详情`;
                this.getMoreScheduleDetailHttp(machineId);
            },
            // 获取末排产详情
            getMoreScheduleDetailHttp (machineId) {
                this.$call('work.center.machine.machineWorkDetailEx', { machineId: machineId }).then(res => {
                    if (res.data.status === 200) {
                        this.moreScheduleModalSpinShow = false;
                        this.moreScheduleModalData = res.data.res;
                    };
                });
            },
            getCheckRowChangeEvent (e) {
                this.checkArray = e;
            },
            selectMachineModalStateChangeEvent (state) {
                if (state === false) {
                    this.checkArray = [];
                    this.workCenterValue = null;
                    this.queryBarMachineCodeValue = '';
                    this.beginMachine = '';
                    this.endMachine = '';
                    this.contrastProductColorModalState = false;
                    this.confirmMachineLoading = false;
                };
                this.$emit('on-visible-change', state);
            },
            selectMachineModalConfirmEvent () {
                this.confirmMachineLoading = true;
                let newCheckMachineArr = [];
                this.checkArray.forEach((item) => {
                    if (!item._disabled) {
                        newCheckMachineArr.push(item);
                    }
                });
                if (newCheckMachineArr.length !== 0) {
                    this.$emit('select-machine-modal-confirm-event', newCheckMachineArr);
                    this.confirmMachineLoading = false;
                } else {
                    this.confirmMachineLoading = false;
                    noticeTips(this, 'unCheckTips');
                };
            },
            selectMachineModalSearchBtnEvent () {
                this.checkArray = [];
                this.queryBarMachineCodeValue = clearSpace(this.queryBarMachineCodeValue);
                this.$emit('select-machine-modal-search-event', { workCenterId: this.workCenterValue, machineCodeOrName: this.queryBarMachineCodeValue });
            },
            // 给机台上的产品赋值颜色
            setMachineProductColorMethod () {
                let colorList = ['#2C8CF0', '#18BE6A', '#FFD800', '#E46C6E', '#0562C2', '#71B50E', '#FF9900', '#E56CBB', '#2DC9F1', '#2DC9F1', '##FF7900', '#E204CB', '#04B2BD', '#8BE701', '#EB3F14', '#9A66E4', '#4AF2FD', '#A7B50E', '#C60203', '#6866E4'];
                let num = 0;
                this.productColorList.forEach((item, index) => {
                    item.colorStyle = colorList[num];
                    num++;
                    // item.colorStyle = this.colorRandom();
                });
                this.sourceMachineList.forEach((machineItem) => {
                    for (var objItem in machineItem) {
                        this.productColorList.forEach(productColorItem => {
                            if (machineItem[objItem] instanceof Array) {
                                machineItem[objItem].forEach((dateArr) => {
                                    if (productColorItem.productCode === dateArr.productCode) {
                                        dateArr.colorStyle = productColorItem.colorStyle;
                                    };
                                });
                            };
                        });
                    };
                });
                this.queryBarMachineList = JSON.parse(JSON.stringify(this.sourceMachineList));
            }
        },
        watch: {
            selectMachineModalState (newData, oldData) {
                this.showModal = newData;
            },
            selectMachineModalTableData: {
                handler (newVal, oldVal) {
                    this.sourceMachineList = JSON.parse(JSON.stringify(newVal));
                },
                deep: true
            },
            selectMachineMachineAndDate: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        this.productColorList = newVal.drivingProductList;
                        this.setMachineProductColorMethod();
                    }
                },
                deep: true
            }
        },
        mounted () {
            this.selectMachineTableHeader = this.defaultTableHeader;
            this.setTableHeader();
        }
    };
</script>
<style type="text/css" lang="less">
    .modal-content-bar .machine-schedule-bar {
        margin-top: 10px;
        .ivu-form-item-content {
            position: relative;
            line-height: 24px;
            font-size: 12px;
        }
        .ivu-table-small td {
            height: 30px;
        }
        .ivu-table-cell {
            padding-left: 0;
            padding-right: 0;
        }
        .ivu-table-cell span{
            padding-left: 4px;
            padding-right: 0;
        }
    }
    .label-name {
        font-weight: bold;
    }
</style>

<template>
    <div>
        <Modal
                v-model="showModal"
                title="机台排包详情"
                @on-visible-change="detailPackModalStateChangeEvent"
                :maskClosable="false"
                width="1100"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="100" ref="formValidate" :model="formValidate" :show-message="false">
                <Row type="flex">
                    <Col span="6">
                        <FormItem label="配棉版本号：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.prdCottonBlendingId}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="排包区域：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.packingAreaName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="清花机台：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.machineName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="数据状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row :gutter="6" class="chart-param">
                    <Col span="7" v-if="isDiscType">
                        <div>
                            <span>外圈包数</span>
                            <Table border :columns="discOutTableHeader" :data="tableDataLeft" :height="650" size="small"></Table>
                        </div>
                    </Col>
                    <Col span="7" v-if="isDiscType">
                        <div>
                            <span>内圈包数</span>
                            <Table border :columns="discInnerTableHeader" :data="tableDataRight" :height="650" size="small"></Table>
                        </div>
                    </Col>
                    <Col span="10">
                        <div v-if="isDiscType">
                            <pieChart :pieChartData="pieChartData"></pieChart>
                        </div>
                        <div v-if="isRecType">
                            <div v-for="(rowItem, rowIndex) in rowNumber" :key="rowIndex" class="flex-left">
                                <p v-for="(columnItem, columnIndex) in rowItem.columnNumber" :key="columnIndex" class="cell-item"></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button @click="closeEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { noticeTips, translateState } from '../../../libs/common';
    import modalFooter from '../../components/modal-footer';
    import otherMessage from '../../components/otherMessage';
    import pieChart from './pie-chart';
    import modalContentLoading from '../../components/modal-content-loading.vue';
    export default {
        components: { modalFooter, otherMessage, pieChart, modalContentLoading },
        props: {
            saveModalData: {
                type: Object
            },
            detailPackModalState: {
                type: Boolean,
                default: false
            },
            detailPackModalData: {
                type: Object
            },
            spinShow: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                initData: {},
                // 外圆盘式表头
                discOutTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '包',
                        key: 'mpProductName',
                        minWidth: 90
                    },
                    {
                        title: '缝',
                        key: 'msProductName',
                        minWidth: 90,
                        align: 'center'
                    }
                ],
                // 内圆盘式表头
                discInnerTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '包',
                        key: 'mpProductName',
                        minWidth: 90
                    },
                    {
                        title: '缝',
                        key: 'msProductName',
                        minWidth: 90,
                        align: 'center'
                    }
                ],
                recTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '行',
                        key: 'rowNumber',
                        minWidth: 90
                    },
                    {
                        title: '列',
                        key: 'columnNumber',
                        minWidth: 90
                    }
                ],
                tableHeaderLeft: [],
                tableHeaderRight: [],
                tableDataLeft: [],
                tableDataRight: [],
                pieChartData: {},
                isDiscType: false,
                isRecType: false,
                showModal: false,
                formValidate: {
                    prdCottonBlendingId: null,
                    packingAreaId: '',
                    name: '',
                    typeId: '',
                    versionNumber: ''
                }
            };
        },
        methods: {
            closeEvent () {
                this.$emit('on-close');
            },
            // 获取排包区域列表数据
            getPackAreaListRequest () {
                this.$call('packing.area.list', {
                    prdCottonBlendingId: this.formValidate.prdCottonBlendingId, // 配棉档案id
                    getPrdCottonBlendingAreaId: this.cottonPackChartId, // 配棉排包图id
                    workshopId: this.formValidate.workshopId,
                    auditState: 3
                }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.packAreaList = res.data.res;
                    };
                });
            },
            // 获取排包区域
            getPackingAreaEvent (e) {
                if (e) {
                    if (this.formValidate.packingAreaId && this.formValidate.prdCottonBlendingId) {
                        this.validatorIfExist();
                    };
                } else {
                    this.formValidate.packingAreaId = null;
                    this.formValidate.packingAreaCode = '';
                    this.formValidate.packingAreaName = '';
                    this.formValidate.machineId = null;
                    this.formValidate.machineCode = '';
                    this.formValidate.machineName = '';
                };
            },
            // 获取配棉版本号(冗余，现在的作用是返回配棉档案的原料)
            getCottonVersionEvent (e) {
                if (e) {
                    this.formValidate.packingAreaId = '';
                    this.formValidate.packAreaList = [];
                    this.tableDataLeft = [];
                    this.tableDataRight = [];
                    this.getPackAreaListRequest();
                    this.formValidate.prdCottonBlendingId = e.value;
                    this.formValidate.versionNumber = e.label;
                    this.formValidate.cottonArchivesList.forEach(item => {
                        if (item.id === e.value) {
                            this.formValidate.workshopId = item.workshopId;
                            this.formValidate.workshopName = item.workshopName;
                        };
                    });
                } else {
                    this.formValidate.prdCottonBlendingId = null;
                    this.formValidate.versionNumber = '';
                };
            },
            // 根据排包区域赋值
            setValueOperations () {
                this.formValidate.packAreaList.forEach(item => {
                    if (item.id === this.formValidate.packingAreaId) {
                        this.initData = item;
                        this.formValidate.packingAreaId = item.id;
                        this.formValidate.packingAreaCode = item.code;
                        this.formValidate.packingAreaName = item.name;
                        this.formValidate.machineId = item.machineId;
                        this.formValidate.machineCode = item.machineCode;
                        this.formValidate.machineName = item.machineName;
                        this.formValidate.typeId = item.typeId;
                        this.formValidate.typeName = item.typeName;
                        if (item.typeName.indexOf('圆盘式') !== -1) {
                            this.isDiscType = true;
                            this.isRecType = false;
                            this.formValidate.innerPacketNumber = item.innerPacketNumber;
                            this.formValidate.outerPacketNumber = item.outerPacketNumber;
                            this.tableHeaderLeft = JSON.parse(JSON.stringify(this.discOutTableHeader));
                            this.tableHeaderRight = JSON.parse(JSON.stringify(this.discInnerTableHeader));
                        };
                    };
                });
            },
            // 校验所选排包区域是否存在
            validatorIfExist () {
                this.$call('prd.cotton.blending.area.existVersionArea', {
                    prdCottonBlendingId: this.formValidate.prdCottonBlendingId,
                    packingAreaId: this.formValidate.packingAreaId,
                    id: this.cottonPackChartId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.setValueOperations();
                        let responseData = res.data.res;
                        if (this.formValidate.innerPacketNumber !== this.tableDataRight.length && this.formValidate.outerPacketNumber !== this.tableDataLeft.length) {
                            responseData.msProductId = null;
                            responseData.msProductCode = '';
                            responseData.msProductName = '';
                            responseData.mpProductId = null;
                            responseData.mpProductCode = '';
                            responseData.mpProductName = '';
                            let innerPacketColorList = [];
                            let outPacketColorList = [];
                            let innerArr = this.createArrLength(this.formValidate.innerPacketNumber);
                            let outArr = this.createArrLength(this.formValidate.outerPacketNumber);
                            this.tableDataRight = [];
                            this.tableDataLeft = [];
                            innerArr.forEach((item, index) => {
                                innerPacketColorList.push('#f1f1f1');
                                innerPacketColorList.push('#fff');
                                this.tableDataRight.push(responseData);
                            });
                            outArr.forEach((item, index) => {
                                outPacketColorList.push('#f1f1f1');
                                outPacketColorList.push('#fff');
                                this.tableDataLeft.push(responseData);
                            });
                            this.initData.innerPacketColorList = innerPacketColorList;
                            this.initData.outPacketColorList = outPacketColorList;
                            setTimeout(() => { this.pieChartData = JSON.parse(JSON.stringify(this.initData)); }, 0);
                        };
                    };
                });
            },
            // 动态数组
            createArrLength (length) {
                return Array(length).fill(null).map((_, h) => h);
            },
            // 抓包方式
            getTypeEvent (e) {
                if (e) {
                    this.formValidate.innerPacketNumber = 0;
                    this.formValidate.outerPacketNumber = 0;
                    this.formValidate.rowNumber = 0;
                    this.formValidate.columnNumber = 0;
                    this.formValidate.typeId = e.value;
                    this.formValidate.typeName = e.label;
                    if (e.label.indexOf('圆盘式') !== -1) {
                        this.isDiscType = true;
                        this.isRecType = false;
                    } else {
                        this.isDiscType = false;
                        this.isRecType = true;
                    }
                } else {
                    this.formValidate.typeId = null;
                    this.formValidate.typeName = '';
                }
            },
            detailPackModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.pieChartData = {};
                    this.isDiscType = false;
                    this.isRecType = false;
                    this.formValidate = {};
                }
            }
        },
        watch: {
            detailPackModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            detailPackModalData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        this.formValidate = JSON.parse(JSON.stringify(newVal));
                        this.formValidate.auditState ? this.formValidate.auditStateName = translateState(this.formValidate.auditState) : false;
                        if (newVal.typeName) {
                            if (newVal.typeName.indexOf('圆盘式') !== -1) {
                                this.isDiscType = true;
                                this.isRecType = false;
                                this.tableDataLeft = newVal.outerPlaceList;
                                this.tableDataRight = newVal.innerPlaceList;
                                console.log('数据', newVal)
                                setTimeout(() => { this.pieChartData = newVal; }, 1000);
                                this.initData = newVal;
                            } else {
                                this.isDiscType = false;
                                this.isRecType = true;
                            };
                        };
                    };
                },
                deep: true
            }
        }
    };
</script>
<style type="text/css" lang="less">
    .chart-param {
        margin-top: 10px;
        .ivu-form-item-content {
            position: relative;
            line-height: 30px;
            font-size: 12px;
        }
        .ivu-table-small td {
            height: 30px;
        }
        .ivu-table-cell span{
            padding-left: 4px;
            padding-right: 0;
        }
    }
    .flex-left .cell-item {
        width: 25px;
        height: 25px;
        background: #ff9900;
        border: solid 1px #fff;
    }
</style>

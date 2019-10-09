<template>
    <div>
        <sh-modal
                :customShModalFooter="true"
                v-on="$listeners"
                :shModalWidth="1450"
                :shModalState="packChartModal"
                :shModalTitle="packChartModalTitle"
                @on-visible-change="packChartModalStateChange"
        >
            <div slot="shModalContent">
                <modal-content-loading :spinShow="spinShow"></modal-content-loading>
                <div v-if="packChartId" class="sh-mask-section">
                    <Form :label-width="100" ref="formValidate" :model="formValidate" :show-message="false">
                        <Row type="flex">
                            <Col span="4">
                                <FormItem label="配棉版本号：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.versionNumber}}</div>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="生产批号：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.batchCode}}</div>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="排包区域：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.packingAreaName}}</div>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="清花机台：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.machineName}}</div>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="原料包数：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.materialPacketQty}}</div>
                                </FormItem>
                            </Col>
                            <Col span="4">
                                <FormItem label="副产品包数：" class="formItemMargin">
                                    <div class="read-only-item">{{formValidate.lapWastePacketQty}}</div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row :gutter="6" class="chart-param">
                            <Col>
                                <div class="flex-left sh-mask-color">
                                    <div>
                                        <span>外圈包数</span>
                                        <Table border :columns="discOutTableHeader" :data="tableDataLeft" :height="640" size="small"></Table>
                                    </div>
                                    <div class="queryBarMarginLeft">
                                        <span>内圈包数</span>
                                        <Table border :columns="discInnerTableHeader" :data="tableDataRight" :height="640" size="small"></Table>
                                    </div>
                                    <div class="queryBarMarginLeft">
                                        <span>缝包数</span>
                                        <Table border :columns="creviceTableHeader" :data="creviceTableData" size="small"></Table>
                                    </div>
                                </div>
                                <Row class="margin-top-10 total-bar" v-if="formValidate.cottonBlendingDetailList&&formValidate.cottonBlendingDetailList.length!==0">
                                    <Col>汇总统计</Col>
                                    <div class="total-bar-border">
                                        <Row type="flex" :gutter="20" v-for="(item, index) in formValidate.cottonBlendingDetailList" :key="index">
                                            <Col span="9">
                                                <div class="flex-left">
                                                    <div class="total-label-width">原料：</div>
                                                    <div>{{`${item.productName}(${item.productCode})`}}</div>
                                                </div>
                                            </Col>
                                            <Col span="4">
                                                <div class="flex-left">
                                                    <div class="total-label-width">批号：</div>
                                                    <div>{{item.batchCode}}</div>
                                                </div>
                                            </Col>
                                            <Col span="4">
                                                <div class="flex-left">
                                                    <div class="total-label-width">包数：</div>
                                                    <div>{{item.packetQty}}</div>
                                                </div>
                                            </Col>
                                            <Col span="4">
                                                <div class="flex-left">
                                                    <div class="total-label-width">重量：</div>
                                                    <div>{{item.weightQty}}</div>
                                                </div>
                                            </Col>
                                            <Col span="3">
                                                <div class="flex-left">
                                                    <div class="total-label-width">比例：</div>
                                                    <div>{{item.mixtureRatio}}</div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Row>
                            </Col>
                            <Col style="width: 700px;">
                                <pieChart :pieChartData="pieChartData"></pieChart>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div v-else class="sh-mask-color no-data-bar">暂无数据</div>
            </div>
            <div slot="shModalFooter"></div>
        </sh-modal>
    </div>
</template>
<script>
    import pieChart from '../../../cotton-blend/pack-chart/pie-chart';
    import modalContentLoading from '../../../components/modal-content-loading';
    import shModal from '../../../data-monitor/components/sh-modal';
    export default {
        components: { pieChart, modalContentLoading, shModal },
        props: {
            packChartModal: {
                type: Boolean,
                default: false
            },
            packChartId: {
                type: Number
            },
            packChartModalTitle: {
                type: String
            }
        },
        data () {
            return {
                spinShow: false,
                isDiscType: true,
                pieChartData: {},
                formValidate: {},
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
                        width: 150
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
                        width: 150
                    }
                ],
                creviceTableHeader: [
                    {
                        title: '副产品',
                        key: 'msProductName',
                        width: 150
                    },
                    {
                        title: '平均包重',
                        key: 'packetWeight',
                        width: 90,
                        align: 'right'
                    },
                    {
                        title: '包数',
                        width: 90,
                        key: 'packetQty',
                        align: 'right'
                    }
                ],
                tableDataLeft: [],
                tableDataRight: [],
                creviceTableData: []
            };
        },
        methods: {
            packChartModalStateChange () {
                // this.
            },
            clickMaskEvent () {
                this.$emit('on-mask-closable');
                this.pieChartData = {};
                this.spinShow = false;
            },
            getCottonChartDetailRequest (id) {
                this.spinShow = true;
                this.$call('prd.cotton.blending.area.detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.formValidate = this.setColorMethod(responseData);
                        this.pieChartData = this.setColorMethod(responseData);
                        this.tableDataLeft = responseData.outerPlaceList;
                        this.tableDataRight = responseData.innerPlaceList;
                        this.creviceTableData = responseData.creviceTableData;
                        this.spinShow = false;
                    };
                });
            },
            // 设置颜色
            setColorMethod (responseData) {
                responseData.outPacketColorList = [];
                responseData.innerPacketColorList = [];
                let placeList = [];
                // placeList是缝包数的集合，byProductList是缝的下拉副产品集合
                if (responseData.placeList && responseData.placeList.length !== 0) {
                    placeList = [responseData.placeList[0]];
                    placeList[0].packetQty = responseData.lapWastePacketQty;
                    placeList[0].byProductList = responseData.byProductList;
                    responseData.hasCrevice = true;// eChart根据hasCrevice是否渲染缝
                } else {
                    responseData.hasCrevice = false;
                    responseData.lapWastePacketQty = 0;
                    placeList = [];
                };
                responseData.creviceTableData = placeList;
                responseData.outerPlaceList.map((item) => {
                    item.rawMaterialList = responseData.rawMaterialList;
                    // 有缝（有副产品）
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 包和缝都存在
                        if (item.mpProductId && item.msProductId) {
                            responseData.outPacketColorList.push('#2b85e4');
                            responseData.outPacketColorList.push('#ff9900');
                        } else {
                            // 包存在
                            item.mpProductId ? responseData.outPacketColorList.push('#2b85e4') : responseData.outPacketColorList.push('#fff');
                            // 缝存在
                            item.msProductId ? responseData.outPacketColorList.push('#ff9900') : responseData.outPacketColorList.push('#fff');
                        };
                    } else {
                        // 无缝（没有副产品）
                        item.mpProductId ? responseData.outPacketColorList.push('#2b85e4') : responseData.outPacketColorList.push('#fff');
                    };
                    return item;
                });
                responseData.innerPlaceList.map((item) => {
                    item.rawMaterialList = responseData.rawMaterialList;
                    // 有缝（有副产品）
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 包和缝都存在
                        if (item.mpProductId && item.msProductId) {
                            responseData.innerPacketColorList.push('#2b85e4');
                            responseData.innerPacketColorList.push('#ff9900');
                        } else {
                            // 包存在
                            item.mpProductId ? responseData.innerPacketColorList.push('#2b85e4') : responseData.innerPacketColorList.push('#fff');
                            // 缝存在
                            item.msProductId ? responseData.innerPacketColorList.push('#ff9900') : responseData.innerPacketColorList.push('#fff');
                        };
                    } else {
                        // 无缝（没有副产品）
                        item.mpProductId ? responseData.innerPacketColorList.push('#2b85e4') : responseData.innerPacketColorList.push('#fff');
                    };
                    return item;
                });
                return responseData;
            }
        },
        watch: {
            packChartId (newVal, olVal) {
                if (newVal) {
                    this.getCottonChartDetailRequest(newVal);
                }
            }
        }
    };
</script>
<style lang="less">
    .total-bar {
        color: #515a6e;
    }
    .total-bar-border {
        border: 1px solid gainsboro;
        border-radius: 6px;
        padding: 4px;
    }
    .total-label-width {
        column-width:  40px;
        font-weight: bold;
    }
    .chart-param {
        display: flex;
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
        .ivu-table-tip table {
            width: auto;
        }
    }
    .sh-mask-color {
        color: #17233d
    }
    .sh-mask-section {
        padding: 16px;
    }
    .no-data-bar {
        line-height: 800px;
        text-align: center;
    }
</style>

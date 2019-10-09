<template>
    <div>
        <Modal
                v-model="showModal"
                title="生产订单进度"
                :mask-closable="false"
                @on-visible-change="getOrderProgressModalState"
                width="1500"
                draggable
        >
            <modal-content-loading :spinShow="orderProgressModalLoading"></modal-content-loading>
            <Row class="order-message-bar order-bar">
                <Col span="4" class="order-bar-left" >
                    <p>产品（生产订单号）</p>
                    <p>{{`${orderData.productName}(${orderData.code})`}}</p>
                </Col>
                <Col span="4">
                    <div class="order-progress-border-bottom">
                        <p class="grid-row">产品编码：{{orderData.productCode}}</p>
                    </div>
                    <p class="grid-row">计量单位：{{`${orderData.unitName}(${orderData.unitCode})`}}</p>
                </Col>
                <Col span="4" class="order-progress-border-left">
                    <div class="order-progress-border-bottom">
                        <p class="grid-row">产品名称：{{orderData.productName}}</p>
                    </div>
                    <p class="grid-row">订单数量：{{orderData.productionQty}}</p>
                </Col>
                <Col span="4" class="order-progress-border-left">
                    <div class="order-progress-border-bottom">
                        <p class="grid-row">交货开始日期：{{orderData.deliveryDateFrom}}</p>
                    </div>
                    <p class="grid-row">完工数量：{{orderData.completionQty}}</p>
                </Col>
                <Col span="4" class="order-progress-border-left">
                    <div class="order-progress-border-bottom">
                        <p class="grid-row">交货结束日期：{{orderData.deliveryDateTo}}</p>
                    </div>
                    <p class="grid-row">未完数量：{{ orderData.productionQty - orderData.completionQty }}</p>
                </Col>
                <Col span="4" class="order-progress-border-left">
                    <div class="order-progress-border-bottom">
                        <p class="grid-row">日供货量：{{orderData.dailySupplyQty}}</p>
                    </div>
                    <p class="grid-row">销售订单号：{{orderData.salesCode}}</p>
                </Col>
            </Row>
            <Row type="flex" justify="center" align="middle" class="legend-bar">
                <Col>
                    <div class="flex-between-center">
                        <span class="legend-label legend-label-margin">图例:</span>
                    </div>
                </Col>
                <Col>
                    <div class="flex-between-center">
                        <span class="legend-label">未开始</span>
                        <div class="not-start-legend"></div>
                    </div>
                </Col>
                <Col>
                    <div class="flex-between-center">
                        <span class="legend-label">已完成</span>
                        <div class="finish-legend"></div>
                    </div>
                </Col>
                <Col>
                    <div class="flex-between-center">
                        <span class="legend-label">正常</span>
                        <div class="normal-legend"></div>
                    </div>
                </Col>
                <Col>
                    <div class="flex-between-center">
                        <span class="legend-label">延期</span>
                        <div class="delay-legend"></div>
                    </div>
                </Col>
            </Row>
            <div class="notice-list-height">
                <Row v-for="(item, index) in orderData.noticeMonitorList" :key="index" class="order-message-bar margin-bottom-10">
                    <Col span="4" class="notice-item-left">
                        <p class="grid-row">生产通知单号：{{item.code}}</p>
                        <p class="grid-row">产品：{{item.productName}}</p>
                        <span class="grid-row">生产工序：{{item.processName}}</span>
                    </Col>
                    <Col span="20">
                        <Row>
                            <Col span="4" class="notice-detail-right">
                                <p>计划开工日期：{{item.planStartDate}}</p>
                                <p>计划生产量：{{item.productionQty}}</p>
                            </Col>
                            <Col span="4" class="notice-detail-right">
                                <p>计划完工日期：{{item.planFinishDate}}</p>
                                <p>累计完成量：{{item.completionQty}}</p>
                            </Col>
                            <Col span="4" class="notice-detail-right">
                                <p>计划完成天数：{{item.planCompletionDay}}</p>
                                <p>未完工量：{{item.unCompletionQty}}</p>
                            </Col>
                            <Col span="4" class="notice-detail-right">
                                <p>剩余天数：{{item.surplusDay}}</p>
                                <p>预计小时产量：{{item.estimateHourOutput}}</p>
                            </Col>
                            <Col span="4" class="notice-detail-right">
                                <p>排产机台数：{{item.machineNumber}}</p>
                                <p>当前小时产量：{{item.currentHourOutput}}</p>
                            </Col>
                            <Col span="4" class="notice-detail-right">
                                <p>开台数：{{item.openMachineNumber}}</p>
                                <p>实际完工日期：{{item.currentHourOutput}}</p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
                <Button type="error" @click="closeEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: { modalContentLoading },
        props: {
            orderProgressModalState: {
                type: Boolean,
                default: false
            },
            orderProgressModalData: {
                type: Object
            },
            orderProgressModalLoading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showModal: false,
                orderData: {}
            };
        },
        methods: {
            getOrderProgressModalState (e) {
                this.$emit('on-visible-change', e);
            },
            closeEvent () {
                this.$emit('on-close');
            }
        },
        created () {

        },
        watch: {
            orderProgressModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            orderProgressModalData: {
                handler (newVal, oldVal) {
                    this.orderData = newVal;
                },
                deep: true
            }
        }
    };
</script>
<style scoped>
    .notice-detail-right p:first-child {
        border-bottom: solid 1px #dddee2;
    }
    .notice-detail-right p:nth-child(2) {
        word-break:break-all;
    }
    .notice-detail-right p {
        padding-left: 10px;
    }
    .notice-list-height .order-message-bar .notice-item-left {
        text-align: center;
        padding: 10px 0;
        background: #f8f8fa;
    }
    .legend-bar {
        height: 58px;
    }
    .order-bar {
        font-weight: bold;
        color: #505b6f;
    }
    .order-bar .order-bar-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 85px;
        border-right: 1px solid #dddee2;
        background: #f8f8fa;
    }
    .order-bar .grid-row {
        margin: 12px 0 12px 20px;
    }
    .order-message-bar {
        border: solid 1px #dddee2;
        border-radius: 4px;
    }
    .order-bar .order-progress-border-left {
        border-left: solid 1px #dddee2;
    }
    .order-bar .order-progress-border-bottom {
        border-bottom: solid 1px #dddee2;
    }
    .notice-detail-right {
        line-height: 36px;
        border-left: 1px solid #dddee2;
    }
    .flex-between-center .legend-label {
        line-height: 20px;
        margin: 0 16px 0 4px;
    }
    .flex-between-center .legend-label-margin {
        margin-right: 70px;
    }
    .flex-between-center .not-start-legend {
        width:18px;height: 18px;background: #808080;border-radius: 100%;margin-right: 70px;
    }
    .flex-between-center .finish-legend{
        width:18px;height: 18px;background: #04b2bd;border-radius: 100%;margin-right: 70px;
    }
    .flex-between-center .normal-legend{
        width:18px;height: 18px;background: #1abd6a;border-radius: 100%;margin-right: 70px;
    }
    .flex-between-center .delay-legend{
        width:18px;height: 18px;background: #ee3f14;border-radius: 100%
    }
    .notice-list-height {
        max-height: 550px;overflow: auto;
    }
</style>

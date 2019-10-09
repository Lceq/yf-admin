<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="flex-left">
                <Button v-show="formValidate.auditState === 1" icon="ios-create" type="primary" class="queryBarMarginRight operatingSpaceMargin" @click="editEvent">编辑</Button>
                <Button icon="ios-create" type="primary" class="queryBarMarginRight operatingSpaceMargin" @click="backListEvent">返回列表页</Button>
                <Button v-show="formValidate.auditState===2" icon="ios-undo" type="warning" @click="cancelEvent" class="queryBarMarginRight operatingSpaceMargin">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" type="primary" @click="auditEvent" class="queryBarMarginRight operatingSpaceMargin">审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-refresh" type="warning" @click="unAuditEvent" class="queryBarMarginRight operatingSpaceMargin">撤销审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeEvent">关闭单据</Button>
                <Button v-show="formValidate.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="unCloseEvent">撤销关闭</Button>
            </Col>
        </Row>
        <div class="margin-top-20">
            <Form :label-width="100"  ref="formValidate" :model="formValidate" :show-message="false">
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="领料申请单号:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.code}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="申请日期:" class="formItemMargin" :label-width="80">
                            <div class="modal-readonly">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="数据状态:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="24" :xl="16" :xxl="15">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input :autosize="{minRows: 1,maxRows: 1}" v-model="formValidate.remarks" type="textarea" placeholder="请输入"/>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="activeTabs">
                    <TabPane label="基本信息" name="0">
                        <Row type="flex">
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                                <div>
                                    <Table size="small" border :columns="tableHeader" :data="tableData"></Table>
                                </div>
                                <div class="total-bar">
                                    <p class="max-label-width item-line-height">合计：</p>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">配棉包数：</p>
                                        <p class="item-line-height text-left">{{packetQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">已领包数：</p>
                                        <p class="item-line-height text-left">{{usedPacketQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left apply-num-bar">
                                        <span class="max-label-width item-line-height text-left">申领包数：</span>
                                        <p class="item-line-height text-left">{{applyPacketQtyTotal}}</p>
                                    </div>
                                    <!--<div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">配棉重量：</p>
                                        <p class="item-line-height text-left">{{weightQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">已领重量：</p>
                                        <p class="item-line-height text-left">{{usedWeightQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width">
                                        <p class="middle-label-width item-line-height text-left margin-left-2">现存量：</p>
                                        <p class="item-line-height text-left">{{stockQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width">
                                        <p class="middle-label-width item-line-height text-left margin-left-2">可用量：</p>
                                        <p class="item-line-height text-left">{{usableQtyTotal}}</p>
                                    </div>-->
                                    <div class="flex-left apply-num-bar">
                                        <span class="max-label-width item-line-height ">申领重量：</span>
                                        <p class="item-line-height text-left">{{applyWeightQtyTotal}}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="1">
                        <operation-log :operationData="operationData"></operation-log>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
    </card>
</template>
<script>
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, toDaySeconds, toDay, setPage, noticeTips, compClientHeight, clearSpace, formatDate, getOperationData, emptyTips, translateState } from '../../../libs/common';
    import moreOrder from '../archives/more-order';
    import operationLog from '../../components/operation-log';
    import moreMaterial from './more-material';

    export default {
        components: { moreOrder, operationLog, moreMaterial },
        data () {
            return {
                stockQtyTotal: 0,
                usableQtyTotal: 0,
                packetQtyTotal: 0,
                usedPacketQtyTotal: 0,
                applyPacketQtyTotal: 0,
                weightQtyTotal: 0,
                usedWeightQtyTotal: 0,
                applyWeightQtyTotal: 0,
                operationData: [],
                globalLoadingShow: false,
                activeTabs: '0',
                formValidate: {},
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        width: 100,
                        title: '配棉版本号',
                        key: 'versionNumber'
                    },
                    {
                        width: 100,
                        title: '排包区域',
                        key: 'packingAreaName'
                    },
                    {
                        title: '次数',
                        key: 'number',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '生产批号',
                        key: 'batchCode',
                        minWidth: 100
                    },
                    {
                        title: '生产单号',
                        key: 'prdOrderCodes',
                        minWidth: 100,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: typeof params.row.prdOrderCodes === 'string' ? JSON.parse(params.row.prdOrderCodes) : params.row.prdOrderCodes
                                }
                            });
                        }
                    },
                    {
                        title: '原料',
                        key: 'productCode',
                        width: 900,
                        render: (h, params) => {
                            return h(moreMaterial, {
                                props: {
                                    listData: params.row.applicationDetailList,
                                    isDetail: true
                                },
                                on: {
                                    'packet-change': (e, index) => {
                                        params.row.applicationDetailList[index].applyPacketQty = e;
                                        this.tableData[params.index] = params.row;
                                    },
                                    'weight-change': (e, index) => {
                                        params.row.applicationDetailList[index].applyWeightQty = e;
                                        this.tableData[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    }
                ],
                tableData: [],
                toCreated: false
            };
        },
        methods: {
            // 合计
            calculateTotal () {
                this.packetQtyTotal = 0;
                this.usedPacketQtyTotal = 0;
                this.applyPacketQtyTotal = 0;
                this.weightQtyTotal = 0;
                this.usedWeightQtyTotal = 0;
                this.applyWeightQtyTotal = 0;
                this.tableData.forEach(item => {
                    item.applicationDetailList.forEach(subItem => {
                        this.packetQtyTotal = mathJsAdd(this.packetQtyTotal, subItem.packetQty);
                        this.usedPacketQtyTotal = mathJsAdd(this.usedPacketQtyTotal, subItem.usedPacketQty);
                        this.applyPacketQtyTotal = mathJsAdd(this.applyPacketQtyTotal, subItem.applyPacketQty);
                        this.weightQtyTotal = mathJsAdd(this.weightQtyTotal, subItem.weightQty);
                        this.usedWeightQtyTotal = mathJsAdd(this.usedWeightQtyTotal, subItem.usedWeightQty);
                        this.applyWeightQtyTotal = mathJsAdd(this.applyWeightQtyTotal, subItem.applyWeightQty);
                        this.stockQtyTotal = mathJsAdd(this.stockQtyTotal, subItem.stockQty)
                        this.usableQtyTotal = mathJsAdd(this.usableQtyTotal, subItem.usableQty);
                    });
                });
            },
            cancelEvent () {
                this.$call('prd.material.application.cancel', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'cancelTips');
                        this.getDetailRequest();
                    };
                });
            },
            auditEvent () {
                this.$call('prd.material.application.approve', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'auditTips');
                        this.getDetailRequest();
                    };
                });
            },
            unAuditEvent () {
                this.$call('prd.material.application.unapprove', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unAuditTips');
                        this.getDetailRequest();
                    };
                });
            },
            closeEvent () {
                this.$call('prd.material.application.close', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'closeTips');
                        this.getDetailRequest();
                    };
                });
            },
            unCloseEvent () {
                this.$call('prd.material.application.unclose', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unCloseTips');
                        this.getDetailRequest();
                    };
                });
            },
            backListEvent () {
                this.$router.push({
                    path: 'list-material-apply',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'detail-material-apply');
            },
            editEvent () {
                this.$router.push({
                    path: 'edit-material-apply',
                    query: {
                        id: this.$route.query.id,
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'detail-material-apply');
            },
            // 配棉生条表移除事件
            reduceTableButton (index) {
                if (this.tableData.length > 1) {
                    this.tableData.splice(index, 1);
                };
            },
            // 提交的请求
            submitHttp (id) {
                this.$call('prd.material.application.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailRequest();
                    };
                });
            },
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            getDetailRequest () {
                this.$call('prd.material.application.detail', {id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate = res.data.res;
                        this.operationData = getOperationData(res.data.res);
                        this.formValidate.auditStateName = translateState(res.data.res.auditState);
                        res.data.res.applicationAreaList.forEach(item => {
                            item.applicationDetailList.forEach(prdItem => {
                                if (prdItem.prdOrderCodes) {
                                    typeof prdItem.prdOrderCodes === 'string' ? prdItem.prdOrderCodes = JSON.parse(prdItem.prdOrderCodes) : false;
                                } else {
                                    prdItem.prdOrderCodes = [];
                                };
                            });
                        });
                        this.tableData = res.data.res.applicationAreaList;
                        this.calculateTotal();
                        this.globalLoadingShow = false;
                    };
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDetailRequest();
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                setTimeout(() => {
                    this.$refs['formValidate'].resetFields();
                    this.globalLoadingShow = true;
                    this.getDetailRequest();
                }, 0);
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style scoped>
    .total-width-120{
        width: 120px;
    }
    .total-width-121 {
        width: 121px;
    }
    .total-num-box {
        border: solid 1px #e8eaec;
        padding: 0 8px;
        font-size: 13px;
        border-top: none;
    }
    .middle-label-width {
        font-weight: bold;
        width: 52px;
    }
    .max-label-width {
        font-weight: bold;
        width: 64px;
    }
    .min-label-width {
        font-weight: bold;
        width: 36px;
    }
    .packet-bar-width {
        width: 100px;
    }
    .material-bar-width {
        width: 250px;
    }
    .material-value-width {
        width: 200px;
    }
    .item-line-height {
        line-height: 24px;
    }
    .text-left {
        text-align: left;
    }
    .label-width {
        width: 60px;
    }
    .pack-number-width {
        width: 100px;
    }
    .apply-num-bar {
        margin: 0px 0 2px 4px;
    }
    .margin-left-2 {
        margin-left: 4px;
    }
    .total-bar {
        display: flex;justify-content: flex-end;font-size: 12px;
    }
</style>

<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="contentLeft">
                <Button icon="md-add" type="primary" @click="addClick" class="queryBarMarginRight">新增</Button>
                <Button v-show="parseFloat(detailData.auditState) === 1" icon="ios-create" type="primary" class="screenButton" @click="editEvent">编辑</Button>
                <Button icon="ios-create" type="primary" class="screenButton" @click="backListEvent">返回列表页</Button>
                <!--<Button icon="ios-create" type="primary" v-show="detailData.auditState <= 1" class="screenButton" @click="pushEvent">提交</Button>-->
                <Button icon="ios-undo" type="warning" v-show="detailData.auditState === 2" class="screenButton" @click="cancelEvent">撤销提交</Button>
                <Button icon="md-done-all" type="primary" v-show="detailData.auditState === 2" class="screenButton" @click="auditEvent">审核</Button>
                <Button icon="md-refresh" type="warning" v-show="detailData.auditState === 3 && detailData.isQuote === false && detailData.isReport === false" class="screenButton" @click="unAuditEvent">撤销审核</Button>
                <Button icon="md-close" type="error" v-show="detailData.auditState === 3" class="screenButton" @click="closeEvent">关闭单据</Button>
                <Button icon="md-swap" type="warning" v-show="detailData.auditState === 4" class="screenButton" @click="unCloseEvent">撤销关闭</Button>
                <Button v-show="detailData.auditState === 3 && isQuote === false" class="screenButton" @click="createdBomEvent">生成制造BOM</Button>
                <Button v-show="detailData.auditState === 3 && isQuote === true" class="screenButton" @click="seeBomDetailEvent">查看制造BOM</Button>
            </Col>
        </Row>
        <Row class="margin-top-20">
            <Col>
                <Form :label-width="110" :show-message="false">
                    <Row>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="订单编号:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.code}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label=" 订单日期:" prop="orderDateIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.orderDate}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="生产车间:" prop="workshopIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.workshopName}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="订单类型:" prop="orderTypeIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.typeName}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="订单优先级:" prop="emergencyStateIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.priorityName}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="SAP单号:" prop="emergencyStateIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.salesCode}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="交货开始时间:" prop="deliveryFromIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.deliveryDateFrom}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="交货结束时间:" prop="deliveryToIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.deliveryDateTo}}</div>
                            </FormItem>
                        </Col>
                        <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="日供货量:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.dailySupplyQty}}</div>
                            </FormItem>
                        </Col>-->
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="单据状态:" prop="batchNumberIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{auditStateName}}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                            <FormItem label="引用状态:" prop="batchNumberIpt" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{detailData.isQuoteName}}</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                            <FormItem label="备注:" class="formItemMargin">
                                <Input readonly v-model="detailData.remark" type="textarea" :rows="3" :autosize="{maxRows: 1,minRows: 1}" placeholder="请输入"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Tabs v-model="activeTabs">
                                <TabPane label="基本信息" name="0">
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="产品:" prop="materielCodeIpt" class="formItemMargin">
                                                <div class="flex-left">
                                                    <div class="exhibitionInputBackground widthPercentage">{{detailData.productName ? `${detailData.productName}(${detailData.productCode})` : ''}}</div>
                                                </div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="规格型号:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.productModels}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label=" 纺纱工艺:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.technologyName}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label=" 纱线用途:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.purposeName}}</div>
                                            </FormItem>
                                        </Col>
                                        <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label=" 纱线捻向:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.twistDirectionName}}</div>
                                            </FormItem>
                                        </Col>-->
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="批号:" prop="batchNumberIpt" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.batchCode}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label=" 计量单位:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.unitName ? `${detailData.unitName}(${detailData.unitCode})` : ''}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="订单数量:" prop="productionNumIpt" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.productionQty}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="完工数量:" prop="batchNumberIpt" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.completionQty}}</div>
                                            </FormItem>
                                        </Col>
                                        <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                           <FormItem label="溢短装(±%):" class="formItemMargin">
                                               <div class="exhibitionInputBackground">{{detailData.weightRate}}</div>
                                           </FormItem>
                                       </Col>-->
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label=" 计划员:" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.plannerName}}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                            <FormItem label="工艺要求:">
                                                <Input readonly :autosize="{minRows: 3,maxRows: 3} "v-model="detailData.techRequirement" type="textarea" placeholder="请输入"/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane label="交期要求" name="1">
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="订单数量:" prop="productionNumIpt" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{detailData.productionQty}}</div>
                                            </FormItem>
                                        </Col>
                                        <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="日供货量:" class="formItemMargin" prop="dailySupplyQty">
                                                <div class="exhibitionInputBackground">{{detailData.dailySupplyQty}}</div>
                                            </FormItem>
                                        </Col>-->
                                    </Row>
                                    <Row>
                                        <Col :sm="24" :md="24" :lg="18">
                                            <Table size="small" border :columns="tableHeader" :data="detailData.orderDeliveryList"></Table>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane label="质量要求" name="2">
                                    <Row>
                                        <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                            <FormItem label="质量要求:">
                                                <Input readonly :maxlength="512" :autosize="{minRows: 12,maxRows: 12}" v-model="detailData.qualityRequirement" type="textarea" placeholder="请输入"/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane label="包装要求" name="3">
                                    <Row type="flex">
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="包装方式:" class="formItemMargin" :label-width="140" prop="packingModeId">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.packingModeName}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="最小包装重量(KG):" class="formItemMargin" prop="packetWeightMin" :label-width="140">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.packetWeightMin}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="最大包装重量(KG):" class="formItemMargin" prop="packetWeightMax" :label-width="140">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.packetWeightMax}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="装袋要求:" prop="packetQty" :label-width="140" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.packetQty}}</div>
                                            </FormItem>
                                        </Col>
                                        <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="编织袋规格:" :label-width="140" class="formItemMargin" prop="packingBag">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.packingBag}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="封包绳颜色:" :label-width="140" class="formItemMargin" prop="bagMouthId">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.bagMouthName}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="腰绳颜色:" :label-width="140" class="formItemMargin" prop="waistRopeId">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.waistRopeName}}</div>
                                            </FormItem>
                                        </Col>-->
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="是否纸板:" :label-width="140" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.isCardboard?'是': '否'}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="是否有字:" :label-width="140" class="formItemMargin">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.isWord?'是': '否'}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                            <FormItem label="纸管颜色:" :label-width="140" class="formItemMargin" prop="paperTubeId">
                                                <div class="exhibitionInputBackground">{{orderPackingEntity.paperTubeName}}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                            <FormItem label="特殊说明:" :label-width="140" class="formItemMargin">
                                                <Input readonly :autosize="{minRows: 3,maxRows: 3}"v-model="orderPackingEntity.specialRemarks" type="textarea" placeholder="请输入"/>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane label="其他信息" name="4">
                                    <page-other-message
                                            :operationData="operationData"
                                    ></page-other-message>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    </card>
</template>
<script>
    import common, { noticeTips, formatDate, translateState, toDaySeconds, compClientHeight, addNum, getOperationData, translateIsQuote, accDivision } from '../../../libs/common';
    import pageOtherMessage from '../../components/operation-log';
    export default{
        name: 'detail-order',
        components: {
            pageOtherMessage
        },
        data () {
            return {
                globalLoadingShow: false,
                isQuote: false,
                prdBomId: null,
                auditStateName: '',
                activeTabs: '0',
                detailData: {},
                orderPackingEntity: {},
                qualityTableHeader: [
                    {
                        title: '参数编码',
                        sortable: true,
                        key: 'qmParamCode'
                    },
                    {
                        title: '参数名称',
                        key: 'qmParamName',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '质检类别',
                        key: 'qmTypeName',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '指标上限值',
                        key: 'valueMax',
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '指标下限值',
                        key: 'valueMin',
                        sortable: true,
                        align: 'center'
                    }
                ],
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '交货日期',
                        key: 'deliveryDate',
                        align: 'center'
                    },
                    {
                        title: '数量',
                        key: 'deliveredQty',
                        align: 'center'
                    }
                ],
                operationData: [],
                toCreated: false
            };
        },
        methods: {
            addClick () {
                this.$router.push({
                    path: 'addOrder',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'orderDetail');
            },
            backListEvent () {
                this.$router.push({
                    path: 'order',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'orderDetail');
            },
            editEvent () {
                this.$router.push({
                    path: 'editOrder',
                    query: {
                        id: this.$route.query.id,
                        edit: true,
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'orderDetail');
            },
            pushEvent () {
                this.$api.order.submitHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'submitTips');
                    };
                });
            },
            cancelEvent () {
                this.$api.order.cancelHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.$router.push({
                            path: 'editOrder',
                            query: {
                                id: this.$route.query.id,
                                edit: true,
                                activated: true
                            }
                        });
                        this.$store.commit('removeTag', 'orderDetail');
                        noticeTips(this, 'cancelTips');
                    };
                });
            },
            auditEvent () {
                this.$api.order.approveHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            unAuditEvent () {
                this.$api.order.unapproveHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            closeEvent () {
                this.$api.order.closeHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            unCloseEvent () {
                this.$api.order.uncloseHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            createdBomEvent () {
                this.$router.push({
                    path: 'addManufactureBOM',
                    query: {
                        activated: true,
                        orderId: this.$route.query.id,
                        orderCode: this.detailData.code
                    }
                });
            },
            seeBomDetailEvent () {
                this.$router.push({
                    path: 'bomDetail',
                    query: {
                        id: this.prdBomId,
                        activated: true
                    }
                });
            },
            getDetailHttp () {
                this.globalLoadingShow = true;
                this.$api.order.detailHttp({id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        this.auditStateName = translateState(res.data.res.auditState);
                        this.prdBomId = res.data.res.prdBomId;
                        this.isQuote = res.data.res.isQuote;
                        this.operationData = getOperationData(res.data.res);
                        this.detailData = translateIsQuote(res.data.res);
                        this.orderPackingEntity = res.data.res.orderPackingEntity;
                        this.globalLoadingShow = false;
                    };
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDetailHttp();
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDetailHttp();
            };
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style scoped>
    .contentLeft{
        display:flex;
        align-items:center;
    }
    .screenButton{
        margin: 0 4px 0 0;
    }
</style>

<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Form :label-width="100" :show-message="false">
            <Row type="flex" justify="space-between">
                <Col class="flex-between-center">
                    <Button icon="md-add" type="primary" @click="addClick" class="queryBarMarginRight margin-bottom-10">新增</Button>
                    <Button v-show="parseInt(bomDetailData.auditState) === 1" icon="ios-create" type="primary" class="queryBarMarginLeft margin-bottom-10" @click="editEvent">编辑</Button>
                    <Button icon="ios-create" type="primary" class="queryBarMarginLeft margin-bottom-10" @click="backListEvent">返回列表页</Button>
                    <Button v-show="bomDetailData.auditState===2" icon="ios-undo" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="cancelClickEvent">撤销提交</Button>
                    <Button v-show="bomDetailData.auditState===2" icon="md-done-all" class="queryBarMarginLeft margin-bottom-10" type="primary" @click="auditClickEvent">审核</Button>
                    <Button v-show="bomDetailData.auditState===3&&bomDetailData.isQuote===false" icon="md-refresh" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="unAuditClickEvent">撤销审核</Button>
                    <Button v-show="bomDetailData.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeClickEvent">关闭单据</Button>
                    <Button v-show="bomDetailData.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="openClickEvent">撤销关闭</Button>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="BOM单号:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.code}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="单据日期:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.date}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="生产单号:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.prdOrderCode}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="生产车间:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.workshopName}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="产出物料:" prop="materielCodeIpt" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.productCode ? `${bomDetailData.productName}(${bomDetailData.productCode})` : ''}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="规格:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.productModels}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="纱线用途:" class="formItemMargin">
                        <div class="read-only-item">{{ bomDetailData.purposeName }}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="纱线捻向:" class="formItemMargin">
                        <div class="read-only-item">{{ bomDetailData.twistDirectionName }}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="批号:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.batchCode}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="计量单位:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.unitName ? `${bomDetailData.unitName}(${bomDetailData.unitCode})`: '' }}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="订单数量:" prop="specUserIpt" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.productionQty}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="工艺路线:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.specPathName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="交货开始时间:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.deliveryDateFrom}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="交货结束时间:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.deliveryDateTo}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="日供货量:" class="formItemMargin">
                        <div class="read-only-item">{{bomDetailData.dailySupplyQty}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="引用状态:" class="formItemMargin">
                        <div class="read-only-item">{{ bomDetailData.isQuoteName }}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                    <FormItem label="单据状态:" class="formItemMargin">
                        <div class="read-only-item">{{ auditStateName }}</div>
                    </FormItem>
                </Col>
            </Row>
            <Collapse v-model="activePanel" @on-change="getCollapseEvent">
                <Panel v-for="(item, index) in pathProcessList" :key="index" :name="item.processId + ''">
                    {{item.processName}}设计
                    <div slot="content" v-if="item.bomProductList">
                        <div v-for="(productItem, productIndex) in item.bomProductList" :key="productIndex" class="detail-product-bar">
                            <Row>
                                <Col span="24">
                                    <Row class="margin-bottom-15">
                                        <Col><Icon type="logo-buffer" /><span class="margin-left-10">产品信息</span></Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="产出物料:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.productCode ? `${productItem.productName}(${productItem.productCode})` : ''}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="规格:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.productModels}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="批号:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.batchCode}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="计量单位:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.unitName ? `${productItem.unitName}(${productItem.unitCode})` : ''}}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="生产数量:" prop="specUserIpt" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.productionQty}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="计划开工时间:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.planStartDate}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="计划完工时间:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.planFinishDate}}</div>
                                            </FormItem>
                                        </Col>
                                        <!--<Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="制成率%:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.pullRate}}</div>
                                            </FormItem>
                                        </Col>-->
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="上机准备时间:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.preparationHours}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="前道提前时间:" class="formItemMargin">
                                                <div class="read-only-item">{{productItem.feedingHours}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="6">
                                            <FormItem label="工艺单号:" class="formItemMargin">
                                                <a class="spec-sheet-code spec-sheet-message" @click="seeSpecSheetDetailEvent(productItem.specSheetId)">{{productItem.specSheetCode}}</a>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col class="margin-bottom-15"><Icon type="ios-cube" /><span class="margin-left-10">投入物料</span></Col>
                                        <Col>
                                            <Table size="small" border :columns="materialTableHeader" :data="productItem.bomMaterielList"></Table>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    <Row slot="content" v-else-if="item.bomProductList === undefined">
                        <Col class="text-center" span="24">
                            <Spin fix>
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            </Spin>
                        </Col>
                    </Row>
                    <Row slot="content" v-else>
                        <Col class="text-center" span="24">暂无数据</Col>
                    </Row>
                </Panel>
            </Collapse>
            <operationLog :operationData="operationData"></operationLog>
        </Form>
        <see-spec-sheet
                :spinShow="spinShow"
                :setProcessModalState="seeSpecSheetModalState"
                :specProductObj="specProductObj"
                @on-visible-change="seeProcessModalStateChangeEvent"
                @see-process-modal-confirm-event="seeProcessModalConfirmEvent"
                @see-process-modal-cancel-event="seeProcessModalCancelEvent"
        ></see-spec-sheet>
    </card>
</template>
<script>
    import operationLog from '../../components/operation-log';
    import { noticeTips, formatDate, toDay, setPage, translateState, translateIsQuote, getOperationData } from '../../../libs/common';
    import seeSpecSheet from '../manufacture/components/see-spec-sheet';
    export default {
        name: 'detail-manufacture',
        components: { seeSpecSheet, operationLog },
        data () {
            return {
                operationData: [],
                globalLoadingShow: false,
                spinShow: false,
                seeSpecSheetModalState: false,
                specProductObj: {},
                activePanel: '',
                bomDetailData: {},
                auditStateName: '',
                pathProcessList: [],
                materialTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '产品',
                        key: 'mproductCode',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.mproductCode ? `${params.row.mproductName}(${params.row.mproductCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '规格',
                        key: 'mproductModels',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '单位',
                        key: 'munitCode',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.munitCode ? `${params.row.munitName}(${params.row.munitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '批号',
                        key: 'mbatchCode',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '占比%',
                        key: 'mmixtureRatio',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '损耗率%',
                        key: 'mattritionRate',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '投料数量',
                        key: 'mputinQty',
                        align: 'center',
                        minWidth: 80
                    }
                ],
                toCreated: false
            };
        },
        methods: {
            addClick () {
                this.$router.push({
                    path: 'addManufactureBOM',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'bomDetail');
            },
            seeProcessModalCancelEvent () {
                this.seeSpecSheetModalState = false;
            },
            seeProcessModalConfirmEvent () {
                this.seeSpecSheetModalState = false;
            },
            seeProcessModalStateChangeEvent (e) {
                this.seeSpecSheetModalState = e;
            },
            seeSpecSheetDetailEvent (id) {
                this.spinShow = true;
                this.seeSpecSheetModalState = true;
                this.$call('spec.sheet.detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.spinShow = false;
                        this.specProductObj = res.data.res.specSheetProcessModel;
                    };
                });
            },
            editEvent () {
                this.$router.push({
                    path: 'editManufactureBOM',
                    query: {
                        id: this.$route.query.id,
                        edit: true,
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'bomDetail');// 关闭新增的快捷入口
            },
            backListEvent () {
                this.$router.push({
                    path: 'manufactureBOM',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'bomDetail');// 关闭新增的快捷入口
            },
            // 撤销
            cancelClickEvent () {
                this.$api.manufacture.cancelHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'cancelTips');
                        this.$router.push({
                            path: 'editManufactureBOM',
                            query: {
                                id: this.$route.query.id,
                                edit: true,
                                activated: true
                            }
                        });
                    };
                });
            },
            // 审核
            auditClickEvent () {
                this.$api.manufacture.approveHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp().then(res => {
                            if (res.data.status === 200) {
                                let responseData = translateIsQuote(res.data.res);
                                this.operationData = getOperationData(res.data.res);
                                this.bomDetailData = responseData;
                                this.auditStateName = translateState(responseData.auditState);
                            };
                        });
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            // 反审核
            unAuditClickEvent () {
                this.$api.manufacture.unapproveHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp().then(res => {
                            if (res.data.status === 200) {
                                let responseData = translateIsQuote(res.data.res);
                                this.operationData = getOperationData(res.data.res);
                                this.bomDetailData = responseData;
                                this.auditStateName = translateState(responseData.auditState);
                            };
                        });
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            // 关闭
            closeClickEvent () {
                this.$api.manufacture.closeHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp().then(res => {
                            if (res.data.status === 200) {
                                let responseData = translateIsQuote(res.data.res);
                                this.operationData = getOperationData(res.data.res);
                                this.bomDetailData = responseData;
                                this.auditStateName = translateState(responseData.auditState);
                            };
                        });
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            // 反关闭
            openClickEvent () {
                this.$api.manufacture.uncloseHttp([this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp().then(res => {
                            if (res.data.status === 200) {
                                let responseData = translateIsQuote(res.data.res);
                                this.operationData = getOperationData(res.data.res);
                                this.bomDetailData = responseData;
                                this.auditStateName = translateState(responseData.auditState);
                            };
                        });
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            // 折叠面板的事件
            getCollapseEvent (processIdArr) {
                if (processIdArr.length !== 0) {
                    (async () => {
                        for await (let processIdItem of processIdArr) {
                            await this.getPreviousStepDetailHttp(processIdItem).then(res => {
                                if (res.data.status === 200) {
                                    this.pathProcessList.forEach((processItem) => {
                                        if (parseInt(processItem.processId) === parseInt(processIdItem)) {
                                            this.$set(processItem, 'bomProductList', res.data.res.bomProductList);
                                        };
                                    });
                                };
                            });
                        }
                    })();
                };
            },
            // 根据工序获取dom详情
            getPreviousStepDetailHttp (processId) {
                return this.$api.manufacture.previousStepDetailHttp({
                    prdBomId: this.$route.query.id,
                    processId: processId
                });
            },
            // 获取详情
            getDetailHttp () {
                return this.$api.manufacture.bomDetailHttp({
                    id: this.$route.query.id
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDetailHttp().then(res => {
                if (res.data.status === 200) {
                    let responseData = translateIsQuote(res.data.res);
                    this.operationData = getOperationData(res.data.res);
                    this.bomDetailData = responseData;
                    this.auditStateName = translateState(responseData.auditState);
                    this.pathProcessList = responseData.pathProcessModelList.reverse();
                    setTimeout(() => {
                        this.activePanel = this.pathProcessList[0].processId.toString();
                        this.getPreviousStepDetailHttp(this.pathProcessList[0].processId).then(res => {
                            if (res.data.status === 200) {
                                this.pathProcessList.forEach((processItem) => {
                                    if (processItem.processId === parseFloat(this.pathProcessList[0].processId)) {
                                        this.$set(processItem, 'bomProductList', res.data.res.bomProductList);
                                    };
                                });
                                this.globalLoadingShow = false;
                            };
                        });
                    }, 100);
                };
            });
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                this.globalLoadingShow = true;
                this.getDetailHttp().then(res => {
                    if (res.data.status === 200) {
                        let responseData = translateIsQuote(res.data.res);
                        this.operationData = getOperationData(res.data.res);
                        this.bomDetailData = responseData;
                        this.auditStateName = translateState(responseData.auditState);
                        this.pathProcessList = responseData.pathProcessModelList.reverse();
                        setTimeout(() => {
                            this.activePanel = this.pathProcessList[0].processId.toString();
                            this.getPreviousStepDetailHttp(this.pathProcessList[0].processId).then(res => {
                                if (res.data.status === 200) {
                                    this.pathProcessList.forEach((processItem) => {
                                        if (processItem.processId === parseFloat(this.pathProcessList[0].processId)) {
                                            this.$set(processItem, 'bomProductList', res.data.res.bomProductList);
                                        };
                                    });
                                    this.globalLoadingShow = false;
                                };
                            });
                        }, 100);
                    };
                });
            };
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style>
    .text-center{
        text-align: center;
    }
    .detail-product-bar{
        border: solid 1px #eeeeee;
        padding: 10px;
        margin-bottom: 10px;
    }
    .ivu-collapse>.ivu-collapse-item {
        border-left: solid 1px #d7dde4;
        border-right: solid 1px #d7dde4;
    }
    .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header {
        height: 38px;
        line-height: 38px;
        padding-left: 16px;
        color: #666;
        cursor: pointer;
        position: relative;
        transition: all .2s ease-in-out;
        background: #f7f7f7;
        border-top: solid 1px #d7dde4;
    }
    .spec-sheet-code{
        height:32px;
        padding-left:6px;
        background: #f8f8f8;
        border-radius: 4px;
        font-size: 12px;
    }
    .spec-sheet-message{
        width:100%;
        display: block;
    }
</style>

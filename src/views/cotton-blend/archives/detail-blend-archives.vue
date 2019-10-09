<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="flex-left">
                <Button icon="md-add" type="primary" @click="addEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                <Button v-show="parseFloat(formValidate.auditState) === 1" icon="ios-create" type="primary" class="queryBarMarginRight margin-bottom-10" @click="editEvent">编辑</Button>
                <Button icon="ios-create" type="primary" class="queryBarMarginRight margin-bottom-10" @click="backEvent">返回列表页</Button>
                <Button v-show="formValidate.auditState===2" icon="ios-undo" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-refresh" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                <Button icon="md-close" v-show="formValidate.auditState===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                <Button icon="ios-undo-outline" v-show="formValidate.auditState===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
            </Col>
        </Row>
        <div class="margin-top-10">
            <Form :label-width="100"  ref="formValidate" :model="formValidate" :show-message="false">
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="配棉日期:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="配棉版本号:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.versionNumber}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.workshopId}}</div>
                        </FormItem>
                    </Col>

                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="产品:" prop="productCode" class="formItemMargin widthPercentage">
                            <div class="flex-left widthPercentage">
                                <div class="widthPercentage exhibitionInputBackground" style="height: 32px;">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].productName:''}}</div>
                            </div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="是否预混:" prop="productCode" class="formItemMargin widthPercentage">
                            {{formValidate.isPremix?'是':'否'}}
                        </FormItem>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">规格:</div>
                        <p class="read-only-item">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].productModels:''}}</p>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">批号:</div>
                        <p class="read-only-item">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].batchCode:''}}</p>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">单位:</div>
                        <p class="read-only-item">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].unitName:''}}</p>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">需求数量:</div>
                        <p class="read-only-item">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].demandQty:''}}</p>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="制成率%:" class="formItemMargin" prop="pullRate">
                            <div class="widthPercentage exhibitionInputBackground">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].pullRate:''}}</div>
                        </FormItem>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">生产数量:</div>
                        <p class="read-only-item">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].blendingQty:''}}</p>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="单据状态:" prop="orderDateIpt" class="formItemMargin">
                            <div class="modal-readonly">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="24" :xl="16" :xxl="15">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input readonly :autosize="{minRows: 1,maxRows: 1}" v-model="formValidate.remarks" type="textarea" placeholder=""/>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="activeTabs">
                    <TabPane label="配棉原料表" name="0">
                        <Row>
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                                <div>
                                    <Table size="small" border :columns="cottonBlendingTableHeader" :data="cottonBlendingTableData"></Table>
                                </div>
                                <Row type="flex" justify="end" class="total-num-big-box">
                                    合计：
                                    <div class="total-num-box total-DemandQty-width border-right-none">
                                        <div>{{ totalPacketQty }}</div>
                                    </div>
                                    <div class="total-num-box total-DemandQty-width border-right-none">
                                        <div>{{ totalWeightQty }}</div>
                                    </div>
                                    <div class="total-num-box total-DemandQty-width border-right-none">
                                        <div>{{Math.ceil(totalMixtureRatio)}}%</div>
                                    </div>
                                    <div class="total-num-box total-width-120"></div>
                                </Row>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="2">
                        <operation-log
                                :operationData="operationData"
                        ></operation-log>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
    </card>
</template>
<script>
    import { toDaySeconds, toDay, accSub, setPage, noticeTips, compClientHeight, clearSpace, formatDate, getOperationData, addNum, accDivision, accMul } from '../../../libs/common';
    import operationLog from '../../components/operation-log';
    import moreOrder from './more-order';
    let _this = this;
    export default {
        components: { operationLog, moreOrder },
        data () {
            return {
                globalLoadingShow: false,
                totalPullRate: 0,
                totalPacketQty: 0,
                totalWeightQty: 0,
                totalMixtureRatio: 0,
                activeTabs: '0',
                formValidate: {
                    date: '',
                    versionNumber: '',
                    workshopId: null,
                    remarks: ''
                },
                sliverTableData: [],
                cottonBlendingTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '物料',
                        key: 'productName',
                        minWidth: 120
                    },
                    {
                        title: '供应商',
                        key: 'supplierShortName',
                        minWidth: 100
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 100
                    },
                    {
                        title: '平均包重(KG)',
                        key: 'packetWeight',
                        align: 'right',
                        minWidth: 100
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 100
                    },
                    {
                        title: '单位',
                        key: 'unitCode',
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitCode ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '现存量',
                        key: 'stockQty',
                        minWidth: 100
                    },
                    {
                        title: '可用量',
                        key: 'usableQty',
                        minWidth: 100
                    },
                    {
                        title: '包数',
                        key: 'packetQty',
                        fixed: 'right',
                        width: 100
                    },
                    {
                        title: '数量',
                        key: 'weightQty',
                        fixed: 'right',
                        width: 100
                    },
                    {
                        title: '占比(%)',
                        key: 'mixtureRatio',
                        fixed: 'right',
                        width: 100
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        align: 'center',
                        fixed: 'right',
                        width: 119,
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        value: params.row.remarks
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.remarks = e.target.value;
                                            _this.cottonBlendingTableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                cottonBlendingTableData: [],
                operationData: [],
                toCreated: false
            };
        },
        methods: {
            addEvent () {
                this.$router.push({
                    path: 'add-blend',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'detail-blend');
            },
            unCloseEvent () {
                this.$call('prd.cotton.blending.unclose', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            closeEvent () {
                this.$call('prd.cotton.blending.close', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            unAuditEvent () {
                this.$call('prd.cotton.blending.unapprove', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            auditEvent () {
                this.$call('prd.cotton.blending.approve', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            cancelEvent () {
                this.$call('prd.cotton.blending.cancel', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'cancelTips');
                    };
                });
            },
            backEvent () {
                this.$router.push({
                    path: 'blend-archives',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'detail-blend');
            },
            editEvent () {
                this.$router.push({
                    path: 'edit-blend',
                    query: {
                        id: this.$route.query.id,
                        edit: true,
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'detail-blend');
            },
            // 计算原料表总数
            calculationMaterialMethod (materialArr) {
                let totalPacketQtyNum = 0; // 总包数
                let totalWeightQtyNum = 0; // 总数量
                let mixtureRatioNum = 0;
                materialArr.forEach((item) => {
                    totalPacketQtyNum = addNum(totalPacketQtyNum, item.packetQty);
                    totalWeightQtyNum = addNum(totalWeightQtyNum, item.weightQty);
                    mixtureRatioNum = addNum(mixtureRatioNum, item.mixtureRatio);
                });
                this.totalPacketQty = totalPacketQtyNum;
                this.totalWeightQty = totalWeightQtyNum;
                this.totalMixtureRatio = mixtureRatioNum;
            },
            getDetailHttp () {
                this.$call('prd.cotton.blending.detail', {id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.operationData = getOperationData(responseData);
                        this.formValidate = res.data.res;
                        this.formValidate.workshopId = responseData.workshopName;
                        this.calculationMaterialMethod(responseData.prdCottonBlendingMaterialList);
                        this.cottonBlendingTableData = responseData.prdCottonBlendingMaterialList;
                        this.sliverTableData = responseData.prdCottonBlendingProductList;
                        this.formValidate.pullRate = this.sliverTableData[0].pullRate;
                        this.globalLoadingShow = false;
                    }
                });
            }
        },
        created () {
            _this = this;
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDetailHttp();
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                this.globalLoadingShow = true;
                this.getDetailHttp();
            };
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style scoped>
    .total-bar{
        display: flex;
        justify-content: flex-end;
        font-size: 12px;
    }
    .total-DemandQty-width{
        width:100px;
    }
    .total-width-120{
        width: 120px;
    }
</style>

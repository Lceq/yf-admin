<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="flex-left">
                <Button icon="md-add" type="primary" class="queryBarMarginRight margin-bottom-10" @click="addEvent">新增</Button>
                <Button v-show="formValidate.auditState===1" icon="md-checkmark" class="queryBarMarginRight margin-bottom-10" type="primary" @click="saveEvent">保存</Button>
                <Button v-show="formValidate.auditState===1" icon="ios-create" class="queryBarMarginRight margin-bottom-10" type="primary" @click="submitEvent">提交</Button>
                <Button v-show="formValidate.auditState===2" icon="ios-undo" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-refresh" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                <Button icon="md-close" v-show="formValidate.auditState===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                <Button icon="ios-undo-outline" v-show="formValidate.auditState===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
            </Col>
        </Row>
        <div class="margin-top-10">
            <Form :label-width="100"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="配棉日期:" prop="date" class="formItemMargin">
                            <DatePicker :editable="false" type="date" v-model="formValidate.date" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="配棉版本号:" class="formItemMargin" prop="versionNumber">
                            <Input v-model="formValidate.versionNumber"/>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="生产车间:" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择生产车间" @on-change="getWorkshopEvent">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="是否预混:" prop="productCode" class="formItemMargin widthPercentage">
                            <div class="flex-left widthPercentage">
                                <Checkbox v-model="formValidate.isPremix" @on-change="getIsPremixEvent">是</Checkbox>
                            </div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="产品:" prop="productCode" class="formItemMargin widthPercentage">
                            <div class="flex-left widthPercentage">
                                <div class="widthPercentage product-bar-item" style="height: 32px;">{{sliverTableData&&sliverTableData.length!==0?sliverTableData[0].productName:'请点击按钮选择产品'}}</div>
                                <Button @click="searchIconProductEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
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
                            <InputNumber :min="0" v-model="formValidate.pullRate" @on-blur="getPullRateBlurEvent" @on-change="getPullRateEvent" :disabled="sliverTableData.length===0" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col class="flex-left margin-bottom-10" :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <div style="width: 100px;minWidth: 100px;" class="custom-label-title">生产数量:</div>
                        <p class="read-only-item">{{totalWeightQty}}</p>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="单据状态:" prop="orderDateIpt" class="formItemMargin widthPercentage">
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
                    <TabPane label="原料表" name="0">
                        <Row>
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                                <Button :disabled="sliverTableData.length!==0&&sliverTableData[0].productName?false:true" icon="md-add" type="success" class="margin-bottom-10" @click="addCottonBlendMaterialEvent">添加原料</Button>
                                <div>
                                    <Table :height="tableHeight" size="small" border :columns="cottonBlendingTableHeader" :data="cottonBlendingTableData"></Table>
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
        <select-cotton-blend-modal
                :isPremix="formValidate.isPremix"
                :selectCottonBlendModalState="selectCottonBlendModalState"
                :selectCottonBlendModalSpinShow="selectCottonBlendModalSpinShow"
                :selectCottonBlendModalTableData="selectCottonBlendModalTableData"
                :selectCottonBlendPageTotal="selectCottonBlendPageTotal"
                @page-change-event="selectCottonBlendModalPageEvent"
                @search-button-event="selectCottonBlendModalSearchEvent"
                @on-visible-change="selectCottonBlendModalStateChange"
                @confirm-event="selectCottonBlendConfirmEvent"
        ></select-cotton-blend-modal>
        <select-material-modal
            :selectMaterialModalState="selectMaterialModalState"
            :spinShow="spinShow"
            :selectMaterialPageTotal="selectMaterialPageTotal"
            :selectMaterielModalTableData="selectMaterielModalTableData"
            :showMaterialCategory="false"
            @on-visible-change="selectMaterialModalStateChangeEvent"
            @select-material-modal-search-event="selectMaterialModalSearchBtnEvent"
            @on-change-page="getSelectMaterialModalPageCodeEvent"
            @confirm-event="selectMaterialConfirmEvent"
        ></select-material-modal>
    </card>
</template>
<script>
    import selectCottonBlendModal from './select-cotton-blend';
    import selectMaterialModal from './select-material';
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, toDaySeconds, toDay, setPage, noticeTips, compClientHeight, clearSpace, formatDate, getOperationData, emptyTips } from '../../../libs/common';
    import operationLog from '../../components/operation-log';
    import moreOrder from './more-order';
    let _this = this;
    export default {
        components: { selectCottonBlendModal, selectMaterialModal, operationLog, moreOrder },
        data () {
            const validateWorkshop = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validatePullRate = (rule, value, callback) => _this.formValidate.pullRate ? callback() : callback(new Error());
            const validateVersionNumber = (rule, value, callback) => {
                if (value || value === '0') {
                    if (/[\u4e00-\u9fa5]/g.test(value)) {
                        callback(new Error());
                        this.$Message.warning('配棉版本号不能为中文!');
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                };
            };
            const validateDateValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            return {
                editId: null,
                globalLoadingShow: false,
                totalPacketQty: 0,
                totalWeightQty: 0,
                totalMixtureRatio: 0,
                operationData: [],
                selectMaterielModalTableData: [],
                selectMaterialPageTotal: 0,
                selectMaterialPageIndex: 1,
                selectMaterialModalState: false,
                spinShow: false,
                selectCottonBlendModalTableData: [],
                selectCottonBlendModalSpinShow: false,
                selectCottonBlendModalState: false,
                tableHeight: null,
                activeTabs: '0',
                formValidate: {
                    date: '',
                    versionNumber: '',
                    workshopId: null,
                    remarks: '',
                    pullRate: null,
                    isPremix: false
                },
                defaultWorkshop: null,
                ruleValidate: {
                    workshopId: [{required: true, validator: validateWorkshop, trigger: 'change'}],
                    versionNumber: [{required: true, validator: validateVersionNumber, trigger: 'change'}],
                    date: [{required: true, validator: validateDateValue, trigger: 'change'}],
                    pullRate: [{ required: true, validator: validatePullRate, trigger: 'change' }]
                },
                selectWorkshop: {},
                sliverTableData: [],
                workshopList: [],
                cottonBlendingTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'

                                    },
                                    on: {
                                        click: () => {
                                            _this.reduceCottonBlendTableButton(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '物料',
                        key: 'productName',
                        minWidth: 120
                    },
                    {
                        title: '供应商',
                        key: 'supplierShortName',
                        minWidth: 120
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
                        minWidth: 120
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
                        align: 'center',
                        fixed: 'right',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.packetQty,
                                        precision: 0,
                                        min: 0,
                                        max: 99999999
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.packetQty = e;
                                            params.row.weightQty = mathJsMul(params.row.packetWeight, e);
                                            _this.cottonBlendingTableData[params.index] = params.row;
                                            _this.calculationTotal();
                                        }
                                    },
                                    style: {
                                        width: '100%'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '数量',
                        key: 'weightQty',
                        align: 'center',
                        fixed: 'right',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.weightQty,
                                        precision: 0,
                                        min: 0,
                                        max: 99999999
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.weightQty = e;
                                            _this.cottonBlendingTableData[params.index] = params.row;
                                            _this.calculationTotal();
                                            _this.cottonBlendingTableData[params.index] = params.row;
                                        }
                                    },
                                    style: {
                                        width: '100%'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '占比(%)',
                        key: 'mixtureRatio',
                        align: 'center',
                        fixed: 'right',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mixtureRatio,
                                        max: 100,
                                        // precision: 2,
                                        min: 0
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e) {
                                                params.row.mixtureRatio = e;
                                                _this.cottonBlendingTableData[params.index] = params.row;
                                                let totalNum = 0;
                                                _this.cottonBlendingTableData.forEach((item) => {
                                                    totalNum = mathJsAdd(totalNum, item.mixtureRatio);
                                                });
                                                _this.totalMixtureRatio = totalNum;
                                            };
                                        }
                                    },
                                    style: {
                                        width: '100%'
                                    }
                                })
                            ]);
                        }
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
                selectCottonBlendPageTotal: 0,
                toCreated: false,
                blendingQty: 0
            };
        },
        methods: {
            getIsPremixEvent (e) {
                this.sliverTableData = [];
                this.cottonBlendingTableData = [];
                this.totalPacketQty = 0;
                this.totalWeightQty = 0;
                this.totalMixtureRatio = 0;
                this.formValidate.pullRate = 1;
                this.blendingQty = 0;
            },
            getPullRateBlurEvent () {
                // this.$set(this.formValidate, 'pullRate', parseInt(this.formValidate.pullRate * 100) / 100);
            },
            // 获取制成率
            getPullRateEvent (e) {
                this.sliverTableData[0].pullRate = parseInt(e * 100) / 100;
                if (e) {
                    // 计算生产数量 = 原料数量合计 / 制成率 （不用除以100）
                    if (this.totalWeightQty && this.formValidate.pullRate) {
                        this.$set(this.sliverTableData[0], 'blendingQty', parseInt(mathJsDiv(this.totalWeightQty, mathJsDiv(parseInt(this.formValidate.pullRate * 100), 100))));
                        this.blendingQty = parseInt(mathJsDiv(this.totalWeightQty, mathJsDiv(parseInt(this.formValidate.pullRate * 100), 100)));
                    };
                } else { this.formValidate.pullRate = 0; };
            },
            // 搜索产品事件
            searchIconProductEvent () {
                this.selectCottonBlendModalState = true;
                this.selectCottonBlendModalSpinShow = true;
                this.getCottonBlendListHttp();
            },
            // 添加配棉原料事件
            addCottonBlendMaterialEvent () {
                this.selectMaterialModalState = true;
                this.spinShow = true;
                this.selectMaterialPageTotal = 1;
                this.selectMaterialPageIndex = 1;
                this.getBlendMaterialList('', this.selectMaterialPageIndex, setPage.pageSize).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.forEach(allItem => {
                            this.cottonBlendingTableData.forEach(selectItem => {
                                if (allItem.id === selectItem.productId && allItem.batchCode === selectItem.batchCode) {
                                    allItem._disabled = true;
                                    allItem._checked = true;
                                };
                            });
                        });
                        this.selectMaterielModalTableData = responseData;
                        this.selectMaterialPageTotal = res.data.count;
                        this.spinShow = false;
                    };
                });
            },
            // 选择产品modal的分页事件
            selectCottonBlendModalPageEvent (event) {
                this.selectCottonBlendModalState = true;
                this.selectCottonBlendModalSpinShow = true;
                this.getCottonBlendListHttp(event.product, event.batchCode, event.pageIndex);
            },
            // 选择产品modal的搜索事件
            selectCottonBlendModalSearchEvent (event) {
                this.selectCottonBlendPageTotal = 1;
                this.selectCottonBlendModalState = true;
                this.selectCottonBlendModalSpinShow = true;
                this.getCottonBlendListHttp(event.product, event.batchCode);
            },
            // 计算总数
            calculationTotal () {
                let totalNum = 0; // 总数量
                let mixtureRatioNum = 0; // 总占比
                let totalPacketQty = 0; // 总包数
                this.cottonBlendingTableData.forEach((item) => {
                    totalNum = mathJsAdd(totalNum, item.weightQty); // 求总数量
                    totalPacketQty = mathJsAdd(totalPacketQty, item.packetQty);// 求总包数
                });
                let divNum = 0;
                let mulNum = 0;
                // 求每个占比
                this.cottonBlendingTableData.forEach((item) => {
                    divNum = mathJsDiv(item.weightQty, totalNum);
                    if (divNum) {
                        let towDecimal = mathJsMul(divNum, 100);
                        item.mixtureRatio = mathJsDiv(parseInt(mathJsMul(towDecimal, 100)), 100);// 保留两位小数同时不取四舍五入
                    } else {
                        item.mixtureRatio = 0;
                    };
                });
                // 求总占比
                this.cottonBlendingTableData.forEach((item) => {
                    mixtureRatioNum = mathJsAdd(mixtureRatioNum, item.mixtureRatio);
                });
                this.totalPacketQty = totalPacketQty;
                this.totalWeightQty = totalNum;
                this.totalMixtureRatio = mixtureRatioNum;
                // 计算生产数量 = 原料数量合计 / 制成率 （不用除以100）
                if (this.totalWeightQty && this.formValidate.pullRate) {
                    this.sliverTableData[0].blendingQty = parseInt(mathJsDiv(this.totalWeightQty, mathJsDiv(parseInt(this.formValidate.pullRate * 100), 100)));
                    this.blendingQty = parseInt(mathJsDiv(this.totalWeightQty, mathJsDiv(parseInt(this.formValidate.pullRate * 100), 100)));
                };
            },
            // 获取物料对应的批号
            getProductToBatchCodeListHttp (productCode, batchCode = '', pageIndex = '', pageSize = setPage.pageSize) {
                return this.$call('product.batch.list', {
                    productNameCode: productCode,
                    batchCode: batchCode,
                    auditState: 3,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                });
            },
            // 关闭单据
            closeEvent () {
                this.$call('prd.cotton.blending.close', [this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            // 撤销关闭
            unCloseEvent () {
                this.$call('prd.cotton.blending.unclose', [this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            // 撤销提交
            cancelEvent () {
                this.$call('prd.cotton.blending.cancel', [this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'cancelTips');
                    };
                });
            },
            // 审核
            auditEvent () {
                this.$call('prd.cotton.blending.approve', [this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            // 反审核
            unAuditEvent () {
                this.$call('prd.cotton.blending.unapprove', [this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            saveHttp () {
                if (this.sliverTableData && this.sliverTableData.length && this.cottonBlendingTableData && this.cottonBlendingTableData.length !== 0) {
                    this.sliverTableData.forEach((item) => {
                        !item.batchCode ? item.batchCode = '' : false;
                        this.$delete(item, 'id');
                        item.prdOrderCodes = typeof item.prdOrderCodes === 'object' ? JSON.stringify(item.prdOrderCodes) : item.prdOrderCodes;
                    });
                    this.cottonBlendingTableData.forEach((item) => {
                        !item.batchCode ? item.batchCode = '' : false;
                        this.$delete(item, 'id');
                    });
                    return this.$call('prd.cotton.blending.save', {
                        'id': this.editId,
                        'versionNumber': this.formValidate.versionNumber,
                        'date': formatDate(this.formValidate.date).split(' ')[0],
                        'workshopId': this.selectWorkshop.value,
                        'workshopName': this.selectWorkshop.label,
                        'blendingQty': this.sliverTableData[0].blendingQty,
                        'packetQty': this.totalPacketQty,
                        'weightQty': this.totalWeightQty,
                        'remarks': this.formValidate.remarks,
                        'isPremix': this.formValidate.isPremix,
                        'prdCottonBlendingProductList': this.sliverTableData,
                        'prdCottonBlendingMaterialList': this.cottonBlendingTableData,
                        'formActionList': []
                    });
                } else {
                    this.globalLoadingShow = false;
                    emptyTips(this, '配棉产品或配棉源原料不能为空!');
                    return new Promise((resolve, reject) => { return reject('配棉产品或配棉源原料不能为空!'); });

                };
            },
            // 监听选择物料modal
            selectMaterialModalStateChangeEvent (e) {
                this.selectMaterialModalState = e;
            },
            selectMaterialModalSearchBtnEvent (e) {
                this.selectMaterialPageIndex = 1;
                this.selectMaterialPageTotal = 1;
                this.getBlendMaterialList(e.name, this.selectMaterialPageIndex, setPage.pageSize).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.forEach(allItem => {
                            this.cottonBlendingTableData.forEach(selectItem => {
                                if (allItem.id === selectItem.productId && allItem.batchCode === selectItem.batchCode) {
                                    allItem._disabled = true;
                                    allItem._checked = true;
                                };
                            });
                        });
                        this.selectMaterielModalTableData = responseData;
                        this.selectMaterialPageTotal = res.data.count;
                        this.spinShow = false;
                    };
                });
            },
            // 获取选择物料modal的页码
            getSelectMaterialModalPageCodeEvent (e) {
                this.selectMaterialPageIndex = e.pageIndex;
                this.getBlendMaterialList('', this.selectMaterialPageIndex, setPage.pageSize).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.forEach(allItem => {
                            this.cottonBlendingTableData.forEach(selectItem => {
                                if (allItem.id === selectItem.productId && allItem.batchCode === selectItem.batchCode) {
                                    allItem._disabled = true;
                                    allItem._checked = true;
                                };
                            });
                        });
                        this.selectMaterielModalTableData = responseData;
                        this.selectMaterialPageTotal = res.data.count;
                        this.spinShow = false;
                    };
                });
            },
            // 选择物料modal的确认事件
            selectMaterialConfirmEvent (data) {
                let newData = data.map(item => {
                    item.productId = item.id;
                    item.productName = item.name;
                    item.productCode = item.code;
                    item.productModels = item.models;
                    item.packetQty = 0;
                    item.weightQty = 0;
                    item.mixtureRatio = 0;
                    return item;
                });
                this.cottonBlendingTableData = [...this.cottonBlendingTableData, ...newData];
                this.selectMaterialModalState = false;
            },
            // 选择配棉产品的modal确认事件
            selectCottonBlendConfirmEvent (checkRow) {
                if (this.formValidate.isPremix) {
                    checkRow.productId = checkRow.id;
                    checkRow.productCode = checkRow.code;
                    checkRow.productName = checkRow.name;
                };
                checkRow.blendingQty = 0;
                this.sliverTableData = [checkRow];
                // this.formValidate.pullRate = checkRow.pullRate;
                this.selectCottonBlendModalState = false;
            },
            // 获取配棉产品列表
            getCottonBlendListHttp (product = '', batchCode = '', pageIndex = 1, pageSize = setPage.pageSize) {
                let listApi = '';
                // 是预混 product.listWithQh；不是预混 prd.bom.product.cottonBlendingList
                this.formValidate.isPremix ? listApi = 'product.listWithQh' : listApi = 'prd.bom.product.cottonBlendingList';
                this.$call(listApi, {
                    workshopId: this.defaultWorkshop,
                    pageIndex: pageIndex,
                    pageSize: pageSize,
                    batchCode: batchCode,
                    product: product
                }).then(res => {
                    if (res.data.status === 200) {
                        this.selectCottonBlendModalSpinShow = false;
                        this.sliverTableData.forEach((alreadyItem) => {
                            res.data.res.forEach((allItem) => {
                                // 根据产品id和批次判断是否已选
                                if (alreadyItem.productId === allItem.productId && alreadyItem.batchCode === allItem.batchCode) {
                                    allItem._disabled = true;
                                };
                            });
                        });
                        this.selectCottonBlendPageTotal = res.data.count;
                        this.selectCottonBlendModalTableData = res.data.res;
                    };
                });
            },
            // 监听选择配棉产品modal
            selectCottonBlendModalStateChange (e) {
                this.selectCottonBlendModalState = e;
            },
            // 配棉原料表移除事件
            reduceCottonBlendTableButton (index) {
                if (this.cottonBlendingTableData.length > 1) {
                    this.cottonBlendingTableData.splice(index, 1);
                    this.calculationTotal();
                };
            },
            // 新增事件
            addEvent () {
                this.$router.push({
                    path: 'add-blend',
                    query: {
                        activated: true
                    }
                });
            },
            // 保存事件
            saveEvent () {
                this.globalLoadingShow = true;
                this.saveHttp().then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.getDetailHttp();
                    } else {
                        this.globalLoadingShow = false;
                    };
                });
            },
            // 提交事件
            submitEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let isEmpty = false;
                        let isCottonBlendingEmpty = false;
                        // 判断配棉产品是否为空
                        if (this.sliverTableData && this.sliverTableData.length !== 0) {
                            this.sliverTableData.forEach((item) => { !item.blendingQty ? isEmpty = true : false; });
                            if (isEmpty) {
                                emptyTips(this, '请将配棉产品信息填写完整!');
                            } else {
                                // 判断配棉源料是否为空
                                if (this.cottonBlendingTableData && this.cottonBlendingTableData.length !== 0) {
                                    this.cottonBlendingTableData.forEach((item) => { // 判断配棉源料信息是否为空
                                        !item.productCode || item.packetQty === null || item.weightQty === null || item.mixtureRatio === null ? isCottonBlendingEmpty = true : false;
                                    });
                                    if (isCottonBlendingEmpty) {
                                        emptyTips(this, '请将配棉原料表填写完整!');
                                    } else {
                                        this.globalLoadingShow = true;
                                        this.saveHttp().then(res => {
                                            if (res.data.status === 200) {
                                                this.submitHttp(res.data.res);
                                            } else {
                                                this.globalLoadingShow = false;
                                            };
                                        });
                                    };
                                } else {
                                    emptyTips(this, '配棉数量不能大于需求数量!');
                                };
                            };
                        } else {
                            emptyTips(this, '配棉产品不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 提交的请求
            submitHttp (id) {
                this.$call('prd.cotton.blending.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'submitTips');
                        // this.getDetailHttp();
                        this.$router.push({
                            path: 'detail-blend',
                            query: {
                                id: id,
                                activated: true
                            }
                        });
                        this.$store.commit('removeTag', 'edit-blend');
                    };
                });
            },
            getWorkshopEvent () {},
            getWorkshop (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.defaultWorkshop = responseData.defaultDeptId;
                        this.$set(this.selectWorkshop, 'value', responseData.defaultDeptId);
                        this.$set(this.selectWorkshop, 'label', responseData.defaultDeptName);
                        this.workshopList = responseData.userData;
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error);
                });
            },
            // 获取存货类型为原料或副产品的物料
            getBlendMaterialList (name = '', pageIndex = 1, pageSize = setPage.pageSize) {
                return this.$call('product.cottonBlendingList', {
                    name: name,
                    auditState: 3,
                    pageSize: pageSize,
                    pageIndex: pageIndex
                });
            },
            // 计算原料表总数
            calculationMaterialMethod (materialArr) {
                let totalPacketQtyNum = 0; // 总包数
                let totalWeightQtyNum = 0; // 总数量
                let mixtureRatioNum = 0;
                materialArr.forEach((item) => {
                    totalPacketQtyNum = mathJsAdd(totalPacketQtyNum, item.packetQty);
                    totalWeightQtyNum = mathJsAdd(totalWeightQtyNum, item.weightQty);
                    mixtureRatioNum = mathJsAdd(mixtureRatioNum, item.mixtureRatio);
                });
                this.totalPacketQty = totalPacketQtyNum;
                this.totalWeightQty = totalWeightQtyNum;
                this.totalMixtureRatio = mixtureRatioNum;
            },
            getDetailHttp () {
                this.$call('prd.cotton.blending.detail', {id: this.editId}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.operationData = getOperationData(responseData);
                        this.formValidate = res.data.res;
                        this.selectWorkshop.value = responseData.workshopId;
                        this.selectWorkshop.label = responseData.workshopName;
                        this.formValidate.workshopId = responseData.workshopId;
                        (async () => {
                            for await (let productItem of responseData.prdCottonBlendingMaterialList) {
                                // 获取每个物料对应的所有批号
                                await this.getProductToBatchCodeListHttp(productItem.productCode, '', '', '', '').then(res => {
                                    if (res.data.status === 200) {
                                        productItem.productList = [{ code: productItem.productCode, label: `${productItem.productName}(${productItem.productCode})` }];
                                        productItem.remoteBatchCodeList =  res.data.res;
                                        productItem.batchCodeList =  [{ batchCode: productItem.batchCode }];
                                    };
                                });
                            };
                            this.calculationMaterialMethod(responseData.prdCottonBlendingMaterialList);
                            this.cottonBlendingTableData = responseData.prdCottonBlendingMaterialList;
                            this.sliverTableData = responseData.prdCottonBlendingProductList;
                            this.formValidate.pullRate = this.sliverTableData[0].pullRate;
                            this.globalLoadingShow = false;
                        })();
                    }
                });
            },
            // 获取依赖的数据
            getDependencyData () {
                let workshopList = new Promise((resolve, reject) => { this.getWorkshop(resolve, reject); });
                Promise.all([workshopList]).then(res => {
                    this.getDetailHttp();
                });
            }
        },
        created () {
            this.toCreated = true;
            this.editId = this.$route.query.id;
            this.globalLoadingShow = true;
            this.getDependencyData();
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.editId = this.$route.query.id;
                this.globalLoadingShow = true;
                this.getDependencyData();
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style scoped>
    .product-bar-item {
        line-height:32px;
        padding-left:6px;
        background: #fff;
        border-radius: 4px;
        font-size: 12px;
        color:#c5c8ce;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border: solid 1px #dcdee2;
    }
    .total-bar{
        display: flex;justify-content: flex-end;font-size: 12px;
    }
    .total-DemandQty-width{
        width:100px;
    }
    .total-width-120{
        width: 120px;
    }
</style>

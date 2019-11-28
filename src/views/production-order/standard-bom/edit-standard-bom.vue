<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col class="flex-between-center">
                <Button icon="md-add" type="primary" class="margin-bottom-10" @click="newAddClick">新增</Button>
                <Button v-show="formValidate.auditState===2" icon="ios-undo" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="cancelClickEvent">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" class="queryBarMarginLeft margin-bottom-10" type="primary" @click="auditClickEvent">审核</Button>
                <Button v-show="formValidate.auditState===3&&formValidate.isQuote===false" type="warning" icon="md-refresh" class="queryBarMarginLeft margin-bottom-10" @click="unAuditClickEvent">撤销审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeClickEvent">关闭单据</Button>
                <Button v-show="formValidate.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="openClickEvent">撤销关闭</Button>
            </Col>
        </Row>
        <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
            <div>
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据日期:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="产品:" prop="materielCodeIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productCode ? `${formValidate.productName}(${formValidate.productCode})` : ''}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="规格:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productModels}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="计量单位:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.unitValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="标准数量:" prop="specUserIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productionQty}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="工艺路线:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.specPathName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据状态:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <div class="bom-main-bottom" v-show="pathProcessList.length !== 0">
                <Row>
                    <Col class="flex-left">
                        <Icon custom="sh-iconfont sh-icon-shengchangongxu" size="24"/><p class="module-title">生产工序</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Steps :current="current" class="steps-bar">
                            <Step v-for="(item, index) in pathProcessList" :title="item.processName" :key="index"></Step>
                        </Steps>
                    </Col>
                </Row>
                <Row>
                    <Col class="design-module">
                        <Icon custom="sh-iconfont sh-icon-zhizaoBOMsheji" size="24"/>
                        <p class="module-title">{{ stepTitle }}设计</p>
                    </Col>
                </Row>
                <Row class="tab-box">
                    <Col>
                        <Form :style="{'overflow-y': 'auto'}" ref="formDynamic" :model="formDynamic" :label-width="90" :show-message="false">
                            <Tabs v-model="activeTabPane" type="card">
                                <TabPane :label="item.productName" :name="index + ''"  v-for="(item, index) in formDynamic.productModuleList" :key="index" class="product-module" :class="index >= 1 ? 'product-module-border' : ''">
                                    <Row class="margin-bottom-10">
                                        <Col><Icon type="logo-buffer" /><span class="margin-left-10">产出物料</span></Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="产出物料:" class="formItemMargin" :label-width="110">
                                                <div class="read-only-item">{{item.productCode ? `${item.productName}(${item.productCode})` : ''}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="规格:" class="formItemMargin" :label-width="110">
                                                <div class="read-only-item">{{item.productModels}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="计量单位:" class="formItemMargin" :label-width="110">
                                                <div class="read-only-item">{{item.unitName ? `${item.unitName}(${item.unitCode})` : ''}}</div>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="生产数量:" prop="specUserIpt" class="formItemMargin" :label-width="110">
                                                <div class="read-only-item">{{item.productionQty}}</div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row class="margin-bottom-10">
                                        <Col><Icon type="ios-color-filter" /><span class="margin-left-10">工艺</span></Col>
                                    </Row>
                                    <Row>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="上机准备时间(小时):" class="formItemMargin"
                                                      :label-width="140"
                                                      :key="index"
                                                      :prop="'productModuleList.' + index + '.preparationHours'"
                                                      :rules="{required: true, type: 'number', trigger: 'change'}"
                                            >
                                                <InputNumber :precision="0" :min="1" v-model="item.preparationHours" class="widthPercentage"></InputNumber>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem label="前道提前时间(小时):" class="formItemMargin"
                                                      :label-width="140"
                                                      :key="index"
                                                      :prop="'productModuleList.' + index + '.feedingHours'"
                                                      :rules="{required: true, type: 'number', trigger: 'change'}"
                                            >
                                                <InputNumber :precision="0" :min="1" v-model="item.feedingHours" class="widthPercentage"></InputNumber>
                                            </FormItem>
                                        </Col>
                                        <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                            <FormItem
                                                    :label-width="110"
                                                    label="工艺单号:"
                                                    class="formItemMargin"
                                                    :key="index"
                                                    :prop="'productModuleList.' + index + '.specSheetCode'"
                                                    :rules="{required: true, type: 'string', trigger: 'change'}"
                                            >
                                                <div class="flex-left">
                                                    <Select
                                                            class="remoteSearchSelect"
                                                            filterable
                                                            clearable
                                                            placeholder="请输入工艺单号"
                                                            transfer
                                                            v-model="item.specSheetCode"
                                                            @on-change="getSelectSpecSheetChangeEvent($event, index)"
                                                            @on-clear="clearSpecSheetEvent($event, index)"
                                                    >
                                                        <Option v-for="(option, index) in item.remoteSpecSheetList" :value="option.code" :key="option.id">{{option.code}}</Option>
                                                    </Select>
                                                    <Button @click="clickSpecSheetButtonEvent($event, index)" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                                    <Button size="small" :disabled="!item.specSheetCode" type="success" @click="setProcessEvent($event, item.specSheetCode, index)">查看工艺信息</Button>
                                                </div>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <div v-if="showFeeding">
                                        <Row class="margin-bottom-10">
                                            <Col><Icon type="ios-cube" /><span class="margin-left-10">投料</span></Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <bom-table
                                                        @addTableButtonEvent="addTableButtonEvent"
                                                        @reduceTableButtonEvent="reduceTableButtonEvent"
                                                        :tabs-item="item"
                                                        :data-index="index"
                                                        :production-qty="item.productionQty"
                                                        :table-data="item.bomMaterielList"
                                                        :select-prd-modal-table-data="selectPrdModalTableData"
                                                        @mPutinQtyChangeEvent="mPutinQtyChangeEvent"
                                                        @mAttritionRateChangeEvent="mAttritionRateChangeEvent"
                                                        @mMixtureRatioChangeEvent="mMixtureRatioChangeEvent"
                                                        @mBatchCodeChangeEvent="mBatchCodeChangeEvent"
                                                        @remoteSelectPrdIconSearchBtnEvent="remoteSelectPrdIconSearchBtnEvent($event, item.productId)"
                                                        @getSelectProductEvent="getSelectProductEvent"
                                                        @getSelectBatchCodeEvent="getSelectBatchCodeEvent"
                                                        @remoteSelectBatchSearchIconBtnEvent="remoteSelectBatchSearchIconBtnEvent"
                                                        @addBatchCodeSearchButtonEvent="addBatchCodeSearchButtonEvent"
                                                ></bom-table>
                                            </Col>
                                        </Row>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </Form>
                        <Row class="margin-top-10" type="flex" justify="end">
                            <Col>
                                <!--<Button type="primary" @click="saveEvent" class="queryBarMarginLeft margin-bottom-10">保存</Button>-->
                                <Button :loading="backButtonLoading" v-show="current !== 0 && formValidate.auditState === 1" type="primary" @click="backEvent" class="queryBarMarginLeft">上一步</Button>
                                <Button :loading="nextButtonLoading" v-show="current !== pathProcessList.length -1 && formValidate.auditState === 1" type="primary" class="queryBarMarginLeft" @click="nextEvent">下一步</Button>
                                <Button :loading="submitButtonLoading" v-show="current === pathProcessList.length -1 && formValidate.auditState === 1" icon="ios-create" class="queryBarMarginLeft" type="primary" @click="pushClickEvent">提交</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </Form>
        <see-spec-sheet
                :spin-show="setSpecModalSpinShow"
                :set-process-modal-state="setProcessModalState"
                :set-process-modal-btn-loading="setProcessModalBtnLoading"
                :spec-product-obj="specProductObj"
                @on-visible-change="seeProcessModalStateChangeEvent"
                @see-process-modal-confirm-event="seeProcessModalConfirmEvent"
                @see-process-modal-cancel-event="seeProcessModalCancelEvent"
        ></see-spec-sheet>
        <select-material-modal
                :dynamic-name="'物料'"
                :spin-show="materialModalContentSpinShow"
                :select-material-modal-state="selectMaterialModalState"
                :select-material-page-total="selectMaterialPageTotal"
                :select-materiel-modal-table-data="selectMaterielModalTableData"
                :show-material-category="false"
                @on-visible-change="selectMaterialModalStateChangeEvent"
                @select-material-modal-search-event="selectMaterialModalSearchBtnEvent"
                @on-change-page="getSelectMaterialModalPageCodeEvent"
                @confirm-event="selectMaterialConfirmEvent"
        ></select-material-modal>
        <select-spec-sheet-modal
                :spin-show="specModalContentSpinShow"
                :select-bill-modal-state="selectSpecModalState"
                :select-bill-modal-title="selectSpecModalTitle"
                :select-bill-table-header="selectSpecTableHeader"
                :select-bill-modal-table-data="selectSpecModalTableData"
                :select-bill-table-loading="selectSpecTableLoading"
                :select-bill-page-total="selectSpecPageTotal"
                :select-bill-modal-show-material-input="false"
                @on-visible-change="selectSpecModalStateChangeEvent"
                @select-bill-modal-search-event="selectSpecModalSearchBtnEvent"
                @on-change-page="getSelectSpecModalPageCodeEvent"
                @confirm-event="selectSpecModalConfirmEvent"
        ></select-spec-sheet-modal>
    </card>
</template>
<script>
    import bomTable from './bom-table';
    import seeSpecSheet from '../manufacture/components/see-spec-sheet';
    import selectSpecSheetModal from '../../components/select-bill-modal';
    import selectMaterialModal from '../order/select-material';
    import { noticeTips, formatDate, toDay, setPage, translateState, compClientHeight, emptyTips, translateIsQuote, addNum } from '../../../libs/common';
    import addBatchCodeModal from '../manufacture/components/add-batch-modal';
    import selectBatchModal from '../manufacture/components/select-batch-modal';
    export default {
        name: 'edit-manufacture',
        components: { bomTable, seeSpecSheet, selectMaterialModal, selectSpecSheetModal },
        data () {
            return {
                setSpecModalSpinShow: false,
                toCreated: false,
                globalLoadingShow: false,
                backButtonLoading: false,
                nextButtonLoading: false,
                submitButtonLoading: false,
                showFeeding: true,
                selectBatchModalPageIndex: 1,
                selectBatchModalPageSize: setPage.pageSize,
                addBatchCodeModalConfirmBtnLoading: false,
                activeTabPane: '0',
                formDynamic: { productModuleList: [] },
                materialModalContentSpinShow: false,
                specModalContentSpinShow: false,
                bomProcessId: '',
                selectMaterialPageTotal: 0,
                bomMaterialTableRowIndex: null,
                selectMaterielModalTableData: [],
                selectMaterialModalState: false,
                formValidate: {},
                ruleValidate: {},
                selectPrdModalPageTotal: 0,
                selectPrdModalTableData: [],
                selectPrdModalRemoteProductList: [],
                remoteProductionOrderLoading: false,
                remoteMaterialList: [],
                current: 0,
                pathProcessList: [],
                specSheetList: [],
                remoteSpecSheetList: [],
                tableRemoteLoading: false,
                setProcessModalState: false,
                setProcessModalBtnLoading: false,
                stepTitle: '',
                selectSpecModalState: false,
                selectSpecModalTitle: '',
                selectSpecTableHeader: [
                    {title: '单据日期', key: 'specDate', align: 'center'},
                    {title: '工艺单号', key: 'code', align: 'center'},
                    {title: '产品编号', key: 'productCode', align: 'center'},
                    {title: '产品名称', key: 'productName', align: 'center'},
                    {title: '工序', key: 'processName', align: 'center'},
                    {title: '工艺员', key: 'specUserName', align: 'center'}
                ],
                selectSpecModalTableData: [],
                selectSpecTableLoading: false,
                productModuleIndex: null,
                specProductObj: {},
                selectSpecPageTotal: 0,
                selectOrderObj: {},
                bomMaterialData: [{
                    mproductId: null,
                    mproductCode: '',
                    mproductName: '',
                    mproductModels: '',
                    mbatchCode: '',
                    mbatchCodeList: [],
                    munitId: null,
                    munitCode: '',
                    munitName: '',
                    mmixtureRatio: null,
                    mattritionRate: null,
                    mputinQty: null,
                    productList: [],
                    remoteProductList: []
                }],
                remoteProductList: [],
                saveBomId: null,
                productModalPageIndex: 1,
                productModalPageSize: setPage.pageSize
            };
        },
        methods: {
            // 获取选中的批次
            getSelectBatchCodeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.row;
            },
            remoteSelectBatchSearchIconBtnEvent (event) {
                this.productModuleIndex = event.dataIndex;
                this.bomMaterialTableRowIndex = event.rowIndex;
                this.selectBatchModalPageSize = setPage.pageSize;
                this.selectBatchModalPageIndex = 1;
            },
            // 新增批次的按钮事件
            addBatchCodeSearchButtonEvent (event) {
                this.productModuleIndex = event.dataIndex;
                this.bomMaterialTableRowIndex = event.rowIndex;
            },
            newAddClick () {
                this.$router.push({
                    path: 'add-standard-bom',
                    query: {
                        activated: true
                    }
                });
            },
            pushClickEvent () {
                this.$refs['formDynamic'].validate((valid) => {
                    if (valid) {
                        this.formDynamic.productModuleList.forEach((item)=>{// 移除id
                            this.$delete(item, 'id');
                            // item.specSheetParamList.forEach((paramListItem)=>{this.$delete(paramListItem, 'id');});
                            item.bomMaterielList.forEach((bomMaterialItem)=>{this.$delete(bomMaterialItem, 'id');});
                        });
                        this.submitButtonLoading = true;
                        this.asyncSaveFun();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            cancelClickEvent () {
                this.$api.manufacture.cancelHttp([this.saveBomId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'cancelTips');
                    };
                });
            },
            auditClickEvent () {
                this.$api.manufacture.approveHttp([this.saveBomId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            unAuditClickEvent () {
                this.$api.manufacture.unapproveHttp([this.saveBomId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            closeClickEvent () {
                this.$api.manufacture.closeHttp([this.saveBomId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            openClickEvent () {
                this.$api.manufacture.uncloseHttp([this.saveBomId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            // 下一步
            nextEvent () {
                this.$refs['formDynamic'].validate((valid) => {
                    if (valid) {
                        this.formDynamic.productModuleList.forEach((item)=>{ //删除id
                            this.$delete(item, 'id');
                            // item.specSheetParamList.forEach(paramListItem => this.$delete(paramListItem, 'id'));
                            item.bomMaterielList.forEach(bomMaterialItem => this.$delete(bomMaterialItem, 'id'));
                        });
                        this.asyncSaveFun();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            // 选择产品事件
            selectMaterialModalSearchBtnEvent (event) {
                this.productModalPageSize = setPage.pageSize;
                this.selectMaterialPageTotal = 1;
                this.productModalPageIndex = 1;
                this.getProductHttp(this.pathProcessList[this.current].preProcessId, event.name, this.formDynamic.productModuleList[this.productModuleIndex].productId).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                        this.selectMaterielModalTableData = res.data.res;
                        this.selectMaterialPageTotal = res.data.count;
                    };
                });
            },
            getSelectMaterialModalPageCodeEvent (event) {
                this.productModalPageSize = setPage.pageSize;
                this.productModalPageIndex = event.pageIndex;
                // 获取当前工序
                this.getProductHttp(this.pathProcessList[this.current].preProcessId).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                        this.selectMaterielModalTableData = res.data.res;
                        this.selectMaterialPageTotal = res.data.count;
                    };
                });
            },
            remoteSelectPrdIconSearchBtnEvent (event, productId) {
                this.bomMaterialTableRowIndex = event.rowIndex;
                this.productModalPageSize = setPage.pageSize;
                this.productModalPageIndex = 1;
                this.selectMaterialPageTotal = 1;
                this.productModuleIndex = event.dataIndex;
                this.selectMaterialModalState = true;
                this.materialModalContentSpinShow = true;
                // 获取当前工序和产品的产品列表
                this.getProductHttp(this.pathProcessList[this.current].preProcessId, '', productId).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                        this.materialModalContentSpinShow = false;
                        this.selectMaterielModalTableData = res.data.res;
                        this.selectMaterialPageTotal = res.data.count;
                    };
                });
            },
            selectMaterialConfirmEvent (event) {
                if (event.code !== '') {
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'productList', this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex].remoteProductList.filter(item => item.code.toLowerCase().indexOf(event.code.toLowerCase()) > -1));
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mproductId', event.id);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mproductCode', '');
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', '');
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCodeList', []);
                    setTimeout(() => { this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mproductCode', event.code); },500);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mproductName', event.name);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mproductModels', event.models);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'munitId', event.unitId);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'munitCode', event.unitCode);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'munitName', event.unitName);
                    this.selectMaterialModalState = false;
                } else {
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'productList', []);
                };
            },
            // 获取选中的投料
            getSelectProductEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.row;
            },
            // 工艺单事件
            getSelectSpecSheetChangeEvent (e, index) {
                if (e) {
                    this.productModuleIndex = index;
                    let query = '';
                    let specParamsData = null;
                    this.selectSpecModalState = false;
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetParamList', []);
                    this.formDynamic.productModuleList[this.productModuleIndex].remoteSpecSheetList.forEach((item)=>{
                        if (item.code === e) {
                            this.formDynamic.productModuleList[this.productModuleIndex].specSheetId = item.id;
                            this.formDynamic.productModuleList[this.productModuleIndex].specSheetCode = '';
                            query = item.code;
                            if (query) {
                                this.remoteProductionOrderLoading = true;
                                setTimeout(() => {
                                    this.remoteProductionOrderLoading = false;
                                    this.formDynamic.productModuleList[this.productModuleIndex].specSheetList = this.formDynamic.productModuleList[this.productModuleIndex].remoteSpecSheetList.filter(options => options.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                                    this.formDynamic.productModuleList[this.productModuleIndex].specSheetCode = item.code;
                                }, 200);
                            } else {
                                this.formDynamic.productModuleList[this.productModuleIndex].specSheetList = [];
                            };
                        };
                    });
                };
            },
            selectSpecModalConfirmEvent (e) {
                let query = '';
                let specParamsData = null;
                this.selectSpecModalState = false;
                this.formDynamic.productModuleList[this.productModuleIndex].specSheetId = e.id;
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetCode', '');
                query = e.code;
                if (query) {
                    this.remoteProductionOrderLoading = true;
                    setTimeout(() => {
                        this.remoteProductionOrderLoading = false;
                        this.formDynamic.productModuleList[this.productModuleIndex].specSheetList = this.formDynamic.productModuleList[this.productModuleIndex].remoteSpecSheetList.filter(item => item.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                        this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetCode', e.code);
                    }, 200);
                } else {
                    this.formDynamic.productModuleList[this.productModuleIndex].specSheetList = [];
                };
            },
            selectSpecModalSearchBtnEvent (event) {
                this.getSpecListHttp(this.formDynamic.productModuleList[this.productModuleIndex].productId, this.pathProcessList[this.current].processId, 1, event.code).then(res => {
                    if (res.data.status === 200) {
                        this.formDynamic.productModuleList.forEach((item)=>{
                            this.$set(item, 'remoteSpecSheetList', res.data.res);
                        });
                        this.selectSpecPageTotal = res.data.count;
                        this.remoteSpecSheetList = res.data.res;
                        this.selectSpecModalTableData = res.data.res;
                    };
                });
            },
            // 工艺单的icon搜索按钮事件
            clickSpecSheetButtonEvent (event, index) {
                this.selectSpecModalTitle = '选择工艺单';
                this.specModalContentSpinShow = true;
                this.selectSpecModalState = true;
                this.productModuleIndex = index;
                this.getSpecListHttp(this.formDynamic.productModuleList[index].productId, this.pathProcessList[this.current].processId).then(res => {
                    if (res.data.status === 200) {
                        this.specModalContentSpinShow = false;
                        /*this.formDynamic.productModuleList.forEach((item)=>{
                            this.$set(item, 'remoteSpecSheetList', res.data.res);
                        });*/
                        this.$set(this.formDynamic.productModuleList[index], 'remoteSpecSheetList', res.data.res);
                        this.selectSpecPageTotal = res.data.count;
                        this.remoteSpecSheetList = res.data.res;
                        this.selectSpecModalTableData = res.data.res;
                    };
                });
            },
            // 根据产品获取工艺单
            getSpecListHttp (productId = null, processId = '', pageIndex = 1, code = '') {
                return this.$api.specSheet.listHttp({
                    auditState: 3,
                    productId: productId,
                    processId: processId,
                    pageIndex:pageIndex,
                    code: code,
                    enableState: 1,
                    pageSize: setPage.pageSize,
                })
            },
            selectMaterialModalStateChangeEvent (e) {
                this.selectMaterialModalState = e;
            },
            // 获取产品列表
            getProductHttp (preProcessId = '', name = '', productId = '') {
                return this.$api.product.productListByProcess({
                    processId: preProcessId,
                    pageIndex: this.productModalPageIndex,
                    pageSize: this.productModalPageSize,
                    name: name,
                    productId: productId
                })
            },
            saveEvent () {

            },
            // 上一步
            backEvent () {
                this.backButtonLoading = true;
                if (this.current === 2) {
                    this.current -= 1;
                } else {
                    if (this.current !== 0) {
                        this.current -= 1;
                    };
                };
                this.getBomPreviousStepDetailHttp(this.pathProcessList[this.current].processId);
            },
            // 获取所有产品对应的批号
            getAllProductToBatchCodeList (e) {
                return this.$call('product.batch.list', { productNameCode: e, auditState: 3 });
            },
            // 获取保存后下一道工序的产品数据
            getSaveNextDataMethod (bomId, responseMaterialList, that) {
                let bomMaterialData = [];
                (async () => {
                    for (let i = 0;i < responseMaterialList.length; i++) {
                        this.productModalPageSize = null;
                        await this.getProductHttp(this.pathProcessList[this.current].preProcessId, '', responseMaterialList[i].mproductId).then(res => { // 获取所有前置工序对应的产品列表
                            if (res.data.status === 200) {
                                res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                this.preProcessProductList = res.data.res;
                                this.remoteProductList = res.data.res;
                                if (responseMaterialList[i].materielList) {
                                    bomMaterialData = responseMaterialList[i].materielList;
                                    bomMaterialData.forEach((item)=> {
                                        // 找不到满足支数范围的产品，将历史清空
                                        if (res.data.res.length === 0) {
                                            item.mproductId = null;
                                            item.mproductCode = '';
                                            item.mproductName = '';
                                            item.mbatchCode = '';
                                            item.munitId = null;
                                            item.munitCode = '';
                                            item.munitName = '';
                                            item.mproductModels = '';
                                            item.mputinQty = null;
                                            item.mattritionRate = null;
                                            item.mmixtureRatio = null;
                                        };
                                        item.remoteProductList = res.data.res;
                                    });
                                } else {
                                    this.bomMaterialData[0].remoteProductList = res.data.res;
                                    bomMaterialData = JSON.parse(JSON.stringify(this.bomMaterialData));
                                };
                            };
                        });
                        // 获取产品对应的工艺单
                        await this.getSpecListHttp(responseMaterialList[i].mproductId, this.pathProcessList[this.current].processId).then(res => {
                            if (res.data.status === 200) {
                                this.$set(responseMaterialList[i], 'remoteSpecSheetList', res.data.res);
                            };
                        });
                        // 根据isHistory赋值工艺单,true时取返回的值，false取值当前工艺路线下的值
                        if (responseMaterialList[i].isHistory === true) {
                            this.$set(responseMaterialList[i], 'specSheetList', [{ code: responseMaterialList[i].specSheetCode }]);
                            Object.assign(responseMaterialList[i], JSON.parse(JSON.stringify(responseMaterialList[i].specSheetProcessModel)));
                        };
                        this.$set(responseMaterialList[i], 'preparationHours', that.pathProcessList[that.current].preparationHours);
                        this.$set(responseMaterialList[i], 'feedingHours', that.pathProcessList[that.current].feedingHours);
                        this.$delete(responseMaterialList[i], 'id');
                        this.$set(responseMaterialList[i], 'productId', responseMaterialList[i].mproductId);
                        this.$set(responseMaterialList[i], 'productCode', responseMaterialList[i].mproductCode);
                        this.$set(responseMaterialList[i], 'productName', responseMaterialList[i].mproductName);
                        this.$set(responseMaterialList[i], 'productModels', responseMaterialList[i].mproductModels);
                        this.$set(responseMaterialList[i], 'batchCode', responseMaterialList[i].mbatchCode);
                        this.$set(responseMaterialList[i], 'mbatchCodeList', [{ batchCode: responseMaterialList[i].mbatchCode}]);
                        this.$set(responseMaterialList[i], 'unitId', responseMaterialList[i].munitId);
                        this.$set(responseMaterialList[i], 'unitCode', responseMaterialList[i].munitCode);
                        this.$set(responseMaterialList[i], 'unitName', responseMaterialList[i].munitName);
                        this.$set(responseMaterialList[i], 'productionQty', responseMaterialList[i].mputinQty);
                        this.$set(responseMaterialList[i], 'bomMaterielList', bomMaterialData);
                        this.$set(responseMaterialList[i], 'pullRate', null);
                        responseMaterialList[i].bomMaterielList.forEach((bomMaterialItem)=>{
                            // 赋值前置工序对应的产品
                            this.$set(bomMaterialItem, 'remoteProductList', this.preProcessProductList);
                        });
                        this.formDynamic.productModuleList.push(responseMaterialList[i]);
                    };
                    this.globalLoadingShow = false;
                    this.activeTabPane = '0';
                })();
            },
            saveBomChildHttp (bomId) {
                let that = this;
                this.globalLoadingShow = true;
                this.formDynamic.productModuleList.forEach((item)=>{ // 时间格式转成2000-11-11 11:11:11
                    item.planStartDate = formatDate(item.planStartDate);
                    item.planFinishDate = formatDate(item.planFinishDate);
                    // 初始化冗余字段
                    this.formDynamic.productModuleList.forEach(item => {
                        item.specSheetParamList = [];
                        item.specSheetList = [];
                        item.remoteSpecSheetList = [];
                        item.bomMaterielList.forEach(batchItem => {
                            batchItem.remoteProductList = [];
                        });
                    });
                });
                let paramsData = {
                    "bomId": bomId,
                    "serialNumber": this.current + 1,
                    "processId": this.pathProcessList[this.current].processId,
                    "processCode": this.pathProcessList[this.current].processCode,
                    "processName": this.pathProcessList[this.current].processName,
                    "preProcessId": this.pathProcessList[this.current].preProcessId,
                    "preProcessCode": this.pathProcessList[this.current].preProcessCode,
                    "preProcessName": this.pathProcessList[this.current].preProcessName,
                    // "id": this.bomProcessId,
                    "bomProductList": this.formDynamic.productModuleList
                };
                return this.$api.manufacture.bomProcessSave(paramsData).then(res => {
                    if (res.data.status === 200) {
                        this.nextButtonLoading = false;
                        if (this.current !== this.pathProcessList.length - 1) {
                            this.current += 1;
                            this.stepTitle = this.pathProcessList[this.current].processName;
                            let responseMaterialList = res.data.res;
                            if (this.pathProcessList[this.current].isIntegration === true) { this.showFeeding = false; };  // 工序是梳棉不显示投料
                            this.formDynamic.productModuleList = [];
                            this.getSaveNextDataMethod(bomId, responseMaterialList, that);
                            noticeTips(this, 'saveTips');
                        } else {
                            this.current = this.pathProcessList.length -1;
                            this.submitHttp(bomId);
                        };
                    };
                })
            },
            // 提交的请求
            submitHttp (bomId) {
                this.$api.manufacture.bomSubmitRequest([bomId]).then(res => {
                    if (res.data.status === 200) {
                        this.submitButtonLoading = false;
                        noticeTips(this, 'submitTips');
                        this.$router.push({
                            path: 'detail-standard-bom',
                            query: {
                                id: bomId,
                                activated: true
                            }
                        });
                        this.$store.commit('removeTag', 'edit-standard-bom');
                    };
                });
            },
            getBomPreviousStepDetailHttp (processId) {
                this.globalLoadingShow = true;
                this.$api.manufacture.bomProcessPreviousStepRequest({
                    bomId: this.saveBomId,
                    processId: processId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.backButtonLoading = false;
                        this.bomProcessId = res.data.res.id;
                        let responseMaterialList = res.data.res.bomProductList;
                        this.formDynamic.productModuleList = [];
                        this.getBackDataMethod(responseMaterialList, processId);
                    };
                });
            },
            // 获取上一道工序对应的产品数据
            getBackDataMethod (responseMaterialList, processId) {
                (async () => {
                    for (let i = 0;i < responseMaterialList.length; i++) {
                        responseMaterialList[i].planStartDate = formatDate(responseMaterialList[i].planStartDate);
                        responseMaterialList[i].planFinishDate = formatDate(responseMaterialList[i].planFinishDate);
                        this.productModalPageSize = null;
                        await this.getProductHttp(this.pathProcessList[this.current].preProcessId,'', responseMaterialList[i].productId).then(res => { // 获取所有前置工序对应的产品列表
                            if (res.data.status === 200) {
                                res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                this.preProcessProductList = res.data.res
                                this.bomMaterialData[0].remoteProductList = res.data.res;
                            };
                        });
                        // 获取产品对应的工艺单
                        await this.getSpecListHttp(responseMaterialList[i].productId, processId).then(res => {
                            if (res.data.status === 200) {
                                this.$set(responseMaterialList[i], 'remoteSpecSheetList', res.data.res);
                                this.$set(responseMaterialList[i], 'specSheetList', [{
                                    id: responseMaterialList[i].specSheetId,
                                    code: responseMaterialList[i].specSheetCode,
                                }]);
                            };
                        });
                        this.$set(responseMaterialList[i], 'productList', []);
                        let bomMaterialItemList = responseMaterialList[i].bomMaterielList;
                        for await (let bomMaterialItem of bomMaterialItemList) {
                            this.$set(bomMaterialItem, 'productList', [{
                                id: bomMaterialItem.mproductId,
                                code: bomMaterialItem.mproductCode,
                                label: `${bomMaterialItem.mproductName}(${bomMaterialItem.mproductCode})`
                            }]);
                            this.$set(bomMaterialItem, 'mbatchCodeList', [{batchCode: bomMaterialItem.mbatchCode}]);
                            // 赋值前置工序对应的产品
                            this.$set(bomMaterialItem, 'remoteProductList', this.preProcessProductList);
                        }
                        this.formDynamic.productModuleList.push(responseMaterialList[i]);
                    };
                    this.pathProcessList[this.current].isIntegration === true ? this.showFeeding = false : this.showFeeding = true;// 根据isIntegration判断工序是梳棉不存投料
                    this.activeTabPane = '0';
                    this.stepTitle = this.pathProcessList[this.current].processName;
                    this.globalLoadingShow = false;
                })();
            },
            asyncSaveFun () {
                let isCheckProduct = true;
                if (this.pathProcessList[this.current].isIntegration === false) {
                    // 判断投料是否选择产品
                    this.formDynamic.productModuleList.forEach((item) => {
                        item.bomMaterielList.forEach((materialItem) => {
                            if (!materialItem.mproductCode || materialItem.mputinQty === null || materialItem.mattritionRate === null || materialItem.mmixtureRatio === null) {
                                isCheckProduct = false;
                            };
                        });
                    });
                } else {
                    // 工序是梳棉不存投料
                    this.formDynamic.productModuleList.forEach((item)=>{ // 移除id
                        this.$delete(item, 'id');
                        // item.specSheetParamList.forEach((paramListItem)=>{this.$delete(paramListItem, 'id');});
                        item.bomMaterielList = [];
                    });
                };

                if (isCheckProduct === true) {
                    // 占比只能等于或小于100
                    if (!this.validatorMixtureRatio()) {
                        this.nextButtonLoading = true;
                        (async () => {
                            this.current === 0 ? await this.saveBomHttp() : false;  // 主表
                            this.productModalPageSize = null;
                            if (this.pathProcessList[this.current + 1]) {
                                await this.getProductHttp(this.pathProcessList[this.current + 1].preProcessId).then(res => { // 获取所有前置工序对应的产品列表
                                    if (res.data.status === 200) {
                                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                        this.preProcessProductList = res.data.res;
                                        this.bomMaterialData[0].remoteProductList = res.data.res;
                                    };
                                });
                            } else {
                                await this.getProductHttp().then(res => { // 获取前置工序对应的产品列表
                                    if (res.data.status === 200) {
                                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                        this.preProcessProductList = res.data.res;
                                        this.bomMaterialData[0].remoteProductList = res.data.res;
                                    };
                                });
                            };
                            await this.saveBomChildHttp(this.saveBomId);
                        })();
                    } else {
                        this.submitButtonLoading = false;
                        this.nextButtonLoading = false;
                        emptyTips(this, '总占比只能小于或等于100!');
                    };
                } else {
                    this.submitButtonLoading = false;
                    this.nextButtonLoading = false;
                    emptyTips(this, '请将投料信息填写完整!');
                };
            },
            // 占比不能大于100
            validatorMixtureRatio () {
                let totalMixtureRatio = 0;
                let isGreater = false;
                try{
                    this.formDynamic.productModuleList.forEach((item) => {
                        item.bomMaterielList.forEach((prdItem) => {
                            if (prdItem.mmixtureRatio) {
                                totalMixtureRatio = addNum(prdItem.mmixtureRatio, totalMixtureRatio);
                            };
                        });
                        // 只要有一个产品的占比大于100，就终止循环
                        if (totalMixtureRatio > 100)  throw(true);
                        totalMixtureRatio = 0;
                    });
                }catch (e) {
                    isGreater = true;
                };
                return isGreater;
            },
            // 保存主表请求
            saveBomHttp () {
                return this.$api.manufacture.bomSaveRequest({
                    "id": this.saveBomId,
                    "date": formatDate(this.formValidate.date),
                    "prdOrderId": this.selectOrderObj.id,
                    "prdOrderCode": this.selectOrderObj.code,
                    "workshopId": this.selectOrderObj.workshopId,
                    "workshopName": this.selectOrderObj.workshopName,
                    "productId": this.selectOrderObj.productId,
                    "productName": this.selectOrderObj.productName,
                    "productCode": this.selectOrderObj.productCode,
                    "productModels": this.selectOrderObj.productModels,
                    "batchCode": this.selectOrderObj.batchCode,
                    "unitId": this.selectOrderObj.unitId,
                    "unitCode": this.selectOrderObj.unitCode,
                    "unitName": this.selectOrderObj.unitName,
                    "productionQty": this.selectOrderObj.productionQty,
                    "specPathId": this.formValidate.specPathId,
                    "deliveryDateFrom": this.formValidate.deliveryDateFrom,
                    "deliveryDateTo": this.formValidate.deliveryDateTo,
                    "dailySupplyQty": this.formValidate.dailySupplyQty
                }).then(res => {
                    if (res.data.status === 200) {
                        return res.data.res;
                    };
                })
            },
            seeProcessModalConfirmEvent (event) {
                this.setProcessModalState = false;
            },
            // 工艺modal的分页
            getSelectSpecModalPageCodeEvent (pageIndex) {
                this.getSpecListHttp(this.formDynamic.productModuleList[this.productModuleIndex].productId, this.pathProcessList[this.current].processId, pageIndex).then(res => {
                    if (res.data.status === 200) {
                        this.formDynamic.productModuleList.forEach((item)=>{
                            this.$set(item, 'remoteSpecSheetList', res.data.res);
                        });
                        this.selectSpecPageTotal = res.data.count;
                        this.remoteSpecSheetList = res.data.res;
                        this.selectSpecModalTableData = res.data.res;
                    };
                });
            },
            clearSpecSheetEvent (event, index) {
                this.productModuleIndex = index;
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetId', '');
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetCode', '');
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'machineModelId', null);
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'modelList', []);
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetParamList', []);
            },
            // 设置工艺的事件
            setProcessEvent (e, code, index) {
                this.productModuleIndex = index;
                this.setProcessModalState = true;
                this.formDynamic.productModuleList[this.productModuleIndex].remoteSpecSheetList.forEach((item)=>{
                    if (item.code === code) {
                        // 请求工艺单的参数
                        this.setSpecModalSpinShow = true;
                        this.getSpecDetailHttp(item.id).then(res => {
                            if (res.data.status === 200) {
                                this.specProductObj = res.data.res.specSheetProcessModel;
                                this.setSpecModalSpinShow = false;
                            };
                        });
                    };
                });
            },
            // 获取工艺参数和设备
            getSpecDetailHttp (id) {
                return this.$call('spec.sheet.detail', {id: id});
            },
            selectSpecModalStateChangeEvent (e) {
                this.selectSpecModalState = e;
            },
            // 批次
            mBatchCodeChangeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.materialData;
            },
            // 比例
            mMixtureRatioChangeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.materialData;
            },
            // 损耗率
            mAttritionRateChangeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.materialData;
            },
            // 投料
            mPutinQtyChangeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.materialData;
            },
            // 表格的添加按钮
            addTableButtonEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList.splice(event.index + 1, 0, JSON.parse(JSON.stringify(...this.bomMaterialData)));  // 插入当前
            },
            // 工艺路线对应的工序
            getSpecPathProcessListHttp (id) {
                return this.$api.path.detailHttp({id: id});
            },
            // 上级工艺modal事件
            seeProcessModalCancelEvent () {
                this.setProcessModalState = false;
            },
            seeProcessModalStateChangeEvent (e) {
                this.setProcessModalState = e;
            },
            // 表格的减少按钮
            reduceTableButtonEvent (event) {
                if (this.formDynamic.productModuleList[event.dataIndex].bomMaterielList.length > 1) {
                    this.formDynamic.productModuleList[event.dataIndex].bomMaterielList.splice(event.index, 1);
                };
            },
            // 获取详情
            getDetailHttp () {
                return this.$api.manufacture.bomDetailRequest({id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.formValidate = translateIsQuote(responseData);
                        this.current = responseData.stepSerialNumber - 1;
                        this.formValidate.unitValue = `${responseData.unitName}(${responseData.unitCode})`;
                        this.pathProcessList = responseData.pathProcessModelList;
                        this.formValidate.auditStateName = translateState(responseData.auditState);
                        this.stepTitle = this.pathProcessList[responseData.stepSerialNumber - 1].processName;
                        this.getBomPreviousStepDetailHttp(this.pathProcessList[this.current].processId);
                        this.$set(this.selectOrderObj, 'id', responseData.prdOrderId);
                        this.$set(this.selectOrderObj, 'code', responseData.prdOrderCode);
                        this.$set(this.selectOrderObj, 'workshopId', responseData.workshopId);
                        this.$set(this.selectOrderObj, 'workshopName', responseData.workshopName);
                        this.$set(this.selectOrderObj, 'productId', responseData.productId);
                        this.$set(this.selectOrderObj, 'productName', responseData.productName);
                        this.$set(this.selectOrderObj, 'productCode', responseData.productCode);
                        this.$set(this.selectOrderObj, 'productModels', responseData.productModels);
                        this.$set(this.selectOrderObj, 'batchCode', responseData.batchCode);
                        this.$set(this.selectOrderObj, 'unitId', responseData.unitId);
                        this.$set(this.selectOrderObj, 'unitName', responseData.unitName);
                        this.$set(this.selectOrderObj, 'productionQty', responseData.productionQty);
                        return responseData;
                    };
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.saveBomId = this.$route.query.id;
            this.getDetailHttp();
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.globalLoadingShow = true;
                setTimeout(()=>{
                    this.saveBomId = this.$route.query.id;
                    this.getDetailHttp();
                },0);
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style lang="less">
   @import "../manufacture/manufacture.less";
</style>

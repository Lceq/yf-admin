<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col class="flex-between-center">
                <!--<Button icon="md-add" class="queryBarMarginLeft margin-bottom-10" type="primary" @click="newAddClick">新增</Button>-->
            </Col>
        </Row>
        <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
            <div>
                <Row type="flex">
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="BOM单号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.bomOrderValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据日期:" prop="billDateValue" class="formItemMargin">
                            <DatePicker :editable="false" class="widthPercentage" v-model="formValidate.billDateValue" type="date" placeholder="请选择日期"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产单号:" prop="productionOrderValue" class="formItemMargin">
                            <div class="flex-left">
                                <Select
                                        class="remoteSearchSelect"
                                        filterable
                                        placeholder="请输入生产单号"
                                        remote
                                        v-model="formValidate.productionOrderValue"
                                        :remote-method="remoteProductionOrderMethod"
                                        :loading="remoteProductionOrderLoading"
                                        @on-change="getSelectProductionOrderEvent"
                                >
                                    <Option v-for="(option, index) in productionOrderList" :value="option.code" :key="index">{{option.code}}</Option>
                                </Select>
                                <Button @click="clickMainProductionOrderEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.workshopValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="产品:" prop="materielCodeIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.materielCodeValue ? formValidate.materielNameValue + '(' + formValidate.materielCodeValue + ')' : ''}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="规格:" class="formItemMargin">
                            <div class="read-only-item">{{selectOrderObj.productModels}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线用途:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.purposeName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线捻向:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.twistDirectionName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="工艺路线:" class="formItemMargin" prop="specPathValue">
                            <Select label-in-value :disabled="formValidate.productionOrderValue ? false : true" v-model="formValidate.specPathValue" placeholder="请选择工艺路线" @on-change="getSelectSpecPathEvent">
                                <Option v-for="item in specPathList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="批号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.batchCodeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="计量单位:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.unitValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="订单数量:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.orderCountValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货开始时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateFrom}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货结束时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateTo}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="日供货量:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.dailySupplyQty}}</div>
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
                <div class="tab-box">
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
                                        <FormItem label="批号:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.batchCode}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计量单位:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.unitName ? `${item.unitName}(${item.unitCode})` : ''}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="生产数量:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.productionQty}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计划开工时间:" class="formItemMargin" :label-width="110"

                                        >
                                            <!--  :key="index"
                                                  :prop="'productModuleList.' + index + '.planStartDate'"
                                                  :rules="{required: true, type: 'date', trigger: 'change'}"-->
                                            <DatePicker @on-change="getPlanStartDateEvent($event, item.planFinishDate, index)" :clearable="false" transfer v-model="item.planStartDate" type="date" placeholder="请选择计划开工时间" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计划完工时间:" class="formItemMargin" :label-width="110"

                                        >
                                            <!-- :key="index"
                                                  :prop="'productModuleList.' + index + '.planFinishDate'"
                                                  :rules="{required: true, type: 'date', trigger: 'change'}"-->
                                            <DatePicker @on-change="getPlanFinishDateEvent($event, item.planStartDate, index)" :clearable="false" transfer v-model="item.planFinishDate" type="date" placeholder="请选择计划完工时间" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row class="margin-bottom-10">
                                    <Col><Icon type="ios-color-filter" /><span class="margin-left-10">工艺</span></Col>
                                </Row>
                                <Row>
                                    <!--<Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="制成率%:" class="formItemMargin"
                                                  :label-width="110"
                                                  :key="index"
                                                  :prop="'productModuleList.' + index + '.pullRate'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :min="0" :max="100" v-model="item.pullRate" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>-->
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="上机准备时间(小时):" class="formItemMargin"
                                                  :label-width="140"
                                                  :key="index"
                                                  :prop="'productModuleList.' + index + '.preparationHours'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :precision="0" :min="0" v-model="item.preparationHours" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="前道提前时间(小时):" class="formItemMargin"
                                                  :label-width="140"
                                                  :key="index"
                                                  :prop="'productModuleList.' + index + '.feedingHours'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :precision="0" :min="0" v-model="item.feedingHours" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem
                                                :label-width="110"
                                                label="工艺单号:"
                                                class="formItemMargin"
                                                :key="index"
                                                :prop="'productModuleList.' + index + '.specSheetCode'"
                                                :rules="{required: true, trigger: 'change'}"
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
                                                <Button :disabled="item.disableSetSpecButton" type="success" @click="setProcessEvent($event, index)">查看工艺信息</Button>
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
                            <Button :loading="backButtonLoading" v-show="current !== 0" type="primary" @click="backEvent" class="queryBarMarginLeft">上一步</Button>
                            <Button :loading="nextButtonLoading" v-show="current !== pathProcessList.length -1" type="primary" @click="nextEvent" class="queryBarMarginLeft">下一步</Button>
                            <Button :loading="submitButtonLoading" v-show="current === pathProcessList.length -1" icon="ios-create" class="queryBarMarginLeft" type="primary" @click="pushClickEvent">提交</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Form>
        <see-spec-sheet
                :set-process-modal-state="setProcessModalState"
                :set-process-modal-btn-loading="setProcessModalBtnLoading"
                :spec-product-obj="specProductObj"
                @on-visible-change="seeProcessModalStateChangeEvent"
                @see-process-modal-confirm-event="seeProcessModalConfirmEvent"
                @see-process-modal-cancel-event="seeProcessModalCancelEvent"
        ></see-spec-sheet>
        <select-order-modal
                :spin-show="selectOrderModalSpinShow"
                :select-bill-modal-state="selectOrderModalState"
                :select-bill-modal-title="selectOrderModalTitle"
                :select-bill-table-header="selectOrderTableHeader"
                :select-bill-page-total="selectOrderPageTotal"
                :select-bill-modal-table-data="selectOrderModalTableData"
                :select-bill-modal-show-material-input="selectOrderModalShowMaterialInput"
                @on-visible-change="selectOrderModalStateChangeEvent"
                @select-bill-modal-search-event="selectOrderModalSearchBtnEvent"
                @on-change-page="getSelectOrderModalPageCodeEvent"
                @confirm-event="selectOrderConfirmEvent"
        ></select-order-modal>
        <select-material-modal
                :dynamic-name="'物料'"
                :spin-show="materialModalContentSpinShow"
                :select-material-modal-state="selectMaterialModalState"
                :select-material-page-total="selectMaterialPageTotal"
                :select-materiel-modal-table-data="selectMaterielModalTableData"
                :show-material-category="showMaterialCategory"
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
        <tips-clear
                :v-model="clearTipsStatus"
                :tip-msg="clearTipsMsg"
                @cancel="clearTipsCancel"
                @confirm="clearTipsConfirm"
        >
        </tips-clear>
        <tips-modal
                :tips-modal-state="tipsModalState"
                :tips-icon="tipsModalIcon"
                :tips-modal-message="tipsModalMessage"
                @confirm-event="tipsModalConfirmEvent"
                @cancel-event="tipsModalCancelEvent"
        ></tips-modal>
        <add-batch-code-modal
                :add-batch-modal-state="addBatchModalState"
                :add-batch-modal-product-code-item="addBatchModalProductCodeItem"
                @on-visible-change="addBatchCodeModalVisibleChangeEvent"
                @add-batch-code-modal-confirm-event="addBatchCodeModalConfirmEvent"
        ></add-batch-code-modal>
        <select-batch-modal
                :spin-show="selectBatchModalSpinShow"
                :select-batch-page-total="selectBatchPageTotal"
                :select-batch-modal-state="selectBatchModalState"
                :select-batch-modal-table-data="selectBatchModalTableData"
                @on-visible-change="selectBatchModalStateChangeEvent"
                @on-change-page="getSelectBatchModalPageCodeEvent"
                @select-batch-modal-search-event="selectBatchModalSearchBtnEvent"
                @select-batch-modal-confirm-event="selectBatchModalConfirmEvent"
        ></select-batch-modal>
    </card>
</template>
<script>
    import bomTable from './components/bom-table';
    import seeSpecSheet from './components/see-spec-sheet';
    import selectOrderModal from '../../components/select-bill-modal';
    import selectSpecSheetModal from '../../components/select-bill-modal';
    import selectMaterialModal from '../order/select-material';
    import { noticeTips, formatDate, toDay, setPage, compClientHeight, emptyTips, addNum } from '../../../libs/common';
    import tipsClear from '../../public/deleteWarning';
    import tipsModal from '../../components/tips-modal';
    import selectBatchModal from './components/select-batch-modal';
    import addBatchCodeModal from './components/add-batch-modal';
    export default {
        name: 'add-manufacture',
        components: {
            bomTable, seeSpecSheet, selectOrderModal, selectMaterialModal, selectSpecSheetModal, tipsClear, tipsModal, selectBatchModal, addBatchCodeModal
        },
        data () {
            const validateBillDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateProductOrder = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateSpecPath = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                globalLoadingShow: false,
                backButtonLoading: false,
                nextButtonLoading: false,
                submitButtonLoading: false,
                showFeeding: true,
                selectBatchModalTableData: [],
                selectBatchModalPageIndex: 1,
                selectBatchPageTotal: 0,
                selectBatchModalPageSize: setPage.pageSize,
                selectBatchModalSpinShow: false,
                selectBatchModalState: false,
                addBatchModalProductCodeItem: {},
                addBatchCodeModalConfirmBtnLoading: false,
                addBatchModalState: false,
                tipsModalState: false,
                tipsModalIcon: '',
                tipsModalMessage: '',
                activeTabPane: '0',
                selectOrderModalSpinShow: false,
                clearTipsStatus: false,
                clearTipsMsg: '',
                index: 1,
                formDynamic: { productModuleList: [] },
                preProcessProductList: [],
                showMaterialCategory: false,
                selectMaterialPageTotal: 0,
                bomMaterialTableRowIndex: null,
                selectMaterielModalTableData: [],
                selectMaterialModalState: false,
                formValidate: {
                    purposeId: '',
                    purposeName: '',
                    technologyId: '',
                    twistDirectionId: '',
                    bomOrderValue: '自动生成BOM单号',
                    billDateValue: toDay(),
                    productionOrderValue: '',
                    workshopValue: '',
                    materielCodeValue: '',
                    materielNameValue: '',
                    batchCodeValue: '',
                    unitValue: '',
                    orderCountValue: '',
                    specPathValue: null,
                    specPathNameValue: '',
                    dynamicColorValue: null
                },
                ruleValidate: {
                    billDateValue: [{required: true, validator: validateBillDate, trigger: 'change'}],
                    productionOrderValue: [{required: true, validator: validateProductOrder, trigger: 'change'}],
                    specPathValue: [{required: true, validator: validateSpecPath, trigger: 'change'}]
                },
                selectOrderModalState: false,
                specModalContentSpinShow: false,
                materialModalContentSpinShow: false,
                selectOrderModalTitle: '',
                selectOrderTableHeader: [
                    {title: '订单日期', key: 'orderDate', align: 'center'},
                    {title: '订单号', key: 'code', align: 'center'},
                    {title: '产品编号', key: 'productCode', align: 'center'},
                    {title: '产品名称', key: 'productName', align: 'center', width: 160},
                    {title: '生产工序', key: 'processName', align: 'center'},
                    {title: '批号', key: 'batchCode', align: 'center'},
                    {
                        title: '计量单位',
                        key: 'unitCode',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '订单数量', key: 'productionQty', align: 'center'}
                ],
                selectOrderPageTotal: 0,
                selectOrderModalTableData: [],
                selectOrderModalShowMaterialInput: true,
                selectOrderModalPageIndex: 1,
                selectOrderModalMaterialValue: '',
                selectOrderModalCodeValue: '',
                selectPrdModalPageTotal: 0,
                selectPrdModalTableData: [],
                selectPrdModalRemoteProductList: [],
                remoteProductionOrderLoading: false,
                productionOrderList: [],
                remoteProductionOrderList: [],
                remoteMaterialList: [],
                specPathList: [],
                current: 0,
                initProductModuleList: [
                    {
                        productId: null,
                        productCode: '',
                        productName: '',
                        productModels: '',
                        batchCode: '',
                        unitId: null,
                        unitCode: '',
                        unitName: '',
                        productionQty: null,
                        feedingHours: null,
                        specSheetId: null,
                        specSheetCode: null,
                        machineModelId: null,
                        specSheetList: [],
                        remoteSpecSheetList: [],
                        disableSetSpecButton: true,
                        preparationHours: 2,
                        pullRate: null,
                        planStartDate: '',
                        planFinishDate: '',
                        bomMaterielList: [
                            {
                                mproductId: null,
                                mproductCode: '',
                                mproductName: '',
                                mproductModels: '',
                                mbatchCode: '',
                                mbatchCodeList: [],
                                batchList: [],
                                munitId: null,
                                munitCode: '',
                                munitName: '',
                                mmixtureRatio: null,
                                mattritionRate: null,
                                mputinQty: null,
                                remoteProductList: [],
                                productList: []
                            }
                        ]
                    }
                ],
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
                editId: null,
                selectOrderObj: {},
                bomMaterialData: [{
                    mproductId: null,
                    mproductCode: '',
                    mproductName: '',
                    mproductModels: '',
                    mbatchCode: '',
                    mbatchCodeList: [],
                    batchList: [],
                    munitId: null,
                    munitCode: '',
                    munitName: '',
                    mmixtureRatio: null,
                    mattritionRate: null,
                    mputinQty: null,
                    productList: []
                }],
                remoteProductList: [],
                saveBomId: null,
                productModalPageIndex: 1,
                productModalPageSize: setPage.pageSize,
                initBomMaterialList: [
                    {
                        mproductId: null,
                        mproductCode: '',
                        mproductName: '',
                        mproductModels: '',
                        mbatchCode: '',
                        mbatchCodeList: [],
                        batchList: [],
                        munitId: null,
                        munitCode: '',
                        munitName: '',
                        mmixtureRatio: null,
                        mattritionRate: null,
                        mputinQty: null,
                        productList: []
                    }
                ],
                toCreated: false
            };
        },
        methods: {
            getPlanStartDateEvent (dateFrom, dateTo, index) {
                if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateFrom + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划开台时间应在交货日期范围内!');
                } else {
                    if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(formatDate(dateTo)).valueOf()) {
                        this.formDynamic.productModuleList[index].planStartDate = '';
                        this.$set(this.formDynamic.productModuleList[index], 'planStartDate', '');
                        emptyTips(this, '计划开台时间不能大于计划完工时间!');
                    };
                };
            },
            getPlanFinishDateEvent (dateTo, dateFrom, index) {
                if (new Date(dateTo + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateTo + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划完工时间应在交货日期范围内!');
                } else {
                    if (new Date(formatDate(dateFrom)).valueOf() > new Date(dateTo + ' 00:00:00').valueOf()) {
                        this.$set(this.formDynamic.productModuleList[index], 'planFinishDate', '');
                        emptyTips(this, '计划完工时间不能小于计划开台时间!');
                    };
                };
            },
            getProductToBatchCodeListHttp (productCode, batchCode = '') {
                return this.$call('product.batch.list',{
                    productNameCode: productCode,
                    batchCode: batchCode,
                    auditState: 3,
                    pageIndex: this.selectBatchModalPageIndex,
                    pageSize: setPage.pageSize
                });
            },
            // 获取选中的批次
            getSelectBatchCodeEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.row;
            },
            // 选择批次的modal
            selectBatchModalConfirmEvent (event) {
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', '');
                setTimeout(()=>{
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCodeList', [{ batchCode: event.batchCode}]);
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', event.batchCode);
                    this.selectBatchModalState = false;
                },500);
            },
            selectBatchModalSearchBtnEvent (event) {
                // 获取投料对应的所有批次
                this.selectBatchModalPageIndex = 1;
                this.selectBatchPageTotal = 1;
                this.getProductToBatchCodeListHttp(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex].mproductCode, event.name).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            getSelectBatchModalPageCodeEvent (event) {
                this.selectBatchModalPageIndex = event.pageIndex;
                // 获取投料对应的所有批次
                this.getProductToBatchCodeListHttp(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex].mproductCode, event.name).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            remoteSelectBatchSearchIconBtnEvent (event) {
                this.selectBatchModalState = true;
                this.productModuleIndex = event.dataIndex;
                this.bomMaterialTableRowIndex = event.rowIndex;
                this.selectBatchModalPageSize = setPage.pageSize;
                this.selectBatchModalPageIndex = 1;
                this.selectBatchPageTotal = 1;
                this.selectBatchModalSpinShow = true;
                // 获取投料对应的所有批次
                this.getProductToBatchCodeListHttp(event.mproductCode).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            selectBatchModalStateChangeEvent (e) {
                this.selectBatchModalState = e;
            },
            // 新增批次modal
            addBatchCodeModalConfirmEvent (batchCode) {
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', '');
                setTimeout(()=>{
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', batchCode);
                    this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex].batchList.push({batchCode: batchCode});
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCodeList', [{batchCode: batchCode}]);
                },500);
            },
            addBatchCodeModalVisibleChangeEvent (e) {
                this.addBatchModalState = e;
            },
            // 新增批次的按钮事件
            addBatchCodeSearchButtonEvent (event) {
                this.productModuleIndex = event.dataIndex;
                this.bomMaterialTableRowIndex = event.rowIndex;
                this.addBatchModalState = true;
                this.addBatchModalProductCodeItem = this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex];
            },
            // 创建成功提示modal确认事件
            tipsModalConfirmEvent () {
                Object.assign(this.$data, this.$options.data());
                setTimeout(()=>{
                    this.getDependencyData();
                },500);
            },
            // 创建成功提示modal取消事件
            tipsModalCancelEvent () {
                this.tipsModalState = false;
                this.$store.commit('removeTag', 'addManufactureBOM');
                this.$router.push({
                    path: 'manufactureBOM',
                    query: {
                        activated: true
                    }
                });
            },
            // 新增
            newAddClick () {
                this.clearTipsStatus = true;
                this.clearTipsMsg = '数据尚未保存，确认清空？';
            },
            clearTipsCancel(){
                this.clearTipsMsg = '';
                this.clearTipsStatus = false;
            },
            clearTipsConfirm(){
                Object.assign(this.$data, this.$options.data());
                setTimeout(()=>{
                    this.$refs['formValidate'].resetFields();
                    this.getDependencyData();
                },500);
            },
            // 选择产品事件
            selectMaterialModalSearchBtnEvent (event) {
                this.selectMaterialPageTotal = 1;
                this.productModalPageSize = setPage.pageSize;
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
                this.productModuleIndex = event.dataIndex;
                this.selectMaterialModalState = true;
                this.materialModalContentSpinShow = true;
                this.productModalPageSize = setPage.pageSize;
                this.productModalPageIndex = 1;
                this.selectMaterialPageTotal = 1;
                // 获取产品
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
                    this.getProductToBatchCodeListHttp(event.code).then(res => {
                        if (res.data.status === 200) {
                            this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'batchList', res.data.res);
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
                        };
                    });
                } else {
                    this.$set(this.formDynamic.productModuleList[this.productModuleIndex].bomMaterielList[this.bomMaterialTableRowIndex], 'productList', []);
                };
            },
            getSelectProductEvent (event) {
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList[event.rowIndex] = event.row;
            },
            // 提交的请求
            submitHttp (bomId) {
                this.globalLoadingShow = true;
                this.$api.manufacture.submitHttp([bomId]).then(res => {
                    if (res.data.status === 200) {
                        this.submitButtonLoading = false;
                        noticeTips(this, 'submitTips');
                        this.tipsModalState = true;
                        this.tipsModalIcon = 'md-help-circle';
                        this.tipsModalMessage = '提交成功，是否继续新增?';
                    };
                });
            },
            // 提交事件
            pushClickEvent () {
                this.$refs['formDynamic'].validate((valid) => {
                    if (valid) {
                        this.formDynamic.productModuleList.forEach((item)=>{
                            this.$delete(item, 'id');
                            item.specSheetParamList.forEach((paramListItem)=>{this.$delete(paramListItem, 'id');});
                            item.bomMaterielList.forEach((bomMaterialItem)=>{this.$delete(bomMaterialItem, 'id');});
                        });
                        this.submitButtonLoading = true;
                        this.asyncSaveFun();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 工艺单事件
            getSelectSpecSheetChangeEvent (e, index) {
                if (e) {
                    this.productModuleIndex = index;
                    let query = '';
                    let specParamsData = null;
                    this.selectSpecModalState = false;
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
                            (async () => {
                                await this.getSpecDetailHttp(item.id).then(res => { // 获取工艺参数
                                    if (res.data.status === 200) {
                                        this.$delete(res.data.res, 'id');
                                        specParamsData = res.data.res;
                                        Object.assign(this.formDynamic.productModuleList[this.productModuleIndex], JSON.parse(JSON.stringify(specParamsData.specSheetProcessModel)));
                                        this.formDynamic.productModuleList[this.productModuleIndex].disableSetSpecButton = false;
                                    };
                                });
                            })();
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
                (async () => {
                    await this.getSpecDetailHttp(e.id).then(res => {
                        if (res.data.status === 200) {
                            this.$delete(res.data.res, 'id');
                            specParamsData = res.data.res;
                            Object.assign(this.formDynamic.productModuleList[this.productModuleIndex], JSON.parse(JSON.stringify(specParamsData.specSheetProcessModel)));
                            this.formDynamic.productModuleList[this.productModuleIndex].disableSetSpecButton = false;
                        };
                    });
                })()
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
                        /*this.formDynamic.productModuleList.forEach((item)=>{
                            this.$set(item, 'remoteSpecSheetList', res.data.res);
                        });*/
                        this.$set(this.formDynamic.productModuleList[index], 'remoteSpecSheetList', res.data.res);
                        this.selectSpecPageTotal = res.data.count;
                        this.remoteSpecSheetList = res.data.res;
                        this.selectSpecModalTableData = res.data.res;
                        this.specModalContentSpinShow = false;
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
            getBackDataMethod (responseMaterialList, processId) {
                (async () => {
                    for (let i = 0;i < responseMaterialList.length; i++) {
                        this.productModalPageSize = null;
                        await this.getProductHttp(this.pathProcessList[this.current].preProcessId, '', responseMaterialList[i].productId).then(res => { // 获取所有前置工序对应的产品列表
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
                        this.$set(responseMaterialList[i], 'disableSetSpecButton', false);
                        let bomMaterialItemList = responseMaterialList[i].bomMaterielList;
                        for await (let bomMaterialItem of bomMaterialItemList) {
                            this.$set(bomMaterialItem, 'productList', [{
                                id: bomMaterialItem.mproductId,
                                code: bomMaterialItem.mproductCode,
                                label: `${bomMaterialItem.mproductName}(${bomMaterialItem.mproductCode})`
                            }]);
                            this.$set(bomMaterialItem, 'mbatchCodeList', [{batchCode: bomMaterialItem.mbatchCode}]);
                            await this.getProductToBatchCodeListHttp(bomMaterialItem.mproductCode).then(res => { // 获取每个投料对应所有已审核的批次
                                if (res.data.status === 200) {
                                    this.$set(bomMaterialItem, 'batchList', res.data.res);
                                };
                            });
                            // 赋值前置工序对应的产品
                            this.$set(bomMaterialItem, 'remoteProductList', this.preProcessProductList);
                        }
                        this.formDynamic.productModuleList.push(responseMaterialList[i]);
                    };
                    this.pathProcessList[this.current].isIntegration === true ? this.showFeeding = false : this.showFeeding = true;// 根据isIntegration判断工序是梳棉不存投料
                    this.stepTitle = this.pathProcessList[this.current].processName;
                    this.activeTabPane = '0';
                    this.globalLoadingShow = false;
                })();
            },
            getBomPreviousStepDetailHttp (processId) {
                this.globalLoadingShow = true;
                this.$api.manufacture.previousStepDetailHttp({
                    prdBomId: this.saveBomId,
                    processId: processId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.backButtonLoading = false;
                        let responseMaterialList = res.data.res.bomProductList;
                        this.formDynamic.productModuleList = [];
                        this.getBackDataMethod(responseMaterialList, processId); // 获取下一步工序的数据
                    };
                });
            },
            // 下一步
            nextEvent () {
                this.$refs['formDynamic'].validate((valid) => {
                    if (valid) {
                        this.formDynamic.productModuleList.forEach((item)=>{ //删除id
                            this.$delete(item, 'id');
                            item.specSheetParamList.forEach(paramListItem => this.$delete(paramListItem, 'id'));
                            item.bomMaterielList.forEach(bomMaterialItem => this.$delete(bomMaterialItem, 'id'));
                        });
                        // this.nextButtonLoading = true;
                        this.asyncSaveFun();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            asyncSaveFun () {
                let isCheckProduct = true;
                if (this.pathProcessList[this.current].isIntegration === false) {
                    // 判断投料是否选择产品
                    this.formDynamic.productModuleList.forEach((item) => {
                        item.bomMaterielList.forEach((materialItem) => {
                            if (!materialItem.mproductCode || !materialItem.mbatchCode || materialItem.mputinQty === null || materialItem.mattritionRate === null || materialItem.mmixtureRatio === null) {
                                isCheckProduct = false;
                            };
                        });
                    });
                } else { // 工序是梳棉不存投料
                    this.formDynamic.productModuleList.forEach((item)=>{// 移除id
                        this.$delete(item, 'id');
                        item.specSheetParamList.forEach((paramListItem)=>{this.$delete(paramListItem, 'id');});
                        item.bomMaterielList = [];
                    });
                };
                if (isCheckProduct === true) {
                    if (!this.validatorMixtureRatio()) {
                        this.nextButtonLoading = true;
                        (async () => {
                            this.current === 0 ? this.saveBomId = await this.saveBomHttp() : false;  // 主表
                            this.formDynamic.productModuleList.forEach(item => {
                                this.$delete(item, 'id');
                                item.specSheetParamList.forEach((paramsItem)=>{this.$delete(paramsItem, 'id');});
                            });
                            if (this.pathProcessList[this.current + 1]) {
                                this.productModalPageSize = null;
                                await this.getProductHttp(this.pathProcessList[this.current + 1].preProcessId).then(res => { // 获取所有前置工序对应的产品列表
                                    if (res.data.status === 200) {
                                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                        this.preProcessProductList = res.data.res;
                                    };
                                });
                            } else {
                                this.productModalPageSize = null;
                                await this.getProductHttp().then(res => { // 获取前置工序对应的产品列表
                                    if (res.data.status === 200) {
                                        res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                        this.preProcessProductList = res.data.res;
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
                    this.$Notice.warning({
                        title: '提示',
                        desc: '请将投料信息填写完整!'
                    });
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
                        if (totalMixtureRatio > 100) throw(true);
                        totalMixtureRatio = 0;
                    });
                }catch (e) {
                    isGreater = true;
                };
                return isGreater;
            },
            // 获取保存后下一道工序的产品数据
            getSaveNextDataMethod (bomId, responseMaterialList, that) {
                let bomMaterialData = [];
                bomMaterialData = JSON.parse(JSON.stringify(this.initBomMaterialList));
                (async () => {
                    for (let i = 0;i < responseMaterialList.length; i++) {
                        this.productModalPageSize = null;
                        await this.getProductHttp(this.pathProcessList[this.current].preProcessId, '', responseMaterialList[i].mproductId).then(res => { // 获取前置工序对应的产品列表
                            if (res.data.status === 200) {
                                res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                this.preProcessProductList = res.data.res;
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
                        await this.getSpecListHttp(responseMaterialList[i].mproductId, this.pathProcessList[this.current].processId).then(res => { // 获取产品对应的工艺单
                            if (res.data.status === 200) {
                                this.$set(responseMaterialList[i], 'remoteSpecSheetList', res.data.res);
                            };
                        });
                        // 根据isHistory赋值工艺单,true时取返回的值，false取值当前工艺路线下的值
                        if (responseMaterialList[i].isHistory === true) {
                            this.$set(responseMaterialList[i], 'specSheetList', [{ code: responseMaterialList[i].specSheetCode }]);
                            Object.assign(responseMaterialList[i], JSON.parse(JSON.stringify(responseMaterialList[i].specSheetProcessModel)));
                            this.$set(responseMaterialList[i], 'disableSetSpecButton', false);
                        } else {
                            this.$set(responseMaterialList[i], 'disableSetSpecButton', true);
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
                        this.$set(responseMaterialList[i], 'productList', []);
                        this.$set(responseMaterialList[i], 'bomMaterielList', bomMaterialData);
                        this.$set(responseMaterialList[i], 'pullRate', null);
                        responseMaterialList[i].bomMaterielList.forEach((bomMaterialItem)=>{
                            this.$set(bomMaterialItem, 'remoteProductList', this.preProcessProductList);// 赋值前置工序对应的产品
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
                this.formDynamic.productModuleList.forEach((item)=>{  // 时间格式转成2000-11-11 11:11:11
                    item.planStartDate = formatDate(item.planStartDate);
                    item.planFinishDate = formatDate(item.planFinishDate);
                });
                let paramsData = {
                    "prdBomId": bomId,
                    "serialNumber": this.current + 1,
                    "processId": this.pathProcessList[this.current].processId,
                    "processCode": this.pathProcessList[this.current].processCode,
                    "processName": this.pathProcessList[this.current].processName,
                    "preProcessId": this.pathProcessList[this.current].preProcessId,
                    "preProcessCode": this.pathProcessList[this.current].preProcessCode,
                    "preProcessName": this.pathProcessList[this.current].preProcessName,
                    "bomProductList": this.formDynamic.productModuleList
                };
                return this.$api.manufacture.saveBomChild(paramsData).then(res => {
                    if (res.data.status === 200) {
                        let responseMaterialList = res.data.res;
                        this.formDynamic.productModuleList = [];
                        // 最后一步跳转编辑页
                        if (this.current === this.pathProcessList.length -1) {
                            this.current = this.pathProcessList.length -1;
                            this.submitHttp(bomId);
                        } else {
                            this.nextButtonLoading = false;
                            noticeTips(this, 'saveTips');
                            this.current += 1;
                            this.stepTitle = this.pathProcessList[this.current].processName;
                            if (this.pathProcessList[this.current].isIntegration === true) { this.showFeeding = false; };  // 工序是梳棉不显示投料
                            this.getSaveNextDataMethod(bomId, responseMaterialList, that);
                        };
                    };
                });
            },
            // 保存主表请求
            saveBomHttp () {
                return this.$api.manufacture.saveHttp({
                    "id": this.saveBomId,
                    "date": formatDate(this.formValidate.billDateValue),
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
                    "specPathId": this.formValidate.specPathValue,
                    "specPathName": this.formValidate.specPathNameValue,
                    "purposeId": this.formValidate.purposeId,
                    "purposeName": this.formValidate.purposeName,
                    "twistDirectionId": this.formValidate.twistDirectionId,
                    "twistDirectionName": this.formValidate.twistDirectionName,
                    "deliveryDateFrom": this.formValidate.deliveryDateFrom,
                    "deliveryDateTo": this.formValidate.deliveryDateTo,
                    "dailySupplyQty": this.formValidate.dailySupplyQty
                }).then(res => {
                    if (res.data.status === 200) {
                        return res.data.res;
                    };
                })
            },
            // 设置上机工艺的确认按钮事件
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
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'disableSetSpecButton', true);
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetId', '');
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetCode', '');
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'machineModelId', null);
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'modelList', []);
                this.$set(this.formDynamic.productModuleList[this.productModuleIndex], 'specSheetParamList', []);
            },
            // 设置工艺的事件
            setProcessEvent (e, index) {
                this.productModuleIndex = index;
                this.specProductObj = {};
                setTimeout(()=>{
                    this.specProductObj = JSON.parse(JSON.stringify(this.formDynamic.productModuleList[index]));
                    this.setProcessModalState = true;
                },500)
            },
            // 获取工艺参数和设备
            getSpecDetailHttp (id) {
                return this.$call('spec.sheet.detail', {id: id});
            },
            selectSpecModalStateChangeEvent (e) {
                this.selectSpecModalState = e;
            },
            // 选择订单事件
            getSelectProductionOrderEvent (e) {
                if (e) {
                    this.current = 0;
                    let selectOrderObj = null;
                    this.remoteProductionOrderList.forEach((item) => {
                        if (item.code === e) {
                            selectOrderObj = item;
                        };
                    });
                    this.formValidate.specPathValue = '';
                    this.pathProcessList = [];
                    this.setProductMethod(selectOrderObj);
                };
            },
            setProductMethod (e) {
                this.selectOrderObj = e;
                this.selectOrderModalState = false;
                this.formDynamic.productModuleList = JSON.parse(JSON.stringify(this.initProductModuleList));
                this.$set(this.formDynamic.productModuleList[0], 'productId', e.productId);
                this.$set(this.formDynamic.productModuleList[0], 'productCode', e.productCode);
                this.$set(this.formDynamic.productModuleList[0], 'productName', e.productName);
                this.$set(this.formDynamic.productModuleList[0], 'productModels', e.productModels);
                this.$set(this.formDynamic.productModuleList[0], 'batchCode', e.batchCode);
                this.$set(this.formDynamic.productModuleList[0], 'unitId', e.unitId);
                this.$set(this.formDynamic.productModuleList[0], 'unitCode', e.unitCode);
                this.$set(this.formDynamic.productModuleList[0], 'unitName', e.unitName);
                this.$set(this.formDynamic.productModuleList[0], 'productionQty', e.productionQty);
                let planStartDateValue = new Date(e.deliveryDateFrom); //设置计划开工和完工时间
                planStartDateValue.setDate(planStartDateValue.getDate() - 1);
                let planFinishDateValue = new Date(e.deliveryDateTo);
                planFinishDateValue.setDate(planFinishDateValue.getDate() - 1);
                this.$set(this.formDynamic.productModuleList[0], 'planStartDate', formatDate(planStartDateValue));
                this.$set(this.formDynamic.productModuleList[0], 'planFinishDate', formatDate(planFinishDateValue));
                this.productionOrderList = [{code: e.code}];
                this.$set(this.formValidate, 'productionOrderValue','');
                setTimeout(()=>{ this.$set(this.formValidate, 'productionOrderValue',e.code); },500);
                this.formValidate.workshopValue = e.workshopName;
                this.formValidate.materielCodeValue = e.productCode;
                this.formValidate.materielNameValue = e.productName;
                this.formValidate.batchCodeValue = e.batchCode;
                this.formValidate.unitValue = e.unitName + '(' + e.unitCode + ')';
                this.formValidate.orderCountValue = e.productionQty;
                this.formValidate.purposeName = e.purposeName;
                this.formValidate.purposeId = e.purposeId;
                this.formValidate.twistDirectionId = e.twistDirectionId;
                this.formValidate.twistDirectionName = e.twistDirectionName;
                this.formValidate.deliveryDateFrom = e.deliveryDateFrom;
                this.formValidate.deliveryDateTo = e.deliveryDateTo;
                this.formValidate.dailySupplyQty = e.dailySupplyQty;
                this.formDynamic.productModuleList[0].bomMaterielList[0].remoteProductList = this.remoteProductList;
                this.getSpecPathHttp(e.processId);
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
                // 插入当前
                this.formDynamic.productModuleList[event.dataIndex].bomMaterielList.splice(event.index + 1, 0, JSON.parse(JSON.stringify(...this.bomMaterialData)));
            },
            // 生产单号的"确认选择"事件
            selectOrderConfirmEvent (e) {
                this.current = 0;
                this.selectOrderModalState = false;
                this.formValidate.specPathValue = '';
                this.pathProcessList = [];
                this.setProductMethod(e);
            },
            // 获取审核的订单
            getOrderListHttp (resolve, reject) {
                return this.$api.order.listHttp({
                    auditState: 3,
                    product: this.selectOrderModalMaterialValue,
                    code: this.selectOrderModalCodeValue,
                    pageIndex: this.selectOrderModalPageIndex,
                    pageSize: setPage.pageSize,
                    isQuote: false
                }).then(res => {
                    resolve ? resolve(res) : false;
                    if (res.data.status === 200) {
                        this.selectOrderModalSpinShow = false;
                        this.remoteProductionOrderList = res.data.res;
                        this.selectOrderPageTotal = res.data.count;
                        this.selectOrderModalTableData = res.data.res;
                    };
                }).catch(err => {
                    reject ? reject(err) : false;
                });
            },
            // 生产单号按钮的事件
            clickMainProductionOrderEvent () {
                this.selectOrderModalSpinShow = true;
                this.selectOrderModalState = true;
                this.selectOrderModalTitle = '选择生产单号';
                this.selectOrderModalPageIndex = 1;
                this.selectOrderPageTotal = 0;
                this.getOrderListHttp();
            },
            selectOrderModalStateChangeEvent (e) {
                this.selectOrderModalState = e;
            },
            selectOrderModalSearchBtnEvent (e) {
                this.selectOrderModalPageIndex = 1;
                this.selectOrderPageTotal = 0;
                this.selectOrderModalMaterialValue = e.materialName;
                this.selectOrderModalCodeValue = e.code;
                this.getOrderListHttp();
            },
            getSelectOrderModalPageCodeEvent (e) {
                this.selectOrderModalPageIndex = e;
                this.getOrderListHttp();
            },
            // 工艺路线对应的工序
            getSpecPathProcessListHttp (id) {
                this.$api.path.detailHttp({id: id}).then(res => {
                    this.pathProcessList = res.data.res.pathProcessList.reverse();
                    this.stepTitle = this.pathProcessList[0].processName;
                    this.productModalPageSize = null;
                    (async () => {
                        await this.getProductHttp(this.pathProcessList[this.current].preProcessId, '', this.formDynamic.productModuleList[0].productId).then(res => {
                            if (res.data.status === 200) {
                                res.data.res.forEach((item)=>{ this.$set(item, 'label', `${item.name}(${item.code})`); });
                                this.selectMaterielModalTableData = res.data.res;
                                this.remoteProductList = res.data.res;
                                this.bomMaterialData[0].remoteProductList = res.data.res;
                                this.setProductMethod(this.selectOrderObj); // 初始化产品模块
                                // 上级准备时间和前道提前时间(首道工序-取工艺路线上的时间，后面根据isHistory判断)
                                this.$set(this.formDynamic.productModuleList[0], 'preparationHours', this.pathProcessList[this.current].preparationHours);
                                this.$set(this.formDynamic.productModuleList[0], 'feedingHours', this.pathProcessList[this.current].feedingHours);
                                this.formDynamic.productModuleList.forEach((productItem)=>{
                                    productItem.bomMaterielList = JSON.parse(JSON.stringify(this.bomMaterialData));
                                    productItem.bomMaterielList.forEach((bomMaterialItem)=>{
                                        this.$set(bomMaterialItem, 'remoteProductList', res.data.res);
                                    });
                                });
                            };
                        });
                        // 根据产品和工序获取工艺单
                        await this.getSpecListHttp(this.formDynamic.productModuleList[0].productId, this.pathProcessList[this.current].processId).then(res => {
                            if (res.data.status === 200) {
                                this.formDynamic.productModuleList.forEach((item)=>{
                                    this.$set(item, 'remoteSpecSheetList', res.data.res);
                                });
                                this.selectSpecPageTotal = res.data.count;
                                this.remoteSpecSheetList = res.data.res;
                                this.selectSpecModalTableData = res.data.res;
                            };
                        });
                    })()
                });
            },
            // 选择的工艺路线
            getSelectSpecPathEvent (event) {
                if (event) {
                    this.current = 0;
                    this.formValidate.specPathNameValue = event.label;
                    this.getSpecPathProcessListHttp(event.value);
                };
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
            remoteProductionOrderMethod (query) {
                if (query !== '') {
                    this.remoteProductionOrderLoading = true;
                    setTimeout(() => {
                        this.remoteProductionOrderLoading = false;
                        this.productionOrderList = this.remoteProductionOrderList.filter(item => item.id + ''.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.productionOrderList = [];
                }
            },
            // 获取工艺路线
            getSpecPathHttp (processId) {
                return this.$api.path.listHttp({auditState: 3, processId: processId}).then(res => {
                    if (res.data.status === 200) {
                        this.specPathList = res.data.res;
                    };
                });
            },
            // 获取依赖的数据
            getDependencyData () {
                let orderList = new Promise((resolve, reject) => {
                    this.getOrderListHttp(resolve, reject);
                });
                Promise.all([orderList]).then(res => {
                    // 判断路由是否携带"生产单号"参数
                    if (this.$route.query.orderCode) {
                        let selectOrderObj = {};
                        this.formValidate.productionOrderValue = this.$route.query.orderCode;
                        this.remoteProductionOrderList.forEach((item) => {
                            if (item.id === parseFloat(this.$route.query.orderId)) {
                                selectOrderObj = item;
                            };
                        });
                        this.setProductMethod(selectOrderObj);
                    };
                    this.globalLoadingShow = false;
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDependencyData();
        },
        activated(){
            if (!this.toCreated && this.$route.query.activated === true) {
                this.globalLoadingShow = true;
                Object.assign(this.$data, this.$options.data());
                setTimeout(()=>{
                    this.$refs['formValidate'].resetFields();
                    this.getDependencyData();
                },0);
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style lang="less">
    @import "manufacture.less";
</style>

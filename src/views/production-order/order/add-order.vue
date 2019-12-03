<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="flex-left">
                <Button icon="md-checkmark" class="queryBarMarginRight" type="primary" @click="saveDropDownEvent">保存</Button>
                <Button icon="ios-create" class="queryBarMarginRight" type="primary" @click="pushDropDownEvent">提交</Button>
                <Button type="primary" class="queryBarMarginRight" @click="addClick">重置</Button>
            </Col>
        </Row>
        <div class="margin-top-20">
            <Form :label-width="110"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="订单编号:" class="formItemMargin">
                            <div class="modal-readonly">自动生成订单编号</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label=" 订单日期:" prop="orderDate" class="formItemMargin">
                            <DatePicker :editable="false" type="date" v-model="formValidate.orderDate" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="生产车间:" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择生产车间" @on-change="getWorkshopEvent">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="订单类型:" prop="typeId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.typeId" placeholder="请选择订单类型" @on-change="selectOrderTypeEvent">
                                <Option v-for="item in orderTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="订单优先级:" prop="priorityId" class="formItemMargin">
                            <Select v-model="formValidate.priorityId" placeholder="请选择优先级">
                                <Option v-for="(item) in emergencyStateList" :value="item.id" :key="item.id + ''">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="SAP订单:" class="formItemMargin" prop="salesCode">
                            <Input type="text" v-model="formValidate.salesCode" placeholder="请输入SAP订单"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="交货开始时间:" prop="deliveryDateFrom" class="formItemMargin">
                            <DatePicker type="date" :options="startTimeOptions" placeholder="请选择日期" v-model="formValidate.deliveryDateFrom" @on-change="getDateFrom" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                        <FormItem label="交货结束时间:" prop="deliveryDateTo" class="formItemMargin">
                            <DatePicker type="date" :options="endTimeOptions" placeholder="请选择日期" v-model="formValidate.deliveryDateTo" @on-change="getDateTo" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input :autosize="{minRows: 1,maxRows: 1}" v-model="formValidate.remark" type="textarea" placeholder="请输入"/>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="defaultActiveTabs">
                    <TabPane label="基本信息" name="0">
                        <Row type="flex">
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="产品:" prop="productCode" class="formItemMargin">
                                    <div class="flex-left">
                                        <Select
                                                class="remoteSearchSelect"
                                                filterable
                                                placeholder="请输入产品编号或名称"
                                                remote
                                                v-model="formValidate.productCode"
                                                :remote-method="remoteMaterialMethod"
                                                :loading="remoteMaterialLoading"
                                                @on-change="getSelectMaterialEvent"
                                        >
                                            <Option v-for="(option, index) in remoteMaterialList" :value="option.code" :key="option.id">{{option.label}}</Option>
                                        </Select>
                                        <Button @click="clickMainMaterialCodeEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                    </div>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="规格型号:" class="formItemMargin">
                                    <div class="modal-readonly">{{ formValidate.productModels }}</div>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="纺纱工艺:" class="formItemMargin">
                                    <div class="modal-readonly">{{ formValidate.technologyName }}</div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex">
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="纱线用途:" class="formItemMargin">
                                    <Select label-in-value v-model="formValidate.purposeId" placeholder="请选择纱线用途" @on-change="getPurposeEvent">
                                        <Option v-for="item in purposeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="纱线捻向:" prop="twistDirectionId" class="formItemMargin">
                                    <Select label-in-value v-model="formValidate.twistDirectionId" placeholder="请选择纱线捻向" @on-change="getTwistDirectionEvent">
                                        <Option v-for="item in twistDirectionList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>-->
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="批号:" class="formItemMargin" prop="batchCode">
                                    <div class="flex-left line-height-27">
                                        <Select
                                                class="remoteSearchSelect"
                                                filterable
                                                placeholder="请输入批号"
                                                :disabled="formValidate.productCode ? false : true"
                                                v-model="formValidate.batchCode"
                                                @on-change="getSelectBatchCodeEvent"
                                        >
                                            <Option v-for="(option, index) in remoteBatchCodeList" :value="option.batchCode" :key="option.id">{{option.batchCode}}</Option>
                                        </Select>
                                        <Button :disabled="formValidate.productCode ? false : true" @click="clickMainBatchCodeCodeEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                        <Poptip trigger="hover" content="点击新增批号" placement="bottom">
                                            <Button :disabled="!formValidate.productCode" @click="addBatchCodeEvent" class="line-height-27 add-batch-code-button" size="small" icon="ios-create"></Button>
                                        </Poptip>
                                    </div>
                                </FormItem>
                            </Col>-->
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="批号:" class="formItemMargin" prop="batchCode">
                                    <div class="flex-left line-height-27">
                                        <Input v-model="formValidate.batchCode" class="widthPercentage"/>
                                        <Poptip trigger="hover" content="点击创建批号" placement="bottom">
                                            <Button :disabled="!formValidate.productCode || !formValidate.batchCode" @click="createBatchCodeEvent" class="line-height-27 add-batch-code-button" size="small" icon="ios-create" :loading="createBatchCodeLoading"></Button>
                                        </Poptip>
                                    </div>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label=" 计量单位:" class="formItemMargin">
                                    <div class="modal-readonly">{{ this.formValidate.unitName ? `${this.formValidate.unitName}(${this.formValidate.unitCode})` : '' }}</div>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="订单数量:" prop="productionQty" class="formItemMargin">
                                    <InputNumber :min="0" :step="1" :precision='0' v-model="formValidate.productionQty" @on-blur="getProductionNumEvent" class="widthPercentage"></InputNumber>
                                </FormItem>
                            </Col>
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="溢短装(±%):" class="formItemMargin" prop="weightRate">
                                    <InputNumber
                                            class="widthPercentage"
                                            :min="0"
                                            :max="10"
                                            v-model="formValidate.weightRate"
                                    ></InputNumber>
                                </FormItem>
                            </Col>-->
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label=" 计划员:" class="formItemMargin">
                                    <Select
                                            v-model="formValidate.plannerId"
                                            filterable
                                            clearable
                                            transfer
                                            :loading="searchPlannerSwitch"
                                            @on-change="getSelectPlanner"
                                            placeholder="请输入计划员名称"
                                    >
                                        <Option v-for="(option, index) in remoteUserList" :value="option.value" :key="index">{{option.label}}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                <FormItem label="工艺要求:">
                                    <Input :autosize="{minRows: 3,maxRows: 3}" v-model="formValidate.techRequirement" type="textarea" placeholder="请输入"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="交期要求" name="1" :disabled="deliveryDisable">
                        <Row>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="订单数量:" prop="productionQty" class="formItemMargin">
                                    <div class="modal-readonly">{{ formValidate.productionQty }}</div>
                                </FormItem>
                            </Col>
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="日供货量:" class="formItemMargin" prop="dailySupplyQty">
                                    <InputNumber :min="1" :precision="0" v-model="formValidate.dailySupplyQty" @on-blur="getDailySupplyQtyEvent" class="widthPercentage"/>
                                </FormItem>
                            </Col>-->
                        </Row>
                        <Row>
                            <Col  :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                <Table size="small" border :columns="tableHeader" :data="tableData"></Table>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="质量要求" name="2">
                        <Row>
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                <FormItem label="质量要求:">
                                    <Input :maxlength="512" :autosize="{minRows: 12,maxRows: 12}" v-model="formValidate.qualityRequirement" type="textarea" placeholder="请输入"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="包装要求" name="3">
                        <Row type="flex">
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="包装方式:" class="formItemMargin" :label-width="140" prop="packingModeId">
                                    <Select label-in-value v-model="formValidate.packingModeId" placeholder="请选择包装方式" @on-change="getPackingModelEvent">
                                        <Option v-for="item in packingModeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="最小包装重量(KG):" class="formItemMargin" prop="packetWeightMin" :label-width="140">
                                    <InputNumber class="widthPercentage" :min="0" v-model="formValidate.packetWeightMin" @on-change="getPacketWeightMinEvent"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="最大包装重量(KG):" class="formItemMargin" prop="packetWeightMax" :label-width="140">
                                    <InputNumber class="widthPercentage" :min="0" v-model="formValidate.packetWeightMax" @on-change="getPacketWeightMaxEvent"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="装袋要求:" prop="packetQty" :label-width="140" class="formItemMargin">
                                    <InputNumber class="widthPercentage" :min="1" v-model="formValidate.packetQty"></InputNumber>
                                </FormItem>
                            </Col>
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="编织袋规格:" :label-width="140" class="formItemMargin" prop="packingBag">
                                    <Input v-model="formValidate.packingBag"/>
                                </FormItem>
                            </Col>-->
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="封包绳颜色:" :label-width="140" class="formItemMargin" prop="bagMouthId">
                                    <Select label-in-value v-model="formValidate.bagMouthId" @on-change="getBagMouthEvent">
                                        <Option v-for="item in bagMouthList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>-->
                            <!--<Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="腰绳颜色:" :label-width="140" class="formItemMargin" prop="waistRopeId">
                                    <Select transfer label-in-value v-model="formValidate.waistRopeId" @on-change="getWaistRopeEvent">
                                        <Option v-for="item in waistRopeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>-->
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="是否纸板:" :label-width="140" class="formItemMargin">
                                    <Checkbox v-model="formValidate.isCardboard">是</Checkbox>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="是否有字:" :label-width="140" class="formItemMargin">
                                    <Checkbox v-model="formValidate.isWord">是</Checkbox>
                                </FormItem>
                            </Col>
                            <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="6">
                                <FormItem label="纸管颜色:" :label-width="140" class="formItemMargin" prop="paperTubeId">
                                    <Select transfer label-in-value v-model="formValidate.paperTubeId" @on-change="getPaperTubeIdEvent">
                                        <Option v-for="item in paperTubeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="12">
                                <FormItem label="特殊说明:" :label-width="140">
                                    <Input :autosize="{minRows: 3,maxRows: 3}" v-model="formValidate.specialRemarks" type="textarea" placeholder="请输入"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
        <tips-modal
                :v-model="publicPromptStatus"
                :tip-msg="promptMsg"
                :loading="deleteButtonLoading"
                @cancel="keptCancel"
                @confirm="keptConfirm"
        >
        </tips-modal>
        <tips-clear
                :tips-icon="'md-help-circle'"
                :tips-modal-state="clearTipsStatus"
                :tips-modal-message="clearTipsMsg"
                @cancel-event="clearTipsCancel"
                @confirm-event="clearTipsConfirm"
        >
        </tips-clear>
        <select-material-modal
                :select-material-modal-state="selectMaterialModalState"
                :select-material-table-loading="selectMaterialTableLoading"
                :select-materiel-modal-table-data="selectMaterielModalTableData"
                :select-material-page-total="selectMaterialPageTotal"
                :select-material-category-value="selectMaterialCategoryValue"
                :select-product-modal-default-category="selectProductModalDefaultCategory"
                @select-material-modal-category-event="getMaterialCategoryEvent"
                @on-visible-change="selectMaterialModalStateChangeEvent"
                @select-material-modal-search-event="selectMaterialModalSearchBtnEvent"
                @on-change-page="getSelectMaterialModalPageCodeEvent"
                @confirm-event="selectMaterialConfirmEvent"
        >
        </select-material-modal>
        <create-tips-modal
                :tips-modal-state="tipsModalState"
                :tips-icon="tipsModalIcon"
                :tips-modal-message="tipsModalMessage"
                @confirm-event="tipsModalConfirmEvent"
                @cancel-event="tipsModalCancelEvent"
        ></create-tips-modal>
        <add-batch-modal
                :add-batch-modal-state="addBatchModalState"
                :add-batch-modal-product-code-item="addBatchModalProductCodeItem"
                @on-visible-change="addBatchCodeModalVisibleChangeEvent"
                @add-batch-code-modal-confirm-event="addBatchCodeModalConfirmEvent"
        ></add-batch-modal>
        <select-batch-modal
                :select-batch-modal-state="selectBatchModalState"
                :spin-show="selectBatchModalSpinShow"
                :select-batch-page-total="selectBatchPageTotal"
                :select-batch-modal-table-data="selectBatchModalTableData"
                @on-visible-change="selectBatchModalStateChangeEvent"
                @on-change-page="getSelectBatchModalPageCodeEvent"
                @select-batch-modal-search-event="selectBatchModalSearchBtnEvent"
                @select-batch-modal-confirm-event="selectBatchModalConfirmEvent"
        ></select-batch-modal>
    </card>
</template>
<script>
    import { formatDay, mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, noticeTips, formatDate, toDaySeconds, compClientHeight, addNum, setPage, accDivision, emptyTips, toDay } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import tipsClear from '../../components/tips-modal';
    import selectMaterialModal from './select-material';
    import createTipsModal from '../../components/tips-modal';
    import addBatchModal from '../bom/components/add-batch-modal';
    import selectBatchModal from '../bom/components/select-batch-modal';
    let _this = this;
    export default{
        name: 'add-order',
        components: {
            tipsModal, tipsClear, selectMaterialModal, createTipsModal, addBatchModal, selectBatchModal
        },
        data () {
            const validateOrderDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateOrderType = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateNumberIpt = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateUnit = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateEmergency = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDeliveryTo = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDeliveryFrom = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDelivery = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateNumber = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshop = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePlannerIpt = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateMoreLessIpt = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            const validateSaleNumIpt = (rule, value, callback) => {
                if (value || value === '0') {
                    if (/[\u4e00-\u9fa5]/g.test(value)) {
                        callback(new Error());
                        this.$Message.warning('销售单号不能为中文!');
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                };
            };
            const validatePacketWeightMin = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            const validatePacketWeightMax = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            const validatePackingBag = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePacketQty = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            const validateBagMouth = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWaistRope = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePurpose = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePackingMode = (rule, value, callback) => _this.formValidate.packingModeId ? callback() : callback(new Error());
            const validateTwistDirection = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDailySupplyQty = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePaperTubeId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWaistRopeId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateBagMouthId = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                createBatchCodeLoading: false,
                bagMouthList: [],
                paperTubeList: [],
                waistRopeList: [],
                globalLoadingShow: false,
                packingModeList: [],
                purposeList: [],
                twistDirectionList: [],
                selectBatchPageTotal: 0,
                selectBatchModalTableData: [],
                selectBatchModalPageIndex: 1,
                selectBatchModalSpinShow: false,
                selectBatchModalState: false,
                addBatchModalProductCodeItem: {},
                addBatchModalState: false,
                remoteBatchCodeList: [],
                tipsModalMessage: '',
                tipsModalIcon: '',
                tipsModalState: false,
                initTableData: [{
                    deliveryDate: '',
                    operation: '',
                    deliveredQty: null
                }],
                copyId: '',
                isQuote: false,
                selectMaterialCategoryValue: [],
                selectMaterialPageTotal: 0,
                selectMaterialPageIndex: 1,
                selectMaterialModalState: false,
                selectMaterialTableLoading: false,
                remoteList: [],
                remoteMaterialLoading: false,
                remoteMaterialList: [],
                startTimeOptions: {},
                endTimeOptions: {},
                selectOptions: {},
                startTime: '',
                endTime: '',
                clearTipsStatus: false,
                clearTipsMsg: '',
                defaultActiveTabs: '0',
                publicPromptStatus: false,
                promptMsg: '',
                deleteButtonLoading: false,
                isNoKept: false,
                formValidate: {
                    paperTubeId: null,
                    isWord: true,
                    isCardboard: true,
                    waistRopeId: null,
                    waistRopeName: '',
                    bagMouthId: null,
                    bagMouthName: '',
                    dailySupplyQty: null,
                    priorityId: null,
                    priorityName: null,
                    orderDate: toDaySeconds(),
                    workshopId: null,
                    workshopName: '',
                    typeId: null,
                    typeName: '',
                    priority: '',
                    salesCode: '',
                    deliveryDateFrom: '',
                    deliveryDateTo: '',
                    remark: '',
                    productCode: '',
                    productName: '',
                    productId: null,
                    productModels: '',
                    technologyName: '',
                    purposeId: null,
                    purposeName: '',
                    productionQty: null,
                    weightRate: 0,
                    twistDirectionId: null,
                    twistDirectionName: '',
                    batchCode: '',
                    plannerId: null,
                    plannerName: '',
                    techRequirement: '',
                    packingModeId: null,
                    packingModeName: '',
                    workshopIpt: '',
                    orderTypeIpt: '',
                    emergencyStateIpt: '1',
                    saleNumIpt: '',
                    materielCodeIpt: '',
                    batchNumberIpt: '',
                    productionNumIpt: null,
                    deliveryIpt: '',
                    deliveryToIpt: '',
                    deliveryFromIpt: '',
                    moreLessIpt: 5,
                    packetWeightMin: 25.2,
                    packetWeightMax: 25.3,
                    packingBag: null,
                    bagMouth: '',
                    waistRope: '',
                    specialRemarks: '',
                    packetQty: 12
                },
                ruleValidate: {
                    bagMouthId: [{ required: true, validator: validateBagMouthId, trigger: 'change' }],
                    waistRopeId: [{ required: true, validator: validateWaistRopeId, trigger: 'change' }],
                    paperTubeId: [{ required: true, validator: validatePaperTubeId, trigger: 'change' }],
                    packingModeId: [{ required: true, validator: validatePackingMode, trigger: 'change' }],
                    purposeId: [{ required: true, validator: validatePurpose, trigger: 'change' }],
                    twistDirectionId: [{ required: true, validator: validateTwistDirection, trigger: 'change' }],
                    salesCode: [{ required: true, validator: validateSaleNumIpt, trigger: 'change' }],
                    weightRate: [{ required: true, validator: validateMoreLessIpt, trigger: 'change' }],
                    plannerId: [{ required: true, validator: validatePlannerIpt, trigger: 'change' }],
                    workshopId: [{ required: true, validator: validateWorkshop, trigger: 'change' }],
                    orderDate: [{ required: true, validator: validateOrderDate, trigger: 'change' }],
                    typeId: [{ required: true, validator: validateOrderType, trigger: 'change' }],
                    priorityId: [{ required: true, validator: validateEmergency, trigger: 'change' }],
                    productCode: [{ required: true, trigger: 'change' }],
                    batchCode: [{ required: true, validator: validateNumberIpt, trigger: 'change' }],
                    packetWeightMin: [{ required: true, validator: validatePacketWeightMin, trigger: 'change' }],
                    packetWeightMax: [{ required: true, validator: validatePacketWeightMax, trigger: 'change' }],
                    packingBag: [{ required: true, validator: validatePackingBag, trigger: 'change' }],
                    bagMouth: [{ required: true, validator: validateBagMouth, trigger: 'change' }],
                    waistRope: [{ required: true, validator: validateWaistRope, trigger: 'change' }],
                    packetQty: [{ required: true, validator: validatePacketQty, trigger: 'change' }],
                    unitIpt: [{ required: true, validator: validateUnit, trigger: 'change' }],
                    productionQty: [{ required: true, validator: validateNumber, trigger: 'change' }],
                    deliveryIpt: [{ required: true, validator: validateDelivery, trigger: 'blur' }],
                    deliveryDateFrom: [{ required: true, validator: validateDeliveryFrom, trigger: 'change' }],
                    deliveryDateTo: [{ required: true, validator: validateDeliveryTo, trigger: 'change' }],
                    dailySupplyQty: [{ required: true, validator: validateDailySupplyQty, trigger: 'blur' }]

                },
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-add'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.addTableButton(params.index);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'

                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            _this.reduceTableButton(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '交货日期',
                        key: 'deliveryDate',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('DatePicker', {
                                    props: {
                                        value: params.row.deliveryDate,
                                        placeholder: '请选择日期',
                                        transfer: true,
                                        options: this.selectOptions,
                                        editable: false
                                    },
                                    style: {
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.deliveryDate = event;
                                            _this.tableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }

                    },
                    {
                        title: '数量',
                        key: 'deliveredQty',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.deliveredQty,
                                        min: 0,
                                        precision: 0

                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.deliveredQty = e;
                                            _this.tableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                tableData: [],
                workshopList: [],
                orderTypeList: [],
                emergencyStateList: [],
                deliveryDisable: false,
                selectMaterielModalTableData: [],
                materielData: [],
                selectMaterialObj: {},
                searchPlannerSwitch: false,
                plannerList: [],
                remoteUserList: [],
                newAddSwitch: true,
                copySwitch: true,
                saveToSubmit: false,
                orderStatus: '',
                toCreated: false,
                selectProductModalDefaultCategory: [],
                defaultMaterialCategory: []
            };
        },
        methods: {
            createBatchCodeEvent () {
                let params = {
                    batchCode: this.formValidate.batchCode,
                    productId: this.selectMaterialObj.id,
                    productCode: this.selectMaterialObj.code,
                    batchDate: toDay(),
                    productName: this.selectMaterialObj.name,
                    productModels: this.selectMaterialObj.models,
                    auditState: 3
                };
                this.createBatchCodeLoading = true;
                this.$call('product.batch.save', params).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.showModal = false;
                        this.createBatchCodeLoading = false;
                    } else {
                        this.formValidate.batchCode = '';
                        this.createBatchCodeLoading = false;
                    }
                });
            },
            // 纸管颜色事件
            getPaperTubeIdEvent (e) {
                if (e) {
                    this.formValidate.paperTubeId = e.value;
                    this.formValidate.paperTubeName = e.label;
                } else {
                    this.formValidate.paperTubeId = null;
                    this.formValidate.paperTubeName = '';
                };
            },
            // 封包绳颜色事件
            getBagMouthEvent (e) {
                if (e) {
                    this.formValidate.bagMouthId = e.value;
                    this.formValidate.bagMouthName = e.label;
                } else {
                    this.formValidate.bagMouthId = null;
                    this.formValidate.bagMouthName = '';
                };
            },
            // 腰绳颜色事件
            getWaistRopeEvent (e) {
                if (e) {
                    this.formValidate.waistRopeId = e.value;
                    this.formValidate.waistRopeName = e.label;
                } else {
                    this.formValidate.waistRopeId = null;
                    this.formValidate.waistRopeName = '';
                };
            },
            // 获取订单数量
            getProductionNumEvent (e) {
                if (this.formValidate.deliveryDateFrom && this.formValidate.deliveryDateTo) {
                    if (Date.parse(this.formValidate.deliveryDateFrom) <= Date.parse(this.formValidate.deliveryDateTo)) {
                        let dayNum = this.getAllDate(formatDay(this.formValidate.deliveryDateFrom), formatDay(this.formValidate.deliveryDateTo)).length;
                        this.formValidate.dailySupplyQty = parseInt(mathJsDiv(this.formValidate.productionQty, dayNum));
                        this.calculateQty();
                    } else {
                        emptyTips(this, '交货开始时间必须早于交货结束时间!');
                    };
                } else {
                    this.tableData = JSON.parse(JSON.stringify(this.initTableData));
                };
            },
            format (time) {
                let ymd = '';
                let mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1));
                let day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate());
                ymd += time.getFullYear() + '-'; // 获取年份。
                ymd += mouth + '-'; // 获取月份。
                ymd += day; // 获取日。
                return ymd; // 返回日期。
            },
            getAllDate (start, end) {
                let dateArr = [];
                let startArr = start.split('-');
                let endArr = end.split('-');
                let db = new Date();
                db.setUTCFullYear(startArr[0], startArr[1] - 1, startArr[2]);
                let de = new Date();
                de.setUTCFullYear(endArr[0], endArr[1] - 1, endArr[2]);
                let unixDb = db.getTime();
                let unixDe = de.getTime();
                let stamp;
                const oneDay = 24 * 60 * 60 * 1000;
                for (stamp = unixDb; stamp <= unixDe;) {
                    dateArr.push(this.format(new Date(parseInt(stamp))));
                    stamp = stamp + oneDay;
                }
                return dateArr;
            },
            // 日供货量的事件
            getDailySupplyQtyEvent (e) {
                if (this.formValidate.productionQty && this.formValidate.productionQty >= this.formValidate.dailySupplyQty) {
                    this.calculateQty();
                } else {
                    this.tableData = JSON.parse(JSON.stringify(this.initTableData));
                    emptyTips(this, '日供货量不能大于订单数量!');
                };
            },
            // 计算具体交期和交货数量
            calculateQty () {
                if (this.formValidate.deliveryDateFrom && this.formValidate.productionQty && this.formValidate.dailySupplyQty) {
                    this.tableData = [];
                    let day = Math.ceil(mathJsDiv(this.formValidate.productionQty, this.formValidate.dailySupplyQty));
                    for (let i = 0; i < parseInt(day); i++) {
                        this.tableData.push({
                            deliveryDate: formatDay(new Date(this.formValidate.deliveryDateFrom).valueOf() + i * 24 * 60 * 60 * 1000),
                            deliveredQty: this.formValidate.dailySupplyQty
                        });
                    };
                    let accumulationQty = 0; // 当前交货数量
                    let surplusQty = 0; // 剩余交货数量
                    accumulationQty = parseFloat(mathJsMul(parseInt(day), this.formValidate.dailySupplyQty));
                    surplusQty = mathJsSub(this.formValidate.productionQty, accumulationQty);
                    this.tableData[this.tableData.length - 1].deliveredQty = mathJsAdd(this.tableData[this.tableData.length - 1].deliveredQty, surplusQty);
                };
            },
            // 获取选中的包装方式
            getPackingModelEvent (event) {
                if (event) this.formValidate.packingModeName = event.label;
            },
            // 获取纱线用途的name
            getPurposeEvent (event) {
                if (event) this.formValidate.purposeName = event.label;
            },
            getTwistDirectionEvent (event) {
                if (event) this.formValidate.twistDirectionName = event.label;
            },
            // 新增批次modal的确认事件
            addBatchCodeModalConfirmEvent (batchCode) {
                this.formValidate.batchCode = '';
                this.getProductToBatchCodeListHttp().then(res => {
                    if (res.data.status === 200) {
                        this.remoteBatchCodeList = res.data.res;
                        this.$set(this.formValidate, 'batchCode', batchCode);
                    };
                });
            },
            // 选择批次modal的搜索按钮事件
            selectBatchModalSearchBtnEvent (e) {
                this.selectBatchModalPageIndex = 1;
                this.selectBatchPageTotal = 1;
                this.getProductToBatchCodeListHttp(this.formValidate.productCode, e.name, this.selectBatchModalPageIndex, setPage.pageSize).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            // 选择批次modal的分页事件
            getSelectBatchModalPageCodeEvent (e) {
                this.selectBatchModalPageIndex = e.pageIndex;
                this.getProductToBatchCodeListHttp(this.formValidate.productCode, e.name, this.selectBatchModalPageIndex, setPage.pageSize).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            // 获取批次列表
            getProductToBatchCodeListHttp (productCode = '', batchCode = '', pageIndex = '', pageSize = '') {
                return this.$call('product.batch.list', {
                    productNameCode: productCode,
                    batchCode: batchCode,
                    auditState: 3,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                });
            },
            // 选择批次modal
            selectBatchModalConfirmEvent (e) {
                this.$set(this.formValidate, 'batchCode', '');
                setTimeout(() => {
                    this.$set(this.formValidate, 'batchCode', e.batchCode);
                    this.selectBatchModalState = false;
                }, 0);
            },
            clickMainBatchCodeCodeEvent () {
                this.selectBatchModalState = true;
                this.selectBatchModalSpinShow = true;
                this.selectBatchPageTotal = 1;
                this.selectBatchModalPageIndex = 1;
                this.getProductToBatchCodeListHttp(this.formValidate.productCode, '', this.selectBatchModalPageIndex, setPage.pageSize).then(res => {
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
            // 批次的远程搜索
            addBatchCodeModalVisibleChangeEvent (e) {
                this.addBatchModalState = e;
            },
            getSelectBatchCodeEvent () {},
            // 新增批次
            addBatchCodeEvent () {
                this.addBatchModalProductCodeItem = {
                    productId: this.selectMaterialObj.id,
                    productCode: this.selectMaterialObj.code,
                    productName: this.selectMaterialObj.name,
                    productModels: this.selectMaterialObj.models
                };
                this.addBatchModalState = true;
            },
            // 成包重量
            getPacketWeightMinEvent () {
                if (this.formValidate.packetWeightMin >= this.formValidate.packetWeightMax) {
                    emptyTips(this, '最小成包重量不能大于或等于最大成包重量!');
                };
            },
            getPacketWeightMaxEvent () {
                if (this.formValidate.packetWeightMin >= this.formValidate.packetWeightMax) {
                    emptyTips(this, '最小成包重量不能大于或等于最大成包重量!');
                };
            },
            // 保存请求
            saveHttp () {
                this.selectMaterialObj = this.selectMaterialObj || {id: '', code: '', name: '', models: ''};
                this.emergencyStateList.forEach((item) => { item.id === this.formValidate.priorityId ? this.formValidate.priorityName = item.name : false; });
                let params = {
                    'orderDate': formatDay(this.formValidate.orderDate),
                    'workshopId': this.formValidate.workshopId,
                    'workshopName': this.formValidate.workshopName,
                    'typeId': this.formValidate.typeId,
                    'typeName': this.formValidate.typeName,
                    'priorityId': this.formValidate.priorityId,
                    'priorityName': this.formValidate.priorityName,
                    'salesCode': this.formValidate.salesCode,
                    'remark': this.formValidate.remark,
                    'productId': this.selectMaterialObj.id,
                    'productName': this.selectMaterialObj.name,
                    'productCode': this.selectMaterialObj.code,
                    'productModels': this.selectMaterialObj.models,
                    'batchCode': this.formValidate.batchCode,
                    'unitId': this.formValidate.unitId,
                    'unitCode': this.formValidate.unitCode,
                    'unitName': this.formValidate.unitName,
                    'processId': this.formValidate.processId,
                    'processCode': this.formValidate.processCode,
                    'processName': this.formValidate.processName,
                    'productionQty': this.formValidate.productionQty,
                    'completionQty': null,
                    'weightRate': this.formValidate.weightRate,
                    'plannerId': this.formValidate.plannerId,
                    'plannerName': this.formValidate.plannerName,
                    'techRequirement': this.formValidate.techRequirement,
                    'deliveryDateFrom': this.formValidate.deliveryDateFrom ? formatDay(this.formValidate.deliveryDateFrom) : '',
                    'deliveryDateTo': this.formValidate.deliveryDateTo ? formatDay(this.formValidate.deliveryDateTo) : '',
                    'orderDeliveryList': this.tableData,
                    'qualityRequirement': this.formValidate.qualityRequirement,
                    'technologyId': this.formValidate.technologyId,
                    'technologyName': this.formValidate.technologyName,
                    'twistDirectionId': this.formValidate.twistDirectionId,
                    'twistDirectionName': this.formValidate.twistDirectionName,
                    'purposeId': this.formValidate.purposeId,
                    'purposeName': this.formValidate.purposeName,
                    'dailySupplyQty': this.formValidate.dailySupplyQty,
                    'orderPackingEntity': {
                        'packingModeId': this.formValidate.packingModeId,
                        'packingModeName': this.formValidate.packingModeName,
                        'packetWeightMin': this.formValidate.packetWeightMin,
                        'packetWeightMax': this.formValidate.packetWeightMax,
                        'packetQty': this.formValidate.packetQty,
                        'packingBag': this.formValidate.packingBag,
                        'bagMouth': this.formValidate.bagMouth,
                        'waistRope': this.formValidate.waistRope,
                        'specialRemarks': this.formValidate.specialRemarks,
                        // 新增的字段
                        'bagMouthId': this.formValidate.bagMouthId,
                        'bagMouthName': this.formValidate.bagMouthName,
                        'waistRopeId': this.formValidate.waistRopeId,
                        'waistRopeName': this.formValidate.waistRopeName,
                        'isCardboard': this.formValidate.isCardboard,
                        'isWord': this.formValidate.isWord,
                        'paperTubeId': this.formValidate.paperTubeId,
                        'paperTubeName': this.formValidate.paperTubeName
                    }
                };
                this.$api.order.saveHttp(params).then((res) => {
                    if (res.data.status === 200) {
                        if (this.saveToSubmit === true) { // 如果是'提交'
                            this.pushHttp(res.data.res);
                        } else {
                            this.deleteButtonLoading = false;
                            this.publicPromptStatus = false;
                            this.tipsModalState = true;
                            this.tipsModalIcon = 'md-help-circle';
                            this.tipsModalMessage = '保存成功，是否继续新增?';
                        };
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 创建成功modal确认事件
            tipsModalConfirmEvent () {
                this.$route.query.id = undefined;
                Object.assign(this.$data, this.$options.data());
                this.startTimeOptions = {disabledDate (date) { return false; }};
                this.endTimeOptions = {disabledDate (date) { return false; }};
                this.selectOptions = {disabledDate (date) { return false; }};
                setTimeout(() => {
                    _this = this;
                    this.$refs['formValidate'].resetFields();
                    Promise.all(this.getAllDataHttp()).then(res => {});
                }, 0);
            },
            // 创建成功modal取消事件
            tipsModalCancelEvent () {
                this.tipsModalState = false;
                this.$store.commit('removeTag', 'addOrder');// 关闭新增的快捷入口
                this.$router.push({
                    path: 'order',
                    query: {
                        activated: true
                    }
                });
            },
            // 选择物料modal的搜索事件
            selectMaterialModalSearchBtnEvent (e) {
                this.selectMaterialPageIndex = 1;
                this.selectMaterialPageTotal = 1;
                this.selectMaterialCategoryValue = e.categoryIdArr;
                this.getSelectMaterialModalData(e.categoryIdArr[e.categoryIdArr.length - 1], e.name);
            },
            // 产品编码的点击事件
            clickMainMaterialCodeEvent () {
                this.selectMaterialTableLoading = true;
                this.selectProductModalDefaultCategory = JSON.parse(JSON.stringify(this.defaultMaterialCategory));
                this.getSelectMaterialModalData(this.defaultMaterialCategory[this.defaultMaterialCategory.length - 1]);
                this.selectMaterialModalState = true;
            },
            toTree (data) {
                data.forEach((item) => {
                    delete item.children;
                });
                let map = {};
                data.forEach((item) => {
                    map[item.id] = item;
                });
                let val = [];
                data.forEach((item) => {
                    let parent = map[item.parentId];
                    if (parent) {
                        item.title = item.name;
                        item.label = item.name;
                        item.value = item.id;
                        (parent.children || (parent.children = [])).push(item);
                    } else {
                        item.title = item.name;
                        item.label = item.name;
                        item.value = item.id;
                        val.push(item);
                    }
                });
                return val;
            },
            getMaterialCategoryList (resolve, reject) {
                return this.$api.category.getProductCategoryList({}).then(res => {
                    let arr = this.toTree(res.data.res);
                    this.defaultMaterialCategory = [arr[0].id, arr[0].children[0].id];
                    resolve(res);
                });
            },
            // 获取选择物料modal的页码事件
            getSelectMaterialModalPageCodeEvent (data) {
                this.selectMaterialTableLoading = true;
                this.selectMaterialPageIndex = data.pageIndex;
                this.getSelectMaterialModalData(data.categoryIdArr[data.categoryIdArr.length - 1], data.name);
            },
            // 获取物料的请求
            getSelectMaterialModalData (categoryId, name) {
                let categoryIdStr = categoryId || '';
                let nameStr = name || '';
                this.$call('product.list2',
                    {
                        categoryId: categoryIdStr,
                        enableState: 1,
                        name: nameStr,
                        pageSize: setPage.pageSize,
                        auditState: 3,
                        pageIndex: this.selectMaterialPageIndex
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.selectMaterialTableLoading = false;
                        this.selectMaterielModalTableData = res.data.res;
                        this.selectMaterialPageTotal = res.data.count;
                    }
                });
            },
            // 选择物料modal的物料类别事件
            getMaterialCategoryEvent (data) {
                this.selectMaterialPageIndex = 1;
                this.selectMaterialPageTotal = 1;
                this.selectMaterialTableLoading = true;
                this.selectMaterialCategoryValue = data.categoryIdArr;
                this.getSelectMaterialModalData(data.categoryIdArr[data.categoryIdArr.length - 1], data.name);
            },
            // 选择物料modal的双击事件
            selectMaterialConfirmEvent (e) {
                this.selectMaterialObj = e;
                if (this.selectMaterialObj) {
                    this.$set(this.formValidate, 'productCode', '');
                    setTimeout(() => { this.$set(this.formValidate, 'productCode', e.code); }, 200);
                    this.formValidate.productModels = this.selectMaterialObj.models;
                    this.$set(this.formValidate, 'unitId', this.selectMaterialObj.unitId);
                    this.$set(this.formValidate, 'unitCode', this.selectMaterialObj.unitCode);
                    this.$set(this.formValidate, 'unitName', this.selectMaterialObj.unitName);
                    this.$set(this.formValidate, 'processName', this.selectMaterialObj.processName);
                    this.$set(this.formValidate, 'processCode', this.selectMaterialObj.processCode);
                    this.$set(this.formValidate, 'processId', this.selectMaterialObj.processId);
                    this.$set(this.formValidate, 'batchCode', '');
                    this.formValidate.purposeName = e.purposeName;
                    this.formValidate.purposeId = e.purposeId;
                    this.formValidate.technologyName = e.technologyName;
                    this.formValidate.technologyId = e.technologyId;
                    this.selectMaterialModalState = false;
                    this.getProductToBatchCodeListHttp(e.code).then(res => {
                        if (res.data.status === 200) {
                            this.remoteBatchCodeList = res.data.res;
                        }
                    });
                }
            },
            selectMaterialModalStateChangeEvent (e) {
                this.selectMaterialModalState = e;
                if (e === false) {
                    this.selectMaterialCategoryValue = [];
                    this.selectMaterialPageIndex = 1;
                    this.selectMaterialTableLoading = false;
                    this.selectMaterialPageTotal = 0;
                }
            },
            // 选择产品事件
            getSelectMaterialEvent (e) {
                if (e !== undefined) {
                    this.formValidate.codeValue = e;
                    this.selectMaterialObj = null;
                    this.remoteList.forEach((item) => {
                        if (e === item.code) { this.selectMaterialObj = item; }
                    });
                    this.$set(this.formValidate, 'productCode', this.selectMaterialObj.code);
                    this.formValidate.productModels = this.selectMaterialObj.models;
                    this.$set(this.formValidate, 'unitId', this.selectMaterialObj.unitId);
                    this.$set(this.formValidate, 'unitCode', this.selectMaterialObj.unitCode);
                    this.$set(this.formValidate, 'unitName', this.selectMaterialObj.unitName);
                    this.$set(this.formValidate, 'processName', this.selectMaterialObj.processName);
                    this.$set(this.formValidate, 'processId', this.selectMaterialObj.processId);
                    this.$set(this.formValidate, 'processCode', this.selectMaterialObj.processCode);
                    this.formValidate.purposeName = this.selectMaterialObj.purposeName;
                    this.formValidate.purposeId = this.selectMaterialObj.purposeId;
                    this.formValidate.technologyName = this.selectMaterialObj.technologyName;
                    this.formValidate.technologyId = this.selectMaterialObj.technologyId;
                    this.$set(this.formValidate, 'batchCode', '');
                    this.remoteBatchCodeList = [];
                    this.getProductToBatchCodeListHttp(this.selectMaterialObj.code).then(res => {
                        if (res.data.status === 200) {
                            this.remoteBatchCodeList = res.data.res;
                        }
                    });
                }
            },
            // 搜索产品的方法
            remoteMaterialMethod (query) {
                if (query !== '') {
                    this.remoteMaterialLoading = true;
                    setTimeout(() => {
                        this.remoteMaterialLoading = false;
                        this.remoteMaterialList = this.remoteList.filter(item => {
                            // return item.code.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.name.indexOf(query) > -1;
                            return item.label.indexOf(query) > -1;
                        });
                    }, 200);
                } else {
                    this.remoteMaterialList = [];
                }
            },
            // 获取细纱关联的产品
            getXSMaterialHttp (resolve, reject) {
                return this.$call('product.list2', {
                    enableState: 1,
                    auditState: 3
                }).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        res.data.res.forEach((item) => {
                            this.$set(item, 'label', `${item.name}(${item.code})`);
                        });
                        this.remoteList = res.data.res;
                    }
                }).catch(err => {
                    reject(err);
                });
            },
            clearTipsCancel () {
                this.clearTipsMsg = '';
                this.clearTipsStatus = false;
            },
            // 新增的事件
            addClick () {
                this.clearTipsStatus = true;
                this.clearTipsMsg = '数据尚未保存，确认清空？';
            },
            // 交期结束时间
            getDateTo (e) {
                this.formValidate.deliveryDateTo = e;
                this.endTime = e;
                if (e !== '') {
                    let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                    this.startTimeOptions = {
                        disabledDate (date) {
                            return date && date.valueOf() > endTime;
                        }
                    };
                } else {
                    this.startTimeOptions = {
                        disabledDate (date) {
                            return false;
                        }
                    };
                    this.endTimeOptions = {
                        disabledDate: date => {
                            let startTime = this.startTime ? new Date(this.startTime).valueOf() - 86400000 : '';
                            return date && (date.valueOf() < startTime);
                        }
                    };
                }
                // this.startTimeAndEndTime();
                if (this.formValidate.deliveryDateFrom && this.formValidate.deliveryDateTo) {
                    let dayNum = this.getAllDate(formatDay(this.formValidate.deliveryDateFrom), formatDay(this.formValidate.deliveryDateTo)).length;
                    this.formValidate.dailySupplyQty = parseInt(mathJsDiv(this.formValidate.productionQty, dayNum));
                };
                this.calculateQty();
            },
            // 交期开始时间
            getDateFrom (e) {
                this.formValidate.deliveryDateFrom = e;
                this.startTime = e;
                this.endTimeOptions = {
                    disabledDate: date => {
                        let startTime = this.startTime ? new Date(this.startTime).valueOf() - 86400000 : '';
                        return date && (date.valueOf() < startTime);
                    }
                };
                // 限制动态的交货日期选择范围
                this.selectOptions = {
                    disabledDate: date => {
                        // 包含当天
                        let startTime = this.startTime ? new Date(this.startTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                        let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                        return date && (date.valueOf() < startTime) || (date.valueOf() > endTime);
                    }
                };
                // this.startTimeAndEndTime();
                if (this.formValidate.deliveryDateFrom && this.formValidate.deliveryDateTo) {
                    let dayNum = this.getAllDate(formatDay(this.formValidate.deliveryDateFrom), formatDay(this.formValidate.deliveryDateTo)).length;
                    this.formValidate.dailySupplyQty = parseInt(mathJsDiv(this.formValidate.productionQty, dayNum));
                }
                this.calculateQty();
            },
            // 开始日期和结束日期存在，罗列日期
            startTimeAndEndTime () {
                if (this.startTime && this.endTime) {
                    let dataArr = this.getAllDate(this.startTime, this.endTime);
                    this.tableData = [];
                    // 赋值表格
                    let vl = this.formValidate.productionQty ? accDivision(this.formValidate.productionQty, dataArr.length) : 0;
                    dataArr.forEach((dayItem, index) => {
                        this.tableData.push({
                            deliveryDate: dayItem,
                            operation: '',
                            deliveredQty: parseInt(vl)
                        });
                    });
                } else {
                    this.tableData = this.initTableData;
                };
                // 计算日供货量
                if (this.formValidate.productionQty) {
                    let vl = accDivision(this.formValidate.productionQty, this.tableData.length);
                    this.formValidate.dailySupplyQty = parseInt(vl);
                };
            },
            // 获取选中的计划员
            getSelectPlanner (e) {
                if (e) {
                    this.remoteUserList.forEach(item => {
                        if (item.id === e) {
                            this.formValidate.plannerId = item.id;
                            this.formValidate.plannerName = item.name;
                        };
                    });
                } else {
                    this.formValidate.plannerId = null;
                    this.formValidate.plannerName = '';
                };
            },
            // 搜索计划员的方法
            getPlanner (query) {
                if (query !== '') {
                    this.searchPlannerSwitch = true;
                    setTimeout(() => {
                        this.searchPlannerSwitch = false;
                        this.plannerList = this.remoteUserList.filter(item => item.id + ''.toLowerCase().indexOf(query.toLowerCase()) > -1);
                    }, 200);
                } else {
                    this.plannerList = [];
                }
            },
            getUserListHttp (resolve, reject) {
                return this.$api.user.listHttp({
                    name: '',
                    isSupplement: false,
                    onJob: true
                }).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        let responseData = res.data.res;
                        responseData.forEach((items) => {
                            items.label = `${items.name}(${items.code})`;
                            items.value = items.id;
                        });
                        this.remoteUserList = responseData;
                    }
                }).catch(err => {
                    reject(err);
                });
            },
            // 获取选中的车间
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            // 保存和提交取消按钮
            keptCancel () {
                this.publicPromptStatus = false;
                this.deleteButtonLoading = false;
                this.promptMsg = '';
                this.isNoKept = false;
            },
            // 保存和提交确认按钮
            keptConfirm () {
                if (this.isNoKept === true) { // 判断交货数量是否大于生产数量
                    this.deleteButtonLoading = false;
                    this.publicPromptStatus = false;
                    this.promptMsg = '';
                } else {
                    // 校验并保存
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            this.deleteButtonLoading = true;
                            this.saveHttp();
                        } else {
                            this.validateNotNullMethods();
                            this.saveToSubmit = false;
                        };
                    });
                };
            },
            // 验证不能为空
            validateNotNullMethods () {
                if (!this.formValidate.productCode || !this.formValidate.twistDirectionId || !this.formValidate.batchCode || !this.formValidate.productionQty || !!this.formValidate.weightRate) {
                    emptyTips(this, '基本信息未填写完整!');
                };
                if (!this.formValidate.packingModeId || !this.formValidate.packetWeightMin || !this.formValidate.packetWeightMax || !this.formValidate.packetQty || !this.formValidate.packingBag || !this.formValidate.bagMouthId || !this.formValidate.waistRopeId || !this.formValidate.isCardboard || !this.formValidate.isWord || !this.formValidate.paperTubeId) {
                    emptyTips(this, '包装要求未填写完整!');
                };
            },
            // 保存的事件
            saveDropDownEvent (e) {
                if (this.formValidate.deliveryDateFrom && this.formValidate.deliveryDateTo) {
                    this.saveToSubmit = false;
                    this.saveHttp();// 保存的请求
                } else {
                    emptyTips(this, '交货时间不能为空!');
                };
            },
            // 表格的减少按钮
            reduceTableButton (index) {
                if (this.tableData.length > 1) {
                    this.tableData.splice(index, 1);
                };
            },
            // 表格的添加按钮
            addTableButton (index) {
                this.tableData.splice(index + 1, 0, {
                    deliveryDate: '',
                    operation: '',
                    deliveredQty: null
                });
            },
            // 订单类型
            selectOrderTypeEvent (e) {
                if (e) {
                    this.formValidate.typeId = e.value;
                    this.formValidate.typeName = e.label;
                } else {
                    this.formValidate.typeId = null;
                    this.formValidate.typeName = '';
                };
            },
            // 提交的请求
            pushHttp (id) {
                this.$api.order.submitHttp([id]).then(res => {
                    if (res.data.status === 200) {
                        this.publicPromptStatus = false;
                        this.saveToSubmit = false;
                        this.deleteButtonLoading = false;
                        this.tipsModalState = true;
                        this.tipsModalIcon = 'md-help-circle';
                        this.tipsModalMessage = '提交成功，是否继续新增?';
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 提交的点击事件
            pushDropDownEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        // 判断交期是否在交货时间范围内
                        let isOverflow = false;
                        this.tableData.forEach((item) => {
                            if ((new Date(item.deliveryDate).valueOf() - (8 * 60 * 60 * 1000)) > new Date(this.formValidate.deliveryDateTo).valueOf()) {
                                isOverflow = true;
                            };
                        });
                        if (!isOverflow) {
                            this.saveToSubmit = true;
                            // 判断交货数量是否在生产数量的范围内
                            let totalNum = 0;
                            this.tableData.forEach((numbers) => {
                                totalNum = addNum(totalNum, numbers.deliveredQty);
                            });
                            if (totalNum < this.formValidate.productionQty) {
                                this.promptMsg = `交货数量(${totalNum}) 小于生产数量(${this.formValidate.productionQty}),确定操作?`;
                                this.publicPromptStatus = true;
                                this.isNoKept = false;
                            } else if (totalNum === this.formValidate.productionQty) {
                                this.saveToSubmit = true;
                                this.deleteButtonLoading = true;
                                this.saveHttp();
                            } else if (totalNum > this.formValidate.productionQty) {
                                this.publicPromptStatus = true;
                                this.promptMsg = `交货数量(${totalNum})大于生产数量(${this.formValidate.productionQty}),无法操作!`;
                                this.isNoKept = true;
                            };
                        } else {
                            emptyTips(this, '交货日期应在交货周期范围内!');
                        };
                    } else {
                        this.validateNotNullMethods();
                    };
                });
            },
            deleteIdMethods (arr) {
                arr.forEach((item, index) => { delete item.id; });
                return arr;
            },
            // 获取详情的请求
            getDetailHttp (id) {
                this.globalLoadingShow = true;
                this.$api.order.detailHttp({id: id}).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.getProductToBatchCodeListHttp(responseData.productCode).then(res => {
                            if (res.data.status === 200) {
                                this.remoteBatchCodeList = res.data.res;
                                this.formValidate = {...responseData};
                                this.$set(this.selectMaterialObj, 'id', responseData.productId);// 物料
                                this.$set(this.selectMaterialObj, 'name', responseData.productName);
                                this.$set(this.selectMaterialObj, 'code', responseData.productCode);
                                this.$set(this.selectMaterialObj, 'models', responseData.productModels);
                                this.defaultActiveTabs = '0';
                                this.tableData = this.deleteIdMethods(responseData.orderDeliveryList);
                                this.startTime = responseData.deliveryDateFrom;
                                this.endTime = responseData.deliveryDateTo;
                                this.isQuote = responseData.isQuote;
                                this.limitDate();
                                // 包装要求
                                this.formValidate.packetWeightMin = responseData.orderPackingEntity.packetWeightMin;
                                this.formValidate.packetWeightMax = responseData.orderPackingEntity.packetWeightMax;
                                this.formValidate.packetQty = responseData.orderPackingEntity.packetQty;
                                this.formValidate.packingBag = responseData.orderPackingEntity.packingBag;
                                this.formValidate.bagMouth = responseData.orderPackingEntity.bagMouth;
                                this.formValidate.waistRope = responseData.orderPackingEntity.waistRope;
                                this.formValidate.specialRemarks = responseData.orderPackingEntity.specialRemarks;
                                this.formValidate.packingModeId = responseData.orderPackingEntity.packingModeId;
                                this.formValidate.packingModeName = responseData.orderPackingEntity.packingModeName;
                                this.formValidate.packetQty = responseData.orderPackingEntity.packetQty;
                                this.formValidate.bagMouthId = responseData.orderPackingEntity.bagMouthId;
                                this.formValidate.bagMouthName = responseData.orderPackingEntity.bagMouthName;
                                this.formValidate.waistRopeId = responseData.orderPackingEntity.waistRopeId;
                                this.formValidate.waistRopeName = responseData.orderPackingEntity.waistRopeName;
                                this.formValidate.isCardboard = responseData.orderPackingEntity.isCardboard;
                                this.formValidate.isWord = responseData.orderPackingEntity.isWord;
                                this.formValidate.paperTubeId = responseData.orderPackingEntity.paperTubeId;
                                this.formValidate.paperTubeName = responseData.orderPackingEntity.paperTubeName;
                                this.globalLoadingShow = false;
                            }
                        });
                    };
                });
            },
            // 限制期限
            limitDate () {
                this.startTimeOptions = {
                    disabledDate: date => {
                        if (this.endTime) {
                            let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                            return date && date.valueOf() > endTime;
                        } else {
                            return false;
                        };
                    }
                };
                this.endTimeOptions = {
                    disabledDate: date => {
                        if (this.startTime) {
                            let startTime = this.startTime ? new Date(this.startTime).valueOf() - 86400000 : '';
                            return date && (date.valueOf() < startTime);
                        } else {
                            return false;
                        };
                    }
                };
                // 限制动态的交货日期选择范围
                this.selectOptions = {
                    disabledDate: date => {
                        // 包含当天
                        let startTime = this.startTime ? new Date(this.startTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                        let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                        return date && (date.valueOf() < startTime) || (date.valueOf() > endTime);
                    }
                };
            },
            // 获取订单类型
            getOrderTypeHttp (resolve, reject) {
                return this.$api.dictionary.listHttp({parentCode: 'order_tpye'}).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        if (res.data.res.length > 0) {
                            this.orderTypeList = res.data.res;
                            this.formValidate.typeId = this.orderTypeList[0].id;
                            this.formValidate.typeName = this.orderTypeList[0].name;
                        };
                    };
                }).catch(err => {
                    reject(err);
                });
            },
            // 新增的清空方法
            clearTipsConfirm () {
                this.$route.query.id = undefined;
                Object.assign(this.$data, this.$options.data());
                this.startTimeOptions = {disabledDate (date) { return false; }};
                this.endTimeOptions = {disabledDate (date) { return false; }};
                this.selectOptions = {disabledDate (date) { return false; }};
                setTimeout(() => {
                    _this = this;
                    this.$refs['formValidate'].resetFields();
                    this.globalLoadingShow = true;
                    Promise.all(this.getAllDataHttp()).then(res => {
                        this.globalLoadingShow = false;
                    });
                }, 0);
            },
            /*// 根据开始和结束时间获取区间内的日期
            getAllDate (startTime, endTime) {
                let StartStandardTime = new Date(startTime);
                let endStandardTime = new Date(endTime);
                let bdTime = StartStandardTime.getTime();// 获取时间戳
                let beTime = endStandardTime.getTime();
                let timeDiff = beTime - bdTime;// 获取时间差
                let dateArr = [];
                for (let i = 0; i <= timeDiff; i += 86400000) {
                    let d = new Date(bdTime + i);// 累加一天的时间戳
                    dateArr.push(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate());
                };
                return dateArr;
            },*/
            // 获取默认车间
            getWorkshop (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        let responseData = res.data.res;
                        this.formValidate.workshopId = responseData.defaultDeptId;
                        this.formValidate.workshopName = responseData.defaultDeptName;
                        this.workshopList = responseData.userData;
                    }
                }).catch(error => {
                    reject(error);
                });
            },
            // 获取纱线捻向
            getTwistDirectionListHttp (resolve, reject) {
                return this.$call('dict.list', { parentCode: 'twist_direction' }).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        this.twistDirectionList = res.data.res;
                    };
                });
            },
            // 获取纱线用途
            getPurposeListHttp (resolve, reject) {
                return this.$call('product.purpose.list', {auditState: 3}).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        this.purposeList = res.data.res;
                    };
                });
            },
            // 获取包装方式
            getPackingModeListHttp (resolve, reject) {
                return this.$call('product.packing.mode.list', {auditState: 3}).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        this.packingModeList = res.data.res;
                    };
                });
            },
            // 获取当前登录人的信息
            getUserInfoHttp (resolve, reject) {
                this.$call('user.info').then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        this.$set(this.formValidate, 'plannerId', res.data.res.id);
                        this.$set(this.formValidate, 'plannerName', res.data.res.name);
                    };
                });
            },
            // 订单优先级
            getPriorityListHttp (resolve, reject) {
                return this.$call('dict.list', {parentCode: 'priority_type'}).then(res => {
                    if (res.data.status === 200) {
                        resolve(res);
                        this.formValidate.priorityId = res.data.res[0].id;
                        this.formValidate.priorityName = res.data.res[0].name;
                        this.emergencyStateList = res.data.res;
                    };
                });
            },
            initData () {
                Object.assign(this.$data, this.$options.data());
                this.startTimeOptions = { disabledDate (date) { return false; } };
                this.endTimeOptions = { disabledDate (date) { return false; } };
                this.selectOptions = { disabledDate (date) { return false; } };
                this.globalLoadingShow = true;
                setTimeout(() => {
                    _this = this;
                    this.$refs['formValidate'].resetFields();
                    Promise.all(this.getAllDataHttp()).then(res => {
                        if (this.$route.query.id !== undefined) {
                            this.copyId = this.$route.query.id;
                            this.globalLoadingShow = true;
                            this.getDetailHttp(this.$route.query.id);
                        } else {
                            this.globalLoadingShow = false;
                        };
                    });
                }, 0);
            },
            // 获取封包绳颜色
            getBagMouthListRequest (resolve, reject) {
                return this.$call('pack.color.list', {
                    paramType: 2,
                    auditState: 3
                }).then(res => {
                    if (res.data.status === 200) {
                        this.bagMouthList = res.data.res;
                        resolve(res);
                    };
                });
            },
            // 获取腰绳列表数据
            getWaistRopeListRequest (resolve, reject) {
                return this.$call('pack.color.list', {
                    paramType: 1,
                    auditState: 3
                }).then(res => {
                    if (res.data.status === 200) {
                        this.waistRopeList = res.data.res;
                        resolve(res);
                    };
                });
            },
            // 获取腰绳列表数据
            getPaperTubeListRequest (resolve, reject) {
                return this.$call('dict.list', {
                    parentCode: 'tube_type',
                    code: '01'
                }).then(res => {
                    if (res.data.status === 200) {
                        this.paperTubeList = res.data.res;
                        resolve(res);
                    };
                });
            },
            getAllDataHttp () {
                let workshopList = new Promise((resolve, reject) => { this.getWorkshop(resolve, reject); });
                let materialXSList = new Promise((resolve, reject) => { this.getXSMaterialHttp(resolve, reject); });
                let userList = new Promise((resolve, reject) => { this.getUserListHttp(resolve, reject); });
                let orderTypeList = new Promise((resolve, reject) => { this.getOrderTypeHttp(resolve, reject); });
                let twistDirectionList = new Promise((resolve, reject) => { this.getTwistDirectionListHttp(resolve, reject); });
                let purposeList = new Promise((resolve, reject) => { this.getPurposeListHttp(resolve, reject); });
                let packingModeList = new Promise((resolve, reject) => { this.getPackingModeListHttp(resolve, reject); });
                let userMessage = new Promise((resolve, reject) => { this.getUserInfoHttp(resolve, reject); });
                let priorityList = new Promise((resolve, reject) => { this.getPriorityListHttp(resolve, reject); });
                let materialCategoryList = new Promise((resolve, reject) => { this.getMaterialCategoryList(resolve, reject); });
                let waistRopeList = new Promise((resolve, reject) => { this.getWaistRopeListRequest(resolve, reject); });
                let bagMouthList = new Promise((resolve, reject) => { this.getBagMouthListRequest(resolve, reject); });
                let paperTubeList = new Promise((resolve, reject) => { this.getPaperTubeListRequest(resolve, reject); });
                return [workshopList, materialXSList, twistDirectionList, userList, purposeList, packingModeList, orderTypeList, userMessage, priorityList, materialCategoryList, bagMouthList, waistRopeList, paperTubeList];
            }
        },
        created () {
            _this = this;
            this.globalLoadingShow = true;
            this.toCreated = true;
            this.tableData = JSON.parse(JSON.stringify(this.initTableData));
            Promise.all(this.getAllDataHttp()).then(res => {
                if (this.$route.query.id !== undefined) { // 复制操作
                    this.copyId = this.$route.query.id;
                    this.getDetailHttp(this.copyId);
                } else {
                    this.globalLoadingShow = false;
                };
            });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                this.$refs['formValidate'].resetFields();
                this.initData();
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>


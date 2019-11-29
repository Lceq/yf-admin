<template>
    <div>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row>
            <Col class="leftMenu">
                <Card :dis-hover="true">
                    <Tree :data="treeData" @on-select-change="clickTreeNodeEvent"></Tree>
                </Card>
            </Col>
            <Col class="rightContent content-bar-padding">
                <Card>
                    <Row type="flex" justify="space-between" align="middle">
                        <Col>
                            <Row type="flex" justify="start">
                                <Col class="operatingSpaceMargin">
                                    <Button icon="md-add" type="primary" @click="addClickEvent">新增</Button>
                                </Col>
                                <Col class="operatingSpaceMargin">
                                    <Dropdown class="queryBarMarginLeft" trigger="click" @on-click="getDropReviewEvent">
                                        <Button type="primary">
                                            审核
                                            <Icon type="ios-arrow-down"></Icon>
                                        </Button>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="审核">审核</DropdownItem>
                                            <DropdownItem name="反审核">反审核</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                                <Col class="flex-left">
                                    <Dropdown class="queryBarMarginLeft" trigger="click" @on-click="getDropStateEvent">
                                        <Button type="error">
                                            禁用
                                            <Icon type="ios-arrow-down"></Icon>
                                        </Button>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="禁用">禁用</DropdownItem>
                                            <DropdownItem name="取消禁用">取消禁用</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row type="flex" justify="start">
                                <Col class="queryBarMarginRight operatingSpaceMargin">
                                    <Select clearable v-model="dataSateValue" placeholder="请选择数据状态" class="searchHurdles">
                                        <Option v-for="item in dataSateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="queryBarMarginRight operatingSpaceMargin">
                                    <Select clearable v-model="disableStateValue" class="searchHurdles" placeholder="请选择禁用状态">
                                        <Option v-for="item in disableStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="queryBarMarginRight operatingSpaceMargin">
                                    <Select clearable v-model="queryBarProcess" placeholder="请选择工序" class="searchHurdles">
                                        <Option v-for="item in allProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="operatingSpaceMargin">
                                    <Input v-model="searchName" placeholder="请输入物料编号或名称" class="searchHurdles" @on-enter="searchEnter"/>
                                    <Button icon="ios-search" type="primary" @click="clickSearchEvent">搜索</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row class="marginBottom-10 tableOffsetTop">
                        <Col>
                            <Table size="small" :height="tableHeight" :loading="loadingStatus" border :columns="tableHeader" :data="tableData" @on-selection-change="getCheckTableObjEvent"></Table>
                        </Col>
                    </Row>
                    <Row class="pageHeight">
                        <Col>
                            <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" class="pageStyle" @on-page-size-change="pageSizeChangeEvent"></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="saveModalState" :title="saveModalTitle" @on-visible-change="saveModalChangeEvent" :mask-closable="false" :width="800">
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="124" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col span="18">
                        <FormItem label="物料分类：" prop="materialType" class="formItemMargin">
                            <Cascader :clearable="false" :data="materialTypeList" v-model="formValidate.materialType" :disabled="disabledType" @on-change="getMaterialTypeEvent" placeholder="请选择物料类别"></Cascader>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="物料编码：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.code" disabled placeholder="自动生成物料编码" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="物料名称：" prop="name" class="formItemMargin">
                            <Input type="text" v-model="formValidate.name" placeholder="请输入物料名称" class="inputLength"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <div v-show="requiredModels">
                            <FormItem v-if="requiredModels" label="规格型号：" prop="models" class="formItemMargin">
                                <Input type="text" v-model="formValidate.models" placeholder="请输入规格型号" class="inputLength"/>
                            </FormItem>
                        </div>
                        <div v-show="!requiredModels">
                            <FormItem v-if="!requiredModels" label="规格型号：" class="formItemMargin">
                                <Input type="text" v-model="formValidate.models" placeholder="请输入规格型号" class="inputLength"/>
                            </FormItem>
                        </div>
                    </Col>
                    <Col span="12" v-show="showColor">
                        <FormItem v-if="showColor" label="色号：" class="formItemMargin">
                            <Select v-if="showColor" v-model="formValidate.colorId" placeholder="请选择色号" class="inputLength" @on-change="getColorEvent">
                                <Option v-for="item in colorList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="计量单位：" prop="unitId" class="formItemMargin">
                            <Select v-model="formValidate.unitId" placeholder="请选择计量单位" class="inputLength" @on-change="getUnitEvent">
                                <Option v-for="item in materialUnitList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12" v-show="showBarCode">
                        <FormItem v-if="showBarCode" label="条码：" class="formItemMargin">
                            <Input v-if="showBarCode" type="text" v-model="formValidate.barCode" placeholder="请输入条码" class="inputLength"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="存货类型：" class="formItemMargin">
                            <div class="inputLength exhibitionInputBackground">{{ formValidate.typeName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="12" v-show="showMachiningProcess">
                        <FormItem label="生产工序：" class="formItemMargin" prop="processId" v-if="showMachiningProcess">
                            <Select v-if="showMachiningProcess" v-model="formValidate.processId" placeholder="请选择生产工序" class="inputLength" @on-change="getWorkProcessEvent">
                                <Option v-for="item in workingProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col >
                        <FormItem label="批号管理：" prop="enableBatch" class="formItemMargin">
                            <Checkbox v-model="formValidate.enableBatch">启用</Checkbox>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="tabsActive">
                    <TabPane label="基本信息" name="0">
                        <Row type="flex" justify="space-between">
                            <Col v-show="showBasicTabMaterial">
                                <FormItem label="原料成分：" prop="componentId" class="formItemMargin" v-if="showBasicTabMaterial">
                                    <Select v-model="formValidate.componentId" class="inputLength" v-if="showBasicTabMaterial" placeholder="请选择原料成分">
                                        <Option v-for="item in basicTabMaterialList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col v-show="showBasicTabCount">
                                <FormItem label="支数：" prop="yarnCount" class="formItemMargin" v-if="showBasicTabCount">
                                    <InputNumber v-if="showBasicTabCount" :min="1" v-model="formValidate.yarnCount" class="inputLength"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col v-show="showBasicTabYarnUse">
                                <FormItem label="纱线用途：" prop="purposeId" class="formItemMargin" v-if="showBasicTabYarnUse">
                                    <Select v-model="formValidate.purposeId" class="inputLength" v-if="showBasicTabYarnUse" placeholder="请选择纱线用途">
                                        <Option v-for="item in basicTabYarnUseList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12" v-show="showBasicTabSpinningProcess">
                                <FormItem label="纺纱工艺：" prop="technologyId" class="formItemMargin" v-if="showBasicTabSpinningProcess">
                                    <Select v-model="formValidate.technologyId" class="inputLength" v-if="showBasicTabSpinningProcess" placeholder="请选择纺纱工艺">
                                        <Option v-for="item in basicTabSpinningProcessList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12" v-show="showBasicTabMaterialRatio">
                                <FormItem label="配比：" prop="materialRatio" class="formItemMargin" v-if="showBasicTabMaterialRatio">
                                    <Input v-show="showBasicTabMaterialRatio" v-model="formValidate.materialRatio" placeholder="请输入配比" class="inputLength"/>
                                </FormItem>
                            </Col>
                            <Col span="12" v-show="showBasicTabYarnCountMax">
                                <Row>
                                    <Col span="15" v-show="showBasicTabYarnCountMax">
                                        <FormItem label="细纱支数范围： " prop="yarnCountMin" class="formItemMargin" v-if="showBasicTabYarnCountMax">
                                            <InputNumber v-model="formValidate.yarnCountMin"  v-if="showBasicTabYarnCountMin" :min="1" class="widthPercentage" placeholder="支数下限" @on-blur="getYarnMinEvent"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col span="9" v-show="showBasicTabYarnCountMax">
                                        <FormItem :label-width="10" label="" prop="yarnCountMax" class="formItemMargin" v-if="showBasicTabYarnCountMax">
                                            <InputNumber v-model="formValidate.yarnCountMax" v-if="showBasicTabYarnCountMax" :min="1" class="widthPercentage" placeholder="支数上限" @on-blur="getYarnMaxEvent"></InputNumber>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col v-show="showBasicTabSupplier">
                                <FormItem label="供应商：" class="formItemMargin" v-if="showBasicTabSupplier">
                                    <Select transfer v-if="showBasicTabSupplier" v-model="formValidate.supplierId" class="inputLength" placeholder="请选择供应商">
                                        <Option v-for="item in basicTabSupplierList" :value="item.id" :key="item.id">{{ item.shortName }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col v-if="showPacketWeight">
                                <div v-show="requiredPacketWeight">
                                    <FormItem v-if="requiredPacketWeight" label="平均包重(KG)：" class="formItemMargin" prop="packetWeight">
                                        <InputNumber v-model="formValidate.packetWeight" class="inputLength" :min="0"></InputNumber>
                                    </FormItem>
                                </div>
                                <div v-show="!requiredPacketWeight">
                                    <FormItem v-if="!requiredPacketWeight" label="平均包重(KG)：" class="formItemMargin">
                                        <InputNumber v-model="formValidate.packetWeight" class="inputLength" :min="0"></InputNumber>
                                    </FormItem>
                                </div>
                            </Col>
                        </Row>
                        <Row v-show="showBasicTabCore">
                            <Col span="12">
                                <FormItem label="是否包芯：" class="formItemMargin" v-if="showBasicTabCore">
                                    <RadioGroup v-model="formValidate.isCovering" v-if="showBasicTabCore">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-show="showBasicTabSlubYarn">
                            <Col span="12">
                                <FormItem label="是否竹节纱：" class="formItemMargin" v-if="showBasicTabSlubYarn">
                                    <RadioGroup v-model="formValidate.isSlub" v-if="showBasicTabSlubYarn">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between" v-if="showBasicTabMachineModel">
                            <Col span="12">
                                <FormItem label="适用工序：" class="formItemMargin">
                                    <Select clearable v-model="formValidate.basicTabProcessIpt" class="inputLength" @on-change="getProcessEvent" placeholder="请选择适用工序">
                                        <Option v-for="item in applyProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="适用设备机型：" class="formItemMargin">
                                    <Select clearable v-model="formValidate.machineModelId" @on-change="getEquipmentModel" class="inputLength" placeholder="请选择适用设备机型">
                                        <Option v-for="item in equipmentModelList" :value="item.id" :key="item.name">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col v-if="showBasicTabGramWeight" span="12">
                                <FormItem label="标准克重：" class="formItemMargin">
                                    <InputNumber v-model="formValidate.gramWeight" v-if="showBasicTabGramWeight" :min="0" class="widthPercentage" placeholder="请输入标准克重"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col v-if="showBasicTabMeters" span="12">
                                <FormItem label="标准米长：" class="formItemMargin">
                                    <InputNumber v-model="formValidate.meters" v-if="showBasicTabMeters" :min="0" class="widthPercentage" placeholder="请输入标准米长"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col v-show="showBasicTabTwist" span="12">
                                <FormItem label="捻度：" class="formItemMargin" prop="twist" v-if="showBasicTabTwist">
                                    <InputNumber v-model="formValidate.twist" v-if="showBasicTabTwist" :min="0" class="widthPercentage" placeholder="请输入捻度"></InputNumber>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="12" v-if="showBasicTabIsReused">
                                <FormItem label="是否回用：" class="formItemMargin">
                                    <Checkbox v-model="formValidate.isReused">是</Checkbox>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="物料描述:" class="formItemMargin">
                                    <Input v-model="formValidate.remark" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入..." :maxlength="100"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="物料图片:" class="formItemMargin">
                                    <div class="demo-upload-list" v-for="item in uploadList">
                                        <template v-if="item.status === 'finished'">
                                            <img :src="item.url" style="width: 58px;height: 58px;">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                                <Icon v-show="showUpload" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                        </template>
                                    </div>
                                    <Upload
                                            ref="upload"
                                            :headers="uploadHeader"
                                            :show-upload-list="false"
                                            :default-file-list="defaultList"
                                            :on-success="handleSuccess"
                                            :format="['jpg','jpeg','png']"
                                            :max-size="2048"
                                            :on-format-error="handleFormatError"
                                            :on-exceeded-size="handleMaxSize"
                                            :before-upload="handleBeforeUpload"
                                            multiple
                                            v-show="showUpload"
                                            type="drag"
                                            :action="uploadRequestUrl"
                                            class="upload-bar">
                                        <div class="upload-icon">
                                            <Icon type="ios-camera" size="20"></Icon>
                                        </div>
                                    </Upload>
                                </FormItem>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="辅助属性" name="1">
                        <Row>
                            <Col span="24">
                                <Table size="small" height="350" border :columns="attrTableHeader" :data="attrTableData"></Table>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="otherInformation" :disabled="disableTabs" v-if="!disableTabs">
                        <modal-operation-log :operationData="operationData"></modal-operation-log>
                    </TabPane>
                </Tabs>
            </Form>
            <div slot="footer" class="modal-footer-style">
                <modal-footer
                        :isDisableConfirm="isDisableConfirm"
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <tips-modal
                :v-model="deleteTipsModalState"
                :tipMsg="deleteTipsModalMsg"
                :loading="deleteButtonLoading"
                @cancel="deleteTipsModalCancel"
                @confirm="deleteTipsModalConfirm"
        >
        </tips-modal>
        <Modal title="预览" v-model="visible" style="z-index: 99;">
            <img :src="uploadUrl" v-if="visible" style="width: 100%">
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import { getOperationData, noticeTips, setPage, clearSpace, compClientHeight, defaultImgPath, translateState, emptyTips } from '../../libs/common';
    import tipsModal from '../public/deleteWarning';
    import Cookies from 'js-cookie';
    import modalContentLoading from '../components/modal-content-loading';
    import modalFooter from '../components/modal-footer';
    import modalOperationLog from '../components/modal-operation-log';
    import mixins from './erp-product/product-mixins';
    export default {
        name: 'material-archives',
        mixins: [mixins],
        components: { tipsModal, modalContentLoading, modalFooter, modalOperationLog },
        data () {
            const validateType = (rule, value, callback) => { value && value.length !== 0 ? callback() : callback(new Error()); };
            const validateMaterial = (rule, value, callback) => { this.formValidate.componentId ? callback() : callback(new Error()); };
            const validateYarnUse = (rule, value, callback) => { this.formValidate.purposeId ? callback() : callback(new Error()); };
            const validateSpinningProcess = (rule, value, callback) => { this.formValidate.technologyId ? callback() : callback(new Error()); };
            const validateSupplier = (rule, value, callback) => { this.formValidate.supplierId ? callback() : callback(new Error()); };
            const validateMaterialRatio = (rule, value, callback) => { this.formValidate.materialRatio ? callback() : callback(new Error()); };
            const validateUnit = (rule, value, callback) => { this.formValidate.unitId ? callback() : callback(new Error()); };
            const validateMachiningProcess = (rule, value, callback) => { this.formValidate.processId ? callback() : callback(new Error()); };
            const validatePacketWeight = (rule, value, callback) => { this.formValidate.packetWeight || this.formValidate.packetWeight === 0 ? callback() : callback(new Error()); };
            const validateYarnCountMax = (rule, value, callback) => { this.formValidate.yarnCountMax || this.formValidate.yarnCountMax === 0 ? callback() : callback(new Error()); };
            const validateYarnCountMin = (rule, value, callback) => { this.formValidate.yarnCountMin || this.formValidate.yarnCountMin === 0 ? callback() : callback(new Error()); };
            const validateYarnCount = (rule, value, callback) => { this.formValidate.yarnCount ? callback() : callback(new Error()); };
            const validateTwist = (rule, value, callback) => { this.formValidate.twist ? callback() : callback(new Error()); };
            return {
                showBarCode: false,
                showColor: false,
                requiredPacketWeight: false,
                requiredModels: true,
                globalLoadingShow: false,
                uploadRequestUrl: process.env.REQUEST_HOST + '/image/upload',
                operationData: [],
                uploadHeader: { 'auth-token': Cookies.get('token') },
                spinShow: false,
                formValidate: {
                    unitId: null,
                    unitCode: '',
                    unitName: '',
                    yarnCount: null,
                    yarnCountMin: null,
                    yarnCountMax: null,
                    basicTabProcessIpt: null,
                    machineModelId: null,
                    materialType: [],
                    code: '',
                    name: '',
                    models: '',
                    enableBatch: false,
                    remark: '',
                    picture: '',
                    componentId: null,
                    purposeId: '',
                    technologyId: '',
                    materialRatio: '',
                    supplierId: null,
                    isReused: false,
                    packetWeight: 0,
                    barCode: '',
                    categoryId: null,
                    categoryName: '',
                    typeId: null,
                    typeName: '',
                    colorId: null,
                    colorCode: '',
                    colorName: '',
                    processId: null,
                    processCode: '',
                    processName: '',
                    isCovering: 'true',
                    isSlub: 'true',
                    twist: 0,
                    gramWeight: 0,
                    meters: 0
                },
                ruleValidate: {
                    yarnCount: [{ required: true, validator: validateYarnCount, trigger: 'change' }],
                    yarnCountMin: [{ required: true, validator: validateYarnCountMin, trigger: 'change' }],
                    yarnCountMax: [{ required: true, validator: validateYarnCountMax, trigger: 'change' }],
                    packetWeight: [{ required: true, validator: validatePacketWeight, trigger: 'change' }],
                    materialType: [{ required: true, validator: validateType, trigger: 'change' }],
                    name: [{ required: true, trigger: 'change' }],
                    models: [{ required: true, trigger: 'change' }],
                    unitId: [{ required: true, validator: validateUnit, trigger: 'change' }],
                    componentId: [{ required: true, validator: validateMaterial, trigger: 'change' }],
                    purposeId: [{ required: true, validator: validateYarnUse, trigger: 'change' }],
                    technologyId: [{ required: true, validator: validateSpinningProcess, trigger: 'change' }],
                    materialRatio: [{ required: true, validator: validateMaterialRatio, trigger: 'change' }],
                    supplierId: [{ required: true, validator: validateSupplier, trigger: 'change' }],
                    processId: [{ required: true, validator: validateMachiningProcess, trigger: 'change' }],
                    twist: [{ required: true, validator: validateTwist, trigger: 'change' }]
                },
                defaultList: [{'name': 'a42', 'url': defaultImgPath}],
                colorList: [],
                visible: false,
                uploadUrl: defaultImgPath,
                uploadList: [],
                basicTabSupplierList: [],
                basicTabSpinningProcessList: [],
                basicTabYarnUseList: [],
                basicTabMaterialList: [],
                tabsActive: '0',
                pageHeights: null,
                tableHeight: document.documentElement.clientHeight - 250,
                isDisableConfirm: false,
                showUpload: true,
                selectTypeId: '',
                selectTypeName: '',
                selectModelId: '',
                selectModelName: '',
                showMachiningProcess: false,
                showBasicTabMaterial: false,
                showBasicTabYarnUse: false,
                showBasicTabMachineModel: false,
                showBasicTabIsReused: false,
                showPacketWeight: false,
                showBasicTabSpinningProcess: false,
                showBasicTabCount: false,
                showBasicTabCore: false,
                showBasicTabSlubYarn: false,
                showBasicTabMaterialRatio: false,
                showBasicTabYarnCountMax: false,
                showBasicTabYarnCountMin: false,
                showBasicTabSupplier: false,
                showBasicTabGramWeight: false,
                showBasicTabMeters: false,
                showBasicTabTwist: false,
                allProcessList: [],
                applyProcessList: [],
                workingProcessList: [],
                queryBarProcess: null,
                equipmentModelList: [],
                deleteButtonLoading: false,
                disableTabs: true,
                buttonLoading: false,
                codeDisable: false,
                materialUnitList: [],
                disabledType: false,
                materialTypeList: [],
                saveModalTitle: '',
                saveModalState: false,
                dataSateValue: '',
                dataSateList: [],
                disableStateValue: '',
                disableStateList: [],
                tableHeader: [
                    {type: 'selection', width: 60, align: 'center', fixed: 'left', minWidth: 68},
                    {title: '物料编码',
                        key: 'code',
                        sortable: true,
                        fixed: 'left',
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {innerHTML: params.row.code},
                                    on: {
                                        click: () => {
                                            this.editMaterialEvent(params.row.id, params.index, params.row);
                                        }
                                    }
                                })
                            ]);
                        }},
                    {title: '物料名称', key: 'name', sortable: true, align: 'left', fixed: 'left', minWidth: 150},
                    {title: '生产工序', key: 'processName', sortable: true, align: 'center', fixed: 'left', minWidth: 100},
                    {title: '原料成分', align: 'left', key: 'componentName', sortable: true, minWidth: 100},
                    {title: '支数', align: 'right', key: 'yarnCount', sortable: true, minWidth: 100},
                    {title: '捻度', align: 'right', key: 'twist', sortable: true, minWidth: 100},
                    {title: '纱线用途', align: 'left', key: 'purposeName', sortable: true, minWidth: 100},
                    {title: '计量单位',
                        align: 'left',
                        key: 'unitName',
                        sortable: true,
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: `${params.row.unitName}(${params.row.unitCode})`
                                }
                            });
                        }},
                    {title: '物料分类', align: 'left', key: 'categoryName', sortable: true, minWidth: 110},
                    {title: '图片',
                        align: 'center',
                        key: 'picUrl',
                        sortable: true,
                        width: 90,
                        render: (h, params) => {
                            if (params.row.picUrl !== '') {
                                return h('div', [
                                    h('img', {
                                        style: {width: '30px', height: '30px', marginTop: '4px'},
                                        domProps: {src: params.row.picUrl}
                                    })
                                ]);
                            };
                        }
                    },
                    {title: '数据状态', align: 'center', key: 'auditStateName', sortable: true, minWidth: 100},
                    {title: '禁用状态', align: 'center', key: 'enableStateName', sortable: true, minWidth: 110},
                    {title: '操作',
                        key: 'action',
                        width: 90,
                        align: 'center',
                        render: (h, params) => {
                            let disableDelete = false;
                            params.row.auditState !== 3 ? disableDelete = false : disableDelete = true;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        disabled: disableDelete
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteClick(params.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [],
                searchName: '',
                treeData: [],
                attrTableHeader: [
                    {title: '序号', type: 'index', align: 'center', width: 80},
                    {title: '名称', key: 'name', align: 'center'},
                    {
                        title: '属性值',
                        key: 'values',
                        width: 250,
                        render: (h, params) => {
                            return h('Select', {
                                props: {
                                    transfer: true,
                                    value: params.row.productPropertyValueName ? params.row.productPropertyValueName : ''
                                },
                                on: {
                                    'on-change': (event) => {
                                        // 获取新增栏的表格select选中的name
                                        this.getAddTableSelect(event, params.index, params.row);
                                    }
                                }
                            }, params.row.values.map((item) => {
                                return h('Option', {
                                    props: {
                                        value: item.value,
                                        label: item.label
                                    }
                                });
                            }));
                        }
                    }
                ],
                attrTableData: [],
                selectTreeArr: [],
                treeObj: [],
                selectSaveModalMaterialTypeArr: [],
                selectValues: [],
                pageSize: setPage.pageSize,
                pageTotal: 0,
                checkTableObj: [],
                deleteTipsModalState: false,
                deleteTipsModalMsg: '',
                pageOpts: setPage.pageOpts,
                editProperties: [],
                editId: '',
                pageIndex: 1,
                loadingStatus: false,
                deleteId: '',
                attrContain: []
            };
        },
        methods: {
            getYarnMaxEvent (e) {
                if (this.formValidate.yarnCountMin > this.formValidate.yarnCountMax) {
                    emptyTips(this, '支数上限不能小于支数下限!');
                };
            },
            getYarnMinEvent (e) {
                if (this.formValidate.yarnCountMin > this.formValidate.yarnCountMax) {
                    emptyTips(this, '支数下限不能大于支数上限!');
                };
            },
            // 获取色号
            getColorEvent (e) {
                if (e) {
                    this.colorList.forEach((item) => {
                        if (item.id === parseFloat(e)) {
                            this.formValidate.colorId = item.id;
                            this.formValidate.colorName = item.name;
                            this.formValidate.colorCode = item.code;
                        };
                    });
                };
            },
            // 获取计量单位
            getUnitEvent (e) {
                if (e) {
                    this.materialUnitList.forEach((item) => {
                        if (item.id === e) {
                            this.formValidate.unitId = item.id;
                            this.formValidate.unitCode = item.code;
                            this.formValidate.unitName = item.name;
                        };
                    });
                };
            },
            // 获取加工工序事件
            getWorkProcessEvent (e) {
                if (e) {
                    this.workingProcessList.forEach((item) => {
                        if (item.id === e) {
                            this.formValidate.processId = item.id;
                            this.formValidate.processCode = item.code;
                            this.formValidate.processName = item.name;
                            this.showTabsIpt(this.formValidate.typeName);
                            this.formValidate.technologyId = null;
                        };
                    });
                };
            },
            handleView (name) {
                this.visible = true;
            },
            // 选择适用工序
            getProcessEvent (e) {
                this.equipmentModelList = [];
                this.formValidate.machineModelId = null;
                if (e) {
                    this.getModelListHttp(e);// 获取机型
                    this.$set(this.formValidate, 'gramWeight', 0);
                    this.$set(this.formValidate, 'meters', 0);
                    this.$set(this.formValidate, 'twist', 0);
                    this.applyProcessList.forEach(item => {
                        if (item.id === e) this.byWorkProcessShowBasic(item.name);
                    });
                } else {
                    this.$set(this.formValidate, 'gramWeight', 0);
                    this.$set(this.formValidate, 'meters', 0);
                    this.$set(this.formValidate, 'twist', 0);
                    this.byWorkProcessShowBasic('');
                };
            },
            getModelListHttp (id) {
                this.$api.model.listHttp({processId: id}).then(res => {
                    if (res.data.status === 200) this.equipmentModelList = res.data.res;
                });
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.uploadList.splice(fileList.indexOf(file), 1);
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                if (res.status === 4001) {
                    this.$store.dispatch({
                        type: 'showErrorModal',
                        payload: {
                            message: res.message,
                            status: res.status
                        }
                    });
                } else if (res.status === 200) {
                    this.uploadUrl = res.res.absUrl;
                    this.$set(this.$refs.upload.fileList[0], 'url', res.res.absUrl);
                    this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                    this.$set(this.uploadList[0], 'url', res.res.absUrl);
                    this.$set(this.uploadList[0], 'status', 'finished');
                };
            },
            // 获取新增栏内选中的适用设备机型
            getEquipmentModel (e) {
                this.formValidate.machineModelId = e;
            },
            // 删除的方法
            deleteClick (id) {
                this.deleteId = id;
                this.deleteTipsModalState = true;
                this.deleteTipsModalMsg = '确认删除？';
            },
            // 筛选栏的搜索请求
            getListHttp () {
                this.loadingStatus = true;
                this.searchName = clearSpace(this.searchName);
                this.dataSateValue = this.dataSateValue || '';
                this.$api.product.getProductList({
                    categoryId: this.selectTreeArr && this.selectTreeArr.length !== 0 ? this.selectTreeArr[0].id : null,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    enableState: this.disableStateValue,
                    name: this.searchName,
                    processId: this.queryBarProcess,
                    auditState: this.dataSateValue
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.loadingStatus = false;
                        this.tableData = translateState(res.data.res);
                        this.pageTotal = res.data.count;
                    };
                });
            },
            // 获取选中的审核状态
            getDropReviewEvent (e) {
                if (this.checkTableObj && this.checkTableObj.length !== 0) {
                    let ids = [];
                    let switchState = true;
                    if (e === '审核') {
                        this.checkTableObj.forEach((item) => {
                            parseFloat(item.auditState) === 2 ? ids.push(item.id) : switchState = false;
                        });
                        if (switchState) {
                            this.auditHttp(ids);
                        } else {
                            emptyTips(this, '只有状态为"待审核"的才可以审核!');
                        };
                    } else if (e === '反审核') {
                        this.checkTableObj.forEach((item) => {
                            parseFloat(item.auditState) === 3 ? ids.push(item.id) : switchState = false;
                        });
                        if (switchState) {
                            this.unAuditHttp(ids);
                        } else {
                            emptyTips(this, '只有状态为"审核"的才可以反审核!');
                        };
                    };
                } else if (this.checkTableObj.length === 0) {
                    noticeTips(this, 'unCheckTips');
                };
            },
            unAuditHttp (ids) {
                this.$api.product.productUnapproveHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unAuditTips');
                        this.getListHttp();
                        this.checkTableObj = [];
                    };
                });
            },
            auditHttp (ids) {
                this.$api.product.productApproveHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'auditTips');
                        this.getListHttp();
                        this.checkTableObj = [];
                    };
                });
            },
            // 获取操作栏选中的禁用状态
            getDropStateEvent (e) {
                if (this.checkTableObj && this.checkTableObj.length !== 0) {
                    let ids = [];
                    let switchState = true;
                    if (e === '禁用') {
                        this.checkTableObj.forEach((items) => {
                            parseFloat(items.auditState) === 3 ? ids.push(items.id) : switchState = false;
                        });
                        if (switchState) {
                            this.disableHttp(ids);
                        } else {
                            emptyTips(this, '已"审核"的情况下才可以禁用!');
                        };
                    } else if (e === '取消禁用') {
                        this.checkTableObj.forEach((items) => {
                            parseFloat(items.enableState) === 0 ? ids.push(items.id) : switchState = false;
                        });
                        if (switchState) {
                            this.enableHttp(ids);
                        } else {
                            emptyTips(this, '已"禁用"的情况下才可以取消禁用!');
                        };
                    };
                } else if (this.checkTableObj.length === 0) {
                    noticeTips(this, 'unCheckTips');
                };
            },
            enableHttp (ids) {
                this.$api.product.productEnableHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'enableTips');
                        this.getListHttp();
                        this.checkTableObj = [];
                    };
                });
            },
            disableHttp (ids) {
                this.$api.product.productDisableHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'disableTips');
                        this.getListHttp();
                        this.checkTableObj = [];
                    };
                });
            },
            // 删除modal的确认事件
            deleteTipsModalConfirm () {
                this.deleteButtonLoading = true;
                this.$api.product.productDeleteHttp([this.deleteId]).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteTipsModalState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        noticeTips(this, 'deleteTips');
                        this.checkTableObj = [];
                    } else if (res.data.status === 415) {
                        this.deleteTipsModalState = false;
                        this.deleteButtonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteTipsModalCancel () {
                this.deleteTipsModalState = false;
                this.deleteButtonLoading = false;
            },
            // 获取勾选的对象
            getCheckTableObjEvent (e) {
                this.checkTableObj = e;
            },
            // 获取新增栏内表格的select选中的对象及values
            getAddTableSelect (name, selectIndex, obj) {
                this.attrTableData.forEach((items, index) => {
                    if (index === selectIndex) {
                        items.values.forEach((vls) => {
                            if (vls.name === name) this.selectValues.push(vls);
                        });
                    };
                });
            },
            // 初始化基本信息的数据
            initBasicData () {
                this.formValidate.processId = '';
                this.formValidate.processCode = '';
                this.formValidate.processName = '';
                this.formValidate.isCovering = 'true';
                this.formValidate.isSlub = 'true';
                this.formValidate.technologyId = null;
                this.formValidate.materialRatio = '';
                this.formValidate.yarnCountMin = null;
                this.formValidate.yarnCountMax = null;
                this.formValidate.colorId = null;
                this.formValidate.colorCode = '';
                this.formValidate.colorName = '';
                this.formValidate.barCode = '';
                this.formValidate.packetWeight = null;
                this.formValidate.models = '';

                this.formValidate.componentId = null;
                this.formValidate.yarnCount = null;
                this.formValidate.purposeId = '';
                this.formValidate.technologyId = '';
                this.formValidate.materialRatio = '';
                this.formValidate.yarnCountMax = null;
                this.formValidate.yarnCountMin = null;
                this.formValidate.supplierId = null;
                this.formValidate.machineModelId = null;
                this.formValidate.basicTabProcessIpt = null;
                this.formValidate.isReused = true;
                this.formValidate.packetWeight = 0;
                this.$set(this.formValidate, 'gramWeight', 0);
                this.$set(this.formValidate, 'meters', 0);
                this.$set(this.formValidate, 'twist', 0);
            },
            // 获取选择的物料类别对象
            getMaterialTypeEvent (value, selectedData) {
                this.initBasicData();
                this.$set(this.formValidate, 'typeId', selectedData[selectedData.length - 1].typeId);
                this.$set(this.formValidate, 'typeName', selectedData[selectedData.length - 1].typeName);
                this.$set(this.formValidate, 'categoryId', selectedData[selectedData.length - 1].id);
                this.$set(this.formValidate, 'categoryName', selectedData[selectedData.length - 1].name);
                this.selectSaveModalMaterialTypeArr = [];
                this.selectSaveModalMaterialTypeArr.push(selectedData[selectedData.length - 1]);
                this.formValidate.enableBatch = this.selectSaveModalMaterialTypeArr[0].enableBatch;
                this.selectValues = [];
                // 获取物料属性的数据
                this.getAddAttrTable(this.selectSaveModalMaterialTypeArr[0].id);
                // 根据物料类别展示基本信息
                this.showBasicTabTwist = false;
                this.showBasicTabGramWeight = false;
                this.showBasicTabMeters = false;
                // 存货类型为成品"是否包芯"和"是否竹节纱"为否
                if (this.formValidate.typeName === '成品') {
                    this.formValidate.isCovering = 'false';
                    this.formValidate.isSlub = 'false';
                };
                // 成品时，原料成分默认第一个
                if (selectedData[selectedData.length - 1].typeName === '成品') {
                    this.formValidate.componentId = this.basicTabMaterialList.length !== 0 ? this.basicTabMaterialList[0].id : null;
                } else if (selectedData[selectedData.length - 1].typeName === '半成品') {
                    // 半成品时，原料成分默认第一个, 配比默认100
                    this.formValidate.materialRatio = 100;
                    this.formValidate.componentId = this.basicTabMaterialList.length !== 0 ? this.basicTabMaterialList[0].id : null;
                }
                this.showTabsIpt(selectedData[selectedData.length - 1].typeName);
                this.formValidate.typeName = selectedData[selectedData.length - 1].typeName;
            },
            // 获取每页的数据条数
            pageSizeChangeEvent (e) {
                if (this.treeObj && this.treeObj.length !== 0) {
                    this.pageSize = e;
                    this.pageIndex = 1;
                    this.getListHttp();
                };
            },
            // 获取点击的页
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 监听保存modal状态
            saveModalChangeEvent (e) {
                if (e === false) {
                    this.$refs['formValidate'].resetFields();
                    this.spinShow = false;
                    this.initUpload();
                    this.tabsActive = '0';
                    this.isDisableConfirm = false;
                    this.showUpload = true;
                    this.disableTabs = true;
                    this.saveModalTitle = '';
                    this.disabledType = false;
                    this.codeDisable = false;
                    this.buttonLoading = false;
                    this.selectValues = [];
                    this.attrTableData = [];
                    this.uploadUrl = defaultImgPath;
                    // 根据物料类别展示基本信息
                    this.showMachiningProcess = false;
                    this.showBasicTabMaterial = false;
                    this.showBasicTabYarnUse = false;
                    this.showBasicTabMachineModel = false;
                    this.showBasicTabSpinningProcess = false;
                    this.showBasicTabCount = false;
                    this.showBasicTabCore = false;
                    this.showBasicTabSlubYarn = false;
                    this.showBasicTabMaterialRatio = false;
                    this.showBasicTabYarnCountMax = false;
                    this.showBasicTabYarnCountMin = false;
                    this.showBasicTabSupplier = false;
                    this.showPacketWeight = false;
                    this.showBasicTabIsReused = false;
                    this.treeObj.length !== 0 ? this.showTabsIpt(this.treeObj[0].typeName) : false;
                    Object.assign(this.$data.formValidate, this.$options.data().formValidate);
                } else {
                    // 获取纺纱工艺和纱线用途的数据
                    this.getSpinningYarnUseHttp();
                    this.getSpinningProcessHttp();
                    this.getMaterialCompositionHttp();
                    this.getSupplierHttp();
                    // 根据物料类别展示基本信息
                    if (this.treeObj && this.treeObj.length !== 0) {
                        this.showTabsIpt(this.treeObj[0].typeName);
                    };
                };
            },
            getSupplierHttp () {
                this.$call('product/supplier/list', { 'auditState': 3 }).then(res => {
                    if (res.data.status === 200) this.basicTabSupplierList = res.data.res;
                });
            },
            // 请求新增栏内表格的数据
            getAddAttrTable (id) {
                this.$api.product.productPropertyItemList({categoryId: id}).then((res) => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((items, index) => {
                            if (items.values && items.values.length !== 0) {
                                items.values.forEach((v) => {
                                    v.value = v.name;
                                    v.label = v.name;
                                });
                            } else {
                                items.values = [];
                            };
                        });
                        this.attrTableData = res.data.res;
                        this.attrContain = res.data.res;
                    };
                });
            },
            // 新增的点击事件
            addClickEvent () {
                this.editId = null;
                this.saveModalState = true;
                this.$delete(this.formValidate, 'id');
                this.saveModalTitle = '新增物料档案';
                if (this.treeObj && this.treeObj.length !== 0) {
                    this.disableTabs = true;
                    if (!this.treeObj[0].children) { // 没有子级
                        parseInt(this.treeObj[0].parentId) !== 0 ? this.formValidate.materialType = this.getFatherPath(this.treeObj[0].path, this.treeObj[0].id) : this.formValidate.materialType = [];
                    } else {
                        this.formValidate.materialType = [];
                    };
                    this.formValidate.typeName = this.treeObj[0].typeName;
                    // 获取辅助属性的请求
                    this.getAddAttrTable(this.treeObj[0].id);
                };
            },
            // 获取原料成分
            getMaterialCompositionHttp () {
                this.$api.attr.productComponentList({
                    'codeName': '',
                    'auditState': 3
                }).then(res => {
                    if (res.data.status === 200) this.basicTabMaterialList = res.data.res;
                });
            },
            getSpinningYarnUseHttp () {
                this.$api.attr.productPurposeList({
                    'codeName': '',
                    'auditState': 3
                }).then(res => {
                    if (res.data.status === 200) this.basicTabYarnUseList = res.data.res;
                });
            },
            // 获取纺纱工艺
            getSpinningProcessHttp () {
                this.$api.attr.productTechnologyList({
                    'codeName': '',
                    'auditState': 3
                }).then(res => {
                    if (res.data.status === 200) this.basicTabSpinningProcessList = res.data.res;
                });
            },
            // 新增的请求
            saveRequest (properties) {
                // 存货类型为成品,支数范围=支数（支数范围仍不展示）
                if (this.formValidate.typeName === '成品') {
                    this.formValidate.yarnCountMin = this.formValidate.yarnCount;
                    this.formValidate.yarnCountMax = this.formValidate.yarnCount;
                };
                this.formValidate.name = clearSpace(this.formValidate.name.toUpperCase());
                this.formValidate.models = clearSpace(this.formValidate.models.toUpperCase());
                let param = {...this.formValidate};
                param.properties = properties; // 辅助属性
                param.productAddition = {...this.formValidate};
                this.$delete(param.productAddition, 'id');
                this.$delete(param.productAddition, 'productAddition');
                this.$delete(param.productAddition, 'processName');
                param.productAddition.processId = this.formValidate.basicTabProcessIpt; // 适用工序
                this.$api.product.saveHttp(param).then((res) => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.getListHttp();
                        noticeTips(this, 'saveTips');
                    } else if (res.data.status === 415) {
                        this.saveModalState = false;
                        this.buttonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 保存modal的确认按钮
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        // 修改新增栏内table的subValues
                        this.attrTableData.forEach((items) => {
                            this.selectValues.forEach((values) => {
                                if (items.id === values.productPropertyItemId) {
                                    items.subValues = [];
                                    items.subValues.push(values);
                                };
                            });
                        });
                        // 获取将表格的数据转成对应的数组
                        let properties = [];
                        this.attrTableData.forEach((prop) => {
                            if (prop.subValues) {
                                prop.subValues.forEach((value) => {
                                    properties.push({
                                        productPropertyItemId: prop.id,
                                        productPropertyItemName: prop.name,
                                        productPropertyValueId: value.id,
                                        productPropertyValueName: value.name
                                    });
                                });
                            }
                        });
                        this.saveRequest(properties);
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 保存modal的取消按钮
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            // 搜索的点击事件
            clickSearchEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 搜索的回车事件
            searchEnter () {
                this.pageIndex = 1;
                if (this.treeObj && this.treeObj.length !== 0) {
                    this.getListHttp();
                };
            },
            // 编辑的事件
            editMaterialEvent (id, index, row) {
                this.disableTabs = false;
                this.editId = id;
                row.auditState === 2 ? this.saveModalTitle = '编辑物料档案' : this.saveModalTitle = '物料档案详情';
                this.spinShow = true;
                this.saveModalState = true;
                this.getProcessListHttp().then(res => {
                    this.allProcessList = res;
                    this.workingProcessList = res;
                    this.applyProcessList = res;
                    this.getDetailHttp();
                });
            },
            // 获取详情
            getDetailHttp () {
                this.$api.product.getProductDetail({id: this.editId}).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.formValidate = responseData;
                        this.formValidate.isReused = responseData.productAddition.isReused;
                        this.operationData = getOperationData(responseData);
                        if (responseData.productAddition) {
                            responseData.productAddition.processName ? this.byWorkProcessShowBasic(responseData.productAddition.processName) : false;
                            responseData.productAddition.basicTabProcessIpt = responseData.productAddition.processId;
                            this.$delete(responseData.productAddition, 'id');
                            this.$delete(responseData.productAddition, 'processId');
                            this.$delete(responseData.productAddition, 'processCode');
                            this.$delete(responseData.productAddition, 'processName');
                            responseData.productAddition.isCovering = responseData.productAddition.isCovering + '';
                            responseData.productAddition.isSlub = responseData.productAddition.isSlub + '';
                            this.formValidate = {...this.formValidate, ...responseData.productAddition};
                            if (responseData.productAddition.basicTabProcessIpt) this.getModelListHttp(responseData.productAddition.basicTabProcessIpt);
                        };
                        this.formValidate.materialType = this.getFatherPath(responseData.path, responseData.categoryId);
                        this.uploadUrl = responseData.picUrl;
                        this.$set(this.$refs.upload.fileList[0], 'url', responseData.picUrl);
                        this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                        this.$set(this.uploadList[0], 'url', responseData.picUrl);
                        this.$set(this.uploadList[0], 'status', 'finished');
                        this.showTabsIpt(responseData.typeName);
                        responseData.auditState === 3 ? this.isDisableConfirm = true : this.isDisableConfirm = false; // 判断是否为已审核
                        responseData.auditState === 3 ? this.showUpload = false : this.showUpload = true; // 判断是否为已审核
                        this.codeDisable = true;
                        this.disabledType = true;// 禁用物料类别
                        // 将返回的id和name修正为，属性值的id和name
                        let contain = [];
                        responseData.properties.forEach((attrValue) => {
                            contain.push({
                                id: attrValue.productPropertyValueId,
                                name: attrValue.productPropertyValueName,
                                productPropertyItemId: attrValue.productPropertyItemId
                            });
                        });
                        this.selectValues = contain;
                        let attrProperties = responseData.properties;
                        let categoryId = responseData.categoryId;
                        // 根据物料类别的id获取对应的物料属性
                        this.getMaterialCategoryToAttr(categoryId, attrProperties);
                    };
                });
            },
            getMaterialCategoryToAttr (categoryId, attrProperties) {
                this.$api.attr.productPropertyItemList({categoryId: categoryId}).then((res) => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((items, index) => { // 添加label、value属性
                            if (items.values && items.values.length !== 0) {
                                items.values.forEach((v) => {
                                    v.value = v.name;
                                    v.label = v.name;
                                });
                            } else {
                                items.values = [];
                            };
                        });
                        this.attrContain = res.data.res;
                        attrProperties.forEach((attrPro, index) => { // 匹配,添加label、values属性
                            attrPro.name = attrPro.productPropertyItemName;
                            this.attrContain.forEach((attrCon) => {
                                if (attrCon.id === attrPro.productPropertyItemId) {
                                    attrCon.productPropertyValueName = attrPro.productPropertyValueName;
                                }
                            });
                        });
                        this.attrTableData = this.attrContain;
                        this.spinShow = false;
                    };
                });
            },
            // 获取上级的id
            getFatherPath (str, id) {
                let splitFatherPath = str.split(',');
                let fatherPath = [];
                splitFatherPath.forEach((item) => {
                    if (item !== '') {
                        fatherPath.push(Number(item));
                    };
                });
                fatherPath.push(id);
                return fatherPath;
            },
            // tree的点击事件
            clickTreeNodeEvent (e) {
                this.initBasicData();
                this.selectTreeArr = e;
                this.treeObj = e;
                this.selectSaveModalMaterialTypeArr = e;
                if (this.treeObj && this.treeObj.length !== 0) {
                    this.$set(this.formValidate, 'categoryId', e[0].id);
                    this.$set(this.formValidate, 'categoryName', e[0].name);
                    this.formValidate.enableBatch = this.treeObj[0].enableBatch;
                    this.formValidate.typeName = e[0].typeName;
                    this.$set(this.formValidate, 'typeId', e[0].typeId);
                    this.$set(this.formValidate, 'typeName', e[0].typeName);
                    this.showBasicTabTwist = false;
                    this.showBasicTabGramWeight = false;
                    this.showBasicTabMeters = false;
                    // 成品时，原料成分默认第一个
                    if (e[0].typeName === '成品') {
                        this.formValidate.componentId = this.basicTabMaterialList.length !== 0 ? this.basicTabMaterialList[0].id : null;
                    } else if (e[0].typeName === '半成品') {
                        // 半成品时，原料成分默认第一个, 配比默认100
                        this.formValidate.materialRatio = 100;
                        this.formValidate.componentId = this.basicTabMaterialList.length !== 0 ? this.basicTabMaterialList[0].id : null;
                    };
                    this.showTabsIpt(e[0].typeName);
                    !e[0].children ? this.formValidate.materialType = this.getFatherPath(this.treeObj[0].path, this.treeObj[0].id) : this.formValidate.materialType = [];
                    this.pageIndex = 1;
                    this.pageTotal = 1;
                    this.getListHttp();
                };
            },
            getMaterialCategoryHttp () {
                this.$api.category.getProductCategoryList({auditState: 3}).then((res) => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        let treeAllData = this.toTree(res.data.res);
                        this.$set(treeAllData[0], 'expand', true);
                        this.treeData = treeAllData;
                        this.materialTypeList = treeAllData[0].children;
                        this.treeObj = treeAllData;
                        this.pageTotal = 1;
                        this.getListHttp();
                        this.formValidate.enableBatch = treeAllData[0].children[0].enableBatch;
                    }
                });
            },
            // 获取计量单位
            getUnitListHttp () {
                this.$api.unit.getUnitList({auditState: 3}).then((res) => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((items) => {
                            items.value = items.id;
                            items.label = items.name + '(' + items.code + ')';
                        });
                        this.materialUnitList = res.data.res;
                    };
                });
            },
            // 获取数据状态
            getAuditStateListHttp () {
                this.$api.state.enumAuditState2List().then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((items) => {
                            this.dataSateList.push(items);
                        });
                    };
                });
            },
            // 获取禁用状态
            getDisableHttpList () {
                this.$api.state.enumEnableStateList().then(res => {
                    if (res.data.status === 200) this.disableStateList = res.data.res;
                });
            },
            // 获取工序
            getProcessListHttp () {
                return this.$api.process.getSearchProcessList();
            },
            // 获取颜色列表数据
            getColorListHttp () {
                this.$api.color.getColorList({auditState: 3}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            this.$set(item, 'label', `${item.code}(${item.name})`);
                        });
                        this.colorList = res.data.res;
                    };
                });
            }
        },
        created () {
            this.getColorListHttp();
            this.getProcessListHttp().then(res => {
                this.allProcessList = res;
                this.workingProcessList = res;
                this.applyProcessList = res;
            });
            this.getUnitListHttp();
            this.getAuditStateListHttp();
            this.getDisableHttpList();
            this.getMaterialCategoryHttp();
        },
        mounted () {
            this.globalLoadingShow = true;
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            this.tableHeight = compClientHeight(tableDom.offsetTop + 90 + this.pageHeights);
            window.onresize = () => {
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 150 + this.pageHeights);
            };
            this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>
<style scoped>
    .content-bar-padding{
        padding: 0 0 0 16px;
    }
    .modal-footer-style{
        display: flex;
        justify-content: flex-end;
    }
</style>

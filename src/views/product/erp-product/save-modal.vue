<template>
    <div>
        <Modal
                v-model="showModal"
                title="SAP物料同步"
                @on-visible-change="saveModalChangeEvent"
                :mask-closable="false"
                :width="800"
        >
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
                            <Select v-if="showMachiningProcess" v-model="formValidate.processId" placeholder="请选择生产工序" class="inputLength" @on-change="getMachiningProcessValueEvent">
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
                                <div>
                                    <Table size="small" height="350" border :columns="attrTableHeader" :data="attrTableData"></Table>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="otherInformation" :disabled="disableTabs" v-if="!disableTabs">
                        <modal-operation-log
                                :operationData="operationData"
                        ></modal-operation-log>
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
        <Modal title="预览" v-model="visible" style="z-index: 99;">
            <img :src="formValidate.picUrl" v-if="visible" class="widthPercentage">
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import modalContentLoading from '../../components/modal-content-loading';
    import modalOperationLog from '../../components/modal-operation-log';
    import { clearSpace, setPage, defaultImgPath, noticeTips, emptyTips } from '../../../libs/common';
    import Cookies from 'js-cookie';
    import mixins from './product-mixins';
    export default {
        mixins: [mixins],
        components: {modalFooter, modalContentLoading, modalOperationLog},
        props: {
            saveModalDetailData: {
                type: Object
            },
            saveModalState: {
                type: Boolean,
                default: false
            },
            selectErpModalProcessList: {
                type: Array
            }
        },
        data () {
            const validateType = (rule, value, callback) => { value && value.length !== 0 ? callback() : callback(new Error()); };
            const validateMaterial = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateYarnUse = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateSpinningProcess = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateSupplier = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateMaterialRatio = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateUnit = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateMachiningProcess = (rule, value, callback) => { this.formValidate.processId ? callback() : callback(new Error()); };
            const validatePacketWeight = (rule, value, callback) => { value || value === 0 ? callback() : callback(new Error()); };
            const validateYarnCountMax = (rule, value, callback) => { value || value === 0 ? callback() : callback(new Error()); };
            const validateYarnCountMin = (rule, value, callback) => { value || value === 0 ? callback() : callback(new Error()); };
            const validateYarnCount = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateTwist = (rule, value, callback) => { this.formValidate.twist ? callback() : callback(new Error()); };
            return {
                showBarCode: false,
                showColor: false,
                requiredModels: true,
                requiredPacketWeight: false,
                visible: false,
                defaultList: [{'name': 'a42', 'url': defaultImgPath}],
                uploadHeader: { 'auth-token': Cookies.get('token') },
                showUpload: true,
                uploadList: [],
                tabsActive: '0',
                colorList: [],
                materialUnitList: [],
                selectValues: [],
                basicTabYarnUseList: [],
                basicTabSpinningProcessList: [],
                workingProcessList: [],
                basicTabMaterialList: [],
                basicTabSupplierList: [],
                applyProcessList: [],
                equipmentModelList: [],
                showBasicTabGramWeight: false,
                showBasicTabMeters: false,
                showBasicTabTwist: false,
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
                disableTabs: false,
                operationData: [],
                uploadRequestUrl: process.env.REQUEST_HOST + '/image/upload',
                materialTypeList: [],
                disabledType: false,
                attrTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 80
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center'
                    },
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
                formValidate: {},
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
                buttonLoading: false,
                isDisableConfirm: false,
                showModal: false,
                processId: null
            };
        },
        methods: {
            // 移除图片
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.uploadList.splice(fileList.indexOf(file), 1);
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleView (name) {
                this.visible = true;
            },
            getYarnMinEvent (e) {
                if (this.formValidate.yarnCountMin > this.formValidate.yarnCountMax) {
                    emptyTips(this, '支数下限不能大于支数上限!');
                };
            },
            // 获取颜色列表数据
            getColorListHttp () {
                this.$api.color.getColorList({auditState: 3}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => { this.$set(item, 'label', `${item.code}(${item.name})`); });
                        this.colorList = res.data.res;
                    };
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
            // 获取新增栏内表格的select选中的对象及values
            getAddTableSelect (name, selectIndex, obj) {
                this.attrTableData.forEach((items, index) => {
                    if (index === selectIndex) {
                        items.values.forEach((vls) => {
                            if (vls.name === name) {
                                this.selectValues.push(vls);
                            };
                        });
                    };
                });
            },
            // 获取生产工序事件
            getMachiningProcessValueEvent (e) {
                if (e) {
                    this.workingProcessList.forEach((item) => {
                        if (item.id === parseFloat(e)) {
                            this.formValidate.processId = item.id;
                            this.formValidate.processCode = item.code;
                            this.formValidate.processName = item.name;
                            this.formValidate.technologyId = null;
                            this.showTabsIpt(this.formValidate.typeName);
                        };
                    });
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
                        this.formValidate.enableBatch = treeAllData[0].children[0].enableBatch;
                    }
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
                this.formValidate.componentId = null;
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
                this.formValidate.isCovering = 'true';
                this.formValidate.isSlub = 'true';
                this.formValidate.machineModelId = null;
                this.formValidate.basicTabProcessIpt = null;
                this.formValidate.isReused = true;
                this.formValidate.packetWeight = 0;
                this.$set(this.formValidate, 'gramWeight', 0);
                this.$set(this.formValidate, 'meters', 0);
                this.$set(this.formValidate, 'twist', 0);
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
                    this.formValidate.picUrl = res.res.absUrl;
                    this.$set(this.$refs.upload.fileList[0], 'url', res.res.absUrl);
                    this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                    this.$set(this.uploadList[0], 'url', res.res.absUrl);
                    this.$set(this.uploadList[0], 'status', 'finished');
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
            // 请求新增栏内表格的数据
            getAddAttrTable (id) {
                // 远纺同步的数据id为0代表mes不存在该物料类别
                if (id) {
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
                        };
                    });
                };
            },
            // 获取选择的物料类别对象
            getMaterialTypeEvent (value, selectedData) {
                this.initBasicData();
                this.$set(this.formValidate, 'typeId', selectedData[selectedData.length - 1].typeId);
                this.$set(this.formValidate, 'typeName', selectedData[selectedData.length - 1].typeName);
                this.$set(this.formValidate, 'categoryId', selectedData[selectedData.length - 1].id);
                this.$set(this.formValidate, 'categoryName', selectedData[selectedData.length - 1].name);
                this.formValidate.enableBatch = selectedData[selectedData.length - 1].enableBatch;
                this.selectValues = [];
                // 获取物料属性的数据
                this.getAddAttrTable(selectedData[selectedData.length - 1].id);
                // 存货类型为成品"是否包芯"和"是否竹节纱"为否
                if (this.formValidate.typeName === '成品') {
                    this.formValidate.isCovering = 'false';
                    this.formValidate.isSlub = 'false';
                };
                // 根据物料类别展示基本信息
                this.showTabsIpt(selectedData[selectedData.length - 1].typeName);
                this.formValidate.typeName = selectedData[selectedData.length - 1].typeName;
            },
            // 确认事件
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
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
            // 保存的请求
            saveRequest (properties) {
                // 如果存货类型为成品,支数范围=支数（支数范围仍不展示）
                if (this.formValidate.typeName === '成品') {
                    this.formValidate.yarnCountMin = this.formValidate.yarnCount;
                    this.formValidate.yarnCountMax = this.formValidate.yarnCount;
                };
                this.formValidate.name = clearSpace(this.formValidate.name.toUpperCase());
                this.formValidate.models = clearSpace(this.formValidate.models.toUpperCase());
                this.buttonLoading = true;
                let param = {...this.formValidate};
                param.properties = properties; // 辅助属性
                param.productAddition = {...this.formValidate};
                this.$delete(param, 'id');
                this.$delete(param.productAddition, 'id');
                this.$delete(param.productAddition, 'productAddition');
                this.$delete(param.productAddition, 'processCode');
                this.$delete(param.productAddition, 'processName');
                param.productAddition.processId = this.formValidate.basicTabProcessIpt; // 适用工序
                this.$api.product.saveHttp(param).then((res) => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                        noticeTips(this, 'saveTips');
                        this.buttonLoading = false;
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 取消事件
            saveModalCancelEvent (e, index) {
                this.$emit('on-cancel');
            },
            getYarnMaxEvent (e) {
                if (this.formValidate.yarnCountMin > this.formValidate.yarnCountMax) {
                    emptyTips(this, '支数上限不能小于支数下限!');
                };
            },
            saveModalChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (!e) {
                    this.tabsActive = '0';
                    this.attrTableData = [];
                    this.formValidate = {};
                    this.initUpload();
                    this.showTabsIpt();
                };
            },
            // 获取工序
            getProcessListHttp () {
                return this.$api.process.getSearchProcessList();
            },
            // 获取原料成分
            getMaterialCompositionHttp () {
                this.$api.attr.productComponentList({'codeName': '', 'auditState': 3}).then(res => {
                    if (res.data.status === 200) {
                        this.basicTabMaterialList = res.data.res;
                    };
                });
            },
            // 获取纺纱工艺
            getSpinningProcessHttp () {
                this.$api.attr.productTechnologyList({'codeName': '', 'auditState': 3}).then(res => {
                    if (res.data.status === 200) {
                        this.basicTabSpinningProcessList = res.data.res;
                    };
                });
            },
            getSpinningYarnUseHttp () {
                this.$api.attr.productPurposeList({'codeName': '', 'auditState': 3}).then(res => {
                    if (res.data.status === 200) {
                        this.basicTabYarnUseList = res.data.res;
                    };
                });
            },
            getSupplierHttp () {
                this.$call('product/supplier/list', { 'auditState': 3 }).then(res => {
                    if (res.data.status === 200) {
                        this.basicTabSupplierList = res.data.res;
                    };
                });
            },
            // 获取新增栏内选中的适用设备机型
            getEquipmentModel (e) {
                this.formValidate.machineModelId = e;
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
                        if (item.id === e) {
                            this.byWorkProcessShowBasic(item.name);
                        };
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
                    if (res.data.status === 200) { this.equipmentModelList = res.data.res; };
                });
            }
        },
        created () {
            this.getProcessListHttp().then(res => {
                this.workingProcessList = res;
                this.applyProcessList = res;
            });
            this.getSupplierHttp();
            this.getSpinningYarnUseHttp();
            this.getMaterialCompositionHttp();
            this.getSpinningProcessHttp();
            this.getMaterialCategoryHttp();
            this.getUnitListHttp();
            this.getColorListHttp();
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        watch: {
            saveModalDetailData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        let productAddition = {
                            'typeId': null,
                            'componentId': null,
                            'yarnCount': null,
                            'purposeId': null,
                            'technologyId': null,
                            'isCovering': 'true',
                            'isSlub': 'true',
                            'materialRatio': null,
                            'yarnCountMax': null,
                            'yarnCountMin': null,
                            'basicTabProcessIpt': null, // 适用工序
                            'machineModelId': null,
                            'supplierId': null,
                            'isReused': null,
                            'packetWeight': null,
                            'twist': 0,
                            'gramWeight': 0,
                            'meters': 0
                        };
                        newVal.picUrl = defaultImgPath;
                        this.formValidate = {...productAddition, ...newVal};
                        this.showTabsIpt(newVal.typeName);
                        // 根据物料类别获取物料属性
                        this.getAddAttrTable(newVal.categoryId);
                    };
                },
                deep: true
            },
            saveModalState (newVal, oldData) {
                this.showModal = newVal;
            }
        }
    };
</script>

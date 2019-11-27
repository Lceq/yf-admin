<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between" align="middle">
            <Row type="flex" justify="start">
                <Col>
                    <Button icon="md-add" type="primary" @click="addClickEvent" class="marginBottom-10">新增</Button>
                </Col>
                <Col>
                    <Dropdown class="queryBarMarginLeft marginBottom-10" trigger="click" @on-click="getDropReview">
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
                <Col>
                    <Dropdown class="queryBarMarginLeft marginBottom-10" trigger="click" @on-click="getDropState">
                        <Button type="error">
                            禁用
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="禁用">禁用</DropdownItem>
                            <DropdownItem name="启用">启用</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
            </Row>
            <Row type="flex" justify="space-between">
                <Col>
                    <Select clearable v-model="workshopValue" class="searchHurdles queryBarMarginRight marginBottom-10" placeholder="请选择所属车间">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                </Col>
                <Col>
                    <Select clearable v-model="queryBarTypeId" class="searchHurdles queryBarMarginRight marginBottom-10" placeholder="请选择设备类别">
                        <Option v-for="item in queryBarTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col>
                    <Select clearable v-model="processValue" class="searchHurdles queryBarMarginRight marginBottom-10" placeholder="请选择所属工序">
                        <Option v-for="item in processList" :style="item.style" :value="item.id+''" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col>
                    <Select clearable v-model="dataSate" class="searchHurdles queryBarMarginRight marginBottom-10" placeholder="请选择数据状态">
                        <Option v-for="item in dataSateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col>
                    <Select clearable v-model="disableState" class="searchHurdles queryBarMarginRight marginBottom-10" placeholder="请选择禁用状态">
                        <Option v-for="item in disableStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </Col>
                <Col>
                    <Input v-model="searchData" placeholder="请输入设备编号或名称" class="machine-input-margin marginBottom-10" @on-enter="searchEnterEvent"/>
                </Col>
                <Col>
                    <Button icon="ios-search" type="primary" @click="clickSearchEvent">搜索</Button>
                </Col>
            </Row>
        </Row>
        <Row class="marginBottom-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" :loading="loadingStatus" border :columns="tableHeader" :data="tableData" @on-selection-change="getSelectTableRow"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChangeEvent"></Page>
            </Col>
        </Row>
        <Modal
                v-model="saveModalState"
                :title="saveModalTitle"
                :mask-closable="false"
                :width="800"
                @on-visible-change="getAdEdModalStatus"
        >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110" :show-message="false">
                <Row type="flex" justify="space-between">
                    <Col span="12">
                        <FormItem label="设备编码：" prop="code" class="formItemMargin">
                            <Input :readonly="showOther" :disabled="showOther" type="text" v-model="formValidate.code" placeholder="请输入设备编码" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备名称：" prop="name" class="formItemMargin">
                            <Input type="text" v-model="formValidate.name" placeholder="请输入设备名称" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备类别：" class="formItemMargin" prop="typeId">
                            <Select label-in-value v-model="formValidate.typeId" @on-change="getEquipmentTypeEvent" class="inputLength" placeholder="请选择设备类别">
                                <Option v-for="item in equipmentTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="所属工序：" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.processId" clearable placeholder="请选择所属工序" class="inputLength" @on-change="getProcessEvent">
                                <Option v-for="(item) in equipmentProcessList" :value="item.id" :style="item.style" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备机型：" prop="modelId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.modelId" filterable placeholder="请选择设备机型" class="inputLength" @on-change="getEquipModelEvent">
                                <Option v-for="item in equipmentModelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="所属车间：" class="formItemMargin" prop="deptId">
                            <Select label-in-value v-model="formValidate.deptId" placeholder="请选择所属车间" class="inputLength" @on-change="getWorkshopEvent">
                                <Option v-for="item in equipmentWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备锭数：" prop="spinCount" class="formItemMargin">
                            <InputNumber :min="1" v-model="formValidate.spinCount"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="出厂日期：" prop="prodTime" class="formItemMargin">
                            <DatePicker :clearable="false" type="date" placeholder="请选择日期" class="inputLength" v-model="formValidate.prodTime"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="生产厂商：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.manufacturer" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="PLC厂商：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.plcOwner" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="PLC型号：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.plcModel" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="HMI厂商：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.hmiOwner" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="设备组网ID：" class="formItemMargin">
                            <Input type="text" v-model="formValidate.ip" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否数采：" class="formItemMargin">
                            <Checkbox v-model="formValidate.autoGather">是</Checkbox>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="产量系数：" class="formItemMargin" prop="outputRatio">
                            <InputNumber :max="1" :min="0" :step="0.1" v-model="formValidate.outputRatio" placeholder="请输入" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="是否单锭采集：" class="formItemMargin">
                            <Checkbox v-model="formValidate.isSpinOutput">是</Checkbox>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="最大产量表数：" prop="maxOutputQty" class="formItemMargin">
                            <InputNumber class="inputLength" :max="9999999999999999" :min="0" v-model="formValidate.maxOutputQty"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12" v-show="showOther">
                        <FormItem label="禁用状态：" class="formItemMargin">
                            <div>{{formValidate.enableState === 0 ? '禁用' : '启用'}}</div>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="出厂编号：" class="formItemMargin">
                            <Input v-model="formValidate.factoryCode" class="inputLength"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="安装时间：" class="formItemMargin">
                            <DatePicker v-model="formValidate.installDate" type="date" placeholder="请选择安装时间" class="inputLength"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="投入生产时间：" class="formItemMargin">
                            <DatePicker class="inputLength" v-model="formValidate.intoProductionDate" type="date" placeholder="请选择投入生产时间"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="附加设备：" class="formItemMargin">
                            <Input class="inputLength" v-model="formValidate.additionalEquipment"/>
                        </FormItem>
                    </Col>
                    <Col span="12" v-if="isAuxiliaryEquipment">
                        <FormItem label="辅助设备：" class="formItemMargin">
                            <Select v-model="formValidate.auxiliaryEquipmentIds" multiple filterable placeholder="请选择辅助设备" class="inputLength">
                                <Option v-for="item in formValidate.auxiliaryEquipmentList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div v-show="showOther">
                    <page-other-message :operationData="otherMessageData"></page-other-message>
                </div>
            </Form>
            <div slot="footer">
                <modal-footer
                        :isDisableConfirm="disableConfirmButton"
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="adEdConfirmEvent"
                        @saveModalCancelEvent="adEdCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <tips-modal
                :tipMsg="publicModalMsg"
                :loading="deleteButtonLoading"
                :v-model="publicModalStatus"
                @cancel="publicCancel"
                @confirm="publicConfirm"
        >
        </tips-modal>
    </card>
</template>
<script>
    import api from '../../ajax/api';
    import tipsModal from '../public/deleteWarning'
    import { noticeTips, formatDate, clearSpace,compClientHeight, setPage, toDaySeconds, translateState, getOperationData } from '../../libs/common';
    import pageOtherMessage from '../components/modal-operation-log';
    import modalFooter from '../components/modal-footer';
    export default {
        components: { tipsModal, pageOtherMessage, modalFooter },
        data(){
            const validateCode = (rule, value, callback)=>{
                if (!value) {
                    callback(new Error());
                } else {
                    if(!/[\u4e00-\u9fa5]+/.test(value)){
                        callback();
                    }else{
                        callback(new Error());
                    };
                }
            };
            const validateDate = (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateWorkshop = (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateProcess =  (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateEquipmentNameIpt = (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateEquipmentModelIpt = (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateEquipmentTypeIpt = (rule, value, callback)=> { value ? callback() : callback(new Error()); };
            const validateOutputRatio = (rule, value, callback)=> { value || value === 0 ? callback() : callback(new Error()); };
            return {
                isAuxiliaryEquipment: false,
                queryBarTypeId: null,
                queryBarTypeList: '',
                equipmentTypeList: [],
                globalLoadingShow: false,
                deleteSwitch:false,
                deleteId:'',
                disableConfirmButton: false,
                pageHeights:null,
                tableHeight: 0,
                deleteButtonLoading:false,
                formValidate:{
                    code:'',
                    name:'',
                    typeId:null,
                    typeName: '',
                    modelId:null,
                    spinCount:1,
                    manufacturer:'',
                    plcOwner:'',
                    plcModel:'',
                    hmiOwner:'',
                    ip:'',
                    autoGather:false,
                    deptId:null,
                    processId:null,
                    prodTime:'',
                    maxOutputQty: null,
                    isSpinOutput: true,
                    outputRatio: 1,
                    auxiliaryEquipmentIds: [],
                    auxiliaryEquipmentCodes: [],
                    auxiliaryEquipmentNames: [],
                    auxiliaryEquipmentList: [],
                    additionalEquipment: ''
                },
                ruleValidate:{
                    outputRatio: [ {required: true, validator: validateOutputRatio,trigger: 'change'} ],
                    maxOutputQty: [ {required: true, validator: validateOutputRatio,trigger: 'change'} ],
                    code:[ { required:true,validator:validateCode,trigger:'blur'} ],
                    name:[ { required:true,validator:validateEquipmentNameIpt,trigger:'blur'} ],
                    typeId:[ { required:true,validator:validateEquipmentTypeIpt,trigger:'change'} ],
                    modelId:[ { required:true,validator:validateEquipmentModelIpt,trigger:'change'} ],
                    spinCount:[ { required:true,trigger:'change',type:'number'} ],
                    prodTime:[ { required:true,validator:validateDate,trigger:'change'} ],
                    deptId:[ { required:true,validator:validateWorkshop,trigger:'change'} ],
                    processId:[ { required:true,validator:validateProcess,trigger:'change'} ],
                },
                showOther:false,
                publicModalStatus:false,
                publicModalMsg:'',
                loadingStatus:false,
                equipmentProcessList:[],
                equipmentWorkshopList:[],
                equipmentModelList:[],
                saveModalState:false,
                saveModalTitle:'',
                processValue:null,
                processList:[],
                workshopValue: null,
                defaultWorkshop: {},
                workshopList:[],
                dataSate:null,
                dataSateList:[],
                disableState:null,
                disableStateList:[],
                tableHeader: [
                    {
                        type: 'selection',
                        align: 'center',
                        fixed:'left',
                        minWidth:68
                    },
                    {
                        title: '设备编号',
                        key: 'code',
                        sortable: true,
                        fixed:'left',
                        minWidth:110,
                        align: 'left',
                        render: (h,params)=>{
                            return h('div',[
                                h('a',{
                                    domProps:{
                                        innerHTML:params.row.code
                                    },
                                    on:{
                                        click:()=>{
                                            this.editEvent(params.row,params.row.id);
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                        align: 'left',
                        sortable: true,
                        fixed:'left',
                        minWidth:110,
                    },
                    {
                        title: '设备机型',
                        key: 'modelName',
                        align: 'left',
                        sortable: true,
                        minWidth:150,
                    },
                    {
                        title: '设备类别',
                        key: 'typeName',
                        align: 'left',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '所属车间',
                        key: 'deptName',
                        align: 'left',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '所属工序',
                        key: 'processName',
                        align: 'center',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '设备锭数',
                        key: 'spinCount',
                        align: 'right',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '出厂日期',
                        key: 'prodTime',
                        align: 'left',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '生产厂商',
                        key: 'manufacturer',
                        align: 'left',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '是否数采',
                        key: 'autoGather',
                        align: 'center',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title: '禁用状态',
                        key: 'enableStateName',
                        align: 'center',
                        sortable: true,
                        minWidth:110,
                    },
                    {
                        title:'操作',
                        align:'center',
                        sortable:true,
                        fixed:'right',
                        width:80,
                        render: (h,params)=>{
                            let disableDelete = false;
                            params.row.auditState === '已审批' || params.row.auditState === 3 ? disableDelete = true : disableDelete = false;
                            return h('div',[
                                h('Button',{
                                    props:{
                                        size:'small',
                                        disabled:disableDelete
                                    },
                                    domProps:{
                                        innerHTML:'删除'
                                    },
                                    on:{
                                        'click': ()=>{
                                            this.deleteMaterialEvent(params.row.id);
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ],
                tableData: [],
                searchData:'',
                checkObj:[],
                pageTotal:0,
                pageOpts:setPage.pageOpts,
                pageSize:setPage.pageSize,
                pageIndex:1,
                buttonLoading:false,
                otherMessageData: []
            }
        },
        methods:{
            getEquipmentTypeEvent (e) {
                if (e) {
                    this.formValidate.typeName = e.label;
                    this.formValidate.processId = null;
                    this.formValidate.processName = '';
                    this.formValidate.modelId = null;
                    this.formValidate.modelName = '';
                    this.formValidate.auxiliaryEquipmentList = [];
                    // 是生产主机时，根据设备类别和工序查机型
                    if (e.label.indexOf('生产主机') !== -1) {
                        this.isAuxiliaryEquipment = true;
                        if (this.formValidate.processId) {
                            this.getEquipmentModelList()
                        } else {
                            this.equipmentModelList = [];
                        };
                    } else {
                        this.isAuxiliaryEquipment = false;
                        this.formValidate.auxiliaryEquipmentIds = [];
                        this.formValidate.auxiliaryEquipmentCodes = [];
                        this.formValidate.auxiliaryEquipmentNames = [];
                        // 是辅助设备，直接查机型,不需要加工序条件
                        this.getEquipmentModelList();
                    };
                };
            },
            // 获取设备机型
            getEquipmentModelList () {
                this.$call('model.list', {
                    typeId: this.formValidate.typeId,
                    processId: this.formValidate.processId,
                    enableState: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        this.equipmentModelList = res.data.res;
                    };
                })
            },
            // 获取辅助设备
            getAuxiliaryEquipmentListRequest () {
                this.$call('machine.auxiliaryList', {
                    workshopId: this.formValidate.deptId,
                    processId: this.formValidate.processId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.auxiliaryEquipmentList = res.data.res;
                    };
                })
            },
            //获取所属工序
            getProcessEvent(e){
                if(e){
                    this.formValidate.processId = e.value;
                    this.formValidate.processName = e.label;
                    if (this.formValidate.typeId && this.formValidate.typeName.indexOf('生产主机') !== -1) {
                        this.formValidate.modelId = null;
                        this.formValidate.modelName = '';
                        this.getEquipmentModelList();
                        // 工序，车间存在且是生产主机时，获取辅助设备
                        if (this.formValidate.deptId) {
                            this.getAuxiliaryEquipmentListRequest();
                        };
                    }
                } else {
                    this.formValidate.processId = null;
                    this.formValidate.processName = '';
                    this.formValidate.auxiliaryEquipmentIds = [];
                    this.formValidate.auxiliaryEquipmentCodes = [];
                    this.formValidate.auxiliaryEquipmentNames = [];
                    if (this.formValidate.typeId && this.formValidate.typeName.indexOf('生产主机') !== -1) {
                        this.formValidate.modelId = null;
                        this.formValidate.modelName = '';
                        this.equipmentModelList = [];
                    } else if (this.formValidate.typeId && this.formValidate.typeName.indexOf('辅助设备') !== -1) {
                        this.getEquipmentModelList();
                    } else {
                        this.equipmentModelList = [];
                    }
                    this.formValidate.auxiliaryEquipmentList = [];
                };
            },
            //获取勾选的对象
            getSelectTableRow(obj){
                this.checkObj = obj;
            },
            //获取新增和编辑的所属车间
            getWorkshopEvent(e){
                if(e) {
                    this.formValidate.deptId = e.value;
                    this.formValidate.deptName = e.label;
                    if (this.formValidate.typeId && this.formValidate.typeName.indexOf('生产主机') !== -1) {
                        // 工序，车间存在且是生产主机时，获取辅助设备
                        if (this.formValidate.processId) {
                            this.getAuxiliaryEquipmentListRequest();
                        };
                    }
                } else {
                    this.formValidate.deptId = null;
                    this.formValidate.deptName = '';
                };
            },
            //获取新增和编辑的设备机型的id和name
            getEquipModelEvent(e){
                if(e){
                    this.formValidate.modelId = e.value;
                    this.formValidate.modelName = e.label;
                } else {
                    this.formValidate.modelId = null;
                    this.formValidate.modelName = '';
                };
            },
            //监听新增和编辑的状态
            getAdEdModalStatus(e){
                if(e === false){
                    this.isAuxiliaryEquipment = false;
                    this.equipmentModelList = [];
                    this.$refs['formValidate'].resetFields();
                    this.disableConfirmButton = false;
                    this.deleteSwitch = false;
                    this.checkObj = [];
                    this.buttonLoading = false;
                    this.formValidate.modelId = null;
                    this.formValidate.manufacturer = '';
                    this.formValidate.plcOwner = '';
                    this.formValidate.plcModel = '';
                    this.formValidate.hmiOwner = '';
                    this.formValidate.ip = '';
                    this.formValidate.autoGather = false;
                    this.formValidate.deptId = null;
                    this.formValidate.processId = null;
                    this.formValidate.isSpinOutput = true;
                    this.formValidate.outputRatio = 1;
                    this.formValidate.typeName = '';
                    this.formValidate.typeId = null;
                    this.formValidate.factoryCode = '';
                    this.formValidate.installDate = '';
                    this.formValidate.intoProductionDate = '';
                    this.formValidate.additionalEquipment = '';
                };
            },
            //新增和编辑栏的取消按钮
            adEdCancelEvent(){
                this.saveModalState = false;
                this.formValidate.processId = null;
            },
            //编辑的请求
            saveHttp(){
                this.formValidate.prodTime = formatDate(this.formValidate.prodTime);
                this.formValidate.installDate ? this.formValidate.installDate = formatDate(this.formValidate.installDate).split(' ')[0] : '';
                this.formValidate.intoProductionDate ? this.formValidate.intoProductionDate = formatDate(this.formValidate.intoProductionDate).split(' ')[0] : '';
                if (this.formValidate.auxiliaryEquipmentIds && this.formValidate.auxiliaryEquipmentIds.length !== 0) {
                    this.formValidate.auxiliaryEquipmentCodes = [];
                    this.formValidate.auxiliaryEquipmentNames = [];
                    this.formValidate.auxiliaryEquipmentList.forEach(item => {
                        this.formValidate.auxiliaryEquipmentIds.forEach(selectItem => {
                            if (item.id === selectItem) {
                                this.formValidate.auxiliaryEquipmentCodes.push(item.code);
                                this.formValidate.auxiliaryEquipmentNames.push(item.name);
                            };
                        });
                    });
                } else {
                    this.formValidate.auxiliaryEquipmentCodes = [];
                    this.formValidate.auxiliaryEquipmentNames = [];
                };
                let params = { ...JSON.parse(JSON.stringify(this.formValidate)) };
                params.auxiliaryEquipmentIds = JSON.stringify(params.auxiliaryEquipmentIds);
                params.auxiliaryEquipmentCodes = JSON.stringify(params.auxiliaryEquipmentCodes);
                params.auxiliaryEquipmentNames = JSON.stringify(params.auxiliaryEquipmentNames);
                this.$post('machine/save', params).then((res)=>{
                    if(res.data.status === 200){
                        noticeTips(this, 'saveTips');
                        this.buttonLoading = false;
                        this.getListHttp();
                        this.saveModalState = false;
                    }else{
                        this.buttonLoading = false;
                    };
                });
            },
            //新增和编辑栏的确认按钮
            adEdConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        this.saveHttp();
                    } else {
                        /[\u4e00-\u9fa5]+/.test(this.formValidate.code) ? this.$Message.warning('编码格式不能为中文!') : noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            getDeTailEquipmentModelList () {
                this.$call('model.list', {
                    typeId: this.formValidate.typeId,
                    enableState: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        this.equipmentModelList = res.data.res;
                    };
                })
            },
            //编辑的方法
            editEvent(obj, id){
                this.showOther = true;
                obj.auditState === 2 ? this.saveModalTitle = '编辑设备档案' : this.saveModalTitle = '设备档案详情';
                this.$call('machine.detail', { id: id }).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.auxiliaryEquipmentIds = JSON.parse(responseData.auxiliaryEquipmentIds);
                        responseData.auxiliaryEquipmentCodes = JSON.parse(responseData.auxiliaryEquipmentCodes);
                        responseData.auxiliaryEquipmentNames = JSON.parse(responseData.auxiliaryEquipmentNames);
                        this.formValidate = responseData;
                        this.otherMessageData = getOperationData(responseData);
                        responseData.auditState === 3 ? this.disableConfirmButton = true : this.disableConfirmButton = false;
                        // 是生产主机时，根据设备类别和工序查机型
                        if (this.formValidate.typeName.indexOf('生产主机') !== -1) {
                            this.isAuxiliaryEquipment = true;
                            if (this.formValidate.processId) {
                                this.getEquipmentModelList()
                            } else {
                                this.equipmentModelList = [];
                            };
                        } else {
                            this.isAuxiliaryEquipment = false;
                            // 是辅助设备，直接查机型,不需要加工序条件
                            this.getDeTailEquipmentModelList();
                        };
                        this.formValidate.processId = responseData.processId;
                        responseData.isSpinOutput ? this.formValidate.isSpinOutput = responseData.isSpinOutput : this.formValidate.isSpinOutput = false;
                        this.saveModalState = true;
                    };
                });
            },
            //搜索的方法
            clickSearchEvent(){
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListHttp();
            },
            searchEnterEvent(){
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListHttp();
            },
            // 获取列表的请求
            getListHttp(){
                this.searchData = clearSpace(this.searchData);
                return this.$post('machine/list', {
                    "pageIndex":this.pageIndex,
                    "pageSize":this.pageSize,
                    "workshopId":this.workshopValue,
                    "processId":this.processValue,
                    "enableState":this.disableState,
                    "auditState":this.dataSate,
                    "name":this.searchData,
                    "typeId": this.queryBarTypeId
                }).then((res)=>{
                    if(res.data.status === 200){
                        this.loadingStatus = false;
                        this.tableConverterCN(translateState(res.data.res));
                        this.tableData = res.data.res;
                        setTimeout(()=>{ this.pageTotal = res.data.count; },0);
                        this.globalLoadingShow = false;
                    };
                });
            },
            //获取页码
            getPageEvent(pageIndex){
                this.loadingStatus = true;
                this.pageIndex = pageIndex;
                this.getListHttp();
            },
            //获取每页条数
            pageChangeEvent(e){
                this.pageSize = e;
                this.pageIndex = 1;
                this.getListHttp();
            },
            //新增的点击事件
            addClickEvent(){
                this.formValidate.outputRatio = 1;
                this.formValidate.deptId = JSON.parse(JSON.stringify(this.defaultWorkshop.workshopId));
                this.formValidate.deptName = JSON.parse(JSON.stringify(this.defaultWorkshop.workshopName));
                this.formValidate.prodTime = toDaySeconds();
                this.showOther = false;
                this.saveModalState = true;
                this.saveModalTitle = '新增设备档案';
                this.$delete(this.formValidate, 'id');
            },
            //获取选中的审核状态
            getDropReview(e){
                if(this.checkObj.length !== 0){
                    let authState = [];
                    this.checkObj.forEach((item)=>{authState.push(item.id)});
                    if(e === '审核'){
                        this.$post(api.machineApprove(), authState).then(res=>{
                            if(res.data.status === 200){
                                noticeTips(this, 'auditTips');
                                this.getListHttp();
                                this.checkObj = [];
                            };
                        })
                    }else if(e === '反审核'){
                        this.$post(api.machineUnapprove(), authState).then(res=>{
                            if(res.data.status === 200){
                                noticeTips(this, 'unAuditTips');
                                this.getListHttp();
                                this.checkObj = [];
                            };
                        });
                    };
                }else if(this.checkObj.length === 0){
                    noticeTips(this, 'unCheckTips');
                };
            },
            //获取操作栏选中的禁用状态
            getDropState(e){
                if(this.checkObj.length !== 0){
                    let stateStatus = [];
                    this.checkObj.forEach((items)=>{stateStatus.push(items.id)});
                    if(e === '禁用'){
                        this.$post(api.machineDisable(), stateStatus).then(res=>{
                            if(res.data.status === 200){
                                noticeTips(this, 'disableTips');
                                this.getListHttp();
                                this.checkObj = [];
                            };
                        });
                    }else if(e === '启用'){
                        this.$post(api.machineEnable(), stateStatus).then(res=>{
                            if(res.data.status === 200){
                                noticeTips(this, 'enableTips');
                                this.getListHttp();
                                this.checkObj = [];
                            };
                        });
                    };
                }else if(this.checkObj.length === 0){
                    noticeTips(this, 'unCheckTips');
                };
            },
            //删除的取消按钮
            publicCancel(){
                this.publicModalStatus = false;
                this.deleteButtonLoading = false;
                this.deleteId = '';
            },
            //删除的确认按钮
            publicConfirm(){
                this.deleteButtonLoading = true;
                if(this.deleteSwitch === true){
                    this.$post(api.fileDelete(), [this.deleteId]).then((res)=>{
                        if(res.data.status === 200){
                            this.getListHttp();
                            this.checkObj = [];
                            this.publicModalStatus = false;
                            noticeTips(this, 'deleteTips');
                            this.deleteButtonLoading = false;
                        }else if(res.data.status === 415){
                            this.publicModalStatus= false;
                            this.deleteButtonLoading= false;
                        }else{
                            this.deleteButtonLoading = false;
                        };
                    })
                };
            },
            //删除的方法
            deleteMaterialEvent(id){
                this.deleteId = id;
                this.publicModalMsg = '确认删除？';
                this.publicModalStatus = true;
                this.deleteSwitch = true;
            },
            //数据状态和禁用状态转中文处理的方法
            tableConverterCN(data){
                data.forEach((item)=>{
                    if(item.prodTime) item.prodTime = item.prodTime.split(' ')[0];
                    item.autoGather === false ? item.autoGather = '否' : item.autoGather = '是'; //是否数采
                    //判断设备类别和设备机型以及所属车间和所属工序id是否为空
                    if (item.typeId === 0) item.typeName = '全部';
                    if (item.modelId === 0) item.modelName = '全部';
                    if (item.deptId === 0) item.deptName = '无';
                    if (item.processId === 0) item.processName = '无';
                })
            },
            // 获取审核的列表数据
            getAuditStatus(){
                return this.$fetch(api.enumAuditState2()).then(res=>{
                    if(res.data.status === 200){
                        this.dataSateList = res.data.res;
                    };
                });
            },
            // 获取禁用的列表数据
            getDisableStatus(){
                return this.$fetch(api.enumEnableState()).then(res=>{
                    if(res.data.status === 200) this.disableStateList = res.data.res;
                });
            },
            getWorkshopsHttp () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.workshopValue = responseData.defaultDeptId;
                        this.defaultWorkshop = {
                            workshopId: responseData.defaultDeptId,
                            workshopName: responseData.defaultDeptName,
                        };
                        this.equipmentWorkshopList = responseData.userData;
                        this.workshopList = responseData.userData;
                    };
                });
            },
            getProcessListHttp () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.equipmentProcessList = res;
                    this.processList = res;
                });
            },
            // 获取设备类别列表数据
            getEquipmentTypeList () {
                this.$call('dict.list',{"parentCode":"equipment_type","classId":""}).then(res => {
                    if (res.data.status === 200) {
                        this.equipmentTypeList = res.data.res;
                        this.queryBarTypeList = res.data.res;
                    };
                })
            },
            // 获取依赖数据
            async getDependentDataHttp () {
                await this.getEquipmentTypeList();
                await this.getProcessListHttp();
                await this.getAuditStatus();
                await this.getDisableStatus();
                await this.getWorkshopsHttp();
                await this.getListHttp();
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 150 + this.pageHeights);
                window.onresize = () => {
                    this.pageHeights = pageHeightDom.offsetHeight + 10;
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 150 + this.pageHeights);
                };
            }
        },
        created(){
            this.globalLoadingShow = true;
            this.getDependentDataHttp();
        },
        mounted(){
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    }
</script>
<style scoped>
    .machine-input-margin{
        width: 150px;
        margin-right: 4px;
    }
</style>

<template>
    <card>
        <Row type="flex" justify="space-between">
            <Col>
                <Button :disabled="disableOrderTakingButton" class="marginBottom-10" type="success" @click="clickReceiptEvent">接单</Button>
                <Button :disabled="disableRepairButton" class="marginBottom-10" type="warning" @click="clickRePairEvent">维修</Button>
            </Col>
            <Col>
                <Row type="flex">
                    <Col class="queryBarStyle margin-right-10 marginBottom-10">
                        <span class="labelWidth">所属车间:</span>
                        <Select clearable v-model="queryBarWorkshop" placeholder="请选择车间" class="queryModule" @on-change="getQueryBarWorkshopEvent">
                            <Option v-for="item in queryBarWorkshopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col class="queryBarStyle margin-right-10 marginBottom-10">
                        <span class="labelWidth">所属工序:</span>
                        <Select clearable v-model="queryBarProcess" placeholder="请选择工序" class="queryModule" @on-change="getQueryBarProcessEvent">
                            <Option v-for="item in queryBarProcessList" :value="item.id+''" :key="item.id" :style="item.style">{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col class="queryBarStyle margin-right-10 marginBottom-10">
                        <span class="labelWidth">工单状态:</span>
                        <Select clearable v-model="queryBarOrderState" placeholder="请选择工单状态" class="queryModule" @on-change="getQueryBarOrderEvent">
                            <Option v-for="item in queryBarOrderStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col class="queryBarStyle margin-right-10 marginBottom-10">
                        <Input v-model="queryBarRepairCode" @on-enter="searchClickEvent" type="text" placeholder="请输入报修单号"/>
                    </Col>
                    <Col class="queryBarStyle marginBottom-10">
                        <Input v-model="queryBarMachineName" @on-enter="searchClickEvent" type="text" placeholder="请输入设备名称"/>
                    </Col>
                    <Col>
                        <Button type="primary" class="searchBtMargin marginBottom-10" @click="searchClickEvent">搜索</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="marginBottom-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageCodeEvent" :show-sizer="true" @on-page-size-change="getPageOptsEvent"></Page>
            </Col>
        </Row>

        <Row>
            <Modal
                    v-model="editModalStatus"
                    title="维呼清单"
                    @on-ok="editConfirmEvent"
                    @on-cancel="editCancelEvent"
                    width="600"
                    :mask-closable="false"
                    @on-visible-change="getModalStatusChangeEvent"
            >
                <Form :show-message="false" :label-width="110"  ref="formValidate" :model="formValidate" :rules="ruleValidate">
                    <Row>
                        <Col>
                            <span class="modalSubTitle">呼叫详情:</span>
                        </Col>
                    </Row>
                    <Card class="modalFaultDetailBar">
                        <Row>
                            <Col span="12">
                                <FormItem label="报修单号：" class="formItemMargin-0">
                                    <span>{{modalOrder}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="设备名称：" class="formItemMargin-0">
                                    <span>{{modalMachineName}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="车间：" class="formItemMargin-0">
                                    <span>{{modalWorkshopName}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="工序：" class="formItemMargin-0">
                                    <span>{{modalProcessName}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="报修人：" class="formItemMargin-0">
                                    <span>{{modalRepairName}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="呼叫时间：" class="formItemMargin-0">
                                    <span>{{modalRepairTime}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="维修人：" class="formItemMargin">
                                    <span>{{modalMaintainName}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="故障类型：" class="formItemMargin" prop="modalSelectFaultTypeId">
                                    <Select v-model="formValidate.modalSelectFaultTypeId" @on-change="getSelectFaultTypeEvent">
                                        <Option v-for="item in modalFaultTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="故障内容描述：" class="formItemMargin-0">
                                    <Input v-model="modalFaultDescribe" :autosize="{minRows: 1,maxRows: 4}" disabled type="textarea"/>
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>
                    <Row>
                        <Col>
                            <span class="modalSubTitle">维修详情:</span>
                        </Col>
                    </Row>
                    <Card>
                        <Row>
                            <Col span="12">
                                <FormItem label="工单状态：" class="formItemMargin-0">
                                    <span>{{modalOrderState}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="机台号：" class="formItemMargin-0">
                                    <span>{{modalMachineName}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="车间：" class="formItemMargin-0">
                                    <span>{{modalWorkshopName}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="工序：" class="formItemMargin-0">
                                    <span>{{modalProcessName}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="接单人：" class="formItemMargin-0">
                                    <span>{{modalOrderName}}</span>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="接单时间：" class="formItemMargin-0">
                                    <span>{{modalOrderTime}}</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="是否停机维修：" class="formItemMargin" prop="isRepair">
                                    <Select v-model="formValidate.isRepair" @on-change="getModelIsDownTimeEvent">
                                        <Option v-for="item in isRepairList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="是否更换配件：" class="formItemMargin" prop="replacePart">
                                    <Select v-model="formValidate.replacePart" @on-change="getModalIsReplaceEvent">
                                        <Option v-for="item in replacePartList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="故障原因：" class="formItemMargin" prop="modalFaultCause">
                                    <Select v-model="formValidate.modalFaultCause" @on-change="getModalFaultCauseEvent">
                                        <Option v-for="item in modalFaultCauseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="12">
                                <FormItem label="维修开始时间：" class="formItemMargin" prop="modalRepairStart">
                                    <DatePicker :clearable="false" :readonly="disableRepairStartTime" :options="startTimeOptions" @on-change="getModalStartTimeEvent" v-model="formValidate.modalRepairStart" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择维修开始时间"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="12">
                                <FormItem label="维修结束时间：" class="formItemMargin">
                                    <DatePicker :clearable="false" :disabled="disableRepairOverTime" :readonly="disableRepairOverTime" :options="endTimeOptions" @on-change="getModalOverTimeEvent" v-model="modalRepairOver" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择维修结束时间"></DatePicker>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormItem label="维修内容描述：" class="formItemMargin">
                                    <Input v-model="formValidate.modalRepairDescribe" type="textarea" :rows="1" placeholder="请输入..." />
                                </FormItem>
                            </Col>
                        </Row>
                    </Card>

                </Form>
                <div slot="footer">
                    <div>
                        <Button :loading="modalButtonLoading" type="success" @click="editConfirm">确认</Button>
                        <Button class="cancelButton" @click="editCancel">取消</Button>
                    </div>
                </div>
            </Modal>
        </Row>
        <Row>
            <tips-modal
                    :v-model="deleteModalStatus"
                    :tipMsg="deleteModalMsg"
                    :loading="deleteButtonLoading"
                    @cancel="deleteModalCancel"
                    @confirm="deleteModalConfirm"
            >
            </tips-modal>
        </Row>
    </card>
</template>
<script>
    import tipsModal from '../public/deleteWarning';
    import api from '../../ajax/api';
    import publicJs from '../public/public-js/publiceJs';
    export default {
        components:{
            tipsModal
        },
        data(){
            const validateFaultCause = (rule, value, callback) => {
                if (value === 0 || value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            const validateFaultTypeId = (rule, value, callback) => {
                if (value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            const validateIsRepair  = (rule, value, callback) => {
                if (value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            const validateReplacePart = (rule, value, callback) => {
                if (value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            const validateRepairDescribe = (rule, value, callback) => {
                if (value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            const validateModalRepairStart = (rule, value, callback) => {
                if (value === '' || value === null || value === 'null') {
                    callback(new Error(''));
                }else {
                    callback();
                }
            };
            return {
                formValidate:{
                    modalRepairDescribe:'',
                    modalSelectFaultTypeId:'',
                    isRepair:'',
                    replacePart:'',
                    modalFaultCause:'',
                    modalRepairStart:'',

                },
                ruleValidate:{
                    modalRepairDescribe:[
                        { required: true, validator:validateRepairDescribe, trigger: 'change' }
                    ],
                    modalSelectFaultTypeId:[
                        { required:true,validator:validateFaultTypeId,trigger:'change'}
                    ],
                    isRepair:[
                        { required:true,validator:validateIsRepair,trigger:'change'}
                    ],
                    replacePart:[
                        { required:true,validator:validateReplacePart,trigger:'change'}
                    ],
                    modalFaultCause:[
                        { required:true,validator:validateFaultCause,trigger:'change'}
                    ],
                    modalRepairStart:[
                        { required:true,validator:validateModalRepairStart,trigger:'change'}
                    ],

                },
                startTime:'',
                endTime:'',
                startTimeOptions: {}, //开始日期设置
                endTimeOptions: {}, //结束日期设置
                modalOrder:'',
                modalMachineName:'',
                modalWorkshopName:'',
                modalProcessName:'',
                modalRepairName:'',
                modalRepairTime:'',
                modalMaintainName:'',
                modalFaultDescribe:'',
                modalOrderState:'',
                modalOrderName:'',
                modalOrderTime:'',
                modalRepairOver:'',
                deleteModalStatus:false,
                deleteModalMsg:'',
                deleteButtonLoading:false,
                ini:null,
                isOrder:false,
                isFix:false,
                isEdit:false,
                disableOrderTakingButton:false,
                disableRepairButton:false,
                queryBarMachineName:'',
                queryBarRepairCode:'',
                tableHeight:document.documentElement.clientHeight - 250,
                pageOpts:publicJs.pageOpts,
                pageSize:publicJs.pageSize,
                pageIndex:1,
                pageTotal:0,
                disableRepairStartTime:false,
                disableRepairOverTime:false,
                checkObj:null,
                queryBarOrderStateList:[
                    {
                        label:'未接单',
                        value:'0'
                    },
                    {
                        label:'维修中',
                        value:'1'
                    },
                    {
                        label:'已完成',
                        value:'2'
                    }
                ],
                queryBarOrderState:'',
                queryBarProcessList:[],
                queryBarProcess:'',
                queryBarWorkshop:21,
                queryBarWorkshopList:[],
                modalFaultTypeList:[],
                buttonLoading:false,
                modalFaultCauseList:[],
                replacePartList:[
                    {
                        label:'是',
                        value:'true'
                    },
                    {
                        label:'否',
                        value:'false'
                    }
                ],
                editModalStatus:false,
                describe:'',
                isRepairList:[
                    {
                        label:'是',
                        value:'true'
                    },
                    {
                        label:'否',
                        value:'false'
                    }
                ],
                model1:'',
                cityList:[],
                tableHeader: [
                    {
                        title: '选择',
                        width: 80,
                        key:'checkBox',
                        align:'center',
                        fixed:'left',
                        render:(h,params)=>{
                            return h('div',[
                                h('Checkbox',{
                                    props:{
                                        value:params.row.checkBox
                                    },
                                    on:{
                                        'on-change':(e)=>{
                                            this.tableData.forEach((items)=>{
                                                this.$set(items,'checkBox',false)
                                            });
                                            this.tableData[params.index].checkBox = e;
                                            if(e === true){
                                                this.getCheckObj(params.row)
                                            }else{
                                                this.getCheckObj(null)
                                            };
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '报修单号',
                        key: 'code',
                        align:'center',
                        minWidth:150,
                        fixed:'left'
                    },
                    {
                        title: '设备编号',
                        key: 'machineCode',
                        align:'center',
                        minWidth:150,
                        fixed:'left'
                    },
                    {
                        title: '设备名称',
                        key: 'machineName',
                        align:'center',
                        minWidth:200,
                        fixed:'left'
                    },
                    {
                        title: '车间',
                        key: 'deptName',
                        align:'center',
                        minWidth:130
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        align:'center',
                        minWidth:150
                    },
                    {
                        title: '报修人',
                        key: 'repairName',
                        align:'center',
                        minWidth:130
                    },
                    {
                        title: '报修时间',
                        key: 'repairTime',
                        align:'center',
                        minWidth:160
                    },
                    {
                        title: '维修人',
                        key: 'maintainName',
                        align:'center',
                        minWidth:120
                    },
                    {
                        title: '接单时间',
                        key: 'orderTime',
                        align:'center',
                        minWidth:160
                    },
                    {
                        title: '维修状态',
                        key: 'state',
                        align:'center',
                        minWidth:120
                    },
                    {
                        title:'操作',
                        key:'operation',
                        align:'center',
                        width:130,
                        render:(h,params)=>{
                            let disableDelete = true;
                            if(params.row.state === '未接单'){
                                disableDelete = false;
                            };
                            return h('div',[
                                h('Button',{
                                    props:{
                                        size:'small',

                                    },
                                    style:{
                                        marginRight:'4px'
                                    },
                                    on:{
                                        'click':()=>{
                                            this.clickEditButtonEvent(params.row.id)
                                        }
                                    }

                                },'编辑'),
                                h('Button',{
                                    props:{
                                        size:'small',
                                        disabled:disableDelete
                                    },
                                    on:{
                                        'click':()=>{
                                            this.clickDeleteButtonEvent(params.row.id)
                                        }
                                    }
                                },'删除')
                            ])
                        }
                    }
                ],
                tableData: [],
                pageHeights:null,
                deleteId:'',
                modalButtonLoading:false
            }
        },
        methods:{
            //获取维修开始时间
            getModalStartTimeEvent(e){
                if(e !== null && e !== undefined && e!== ''){
                    this.formValidate.modalRepairStart = e;
                    this.formValidate.modalRepairStart = e + ':00';
                    this.startTime = e;
                    this.startTime = this.startTime.split(' ')[0];
                    this.endTimeOptions = {
                        disabledDate: date => {
                            let startTime = this.startTime ? new Date(this.startTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                            return date && (date.valueOf() < startTime);
                        }
                    };
                };
            },
            //维修结束时间
            getModalOverTimeEvent(e){
                this.modalRepairOver = e + ':00';
                if(e !== null && e !== undefined && e!== ''){
                    this.endTime = e;                 //包含当天
                    this.endTime = this.endTime.split(' ')[0];           //仅精确到分钟
                    let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                    this.startTimeOptions = {
                        disabledDate(date) {
                            return date && date.valueOf() > endTime;
                        }
                    }
                }else{
                    this.startTimeOptions = {
                        disabledDate(date) {
                            return false;
                        }
                    };
                    this.endTimeOptions = {
                        disabledDate: date => {
                            let startTime = this.startTime ? new Date(this.startTime).valueOf() : '';
                            return date && (date.valueOf() < startTime);
                        }
                    };
                };
            },
            //监听modal状态
            getModalStatusChangeEvent(e){
                if(e === false){
                    this.initDataEvent();
                };
            },
            //初始化数据
            initDataEvent(){
                this.editModalStatus = false;
                this.$refs['formValidate'].resetFields();
                this.disableRepairStartTime = false;
                this.disableRepairOverTime = false;
                this.modalOrder = '';
                this.modalMachineName = '';
                this.modalWorkshopName = '';
                this.modalProcessName = '';
                this.modalRepairName = '';
                this.modalRepairTime = '';
                this.modalMaintainName = '';
                this.modalOrderName = '';
                this.modalOrderTime = '';
                this.modalOrderState = '';
                this.modalFaultDescribe = '';
                this.formValidate.modalRepairDescribe = '';
                this.formValidate.modalRepairStart = '';
                this.formValidate.isRepair = '';
                this.formValidate.replacePart = '';
                this.formValidate.modalFaultCause = '';
                this.modalRepairOver = '';
                this.isFix = false;
                this.isOrder = false;
                this.isEdit = false;
                this.formValidate.modalSelectFaultTypeId = '';
            },
            //删除的按钮事件
            deleteModalCancel(){
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
                this.deleteModalMsg = '';
                this.deleteId = '';
            },
            deleteModalConfirm(){
                this.deleteButtonLoading = true;
                this.$post(
                    // 'maintain/single/delete',
                    api.postMaintainDelete(),
                    [this.deleteId]
                ).then(res=>{
                    if(res.data.status === 200){
                        this.deleteId = '';
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                        this.deleteModalMsg = '';
                        this.searchHttp();
                        this.$Message.success('操作成功！');
                    }else{
                        this.deleteButtonLoading = false;

                    };
                })
            },
            //获取故障原因
            getModalFaultCauseEvent(e){
                if(e !== null && e !== undefined){
                    this.formValidate.modalFaultCause = e;

                };
            },
            //是否换配件事件
            getModalIsReplaceEvent(e){
                if(e !== null && e !== undefined){
                    this.formValidate.replacePart = e;
                };
            },
            //获取是否停机的事件
            getModelIsDownTimeEvent(e){
                if(e !== null && e !== undefined){
                    this.formValidate.isRepair = e;
                };
            },
            orderTakeHttp(){
                this.modalButtonLoading = true;
                this.$post(
                    // 'maintain/single/orderTake',
                    api.postMaintainOrderTake(),
                    {
                        "id":this.checkObj.id,
                        "faultTypeId":this.formValidate.modalSelectFaultTypeId,
                        "isReplaceParts":this.formValidate.replacePart,
                        "isDownTime":this.formValidate.isRepair,
                        "faultCauseId":this.formValidate.modalFaultCause,
                        "maintainBeginTime":this.formValidate.modalRepairStart,
                        // "maintainStopTime":this.modalRepairOver,
                        "maintainRemark":this.formValidate.modalRepairDescribe,
                    }
                ).then(res=>{
                    if(res.data.status === 200){
                        this.isOrder = false;
                        this.editModalStatus = false;
                        this.$Message.success('操作成功！');
                        this.searchHttp();
                        this.modalButtonLoading = false;
                        this.checkObj = null;
                    }else{
                        this.modalButtonLoading = false;
                    };
                })
            },
            fixMachineHttp(){
                if(this.modalRepairOver !== '' && this.modalRepairOver !== null){
                    this.modalButtonLoading = true;
                    this.$post(
                        // 'maintain/single/fixMachine',
                        api.postMaintainFixMachine(),
                        {
                            "id":this.checkObj.id,
                            "faultTypeId":this.formValidate.modalSelectFaultTypeId,
                            "isReplaceParts":this.formValidate.replacePart,
                            "isDownTime":this.formValidate.isRepair,
                            "faultCauseId":this.formValidate.modalFaultCause,
                            "maintainBeginTime":this.formValidate.modalRepairStart,
                            "maintainStopTime":this.modalRepairOver,
                            "maintainRemark":this.formValidate.modalRepairDescribe,

                        }
                    ).then(res=>{
                        if(res.data.status === 200){
                            this.editModalStatus = false;
                            this.isFix = false;
                            this.$Message.success('操作成功！')
                            this.searchHttp();
                            this.checkObj = null;
                            this.modalButtonLoading = false;
                        }else{
                            this.modalButtonLoading = false;
                        };
                    })
                }else{
                    this.$Message.warning('维修结束时间不能为空!');
                };
            },
            editSaveHttp(){
                if(this.modalRepairOver !== '' && this.modalRepairOver !== null){
                    this.modalButtonLoading = true;
                    this.$post(
                        // 'maintain/single/save',
                        api.postMaintainSave(),
                        {
                            "id":this.checkObj.id,
                            "faultTypeId":this.formValidate.modalSelectFaultTypeId,
                            "isReplaceParts":this.formValidate.replacePart,
                            "isDownTime":this.formValidate.isRepair,
                            "faultCauseId":this.formValidate.modalFaultCause,
                            "maintainBeginTime":this.formValidate.modalRepairStart,
                            "maintainStopTime":this.modalRepairOver,
                            "maintainRemark":this.formValidate.modalRepairDescribe,
                        }
                    ).then(res=>{
                        if(res.data.status === 200){
                            this.editModalStatus = false;
                            this.isEdit = false;
                            this.$Message.success('操作成功！')
                            this.searchHttp();
                            this.checkObj = null;
                            this.modalButtonLoading = false;
                        }else{
                            this.modalButtonLoading = false;
                        };
                    })
                }else{
                    this.$Message.warning('维修结束时间不能为空!');
                };

            },
            //编辑modal的确认按钮事件
            editConfirm(){
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        //接单
                        if(this.isOrder === true){
                            this.formValidate.modalRepairStart = publicJs.formatDate(this.formValidate.modalRepairStart)
                            this.orderTakeHttp();
                        };
                        //维修
                        if(this.isFix === true){
                            this.formValidate.modalRepairStart = publicJs.formatDate(this.formValidate.modalRepairStart)
                            this.modalRepairOver = publicJs.formatDate(this.modalRepairOver);
                            this.fixMachineHttp();
                        };
                        //编辑
                        if(this.isEdit === true){
                            if(this.modalRepairOver !== null && this.modalRepairOver !== ''){
                                this.modalRepairOver = publicJs.formatDate(this.modalRepairOver);
                            };
                            this.formValidate.modalRepairStart = publicJs.formatDate(this.formValidate.modalRepairStart)
                            this.editSaveHttp();
                        };
                    } else {
                        this.$Message.error('请填写完整！')
                    }
                })
            },
            //编辑的取消事件
            editCancel(){
                this.initDataEvent();
            },
            //搜索的点击事件
            searchClickEvent(){
                this.pageIndex = 1;
                this.pageTotal =1;
                this.searchHttp();
            },
            searchHttp(){
                let processId = '';
                if(this.queryBarProcess === '全部'){
                    processId = '';
                }else{
                    processId = this.queryBarProcess;
                };
                this.queryBarMachineName = publicJs.clearSpace(this.queryBarMachineName);
                this.queryBarRepairCode = publicJs.clearSpace(this.queryBarRepairCode);

                this.$fetch(
                    // 'maintain/single/list',
                    api.getMaintainList(),
                    {
                        deptid:this.queryBarWorkshop,
                        processid:processId,
                        state:this.queryBarOrderState,
                        name:this.queryBarMachineName,
                        code:this.queryBarRepairCode,
                        pageindex:this.pageIndex,
                        pagesize:this.pageSize,
                    }
                ).then(res=>{
                    if(res.data.status === 200){
                        this.tableData = this.stateConverterCN(res.data.res);
                        this.pageTotal = res.data.count;
                        this.checkObj = null;
                        this.$store.dispatch({
                            type:'hideLoading'
                        });
                        this.tableData = res.data.res;
                        this.disableOrderTakingButton = true;
                        this.disableRepairButton = true;
                    };
                })
            },
            //获取故障类型
            getSelectFaultTypeEvent(e){
                if(e !== null && e !== undefined){
                    this.formValidate.modalSelectFaultTypeId = e;
                    //根据故障类型id获取故障原因的列表数据
                    this.getFaultTypeListHttp();
                };
            },
            //接单的点击事件
            clickReceiptEvent(){
                if(this.checkObj !== null){
                    //设置维修开始时间和结束时间的权限
                    this.disableRepairOverTime = true;
                    this.editModalStatus = true;
                    this.isOrder = true;
                    this.isFix = false;
                    this.isEdit = false;
                    (async ()=>{
                        try {
                            await this.getDetailHttp();
                            if(this.formValidate.modalRepairStart === null || this.formValidate.modalRepairStart === ''){
                                //赋值维修开始时间为当前时间
                                this.formValidate.modalRepairStart = publicJs.getDate();
                            };
                        }catch (e) {}

                    })()
                }else{
                    this.$Message.warning('请选择操作对象！');
                };
            },
            //维修的点击事件
            clickRePairEvent(){
                if(this.checkObj !== null){
                    //设置维修开始时间和结束时间的权限
                    this.disableRepairOverTime = false;
                    this.isOrder = false;
                    this.isFix = true;
                    this.isEdit = false;
                    //获取详情
                    (async ()=>{
                        try {
                            await this.getDetailHttp();
                            if(this.modalRepairOver === null || this.modalRepairOver === ''){
                                //赋值维修开始时间为当前时间
                                this.modalRepairOver = publicJs.getDate();
                                this.endTime = this.modalRepairOver;                 //包含当天
                                this.endTime = this.endTime.split(' ')[0];           //仅精确到分钟
                                let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                                this.startTimeOptions = {
                                    disabledDate(date) {
                                        return date && date.valueOf() > endTime;
                                    }
                                };
                                this.startTime = publicJs.formatDate(this.formValidate.modalRepairStart);
                                this.startTime = this.startTime.split(' ')[0];           //仅精确到分钟
                                this.endTimeOptions = {
                                    disabledDate: date => {
                                        let startTime = this.startTime ? new Date(this.startTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                                        return date && (date.valueOf() < startTime);
                                    }
                                };
                            };
                        }catch (e) {}
                    })()
                }else{
                    this.$Message.warning('请选择操作对象！');
                };
            },
            getDetailHttp(){
                return this.$fetch(
                    // 'maintain/single/detail/' + this.checkObj.id,
                    api.getMaintainDetail() + this.checkObj.id
                ).then(res=>{
                    if(res.data.status === 200){
                        this.editModalStatus = true;
                        //赋值故障详情
                        this.modalOrder = res.data.res.code;
                        this.modalMachineName = res.data.res.machineName;
                        this.modalWorkshopName = res.data.res.deptName;
                        this.modalProcessName = res.data.res.processName;
                        this.modalRepairName = res.data.res.repairName;
                        this.modalRepairTime = res.data.res.repairTime;
                        this.modalMaintainName = res.data.res.maintainName;
                        this.modalFaultDescribe = res.data.res.faultRemark;
                        this.formValidate.modalRepairDescribe = res.data.res.maintainRemark;
                        this.modalOrderName = res.data.res.orderName;
                        this.modalOrderTime = res.data.res.orderTime;
                        this.modalOrderState = this.onlyOrderStateConverterCN(res.data.res.state);
                        this.formValidate.modalSelectFaultTypeId = res.data.res.faultTypeId;
                        if(res.data.res.maintainBeginTime !== null){
                            this.formValidate.modalRepairStart = publicJs.formatDate(res.data.res.maintainBeginTime);
                            this.startTime = publicJs.formatDate(this.formValidate.modalRepairStart);
                            this.startTime = this.startTime.split(' ')[0];
                            this.endTimeOptions = {
                                disabledDate: date => {
                                    let startTime = this.startTime ? new Date(this.startTime).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
                                    return date && (date.valueOf() < startTime);
                                }
                            };
                        };
                        if(res.data.res.maintainStopTime !== null){
                            this.modalRepairOver = publicJs.formatDate(res.data.res.maintainStopTime);
                            this.endTime = this.modalRepairOver;                 //包含当天
                            this.endTime = this.endTime.split(' ')[0];           //仅精确到分钟
                            let endTime = this.endTime ? new Date(this.endTime).valueOf() : '';
                            this.startTimeOptions = {
                                disabledDate(date) {
                                    return date && date.valueOf() > endTime;
                                }
                            };
                        };
                        /*//编辑
                        if(this.isEdit === true){
                            this.modalRepairOver = res.data.res.maintainStopTime;
                        };*/

                        this.formValidate.isRepair = res.data.res.isDownTime + '';
                        this.formValidate.replacePart = res.data.res.isReplaceParts + '';
                        //根据故障类型id获取故障原因的列表数据
                        this.getFaultTypeListHttp(res.data.res.faultCauseId);
                        this.formValidate.modalFaultCause = res.data.res.faultCauseId+'';
                    };
                })
            },
            onlyOrderStateConverterCN(str){
                if(str === 0){
                    str = '未接单';
                    return str
                }else if(str === 1){
                    str = '维修中';
                    return str
                }else if(str === 2){
                    str = '已完成';
                    return str
                };
            },
            getQueryBarOrderEvent(e){
                if(e !== null && e !== undefined){
                    this.queryBarOrderState = e;
                };
            },
            //获取查询栏的工序
            getQueryBarProcessEvent(e){
                if(e !== null && e !== undefined){
                    this.queryBarProcess = e;
                };
            },
            //获取查询栏的车间
            getQueryBarWorkshopEvent(e){
                if(e !== null && e !== undefined){
                    this.queryBarWorkshop = e;
                };
            },
            //将工单状态转中文
            stateConverterCN(arr){
                arr.forEach((items)=>{
                    if(items.state === 0){
                        items.state = '未接单';
                    }else if(items.state === 1){
                        items.state = '维修中';
                    }else if(items.state === 2){
                        items.state = '已完成';
                    };
                });
                return arr;
            },
            getDefaultWorkshopHttp(){
                this.$fetch(
                    // 'user/workshop',
                    api.getUserWorkshop(),
                ).then(res=>{
                    if(res.data.status === 200){
                        if(res.data.res !== null){
                            this.queryBarWorkshop = res.data.res.id;
                        };
                    };
                })
            },
            //获取每页条数
            getPageOptsEvent(e){
                this.pageSize = e;
                this.searchHttp();
            },
            //获取页码
            getPageCodeEvent(e){
                this.pageIndex = e;
                this.searchHttp();
            },
            //获取勾选的
            getCheckObj(row){
                this.checkObj = row;
                //根据勾选对象的state决定按钮的状态
                if(row !== null){
                    //根据state决定按钮状态
                    this.buttonStatus(row.state);
                }else{
                    this.disableOrderTakingButton = true;
                    this.disableRepairButton = true;
                };

            },
            buttonStatus(status){
                if(status === '未接单'){
                    //未接单
                    this.disableOrderTakingButton = false;
                    this.disableRepairButton = true;
                }else if(status === '维修中'){
                    //维修中
                    this.disableOrderTakingButton = true;
                    this.disableRepairButton = false;
                }else if(status === '已完成'){
                    //已完成
                    this.disableOrderTakingButton = true;
                    this.disableRepairButton = true;
                };
            },
            //编辑的事件
            clickEditButtonEvent(id){
                this.isEdit = true;
                this.isOrder = false;
                this.isFix = false;
                this.checkObj = {
                    id:id
                }
                this.getDetailHttp();
            },
            //删除的事件
            clickDeleteButtonEvent(id){
                this.deleteModalStatus = true;
                this.deleteId = id;
                this.deleteModalMsg = '确认删除？';

            },
            //编辑modal的确认事件
            editConfirmEvent(){

            },
            editCancelEvent(){

            },
            getWorkshopsHttp(){
                //获取所属车间的数据
                this.$fetch(
                    api.getWorkshop(),
                ).then((res)=>{
                    if(res.data.status === 200){
                        res.data.res.forEach((deptObj)=>{
                            deptObj.label = deptObj.name;
                            deptObj.value = deptObj.id;
                        });
                        //赋值新增编辑和筛选栏的所属车间下拉框
                        this.queryBarWorkshopList = res.data.res;
                    };
                })
            },
            getFaultTypeHttp(){
                this.$fetch(
                    api.getFaultType(),
                    {
                        'parentcode':'fault_type'
                    }
                ).then(res=>{
                    if(res.data.status === 200){
                        res.data.res.forEach((items)=>{
                            items.label = items.name;
                            items.value = items.id;
                        })
                        this.modalFaultTypeList = res.data.res;
                    };
                })
            },
            getFaultTypeListHttp(cause){
                this.modalFaultCauseList = [];

                this.$fetch(
                    api.getFaultTypeList(),
                    {
                        faultTypeId:this.formValidate.modalSelectFaultTypeId,
                    }
                ).then(res=>{
                    if(res.data.status === 200){
                        res.data.res.forEach((items)=>{
                            items.label = items.name;
                            items.value = items.id;
                        });
                        this.modalFaultCauseList = res.data.res;
                        this.formValidate.modalFaultCause = cause;

                    };
                });
            },
        },
        created(){
            this.$store.dispatch({
                type:'showLoading'
            });

            //获取故障类型
            this.getFaultTypeHttp();
            //获取工序列表数据
            publicJs.processLevel().then(res=>{
                res.unshift({
                    label:'全部',
                    value:'全部',
                    id:'全部'
                });
                this.queryBarProcessList = res;
                setTimeout(()=>{
                    this.queryBarProcess = '全部';
                },0)
            });
            //获取用户的默认车间
            this.getDefaultWorkshopHttp();
            //获取所有车间
            this.getWorkshopsHttp();
            this.searchHttp();
        },
        mounted(){
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            //120为顶部选项卡和菜单的高度
            this.tableHeight = publicJs.compClientHeight(tableDom.offsetTop + 120 + this.pageHeights);
            //窗口变化事件
            window.onresize = () => {
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                //表格的offsetTop + 菜单的距离 + 分页的高度
                this.tableHeight = publicJs.compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
            };
        }
    }
</script>

<style scoped>
    .modalFaultDetailBar{
        margin-bottom: 16px;
    }
    .modalSubTitle{
        font-weight: bold;
        font-size: 13px;
    }
    .queryModule{
        width:150px;
    }
    .formItemMargin-0{
        margin-bottom: 0;
    }
    .otherBar{
        display: flex;
        justify-content: center;
        color:#b3b2b2;
        margin-top:20px;
    }
    .timeMsgBarLength{
        text-align: left;
        widht:140px;
    }
    .selectBarMargin{
        margin:20px 0;
    }
    .labelFontSize{
        font-size:13px;
    }
    .flexStyle{
        display:flex;
    }
    .searchBtMargin{
        margin-left:4px;
    }
    .labelWidth{
        width:80px;
    }
    .margin-right-10{
        margin-right:10px;
    }
    .queryBarStyle{
        display:flex;
        align-items: center;
    }
</style>
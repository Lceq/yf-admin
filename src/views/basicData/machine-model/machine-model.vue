<template>
    <card>
        <Row class="flexBetween">
            <Col class="leftFlex">
                <Button icon="md-add" class="marginBottom" type="primary" @click="addMachineModel">新增</Button>
                <Button icon="ios-trash" class="marginBottom marginButtonLeft" :disabled="isDelete" type="error" @click="deleteMachineModel">删除</Button>
            </Col>
            <Col>
                <Select clearable class="formWidth marginBottom" v-model="machineModelType" placeholder="请选择设备类别">
                    <Option v-for="item in machineModelTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Button class="marginBottom" type="primary" @click="searchMachineModel">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table size="small" @on-selection-change="changeMachineModel" :height="tableHeight" border :columns="machineModelColumns" :data="machineModelList"></Table>
            </Col>
        </Row>
        <modal
            :isShow="machineModalShow"
            :loading="machineModalLoading"
            :title="machineModalTitle"
            :WarnMsg="machineModalErrorMsg"
            @cancel="machineModalCancel"
            @submit="machineModalSubmit('formMachineModelValidate')">
            <div slot="content">
                <Form :label-width="110" ref="formMachineModelValidate" :model="formMachineModelValidate" :rules="ruleMachineModelValidate" :show-message="false">
                    <FormItem label="机型编码：" prop="modelCode" class="formItemMargin">
                        <Input type="text" v-model="formMachineModelValidate.modelCode" placeholder="请输入机型编码"/>
                    </FormItem>
                    <FormItem label="机型名称：" prop="modelName" class="formItemMargin">
                        <Input type="text" v-model="formMachineModelValidate.modelName" placeholder="请输入机型名称"/>
                    </FormItem>

                    <FormItem label="设备类别：" class="formItemMargin" prop="modelType">
                        <Select v-model="formMachineModelValidate.modelType" @on-change="changeMachineModelType">
                            <Option v-for="item in machineModelTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-if="isProcessExit" label="所属工序：" class="formItemMargin" prop="modelProcess">
                        <Select v-model="formMachineModelValidate.processId" clearable>
                            <Option :style="item.style" v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="运转效率(%)：" prop="runningEfficiency" class="formItemMargin">
                        <InputNumber :min="0" :max="100" v-model="formMachineModelValidate.runningEfficiency" placeholder="请输入运转效率"></InputNumber>
                        <!--<Input type="text" v-model="formMachineModelValidate.runningEfficienency" placeholder="请输入机型名称"/>-->
                    </FormItem>
                    <!--<AboutTime-->
                        <!--:createTime="createTime"-->
                        <!--:createName="createName"-->
                        <!--:reviseTime="reverseTime"-->
                        <!--:reviseName="reverseName"-->
                        <!--:isForbid = "true"-->
                        <!--:forbidName="forbidName"-->
                        <!--:forbidTime="forbidTime"-->
                    <!--&gt;</AboutTime>-->
                    <div v-if="isShowTimeMessage">
                        <other-message
                            :createName="createName"
                            :createTime="createTime"
                            :updateName="reverseName"
                            :updateTime="reverseTime"
                            :closeName="forbidName"
                            :closeTime="forbidTime"
                        >
                        </other-message>
                    </div>
                </Form>
            </div>
        </modal>
        <delete-warning
            :v-model="warnMachineModelShow"
            :tipMsg="warnMachineModelMessage"
            :loading="warnMachineModelLoading"
            @cancel="warnMachineModelCancel"
            @confirm="warnMachineModelConfirm"
        ></delete-warning>
    </card>
</template>
<script>
import deleteWarning from '../../public/deleteWarning';
import modal from '../../public/modal';
import publicJs from '../../../libs/common';
import otherMessage from '../../components/otherMessage';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        otherMessage,
        modal,
        deleteWarning
    },
    data () {
        return {
            tableHeight: document.documentElement.clientHeight - 206,
            machineModelType: '',
            machineModalTitle: '',
            machineModelTypeList: [],
            machineModelList: [],
            machineModelColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '机型编码',
                    key: 'code',
                    sortable: true,
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '机型名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '设备类别',
                    key: 'typeName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '运转效率(%)',
                    key: 'runningEfficiency',
                    align: 'right',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '禁用状态',
                    key: 'enableState',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 180,
                    align: 'center',
                    sortable: true,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.isShowTimeMessage = true;
                                        this.curMachineModelId = params.row.id;
                                        this.getMachineDetail();
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type: params.row.enableState === '禁用' ? 'success' : 'error'
                                },
                                on: {
                                    click: () => {
                                        this.isEnable = true;
                                        this.warnMachineModelMessage = (params.row.enableState === '禁用' ? '确定要启用吗？' : '确定要禁用吗？');
                                        this.curMachineModelId = params.row.id;
                                        this.warnMachineModelShow = true;
                                    }
                                }
                            }, params.row.enableState === '禁用' ? '启用' : '禁用')
                        ]);
                    }
                }
            ],
            // modal
            machineModalShow: false,
            machineModalLoading: false,
            machineModalErrorMsg: '',
            // form表单
            formMachineModelValidate: {
                modelCode: '',
                modelName: '',
                runningEfficiency: 100,
                modelType: '',
                processId: ''
            },
            ruleMachineModelValidate: {
                modelCode: {required: true, validator: xwValidate.code, trigger: 'blur'},
                modelName: {required: true, validator: xwValidate.input, trigger: 'blur'},
                // runningEfficienency: {required: true, trigger: 'blur'},
                modelType: {required: true, validator: xwValidate.select, trigger: 'change'}
            },
            // 时间
            isShowTimeMessage: false,
            createTime: '',
            createName: '',
            reverseTime: '',
            reverseName: '',
            forbidName: '',
            forbidTime: '',
            // 是否显示工序
            processList: [],
            isProcessExit: false,
            // 当前的设备机型Id
            curMachineModelId: '',
            curMachineModelIds: '',
            // 是否显示删除
            isDelete: true,
            // 是否确认删除
            isDeleting: false,
            // 是否禁用
            isEnable: false,
            // 警告提示
            warnMachineModelShow: false,
            warnMachineModelLoading: false,
            warnMachineModelMessage: ''
        };
    },
    methods: {
        // 获取工序列表
        getProcessList () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        },
        // 获取设备机型类别
        getMachineModelType () {
            this.$fetch('dict/list?parentcode=equipment_type').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineModelTypeList = content.res;
                }
            });
        },
        // 获取设备机型数据
        getMachineModel () {
            const _this = this;
            this.$post('model/list', {typeId: this.machineModelType}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.curMachineModelIds = [];
                    _this.machineModelList = content.res.map(x => {
                        x.enableState = x.enableState === 1 ? '启用' : '禁用';
                        return x;
                    });
                    _this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 点击新增的时候
        addMachineModel () {
            this.machineModalTitle = '新增设备机型';
            // 弹出model
            this.isShowTimeMessage = false;
            this.machineModalShow = true;
            // 创建修改人员信息
            this.createTime = '';
            this.createName = '';
            this.reverseTime = '';
            this.reverseName = '';
            this.forbidName = '';
            this.forbidTime = '';
            // 新增的时候默认生产主机
            this.curMachineModelId = null;
            this.isProcessExit = false;
            this.formMachineModelValidate.modelCode = '';
            this.formMachineModelValidate.modelName = '';
            this.formMachineModelValidate.runningEfficiency = 100;
            this.formMachineModelValidate.modelType = '';
            this.formMachineModelValidate.processId = '';
        },
        // 选中项发生变化时
        changeMachineModel (val) {
            this.curMachineModelIds = val.map(x => x.id);
            if (val.length) this.isDelete = false;
            else this.isDelete = true;
        },
        // 删除设备机型的时候
        deleteMachineModel () {
            this.isDeleting = true;
            this.warnMachineModelMessage = '确定要删除吗？';
            this.warnMachineModelShow = true;
        },
        // 搜索设备机型的时候
        searchMachineModel () {
            this.getMachineModel();
        },
        // 编辑---获取机型详情
        getMachineDetail () {
            this.$post('model/detail/id', {id: this.curMachineModelId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineModalTitle = content.res.auditState === 3 ? '设备机型详情' : '编辑设备机型';
                    this.formMachineModelValidate.modelCode = content.res.code;
                    this.formMachineModelValidate.modelName = content.res.name;
                    this.formMachineModelValidate.runningEfficiency = content.res.runningEfficiency;
                    this.formMachineModelValidate.modelType = content.res.typeId;
                    this.formMachineModelValidate.processId = content.res.processId;
                    this.isProcessExit = content.res.typeName === '生产主机';
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.reverseTime = content.res.updateTime;
                    this.reverseName = content.res.updateName;
                    this.forbidName = content.res.enableName;
                    this.forbidTime = content.res.enableTime;
                    this.machineModalShow = true;
                }
            });
        },
        // 取消modal
        machineModalCancel () {
            this.machineModalShow = false;
        },
        // 确认modal
        machineModalSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curMachineModelId === null ? null : this.curMachineModelId,
                        name: this.formMachineModelValidate.modelName,
                        runningEfficiency: this.formMachineModelValidate.runningEfficiency,
                        code: this.formMachineModelValidate.modelCode,
                        typeId: this.formMachineModelValidate.modelType,
                        typeName: this.machineModelTypeList.find(x => x.id === this.formMachineModelValidate.modelType).name,
                        processId: this.formMachineModelValidate.processId !== '' ? this.formMachineModelValidate.processId : '',
                        processName: this.formMachineModelValidate.processId !== '' ? this.processList.find(x => x.id === this.formMachineModelValidate.processId).name : '',
                        processCode: this.formMachineModelValidate.processId !== '' ? this.processList.find(x => x.id === this.formMachineModelValidate.processId).code : ''
                    };
                    this.$post('model/save', params).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.getMachineModel();
                            this.$Message.success('保存成功');
                            this.machineModalShow = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // 改变设备机型的状态
        changeMachineModelType (val) {
            // console.log(val);
            if (val === '' || val === undefined || this.machineModelTypeList.find(x => x.id === val).name === '辅助设备') {
                this.isProcessExit = false;
                this.formMachineModelValidate.processId = '';
            } else {
                this.isProcessExit = true;
                this.formMachineModelValidate.processId = '';
            }
        },
        // 警告提示-----取消
        warnMachineModelCancel () {
            this.isDeleting = false;
            this.warnMachineModelShow = false;
        },
        // 警告提示-----确定
        warnMachineModelConfirm () {
            if (this.isDeleting) {
                this.warnMachineModelLoading = true;
                this.$post('model/delete', this.curMachineModelIds).then(res => {
                    let content = res.data;
                    this.isDeleting = false;
                    this.warnMachineModelLoading = false;
                    if (content.status === 200) {
                        this.warnMachineModelShow = false;
                        this.getMachineModel();
                        this.$Message.error('删除成功');
                    }
                });
            }
            if (this.isEnable) {
                this.warnMachineModelLoading = true;
                this.$post('model/disable/' + this.curMachineModelId).then(res => {
                    let content = res.data;
                    this.isEnable = false;
                    this.warnMachineModelLoading = false;
                    if (content.status === 200) {
                        this.warnMachineModelShow = false;
                        this.getMachineModel();
                        this.$Message.success('操作成功');
                    }
                });
            }
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getProcessList();
        // 获取设备机型样式
        this.getMachineModelType();
        // 获取设备机型数据
        this.getMachineModel();
    },
    mounted () {
        // 窗口变化事件
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(206);
        };
    }
};
</script>


<style scoped>
</style>

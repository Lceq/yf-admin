import { page } from '../../../libs/tools';
import modal from '../../public/modal';
import {auditStateList} from '../../../libs/utilState';
import otherMessage from '../../components/otherMessage';
import deleteWarning from '../../public/deleteWarning';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';
import xwValidate from '@/libs/xwValidate';
import xwSelectMachineQuality from '../../components/xw-select-machine/xw-select-machine-barrel';
export default ({
    components: {
        xwSelectMachineQuality,
        xwOperationLogModal,
        modal,
        otherMessage,
        deleteWarning
    },
    data () {
        return {
            isPosition: false,
            // auditStateList: auditStateList,
            isEdit: false,
            auditDisabled: true,
            curAuditStateId: '',
            auditStateList: auditStateList,
            barrelCode: '',
            tableHeight: '',
            curBarrelId: '',
            barrelColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '下机筒位编码',
                    key: 'code',
                    sortable: true,
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    // this.isEdit = true;
                                    this.curBarrelId = params.row.id;
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.getBarrelDetail(params.row.id);
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '下机筒位名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '对应机台',
                    key: 'machineName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '所属车间',
                    key: 'workshopName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '控制器IP',
                    key: 'controllerIp',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '天线编号',
                    key: 'antennaNumber',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '数据状态',
                    key: 'auditStateName',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, auditStateList.find(x => x.id === params.row.auditState).name);
                    }
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'left',
                    sortable: true,
                    minWidth: 130
                }
            ],
            barrelList: [],
            barrelTotal: 0,
            barrelPageOpts: page().pageOpts,
            barrelPageSize: page().pageSize,
            isShow: false,
            loading: false,
            title: '',
            isCouldSave: false,
            warnMsg: '',
            formValidate: {
                code: '',
                name: '',
                antennaNumber: 8,
                auditState: 1,
                auditStateName: '创建',
                selectMachineCode: null,
                controllerIp: '',
                processName: '',
                workshopName: ''
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                selectMachineCode: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                controllerIp: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                antennaNumber: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
            deleteWarnShow: false,
            deleteWarnLoading: false,
            isCouldDelete: false,
            deleteWarnMsg: '',
            curWorkshopId: null,
            codeName: '',
            workshopList: [],
            curBarrelIds: []
        };
    },
    methods: {
        addNewBarrel () {
            this.curBarrelId = null;
            this.isShow = true;
            this.isCouldSave = true;
            this.title = '新增下机筒位档案';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.$refs['formValidate'].resetFields();
            this.formValidate.selectMachineCode = '';
            this.formValidate.antennaNumber = 8;
            this.formValidate.controllerIp = '';
            this.formValidate.auditState = 1;
            this.formValidate.auditStateName = '创建';
            this.formValidate.workshopName = '';
            this.formValidate.processName = '';
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
        },
        getBarrelList () {
            let params = {
                workshopId: this.curWorkshopId,
                auditState: this.curAuditStateId,
                codeName: this.codeName,
                pageSize: this.barrelPageSize,
                pageIndex: this.barrelPageIndex
            };
            this.$call('position.lower.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.barrelTotal = content.count;
                    this.barrelList = content.res;
                    this.curBarrelIds = [];
                    this.auditDisabled = true;
                }
            });
        },
        auditBarrel () {
            this.$call('position.lower.approve', this.curBarrelIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getBarrelList();
                }
            });
        },
        unAuditBarrel () {
            this.$call('position.lower.unapprove', this.curBarrelIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getBarrelList();
                }
            });
        },
        deleteBarrel () {
            if (this.isCouldDelete) {
                this.$Modal.warning({
                    title: '提示',
                    content: '存在已审核的数据，不能进行删除'
                });
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确认要删除吗？';
            }
        },
        searchBarrelList () {
            this.barrelPageIndex = 1;
            setTimeout(() => {
                this.barrelTotal = 0;
            }, 0);
            this.getBarrelList();
        },
        selectBarrel (val) {
            if (val.length > 0) {
                this.curBarrelIds = val.map(x => x.id);
                this.isCouldDelete = val.find(x => x.auditState === 3) ? true : false;
                this.auditDisabled = false;
            } else {
                this.curBarrelIds = [];
                this.isCouldDelete = false;
                this.auditDisabled = true;
            }
        },
        changePageIndex (val) {
            this.barrelPageIndex = val;
            this.getBarrelList();
        },
        changePageSize (val) {
            this.barrelPageSize = val;
            this.getBarrelList();
        },
        getBarrelDetail (id) {
            this.$call('position.lower.detail', {'id': id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$refs['formValidate'].resetFields();
                    this.curBarrelId = content.res.id;
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.selectMachineCode = content.res.machineName + ' (' + content.res.machineCode + ')';
                    this.formValidate.controllerIp = content.res.controllerIp;
                    this.formValidate.workshopId = content.res.workshopId;
                    this.formValidate.workshopName = content.res.workshopName;
                    this.formValidate.antennaNumber = content.res.antennaNumber;
                    this.formValidate.machineId = content.res.machineId;
                    this.formValidate.machineName = content.res.machineName;
                    this.formValidate.machineCode = content.res.machineCode;
                    this.formValidate.processId = content.res.processId;
                    this.formValidate.processName = content.res.processName;
                    this.formValidate.auditState = content.res.auditState;
                    this.formValidate.auditStateName = auditStateList.find(x => x.id === content.res.auditState).name;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.isShow = true;
                    this.title = content.res.auditState === 3 ? '下机筒位档案详情' : '编辑下机筒位档案';
                }
            });
        },
        submit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curBarrelId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        workshopId: this.formValidate.curWorkshopId,
                        workshopName: this.workshopList.find(x => x.deptId === this.formValidate.curWorkshopId).deptName,
                        auditState: this.formValidate.auditState,
                        processId: this.formValidate.processId,
                        processName: this.formValidate.processName,
                        processCode: this.formValidate.processCode,
                        controllerIp: this.formValidate.controllerIp,
                        antennaNumber: this.formValidate.antennaNumber,
                        machineId: this.formValidate.machineId,
                        machineName: this.formValidate.machineName,
                        machineCode: this.formValidate.machineCode
                    };
                    this.$call('position.lower.save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.isShow = false;
                            this.formValidate.selectMachineCode = null;
                            this.$Message.success('保存成功');
                            this.getBarrelList();
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        cancel () {
            this.formValidate.selectMachineCode = null;
            this.isShow = false;
        },
        selectMachine (val) {
            if (val) {
                this.formValidate.selectMachineCode = val.name + ' (' + val.code + ')';
                this.formValidate.machineId = val.id;
                this.formValidate.processId = val.processId;
                this.formValidate.processCode = val.processCode;
                this.formValidate.processName = val.processName;
                this.formValidate.machineCode = val.code;
                this.formValidate.machineName = val.name;
                this.formValidate.workshopId = val.deptId;
                this.formValidate.workshopName = val.deptName;
            } else {
                this.formValidate.selectMachineCode = '1';
                this.formValidate.machineId = null;
                this.formValidate.machineName = null;
                this.formValidate.machineCode = null;
                this.formValidate.productId = null;
                this.formValidate.processId = null;
                this.formValidate.processCode = '';
                this.formValidate.processName = '';
                this.formValidate.workshopId = '';
                this.formValidate.workshopName = '';
            }
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
            this.deleteWarnLoading = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$call('position.lower.delete', this.curBarrelIds).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getBarrelList();
                }
            });
        },
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.curWorkshopId = res.curWorkshopId;
                this.formValidate.curWorkshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getBarrelList();
            });
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.$nextTick(() => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        };
    }
});

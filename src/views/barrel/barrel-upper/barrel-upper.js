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
            isPosition: true,
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
                    title: '机台编码',
                    key: 'machineCode',
                    sortable: true,
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.curBarrelId = params.row.id;
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.getBarrelDetail(params.row.id);
                                }
                            }
                        }, params.row.machineCode);
                    }
                },
                {
                    title: '机台名称',
                    key: 'machineName',
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
                    title: '所属车间',
                    key: 'workshopName',
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
                auditState: 1,
                auditStateName: '创建',
                workshopName: '',
                processName: '',
                leftControllerIp: '',
                rightControllerIp: '',
                leftBarrelNumber: 8,
                rightBarrelNumber: 8,
                selectMachineCode: null
            },
            ruleValidate: {
                selectMachineCode: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                leftControllerIp: [
                    {required: true, validator: xwValidate.IP, trigger: 'blur'}
                ],
                rightControllerIp: [
                    {required: true, validator: xwValidate.IP, trigger: 'blur'}
                ],
                leftBarrelNumber: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                rightBarrelNumber: [
                    {required: true, validator: xwValidate.select, trigger: 'blur'}
                ]
            },
            name1: 'name1',
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
            deleteWarnShow: false,
            deleteWarnLoading: false,
            deleteWarnMsg: '',
            curWorkshopId: null,
            codeName: '',
            workshopList: [],
            curBarrelIds: [],
            selectMachineCode: null,
            processList: [],
            leftBarrelList: [],
            rightBarrelList: [],
            leftBarrelColumns: [
                {
                    title: '上机筒位编号',
                    key: 'positionNumber',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '天线编号',
                    key: 'antennaNumber',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                min: 0,
                                value: params.row.antennaNumber
                            },
                            on: {
                                'on-change': (val) => {
                                    // debugger
                                    if (this.name1 === 'name1') {
                                        this.leftBarrelList[params.index].antennaNumber = val;
                                    } else {
                                        this.rightBarrelList[params.index].antennaNumber = val;
                                    }
                                }
                            }
                        });
                    }
                }
            ],
            isCouldDelete: false
        };
    },
    methods: {
        addNewBarrel () {
            this.name1 = 'name1';
            this.curBarrelId = null;
            this.isShow = true;
            this.isCouldSave = true;
            this.title = '新增上机筒位档案';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.auditState = 1;
            this.formValidate.auditStateName = '创建';
            this.formValidate.workshopName = '';
            this.formValidate.processName = '';
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
            this.formValidate.selectMachineCode = '';
            // this.formValidate.selectMachineCode = null;
            this.formValidate.leftBarrelNumber = 8;
            this.formValidate.rightBarrelNumber = 8;
            this.formValidate.leftControllerIp = '';
            this.formValidate.rightControllerIp = '';
            this.leftBarrelList = this.getDataList(this.formValidate.leftBarrelNumber);
            this.rightBarrelList = this.getDataList(this.formValidate.rightBarrelNumber);
            this.formValidate.curProcessId = null;
            this.formValidate.machineId = null;
        },
        getBarrelList () {
            let params = {
                workshopId: this.curWorkshopId,
                auditState: this.curAuditStateId,
                codeName: this.codeName,
                pageSize: this.barrelPageSize,
                pageIndex: this.barrelPageIndex
            };
            this.$call('position.upper.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.barrelList = content.res;
                    this.barrelTotal = content.count;
                    this.curBarrelIds = [];
                    this.auditDisabled = true;
                }
            });
        },
        auditBarrel () {
            this.$call('position.upper.approve', this.curBarrelIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getBarrelList();
                }
            });
        },
        unAuditBarrel () {
            this.$call('position.upper.unapprove', this.curBarrelIds).then(res => {
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
            this.$call('position.upper.detail', {'id': id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.curBarrelId = content.res.id;
                    this.formValidate.machineId = content.res.machineId;
                    this.formValidate.machineCode = content.res.machineCode;
                    this.formValidate.machineName = content.res.machineName;
                    this.formValidate.curWorkshopId = content.res.workshopId;
                    this.formValidate.workshopName = content.res.workshopName;
                    this.formValidate.processId = content.res.processId;
                    this.formValidate.processCode = content.res.processCode;
                    this.formValidate.processName = content.res.processName;
                    this.formValidate.selectMachineCode = content.res.machineName + ' (' + content.res.machineCode + ')';
                    this.formValidate.leftBarrelNumber = content.res.leftBarrelNumber;
                    this.formValidate.rightBarrelNumber = content.res.rightBarrelNumber;
                    this.formValidate.leftControllerIp = content.res.leftControllerIp;
                    this.formValidate.rightControllerIp = content.res.rightControllerIp;
                    this.formValidate.auditState = content.res.auditState;
                    this.formValidate.auditStateName = auditStateList.find(x => x.id === content.res.auditState).name;
                    // this.colorValue = content.res.colorValue;
                    this.leftBarrelList = content.res.positionUpperDetailList.filter(x => x.side === 0);
                    this.rightBarrelList = content.res.positionUpperDetailList.filter(x => x.side === 1);
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.isShow = true;
                    this.title = content.res.auditState === 3 ? '上机筒位档案详情' : '编辑上机筒位档案';
                }
            });
        },
        submit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curBarrelId,
                        machineId: this.formValidate.machineId,
                        machineCode: this.formValidate.machineCode,
                        machineName: this.formValidate.machineName,
                        processId: this.formValidate.processId,
                        processCode: this.formValidate.processCode,
                        processName: this.formValidate.processName,
                        workshopId: this.formValidate.curWorkshopId,
                        workshopName: this.workshopList.find(x => x.deptId === this.formValidate.curWorkshopId).deptName,
                        auditState: this.formValidate.auditState,
                        leftBarrelNumber: this.formValidate.leftBarrelNumber,
                        rightBarrelNumber: this.formValidate.rightBarrelNumber,
                        rightControllerIp: this.formValidate.rightControllerIp,
                        leftControllerIp: this.formValidate.leftControllerIp,
                        positionUpperDetailList: this.leftBarrelList.map(x => {
                            x.id = null;
                            x.side = 0;
                            return x;
                        }).concat(this.rightBarrelList.map(y => {
                            y.id = null;
                            y.side = 1;
                            return y;
                        }))
                    };
                    this.$call('position.upper.save', params).then(res => {
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
        deleteWarnCancel () {
            this.deleteWarnShow = false;
            this.deleteWarnLoading = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$call('position.upper.delete', this.curBarrelIds).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getBarrelList();
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$call('process.list', {
                auditState: 3,
                state: 1,
                isPositionUpper: true
            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = res;
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
        },
        selectMachine (val) {
            // debugger
            if (val.id) {
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
        changeLeftBarrelNumber (val) {
            this.formValidate.leftBarrelNumber = val;
            this.leftBarrelList = this.getDataList(val);
        },
        changeRightBarrelNumber (val) {
            this.formValidate.rightBarrelNumber = val;
            this.rightBarrelList = this.getDataList(val);
        },
        getDataList (val) {
            let data = [];
            let i = 0;
            while (i < val) {
                data.push({
                    positionNumber: i + 1,
                    antennaNumber: i
                });
                i++;
            }
            return data;
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.getProcessList();
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

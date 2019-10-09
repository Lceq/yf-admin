import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import deleteWarning from '../../public/deleteWarning';
// import {auditStateList} from '../../../libs/utilState';
import {auditStateList} from '../../../libs/utilState';
import xwValidate from '@/libs/xwValidate';
export default ({
    components: {
        otherMessage,
        deleteWarning,
        modal
    },
    data () {
        return {
            auditDisabled: true,
            auditDisabledTwo: true,
            isDelete: false,
            isDisabled: false,
            isShowUserMessage: false,
            processColumns: [],
            processColumnsList: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '操作',
                    fixed: 'left',
                    key: 'operation',
                    align: 'center',
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    disabled: params.row.auditState === 3,
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.curProcessId = params.row.id;
                                        this.isDelete = true;
                                        this.isDisabled = false;
                                        this.isEnable = false;
                                        this.deleteWarnMsg = '确定要删除吗？';
                                        // debugger
                                        this.deleteWarnShow = true;
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    disabled: params.row.auditState !== 3,
                                    size: 'small'
                                },
                                style: {
                                },
                                on: {
                                    click: () => {
                                        this.curProcessId = params.row.id;
                                        this.isDelete = false;
                                        this.isDisabled = true;
                                        if (params.row.state === 1) {
                                            this.isEnable = false;
                                            this.isDisabled = true;
                                        } else {
                                            this.isEnable = true;
                                            this.isDisabled = false;
                                        }
                                        this.deleteWarnMsg = '确定要' + (params.row.state === 1 ? '禁用' : '启用') + '吗？';
                                        this.deleteWarnShow = true;
                                    }
                                }
                            }, params.row.state === 1 ? '禁用' : '启用')
                        ]);
                    }
                },
                {
                    title: '工序编码',
                    key: 'code',
                    fixed: 'left',
                    sortable: true,
                    minWidth: 180
                },
                {
                    title: '工序名称',
                    key: 'name',
                    fixed: 'left',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                on: {
                                    click: () => {
                                        if (params.row.auditState === 3) {
                                            this.isCouldSave = false;
                                        } else {
                                            this.isCouldSave = true;
                                        }
                                        this.isEdit = true;
                                        this.curProcessId = params.row.id;
                                        this.getProcessDetail();
                                    }
                                }
                            }, params.row.name)
                        ]);
                    }
                },
                {
                    title: '所属工段',
                    key: 'typeName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '是否有子工序',
                    key: 'hasChildren',
                    align: 'center',
                    sortable: true,
                    secoundItem: true,
                    minWidth: 130
                },
                {
                    title: '是否报工',
                    key: 'isReport',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('span', {}, params.row.isReport === true ? '是' : (params.row.isReport === false ? '否' : null));
                    }
                },
                {
                    title: '是否配棉',
                    key: 'isFeeding',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('span', {}, params.row.isFeeding === true ? '是' : (params.row.isFeeding === false ? '否' : null));
                    }
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '禁用状态',
                    key: 'stateMean',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                }
            ],
            processData: [],
            tableHeight: '',
            tableLoading: false,
            //
            processTypeList: [],
            processShow: false,
            processLoading: false,
            isCouldSave: true,
            processTitle: '',
            processMsg: '',
            formValidate: {
                code: '',
                name: '',
                isFeeding: '',
                isPositionUpper: '',
                isPositionLower: '',
                isReport: '',
                parentProcessId: '',
                processType: ''
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                parentProcessId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                processType: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            isEdit: false,
            curProcessValue: [],
            curProcessIds: [],
            name: '1',
            parentProcess: [],
            isParentProcess: true,
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            auditName: '',
            auditTime: '',
            auditStateList: auditStateList,
            //
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false
        };
    },
    methods: {
        clickProcessTab (val) {
            this.$refs['formValidate'].resetFields();
            this.curProcessValue = [];
            this.curProcessIds = [];
            this.auditDisabled = true;
            this.createName = '';
            this.createTime = '';
            this.updateTime = '';
            this.updateName = '';
            this.auditName = '';
            this.auditTime = '';
            if (val === '1') {
                this.tableLoading = true;
                this.isParentProcess = true;
                this.processColumns = this.processColumnsList;
                this.processData = this.processDataBasic.filter(x => x.parentId === 0);
                this.tableLoading = false;
            }
            if (val === '2') {
                this.tableLoading = true;
                this.isParentProcess = false;
                this.processColumns = this.processColumnsList.filter(item => item.secoundItem === undefined);
                this.processData = this.processDataBasic.filter(x => x.parentId !== 0);
                this.tableLoading = false;
            }
        },
        addNewProcess (type) {
            this.$refs['formValidate'].resetFields();
            this.isEdit = false;
            this.isShowUserMessage = false;
            this.isCouldSave = true;
            if (type === 'one') {
                this.processTitle = '新增一级工序';
            }
            if (type === 'two') {
                this.processTitle = '新增二级工序';
            }
            this.curProcessId = null;
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.processType = '';
            this.formValidate.parentProcessId = '';
            this.formValidate.isReport = 'true';
            this.formValidate.isFeeding = 'false';
            this.formValidate.isPositionUpper = 'false';
            this.formValidate.isPositionLower = 'false';
            this.formValidate.sortNum = null;
            this.formValidate.isChildren = false;
            this.processShow = true;
        },
        auditProcess () {
            // let vals = this.curProcessValue;
            this.$api.process.getProcessApprove(this.curProcessIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getProcessList();
                }
            });
        },
        unAuditProcess () {
            this.$api.process.getProcessUnApprove(this.curProcessIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('反审核成功');
                    this.getProcessList();
                }
            });
        },
        getProcessDetail () {
            this.$api.process.getProcessDetail({id: this.curProcessId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.isReport = content.res.isReport + '';
                    this.formValidate.isFeeding = content.res.isFeeding + '';
                    this.formValidate.isPositionLower = content.res.isPositionLower + '';
                    this.formValidate.isPositionUpper = content.res.isPositionUpper + '';
                    this.formValidate.processType = content.res.typeId;
                    this.formValidate.parentProcessId = content.res.parentId;
                    this.formValidate.sortNum = content.res.sortNum;
                    this.formValidate.isChildren = content.res.hasChildren;
                    //
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.isShowUserMessage = true;
                    this.auditName = content.res.auditState === 3 ? content.res.auditName : '';
                    this.auditTime = content.res.auditTime;
                    // this.processTitle = (this.isParentProcess) ? '编辑一级工序' : '编辑二级工序';
                    this.processTitle = this.isParentProcess ? (content.res.auditState === 3 ? '一级工序详情' : '编辑一级工序') : (content.res.auditState === 3 ? '二级工序详情' : '编辑二级工序');
                    this.processShow = true;
                }
            });
        },
        selectProcess (val) {
            if (val.length > 0) {
                this.curProcessValue = val;
                this.curProcessIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curProcessValue = [];
                this.curProcessIds = [];
                this.auditDisabled = true;
            }
        },
        getProcessList () {
            this.$api.process.getProcessList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processDataBasic = content.res.map(item => {
                        item.auditStateMean = item.auditState ? auditStateList.find(x => x.id === item.auditState).name : null;
                        item.hasChildren = item.hasChildren ? '是' : '否';
                        item.stateMean = item.state ? '启用' : '禁用';
                        return item;
                    });
                    this.parentProcess = this.processDataBasic.filter(x => x.parentId === 0 && x.auditState === 3 && x.hasChildren === '是' && x.state === 1);
                    if (this.name === '1') {
                        this.processData = this.processDataBasic.filter(x => x.parentId === 0);
                    }
                    if (this.name === '2') {
                        this.processData = this.processDataBasic.filter(x => x.parentId !== 0);
                    }
                    this.auditDisabled = true;
                }
            });
        },
        processSubmit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curProcessId,
                        name: this.formValidate.name,
                        code: this.formValidate.code,
                        sortNum: this.formValidate.sortNum,
                        isReport: this.formValidate.isReport,
                        isFeeding: this.formValidate.isFeeding,
                        isPositionLower: this.formValidate.isPositionLower,
                        isPositionUpper: this.formValidate.isPositionUpper,
                        typeName: this.isParentProcess ? ((this.formValidate.processType === '' ? '' : this.processTypeList.find(x => x.id === this.formValidate.processType).name)) : this.processDataBasic.find(x => x.id === this.formValidate.parentProcessId).typeName,
                        typeId: this.isParentProcess ? ((this.formValidate.processType === '' ? '' : this.formValidate.processType)) : this.processDataBasic.find(x => x.id === this.formValidate.parentProcessId).typeId,
                        parentCode: this.isParentProcess ? null : this.parentProcess.find(x => x.id === this.formValidate.parentProcessId).code,
                        parentId: this.isParentProcess ? 0 : this.formValidate.parentProcessId,
                        hasChildren: this.isParentProcess ? this.formValidate.isChildren : false
                    };
                    this.$api.process.getProcessSave(params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.processShow = false;
                            this.getProcessList();
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        processCancel () {
            this.processShow = false;
        },
        getProcessTypeList () {
            this.$api.dictionary.getProcessType().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processTypeList = content.res;
                }
            });
        },
        deleteWarnCancel () {
            this.isDelete = false;
            this.isDisabled = false;
            this.isEnable = false;
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            if (this.isDelete) {
                this.deleteWarnLoading = true;
                this.$api.process.getProcessDelete({id: this.curProcessId}).then(res => {
                    let content = res.data;
                    this.deleteWarnLoading = false;
                    if (content.status === 200) {
                        this.getProcessList();
                        this.$Message.success('删除成功');
                    }
                });
            }
            if (this.isDisabled) {
                this.deleteWarnLoading = true;
                this.$api.process.getProcessDisable({id: this.curProcessId}).then(res => {
                    let content = res.data;
                    this.deleteWarnLoading = false;
                    if (content.status === 200) {
                        this.getProcessList();
                        this.$Message.success('禁用成功');
                    }
                });
            }
            if (this.isEnable) {
                this.deleteWarnLoading = true;
                this.$api.process.getProcessEnable({id: this.curProcessId}).then(res => {
                    let content = res.data;
                    this.deleteWarnLoading = false;
                    if (content.status === 200) {
                        this.getProcessList();
                        this.$Message.success('取消禁用成功');
                    }
                });
            }
            this.isDelete = false;
            this.isDisabled = false;
            this.isEnable = false;
            this.deleteWarnShow = false;
        }
    },
    created () {
        this.processColumns = this.processColumnsList;
        this.getProcessTypeList();
        this.getProcessList();
    },
    mounted () {
        this.$nextTick(() => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 170;
            }
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 170;
            }
        };
    }
});

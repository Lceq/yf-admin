import {page} from '../../../libs/tools';
import modal from '../../public/modal';
import {auditStateList} from '../../../libs/utilState';
import otherMessage from '../../components/otherMessage';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
import xwOperationLog from '../../components/xw-operation-log/xw-operation-log-modal';
export default ({
    components: {
        modal,
        otherMessage,
        deleteWarning,
        xwOperationLog
    },
    data () {
        return {
            auditStateList: auditStateList,
            faultTypeList: [],
            faultTypeId: '',
            auditDisabled: false,
            auditState: '',
            nameCode: '',
            tableHeight: '',
            typeColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '故障编码',
                    key: 'code',
                    sortable: true,
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.curTypeId = params.row.id;
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.getTypeDetail(params.row.id);
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '故障别名',
                    key: 'alias',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '故障描述',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '故障小类',
                    key: 'faultSubclassName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '故障类别',
                    key: 'faultTypeName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '状态',
                    key: 'auditState',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.auditState === 1 ? '创建' : (params.row.auditState === 3 ? '已审核' : ' '));
                    }
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'left',
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
            typeData: [],
            typeTotal: 0,
            pageOpts: page().pageOpts,
            pageSize: page().pageSize,
            pageIndex: 1,
            typeShow: false,
            typeLoading: false,
            typeTitle: '',
            isCouldSave: true,
            isEdit: false,
            typeMsg: '',
            colorValue: '',
            formValidate: {
                code: '',
                name: '',
                alias: '',
                faultTypeId: '',
                faultSubclassId: '',
                processId: '',
                auditState: 1,
                faultSubList: []
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                faultTypeId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                alias: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                faultSubclassId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                processId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            processId: '',
            processList: [],
            typeList: [],
            testTypeList: [],
            selectedIds: [],
            selectedVal: [],
            operationList: [],
            postList: [],
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            curTypeId: '',
            faultSubId: '',
            faultSubList: []
        };
    },
    methods: {
        getProcess () {
            let params = {
                auditState: 3,
                state: 1
            };
            this.$call('process.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = content.res;
                }
            });
        },
        getFaultTypeList () {
            this.$call('dict.list', {parentCode: 'fault_type'}).then(res => {
                if (res.data.status === 200) {
                    this.faultTypeList = res.data.res;
                }
            });
        },
        getFaultSubList () {
            let params = {
                faultTypeId: this.faultTypeId,
                auditState: 3
            };
            this.$call('fault.subclass.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultSubList = content.res;
                }
            });
        },
        getTypeList () {
            let params = {
                nameCode: this.nameCode,
                faultTypeId: this.faultTypeId,
                auditState: this.auditState,
                processId: this.processId,
                faultSubclassId: this.faultSubId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('fault.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.typeTotal = content.count;
                    this.typeData = content.res;
                    this.selectedIds = [];
                    this.selectedVal = [];
                }
            });
        },
        changeType (val) {
            this.formValidate.qmTypeList = val;
            this.formValidate.qmTypeIds = [];
            this.formValidate.qmSpinningTypeList = [];
            this.testTypeList = val;
        },
        changeFaultType (val) {
            this.getFaultSubList();
        },
        changeQmType (val) {
            this.formValidate.qmSpinningTypeList = val;
        },
        getPostList () {
            this.$call('post.list', {typeCode: 'PT02', auditState: 3}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.postList = content.res;
                }
            });
        },
        getTypeDetail (val) {
            this.$call('fault.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isEdit = true;
                    this.typeTitle = content.res.auditState === 3 ? '故障信息详情' : '编辑故障信息';
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.alias = content.res.alias;
                    this.formValidate.faultTypeId = content.res.faultTypeId;
                    this.formValidate.faultTypeCode = content.res.faultTypeCode;
                    this.formValidate.faultTypeName = content.res.faultTypeName;
                    this.formValidate.processId = content.res.processId;
                    // this.formValidate.faultSubclassId = content.res.faultSubclassId;
                    this.changeFaultTypeModal(content.res.faultSubclassId);
                    this.formValidate.auditState = content.res.auditState;
                    this.typeShow = true;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                }
            });
        },
        addNewType () {
            this.$refs['formValidate'].resetFields();
            this.typeTitle = '新增故障信息';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.alias = '';
            this.formValidate.faultTypeId = '';
            this.formValidate.faultSubclassId = '';
            this.formValidate.processId = '';
            this.formValidate.auditState = 1;
            this.isCouldSave = true;
            this.typeShow = true;
            this.isEdit = false;
            this.curTypeId = '';
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
        },
        auditType () {
            this.$call('fault.approve', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTypeList();
                    this.$Message.success('审核成功');
                }
            });
        },
        unAuditType () {
            this.$call('fault.unapprove', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTypeList();
                    this.$Message.success('撤销审核成功');
                }
            });
        },
        deleteType () {
            if (this.selectedIds.length === this.selectedVal.length) {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除嘛？';
            } else {
                this.$Message.error('包含已审核数据，不能删除！');
                return false;
            }
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('fault.delete', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTypeList();
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                }
            });
        },
        searchTypeList () {
            this.getTypeList();
        },
        selectType (val) {
            this.selectedIds = val.map(x => x.id);
            this.selectedVal = val.filter(x => x.auditState === 1);
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getTypeList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getTypeList();
        },
        typeSubmit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curTypeId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        alias: this.formValidate.alias,
                        faultTypeId: this.formValidate.faultTypeId,
                        faultTypeCode: this.faultTypeList.find(y => y.id === this.formValidate.faultTypeId).code,
                        faultTypeName: this.faultTypeList.find(y => y.id === this.formValidate.faultTypeId).name,
                        faultSubclassName: this.formValidate.faultSubList.find(y => y.id === this.formValidate.faultSubclassId).name,
                        faultSubclassId: this.formValidate.faultSubclassId,
                        processId: this.formValidate.processId,
                        processCode: this.processList.find(y => y.id === this.formValidate.processId).code,
                        processName: this.processList.find(y => y.id === this.formValidate.processId).name
                    };
                    this.typeLoading = true;
                    this.$call('fault.save', params).then(res => {
                        let content = res.data;
                        this.typeLoading = false;
                        if (content.status === 200) {
                            this.typeShow = false;
                            this.getTypeList();
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        typeCancel () {
            this.typeShow = false;
        },
        changeFaultTypeModal (val) {
            let params = {
                faultTypeId: this.formValidate.faultTypeId,
                auditState: 3
            };
            this.$call('fault.subclass.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.faultSubList = content.res;
                    if (val) {
                        this.formValidate.faultSubclassId = val;
                    }
                }
            });
        }
    },
    mounted () {
        this.getFaultTypeList();
        this.getProcess();
        this.getPostList();
        this.getFaultSubList();
        this.getTypeList();
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 120;
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 120;
        };
    }
});

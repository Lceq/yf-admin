import {page} from "../../../libs/tools";
import modal from '../../public/modal';
// import {auditStateList} from '../../../libs/utilState';
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
            auditDisabled: false,
            curAuditStateId: '',
            auditStateList: [],
            typeCode: '',
            tableHeight: '',
            typeColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '工序编码',
                    key: 'processCode',
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
                        }, params.row.processCode);
                    }
                },
                {
                    title: '工序名称',
                    key: 'processName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '质检类别',
                    key: 'qmTypeList',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.qmTypeList.map(x => x.qmTypeName).toString());
                    }
                },
                {
                    title: '试纺质检类别',
                    key: 'qmSpinningTypeList',
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.qmSpinningTypeList.map(x => x.qmTypeName).toString());
                    }
                },
                {
                    title: '数据状态',
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
                processId: '',
                typeIds: [],
                qmTypeIds: []
            },
            ruleValidate: {
                processId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                typeIds: [
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
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            curTypeId: ''
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
                    this.getTypeList();
                }
            });
        },
        getTypeList () {
            let params = {
                processId: this.processId
            };
            this.$call('qm.process.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
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
        changeQmType (val) {
            this.formValidate.qmSpinningTypeList = val;
        },
        getDiscList () {
            this.$call('dict.list', {parentCode: 'qm_type'}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.typeList = content.res;
                }
            });
        },
        getTypeDetail (val) {
            this.$call('qm.process.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isEdit = true;
                    this.typeTitle = content.res.auditState === 3 ? '工序质检类别详情' : '编辑工序质检类别';
                    this.testTypeList = content.res.qmTypeList.map(x => {
                        return {
                            value: x.qmTypeId,
                            label: x.qmTypeName
                        };
                    });
                    this.formValidate.processId = content.res.processId;
                    this.formValidate.typeIds = content.res.qmTypeList.map(x => x.qmTypeId);
                    setTimeout(() => {
                        this.formValidate.qmTypeIds = content.res.qmSpinningTypeList.map(x => x.qmTypeId);
                    }, 100);
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
            this.typeTitle = '新增质检类别';
            this.formValidate.typeIds = [];
            this.formValidate.qmTypeIds = [];
            this.formValidate.qmTypeList = [];
            this.formValidate.qmSpinningTypeList = [];
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
            this.$call('qm.process.approve', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTypeList();
                    this.$Message.success('审核成功');
                }
            });
        },
        unAuditType () {
            this.$call('qm.process.unapprove', this.selectedIds).then(res => {
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
                this.$Message.error('存在已经审核的内容');
                return false;
            }
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('qm.process.delete', this.selectedIds).then(res => {
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
        },
        changePageSize (val) {
            this.pageSize = val;
        },
        typeSubmit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curTypeId,
                        processId: this.formValidate.processId,
                        processCode: this.processList.find(x => x.id === this.formValidate.processId).code,
                        processName: this.processList.find(x => x.id === this.formValidate.processId).name,
                        qmTypeList: this.formValidate.qmTypeList.map(item => {
                            return {
                                qmTypeId: item.value,
                                qmTypeName: item.label,
                                isTrialSpinning: 0
                            };
                        }),
                        qmSpinningTypeList: this.formValidate.qmSpinningTypeList.map(item => {
                            return {
                                qmTypeId: item.value,
                                qmTypeName: item.label,
                                isTrialSpinning: 1
                            };
                        })
                    };
                    this.typeLoading = true;
                    this.$call('qm.process.save', params).then(res => {
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
        }
    },
    mounted () {
        this.getProcess();
        this.getDiscList();

        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 200;
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
        //
    }
});

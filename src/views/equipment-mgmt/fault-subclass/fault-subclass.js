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
                    title: '故障小类编码',
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
                    title: '故障小类名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '故障类别',
                    key: 'faultTypeName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '呼叫岗位',
                    key: 'postNames',
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.faultSubclassPostList.map(x => x.postName).toString());
                    }
                },
                {
                    title: '是否数采',
                    key: 'autoGather',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.autoGather === true ? '是' : (params.row.autoGather === false ? '否' : ' '));
                    }
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
                code: '',
                name: '',
                faultTypeId: '',
                autoGather: '1',
                postIds: [],
                auditState: 1
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
                autoGather: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                postIds: [
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
            curTypeId: ''
        };
    },
    methods: {
        getFaultTypeList () {
            this.$call('dict.list', {parentCode: 'fault_type'}).then(res => {
                if (res.data.status === 200) {
                    this.faultTypeList = res.data.res;
                    this.getTypeList();
                }
            });
        },
        getTypeList () {
            let params = {
                nameCode: this.nameCode,
                faultTypeId: this.faultTypeId,
                auditState: this.auditState,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('fault.subclass.list', params).then(res => {
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
            this.$call('fault.subclass.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isEdit = true;
                    this.typeTitle = content.res.auditState === 3 ? '故障小类详情' : '编辑故障小类';
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.faultTypeId = content.res.faultTypeId;
                    this.formValidate.faultTypeCode = content.res.faultTypeCode;
                    this.formValidate.faultTypeName = content.res.faultTypeName;
                    this.formValidate.autoGather = content.res.autoGather ? '1' : '0';
                    this.formValidate.auditState = content.res.auditState;
                    this.formValidate.postIds = content.res.faultSubclassPostList.map(x => x.postId);
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
            this.typeTitle = '新增故障小类';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.faultTypeId = '';
            this.formValidate.autoGather = '1';
            this.formValidate.postIds = [];
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
            this.$call('fault.subclass.approve', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTypeList();
                    this.$Message.success('审核成功');
                }
            });
        },
        unAuditType () {
            this.$call('fault.subclass.unapprove', this.selectedIds).then(res => {
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
            this.$call('fault.subclass.delete', this.selectedIds).then(res => {
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
                        faultTypeId: this.formValidate.faultTypeId,
                        faultTypeCode: this.faultTypeList.find(y => y.id === this.formValidate.faultTypeId).code,
                        faultTypeName: this.faultTypeList.find(y => y.id === this.formValidate.faultTypeId).name,
                        // faultTypeName: this.formValidate.faultTypeName,
                        // postIds: this.formValidate.postIds,
                        autoGather: this.formValidate.autoGather === '1' ? true : false,
                        faultSubclassPostList: this.formValidate.postIds.map(x => {
                            return {
                                postId: x,
                                postName: this.postList.find(y => y.id === x).name,
                                processId: this.postList.find(y => y.id === x).processId,
                                processCode: this.postList.find(y => y.id === x).processCode
                            };
                        })
                    };
                    this.typeLoading = true;
                    this.$call('fault.subclass.save', params).then(res => {
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
        this.getFaultTypeList();
        this.getPostList();
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 120;
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 120;
        };
        //
    }
});

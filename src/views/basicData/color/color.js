import modal from '../../public/modal';
import {auditStateList} from '../../../libs/utilState';
import otherMessage from '../../components/otherMessage';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
import {page} from '../../../libs/tools';
export default ({
    components: {
        modal,
        otherMessage,
        deleteWarning
    },
    data () {
        return {
            auditDisabled: true,
            tableHeight: 660,
            isEdit: false,
            curColorId: null,
            auditStateList: auditStateList,
            curAuditStateId: '',
            colorCode: '',
            colorColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '色号',
                    key: 'code',
                    sortable: true,
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.curColorId = params.row.id;
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.getColorDetail(params.row.id);
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '颜色值',
                    key: 'colorValue',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    minWidth: 110
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
            colorData: [],
            colorShow: false,
            colorLoading: false,
            colorTitle: '',
            isCouldSave: true,
            colorMsg: '',
            formValidate: {
                code: '',
                name: ''
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            colorValue: '#ffffff',
            colorTotal: 0,
            colorPageIndex: 1,
            colorPageOpts: page().pageOpts,
            colorPageSize: page().pageSize,
            createName: '',
            createTime: '',
            auditName: '',
            auditTime: '',
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            curColorIds: [],
            curColorValue: []
        };
    },
    methods: {
        addNewColor () {
            this.curColorId = null;
            this.isEdit = false;
            this.colorShow = true;
            this.isCouldSave = true;
            this.colorTitle = '新增色号';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.colorValue = '#ffffff';
            this.createName = '';
            this.createTime = '';
            this.auditName = '';
            this.auditTime = '';
        },
        auditColor () {
            this.$api.color.getColorApprove(this.curColorIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getColorList();
                }
            });
        },
        unAuditColor () {
            this.$api.color.getColorUnApprove(this.curColorIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getColorList();
                }
            });
        },
        deleteColor () {
            if (this.curColorIds.length !== this.curColorValue.filter(x => x.auditState === 1).length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核的数据，不能删除!</p>'
                });
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        colorSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curColorId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        colorValue: this.colorValue
                    };
                    this.colorLoading = true;
                    this.$api.color.getColorSave(params).then(res => {
                        let content = res.data;
                        this.colorLoading = false;
                        if (content.status === 200) {
                            this.colorShow = false;
                            this.getColorList();
                            this.$Message.success('保存成功');
                        }
                    });
                    // this.$Message.success('Success!');
                } else {
                    xwValidate.message();
                }
            });
        },
        colorCancel () {
            this.colorShow = false;
            this.colorLoading = false;
        },
        getColorList () {
            let params = {
                codeName: this.colorCode,
                auditState: this.curAuditStateId,
                pageSize: this.colorPageSize,
                pageIndex: this.colorPageIndex
            };
            this.$api.color.getColorList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.colorTotal = content.count;
                    this.colorData = content.res.map(item => {
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        return item;
                    });
                    this.curColorValue = [];
                    this.curColorIds = [];
                }
            });
        },
        getColorDetail (id) {
            this.$api.color.getColorDetail({'id': id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.colorValue = content.res.colorValue;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.auditName = content.res.auditState === 3 ? content.res.auditName : '';
                    this.auditTime = content.res.auditTime;
                    this.colorShow = true;
                    this.colorTitle = content.res.auditState === 3 ? '色号详情' : '编辑色号';
                }
            });
        },
        changePageIndexColor (val) {
            this.colorPageIndex = val;
            this.getColorList();
        },
        changePageSizeColor (val) {
            this.colorPageSize = val;
            this.getColorList();
        },
        selectColor (val) {
            if (val.length > 0) {
                this.curColorValue = val;
                this.curColorIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curColorValue = [];
                this.curColorIds = [];
                this.auditDisabled = true;
            }
        },
        deleteWarnConfirm () {
            // let ids = this.colorData.filter(x => x._checked === true).map(x => x.id);
            this.deleteWarnLoading = true;
            this.$api.color.getColorDelete(this.curColorIds).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getColorList();
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
        },
        searchColorList () {
            this.colorPageIndex = 1;
            setTimeout(() => {
                this.colorTotal = 1;
            }, 0);
            this.getColorList();
        }
    },
    created () {
        this.getColorList();
    },
    updated () {
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 200;
    },
    mounted () {
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
    }
});

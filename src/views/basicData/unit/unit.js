// import api from '../../../ajax/api';
import tipsModal from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import {auditStateList} from '../../../libs/utilState';
import modal from '../../public/modal';
import xwValidate from '@/libs/xwValidate';
import xwOperationLog from '../../components/xw-operation-log/xw-operation-log-modal';
export default {
    components: {
        modal,
        xwOperationLog,
        tipsModal
    },
    data () {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
            deleteButtonLoading: false,
            formValidate: {
                code: '',
                name: '',
                measCode: '',
                measName: ''
            },
            editSwitch: false,
            addSwitch: false,
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            buttonLoading: false,
            unitErrorMsg: '',
            sort: 1,
            isBase: '是',
            digit: 1,
            measTitle: '',
            isCouldSave: false,
            adEdModalState: false,
            searchData: '',
            isEdit: false,
            curUnitId: '',
            tableHeader: [
                {
                    type: 'selection',
                    align: 'center',
                    width: 68
                },
                {
                    title: '编码',
                    key: 'code',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                on: {
                                    'click': () => {
                                        this.isEdit = true;
                                        if (params.row.auditState === 3) {
                                            this.isCouldSave = false;
                                        } else {
                                            this.isCouldSave = true;
                                        }
                                        this.curUnitId = params.row.id;
                                        this.getDetailUnit();
                                        // this.editUnitEvent(params.row.id, params.index);
                                    }
                                }
                            }, params.row.name)
                        ]);
                    }
                },
                {
                    title: '基准计量单位',
                    key: 'isBase',
                    align: 'left',
                    sortable: true,
                    minWidth: 130
                },
                {
                    title: '数据状态',
                    align: 'center',
                    key: 'auditStateMean',
                    sortable: true,
                    minWidth: 110
                }
            ],
            tableData: [],
            checkData: [],
            deleteTipsModalMsg: '',
            deleteTipsModalState: false,
            auditDisabled: true,
            createName: '',
            createTime: '',
            auditName: '',
            auditTime: ''
        };
    },
    methods: {
        // 公共提示框的确认按钮
        deleteTipsModalConfirm () {
            this.deleteButtonLoading = true;
            this.$api.unit.getUnitDelete(this.curUnitIds).then(res => {
                this.deleteButtonLoading = false;
                if (res.data.status === 200) {
                    this.deleteTipsModalState = false;
                    // 调用获取列表数据的请求
                    this.getUnitListHttp();
                    this.$Message.success('删除成功！');
                }
            });
        },
        deleteTipsModalCancel () {
            this.deleteButtonLoading = false;
            this.deleteTipsModalState = false;
        },
        // 获取勾选的对象
        selectUnit (val) {
            if (val.length > 0) {
                this.curUnitValue = val;
                this.curUnitIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curUnitValue = [];
                this.curUnitIds = [];
                this.auditDisabled = true;
            }
        },
        auditUnit () {
            this.$api.unit.getUnitApprove(this.curUnitIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getUnitListHttp();
                }
            });
        },
        unAuditUnit () {
            this.$api.unit.getUnitUnApprove(this.curUnitIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getUnitListHttp();
                }
            });
        },
        // 新增和编辑的确认方法
        addConfirm (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curUnitId,
                        name: this.formValidate.name,
                        code: this.formValidate.code,
                        preci: this.formValidate.preci,
                        sortNum: this.formValidate.sortNum,
                        isBase: this.formValidate.isBase === '1'
                    };
                    this.$api.unit.getUnitSave(params).then((res) => {
                        if (res.data.status === 200) {
                            this.buttonLoading = false;
                            this.adEdModalState = false;
                            // 调用获取列表数据的请求
                            this.getUnitListHttp();
                            this.$Message.success('保存成功！');
                        }
                    });
                    // this.$Message.success('Success!');
                } else {
                    xwValidate.message();
                }
            });
        },
        // 新增和编辑的取消方法
        addCancel () {
            this.adEdModalState = false;
            this.buttonLoading = false;
        },
        // 编辑的方法
        getDetailUnit () {
            this.$api.unit.getUnitDetail({id: this.curUnitId}).then(res => {
                if (res.data.status === 200) {
                    // 赋值输入框
                    this.formValidate.code = res.data.res.code;
                    this.formValidate.name = res.data.res.name;
                    // this.isBase = this.baseConverterCN(res.data.res.isBase);
                    this.formValidate.isBase = res.data.res.isBase === true ? '1' : '0';
                    this.formValidate.preci = res.data.res.preci;
                    this.formValidate.sortNum = res.data.res.sortNum;
                    this.formValidate.sort = res.data.res.sortNum;
                    // this.digit = res.data.res.preci;
                    this.adEdModalState = true;
                    this.measTitle = res.data.res.auditState === 3 ? '计量单位详情' : '编辑计量单位';
                    this.createName = res.data.res.createName;
                    this.createTime = res.data.res.createTime;
                    this.auditName = res.data.res.auditName;
                    this.auditTime = res.data.res.auditTime;
                    // this.editSwitch = true;
                }
            });
        },
        // 新增方法
        addUnitEvent () {
            // debugger
            this.curUnitId = null;
            this.isCouldSave = true;
            this.measTitle = '新增计量单位';
            this.adEdModalState = true;
            this.isEdit = false;
            // 清空
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.preci = null;
            this.formValidate.isBase = '1';
            this.formValidate.sortNum = null;
            this.createName = '';
            this.createTime = '';
            this.auditName = '';
            this.auditTime = '';
        },
        // 删除方法
        deleteUnitEvent () {
            if (this.curUnitIds.length !== this.curUnitValue.filter(x => x.auditState === 1).length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '包含已审核对象，不能删除！'
                });
                return false;
            } else {
                this.deleteTipsModalState = true;
                this.deleteTipsModalMsg = '确认要删除吗？';
            }
        },
        // 获取列表数据
        getUnitListHttp () {
            this.$api.unit.getUnitList().then((res) => {
                if (res.data.status === 200) {
                    this.tableData = res.data.res.map(item => {
                        item.isBase = item.isBase === true ? '是' : '否';
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        return item;
                    });
                    this.curUnitValue = [];
                    this.curUnitIds = [];
                    this.auditDisabled = true;
                }
            });
        }
    },
    created () {
        // this.$store.dispatch({
        //     type: 'showLoading'
        // });
        // 调用获取列表数据的请求
        this.getUnitListHttp();
    },
    mounted () {
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(200);
        };
    }
};

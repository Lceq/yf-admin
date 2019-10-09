import modal from '../../public/modal';
import AboutTime from '../../public/AboutTime';
// import userMessage from '../components/user-message';
import otherMessage from '../../components/otherMessage';
import {page} from '../../../libs/tools';
import { auditStateList, enableState, dataTypeStateList } from '../../../libs/utilState';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        modal,
        AboutTime,
        otherMessage,
        deleteWarning
    },
    data () {
        return {
            qualityParameterPageOpts: page().pageOpts,
            qualityParameterPageSize: page().pageSize,
            // 条件
            curQmParamId: '',
            auditDisabled: true,
            curEnableStateId: '',
            curAuditStateId: '',
            curQmTypeId: '',
            qualityParameterProcessId: '',
            processList: [],
            enableStateList: enableState,
            auditStateList: auditStateList,
            code: '',
            // table
            isHaveAudit: true,
            isEdit: false,
            qualityParameterList: [],
            qualityParameterColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '参数编码',
                    key: 'code',
                    align: 'left',
                    minWidth: 120,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.isHaveAudit = params.row.auditState !== 3;
                                    this.curQmParamId = params.row.id;
                                    this.isShowUserMessage = true;
                                    this.getQmParamDetail();
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '参数名称',
                    key: 'name',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '质检类别',
                    key: 'qmTypeName',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '数据类型',
                    key: 'dataTypeMean',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '是否启用',
                    key: 'isEnableMean',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    minWidth: 100
                }
            ],
            qualityParameterLoading: false,
            tableHeight: '',
            // 分页
            qualityParameterTotal: 0,
            qualityParameterPageIndex: 0,
            // qualityParameterPageSize: [],
            // 质检类别
            qmTypeId: '',
            qmTypeList: [],
            qualityParameterModalShow: false,
            qualityParameterModalLoading: false,
            qualityParameterModal: {
                code: '',
                name: '',
                processId: '',
                qmTypeId: ''
            },
            qualityParameterModelValidate: {
                code: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                processId: [
                    {required: true, validator: xwValidate.input, trigger: 'change'}
                ],
                qmTypeId: [
                    {required: true, validator: xwValidate.input, trigger: 'change'}
                ]
            },
            // 人物信息
            isShowUserMessage: false,
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            auditName: '',
            auditTime: '',
            // 提示
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            // 是否审核--删除的时候包含审核的数据为true
            qualityParameterModalTitle: '',
            curQualityParameterIds: [],
            curQualityParameterIdsData: []
        };
    },
    methods: {
        // 获取参数列表数据
        getQmParamList () {
            let params = {
                pageIndex: this.qualityParameterPageIndex,
                pageSize: this.qualityParameterPageSize,
                processId: this.qualityParameterProcessId,
                auditState: this.curAuditStateId,
                qmTypeId: this.curQmTypeId,
                isEnable: this.curEnableStateId,
                code: this.code.trim()
            };
            this.qualityParameterLoading = true;
            this.$api.parameter.getQmParamList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qualityParameterTotal = content.count;
                    this.qualityParameterList = content.res.map(item => {
                        item.isEnableMean = item.isEnable === true ? '是' : '否';
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        item.dataTypeMean = dataTypeStateList.find(x => x.id === item.dataType).name;
                        return item;
                    });
                    this.qualityParameterLoading = false;
                    this.curQualityParameterIds = [];
                    this.curQualityParameterIdsData = [];
                    this.auditDisabled = true;
                }
            });
        },
        // 获取参数数据详情
        getQmParamDetail () {
            this.$api.parameter.getQmParamDetail({id: this.curQmParamId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qualityParameterModalTitle = content.res.auditState === 3 ? '质量指标参数详情' : '编辑质量指标参数';
                    this.qualityParameterModal.code = content.res.code;
                    this.qualityParameterModal.name = content.res.name;
                    this.qualityParameterModal.processId = content.res.processId;
                    this.qualityParameterModal.dataType = content.res.dataType + '';
                    this.qualityParameterModal.qmTypeId = content.res.qmTypeId;
                    this.qualityParameterModal.isEnable = content.res.isEnable === true ? '1' : '0';
                    this.qualityParameterModal.sortNum = content.res.sortNum;
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.auditName = content.res.auditName;
                    this.auditTime = content.res.auditTime;
                    this.qualityParameterModalShow = true;
                }
            });
        },
        // xuanze
        selectQualityParameter (val) {
            if (val.length > 0) this.auditDisabled = false;
            else this.auditDisabled = true;
            this.curQualityParameterIds = val.map(x => x.id);
            this.curQualityParameterIdsData = val.filter(x => x.auditState === 1);
        },
        // 新增
        addQualityParameter () {
            this.qualityParameterModalTitle = '新增质量指标参数';
            this.curQmParamId = null;
            this.isHaveAudit = true;
            this.qualityParameterModal.code = '';
            this.qualityParameterModal.name = '';
            this.qualityParameterModal.processId = '';
            this.qualityParameterModal.qmTypeId = '';
            this.qualityParameterModal.dataType = '1';
            this.qualityParameterModal.isEnable = '1';
            this.qualityParameterModal.sortNum = 0;
            this.qualityParameterModalShow = true;
        },
        // 搜索
        searchQualityParameter () {
            this.qualityParameterPageIndex = 1;
            setTimeout(() => {
                this.qualityParameterTotal = 1;
            });
            this.getQmParamList();
        },
        // 审核
        auditQualityParameter () {
            this.$api.parameter.getQmParamApprove(this.curQualityParameterIds).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmParamList();
                    this.$Message.success('审核成功');
                }
            });
        },
        // 反审核
        unAuditQualityParameter () {
            this.$api.parameter.getQmParamUnApprove(this.curQualityParameterIds).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmParamList();
                    this.$Message.success('反审核成功');
                }
            });
        },
        // 删除
        deleteQualityParameter () {
            if (this.curQualityParameterIdsData.length !== this.curQualityParameterIds.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核数据，不能进行删除!</p>'
                });
                return false;
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        // 改变页码
        changePageIndexQualityParameter (val) {
            this.qualityParameterPageIndex = val;
            this.getQmParamList();
        },
        // 改变每页的数量
        changePageSizeQualityParameter (val) {
            this.qualityParameterPageSize = val;
            this.getQmParamList();
        },
        // modal
        qualityParameterModalCancel () {
            this.isShowUserMessage = false;
            this.qualityParameterModalLoading = false;
            this.qualityParameterModalShow = false;
        },
        // 提交保存
        qualityParameterModalSubmit () {
            this.$refs['qualityParameterModal'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curQmParamId,
                        code: this.qualityParameterModal.code.trim().toUpperCase(),
                        name: this.qualityParameterModal.name.trim(),
                        processId: this.qualityParameterModal.processId,
                        dataType: this.qualityParameterModal.dataType,
                        qmTypeId: this.qualityParameterModal.qmTypeId,
                        isEnable: this.qualityParameterModal.isEnable === '1',
                        sortNum: this.qualityParameterModal.sortNum
                    };
                    this.qualityParameterModalLoading = true;
                    this.$api.parameter.getQmParamSave(params).then(res => {
                        let content = res.data;
                        this.qualityParameterModalLoading = false;
                        if (content.status === 200) {
                            this.getQmParamList();
                            this.isShowUserMessage = false;
                            this.qualityParameterModalShow = false;
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // delete-warning
        deleteWarnCancel () {
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
            this.isAuditing = false;
        },
        deleteWarnConfirm () {
            let ids = this.curQualityParameterIdsData.map(x => x.id);
            if (ids.length === 0) {
                this.deleteWarnShow = false;
                return false;
            };
            this.deleteWarnLoading = true;
            this.$api.parameter.deleteQmParam(ids).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                this.deleteWarnShow = false;
                if (content.status === 200) {
                    this.getQmParamList();
                    this.$Message.success('删除成功');
                }
            });
            this.isAuditing = false;
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 获取质检类别
        getQmType () {
            this.$api.dictionary.getQmType().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qmTypeList = content.res;
                }
            });
        }
    },
    created () {
        this.getQmParamList();
        this.getProcessList();
        this.getQmType();
    },
    updated () {
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 200;
    },
    mounted () {
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        };
    }
};

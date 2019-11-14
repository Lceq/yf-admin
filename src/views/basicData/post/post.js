import modal from '../../public/modal';
import {auditStateList} from '../../../libs/utilState';
import otherMessage from '../../components/otherMessage';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import {page} from '../../../libs/tools';
import xwValidate from '@/libs/xwValidate';
import syncModal from './sync-modal';

export default ({
    components: {
        modal,
        otherMessage,
        deleteWarning,
        syncModal
    },
    // computed: {
    //     ...mapState({
    //         postPageOpts: state => state.pageOpts,
    //         postPageSize: state => state.pageSize
    //     })auditTime
    // },
    data () {
        return {
            syncModalState: false,
            showModalContentLoading: false,
            saveModalConfirmLoading: false,
            postPageOpts: page().pageOpts,
            postPageSize: page().pageSize,
            postTypeList: [
                {
                    code: '',
                    name: ''
                }
            ],
            curPostType: '',
            curProcessId: '',
            auditDisabled: true,
            tableHeight: 660,
            isEdit: false,
            curColorId: null,
            auditStateList: auditStateList,
            curAuditStateId: '',
            postCode: '',
            postColumns: [
                {type: 'selection', width: 60, align: 'center'},
                {title: '岗位编码', key: 'code', align: 'left', sortable: true, minWidth: 110},
                {
                    title: '岗位名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('a', {
                                on: {
                                    'click': () => {
                                        if (params.row.auditState === 3) {
                                            _this.isCouldSave = false;
                                        } else {
                                            _this.isCouldSave = true;
                                        }
                                        _this.isEdit = true;
                                        _this.curPostId = params.row.id;
                                        _this.getPostDetail();
                                    }
                                }
                            }, params.row.name)
                        ]);
                    }
                },
                {title: '岗位分类', key: 'typeName', align: 'left', sortable: true, minWidth: 110},
                {title: '所属工序', key: 'processName', align: 'center', sortable: true, minWidth: 110},
                {title: '是否开台', key: 'isWatcher', align: 'center', sortable: true, minWidth: 110},
                {title: '是否计件', key: 'isPiece', align: 'center', sortable: true, minWidth: 110},
                {title: '是否常日班', key: 'isRegularDaily', align: 'center', sortable: true, minWidth: 110},
                {title: '数据状态', key: 'auditStateMean', align: 'center', sortable: true, minWidth: 110},
                {title: '排序', key: 'sortNum', align: 'center', sortable: true, minWidth: 110}
            ],
            postData: [],
            postShow: false,
            postLoading: false,
            postTitle: '',
            isCouldSave: true,
            postMsg: '',
            processList: [],
            formValidate: {
                code: '',
                name: '',
                type: '',
                isWatcher: false,
                wageType: '1',
                processId: null,
                isRegularDaily: '1',
                sortNum: null,
                shortName: '',
                isRepair: false
            },
            ruleValidate: {
                code: [{required: true, validator: xwValidate.code, trigger: 'blur'}],
                name: [{required: true, validator: xwValidate.input, trigger: 'blur'}]
            },
            colorValue: '#ffffff',
            postTotal: 0,
            colorPageIndex: 1,
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            auditName: '',
            auditTime: '',
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            curPostId: '',
            curPostIds: [],
            curPostValue: []
        };
    },
    methods: {
        onSyncModalConfirmEvent (e) {
            this.syncModalState = false;
            this.formValidate.hrPostId = e.id;
            this.formValidate.code = e.code;
            this.formValidate.name = e.name;
            // this.formValidate.type = e.typeCode;
            this.formValidate.shortName = e.shortName;
            this.formValidate.processId = e.processId;
            this.formValidate.processName = e.processName;
            this.formValidate.processCode = e.processCode;
            // this.formValidate.isWatcher = e.isWatcher;
            // this.formValidate.isRepair = e.isRepair;
            this.postTitle = '新增岗位';
            this.postShow = true;
        },
        onSyncModalVisibleChangeEvent (e) {
            this.syncModalState = e;
        },
        syncOrgEvent () {
            this.syncModalState = true;
        },
        addNewPost () {
            this.curPostId = null;
            this.isEdit = false;
            this.postShow = true;
            this.isCouldSave = true;
            this.postTitle = '新增岗位';
            // this.formValidate.code = '';
            // this.formValidate.name = '';
            // this.colorValue = '#ffffff';
            // 清空数据
            this.formValidate.isRepair = false;
            this.formValidate.shortName = '';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.type = '';
            this.formValidate.isWatcher = false;
            this.formValidate.wageType = '1';
            this.formValidate.processId = '';
            this.formValidate.isRegularDaily = '1';
            this.formValidate.sortNum = null;
            this.formValidate.hrPostId = null;
            this.createTime = '';
            this.createName = '';
            this.updateName = '';
            this.updateTime = '';
            this.auditName = '';
            this.auditTime = '';
        },
        getPostDetail () {
            // debugger
            this.$api.post.getPostDetail({id: this.curPostId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.postTitle = content.res.auditState === 3 ? '岗位详情' : '编辑岗位';
                    this.formValidate.code = content.res.auditState;
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.shortName = res.data.res.shortName;
                    this.formValidate.type = content.res.typeCode;
                    this.formValidate.typeName = content.res.typeName;
                    this.formValidate.isWatcher = content.res.isWatcher;
                    this.formValidate.isRepair = content.res.isRepair;
                    this.formValidate.wageType = content.res.wageType + '';
                    this.formValidate.processId = content.res.processId;
                    this.formValidate.processName = content.res.processName;
                    this.formValidate.isRegularDaily = content.res.isRegularDaily === true ? '1' : '0';
                    this.formValidate.sortNum = content.res.sortNum;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateTime = content.res.updateTime;
                    this.updateName = content.res.updateName;
                    this.auditName = content.res.auditState === 1 ? null : content.res.auditName;
                    this.auditTime = content.res.auditTime;
                    this.postShow = true;
                }
            });
        },
        auditPost () {
            // let ids = this.postData.filter(x => x._checked === true).map(x => x.id);
            // debugger
            this.$api.post.getPostApprove(this.curPostIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getPostList();
                }
            });
        },
        unAuditPost () {
            this.$api.post.getPostUnApprove(this.curPostIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getPostList();
                }
            });
        },
        deletePost () {
            if (this.curPostIds.length !== this.curPostValue.filter(x => x.auditState === 1).length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核的数据，不能删除!</p>'
                });
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        postSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curPostId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        shortName: this.formValidate.shortName,
                        typeCode: this.formValidate.type ? this.formValidate.type : null,
                        typeName: this.formValidate.type ? this.postTypeList.find(x => x.code === this.formValidate.type).name : null,
                        sortNum: this.formValidate.sortNum,
                        isWatcher: this.formValidate.isWatcher,
                        wageType: this.formValidate.wageType,
                        isRepair: !this.formValidate.isRepair,
                        processId: this.formValidate.processId,
                        processName: this.formValidate.processId ? this.processList.find(x => x.id === this.formValidate.processId).name : '',
                        isRegularDaily: this.formValidate.isRegularDaily === '1',
                        hrPostId: this.formValidate.hrPostId
                    };
                    this.postLoading = true;
                    this.$api.post.getPostSave(params).then(res => {
                        let content = res.data;
                        this.postLoading = false;
                        if (content.status === 200) {
                            this.postShow = false;
                            this.getPostList();
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        postCancel () {
            this.postShow = false;
            this.postLoading = false;
            this.formValidate.shortName = '';
        },
        getPostList () {
            let params = {
                typeCode: this.curPostType,
                auditState: this.curAuditStateId,
                processId: this.curProcessId,
                codeName: this.postCode.trim(),
                pageSize: this.postPageSize,
                pageIndex: this.postPageIndex
            };
            this.$api.post.getPostList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.postTotal = content.count;
                    this.postData = content.res.map(item => {
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        item.isPiece = item.isPiece === true ? '是' : '否';
                        item.isWatcher = item.isWatcher === true ? '是' : '否';
                        item.isRegularDaily = item.isRegularDaily === true ? '是' : '否';
                        return item;
                    });
                    this.curPostValue = [];
                    this.curPostIds = [];
                    this.auditDisabled = true;
                }
            });
        },
        changePageIndexPost (val) {
            this.postPageIndex = val;
            this.getPostList();
        },
        changePageSizePost (val) {
            this.postPageSize = val;
            this.getPostList();
        },
        selectPost (val) {
            if (val.length > 0) {
                this.curPostValue = val;
                this.curPostIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curPostValue = [];
                this.curPostIds = [];
                this.auditDisabled = true;
            }
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$api.post.getPostDelete(this.curPostIds).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getPostList();
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
        },
        searchPostList () {
            this.colorPageIndex = 1;
            setTimeout(() => {
                this.postTotal = 1;
            }, 0);
            this.getPostList();
        },
        // 获取岗位分类的请求
        getPostType () {
            this.$api.dictionary.getPostType().then((res) => {
                if (res.data.status === 200) {
                    this.postTypeList = res.data.res;
                    // debugger
                }
            });
        },
        // 获取工序列表
        getProcessList () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        }
    },
    created () {
        this.getProcessList();
        this.getPostList();
        this.getPostType();
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

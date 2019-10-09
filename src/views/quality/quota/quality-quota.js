// import {mapState} from 'vuex';
// import modal from '../../public/modal';
import { page } from '../../../libs/tools';
import {auditStateList} from '../../../libs/utilState';
import deleteWarning from '../../public/deleteWarning';
// import selectProduct from '../../components/select-product';
import quotaModal from './modal';
export default {
    components: {
        // modal,
        // selectProduct,
        deleteWarning,
        quotaModal
    },
    // computed: {
    //     ...mapState({
    //         qmProductPageOpts: state => state.pageOpts,
    //         qmProductPageSize: state => state.pageSize
    //     })
    // },
    data () {
        return {
            qmProductPageOpts: page().pageOpts,
            qmProductPageSize: page().pageSize,
            selectProductCodeState: false,
            selectProductCodeStateCopy: false,
            curQmProductDetail: {},
            curQmProductDetailCopy: {},
            curQmProductId: '',
            machineCode: '',
            isCouldSave: true,
            isCouldSaveCopy: true,
            auditDisabled: true,
            curQmProductProcessId: '',
            curQmProductAuditStateId: '',
            processList: [],
            isCopy: false,
            auditStateList: auditStateList,
            // table
            qmProductLoading: false,
            qmProductColumns: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '操作',
                    // key: 'productCode',
                    fixed: 'left',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        const _this = this;
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    _this.isCouldSave = true;
                                    _this.curQmProductId = params.row.id;
                                    _this.$api.quota.getQmProductDetail({id: _this.curQmProductId}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.curQmProductDetail = content.res;
                                            _this.curQmProductDetail.isCopy = true;
                                            _this.qmProductModalShow = true;
                                            // _this.isCopy = true;
                                        }
                                    });
                                }
                            }
                        }, '复制');
                    }
                },
                {
                    title: '产品编码',
                    key: 'productCode',
                    fixed: 'left',
                    align: 'left',
                    minWidth: 100,
                    render: (h, params) => {
                        const _this = this;
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    _this.curQmProductId = params.row.id;
                                    _this.$api.quota.getQmProductDetail({id: _this.curQmProductId}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.curQmProductDetail = content.res;
                                            _this.curQmProductDetail.isCopy = false;
                                            _this.qmProductModalShow = true;
                                            // _this.isCopy = false;
                                        }
                                    });
                                }
                            }
                        }, params.row.productCode);
                    }
                },
                {
                    title: '产品名称',
                    key: 'productName',
                    align: 'left',
                    fixed: 'left',
                    minWidth: 100
                },
                {
                    title: '规格',
                    key: 'productModels',
                    align: 'left',
                    minWidth: 80
                },
                {
                    title: '存货类型',
                    key: 'productTypeName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    width: 100
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'left',
                    width: 150
                },
                {
                    title: '审核人',
                    key: 'auditName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '审核时间',
                    key: 'auditTime',
                    align: 'left',
                    width: 150
                }
            ],
            qmProductList: [],
            tableHeight: '',
            // 分页
            qmProductTotal: 0,
            qmProductPageIndex: 1,
            // 已经选择的IdssaveModalState
            curSelectedQmProductIds: [],
            curSelectedQmProduct: [],
            // 提示
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            // modal
            qmProductModalShow: false,
            qmProductModalShowCopy: false
        };
    },
    methods: {
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 获取质量指标列表
        getQmProductList () {
            let params = {
                pageSize: this.qmProductPageSize,
                pageIndex: this.qmProductPageIndex,
                processId: this.curQmProductProcessId,
                auditState: this.curQmProductAuditStateId,
                code: this.machineCode.trim()
            };
            this.$api.quota.getQmProductList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qmProductTotal = content.count;
                    this.qmProductList = content.res.map(item => {
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        return item;
                    });
                    this.curSelectedQmProductIds = [];
                    this.curSelectedQmProduct = [];
                    this.auditDisabled = true;
                }
            });
        },
        // 新增
        addNewQmProduct () {
            this.selectProductCodeState = !this.selectProductCodeState;
            this.isCouldSave = true;
            this.qmProductModalShow = true;
            // debugger
        },
        // 审核
        auditQmProduct () {
            this.$api.quota.getQmProductApprove(this.curSelectedQmProductIds).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmProductList();
                    this.$Message.success('审核成功');
                }
            });
        },
        unAuditQmProduct () {
            this.$api.quota.getQmProductUnApprove(this.curSelectedQmProductIds).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmProductList();
                    this.$Message.success('反审核成功');
                }
            });
        },
        deleteQmProduct () {
            if (this.curSelectedQmProduct.length !== this.curSelectedQmProductIds.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核数据，不能进行删除!</p>'
                });
                return false;
            } else {
                this.deleteWarnMsg = '确定要删除吗？';
                this.deleteWarnShow = true;
            }
        },
        // 搜索
        searchQmProduct () {
            this.qmProductPageIndex = 1;
            setTimeout(() => {
                this.qmProductTotal = 1;
            });
            this.getQmProductList();
        },
        selectQmProduct (val) {
            if (val.length > 0) this.auditDisabled = false;
            else this.auditDisabled = true;
            this.curSelectedQmProductIds = val.map(x => x.id);
            this.curSelectedQmProduct = val.filter(x => x.auditState === 1).map(x => x.id);
        },
        changePageIndexQmProduct (val) {
            this.qmProductPageIndex = val;
            this.getQmProductList();
        },
        changePageSizeQmProduct (val) {
            this.qmProductPageSize = val;
            this.getQmProductList();
        },
        deleteWarnCancel () {
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$api.quota.deleteQmProduct(this.curSelectedQmProduct).then((res) => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.getQmProductList();
                    this.$Message.success('删除成功');
                    this.deleteWarnShow = false;
                }
            });
        },
        // 搜索物料
        // searchProduct () {
        //     this.qmProductModalShow = false;
        // },
        qmProductModalCancel () {
            this.qmProductModalShow = false;
        },
        qmProductModalSubmit (val) {
            this.$api.quota.getQmProductSave(val).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qmProductModalShow = false;
                    this.$Message.success('保存成功');
                    this.getQmProductList();
                }
            });
        }
    },
    created () {
        // 获取工序
        this.getProcessList();
        // 获取列表
        this.getQmProductList();
    },
    mounted () {
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        };
    }
};

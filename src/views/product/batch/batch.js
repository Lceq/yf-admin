import layout from '../../layout';
import {page, curDate} from '../../../libs/tools';
import modal from '../../public/modal';
import xwSelectProductBatch from '../../components/xw-select-product/xw-select-product-batch';
import xwOperationLog from '../../components/xw-operation-log/xw-operation-log-modal';
import xwValidate from '@/libs/xwValidate';
import xwTools from '../../../libs/xwTool';
export default ({
    components: {
        layout, modal, xwSelectProductBatch, xwOperationLog
    },
    data () {
        return {
            productNameCode: '',
            batchCode: '',
            batchStateList: [
                {
                    id: 0,
                    name: '未生效'
                },
                {
                    id: 1,
                    name: '生效'
                }
            ],
            batchAuditStateList: [],
            curBatchAuditStateId: 1,
            curBatchStateId: null,
            tableHeight: '',
            batchColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    width: 100,
                    align: 'left',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (!this.isShowDetail) {
                                        this.isBatchTitle = '编辑批号';
                                    } else {
                                        this.isBatchTitle = '批号详情';
                                    }
                                    this.getBatchDetail(params.row.id);
                                    this.isEditId = params.row.id;
                                }
                            }
                        }, params.row.batchCode);
                    }
                },
                {
                    title: '物料编码',
                    key: 'productCode',
                    minWidth: 90,
                    align: 'left'
                },
                {
                    title: '物料名称',
                    key: 'productName',
                    minWidth: 90,
                    align: 'left'
                },
                {
                    title: '规格',
                    key: 'productModels',
                    minWidth: 90,
                    align: 'left'
                },
                {
                    title: '工序',
                    key: 'processName',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '数据状态',
                    key: 'auditStateName',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '批号状态',
                    key: 'batchStateName',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '创建人',
                    minWidth: 90,
                    key: 'createName',
                    align: 'center'
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    width: 135,
                    align: 'left'
                }
            ],
            batchList: [],
            batchLoading: false,
            batchTotal: 0,
            batchIndex: 1,
            batchOpts: page().pageOpts,
            batchSize: page().pageSize,
            isBatchShow: false,
            isBatchLoading: false,
            isBatchTitle: '',
            formValidate: {
                selectProductCode: null,
                productModels: '',
                productCode: '',
                productName: '',
                batchCode: '',
                date: '',
                batchStateName: '',
                auditStateName: ''
            },
            ruleValidate: {
                selectProductCode: {required: true, validator: xwValidate.input, trigger: 'blur'},
                batchCode: {required: true, validator: xwValidate.code, trigger: 'blur'}
            },
            isShowDetail: false,
            batchChangeIds: [],
            batchChangeBatch: false,
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
            isEditId: null,
            processId: '',
            processList: [],
            curProductList: [],
            selectProductCodeName: '',
            selectProductShow: false,
            selectProductLoading: false,
            loading: false,
            // selectProductLoading: false,
            selectProductColumns: [
                {
                    title: '物料分类',
                    key: 'categoryName',
                    fixed: 'left',
                    align: 'center',
                    minWidth: 100
                },
                // {
                //     title: '产品编码',
                //     key: 'code',
                //     align: 'center',
                //     fixed: 'left',
                //     minWidth: 100
                // },
                {
                    title: '产品名称(编码)',
                    key: 'name',
                    align: 'center',
                    minWidth: 120,
                    render: (h, param) => {
                        return h('span', {}, param.row.name + ' (' + param.row.code + ')')
                    }
                },
                {
                    title: '加工工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                // {
                //     title: '规格型号',
                //     key: 'models',
                //     align: 'center',
                //     minWidth: 100
                // },
                // {
                //     title: '计量单位',
                //     key: 'unitCode',
                //     align: 'center',
                //     minWidth: 80
                // },
                {
                    title: '存货类型',
                    key: 'typeName',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '图片',
                    key: 'picUrl',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('Div', {
                            style: {
                                padding: '5px 0 0 0'
                            }
                        }, [
                            h('img', {
                                attrs: {
                                    src: params.row.picUrl ? params.row.picUrl : 'https://service.shengtex.com/images/default.png'
                                },
                                style: {
                                    width: '30px',
                                    height: '30px'
                                }
                            })
                        ]);
                    }
                }
            ],
            selectProductData: [],
            stockTypeList: [],
            value1: [],
            productCategoryList: [],
            curProductRow: {},
            codeName: '',
            curProductTypeId: '',

        };
    },
    methods: {
        clearProduct () {
            this.selectProduct({});
        },
        // 获取存货类别
        getStockType () {
            let params = {
                auditState: 3
            };
            this.$api.dictionary.getStockType(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.stockTypeList = content.res;
                }
            });
        },
        searchProductVal () {
            this.curProductTypeId = null;
            this.curCategoryId = null;
            this.codeName = '';
            this.value1 = [];
            this.selectProductShow = true;
        },
        selectProductCancel () {
            this.curProductTypeId = null;
            this.curCategoryId = null;
            this.codeName = '';
            this.value1 = [];
            this.curProductRow = {};
            this.selectProductShow = false;
        },
        selectProductSubmit () {
            // debugger;
            if (!this.curProductRow.codeName) {
                this.$Message.warning('请选择产品');
                return false;
            } else {
                // this.$emit('selectProductVal', this.curProductRow);
                this.selectProduct(this.curProductRow);
                this.selectProductLoading = false;
                this.curProductRow = {};
                this.curProductTypeId = null;
                this.curCategoryId = null;
                this.codeName = '';
                this.value1 = [];
            }
        },
        changeProductCategory (val) {
            this.curCategoryId = val.reverse()[0];
            this.getProductList();
        },
        changeCascaderType (val) {
            this.curProductTypeId = val;
            this.getProductList();
        },
        changeProductCodeName () {
            this.getProductList();
            // this.selectProductData = this.middleSelectList.filter(x => x.codeName.includes(this.codeName))
        },
        clickRowProduct (val) {
            // debugger
            this.curProductRow = val;
        },
        dbClickSelectProduct (val, index) {
            debugger
            this.selectProductShow = false;
            // this.curProductRow = val;
            this.selectProduct(val);
        },
        changeProduct (val) {
            // debugger
            if (!val) {
                if (this.formValidate.batchCode) {
                    this.formValidate.selectProductCode = this.selectMiddleProductCode
                    // if (this.curProductList.length === 1) {
                    //     this.selectProduct(this.curProductList[0])
                    // }
                } else {
                    this.selectProduct({});
                }
                // if (this.curProductList.length === 1) {
                //     this.selectProduct(this.curProductList[0])
                // } else {
                //     this.selectProduct({});
                // }
                // debugger
            } else {
                this.selectProductCodeName = val;
                let value = this.selectProductData.find(x => x.codeName === this.selectProductCodeName);
                this.selectProduct(value);
            }
            this.curProductList = [];
        },
        remoteMethod (query) {
            const _this = this;
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    _this.loading = false;
                    const list = _this.selectProductData;
                    _this.curProductList = list.filter(item => item.codeName.toLowerCase().includes(query.toLowerCase()));
                }, 200);
            } else {
                _this.curProductList = [];
            }
        },
        selectProduct (val) {
            // debugger;
            if (val.id) {
                // this.formValidate.selectProductCode = Math.random();
                this.formValidate.selectProductCode = val.codeName;
                this.formValidate.productModels = val.models;
                this.formValidate.productCode = val.code;
                this.formValidate.productName = val.name;
                this.formValidate.id = val.id;
            } else {
                this.formValidate.productModels = '';
                this.formValidate.selectProductCode = '';
                this.formValidate.productCode = '';
                this.formValidate.productName = '';
                this.formValidate.id = val.id;
            }
        },
        getProductList () {
            let params = {
                auditState: 3,
                enableState: 1,
                enableBatch: true,
                categoryId: this.curCategoryId,
                typeId: this.curProductTypeId,
                name: this.codeName
            };
            this.$call('product.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.selectProductData = content.res.map(x => {
                        x.codeName = x.name + ' (' + x.code + ')';
                        return x;
                    });
                    this.middleSelectList = this.selectProductData;
                    this.curProductList = this.middleSelectList;
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res.map(item => {
                    if (item.parentId !== 0) {
                        item.style = 'margin-left: 10px;'
                    }
                    return item;
                });
            });
        },
        getBatchStateCount () {
            this.$call('product.batch.stateCount').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.batchAuditStateList = content.res;
                    this.getBatchList();
                }
            });
        },
        searchBatchList () {
            this.getBatchList();
        },
        getBatchList () {
            let params = {
                productNameCode: this.productNameCode.trim(),
                batchState: this.curBatchStateId,
                processId: this.processId,
                batchCode: this.batchCode.trim(),
                auditState: this.curBatchAuditStateId,
                pageSize: this.batchSize,
                pageIndex: this.batchIndex
            };
            this.$call('product.batch.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.batchTotal = content.count;
                    this.batchList = content.res;
                    this.batchChangeIds = [];
                }
            });
        },
        selectMenu (val) {
            // 清空还原搜索信息
            this.productNameCode = '';
            this.curBatchStateId = '';
            this.processId = '';
            this.batchCode = '';
            this.pageIndex = 1;
            setTimeout(() => {
                this.batchTotal = 0;
            });
            this.batchSize = page().pageSize;
            // 清空搜索信息
            this.batchChangeIds = [];
            this.curBatchAuditStateId = val.id;
            this.getBatchList();
        },
        selectionChangeEvent (val) {
            this.batchChangeIds = val.map(x => x.id);
            this.batchChangeBatch = val.length === 0 ? false : (val.filter(x => x.batchState === 0).length === this.batchChangeIds.length);
        },
        changePageIndex (val) {
            this.batchIndex = val;
            this.getBatchList();
        },
        changePageSize (val) {
            this.batchSize = val;
            this.getBatchList();
        },
        /**
         * 新增
         */
        addNewBatch () {
            this.$refs['formValidate'].resetFields();
            this.formValidate.selectProductCode = '';
            // this.curProductList = [];
            // this.formValidate.selectProductCode = null;
            this.formValidate.productModels = '';
            this.isBatchTitle = '新增批号';
            this.formValidate.batchDate = curDate();
            this.formValidate.auditStateName = '创建';
            this.formValidate.batchStateName = '未生效';
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
            this.isBatchShow = true;
            this.isEditId = null;
        },
        isBatchSubmit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.isEditId,
                        batchCode: this.formValidate.batchCode,
                        productId: this.formValidate.id,
                        productCode: this.formValidate.productCode,
                        batchDate: this.formValidate.batchDate,
                        productName: this.formValidate.productName,
                        productModels: this.formValidate.productModels,
                        auditState: 1,
                        batchState: 0
                    };
                    this.$call('product.batch.save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.formValidate.selectProductCode = null;
                            this.getBatchStateCount();
                            this.$Message.success('保存成功');
                            this.isBatchShow = false;
                            // this.formValidate.selectProductCode = '';
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        isBatchCancel () {
            this.selectProductCodeName = null;
            this.isBatchShow = false;
            // this.formValidate.selectProductCode = '';
        },
        changeBatchData (val) {
            this.formValidate.batchDate = val;
        },
        changeAuditState (type) {
            if (this.batchChangeIds.length === 0) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请选择对象</p>'
                });
                return false;
            }
            if (type === 'submit') {
                this.$call('product.batch.submit', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.success('提交成功');
                    }
                });
            }
            if (type === 'unSubmit') {
                this.$call('product.batch.cancel', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.warning('撤销提交成功');
                    }
                });
            }
            if (type === 'audit') {
                this.$call('product.batch.approve', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.success('审核成功');
                    }
                });
            }
            if (type === 'unAudit') {
                if (!this.batchChangeBatch) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p>存在已生效的批号，不能撤销审核</p>'
                    });
                    return false;
                }
                this.$call('product.batch.unapprove', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.warning('撤销审核成功');
                    }
                });
            }
            if (type === 'close') {
                this.$call('product.batch.close', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.success('关闭成功');
                    }
                });
            }
            if (type === 'unClose') {
                this.$call('product.batch.unclose', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.warning('撤销关闭成功');
                    }
                });
            }
            if (type === 'delete') {
                this.$call('product.batch.delete', this.batchChangeIds).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.getBatchStateCount();
                        this.$Message.warning('删除成功');
                    }
                });
            }
        },
        getBatchDetail (val) {
            this.$call('product.batch.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // this.formValidate.selectProductCode = val.codeName;
                    this.formValidate.selectProductCode = content.res.productName + ' (' + content.res.productCode + ')';
                    this.selectMiddleProductCode = content.res.productName + ' (' + content.res.productCode + ')';
                    debugger
                    this.formValidate.productCode = content.res.productCode;
                    this.formValidate.productName = content.res.productName;
                    this.formValidate.productModels = content.res.productModels;
                    this.formValidate.batchCode = content.res.batchCode;
                    this.formValidate.batchDate = content.res.batchDate;
                    this.formValidate.batchStateName = content.res.batchStateName;
                    this.formValidate.auditStateName = content.res.auditStateName;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.isBatchShow = true;
                }
            });
        },
        getProductCategoryList () {
            let params = {
                auditState: 3
            };
            this.$call('product.category.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let data = content.res.map(item => {
                        return {
                            id: item.id,
                            parentId: item.parentId,
                            value: item.id,
                            label: item.name
                        };
                    });
                    let pId = data.find(x => x.parentId === 0).id;
                    this.productCategoryList = xwTools.getTrees(data, pId);
                }
            });
        },
    },
    mounted () {
        (async () => {
            await this.getProcessList();
            await this.getBatchStateCount();
            await this.getProductList();
            await this.getStockType();
            await this.getProductCategoryList();
        })();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 235;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 235;
            }
        };
    },
    watch: {
        curBatchAuditStateId () {
            this.isShowDetail = this.curBatchAuditStateId > 1;
        }
    }
});

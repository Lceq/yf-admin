import modal from  '../../public/modal';
import deleteWarning from  '../../public/deleteWarning';
import {page, curDate} from "../../../libs/tools";
import xwProductPiece from '../../components/xw-select-product/xw-product-piece';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';
import xwValidate from '../../../libs/xwValidate';
export default ({
    components: {
        modal,
        xwProductPiece,
        xwOperationLogModal,
        deleteWarning
    },
    data () {
        return {
            disabled: true,
            workshopId: '',
            processId: '',
            processList: [],
            postName: '',
            total: 0,
            list: [],
            tableHeight: '',
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '日期',
                    key: 'date',
                    sortable: true,
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '生产车间',
                    key: 'workshopName',
                    sortable: true,
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '产品编码',
                    key: 'productCode',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 3) {
                                        this.isSave = false;
                                    } else {
                                        this.isSave = true;
                                    }
                                    this.getDetail(params.row.id);
                                }
                            }
                        }, params.row.productCode);
                    }
                },
                {
                    title: '产品名称',
                    key: 'productName',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '计件单位',
                    key: 'pieceUnitId',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.pieceUnitId === 1 ? '千米' : (params.row.pieceUnitId === 2 ? '公斤' : (params.row.pieceUnitId === 3 ? '吨' : '')));
                    }
                },
                {
                    title: '数据状态',
                    key: 'auditState',
                    align: 'center',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.auditState === 1 ? '创建' : (params.row.auditState === 3 ? '已审核' : ''));
                    }
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    sortable: true,
                    minWidth: 130
                }
            ],
            codeName: '',
            pageOpts: page().pageOpts,
            pageSize: page().pageSize,
            pageIndex: 1,
            //
            show: false,
            loading: false,
            isSave: true,
            title: '',
            fixedTitle: '',
            fixedList: [],
            // fixedColumns: [],
            fixedColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '岗位',
                    key: 'postName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '定额看台数',
                    key: 'quotaOpeningNumber',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.quotaOpeningNumber,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.quotaOpeningNumber = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班标准产量',
                    key: 'standardOutput',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutput,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutput = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班折合公斤数',
                    key: 'standardOutputKg',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutputKg,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutputKg = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '单价工资标准',
                    key: 'unitPriceWage',
                    align: 'center',
                    sortable: true,
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.unitPriceWage,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.unitPriceWage = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '定额工资',
                    key: 'quotaWage',
                    align: 'center',
                    sortable: true,
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.quotaWage,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.quotaWage = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            packColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '是否带纸板',
                    key: 'isCardboard',
                    align: 'center',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.isCardboard === true ? '是' : '否');
                    }
                },
                {
                    title: '每天标准产量',
                    key: 'standardOutput',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutput,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutput = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班折合公斤数',
                    key: 'standardOutputKg',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutputKg,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutputKg = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '单价工资标准(吨)',
                    key: 'unitPriceWage',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.unitPriceWage,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.unitPriceWage = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            postList: [],
            workshopList: [],
            formValidate: {
                date: '',
                pieceUnitId: '',
                eqpModelName: '',
                workshopId: '',
                processName: '',
                productNameCode: '',
                productMath: null,
                processId: ''
            },
            // workshopId: '',
            // workshopList: [],
            ruleValidate: {
                date: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                workshopId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                pieceUnitId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                productNameCode: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            hourState: false,
            quotaType: null,
            selectIds: [],
            deleteWarnShow: false,
            deleteWarnLoading: false,
            deleteWarnMsg: '',
            defaultWorkshopId: '',
            option: [],
            editId: '',
            pieceUnitList: [
                {
                    id: 1,
                    name: '千米'
                },
                {
                    id: 2,
                    name: '公斤'
                },
                {
                    id: 3,
                    name: '吨'
                }
            ],
            remoteloading: false,
            productList: [],
            productMath: '',
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
        };
    },
    methods: {
        remoteMethod (query) {
            if (query) {
                this.remoteloading = true;
                setTimeout(() => {
                    this.remoteloading = false;
                    const list = this.postList;
                    this.option = list.filter(item => item.name.test(query));
                }, 100);
            } else {
                this.option = this.postList;
            }
        },
        changeDate (val) {
            this.formValidate.date = val;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getList();
                this.getProductList();
            });
        },
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
        getList () {
            let params = {
                processId: this.processId,
                workshopId: this.workshopId,
                productNameCode: this.codeName.trim(),
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('product.piece.quota.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.total = content.count;
                    this.list = content.res;
                    this.selectIds = [];
                    this.selectVal = [];
                }
            });
        },
        getDetail (val) {
            this.$call('product.piece.quota.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.editId = val;
                    this.title = content.res.auditState === 3 ? '品种计件定额详情' : '编辑品种计件定额';
                    this.fixedList = content.res.productPieceQuotaPostList;
                    this.formValidate.date = content.res.date;
                    this.formValidate.workshopId = content.res.workshopId;
                    this.formValidate.pieceUnitId = content.res.pieceUnitId;
                    this.formValidate.models = content.res.models;
                    this.formValidate.processName = content.res.processName;
                    this.formValidate.processId = content.res.processId;
                    this.formValidate.productNameCode = content.res.productName + '(' + content.res.productCode + ')';
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.formValidate.productMath = Math.random();
                    this.show = true;
                }
            });
        },
        add () {
            this.show = true;
            this.isSave = true;
            this.editId = null;
            this.title = '新增品种计件定额';
            this.formValidate.date = curDate();
            this.formValidate.workshopId = this.workshopId;
            this.formValidate.pieceUnitId = 1;
            this.formValidate.models = '';
            this.formValidate.processId = '';
            this.formValidate.processName = '';
            this.formValidate.processCode = '';
            this.formValidate.productMath = null;
            this.fixedList = [];
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
        },
        audit () {
            this.$call('product.piece.quota.approve', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getList();
                }
            });
        },
        unAudit () {
            this.$call('product.piece.quota.unapprove', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getList();
                }
            });
        },
        deleteList () {
            if (this.selectVal.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核的而数据，不能删除！</p>'
                });
                return false;
            } else {
                this.deleteWarnMsg = '确定要删除吗';
                this.deleteWarnShow = true;
            }
        },
        searchList () {
            this.pageIndex = 1;
            setTimeout(() => {
                this.total = 0;
            });
            this.getList();
        },
        select (val) {
            this.selectIds = val.map(x => x.id);
            this.selectVal = val.filter(x => x.auditState === 3);
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getList();
        },
        submit () {
            if (!this.formValidate.productMath) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>没有选择产品</p>'
                });
                return false;
            }
            let params = {
                id: this.editId,
                date: this.formValidate.date,
                workshopId: this.formValidate.workshopId,
                workshopName: this.formValidate.workshopId ? this.workshopList.find(x => x.deptId === this.formValidate.workshopId).deptName : '',
                productId: this.formValidate.productId,
                productName: this.formValidate.productName,
                productCode: this.formValidate.productCode,
                pieceUnitId: this.formValidate.pieceUnitId,
                processId: this.formValidate.processId,
                processName: this.formValidate.processName,
                processCode: this.formValidate.processCode,
                models: this.formValidate.models,
                productPieceQuotaPostList: this.fixedList.map(x => {
                    return {
                        postId: this.editId ? x.postId : x.id,
                        postName: x.postName,
                        quotaOpeningNumber: x.quotaOpeningNumber.toFixed(3),
                        standardOutput: x.standardOutput.toFixed(3),
                        standardOutputKg: x.standardOutputKg.toFixed(3),
                        unitPriceWage: x.unitPriceWage.toFixed(3),
                        quotaWage: x.quotaWage.toFixed(3)
                    };
                })
            };
            this.$call('product.piece.quota.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功');
                    this.getList();
                    this.show = false;
                }
            });
        },
        cancel () {
            this.show = false;
            this.formValidate.productNameCode = '';
            // this.formValidate.productMath = null;
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('product.piece.quota.delete', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getList();
                }
            });
        },
        getProductList () {
            let params = {
                workshopId: this.workshopId,
                productNameCode: ''
            };
            this.$call('product.listWhithCp', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.productList = content.res.map(x => {
                        x.codeName = x.name + '(' + x.code + ')';
                        return x;
                    });
                }
            });
        },
        submitProduct (val) {
            if (val.processId) {
                this.formValidate.models = val.models;
                this.formValidate.processId = val.processId;
                this.formValidate.processName = val.processName;
                this.formValidate.processCode = val.processCode;
                this.formValidate.processName = val.processName;
                this.formValidate.productId = val.id;
                this.formValidate.productName = val.name;
                this.formValidate.productCode = val.code;
                this.formValidate.productMath = Math.random();
                this.getFixedList();
            } else {
                this.formValidate.models = '';
                this.formValidate.processId = '';
                this.formValidate.processName = '';
                this.formValidate.processCode = '';
                this.formValidate.processName = '';
                this.formValidate.productId = '';
                this.formValidate.productName = '';
                this.formValidate.productCode = '';
                this.formValidate.productMath = null;
            }
            // if (this.formValidate.processId) {
            // }
        },
        getFixedList () {
            let params = {
                workshopId: this.workshopId,
                processId: this.formValidate.processId
            };
            this.$call('post.listByProcessId', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.fixedList = content.res.map(x => {
                        x.postName = x.name;
                        x.quotaOpeningNumber = 0;
                        x.standardOutput = 0;
                        x.standardOutputKg = 0;
                        x.unitPriceWage = 0;
                        x.quotaWage = 0;
                        return x;
                    });
                }
            });
        }
    },
    mounted () {
        this.getProcess();
        this.getUserWorkshop();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - H - 200;
            });
        };
    }
});

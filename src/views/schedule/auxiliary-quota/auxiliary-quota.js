import modal from  '../../public/modal';
import deleteWarning from  '../../public/deleteWarning';
import {page, curDate} from "../../../libs/tools";
import xwProductPiece from '../../components/xw-select-product/xw-product-piece';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';

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
                        }, params.row.date);
                    }
                },
                {
                    title: '生产车间',
                    key: 'workshopName',
                    sortable: true,
                    align: 'left',
                    minWidth: 110
                },
                // {
                //     title: '产品编码',
                //     key: 'productCode',
                //     align: 'left',
                //     sortable: true,
                //     minWidth: 110,
                //     render: (h, params) => {
                //         return h('a', {
                //             on: {
                //                 'click': () => {
                //                     if (params.row.auditState === 3) {
                //                         this.isSave = false;
                //                     } else {
                //                         this.isSave = true;
                //                     }
                //                     this.getDetail(params.row.id);
                //                 }
                //             }
                //         }, params.row.productCode);
                //     }
                // },
                // {
                //     title: '产品名称',
                //     key: 'productName',
                //     align: 'left',
                //     sortable: true,
                //     minWidth: 110
                // },
                // {
                //     title: '所属工序',
                //     key: 'processName',
                //     align: 'left',
                //     sortable: true,
                //     minWidth: 110
                // },
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
                    title: '辅助工种',
                    key: 'auxiliaryWorkTypeName',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '是否带纸板',
                    key: 'isCardboard',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.isCardboard === true ? '是' : (params.row.isCardboard === false ? '否' : ' '));
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
            postList: [],
            workshopList: [],
            formValidate: {
                date: '',
                pieceUnitId: '',
                eqpModelName: '',
                workshopId: '',
                processName: '',
                productNameCode: '',
                processId: ''
            },
            // workshopId: '',
            // workshopList: [],
            ruleValidate: {},
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
        changeDate (val) {
            this.formValidate.date = val;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getList();
            });
        },
        getPackList () {
            const _this = this;
            let params = {
                parentCode: 'auxiliary_work_type'
            };
            this.$call('dict.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.fixedList = [];
                    content.res.map(x => {
                        if (x.code === 'FZGZ01_SYS' || x.code === 'FZGZ02_SYS') {
                            _this.fixedList.push({
                                auxiliaryWorkTypeId: x.id,
                                auxiliaryWorkTypeCode: x.code,
                                auxiliaryWorkTypeName: x.name,
                                isCardboard: true,
                                standardOutput: 0,
                                unitPriceWage: 0,
                                quotaWage: 0
                            });
                            this.fixedList.push({
                                auxiliaryWorkTypeId: x.id,
                                auxiliaryWorkTypeCode: x.code,
                                auxiliaryWorkTypeName: x.name,
                                isCardboard: false,
                                standardOutput: 0,
                                unitPriceWage: 0,
                                quotaWage: 0
                            });
                        } else {
                            _this.fixedList.push({
                                auxiliaryWorkTypeId: x.id,
                                auxiliaryWorkTypeCode: x.code,
                                auxiliaryWorkTypeName: x.name,
                                isCardboard: null,
                                standardOutput: 0,
                                unitPriceWage: 0,
                                quotaWage: 0
                            });
                        }
                    });
                }
            });
        },
        getList () {
            let params = {
                workshopId: this.workshopId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('auxiliary.quota.list', params).then(res => {
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
            this.$call('auxiliary.quota.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.editId = val;
                    this.title = content.res.auditState === 3 ? '辅助计件定额详情' : '编辑辅助计件定额';
                    this.fixedList = content.res.auxiliaryQuotaDetailList;
                    this.formValidate.date = content.res.date;
                    this.formValidate.workshopId = content.res.workshopId;
                    this.formValidate.pieceUnitId = content.res.pieceUnitId;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.show = true;
                }
            });
        },
        add () {
            this.isSave = true;
            this.show = true;
            this.editId = null;
            this.title = '新增品种计件定额';
            this.formValidate.date = curDate();
            this.formValidate.workshopId = this.workshopId;
            this.formValidate.pieceUnitId = 1;
            this.productMath = Math.random();
            this.getPackList();
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
        },
        audit () {
            this.$call('auxiliary.quota.approve', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getList();
                }
            });
        },
        unAudit () {
            this.$call('auxiliary.quota.unapprove', this.selectIds).then(res => {
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
            let params = {
                id: this.editId,
                date: this.formValidate.date,
                workshopId: this.formValidate.workshopId,
                workshopName: this.formValidate.workshopId ? this.workshopList.find(x => x.deptId === this.formValidate.workshopId).deptName : '',
                pieceUnitId: this.formValidate.pieceUnitId,
                auxiliaryQuotaDetailList: this.fixedList.map(x => {
                    if (x.id) {
                        x.id = null;
                    }
                    x.standardOutput = Number(x.standardOutput).toFixed(3);
                    x.unitPriceWage = Number(x.unitPriceWage).toFixed(3);
                    x.quotaWage = Number(x.quotaWage).toFixed(3);
                    return x;
                })
            };
            this.$call('auxiliary.quota.save', params).then(res => {
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
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('auxiliary.quota.delete', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getList();
                }
            });
        }
    },
    mounted () {
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

import layout from '../../layout/layout';
import deleteWarning from '../../public/deleteWarning';
import modal from '../../public/modal';
export default ({
    components: {
        modal,
        layout,
        deleteWarning
    },
    data () {
        return {
            stateId: 1,
            stateList: [],
            list: [],
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '申请日期',
                    key: 'date',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '入库申请单号',
                    key: 'code',
                    align: 'left',
                    minWidth: 130,
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
                        }, params.row.code);
                    }
                },
                {
                    title: '入库包数',
                    key: 'inStockPacketQty',
                    minWidth: 110,
                    sortable: true,
                    align: 'right'
                },
                {
                    title: '入库重量(kg)',
                    key: 'inWeightPacketQty',
                    align: 'right',
                    minWidth: 130
                },
                {
                    title: '入库状态',
                    key: 'inStockState',
                    minWidth: 110,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.row.inStockState === 1 ? '已入库' : '未入库');
                    }
                },
                {
                    title: 'ERP入库单号',
                    key: 'code',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '生产车间',
                    key: 'workshopName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '创建人',
                    key: 'createName',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            dateFrom: '',
            dateTo: '',
            selectIds: [],
            workshopList: [],
            workshopId: '',
            code: '',
            tableHeight: '',
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            show: false,
            loading: false,
            title: '',
            isSave: true,
            formValidate: {},
            ruleValidate: {},
            packInList: [],
            packInColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '产品',
                    key: 'productName',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '未入库包数',
                    key: 'onStockPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '未入库重量',
                    key: 'onWeightPacketQty',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '入库包数',
                    key: 'inStockPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.inStockPacketQty,
                                max: params.row.onStockPacketQty
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.inStockPacketQty = val;
                                    this.packInList[params.index] = params.row;
                                    this.getTotal();
                                }
                            }
                        });
                    }
                },
                {
                    title: '入库重量',
                    key: 'inWeightPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.inWeightPacketQty,
                                max: params.row.onWeightPacketQty
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.inWeightPacketQty = val;
                                    this.packInList[params.index] = params.row;
                                    this.getTotal();
                                }
                            }
                        });
                    }
                }
            ]
        };
    },
    methods: {
        getTotal () {
            let onStockPacketQty = 0;
            let onWeightPacketQty = 0;
            let inStockPacketQty = 0;
            let inWeightPacketQty = 0;
            // debugger
            this.packInList.slice(0, this.packInList.length - 1).map(x => {
                onStockPacketQty += (x.onStockPacketQty === null ? 0 : x.onStockPacketQty);
                onWeightPacketQty += (x.onWeightPacketQty === null ? 0 : x.onWeightPacketQty);
                inStockPacketQty += (x.inStockPacketQty === null ? 0 : x.inStockPacketQty);
                inWeightPacketQty += (x.inWeightPacketQty === null ? 0 : x.inWeightPacketQty);
            });
            this.packInList[this.packInList.length - 1].onStockPacketQty = onStockPacketQty;
            this.packInList[this.packInList.length - 1].onWeightPacketQty = onWeightPacketQty;
            this.packInList[this.packInList.length - 1].inStockPacketQty = inStockPacketQty;
            this.packInList[this.packInList.length - 1].inWeightPacketQty = inWeightPacketQty;
        },
        submit () {
            let params = {
                id: this.formValidate.id,
                workshopName: this.workshopList.find(x => x.deptId === this.workshopId).deptName,
                workshopId: this.workshopId,
                inStockPacketQty: this.packInList[this.packInList.length - 1].inStockPacketQty,
                inWeightPacketQty: this.packInList[this.packInList.length - 1].inWeightPacketQty,
                packInStockProductList: []
            };
            params.packInStockProductList = this.packInList.slice(0, this.packInList.length - 1).map(x => {
                return {
                    // id: x.id,
                    // inStockPacketQty: x.inStockPacketQty,
                    // inWeightPacketQty: x.inWeightPacketQty,
                    productId: x.productId,
                    productName: x.productName,
                    productCode: x.productCode,
                    productModels: x.productModels,
                    batchCode: x.batchCode,
                    unitId: x.unitId,
                    unitCode: x.unitCode,
                    unitName: x.unitName,
                    inStockPacketQty: x.inStockPacketQty,
                    inWeightPacketQty: x.inWeightPacketQty,
                    packReportIds: x.packReportIds
                };
            });
            this.$call('pack.in.stock.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功！');
                    this.getCount();
                    this.show = false;
                }
            });
        },
        cancel () {
            this.show = false;
        },
        getDetail (val) {
            const _this = this;
            this.$call('pack.in.stock.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.id = content.res.id;
                    this.formValidate.code = content.res.code;
                    this.formValidate.stockDate = content.res.date;
                    this.formValidate.workshopName = content.res.workshopName;
                    this.packInList = content.res.packInStockProductList;
                    _this.packInList.push(
                        {
                            batchCode: '合计',
                            onStockPacketQty: 0,
                            onWeightPacketQty: 0,
                            inStockPacketQty: 0,
                            inWeightPacketQty: 0
                        }
                    );
                    _this.getTotal();
                    this.show = true;
                    this.title = '入库申请详情';
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('pack.in.stock.delete', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.error('删除成功');
                    this.deleteWarnShow = false;
                }
            });
        },
        // 判断是否有默认车间
        getUserWorkshops () {
            this.$call('user/data/workshops2').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopId = content.res.defaultDeptId;
                    this.workshopList = content.res.userData;
                    this.getCount();
                }
            });
        },
        getCount () {
            this.$call('pack.in.stock.stateCount', { workshopId: this.workshopId }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.stateList = content.res.map(x => {
                        x.count = x.num;
                        return x;
                    });
                    this.getList();
                }
            });
        },
        getList () {
            let params = {
                workshopId: this.workshopId,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                packInStockCode: this.code.trim(),
                auditState: this.stateId
            };
            this.$call('pack.in.stock.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.list = content.res;
                }
            });
        },
        selectMenu (val) {
            this.stateId = val.id;
            this.dateFrom = '';
            this.dateTo = '';
            this.code = '';
            this.getList();
        },
        select (val) {
            this.selectIds = val.map(x => x.id);
        },
        audit () {
            this.$call('pack.in.stock.approve', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.success('审核成功');
                }
            });
        },
        deleteList () {
            this.deleteWarnShow = true;
            this.deleteWarnMsg = '确定要删除吗？';
        },
        changeStartDate (val) {
            this.dateFrom = val;
        },
        changeEndDate (val) {
            this.dateTo = val;
        },
        searchResult () {
            this.getList();
        }
    },
    mounted () {
        this.getUserWorkshops();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        };
    }
})

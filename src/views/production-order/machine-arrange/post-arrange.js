import {curDate, page} from '../../../libs/tools';
import xwSelectProductPre from '../../components/xw-select-product/xw-select-product-pre';
export default {
    components: {
        xwSelectProductPre
    },
    data () {
        return {
            tableHeight: '',
            machineArrangeColumns: [
                {
                    title: '选择',
                    width: 60,
                    align: 'center',
                    key: 'selection',
                    render: (h, params) => {
                        const _this = this;
                        return h('Checkbox', {
                            props: {
                                value: params.row.select
                            },
                            on: {
                                'on-change': (val) => {
                                    _this.machineArrangeData.map(x => {
                                        x.select = false;
                                        return x;
                                    });
                                    _this.machineArrangeData[params.index].select = val;
                                    if (val) _this.curMachineArrangeIds = params.row.id;
                                    else _this.curMachineArrangeIds = [];
                                }
                            }
                        });
                    }
                },
                {
                    title: '生产订单号',
                    sortable: true,
                    align: 'left',
                    key: 'prdOrderCode',
                    minWidth: 100,
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                placement: 'right-start'
                            },
                            style: {
                                float: 'left'
                            }
                        }, [
                            h('p', {
                                style: {
                                    color: '#ff9900',
                                    textAlign: 'left'
                                }
                            }, params.row.prdOrderCode),
                            h('div', {
                                slot: 'content',
                                style: {
                                    textAlign: 'left'
                                }
                            }, [
                                h('div', {
                                }, [
                                    h('span', {
                                        style: {
                                            // textAlign: 'right',
                                            width: '90px',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }
                                    }, '订单产品：'),
                                    h('span', {}, params.row.orderProductName + ' (' + params.row.orderProductCode + ')')
                                ]),
                                h('div', {}, [
                                    h('span', {
                                        style: {
                                            width: '90px',
                                            // textAlign: 'right',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }
                                    }, '生产数量：'),
                                    h('span', {}, params.row.orderProductionQty)
                                ]),
                                h('div', {}, [
                                    h('span', {
                                        style: {
                                            // textAlign: 'right',
                                            width: '90px',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }
                                    }, '生产批号：'),
                                    h('span', {}, params.row.orderBatchCode)
                                ]),
                                h('div', {}, [
                                    h('span', {
                                        style: {
                                            // textAlign: 'right',
                                            width: '90px',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }
                                    }, '交货开始日期：'),
                                    h('span', {}, params.row.deliveryDateFrom)
                                ]),
                                h('div', {}, [
                                    h('span', {
                                        style: {
                                            // textAlign: 'right',
                                            width: '90px',
                                            display: 'inline-block',
                                            fontWeight: 'bold'
                                        }
                                    }, '交货结束日期：'),
                                    h('span', {}, params.row.deliveryDateTo)
                                ])
                            ])
                        ]);
                    }
                },
                {
                    title: '产品编码',
                    align: 'left',
                    sortable: true,
                    key: 'productName',
                    minWidth: 90
                },
                {
                    title: '制作BOM单号',
                    align: 'left',
                    sortable: true,
                    key: 'prdBomCode',
                    minWidth: 115
                },
                {
                    title: '产品名称',
                    align: 'left',
                    sortable: true,
                    key: 'productName',
                    minWidth: 90
                },
                {
                    title: '规格',
                    align: 'left',
                    sortable: true,
                    key: 'productModels',
                    minWidth: 90
                },
                {
                    title: '批号',
                    align: 'left',
                    sortable: true,
                    key: 'batchCode',
                    minWidth: 90
                },
                {
                    title: '单位',
                    align: 'left',
                    key: 'unitCode',
                    sortable: true,
                    minWidth: 90,
                    render: (h, params) => {
                        return h('span', {}, params.row.unitName + '(' + params.row.unitCode + ')');
                    }
                },
                {
                    title: '生产数量',
                    align: 'right',
                    key: 'productionQty',
                    sortable: true,
                    minWidth: 90
                },
                {
                    title: '生产工序',
                    key: 'processName',
                    align: 'center',
                    sortable: true,
                    minWidth: 90
                },
                {
                    title: '生产车间',
                    align: 'left',
                    sortable: true,
                    key: 'workshopName',
                    minWidth: 90
                },
                {
                    title: '计划开工时间',
                    key: 'planStartDate',
                    align: 'left',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '计划完工时间',
                    align: 'left',
                    sortable: true,
                    key: 'planFinishDate',
                    minWidth: 110
                }
            ],
            machineArrangeData: [],
            dateFrom: '',
            dateTo: '',
            curProcessId: null,
            processList: [],
            workShopList: [],
            curWorkShop: '',
            bomCode: '',
            orderCode: '',
            productNameCode: '',
            batchCode: '',
            productBatch: '',
            orderSelectedShow: false,
            reportPageOpts: page().pageOpts,
            pageTotal: 0,
            pageUp: page().pageUp,
            pageSize: page().pageSize,
            pageIndex: page().pageIndex,
            curProcessTypeId: null,
            processTypeList: [],
            isBeforeType: true,
            machineArrangeLoading: false,
            productId: ''
        };
    },
    methods: {
        getMachineArrangeList () {
            let params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                processTypeId: this.curProcessTypeId,
                // bomCode: this.bomCode.trim(),
                orderCode: this.orderCode.trim(),
                batchCode: this.batchCode.trim(),
                // productNameCode: this.productNameCode.trim(),
                processId: this.curProcessId,
                productId: this.productId,
                workshopId: this.curWorkShop
            };
            this.machineArrangeLoading = true;
            this.$call('prd.bom.product.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineArrangeLoading = false;
                    this.pageTotal = content.count;
                    this.machineArrangeData = content.res.map(x => {
                        x.select = false;
                        return x;
                    });
                    this.curMachineArrangeIds = [];
                    // console.log(this.machineArrangeData);
                }
            });
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getMachineArrangeList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getMachineArrangeList();
        },
        orderShow () {
            this.orderSelectedShow = !this.orderSelectedShow;
        },
        changeStartTime (val) {
            this.dateFrom = val;
        },
        changeEndTime (val) {
            this.dateTo = val;
        },
        selectProduct (val) {
            if (val) {
                this.productNameCode = val.codeName;
                this.productId = val.id;
            } else {
                this.productNameCode = '';
                this.productId = '';
            }
        },
        searchResult () {
            this.getMachineArrangeList();
        },
        machineArrange () {
            if (this.curMachineArrangeIds.length === 0) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请选择操作对象</p>'
                });
            } else {
                this.$router.push({
                    path: 'addNotice',
                    query: {
                        arrangeId: JSON.stringify([this.curMachineArrangeIds]),
                        activated: true
                    }
                });
            }
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.curWorkShop = res.curWorkshopId;
                this.workShopList = res.workshopList;
                this.getProcessType();
                // debugger
            });
        },
        getProcessType () {
            this.$call('dict.list', {parentCode: 'process_type'}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.curProcessTypeId = content.res[1].id;
                    this.processTypeList = content.res;
                    this.getProcessList();
                }
            });
        },
        // 获取工序
        getProcessList () {
            // this.$api.process.getSearchProcessList({typeId: this.curProcessTypeId}).then(res => {
            this.$call('process/list', {
                auditState: 3,
                state: 1,
                processTypeId: this.curProcessTypeId
            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = content.res;
                    this.getMachineArrangeList();
                }
            });
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 210;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 210;
            }
        };
    }
};

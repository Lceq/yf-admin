import {curDate, page} from '../../../libs/tools';
export default {
    data () {
        return {
            tableHeight: '',
            machineArrangeColumns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '选择',
                    width: 60,
                    align: 'center',
                    key: 'selection',
                    render: (h, params) => {
                        const _this = this;
                        if (this.isBeforeType) {
                            return h('Checkbox', {
                                props: {
                                    value: params.row.select
                                },
                                on: {
                                    'on-change': (val) => {
                                        _this.machineArrangeData[params.index].select = val;
                                        _this.machineArrangeData.filter(x => x.select === true).map(y => {
                                            let obj = _this.machineArrangeData.find(x => x.select === true);
                                            if (obj) {
                                                if (y.productId !== obj.productId || y.batchCode !== obj.batchCode) {
                                                    this.$Modal.warning({
                                                        title: '提示',
                                                        content: '<p>物料的品种或者批次不一致</p>'
                                                    });
                                                    _this.machineArrangeData[params.index].select = false;
                                                } else {
                                                    //
                                                }
                                            }
                                        });
                                        _this.curMachineArrangeIds = _this.machineArrangeData.filter(x => x.select === true).map(y => y.id);
                                    }
                                }
                            });
                        } else {
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
                                        _this.curMachineArrangeIds = params.row.id;
                                    }
                                }
                            });
                        }
                    }
                },
                // {
                //     title: '操作',
                //     align: 'center',
                //     width: 90,
                //     render: (h, params) => {
                //         return h('Button', {
                //             props: {
                //                 size: 'small'
                //             },
                //             on: {
                //                 'click': () => {
                //                     // debugger
                //                     this.$router.push({
                //                         path: 'addNotice',
                //                         query: {
                //                             arrangeId: params.row.id,
                //                             activated: true
                //                         }
                //                     });
                //                 }
                //             }
                //         }, '机台排产');
                //     }
                // },
                {
                    title: '产品编码',
                    align: 'center',
                    key: 'productCode',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                placement: 'right-start'
                            }
                        }, [
                            h('span', {
                                style: {
                                    color: '#ff9900'
                                }
                            }, params.row.productCode),
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
                                    }, '产品：'),
                                    h('span', {}, params.row.productName)
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
                                    h('span', {}, params.row.productionQty)
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
                                    h('span', {}, params.row.batchCode)
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
                    title: '产品名称',
                    align: 'center',
                    key: 'productName',
                    minWidth: 90
                },
                {
                    title: '生产订单号',
                    align: 'center',
                    key: 'prdOrderCode',
                    minWidth: 90
                },
                {
                    title: 'BOM单号',
                    key: 'prdBomCode',
                    align: 'center',
                    minWidth: 90
                },
                {
                    title: 'BOM日期',
                    align: 'center',
                    key: 'prdBomDate',
                    minWidth: 90
                },
                {
                    title: '生产车间',
                    align: 'center',
                    key: 'workshopName',
                    minWidth: 90
                },
                {
                    title: '加工工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 90
                },
                {
                    title: '单位',
                    align: 'center',
                    key: 'unitCode',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('span', {}, params.row.unitName + '(' + params.row.unitCode + ')');
                    }
                },
                {
                    title: '生产批次',
                    align: 'center',
                    key: 'batchCode',
                    minWidth: 90
                },
                {
                    title: '生产数量',
                    align: 'right',
                    key: 'productionQty',
                    minWidth: 90
                }
            ],
            machineArrangeData: [],
            dateFrom: '',
            dateTo: curDate(),
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
            machineArrangeLoading: false
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
                bomCode: this.bomCode.trim(),
                orderCode: this.orderCode.trim(),
                batchCode: this.batchCode.trim(),
                productNameCode: this.productNameCode.trim(),
                processId: this.curProcessId,
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
                    console.log(this.machineArrangeData);
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
        searchResult () {
            this.getMachineArrangeList();
        },
        machineArrange () {
            if (this.isBeforeType) {
                if (this.curMachineArrangeIds.length === 0) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p>未选择数据</p>'
                    });
                } else {
                    this.$router.push({
                        path: 'addNotice',
                        query: {
                            arrangeId: JSON.stringify(this.curMachineArrangeIds),
                            activated: true
                        }
                    });
                    this.$route.meta.keepAlive = false;
                }
            } else {
                this.$router.push({
                    path: 'addNotice',
                    query: {
                        arrangeId: this.curMachineArrangeIds,
                        activated: true
                    }
                });
                this.$route.meta.keepAlive = false;
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
                    this.curProcessTypeId = content.res[0].id;
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
        },
        // 工序类别
        changeProcessType (val) {
            if (val === 86) {
                this.isBeforeType = true;
            } else {
                this.isBeforeType = false;
            }
            this.curProcessId = '';
            this.getProcessList();
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

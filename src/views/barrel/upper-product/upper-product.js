import layout from '../../layout/layout';
import {page} from "../../../libs/tools";
import modal from '../../public/modal';
export default ({
    components: {
        layout,
        modal
    },
    data () {
        return {
            typeList: [
                {
                    id: 1,
                    name: '未设定'
                },
                {
                    id: 2,
                    name: '已设定'
                }
            ],
            typeId: 0,
            dateFrom: '',
            dateTo: '',
            workshopId: '',
            processId: '',
            processTypeId: '',
            workshopList: [],
            processList: [],
            processTypeList: [],
            code: '',
            prdOrderCode: '',
            batchCode: '',
            product: '',
            tableHeight: '',
            orderSelectedShow: false,
            upperProductLoading: false,
            upperProductColumns: [
                {
                    title: '操作',
                    width: 100,
                    fixed: 'left',
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    this.getDetailUpper(params.row.id);
                                }
                            }
                        }, '上机物料设定')
                    }
                },
                {
                    title: '生产通知单',
                    minWidth: 100,
                    align: 'left',
                    fixed: 'left',
                    key: 'code'
                },
                {
                    title: '生产订单号',
                    minWidth: 100,
                    align: 'left',
                    key: 'prdOrderCodes'
                },
                {
                    title: '计划开工时间',
                    minWidth: 100,
                    align: 'left',
                    key: 'planStartDate'
                },
                {
                    title: '计划完工时间',
                    minWidth: 100,
                    align: 'left',
                    key: 'planFinishDate'
                },
                {
                    title: '产品编码',
                    minWidth: 100,
                    align: 'left',
                    key: 'productCode'
                },
                {
                    title: '产品名称',
                    minWidth: 100,
                    align: 'left',
                    key: 'productName'
                },
                {
                    title: '批号',
                    minWidth: 100,
                    align: 'left',
                    key: 'batchCode'
                },
                {
                    title: '单位',
                    minWidth: 100,
                    align: 'left',
                    key: 'unitName',
                    render: (h, params) => {
                        return h('span', {}, params.row.unitName + ' (' + params.row.unitCode + ')')
                    }
                },
                {
                    title: '生产数量',
                    minWidth: 100,
                    align: 'right',
                    key: 'productionQty'
                },
                {
                    title: '排产机台数量',
                    minWidth: 100,
                    align: 'right',
                    key: 'machineNumber'
                },
                {
                    title: '生产工序',
                    minWidth: 100,
                    sortable: true,
                    align: 'center',
                    key: 'processName'
                },
                {
                    title: '所属工段',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    key: 'processTypeName'
                },
                {
                    title: '生产车间',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    key: 'workshopName'
                },
                {
                    title: '创建人',
                    minWidth: 100,
                    sortable: true,
                    align: 'center',
                    key: 'createName'
                },
                {
                    title: '创建日期',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    key: 'createTime'
                },
            ],
            upperProductList: [],
            isFeedingSetted: false,
            pageDirect: page().pageUp,
            pageOpts: page().pageOpts,
            pageSize: page().pageSize,
            pageIndex: '',
            pageTotal: 0,
            productShow: false,
            productTitle: '',
            productModal: {
                code: '',
                processName: '',
                productName: '',
                batchCode: '',
            },
            productValidate: {},
            leftProductList: [],
            rightProductList: [],
            leftProductColumns: [
                {
                    title: '上机筒位编码',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1)
                    }
                },
                {
                    title: '上机物料',
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', {}, [
                            h('Select', {
                                props: {
                                    transfer: true,
                                    value: params.row.mproductId,
                                },
                                style: {
                                    textAlign: 'left'
                                },
                                on: {
                                    'on-change': (data) => {
                                        // if (this.typeId === 0) {
                                        _this.leftProductList[params.index].mproductId = data;
                                        // }
                                        // if (this.typeId === 1) {
                                        //     _this.rightProductList[params.index].mproductId = data;
                                        // }
                                        // debugger
                                    }
                                }
                            }, [
                                _this.productList.map(item => {
                                    return h('Option', {
                                        props: {value: item.mproductId, key: item.mproductId}
                                    }, item.mproductName);
                                })
                            ])
                        ])
                    }
                }
            ],
            rightProductColumns: [
                {
                    title: '上机筒位编码',
                    width: 100,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1)
                    }
                },
                {
                    title: '上机物料',
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', {}, [
                            h('Select', {
                                props: {
                                    transfer: true,
                                    value: params.row.mproductId,
                                },
                                style: {
                                    textAlign: 'left'
                                },
                                on: {
                                    'on-change': (data) => {
                                        _this.rightProductList[params.index].mproductId = data;
                                    }
                                }
                            }, [
                                _this.productList.map(item => {
                                    return h('Option', {
                                        props: {value: item.mproductId, key: item.mproductId}
                                    }, item.mproductName);
                                })
                            ])
                        ])
                    }
                }
            ],
            productList: [],
            prdNoticeId: '',
            mproductId: '',
            mproductCode: '',
            mproductName: '',
            mbatchCode: '',
            middleWorkshopId: '',
        };
    },
    methods: {
        getDataList (val) {
            let data = [];
            let i = 0;
            while (i < val) {
                data.push({
                    index: i + 1,
                    mproductId: '',
                    mproductCode: '',
                    mproductName: '',
                    mbatchCode: '',
                });
                i++;
            }
            return data;
        },
        getDetailUpper (val) {
            this.$call('prd.notice.feeding.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.productList = content.res.prdBomMaterielList;
                    this.prdNoticeId = content.res.id;
                    this.productModal.code = content.res.code;
                    this.productModal.processName = content.res.processName;
                    this.productModal.productName = content.res.productName;
                    this.productModal.batchCode = content.res.batchCode;
                    if (this.typeId === 0) {
                        this.leftProductList = [];
                        this.rightProductList = [];
                        this.leftProductList = this.getDataList(8).map(x => {
                            x.mproductId = this.productList[0].mproductId;
                            return x;
                        });
                        this.rightProductList = this.getDataList(8).map(x => {
                            x.mproductId = this.productList[0].mproductId;
                            return x;
                        });
                    }
                    if (this.typeId === 1) {
                        this.leftProductList = [];
                        this.rightProductList = [];
                        this.leftProductList = content.res.prdNoticeFeedingList.filter(x => x.side === 0).map(y => {
                            y.productId = y.mproductId;
                            return y;
                        });
                        this.rightProductList = content.res.prdNoticeFeedingList.filter(x => x.side === 1).map(y => {
                            y.productId = y.mproductId;
                            return y;
                        });
                    }
                    this.productTitle = '上机物料设定';
                    this.productShow = true;
                }
            })
        },
        orderShow () {
            this.orderSelectedShow = !this.orderSelectedShow;
        },
        selectMenu (val) {
            // this.$Message.success('保存成功');
            this.pageIndex = 1;
            this.pageSize = page().pageSize;
            this.dateFrom= '';
            this.dateTo= '';
            this.code= '';
            this.prdOrderCode= '';
            this.batchCode= '';
            this.product= '';
            // this.workshopId= this.middleWorkshopId;

            this.typeId = val.id;
            if (val.id === 0) {
                this.isFeedingSetted = false;
                this.getSortNum();
            };
            if (val.id === 1) {
                this.isFeedingSetted = true;
                this.getSortNum();
            };
        },
        changeDateFrom (val) {
            this.dateFrom = val;
        },
        changeDateTo (val) {
            this.dateTo = val;
        },
        searchProduct () {
            this.getSortNum();
        },
        productSubmit () {
            let params1 = this.leftProductList.map(x => {
                return {
                    // id: this.typeId === 0 ? null : x.id,
                    prdNoticeId:this.prdNoticeId,
                    mproductId: x.mproductId,
                    mproductCode: x.mproductId ? this.productList.find(y => y.mproductId === x.mproductId).mproductCode : '',
                    mproductName:  x.mproductId ? this.productList.find(y => y.mproductId === x.mproductId).mproductName : '',
                    mbatchCode:  x.productId ? this.productList.find(y => y.mproductId === x.mproductId).mbatchCode : '',
                    side: 0,
                    positionNumber:  this.typeId === 0 ? x.index : x.positionNumber
                }
            });
            let params2 = this.rightProductList.map(x => {
                return {
                    // id: this.typeId === 0 ? null : x.id,
                    prdNoticeId:this.prdNoticeId,
                    mproductId: x.mproductId,
                    mproductCode:  x.mproductId ? this.productList.find(y => y.mproductId === x.mproductId).mproductCode : '',
                    mproductName:  x.mproductId ? this.productList.find(y => y.mproductId === x.mproductId).mproductName : '',
                    mbatchCode:  x.mproductId ? this.productList.find(y => y.mproductId === x.mproductId).mbatchCode : '',
                    side: 1,
                    positionNumber: this.typeId === 0 ? x.index : x.positionNumber
                }
            });
            let param = params1.concat(params2);
            // debugger
            this.$call('prd.notice.feeding.save', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功');
                    this.dateFrom= '';
                    this.dateTo= '';
                    this.code= '';
                    this.prdOrderCode= '';
                    this.batchCode= '';
                    this.product= '';
                    this.workshopId= this.middleWorkshopId;
                    this.getSortNum();
                    this.productShow = false;
                }
            });
        },
        productCancel () {
            this.productShow = false;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.middleWorkshopId = res.curWorkshopId;
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getSortNum();
            });
        },
        changeProcessType () {
            this.processId = '';
            this.getProcess();
        },
        getProcessType () {
            this.$call('dict.list', { parentCode: 'process_type' }).then(res => {
                if (res.data.status === 200) {
                    this.processTypeList = res.data.res;
                    this.getProcess();
                }
            })
        },
        getProcess () {
            this.$call('process.list', {processTypeId: this.processTypeId, auditState: 3, state: 1}).then(res => {
                if (res.data.status === 200) {
                    this.processList = res.data.res.map(x => {
                        if (x.parentId !== 0) {
                            item.style = 'margin-left:10px;';
                        }
                        return x;
                    });
                }
            });
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getSortNum();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getSortNum();
        },
        getUpperProductList () {
            let params = {
                planStartDateFrom: this.dateFrom,
                planStartDateTo: this.dateTo,
                code: this.code,
                product: this.product,
                prdOrderCode: this.prdOrderCode,
                batchCode: this.batchCode,
                workshopId: this.workshopId,
                // processId: this.processId,
                auditState: 3,
                isFeedingSetted: this.isFeedingSetted,
                isPositionUpper: true,
                // processTypeId: this.processTypeId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
            };
            this.$call('prd.notice.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    this.upperProductList = content.res;
                }
            })
        },
        getSortNum () {
            this.$call('prd.notice.feeding.num', {workshopId: this.workshopId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.typeList = content.res.map(x => {
                        x.count = x.num;
                        return x;
                    });
                    this.getUpperProductList();
                }
            })
        }
    },
    mounted () {
        (async () => {
            this.getUserWorkshop();
            this.getProcessType();
        })();
        this.$nextTick(() => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 220;
            }
        })
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 220;
            }
        };
    }
});

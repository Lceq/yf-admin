import layout from '../../layout';
import {curDate, page} from '../../../libs/tools';
import modal from '../../public/modal';
import {checkoutTypeList, enableState} from "../../../libs/utilState";
export default ({
    components: {
        layout, modal
    },
    data () {
        return {
            dataType: {},
            testList:[],
            processModificationColumns: [
                {
                    title: '操作',
                    minWidth: 120,
                    align: 'center',
                    fixed: 'left',
                    render: (h, params) => {
                        const _this = this;
                        return h('Poptip', {
                            props: {
                                placement: 'right',
                                transfer: true
                            }
                        }, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        _this.$call('prd.notice.machine.qm.list', {id: params.row.id}).then(res => {
                                            let content = res.data;
                                            if (content.status === 200) {
                                                this.testList = content.res;
                                            }
                                        })
                                    }
                                }
                            }, '试纺质检'),
                            h('div', {
                                slot: 'content'
                            }, [
                                _this.testList.map(x => {
                                    return h('div', {}, [
                                        h('Button', {
                                            props: {
                                                size: 'small',
                                                disabled: x.isStandard === true,
                                                type: 'primary'
                                            },
                                            style: {
                                                margin: '5px 10px 5px 5px'
                                            },
                                            on: {
                                                'click': () => {
                                                    if (x.isStandard === true) {
                                                        // 质检通过
                                                        return false;
                                                    }
                                                    if (x.qmTypeCode === 'QM01') {
                                                        if (this.testShow) {
                                                            this.testShow = false;
                                                        }
                                                        this.weightModalData = [];
                                                        this.newId = params.row.id;
                                                        this.getNewDetail();
                                                        // 重量质检
                                                    } else {
                                                        if (this.weightShow) {
                                                            this.weightShow = false;
                                                        }
                                                        this.testModalData = [];
                                                        this.newId = params.row.id;
                                                        this.getQmSearchDetail();
                                                        this.testFormValidate.dataTypeName = x.qmTypeName;
                                                        this.testTitle = x.qmTypeName;
                                                        this.testTypeId = x.qmTypeId;
                                                        // 其他质检
                                                    }
                                                }
                                            }
                                        }, x.qmTypeName),
                                        h('span', {}, x.isStandard === null ? '未检验' : (x.isStandard === false ? '不合格' : (x.isStandard === true ? '质检合格' : ''))),
                                        h('span', {
                                            style: {
                                                marginLeft: '10px'
                                            }
                                        }, x.inspectorName ? '检验人：' + x.inspectorName : ''),
                                        h('span', {
                                            style: {
                                                marginLeft: '10px'
                                            }
                                        }, x.qmDate ? '检验时间：' + x.qmDate : ''),
                                    ])
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '机台',
                    minWidth: 80,
                    sortable: true,
                    align: 'left',
                    key: 'machineCode'
                },
                {
                    title: '生产工序',
                    minWidth: 100,
                    sortable: true,
                    align: 'center',
                    key: 'processName'
                },
                {
                    title: '生产通知号',
                    minWidth: 100,
                    align: 'left',
                    key: 'prdNoticeCode'
                },
                {
                    title: '生产订单号',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'prdOrderCodes',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                placement: 'bottom'
                            }
                        }, [
                            h('span', {
                                style: {
                                    color: '#ff9900',
                                    width: '100px',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }, params.row.prdOrderCodes),
                            h('div', {
                                slot: 'content',
                                style: {
                                    textAlign: 'left',
                                }
                            }, [
                                params.row.prdOrderCodes.split(',').map(item => {
                                    return h('p', {
                                    }, item);
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '生产产品',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'productName'
                },
                {
                    title: '批号',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    key: 'batchCode'
                },
                {
                    title: '计量单位',
                    minWidth: 100,
                    align: 'left',
                    sortable: true,
                    key: 'unitCode',
                    render: (h, params) => {
                        return h('span', {}, params.row.unitName + '(' + params.row.unitCode + ')');
                    }
                },
                {
                    title: '排产数量',
                    minWidth: 100,
                    sortable: true,
                    align: 'right',
                    key: 'productionQty'
                },
                {
                    title: '预计开台时间',
                    minWidth: 130,
                    align: 'left',
                    sortable: true,
                    key: 'planDateFrom'
                },
                {
                    title: '预计了机时间',
                    minWidth: 130,
                    sortable: true,
                    align: 'left',
                    key: 'planDateTo'
                },
                {
                    title: '设备工艺状态',
                    minWidth: 130,
                    sortable: true,
                    align: 'left',
                    key: 'replacementState',
                    render: (h, params) => {
                        return h('span', {}, params.row.replacementState === true ? '已配置' : '未设定');
                    }
                },
                {
                    title: '运转工艺状态',
                    minWidth: 130,
                    sortable: true,
                    align: 'left',
                    key: 'settingState',
                    render: (h, params) => {
                        return h('span', {}, params.row.settingState === true ? '已配置' : '未设定');
                    }
                },
                {
                    title: '试纺质检状态',
                    minWidth: 130,
                    sortable: true,
                    align: 'left',
                    key: 'trialSpinningState',
                    render: (h, params) => {
                        return h('span', {}, params.row.trialSpinningState === 0 ? '未质检' : (params.row.trialSpinningState === 1 ? '不合格' : (params.row.trialSpinningState === 2 ? '合格' : '')));
                    }
                },
                {
                    title: '台时单产',
                    minWidth: 100,
                    sortable: true,
                    align: 'right',
                    key: 'hourYield'
                },
                {
                    title: '工作中心',
                    minWidth: 100,
                    align: 'left',
                    sortable: true,
                    key: 'workCenterName'
                },
                {
                    title: '生产车间',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    key: 'workshopName'
                },
                {
                    title: '制造BOM单号',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'prdBomCodes',
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                trigger: 'hover',
                                placement: 'bottom'
                            }
                        }, [
                            h('span', {
                                style: {
                                    color: '#ff9900',
                                    width: '100px',
                                    display: 'block',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }
                            }, params.row.prdBomCodes),
                            h('div', {
                                slot: 'content',
                                style: {
                                    textAlign: 'left'
                                }
                            }, [
                                params.row.prdBomCodes.split(',').map(item => {
                                    return h('p', {}, item);
                                })
                            ])
                        ]);
                    }
                }
            ],
            processModificationData: [],
            tableHeight: '',
            newId: '',
            orderSelectedShow: false,
            dateFrom: '',
            dateTo: '',
            prdBomCode: '',
            prdOrderCode: '',
            prdNoticeCode: '',
            productNameCode: '',
            prdOrderNoticeCodeName: '',
            processId: '',
            workshopId: '',
            machineNameCode: '',
            workshopList: [],
            processList: [],
            listStateId: 1,
            listState: [
                {
                    id: 1,
                    name: '生产通知单'
                },
                {
                    id: 2,
                    name: '生产订单'
                },
                {
                    id: 3,
                    name: '生产产品'
                }
            ],
            processModificationLoading: false,
            pageSize: page().pageSize,
            pageIndex: 1,
            pageOpts: page().pageOpts,
            pageUp: page().pageUp,
            pageTotal: 0,
            weightShow: false,
            weightSaveLoading: false,
            weightSaveSubmitLoading: false,
            isShowSaveOrSubmit: true,
            isEdit: false,
            weightTitle: '',
            weightFormValidate: {
                inspectorName: '',
                testType: '',
                workshopId: null,
                processName: '',
                productName: '',
                batchCode: '',
                gramWeight: '',
                meters: '',
                numbers: '',
                isTest: '0',
                // gramDeviation: null,
                moistureRegain: null,
                gramDeviation: 0,
                samplingMeters: null,
                testMeters: null
            },
            weightRuleValidate: {},
            testDate: curDate(),
            weightModalData: [],
            weightModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        // return h('span', {}, params.index + 1 === this.weightModalData.length ? '平均值' : params.index + 1);
                        return h('span', {}, params.index + 1 === this.weightModalData.length ? '平均值' : params.index + 1);
                    }
                },
                {
                    title: '重量',
                    key: 'weight',
                    align: 'right',
                    minWidth: 120,
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    value: params.row.weight,
                                    min: 0.1,
                                    max: 999999999
                                },
                                style: {
                                    width: '100%',
                                    display: params.index + 1 === this.weightModalData.length ? 'none' : 'inline-block'
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.weight = val;
                                        if (this.weightFormValidate.moistureRegain === '' || this.weightFormValidate.moistureRegain === undefined || this.weightFormValidate.moistureRegain === null) {
                                            _this.weightModalData.map(x => {
                                                x.dryWeight = '';
                                                x.weightDeviation = '';
                                                return x;
                                            });
                                            _this.$Modal.warning({
                                                title: '提示',
                                                content: '<p>请先填写回潮率</p>'
                                            });
                                            return false;
                                        } else {
                                            // _this.weightModalData.map(x => {
                                            if (!params.row.weight) {
                                                params.row.dryWeight = '';
                                                params.row.weightDeviation = '';
                                                params.row.isStandard = '';
                                            } else {
                                                params.row.dryWeight = (params.row.weight / (1 + _this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                                                params.row.weightDeviation = ((params.row.dryWeight - params.row.gramWeight) / params.row.gramWeight).toFixed(2);
                                                params.row.isStandard = Math.abs(params.row.weightDeviation) < (_this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                                            }
                                            // });
                                        }
                                        // params.row.weight = val;
                                        this.weightModalData[params.index] = params.row;
                                        // this.getWeightTotal();
                                    },
                                    'on-blur': () => {
                                        this.getWeightTotal();
                                    }
                                }
                            }, params.row.weight),
                            h('Span', {
                                style: {
                                    display: params.index + 1 === this.weightModalData.length ? 'inline-block' : 'none'
                                }
                            }, params.row.weight)
                        ]);
                    }
                },
                {
                    title: '干重',
                    key: 'dryWeight',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '定量',
                    key: 'gramWeight',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '重量偏差',
                    key: 'weightDeviation',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '是否合格',
                    key: 'isStandard',
                    align: 'center',
                    minWidth: 80
                }
            ],
            selectIds: [],
            testShow: false,
            testSaveLoading: false,
            testSaveSubmitLoading: false,
            spinShow: false,
            // isShowSaveOrSubmit: true,
            testTitle: '',
            testFormValidate: {
                inspectorId: '',
                prdOrderId: '',
                prdNoticeCode: '',
                prdNoticeId: '',
                inspectorName: '',
                dataTypeName: '',
                workshopId: '',
                workshopName: '',
                machineCode: '',
                processName: '',
                productCode: '',
                productName: '',
                batchCode: '',
                isTest: '1',
                testTypeMean: '',
                isStandard: '',
            },
            isStandardTypeList: enableState,
            testModalData: [],
            testModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                // {
                //     title: '生产通知单号',
                //     key: 'prdNoticeCode',
                //     align: 'center',
                //     minWidth: 80
                // },
                {
                    title: '检测指标',
                    key: 'qmParamName',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标上限值',
                    key: 'valueMax',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标下限值',
                    key: 'valueMin',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标检测值',
                    key: 'detectionValue',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.detectionValue === null ? null : Number(params.row.detectionValue)
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.detectionValue = val;
                                    if (val >= params.row.valueMin && val <= params.row.valueMax) {
                                        params.row.isStandard = '合格';
                                    } else {
                                        params.row.isStandard = '不合格';
                                    }
                                    this.testModalData[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '是否合格',
                    key: 'isStandard',
                    align: 'center',
                    minWidth: 80
                }
            ],
            testRuleValidate: {},
            createTime: '',
            createName: '',
            submitName: '',
            submitTime: '',
            testTypeId: '',
            inspectorList: {}
        };
    },
    methods: {
        // 获取当前员工
        getUserInfo () {
            // this.spinShow = true;
            this.$api.user.getUserInfo().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.inspectorList = content.res;
                }
            });
        },
        getQmSearchDetail () {
            // this.$api.inspection.getQmInspectionDetail({id: this.newId}).then(res => {
            this.$call('prd.notice.machine.detail', {id: this.newId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger;
                    // this.testDate = content.res.qmDate;
                    this.testFormValidate.workshopId = content.res.workshopId;
                    this.testFormValidate.workshopName = content.res.workshopName;
                    // this.testFormValidate.dataTypeName = content.res.qmTypeId;
                    this.testFormValidate.machineCode = content.res.machineCode;
                    // this.curWorkshopId = null;
                    this.testFormValidate.testDate = curDate();
                    this.testFormValidate.inspectorName = this.inspectorList.name;
                    this.testFormValidate.machineId = content.res.machineId;
                    this.testFormValidate.machineCode = content.res.machineCode;
                    this.testFormValidate.processId = content.res.processId;
                    this.testFormValidate.processName = content.res.processName;
                    this.testFormValidate.productId = content.res.productId;
                    this.testFormValidate.prdNoticeCode = content.res.prdNoticeCode;
                    this.testFormValidate.prdNoticeId = content.res.prdNoticeId;
                    this.testFormValidate.productCode = content.res.productCode;
                    this.testFormValidate.productName = content.res.productName;
                    this.testFormValidate.batchCode = content.res.batchCode;
                    this.testFormValidate.isTest = '1';
                    // this.testFormValidate.testType = this.reexamine === true ? 2 : 1;
                    this.testFormValidate.testTypeMean = '初试';
                    this.testFormValidate.isStandard = 1;
                    this.testModalData = [];
                    this.getMachineOpenDetailList();
                    this.testShow = true;
                }
            });
        },
        getMachineOpenDetailList () {
            let params = {
                productId: this.testFormValidate.productId,
                qmTypeId: this.testTypeId
            };
            this.$api.quota.getQmProductParamList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.testModalData = content.res.map(item => {
                        item.detectionValue = null;
                        item.isStandard = null;
                        return item;
                    });
                }
            });
        },
        changeTestElseDate (val) {
            this.testFormValidate.testDate = val;
        },
        // changeWorkshop () {
        //     //
        // },
        testCancel () {
            this.testShow = false;
        },
        testSaveSubmit () {
            let params = {
                id: null,
                qmDate: this.testFormValidate.testDate,
                qmTypeId: this.testTypeId,
                prdNoticeMachineId: this.newId,
                testType: 1,
                isTest: this.testFormValidate.isTest === '1',
                isStandard: this.testFormValidate.isStandard === 1,
                inspectorId: this.testFormValidate.inspectorId,
                inspectorName: this.testFormValidate.inspectorName,
                workshopId: this.testFormValidate.workshopId,
                machineId: this.testFormValidate.machineId,
                processId: this.testFormValidate.processId,
                productId: this.testFormValidate.productId,
                batchCode: this.testFormValidate.batchCode,
                prdNoticeId: this.testFormValidate.prdNoticeId,
                prdNoticeCode: this.testFormValidate.prdNoticeCode,
                auditState: 2,
                qmInspectionParamList: this.testModalData.map(item => {
                    return {
                        detectionValue: item.detectionValue,
                        isStandard: item.isStandard !== '不合格',
                        qmInspectionId: null,
                        qmParamId: item.qmParamId,
                        qmParamName: item.qmParamName,
                        valueMax: item.valueMax,
                        valueMin: item.valueMin
                    };
                })
            };
            this.$api.inspection.getQmInspectionSave(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getProcessModificationData();
                   this.$Message.success('提交成功');
                    this.testShow = false;
                }
            });
        },
        // selectChange (val) {
        //     this.selectIds = val.map(x => x.id);
        // },
        // skipTest () {
        //     this.$call('prd.notice.machine.skip.test', this.selectIds).then(res => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             this.$Message.success('跳过开台');
        //         }
        //     })
        // },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getProcessModificationData();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getProcessModificationData();
        },
        changeStartTime (val) {
            this.dateFrom = val;
        },
        changeEndTime (val) {
            this.dateTo = val;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getProcessModificationData();
            });
        },
        orderShow () {
            this.orderSelectedShow = !this.orderSelectedShow;
        },
        searchResult () {
            if (this.listStateId === 1) {
                this.prdOrderCode = '';
                this.prdNoticeCode = this.prdOrderNoticeCodeName;
                this.productNameCode = '';
            } else if (this.listStateId === 2) {
                this.prdOrderCode = this.prdOrderNoticeCodeName;
                this.prdNoticeCode = '';
                this.productNameCode = '';
            } else {
                this.prdOrderCode = '';
                this.prdNoticeCode = '';
                this.productNameCode = this.prdOrderNoticeCodeName;
            }
            this.getProcessModificationData();
        },
        getProcessModificationData () {
            let params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                planOpenDateFrom: this.dateFrom,
                planOpenDateTo: this.dateTo,
                prdBomCode: this.prdBomCode.trim(),
                prdOrderCode: this.prdOrderCode.trim(),
                prdNoticeCode: this.prdNoticeCode.trim(),
                productNameCode: this.productNameCode.trim(),
                processId: this.processId,
                workshopId: this.workshopId,
                machineNameCode: this.machineNameCode.trim(),
                openingState: 0,
                // replacementState: true,
                // settingState: true,
                trialSpinningState: -2 // 没有质检或者质检已经通过
            };
            this.processModificationLoading = true;
            this.$call('prd.notice.machine.list', params).then(res => {
                let content = res.data;
                this.processModificationLoading = false;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    this.processModificationData = content.res;
                    this.selectIds = [];
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        async getNewDetail () {
            await this.$call('prd.notice.machine.detail', {id: this.newId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    console.log(content.res);
                    this.isEdit = true;
                    this.weightFormValidate.testType = content.res.trialSpinningState === 1 ? 2 : 1;
                    this.weightFormValidate.testTypeMean = checkoutTypeList.find(x => x.id === this.weightFormValidate.testType).name;
                    this.weightFormValidate.workshopId = content.res.workshopId;
                    this.weightFormValidate.workshopName = content.res.workshopName;
                    this.weightFormValidate.machineCode = content.res.machineCode;
                    this.weightFormValidate.machineId = content.res.machineId;
                    this.weightFormValidate.productId = content.res.productId;
                    this.weightFormValidate.processName = content.res.processName;
                    this.weightFormValidate.processId = content.res.processId;
                    this.weightFormValidate.productName = content.res.productName;
                    this.weightFormValidate.productCode = content.res.productCode;
                    this.weightFormValidate.batchCode = content.res.batchCode;
                    this.weightFormValidate.gramWeight = content.res.gramWeight;
                    this.weightFormValidate.meters = content.res.meters;
                    this.weightFormValidate.testMeters = content.res.meters;
                    this.weightFormValidate.numbers = content.res.numbers;
                    this.weightFormValidate.moistureRegain = content.res.moistureRegain;
                    this.weightFormValidate.gramDeviation = content.res.gramDeviation ? content.res.gramDeviation : 0;
                    this.weightFormValidate.samplingMeters = 1;
                    // this.weightFormValidate.testMeters = 1;
                    this.weightFormValidate.isTest = '1';
                    this.getWeightModalNumber();
                }
            });
            this.weightFormValidate.inspectorName = this.inspectorList.name;
            this.weightFormValidate.inspectorId = this.inspectorList.id;
            this.weightTitle = '新增重量质检';
            this.weightShow = true;
        },
        //
        getWeightModalNumber () {
            this.num = parseInt(this.weightFormValidate.samplingMeters / this.weightFormValidate.testMeters);
            this.weightModalData = [];
            let data = {
                weight: 0,
                dryWeight: null,
                gramWeight:this.weightFormValidate.gramWeight,
                weightDeviation: null,
                isStandard: ''
            };
            for (let i = 0; i <= this.num; i++) {
                this.weightModalData.push(data);
            }
        },
        // 获取当前员工
        // getUserInfo () {
        //     this.$api.user.getUserInfo().then(res => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             this.weightFormValidate.inspectorName = content.res.name;
        //             this.weightFormValidate.inspectorId = content.res.id;
        //         }
        //     });
        // },
        changeMoistureRegin (val) {
            this.weightFormValidate.moistureRegain = val;
            this.weightModalData.map(item => {
                item.dryWeight = (item.weight / (1 + this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                item.weightDeviation = ((item.dryWeight - item.gramWeight) / item.gramWeight).toFixed(2);
                item.isStandard = Math.abs(item.weightDeviation) < (this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                return item;
            })
        },
        getWeightTotal () {
            let aReturn = false;
            for (let i = 0; i < this.weightModalData.length - 1; i++) {
                if (!this.weightModalData[i].weight) {
                    aReturn = true;
                }
            }
            if (aReturn) {
                return false
            }
            let weight = this.getAverageValue(this.weightModalData.map(x => x.weight));
            let dryWeight = this.getAverageValue(this.weightModalData.map(x => x.dryWeight));
            let weightDeviation = this.getAverageValue(this.weightModalData.map(x => x.weightDeviation));
            let isStandard = '合格';
            for (let j = 0; j < this.weightModalData.length - 1; j++) {
                if (this.weightModalData[j].isStandard === '不合格') {
                    isStandard = '不合格';
                }
                if (this.weightModalData[j].isStandard === '' || this.weightModalData[j].isStandard === undefined || this.weightModalData[j].isStandard === null) {
                    isStandard = '';
                }
            }
            this.weightModalData[this.weightModalData.length - 1].weight = Number(weight);
            this.weightModalData[this.weightModalData.length - 1].dryWeight = dryWeight;
            this.weightModalData[this.weightModalData.length - 1].gramWeight =this.weightFormValidate.gramWeight;
            this.weightModalData[this.weightModalData.length - 1].weightDeviation = weightDeviation;
            this.weightModalData[this.weightModalData.length - 1].isStandard = isStandard;
        },
        getAverageValue (params) {
            let num = null;
            for (let i = 0; i < params.length - 1; i++) {
                if (params[i] === '' || params[i] === undefined || params[i] === null) {
                    params[i] = 0;
                }
                num += Number(params[i]);
            }
            return (num / (params.length - 1)).toFixed(2);
        },
        rowClassName (row, index) {
            if (index === this.weightModalData.length -1) {
                return 'fontTableBold';
            }
            return '';
        },
        changeSamplingMeters (val) {
            this.weightFormValidate.samplingMeters = val;
            // 计算分成几个
            this.getWeightModalNumber();
        },
        //
        changeTestMeters (val) {
            this.weightFormValidate.testMeters = val;
            // 计算分成几个
            this.getWeightModalNumber();
        },
        testStandard () {
            this.getDryWeightNumber();
        },
        getDryWeightNumber () {
            // debugger
            const _this = this;
            if (this.weightFormValidate.moistureRegain === '' || this.weightFormValidate.moistureRegain === undefined || this.weightFormValidate.moistureRegain === null) {
                _this.weightModalData.map(x => {
                    x.dryWeight = '';
                    x.weightDeviation = '';
                    return x;
                });
                _this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先填写回潮率</p>'
                });
                return false;
            } else {
                // debugger
                for (let i = 0; i < this.weightModalData.length - 1; i++) {
                    let x = this.weightModalData[i];
                    // debugger
                    if (!x.weight) {
                        x.dryWeight = '';
                    } else {
                        x.dryWeight = (x.weight / (1 + _this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                        x.weightDeviation = ((x.dryWeight - x.gramWeight) / x.gramWeight).toFixed(2);
                        x.isStandard = Math.abs(x.weightDeviation) < (_this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                    }
                }
                if (this.weightModalData.length === 1) {
                    this.weightModalData = [];
                }
            }
            this.getWeightTotal();
        },
        changeTestDate (val) {
            this.testData = val;
        },
        weightCancel () {
            this.weightLoading = false;
            this.weightShow = false;
            this.isSave = false;
            this.isSaveSubmit = false;
        },
        weightSave () {
            this.isSave = true;
            this.isSaveSubmit = false;
            this.judgeParams();
        },
        weightSaveSubmit () {
            this.isSave = false;
            this.isSaveSubmit = true;
            this.judgeParams();
            // this.weightLoading = false;
            // this.weightShow = false;
        },
        judgeParams () {
            if (this.weightFormValidate.productId === undefined || this.weightFormValidate.productId === '' || this.weightFormValidate.productId === null) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择机台！</p>'
                });
                return false;
            }
            if (!this.weightModalData.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>没有校验数据</p>'
                });
                return false;
            }
            if (this.weightModalData.find(x => x.weight === '') || this.weightModalData.find(x => x.weight === undefined) || this.weightModalData.find(x => x.weight === null)) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请将所有的检验填写完整！</p>'
                });
                return false;
            }
            const _this = this;
            let params = {
                prdNoticeMachineId: this.newId ? this.newId : null,
                // prdNoticeMachineId: this.newId,
                qmDate: this.testDate,
                inspectorId: this.weightFormValidate.inspectorId,
                inspectorName: this.weightFormValidate.inspectorName,
                testType: this.weightFormValidate.testType,
                workshopId: this.weightFormValidate.workshopId,
                processId: this.weightFormValidate.processId,
                processName: this.weightFormValidate.processName,
                productId: this.weightFormValidate.productId,
                machineId: this.weightFormValidate.machineId,
                productCode: this.weightFormValidate.productCode,
                productName: this.weightFormValidate.productName,
                batchCode: this.weightFormValidate.batchCode,
                gramWeight: this.weightFormValidate.gramWeight,
                meters: this.weightFormValidate.meters,
                isTest: this.weightFormValidate.isTest === '1' ? true : false,
                auditState: this.isSave ? 1 : 2,
                weightNum: this.weightModalData.length - 1,
                weight: this.weightModalData[this.weightModalData.length - 1].weight,
                dryWeight: this.weightModalData[this.weightModalData.length - 1].dryWeight,
                weightDeviation: this.weightModalData[this.weightModalData.length - 1].weightDeviation,
                isStandard: this.weightModalData[this.weightModalData.length - 1].isStandard === '合格' ? true : false,
                numbers: this.weightFormValidate.numbers,
                moistureRegain: this.weightFormValidate.moistureRegain,
                gramDeviation: this.weightFormValidate.gramDeviation,
                samplingMeters: this.weightFormValidate.samplingMeters,
                testMeters: this.weightFormValidate.testMeters,
                qmTypeId: this.dataType.id,
                qmWeightDetailList: this.weightModalData.slice(0, this.weightModalData.length - 1).map(item => {
                    return {
                        qmWeightId: null,
                        weight: item.weight,
                        dryWeight: item.dryWeight,
                        weightDeviation: item.weightDeviation,
                        isStandard: item.isStandard === '合格' ? true : false
                    };
                })
            };
            this.saveQmWeight(params);
        },
        saveQmWeight (params) {
            if (this.isSave) {
                this.weightSaveLoading = true;
                this.weightSaveSubmitLoading = false;
            } else {
                this.weightSaveLoading = false;
                this.weightSaveSubmitLoading = true;
            }
            this.$api.weight.getQmWeightSave(params).then(res => {
                let content = res.data;
                this.weightSaveLoading = false;
                this.weightSaveSubmitLoading = false;
                if (content.status === 200) {
                    if (params.isStandard) {
                        this.$Message.success('产品合格')
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '产品不合格'
                        })
                    }
                    this.getProcessModificationData();
                    this.isSave = false;
                    this.isSaveSubmit = false;
                    this.reexamine = false;
                    this.weightShow = false;
                    this.newId = null;
                }
            });
        },
    },
    updated () {
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 245;
            }
        };
    },
    mounted () {
        this.$api.dictionary.getQmType().then(res => {
            let content = res.data;
            if (content.status === 200) {
                this.dataType = content.res.find(x => x.name === '重量检验');
            }
        });
        this.getUserInfo();
        this.getUserWorkshop();
        this.getProcessList();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 245;
        });
    }
});

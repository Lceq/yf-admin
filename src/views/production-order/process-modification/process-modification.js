
import layout from '../../layout';
import { page } from '../../../libs/tools';
import modal from '../../public/modal';
import xwValidate from '@/libs/xwValidate';
// import api from "../../../ajax/api";
export default ({
    components: {
        layout,
        modal
    },
    data () {
        return {
            loading2: false,
            options2: [],
            curCompletionState: 0,
            orderStateList: [
                {
                    name: '设备工艺',
                    id: 0
                },
                {
                    name: '运转工艺',
                    id: 1
                }
            ],
            isChangeSpecSet: false,
            prdNoticeId: null,
            modificationOne: {},
            // 这
            allSelest: true,
            //zhe
            processModificationColumns: [

                {
                    title: '选择',
                    fixed: 'left',
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
                                    this.prdNoticeId = params.row.prdNoticeId;
                                    this.prdNoticeIdList = this.prdNoticeIdList.concat(params.row.id)
                                    // params.row.
                                        _this.processModificationData[params.index].select = val;
                                    if (params.row.replacementState || params.row.settingState) {
                                        this.$Modal.warning({
                                            title: '提示',
                                            content: '<p>设备工艺状态为已进行或运转工艺状态为已进行</p>'
                                        });
                                        setTimeout(() => {
                                            _this.processModificationData[params.index].select = false;
                                        }, 100);
                                    }
                                    if (_this.processModificationData.length === 1) {
                                        this.allSelest = false
                                    }
                                    _this.processModificationData.filter(x => x.select === true).map(y => {
                                        let obj = _this.processModificationData.find(x => x.select === true);
                                        if (obj) {
                                            if (y.prdOrderCodes !== obj.prdOrderCodes) {
                                                this.$Modal.warning({
                                                    title: '提示',
                                                    content: '<p>生产工序或订单号不一致</p>'
                                                });
                                                setTimeout(() => {
                                                    _this.processModificationData[params.index].select = false;
                                                }, 100);
                                            } else {
                                                this.allSelest = false
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                },
                {
                    title: '操作',
                    sortable: true,
                    minWidth: 120,
                    align: 'center',
                    fixed: 'left',
                    key: 'belongDate',
                    render: (h, params) => {
                        const vm = this;
                        return h('Div', {}, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: vm.curCompletionState === 0 ? 'inline-block' : 'none'
                                },
                                on: {
                                    'click': () => {
                                        this.isChangeSpecSet = true;
                                        this.prdNoticeMachineId = params.row.id;
                                        this.prdNoticeId = params.row.prdNoticeId;
                                        vm.isProcessModificationTitle = '设备工艺';
                                        vm.getPrdBomProductDetail();
                                    }
                                }
                            }, '设备工艺'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: vm.curCompletionState === 1 ? 'inline-block' : 'none'
                                },
                                on: {
                                    'click': () => {
                                        this.isChangeSpecSet = false;
                                        this.prdNoticeMachineId = params.row.id;
                                        this.prdNoticeId = params.row.prdNoticeId;
                                        this.modificationOne = params.row;
                                        // debugger
                                        vm.isProcessModificationTitle = '运转工艺';
                                        vm.getPrdBomProductDetail();
                                    }
                                }
                            }, '运转工艺')
                        ]);
                    }
                },
                // {
                //     type: 'selection',
                //     width: 60,
                //     fixed: 'left',
                //     align: 'center',
                //     // render: (h, params) => {
                //     //     const _this = this;
                //     //     return h('Checkbox', {
                //     //         props: {
                //     //             value: params.row.select
                //     //         },
                //     //         on: {
                //     //             'on-change': () => {
                //     //                 console.log(11)
                //     //             }
                //     //         }
                //     //     });
                //     // }
                // },
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
                                    textAlign: 'left'
                                }
                            }, [
                                params.row.prdOrderCodes.split(',').map(item => {
                                    return h('p', {}, item);
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '生产产品',
                    minWidth: 100,
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
                    key: 'unitName',
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
            replacementState: 'false',
            settingState: '',
            workshopList: [],
            processList: [],
            prdNoticeMachineId: null,
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
            replacementStateList: [
                {
                    id: 'true',
                    name: '已进行设备工艺'
                },
                {
                    id: 'false',
                    name: '未进行设备工艺'
                }
            ],
            settingStateList: [
                {
                    id: 'true',
                    name: '已进行运转工艺'
                },
                {
                    id: 'false',
                    name: '未进行运转工艺'
                }
            ],
            pageSize: page().pageSize,
            pageIndex: 1,
            pageOpts: page().pageOpts,
            pageUp: page().pageUp,
            pageTotal: 0,
            isProcessModification: false,
            isProcessModificationLoading: false,
            isProcessModificationTitle: '',
            isProcessModificationModalLoading: false,
            isProcessModificationColumns: [

                {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('p', {}, params.index + 1);
                    }
                },

                {
                    title: '工艺项目',
                    key: 'specParamName'
                },
                {
                    title: '项目类型',
                    key: 'paramTypeName'
                },
                {
                    title: '改前工艺',
                    key: 'oldVal'
                },
                {
                    title: '设计工艺',
                    key: 'val'
                },
                {
                    title: '上机工艺',
                    key: 'actualVal',
                    render: (h, params) => {
                        const _this = this;
                        if (params.row.inputType === 2) {
                            return h('Select', {
                                props: {
                                    value: params.row.actualVal

                                },
                                style: {
                                    textAlign: 'left'
                                },
                                on: {
                                    'on-change': (data) => {
                                        params.row.actualVal = (params.row.dataType === 1 ? data : data);
                                        _this.isProcessModificationData[params.index] = params.row;
                                        if (params.row.dataType === 1) {
                                            _this.getFormulaData();
                                        }
                                    }
                                }
                            }, [
                                params.row.paramValueList.map(item => {
                                    return h('Option', {
                                        props: { value: item.value, key: item.value },
                                        style: {}
                                    }, item.value);
                                })
                            ]);
                        } else {
                            if (params.row.dataType === 1) {
                                if (params.row.isFormula === true) {
                                    return h('div', [
                                        h('span', {}, params.row.actualVal)
                                    ]);
                                } else {
                                    return h('div', [
                                        h('InputNumber', {
                                            props: {
                                                value: params.row.val ? parseFloat(params.row.val) : null,
                                                min: 0
                                            },
                                            style: {
                                                width: '100%'
                                            },
                                            on: {
                                                'on-change': (e) => {
                                                    params.row.val = e;
                                                    _this.isProcessModificationData[params.index] = params.row;
                                                    _this.getFormulaData();
                                                }
                                            }
                                        })
                                    ]);
                                }
                            }
                            if (params.row.dataType === 2) {
                                return h('Input', {
                                    props: {
                                        value: params.row.actualVal
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (val) => {
                                            params.row.actualVal = val.target.value;
                                            this.isProcessModificationData[params.index] = params.row;
                                        }
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    title: '是否允许为空',
                    key: 'isNull',
                    align: 'center',
                    width: 95,
                    render: (h, params) => {
                        return h('span', {}, params.row.isNull === true ? '是' : '否');
                    }
                },
                {
                    title: '数据类型',
                    align: 'left',
                    key: 'dataTypeName'
                },
                {
                    title: '是否翻改项目',
                    align: 'left',
                    width: 95,
                    key: 'isBusiName'
                }
            ],
            isProcessModificationData: [],
            processModificationForm: {
                productName: '',
                oldProductName: '',
                machineModelName: '',
                gramWeight: '',
                meters: '',
                hourYield: '',
                moistureRegain: '',
                efficiencyPercent: '',
                tubeTypeId: null,
                tubeColorIds: []
            },
            tubeType: [],
            tubeColor: [],
            processModificationFormRule: {
                // tubeTypeId: {required: true, validator: xwValidate.select, trigger: 'change'},
                // tubeColorIds: {required: true, validator: xwValidate.selectedMultiple, trigger: 'change'}
            },
            //    翻转f
            prdNoticeId: '',
            paramType: 1,
            isFlipProcess: false,
            isFlipProcessTitle: '翻转工艺',
            isFlipProcessTitleData: [],
            isflipProcesSelsct: false,
            prdNoticeIdList: [],
            flipProcessTitleForm: {
                productName: '',
                oldProductName: '',
                machineModelName: '',
                gramWeight: '',
                meters: '',
                hourYield: '',
                moistureRegain: '',
                efficiencyPercent: '',
                tubeTypeId: null,
                tubeColorIds: []
            },
        };
    },
    methods: {

        onSelectionEvent (e) {
            // console.log('参数', e)
            let prdOrderCodesList = e.map((item) => item.prdOrderCodes)
            for (var i = 0; i < prdOrderCodesList.length - 1; i++) {
                if (prdOrderCodesList[i] === prdOrderCodesList[i + 1]) {

                    this.allSelest = false
                } else {
                    this.$Modal.warning({
                        title: '提示',
                        content: '<p>生产工序或者订单号不一致</p>'
                    });

                }
            }
        },
        onSeverseTec () {
            this.isFlipProcess = true
            let params = {
                prdNoticeId: this.prdNoticeId,
                paramType: this.paramType
            }
            this.$api.manufacture.rdNoticeMachineSpecObtainByPrdNoticeId(params).then(res => {
                if (res.data.status === 200) {
                    this.flipProcessTitleForm = res.data.res
                    this.isFlipProcessTitleData = res.data.res.prdNoticeMachineSpecParamList
                }
            });

        },
        flipProcessTitleCancel () {
            this.isFlipProcess = false
        },
        flipProcessTitleSubmit () {
            this.isFlipProcess = false
            let params = {
                id: this.flipProcessTitleForm.id ? this.flipProcessTitleForm.id : null,
                paramType: this.paramType,
                prdNoticeMachineIds: this.prdNoticeIdList,
                prdNoticeId: this.prdNoticeId,
                machineModelId: this.flipProcessTitleForm.machineModelId,
                machineModelName: this.flipProcessTitleForm.machineModelName,
                gramWeight: this.flipProcessTitleForm.gramWeight,
                meters: this.flipProcessTitleForm.meters,
                hourYield: this.flipProcessTitleForm.hourYield,
                moistureRegain: this.flipProcessTitleForm.moistureRegain,
                efficiencyPercent: this.flipProcessTitleForm.efficiencyPercent,
                prdNoticeMachineSpecParamList: this.isFlipProcessTitleData.map(item => {
                    return {
                        id: this.flipProcessTitleForm.id ? item.id : null,
                        specParamId: item.specParamId,
                        specParamName: item.specParamName,
                        specParamCode: item.specParamCode,
                        oldVal: item.oldVal,
                        val: item.val,
                        actualVal: item.dataType === 1 ? Number(item.actualVal).toFixed(3) : item.actualVal,
                        // val: item.dataType === 1 ? Number(item.val).toFixed(3) : item.val,
                        paramType: item.paramType,
                        dataType: item.dataType,
                        isBusi: item.isBusi
                    };
                })
            }
            this.$api.manufacture.prdNoticeMachineSpecSaveAll(params).then(res => {
                if (res.data.status === 200) {
                    this.$Message.success('翻转工艺设定成功');
                }
            });
        },
        getFormulaData () {
            let obj = {};
            this.isProcessModificationData.filter(x => x.dataType === 1).map(item => {
                obj[item.specParamCode] = parseFloat(item.actualVal);
            });
            this.isProcessModificationData.filter(x => x.isFormula === true).map(item => {
                if (item.formula) {
                    let value = (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) || (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) !== 'Infinity')) ? (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')'))) : 0;
                    item.actualVal = value ? value.toFixed(3) : null;
                }
                return item;
            });
        },
        remoteMethod2 (query) {
            if (query !== '') {
                this.loading2 = true;
                setTimeout(() => {
                    this.loading2 = false;
                    const list = this.tubeColor;
                    this.options2 = list.filter(item => item.shortName.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                this.options2 = [];
            }
        },
        changeRemote () {
            this.options2 = this.tubeColor;
        },
        changeTubeType () {
            this.processModificationForm.tubeColorIds = [];
            this.processModificationForm.tubeColorNames = [];
            this.getTubeColorList();
        },
        getTubeColorList () {
            let params = {
                classId: this.processModificationForm.tubeTypeId,
                parentCode: 'tube_color'
            };
            this.$call('dict.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tubeColor = content.res.map(item => {
                        item.codeName = item.name + '(' + item.shortName + ')';
                        return item;
                    });
                    this.options2 = this.tubeColor;
                }
            });
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getNum();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getNum();
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
                this.getNum();
            });
        },
        getNum () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('prd.notice.machine.num', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.orderStateList = content.res.map(x => {
                        x.count = x.num;
                        return x;
                    });
                    this.getProcessModificationData();
                }
            });
        },
        orderShow () {
            this.orderSelectedShow = !this.orderSelectedShow;
            setTimeout(() => {
                if (document.getElementById('selectedHeight')) {
                    let Height = document.getElementById('selectedHeight').clientHeight;
                    this.tableHeight = document.documentElement.clientHeight - Height - 235;
                }
            }, 0);
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
            this.getNum();
        },
        selectMenu (val) {
            this.dateFrom = '';
            this.dateTo = '';
            this.processId = '';
            this.prdOrderNoticeCodeName = '';
            this.settingState = '';
            this.replacementState = '';
            this.machineNameCode = '';
            //
            this.prdOrderCode = '';
            this.prdNoticeCode = '';
            this.productNameCode = '';
            this.curCompletionState = val.id;
            this.paramType = val.id + 1
            if (val.id === 0) {
                this.replacementState = 'false';
                this.settingState = '';
            }
            if (val.id === 1) {
                this.replacementState = '';
                this.settingState = 'false';
                this.isflipProcesSelsct = !this.isflipProcesSelsct
            }
            this.getNum();
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
                openingState: 0,
                machineNameCode: this.machineNameCode.trim(),
                replacementState: this.replacementState, // 配件更换的状态 true ? 已经更换过: 未配置
                settingState: this.settingState // 工艺设定的状态 ？ true ？ 已经设定 ？ 未设定
            };
            this.processModificationLoading = true;
            this.$call('prd.notice.machine.list', params).then(res => {
                let content = res.data;
                this.processModificationLoading = false;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    // 有问题
                    this.processModificationData = content.res.map(x => {
                        x.select = false;
                        return x;
                    });
                }
            });
        },
        getPrdBomProductDetail () {
            const _this = this;
            this.$call('prd.notice.machine.spec.obtain', {
                prdNoticeMachineId: this.prdNoticeMachineId,
                paramType: this.isChangeSpecSet ? 1 : 2

            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.processModificationForm = content.res;
                    _this.processModificationForm.tubeColorIds = JSON.parse(content.res.tubeColorIds);
                    // _this.processModificationForm.tubeColorIds = [];
                    _this.isProcessModificationData = content.res.prdNoticeMachineSpecParamList.map(x => {
                        return x;
                    });
                    _this.getTubeColorList();
                    _this.isProcessModification = true;
                }
            });
        },
        processModificationCancel () {
            this.isProcessModification = false;
        },
        processModificationSubmit () {
            if (this.isChangeSpecSet) {
                let isContinue = false;
                this.isProcessModificationData.map(x => {
                    if (!x.isNull && !x.actualVal) {
                        this.$Modal.warning({
                            title: '提示',
                            content: '<span>存在不能为空的工艺项目</span>'
                        });
                        isContinue = true;
                    }
                });
                if (isContinue) {
                    return false;
                }
                let param = {
                    paramType: 1,
                    id: this.processModificationForm.id ? this.processModificationForm.id : null,
                    prdNoticeMachineId: this.prdNoticeMachineId,
                    prdNoticeId: this.prdNoticeId,
                    machineId: this.processModificationForm.machineId,
                    machineCode: this.processModificationForm.machineCode,
                    machineName: this.processModificationForm.machineName,
                    machineModelId: this.processModificationForm.machineModelId,
                    machineModelName: this.processModificationForm.machineModelName,
                    gramWeight: this.processModificationForm.gramWeight,
                    meters: this.processModificationForm.meters,
                    hourYield: this.processModificationForm.hourYield,
                    moistureRegain: this.processModificationForm.moistureRegain,
                    efficiencyPercent: this.processModificationForm.efficiencyPercent,
                    // tubeTypeId: this.processModificationForm.tubeTypeId,
                    // tubeTypeCode: this.processModificationForm.tubeTypeId ? this.tubeType.find(x => x.id === this.processModificationForm.tubeTypeId).code : null,
                    //
                    // tubeTypeName: this.processModificationForm.tubeTypeId ? this.tubeType.find(x => x.id === this.processModificationForm.tubeTypeId).name : null,
                    // tubeColorIds: JSON.stringify(this.processModificationForm.tubeColorIds),
                    // tubeColorNames: this.processModificationForm.tubeColorIds.length > 0 ? JSON.stringify(this.tubeColor.filter(x => this.processModificationForm.tubeColorIds.includes(x.id)).map(y => y.name)) : null,
                    prdNoticeMachineSpecParamList: this.isProcessModificationData.map(item => {
                        return {
                            id: this.processModificationForm.id ? item.id : null,
                            specParamId: item.specParamId,
                            specParamName: item.specParamName,
                            specParamCode: item.specParamCode,
                            oldVal: item.oldVal,
                            val: item.val,
                            actualVal: item.dataType === 1 ? Number(item.actualVal).toFixed(3) : item.actualVal,
                            // val: item.dataType === 1 ? Number(item.val).toFixed(3) : item.val,
                            paramType: item.paramType,
                            dataType: item.dataType,
                            isBusi: item.isBusi
                        };
                    })
                };

                this.$call('prd.notice.machine.spec.save', param).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.isProcessModification = false;
                        this.$Message.success('设备工艺设定成功');
                        this.getNum();
                    }
                });
            }
            if (!this.isChangeSpecSet) {
                this.$refs['processModificationForm'].validate((valid) => {
                    if (valid) {
                        // debugger
                        let isContinue = false;
                        this.isProcessModificationData.map(x => {
                            if (!x.isNull && (!x.actualVal && x.actualVal !== 0)) {
                                this.$Modal.warning({
                                    title: '提示',
                                    content: '<span>存在不能为空的工艺项目</span>'
                                });
                                isContinue = true;
                            }
                        });
                        if (isContinue) {
                            return false;
                        }
                        let param = {
                            paramType: 2,
                            id: this.processModificationForm.id ? this.processModificationForm.id : null,
                            prdNoticeMachineId: this.prdNoticeMachineId,
                            prdNoticeId: this.prdNoticeId,
                            machineId: this.processModificationForm.machineId,
                            machineCode: this.processModificationForm.machineCode,
                            machineName: this.processModificationForm.machineName,
                            machineModelId: this.processModificationForm.machineModelId,
                            machineModelName: this.processModificationForm.machineModelName,
                            gramWeight: this.processModificationForm.gramWeight,
                            meters: this.processModificationForm.meters,
                            hourYield: this.processModificationForm.hourYield,
                            moistureRegain: this.processModificationForm.moistureRegain,
                            efficiencyPercent: this.processModificationForm.efficiencyPercent,
                            tubeTypeId: this.processModificationForm.tubeTypeId,
                            tubeTypeCode: this.processModificationForm.tubeTypeId ? this.tubeType.find(x => x.id === this.processModificationForm.tubeTypeId).code : null,
                            tubeTypeName: this.processModificationForm.tubeTypeId ? this.tubeType.find(x => x.id === this.processModificationForm.tubeTypeId).name : null,
                            // tubeColorIds: (!this.processModificationForm.tubeColorIds || this.processModificationForm.tubeColorIds.length !== 0) ? JSON.stringify(this.processModificationForm.tubeColorIds) : '[]',
                            tubeColorIds: this.processModificationForm.tubeColorIds ? (this.processModificationForm.tubeColorIds.length !== 0 ? JSON.stringify(this.processModificationForm.tubeColorIds) : '[]') : '[]',
                            tubeColorNames: this.processModificationForm.tubeColorIds ? (this.processModificationForm.tubeColorIds.length !== 0 ? JSON.stringify(this.tubeColor.filter(x => this.processModificationForm.tubeColorIds.includes(x.id)).map(y => y.name)) : '[]') : '[]',
                            // tubeColorNames: (!this.processModificationForm.tubeColorIds || this.processModificationForm.tubeColorIds.length !== 0) ? JSON.stringify(this.tubeColor.filter(x => this.processModificationForm.tubeColorIds.includes(x.id)).map(y => y.name)) : '[]',
                            prdNoticeMachineSpecParamList: this.isProcessModificationData.map(item => {
                                return {
                                    id: this.processModificationForm.id ? item.id : null,
                                    specParamId: item.specParamId,
                                    specParamName: item.specParamName,
                                    specParamCode: item.specParamCode,
                                    oldVal: item.oldVal,
                                    val: item.val,
                                    isNull: item.isNull,
                                    actualVal: item.dataType === 1 ? Number(item.actualVal).toFixed(3) : item.actualVal,
                                    // actualVal: item.actualVal,
                                    // val: item.val,
                                    paramType: item.paramType,
                                    dataType: item.dataType,
                                    isBusi: item.isBusi
                                };
                            })
                        };
                        this.$call('prd.notice.machine.spec.save', param).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                this.isProcessModification = false;
                                this.$Message.success('运转工艺设定成功');
                                this.getNum();
                            }
                        });
                    } else {
                        xwValidate.message();
                    }
                });
            }
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // getTubeColor () {
        //     let param = {parentCode: 'tube_color'};
        //     this.$api.dictionary.getTubeColor(param).then(res => {
        //     // this.$call('dict.list ', param).then(res => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             this.tubeColor = content.res;
        //         }
        //     });
        // },
        getTubeType () {
            let param = { parentCode: 'post_type' };
            // this.$call('dict/list ', param).then(res => {
            this.$api.dictionary.getTubeType(param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tubeType = content.res;
                    // if (!this.processModificationForm.tubeColorIds) {
                    this.processModificationForm.tubeColorIds = [];
                    this.tubeColor = [];
                    this.changeTubeType();
                    // }
                }
            });
        }
    },
    updated () {
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 235;
            }
        };
    },
    mounted () {
        // this.getTubeColor();
        this.getTubeType();
        // this.prdNoticeCode = this.prdOrderNoticeCodeName;
        this.getUserWorkshop();
        this.getProcessList();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 235;
        });
        // window.onresize = () => {
        //     if (document.getElementById('selectedHeight')) {
        //         let Height = document.getElementById('selectedHeight').clientHeight;
        //         this.tableHeight = document.documentElement.clientHeight - Height - 260;
        //     }
        // };
    }
});

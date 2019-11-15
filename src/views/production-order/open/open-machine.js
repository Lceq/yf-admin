import layout from '../../layout';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import {curDate, curDatetime, page} from '../../../libs/tools';
import openDetail from './open-detail';
export default ({
    components: {
        layout,
        openDetail,
        modal,
        deleteWarning
    },
    data () {
        return {
            openMachineDetail: {},
            curCompletionState: 0,
            openMachineId: '',
            openMachineDetailId: null,
            openTime: curDatetime(),
            isDetail: false,
            orderStateList: [
                {
                    name: '未开台',
                    id: 0
                },
                {
                    name: '已开台',
                    id: 1
                }
            ],
            openMachineColumns: [],
            openMachineColumnsList: [
                {
                    title: '操作',
                    sortable: true,
                    width: 150,
                    align: 'center',
                    fixed: 'left',
                    key: 'belongDate',
                    render: (h, params) => {
                        const vm = this;
                        return h('Div', {
                        }, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: vm.curCompletionState === 0 ? 'inline-block' : 'none'
                                },
                                on: {
                                    'click': () => {
                                        if (params.row.trialSpinningState === 1) {
                                            this.$Modal.warning({
                                                title: '提示',
                                                content: '该机台检验不合格，不能开台！'
                                            });
                                            return false;
                                        };
                                        if (params.row.replacementState || params.row.settingState) {
                                            // 进行翻改 必须质检
                                            if (params.row.trialSpinningState === 2) {
                                                // 合格
                                                this.isDetail = false;
                                                this.openMachineId = params.row.id;
                                                this.openMachineTitle = '品种开台';
                                                this.getOpenMachineDetail();
                                            } else {
                                                this.$Modal.warning({
                                                    title: '提示',
                                                    content: '该机台翻改之后，未进行质检，不能开台'
                                                });
                                                return false;
                                            }
                                        } else {
                                            // 没有翻改可以开台
                                            this.isDetail = false;
                                            this.openMachineId = params.row.id;
                                            this.openMachineTitle = '品种开台';
                                            this.getOpenMachineDetail();
                                        }
                                    }
                                }
                            }, '开台'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: vm.curCompletionState === 1 ? 'inline-block' : 'none',
                                    marginRight: '5px'
                                },
                                on: {
                                    'click': () => {
                                        this.openMachineId = params.row.prdNoticeMachineOpeningId;
                                        this.deleteWarnShow = true;
                                        this.deleteWarnMsg = '确定要取消开台吗？';
                                    }
                                }
                            }, '取消开台'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.processCode === 'LT' ? false : true
                                },
                                style: {
                                    display: (vm.curCompletionState === 1) ? 'inline-block' : 'none'
                                },
                                on: {
                                    'click': () => {
                                        // let param = {
                                        //     id: params.row.prdNoticeMachineOpeningId
                                        // };
                                        this.openMachineDetailId = Number(params.row.prdNoticeMachineOpeningId);
                                        // this.getChangeSpin(param);
                                    }
                                }
                            }, '更改锭数')
                        ]);
                    }
                },
                {
                    title: '机台',
                    minWidth: 80,
                    sortable: true,
                    align: 'left',
                    key: 'machineCode',
                    render: (h, params) => {
                        const vm = this;
                        return h('a', {
                            on: {
                                click: () => {
                                    if (vm.curCompletionState === 0) {
                                        let para = {
                                            id: params.row.id
                                        };
                                        this.isDetail = true;
                                        this.openMachineTitle = '品种开台详情';
                                        this.getMachineOpenDetail(para);
                                    }
                                    if (vm.curCompletionState === 1) {
                                        let para = {
                                            id: params.row.prdNoticeMachineOpeningId
                                        };
                                        this.isDetail = true;
                                        this.openMachineTitle = '品种开台详情';
                                        this.getMachineOpenDetail2(para);
                                    }
                                }
                            }
                        }, params.row.machineCode);
                    }
                },
                {
                    title: '工序',
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
                                    return h('p', {
                                    }, item);
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '产品',
                    minWidth: 90,
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
                    title: '完工数量',
                    minWidth: 100,
                    sortable: true,
                    align: 'right',
                    key: 'completionQty'
                },
                {
                    title: '预计开台时间',
                    minWidth: 130,
                    align: 'left',
                    sortable: true,
                    key: 'planDateFrom'
                },
                {
                    title: '实际开台时间',
                    minWidth: 130,
                    align: 'left',
                    have: 'actual',
                    sortable: true,
                    key: 'startTime'
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
                    minWidth: 110,
                    align: 'center',
                    sortable: true,
                    key: 'replacementState',
                    render: (h, params) => {
                        return h('span', {}, params.row.replacementState === true ? '已配置' : '未配置');
                    }
                },
                {
                    title: '运转工艺状态',
                    minWidth: 110,
                    sortable: true,
                    align: 'center',
                    key: 'settingState',
                    render: (h, params) => {
                        return h('span', {}, params.row.settingState === true ? '已配置' : '未配置');
                    }
                },
                {
                    title: '试纺质检状态',
                    minWidth: 110,
                    sortable: true,
                    align: 'center',
                    key: 'trialSpinningState',
                    render: (h, params) => {
                        return h('span', {}, params.row.trialSpinningState === 1 ? '不合格' : (params.row.trialSpinningState === 2 ? '合格' : '未检验'));
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
                    key: 'prdBomCode',
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
                                    return h('p', {
                                    }, item);
                                })
                            ])
                        ]);
                    }
                }
            ],
            openMachineData: [],
            tableHeight: '',
            orderSelectedShow: false,
            dateFrom: '',
            dateTo: '',
            prdBomCode: '',
            prdOrderCode: '',
            prdNoticeCode: '',
            productNameCode: '',
            prdOrderNoticeCodeName: '',
            processId: null,
            defaultProcessId: null,
            workshopId: null,
            machineNameCode: '',
            replacementState: 'false',
            settingState: '',
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
            replacementStateList: [
                {
                    id: 'true',
                    name: '已进行配件更换'
                },
                {
                    id: 'false',
                    name: '未进行配件更换'
                }
            ],
            settingStateList: [
                {
                    id: 'true',
                    name: '已进行工艺设定'
                },
                {
                    id: 'false',
                    name: '未进行工艺设定'
                }
            ],
            pageSize: page().pageSize,
            pageIndex: 1,
            pageOpts: page().pageOpts,
            pageUp: page().pageUp,
            pageTotal: 0,
            openMachineShow: false,
            openMachineTitle: '',
            curTime: curDatetime(),
            openMachineModal: {
                scheduleBelongDate: '',
                scheduleShiftName: '',
                machineName: '',
                processName: '',
                workshopName: '',
                productCode: '',
                usedSpin: '',
                productName: '',
                batchCode: '',
                productionQty: '',
                prdNoticeCode: '',
                prdOrderCode: '',
                orderProductCode: '',
                orderProductNames: '',
                startSpinNumber: 0,
                endSpinNumber: 0,
                spinCount: 0,
                openSpinCount: 0,
                newStartSpinNumber: 0,
                newOpenSpinCount: 0,
                newEndSpinNumber: 0,
                startOutput: null,
                startElectricEnergy: null
            },
            openMachineValidate: {},
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            isShowDetail: true,
            show: false
        };
    },
    methods: {
        submit (val) {
            if (val.newEndSpinNumber < val.newStartSpinNumber) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>开始锭数不能大于结束锭数</p>'
                });
                return false;
            }
            let params = {
                id: val.id,
                prdNoticeMachineId: val.prdNoticeMachineId,
                prdNoticeId: val.prdNoticeId,
                startScheduleId: val.startScheduleId,
                machineId: val.machineId,
                startTime: val.curTime,
                startOutput: val.startOutput,
                startElectricEnergy: val.startElectricEnergy,
                startSpinNumber: val.newStartSpinNumber,
                endSpinNumber: val.newEndSpinNumber,
                openSpinCount: val.newEndSpinNumber - val.newStartSpinNumber + 1
            };
            this.$call('prd.notice.machine.opening.update.save', params).then(res => {
                let content = res.data;
                this.openMachineDetailId = null;
                if (content.status === 200) {
                    this.openMachineShow = false;
                    this.getOpenNum();
                    this.$Message.success('开台成功');
                    this.show = false;
                }
            });
        },
        cancel () {
            this.show = false;
            this.openMachineDetailId = null;
        },
        getChangeSpin (param) {
            this.$call('prd.notice.machine.opening.detail3', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.openMachineDetail = content.res;
                    // this.openMachineDetail.prdNoticeMachineOpeningId = param.id;
                    this.openMachineDetail.curTime = curDatetime();
                    // this.openMachineDetail.newStartSpinNumber = this.openMachineDetail.startSpinNumber;
                    // this.openMachineDetail.newEndSpinNumber = this.openMachineDetail.endSpinNumber;
                    // this.openMachineDetail.newOpenSpinCount = this.openMachineDetail.openSpinCount;
                    this.show = true;
                }
            });
        },
        changeSpin () {
            this.openMachineModal.openSpinCount = this.openMachineModal.endSpinNumber - this.openMachineModal.startSpinNumber + 1;
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getOpenNum();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getOpenNum();
        },
        changeStartTime (val) {
            this.dateFrom = val;
        },
        changeEndTime (val) {
            this.dateTo = val;
        },
        getMachineOpenDetail2 (para) {
            this.$call('prd.notice.machine.opening.detail2', para).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log(content.res);
                    this.openMachineShow = true;
                    this.openMachineModal.planDateFrom = content.res.planDateFrom;
                    this.openMachineModal.planDateTo = content.res.planDateTo;
                    this.openMachineModal.startTime = content.res.startTime;
                    this.openMachineModal.processName = content.res.processName;
                    this.openMachineModal.workshopName = content.res.workshopName;
                    this.openMachineModal.startOutput = content.res.startOutput;
                    this.openMachineModal.startElectricEnergy = content.res.startElectricEnergy;
                    this.openMachineModal.startScheduleId = content.res.startScheduleId;
                    this.openMachineModal.scheduleShiftName = content.res.startShiftName;
                    this.openMachineModal.scheduleBelongDate = content.res.startBelongDate;
                    this.openMachineModal.machineName = content.res.machineName;
                    // this.openMachineModal.productCode = content.res.productCode;
                    this.openMachineModal.batchCode = content.res.batchCode;
                    this.openMachineModal.productionQty = content.res.productionQty;
                    this.openMachineModal.prdOrderCode = content.res.prdOrderCodes;
                    this.openMachineModal.workshopId = content.res.workshopId;
                    this.openMachineModal.prdNoticeCode = content.res.prdNoticeCode;
                    // this.openMachineModal.orderProductCode = content.res.orderProductCodes;
                    this.openMachineModal.productName = content.res.productName;
                    this.openMachineModal.orderProductNames = content.res.orderProductNames;
                    this.openMachineModal.startSpinNumber = content.res.startSpinNumber;
                    this.openMachineModal.endSpinNumber = content.res.endSpinNumber;
                    this.openMachineModal.openSpinCount = content.res.openSpinCount;
                    // this.openMachineModal.completionQty = content.res.completionQty;
                    // this.getScheduleTime();
                }
            });
        },
        getMachineOpenDetail (para) {
            try {
                this.$call('open.close.detail', para).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // console.log(content.res);
                        this.openMachineShow = true;
                        this.openMachineModal.planDateFrom = content.res.planDateFrom;
                        this.openMachineModal.planDateTo = content.res.planDateTo;
                        this.openMachineModal.startTime = content.res.startTime;
                        this.openMachineModal.processName = content.res.processName;
                        this.openMachineModal.workshopName = content.res.workshopName;
                        this.openMachineModal.startOutput = content.res.startOutput;
                        this.openMachineModal.startElectricEnergy = content.res.startElectricEnergy;
                        this.openMachineModal.startScheduleId = content.res.startScheduleId;
                        this.openMachineModal.scheduleShiftName = content.res.startShiftName;
                        this.openMachineModal.scheduleBelongDate = content.res.startBelongDate;
                        this.openMachineModal.machineName = content.res.machineName;
                        // this.openMachineModal.productCode = content.res.productCode;
                        this.openMachineModal.batchCode = content.res.batchCode;
                        this.openMachineModal.productionQty = content.res.productionQty;
                        this.openMachineModal.prdOrderCode = content.res.prdOrderCodes;
                        this.openMachineModal.workshopId = content.res.workshopId;
                        this.openMachineModal.prdNoticeCode = content.res.prdNoticeCode;
                        // this.openMachineModal.orderProductCode = content.res.orderProductCodes;
                        this.openMachineModal.productName = content.res.productName;
                        this.openMachineModal.orderProductNames = content.res.orderProductNames;
                        this.openMachineModal.startSpinNumber = content.res.startSpinNumber;
                        this.openMachineModal.endSpinNumber = content.res.endSpinNumber;
                        this.openMachineModal.openSpinCount = content.res.openSpinCount;
                        // this.openMachineModal.completionQty = content.res.completionQty;
                        // this.getScheduleTime();
                    }
                });
            } catch (e) {
                throw (e);
            }
        },
        getScheduleTime () {
            let params = {
                now: this.curTime,
                workshopId: this.workshopId
            };
            this.$call('schedule.current.schedule', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        this.$Modal.warning({
                            title: '提示',
                            content: '该时间点尚未排班，不能进行开台'
                        });
                        this.openMachineModal.scheduleBelongDate = '';
                        this.openMachineModal.scheduleShiftName = '';
                        this.openMachineModal.startScheduleId = '';
                        return;
                    }
                    this.openMachineModal.scheduleBelongDate = content.res.belongDate;
                    this.openMachineModal.scheduleShiftName = content.res.shiftName;
                    this.openMachineModal.startScheduleId = content.res.id;
                }
            });
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getOpenNum();
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
        getOpenMachineDetail () {
            this.$call('prd.notice.machine.open.detail', {id: this.openMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log(content.res);
                    this.curTime = curDatetime();
                    this.openMachineShow = true;
                    this.openMachineModal.scheduleBelongDate = content.res.scheduleBelongDate;
                    this.openMachineModal.startScheduleId = content.res.scheduleId;
                    this.openMachineModal.scheduleShiftName = content.res.scheduleShiftName;
                    this.openMachineModal.machineId = content.res.machineId;
                    this.openMachineModal.machineName = content.res.machineName;
                    this.openMachineModal.processName = content.res.processName;
                    this.openMachineModal.workshopName = content.res.workshopName;
                    this.openMachineModal.productCode = content.res.productCode;
                    this.openMachineModal.batchCode = content.res.batchCode;
                    this.openMachineModal.productionQty = content.res.productionQty;
                    this.openMachineModal.prdNoticeId = content.res.prdNoticeId;
                    this.openMachineModal.prdNoticeCode = content.res.prdNoticeCode;
                    this.openMachineModal.prdOrderCode = content.res.prdOrderCodes;
                    this.openMachineModal.orderProductCode = content.res.orderProductCodes;
                    this.openMachineModal.startOutput = content.res.startOutput;
                    this.openMachineModal.startElectricEnergy = content.res.startElectricEnergy;
                    this.openMachineModal.productName = content.res.productName;
                    this.openMachineModal.usedSpin = content.res.usedSpin;
                    this.openMachineModal.orderProductNames = content.res.orderProductNames;
                    this.openMachineModal.completionQty = content.res.completionQty;
                    this.openMachineModal.startSpinNumber = 1;
                    this.openMachineModal.endSpinNumber = content.res.spinCount;
                    this.openMachineModal.openSpinCount = content.res.spinCount;
                    this.openMachineModal.spinCount = content.res.spinCount;
                }
            });
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
            this.getOpenNum();
        },
        selectMenu (val) {
            this.processModificationLoading = true;
            this.openMachineData = [];
            this.curCompletionState = val.id;
            //
            this.dateTo = '';
            this.processId = JSON.parse(JSON.stringify(this.defaultProcessId));
            this.prdOrderNoticeCodeName = '';
            this.machineNameCode = '';
            this.prdBomCode = '';
            this.prdOrderCode = '';
            this.prdNoticeCode = '';
            this.productNameCode = '';
            if (val.id === 0) {
                this.dateFrom = '';
                this.openMachineColumns = this.openMachineColumnsList.filter(item => item.have === undefined);
            }
            if (val.id === 1) {
                this.dateFrom = '';
                this.openMachineColumns = this.openMachineColumnsList;
            }
            this.getOpenNum();
        },
        getOpenMachineData () {
            let params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                planOpenDateFrom: this.curCompletionState === 0 ? this.dateFrom : '',
                planOpenDateTo: this.curCompletionState === 0 ? this.dateTo : '',
                openDateFrom: this.curCompletionState === 1 ? this.dateFrom : '',
                openDateTo: this.curCompletionState === 1 ? this.dateTo : '',
                prdBomCode: this.prdBomCode.trim(),
                prdOrderCode: this.prdOrderCode.trim(),
                prdNoticeCode: this.prdNoticeCode.trim(),
                productNameCode: this.productNameCode.trim(),
                processId: this.processId,
                workshopId: this.workshopId,
                machineNameCode: this.machineNameCode.trim(),
                // trialSpinningState: 2,
                openingState: this.curCompletionState === 0 ? 0 : '',
                openingStates: this.curCompletionState === 0 ? '' : 1
                // replacementState: true, // 配件更换的状态 true ? 已经更换过: 未配置
                // settingState: true // 工艺设定的状态 ？ true ？ 已经设定 ？ 未设定
            };
            this.processModificationLoading = true;
            this.$call('prd.notice.machine.list', params).then(res => {
                let content = res.data;
                this.processModificationLoading = false;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    this.openMachineData = content.res;
                    // console.log(this.openMachineData);
                }
            });
        },
        changeTime (val) {
            this.curTime = val;
            this.getScheduleTime();
        },
        openMachineClick () {
            if (this.openMachineModal.startScheduleId === '' || this.openMachineModal.startScheduleId === undefined || this.openMachineModal.startScheduleId === null) {
                this.$Message.warning('该时间点尚未排班，不能进行开台');
                return false;
            }
            if (this.openMachineModal.openSpinCount < 0) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>开始锭数不能大于结束锭数</p>'
                });
                return false;
            }
            let params = {
                prdNoticeMachineId: this.openMachineId,
                prdNoticeId: this.openMachineModal.prdNoticeId,
                startScheduleId: this.openMachineModal.startScheduleId,
                machineId: this.openMachineModal.machineId,
                startTime: this.curTime,
                startOutput: this.openMachineModal.startOutput,
                startElectricEnergy: this.openMachineModal.startElectricEnergy,
                startSpinNumber: this.openMachineModal.startSpinNumber,
                endSpinNumber: this.openMachineModal.endSpinNumber,
                openSpinCount: this.openMachineModal.openSpinCount
            };
            this.$call('prd.notice.machine.opening.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.openMachineShow = false;
                    this.getOpenNum();
                    this.$Message.success('保存成功');
                }
            });
        },
        openMachineCancel () {
            this.openMachineShow = false;
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$call('prd.notice.machine.opening.cancel.open', {id: this.openMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.deleteWarnLoading = false;
                    this.deleteWarnShow = false;
                    this.getOpenNum();
                    this.$Message.success('取消成功');
                } else {
                    this.deleteWarnLoading = false;
                    this.deleteWarnShow = false;
                }
            });
        },
        getOpenNum () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('prd.notice.machine.num2', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.orderStateList = content.res.map(x => {
                        x.count = x.num;
                        return x;
                    });
                    this.getOpenMachineData();
                }
            });
        },
        getProcessListHttp () {
            return this.$api.common.userDefaultProcessRequest().then(res => {
                if (res.data.status === 200) {
                    this.processId = res.data.res.processDefaultId;
                    this.defaultProcessId = res.data.res.processDefaultId;
                    this.processList = res.data.res.processList;
                };
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
        this.openMachineColumns = this.openMachineColumnsList.filter(item => item.have === undefined);
        this.getUserWorkshop();
        this.getProcessListHttp();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 235;
        });
    }
});

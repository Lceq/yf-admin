import layout from '../../layout';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import {curDate, curDatetime, page} from '../../../libs/tools';
import closeDetail from './close-detail';
import {isNull} from "../../../libs/tools";

export default ({
    components: {
        layout,
        modal,
        closeDetail,
        deleteWarning
    },
    data () {
        return {
            show: false,
            curCompletionState: 0,
            openMachineId: null,
            openMachineDetailId: null,
            orderStateList: [
                {
                    name: '未了机',
                    id: 0
                },
                {
                    name: '已了机',
                    id: 1
                }
            ],
            openMachineColumns: [],
            openMachineColumnsList: [
                {
                    title: '操作',
                    sortable: true,
                    minWidth: 120,
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
                                        this.isDetail = false;
                                        this.openMachineId = params.row.prdNoticeMachineOpeningId;
                                        this.getCloseMachineDetail();
                                    }
                                }
                            }, '了机'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: vm.curCompletionState === 1 ? 'inline-block' : 'none'
                                },
                                on: {
                                    'click': () => {
                                        this.openMachineDetailId = Number(params.row.prdNoticeMachineOpeningId);
                                        // this.$call('prd.notice.machine.opening.detail4', { id: params.row.prdNoticeMachineOpeningId }).then(res => {
                                        //     let content = res.data;
                                        //     if (content.status === 200) {
                                        //         this.openMachineDetail = content.res;
                                        //         this.openMachineDetail.curTime = curDatetime();
                                        //         this.show = true;
                                        //     }
                                        // });
                                        // this.deleteWarnShow = true;
                                        // this.deleteWarnMsg = '确定要取消了机吗？';
                                    }
                                }
                            }, '重新开台')
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
                        return h('a', {
                            on: {
                                click: () => {
                                    let para = {
                                        id: params.row.prdNoticeMachineOpeningId
                                    };
                                    this.getMachineOpenDetail(para);
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
                    key: 'prdOrderCode',
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
                    title: '实际了机时间',
                    minWidth: 130,
                    align: 'left',
                    sortable: true,
                    have: 'actual',
                    key: 'endTime'
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
                                    return h('p', {
                                    }, item);
                                })
                            ])
                        ]);
                    }
                }
            ],
            closeMachineData: [],
            tableHeight: '',
            orderSelectedShow: false,
            isDetail: false,
            dateFrom: '',
            dateTo: '',
            prdBomCode: '',
            prdOrderCode: '',
            prdNoticeCode: '',
            productNameCode: '',
            prdOrderNoticeCodeName: '',
            processId: '',
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
            closeMachineModal: {
                scheduleBelongDate: '',
                scheduleShiftName: '',
                machineName: '',
                processName: '',
                workshopName: '',
                productCode: '',
                productName: '',
                batchCode: '',
                productionQty: '',
                prdNoticeCode: '',
                prdOrderCode: '',
                orderProductCode: '',
                orderProductNames: '',
                startOutput: null,
                completionQty: null,
                startSpinNumber: 0,
                endSpinNumber: 0,
                openSpinCount: 0,
                startElectricEnergy: null,
                endElectricEnergy: null,
                ElectricEnergy: null
            },
            openMachineValidate: {},
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            openMachineDetail: {}
        };
    },
    methods: {
        cancel () {
            this.show = false;
            this.openMachineDetailId = null;
        },
        submit (val) {
            if (val.newEndSpinNumber < val.newStartSpinNumber) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>开始锭数不能大于结束锭数</p>'
                });
                return false;
            }
            let params = {
                // id: val.id,
                prdNoticeMachineId: val.prdNoticeMachineId,
                prdNoticeId: val.prdNoticeId,
                startScheduleId: val.startScheduleId,
                machineId: val.machineId,
                startTime: val.curTime,
                startOutput: val.startOutput,
                startSpinNumber: val.newStartSpinNumber,
                startElectricEnergy: val.startElectricEnergy,
                endSpinNumber: val.newEndSpinNumber,
                openSpinCount: val.newEndSpinNumber - val.newStartSpinNumber + 1
            };
            this.$call('prd.notice.machine.opening.again', params).then(res => {
                let content = res.data;
                this.openMachineDetailId = null;
                if (content.status === 200) {
                    this.openMachineShow = false;
                    this.$Message.success('开台成功');
                    this.getCloseNum();
                    this.show = false;
                }
            });
            this.show = false;
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getCloseNum();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getCloseNum();
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
                this.getCloseNum();
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
        getMachineOpenDetail (para) {
            try {
                this.$call('prd.notice.machine.opening.detail2', para).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // console.log(content.res);
                        this.isDetail = true;
                        this.openMachineShow = true;
                        // this.openMachineModal.planDateFrom = content.res.planDateFrom;
                        this.closeMachineModal.planDateTo = content.res.planDateTo;
                        this.closeMachineModal.startTime = content.res.startTime;
                        this.closeMachineModal.endTime = content.res.endTime;
                        this.closeMachineModal.processName = content.res.processName;
                        this.closeMachineModal.workshopName = content.res.workshopName;
                        this.closeMachineModal.machineName = content.res.machineName;
                        this.closeMachineModal.productCode = content.res.productCode;
                        this.closeMachineModal.batchCode = content.res.batchCode;
                        this.closeMachineModal.productionQty = content.res.productionQty;
                        this.closeMachineModal.prdOrderCode = content.res.prdOrderCodes;
                        this.closeMachineModal.workshopId = content.res.workshopId;
                        this.closeMachineModal.prdNoticeCode = content.res.prdNoticeCode;
                        this.closeMachineModal.orderProductCode = content.res.orderProductCodes;
                        this.closeMachineModal.endOutput = content.res.endOutput;
                        this.closeMachineModal.startOutput = content.res.startOutput;
                        this.closeMachineModal.startElectricEnergy = content.res.startElectricEnergy;
                        this.closeMachineModal.endElectricEnergy = content.res.endElectricEnergy;
                        this.closeMachineModal.ElectricEnergy = (isNull(content.res.endElectricEnergy) - isNull(content.res.startElectricEnergy)) / content.res.spinCount * content.res.openSpinCount;
                        this.closeMachineModal.completionQty = content.res.completionQty;
                        this.closeMachineModal.productName = content.res.productName;
                        this.closeMachineModal.orderProductNames = content.res.orderProductNames;
                        this.closeMachineModal.startSpinNumber = content.res.startSpinNumber;
                        this.closeMachineModal.endSpinNumber = content.res.endSpinNumber;
                        this.closeMachineModal.openSpinCount = content.res.openSpinCount;
                        // this.closeMachineModal.completionQty = content.res.endOutput - content.res.startOutput;
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
                        this.$Message.warning('该时间点尚未排班，不能进行了机');
                        this.closeMachineModal.scheduleBelongDate = '';
                        this.closeMachineModal.scheduleShiftName = '';
                        this.closeMachineModal.endScheduleId = '';
                        return;
                    }
                    this.closeMachineModal.scheduleBelongDate = content.res.belongDate;
                    this.closeMachineModal.scheduleShiftName = content.res.shiftName;
                    this.closeMachineModal.endScheduleId = content.res.id;
                }
            });
        },
        getCloseMachineDetail () {
            this.$call('prd.notice.machine.finish.detail', {id: this.openMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.curTime = curDatetime();
                    this.openMachineShow = true;
                    this.closeMachineModal.scheduleBelongDate = content.res.scheduleBelongDate;
                    this.closeMachineModal.endScheduleId = content.res.scheduleId;
                    this.closeMachineModal.scheduleShiftName = content.res.scheduleShiftName;
                    this.closeMachineModal.machineId = content.res.machineId;
                    this.closeMachineModal.machineName = content.res.machineName;
                    this.closeMachineModal.processName = content.res.processName;
                    this.closeMachineModal.workshopName = content.res.workshopName;
                    this.closeMachineModal.productCode = content.res.productCode;
                    this.closeMachineModal.batchCode = content.res.batchCode;
                    this.closeMachineModal.productionQty = content.res.productionQty;
                    this.closeMachineModal.completionQty = content.res.completionQty;
                    this.closeMachineModal.prdNoticeId = content.res.prdNoticeId;
                    this.closeMachineModal.prdNoticeCode = content.res.prdNoticeCode;
                    this.closeMachineModal.prdOrderCode = content.res.prdOrderCodes;
                    this.closeMachineModal.orderProductCode = content.res.orderProductCodes;
                    this.closeMachineModal.endOutput = content.res.endOutput;
                    this.closeMachineModal.startOutput = content.res.startOutput;
                    this.closeMachineModal.startElectricEnergy = content.res.startElectricEnergy;
                    this.closeMachineModal.endElectricEnergy = content.res.endElectricEnergy;
                    this.closeMachineModal.spinCount = content.res.spinCount;
                    this.closeMachineModal.openSpinCount = content.res.openSpinCount;
                    this.closeMachineModal.ElectricEnergy = (isNull(content.res.endElectricEnergy) - isNull(content.res.startElectricEnergy)) / content.res.spinCount * content.res.openSpinCount;
                    this.closeMachineModal.productName = content.res.productName;
                    this.closeMachineModal.orderProductNames = content.res.orderProductNames;
                    this.closeMachineModal.startSpinNumber = content.res.startSpinNumber;
                    this.closeMachineModal.endSpinNumber = content.res.endSpinNumber;
                    this.closeMachineModal.openSpinCount = content.res.openSpinCount;
                    // this.closeMachineModal.completionQty = content.res.endOutput - content.res.startOutput;
                }
            });
        },
        changeEndElectricEnergy () {
            this.closeMachineModal.ElectricEnergy = ((isNull(this.closeMachineModal.endElectricEnergy) - isNull(this.closeMachineModal.startElectricEnergy)) / this.closeMachineModal.spinCount * this.closeMachineModal.openSpinCount).toFixed(2);
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
            this.getCloseNum();
        },
        selectMenu (val) {
            this.productNameCode = '';
            this.prdBomCode = '';
            this.prdOrderCode = '';
            this.prdNoticeCode = '';
            this.processId = '';
            this.productNameCode = '';
            this.machineNameCode = '';
            this.dateTo = '';
            this.processId = '';
            this.prdOrderNoticeCodeName = '';
            this.machineNameCode = '';
            // debugger
            if (val.id === 0) {
                this.dateFrom = '';
                this.openMachineColumns = this.openMachineColumnsList.filter(item => item.have === undefined || item.have === 'plan');
            } else {
                this.dateFrom = curDate();
                this.openMachineColumns = this.openMachineColumnsList.filter(item => item.have === undefined || item.have === 'actual');
            }
            this.processModificationLoading = true;
            this.closeMachineData = [];
            this.curCompletionState = val.id;
            this.getCloseNum();
        },
        getOpenMachineData () {
            let params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                planEndDateFrom: this.curCompletionState === 0 ? this.dateFrom : '',
                endDateFrom: this.curCompletionState === 1 ? this.dateFrom : '',
                planEndDateTo: this.curCompletionState === 0 ? this.dateTo : '',
                endDateTo: this.curCompletionState === 1 ? this.dateTo : '',
                prdBomCode: this.prdBomCode.trim(),
                prdOrderCode: this.prdOrderCode.trim(),
                prdNoticeCode: this.prdNoticeCode.trim(),
                productNameCode: this.productNameCode.trim(),
                processId: this.processId,
                workshopId: this.workshopId,
                machineNameCode: this.machineNameCode.trim(),
                // trialSpinningState: 2,
                openingState: '',
                openingStates: this.curCompletionState === 0 ? 1 : 2
                // replacementState: true, // 配件更换的状态 true ? 已经更换过: 未配置
                // settingState: true // 工艺设定的状态 ？ true ？ 已经设定 ？ 未设定
            };
            this.$call('prd.notice.machine.list', params).then(res => {
                let content = res.data;
                this.processModificationLoading = false;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    this.closeMachineData = content.res;
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        changeTime (val) {
            this.curTime = val;
            this.getScheduleTime();
        },
        openMachineClick () {
            if (this.closeMachineModal.endScheduleId === '' || this.closeMachineModal.endScheduleId === undefined || this.closeMachineModal.endScheduleId === null) {
                this.$Modal.warning({
                    title: '提示',
                    content: '该时间点尚未排班，不能进行了机'
                });
                return false;
            }
            let params = {
                id: this.openMachineId,
                prdNoticeId: this.closeMachineModal.prdNoticeId,
                endScheduleId: this.closeMachineModal.endScheduleId,
                machineId: this.closeMachineModal.machineId,
                endTime: this.curTime,
                endOutput: this.closeMachineModal.endOutput,
                endElectricEnergy: this.closeMachineModal.endElectricEnergy.toFixed(2)
            };
            this.$call('prd.notice.machine.opening.finish', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCloseNum();
                    this.$Message.success('保存成功');
                }
            });
            this.openMachineShow = false;
        },
        openMachineCancel () {
            this.openMachineShow = false;
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$call('prd.notice.machine.opening.cancel.finish', {id: this.openMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.deleteWarnLoading = false;
                    this.deleteWarnShow = false;
                    this.getCloseNum();
                    this.$Message.success('取消成功');
                } else {
                    this.deleteWarnLoading = false;
                    this.deleteWarnShow = false;
                }
            });
        },
        getCloseNum () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('prd.notice.machine.num3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.orderStateList = content.res.map(x => {
                        x.count = x.num;
                        return x;
                    });
                    this.getOpenMachineData();
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
        this.openMachineColumns = this.openMachineColumnsList.filter(item => item.have === undefined || item.have === 'plan');
        this.getUserWorkshop();
        this.getProcessList();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 235;
        });
    }
});

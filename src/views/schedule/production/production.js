import {curDate, page} from '../../../libs/tools';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import canEditTable from './canEditTable.vue';

export default {
    components: {
        modal,
        deleteWarning,
        canEditTable
    },
    data () {
        return {
            shiftTypeTime: [],
            curProductionWorkShopId: '',
            curProductionWorkShopName: '',
            curProductionShiftName: '',
            curProductionMachineId: '',
            curProductionBeginOutput: '',
            WorkShopList: [],
            scheduleId: '',
            curScheduleId: '',
            curProductionScheduleMachineId: '',
            curProductionGroupName: '',
            startDuty: false,
            endDuty: false,
            dutyTableLoading: false,
            columnOnDuty: [
                {
                    title: '日期',
                    sortable: true,
                    minWidth: 100,
                    fixed: 'left',
                    key: 'belongDate'
                },
                {
                    title: '车间',
                    sortable: true,
                    align: 'left',
                    minWidth: 80,
                    fixed: 'left',
                    key: 'workshopName'
                },
                // {
                //     align: 'center',
                //     title: '当班班组',
                //     sortable: true,
                //     minWidth: 120,
                //     fixed: 'left',
                //     key: 'shiftGroup'
                // },
                {
                    title: '班次',
                    minWidth: 80,
                    sortable: true,
                    align: 'left',
                    key: 'shiftName'
                },
                {
                    title: '班制',
                    sortable: true,
                    align: 'left',
                    minWidth: 80,
                    key: 'shiftTypeName'
                },
                // {
                //     title: '班次时间',
                //     minWidth: 120,
                //     align: 'center',
                //     sortable: true,
                //     key: 'shiftTime'
                // },
                {
                    title: '值班状态',
                    sortable: true,
                    minWidth: 80,
                    align: 'center',
                    key: 'dutyState'
                },
                {
                    title: '值班员',
                    minWidth: 100,
                    sortable: true,
                    align: 'center',
                    key: 'dutyName'
                },
                {
                    title: '值班开始时间',
                    sortable: true,
                    minWidth: 150,
                    align: 'left',
                    key: 'dutyTime'
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 250,
                    render: (h, params) => {
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.dutyId !== null
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.startDuty = true;
                                        this.endDuty = false;
                                        this.isDutyShow = true;
                                        // this.curProductionGroupId = params.row.groupId;
                                        this.curScheduleId = params.row.id;
                                        this.tipsMessage = '是否确认开始值班？';
                                    }
                                }
                            }, '值班'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.dutyId === null
                                },
                                on: {
                                    click: () => {
                                        this.startDuty = false;
                                        this.endDuty = true;
                                        this.isDutyShow = true;
                                        // this.curProductionGroupId = params.row.groupId;
                                        this.curScheduleId = params.row.id;
                                        this.tipsMessage = '是否确认取消值班？';
                                    }
                                },
                                style: {
                                    marginRight: '10px'
                                }
                            }, '取消值班'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.dutyId === null
                                },
                                on: {
                                    click: () => {
                                        this.productionTitle = '机台产量';
                                        this.curScheduleId = params.row.id;
                                        this.curProcessId = '';
                                        this.machineCode = '';
                                        this.getProductMachine();
                                    }
                                }
                            }, '机台产量')
                        ]);
                    }
                }
            ],
            dataOnDuty: [],
            isDutyShow: false,
            DutyLoading: false,
            curStartTime: curDate(),
            curEndTime: '',
            tipsMessage: '',
            isProductionShow: false,
            productionTitle: '',
            columnProduction: [
                {
                    title: '工序',
                    key: 'processName',
                    width: 160,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '机台号',
                    align: 'left',
                    sortable: true,
                    key: 'machineCode'
                },
                {
                    title: '设备名称',
                    align: 'left',
                    key: 'machineName'
                },
                {
                    title: '班次开始产量',
                    key: 'beginOutput',
                    align: 'right',
                    editable: true
                }
            ],
            dataBaseProduction: [],
            dataProduction: [
                {
                    process: '清花',
                    machineCode: 'QH001',
                    machineName: '1#清花机',
                    beginOutput: '3000'
                }
            ],
            popMachineCode: '',
            popProcessName: '',
            pageSize: 10,
            tableHeight: document.documentElement.clientHeight - 240,
            dutyTotal: 0,
            pageDirect: page().pageUp,
            dutyPageSize: page().pageSize,
            dutyPageIndex: 1,
            dutyPageOpts: page().pageOpts,
            AllDataDuty: [],
            machineList: [],
            curProductionBelongDate: '',
            dutyMachineTotal: 0,
            dutyMachinePageSize: page().pageSize,
            dutyMachinePageIndex: 1,
            // modal sousuo
            curProcessId: '',
            dutyMachineLoading: false,
            processList: [],
            machineCode: ''
        };
    },
    computed: {
        Today: () => {
            const date = new Date();
            const seperator1 = '-';
            const year = date.getFullYear();
            const month = parseInt(date.getMonth() + 1) < 10 ? '0' + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
            const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
    },
    methods: {
        // 获取时间班次表
        getShiftTime () {
            this.$fetch('shift/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftTypeTime = (content.res || []).map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            beginHour: item.beginHour === 0 ? '00:00' : this.getTimeStyle(item.beginHour),
                            endHour: item.endHour === 0 ? '00:00' : this.getTimeStyle(item.endHour)
                        };
                    });
                }
            });
        },
        // 时间格式的转换
        getTimeStyle (time) {
            // debugger
            const timeStyle = time < 1000 ? '0' + time : time + '';
            const obj = timeStyle.substring(0, 2) + ':' + timeStyle.substring(2, 4);
            return obj;
        },
        changeStartTime (val) {
            this.curStartTime = val;
        },
        changeWorkShop (val) {
            this.curProductionWorkShopId = val;
        },
        changeEndTime (val) {
            this.curEndTime = val;
        },
        searchResult () {
            this.dutyTotal = 1;
            setTimeout(() => {
                this.dutyTotal = 0;
            }, 0);
            this.dutyPageIndex = 1;
            this.getScheduleList();
        },
        // 获取车间下的班组数组
        getScheduleList () {
            this.dutyTableLoading = true;
            let params = {
                workshopId: this.curProductionWorkShopId,
                dateFrom: this.curStartTime,
                dateTo: this.curEndTime,
                pageSize: this.dutyPageSize,
                pageIndex: this.dutyPageIndex
            };
            this.$api.schedule.getScheduleList2(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.dataOnDuty = content.res.map(x => {
                        x.dutyState = x.dutyState === true ? '已值班' : '未值班';
                        return x;
                    });
                    this.dutyTotal = content.count;
                    this.dutyTableLoading = false;
                }
            });
        },
        changeDutyPageIndex (val) {
            this.dutyPageIndex = val;
            this.getScheduleList();
        },
        changeDutyPageSize (val) {
            this.dutyPageSize = val;
            this.getScheduleList();
        },
        confirmDuty () {
            this.DutyLoading = true;
            if (this.startDuty) {
                this.$api.production.getMachineOnDuty({scheduleId: this.curScheduleId, workshopId: this.curProductionWorkShopId}).then(res => {
                    let content = res.data;
                    this.DutyLoading = false;
                    if (content.status === 200) {
                        this.getScheduleList();
                        this.isDutyShow = false;
                    }
                });
            }
            if (this.endDuty) {
                this.$api.production.getMachineCancelDuty({scheduleId: this.curScheduleId}).then(res => {
                    let content = res.data;
                    this.DutyLoading = false;
                    if (content.status === 200) {
                        this.getScheduleList();
                        this.isDutyShow = false;
                    }
                });
            }
        },
        cancelDuty () {
            this.isDutyShow = false;
        },
        cancelProduction () {
            this.dataProduction = [];
            this.isProductionShow = false;
        },
        getProductMachine () {
            this.isProductionShow = true;
            let params = {
                pageSize: this.dutyMachinePageSize,
                pageIndex: this.dutyMachinePageIndex,
                scheduleId: this.curScheduleId,
                processId: this.curProcessId,
                machineCodeName: this.machineCode.trim()
            };
            this.dutyMachineLoading = true;
            this.$api.production.getDutyMachineList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.dutyMachineTotal = content.count;
                    this.dataProduction = content.res.map(item => {
                        return item;
                    });
                    this.middleMachineList = this.dataProduction;
                    this.dutyMachineLoading = false;
                    // this.getProductionData();
                }
            });
        },
        handleCellChange (val, index, key) {
            this.curProductionMachineId = val[index].machineId;
            this.curProductionScheduleMachineId = val[index].id;
            this.curProductionBeginOutput = val[index].beginOutput;
            this.getSaveProductMachine();
        },
        getSaveProductMachine () {
            if (this.curProductionBeginOutput === null || isNaN(this.curProductionBeginOutput)) {
                this.dataProduction.find(x => x.id === this.curProductionScheduleMachineId).beginOutput = this.middleMachineList.find(x => x.id === this.curProductionScheduleMachineId).beginOutput;
                this.$Modal.warning({
                    title: '提示',
                    content: '不是数字型，不能进行保存'
                });
                return false;
            }
            this.$api.production.getDutyMachineUpdate({
                id: this.curProductionScheduleMachineId,
                beginOutput: Number(this.curProductionBeginOutput)
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.middleMachineList = this.dataProduction;
                    this.$Message.success('保存成功');
                }
            });
        },
        changeDutyMachinePageIndex (val) {
            this.dutyMachinePageIndex = val;
            this.getProductMachine();
        },
        changeDutyMachinePageSize (val) {
            this.dutyMachinePageSize = val;
            this.getProductMachine();
        },
        changeProcessMachineCode () {
            this.getProductMachine();
        },
        handleChange (val, index) {
            // debugger
            // this.$Message.success('修改了第' + (index + 1) + '行数据');
        },
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 获取车间
        getWorkshopList () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.curProductionWorkShopId = res.curWorkshopId;
                this.WorkShopList = res.workshopList;
                this.curProductionWorkShopName = res.workshopList.find(x => x.deptId === res.curWorkshopId).deptName;
                this.getScheduleList();
            });
        }
    },
    mounted () {
        this.getProcessList();
        this.getShiftTime();
        window.onresize = () => {
            let tableHeight = document.getElementById('tableHeight').offsetTop;
            this.tableHeight = document.documentElement.clientHeight - tableHeight - 185;
        };
    },
    created () {
        // 获取所有车间
        this.getWorkshopList();
    }
};

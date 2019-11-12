import {curDate, page} from '../../../libs/tools';
import groupMachine from './group-machine.vue';

export default ({
    components: {
        groupMachine
    },
    data() {
        return {
            dateFrom: curDate(),
            dateTo: '',
            curWorkShopId: null,
            curShift: '',
            curShiftType: '',
            curShiftGroup: '',
            shiftTypeList: [],
            shiftList: [],
            workshopList: [],
            shiftGroup: [],
            // table
            tableHeight: '',
            curGroupData: null,
            scheduleMachineLoading: false,
            scheduleMachineColumns: [
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'left',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.curGroupData = {
                                            id: params.row.id + '-' + Math.random(),
                                            curDate: params.row.belongDate,
                                            curWorkShopName: params.row.workshopName,
                                            curShiftName: params.row.shiftName,
                                            curGroupName: params.row.groupName
                                        };
                                    }
                                }
                            }, '机台分配'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px'
                                }
                            }, '人员替岗')
                        ]);
                    }
                },
                {
                    title: '日期',
                    sortable: true,
                    minWidth: 120,
                    align: 'left',
                    key: 'belongDate'
                },
                {
                    title: '车间',
                    minWidth: 80,
                    align: 'left',
                    key: 'workshopName'
                },
                {
                    title: '班制',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'shiftTypeName'
                },
                {
                    title: '班次',
                    minWidth: 100,
                    align: 'left',
                    sortable: true,
                    key: 'shiftName'
                },
                {
                    title: '班组',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'groupName'
                }
            ],
            scheduleMachineData: [],
            scheduleMachineOpts: page().pageOpts,
            scheduleMachineTotal: 0,
            pageDirect: page().pageUp,
            scheduleMachinePageSize: page().pageSize,
            scheduleMachinePageIndex: 1
        };
    },
    methods: {
        changeWorkShop(val) {
            this.getShiftGroup();
        },
        //
        searchScheduleMachineList() {
            this.scheduleMachinePageIndex = 1;
            setTimeout(() => {
                this.scheduleMachineTotal = 0;
            });
            this.getScheduleGroupList();
        },
        changeFromTime(val) {
            this.dateFrom = val;
        },
        changeToTime(val) {
            this.dateTo = val;
        },
        changePageIndex(val) {
            this.scheduleMachinePageIndex = val;
            this.getScheduleGroupList();
        },
        changePageSize(val) {
            this.scheduleMachinePageSize = val;
            this.getScheduleGroupList();
        },
        //
        changeShiftType(val) {
            if (!val) {
                this.curShift = '';
                this.shiftList = [];
                return;
            }
            this.getShift(val);
        },
        // 获取车间
        getWorkshopList() {
            this.$api.dept.getUserWorkshop().then(res => {
                this.curWorkShopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getShiftGroup();
            });
        },
        // 获取车间的班组数据
        getScheduleGroupList() {
            let params = {
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                workshopId: this.curWorkShopId,
                shiftTypeId: this.curShiftType,
                shiftId: this.curShift,
                groupId: this.curShiftGroup,
                pageSize: this.scheduleMachinePageSize,
                pageIndex: this.scheduleMachinePageIndex
            };
            this.scheduleMachineLoading = true;
            this.$call('schedule.group.list', params).then(res => {
                let content = res.data;
                this.scheduleMachineLoading = false;
                if (content.status === 200) {
                    this.scheduleMachineTotal = content.count;
                    this.scheduleMachineData = content.res;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 班制
        getShiftType() {
            this.$api.dictionary.getShiftType().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftTypeList = content.res;
                }
            });
        },
        // 班次
        getShift(val) {
            this.$api.shift.getShiftList({typeId: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftList = content.res;
                }
            });
        },
        // 根据车间判断车间班组信息
        getShiftGroup() {
            const _this = this;
            this.$call('user.data.groups').then((res) => {
                _this.curShiftGroup = res.data.res.defaultDeptId;
                _this.shiftGroup = res.data.res.userData;
                _this.getScheduleGroupList();
            });
        }
    },
    created() {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getWorkshopList();
        this.getShiftType();
        // this.getShiftGroup();
    },
    mounted() {
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        };
    }
});

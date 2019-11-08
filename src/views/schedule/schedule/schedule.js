import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
let getDays=''
export default {
    components: {
        modal,
        deleteWarning
    },
    data() {
        return {
            addUserDisabled: false,
            removeUserDisabled: false,
            postDisabled: false,
            moreSeven: false,
            currentWorkshopId: '',
            workShopList: [],
            lastMonth: '7',
            currentYear: '2018',
            currentMonth: '8',
            nextMonth: '9',
            calendarDate: {},
            curCalendarDate: [],
            calendarSixData: [],
            shiftGroup: [],
            SchedulingModalShow: false,
            SchedulingTitle: '',
            SchedulingLoading: false,
            curWorkShopName: '',
            curTime: '',
            curTimeJoin: '',
            shiftGroupTableColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 80,
                    sortable: true,
                    render: (h, params) => {
                        return h('Span', {}, params.index + 1);
                    }
                },
                {
                    title: '班次',
                    key: 'shiftName',
                    sortable: true,
                    width: 100,
                    render: (h, params) => {
                        return h('Div', [
                            h('Span', {}, params.row.shiftName)
                        ]);
                    }
                },
                {
                    title: '班组',
                    key: 'shiftGroups',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', {}, [
                            h('Select', {
                                props: {
                                    transfer: true,
                                    value: params.row.values,
                                    multiple: true,
                                    filterable: true
                                },
                                on: {
                                    'on-change': (data) => {
                                        console.log('选择', data)
                                        // debugger
                                        _this.shiftGroupTableData[params.index].values = data;
                                    }
                                }
                            }, [
                                params.row.groups.map(item => {
                                    return h('Option', {
                                        props: {value: item.groupId, key: item.groupId}
                                    }, item.groupName);
                                })
                            ])
                        ]);
                    }
                }
            ],
            shiftGroupTableData: [],
            defaultShiftId: '',
            shiftType: '',
            haveShiftData: [],
            transitionData: [],
            shiftGroupModalShow: false,
            shiftGroupLoading: false,
            shiftGroupTitle: '',
            curTimeGroupId: '',
            shiftGroupUserColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '序号',
                    key: 'index',
                    width: 80,
                    align: 'center',
                    sortable: true,
                    render: (h, params) => {
                        return h('Span', {}, params.index + 1);
                    }
                },
                {
                    title: '姓名',
                    key: 'userName',
                    minWidth: 120,
                    sortable: true
                },
                {
                    title: '当班岗位',
                    key: 'postProcessName',
                    minWidth: 200,
                    sortable: true,
                    render: (h, params) => {
                        return h('div', [
                            params.row.postProcessName.map(item => {
                                return h('p', {}, item);
                            })
                        ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: this.postDisabled
                                },
                                on: {
                                    click: (event) => {
                                        this.adjustPostUserName = params.row.userName;
                                        this.adjustPostId = params.row.postId;
                                        this.postIds = params.row.scheduleUserPostList.map(x => x.postId);
                                        this.scheduleUserId = params.row.id;
                                        this.adjustPostShow = true;
                                    }
                                }
                            }, '岗位调整')
                        ]);
                    }
                }
            ],
            shiftGroupUserData: [],
            shiftGroupUserLoading: false,
            // 用户
            userModalShow: false,
            userLoading: false,
            userTitle: '',
            departList: [],
            departDataList: [],
            curDepart: [],
            searchName: '',
            userColumns: [
                {
                    type: 'selection',
                    align: 'center',
                    width: 60
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: 'center',
                    sortable: true
                },
                {
                    title: '所属部门',
                    align: 'center',
                    key: 'deptName',
                    sortable: true
                },
                {
                    title: '岗位',
                    align: 'center',
                    key: 'postName',
                    width: 260,
                    sortable: true
                }
            ],
            userData: [],
            userTotal: 40,
            userPageIndex: 1,
            userPageSize: 10,
            userPageSizeOpts: [10, 20, 50],
            selectUserList: [],
            // 岗位调整
            adjustPostShow: false,
            adjustPostLoading: false,
            adjustPostUserName: '',
            adjustPostId: '',
            postIds: [],
            postBasicList: [],
            scheduleUserId: '',
            // 删除
            deleteWarningShow: false,
            deleteWarningMessage: '',
            deleteWarningLoading: false,
            selectedRemoveUser: [],
            isOnDuty: false,
            isCompute: false,
            curDepartId: '',
            deleteShow: false,
            deleteLoading: false,
            abnormityId: '',
            abnormityList: [],
            deleteValidate: {
                abnormityId: ''
            },
            ruleDeleteValidate: {
                abnormityId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            //日期多选
            calendarChecked: [],
            checkLen:0,
            checks: false,
            isDisabled:true,
            // days:'',
            CheckedArr:'',
            checkedDay:false
        };
    },
    methods: {
        // 获取当前的时间
        getCurrentTime() {
            const date = new Date();
            this.calendarDate.year = date.getFullYear(); // 今天哪一年
            this.calendarDate.month = date.getMonth() + 1;// 今天几月份
            this.calendarDate.today = date.getDate();// 今天多少号
            this.calendarDate.weekday = date.getDay();// 今天周几
            this.nowToady = this.calendarDate.year + '' + (this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month) + '' + (this.calendarDate.today < 10 ? '0' + this.calendarDate.today : this.calendarDate.today);
            // this.currentMonth = this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month + '';
            this.getLastNextMonth();
        },
        // 获取上个月下个月的时间
        getLastNextMonth() {
            // 获取上个月的时间
            if (parseInt(this.calendarDate.month === 1)) {
                this.calendarDate.lastYear = new Date(this.calendarDate.year - 1, 12, 0).getFullYear();
                this.calendarDate.lastMonth = new Date(this.calendarDate.year - 1, 12, 0).getMonth();
                this.calendarDate.lastDays = new Date(this.calendarDate.year - 1, 12, 0).getDate();
            } else {
                this.calendarDate.lastYear = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getFullYear();
                this.calendarDate.lastMonth = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getMonth() + 1;
                this.calendarDate.lastDays = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getDate();
            }
            // 获取下个月的时间
            if (parseInt(this.calendarDate.month === 12)) {
                this.calendarDate.nextYear = new Date(this.calendarDate.year + 1, 1, 0).getFullYear();
                this.calendarDate.nextMonth = new Date(this.calendarDate.year + 1, 1, 0).getMonth();
                this.calendarDate.nextDays = new Date(this.calendarDate.year + 1, 1, 0).getDate();
            } else {
                this.calendarDate.nextYear = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getFullYear();
                this.calendarDate.nextMonth = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getMonth() + 1;
                this.calendarDate.nextDays = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getDate();
            }
            // 本月天数
            this.calendarDate.days = new Date(this.calendarDate.year, this.calendarDate.month, 0).getDate();
            this.getIndexDay();
        },
        // 获取当前月上下42天的日历数据
        getIndexDay() {
            this.calendarDate.monthStart = new Date(this.calendarDate.year, this.calendarDate.month - 1, 1).getDay();// 这个月第一天礼拜几
            // 获取当前年月、上个月、下个月
            this.currentYear = this.calendarDate.year;
            this.currentMonth = this.calendarDate.month;
            this.lastMonth = this.calendarDate.lastMonth;
            this.nextMonth = this.calendarDate.nextMonth;
            // 上个月可以显示几天
            for (let i = this.calendarDate.monthStart; i > 0; i--) {
                const belongDate = this.calendarDate.lastYear + '-' + (this.calendarDate.lastMonth < 10 ? '0' + this.calendarDate.lastMonth : this.calendarDate.lastMonth) + '-' + (this.calendarDate.lastDays - ((i - 1) < 10 ? '0' + (i - 1) : (i - 1)));
                const day = this.calendarDate.lastDays - i + 1;
                const obj = {day, belongDate};
                this.curCalendarDate.push(obj);
            }
            // 本月数据
            for (let time = 1; time <= this.calendarDate.days; time++) {
                const belongDate = this.calendarDate.year + '-' + (this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month) + '-' + (time < 10 ? '0' + time : time);
                const day = time;
                const obj = {day, belongDate};
                this.curCalendarDate.push(obj);
            }
            // 下个月数据
            // 看一下剩下几天还能显示几天
            const remainDays = 42 - this.calendarDate.days - this.calendarDate.monthStart;
            if (remainDays > 6) {
                this.moreSeven = true;
            } else {
                this.moreSeven = false;
            }
            for (let k = 1; k <= remainDays; k++) {
                const belongDate = this.calendarDate.nextYear + '-' + (this.calendarDate.nextMonth < 10 ? '0' + this.calendarDate.nextMonth : this.calendarDate.nextMonth) + '-' + (k < 10 ? '0' + k : k);
                const day = k;
                const obj = {day, belongDate};
                this.curCalendarDate.push(obj);
            }
            for (let j of this.curCalendarDate) {
                j.shifts = [];
                j.shiftTypeId = '';
                j.shiftTypeName = '';
            }
            this.getScheduleList();
        },
        // 点击上一月
        clickLastMonth() {
            this.calendarSixData = [];
            this.curCalendarDate = [];
            this.calendarDate.year = this.calendarDate.lastYear;
            this.calendarDate.month = this.calendarDate.lastMonth;
            this.calendarDate.Days = this.calendarDate.lastDays;
            this.getLastNextMonth();
            // this.getScheduleList();
        },
        // 点击下一月
        clickNextMonth() {
            this.calendarSixData = [];
            this.curCalendarDate = [];
            this.calendarDate.year = this.calendarDate.nextYear;
            this.calendarDate.month = this.calendarDate.nextMonth;
            this.calendarDate.Days = this.calendarDate.nextDays;
            this.getLastNextMonth();

            // this.getScheduleList();
        },
        // 双击事件
        setShiftType(dateDay) {
            if (dateDay.shifts.length === 0) {
                this.shiftTypeSet(dateDay);
            } else {
                this.changeShiftType(dateDay);
            }
        },
        //选择批量排班
        evCalendarChecked($event, dayData) {
            this.days=dayData;
            this.checkedDay=dayData.isCheck
            if (this.checkedDay == true) {
                this.calendarChecked.push(dayData.belongDate)
                let setArr = new Set(this.calendarChecked)
                this.calendarChecked = Array.from(setArr)
            } else {
                for(let i = 0; i < this.calendarChecked.length; i++) {
                    if(this.calendarChecked[i] == dayData.belongDate) {
                        this.calendarChecked.splice(i, 1);
                        break;
                    }
                }
                // this.calendarChecked.pop(dayData.belongDate)
                let setArr = new Set(this.calendarChecked)
                this.calendarChecked = Array.from(setArr)
            }
            this.CheckedArr = this.calendarChecked
            this.curTimeJoin = this.CheckedArr.join(",")
            this.curTime = this.CheckedArr
            if(this.calendarChecked.length!=0){
                this.isDisabled=false
            }else{
                this.isDisabled=true
            }
        },
        //点击批量排班
        evBatch(days) {
            this.curTimeJoin=this.CheckedArr.join(",")
            this.isOnDuty = days.isOnDuty;
            this.isCompute = days.isCompute;
            this.SchedulingTitle = '排班';
            this.curTime = this.CheckedArr;
            this.curWorkShopName = this.workShopList.find(x => x.deptId === this.currentWorkshopId).deptName;
            this.defaultShiftId = this.shiftType[0].id;
            this.haveShiftData = [];
            this.getShift();
            this.SchedulingModalShow = true
        },
        // 获取排班信息
        getScheduleList() {
            const _this = this;
            let params = {};
            params = {
                workshopId: this.currentWorkshopId,
                dateFrom: this.curCalendarDate[0].belongDate,
                dateTo: this.curCalendarDate[41].belongDate
            };
            this.$call('schedule.list', params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.curCalendarDate.map(x => {
                        x.shifts = [];
                        return x;
                    });
                    for (let d of content.res) {
                        if (_this.curCalendarDate.map(x => x.belongDate).includes(d.belongDate)) {
                            _this.curCalendarDate.find(x => x.belongDate === d.belongDate).shifts = d.shifts;
                            _this.curCalendarDate.find(x => x.belongDate === d.belongDate).shiftTypeId = d.shiftTypeId;
                            _this.curCalendarDate.find(x => x.belongDate === d.belongDate).shiftTypeName = d.shiftTypeName;
                            // _this.curCalendarDate.find(x => x.belongDate === d.belongDate).isCompute = '';
                            _this.curCalendarDate.find(x => x.belongDate === d.belongDate).isCompute = d.isCompute;
                            // _this.curCalendarDate.find(x => x.belongDate === d.belongDate).isAllocate = '';
                            _this.curCalendarDate.find(x => x.belongDate === d.belongDate).isOnDuty = d.isOnDuty;
                        }
                    }
                    var Sdata = [];
                    _this.calendarSixData = [];
                    for (let d = 0; d < _this.curCalendarDate.length; d++) {
                        _this.curCalendarDate[d].isCheck = false;
                        Sdata.push(_this.curCalendarDate[d]);
                        if (d % 7 === 6) {
                            _this.calendarSixData.push(Sdata);
                            Sdata = [];
                        }
                    }
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 获取班制列表
        getShiftType() {
            const _this = this;
            this.$api.dictionary.getShiftType().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.shiftType = content.res;
                }
            });
        },
        // 改变车间
        ChangeWorkshop(val) {
            this.currentWorkshopId = val;
            this.calendarSixData = [];
            this.curCalendarDate = [];
            this.getLastNextMonth();
            this.getShiftGroup();
        },
        // 根据车间判断车间班组信息
        getShiftGroup() {
            const _this = this;
            this.$call('group.list', {isEnable: true}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.shiftGroup = res.data.res.map(item => {
                        return {
                            groupId: item.id,
                            groupName: item.name
                        };
                    });
                }
            });
        },
        // 设置日历班制
        shiftTypeSet(dayData) {
            // debugger
            this.curTimeJoin=dayData.belongDate
            this.isOnDuty = dayData.isOnDuty;
            this.isCompute = dayData.isCompute;
            this.SchedulingTitle = '排班';
            this.curTime = new Array(dayData.belongDate);
            console.log("设置日历班制",this.curTime)
            this.curWorkShopName = this.workShopList.find(x => x.deptId === this.currentWorkshopId).deptName;
            this.defaultShiftId = this.shiftType[0].id;
            this.haveShiftData = [];
            this.getShift();
        },
        // 点击班制 这里有数据的情况下
        changeShiftType(dayData) {
            this.calendarChecked.length=0;
            this.isCompute = dayData.isCompute;
            this.isOnDuty = dayData.isOnDuty;
            if (this.isCompute) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>已经核算，该天不能对排版信息进行修改</p>',
                    onOk: () => {
                    }
                });
                return false;
            }
            this.curTime =  new Array(dayData.belongDate);
            this.curTimeJoin = dayData.belongDate;
            console.log("点击班制 这里有数据的情况下",this.curTime)
            this.curWorkShopName = this.workShopList.find(x => x.deptId === this.currentWorkshopId).deptName;
            this.SchedulingTitle = '排班';
            this.defaultShiftId = dayData.shiftTypeId;
            this.haveShiftData = dayData.shifts;
            this.getShift();
        },
        ChangeShiftTypeRadio(val) {
            this.defaultShiftId = val;
            this.getShift();
        },
        getShift() {
            const _this = this;
            this.$api.shift.getShiftList({typeId: this.defaultShiftId, auditState: 3}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.shiftGroupTableData = content.res.map(item => {
                        return {
                            values: [],
                            shiftId: item.id,
                            shiftName: item.name,
                            isCompute: (_this.isCompute === true),
                            isOnDuty: (_this.isOnDuty === true),
                            groups: _this.shiftGroup.map(item => {
                                return {
                                    groupId: item.groupId,
                                    groupName: item.groupName
                                };
                            })
                        };
                    });
                    for (let d of _this.haveShiftData) {
                        for (let s of _this.shiftGroupTableData) {
                            if (d.shiftId === s.shiftId) {
                                // _this.shiftGroupTableData.find(x => x.shiftId === d.shiftId).values = [];
                                for (let g of d.groups) {
                                    _this.shiftGroupTableData.find(x => x.shiftId === d.shiftId).values.push(g.groupId);
                                }
                            }
                        }
                    }
                    _this.transitionData = _this.shiftGroupTableData;
                    _this.SchedulingModalShow = true;
                }
            });
        },
        // 判断样式
        calendarJudge(dayData) {
            // 判断取消的情况，如果班组数组里面没有对象，也为没有设置
            const isSet = dayData.shifts.length === 0 ? false : this.JudgeShiftGroup(dayData.shifts);
            const isMonth = parseInt(dayData.belongDate.split('-')[1]);
            const isToday = dayData.belongDate.split('-')[0] + dayData.belongDate.split('-')[1] + dayData.belongDate.split('-')[2];
            /* ESLint-disable */
            // const shiftType = (dayData.shiftTypeId === (this.shiftType[0] ? this.shiftType[0].id : false) ? true : false);
            // const shiftType = (dayData.shiftTypeId === (this.shiftType[0] ? this.shiftType[0].id : false) ? true : false);
            let shiftType = '';
            if (this.shiftType[0]) {
                if (dayData.shiftTypeId === this.shiftType[0].id) {
                    shiftType = 'isTwice';
                } else if (dayData.shiftTypeId === this.shiftType[1].id) {
                    shiftType = 'isThird';
                } else {
                    shiftType = 'isFullTime';
                }
            }
            return {isSet, shiftType, isToday, isMonth};
        },
        // 删除数组的情况，没有班组，即为未设置
        JudgeShiftGroup(shifts) {
            let result = false;
            for (let s of shifts) {
                if (s.groups.length !== 0) {
                    result = true;
                }
            }
            return result;
        },
        // 取消排班
        SchedulingCancel() {
            // this.curTime=[];
            this.SchedulingModalShow = false;
            this.SchedulingLoading = false;
        },
        // 确认排班
        SchedulingSubmit() {
            if (this.isOnDuty) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>该天已经进行值班，排班信息不能修改</p>'
                });
                return false;
            }
            let data = [];
            for (let sT of this.shiftGroupTableData) {
                let obj = {
                    shiftId: sT.shiftId,
                    shiftName: sT.shiftName,
                    groups: []
                };
                if (sT.values !== undefined) {
                    for (let v of sT.values) {
                        obj.groups.push(sT.groups.find(x => x.groupId === v));
                    }
                    data.push(obj);
                }
            }
            // debugger;
            let params = {
                deptId: this.currentWorkshopId,
                deptName: this.curWorkShopName,
                shiftTypeName: this.shiftType.find(x => x.id === this.defaultShiftId).name,
                shiftTypeId: this.defaultShiftId,
                // belongDate: this.curTime,
                shifts: data,
                belongDates: this.curTime
            };
            this.SchedulingLoading = true;
            this.$call('schedule.save', params).then((res) => {
                let content = res.data;
                this.SchedulingLoading = false;
                if (content.status === 200) {
                    this.getScheduleList();
                    this.$Message.success('保存成功');
                    this.SchedulingModalShow = false;
                    this.checkLen=this.calendarChecked.length;
                    this.calendarChecked.length=0;
                    this.curTime=[];
                    this.isDisabled=true;
                }
            });
        },
        // 班组的数据
        // 点击班组
        getGroupUser(dayData, param, time) {
            this.removeUserDisabled = true;
            if (dayData.isCompute) {
                this.addUserDisabled = true;
                // this.removeUserDisabled = true;
                this.postDisabled = true;
            } else {
                this.addUserDisabled = false;
                // this.removeUserDisabled = false;
                this.postDisabled = false;
            }
            this.shiftGroupModalShow = true;
            // 班组的id，班组的名字，当前车间
            this.curTimeGroupId = param.id;
            this.shiftGroupTitle = param.groupName;
            // 获取当前车间数组
            // let result = [];
            // debugger
            this.curDepartId = param.groupId;
            // this.getDefaultDepart(result, param.groupId);
            // 获取班组下的人员
            this.getUserByGroup();
        },
        // getDefaultDepart (result, z) {
        //     let arr = this.departList.find(x => x.parentId === 0).id;
        //     result.push(z);
        //     // debugger
        //     if (this.departList.find(x => x.id === z).parentId === arr) {
        //         return this.curDepart = result.reverse();
        //     } else {
        //         this.getDefaultDepart(result, this.departList.find(x => x.id === z).parentId);
        //     }
        // },
        getUserByGroup() {
            this.shiftGroupUserLoading = true;
            this.$call('schedule.user.listByScheduleGroupId', {scheduleGroupId: this.curTimeGroupId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftGroupUserLoading = false;
                    this.shiftGroupUserData = content.res.map(item => {
                        item.postNames = item.scheduleUserPostList.length !== 0 ? item.scheduleUserPostList.map(x => x.postName).toString() : item.postName;
                        // item.postProcessName = item.scheduleUserPostList.map(x => x.postName + '(' + x.processName + ')').toString();
                        item.postProcessName = item.scheduleUserPostList.map(x => x.postName);
                        // debugger
                        return item;
                    });
                }
            });
        },
        // 取消添加班组
        shiftGroupCancel() {
            this.shiftGroupModalShow = false;
        },
        // 添加当班人员
        addCurShiftGroupUser() {
            // this.userPageIndex = 1;
            // this.userPageSize = 10;
            // this.userTotal = 0;
            this.searchName = '';
            this.selectUserList = [];
            this.getCurDepartUser();
        },
        // 选择人员
        selectUser(val) {
            // debugger
            // for (let v of val) {
            //     if (!this.selectUserList.map(x => x.id).includes(v.id)) {
            //         this.selectUserList.push(v);
            //     }
            // }
        },
        cancelSelectUser(val, row) {
            // debugger
            this.selectUserList.splice(this.selectUserList.indexOf(this.selectUserList.find(x => x.id === row.id)), 1);
        },
        selectAllUser(val) {
            // debugger
            if (val.length === this.userData.filter(x => x._disabled === false).length) {
                for (let v of val.filter(x => x._disabled === false)) {
                    if (this.selectUserList.length === 0) {
                        this.selectUserList.push(v);
                    } else if (!this.selectUserList.map(x => x.id).includes(v.id)) {
                        this.selectUserList.push(v);
                    } else {
                        //
                    }
                }
            } else if (val.length === 0) {
                for (let v of this.userData) {
                    this.selectUserList.splice(this.selectUserList.indexOf(this.selectUserList.find(x => x.id === v.id)), 1);
                }
            } else {
                for (let v of val.filter(x => x._disabled === false)) {
                    if (this.selectUserList.length === 0) {
                        this.selectUserList.push(v);
                    } else if (!this.selectUserList.map(x => x.id).includes(v.id)) {
                        this.selectUserList.push(v);
                    } else {
                        //
                    }
                }
            }
        },
        // // 改变页码
        // changePageIndex (val) {
        //     this.userPageIndex = val;
        //     this.getCurDepartUser();
        // },
        // // 改变页数
        // changePageOpts (val) {
        //     this.userPageSize = val;
        //     this.getCurDepartUser();
        // },
        getCurDepartUser() {
            const _this = this;
            // let selectedDepart = '';
            // for (let d of this.curDepart) {
            //     if (this.departList.find(x => x.parentId === d) === undefined) {
            //         selectedDepart = d;
            //     }
            // }
            this.$api.user.getUserList({
                onJob: true,
                deptId: this.curDepartId,
                // pageIndex: this.userPageIndex,
                // pageSize: this.userPageSize,
                name: this.searchName
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // _this.userTotal = content.count;
                    _this.userData = content.res.map(item => {
                        item._checked = false;
                        item._disabled = false;
                        return item;
                    });
                    for (let tu of _this.userData) {
                        if (_this.shiftGroupUserData.map(x => x.userId).includes(tu.id)) {
                            tu._checked = true;
                            tu._disabled = true;
                        }
                    }
                    for (let tu of this.userData) {
                        if (this.selectUserList.map(x => x.id).includes(tu.id)) {
                            tu._checked = true;
                            tu._disabled = false;
                        }
                    }
                    _this.userModalShow = true;
                }
            });
        },
        // 人员用户modal
        // 获取所有部门
        // getDepartDataList () {
        //     const _this = this;
        //     this.$api.dept.getDeptList().then((res) => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             _this.departList = content.res.map(item => {
        //                 return {
        //                     value: item.id,
        //                     label: item.name,
        //                     id: item.id,
        //                     parentId: item.parentId,
        //                     depth: item.depth
        //                 };
        //             });
        //             let x = _this.departList.find(x => x.parentId === 0).id;
        //             this.getTrees(_this.departList, x);
        //         }
        //     });
        // },
        // getTrees (list, parentId) {
        //     let items = {};
        //     // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
        //     for (let i = 0; i < list.length; i++) {
        //         let key = list[i].parentId;
        //         if (items[key]) {
        //             items[key].push(list[i]);
        //         } else {
        //             items[key] = [];
        //             items[key].push(list[i]);
        //         }
        //     }
        //     return this.formatTree(items, parentId);
        // },
        // formatTree (items, parentId) {
        //     let result = [];
        //     if (!items[parentId]) {
        //         return result;
        //     }
        //     for (let t of items[parentId]) {
        //         t.children = this.formatTree(items, t.id);
        //         result.push(t);
        //     }
        //     return this.departDataList = result;
        // },
        changeDepartSelect() {
            this.getCurDepartUser();
        },
        // // 改变部门
        // changeDepart (val) {
        //     this.curDepart = val;
        //     setTimeout(() => {
        //         this.userTotal = 1;
        //     }, 0);
        //     this.getCurDepartUser();
        // },
        // 取消添加用户
        userCancel() {
            this.userModalShow = false;
            this.userLoading = false;
        },
        // 确认添加用户
        userSubmit() {
            let params = [];
            params = this.selectUserList.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    postId: item.postId,
                    postName: item.postName
                };
            });
            this.userLoading = true;
            this.$api.scheduleUser.getScheduleUserAdd({
                scheduleGroupId: this.curTimeGroupId,
                users: params
            }).then((res) => {
                let content = res.data;
                this.userLoading = false;
                if (content.status === 200) {
                    this.userModalShow = false;
                    this.getUserByGroup();
                    this.$Message.success('保存成功');
                }
            });
        },
        // 点击查询
        searchUserResult(searchName) {
            this.searchName = searchName;
            this.getCurDepartUser();
        },
        // 岗位调整
        // 获取所有的岗位
        getPostList() {
            const _this = this;
            this.$api.post.getPostList().then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    let sort = [];
                    for (let g of content.res) {
                        if (sort.map(x => x.typeCode) === undefined || !sort.map(x => x.typeCode).includes(g.typeCode)) {
                            let obj = {
                                typeCode: g.typeCode,
                                typeName: g.typeName,
                                data: []
                            };
                            for (let p of content.res) {
                                if (obj.typeCode === p.typeCode) {
                                    obj.data.push(p);
                                }
                            }
                            sort.push(obj);
                        }
                    }
                    _this.postBasicList = sort;
                }
            });
        },
        // 选择岗位
        adjustPost(val) {
            this.adjustPostId = val;
        },
        // 取消
        adjustPostCancel() {
            this.adjustPostShow = false;
            this.adjustPostLoading = false;
        },
        // 确认
        adjustPostSubmit() {
            this.adjustPostLoading = true;
            this.$api.scheduleUser.getScheduleUserPostUpdate({
                scheduleUserId: this.scheduleUserId,
                postIds: this.postIds
            }).then(res => {
                let content = res.data;
                this.adjustPostLoading = false;
                if (content.status === 200) {
                    this.getUserByGroup();
                    this.adjustPostShow = false;
                    this.$Message.success('保存成功');
                }
            });
        },
        // 移除
        // 移除当班人员
        removeCurShiftGroupUser() {
            this.deleteValidate.abnormityId = '';
            this.deleteWarningMessage = '确认移除？';
            this.deleteShow = true;
        },
        // 选择移除用户
        selectRemoveGroupUser(val) {
            this.selectedRemoveUser = val;
            if (this.addUserDisabled) {
                this.removeUserDisabled = true;
            } else if (val.length === 0) {
                this.removeUserDisabled = true;
            } else {
                this.removeUserDisabled = false;
            }
        },
        // 取消移除
        deleteWarningCancel() {
            this.deleteWarningShow = false;
            this.deleteWarningLoading = false;
        },
        // 确认移除
        deleteWarningSubmit() {
            this.deleteWarningLoading = true;
            // this.$post('schedule/user/remove?sgid=' + encodeURIComponent(this.curTimeGroupId), this.selectedRemoveUser.map(x => x.userId)).then((res) => {
            this.$api.scheduleUser.getScheduleUserRemove(
                this.selectedRemoveUser.map(x => x.id)
            ).then((res) => {
                let content = res.data;
                this.deleteWarningLoading = false;
                if (content.status === 200) {
                    this.$Message.success('移除成功');
                    this.getUserByGroup();
                    this.deleteWarningShow = false;
                }
            });
        },
        getUserWorkshop() {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workShopList = res.workshopList;
                this.currentWorkshopId = res.curWorkshopId;
                this.getCurrentTime();
                this.getShiftGroup();
            });
        },
        deleteCancel() {
            this.deleteValidate.abnormityId = '';
            this.deleteShow = false;
            this.deleteLoading = false;
        },
        deleteSubmit() {
            this.$refs['deleteValidate'].validate((valid) => {
                if (valid) {
                    this.deleteLoading = true;
                    let params = this.selectedRemoveUser.map(x => {
                        return {
                            scheduleUserId: x.id,
                            scheduleId: x.scheduleId,
                            userId: x.userId,
                            userName: x.userName,
                            groupId: x.groupId,
                            groupName: x.groupName,
                            typeId: this.deleteValidate.abnormityId,
                            typeName: this.abnormityList.find(y => y.id === this.deleteValidate.abnormityId).name,
                            typeCode: this.abnormityList.find(y => y.id === this.deleteValidate.abnormityId).code
                        };
                    });
                    this.$api.scheduleUser.getScheduleUserRemove(
                        params
                    ).then((res) => {
                        let content = res.data;
                        this.deleteLoading = false;
                        if (content.status === 200) {
                            this.$Message.success('移除成功');
                            this.getUserByGroup();
                            this.deleteShow = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        getAbnormityList() {
            this.$call('dict.list', {parentCode: 'user_abnormity'}).then(res => {
                if (res.data.status === 200) {
                    this.abnormityList = res.data.res;
                }
            });
        }
    },
    created() {
        this.$store.dispatch({
            type: 'showLoading'
        });
        // 车间列表
        this.getUserWorkshop();
        this.getAbnormityList();
    },
    mounted () {
        // this.getDepartDataList();
        this.getShiftType();
        this.getPostList();
    }
};

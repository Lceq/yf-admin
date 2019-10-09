<template>
    <div>
        <Card>
            <Row>
                <Col>
                    <Form :model="formItem">
                        <FormItem label="选择车间">
                            <Select class="workshop" v-model="formItem.shift"  @on-change="onChange">
                                <Option class="workshop-list" v-for="item in workShopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <div class="table_date">
                        <div>
                            <div class="selectHead">
                                <span><a @click="lastMonthData">{{lastMonth}}月</a></span>
                                <span>{{currentYearMonth}}</span>
                                <span><a @click="nextMonthData">{{nextMonth}}月</a></span>
                            </div>
                        </div>
                        <table border="1" cellpadding="10" cellspacing="0" style="font-size: 12px;width: 100%;border-color: #dddee1">
                            <thead>
                            <tr>
                                <th class="date date-header" v-for="k of this.weekday">{{k}}</th>
                            </tr>
                            </thead>
                            <tbody style="width: 100%">
                               <!--<div v-for="k of 42">-->
                                   <tr v-for="(data, index) of this.dateData">
                                       <td class="date-block" v-for="date of data" style="font-size: 14px;">
                                           <span class="date-day">{{date.time}}</span>
                                           <p v-if="(date.shifts) ? false : true" class="IsNotSet">
                                               <a @click="shiftTypeSetting(date)">日历班制</a>
                                           </p>
                                           <div class="shift-block" :class="{istwice: dateClass(date).shift === true, isThird:  dateClass(date).shift === false}" v-if="date.shifts ? true : false">
                                               <p class="shift-type-name">
                                               <a @click="changeShiftType(date)">{{date.shiftTypeName}}</a>
                                               </p>
                                               <p class="shiftClass"v-for="item in date.shifts"><Icon style="width:18px;" type="record"></Icon>{{item.shiftName}}：<span @click="getGroupUser(et, date.date)" v-for="et in item.groups"><a>{{et.groupName}}</a></span></p>
                                           </div>
                                       </td>
                                   </tr>
                            </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
            <Modal
                    v-model="warnShow"
                    title="提示"
                    @on-ok="onConfirmWarn()">
                <p>{{warnMessage}}</p>
            </Modal>
            <Modal
                    v-model="shiftShow"
                    :title="'排班'"
                    width="800"
                    :mask-closable="false">
                <Form :label-width="100" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                    <Row>
                        <Col span="22">
                            <FormItem label="车间:" class="formItemMargin" prop="workshop">
                                <span v-model="newFormValidate.workshop">{{ newFormValidate.workshop }}</span><span style="margin-left: 10px;" v-model="newFormValidate.date">({{ newFormValidate.date }})</span>
                            </FormItem>
                            <FormItem label="班制:" class="formItemMargin" prop="shift">
                                <RadioGroup @on-change="ChangeShift" v-model="newFormValidate.shift">
                                    <Radio v-for="item in shiftList" :label="item.value">{{item.label}}</Radio>
                                </RadioGroup>
                            </FormItem>
                            <Table style="margin-left: 66px" border :columns="columns1" :data="shiftData"></Table>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer" class="modalFooterStyle">
                    <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                    <div>
                        <Button type="error" @click="iconCancel">取消</Button>
                        <Button type="success" :loading="scheduleLoading" @click="submitSchedule">确认</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                    v-model="GroupShow"
                    :title="WhichGroup + '用户'">
                <Row>
                    <div style="padding-bottom: 5px;">
                        <Button @click="addGroupUser" style="smargin-right: 5px;" size="small" type="success">添加</Button>
                        <Button @click="removeGroupUser" type="error" size="small">移除</Button>
                    </div>
                    <Table border ref="selection" @on-selection-change="selectGroupUser" @on-row-click="getUserNameForPost" height="300" :columns="RoleSelectcolumns" :data="tableSelectData"></Table>
                </Row>
                <div slot="footer">
                </div>
            </Modal>
            <Modal
                    v-model="GroupUserShow"
                    title="班组用户"
                    @on-ok="onConfirmGroupUser()">
                <Form :model="newGroupForm" :label-width="40" :rules="newGroupFormRules" :show-message="false">
                    <Row>
                        <Col span="10">
                            <FormItem prop="apart" label="部门">
                                <Cascader :change-on-select="true" :data="apartData" @on-change="ChangeGroup" v-model="newFormValidate.apart"></Cascader>
                            </FormItem>
                        </Col>
                        <Col span="10">
                            <FormItem prop="name" label="名称">
                                <Input @on-change="searchUser(newGroupForm.name)" v-model="newGroupForm.name" placeholder="姓名/工号" value="newGroupForm.name"></Input>
                            </FormItem>
                        </Col>
                        <Col span="4" style="text-align: center"><Button @click="searchTargetUser" :loading="Searchloading" type="success">查询</Button></Col>
                    </Row>
                </Form>
                <Row style="margin-bottom: 20px">
                    <Col>
                        <Table border ref="selection" @on-selection-change="selectTableUser" height="300" :columns="tableSelectcolumns" :data="tableSelectUser"></Table>
                    </Col>
                    <Row style="margin-top: 10px; text-align: right">
                        <Col>
                            <Page size="small" :total="userTotalNum" :page-size="userPageSize" @on-change="ChangeUserPage" show-elevator></Page>
                        </Col>
                    </Row>
                </Row>
                <div slot="footer" class="modalFooterStyle">
                    <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                    <div>
                        <Button type="error" @click="newAddGroupCancel">取消</Button>
                        <Button type="success" :loading="AddUserLoading" @click="submitAddGroup">确认</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                    v-model="setPostModal"
                    title="设置岗位">
                <Form :model="newPostForm" :label-width="130" :rules="newPostFormRules" :show-message="false">
                    <Row>
                        <Col>
                            <FormItem class="formItemMargin" prop="name" label="姓名">
                                <span>{{newPostForm.userName}}</span>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="post" label="岗位">
                                <Select @on-change="changePost" v-model="newPostForm.post" style="width:150px">
                                    <Option v-for="item in PostList" style="width:100%;text-align: left" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div slot="footer" class="modalFooterStyle">
                    <span></span>
                    <div>
                        <Button type="error" @click="onCancelPost">取消</Button>
                        <Button type="success" @click="onConfirmPost">确认</Button>
                    </div>
                </div>
            </Modal>
            <Modal
                    v-model="pointShow"
                    title="提示"
                    :loading="removeLoading"
                    @on-ok="onConfirmPoint()">
                <p>确定要移除吗？</p>
            </Modal>
        </Card>
    </div>
</template>

<script>
    import api from '../../ajax/api';
    export default {
        name: 'schedule-manager',
        data () {
            return {
                MonthToadyShift: {},
                scheduleLoading: false,
                Searchloading: false,
                AddUserLoading: false,
                removeLoading: false,
                // 班制id和name
                defaultPostId: '',
                currentShiftTypeId: '',
                currentShiftType: '',
                dateData: [],
                warnMessage: '',
                newPostForm: {},
                newPostFormRules: {},
                PostList: [],
                defaultWorkshop: [],
                // 班组
                shiftGroup: [],
                scheduleUserId: '',
                paramsIndex: '',
                warnShow: false,
                // 当前车间
                currentWorkshop: '',
                shiftGroupData: [],
                // 表格当前班组id select多选
                getShiftGroupId: [],
                // 获得的当前班次的班组数据
                currentShiftData: [],
                currentShiftDataId: [],
                currentShiftDataIndex: '',
                // 所有的班次下的班组信息，用于提交
                AllShiftData: {},
                shiftShow: false,
                model10: [],
                formItem: {
                    shift: 1
                },
                isNotData: false,
                isOnce: true,
                isOnceGroupSure: false,
                isOnceGroup: false,
                pointShow: false,
                // paramsData : [],
                // 如果没有选择车间 - 提示
                notSelectWorkShop: true,
                // 当前年月-当前月
                currentYearMonth: '',
                currentMonth: '',
                isFirst: false,
                getCurrentData: false,
                isNotGetGroups: false,
                isGetGroups: false,
                oldEventData: [],
                setPostModal: false,
                weekday: ['日', '一', '二', '三', '四', '五', '六'],
                columns1: [
                    {
                        title: '序号',
                        width: 80,
                        sortable: true,
                        key: 'shiftId'
                    },
                    {
                        title: '班次名称',
                        width: 110,
                        sortable: true,
                        key: 'shiftName'
                    },
                    {
                        title: '班组',
                        key: 'shift',
                        render: (h, params) => {
                            const _this = this;
                            // var paramsSelect = params;
                            return h('div', [
                                h('Select', {
                                    props: {
                                        // value: _this.newFormValidate.shifts === (undefined || []) ? [] : (_this.newFormValidate.shifts.map(x => x.shiftId).includes(params.row.shiftId) === true ? _this.newFormValidate.shifts.find(x => x.shiftId === params.row.shiftId).groups.map(y => y.groupId) : []),
                                        value: _this.isHaveData === [] ? [] : (_this.isHaveData.find(item => item.shiftId === params.row.shiftId) === undefined ? [] : _this.isHaveData.find(item => item.shiftId === params.row.shiftId).groups.map(x => x.groupId)),
                                        multiple: true,
                                        labelInValue: true
                                    },
                                    on: {
                                        'on-change': (data) => {
                                            // console.log(params);
                                            _this.shiftId = params.row.shiftId;
                                            _this.shiftName = params.row.shiftName;
                                            _this.getCurrentShiftData(data);
                                        }
                                    },
                                    style: {
                                        width: '410px'
                                    }
                                },
                                this.shiftGroup.map(item => {
                                    return h('Option', {
                                        props: {value: item.groupId, key: item.groupId}
                                    }, item.groupName);
                                })
                                )
                            ]);
                        }
                    }
                ],
                shiftData: [],
                workShopList: [],
                shiftList: [],
                dateDateData: [],
                model1: '',
                nowToady: '',
                apartData: [],
                GroupUserShow: false,
                newFormValidate: {
                    workshop: '一车间',
                    date: '2018-1-1',
                    shift: '一车间'
                },
                RoleSelectcolumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名称',
                        sortable: true,
                        key: 'name'
                    },
                    {
                        title: '工序',
                        sortable: true,
                        width: 100,
                        key: 'processName'
                    },
                    {
                        title: '岗位',
                        sortable: true,
                        width: 100,
                        key: 'postName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 100,
                        // align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: (event) => {
                                            // this.userMachineShow = true;
                                            // console.log(event);
                                            // debugger
                                            this.setPostModal = true;
                                        }
                                    }
                                }, '岗位')
                            ]);
                        }
                    }
                ],
                tableSelectcolumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户名称',
                        sortable: true,
                        key: 'name'
                    },
                    {
                        title: '岗位',
                        sortable: true,
                        width: 150,
                        key: 'postName'
                    }
                ],
                tableSelectData: [
                    {
                        name: 'John',
                        postName: '123'
                    }
                ],
                newFormValidateRules: {},
                newGroupForm: {},
                isHaveData: [],
                newGroupFormRules: {},
                calendarDate: {},
                userTotalNum: 0,
                userPageSize: 10,
                // pageSize: '',
                newAddLowerErrorMsg: '',
                timeIndex: '',
                shiftTypeIndex: '',
                shiftIndex: '',
                currentWorkshopId: 1,
                isOnceStop: false,
                lastMonth: '',
                nextMonth: '',
                isNotGroupData: false,
                WhichGroup: '甲班',
                isDetailShow: true,
                isHaveGroups: false,
                tableSelectUser: [],
                GroupShow: false,
                userPostId: ''
            };
        },
        computed: {
            time: () => {
                const year = 2018; // 表示需要查找的年份
                const month = 5; // 表示需要查找的月份
                const curMonthDays = new Date(year, month, 0).getDate(); // 0表示3月的第0天，上月的最后一天,月份从0开始记数
                console.log('查找的月份共有' + curMonthDays + '天');
                return curMonthDays;
            }
        },
        methods: {
            getMonth () {
                const date = new Date();
                const year = date.getFullYear(); // 年份
                const month = date.getMonth() + 1; // 月份
                const week = date.getDay(); // 星期几
                const day = date.getDate(); // 每月的第几号
                const curMonthDays = new Date(year, month, 0).getDate(); // 每月的天数
                const cueMonthFirstDay = new Date(year, month - 1, 1).getDay(); // 每月的第一天星期几
            },
            getTime () {
                // var calendarDate = {};
                this.calendarDate.today = new Date();
                this.calendarDate.year = this.calendarDate.today.getFullYear();// 当前年
                this.calendarDate.month = this.calendarDate.today.getMonth() + 1; // 当前月
                this.calendarDate.date = this.calendarDate.today.getDate(); // 当前日
                this.calendarDate.day = this.calendarDate.today.getDay(); // 当前周几
                this.nowToady = this.calendarDate.year + '' + (this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month) + '' + (this.calendarDate.date < 10 ? '0' + this.calendarDate.date : this.calendarDate.date);
                this.getDays();
            },
            // 判断是否为闰年
            isLeapYear () {
                if (this.calendarDate.year % 4 === 0 && this.calendarDate.year % 100 !== 0) {
                    this.calendarDate.isLeapYear = true; // 是闰年
                } else {
                    this.calendarDate.isLeapYear = false; // 不是闰年
                }
            },
            // 获取上个月，本月，下个月的信息
            getDays () {
                // 上个月天数
                if (parseInt(this.calendarDate.month === 1)) {
                    this.calendarDate.lastDays = new Date(this.calendarDate.year - 1, 12, 0).getDate();
                    this.calendarDate.lastMonth = new Date(this.calendarDate.year - 1, 12, 0).getMonth() + 1;
                    this.calendarDate.lastYear = new Date(this.calendarDate.year - 1, 12, 0).getFullYear();
                } else {
                    this.calendarDate.lastDays = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getDate();
                    this.calendarDate.lastMonth = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getMonth() + 1;
                    this.calendarDate.lastYear = new Date(this.calendarDate.year, this.calendarDate.month - 1, 0).getFullYear();
                }
                // 下个月天数
                if (parseInt(this.calendarDate.month) === 12) {
                    this.calendarDate.nextDays = new Date(this.calendarDate.year + 1, 1, 0).getDate();
                    this.calendarDate.nextMonth = new Date(this.calendarDate.year + 1, 1, 0).getMonth() + 1;
                    this.calendarDate.nextYear = new Date(this.calendarDate.year + 1, 1, 0).getFullYear();
                } else {
                    this.calendarDate.nextDays = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getDate();
                    this.calendarDate.nextMonth = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getMonth() + 1;
                    this.calendarDate.nextYear = new Date(this.calendarDate.year, this.calendarDate.month + 1, 0).getFullYear();
                }
                // 本月天数
                this.calendarDate.days = new Date(this.calendarDate.year, this.calendarDate.month, 0).getDate();
                this.getIndexDay();
            },
            // 绘制
            getIndexDay () {
                // 本月一号周几
                this.currentYearMonth = this.calendarDate.year + '年' + this.calendarDate.month + '月';
                this.currentMonth = this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month + '';
                this.lastMonth = this.calendarDate.lastMonth;
                this.nextMonth = this.calendarDate.nextMonth;
                // this.currentYear = this.calendarDate.year;
                this.calendarDate.monthStart = new Date(this.calendarDate.year, this.calendarDate.month - 1, 1).getDay();
                // if (this.calendarDate.monthStart === 0) {
                //     this.calendarDate.monthStart = 7;
                // }
                // 上个月数据
                for (let i = this.calendarDate.monthStart; i > 0; i--) {
                    const date = this.calendarDate.lastYear + '-' + (this.calendarDate.lastMonth < 10 ? '0' + this.calendarDate.lastMonth : this.calendarDate.lastMonth) + '-' + (this.calendarDate.lastDays - ((i - 1) < 10 ? '0' + (i - 1) : (i - 1)));
                    const time = this.calendarDate.lastDays - i + 1;
                    const obj = {time, date};
                    this.dateData.push(obj);
                }
                // 本月数据
                for (let time = 1; time <= this.calendarDate.days; time++) {
                    const date = this.calendarDate.year + '-' + (this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month) + '-' + (time < 10 ? '0' + time : time);
                    const obj = {time, date};
                    this.dateData.push(obj);
                }
                // 下个月数据
                // 看一下剩下几天还能显示几天
                const remainDays = 42 - this.calendarDate.days - this.calendarDate.monthStart;
                for (let k = 1; k <= remainDays; k++) {
                    const date = this.calendarDate.nextYear + '-' + (this.calendarDate.nextMonth < 10 ? '0' + this.calendarDate.nextMonth : this.calendarDate.nextMonth) + '-' + (k < 10 ? '0' + k : k);
                    const time = k;
                    const obj = {time, date};
                    this.dateData.push(obj);
                }
            },
            lastMonthData () {
                this.calendarDate.year = this.calendarDate.lastYear;
                this.calendarDate.month = this.calendarDate.lastMonth;
                this.calendarDate.Days = this.calendarDate.lastDays;
                this.dateData = [];
                this.getDays();
                this.getScheduleList();
            },
            nextMonthData () {
                this.calendarDate.year = this.calendarDate.nextYear;
                this.calendarDate.month = this.calendarDate.nextMonth;
                this.calendarDate.Days = this.calendarDate.nextDays;
                this.dateData = [];
                this.getDays();
                this.getScheduleList();
            },
            // 调用车间
            getWorkshop () {
                const _this = this;
                this.$fetch('dept/workshops').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.workShopList = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                name: item.name
                            };
                        });
                        console.log('调取车间列表');
                    }
                });
                console.log('调用车间');
            },
            // 选择车间
            onChange (value) {
                if (this.isOnce) {
                    this.isOnce = false;
                    return false;
                }
                if (value) {
                    this.currentWorkshop = this.workShopList.find(item => item.id === value).name;
                    this.currentWorkshopId = value;
                    this.notSelectWorkShop = false;
                    // debugger
                    this.dateData = (this.dateData || []).map(item => {
                        return {
                            date: item.date,
                            time: item.time
                        };
                    });
                    // 调用数据
                    this.getScheduleList();
                    // 获取当前车间的班组
                    this.getShiftGroup();
                }
            },
            shiftTypeSetting (date) {
                if (this.nowToady > date.date.split('-')[0] + date.date.split('-')[1] + date.date.split('-')[2]) {
                    this.warnShow = true;
                    this.warnMessage = '您不能对过去的时间进行排班';
                    return false;
                } else {
                    this.shiftShow = true;
                    this.newFormValidate.workshop = this.currentWorkshop;
                    this.newFormValidate.date = date.date;
                    // 进行一个判断,判断是不是有数据
                    // debugger
                    if (date.shifts === undefined) {
                        // 说明没有数据
                        // debugger
                        if (this.shiftList.length > 0) {
                            this.newFormValidate.shift = this.shiftList[0].value;
                            this.shiftTypeIndex = this.shiftList[0].value;
                            this.currentShiftType = this.shiftList[0].label;
                            this.isNotData = true;
                            this.isHaveData = [];
                            this.getShift();
                        } else {
                            // 当前车间下还没有设置班制
                            this.newAddLowerErrorMsg = '当前车间下还没有设置班制';
                        }
                    } else {
                    }
                }
            },
            // 对现有的数据进行改变
            changeShiftType (date) {
                this.shiftShow = true;
                this.newFormValidate.workshop = this.currentWorkshop;
                this.newFormValidate.date = date.date;
                this.newFormValidate.shift = date.shiftTypeId;
                // 班制
                this.shiftTypeIndex = date.shiftTypeId;
                this.currentShiftType = date.shiftTypeName;
                // 班次班组数据
                this.isHaveData = date.shifts;
                this.isGetGroups = true;
                // debugger
                this.getShift();
            },

            // 改变班制
            ChangeShift (value) {
                // debugger
                this.shiftTypeIndex = value;
                this.currentShiftType = this.shiftList.find(item => item.value === value).label;
                // this.currentShiftData[value] = [];
                // this.currentShiftData[value].shiftId = value;
                // console.log(this.currentShiftData);
                this.getShift();
            },
            // 得到当前班组数据
            getCurrentShiftData (data) {
                if (data.length > 0) {
                    if (data[0].value) {
                        data = (data || []).map(item => {
                            return {
                                groupId: item.value,
                                groupName: item.label
                            };
                        });
                    }
                }
                // debugger
                this.shiftGroupData[this.shiftId] = {};
                this.shiftGroupData[this.shiftId].shiftId = this.shiftId;
                this.shiftGroupData[this.shiftId].shiftName = this.shiftName;
                this.shiftGroupData[this.shiftId].groups = data;
                // debugger
                this.currentShiftData = [];
                // for (let item in this.shiftGroupData) {
                //     // console.log(item);
                //     this.currentShiftData.push(this.shiftGroupData[item]);
                // }
                // 判断数组里数据是否是本班次下面的数组
                for (let j of this.shiftGroupData.map(y => y.shiftId)) {
                    if (this.shiftData.map(x => x.shiftId).includes(j)) {
                        // console.log(j);
                        // debugger
                        this.currentShiftData.push(this.shiftGroupData[j]);
                    }
                }
                // debugger
            },
            submitSchedule () {
                const params = {
                    deptId: this.currentWorkshopId,
                    deptName: this.currentWorkshop,
                    shiftTypeName: this.currentShiftType,
                    shiftTypeId: this.shiftTypeIndex,
                    belongDate: this.newFormValidate.date,
                    shifts: this.currentShiftData
                };
                // debugger
                this.scheduleLoading = true;
                this.$post('schedule/save', params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.scheduleLoading = false;
                        this.getScheduleList();
                        this.shiftShow = false;
                        console.log('保存成功');
                    }
                });
            },
            // 调用班制
            getShiftType () {
                console.log('调用班制');
                const _this = this;
                this.$fetch('dict/list', {parentcode: 'shift_type'}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.shiftList = (content.res || []).map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            };
                        });
                    }
                });
            },
            // 通过班制获取班次信息
            getShift () {
                const _this = this;
                this.$fetch('shift/list', {typeid: this.shiftTypeIndex}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        // debugger
                        _this.shiftData = (content.res || []).map(item => {
                            return {
                                shiftId: item.id,
                                shiftName: item.name,
                                groups: []
                            };
                        });
                    }
                });
            },
            // 获取车间下的班组信息
            getShiftGroup () {
                console.log('获取车间下的班组信息');
                const _this = this;
                this.$fetch('dept/groups?parentid=' + this.currentWorkshopId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.shiftGroup = (content.res || []).map(item => {
                            return {
                                groupId: item.id,
                                groupName: item.name
                            };
                        });
                        console.log('获得班组');
                    }
                });
            },
            // 获取排班管理信息
            getScheduleList () {
                console.log('获取排班管理信息');
                const _this = this;
                const params = {
                    deptid: this.currentWorkshopId,
                    from: this.dateData[0].date,
                    to: this.dateData[41].date
                };
                this.$fetch('schedule/list', params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.dateDateData = (content.res || []).map(item => {
                            return {
                                belongDate: item.belongDate,
                                shiftTypeId: item.shiftTypeId,
                                shiftTypeName: item.shiftTypeName,
                                shifts: item.shifts
                            };
                        });
                        // 数据的汇总
                        _this.getDataDate();
                        console.log('调取成功');
                    };
                });
            },
            // 对本地数据和返回的数据进行绑定
            getDataDate () {
                const _this = this;
                var objData = [];
                for (let k of this.dateData) {
                    var objdate = {};
                    if (_this.dateDateData.map(x => x.belongDate).includes(k.date)) {
                        objdate = Object.assign(k, _this.dateDateData.find(x => x.belongDate === k.date));
                    } else {
                        objdate = k;
                    }
                    objData.push(objdate);
                }
                this.dateData = objData;
                this.getPartData(this.dateData);
            },
            getPartData (data) {
                var len = data.length;
                var arrData = [];
                var jData = -1;
                arrData[0] = [];
                // debugger
                for (var d = 0; d < len; d++) {
                    if (d % 7 === 0) {
                        jData++;
                        arrData[jData] = [];
                    }
                    arrData[jData].push(data[d]);
                }
                this.dateData = arrData.length === 1 ? arrData[0] : arrData;
                // debugger
            },
            onConfirmWarn () {
                this.warnShow = false;
                console.log('提示框的确认按钮');
            },
            iconCancel () {
                this.shiftShow = false;
            },
            getUserWorkshop () {
                const _this = this;
                this.$fetch('user/workshop').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // debugger
                        _this.formItem.shift = content.res.id;
                        _this.currentWorkshopId = content.res.id;
                        _this.currentWorkshop = content.res.name;
                        this.getScheduleList();
                        this.getShiftGroup();
                    };
                });
            },
            // 下面的是对班组人员的调整
            // 选择班组，得到班组下面的用户
            getUserByGroup (params) {
                this.$fetch('schedule/user/list', {sgid: params}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        //
                        this.tableSelectData = (content.res || []).map((item) => {
                            return {
                                id: item.id,
                                userId: item.userId,
                                code: item.userId,
                                name: item.userName,
                                post: item.postId,
                                postName: item.postName,
                                process: item.processId,
                                processName: item.processName,
                                isWatcher: item.isWatcher
                            };
                        });
                        console.log('调出成功');
                    }
                });
            },
            addGroupUser () {
                this.GroupUserShow = true;
                // 这里让用户清空，部门清空
                this.newFormValidate.apart = [];
                this.tableSelectUser = [];
                this.userTotalNum = 0;
                console.log('添加');
            },
            removeGroupUser () {
                this.pointShow = true;
                console.log('移除');
            },
            getGroupUser (params, date) {
                // 判断时间上的距离，比如说今天点击的时间是不是在今天之前
                // console.log(params);
                if (this.currentMonth !== date.split('-')[1]) {
                    return false;
                };
                // 是对添加移除的显示隐藏;
                // if (this.nowToady > date.split('-')[0] + date.split('-')[1] + date.split('-')[2]) {
                //     this.isDetailShow = false;
                // } else {
                //     this.isDetailShow = true;
                //     // this.getPostUser();
                // }
                // console.log(date);
                this.GroupShow = true;
                this.WhichGroup = params.groupName;
                this.GroupId = params.id;
                this.getUserByGroup(params.id);
                // debugger
            },
            // 获取所有部门
            getApart () {
                this.$fetch(api.getOrgList()).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.apartData = content.res.map(item => {
                            return {
                                value: item.id,
                                label: item.name,
                                id: item.id,
                                parentId: item.parentId,
                                depth: item.depth
                            };
                        });
                        this.getApartData(this.apartData);
                    }
                });
            },
            // 利用paerntId进行层级的划分
            getApartData (data) {
                const treeParentId = data.map(x => x.parentId);
                const treeId = data.map(x => x.id);
                for (let i of treeId) {
                    this.isTrue = true;
                    const children = [];
                    if (treeParentId.includes(i) || this.isTrue) {
                        this.isTrue = false;
                        children.push(data.filter(x => x.parentId === i));
                    }
                    this.$set(data.find(x => x.id === i), 'children', children[0]);
                }
                this.apartData = data[0].children;
            },
            getHierarchy (num) {
                var obj1 = '';
                for (let m = 0; m < num - 2; m++) {
                    obj1 += '----';
                }
                return obj1;
            },
            // 取消按钮
            newAddGroupCancel () {
                this.AddUserLoading = false;
                this.Searchloading = false;
                this.GroupUserShow = false;
                console.log('添加取消');
            },
            submitAddGroup () {
                // debugger
                this.AddUserLoading = true;
                this.$post('schedule/user/add?sgid=' + this.GroupId, this.SelectedUser).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.AddUserLoading = false;
                        this.getUserByGroup(this.GroupId);
                        console.log('添加成功');
                    }
                });
                this.GroupUserShow = false;
                console.log('确认添加');
            },
            searchUser (name) {
                this.searchName = name;
                console.log('搜索');
            },
            ChangeGroup (params) {
                // debugger
                this.GroupIndex = params.reverse()[0];
                console.log(params);
                console.log('改变部门');
                this.getApartUserFrom();
            },
            getApartUserFrom () {
                if (this.GroupIndex === {}) {
                    return false;
                }
                const params = {
                    deptid: this.GroupIndex
                };
                this.isUserTotal = true;
                this.getApartUser(params);
            },
            getApartUser (params) {
                const _this = this;
                this.Searchloading = true;
                this.$fetch(api.getRoleUserList(), params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.Searchloading = false;
                        if (this.isUserTotal) {
                            _this.userTotalNum = content.count;
                            const params = {
                                deptid: _this.GroupIndex,
                                pageindex: _this.userPageIndex,
                                pagesize: _this.userPageSize,
                                name: _this.searchName
                            };
                            this.isUserTotal = false;
                            this.getApartUser(params);
                        } else {
                            _this.tableSelectUser = (content.res || []).map((item) => {
                                return {
                                    code: item.code,
                                    name: item.name,
                                    id: item.id,
                                    post: item.postId,
                                    postName: item.postName
                                };
                            });
                        }
                        console.log('获取员工数据成功');
                    }
                });
            },
            selectGroupUser (params) {
                console.log(params);
                this.SelectedGroupUser = params;
            },
            selectTableUser (params) {
                console.log('选择用户');
                // debugger;
                this.SelectedUser = (params || []).map(item => {
                    return {
                        id: item.id,
                        name: item.name,
                        postId: item.post,
                        postName: item.postName
                    };
                });
                console.log(params);
            },
            ChangeUserPage (index) {
                console.log(index);
                this.userPageIndex = index;
                this.getApartUserFrom();
                console.log('改变页码');
            },
            searchTargetUser () {
                console.log('查询');
                if (this.GroupIndex === {}) {
                    this.newAddLowerErrorMsg = '请先选择部门';
                } else {
                    this.getApartUserFrom();
                }
            },
            onConfirmGroupUser () {
                console.log('添加班组用户');
            },
            onConfirmPoint () {
                console.log('确认移除');
    
                this.removeLoading = true;
                this.$post('schedule/user/remove?sgid=' + this.GroupId, this.SelectedGroupUser.map(x => x.userId)).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.removeLoading = false;
                        console.log('移除成功');
                        this.getUserByGroup(this.GroupId);
                    }
                });
            },
            // 获取岗位
            getPostList () {
                this.$fetch('post/list').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        console.log('获取成功');
                        this.PostList = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                name: item.name
                            };
                        });
                    }
                });
            },
            getUserNameForPost (params) {
                console.log(params);
                this.newPostForm.userName = params.name;
                this.scheduleUserId = params.id;
                // this.defaultPostId = params.post;
                this.newPostForm.post = params.post;
                // debugger
            },
            // 设置岗位
            // 取消设置岗位
            onCancelPost () {
                this.setPostModal = false;
                console.log('取消设置岗位');
            },
            changePost (params) {
                console.log(params);
                this.userPostId = params;
            },
            // 确认设置岗位
            onConfirmPost () {
                // debugger
                const _this = this;
                // debugger
                this.setPostModal = false;
                this.$post('schedule/user/post/update?suid=' + this.scheduleUserId + '&postid=' + this.userPostId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.getUserByGroup(this.GroupId);
                        console.log('保存岗位成功');
                    }
                });
            },
            dateClass (data) {
                const isMonth = data.date.split('-')[1];
                // const isToday = data.date.split('-')[0] + data.date.split('-')[1] + data.date.split('-')[2];
                // const shift = (data.shiftTypeId === (this.shiftList[0] ? this.shiftList[0].value : false) ? true : false);
                return {isMonth};
            }
        },
        mounted () {
            this.getMonth();
            this.getTime();
            this.getShiftType();
            this.getWorkshop();
            this.getUserWorkshop();
            this.getApart();
            this.getPostList();
        }
    };
</script>

<style scoped>
    .workshop{
        width:150px;
    }
    .workshop-list{
        width:100%;
        text-align: left;
    }
    .selectHead{
        display: inline-block;
        width:100%;
        background-color: #2d8cf0;
    }
    .selectHead span{
        font-size: 18px;
        line-height: 60px;
        display: inline-block;
        width: 33.33%;
        color:#fff;
    }
    .selectHead span:first-child{
        text-align: left
    }
    .selectHead span:nth-child(2){
        text-align: center
    }
    .selectHead span:last-child{
        text-align: right
    }
    .selectHead span:first-child a{
        color: #fff;
        padding-left: 20px;
    }
    .selectHead span:last-child{
        color: #fff;
        padding-right: 20px;
    }
    .table_date{
        font-size: 0;
    }
    /*日历内部样式*/
    .date-block{
        width: 14.285%;
        vertical-align:middle;
    }
    .date-header{
        height: 60px;
        line-height: 60px;
        /*border-right: none;*/
        font-size: 14px;
        color: #495060;
    }
    .shift-type-name{
        text-align: left;
        font-size:14px;
        margin-top: 6px;
        padding-left: 25px;
    }
    .isNotMonth .date-day{
        color: #e9e9e9!important;
    }
    .isToday{
        box-shadow: 0px 0px 10px #9b9b9b;
    }
    .shiftClass{
        text-align: left;
        padding: 5px;
        line-height: 18px;
        margin-bottom: -5px;
    }
    .shiftClass span{
        margin-right:10px;
        color: #ff9900;
    }
    .date-day{
        display: inline-block;
        width: 30px;
        text-align: center;
        vertical-align:middle;
        font-size: 18px;
        font-weight:200;
        color: #999999;
    }
    .shift-block{
        display: inline-block;width: calc(100% - 34px);
        vertical-align:middle;
    }
    .IsNotSet{
        vertical-align: top;
        display: inline-block;
        width: calc(100% - 34px);
        /*line-height: 106px;*/
        text-align: center;
        position: relative;
        margin-left: -30px;
    }
    .IsNotSet a{
        margin-left: 22px;
        font-size: 16px;
        color: #e9e9e9!important;
    }
    .istwice{
        color: #ff9900!important;
    }
    .istwice .shift-type-name a{
        color: #ff9900!important;
    }
    .istwice .shiftClass span a{
        color: #ff9900!important;
    }
    .isThird{
        color: #19be6b!important;
    }
    .isThird .shift-type-name a{
        color: #19be6b!important;
    }
    .isThird .shiftClass span a{
        color: #19be6b!important;
    }
</style>
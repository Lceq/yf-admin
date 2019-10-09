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
                    <ul class="dateDay">
                        <li class="date date-header">日</li>
                        <li class="date date-header">一</li>
                        <li class="date date-header">二</li>
                        <li class="date date-header">三</li>
                        <li class="date date-header">四</li>
                        <li class="date date-header">五</li>
                        <li class="date date-header">六</li>
                    </ul>
                    <ul style="width: 100%;">
                        <li class="date date-body" v-for="(date, index) of dateData"  :class="{isNotMonth: dateClass(date).isMonth !== currentMonth, isToday:dateClass(date).isToday === nowToady , isMoreSeven: moreSeven}">
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
                        </li>
                    </ul>
                </div>
                </Col>
            </Row>
            <!--<Modal-->
                    <!--v-model="warnShow"-->
                    <!--title="提示"-->
                    <!--@on-ok="onConfirmWarn()">-->
                <!--<p>{{warnMessage}}</p>-->
            <!--</Modal>-->
            <Modal
                    v-model="shiftShow"
                    :title="'排班'"
                    width="800"
                    :mask-closable="false">
                <Form :label-width="100" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                    <Row class="shiftHeight">
                        <Col span="22">
                        <FormItem label="车间:" class="formItemMargin" prop="workshop">
                            <span v-model="newFormValidate.workshop">{{ newFormValidate.workshop }}</span><span style="margin-left: 10px;" v-model="newFormValidate.date">({{ newFormValidate.date }})</span>
                        </FormItem>
                        <FormItem label="班制:" class="formItemMargin" prop="shift">
                            <RadioGroup @on-change="ChangeShift" v-model="newFormValidate.shift">
                                <Radio v-for="(item, index) in shiftList" :key="index" :label="item.value">{{item.label}}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <Table @on-row-click="changeShiftRow" size="small" style="margin-left: 66px" border :columns="columns1" :data="shiftData"></Table>
                        </Col>
                    </Row>
                </Form>
                <!--<div slot="footer" class="modalFooterStyle">-->
                    <!--<span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>-->
                    <!--<div>-->
                        <!--<Button type="error" @click="iconCancel">取消</Button>-->
                        <!--<Button type="success" :loading="scheduleLoading" @click="submitSchedule">确认</Button>-->
                    <!--</div>-->
                <!--</div>-->
                <modal-button
                        slot="footer"
                        :WarnMsg="newAddLowerErrorMsg"
                        :loading="scheduleLoading"
                        @cancel="iconCancel"
                        @submit="submitSchedule"
                >
                </modal-button>
            </Modal>
            <Modal
                    v-model="GroupShow"
                    width="800"
                    :title=" WhichGroup + '人员'">
                <Row>
                    <div style="padding-bottom: 5px;">
                        <Button @click="addGroupUser" style="smargin-right: 5px;"  type="success">添加当班人员</Button>
                        <Button @click="removeGroupUser" type="error">移除当班人员</Button>
                    </div>
                    <Table border ref="selection" @on-selection-change="selectGroupUser" @on-row-click="getUserNameForPost" height="600" :columns="RoleSelectcolumns" size="small" :data="tableSelectData"></Table>
                </Row>
                <div slot="footer">
                </div>
            </Modal>
            <Modal
                    v-model="GroupUserShow"
                    title="班组用户"
                    width="800"
                    @on-ok="onConfirmGroupUser()">
                <Row>
                    <Col style="vertical-align: top;">
                        <div style="display: inline-block;width: 300px; vertical-align: top; text-align: left">
                            <Cascader :change-on-select="true" :data="apartData" @on-change="ChangeGroup" v-model="apart"></Cascader>
                        </div>
                       <div style="display: inline-block;width:300px; vertical-align: top">
                           <Input @on-change="searchUser(name)" style="vertical-align: top" v-model="name" placeholder="请输入姓名" value="newGroupForm.name"></Input>
                       </div>
                        <div style="display: inline-block; vertical-align: top">
                            <Button style="vertical-align: top" @click="searchTargetUser" :loading="Searchloading" type="success">查询</Button>
                        </div>
                    </Col>
                </Row>
                <!--<Form :model="newGroupForm" :label-width="100px" :rules="newGroupFormRules" :show-message="false">-->
                    <!--<Row>-->
                        <!--<Col style="text-align: left">-->
                            <!--<FormItem style="width: 300px; text-align: left; display: inline-block" prop="apart" label="部门：">-->
                                <!--<Cascader :change-on-select="true" :data="apartData" @on-change="ChangeGroup" v-model="newFormValidate.apart"></Cascader>-->
                            <!--</FormItem>-->
                            <!--<FormItem style="width: 300px; display: inline-block" prop="name" label="人员姓名：">-->
                                <!--<Input @on-change="searchUser(newGroupForm.name)" v-model="newGroupForm.name" placeholder="请输入姓名" value="newGroupForm.name"></Input>-->
                            <!--</FormItem>-->
                            <!--<Button @click="searchTargetUser" :loading="Searchloading" type="success">查询</Button>-->
                        <!--</Col>-->
                    <!--</Row>-->
                <!--</Form>-->
                <Row style="margin-bottom: 20px">
                    <Col>
                    <Table border ref="selection" size="small" @on-selection-change="selectTableUser" height="500" :columns="tableSelectcolumns" :data="tableSelectUser"></Table>
                    </Col>
                    <Row style="margin-top: 10px; text-align: right">
                        <Col>
                        <Page size="small" :total="userTotalNum" :page-size="userPageSize" @on-change="ChangeUserPage" show-elevator></Page>
                        </Col>
                    </Row>
                </Row>
                <modal-button
                        slot="footer"
                        :WarnMsg="newAddLowerErrorMsg"
                        :loading="AddUserLoading"
                        @cancel="newAddGroupCancel"
                        @submit="submitAddGroup"
                >
                </modal-button>
            </Modal>
            <Modal
                    v-model="setPostModal"
                    width="400"
                    title="设置岗位">
                <Form :model="newPostForm" :label-width="130" :rules="newPostFormRules" :show-message="false">
                    <Row>
                        <Col>
                        <FormItem class="formItemMargin" prop="name" label="姓名：">
                           <span>{{newPostForm.userName}}</span>
                        </FormItem>
                            <FormItem class="formItemMargin" prop="post" label="岗位：">
                                <Select @on-change="changePost" v-model="newPostForm.post" style="width:150px">
                                    <Option v-for="item in PostList" style="width:100%;text-align: left" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <!--<div slot="footer" class="modalFooterStyle">-->
                    <!--<span></span>-->
                    <!--<div>-->
                        <!--<Button type="error" @click="onCancelPost">取消</Button>-->
                        <!--<Button type="success" @click="onConfirmPost">确认</Button>-->
                    <!--</div>-->
                <!--</div>-->
                <modal-button
                        slot="footer"
                        @cancel="onCancelPost"
                        @submit="onConfirmPost"
                >
                </modal-button>
            </Modal>
            <!--<Modal-->
                    <!--v-model="pointShow"-->
                    <!--title="提示">-->
                <!--<p>{{WarnMessage}}</p>-->
                <!--<module-button-->
                        <!--slot="footer"-->
                        <!--:loading="removeLoading"-->
                        <!--@cancel="onCancelPoint"-->
                        <!--@submit="onConfirmPoint"-->
                <!--&gt;-->
                <!--</module-button>-->
            <!--</Modal>-->
            <delete-warning
                    :v-model="warnShow"
                    :tipMsg="warnMessage"
                    :loading="removeLoading"
                    @cancel="onCancelPoint"
                    @confirm="onConfirmPoint"
            ></delete-warning>
        </Card>
    </div>
</template>
<script>
    import api from '../../ajax/api';
    import modalButton from '../public/modalButton';
    import deleteWarning from '../public/deleteWarning';
    export default {
        name: 'schedule-manager',
        components: {
            modalButton,
            deleteWarning
        },
        data () {
            return {
                loadingOnce: false,
                moreSeven: false,
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
                WarnMessage: '',
                newPostForm: {},
                newPostFormRules: {},
                PostList: [],
                defaultWorkshop: [],
                deleteSure: false,
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
                columns1: [
                    // {
                    //     title: '序号',
                    //     width: 80,
                    //     sortable: true,
                    //     key: 'shiftId'
                    // },
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
                            return h('div', [
                                h('Select', {
                                    props: {
                                        value: _this.isHaveData === [] ? [] : (_this.isHaveData.find(item => item.shiftId === params.row.shiftId) === undefined ? [] : _this.isHaveData.find(item => item.shiftId === params.row.shiftId).groups.map(x => x.groupId)),
                                        multiple: true,
                                        labelInValue: true
                                    },
                                    on: {
                                        'on-change': (data) => {
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
                        title: '姓名',
                        width: 120,
                        sortable: true,
                        key: 'name'
                    },
                    {
                        title: '工序',
                        sortable: true,
                        width: 120,
                        align: 'center',
                        key: 'processName'
                    },
                    {
                        title: '当班岗位',
                        sortable: true,
                        key: 'postName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        // type: 'error',
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
                                }, '岗位调整')
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
                        title: '姓名',
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
                tableSelectData: [],
                name: '',
                apart: [],
                assemblyName: '',
                newFormValidateRules: {},
                newGroupForm: {},
                DataLength: 0,
                DataIndex: 0,
                isHaveData: [],
                newGroupFormRules: {},
                calendarDate: {},
                userTotalNum: 0,
                userPageIndex: 1,
                userPageSize: 10,
                // pageSize: '',
                newAddLowerErrorMsg: '',
                timeIndex: '',
                shiftTypeIndex: '',
                dataShiftTypeId: '',
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
                if (remainDays > 6) {
                    this.moreSeven = true;
                }
                for (let k = 1; k <= remainDays; k++) {
                    const date = this.calendarDate.nextYear + '-' + (this.calendarDate.nextMonth < 10 ? '0' + this.calendarDate.nextMonth : this.calendarDate.nextMonth) + '-' + (k < 10 ? '0' + k : k);
                    const time = k;
                    const obj = {time, date};
                    this.dateData.push(obj);
                }
                // debugger
            },
            lastMonthData () {
                this.calendarDate.year = this.calendarDate.lastYear;
                this.calendarDate.month = this.calendarDate.lastMonth;
                this.calendarDate.Days = this.calendarDate.lastDays;
                this.dateData = [];
                this.moreSeven = false;
                this.getDays();
                this.getScheduleList();
            },
            nextMonthData () {
                this.calendarDate.year = this.calendarDate.nextYear;
                this.calendarDate.month = this.calendarDate.nextMonth;
                this.calendarDate.Days = this.calendarDate.nextDays;
                this.dateData = [];
                this.moreSeven = false;
                this.getDays();
                this.getScheduleList();
            },
            // 调用车间
            // getWorkshop () {
            //     const _this = this;
            //     this.$fetch('dept/workshops').then((res) => {
            //         let content = res.data;
            //         if (content.status === 200) {
            //             _this.workShopList = (content.res || []).map(item => {
            //                 return {
            //                     id: item.id,
            //                     name: item.name
            //                 };
            //             });
            //             console.log('调取车间列表');
            //         }
            //     });
            //     console.log('调用车间');
            // },
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
                if (this.currentWorkshop === '') {
                    this.warnShow = true;
                    this.warnMessage = '请选择车间';
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
                            this.isGetGroups = false;
                            this.shiftGroupData = [];
                            this.isOnce = false;
                            this.isNotData = true;
                            this.isHaveData = [];
                            this.getShift();
                        } else {
                            // 当前车间下还没有设置班制
                            this.newAddLowerErrorMsg = '当前车间下还没有设置班制';
                        }
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
                this.dataShiftTypeId = date.shiftTypeId;
                this.currentShiftType = date.shiftTypeName;
                // this.isOnceGroupSure = true;
                // 班次班组数据
                // this.isHaveData = [];
                // setTimeout(() => {
                this.isHaveData = date.shifts;
                // }, 0)
                this.shiftGroupData = date.shifts;
                this.DataLength = date.shifts.length;
                this.DataIndex = 0;
                // debugger
                this.isGetGroups = true;
                this.isOnce = true;
                this.loadingOnce = true;
                this.isNotData = false;
                // debugger
                this.getShiftGroup();
                this.getShift();
            },
            changeShiftRow (params) {
                console.log(params);
            },
            // 改变班制
            ChangeShift (value) {
                // debugger
                this.shiftTypeIndex = value;
                this.currentShiftType = this.shiftList.find(item => item.value === value).label;
                this.getShift();
            },
            // 得到当前班组数据
            getCurrentShiftData (data) {
                const _this = this;
                // 转化value为group班组
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
                // if (this.isGetGroups) {
                //     if (data.length === 0) {
                //         return false;
                //     }
                // }
                // debugger
                // this.DataIndex++;
                // if (this.isOnceGroupSure) {
                //     if (this.DataIndex < this.DataLength) {
                //         if (this.DataIndex === this.DataLength) {
                //             this.isOnceGroupSure = false;
                //         }
                //         return false;
                //     }
                // }
                // 阻止循环
                if (this.isOnceGroupSure) {
                    this.isOnceGroupSure = false;
                    return false;
                }
                // 这里就是原本没有数据，就是添加排班
                // debugger
                if (this.isNotData) {
                    // 两种情况，一种是原本没有数据，增加的过程中有一部分数据
                    if (this.shiftGroupData.length === 0) {
                        this.shiftGroupData.push({
                            shiftId: this.shiftId,
                            shiftName: this.shiftName,
                            groups: data
                        });
                    } else {
                        if (this.shiftGroupData.map(x => x.shiftId).includes(this.shiftId)) {
                            this.shiftGroupData.find(x => x.shiftId === this.shiftId).groups = data;
                        } else {
                            this.shiftGroupData.push({
                                shiftId: this.shiftId,
                                shiftName: this.shiftName,
                                groups: data
                            });
                        }
                    }
                } else {
                    // debugger
                    // 这里就是有数据的情况下
                    // this.shiftGroupData = this.isHaveData; // 获取这个数据，但是只可以获取一次，放在点击班制中
                    // 那就直接判断，如果改变班制的话，就需要直接加入数据
                    if (this.shiftGroupData.map(x => x.shiftId).includes(this.shiftId)) {
                        this.shiftGroupData.find(x => x.shiftId === this.shiftId).groups = data;
                    } else {
                        this.shiftGroupData.push({
                            shiftId: this.shiftId,
                            shiftName: this.shiftName,
                            groups: data
                        });
                    }
                    this.isOnceGroupSure = true;
                }
                // debugger
            },
            submitSchedule () {
                this.currentShiftData = [];
                for (let k of this.shiftGroupData) {
                    if (this.shiftData.map(x => x.shiftId).includes(k.shiftId)) {
                        this.currentShiftData.push(k);
                    }
                }
                // debugger
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
                this.$fetch('dict/list?parentcode=shift_type').then((res) => {
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
                        // debugger
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
            },
            // onConfirmWarn () {
            //     this.warnShow = false;
            //     console.log('提示框的确认按钮');
            // },
            iconCancel () {
                // debugger
                this.shiftShow = false;
            },
            getUserWorkshop () {
                const _this = this;
                this.$fetch('user/workshop').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // debugger
                        if (content.res === null) {
                            _this.currentWorkshopId = _this.workShopList[0].id;
                            _this.formItem.shift = _this.workShopList[0].id;
                            _this.currentWorkshop = _this.workShopList[0].name;
                            this.getScheduleList();
                            this.getShiftGroup();
                        } else {
                            _this.formItem.shift = content.res.id;
                            _this.currentWorkshopId = content.res.id;
                            _this.currentWorkshop = content.res.name;
                            this.getScheduleList();
                            this.getShiftGroup();
                        }
                    };
                });
            },
            // 下面的是对班组人员的调整
            // 选择班组，得到班组下面的用户
            getUserByGroup (params) {
                this.$fetch('schedule/user/list', {sgid: params}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
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
                        // console.log('调出成功');
                    }
                });
            },
            addGroupUser () {
                this.GroupUserShow = true;
                // 这里让用户清空，部门清空
                this.newFormValidate.apart = [];
                this.tableSelectUser = [];
                // this.userPageIndex = 1;
                // this.userPageSize = 1;
                this.userTotalNum = 1;
                setTimeout(() => {
                    this.userTotalNum = 0;
                    // this.userPageIndex = 1;
                    // console.log('1');
                }, 0);
                console.log('添加');
            },
            removeGroupUser () {
                this.warnShow = true;
                this.deleteSure = true;
                this.warnMessage = '确认移除？';
                console.log('移除');
            },
            getGroupUser (params, date) {
                // 判断时间上的距离，比如说今天点击的时间是不是在今天之前
                // console.log(params);
                // if (this.currentMonth !== date.split('-')[1]) {
                //     return false;
                // };
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
                this.$post('schedule/user/add?sgid=' + encodeURIComponent(this.GroupId), this.SelectedUser).then((res) => {
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
            onCancelPoint () {
                this.warnShow = false;
            },
            onConfirmPoint () {
                console.log('确认移除');
                // debugger
                if (this.deleteSure) {
                    this.removeLoading = true;
                    this.$post('schedule/user/remove?sgid=' + encodeURIComponent(this.GroupId), this.SelectedGroupUser.map(x => x.userId)).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.warnShow = false;
                            this.removeLoading = false;
                            console.log('移除成功');
                            this.getUserByGroup(this.GroupId);
                        }
                    });
                } else {
                    this.deleteSure = false;
                    this.warnShow = false;
                }
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
                this.$post('schedule/user/post/update?suid=' + encodeURIComponent(this.scheduleUserId) + '&postid=' + encodeURIComponent(this.userPostId)).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.getUserByGroup(this.GroupId);
                        console.log('保存岗位成功');
                    }
                });
            },
            dateClass (date) {
                const isMonth = date.date.split('-')[1];
                const isToday = date.date.split('-')[0] + date.date.split('-')[1] + date.date.split('-')[2];
                const shift = (date.shiftTypeId === (this.shiftList[0] ? this.shiftList[0].value : false));
                return {isMonth, isToday, shift};
            }
        },
        mounted () {
            this.getMonth();
            this.getTime();
            this.getShiftType();
            // this.getWorkshop();
            // this.getUserWorkshop();
            this.getApart();
            this.getPostList();
        },
        beforeCreate () {
            const _this = this;
            this.$fetch('dept/workshops').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    _this.workShopList = content.res;
                    _this.getUserWorkshop();
                    console.log('调取车间列表');
                }
            });
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
        /*background-color: #b3d4fc;*/
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
    .selectHead span:last-child a{
        color: #fff;
        padding-right: 20px;
    }
    .dateDay{
        width: 100%;
        background-color: #eaeaea;
        height: 60px;
    }
    .table_date{
        /*line-height: 0;*/
        font-size: 0;
    }
    li{
        display: inline-block;
        width: 14.285%;
        text-align: center;
        margin:auto 0;
        font-size: 12px;
    }
    .date{
        border: 1px solid #dddee1;
    }
    .date-header{
        height: 60px;
        line-height: 60px;
        border-right: none;
        font-size: 14px;
        color: #495060;
    }
    .date-header:last-child{
        border-right: 1px solid #dddee1;
    }
    .date-body{
        height: 116px;
        padding: 0 5px;
        overflow: hidden;
        border-right: none;
        border-top: none;
        position: relative;
        color: #ff9900;
    }
    .date-body a{
        color: #ff9900;
    }
    .date-body:nth-child(7n + 2){
        color: #19be6b;
    }
    .date-body:nth-child(7n + 2) a{
        color: #19be6b;
    }
    .date-body:nth-child(7n){
        border-right: 1px solid #dddee1;
    }
    .isMoreSeven:nth-child(n+36){
        display: none;
    }
    .shift-type-name{
        text-align: left;
        font-size:14px;
        margin-top: 6px;
        padding-left: 25px;
    }
    .shift-block{
        display: inline-block;width: calc(80% - 4px)
    }
    .isNotMonth .date-day{
        color: #e9e9e9!important;
    }
    .isToday{
        box-shadow: 0px 0px 10px #9b9b9b;
    }
    .date-day{
        display: inline-block;
        width: calc(20%);
        vertical-align:top;
        font-size: 18px;
        font-weight:200;
        line-height: 106px;
        color: #999999;
    }
    /*.isNotMonth a{*/
        /*color: #e9e9e9!important;*/
    /*}*/
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
    .IsNotSet{
        display: inline-block;
        width: calc(80% - 4px);
        line-height: 106px;
        text-align: left
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
    /*.istwice .shiftClass{*/
        /*color: #ff9900!important;*/
    /*}*/
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
    .shiftHeight {
        height: 280px;
    }
</style>

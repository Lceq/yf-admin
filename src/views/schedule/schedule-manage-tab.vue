<template>
    <div>
       <Card>
           <Row>
               <div class="selectWorkShop">
                   <span>选择车间：</span>
                   <Select class="workshop" v-model="workshop" @on-change="ChangeWorkshop">
                       <Option class="workshop-list" v-for="item in workShopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                   </Select>
               </div>
           </Row>
           <Row>
               <div class="selectHead">
                   <span><a @click="lastMonthData">{{lastMonth}}月</a></span>
                   <span>{{currentYearMonth}}</span>
                   <span><a @click="nextMonthData">{{nextMonth}}月</a></span>
               </div>
               <table :loading="tableLoading" class="table" border="0" cellPadding="15px" cellSpacing="0">
                   <thead class="thead">
                       <tr class="dateHeader">
                           <th>日</th>
                           <th>一</th>
                           <th>二</th>
                           <th>三</th>
                           <th>四</th>
                           <th>五</th>
                           <th>六</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr v-for="(data, index) of servenData" :key="index" :class="{isMoreSeven: moreSeven}">
                           <td class="date" v-for="(dateDay, index) of data" :key="index" :class="{isNotMonth: dateClass(dateDay).isMonth !== currentMonth, isToday:dateClass(dateDay).isToday === nowToady}" @dblclick="setShiftType(dateDay)">
                               <div class="date-day"><span>{{dateDay.time}}</span></div>
                               <div class="isNotSet" v-if="!dateClass(dateDay).isShift">
                                   <a @click="shiftTypeSet(dateDay)">日历班制</a><br>
                               </div>
                               <div class="shift-block" :class="{istwice: dateClass(dateDay).shift === true, isThird:  dateClass(dateDay).shift === false}" v-if="!!dateClass(dateDay).isShift">
                                   <a class="shiftType" @click="changeShiftType(dateDay)">{{dateDay.shiftTypeName}}</a>
                                   <p class="shiftClass" v-for="item in dateDay.shifts">
                                       <Icon class="iconStyle" type="record"></Icon>{{item.shiftName}}：
                                           <span class="shiftGroup"><a @click="getGroupUser(et, dateDay.date)" v-for="et in item.groups">{{et.groupName}}</a></span>
                                   </p>
                               </div>
                           </td>
                       </tr>
                   </tbody>
               </table>
           </Row>
           <Modal
                   v-model="shiftShow"
                   :title="'排班'"
                   width="800"
                   :mask-closable="false">
               <Form :label-width="100" :model="newFormValidate" :show-message="false">
                   <Row class="shiftHeight">
                       <Col span="22">
                           <FormItem label="车间:" class="formItemMargin" prop="workshop">
                               <span>{{ newFormValidate.workshopName }}</span><span class="shiftTypeTime">({{ newFormValidate.time }})</span>
                           </FormItem>
                           <FormItem label="班制:" class="formItemMargin" prop="shift">
                               <RadioGroup @on-change="ChangeShift" v-model="newFormValidate.shift">
                                   <Radio v-for="(item, index) in shiftList" :key="index" :label="item.value">{{item.label}}</Radio>
                               </RadioGroup>
                           </FormItem>
                           <Table class="tabClass" border :columns="columnsShift" :data="shiftData"></Table>
                       </Col>
                   </Row>
               </Form>
               <modal-button
                       slot="footer"
                       :WarnMsg="newAddLowerErrorMsg"
                       :loading="scheduleLoading"
                       @cancel="cancelSchedule"
                       @submit="submitSchedule"
               >
               </modal-button>
           </Modal>
           <Modal
                   v-model="GroupShow"
                   width="800"
                   :title=" WhichGroup + '人员'">
               <Row>
                   <div style="padding-bottom: 10px;">
                       <Button @click="addGroupUser" style="smargin-right: 5px;" type="success">添加当班人员</Button>
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
                   width="800">
               <Row>
                   <Col style="display: flex;justify-content: space-between;margin-bottom: 10px;">
                           <div style="display: flex;align-items: center;">
                               <span>部门：</span>
                               <Cascader style="width: 270px;" :change-on-select="true" :data="apartData" @on-change="ChangeGroup" v-model="apart"></Cascader>
                           <!--</div>-->
                          <!--<div style="display: flex;align-items: center;">-->
                              <span style="margin-left: 20px;">人员姓名：</span>
                              <Input @on-change="searchUser(name)" style="display: inline-block; width: 270px;" v-model="name" placeholder="请输入姓名查询" value="newGroupForm.name"></Input>
                          </div>
                       <div style="display: flex;align-items: center;">
                              <Button style="vertical-align: top;margin-left: 20px;" @click="searchTargetUser"  type="success">查询</Button>
                          </div>
                   </Col>
               </Row>
               <Row style="margin-bottom: 20px">
                   <Col>
                       <Table border ref="selection" size="small" @on-selection-change="selectTableUser" height="520" :columns="tableSelectcolumns" :data="tableSelectUser"></Table>
                   </Col>
                   <Row style="margin-top: 10px; text-align: right">
                       <Col>
                           <Page size="small" placement="top" show-sizer show-total :total="userTotalNum" @on-page-size-change="changePageSize" :page-size="userPageSize" @on-change="ChangeUserPage" :page-size-opts="pageSizeOpts" show-elevator></Page>
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
                               <Select @on-change="changePost" v-model="newPostForm.postId" style="width:150px">
                                   <OptionGroup v-for="(pList, index) of postBasicList" :key="index" :label="pList.typeName">
                                       <Option v-for="item in pList.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                   </OptionGroup>
                               </Select>
                           </FormItem>
                       </Col>
                   </Row>
               </Form>
               <modal-button
                       slot="footer"
                       @cancel="onCancelPost"
                       @submit="onConfirmPost"
               >
               </modal-button>
           </Modal>
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
import publicJs from '../public/public-js/publiceJs';
export default {
    name: 'schedule-manage-tab',
    components: {
        modalButton,
        deleteWarning
    },
    data () {
        return {
            pageSizeOpts: publicJs.pageOpts,
            userPageSize: publicJs.pageSize,
            tableLoading: false,
            nowToady: '',
            warnShow: false,
            warnMessage: '',
            removeLoading: false,
            // 车间数组
            name: '',
            workShopList: [],
            workshop: '',
            currentWorkshopId: '',
            // 上个月、下个月、当前年月
            lastMonth: '',
            currentYearMonth: '',
            moreSeven: false,
            nextMonth: '',
            // 时间对象
            calendarDate: {},
            // 获取7*6的数据对象
            servenData: [],
            dateData: [],
            // 这里是排班
            shiftShow: false,
            haveData: [],
            newFormValidate: {},
            shiftList: [],
            columnsShift: [
                {
                    title: '序号',
                    width: 110,
                    sortable: true,
                    key: 'index',
                    render: (h, params) => {
                        return h('div', [
                            h('Span', {
                                props: {}
                            }, params.index + 1)
                        ]);
                    }
                },
                {
                    title: '班次名称',
                    width: 110,
                    sortable: true,
                    key: 'shiftName',
                    render: (h, params) => {
                        return h('div', [
                            h('Span', {
                                props: {}
                            }, params.row.shiftName)
                        ]);
                    }
                },
                {
                    title: '班组',
                    key: 'shift',
                    render: (h, params) => {
                        const _this = this;
                        // params.row.groupsNew = params.row.groups;
                        return h('div', [
                            h('Select', {
                                props: {
                                    value: params.row.groups.map(x => x.groupId),
                                    multiple: true,
                                    filterable: true
                                },
                                on: {
                                    'on-change': (data) => {
                                        _this.haveDefaultData.find(x => x.shiftId === params.row.shiftId).groups = data.map(item => {
                                            return {
                                                groupId: item,
                                                groupName: _this.shiftGroup.find(x => x.groupId === item).groupName
                                            };
                                        });
                                    }
                                },
                                style: {
                                    width: '300'
                                }
                            },
                            _this.shiftGroup.map(item => {
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
            shiftBasicData: [],
            // 按钮
            newAddLowerErrorMsg: '',
            scheduleLoading: false,
            shiftTypeId: '',
            currentShiftId: '',
            defaultData: [],
            // 人员
            GroupShow: false,
            WhichGroup: '',
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
                    key: 'userName'
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
                        const _this = this;
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: (event) => {
                                        _this.newPostForm.userName = params.row.userName;
                                        _this.scheduleUserId = params.row.id;
                                        _this.newPostForm.postId = params.row.postId;
                                        _this.newPostForm.postName = params.row.postName;
                                        _this.setPostModal = true;
                                    }
                                }
                            }, '岗位调整')
                        ]);
                    }
                }
            ],
            tableSelectData: [],
            apartData: [],
            apart: [],
            tableSelectcolumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '姓名',
                    sortable: true,
                    // width: ,
                    key: 'name'
                },
                {
                    title: '所属部门',
                    sortable: true,
                    key: 'deptName'
                },
                {
                    title: '岗位',
                    sortable: true,
                    width: 260,
                    key: 'postName'
                }
            ],
            tableSelectUser: [],
            userTotalNum: 0,
            userPageIndex: 1,
            // userPageSize: 20,
            AddUserLoading: false,
            Searchloading: false,
            GroupUserShow: false,
            setPostModal: false,
            newPostForm: {},
            GroupId: '',
            newPostFormRules: {},
            PostList: [],
            SelectedUser: [],
            userPostId: '',
            scheduleUserId: '',
            deleteSure: false,
            postBasicList: [],
            currentMonth: '',
            defaultShiftId: '',
            ishaveData: false,
            currentTime: '',
            haveLoop: false,
            haveDefaultData: [],
            curApartData: [],
            curDataApart: []
        };
    },
    methods: {
        getCurrentTime () {
            const date = new Date();
            this.calendarDate.year = date.getFullYear(); // 今天哪一年
            this.calendarDate.month = date.getMonth() + 1;// 今天几月份
            this.calendarDate.today = date.getDate();// 今天多少号
            this.calendarDate.weekday = date.getDay();// 今天周几
            // this.calendarDate.days = new Date(this.calendarDate.year, this.calendarDate.month, 0).getDate();// 这个月多少天
            // this.calendarDate.cueMonthFirstDay = new Date(this.calendarDate.year, this.calendarDate.month - 1, 1).getDay();// 这个月第一天礼拜几
            this.nowToady = this.calendarDate.year + '' + (this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month) + '' + (this.calendarDate.today < 10 ? '0' + this.calendarDate.today : this.calendarDate.today);
            this.currentMonth = this.calendarDate.month < 10 ? '0' + this.calendarDate.month : this.calendarDate.month + '';
            this.getLastNextMonth();
        },
        getLastNextMonth () {
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
        getIndexDay () {
            this.calendarDate.monthStart = new Date(this.calendarDate.year, this.calendarDate.month - 1, 1).getDay();// 这个月第一天礼拜几
            // 获取当前年月、上个月、下个月
            this.currentYearMonth = this.calendarDate.year + '年' + this.calendarDate.month + '月';
            this.lastMonth = this.calendarDate.lastMonth;
            this.nextMonth = this.calendarDate.nextMonth;
            // 上个月可以显示几天
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
            } else {
                this.moreSeven = false;
            }
            for (let k = 1; k <= remainDays; k++) {
                const date = this.calendarDate.nextYear + '-' + (this.calendarDate.nextMonth < 10 ? '0' + this.calendarDate.nextMonth : this.calendarDate.nextMonth) + '-' + (k < 10 ? '0' + k : k);
                const time = k;
                const obj = {time, date};
                this.dateData.push(obj);
            }
            for (let j of this.dateData) {
                j.shifts = [];
                j.belongDate = '';
                j.shiftTypeId = '';
                j.shiftTypeName = '';
            }
        },
        lastMonthData () {
            this.servenData = [];
            this.dateData = [];
            this.calendarDate.year = this.calendarDate.lastYear;
            this.calendarDate.month = this.calendarDate.lastMonth;
            this.calendarDate.Days = this.calendarDate.lastDays;
            this.getLastNextMonth();
            this.getScheduleList();
        },
        nextMonthData () {
            this.servenData = [];
            this.dateData = [];
            this.calendarDate.year = this.calendarDate.nextYear;
            this.calendarDate.month = this.calendarDate.nextMonth;
            this.calendarDate.Days = this.calendarDate.nextDays;
            this.getLastNextMonth();
            this.getScheduleList();
        },
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    if (content.res === null) {
                        _this.currentWorkshopId = _this.workShopList[0].id;
                        _this.workshop = _this.workShopList[0].id;
                        _this.currentWorkshop = _this.workShopList[0].name;
                        this.getScheduleList();
                        this.getShiftGroup();
                    } else {
                        _this.workshop = content.res.id;
                        _this.currentWorkshopId = content.res.id;
                        _this.currentWorkshop = content.res.name;
                        this.getScheduleList();
                        this.getShiftGroup();
                    }
                }
                ;
            });
        },
        ChangeWorkshop (val) {
            this.currentWorkshopId = val;
            this.servenData = [];
            this.dateData = [];
            this.getLastNextMonth();
            this.getScheduleList();
            // 班组信息
            this.getShiftGroup();
        },
        getScheduleList () {
            console.log('获取排班管理信息');
            const _this = this;
            let params = {};
            if (this.ishaveData) {
                params = {
                    deptid: this.currentWorkshopId,
                    from: this.currentTime,
                    to: this.currentTime
                };
            } else {
                params = {
                    deptid: this.currentWorkshopId,
                    from: this.dateData[0].date,
                    to: this.dateData[41].date
                };
            }
            this.$fetch('schedule/list', params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    if (_this.ishaveData) {
                        _this.shiftTypeId = content.res[0].shiftTypeId;
                        for (let d of content.res[0].shifts) {
                            this.haveDefaultData.find(x => x.shiftId === d.shiftId).groups = d.groups.map(x => {
                                return {
                                    groupId: x.groupId,
                                    groupName: x.groupName
                                };
                            });
                        }
                        _this.shiftData = content.res[0].shifts;
                        _this.defaultData = _this.haveDefaultData;
                        _this.newFormValidate.workshopId = _this.currentWorkshopId;
                        _this.newFormValidate.workshopName = _this.workShopList.find(x => x.id === _this.currentWorkshopId).name;
                        _this.newFormValidate.time = content.res[0].belongDate;
                        _this.shiftTypeId = content.res[0].shiftTypeId;
                        _this.newFormValidate.shift = content.res[0].shiftTypeId;
                    } else {
                        var dataConversion = _this.dateData;
                        for (let k of dataConversion) {
                            if (content.res.map(x => x.belongDate).includes(k.date)) {
                                dataConversion.find(x => x.date === k.date).shifts = content.res.find(x => x.belongDate === k.date).shifts;
                                dataConversion.find(x => x.date === k.date).belongDate = content.res.find(x => x.belongDate === k.date).belongDate;
                                dataConversion.find(x => x.date === k.date).shiftTypeId = content.res.find(x => x.belongDate === k.date).shiftTypeId;
                                dataConversion.find(x => x.date === k.date).shiftTypeName = content.res.find(x => x.belongDate === k.date).shiftTypeName;
                            }
                        }
                        var Sdata = [];
                        _this.servenData = [];
                        for (let d = 0; d < dataConversion.length; d++) {
                            // debugger
                            Sdata.push(dataConversion[d]);
                            if (d % 7 === 6) {
                                // m++;
                                _this.servenData.push(Sdata);
                                Sdata = [];
                            }
                        }
                        console.log('调取成功');
                    }
                };
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
            this.$fetch('shift/list', {typeid: this.shiftTypeId === '' ? this.shiftList[0].value : this.shiftTypeId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.shiftData = (content.res || []).map(item => {
                        return {
                            shiftId: item.id,
                            shiftName: item.name,
                            groups: []
                        };
                    });
                    _this.shiftShow = true;
                    _this.haveDefaultData = [];
                    _this.haveDefaultData = _this.shiftData;
                    // debugger
                    if (_this.ishaveData) {
                        if (_this.shiftTypeId === _this.defaultShiftId) {
                            _this.getScheduleList();
                        }
                    }
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
                }
            });
        },
        haveNoGroups (data) {
            var result = false;
            for (let k of data) {
                if (k.groups.length !== 0) {
                    result = true;
                }
            }
            return result;
        },
        // 进行判断是都有数据，然后是否进行排班
        dateClass (date) {
            const isShift = date.shifts.length === 0 ? false : this.haveNoGroups(date.shifts);
            const isMonth = date.date.split('-')[1];
            const isToday = date.date.split('-')[0] + date.date.split('-')[1] + date.date.split('-')[2];
            const shift = (date.shiftTypeId === (this.shiftList[0] ? this.shiftList[0].value : false));
            return {isShift, isMonth, isToday, shift};
        },
        setShiftType (dateDay) {
            // console.log(dateDay)
            this.shiftData = [];
            if (dateDay.shifts.length === 0) {
                this.shiftTypeSet(dateDay);
            } else {
                this.changeShiftType(dateDay);
            }
        },
        // 进行班制设置 //点击日历班制
        shiftTypeSet (dateDay) {
            this.haveDefaultData = [];
            this.defaultData = [];
            this.ishaveData = false;
            this.defaultShiftId = '';
            // this.haveData = [];
            this.newFormValidate.workshopId = this.currentWorkshopId;
            this.newFormValidate.workshopName = this.workShopList.find(x => x.id === this.currentWorkshopId).name;
            this.newFormValidate.time = dateDay.date;
            this.newFormValidate.shift = this.shiftList[0].value;
            this.shiftTypeId = this.shiftList[0].value;
            this.getShift();
        },
        // 点击班制（两班制，三班制)
        changeShiftType (dateDay) {
            this.haveLoop = true;
            this.ishaveData = true;
            this.currentTime = dateDay.date;
            this.shiftTypeId = dateDay.shiftTypeId;
            this.defaultShiftId = dateDay.shiftTypeId;
            this.getShift();
            // debugger
            // this.getScheduleList();
            // 这里就是有数据的情况下,
            // this.shiftShow = true;
        },
        // 点击班组
        getGroupUser (params, date) {
            this.GroupId = params.id;
            this.WhichGroup = params.groupName;
            this.curDataApart = [];
            this.getGroupData(params.groupId);
            this.getUserByGroup(params.id);
        },
        getGroupData (id) {
            // console.log();/**/
            // console.log(this.groupId);
            if (this.curApartData.find(x => x.id === id).parentId === 1) {
                // this.curDataApart.push(this.curApartData.find(x => x.id === id).id);
                return this.curDataApart;
            } else {
                this.curDataApart.push(this.curApartData.find(x => x.id === id).parentId);
                this.getGroupData(this.curApartData.find(x => x.id === id).parentId);
            }
        },
        getUserByGroup (params) {
            this.$fetch('schedule/user/list', {sgid: params}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.GroupShow = true;
                    this.tableSelectData = content.res;
                }
            });
        },
        // 这里是排班的方法
        // 改变班制, 单选， 弹出模板里的班制
        ChangeShift (val) {
            // debugger
            this.newFormValidate.shift = val;
            this.shiftTypeId = val;
            this.getShift();
            // debugger
        },
        cancelSchedule () {
            this.shiftShow = false;
            // this.haveData = [];
        },
        // 保存人员数组
        submitSchedule () {
            // console.log(this.shiftData);
            // debugger
            let params = {
                deptId: this.newFormValidate.workshopId,
                deptName: this.newFormValidate.workshopName,
                shiftTypeName: this.shiftTypeId === '' ? this.shiftList[0].label : this.shiftList.find(x => x.value === this.shiftTypeId).label,
                shiftTypeId: this.shiftTypeId === '' ? this.shiftList[0].value : this.shiftTypeId,
                belongDate: this.newFormValidate.time,
                shifts: this.haveDefaultData
            };
            // debugger
            this.scheduleLoading = true;
            this.$post('schedule/save', params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.scheduleLoading = false;
                    this.ishaveData = false;
                    this.getScheduleList();
                    this.shiftShow = false;
                    this.$Message.success('保存成功');
                    console.log('保存成功');
                }
            });
        },
        // r人员
        addGroupUser () {
            console.log(this.curDataApart);

            this.newFormValidate.apart = this.curDataApart;
            this.tableSelectUser = [];
            this.userTotalNum = 1;
            this.Searchloading = false;
            setTimeout(() => {
                this.userTotalNum = 0;
            }, 0);
            this.GroupUserShow = true;
        },
        removeGroupUser () {
            this.deleteSure = true;
            this.warnMessage = '确认移除？';
            this.warnShow = true;
        },
        getUserNameForPost () {

        },
        selectGroupUser (params) {
            console.log(params);
            this.SelectedGroupUser = params;
        },
        searchUser (name) {
            this.searchName = name;
        },
        searchTargetUser () {
            console.log('查询');
            if (this.GroupIndex === {}) {
                this.newAddLowerErrorMsg = '请先选择部门';
            } else {
                this.getApartUserFrom();
            }
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
                    // debugger
                    if (_this.isUserTotal) {
                        const params = {
                            deptid: _this.GroupIndex,
                            pageindex: _this.userPageIndex,
                            pagesize: _this.userPageSize,
                            name: _this.searchName
                        };
                        this.isUserTotal = false;
                        this.getApartUser(params);
                    } else {
                        _this.userTotalNum = content.count;
                        // _this.tableSelectUser = content.res;
                        _this.tableSelectUser = content.res.map(x => {
                            x._checked = false;
                            x._disabled = false;
                            return x;
                        });
                        // debugger
                        for (let tu of _this.tableSelectUser) {
                            if (_this.tableSelectData.map(x => x.userId).includes(tu.id)) {
                                tu._checked = true;
                                tu._disabled = true;
                            }
                        }
                        // debugger
                    }
                    console.log('获取员工数据成功');
                }
            });
        },
        selectTableUser (params) {
            console.log('选择用户');
            this.SelectedUser = (params).map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    postId: item.postId,
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
        changePageSize (index) {
            this.userPageSize = index;
            this.getApartUserFrom();
        },
        ChangeGroup (params) {
            this.GroupIndex = params.reverse()[0];
            this.userTotalNum = 1;

            setTimeout(() => {
                this.userTotalNum = 1;
            }, 0);
            this.getApartUserFrom();
        },
        newAddGroupCancel () {
            this.GroupUserShow = false;
        },
        submitAddGroup () {
            this.AddUserLoading = true;
            this.$post('schedule/user/add?sgid=' + encodeURIComponent(this.GroupId), this.SelectedUser).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.AddUserLoading = false;
                    this.GroupUserShow = false;
                    this.getUserByGroup(this.GroupId);
                    this.$Message.success('保存成功');
                    console.log('添加成功');
                }
            });
            console.log('确认添加');
        },
        // 获取所有部门
        getApart () {
            this.$fetch(api.getOrgList()).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.curApartData = content.res.map(item => {
                        return {
                            value: item.id,
                            label: item.name,
                            id: item.id,
                            parentId: item.parentId,
                            depth: item.depth
                        };
                    });
                    this.getApartData(this.curApartData);
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
            this.apartData = data.find(x => x.parentId === 0).children;
        },
        changePost (params) {
            console.log(params);
            this.userPostId = params;
        },
        onConfirmPost () {
            const _this = this;
            this.setPostModal = false;
            this.$post('schedule/user/post/update?suid=' + encodeURIComponent(this.scheduleUserId) + '&postid=' + encodeURIComponent(this.userPostId)).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功');
                    _this.getUserByGroup(this.GroupId);
                    console.log('保存岗位成功');
                }
            });
        },
        // 取消设置岗位
        onCancelPost () {
            this.setPostModal = false;
            console.log('取消设置岗位');
        },
        // 获取岗位
        getPostList () {
            const _this = this;
            this.$fetch('post/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取成功');
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
        onCancelPoint () {
            this.warnShow = false;
        },
        onConfirmPoint () {
            console.log('确认移除');
            if (this.deleteSure) {
                this.deleteSure = false;
                this.removeLoading = true;
                this.$post('schedule/user/remove?sgid=' + encodeURIComponent(this.GroupId), this.SelectedGroupUser.map(x => x.userId)).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.warnShow = false;
                        this.removeLoading = false;
                        this.$Message.success('移除成功');
                        console.log('移除成功');
                        this.getUserByGroup(this.GroupId);
                    }
                });
            } else {
                this.deleteSure = false;
                this.warnShow = false;
            }
        }
    },
    mounted () {
        this.getPostList();
        this.getCurrentTime();
        // this.getWorkshop();
        this.getApart();
        this.getShiftType();
        // this.getScheduleList();
    },
    beforeCreate () {
        const _this = this;
        this.$fetch('dept/workshops').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                _this.workShopList = content.res;
                _this.getUserWorkshop();
                console.log('调取车间列表');
            }
        });
        // this.getShiftType();
    }
};
</script>

<style scoped>
.selectWorkShop{
    margin-bottom: 10px;
}
.workshop{
    display: inline-block;
    width: 200px;
}
.selectHead{
    display: inline-block;
    width:100%;
    background-color: #2d8cf0;
    font-size: 0;
    position: relative;
    top:1px;
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
    /*日历头部，周期*/
.table{
    width: 100%;
    border-color: #9b9b9b;
    font-size: 0px;
    border-top:1px solid #dddee1;
    border-left:1px solid #dddee1;
}
.table td, th{
    border-right:1px solid #dddee1;
    border-bottom:1px solid #dddee1;
}
.thead{
    width: 100%;
}
.dateHeader{
    width: 100%;
    line-height: 60px;
    font-size: 14px;
    color: #495060;
}
.dateHeader th{
    width: 14.28%;
    height: 60px;
    font-size: 14px;
    line-height: 60px;
    background: #eaeaea;
}
.date {
    padding: 5px;
    height: 76px;
}
.isMoreSeven:last-child{
    display: none;
}
.date-day{
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    width: 30px;
    text-align: center;
    color: #999999;
}
.isNotMonth .date-day{
    color: #e9e9e9!important;
}
.isNotSet {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 30px);
    font-size: 16px;
    text-align: center;
    margin-left: -10px;
}
.isNotSet a {
    color: #e9e9e9!important;
}
.iconStyle {
    width: 18px;
    line-height: 20px;
    font-size: 12px;
    vertical-align: top;
}
.shift-block{
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    width: calc(100% - 30px);
}
.shiftType{
    font-size:14px;
    margin: 10px 18px 0;
}
.shiftClass{
    vertical-align: top;
}
.shiftGroup {
    vertical-align: top;
    line-height: 20px;
    width: calc(100% - 80px);
    margin-right: 5px;
    display: inline-block;
}
.shiftGroup a{
    margin-right: 5px;
}
.shiftTypeTime{
    margin-left: 10px;
}
.shiftHeight {
    height: 270px;
}
.tabClass{
    margin-left: 60px;
}
.isToday{
    box-shadow: 0px 0px 10px #9b9b9b;
}
.istwice{
    color: #ff9900!important;
}
.istwice .shiftClass .shiftGroup a{
    color: #ff9900!important;
}
.istwice .shiftType{
    color: #ff9900!important;
}
.isThird{
    color: #19be6b!important;
}
.isThird .shiftClass .shiftGroup a{
    color: #19be6b!important;
}
.isThird .shiftType{
    color: #19be6b!important;
}
/*.isMoreServen:nth-child(n+36){*/
    /*display: none!important;*/
    /*background-color: #2c3e50;*/
/*!*}*!*/
/*isMoreServen:last-child () {*/
    /*display: none;;*/
/*}*/
/*.isMoreServen{*/
    /*background-color: #9b9b9b;*/
/*}*/
</style>

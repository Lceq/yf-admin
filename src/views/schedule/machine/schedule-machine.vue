<template>
    <div>
        <Card>
            <Row class="endFlex" id="selectedHeight">
                <Col>
                    <DatePicker class="formEachStyle" @on-change="changeTime" :value="Today" type="date" placeholder="请选择时间..."></DatePicker>
                    <Select class="textLeft formEachStyle" @on-change="changeWorkShop" v-model="curScheduleMachineWorkShopId" placeholder="请选择车间...">
                        <Option v-for="item in ScheduleMachineWorkShopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select class="textLeft formEachStyle" v-model="curShift" clearable placeholder="请选择班次...">
                        <Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select class="textLeft formEachStyle" v-model="curShiftGroup" clearable placeholder="请选择班组...">
                        <Option v-for="item in shiftGroup" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select class="formEachStyle textLeft" placeholder="请选择岗位..." clearable v-model="curPost">
                        <OptionGroup v-for="(pList, index) of postBasicList" :key="index" :label="pList.typeName">
                            <Option v-for="item in pList.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </OptionGroup>
                    </Select>
                    <Input clearable class="formEachStyle" v-model="curName" placeholder="请输入员工姓名" />
                    <Button icon="ios-search" type="primary" class="marginBottom" @click="searchUserName">搜索</Button>
                </Col>
            </Row>
            <Row class="marginBottom">
                <Col>
                    <Table border ref="selection" :height="tableHeight" :loading="scheduleMachineLoading" size="small" :columns="scheduleMachineColumns" :data="scheduleMachineData"></Table>
                </Col>
            </Row>
            <Row class="textRight">
                <Col>
                    <page show-elevator show-sizer show-total :page-size-opts="scheduleMachineOpts" :total="scheduleMachineTotal" :page-size="scheduleMachinePageSize" :placement="pageDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize"></page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="userMachineShow"
            :title="'机台分配'"
            :loading="userMachineLoading"
            :width="800"
            @submit="userMachineSubmit"
            @cancel="userMachineCancel"
        >
            <div slot="content">
                <div class="parentFlexBetween">
                    <div>
                        <Select
                                class="formMachine"
                                placeholder="开始机台..."
                                v-model="startMachineCode"
                                filterable
                                clearable
                                remote
                                :remote-method="remoteMethodStartMachine"
                                :loading="startMachineCodeLoading">
                            <Option v-for="(option, index) in startMachineData" :value="option.machineCode" :key="index">{{option.machineCode}}</Option>
                        </Select>
                        <Select
                                class="formMachine"
                                placeholder="结束机台..."
                                v-model="endMachineCode"
                                filterable
                                clearable
                                remote
                                :remote-method="remoteMethodEndMachine"
                                :loading="endMachineCodeLoading">
                            <Option v-for="(option, index) in endMachineData" :value="option.machineCode" :key="index">{{option.machineCode}}</Option>
                        </Select>
                        <Button @click="submitBetweenMachine" type="primary">确认机台</Button>
                    </div>
                    <div class="marginBottom textRight">
                        <div class="formMachine" ><Input v-model="machineCode" @on-change="changeMachineCode" clearable placeholder="请输入设备编码" /></div>
                        <div class="formMachine" ><Input v-model="machineName" @on-change="changeMachineName" clearable placeholder="请输入设备名称" /></div>
                        <div class="formMachine" ><Input v-model="machineProcess" @on-change="changeMachineProcess" clearable placeholder="请输入工序" /></div>
                    </div>
                </div>
                <Table border ref="selection" size="small" @on-select="selectMachine" @on-select-cancel="selectCancelMachine" @on-selection-change="selectAllMachine" :row-class-name="rowClassName" :columns="userMachineColumns" :data="userMachineData" height="450"></Table>
            </div>
        </modal>
        <modal
            :isShow="postShow"
            :title="'人员替岗'"
            :WarnMsg="userPostMsg"
            :postLoading="postLoading"
            @cancel="cancelPost"
            @submit="submitPost"
        >
            <div slot="content">
                <Row>
                    <Col>
                        <span class="spanWidth">当班岗位：</span><span>{{curPostDuty}}</span><br>
                        <span class="spanWidth">原当班人员：</span> <Input :value="curDutyUser" readonly class="fromWidth" placeholder="请输入员工姓名" /><br>
                        <span class="spanWidth">现当班人员：</span>
                        <Select style="display: inline-block;width: 150px"
                                placeholder="请搜索员工..."
                                v-model="nowDutyUser"
                                filterable
                                clearable
                                remote
                                :remote-method="remoteMethod1"
                                :loading="loadingUser">
                            <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.nameCode}}</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
        </modal>
    </div>
</template>
<script>
import modal from '../../public/modal';
import publicJs from '../../../libs/common';
export default {
    components: {
        modal
    },
    data () {
        return {
            curScheduleMachineWorkShopId: '',
            ScheduleMachineWorkShopList: [],
            curName: '',
            curTime: '',
            curShift: '',
            curShiftGroup: '',
            curPost: '',
            tableHeight: '',
            shiftList: [],
            shiftGroup: [],
            postBasicList: [],
            scheduleChangeUserId: '',
            scheduleMachineLoading: false,
            scheduleMachineColumns: [
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'left',
                    minWidth: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.isWatcher === true ? false : 'disabled'
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        this.AllSelectedMachineData = [];
                                        this.scheduleUserId = params.row.id;
                                        this.curShiftId = params.row.shiftId;
                                        this.curProcessId = params.row.processId === 0 ? '' : params.row.processId;
                                        this.machineCode = '';
                                        this.machineName = '';
                                        this.machineProcess = '';
                                        this.startMachineCode = '';
                                        this.endMachineCode = '';
                                        this.getWorkshopMachine();
                                    }
                                }
                            }, '机台分配'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.userPostMsg = '';
                                        this.nowDutyUser = '';
                                        this.scheduleChangeUserId = params.row.id;
                                        this.curPostDuty = params.row.postName;
                                        this.curDutyUser = params.row.userName + '(' + this.AllUserData.find(x => x.id === params.row.userId).code + ')';
                                        this.postShow = true;
                                    }
                                }
                            }, '人员替岗')
                        ]);
                    }
                },
                {
                    title: '机台',
                    sortable: true,
                    minWidth: 300,
                    fixed: 'left',
                    key: 'machines'
                },
                {
                    title: '班次',
                    minWidth: 80,
                    fixed: 'left',
                    key: 'shiftName'
                },
                {
                    title: '员工姓名',
                    minWidth: 120,
                    sortable: true,
                    fixed: 'left',
                    align: 'center',
                    key: 'userName'
                },
                {
                    title: '日期',
                    minWidth: 100,
                    align: 'left',
                    sortable: true,
                    key: 'belongDate'
                },
                {
                    title: '当前车间',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'deptName'
                },
                {
                    title: '班组',
                    minWidth: 120,
                    sortable: true,
                    align: 'left',
                    key: 'groupName'
                },
                {
                    title: '当班岗位',
                    minWidth: 120,
                    align: 'left',
                    sortable: true,
                    key: 'postName'
                },
                {
                    title: '所属工序',
                    minWidth: 120,
                    sortable: true,
                    align: 'center',
                    key: 'processName'
                }
            ],
            AllMachineData: [],
            AllSelectedMachineData: [],
            curShiftId: '',
            scheduleUserId: '',
            curProcessId: '',
            scheduleMachineData: [],
            scheduleMachineTotal: 0,
            scheduleMachinePageSize: publicJs.pageSize,
            scheduleMachinePageIndex: 1,
            pageDirect: publicJs.pageUp,
            scheduleMachineOpts: publicJs.pageOpts,
            userMachineShow: false,
            userMachineTitle: '',
            value: '',
            machineCode: '',
            machineName: '',
            machineProcess: '',
            displayState1: 'none',
            displayState2: 'none',
            displayState3: 'none',
            placeholderTitle: '',
            leftPosition: '',
            userMachineLoading: false,
            userMachineColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '设备编码',
                    key: 'code',
                    sortable: true
                    // renderHeader: (h, params) => {
                    //     const _this = this;
                    //     return h('Span', {}, [
                    //         h('Span', {}, '设备名称'),
                    //         h('Icon', {
                    //             on: {
                    //                 click: () => {
                    //                     // debugger
                    //                     this.machineCode = '';
                    //                     this.machineName = '';
                    //                     this.machineProcess = '';
                    //                     this.displayState2 = 'none';
                    //                     this.displayState3 = 'none';
                    //                     if (this.displayState1 === 'none') {
                    //                         _this.displayState1 = 'block';
                    //                     } else {
                    //                         _this.displayState1 = 'none';
                    //                     }
                    //                 }
                    //             },
                    //             props: {
                    //                 type: 'ios-funnel-outline',
                    //                 size: 14
                    //             }
                    //         })
                    //     ]);
                    // }
                },
                {
                    title: '设备名称',
                    key: 'name',
                    sortable: true
                    // renderHeader: (h, params) => {
                    //     const _this = this;
                    //     return h('Span', {}, [
                    //         h('Span', {}, '设备名称'),
                    //         h('Icon', {
                    //             on: {
                    //                 click: () => {
                    //                     this.machineCode = '';
                    //                     this.machineName = '';
                    //                     this.machineProcess = '';
                    //                     this.displayState1 = 'none';
                    //                     this.displayState3 = 'none';
                    //                     if (this.displayState2 === 'none') {
                    //                         _this.displayState2 = 'block';
                    //                     } else {
                    //                         _this.displayState2 = 'none';
                    //                     }
                    //                 }
                    //             },
                    //             props: {
                    //                 type: 'ios-funnel-outline',
                    //                 size: 14
                    //             }
                    //         })
                    //     ]);
                    // }
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    sortable: true
                    // renderHeader: (h, params) => {
                    //     const _this = this;
                    //     return h('Span', {}, [
                    //         h('Span', {}, '所属工序'),
                    //         h('Icon', {
                    //             on: {
                    //                 click: () => {
                    //                     this.machineCode = '';
                    //                     this.machineName = '';
                    //                     this.machineProcess = '';
                    //                     this.displayState1 = 'none';
                    //                     this.displayState2 = 'none';
                    //                     if (this.displayState3 === 'none') {
                    //                         _this.displayState3 = 'block';
                    //                     } else {
                    //                         _this.displayState3 = 'none';
                    //                     }
                    //                 }
                    //             },
                    //             props: {
                    //                 type: 'ios-funnel-outline',
                    //                 size: 14
                    //             }
                    //         })
                    //     ]);
                    // }
                }
            ],
            userMachineData: [],
            visible: true,
            postShow: false,
            postLoading: false,
            curPostModalName: '',
            curPostDuty: '',
            curDutyUser: '',
            nowDutyUser: '',
            loadingUser: false,
            shiftTypeId: '',
            dateTime: '',
            options1: [],
            userPostMsg: '',
            startMachineCode: '',
            endMachineCode: '',
            startMachineCodeLoading: false,
            endMachineCodeLoading: false,
            startMachineData: [],
            endMachineData: []
        };
    },
    methods: {
        // 开始机台，远程搜索
        remoteMethodStartMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.startMachineCodeLoading = true;
                setTimeout(() => {
                    _this.startMachineCodeLoading = false;
                    const list = _this.userMachineData.map(item => {
                        return {
                            machineCode: item.code
                        };
                    });
                    _this.startMachineData = list.filter(item => item.machineCode.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                _this.startMachineData = [];
            }
        },
        // 结束机台，远程搜索
        remoteMethodEndMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.endMachineCodeLoading = true;
                setTimeout(() => {
                    _this.endMachineCodeLoading = false;
                    const list = _this.userMachineData.map(item => {
                        return {
                            machineCode: item.code
                        };
                    });
                    _this.endMachineData = list.filter(item => item.machineCode.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                _this.endMachineData = [];
            }
        },
        submitBetweenMachine () {
            // debugger
            // console.log(this.startMachineCode);
            // console.log(this.endMachineCode);
            // console.log(this.AllMachineData);
            // console.log(this.AllSelectedMachineData);
            if (this.startMachineCode === '' || this.startMachineCode === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请输入开始机台号</p>'
                });
                return false;
            }
            if (this.endMachineCode === '' || this.endMachineCode === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请输入结束机台号</p>'
                });
                return false;
            }
            let isCheck = false;
            for (let i of this.AllMachineData) {
                if (i.code === this.startMachineCode) {
                    isCheck = true;
                }
                if (isCheck) {
                    i._checked = true;
                }
                if (i.code === this.endMachineCode) {
                    isCheck = false;
                }
            }
            // this.AllSelectedMachineData = this.AllMachineData.filter(x => x._checked === true);
            // console.log(this.userMachineData);
        },
        // 远程搜索
        remoteMethod1 (query) {
            const _this = this;
            if (query !== '') {
                this.loadingUser = true;
                setTimeout(() => {
                    this.loadingUser = false;
                    const list = _this.AllUserData.map(item => {
                        return {
                            id: item.id + '-' + item.name,
                            nameCode: item.name + '(' + item.code + ')'
                        };
                    });
                    _this.options1 = list.filter(item => item.nameCode.indexOf(query) > -1);
                }, 200);
            } else {
                _this.options1 = [];
            }
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.curScheduleMachineWorkShopId = _this.ScheduleMachineWorkShopList[0].id;
                    } else {
                        _this.curScheduleMachineWorkShopId = content.res.id;
                    }
                    this.curTime = this.Today;
                    // 当前班次
                    this.getShiftType();
                    // 当前班组
                    this.getShiftGroup();
                    this.getScheduleUserMachine();
                };
            });
        },
        // 改变车间
        changeWorkShop (val) {
            this.curScheduleMachineWorkShopId = val;
            this.getShiftGroup();
            // 当前班次
            this.getShiftType();
        },
        // 获取车间下的班制
        getShiftType () {
            const _this = this;
            // debugger
            this.dateTime = this.curTime + ' 08:00:00';
            this.$fetch('schedule/current/schedule?now=' + this.dateTime, {
                deptid: this.curScheduleMachineWorkShopId
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.scheduleMachineData = [];
                        _this.scheduleMachineTotal = 0;
                        return false;
                    }
                    _this.shiftTypeId = content.res.shiftTypeId;
                    // _this.shiftList = content.res;
                    _this.getShift();
                }
            });
        },
        // 获取班次
        getShift () {
            this.$fetch('shift/list', {typeid: this.shiftTypeId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftList = content.res;
                }
            });
        },
        // 获取车间下的班组信息
        getShiftGroup () {
            // console.log('获取车间下的班组信息');
            const _this = this;
            this.$fetch('dept/groups?parentid=' + this.curScheduleMachineWorkShopId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.shiftGroup = content.res;
                }
            });
        },
        // 获取岗位
        getPostList () {
            const _this = this;
            this.$fetch('post/list').then((res) => {
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
        // 改变时间
        changeTime (val) {
            this.curTime = val;
            // 当前班次
            this.getShiftType();
        },
        // 搜索按钮
        searchUserName () {
            this.scheduleMachinePageIndex = 1;
            setTimeout(() => {
                this.scheduleMachineTotal = 1;
            }, 0);
            this.getScheduleUserMachine();
        },
        // 获取table数据
        getScheduleUserMachine () {
            const _this = this;
            this.scheduleMachineLoading = true;
            this.$fetch('schedule/user/list/machine?belongdate=' + this.curTime, {
                pageindex: this.scheduleMachinePageIndex,
                pagesize: this.scheduleMachinePageSize,
                deptid: this.curScheduleMachineWorkShopId,
                groupid: this.curShiftGroup,
                shiftid: this.curShift,
                postid: this.curPost,
                username: this.curName.trim()
            }).then(res => {
                let content = res.data;
                _this.scheduleMachineLoading = false;
                if (content.status === 200) {
                    _this.scheduleMachineTotal = content.count;
                    _this.scheduleMachineData = content.res;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 改变页数
        changePageIndex (val) {
            this.scheduleMachinePageIndex = val;
            this.getScheduleUserMachine();
        },
        // 改变页码
        changePageSize (val) {
            this.scheduleMachinePageSize = val;
            this.getScheduleUserMachine();
        },
        // 获取所有车间的机器
        getWorkshopMachine () {
            const _this = this;
            this.$fetch('machine/list', {deptid: this.curScheduleMachineWorkShopId, processid: this.curProcessId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    var machineList = [];
                    var data = [];
                    for (let i of content.res) {
                        if (i.processName !== '头并') {
                            data.push(i);
                        }
                    }
                    machineList = data.map(item => {
                        item._checked = false;
                        item.color = false;
                        return item;
                    });
                    _this.$fetch('schedule/allocate/machine/list?suid=' + _this.scheduleUserId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            for (let i of content.res) {
                                if (machineList.map(x => x.id).includes(i)) {
                                    machineList.find(x => x.id === i)._checked = true;
                                }
                            }
                            _this.AllSelectedMachineData = machineList.filter(x => x._checked === true);
                            _this.$fetch('schedule/machine/list', {
                                belongdate: this.curTime,
                                shiftid: this.curShiftId
                            }).then((res) => {
                                let content = res.data;
                                if (content.status === 200) {
                                    for (let c of content.res) {
                                        if (machineList.map(x => x.id).includes(c.machineId)) {
                                            machineList.find(x => x.id === c.machineId).color = true;
                                        }
                                    }
                                    this.userMachineShow = true;
                                    _this.userMachineData = machineList;
                                    _this.AllMachineData = _this.userMachineData;
                                }
                            });
                        }
                    });
                }
            });
        },
        // 改变机器编码筛选
        changeMachineCode () {
            this.filterMachine();
        },
        // 通过机器编码.机器名称,工序筛选
        filterMachine () {
            let machineCode = new RegExp(this.machineCode, 'i');
            let machineName = new RegExp(this.machineName, 'i');
            let machineProcess = new RegExp(this.machineProcess, 'i');
            let SelectC = [];
            let SelectN = [];
            let SelectP = [];
            for (let i of this.AllMachineData) {
                if (machineCode.test(i.code)) {
                    SelectC.push(i);
                }
            }
            for (let i of SelectC) {
                if (machineName.test(i.name)) {
                    SelectN.push(i);
                }
            }
            for (let i of SelectN) {
                if (machineProcess.test(i.processName)) {
                    SelectP.push(i);
                }
            }
            for (let select of this.AllSelectedMachineData) {
                if (this.userMachineData.map(x => x.id).includes(select.id)) {
                    this.userMachineData.find(x => x.id === select.id)._checked = true;
                }
            }
            this.userMachineData = SelectP;
        },
        // 改变机器名称筛选
        changeMachineName () {
            this.filterMachine();
        },
        // 改变工序筛选
        changeMachineProcess () {
            this.filterMachine();
        },
        // 选中机器
        selectMachine (val) {
            for (let v of val) {
                this.AllMachineData.find(x => x.id === v.id)._checked = true;
            }
        },
        selectCancelMachine (val, row) {
            this.AllMachineData.find(x => x.id === row.id)._checked = false;
        },
        selectAllMachine (val) {
            if (val.length === this.userMachineData.length) {
                for (let v of val) {
                    this.AllMachineData.find(x => x.id === v.id)._checked = true;
                }
            } else if (val.length === 0) {
                for (let v of this.userMachineData) {
                    this.AllMachineData.find(x => x.id === v.id)._checked = false;
                }
            } else {
                return false;
            }
        },
        // 已被选机器
        rowClassName (row, index) {
            if (row.color === true) {
                return 'tableColor';
            } else {
                return '';
            }
        },
        // 保存机器
        userMachineSubmit () {
            let params = [];
            for (let p of this.AllMachineData) {
                if (p._checked) {
                    params.push({
                        id: p.id,
                        code: p.code
                    });
                }
            }
            this.userMachineLoading = true;
            this.$post('schedule/allocate/machine?suid=' + this.scheduleUserId, params).then((res) => {
                let content = res.data;
                this.userMachineLoading = false;
                if (content.status === 200) {
                    this.getScheduleUserMachine();
                    this.$Message.success('保存成功');
                    this.userMachineShow = false;
                }
            });
        },
        // 取消机器
        userMachineCancel () {
            this.userMachineLoading = false;
            this.userMachineShow = false;
        },
        // 获取所有的人员
        getAllUser () {
            this.$fetch('user/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.AllUserData = content.res;
                }
            });
        },
        cancelPost () {
            this.postLoading = false;
            this.postShow = false;
        },
        submitPost () {
            this.userPostMsg = '';
            if (this.nowDutyUser === '' || this.nowDutyUser === undefined) {
                this.userPostMsg = '请选择替岗人员';
                return false;
            }
            this.postLoading = false;
            this.$post('schedule/user/change', {
                scheduleUserId: this.scheduleChangeUserId,
                userId: this.nowDutyUser.split('-')[0],
                userName: this.nowDutyUser.split('-')[1]
            }).then((res) => {
                this.postLoading = false;
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('替换成功');
                    this.getScheduleUserMachine();
                    this.postShow = false;
                }
            });
        }
    },
    mounted () {
        this.getPostList();
        this.getAllUser();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        // 车间列表
        const _this = this;
        this.$fetch('dept/workshops').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                _this.ScheduleMachineWorkShopList = content.res;
                _this.getUserWorkshop();
            }
        });
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
    }
};
</script>
<style scoped>
.formInput{
    width: 150px!important;
    z-index: 1;
    left: 14%;
    position: absolute;
    padding: 8px 10px;
    top: 25px;
    background-color: #fff;
    box-shadow: 0 0 6px #ddd;
}
.formInput input{
    border: 1px solid #ccc;
}
.fromWidth{
    display: inline-block;
    width: 150px;
}
.formMachine{
    width: 120px;
    /*float: left;*/
    /*padding: 0 10px;*/
    display: inline-block;
}
.spanWidth{
    width: 100px;
    line-height: 20px;
    margin-bottom: 20px;
    text-align: right;
    display: inline-block;
}
    .spanPost{
        line-height: 40px;
    }
</style>

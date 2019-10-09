<template>
    <div>
        <Card>
            <Row>
                <Col span="24" style="text-align: right">
                    <div style="text-align: left;display: inline-block">
                        <DatePicker @on-change="getTime" type="date" :value="time" placeholder="请选择日期" style="width: 200px"></DatePicker>
                        <Select v-model="workShopModel" @on-change="changeWorkShop" style="width:150px" clearable placeholder="请选择车间">
                            <Option v-for="item in workShopList" style="width:100%;text-align: left" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <Select v-model="modelShift" style="width:150px" clearable placeholder="请选择班次">
                            <Option v-for="item in shiftData" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
                        </Select>
                        <Select v-model="modelGroup" style="width:150px" clearable placeholder="请选择班组">
                            <Option v-for="item in groupData" :value="item.groupId" :key="item.groupId">{{ item.groupName }}</Option>
                        </Select>
                        <Select @on-change="changePost" placeholder="请选择岗位" clearable v-model="modelPost" style="width:150px">
                            <OptionGroup v-for="(pList, index) of postBasicList" :key="index" :label="pList.typeName">
                                <Option v-for="item in pList.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </OptionGroup>
                        </Select>
                        <Input v-model="modelName" style="display: inline-block;width:150px;" placeholder="请输入员工姓名" />
                        <Button type="success" @click.keyup.enter="searchUserName">查询</Button>
                    </div>
                </Col>
            </Row>
            <Row style="margin-top: 10px">
                <Col>
                    <Table border ref="selection" :loading="TableLoading" :height="tableHeight" size="small" :columns="columns4" :data="data1"></Table>
                </Col>
                <Col style="text-align: right;margin-top: 10px;">
                    <Page :total="numTotal" :placement="pageUp" show-total @on-change="changePage" @on-page-size-change="changePageSize" :page-size="schedulePageSize" :page-size-opts="pageSizeOpts" show-elevator show-sizer></Page>
                </Col>
            </Row>
            <Modal
                    v-model="userMachineShow"
                    :mask-closable="false"
                    width="800"
                    title="机台分配">
               <!--<div style="height:500px;overflow: scroll;">-->
                   <Table border ref="selection" @on-select="selectedUserMachine" @on-select-cancel="cancelUserMachine" @on-selection-change="selectUserMachine" :columns="machineSelectcolumns" :row-class-name="rowClassName" :data="MachineSelectData" height="600"></Table>
               <!--</div>-->
                <modal-button
                        slot="footer"
                        :loading="machineLoading"
                        @cancel="onCancelSelectMachine"
                        @submit="onConfirmSelectMachine"
                >
                </modal-button>
            </Modal>
            <modal
                :isShow="userPost"
                :title="postTitle"
                :width="400"
                @submit="userSubmit"
                @cancel="userCancel"
            >
                <div slot="content">
                    <Row>
                        <Col>
                            <p class="marginBottom">当班岗位：{{DutyPost}}</p>
                            <p class="marginBottom">原当班人员：
                                <Input :value="curDutyUser" disabled style="display: inline-block;width:200px;" placeholder="请输入员工姓名" />
                            </p>
                            <p class="marginBottom">现当班人员：
                                <Select style="display: inline-block;width: 200px"
                                        placeholder="请搜索员工..."
                                        v-model="modelUser"
                                        filterable
                                        remote
                                        :remote-method="remoteMethod1"
                                        :loading="loadingUser">
                                    <Option v-for="(option, index) in options1" :value="option.id" :key="index">{{option.nameCode}}</Option>
                                </Select>
                            </p>
                        </Col>
                    </Row>
                </div>
            </modal>
        </Card>
    </div>
</template>

<script>
import AboutTime from '../public/AboutTime';
import modalButton from '../public/modalButton';
import modal from '../public/modal';
import publicJs from '../public/public-js/publiceJs';
import deleteWarning from '../public/deleteWarning';
export default {
    name: 'schedule-user',
    components: {
        AboutTime,
        modal,
        deleteWarning,
        modalButton
    },
    data () {
        return {
            userPost: false,
            tableHeight: document.documentElement.clientHeight - 236,
            pageUp: publicJs.pageUp,
            pageSizeOpts: publicJs.pageOpts,
            machineLoading: false,
            TableLoading: false,
            getSelectTime: '',
            modelGroup: '',
            // 主页面的分页
            numTotal: 40,
            schedulePageIndex: 1,
            schedulePageSize: publicJs.pageSize,
            groupData: [
            ],
            modelPost: '',
            postData: [
                {
                    postId: 1,
                    postName: '甲班'
                },
                {
                    postId: 2,
                    postName: '乙班'
                }
            ],
            modelProcess: '',
            modelName: '',
            curShiftId: '',
            processData: [
                {
                    processId: 1,
                    processName: '甲班'
                },
                {
                    processId: 2,
                    processName: '乙班'
                }
            ],
            options3: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            options4: {
                disabledDate (date) {
                    const disabledDay = date.getDate();
                    return disabledDay === 15;
                }
            },
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '班次',
                    width: 100,
                    key: 'shiftName'
                },
                {
                    title: '日期',
                    width: 150,
                    align: 'center',
                    sortable: true,
                    key: 'belongDate'
                },
                {
                    title: '当前车间',
                    width: 150,
                    sortable: true,
                    align: 'center',
                    key: 'deptName'
                },
                {
                    title: '班组',
                    width: 150,
                    sortable: true,
                    align: 'center',
                    key: 'groupName'
                },
                {
                    title: '员工姓名',
                    width: 150,
                    sortable: true,
                    align: 'center',
                    key: 'userName'
                },
                {
                    title: '当班岗位',
                    width: 150,
                    align: 'center',
                    sortable: true,
                    key: 'postName'
                },
                {
                    title: '所属工序',
                    width: 150,
                    sortable: true,
                    align: 'center',
                    key: 'processName'
                },
                {
                    title: '机台',
                    sortable: true,
                    key: 'machines'
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
                                    size: 'small',
                                    disabled: params.row.isWatcher === true ? false : 'disabled'
                                },
                                style: {
                                    marginRight: '10px'
                                    // color: params.row.color === true ? 'red' : 'none'
                                },
                                on: {
                                    click: () => {
                                        // console.log(params);
                                        this.scheduleUserId = params.row.id;
                                        this.curProcessId = params.row.processId === 0 ? '' : params.row.processId;
                                        this.machineLoading = false;
                                        this.processValue = '';
                                        this.curShiftId = params.row.shiftId;
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
                                        this.userPost = true;
                                        this.postTitle = '人员替岗';
                                        this.DutyPost = params.row.postName;
                                        this.curDutyUser = params.row.userName + '(' + this.AllUserData.find(x => x.id === params.row.userId).code + ')';
                                    }
                                }
                            }, '人员替岗')
                        ]);
                    }
                }
            ],
            scheduleUserId: '',
            selectMachineId: [],
            data1: [],
            tableSelectcolumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '用户编码',
                    sortable: true,
                    key: 'code'
                },
                {
                    title: '用户名称',
                    sortable: true,
                    width: 200,
                    key: 'name'
                }
            ],
            tableSelectData: [
                {
                    code: '123',
                    name: 'John'
                }
            ],
            newFormValidate: {
                workshop: '一车间',
                date: '2018-1-1',
                shift: '一车间'
            },
            newFormValidateRules: {},
            modelShift: '',
            shiftData: [],
            workShopModel: '',
            workShopList: [],
            newGroupForm: {},
            newGroupFormRules: {},
            newAddLowerErrorMsg: '',
            apartData: [],
            userTotalNum: 0,
            userPageSize: 10,
            GroupIndex: '',
            tableSelectUser: [],
            searchName: '',
            SelectedUser: [],
            addUserShow: false,
            // 岗位
            setPostProcess: false,
            isProcess: false,
            isPoss: false,
            modelMachine: '',
            modelMachineCode: '',
            newPostForm: {},
            postProcessMsg: '',
            newPostFormRules: {},
            PostList: [],
            ProcessList: [],
            // 机器选择
            userMachineShow: false,
            AllData: [],
            processValue: '',
            machineSelectcolumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '设备编码',
                    key: 'code',
                    sortable: true,
                    renderHeader: (h, params) => {
                        const _this = this;
                        return h('Span', [
                            h('Poptip', {
                                props: {
                                    transfer: true,
                                    placement: 'top-start'
                                    // width: '200'
                                }
                            }, [
                                h('Span', {}, '设备编码'),
                                h('Icon', {
                                    props: {
                                        type: 'ios-funnel-outline',
                                        size: 14
                                    },
                                    on: {
                                        click: () => {
                                            // debugger
                                        }
                                    },
                                    style: {
                                        color: '#bbbec4',
                                        marginLeft: '5px',
                                        verticalAlign: 'middle'
                                    }
                                }),
                                h('Div', {
                                    slot: 'content'
                                }, [
                                    h('Input', {
                                        props: {
                                            value: '',
                                            placeholder: '请输入设备编码'
                                        },
                                        on: {
                                            input: (value) => {
                                                var re = new RegExp(value, 'i');
                                                var Select = [];
                                                for (let i of _this.AllData) {
                                                    if (re.test(i.code)) {
                                                        Select.push(i);
                                                    }
                                                }
                                                _this.MachineSelectData = Select;
                                            }
                                        }
                                    })
                                ])
                            ])
                        ]);
                    }
                },
                {
                    title: '设备名称',
                    sortable: true,
                    key: 'name',
                    renderHeader: (h, params) => {
                        const _this = this;
                        return h('Span', [
                            h('Poptip', {
                                props: {
                                    transfer: true,
                                    placement: 'top-start'
                                    // width: '200'
                                }
                            }, [
                                h('Span', {}, '设备名称'),
                                h('Icon', {
                                    props: {
                                        type: 'ios-funnel-outline',
                                        size: 14
                                    },
                                    on: {
                                        click: () => {
                                            // debugger
                                        }
                                    },
                                    style: {
                                        color: '#bbbec4',
                                        marginLeft: '5px',
                                        verticalAlign: 'middle'
                                    }
                                }),
                                h('Div', {
                                    slot: 'content'
                                }, [
                                    h('Input', {
                                        props: {
                                            value: '',
                                            placeholder: '请输入机器名称'
                                        },
                                        on: {
                                            input: (value) => {
                                                var re = new RegExp(value, 'i');
                                                var Select = [];
                                                for (let i of _this.AllData) {
                                                    // console.log(i);
                                                    if (re.test(i.name)) {
                                                        Select.push(i);
                                                    }
                                                }
                                                _this.MachineSelectData = Select;
                                            }
                                        }
                                    })
                                ])
                            ])
                        ]);
                    }
                },
                {
                    title: '所属工序',
                    sortable: true,
                    width: 200,
                    color: 'red',
                    key: 'processName',
                    renderHeader: (h, params) => {
                        const _this = this;
                        return h('Span', [
                            h('Poptip', {
                                props: {
                                    transfer: true,
                                    placement: 'top-start'
                                    // width: '200'
                                }
                            }, [
                                h('Span', {}, '所属工序'),
                                h('Icon', {
                                    props: {
                                        type: 'ios-funnel-outline',
                                        size: 14
                                    },
                                    on: {
                                        click: () => {
                                            _this.processValue = '';
                                        }
                                    },
                                    style: {
                                        color: '#bbbec4',
                                        marginLeft: '5px',
                                        verticalAlign: 'middle'
                                    }
                                }),
                                h('Div', {
                                    slot: 'content'
                                }, [
                                    h('Input', {
                                        props: {
                                            value: _this.processValue,
                                            placeholder: '请输入工序名称'
                                        },
                                        on: {
                                            input: (value) => {
                                                // event.target.value = _this.processValue;
                                                var re = new RegExp(value, 'i');
                                                var Select = [];
                                                for (let i of _this.AllData) {
                                                    if (re.test(i.processName)) {
                                                        Select.push(i);
                                                    }
                                                }
                                                _this.MachineSelectData = Select;
                                            }
                                        }
                                    })
                                ])
                            ])
                        ]);
                    }
                }
            ],
            MachineSelectData: [
                {
                    code: '',
                    name: '',
                    processName: ''
                }
            ],
            // 选择机器
            selectMachineShow: false,
            newMachineForm: {
                workshop: '一车间',
                process: '',
                code: ''
            },
            newMachineFormRules: {},
            MachineWorkShopList: [],
            SelectMachinecolumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '机器编码',
                    sortable: true,
                    key: 'code'
                },
                {
                    title: '机器名称',
                    sortable: true,
                    width: 200,
                    key: 'name'
                }
            ],
            tableSelectMachine: [
                {
                    code: '123',
                    name: 'John'
                }
            ],
            machineTotalNum: 1,
            machinePageSize: 10,
            warnShow: false,
            curProcessId: '',
            postBasicList: [],
            departmentIndex: [],
            departmentData: [
                {
                    value: '123',
                    label: '456'
                }
            ],
            name: '',
            DutyPost: '',
            curDutyUser: '',
            postTitle: '',
            modelUser: '',
            loadingUser: false,
            options1: [],
            AllUserData: []
        };
    },
    computed: {
        time: () => {
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
        remoteMethod1 (query) {
            const _this = this;
            if (query !== '') {
                this.loadingUser = true;
                setTimeout(() => {
                    this.loadingUser = false;
                    const list = _this.AllUserData.map(item => {
                        return {
                            id: item.id,
                            nameCode: item.name + '(' + item.code + ')'
                        };
                    });
                    _this.options1 = list.filter(item => item.nameCode.indexOf(query) > -1);
                }, 200);
            } else {
                _this.options1 = [];
            }
        },
        addTeams () {
            this.addUserShow = true;
            console.log('添加');
        },
        deleteTeams () {
            console.log('移除');
        },
        // 获取当前车间
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.workShopModel = _this.workShopList[0].id;
                    } else {
                        _this.workShopModel = content.res.id;
                    }
                    _this.getShiftGroup();
                    _this.getScheduleUserMachine();
                };
            });
        },
        changeWorkShop (val) {
            // console.log(val);
            // console.log(this.workShopModel);
            this.getShiftGroup();
        },
        // 获取车间下的班组信息
        getShiftGroup () {
            console.log('获取车间下的班组信息');
            const _this = this;
            this.$fetch('dept/groups?parentid=' + this.workShopModel).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.groupData = (content.res || []).map(item => {
                        return {
                            groupId: item.id,
                            groupName: item.name
                        };
                    });
                }
            });
        },
        // 获取数据默认机台分配列表
        getScheduleUserMachine () {
            const _this = this;
            this.TableLoading = true;
            this.$fetch('schedule/user/list/machine?belongdate=' + (this.getSelectTime === '' ? this.time : this.getSelectTime), {
                pageindex: this.schedulePageIndex,
                pagesize: this.schedulePageSize,
                deptid: this.workShopModel,
                groupid: this.modelGroup || '',
                shiftid: this.modelShift || '',
                postId: this.modelPost || '',
                username: this.modelName || ''
            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.TableLoading = false;
                    _this.numTotal = content.count;
                    _this.data1 = content.res.sort((a, b) => b.isWatcher - a.isWatcher);
                    // debugger
                    console.log('获取成功');
                }
            });
        },
        // 改变页码的时候
        changePage (params) {
            console.log(params);
            this.schedulePageIndex = params;
            this.getScheduleUserMachine();
            // debugger;
        },
        getTime (params) {
            console.log(params);
            this.getSelectTime = params;
            // debugger;
        },
        changePageSize (params) {
            console.log(params);
            this.schedulePageSize = params;
            this.getScheduleUserMachine();
            // debugger;
        },
        changePost (params) {
            console.log(params);
            this.modelPost = params;
        },
        searchUserName () {
            console.log('这里用来查询用户');
            // 这里其实就是建立变量
            console.log(this.time);
            console.log(this.getSelectTime);
            console.log(this.workShopModel);
            console.log(this.modelShift);
            console.log(this.modelPost);
            console.log(this.modelName);
            // const params = {
            //
            // }
            this.getScheduleUserMachine();
            // debugger;
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
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 获取班次
        getShift () {
            // debugger
            const _this = this;
            this.$fetch('shift/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    _this.shiftData = (content.res || []).map(item => {
                        return {
                            shiftId: item.id,
                            shiftName: item.name
                        };
                    });
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 获取所有车间的机器
        getWorkshopMachine () {
            const _this = this;
            this.$fetch('machine/list', {deptid: this.workShopModel, processid: this.curProcessId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    var machineList = [];
                    machineList = content.res.map(item => {
                        item._checked = false;
                        item.color = false;
                        return item;
                    });
                    _this.$fetch('schedule/allocate/machine/list?suid=' + _this.scheduleUserId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            for (let i of content.res) {
                                // debugger
                                if (machineList.map(x => x.id).includes(i)) {
                                    machineList.find(x => x.id === i)._checked = true;
                                }
                            }
                            _this.$fetch('schedule/machine/list', {
                                belongdate: this.getSelectTime === '' ? this.time : this.getSelectTime,
                                shiftid: this.curShiftId
                            }).then((res) => {
                                let content = res.data;
                                if (content.status === 200) {
                                    for (let c of content.res) {
                                        if (machineList.map(x => x.id).includes(c.machineId)) {
                                            machineList.find(x => x.id === c.machineId).color = true;
                                        }
                                    };
                                    this.userMachineShow = true;
                                    _this.MachineSelectData = machineList;
                                    _this.AllData = _this.MachineSelectData;
                                }
                            });
                        }
                    });
                }
            });
        },
        getSelectedMachine () {
            // const _this = this;
        },
        rowClassName (row, index) {
            if (row.color === true) {
                return 'tableColor';
            } else {
                return '';
            }
        },
        // 员工机器
        selectUserMachine (params) {
            if (params.length === 0) {
                this.AllData = this.AllData.map(x => {
                    x._checked = false;
                    return x;
                });
            } else if (params.length === this.AllData.length) {
                this.AllData = this.AllData.map(x => {
                    x._checked = true;
                    return x;
                });
            } else {
                return false;
            }
        },
        selectedUserMachine (val) {
            for (let v of val) {
                this.AllData.find(x => x.id === v.id)._checked = true;
            }
        },
        cancelUserMachine (val, row) {
            this.AllData.find(x => x.id === row.id)._checked = false;
        },
        onCancelSelectMachine () {
            console.log('取消选择机器');
            this.userMachineShow = false;
            this.machineLoading = false;
        },
        // 选择机器确定
        onConfirmSelectMachine () {
            console.log('确定选择机器');
            let params = [];
            for (let p of this.AllData) {
                if (p._checked === true) {
                    params.push({
                        id: p.id,
                        code: p.code
                    });
                }
            }
            this.machineLoading = true;
            console.log(this.MachineSelectData);

            this.$post('schedule/allocate/machine?suid=' + this.scheduleUserId, params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('保存成功');
                    this.machineLoading = false;
                    this.$Message.success('保存成功');
                    this.getScheduleUserMachine();
                }
            });
            this.userMachineShow = false;
        },
        // 提示确认
        isSureCancle () {},
        isSureOk () {
            console.log('提示确认');
        },
        userSubmit () {
            this.userPost = false;
        },
        userCancel () {
            this.userPost = false;
        },
        getAllUser () {
            this.$fetch('user/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.AllUserData = content.res;
                }
            });
        }
    },
    mounted () {
        this.getShift();
        // this.getWorkshop();
        this.getAllUser();
        this.getPostList();
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(236);
        };
        // this.getScheduleUserMachine();
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
</style>

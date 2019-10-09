import layout from '../../layout/layout';
import deleteWarning from '../../public/deleteWarning';
import modal from '../../public/modal';
import {page, curDate} from '../../../libs/tools';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';
import xwValidate from '../../../libs/xwValidate';
export default ({
    components: {
        modal,
        layout,
        xwOperationLogModal,
        deleteWarning
    },
    data () {
        return {
            stateId: 1,
            stateList: [],
            list: [],
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '当班日期',
                    key: 'belongDate',
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState > 1) {
                                        this.isSave = false;
                                    } else {
                                        this.isSave = true;
                                    }
                                    this.getDetail(params.row.id);
                                }
                            }
                        }, params.row.belongDate);
                    }
                },
                {
                    title: '车间',
                    key: 'workshopName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '班次',
                    key: 'shiftName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '小时数',
                    key: 'totalHours',
                    align: 'right',
                    minWidth: 110
                },
                {
                    title: '计时工资',
                    key: 'totalAmount',
                    align: 'right',
                    minWidth: 110
                },
                {
                    title: '状态',
                    key: 'auditState',
                    align: 'center',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.auditState === 1 ? '创建' : (params.row.auditState === 3 ? '已审核' : ''));
                    }
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    minWidth: 130
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'left',
                    minWidth: 130
                }
            ],
            dateFrom: '',
            dateTo: '',
            selectIds: [],
            workshopList: [],
            workshopId: '',
            code: '',
            tableHeight: '',
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            show: false,
            loading: false,
            title: '',
            isSave: true,
            formValidate: {
                date: curDate(),
                workshopId: '',
                shiftId: '',
                remarks: ''
            },
            ruleValidate: {
                date: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                workshopId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                shiftId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            packInList: [],
            packInColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        const _this = this;
                        return h('Button', {
                            props: {
                                size: 'small',
                                icon: 'md-remove'
                            },
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                'click': (e) => {
                                    _this.packInList.splice(params.index, 1);
                                    _this.getTotal();
                                }
                            }
                        });
                    }
                },
                {
                    title: '人员',
                    key: 'userName',
                    minWidth: 100,
                    align: 'left',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', {
                        }, [
                            h('Select', {
                                props: {
                                    value: params.row.userId,
                                    filterable: true,
                                    remote: true,
                                    transfer: true
                                },
                                on: {
                                    'on-change': (data) => {
                                        debugger;
                                        _this.packInList[params.index].userId = data;
                                        _this.packInList[params.index].userName = _this.userList.find(x => x.userId === data).userName;
                                        _this.packInList[params.index].userCode = _this.userList.find(x => x.userId === data).userCode;
                                        _this.packInList[params.index].groupId = _this.userList.find(x => x.userId === data).groupId;
                                        _this.packInList[params.index].groupName = _this.userList.find(x => x.userId === data).groupName;
                                    },
                                    'remote-method': (query) => {
                                        if (query !== '') {
                                            // this.loading1 = true;
                                            setTimeout(() => {
                                                // this.loading1 = false;
                                                const list = this.list.map(item => {
                                                    return {
                                                        value: item,
                                                        label: item
                                                    };
                                                });
                                                this.options1 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
                                            }, 200);
                                        } else {
                                            this.options1 = [];
                                        }
                                    }
                                }
                            }, [
                                // this.userList.map(item => {
                                this.options1.map(item => {
                                    return h('Option', {
                                        props: {value: item.userId, key: item.userId}
                                    }, item.userName + '(' + item.userCode + ')');
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '班组',
                    key: 'groupName',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '岗位',
                    key: 'postName',
                    minWidth: 100,
                    align: 'left',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', {
                        }, [
                            h('Select', {
                                props: {
                                    value: params.row.postId,
                                    transfer: true
                                },
                                on: {
                                    'on-change': (data) => {
                                        _this.packInList[params.index].postId = data;
                                        _this.packInList[params.index].postName = this.postList.find(x => x.id === data).name;
                                        _this.getTotal();
                                    }
                                }
                            }, [
                                this.postList.map(item => {
                                    return h('Option', {
                                        props: {value: item.id, key: item.id}
                                    }, item.name);
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '计时单价',
                    key: 'unitPrice',
                    align: 'left',
                    width: 100,
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.unitPrice,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.unitPrice = event;
                                    params.row.amount = (params.row.hours * params.row.unitPrice).toFixed(2);
                                    vm.packInList[params.index] = params.row;
                                    vm.getTotal();
                                }
                            }
                        });
                    }
                },
                {
                    title: '小时数',
                    key: 'hours',
                    width: 100,
                    align: 'left',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.hours,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.hours = event;
                                    params.row.amount = (params.row.hours * params.row.unitPrice).toFixed(2);
                                    vm.packInList[params.index] = params.row;
                                    vm.getTotal();
                                }
                            }
                        });
                    }
                },
                {
                    title: '金额',
                    key: 'amount',
                    width: 100,
                    align: 'right'
                }
            ],
            shiftList: [],
            shiftId: '',
            total: 0,
            pageOpts: page().pageOpts,
            pageSize: page().pageSize,
            pageIndex: 1,
            userList: [],
            wShiftList: [],
            postList: [],
            postId: '',
            hours: 0,
            amount: 0,
            userShow: false,
            userLoading: false,
            userTitle: '',
            userDataList: [],
            userColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '员工工号',
                    key: 'userCode',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '员工姓名',
                    key: 'userName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '班组',
                    key: 'groupName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '班次',
                    key: 'shiftName',
                    align: 'left',
                    minWidth: 110
                }
            ],
            selectUser: [],
            options2: [],
            userMiddleList: [],
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
        };
    },
    methods: {
        getTotal () {
            let hours = 0;
            let amount = 0;
            this.packInList.slice(0, this.packInList.length).map(x => {
                hours += Number(x.hours);
                amount += Number(x.amount);
            });
            this.hours = hours;
            this.amount = amount;
        },
        addList () {
            if (!this.formValidate.shiftId) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择班次</p>'
                });
                return false;
            }
            this.userDataList = this.userMiddleList.map(x => {
                if (this.packInList.map(y => y.userId).includes(x.userId)) {
                    x._disabled = true;
                    x._checked = true;
                } else {
                    x._disabled = false;
                    x._checked = false;
                }
                return x;
            });
            // console.log(this.userDataList);
            this.userShow = true;
            this.userTitle = '添加人员';
            // this.packInList.push({
            //     userId: '',
            //     userName: '',
            //     userCode: '',
            //     groupId: '',
            //     groupName: '',
            //     postId: '',
            //     postName: '',
            //     unitPrice: 0,
            //     hours: 0,
            //     amount: 0
            // });
            // this.getTotal();
        },
        submit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.formValidate.id,
                        workshopName: this.workshopList.find(x => x.deptId === this.formValidate.workshopId).deptName,
                        workshopId: this.formValidate.workshopId,
                        totalHours: this.hours,
                        totalAmount: this.amount,
                        shiftId: this.formValidate.shiftId,
                        remarks: this.formValidate.remarks,
                        shiftName: this.wShiftList.find(x => x.shiftId === this.formValidate.shiftId).shiftName,
                        belongDate: this.formValidate.date,
                        hourlyWagesUserList: this.packInList.map(x => {
                            x.id = null;
                            return x;
                        })
                    };
                    this.$call('hourly.wages.save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.$Message.success('保存成功！');
                            this.getCount();
                            this.show = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        cancel () {
            this.show = false;
        },
        getDetail (val) {
            const _this = this;
            this.$call('hourly.wages.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.formValidate.date = content.res.belongDate;
                    _this.formValidate.id = content.res.id;
                    _this.formValidate.workshopId = content.res.workshopId;
                    _this.formValidate.remarks = content.res.remarks;
                    _this.getScheduleShift(content.res);
                    _this.createName = content.res.createName;
                    _this.createTime = content.res.createTime;
                    _this.updateName = content.res.updateName;
                    _this.updateTime = content.res.updateTime;
                    _this.operationList = content.res.formActionList;
                    _this.show = true;
                    _this.title = content.res.auditState > 1 ? '生产计时详情' : '编辑生产计时';
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('hourly.wages.delete', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.error('删除成功');
                    this.deleteWarnShow = false;
                }
            });
        },
        // 判断是否有默认车间
        getUserWorkshops () {
            this.$call('user/data/workshops2').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopId = content.res.defaultDeptId;
                    this.workshopList = content.res.userData;
                    this.getCount();
                    this.getHourlyShift();
                }
            });
        },
        getHourlyShift () {
            this.$call('shift.list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftList = content.res;
                }
            });
        },
        getCount () {
            this.$call('hourly.wages.stateCount', { workshopId: this.workshopId }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.stateList = content.res;
                    this.getList();
                }
            });
        },
        getList () {
            let params = {
                workshopId: this.workshopId,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                shiftId: this.shiftId,
                auditState: this.stateId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('hourly.wages.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.total = content.count;
                    this.list = content.res;
                    this.selectIds = [];
                }
            });
        },
        selectMenu (val) {
            this.stateId = val.id;
            this.dateFrom = '';
            this.dateTo = '';
            this.code = '';
            this.getList();
        },
        select (val) {
            this.selectIds = val.map(x => x.id);
        },
        add () {
            this.$refs['formValidate'].resetFields();
            this.title = '新增生产计时';
            this.packInList = [];
            this.formValidate.date = curDate();
            this.formValidate.id = null;
            this.formValidate.workshopId = this.workshopId;
            this.hours = 0;
            this.amount = 0;
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
            this.getScheduleShift();
        },
        refer () {
            this.$call('hourly.wages.submit', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.success('提交成功');
                }
            });
        },
        unrefer () {
            this.$call('hourly.wages.cancel', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.success('撤销提交成功');
                }
            });
        },
        audit () {
            this.$call('hourly.wages.approve', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.success('审核成功');
                }
            });
        },
        unaudit () {
            this.$call('hourly.wages.unapprove', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getCount();
                    this.$Message.success('撤销审核成功');
                }
            });
        },
        deleteList () {
            this.deleteWarnShow = true;
            this.deleteWarnMsg = '确定要删除吗？';
        },
        changeStartDate (val) {
            this.dateFrom = val;
        },
        changeEndDate (val) {
            this.dateTo = val;
        },
        changeDate (val) {
            this.formValidate.date = val;
            this.formValidate.shiftId = '';
            this.getScheduleShift();
        },
        changeWorkshop () {
            this.formValidate.shiftId = '';
            this.getScheduleShift();
        },
        changeShift (val) {
            this.getShift();
        },
        getShift (val) {
            const _this = this;
            if (this.formValidate.shiftId) {
                let scheduleId = this.wShiftList.find(x => x.shiftId === this.formValidate.shiftId).id;
                this.$call('schedule.user.listByScheduleId', {scheduleId: scheduleId}).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.userList = content.res;
                        this.packInList = [];
                        this.hours = 0;
                        this.amount = 0;
                        this.options1 = content.res;
                        this.userMiddleList = content.res.map(x => {
                            x._checked = false;
                            x._disabled = true;
                            return x;
                        });
                        if (val) {
                            _this.packInList = val.hourlyWagesUserList;
                            _this.getTotal();
                        }
                    }
                });
            } else {
                this.userDataList = [];
                this.packInList = [];
                this.userList = [];
            }
        },
        getScheduleShift (val) {
            const _this = this;
            let params = {
                belongDate: this.formValidate.date,
                workshopId: this.formValidate.workshopId
            };
            this.$call('schedule.list3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.wShiftList = content.res;
                    this.show = true;
                    if (val) {
                        _this.formValidate.shiftId = val.shiftId;
                        _this.getShift(val);
                    }
                }
            });
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getCount();
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getCount();
        },
        searchResult () {
            this.getList();
        },
        getPostList () {
            let params = {
                auditState: 3,
                typeCode: 'PT02',
                wageType: 3
            };
            this.$call('post.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.postList = content.res;
                }
            });
        },
        userSubmit () {
            this.selectUser = this.userDataList.filter(x => x._checked === true && x._disabled === false);
            let list = this.selectUser.map(x => {
                return {
                    userId: x.userId,
                    userCode: x.userCode,
                    userName: x.userName,
                    groupId: x.groupId,
                    groupName: x.groupName,
                    postId: '',
                    postName: '',
                    unitPrice: 0,
                    hours: 0,
                    amount: 0
                };
            });
            this.packInList = this.packInList.concat(list);
            this.userShow = false;
            // debugger;
        },
        userCancel () {
            this.userShow = false;
        },
        changeUserList (val) {
            // this.selectUser = val;
            // debugger
            if (val.length) {
                this.userDataList.map(x => {
                    if (val.map(y => y.userId).includes(x.userId)) {
                        x._checked = true;
                    } else {
                        x._checked = false;
                    }
                    return x;
                });
            } else {
                this.userDataList.map(x => {
                    if (x._disabled) {
                        x._checked = true;
                    } else {
                        x._checked = false;
                    }
                    return x;
                });
            }
            // debugger;
        }
    },
    mounted () {
        this.getUserWorkshops();
        this.getPostList();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        };
    }
});

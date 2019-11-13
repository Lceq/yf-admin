import modal from '../../public/modal';
import selectMachines from './select-machines';
export default ({
    components: {
        modal,
        selectMachines
    },
    props: {
        curGroupData: {
            type: Object
        },
        curWorkShopId: {
            type: Number
        }
    },
    data () {
        return {
            showGroupMachine: false,
            groupMachineLoading: false,
            groupMachineTableLoading: false,
            groupMachineTitle: '',
            tableHeight: '',
            isCouldSave: false,
            userData: {},
            saveSuccess: null,
            groupMachineColumns: [
                {
                    title: '操作',
                    key: 'action',
                    width: 110,
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
                                        let val = {
                                            processId: params.row.processId ? params.row.processId : null,
                                            suid: params.row.id,
                                            postId: params.row.postId
                                        };
                                        this.userData = {
                                            scheduleUserId: params.row.id,
                                            userId: params.row.userId,
                                            postId: params.row.postId
                                        };
                                        this.getMachineList(val);
                                    }
                                }
                            }, '机台分配')
                        ]);
                    }
                },
                {title: '机台', sortable: true, minWidth: 180, key: 'machines'},
                {title: '员工姓名', width: 90, sortable: true, align: 'center', key: 'userName'},
                {title: '当班岗位', width: 90, align: 'center', sortable: true, key: 'postName'},
                {title: '所属工序', width: 90, sortable: true, align: 'center', key: 'processName'}
            ],
            groupMachineData: [],
            userMachineData: [],
            isShowSelectMachine: null,
            scheduleGroupId: '',
            curDate: '',
            curWorkShopName: '',
            curShiftName: '',
            curGroupName: '',
            selectProcessId: null
        };
    },
    watch: {
        curGroupData (val) {
            if (val) {
                this.curDate = val.curDate;
                this.curWorkShopName = val.curWorkShopName;
                this.curShiftName = val.curShiftName;
                this.curGroupName = val.curGroupName;
                this.scheduleGroupId = val.id.split('-')[0];
                this.getScheduleUserList();
            }
        }
    },
    methods: {
        getScheduleUserList () {
            let params = {
                scheduleGroupId: this.scheduleGroupId
            };
            this.showGroupMachine = true;
            this.groupMachineTableLoading = true;
            this.$call('schedule.user.list.machine', params).then(res => {
                let content = res.data;
                this.groupMachineTableLoading = false;
                if (content.status === 200) {
                    this.groupMachineData = content.res.map(item => {
                        item.machines = item.machines.map(x => x.machineCode).toString();
                        return item;
                    });
                }
            });
        },
        getMachineList (val) {
            this.selectProcessId = val.processId;
            let params = {
                workshopId: this.curWorkShopId,
                // processId: val.processId,
                typeId: 26
            };
            this.isShowSelectMachine = Math.random();
            this.$api.machine.getMachineList(params).then(res => {
                let content = res.data;
                let machines = content.res.map(item => {
                    item._checked = false;
                    item.color = false;
                    item.startSpinNumber = 1;
                    item.endSpinNumber = item.spinCount;
                    item.openSpinCount = item.spinCount;
                    return item;
                });
                if (content.status === 200) {
                    this.$call('schedule.user.machine.list2', {
                        scheduleUserId: val.suid,
                        postId: val.postId
                    }).then(res => {
                        let content = res.data;
                        for (let i of content.res) {
                            if (machines.map(x => x.id).includes(i.machineId)) {
                                machines.find(x => x.id === i.machineId)._checked = true;
                                machines.find(x => x.id === i.machineId).color = false;
                                machines.find(x => x.id === i.machineId).startSpinNumber = i.startSpinNumber;
                                machines.find(x => x.id === i.machineId).endSpinNumber = i.endSpinNumber;
                                machines.find(x => x.id === i.machineId).openSpinCount = i.openSpinCount;
                            }
                        }
                        if (content.status === 200) {
                            this.$call('schedule.user.machine.list3', {
                                scheduleUserId: val.suid,
                                // processId: val.processId
                            }).then(res => {
                                let content = res.data;
                                if (content.status === 200) {
                                    for (let i of content.res) {
                                        if (machines.map(x => x.id).includes(i.machineId)) {
                                            // machines.find(x => x.id === i.machineId)._checked = false;
                                            machines.find(x => x.id === i.machineId).color = true;
                                        }
                                    }
                                    this.userMachineData = machines;
                                }
                            });
                        }
                    });
                }
            });
        },
        groupMachineSubmit () {
            this.showGroupMachine = false;
        },
        cancelUserMachine () {
            this.selectProcessId = null;
            this.userMachineData = [];
        },
        submitUserMachine (val) {
            let areturn = false;
            let data = val.filter(x => x._checked === true).map(y => {
                if (y.openSpinCount < 1) {
                    areturn = true;
                    this.$Message.warning('开台锭号不能大于结束锭号');
                }
                return {
                    id: y.id,
                    code: y.code,
                    startSpinNumber: y.startSpinNumber,
                    endSpinNumber: y.endSpinNumber,
                    openSpinCount: y.openSpinCount
                };
            });
            if (areturn) {
                return false;
            }
            let params = {
                scheduleUserId: this.userData.scheduleUserId,
                userId: this.userData.userId,
                postId: this.userData.postId,
                machines: data
            };
            // this.groupMachineTableLoading = true;
            this.$api.scheduleUser.getScheduleUserMachineSave(params).then(res => {
                let content = res.data;
                this.saveSuccess = Math.random();
                if (content.status === 200) {
                    // this.groupMachineTableLoading = false;
                    this.$Message.success('保存成功');
                    this.getScheduleUserList();
                }
            });
        },
        groupMachineCancel () {
            this.showGroupMachine = false;
        }
    },
    created () {
    }
});

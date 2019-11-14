import {curDate, page} from '../../../libs/tools';
import modal from '../../public/modal';
import selectMachines from '../../components/select-machines';
export default ({
    components: {
        modal,
        selectMachines
    },
    data () {
        return {
            selectProcessId: null,
            userMachinePageOpts: page().pageOpts,
            userMachinePageSize: page().pageSize,
            curDate: curDate(),
            curWorkshopId: '',
            curShift: '',
            curShiftGroup: null,
            curName: '',
            curPostId: '',
            curProcessId: '',
            tableHeight: '',
            workshopList: [],
            shiftList: [],
            shiftGroupList: [],
            postBasicList: [],
            processList: [],
            userMachineLoading: false,
            showMachinesList: {
                workshopId: '',
                processId: ''
            },
            userMachineColumns: [
                {
                    title: '操作',
                    key: 'action',
                    fixed: 'left',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                    // disabled: params.row.isWatcher === true ? false : 'disabled'
                                },
                                style: {
                                    marginRight: '10px'
                                },
                                on: {
                                    click: () => {
                                        _this.selectProcessId = params.row.processId;
                                        _this.showMachinesList = {
                                            userId: params.row.id,
                                            workshopId: _this.curWorkshopId,
                                            processId: params.row.processId ? params.row.processId : null
                                        };
                                    }
                                }
                            }, '机台分配')
                        ]);
                    }
                },
                {
                    title: '责任机台',
                    sortable: true,
                    minWidth: 300,
                    fixed: 'left',
                    align: 'left',
                    key: 'machines'
                },
                {
                    title: '员工编号',
                    width: 80,
                    align: 'left',
                    fixed: 'left',
                    key: 'code'
                },
                {
                    title: '姓名',
                    width: 120,
                    sortable: true,
                    fixed: 'left',
                    align: 'left',
                    key: 'name'
                },
                {
                    title: '车间',
                    width: 100,
                    align: 'left',
                    sortable: true,
                    key: 'workshopName'
                },
                {
                    title: '班组',
                    width: 120,
                    sortable: true,
                    align: 'left',
                    key: 'deptName'
                },
                {
                    title: '岗位',
                    width: 120,
                    sortable: true,
                    align: 'left',
                    key: 'postName'
                },
                {
                    title: '所属工序',
                    width: 120,
                    sortable: true,
                    align: 'center',
                    key: 'processName'
                }
            ],
            userMachineData: [],
            userMachineTotal: 0,
            userMachinePageIndex: 1
        };
    },
    methods: {
        // 获取车间
        getUserWorkshop () {
            return this.$call('user.data.workshops2').then(res => {
                if (res.data.status === 200) {
                    this.workshopList = res.data.res.userData;
                    this.curWorkshopId = res.data.res.defaultDeptId;
                };
            });
        },
        // 根据车间判断车间班组信息
        getGroupList () {
            const _this = this;
            return this.$call('user.data.groups').then((res) => {
                _this.shiftGroupList = res.data.res.userData;
                _this.curShiftGroup = res.data.res.defaultDeptId;
            });
        },
        // 获取岗位
        getPostList () {
            const _this = this;
            this.$api.post.getSearchPostList().then((res) => {
                _this.postBasicList = res;
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 获取车间人员
        getWorkshopUser () {
            let params = {
                workshopId: this.curWorkshopId,
                groupId: this.curShiftGroup,
                processId: this.curProcessId,
                postId: this.curPostId,
                name: this.curName.trim(),
                pageSize: this.userMachinePageSize,
                pageIndex: this.userMachinePageIndex
            };
            this.$api.user.getUserMachineList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.userMachineTotal = content.count;
                    this.userMachineData = content.res.map(item => {
                        item.deptName = Number(this.curWorkshopId) === item.deptId ? '' : item.deptName;
                        item.workshopName = this.workshopList.find(x => x.deptId === this.curWorkshopId).deptName;
                        item.machines = item.userMachineEntityList.map(j => j.machineCode).toString();
                        return item;
                    });
                }
            });
        },
        submitMachines (val) {
            this.$api.userMachine.getUserMachineSave(val).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getWorkshopUser();
                    this.$Message.success('保存成功');
                }
            });
        },
        searchUserName () {
            this.userMachinePageIndex = 1;
            setTimeout(() => {
                this.userMachineTotal = 0;
            });
            this.getWorkshopUser();
        },
        changePageIndexUserMachine (val) {
            this.userMachinePageIndex = val;
            this.getWorkshopUser();
        },
        changePageSizeUserMachine (val) {
            this.userMachinePageSize = val;
            this.getWorkshopUser();
        }
    },
    created () {
        (async () => {
            await this.getGroupList(); // 获取班组
            await this.getUserWorkshop(); // 获取车间
            await this.getProcessList(); // 获取工序
            await this.getPostList(); // 获取岗位
            await this.getWorkshopUser(); // 获取人员数据
        })();
    },
    mounted () {
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

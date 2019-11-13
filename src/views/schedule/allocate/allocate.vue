<template>
    <Card>
        <Row class="endFlex" id="selectedHeight">
            <Col>
                <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateFrom" :value="dateFrom" type="date" placeholder="请选择开始时间..."></DatePicker>
                <span class="formEachStyle date-interval">-</span>
                <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateTo" :value="dateTo" type="date" placeholder="请选择结束时间..."></DatePicker>
                <Select
                        placeholder="请选择工序"
                        class="formEachStyle"
                        v-model="processId"
                        filterable
                        :clearable="true"
                >
                    <Option v-for="(option, index) in processList" :value="option.id" :key="index">{{option.name}}</Option>
                </Select>
                <Input v-model.trim="userNameCode" class="formEachStyle" placeholder="请输入人员编号或名称"></Input>
                <Input v-model.trim="machineNameCode" class="formEachStyle" placeholder="请输入机台编号或名称"></Input>
                <Button icon="ios-search" type="primary" class="marginBottom" @click="searchButtonEvent">搜索</Button>
            </Col>
        </Row>
        <Row class="marginBottom">
            <Col>
                <Table border ref="selection" :height="tableHeight" :loading="allocateLoading" size="small" :columns="allocateMiddleColumns" :data="allocateList"></Table>
            </Col>
        </Row>
        <Row class="textRight">
            <Col>
                <page show-elevator show-sizer show-total :page-size-opts="pageOpts" :total="pageTotal" :page-size="pageSize" :placement="pageDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize"></page>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import {curDate, page} from '../../../libs/tools';
    import layout from '../../layout/layout';
    export default {
        name: 'allocate',
        components: { layout },
        data () {
            return {
                userNameCode: '',
                machineNameCode: '',
                processId: '',
                dateFrom: curDate(),
                dateTo: curDate(),
                workshopId: '',
                workshopList: [],
                curShiftId: '',
                shiftList: [],
                name: '',
                tableHeight: '',
                allocateLoading: false,
                allocateMiddleColumns: [
                    {
                        title: '所属日期',
                        minWidth: 100,
                        sortable: true,
                        align: 'left',
                        key: 'belongDate'
                    },
                    {
                        title: '班组',
                        minWidth: 100,
                        align: 'left',
                        sortable: true,
                        key: 'groupName'
                    },
                    {
                        title: '班次',
                        minWidth: 100,
                        sortable: true,
                        align: 'left',
                        key: 'shiftName'
                    },
                    {
                        title: '机台',
                        minWidth: 100,
                        sortable: true,
                        align: 'left',
                        machine: 'true',
                        key: 'machineName'
                    },
                    {
                        title: '机台编码',
                        minWidth: 100,
                        align: 'left',
                        machine: 'true',
                        sortable: true,
                        key: 'machineCode'
                    },
                    {
                        title: '工序',
                        minWidth: 100,
                        machine: 'true',
                        align: 'center',
                        sortable: true,
                        key: 'processName'
                    },
                    {
                        title: '人员',
                        minWidth: 100,
                        sortable: true,
                        user: 'true',
                        align: 'left',
                        key: 'userName'
                    },
                    {
                        title: '人员编码',
                        minWidth: 100,
                        align: 'left',
                        user: 'true',
                        sortable: true,
                        key: 'userCode'
                    },
                    {
                        title: '岗位',
                        minWidth: 100,
                        user: 'true',
                        align: 'left',
                        sortable: true,
                        key: 'postName'
                    },
                ],
                allocateList: [],
                machineList: [],
                userList: [],
                processList: [],
                pageSize: page().pageSize,
                pageOpts: page().pageOpts,
                pageDirect: page().pageUp,
                pageIndex: 1,
                pageTotal: 0
            };
        },
        methods: {
            changePageSize (val) {
                this.pageSize = val;
                this.getListData();
            },
            changePageIndex (val) {
                this.pageIndex = val;
                this.getListData();
            },
            getUserWorkshop () {
                this.$api.dept.getUserWorkshop().then(res => {
                    this.workshopId = res.curWorkshopId;
                    this.workshopList = res.workshopList;
                    this.getListData();
                });
            },
            changeDateFrom (val) {
                this.dateFrom = val;
            },
            changeDateTo (val) {
                this.dateTo = val;
            },
            searchButtonEvent () {
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListData();
            },
            getListData () {
                let params = {
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo,
                    machineNameCode: this.machineNameCode,
                    userNameCode: this.userNameCode,
                    processId: this.processId
                };
                this.$call('schedule.user.machine.getUserAndMachine', params).then(res => {
                    if (res.data.status === 200) {
                        this.pageTotal = res.data.count;
                        this.allocateList = res.data.res;
                    }
                });
            },
            getMachineList () {
                this.$call('machine.list').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.machineList = content.res;
                    }
                })
            },
            getUserList () {
                this.$call('process.list').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.userList = content.res;
                        this.processList = this.userList;
                    }
                })
            }
        },
        mounted () {
            (async () => {
                await this.getUserWorkshop();
                await this.getMachineList();
                await this.getUserList();
                await this.getListData();
            })();
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - H - 220;
            });
            window.onresize = () => {
                if (document.getElementById('selectedHeight')) {
                    let Height = document.getElementById('selectedHeight').clientHeight;
                    this.tableHeight = document.documentElement.clientHeight - Height - 220;
                }
            };
        }
    };
</script>

<style scoped>

</style>

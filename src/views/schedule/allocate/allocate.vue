<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'人员机台'" :curTabStateId="typeId" :stateList="typeList">
            <div slot="content">
                <Row class="endFlex" id="selectedHeight">
                    <Col>
                        <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateFrom" :value="dateFrom" type="date" placeholder="请选择开始时间..."></DatePicker>
                        <span class="formEachStyle" style="width:auto; line-height: 32px;">-</span>
                        <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateTo" :value="dateTo" type="date" placeholder="请选择结束时间..."></DatePicker>
                        <!--<Select class="textLeft formEachStyle" v-model="workshopId" @on-change="changeWorkshop" placeholder="请选择车间...">-->
                            <!--<Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>-->
                        <!--</Select>-->
                        <!--<Select class="textLeft formEachStyle" v-model="curShiftId" clearable placeholder="请选择班次...">-->
                            <!--<Option v-for="item in shiftList" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>-->
                        <!--</Select>-->
                        <!--<Select v-model="typeId"  class="marginBottom" @on-change="changeType" style="width:95px">-->
                            <!--<Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}：</Option>-->
                        <!--</Select>-->
                        <Select
                            :placeholder="typeId === 1 ? '请输入人员姓名' : '请输入机台编码或名称'"
                            class="formEachStyle"
                            v-model="nameId"
                            filterable
                            :clearable="true"
                            remote
                            :remote-method="remoteMethod"
                            :loading="loading">
                            <Option v-for="(option, index) in options" :value="option.id" :key="index">{{option.codeName}}</Option>
                        </Select>
                        <Button icon="ios-search" type="primary" class="marginBottom" @click="searchAllocate">搜索</Button>
                    </Col>
                </Row>
                <Row class="marginBottom">
                    <Col>
                        <Table border ref="selection" :height="tableHeight" :loading="allocateLoading" size="small" :columns="allocateColumns" :data="allocateList"></Table>
                    </Col>
                </Row>
                <Row class="textRight">
                    <Col>
                        <page show-elevator show-sizer show-total :page-size-opts="pageOpts" :total="pageTotal" :page-size="pageSize" :placement="pageDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize"></page>
                    </Col>
                </Row>
            </div>
        </layout>
    </div>
</template>

<script>
import {curDate, page} from '../../../libs/tools';
import layout from '../../layout/layout';
export default {
    name: 'allocate',
    components: {
        layout
    },
    data () {
        return {
            typeList: [
                {
                    id: 1,
                    name: '人员机台查询'
                },
                {
                    id: 2,
                    name: '机台人员查询'
                }
            ],
            typeId: 1,
            dateFrom: curDate(),
            dateTo: curDate(),
            workshopId: '',
            workshopList: [],
            curShiftId: '',
            shiftList: [],
            name: '',
            tableHeight: '',
            allocateLoading: false,
            allocateColumns: [],
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
            nameId: '',
            loading: false,
            userList: [],
            options: [],
            searchList: [],
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
            this.searchAllocate();
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.searchAllocate();
        },
        selectMenu (val) {
            this.typeId = val.id;
            this.nameId = '';
            if (val.id === 1) {
                this.searchList = this.userList;
                this.options = [];
                this.allocateColumns = this.allocateMiddleColumns.filter(x => x.user !==  'true');
                this.allocateList = [];
            }
            if (val.id === 2) {
                this.searchList = this.machineList;
                this.options = [];
                this.allocateColumns = this.allocateMiddleColumns.filter(x => x.machine !==  'true');
                this.allocateList = [];
            }
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.searchAllocate();
            });
        },
        // 获取车间下的班次
        // getShiftType () {
        //     const _this = this;
        //     this.$call('schedule.list3',
        //         {
        //             belongDate: this.date,
        //             workshopId: this.workshopId
        //         }).then((res) => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             _this.shiftList = content.res.length === 0 ? [] : content.res;
        //             _this.curShiftId = content.res.length === 0 ? '' : content.res[0].shiftId;
        //             _this.searchAllocate()
        //         }
        //     });
        // },
        changeDateFrom (val) {
            this.dateFrom = val;
            // this.getShiftType();
        },
        changeDateTo (val) {
            this.dateTo = val;
            // this.getShiftType();
        },
        // changeWorkshop (val) {
        //     // this.date = val;
        //     this.getShiftType();
        // },
        searchAllocate () {
            // this.pageIndex = 1;
            // setTimeout(() => {
            //     this.pageTotal = 0;
            // }, 0);
            let params = {
                pageSize: this.pageSize,
                pageIndex: this.pageIndex,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                // belongDate: this.date,
                // shiftId: this.curShiftId,
                machineId: this.typeId === 2 ? this.nameId : '',
                userId: this.typeId === 1 ? this.nameId : ''
            };
            this.$call('schedule.user.machine.by.userOrMachine', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.pageTotal = content.count;
                    this.allocateList = content.res === null ? [] :  content.res;
                }
            });
        },
        remoteMethod (query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    const list = this.searchList.map(item => {
                       item.codeName = item.name + ' (' + item.code + ')';
                        return item;
                    });
                    this.options = list.filter(item => item.codeName.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                this.options = [];
            }
        },
        // changeType (val) {
        //     this.nameId = '';
        //     if (val === 1) {
        //         this.searchList = this.userList;
        //         this.options = [];
        //         this.allocateColumns = this.allocateMiddleColumns.filter(x => x.user !==  'true');
        //         this.allocateList = [];
        //     }
        //     if (val === 2) {
        //         this.searchList = this.machineList;
        //         this.options = [];
        //         this.allocateColumns = this.allocateMiddleColumns.filter(x => x.machine !==  'true');
        //         this.allocateList = [];
        //     }
        // },
        getMachineList () {
            this.$call('machine.list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineList = content.res;
                }
            })
        },
        getUserList () {
            this.$call('user.list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.userList = content.res;
                    this.searchList = this.userList;
                }
            })
        }
    },
    mounted () {
        this.allocateColumns = this.allocateMiddleColumns.filter(x => x.user !== 'true');
        // debugger
        (async () => {
            await this.getUserWorkshop();
            await this.getMachineList();
            await this.getUserList();
            // await this.searchAllocate();
        }) ();
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

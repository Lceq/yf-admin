<template>
    <left-menu
            :stateList="menuArr"
            :curTabStateId="activeMenuAuditSate"
            @on-select="getClickMenuEvent"
    >
        <div slot="content">
            <global-loading v-show="globalLoadingShow"></global-loading>
            <Row type="flex" justify="end" align="middle">
                <Col>
                    <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles queryBarMarginRight" v-model="orderFromDate"></DatePicker>
                    <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles queryBarMarginRight" v-model="orderToDate"></DatePicker>
                    <Select v-show="activeMenuAuditSate === 1" clearable v-model="queryBarWorkshopValue" placeholder="请选择车间" class="searchHurdles queryBarMarginRight">
                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Select v-show="activeMenuAuditSate === 1" clearable v-model="queryBarProcessId" class="searchHurdles queryBarMarginRight" placeholder="请选择工序">
                        <Option v-for="item in queryBarProcessList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select v-show="activeMenuAuditSate === 1" clearable v-model="queryBarGroupId" class="searchHurdles queryBarMarginRight" placeholder="请选择班组">
                        <Option v-for="item in queryBarGroupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input type="text" v-model.trim="queryBarName" placeholder="请输入人员编号或名称" class="searchHurdles" @on-enter="queryBarNameEnterEvent"/>
                    <Button icon="ios-search" type="primary" @click="queryBarSearchButtonClickEvent" class="queryButtonStyle">搜索</Button>
                </Col>
            </Row>
            <Row class="table-bar margin-top-10 margin-bottom-10">
                <Col span="24">
                    <Table :height="tableHeight" size="small" :loading="tableLoading" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <!--<Row>
                <Col class="pageStyle">
                    <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChangeEvent"></Page>
                </Col>
            </Row>-->
        </div>
    </left-menu>
</template>
<script>
    import { toDay, formatDate, setPage } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    export default {
        name: 'user-output-schedule',
        components: { tipsModal, leftMenu },
        data () {
            return {
                queryBarGroupList: [],
                defaultWorkshopId: null,
                queryBarGroupId: null,
                queryBarWorkshopValue: null,
                queryBarProcessId: null,
                queryBarWorkshopList: [],
                queryBarProcessList: [],
                tableHeader: [],
                menuArr: [
                    {id: 1, name: '人员产量查询'},
                    {id: 2, name: '人员排班查询'}
                ],
                activeMenuAuditSate: 1,
                globalLoadingShow: false,
                tableLoading: false,
                userTableHeader: [
                    {title: '日期', key: 'belongDate', minWidth: 120, align: 'left', sortable: true},
                    {title: '班组', key: 'groupName', minWidth: 120, align: 'left', sortable: true},
                    {title: '人员', key: 'userName', minWidth: 120, align: 'left', sortable: true},
                    {title: '机台', key: 'machineName', minWidth: 120, align: 'left', sortable: true},
                    {title: '岗位', key: 'postName', minWidth: 120, align: 'left', sortable: true},
                    {title: '工序', key: 'processName', minWidth: 120, align: 'center', sortable: true},
                    {title: '品种', key: 'productName', minWidth: 120, align: 'left', sortable: true},
                    {title: '当前米数', key: 'output', minWidth: 120, align: 'right', sortable: true},
                    {title: '当前斤数', key: 'kgOutput', minWidth: 120, align: 'right', sortable: true}
                ],
                scheduleTableHeader: [
                    {key: 'belongDate', title: '日期', minWidth: 100, sortable: true},
                    {key: 'groupName', title: '班组', minWidth: 100, sortable: true},
                    {key: 'shiftName', title: '班次', minWidth: 100, sortable: true},
                    {key: 'userName', title: '人员', minWidth: 100, sortable: true},
                    {key: 'userCode', title: '人员编号', minWidth: 100, sortable: true},
                    {key: 'postName', title: '岗位', minWidth: 100, sortable: true}
                ],
                tableData: [],
                orderFromDate: toDay(),
                orderToDate: '',
                queryBarName: '',
                tableHeight: 0,
                listApi: 'statistic.user.output',
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                pageTotal: 0
            };
        },
        methods: {
            getWorkshopHttp () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopValue = responseData.defaultDeptId;
                        this.defaultWorkshopId = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                    }
                });
            },
            getProcessHttp () {
                return this.$call('process.list', {
                    auditState: 3,
                    state: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarProcessList = responseData;
                    }
                });
            },
            // 获取每页的条数
            pageChangeEvent (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListHttp();
            },
            // 获取页码
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 搜索按钮的点击事件
            queryBarSearchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.activeMenuAuditSate = obj.id;
                this.queryBarProcessId = null;
                this.queryBarGroupId = null;
                this.queryBarWorkshopValue = JSON.parse(JSON.stringify(this.defaultWorkshopId));
                this.orderFromDate = toDay();
                this.orderToDate = '';
                this.queryBarName = JSON.parse(JSON.stringify(this.userName));
                if (obj.name === '人员产量查询') {
                    this.tableHeader = JSON.parse(JSON.stringify(this.userTableHeader));
                    this.listApi = 'statistic.user.output';
                } else {
                    this.tableHeader = JSON.parse(JSON.stringify(this.scheduleTableHeader));
                    this.listApi = 'schedule.user.list';
                };
                this.getListHttp();
            },
            // 获取查询栏的订单编号
            queryBarNameEnterEvent () {
                this.getListHttp();
            },
            // 查询栏的请求
            getListHttp () {
                this.tableLoading = true;
                this.orderFromDate ? this.orderFromDate = formatDate(this.orderFromDate).split(' ')[0] : this.orderFromDate = '';
                this.orderToDate ? this.orderToDate = formatDate(this.orderToDate).split(' ')[0] : this.orderToDate = '';
                return this.$call(this.listApi, {
                    dateFrom: this.orderFromDate,
                    dateTo: this.orderToDate,
                    userName: this.queryBarName,
                    // pageIndex: this.pageIndex,
                    // pageSize: this.pageSize
                    processId: this.queryBarProcessId,
                    workshopId: this.queryBarWorkshopValue,
                    groupId: this.queryBarGroupId,
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.globalLoadingShow = false;
                        this.tableLoading = false;
                        this.pageTotal = res.data.count;
                    };
                });
            },
            // 计算table高度
            calculationTableHeight () {
                this.tableHeight = this.$store.state.maniViewHeight - 140;
                window.onresize = () => this.tableHeight = this.$store.state.maniViewHeight - 140;
            },
            getUserInfo () {
                this.$call('user.info').then(res => {
                    if (res.data.status === 200) {
                        this.queryBarName = res.data.res.name;
                        this.userName = res.data.res.name;
                    };
                });
            },
            getGroupListHttp () {
                this.$call('group.list').then(res => {
                    if (res.data.status === 200) this.queryBarGroupList = res.data.res;
                });
            },
            // 获取依赖数据
            async getDependentDataHttp () {
                this.globalLoadingShow = true;
                await this.getUserInfo();
                await this.getGroupListHttp();
                await this.getProcessHttp();
                await this.getWorkshopHttp();
                await this.getListHttp();
            }
        },
        created () {
            this.tableHeader = JSON.parse(JSON.stringify(this.userTableHeader));
            this.tableLoading = true;
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>


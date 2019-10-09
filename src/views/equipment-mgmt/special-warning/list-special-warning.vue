<template>
    <Card>
        <div>
            <global-loading v-show="globalLoadingShow"></global-loading>
            <Row type="flex" justify="end">
                <Col>
                    <Row type="flex" justify="space-between">
                        <!--<Col class="padding-left-4 margin-bottom-10">
                            <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles" v-model="queryBarStartDate"></DatePicker>
                        </Col>
                        <Col class="padding-left-4 margin-bottom-10">
                            <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles" v-model="queryBarEndDate"></DatePicker>
                        </Col>-->
                        <Col class="padding-left-4 margin-bottom-10">
                            <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择生产车间" class="searchHurdles">
                                <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </Col>
                        <Col class="padding-left-4 margin-bottom-10">
                            <Select clearable v-model="queryBarProcessValue" placeholder="请选择工序" class="searchHurdles">
                                <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </Col>
                        <Col class="padding-left-4 margin-bottom-10">
                            <Input type="text" v-model="queryBarMachineCode" placeholder="请输入设备编号或名称" class="searchHurdles"/>
                        </Col>
                        <Col class="padding-left-4 margin-bottom-10">
                            <Input type="text" v-model="queryBarMachineParts" placeholder="请输入专件编号或名称" class="searchHurdles"/>
                        </Col>
                    </Row>
                </Col>
                <Col class="searchButtonStyle margin-bottom-10 padding-left-4">
                    <Button icon="ios-search" type="primary" @click="queryBarSearchButtonClickEvent" class="queryButtonStyle">搜索</Button>
                </Col>
            </Row>
            <Row class="table-bar margin-bottom-10">
                <Col>
                    <Table @on-selection-change="selectionChangeEvent" :height="tableHeight" size="small" :loading="tableLoading" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <Row class="pageHeight">
                <Col class="pageStyle">
                    <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPage" :show-sizer="true" @on-page-size-change="pageChange"></Page>
                </Col>
            </Row>
        </div>
        <save-modal
                :spinShow="spinShow"
                :selectMachineModalProcessList="processList"
                :saveModalState="saveModalState"
                :saveModalTitle="saveModalTitle"
                :saveModalData="saveModalData"
                @on-visible-change="saveModalStateChange"
                @on-confirm="saveModalConfirmEvent"
                @on-cancel="saveModalCancelEvent"
        ></save-modal>
    </Card>
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight } from '../../../libs/common';
    import saveModal from './save-modal';
    export default {
        name: 'blendArchives',
        components: { saveModal },
        data () {
            return {
                apiPrefix: 'special.parts.replace.listWithWarning',
                queryBarStartDate: '',
                queryBarEndDate: '',
                loginUserName: '',
                queryBarProcessValue: null,
                spinShow: false,
                processList: [],
                saveModalData: {},
                saveModalTitle: '',
                saveModalState: false,
                machinePackModalState: false,
                globalLoadingShow: false,
                isActive: 1,
                pageHeights: null,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 100,
                        align: 'left',
                        render: (h, params) => {
                            return h('Button', {
                                props: { size: 'small' },
                                on: {
                                    'click': () => {
                                        _this.editClickEvent(params.row);
                                    }
                                }
                            },'专件更换')
                        }
                    },
                    {
                        title: '更换日期',
                        key: 'lastReplaceDate',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 140
                    },
                    {
                        title: '设备',
                        key: 'machineName',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                    {
                        title: '专件',
                        key: 'machinePartsName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '提前预警值',
                        key: 'warningValue',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '上车时间',
                        key: 'driveDay',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '上车产量',
                        key: 'driveOutput',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '周期单位',
                        key: 'periodUnit',
                        minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.periodUnit === 1 ? '时间单位(天)' : '机采产量单位'
                                }
                            })
                        }
                    },
                    {
                        title: '使用周期值',
                        key: 'periodValue',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '下次更换时间',
                        key: 'expectReplaceDate',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        minWidth: 110,
                        sortable: true
                    }
                ],
                tableData: [],
                queryBarProcessId: null,
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarMachineParts: '',
                queryBarMachineCode: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false,
                defaultWorkshop: {},
            };
        },
        methods: {
            // 编辑的事件
            editClickEvent (obj) {
                this.saveModalState = true;
                this.spinShow = true;
                this.saveModalTitle = '专件更换';
                this.saveModalData = obj;
                this.saveModalData.createName = this.loginUserName;
                this.spinShow = false;
            },
            // 确认按钮事件
            saveModalConfirmEvent () {
                this.saveModalState = false;
                this.getListRequest();
            },
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            // 监听保存modal
            saveModalStateChange (e) {
                this.saveModalState = e;
            },
            getProcessListRequest () {
                return this.$api.process.getSearchProcessList().then(res => { this.processList = res; });
            },
            // 获取id
            getAllIdMethods (array) {
                return array.map(item => item.id);
            },
            // 获取页码
            getPage (e) {
                this.pageIndex = e;
                this.getListRequest();
            },
            // 获取每页的条数
            pageChange (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListRequest();
            },
            // 查询栏的请求
            getListRequest () {
                this.tableLoading = true;
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarMachineParts = clearSpace(this.queryBarMachineParts) || '';
                this.queryBarMachineCode = clearSpace(this.queryBarMachineCode) || '';
                this.queryBarStartDate ? this.queryBarStartDate = formatDate(this.queryBarStartDate).split(' ')[0] : this.queryBarStartDate = '';
                this.queryBarEndDate ? this.queryBarEndDate = formatDate(this.queryBarEndDate).split(' ')[0] : this.queryBarEndDate = '';
                return this.$call(`${this.apiPrefix}`, {
                    machineParts: this.queryBarMachineParts,
                    machine: this.queryBarMachineCode,
                    workshopId: this.queryBarWorkshopValue,
                    processId: this.queryBarProcessValue,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    // dateFrom: this.queryBarStartDate,
                    // dateTo: this.queryBarEndDate,
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.tableLoading = false;
                        translateState(res.data.res);
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
                        this.checkArr = [];
                        this.globalLoadingShow = false;
                    };
                });
            },
            // 搜索按钮的点击事件
            queryBarSearchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListRequest();
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 获取默认车间
            getWorkshopListRequest () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopValue = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                        this.defaultWorkshop = {
                            workshopId: responseData.defaultDeptId,
                            workshopName: responseData.defaultDeptName,
                            workshopList: responseData.userData
                        };
                    }
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                window.onresize = () => {
                    this.pageHeights = pageHeightDom.offsetHeight + 10;
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                };
            },
            // 获取当前登录人信息
            getLoginUserDetailRequest () {
                return this.$call('user.info', {auditState: 3, enableState: 1}).then(res => {
                    if (res.data.status === 200) {
                        this.loginUserName = res.data.res.name;
                    };
                });
            },
            // 获取依赖数据
            async getDependentDataRequest () {
                this.globalLoadingShow = true;
                await this.getLoginUserDetailRequest();
                await this.getProcessListRequest();
                await this.getWorkshopListRequest();
                await this.getListRequest();
            }
        },
        created () {
            _this = this;
            this.toCreated = true;
            this.getDependentDataRequest();
        },
        mounted () {
            this.$nextTick(()=>{ this.calculationTableHeight(); });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDependentDataRequest();
            };
            this.$nextTick(()=>{ this.calculationTableHeight(); });
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style>
    .query-bar-label-width{
        width:86px;
        text-align: right;
        margin-right: 4px;
    }
</style>


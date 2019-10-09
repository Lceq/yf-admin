<template>
    <div>
        <left-menu
            :stateList="menuArr"
            :curTabStateId="isActive"
            @on-select="getClickMenuEvent"
        >
            <div slot="content">
                <global-loading v-show="globalLoadingShow"></global-loading>
                <Row type="flex" justify="space-between" align="middle">
                    <Col>
                        <Row type="flex" justify="start">
                            <Button icon="md-add" v-show="isActive===1" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                            <Button icon="ios-undo" v-show="isActive===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                            <Button icon="md-done-all" v-show="isActive===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                            <Button icon="md-refresh" v-show="isActive===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                            <Button icon="md-close" v-show="isActive===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                            <Button icon="ios-undo-outline" v-show="isActive===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                            <Button icon="ios-trash" v-show="isActive===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col>
                                <Row type="flex" justify="space-between">
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles" v-model="billFromDate"></DatePicker>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles" v-model="billToDate"></DatePicker>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择生产车间" class="searchHurdles">
                                            <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                        </Select>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Input type="text" v-model="queryBarUser" placeholder="请输入员工编号或名称" class="searchHurdles"/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col class="searchButtonStyle margin-bottom-10 padding-left-4">
                                <Button icon="ios-search" type="primary" @click="queryBarSearchButtonClickEvent" class="queryButtonStyle">搜索</Button>
                            </Col>
                        </Row>
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
                <tips-modal
                        :v-model="deleteModalStatus"
                        :tipMsg="deleteMsg"
                        :loading="deleteButtonLoading"
                        @cancel="deleteCancel"
                        @confirm="deleteConfirm"
                >
                </tips-modal>
            </div>
        </left-menu>
        <save-modal
                :spinShow="spinShow"
                :saveModalState="saveModalState"
                :saveModalTitle="saveModalTitle"
                :saveModalData="saveModalData"
                @on-visible-change="saveModalStateChange"
                @on-confirm="saveModalConfirmEvent"
                @on-cancel="saveModalCancelEvent"
        ></save-modal>
    </div>
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    import saveModal from './save-modal';
    export default {
        name: 'blendArchives',
        components: { tipsModal, leftMenu, saveModal },
        data () {
            return {
                apiPrefix: 'user.examination',
                isRewardList: [
                    {
                        id: 0,
                        name: '处罚'
                    },
                    {
                        id: 1,
                        name: '奖励'
                    }
                ],
                billToDate: '',
                billFromDate: '',
                spinShow: false,
                userList: [],
                shiftList: [],
                saveModalData: {},
                saveModalTitle: '',
                saveModalState: false,
                machinePackModalState: false,
                globalLoadingShow: false,
                menuArr: [],
                isActive: 1,
                pageHeights: null,
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '当班日期',
                        key: 'belongDate',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 140,
                        render: (h, params) => {
                            if (parseFloat(params.row.auditState) === 1) {
                                return h('div', {
                                    style: {
                                        display: 'flex'
                                    }
                                }, [
                                    h('div', {
                                        domProps: {
                                            innerHTML: params.row.belongDate
                                        },
                                        style: {
                                            width: '120px'
                                        }
                                    }),
                                    h('Icon', {
                                        props: {
                                            type: 'md-create',
                                            size: 16
                                        },
                                        style: {
                                            marginLeft: '8px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                _this.editClickEvent(params.row.id);
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', {
                                    style: {
                                        display: 'flex'
                                    }
                                }, [
                                    h('div', {
                                        domProps: {
                                            innerHTML: params.row.belongDate
                                        }
                                    }),
                                    h('Icon', {
                                        props: {
                                            type: 'md-create',
                                            size: 16
                                        },
                                        style: {
                                            marginLeft: '8px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                _this.editClickEvent(params.row.id);
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 100,
                        align: 'left'
                    },
                    {
                        title: '班次',
                        key: 'shiftName',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '员工',
                        key: 'userName',
                        minWidth: 110,
                        sortable: true,
                    },
                    {
                        title: '班组',
                        key: 'groupName',
                        minWidth: 110,
                        sortable: true,
                    },
                    {
                        title: '岗位',
                        key: 'postName',
                        minWidth: 120,
                        sortable: true
                    },
                    {
                        title: '奖惩方式',
                        key: 'isReward',
                        minWidth: 100,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.isReward ? '奖励' : '处罚'
                                }
                            })
                        }
                    },
                    {
                        title: '金额',
                        key: 'amount',
                        minWidth: 110,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '开单人',
                        key: 'createName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '开单日期',
                        key: 'createTime',
                        minWidth: 140,
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
                queryBarUser: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false,
                defaultWorkshop: {}
            };
        },
        methods: {
            // 编辑的事件
            editClickEvent (id) {
                this.saveModalState = true;
                this.spinShow = true;
                this.saveModalTitle = '编辑生产考核';
                this.$call(`${this.apiPrefix}.detail`, {id}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.isReward = + res.data.res.isReward;
                        this.saveModalData = {
                            ...res.data.res,
                            isRewardList: JSON.parse(JSON.stringify(this.isRewardList)),
                            userList: JSON.parse(JSON.stringify(this.userList)),
                            workshopList: JSON.parse(JSON.stringify(this.defaultWorkshop.workshopList))
                        };
                        this.spinShow = false;
                    };
                });
            },
            // 确认按钮事件
            saveModalConfirmEvent () {
                this.saveModalState = false;
                this.getListRequest();
                this.getMenuRequest();
            },
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            // 监听保存modal
            saveModalStateChange (e) {
                this.saveModalState = e;
            },
            getUserListRequest () {
                return this.$call('user.list', {
                    onJob: true,
                    isSupplement: false
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.map(item => {
                            item.label = `${item.name}(${item.code})`;
                            return item;
                        });
                        this.userList = res.data.res;
                    };
                });
            },
            // 新增的事件
            addClickEvent () {
                this.saveModalState = true;
                this.saveModalTitle = '新增生产考核';
                this.saveModalData = {
                    belongDate: toDay(),
                    shiftId: '',
                    shiftList: JSON.parse(JSON.stringify(this.shiftList)),
                    userId: null,
                    userName: '',
                    userList: JSON.parse(JSON.stringify(this.userList)),
                    groupId: null,
                    groupName: '',
                    postId: null,
                    postName: '',
                    isReward: 0,
                    isRewardList: JSON.parse(JSON.stringify(this.isRewardList)),
                    amount: 0,
                    auditState: 1,
                    ...JSON.parse(JSON.stringify(this.defaultWorkshop))
                }
            },
            // 获取id
            getAllIdMethods (array) {
                return array.map(item => item.id);
            },
            // 菜单的点击事件
            getClickMenuEvent (menuData) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.isActive = menuData.id;
                this.queryBarUser = '';
                this.billFromDate = '';
                this.billToDate = '';
                this.getListRequest();
            },
            getMenuRequest () {
                return this.$call(`${this.apiPrefix}.stateCount`, {
                    workshopId: this.queryBarWorkshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            if (item.id === 1) {
                                item.name = '待提交';
                            };
                        });
                        this.menuArr = res.data.res;
                    };
                });
            },
            deleteCancel () {
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
                this.deleteMsg = '';
            },
            // 删除的确认按钮
            deleteConfirm () {
                this.deleteButtonLoading = true;
                this.$call(`${this.apiPrefix}.delete`, this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                        noticeTips(this, 'deleteTips');
                        this.getMenuRequest();
                        this.getListRequest();
                        this.checkArr = [];
                    } else {
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的方法
            deleteEvent () {
                if (this.checkArr.length !== 0) {
                    this.deleteModalStatus = true;
                    this.deleteMsg = '确认删除？';
                } else {
                    noticeTips(this, 'unCheckTips');
                };
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
                this.isActive = this.isActive || '';
                this.queryBarUser = clearSpace(this.queryBarUser) || '';
                this.billFromDate ? this.billFromDate = formatDate(this.billFromDate).split(' ')[0] : this.billFromDate = '';
                this.billToDate ? this.billToDate = formatDate(this.billToDate).split(' ')[0] : this.billToDate = '';
                return this.$call(`${this.apiPrefix}.list`, {
                    dateFrom: this.billFromDate,
                    dateTo: this.billToDate,
                    user: this.queryBarUser,
                    auditState: this.isActive,
                    workshopId: this.queryBarWorkshopValue,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex
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
                this.getMenuRequest();
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call(`${this.apiPrefix}.close`, this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.checkArr = [];
                            noticeTips(this, 'closeTips');
                            this.getMenuRequest();
                            this.getListRequest();
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反关闭的事件
            unCloseEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.$call(`${this.apiPrefix}.unclose`, this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.checkArr = [];
                            noticeTips(this, 'unCloseTips');
                            this.getMenuRequest();
                            this.getListRequest();
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 撤销事件
            cancelEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.$call(`${this.apiPrefix}.cancel`, this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuRequest();
                            this.getListRequest();
                            noticeTips(this, 'cancelTips');
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    this.auditRequest(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 审核和反审核的方法
            unAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.unAuditRequest();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditRequest () {
                this.$call(`${this.apiPrefix}.unapprove`, this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditRequest (checkId) {
                this.$call(`${this.apiPrefix}.approve`, checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
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
            // 获取登录人车间下，当前日期的班次
            getShiftListRequest () {
                this.$call('schedule.list3', {
                    belongDate: toDay(),
                    workshopId: this.defaultWorkshop.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.shiftList = res.data.res;
                    };
                });
            },
            // 获取依赖数据
            async getDependentDataRequest () {
                this.globalLoadingShow = true;
                await this.getUserListRequest();
                await this.getWorkshopListRequest();
                await this.getShiftListRequest();
                await this.getMenuRequest();
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


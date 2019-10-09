<template>
    <left-menu
            :stateList="menuArr"
            :curTabStateId="activeMenuAuditSate"
            @on-select="getClickMenuEvent"
    >
        <div slot="content">
            <global-loading v-show="globalLoadingShow"></global-loading>
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <Row type="flex">
                        <Button icon="md-add" v-show="activeMenuAuditSate===1" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                        <Button icon="ios-undo" v-show="activeMenuAuditSate===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                        <Button icon="md-done-all" v-show="activeMenuAuditSate===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                        <Button icon="md-refresh" v-show="activeMenuAuditSate===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                        <Button icon="md-close" v-show="activeMenuAuditSate===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                        <Button icon="md-swap" v-show="activeMenuAuditSate===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                        <Button icon="ios-trash" v-show="activeMenuAuditSate===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="end">
                        <Col>
                            <Row type="flex" justify="end">
                                <Col class="margin-bottom-10">
                                    <DatePicker type="date" placeholder="请选择报工开始时间" class="query-bar-input-width marginButtonLeft" v-model="queryBarDateFrom"></DatePicker>
                                </Col>
                                <Col class="margin-bottom-10">
                                    <DatePicker type="date" placeholder="请选择报工结束时间" class="query-bar-input-width marginButtonLeft" v-model="queryBarDateTo"></DatePicker>
                                </Col>
                                <Col class="margin-bottom-10">
                                    <Select clearable v-model="queryBarWorkshopValue" class="query-bar-input-width marginButtonLeft" placeholder="请选择生产车间">
                                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="searchButtonStyle margin-bottom-10">
                            <Button icon="ios-search" type="primary" @click="searchButtonClickEvent" class="marginButtonLeft queryButtonStyle">搜索</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row class="table-bar margin-bottom-10">
                <Col>
                    <Table @on-selection-change="selectionChangeEvent" :loading="tableLoading" size="small" :height="tableHeight" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <Row class="pageHeight">
                <Col class="pageStyle">
                    <Page show-sizer :page-size="pageSize" show-total :total="pageTotal" show-elevator :page-size-opts="pageOpts" @on-change="getPageIndex" @on-page-size-change="getPageSizeEvent"></Page>
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
            <save-pack-report-modal
                    :detailData="detailData"
                    :remoteReporterList="remoteReporterList"
                    :defaultUser="defaultUser"
                    :savePackReportModalSaveLoading="savePackReportModalSaveLoading"
                    :savePackReportModalSubmitLoading="savePackReportModalSubmitLoading"
                    :tipsModalConfirmButtonLoading="tipsModalConfirmButtonLoading"
                    :savePackReportModalTitle="savePackReportModalTitle"
                    :savePackReportModalState="savePackReportModalState"
                    :savePackReportModalSpinShow="savePackReportModalSpinShow"
                    @on-visible-change="savePackReportModalVisibleChangeEvent"
                    @cancel-event="savePackReportModalCancelEvent"
                    @save-and-submit-event="saveAndSubmitEvent"
                    @save-event="saveEvent"
            ></save-pack-report-modal>
            <detail-pack-report-modal
                    :detailPackReportModalState="detailPackReportModalState"
                    :detailPackReportModalSpinShow="detailPackReportModalSpinShow"
                    :detailPackReportModalData="detailPackReportModalData"
                    @on-visible-change="detailPackReportModalStateChangeEvent"
                    @close-event="detailPackReportModalCloseEvent"
            ></detail-pack-report-modal>
        </div>
    </left-menu>
</template>
<script>
    let _this = this;
    import tipsModal from '../../public/deleteWarning';
    import { noticeTips, clearSpace, compClientHeight, setPage, toDay, formatDate, translateState } from '../../../libs/common';
    import leftMenu from '../../layout/layout';
    import savePackReportModal from './save-pack-report-modal';
    import detailPackReportModal from './detail-pack-report-modal';
    export default{
        name: 'pack-report-list',
        components: {
            tipsModal, leftMenu, savePackReportModal, detailPackReportModal
        },
        data () {
            return {
                toCreated: false,
                defaultUser: {},
                remoteReporterList: [],
                detailPackReportModalState: false,
                detailPackReportModalSpinShow: false,
                detailPackReportModalData: {},
                tipsModalConfirmButtonLoading: false,
                savePackReportModalSaveLoading: false,
                savePackReportModalSubmitLoading: false,
                defaultSaveData: {
                    date: toDay(),
                    workshopId: null,
                    workshopName: '',
                    packReportDetailList: []
                },
                detailData: {},
                savePackReportModalTitle: '',
                savePackReportModalState: false,
                savePackReportModalSpinShow: false,
                activeMenuAuditSate: 1,
                globalLoadingShow: false,
                checkArr: [],
                menuArr: [],
                tableLoading: false,
                tableHeight: '',
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageTotal: 0,
                pageIndex: 1,
                queryBarDateFrom: '',
                queryBarDateTo: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                auditSwitch: false,
                againstSwitch: false,
                pushSwitch: true,
                addSwitch: true,
                cancelSwitch: false,
                deleteSwitch: true,
                tracesSwitch: false,
                queryBarBillStateValue: '1',
                queryBarWorkshopValue: null,
                queryBarWorkshopList: [],
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '报工日期',
                        key: 'date',
                        sortable: true,
                        align: 'left',
                        minWidth: 130,
                        render: (h, params) => {
                            if (parseInt(params.row.auditState) === 1) {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.date
                                        },
                                        on: {
                                            click: () => {
                                                _this.detailEvent(params.row.id);
                                            }
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
                                                _this.editEvent(params.row.id);
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.date
                                        },
                                        on: {
                                            click: () => {
                                                _this.detailEvent(params.row.id);
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        minWidth: 110,
                        sortable: true,
                        align: 'left'
                    },
                    {
                        title: '报工产量(KG)',
                        key: 'totalQty',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        minWidth: 110,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        minWidth: 150,
                        sortable: true,
                        align: 'left'
                    }
                ],
                tableData: [],
                pageHeights: null
            };
        },
        methods: {
            // 详情modal事件
            detailPackReportModalCloseEvent () {
                this.detailPackReportModalState = false;
            },
            detailPackReportModalStateChangeEvent (e) {
                this.detailPackReportModalState = e;
            },
            saveEvent (params) {
                this.savePackReportModalSaveLoading = true;
                this.saveHttp(params).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.savePackReportModalState = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        this.savePackReportModalSaveLoading = false;
                    } else {
                        this.savePackReportModalSaveLoading = false;
                    };
                });
            },
            submitHttp (id) {
                this.$call('pack.report.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'submitTips');
                        this.savePackReportModalState = false;
                        this.savePackReportModalSubmitLoading = false;
                        this.tipsModalConfirmButtonLoading = false;
                    } else {
                        this.savePackReportModalSubmitLoading = false;
                        this.tipsModalConfirmButtonLoading = false;
                    };
                })
            },
            // 详情事件
            detailEvent (id) {
                this.detailPackReportModalSpinShow = true;
                this.detailPackReportModalState = true;
                this.getDetailHttp(id).then(res => {
                    if (res.data.status === 200) {
                        this.detailPackReportModalData = res.data.res;
                        this.detailPackReportModalSpinShow = false;
                    };
                });
            },
            editEvent (id) {
                this.savePackReportModalTitle = '编辑包装报工单'
                this.savePackReportModalState = true;
                this.savePackReportModalSpinShow = true;
                this.getDetailHttp(id).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.packReportDetailList.forEach((item)=>{
                            item.reporterList = [];
                            item.remoteReporterList = this.remoteReporterList;
                        });
                        responseData.workshopList = this.defaultSaveData.workshopList;
                        this.detailData = res.data.res;
                        this.savePackReportModalSpinShow = false;
                    };
                });
            },
            getDetailHttp (id) {
                return this.$call('pack.report.detail', {id: id});
            },
            // 保存modal的提交事件
            saveAndSubmitEvent (params) {
                this.savePackReportModalSubmitLoading = true;
                this.tipsModalConfirmButtonLoading = true;
                this.saveHttp(params).then(res => {
                    if (res.data.status === 200) {
                        this.submitHttp(res.data.res);
                    };
                });
            },
            saveHttp (params) {
                params.date = formatDate(params.date);
                params.packReportDetailList.forEach((item)=>{ this.$delete(item, 'id'); });
                return this.$call('pack.report.save', params);
            },
            savePackReportModalCancelEvent () {
                this.savePackReportModalState = false;
            },
            // 监听新增包装报工单modal
            savePackReportModalVisibleChangeEvent (e) {
                this.savePackReportModalState = e;
                if (e === false) {
                    this.savePackReportModalSaveLoading = false;
                    this.savePackReportModalSubmitLoading = false;
                    this.tipsModalConfirmButtonLoading = false;
                };
            },
            // 新增的事件
            addClickEvent () {
                this.detailData = JSON.parse(JSON.stringify(this.defaultSaveData));
                this.savePackReportModalState = true;
                this.savePackReportModalTitle = '新增包装报工单';
            },
            // 反审核的方法
            unAuditEvent () {
                if (this.checkArr.length !== 0) {
                    this.unAuditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$call('pack.report.unapprove', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            closeEvent () {
                if (this.checkArr && this.checkArr.length !== 0) {
                    this.$call('pack.report.close', this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getListHttp();
                            this.getMenuHttp();
                            noticeTips(this, 'closeTips');
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            unCloseEvent () {
                if (this.checkArr && this.checkArr.length !== 0) {
                    this.$call('pack.report.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getListHttp();
                            this.getMenuHttp();
                            noticeTips(this, 'unCloseTips');
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 审核的事件
            auditEvent () {
                if (this.checkArr && this.checkArr.length !== 0) {
                    this.auditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 撤销事件
            cancelEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('pack.report.cancel', this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuHttp();
                            this.getListHttp();
                            noticeTips(this, 'cancelTips');
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.activeMenuAuditSate = obj.id;
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.queryBarBillStateValue = obj.id + '';
                this.queryBarDateFrom = '';
                this.queryBarDateTo = '';
                this.getListHttp();
            },
            // 获取左侧菜单
            getMenuHttp () {
                return this.$call('pack.report.stateCount', { workshopId: this.queryBarWorkshopValue }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            if (item.id === 0) {
                                item.name = '待创建';
                            } else if (item.id === 1) {
                                item.name = '待提交';
                            };
                        });
                        this.menuArr = res.data.res;
                    };
                });
            },
            // 获取每页条数
            getPageSizeEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 搜索按钮的事件
            searchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
                this.getMenuHttp();
            },
            // 搜索的请求
            getListHttp () {
                this.queryBarBillStateValue = this.queryBarBillStateValue || '';
                this.queryBarDateFrom ? this.queryBarDateFrom = formatDate(this.queryBarDateFrom).split(' ')[0] : this.queryBarDateFrom = '';
                this.queryBarDateTo ? this.queryBarDateTo = formatDate(this.queryBarDateTo).split(' ')[0] : this.queryBarDateTo = '';
                this.$call('pack.report.list', {
                    'dateFrom': this.queryBarDateFrom,
                    'dateTo': this.queryBarDateTo,
                    'workshopId': this.queryBarWorkshopValue,
                    'pageIndex': this.pageIndex,
                    'pageSize': this.pageSize,
                    'auditState': this.queryBarBillStateValue
                }).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.tableData = translateState(res.data.res);
                        this.pageTotal = res.data.count;
                        this.pageTotal = res.data.count;
                        this.globalLoadingShow = false;
                    };
                });
            },
            // 获取页码事件
            getPageIndex (e) {
                this.pageIndex = e;
                this.getListHttp();
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
            // 获取id
            getAllIdMethods (array) {
                return array.map(item => item.id);
            },
            // 删除的确认按钮
            deleteConfirm () {
                this.deleteButtonLoading = true;
                this.$call('pack.report.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.deleteModalStatus = false;
                        this.tracesSwitch = true;
                        this.getListHttp();
                        this.getMenuHttp();
                        this.checkArr = [];
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的取消按钮
            deleteCancel () {
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
            },
            // 编辑的点击事件
            editClick (id) {
                this.$router.push({
                    path: 'editNotice',
                    query: {id: id}
                });
                this.$route.meta.keepAlive = false;
            },
            // 审核的请求
            auditHttp () {
                this.$call('pack.report.approve', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
            },
            getWorkshopHttp () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.defaultSaveData.workshopId = responseData.defaultDeptId;
                        this.defaultSaveData.workshopName = responseData.defaultDeptName;
                        this.defaultSaveData.workshopList = responseData.userData;
                        this.queryBarWorkshopValue = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                    }
                });
            },
            // 获取员工列表数据
            getUserListHttp () {
                return this.$call('user.list').then(res => {
                    if (res.data.status === 200) {
                        this.remoteReporterList = res.data.res;
                    };
                });
            },
            // 获取登录人信息
            getUserInfoHttp () {
                this.$call('user.info').then(res => {
                    if (res.data.status === 200) {
                        this.defaultUser = res.data.res;
                    };
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights);
                window.onresize = () => {
                    this.pageHeights = pageHeightDom.offsetHeight + 10;
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
                };
            },
            // 获取依赖的数据
            async getDependentDataHttp () {
                this.globalLoadingShow = true;
                await this.getWorkshopHttp();
                await this.getUserListHttp();
                await this.getUserInfoHttp();
                await this.getMenuHttp();
                await this.getListHttp();
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                // Object.assign(this.$data, this.$options.data());
                this.activeMenuAuditSate = 1;
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.queryBarBillStateValue = '1';
                this.queryBarDateFrom = '';
                this.queryBarDateTo = '';
                this.getDependentDataHttp();
            };
            this.$nextTick(() => { this.calculationTableHeight(); });
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style scoped>
    .query-bar-input-width{
        width: 150px;
    }
</style>

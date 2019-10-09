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
                            <Button icon="md-add" v-show="isActive===1" type="primary" @click="addEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
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
                                        <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择生产车间" class="searchHurdles">
                                            <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                        </Select>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles" v-model="billFromDate"></DatePicker>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles" v-model="billToDate"></DatePicker>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Input type="text" v-model="queryBarCode" placeholder="请输入领料申请单号" class="searchHurdles"/>
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
                        <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChangeEvent"></Page>
                    </Col>
                </Row>
                <Row>
                    <tips-modal
                            :v-model="deleteModalStatus"
                            :tipMsg="deleteMsg"
                            :loading="deleteButtonLoading"
                            @cancel="deleteCancel"
                            @confirm="deleteConfirm"
                    >
                    </tips-modal>
                </Row>
            </div>
        </left-menu>
    </div>
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    export default {
        name: 'blendArchives',
        components: { tipsModal, leftMenu },
        data () {
            return {
                machinePackModalState: false,
                globalLoadingShow: false,
                menuArr: [],
                isActive: 1,
                pageHeights: null,
                billToDate: '',
                billFromDate: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                tableHeader: [],
                tableHeaderColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '申请日期',
                        key: 'date',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '领料申请单号',
                        key: 'code',
                        fixed: 'left',
                        sortable: true,
                        width: 130,
                        align: 'left',
                        render: (h, params) => {
                            if (parseFloat(params.row.auditState) === 1) {
                                return h('div',{
                                    style: {
                                        display: 'flex'
                                    }
                                }, [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code,
                                        },
                                        style: {
                                            width: '110px',
                                            display: 'inline-block'
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'detail-material-apply',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
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
                                                this.$router.push({
                                                    path: 'edit-material-apply',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
                                            }
                                        }
                                    })
                                ]);
                            } else {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'detail-material-apply',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
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
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '申领包数',
                        key: 'applyPacketQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '申领重量',
                        key: 'applyWeightQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    }
                ],
                tableData: [],
                queryBarOrderSate: '1',
                queryBarOrderSateList: [],
                showMore: false,
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarCode: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 新增的事件
            addEvent () {
                this.$router.push({
                    path: 'add-material-apply',
                    query: { activated: true }
                });
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
                this.queryBarOrderSate = menuData.id + '';
                this.tableHeader = menuData.id === 3 ? this.tableHeaderColumns : this.tableHeaderColumns.filter(x => x.auditState === undefined);
                this.queryBarCode = '';
                this.billFromDate = '';
                this.billToDate = '';
                this.getListRequest();
            },
            getMenuRequest () {
                return this.$call('prd.material.application.stateCount', {
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
                this.$call('prd.material.application.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListRequest();
            },
            // 获取每页的条数
            pageChangeEvent (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListRequest();
            },
            // 查询栏的请求
            getListRequest () {
                this.tableLoading = true;
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarOrderSate = this.queryBarOrderSate || '';
                this.queryBarCode = clearSpace(this.queryBarCode) || '';
                this.billFromDate ? this.billFromDate = formatDate(this.billFromDate).split(' ')[0] : this.billFromDate = '';
                this.billToDate ? this.billToDate = formatDate(this.billToDate).split(' ')[0] : this.billToDate = '';
                return this.$call('prd.material.application.list', {
                    dateFrom: this.billFromDate,
                    dateTo: this.billToDate,
                    code: this.queryBarCode,
                    auditState: this.queryBarOrderSate,
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
            // 筛选栏的省略号点击事件
            showMoreEvent () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                if (this.showMore) {
                    this.showMore = false;
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                } else if (this.showMore === false) {
                    this.showMore = true;
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                };
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('prd.material.application.close', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('prd.material.application.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('prd.material.application.cancel', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.auditHttp(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 审核和反审核的方法
            unAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.unAuditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$call('prd.material.application.unapprove', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditHttp (checkId) {
                this.$call('prd.material.application.approve', checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
            },
            // 获取默认车间
            getWorkshop () {
                return this.$api.dept.getUserWorkshop().then(res => {
                    res.curWorkshopId ? this.queryBarWorkshopValue = res.curWorkshopId : this.queryBarWorkshopValue = res.workshopList[0].deptId;
                    this.queryBarWorkshopList = res.workshopList;
                });
            },
            calculationTableHeight () {
                this.tableHeader = this.tableHeaderColumns.filter(x => x.auditState === undefined);
                let tableDom = document.getElementsByClassName('table-bar')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                window.onresize = () => {
                    this.pageHeights = pageHeightDom.offsetHeight + 10;
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                (async () => {
                    await this.getWorkshop();
                    await this.getMenuRequest();
                    await this.getListRequest();
                })();
            }
        },
        created () {
            _this = this;
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(()=>{ this.calculationTableHeight(); });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDependentDataHttp();
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


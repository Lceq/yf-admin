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
                    <Row type="flex" justify="start">
                        <Button icon="md-add" v-show="activeMenuAuditSate===1" type="primary" @click="addClick" class="queryBarMarginRight margin-bottom-10">新增</Button>
                        <!--<Button icon="ios-create" v-show="pushSwitch" type="primary" @click="pushEvent" class="queryBarMarginRight margin-bottom-10">提交</Button>-->
                        <Button icon="ios-undo" v-show="activeMenuAuditSate===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                        <Button icon="md-done-all" v-show="activeMenuAuditSate===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                        <Button icon="md-refresh" v-show="activeMenuAuditSate===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                        <Button icon="md-close" v-show="activeMenuAuditSate===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                        <Button icon="md-swap" v-show="activeMenuAuditSate===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                        <Button icon="ios-trash" v-show="activeMenuAuditSate===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <Row type="flex" justify="end"  class="screenRightCenter">
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles queryBarMarginRight" v-model="orderFromDate"></DatePicker>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles queryBarMarginRight" v-model="orderToDate"></DatePicker>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择车间" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Input type="text" v-model="queryBarOrderCode" placeholder="请输入订单编号" class="searchHurdles" @on-enter="queryBarOrderCodeEnterEvent"/>
                                </Col>
                            </Row>
                            <Row type="flex" v-show="showMore">
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Input type="text" v-model="queryBarMaterielId" placeholder="请输入产品编号或名称" class="searchHurdles queryBarMarginRight" @on-enter="queryBarMaterialEnterEvent"/>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Select clearable v-model="queryBarEmergencyState" placeholder="请选择优先级" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in queryBarEmergencyStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Select clearable v-model="queryBarIsQuote" placeholder="请选择引用状态" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in isQuoteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Select clearable v-model="queryBarIsReport" placeholder="请选择报工状态" class="searchHurdles">
                                        <Option v-for="item in isReportList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="margin-bottom-10 padding-left-4">
                                    <Select clearable v-model="queryBarProcessId" class="searchHurdles" placeholder="请选择工序">
                                        <Option v-for="item in queryBarProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="searchButtonStyle margin-bottom-10">
                            <a class="moreStyle" @click="showScreenChange">···</a>
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
</template>
<script>
    import { noticeTips, clearSpace, compClientHeight, toDay, setPage, formatDate, translateState, emptyTips } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    let _this = this;
    export default {
        name: 'order',
        components: { tipsModal, leftMenu },
        data () {
            return {
                queryBarProcessId: '',
                queryBarProcessList: [],
                activeMenuAuditSate: 1,
                queryBarIsQuote: null,
                queryBarIsReport: null,
                isReportList: [
                    {
                        id: 'true',
                        name: '已报工'
                    },
                    {
                        id: 'false',
                        name: '未报工'
                    }
                ],
                isQuoteList: [
                    {
                        id: 'true',
                        name: '已引用'
                    },
                    {
                        id: 'false',
                        name: '未引用'
                    }
                ],
                globalLoadingShow: false,
                menuArr: [],
                pageHeights: null,
                orderToDate: '',
                orderFromDate: '',
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
                        title: '订单日期',
                        key: 'orderDate',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '订单编号',
                        key: 'code',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left',
                        render: (h, params) => {
                            if (parseFloat(params.row.auditState) === 1) {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'orderDetail',
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
                                                _this.editClickEvent(params.row.id);
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
                                                    path: 'orderDetail',
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
                        title: '订单类型',
                        key: 'typeName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '产品',
                        key: 'productCode',
                        align: 'left',
                        minWidth: 200,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productCode ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            })
                        }
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '计量单位',
                        key: 'unitCode',
                        align: 'left',
                        minWidth: 110,
                        sortable: true,
                        render: (h,params)=>{
                            return h('div',{
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            })
                        }
                    },
                    {
                        title: '生产数量',
                        key: 'productionQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '订单优先级',
                        key: 'priorityName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '引用状态',
                        key: 'isQuoteName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '报工状态',
                        key: 'isReport',
                        align: 'center',
                        minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.isReport ? '已报工' : '未报工'
                                }
                            })
                        }
                    },
                    {
                        title: '计划员',
                        key: 'plannerName',
                        minWidth: 110,
                        align: 'left',
                        sortable: true
                    }
                ],
                tableData: [],
                queryBarOrderSate: '1',
                queryBarOrderSateList: [],
                queryBarEmergencyState: '',
                queryBarEmergencyStateList: [],
                showMore: false,
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarOrderCode: '',
                queryBarMaterielId: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 获取id
            getAllIdMethods (array) {
                let ids = array.map((item)=>  item.id);
                return ids;
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.activeMenuAuditSate = obj.id;
                this.queryBarMaterielId = '';
                this.queryBarEmergencyState = '';
                this.queryBarIsQuote = null;
                this.queryBarIsReport = null;
                this.queryBarOrderCode = '';
                this.orderFromDate = '';
                this.orderToDate = '';
                this.queryBarProcessId = '';
                this.getListHttp();
                this.getMenuHttp();
            },
            getMenuHttp () {
                return this.$call('prd.order.stateCount', {workshopId: this.queryBarWorkshopValue}).then(res => {
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
            deleteCancel () {
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
                this.deleteMsg = '';
            },
            // 删除的确认按钮
            deleteConfirm () {
                this.deleteButtonLoading = true;
                this.$api.order.deleteHttp(this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                        noticeTips(this, 'deleteTips');
                        this.getMenuHttp();
                        this.getListHttp();
                        this.checkArr = [];
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
            // 获取查询栏的产品
            queryBarMaterialEnterEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 获取查询栏的订单编号
            queryBarOrderCodeEnterEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 获取页码
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 获取每页的条数
            pageChangeEvent (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListHttp();
            },
            // 查询栏的请求
            getListHttp () {
                this.tableLoading = true;
                this.queryBarMaterielId = clearSpace(this.queryBarMaterielId);
                this.queryBarOrderCode = clearSpace(this.queryBarOrderCode);
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarEmergencyState = this.queryBarEmergencyState || '';
                this.queryBarIsQuote = this.queryBarIsQuote || '';
                this.queryBarIsReport = this.queryBarIsReport || '';
                this.orderFromDate ? this.orderFromDate = formatDate(this.orderFromDate).split(' ')[0] : this.orderFromDate = '';
                this.orderToDate ? this.orderToDate = formatDate(this.orderToDate).split(' ')[0] : this.orderToDate = '';
                return this.$call('prd.order.list', {
                    dateFrom: this.orderFromDate,
                    dateTo: this.orderToDate,
                    code: this.queryBarOrderCode,
                    product: this.queryBarMaterielId,
                    auditState: this.activeMenuAuditSate,
                    priority: this.queryBarEmergencyState,
                    workshopId: this.queryBarWorkshopValue,
                    isQuote: this.queryBarIsQuote,
                    isReport: this.queryBarIsReport,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    processId: this.queryBarProcessId
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
                this.globalLoadingShow = true;
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
                this.getMenuHttp();
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 编辑的事件
            editClickEvent (id) {
                this.$router.push({
                    path: 'editOrder',
                    query: {
                        id: id,
                        edit: true,
                        activated: true
                    }
                });
            },
            // 筛选栏的省略号点击事件
            showScreenChange () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                if (this.showMore) {
                    this.showMore = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => { this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30); }, 0);
                } else if (this.showMore === false) {
                    this.showMore = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => { this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30); }, 0);
                };
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.order.closeHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.checkArr = [];
                            noticeTips(this, 'closeTips');
                            this.getMenuHttp();
                            this.getListHttp();
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反关闭的事件
            unCloseEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.$api.order.uncloseHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.checkArr = [];
                            noticeTips(this, 'unCloseTips');
                            this.getMenuHttp();
                            this.getListHttp();
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 提交事件
            pushEvent () {
                if (this.checkArr.length !== 0) {
                    this.submitHttp(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 撤销事件
            cancelEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.$api.order.cancelHttp(this.getAllIdMethods(this.checkArr)).then(res => {
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
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    this.auditHttp(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditEvent () {
                let isQuote = false;
                this.checkArr.forEach((item)=>{ if (item.isQuote === true || item.isReport === true) isQuote = true; });
                if (this.checkArr.length !== 0) {
                    // 未被引用和未包装报工的才能撤销审核
                    if (!isQuote) {
                        this.unAuditHttp()
                    } else {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '单据已被引用或包装报工，不能进行撤销审核!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$api.order.unapproveHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditHttp (checkId) {
                this.$api.order.approveHttp(checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
            },
            submitHttp (checkId) {
                this.$api.order.submitHttp(checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'submitTips');
                        this.checkArr = [];
                    };
                });
            },
            // 新增的方法
            addClick (e) {
                this.$router.push({
                    path: 'addOrder',
                    query: {
                        add: true,
                        activated: true
                    }
                });
            },
            // 获取默认车间
            getWorkshopHttp () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopValue = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                    }
                });
            },
            // 订单优先级
            getPriorityListHttp () {
                return this.$call('dict.list', {parentCode: 'priority_type'}).then(res => {
                    if (res.data.status === 200) {
                        this.queryBarEmergencyStateList = res.data.res;
                    };
                });
            },
            // 计算table高度
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
            // 获取依赖数据
            async getDependentDataHttp () {
                this.globalLoadingShow = true;
                await this.getWorkshopHttp();
                await this.getMenuHttp();
                await this.getPriorityListHttp();
                await this.getProcessListHttp();
                await this.getListHttp();
            },
            getProcessListHttp () {
                return this.$api.common.userDefaultProcessRequest().then(res => {
                    if (res.data.status === 200) {
                        this.queryBarProcessId = res.data.res.processDefaultId;
                        this.queryBarProcessList = res.data.res.processList;
                    };
                });
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            _this = this;
            this.$nextTick(() => { this.calculationTableHeight(); });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDependentDataHttp();
            };
            this.$nextTick(() => { this.calculationTableHeight(); });
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>


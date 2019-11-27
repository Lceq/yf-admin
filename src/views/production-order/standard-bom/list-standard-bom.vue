<template>
    <left-menu
            :stateList="menuArr"
            :curTabStateId="activeMenuAuditSate"
            @on-select="getClickMenuEvent"
    >
        <div slot="content">
            <global-loading v-show="contentLoadingSpinShow"></global-loading>
            <Row type="flex" justify="space-between" align="middle">
                <Col>
                    <Row type="flex" justify="start">
                        <Button icon="md-add" v-show="activeMenuAuditSate===1" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                        <Button icon="ios-undo" v-show="activeMenuAuditSate===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                        <Button icon="md-done-all" v-show="activeMenuAuditSate===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                        <Button icon="md-refresh" v-show="activeMenuAuditSate===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                        <Button icon="md-close" v-show="activeMenuAuditSate===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                        <Button icon="ios-undo-outline" v-show="activeMenuAuditSate===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                        <Button icon="ios-trash" v-show="activeMenuAuditSate===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <Row type="flex" justify="end">
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">开始日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles queryBarMarginRight" v-model="billFromDate"></DatePicker>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">结束日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles queryBarMarginRight" v-model="billToDate"></DatePicker>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<span class="labelWidth">生产车间:</span>-->
                                    <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择生产车间" class="searchHurdles">
                                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row type="flex" justify="end" v-show="showMore">
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">生产单号:</p>-->
                                    <Input type="text" v-model.trim="queryBarOrderCodeValue" placeholder="请输入生产单号" class="searchHurdles queryBarMarginRight" @on-enter="queryBarOrderCodeEnterEvent"/>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">引用状态:</p>-->
                                    <Select clearable v-model="queryBarIsQuote" placeholder="请选择引用状态" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in isQuoteList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">所属产品:</p>-->
                                    <Input type="text" v-model.trim="queryBarProductValue" placeholder="请输入产品编号或名称" class="searchHurdles"/>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="searchButtonStyle margin-bottom-10">
                            <a class="moreStyle" @click="showMoreEvent">···</a>
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
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    export default {
        name: 'manufacture-list',
        components: {
            tipsModal, leftMenu
        },
        data () {
            return {
                toCreated: false,
                queryBarIsQuote: null,
                isQuoteList: [
                    {id: 'true', name: '已引用'},
                    {id: 'false', name: '未引用'}
                ],
                contentLoadingSpinShow: false,
                menuArr: [],
                activeMenuAuditSate: 1,
                pageHeights: null,
                billToDate: '',
                billFromDate: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                tableHeader: [
                    {type: 'selection', width: 60, fixed: 'left', align: 'center'},
                    {title: '单据日期', key: 'date', align: 'left', fixed: 'left', sortable: true, minWidth: 110},
                    {
                        title: '制造BOM单号',
                        key: 'code',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left',
                        render: (h, params) => {
                            if (parseInt(params.row.auditState) === 1) {
                                return h('div', [
                                    h('a', {
                                        domProps: {
                                            innerHTML: params.row.code
                                        },
                                        on: {
                                            click: () => {
                                                _this.$router.push({
                                                    path: 'detail-standard-bom',
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
                                                    path: 'detail-standard-bom',
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
                    {title: '生产单号', key: 'prdOrderCode', align: 'left', minWidth: 110, sortable: true},
                    {title: '生产车间', key: 'workshopName', align: 'left', minWidth: 110, sortable: true},
                    {title: '产品', key: 'productName', align: 'left', minWidth: 200,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '规格', key: 'productModels', align: 'left', minWidth: 140, sortable: true},
                    {title: '批号', key: 'batchCode', align: 'left', minWidth: 110, sortable: true},
                    {title: '单位', key: 'unitName', align: 'left', minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName + '(' + params.row.unitCode + ')'
                                }
                            });
                        }
                    },
                    {title: '生产数量', key: 'productionQty', align: 'right', minWidth: 110, sortable: true},
                    {title: '单据状态', key: 'auditStateName', minWidth: 110, align: 'center', sortable: true},
                    {title: '引用状态', key: 'isQuoteName', align: 'center', minWidth: 110, sortable: true},
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
                queryBarOrderCodeValue: '',
                queryBarProductValue: '',
                tableLoading: false,
                tableHeight: 0
            };
        },
        methods: {
            // 新增的事件
            addClickEvent () {
                this.$router.push({
                    path: 'add-standard-bom',
                    query: {activated: true}
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
                this.activeMenuAuditSate = menuData.id;
                this.queryBarOrderSate = menuData.id + '';
                this.queryBarOrderCodeValue = '';
                this.queryBarIsQuote = null;
                this.queryBarProductValue = '';
                this.billFromDate = '';
                this.billToDate = '';
                this.getListHttp();
            },
            getMenuHttp () {
                return this.$call('bom.stateCount', {
                    workshopId: this.queryBarWorkshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            if (item.id === 1) item.name = '待提交';
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
                this.$api.manufacture.deleteHttp(this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                        noticeTips(this, 'deleteTips');
                        this.getMenuHttp();
                        this.getListHttp();
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
            // 获取查询栏的订单编号
            queryBarOrderCodeEnterEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 获取页码
            getPage (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 获取每页的条数
            pageChange (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListHttp();
            },
            // 查询栏的请求
            getListHttp () {
                this.tableLoading = true;
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarOrderSate = this.queryBarOrderSate || '';
                this.queryBarIsQuote = this.queryBarIsQuote || '';
                this.billFromDate ? this.billFromDate = formatDate(this.billFromDate).split(' ')[0] : this.billFromDate = '';
                this.billToDate ? this.billToDate = formatDate(this.billToDate).split(' ')[0] : this.billToDate = '';
                return this.$call('bom.list', {
                    dateFrom: this.billFromDate,
                    dateTo: this.billToDate,
                    prdOrderCode: this.queryBarOrderCodeValue,
                    product: this.queryBarProductValue,
                    auditState: this.queryBarOrderSate,
                    workshopId: this.queryBarWorkshopValue,
                    isQuote: this.queryBarIsQuote,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.tableLoading = false;
                        translateState(res.data.res);
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
                        this.checkArr = [];
                        this.contentLoadingSpinShow = false;
                    };
                });
            },
            // 搜索按钮的点击事件
            queryBarSearchButtonClickEvent () {
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
                    path: 'edit-standard-bom',
                    query: {
                        id: id,
                        edit: true,
                        activated: true
                    }
                });
            },
            // 筛选栏的省略号点击事件
            showMoreEvent () {
                let tableDom = document.getElementsByClassName('table-bar')[0];
                if (this.showMore) {
                    this.showMore = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                } else if (this.showMore === false) {
                    this.showMore = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                };
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.manufacture.closeHttp(this.getAllIdMethods(this.checkArr)).then(res => {
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
                    // 反关闭的请求
                    this.$api.manufacture.uncloseHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.checkArr = [];
                            noticeTips(this, 'unCloseTips');
                            this.getMenuHttp();
                            this.getListHttp();
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 撤销事件
            cancelEvent (e) {
                if (this.checkArr.length !== 0) {
                    this.$api.manufacture.cancelHttp(this.getAllIdMethods(this.checkArr)).then(res => {
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
            // 审核和反审核的方法
            unAuditEvent (e) {
                let isQuote = false;
                this.checkArr.forEach((item)=>{ if (item.isQuote === true) isQuote = true; });
                if (this.checkArr.length !== 0) {
                    // 未被引用的才能撤销审核
                    if (!isQuote) {
                        this.unAuditHttp();
                    } else {
                        noticeTips(this, 'quoteTips');
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$api.manufacture.unapproveHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditHttp (checkId) {
                this.$api.manufacture.approveHttp(checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
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
            getDependentDataHttp () {
                this.contentLoadingSpinShow = true;
                (async () => {
                    await this.getWorkshopHttp();
                    await this.getMenuHttp();
                    await this.getListHttp();
                })();
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            _this = this;
            this.calculationTableHeight();
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


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
                        <Button icon="md-add" v-show="activeMenuAuditSate===1" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                        <Button icon="ios-undo" v-show="activeMenuAuditSate===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                        <Button icon="md-done-all" v-show="activeMenuAuditSate===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                        <Button icon="md-refresh" v-show="activeMenuAuditSate===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                        <Button icon="md-close" v-show="activeMenuAuditSate===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭</Button>
                        <Button icon="ios-undo-outline" v-show="activeMenuAuditSate===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                        <Button icon="ios-trash" v-show="activeMenuAuditSate===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="space-between" class="query-bar">
                        <Col>
                            <Row type="flex" justify="space-between"  class="screenRightCenter">
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
                                    <Select clearable v-model="queryBarWorkshopValue" placeholder="生产车间" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <!--<p class="labelWidth">所属班次:</p>-->
                                    <Select clearable v-model="queryBarShiftValue" placeholder="请选择班次" class="searchHurdles queryBarMarginRight">
                                        <Option v-for="item in queryBarShiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="flexAlignCenter margin-bottom-10">
                                    <Select clearable v-model="queryBarProcessValue" class="searchHurdles" placeholder="请选择生产工序">
                                        <Option v-for="item in queryBarProcessList" :style="item.style" :value="item.id" :key="item.deptId">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Button icon="ios-search" type="primary" @click="queryBarSearchButtonClickEvent" class="queryButtonStyle searchMargin margin-bottom-10">搜索</Button>
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
        components: {
            tipsModal, leftMenu
        },
        data () {
            return {
                queryBarProcessValue: null,
                queryBarProcessList: [],
                toCreated: false,
                globalLoadingShow: false,
                menuArr: [],
                activeMenuAuditSate: 1,
                pageHeights: null,
                billToDate: '',
                billFromDate: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                tableHeader: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 70,
                        fixed: 'left'
                    },
                    {
                        title: '报工日期',
                        align: 'left',
                        sortable: true,
                        minWidth: 120,
                        fixed: 'left',
                        key: 'belongDate'
                    },
                    {
                        title: '报工单号',
                        align: 'left',
                        sortable: true,
                        minWidth: 160,
                        fixed: 'left',
                        key: 'code',
                        render: (h, params) => {
                            if (parseInt(params.row.auditState) === 1) {
                                return h('div', [
                                    h('a', {
                                        on: {
                                            'click': () => {
                                                _this.$router.push({path: 'report-detail',
                                                    query: {
                                                        id: params.row.id,
                                                        activated: true
                                                    }
                                                });
                                            }
                                        }
                                    }, params.row.code),
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
                                                _this.$router.push({
                                                    path: 'editReport',
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
                                return h('a', {
                                    on: {
                                        'click': () => {
                                            _this.$router.push({
                                                path: 'report-detail',
                                                query: {
                                                    id: params.row.id,
                                                    activated: true
                                                }
                                            });
                                        }
                                    }
                                }, params.row.code);
                            }
                        }
                    },
                    {
                        title: '生产车间',
                        align: 'left',
                        sortable: true,
                        minWidth: 120,
                        key: 'workshopName'
                    },
                    {
                        title: '班次',
                        minWidth: 100,
                        align: 'left',
                        sortable: true,
                        key: 'shiftName'
                    },
                    {
                        title: '工序',
                        align: 'center',
                        minWidth: 100,
                        sortable: true,
                        key: 'processName'
                    },
                    {
                        title: '当班产量',
                        align: 'right',
                        minWidth: 120,
                        sortable: true,
                        key: 'shiftOutput'
                    },
                    {
                        title: '当班产量(KG)',
                        align: 'right',
                        minWidth: 120,
                        sortable: true,
                        key: 'shiftQty'
                    },
                    // {
                    //     title: '损耗率',
                    //     align: 'right',
                    //     sortable: true,
                    //     minWidth: 120,
                    //     key: 'wasteRate'
                    // },
                    {
                        title: '审核状态',
                        align: 'center',
                        sortable: true,
                        minWidth: 120,
                        key: 'auditStateName'
                    },
                    {
                        title: '创建人',
                        minWidth: 120,
                        align: 'center',
                        sortable: true,
                        key: 'createName'
                    },
                    {
                        title: '创建时间',
                        minWidth: 120,
                        align: 'center',
                        sortable: true,
                        key: 'createTime'
                    }
                ],
                tableData: [],
                queryBarOrderSate: '1',
                queryBarOrderSateList: [],
                queryBarWorkshopList: [],
                queryBarWorkshopValue: '',
                defaultWorkshop: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarShiftValue: '',
                queryBarShiftList: [],
                tableLoading: false,
                tableHeight: document.documentElement.clientHeight - 334
            };
        },
        methods: {
            // 获取工序
            getProcessHttp () {
                return this.$call('process.list', {  auditState: 3,
                    state: 1, isReport: true }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{
                            if (parseInt(item.parentId) !== 0) {
                                item.style = 'margin-left:10px;';
                                item.renderStyle = '10px';
                            }
                        });
                        this.queryBarProcessList = res.data.res;
                    };
                });
            },
            // 新增的事件
            addClickEvent () {
                this.$router.push({path: 'addReport', query: {activated: true}});
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
                this.billToDate = '';
                this.billFromDate = '';
                this.queryBarShiftValue = '';
                this.queryBarProcessValue = null;
                this.getListHttp();
            },
            getMenuHttp () {
                return this.$call('prd.report.state.count', {
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
                this.$call('prd.report.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
                this.queryBarShiftValue = this.queryBarShiftValue || '';
                this.queryBarProcessValue = this.queryBarProcessValue || '';
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarOrderSate = this.queryBarOrderSate || '';
                this.billFromDate ? this.billFromDate = formatDate(this.billFromDate) : this.billFromDate = '';
                this.billToDate ? this.billToDate = formatDate(this.billToDate) : this.billToDate = '';
                return this.$call('prd.report.list', {
                    dateFrom: this.billFromDate.split(' ')[0],
                    dateTo: this.billToDate.split(' ')[0],
                    shiftId: this.queryBarShiftValue,
                    auditState: this.queryBarOrderSate,
                    workshopId: this.queryBarWorkshopValue,
                    processId: this.queryBarProcessValue,
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
                    path: 'editManufactureBOM',
                    query: {
                        id: id,
                        edit: true,
                        activated: true
                    }
                });
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('prd.report.close', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('prd.report.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('prd.report.cancel', this.getAllIdMethods(this.checkArr)).then(res => {
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
                if (this.checkArr.length !== 0) {
                    this.unAuditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$call('prd.report.unapprove', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditHttp (checkId) {
                this.$call('prd.report.approve', checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
            },
            // 获取默认车间
            getWorkshop () {
                return this.$api.dept.getUserWorkshop().then(res => {
                    res.curWorkshopId ? this.queryBarWorkshopValue = res.curWorkshopId : this.queryBarWorkshopValue = res.workshopList[0].deptId;
                    res.curWorkshopId ? this.defaultWorkshop = res.curWorkshopId : this.defaultWorkshop = res.workshopList[0].deptId;
                    this.queryBarWorkshopList = res.workshopList;
                });
            },
            // 获取班次列表数据
            getShiftListHttp () {
                return this.$call('shift.list', {auditState: 3}).then(res => {
                    if (res.data.status === 200) {
                        this.queryBarShiftList = res.data.res;
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
            // 获取依赖数据
            async getDependentDataHttp () {
                this.globalLoadingShow = true;
                await this.getShiftListHttp();
                await this.getWorkshop();
                await this.getMenuHttp();
                await this.getProcessHttp();
                await this.getListHttp();
            }
        },
        created () {
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

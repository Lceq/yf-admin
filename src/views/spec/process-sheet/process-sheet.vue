<template>
    <left-menu
            :stateList="menuArr"
            :curTabStateId="activeMenuAuditSate"
            @on-select="getClickMenuEvent"
    >
        <div slot="content">
            <global-loading v-show="globalLoadingShow"></global-loading>
            <Row type="flex" justify="space-between" align="middle">
                <Row type="flex" justify="start">
                    <Button icon="md-add" v-show="activeMenuAuditSate===1" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                    <!--<Button icon="ios-create" v-show="pushSwitch" type="primary" @click="pushEvent" class="queryBarMarginRight margin-bottom-10">提交</Button>-->
                    <Button icon="ios-undo" v-show="activeMenuAuditSate===2" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                    <Button icon="md-done-all" v-show="activeMenuAuditSate===2" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                    <Button icon="md-refresh" v-show="activeMenuAuditSate===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                    <Button icon="md-lock" v-show="activeMenuAuditSate===3" type="error" @click="disableEvent" class="queryBarMarginRight margin-bottom-10">禁用</Button>
                    <Button icon="md-unlock" v-show="activeMenuAuditSate===3" type="info" @click="enableEvent" class="queryBarMarginRight margin-bottom-10">启用</Button>
                    <Button icon="ios-trash" v-show="activeMenuAuditSate===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                </Row>
                <Col>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <Row type="flex" justify="space-between" class="screenRightCenter">
                                <Col class="margin-bottom-10 padding-left-4">
                                    <!--<p class="labelWidth">开始日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择日期时间" class="searchHurdles" v-model="queryBarOrderFromDate"></DatePicker>
                                </Col>
                                <Col class="margin-bottom-10 padding-left-4">
                                    <!--<p class="labelWidth">结束日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择日期时间" class="searchHurdles" v-model="queryBarOrderToDate"></DatePicker>
                                </Col>
                                <Col class="margin-bottom-10 padding-left-4">
                                    <!--<p class="labelWidth">工艺单号:</p>-->
                                    <Input type="text" v-model="queryBarSheetValue" class="searchHurdles" @on-enter="queryBarSpecSheetEnterEvent" placeholder="请输入工艺单号"/>
                                </Col>
                            </Row>
                            <Row type="flex" justify="end" v-show="showMore">
                                <Col class="margin-bottom-10 padding-left-4">
                                    <!--<p class="labelWidth">禁用状态:</p>-->
                                    <Select clearable v-model="queryBarDisableStatus" class="searchHurdles" placeholder="请选择禁用状态">
                                        <Option v-for="item in queryBarDisableStatusList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                                <Col class="margin-bottom-10 padding-left-4">
                                    <!--<p class="labelWidth">所属产品:</p>-->
                                    <Input type="text" v-model="queryBarMaterialName" class="searchHurdles" @on-enter="queryBarMaterielEnterEvent" placeholder="请输入产品编号或名称"/>
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
                            <Button icon="ios-search" type="primary" @click="searchClickEvent" class="queryButtonStyle">搜索</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row class="tableOffsetTop margin-bottom-10">
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
                    :tipMsg="deleteModalMsg"
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
    import { noticeTips, compClientHeight, clearSpace, toDay, translateState, formatDate, setPage } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    let _this = this;
    export default{
        components: { tipsModal, leftMenu },
        data () {
            return {
                queryBarProcessId: '',
                queryBarProcessList: [],
                globalLoadingShow: false,
                menuArr: [],
                activeMenuAuditSate: 1,
                pageHeights: null,
                queryBarOrderToDate: '',
                queryBarOrderFromDate: '',
                deleteModalStatus: false,
                deleteModalMsg: '',
                deleteButtonLoading: false,
                queryBarSheetValue: '',
                queryBarDisableStatus: '',
                queryBarWorkshopValue: null,
                queryBarDisableStatusList: [],
                queryBarMaterialName: '',
                showMore: false,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '单据日期',
                        key: 'specDate',
                        sortable: true,
                        align: 'left',
                        minWidth: 110,
                        fixed: 'left'
                    },
                    {
                        title: '工艺单号',
                        key: 'code',
                        sortable: true,
                        align: 'left',
                        fixed: 'left',
                        minWidth: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            _this.editClickEvent(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        sortable: true,
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '禁用状态',
                        key: 'enableStateName',
                        sortable: true,
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '产品',
                        key: 'productCode',
                        minWidth: 200,
                        sortable: true,
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '规格型号',
                        key: 'productModels',
                        sortable: true,
                        align: 'left',
                        minWidth: 110
                    },
                    {
                        title: '工艺员',
                        key: 'specUserName',
                        sortable: true,
                        align: 'left',
                        minWidth: 100
                    },
                    {
                        title: '生产工序',
                        key: 'processName',
                        sortable: true,
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        sortable: true,
                        align: 'center',
                        minWidth: 100
                    }
                ],
                tableData: [],
                pageTotal: 1,
                pageIndex: 1,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                checkArr: [],
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 启用事件
            enableEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.specSheet.enableHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getListHttp();
                            this.getMenuHttp();
                            this.checkArr = [];
                            noticeTips(this, 'enableTips');
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 禁用事件
            disableEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.specSheet.disableHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'disableTips');
                            this.getListHttp();
                            this.getMenuHttp();
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    this.auditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取勾选的对象
            selectionChangeEvent (currentRow) {
                this.checkArr = currentRow;
            },
            // 获取id
            getAllIdMethods (array) {
                let ids = array.map((item) => item.id);
                return ids;
            },
            // 反审核的方法
            unAuditEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.specSheet.unapproveHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuHttp();
                            this.getListHttp();
                            noticeTips(this, 'unAuditTips');
                            this.checkArr = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 提交事件
            pushEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.specSheet.submitHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                        if (res.data.status === 200) {
                            this.getMenuHttp();
                            this.getListHttp();
                            noticeTips(this, 'submitTips');
                            this.checkArr = [];
                        }
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 撤销事件
            cancelEvent () {
                if (this.checkArr.length !== 0) {
                    this.$api.specSheet.cancelHttp(this.getAllIdMethods(this.checkArr)).then(res => {
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
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.activeMenuAuditSate = obj.id;
                this.queryBarSheetValue = '';
                this.queryBarDisableStatus = '';
                this.queryBarProcessId = null;
                this.queryBarMaterialName = '';
                this.queryBarOrderFromDate = '';
                this.queryBarOrderToDate = '';
                this.getListHttp();
            },
            // 获取左侧选项卡
            getMenuHttp () {
                return this.$call('spec.sheet.stateCount').then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            item.id === 1 ? item.name = '待提交' : false;
                        });
                        this.menuArr = res.data.res;
                    };
                });
            },
            deleteCancel () {
                this.deleteModalStatus = false;
                this.deleteButtonLoading = false;
                this.deleteModalMsg = '';
            },
            // 删除的确认按钮
            deleteConfirm () {
                this.deleteButtonLoading = true;
                this.$api.specSheet.deleteHttp(this.getAllIdMethods(this.checkArr)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteModalStatus = false;
                        this.deleteButtonLoading = false;
                        noticeTips(this, 'deleteTips');
                        this.getListHttp();
                        this.getMenuHttp();
                        this.checkArr = [];
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的方法
            deleteEvent () {
                if (this.checkArr.length !== 0) {
                    this.deleteModalStatus = true;
                    this.deleteModalMsg = '确认删除？';
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 编辑的点击事件
            editClickEvent (id) {
                this.$router.push({
                    path: 'editProSheet',
                    query: {
                        id: id,
                        activated: true
                    }
                });
            },
            // 获取产品
            queryBarMaterielEnterEvent () {
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListHttp();
            },
            // 查询的事件
            searchClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 获取工艺单号
            queryBarSpecSheetEnterEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 查询的请求
            getListHttp () {
                this.tableLoading = true;
                this.queryBarProcessId = this.queryBarProcessId || '';
                this.queryBarSheetValue = clearSpace(this.queryBarSheetValue);
                this.queryBarMaterialName = clearSpace(this.queryBarMaterialName);
                this.queryBarOrderFromDate !== '' ? this.queryBarOrderFromDate = formatDate(this.queryBarOrderFromDate) : this.queryBarOrderFromDate = '';
                this.queryBarOrderToDate !== '' ? this.queryBarOrderToDate = formatDate(this.queryBarOrderToDate) : this.queryBarOrderToDate = '';
                return this.$call('spec.sheet.list', {
                    'dateFrom': this.queryBarOrderFromDate.split(' ')[0],
                    'dateTo': this.queryBarOrderToDate.split(' ')[0],
                    'code': this.queryBarSheetValue,
                    'auditState': this.activeMenuAuditSate,
                    'enableState': this.queryBarDisableStatus,
                    'processId': this.queryBarProcessId,
                    'productNameCode': this.queryBarMaterialName,
                    'pageIndex': this.pageIndex,
                    'pageSize': this.pageSize
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableLoading = false;
                        this.tableData = translateState(res.data.res);
                        this.pageTotal = res.data.count;
                        this.checkArr = [];
                        this.globalLoadingShow = false;
                    }
                });
            },
            // 获取页码
            getPageEvent (e) {
                this.tableLoading = true;
                this.pageIndex = e;
                this.getListHttp();
            },
            // 获取每页条数
            pageChangeEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 新增的事件
            addClickEvent (e) {
                this.$router.push({
                    path: 'addProSheet',
                    query: {
                        activated: true
                    }
                });
            },
            // 审核的请求
            auditHttp () {
                this.$api.specSheet.auditHttp(this.getAllIdMethods(this.checkArr)).then(res => {
                    this.getListHttp();
                    this.getMenuHttp();
                    this.checkArr = [];
                    noticeTips(this, 'auditTips');
                });
            },
            // 显示更多的事件
            showScreenChange () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                if (this.showMore) {
                    this.showMore = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 42;
                    setTimeout(() => { this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights); }, 0);
                } else if (this.showMore === false) {
                    this.showMore = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 42;
                    setTimeout(() => { this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights); }, 0);
                };
            },
            // 获取禁用下拉数据
            getDisableStatusHttp () {
                return this.$api.specSheet.disableStateListHttp().then((res) => {
                    if (res.data.status === 200) { this.queryBarDisableStatusList = res.data.res; };
                });
            },
            getProcessListHttp () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.queryBarProcessList = res;
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
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
                this.getProcessListHttp();
                this.getMenuHttp();
                this.getDisableStatusHttp();
                this.getListHttp();
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

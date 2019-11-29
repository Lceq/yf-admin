<template>
    <div>
        <left-menu
                :stateList="menuArr"
                :curTabStateId="isSync"
                @on-select="getClickMenuEvent"
        >
            <div slot="content">
                <global-loading v-show="globalLoadingShow"></global-loading>
                <Row type="flex" justify="space-between" align="middle">
                    <Col>
                        <Button icon="ios-trash" v-show="isSync===0" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Col>
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col>
                                <Row type="flex" justify="space-between">
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Input type="text" v-model="queryBarErpCode" placeholder="请输入SAP订单编号" class="inputLength"/>
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
                        title: '操作',
                        key: 'date',
                        align: 'center',
                        fixed: 'left',
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.isSync ? true : false
                                },
                                on: {
                                    'click': () => {
                                        _this.syncDataEvent(params.row.id);
                                    }
                                }
                            }, '数据同步')
                        }
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
                        title: 'SAP编号',
                        key: 'erpCode',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 160,
                        align: 'left'
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
                            });
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
                        title: '生产数量',
                        key: 'productionQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '交货开始日期',
                        key: 'deliveryDateFrom',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '交货结束日期',
                        key: 'deliveryDateTo',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建日期',
                        key: 'createTime',
                        align: 'center',
                        minWidth: 140,
                        sortable: true
                    }
                ],
                tableData: [],
                isSync: 0,
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarErpCode: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 同步事件
            syncDataEvent (id) {
                this.$router.push({
                    path: 'add-erp-order',
                    query: { id, activated: true }
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
                this.isSync = menuData.id;
                this.queryBarErpCode = '';
                this.getListRequest();
                this.getMenuRequest();
            },
            getMenuRequest () {
                return this.$call('erp.order.stateCount', {workshopId: this.queryBarWorkshopValue}).then(res => {
                    if (res.data.status === 200) {
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
                this.$call('erp.order.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
                this.queryBarErpCode = clearSpace(this.queryBarErpCode) || '';
                return this.$call('erp.order.list', {
                    erpCode: this.queryBarErpCode,
                    isSync: Boolean(this.isSync),
                    // workshopId: this.queryBarWorkshopValue,
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
            // 获取默认车间
            getWorkshop () {
                return this.$api.dept.getUserWorkshop().then(res => {
                    res.curWorkshopId ? this.queryBarWorkshopValue = res.curWorkshopId : this.queryBarWorkshopValue = res.workshopList[0].deptId;
                    this.queryBarWorkshopList = res.workshopList;
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
            async getDependentDataHttp () {
                this.globalLoadingShow = true;
                await this.getWorkshop();
                await this.getMenuRequest();
                await this.getListRequest();
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


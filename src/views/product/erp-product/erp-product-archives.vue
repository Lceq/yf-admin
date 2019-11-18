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
                        <Row type="flex" justify="start">
                            <Button icon="ios-trash" v-show="isSync===0" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col>
                                <Row type="flex" justify="space-between">
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Input type="text" v-model="queryBarProduct" placeholder="请输入ERP物料编号或名称" class="inputLength"/>
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
        <save-modal
                :saveModalDetailData="saveModalDetailData"
                :saveModalState="saveModalState"
                @on-visible-change="saveModalStateChangeEvent"
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
                saveModalDetailData: {},
                saveModalState: false,
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
                                domProps: {
                                    innerHTML: '数据同步'
                                },
                                props: {
                                    size: 'small',
                                    disabled: params.row.isSync ? true : false
                                },
                                on: {
                                    'click': () => {
                                        this.syncDataEvent(params.row);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '组织编号',
                        key: 'pkOrgCode',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 160
                    },
                    {
                        title: 'ERP物料编号',
                        key: 'code',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: 'ERP物料名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '存货类型',
                        key: 'typeName',
                        minWidth: 100,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '规格型号',
                        key: 'models',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '物料分类名称',
                        key: 'categoryName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '计量单位编号',
                        key: 'unitCode',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '计量单位名称',
                        key: 'unitName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '是否封存',
                        key: 'sffc',
                        minWidth: 100,
                        sortable: true,
                        render: (h, params) => {
                            let translateName = '';
                            if (params.row.sffc === 0) {
                                translateName = '未启用';
                            } else if (params.row.sffc === 1) {
                                translateName = '已启用';
                            }if (params.row.sffc === 2) {
                                translateName = '已停用';
                            };
                            return h('div', {
                                domProps: {
                                    innerHTML: translateName
                                }
                            })
                        }
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
                queryBarProduct: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 确认按钮事件
            saveModalConfirmEvent () {
                this.getListRequest();
                this.getMenuRequest();
                this.saveModalState = false;
            },
            // 取消按钮事件
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            saveModalStateChangeEvent (e) {
                this.saveModalState = e;
                if (!e) { this.saveModalDetailData = {}; };
            },
            // 同步事件
            syncDataEvent (rowVal) {
                this.saveModalState = true;
                // 排除物料分类id为0(id等于0指mes不存在该物料)
                if (rowVal.categoryId) {
                    rowVal.materialType = this.getFatherPath(rowVal.path, rowVal.categoryId);
                };
                rowVal.enableBatch = true;
                rowVal.isReused = false;
                this.saveModalDetailData = rowVal;
            },
            // 获取上级的id
            getFatherPath (str, id) {
                let splitFatherPath = str.split(',');
                let fatherPath = [];
                splitFatherPath.forEach((item) => {
                    if (item !== '') { fatherPath.push(Number(item)); };
                });
                fatherPath.push(id);
                return fatherPath;
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
                this.queryBarProduct = '';
                this.getListRequest();
            },
            getMenuRequest () {
                return this.$call('erp.product.stateCount', {workshopId: this.queryBarWorkshopValue}).then(res => {
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
                this.$call('erp.product.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
                this.queryBarProduct = clearSpace(this.queryBarProduct) || '';
                return this.$call('erp.product.list', {
                    erpProduct: this.queryBarProduct,
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


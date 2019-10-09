<template>
    <div>
        <left-menu
                :stateList="menuArr"
                :curTabStateId="isActive"
                @on-select="getClickMenuEvent"
        >
            <div slot="content">
                <global-loading v-show="globalLoadingShow"></global-loading>
                <Row type="flex" justify="end" align="middle">
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
                                        <Select clearable v-model="queryBarPackAreaValue" placeholder="请选择排包区域" class="searchHurdles">
                                            <Option v-for="item in packAreaList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </Col>
                                    <Col class="padding-left-4 margin-bottom-10">
                                        <Input type="text" v-model="queryBarBatchCode" placeholder="请输入批号" class="searchHurdles"/>
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
                        <Table :height="tableHeight" size="small" :loading="tableLoading" border ref="selection" :columns="isActive===0?closeTableHeader:openTableHeader" :data="tableData"></Table>
                    </Col>
                </Row>
                <Row class="pageHeight">
                    <Col class="pageStyle">
                        <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChangeEvent"></Page>
                    </Col>
                </Row>
            </div>
        </left-menu>
        <open-save-modal
                :spinShow="unopenedSaveModalSpinShow"
                :saveModalState="unopenedSaveModalState"
                :saveModalTitle="unopenedSaveModalTitle"
                :saveModalData="unopenedSaveModalData"
                @on-visible-change="unopenedSaveModalStateChange"
                @on-confirm="unopenedSaveModalConfirmEvent"
                @on-cancel="unopenedSaveModalCancelEvent"
        ></open-save-modal>
        <cancel-open-modal
                :tipsModalState="cancelOpenModalState"
                :tipsModalMessage="cancelOpenModalStateMessage"
                :confirmButtonLoading="cancelOpenModalConfirmButLoading"
                @confirm-event="cancelOpenModalConfirmEvent"
                @cancel-event="cancelOpenModalCancelEvent"
        ></cancel-open-modal>
    </div>
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight, emptyTips } from '../../../libs/common';
    import leftMenu from '../../layout/layout';
    import openSaveModal from './open-save-modal';
    import moreOrder from '../archives/more-order';
    import cancelOpenModal from '../../components/tips-modal';
    export default {
        name: 'blendArchives',
        components: { leftMenu, openSaveModal, moreOrder, cancelOpenModal },
        data () {
            return {
                cancelOpenModalStateMessage: '',
                cancelOpenIds: null,
                cancelOpenModalState: false,
                cancelOpenModalConfirmButLoading: false,
                apiPrefix: 'prd.material.feeding.openingList',
                queryBarPackAreaValue: null,
                unopenedSaveModalSpinShow: false,
                packAreaList: [],
                unopenedSaveModalData: {},
                unopenedSaveModalTitle: '',
                unopenedSaveModalState: false,
                machinePackModalState: false,
                globalLoadingShow: false,
                menuArr: [],
                isActive: 0,
                pageHeights: null,
                openTableHeader: [
                    {
                        title: '操作',
                        key: 'code',
                        align: 'center',
                        fixed: 'left',
                        sortable: true,
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        _this.editOpenClickEvent(params.row.id);
                                    }
                                }
                            }, '取消开台')
                        }
                    },
                    {
                        title: '排包区域',
                        key: 'packingAreaName',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '生产批号',
                        key: 'batchCode',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '投料包数',
                        key: 'packetQty',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '投料重量',
                        key: 'weightQty',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '开台时间',
                        key: 'startTime',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '开台产量表数',
                        key: 'startOutput',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '生产订单号',
                        key: 'prdOrderCodes',
                        minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: typeof params.row.prdOrderCodes === 'string' ? JSON.parse(params.row.prdOrderCodes) : params.row.prdOrderCodes
                                }
                            });
                        }
                    }
                ],
                closeTableHeader: [
                    {
                        title: '操作',
                        key: 'code',
                        align: 'center',
                        fixed: 'left',
                        sortable: true,
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        _this.editClickEvent(params.row.prdMaterialFeedingId);
                                    }
                                }
                            }, '开台')
                        }
                    },
                    {
                        title: '排包区域',
                        key: 'packingAreaName',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '生产批号',
                        key: 'batchCode',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '投料包数',
                        key: 'packetQty',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '投料重量',
                        key: 'weightQty',
                        minWidth: 110,
                        sortable: true,
                        align: 'right'
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '生产订单号',
                        key: 'prdOrderCodes',
                        minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: typeof params.row.prdOrderCodes === 'string' ? JSON.parse(params.row.prdOrderCodes) : params.row.prdOrderCodes
                                }
                            });
                        }
                    }
                ],
                tableData: [],
                queryBarProcessId: null,
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarBatchCode: '',
                tableLoading: false,
                tableHeight: 0,
                toCreated: false,
                defaultWorkshop: {}
            };
        },
        methods: {
            // 取消开台modal确认按钮
            cancelOpenModalConfirmEvent () {
                this.cancelOpenModalConfirmButLoading = true;
                this.$call('prd.material.feeding.opening.cancel.start', {id: this.cancelOpenIds}).then(res => {
                    if (res.data.status === 200) {
                        emptyTips(this, '取消清花开台成功!');
                        this.cancelOpenModalConfirmButLoading = false;
                        this.cancelOpenModalState = false;
                        this.getListRequest();
                        this.getMenuRequest();
                    } else {
                        this.cancelOpenModalConfirmButLoading = false;
                    };
                })
            },
            // 取消开台modal取消按钮
            cancelOpenModalCancelEvent () {
                this.cancelOpenModalState = false;
                this.cancelOpenModalConfirmButLoading = false;
                this.cancelOpenModalStateMessage = '';
            },
            editOpenClickEvent (id) {
                this.cancelOpenIds = id;
                this.cancelOpenModalState = true;
                this.cancelOpenModalStateMessage = '确认取消清花开台?';
            },
            // 编辑的事件
            editClickEvent (prdMaterialFeedingId) {
                this.unopenedSaveModalState = true;
                this.unopenedSaveModalSpinShow = true;
                this.unopenedSaveModalTitle = '清花开台';
                this.$call('prd.material.feeding.open.detail', {prdMaterialFeedingId}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.startScheduleId = res.data.res.scheduleId;
                        this.unopenedSaveModalData = res.data.res;
                        this.unopenedSaveModalSpinShow = false;
                    };
                });
            },
            // 确认按钮事件
            unopenedSaveModalConfirmEvent () {
                this.unopenedSaveModalState = false;
                this.getListRequest();
                this.getMenuRequest();
            },
            unopenedSaveModalCancelEvent () {
                this.unopenedSaveModalState = false;
            },
            // 监听保存modal
            unopenedSaveModalStateChange (e) {
                this.unopenedSaveModalState = e;
            },
            getPackAreaListRequest () {
                return this.$call('packing.area.list', {auditState: 3}).then(res => { this.packAreaList = res.data.res; });
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
                this.queryBarPackAreaValue = null;
                this.queryBarBatchCode = '';
                this.getListRequest();
            },
            getMenuRequest () {
                return this.$call('prd.material.feeding.opening.start.num', {
                    workshopId: this.queryBarWorkshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach(item => {item.count = item.num; });
                        this.menuArr = res.data.res;
                    };
                });
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
                this.isActive = this.isActive || 0;
                this.queryBarBatchCode = clearSpace(this.queryBarBatchCode) || '';
                let apiPreFix = '';
                this.isActive === 0 ? apiPreFix = 'prd.material.feeding.openingList' : apiPreFix = 'prd.material.feeding.opening.list';
                return this.$call(apiPreFix, {
                    batchCode: this.queryBarBatchCode,
                    workshopId: this.queryBarWorkshopValue,
                    packingAreaId: this.queryBarPackAreaValue,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    openingState: this.isActive === 1 ? 1 : '' // 已开台
                }).then((res) => {
                    if (res.data.status === 200) {
                        this.tableLoading = false;
                        translateState(res.data.res);
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
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
            // 获取依赖数据
            async getDependentDataRequest () {
                this.globalLoadingShow = true;
                await this.getPackAreaListRequest();
                await this.getWorkshopListRequest();
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


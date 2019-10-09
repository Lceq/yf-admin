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
                            <Button icon="md-done-all" v-show="isActive===1" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                            <Button icon="md-refresh" v-show="isActive===3" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                            <Button icon="md-close" v-show="isActive===3" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                            <Button icon="ios-undo-outline" v-show="isActive===4" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                            <Button icon="ios-trash" v-show="isActive===1" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                        </Row>
                    </Col>
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col class="padding-left-4 margin-bottom-10">
                                <Select clearable v-model="queryBarWorkshopValue" placeholder="请选择车间" class="searchHurdles queryBarMarginRight">
                                    <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </Col>
                            <Col>
                                <Input v-model="queryBarMachine" placeholder="请输入机台编号或名称" class="queryBarMarginRight searchHurdles"/>
                            </Col>
                            <Col>
                                <Input v-model="queryBarVersionNumber" placeholder="请输入版本号" class="queryBarMarginRight searchHurdles"/>
                            </Col>
                            <Col class="searchButtonStyle margin-bottom-10">
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
        <machine-pack-modal
                :isCopy="isCopy"
                :isEdit="isEdit"
                :cottonPackChartId="cottonPackChartId"
                :spinShow="machinePackModalSpinShow"
                :machinePackModalState="machinePackModalState"
                :machinePackModalData="machinePackModalData"
                @on-visible-change="machinePackModalStateChangeEvent"
                @on-cancel="machinePackModalCancelEvent"
                @on-confirm="machinePackModalConfirmEvent"
        ></machine-pack-modal>
    </div>
</template>
<script>
    let _this = this;
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    import machinePackModal from './machine-pack-modal';
    import detailPackModal from './detail-pack-modal.vue';
    export default {
        name: 'cottonArchives',
        components: { tipsModal, leftMenu, machinePackModal, detailPackModal },
        data () {
            return {
                isEdit: false,
                queryBarVersionNumber: '',
                queryBarMachine: '',
                isCopy: false,
                cottonPackChartId: null,
                machinePackModalSpinShow: false,
                cottonArchivesList: [],
                machinePackModalData: {},
                machinePackModalState: false,
                globalLoadingShow: false,
                menuArr: [],
                isActive: 1,
                pageHeights: null,
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
                discFloralShow: '',
                tableHeader: [],
                tableHeaderColumns: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        fixed: 'left',
                        sortable: true,
                        width: 90,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                domProps: {
                                    innerHTML: '复制'
                                },
                                on: {
                                    'click': () => {
                                        this.copyEvent(params.row.id);
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '排包日期',
                        key: 'cottonPackingDate',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        width: 130,
                        render: (h, params) => {
                            return h('div', {
                                style: {display: 'flex'}
                            }, [
                                h('p', {
                                    domProps: {
                                        innerHTML: params.row.cottonPackingDate
                                    },
                                    style: {
                                        width: '110px'
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
                                            this.editEvent(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '配棉日期',
                        key: 'date',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '配棉版本号',
                        key: 'versionNumber',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110,
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
                        title: '机台编号',
                        key: 'machineCode',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '机台名称',
                        key: 'machineName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '排包区域',
                        key: 'packingAreaName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '抓包方式',
                        key: 'typeName',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    }
                ],
                tableData: [],
                queryBarOrderSate: '1',
                queryBarOrderSateList: [],
                queryBarWorkshopList: [],
                queryBarWorkshopValue: null,
                checkArr: [],
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                tableLoading: false,
                tableHeight: 0,
                toCreated: false
            };
        },
        methods: {
            // 复制
            copyEvent (id) {
                this.isCopy = true;
                this.machinePackModalState = true;
                this.machinePackModalSpinShow = true;
                this.getCottonChartDetailRequest(id);
            },
            // 编辑
            editEvent (id) {
                this.isEdit = true;
                this.machinePackModalState = true;
                this.machinePackModalSpinShow = true;
                this.getCottonChartDetailRequest(id)
            },
            // 获取配棉排包图详情
            getCottonChartDetailRequest (id) {
                this.cottonPackChartId = id;
                this.$call('prd.cotton.blending.area.detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.machinePackModalSpinShow = false;
                        let responseData = res.data.res;
                        responseData.cottonArchivesList = JSON.parse(JSON.stringify(this.cottonArchivesList));
                        if (this.isCopy) this.$delete(responseData, 'id');
                        this.machinePackModalData = this.setColorMethod(responseData);
                    };
                })
            },
            // 设置颜色
            setColorMethod (responseData) {
                responseData.outPacketColorList = [];
                responseData.innerPacketColorList = [];
                let placeList = [];
                // placeList是缝包数的集合，byProductList是缝的下拉副产品集合
                if (responseData.placeList && responseData.placeList.length !== 0) {
                    placeList = [responseData.placeList[0]];
                    placeList[0].byProductList = responseData.byProductList;
                    // 赋值默认平均重量和包数
                    placeList.forEach(bigItem => {
                        bigItem.byProductList.forEach(item => {
                            if (bigItem.msPrdCottonBlendingMaterialId === item.id) {
                                bigItem.packetWeight = item.packetWeight;
                                bigItem.packetQty = item.packetQty;
                            };
                        });
                    });
                    responseData.hasCrevice = true;// eChart根据hasCrevice是否渲染缝
                } else {
                    responseData.hasCrevice = false;
                    responseData.lapWastePacketQty = 0;
                    placeList = [];
                };
                responseData.creviceTableData = placeList;
                responseData.outerPlaceList.map((item) => {
                    item.rawMaterialList = responseData.rawMaterialList;
                    // 有缝（有副产品）
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 包和缝都存在
                        if (item.mpProductId && item.msProductId) {
                            responseData.outPacketColorList.push('#2b85e4');
                            responseData.outPacketColorList.push('#ff9900');
                        } else {
                            // 包存在
                            item.mpProductId ? responseData.outPacketColorList.push('#2b85e4') : responseData.outPacketColorList.push('#fff');
                            // 缝存在
                            item.msProductId ? responseData.outPacketColorList.push('#ff9900') : responseData.outPacketColorList.push('#fff');
                        };
                    } else {
                        // 无缝（没有副产品）
                        item.mpProductId ? responseData.outPacketColorList.push('#2b85e4') : responseData.outPacketColorList.push('#fff');
                    };
                    return item;
                });
                responseData.innerPlaceList.map((item) => {
                    item.rawMaterialList = responseData.rawMaterialList;
                    // 有缝（有副产品）
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 包和缝都存在
                        if (item.mpProductId && item.msProductId) {
                            responseData.innerPacketColorList.push('#2b85e4');
                            responseData.innerPacketColorList.push('#ff9900');
                        } else {
                            // 包存在
                            item.mpProductId ? responseData.innerPacketColorList.push('#2b85e4') : responseData.innerPacketColorList.push('#fff');
                            // 缝存在
                            item.msProductId ? responseData.innerPacketColorList.push('#ff9900') : responseData.innerPacketColorList.push('#fff');
                        };
                    } else {
                        // 无缝（没有副产品）
                        item.mpProductId ? responseData.innerPacketColorList.push('#2b85e4') : responseData.innerPacketColorList.push('#fff');
                    };
                    return item;
                });
                return responseData;
            },
            // 新增的方法
            addEvent () {
                this.machinePackModalState = true;
                this.machinePackModalData = {
                    packAreaList: [],
                    auditState: 1,
                    lapWastePacketQty: 0,
                    materialPacketQty: 1,
                    cottonPackingDate: toDay(),
                    cottonArchivesList: JSON.parse(JSON.stringify(this.cottonArchivesList))
                };
            },
            // 排包modal确认事件
            machinePackModalConfirmEvent () {
                this.machinePackModalState = false;
                this.getListRequest();
                this.getMenuRequest();
            },
            // 排包modal取消事件
            machinePackModalCancelEvent () {
                this.machinePackModalState = false;
            },
            // 监听机台排包
            machinePackModalStateChangeEvent (e) {
                this.machinePackModalState = e;
                if (e === false) {
                    this.isEdit = false;
                    this.isCopy = false;
                    this.cottonPackChartId = null;
                    this.machinePackModalSpinShow = false;
                };
            },
            // 机台排包事件
            machinePackEvent (id) {
                this.machinePackModalState = true;
            },
            submitCancel () {
                this.discFloralShow = false;
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
                this.queryBarVersionNumber = '';
                this.queryBarMachine = '';
                this.getListRequest();
            },
            getMenuRequest () {
                return this.$call('prd.cotton.blending.area.stateCount', {
                    workshopId: this.queryBarWorkshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => { if (item.id === 1) item.name = '待审核' });
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
                this.$call('prd.cotton.blending.area.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
                this.queryBarOrderSate = this.queryBarOrderSate || '';
                this.queryBarMachine = clearSpace(this.queryBarMachine);
                this.queryBarVersionNumber = clearSpace(this.queryBarVersionNumber);
                return this.$call('prd.cotton.blending.area.list', {
                    auditState: this.queryBarOrderSate,
                    workshopId: this.queryBarWorkshopValue,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex,
                    machine: this.queryBarMachine,
                    versionNumber: this.queryBarVersionNumber
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
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    this.auditHttp(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('prd.cotton.blending.area.close', this.getAllIdMethods(this.checkArr)).then(res => {
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
            unCloseEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('prd.cotton.blending.area.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
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
            // 审核和反审核的方法
            unAuditEvent () {
                if (this.checkArr.length !== 0) {
                    this.unAuditHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核
            unAuditHttp () {
                this.$call('prd.cotton.blending.area.cancel', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            // 审核
            auditHttp (checkId) {
                this.$call('prd.cotton.blending.area.approve', checkId).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuRequest();
                        this.getListRequest();
                        noticeTips(this, 'auditTips');
                        this.checkArr = [];
                    };
                });
            },
            // 获取默认车间
            getWorkshopRequest () {
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
            // 获取配棉档案列表数据
            getCottonArchivesListRequest () {
                return this.$call('prd.cotton.blending.list', { auditState: 3 }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.cottonArchivesList = responseData;
                    };
                });
            },
            // 获取依赖数据
            async getDependentDataRequest () {
                this.globalLoadingShow = true;
                await this.getWorkshopRequest();
                await this.getMenuRequest();
                await this.getCottonArchivesListRequest();
                await this.getListRequest();
            }
        },
        created () {
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

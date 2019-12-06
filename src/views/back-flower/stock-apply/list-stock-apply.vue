<template>
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
                        <Button icon="md-add" v-show="addSwitch" type="primary" @click="addClickEvent" class="queryBarMarginRight margin-bottom-10">新增</Button>
                        <Button icon="ios-undo" v-show="submitSwitch" type="primary" @click="submitEvent" class="queryBarMarginRight margin-bottom-10">提交</Button>
                        <Button icon="ios-undo" v-show="cancelSwitch" type="warning" @click="cancelEvent" class="queryBarMarginRight margin-bottom-10">撤销提交</Button>
                        <Button icon="md-done-all" v-show="auditSwitch" type="primary" @click="auditEvent" class="queryBarMarginRight margin-bottom-10">审核</Button>
                        <Button icon="md-refresh" v-show="againstSwitch" type="warning" @click="unAuditEvent" class="queryBarMarginRight margin-bottom-10">撤销审核</Button>
                        <Button icon="md-close" v-show="closeSwitch" type="error" @click="closeEvent" class="queryBarMarginRight margin-bottom-10">关闭单据</Button>
                        <Button icon="ios-undo-outline" v-show="openSwitch" type="warning" @click="unCloseEvent" class="queryBarMarginRight margin-bottom-10">撤销关闭</Button>
                        <Button icon="ios-trash" v-show="deleteSwitch" type="error" @click="deleteEvent" class="queryBarMarginRight margin-bottom-10">删除</Button>
                    </Row>
                </Col>
                <Col>
                    <Row type="flex" justify="space-between">
                        <Col>
                            <Row type="flex" justify="space-between">
                                <Col class="padding-left-4 margin-bottom-10">
                                    <!--<p class="labelWidth">开始日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles" v-model="billFromDate"></DatePicker>
                                </Col>
                                <Col class="padding-left-4 margin-bottom-10">
                                    <!--<p class="labelWidth">结束日期:</p>-->
                                    <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles" v-model="billToDate"></DatePicker>
                                </Col>
                                <Col class="padding-left-4 margin-bottom-10">
                                    <!--<span class="labelWidth">生产车间:</span>-->
                                    <Select clearable v-model="queryBarWorkshopValue" placeholder="生产车间" class="searchHurdles">
                                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </Col>
                                <Col class="padding-left-4 margin-bottom-10">
                                    <!--<p class="labelWidth">单据编号:</p>-->
                                    <Input type="text" v-model="queryBarCodeValue" placeholder="请输入单据编号" class="searchHurdles" @on-enter="queryBarCodeEvent"/>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="searchButtonStyle margin-bottom-10">
                            <Button icon="ios-search" type="primary" @click="queryBarSearchButtonClickEvent" class="marginButtonLeft">搜索</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row class="table-bar margin-bottom-10">
                <Col>
                    <Table @on-expand="onExpandEvent" @on-selection-change="selectionChangeEvent" :height="tableHeight" size="small" :loading="tableLoading" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <Row class="pageHeight">
                <Col class="pageStyle">
                    <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPage" :show-sizer="true" @on-page-size-change="pageChange"></Page>
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
            <save-modal
                    :saveModalTitle="saveModalTitle"
                    :saveModalState="saveModalState"
                    :saveModalDetailData="saveModalDetailData"
                    :saveModalSpinShow="saveModalSpinShow"
                    :isDisableConfirm="isDisableConfirm"
                    :saveModalButtonLoading="saveModalButtonLoading"
                    :saveAndSubmitButtonLoading="saveAndSubmitButtonLoading"
                    :saveModalWorkshopList="queryBarWorkshopList"
                    :saveModalDefaultWorkshop="defaultWorkshop"
                    :saveModalShowOther="saveModalShowOther"
                    @onVisibleChangeEvent="onVisibleChangeEvent"
                    @saveModalConfirmEvent="saveModalConfirmEvent"
                    @saveAndSubmitEvent="saveAndSubmitEvent"
                    @saveModalCancelEvent="saveModalCancelEvent"
                    @saveModalGetSelectProductEvent="saveModalGetSelectProductEvent"
            ></save-modal>
            <detail-modal
                    :detailModalSpinShow="detailModalSpinShow"
                    :detailModalState="detailModalState"
                    :detailModalData="detailModalData"
                    @detailModalVisibleChangeEvent="detailModalVisibleChangeEvent"
                    @detailModalCancelEvent="detailModalCancelEvent"
            ></detail-modal>
        </div>
    </left-menu>
</template>
<script>
    import { noticeTips, formatDate, toDay, setPage, clearSpace, toDaySeconds, translateState, compClientHeight, emptyTips } from '../../../libs/common';
    import tipsModal from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    import saveModal from './save-modal';
    import expandRow from './table-expand.vue';
    import detailModal from './detail-modal';
    export default {
        components: {
            tipsModal, leftMenu, saveModal, detailModal
        },
        data () {
            return {
                globalLoadingShow: false,
                detailModalSpinShow: false,
                detailModalState: false,
                detailModalData: {},
                saveModalShowOther: false,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        type: 'expand',
                        width: 80,
                        title: '展开更多',
                        align: 'center',
                        fixed: 'left',
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row.inStockApplyDetailList
                                }
                            })
                        }
                    },
                    {
                        title: '单据日期',
                        key: 'date',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '单据编号',
                        key: 'code',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left',
                        render: (h, params) => {
                            if (parseFloat(params.row.auditState) === 1) {
                                return h('div', [
                                    h('Tooltip', {
                                        props: {
                                            transfer: true,
                                            content: '查看详情'
                                        }
                                    }, [
                                        h('a', {
                                            domProps: {
                                                innerHTML: params.row.code
                                            },
                                            on: {
                                                click: () => {
                                                    this.seeDetailEvent(params.row.id);
                                                }
                                            }
                                        })
                                    ]),
                                    h('Tooltip', {
                                        props: {
                                            transfer: true,
                                            content: '点击进行编辑'
                                        }
                                    }, [
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
                                                    this.editClickEvent(params.row.id, params.row);
                                                }
                                            }
                                        })
                                    ])
                                ]);
                            } else {
                                return h('div', [
                                    h('Tooltip', {
                                        props: {
                                            transfer: true,
                                            content: '查看详情'
                                        }
                                    }, [
                                        h('a', {
                                            domProps: {
                                                innerHTML: params.row.code
                                            },
                                            on: {
                                                click: () => {
                                                    this.seeDetailEvent(params.row.id);
                                                }
                                            }
                                        })
                                    ])
                                ]);
                            };
                        }
                    },
                    {
                        title: '入库状态',
                        key: 'inStockStateName',
                        align: 'center',
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
                        title: '申请包数',
                        key: 'totalNumber',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '申请重量',
                        key: 'totalQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    }
                ],
                initSaveData: {
                    code: '自动生成申请单号',
                    date: toDay(),
                    productId: null,
                    productName: '',
                    productModels: '',
                    workshopId: null,
                    workshopName: '',
                    totalQty: 0,
                    totalNumber: 0,
                    unitId: null,
                    unitCode: '',
                    unitName: '',
                    processId: null,
                    processCode: '',
                    processName: '',
                    batchCode: '',
                    qty: null,
                    remark: '',
                    packerIds: [],
                    packerNames: [],
                    shiftId: null,
                    shiftName: '',
                    inStockApplyDetailList: [{
                        productId: null,
                        productName: '',
                        productModels: '',
                        unitId: null,
                        unitCode: '',
                        unitName: '',
                        productCode: null,
                        processId: null,
                        processCode: '',
                        processName: '',
                        remoteProductList: [],
                        productList: [],
                        remoteBatchCodeList: [],
                        batchCodeList: [],
                        batchCode: '',
                        remark: '',
                        packNumber: 0,
                        qty: 0,
                        packetWeight: 0
                    }],
                    userList: []
                },
                saveModalDetailData: {},
                saveModalSpinShow: false,
                defaultWorkshop: null,
                isDisableConfirm: false,
                saveModalButtonLoading: false,
                saveAndSubmitButtonLoading: false,
                saveModalState: false,
                saveModalTitle: '',
                menuArr: [],
                isActive: 1,
                pageHeights: null,
                billToDate: '',
                billFromDate: '',
                deleteModalStatus: false,
                deleteMsg: '',
                deleteButtonLoading: false,
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
                queryBarCodeValue: '',
                tableLoading: false,
                addSwitch: true,
                auditSwitch: false,
                againstSwitch: false,
                submitSwitch: true,
                cancelSwitch: false,
                deleteSwitch: true,
                closeSwitch: false,
                openSwitch: false,
                tableHeight: document.documentElement.clientHeight - 334,
            };
        },
        methods: {
            detailModalCancelEvent () {
                this.detailModalState = false;
            },
            seeDetailEvent (id) {
                this.detailModalState = true;
                this.getDetailHttp(id).then(res => {
                    if (res.data.status === 200) {
                        this.detailModalSpinShow = false;
                        res.data.res.packerIds = JSON.parse(res.data.res.packerIds);
                        res.data.res.packerNames = JSON.parse(res.data.res.packerNames);
                        res.data.res.userList = this.initSaveData.userList;
                        this.detailModalData = res.data.res;
                    };
                });
            },
            detailModalVisibleChangeEvent (e) {
                this.detailModalState = e;
            },
            submitEvent () {
                if (this.checkArr.length !== 0) {
                    this.submitHttp(this.getAllIdMethods(this.checkArr));
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // table展开事件
            onExpandEvent (row,expanded) {
                if (expanded === true) {
                    this.$set(row, '_expanded', true);
                } else {
                    this.$set(row, '_expanded', false);
                }
            },
            // 新增的事件
            addClickEvent () {
                this.saveModalTitle = '新增入库申请';
                this.saveModalState = true;
                this.saveModalShowOther = false;
                this.saveModalDetailData = JSON.parse(JSON.stringify(this.initSaveData));
            },
            // 获取班次
            getScheduleRequest () {
                return this.$call('schedule.list3', {
                    belongDate: toDay().split(' ')[0],
                    workshopId: this.defaultWorkshop
                }).then(res => {
                    if (res.data.status === 200) {
                        if (res.data.res.length !== 0) {
                            this.initSaveData.shiftList = res.data.res;
                        } else {
                            this.initSaveData.shiftList = res.data.res;
                        };
                    };
                });
            },
            // 编辑的事件
            editClickEvent (id, row) {
                this.saveModalTitle = '编辑入库申请';
                this.saveModalShowOther = true;
                this.saveModalSpinShow = true;
                this.saveModalState = true;
                this.getDetailHttp(id).then(res => {
                    if (res.data.status === 200) {
                        (async () => {
                            for await (let allProductItem of res.data.res.inStockApplyDetailList) {
                                allProductItem.batchCodeList = [{ batchCode: allProductItem.batchCode }];
                                if (allProductItem.productCode) {
                                    allProductItem.productList = [{ code: allProductItem.productCode, label: `${allProductItem.productName}(${allProductItem.productCode})` }];
                                };
                                // 获取产品对应所有批号
                                await this.getProductToBatchCodeListHttp(allProductItem.productCode).then(res => {
                                    if (res.data.status === 200) { allProductItem.remoteBatchCodeList = res.data.res; };
                                });
                            };
                            res.data.res.userList = this.initSaveData.userList;
                            res.data.res.packerIds = JSON.parse(res.data.res.packerIds);
                            res.data.res.packerNames = JSON.parse(res.data.res.packerNames);
                            this.saveModalDetailData = res.data.res;
                            this.saveModalSpinShow = false;
                        })();
                    };
                });
            },
            // 获取物料对应的批号
            getProductToBatchCodeListHttp (productCode, batchCode = '', pageIndex = '', pageSize = setPage.pageSize) {
                return this.$call('product.batch.list', {
                    productNameCode: productCode,
                    batchCode: batchCode,
                    auditState: 3,
                    pageIndex: pageIndex,
                    pageSize: pageSize
                });
            },
            getDetailHttp (id) {
                return this.$call('in.stock.apply.detail', { id: id });
            },
            saveModalGetSelectProductEvent () {

            },
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            saveModalConfirmEvent (data) {
                data.date = formatDate(data.date);
                let isEmpty = false;
                data.inStockApplyDetailList.forEach((item)=>{
                   if (!item.productCode || !item.batchCode || !item.qty) { isEmpty = true; };
                });
                if (isEmpty === false) {
                    this.saveModalButtonLoading = true;
                    this.saveHttp(data).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'saveTips');
                            this.getMenuHttp();
                            this.getListHttp();
                            this.saveModalButtonLoading = false;
                            this.saveModalState = false;
                        } else {
                            this.saveModalButtonLoading = false;
                        };
                    });
                } else {
                    emptyTips(this, '请将产品信息填写完整!');
                };
            },
            // 保存并提交事件
            saveAndSubmitEvent (data) {
                let isEmpty = false;
                data.inStockApplyDetailList.forEach((item)=>{
                    if (!item.productCode || !item.batchCode || !item.qty) {
                        isEmpty = true;
                    };
                });
                if (isEmpty === false) {
                    this.saveAndSubmitButtonLoading = true;
                    this.saveHttp(data).then(res => {
                        if (res.data.status === 200) {
                            this.submitHttp([res.data.res]);
                        } else {
                            this.saveAndSubmitButtonLoading = false;
                        };
                    });
                } else {
                    this.$Notice.warning({
                        title: '提示',
                        desc: '请将产品信息填写完整!'
                    });
                };
            },
            // 提交请求
            submitHttp (ids) {
                this.$call('in.stock.apply.submit', ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'submitTips');
                        this.getMenuHttp();
                        this.getListHttp();
                        this.saveAndSubmitButtonLoading = false;
                        this.saveModalState = false;
                    } else {
                        this.saveAndSubmitButtonLoading = false;
                    };
                });
            },
            // 保存请求
            saveHttp (data) {
                data.inStockApplyDetailList.forEach((item)=>{this.$delete(item, 'id');});
                data.packerIds = JSON.stringify(data.packerIds);
                data.packerNames = JSON.stringify(data.packerNames);
                return this.$call('in.stock.apply.save', data);
            },
            onVisibleChangeEvent (e) {
                this.saveModalState = e;
                if (!e) {
                    this.saveModalButtonLoading = false;
                    this.saveAndSubmitButtonLoading = false;
                };
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
                switch (menuData.id) {
                    case 1: // 保存
                        this.addSwitch = true;
                        this.submitSwitch = true;
                        this.cancelSwitch = false;
                        this.auditSwitch = false;
                        this.againstSwitch = false;
                        this.deleteSwitch = true;
                        this.closeSwitch = false;
                        this.openSwitch = false;
                        break;
                    case 2: // 审核
                        this.addSwitch = false;
                        this.submitSwitch = false;
                        this.cancelSwitch = true;
                        this.auditSwitch = true;
                        this.againstSwitch = false;
                        this.deleteSwitch = false;
                        this.closeSwitch = false;
                        this.openSwitch = false;
                        break;
                    case 3: // 反审核
                        this.addSwitch = false;
                        this.submitSwitch = false;
                        this.cancelSwitch = false;
                        this.auditSwitch = false;
                        this.againstSwitch = true;
                        this.deleteSwitch = false;
                        this.closeSwitch = true;
                        this.openSwitch = false;
                        break;
                    case 4: // 关闭
                        this.addSwitch = false;
                        this.submitSwitch = false;
                        this.cancelSwitch = false;
                        this.auditSwitch = false;
                        this.againstSwitch = false;
                        this.deleteSwitch = false;
                        this.closeSwitch = false;
                        this.openSwitch = true;
                        break;
                };
                this.queryBarOrderSate = menuData.id + '';
                this.queryBarCodeValue = '';
                this.billFromDate = '';
                this.billToDate = '';
                this.queryBarCodeValue = '';
                this.getListHttp();
            },
            getMenuHttp () {
                return this.$call('in.stock.apply.stateCount', {
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
                this.$call('in.stock.apply.delete', this.getAllIdMethods(this.checkArr)).then((res) => {
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
            // 查询栏的单据编号
            queryBarCodeEvent () {
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
                this.queryBarCodeValue = clearSpace(this.queryBarCodeValue);
                this.queryBarWorkshopValue = this.queryBarWorkshopValue || '';
                this.queryBarOrderSate = this.queryBarOrderSate || '';
                this.billFromDate ? this.billFromDate = formatDate(this.billFromDate).split(' ')[0] : this.billFromDate = '';
                this.billToDate ? this.billToDate = formatDate(this.billToDate).split(' ')[0] : this.billToDate = '';
                return this.$call('in.stock.apply.list', {
                    dateFrom: this.billFromDate,
                    dateTo: this.billToDate,
                    code: this.queryBarCodeValue,
                    auditState: this.queryBarOrderSate,
                    workshopId: this.queryBarWorkshopValue,
                    pageSize: this.pageSize,
                    pageIndex: this.pageIndex
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item)=>{ item._expanded = false; })
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
            // 关闭事件
            closeEvent () {
                if (this.checkArr.length !== 0) {
                    this.$call('in.stock.apply.close', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('in.stock.apply.unclose', this.getAllIdMethods(this.checkArr)).then(res => {
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
                    this.$call('in.stock.apply.cancel', this.getAllIdMethods(this.checkArr)).then(res => {
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
                this.$call('in.stock.apply.unapprove', this.getAllIdMethods(this.checkArr)).then(res => {
                    if (res.data.status === 200) {
                        this.getMenuHttp();
                        this.getListHttp();
                        noticeTips(this, 'unAuditTips');
                        this.checkArr = [];
                    };
                });
            },
            auditHttp (checkId) {
                this.$call('in.stock.apply.approve', checkId).then(res => {
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
                        this.defaultWorkshop = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                        console.log(this.queryBarWorkshopList,'opList');
                        
                        this.initSaveData.workshopId = responseData.defaultDeptId;
                        this.initSaveData.workshopName = responseData.defaultDeptName;
                    }
                });
            },
            // 获取人员列表
            getUserListRequest () {
                return this.$call('user.list', {
                    isSupplement: false,
                    onJob: true,
                    state: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        this.initSaveData.userList = res.data.res;
                    };
                })
            }
        },
        created () {
            this.globalLoadingShow = true;
            (async () => {
                await this.getWorkshopHttp();
                await this.getScheduleRequest();
                await this.getUserListRequest();
                await this.getMenuHttp();
                await this.getListHttp();
            })();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('table-bar')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights);
            window.onresize = () => {
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 130 + this.pageHeights + 30);
            };
        }
    };
</script>


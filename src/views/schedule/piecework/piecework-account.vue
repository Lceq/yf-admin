<template>
    <left-menu
            :stateList="menuArr"
            :curTabStateId="activeMenuAuditSate"
            @on-select="getClickMenuEvent"
    >
        <div slot="content">
            <global-loading v-show="globalLoadingShow"></global-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button v-show="activeMenuAuditSate === 1" type="success" @click="addPieceWorkEvent" class="margin-bottom-10">计件核算</Button>
                    <Button v-show="activeMenuAuditSate === 1" type="warning" @click="cancelPieceWorkEvent" class="margin-bottom-10">取消核算</Button>
                    <Button v-show="activeMenuAuditSate === 1" icon="md-done-all" type="primary" @click="auditEvent" class="margin-bottom-10">审核</Button>
                    <Button v-show="activeMenuAuditSate === 3" icon="md-refresh" type="warning" @click="unAuditEvent" class="margin-bottom-10">撤销审核</Button>
                    <Button type="primary" @click="refreshPieceWorkEvent" icon="md-refresh" class="margin-bottom-10">刷新</Button>
                </Col>
                <Col>
                    <DatePicker type="date" v-model="queryBarBeginDate" placeholder="请选择开始日期" class="searchHurdles margin-bottom-10"></DatePicker>
                    <DatePicker type="date" v-model="queryBarEndDate" placeholder="请选择结束日期" class="searchHurdles margin-bottom-10"></DatePicker>
                    <Select clearable v-model="queryBarWorkshopId" class="searchHurdles" placeholder="请选择车间">
                        <Option v-for="(item, index) in queryBarWorkshopList" :value="item.deptId" :style="item.deptId" :key="index">{{ item.deptName }}</Option>
                    </Select>
                    <Button icon="ios-search" type="primary" @click="clickSearchEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="margin-bottom-10 tableOffsetTop">
                <Col>
                    <Table @on-selection-change="getCheckEvent" :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <Row class="pageHeight">
                <Col class="pageStyle">
                    <Page :placement="pageUp" :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChange"></Page>
                </Col>
            </Row>
            <piece-work-output-modal
                    :pieceWorkOutputModalShow="pieceWorkOutputModalShow"
                    :pieceWorkOutputModalState="pieceWorkOutputModalState"
                    :pieceWorkDetailData="pieceWorkDetailData"
                    @on-visible-change="pieceWorkOutputModalStateChangeEvent"
                    @user-output-modal-confirm-event="userOutputModalConfirmEvent"
            ></piece-work-output-modal>
            <add-piece-work-modal
                    :addPieceWorkModalState="addPieceWorkModalState"
                    :addPieceWorkFromData="addPieceWorkFromData"
                    :addPieceWorkModalConfirmLoading="addPieceWorkModalConfirmLoading"
                    @on-visible-change="addPieceWorkModalStateChangeEvent"
                    @confirm-event="addPieceWorkModalStateConfirmEvent"
                    @cancel-event="addPieceWorkModalStateCancelEvent"
            ></add-piece-work-modal>
            <tips-modal
                    :tipsIcon="'md-help-circle'"
                    :tipsModalMessage="tipsModalMessage"
                    :tipsModalState="tipsModalState"
                    :confirmButtonLoading="tipsModalConfirmButtonLoading"
                    @cancel-event="tipsModalCancelEvent"
                    @confirm-event="tipsModalConfirmEvent"
            ></tips-modal>
        </div>
    </left-menu>
</template>
<script>
    import deleteTips from '../../public/deleteWarning';
    import { noticeTips, clearSpace, compClientHeight, setPage, toDay, formatDate, emptyTips, translateState } from '../../../libs/common';
    import otherMessage from '../../components/otherMessage';
    import pieceWorkOutputModal from './piecework-output-modal';
    import addPieceWorkModal from './add-piecework-modal';
    import tipsModal from '../../components/tips-modal';
    import leftMenu from '../../layout/layout';
    let _this = this;
    export default {
        components: { deleteTips, otherMessage, pieceWorkOutputModal, addPieceWorkModal, tipsModal, leftMenu },
        data () {
            return {
                saveData: {},
                isCancelPieceWork: false,
                menuArr: [],
                activeMenuAuditSate: 1,
                toCreated: false,
                detailId: null,
                tipsModalConfirmButtonLoading: false,
                tipsModalMessage: '',
                checkData: [],
                tipsModalState: false,
                pieceWorkOutputModalShow: false,
                addPieceWorkModalConfirmLoading: false,
                pieceWorkDetailData: {},
                defaultWorkshop: null,
                addPieceWorkFromData: {
                    workshopId: null,
                    begin: '',
                    end: '',
                    workshopList: []
                },
                addPieceWorkModalState: false,
                pieceWorkOutputModalState: false,
                queryBarBeginDate: '',
                queryBarEndDate: '',
                queryBarWorkshopId: '',
                queryBarWorkshopList: [],
                globalLoadingShow: false,
                pageUp: setPage.pageUp,
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                pageHeights: null,
                tableHeight: 0,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        key: 'belongDate',
                        align: 'left',
                        minWidth: 120,
                        sortable: true,
                        title: '日期'
                    },
                    {
                        key: 'workshopName',
                        align: 'left',
                        minWidth: 120,
                        sortable: true,
                        title: '生产车间'
                    },
                    {
                        key: 'shiftTypeName',
                        minWidth: 120,
                        align: 'left',
                        sortable: true,
                        title: '班制'
                    },
                    {
                        key: 'createName',
                        minWidth: 120,
                        align: 'center',
                        sortable: true,
                        title: '核算人'
                    },
                    {
                        key: 'createTime',
                        title: '核算时间',
                        align: 'left',
                        sortable: true,
                        minWidth: 150
                    },
                    {
                        key: 'auditStateName',
                        title: '数据状态',
                        align: 'center',
                        sortable: true,
                        minWidth: 150
                    },
                    {
                        key: 'calculateState',
                        title: '核算状态',
                        align: 'center',
                        sortable: true,
                        minWidth: 150,
                        render: (h, params) => {
                            let calculateName = '';
                            switch (params.row.calculateState) {
                                case 0: calculateName = '核算中';
                                    break;
                                case 1: calculateName = '核算中';
                                    break;
                                case 2: calculateName = '核算完成';
                                    break;
                            };
                            return h('div', {
                                domProps: {
                                    innerHTML: calculateName
                                }
                            });
                        }
                    },
                    {
                        title: '详情',
                        align: 'center',
                        sortable: true,
                        width: 150,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.calculateState !== 2
                                },
                                on: {
                                    'click': () => {
                                        _this.pieceworkOutputEvent(params.row, params.row.id);
                                    }
                                }
                            }, '计件详情');
                        }
                    }
                ],
                tableData: []
            };
        },
        methods: {
            // 刷新事件
            refreshPieceWorkEvent () {
                this.getListHttp();
                this.getMenuHttp();
            },
            tipsModalConfirmEvent () {
                if (this.isCancelPieceWork) {
                    this.cancelPieceWorkHttp();
                } else {
                    this.tipsModalConfirmButtonLoading = true;
                    this.saveHttp();
                };
            },
            // 取消核算请求
            cancelPieceWorkHttp () {
                let params = this.checkData.map((item) => item.id);
                this.tipsModalConfirmButtonLoading = true;
                this.$call('output.calculate.delete', params).then(res => {
                    if (res.data.status === 200) {
                        emptyTips(this, '取消核算成功!');
                        this.tipsModalMessage = '';
                        this.tipsModalState = false;
                        this.isCancelPieceWork = false;
                        this.tipsModalConfirmButtonLoading = false;
                        this.checkData = [];
                        this.getListHttp();
                        this.getMenuHttp();
                    } else {
                        this.tipsModalConfirmButtonLoading = false;
                    };
                });
            },
            saveHttp () {
                this.$call('output.calculate.compute', this.saveData).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.getListHttp();
                        this.getMenuHttp();
                        this.tipsModalConfirmButtonLoading = false;
                        this.addPieceWorkModalState = false;
                        this.tipsModalState = false;
                        this.addPieceWorkModalConfirmLoading = false;
                    } else {
                        this.tipsModalConfirmButtonLoading = false;
                        this.addPieceWorkModalConfirmLoading = false;
                    };
                });
            },
            // 新增计件核算modal
            addPieceWorkModalStateConfirmEvent (data) {
                data.begin = formatDate(data.begin).split(' ')[0];
                data.end = formatDate(data.end).split(' ')[0];
                this.saveData = data;
                // 校验日期是否排班
                this.$call('output.calculate.check', _this.saveData).then(res => {
                    if (res.data.status === 200) {
                        this.addPieceWorkModalConfirmLoading = true;
                        this.saveHttp();
                    } else if (res.data.status === 5001) {
                        this.tipsModalMessage = res.data.message;
                        this.tipsModalState = true;
                        this.isCancelPieceWork = false;
                    };
                });
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.activeMenuAuditSate = obj.id;
                this.queryBarBeginDate = '';
                this.queryBarEndDate = '';
                this.queryBarWorkshopId = null;
                this.getListHttp();
            },
            auditEvent () {
                if (this.checkData && this.checkData.length !== 0) {
                    // 核算完成才允许审核
                    let isSwitch = false;
                    this.checkData.forEach(item => {
                        if (item.calculateState !== 2) {
                            isSwitch = true;
                        };
                    });
                    if (!isSwitch) {
                        this.$call('output.calculate.approve', this.checkData.map(item => item.id)).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'auditTips');
                                this.getListHttp();
                                this.getMenuHttp();
                                this.checkData = [];
                            };
                        });
                    } else {
                        emptyTips(this, "只有核算状态为'核算完成'才可以审核!");
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            unAuditEvent () {
                if (this.checkData && this.checkData.length !== 0) {
                    this.$call('output.calculate.unapprove', this.checkData.map(item => item.id)).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'unAuditTips');
                            this.getListHttp();
                            this.getMenuHttp();
                            this.checkData = [];
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            userOutputModalConfirmEvent () {
                this.getOutputCalculateDetailHttp();
            },
            tipsModalCancelEvent () {
                this.tipsModalState = false;
                this.tipsModalMessage = '';
                this.isCancelPieceWork = false;
                this.tipsModalConfirmButtonLoading = false;
            },
            cancelPieceWorkEvent () {
                if (this.checkData && this.checkData.length !== 0) {
                    // 只有核算状态为'核算完成'才可以取消核算
                    let isSwitch = false;
                    this.checkData.forEach((item) => {
                        if (item.calculateState !== 2) {
                            isSwitch = true;
                        };
                    });
                    if (!isSwitch) {
                        this.tipsModalMessage = '确认取消计件核算?';
                        this.isCancelPieceWork = true;
                        this.tipsModalState = true;
                    } else {
                        emptyTips(this, "只有核算状态为'核算完成'才可以取消核算!");
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            getCheckEvent (data) {
                this.checkData = data;
            },
            // 新增计件核算modal的取消事件
            addPieceWorkModalStateCancelEvent () {
                this.addPieceWorkModalState = false;
            },
            // 监听新增计件核算的modal
            addPieceWorkModalStateChangeEvent (e) {
                this.addPieceWorkModalState = e;
                if (e === false) this.addPieceWorkModalConfirmLoading = false;
            },
            // 计件产量modal
            pieceWorkOutputModalStateChangeEvent (e) {
                this.pieceWorkOutputModalState = e;
                if (e === false) {
                    this.pieceWorkOutputModalShow = false;
                    this.detailId = null;
                };
            },
            // 计件产量事件
            pieceworkOutputEvent (row, id) {
                this.detailId = id;
                this.getOutputCalculateDetailHttp();
            },
            getOutputCalculateDetailHttp () {
                this.pieceWorkOutputModalShow = true;
                this.$call('output.calculate.detail', {id: this.detailId}).then(res => {
                    if (res.data.status === 200) {
                        this.pieceWorkDetailData = res.data.res;
                        this.pieceWorkOutputModalState = true;
                        this.pieceWorkOutputModalShow = false;
                    };
                });
            },
            // 新增计件核算按钮事件
            addPieceWorkEvent () {
                let paramData = {
                    workshopId: this.defaultWorkshop,
                    workshopList: JSON.parse(JSON.stringify(this.queryBarWorkshopList)),
                    begin: toDay(),
                    end: toDay()
                };
                this.addPieceWorkFromData = paramData;
                this.addPieceWorkModalState = true;
            },
            // 获取页码
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            pageChange (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 搜索按钮的事件
            clickSearchEvent () {
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListHttp();
                this.getMenuHttp();
            },
            // 获取列表查询
            getListHttp () {
                this.queryBarBeginDate ? this.queryBarBeginDate = formatDate(this.queryBarBeginDate) : '';
                this.queryBarEndDate ? this.queryBarEndDate = formatDate(this.queryBarEndDate) : '';
                this.$call('output.calculate.list', {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    begin: this.queryBarBeginDate,
                    end: this.queryBarEndDate,
                    auditState: this.activeMenuAuditSate,
                    workshopId: this.queryBarWorkshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.pageTotal = res.data.count;
                        this.tableData = translateState(res.data.res);
                        this.globalLoadingShow = false;
                    };
                });
            },
            // 获取车间数据
            getWorkshopHttp (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        this.queryBarWorkshopList = res.data.res.userData;
                        this.queryBarWorkshopId = res.data.res.defaultDeptId;
                        this.defaultWorkshop = res.data.res.defaultDeptId;
                        resolve(res);
                    };
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 30;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                let workshopList = new Promise((resolve, reject) => this.getWorkshopHttp(resolve, reject));
                let menuList = new Promise((resolve, reject) => this.getMenuHttp(resolve, reject));
                Promise.all([workshopList, menuList]).then(res => {
                    this.getListHttp();
                });
            },
            // 左侧菜单列表
            getMenuHttp (resolve, reject) {
                return this.$call('output.calculate.stateCount', { workshopId: this.queryBarWorkshopId }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            if (item.id === 1) {
                                item.name = '待审核';
                            };
                        });
                        resolve ? resolve(res) : false;
                        this.menuArr = res.data.res;
                    };
                });
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
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

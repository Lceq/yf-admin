<template>
    <div>
        <left-menu
                :stateList="menuArr"
                :curTabStateId="activeMenuAuditSate"
                @on-select="getClickMenuEvent"
        >
            <div slot="content">
                <global-loading v-show="globalLoadingShow"></global-loading>
                <Row type="flex" justify="space-between" align="middle">
                    <Col>
                        <Button icon="md-add" class="operatingSpaceMargin" v-if="activeMenuAuditSate===1" type="primary" @click="addUpkeepEvent">新增</Button>
                        <Button icon="ios-create" class="operatingSpaceMargin" v-if="activeMenuAuditSate===1" type="primary" @click="getPushEvent">提交</Button>
                        <Button icon="ios-undo" class="operatingSpaceMargin" v-if="activeMenuAuditSate===2" type="warning" @click="clickCancelEvent">撤销提交</Button>
                        <Button icon="md-done-all" class="operatingSpaceMargin" v-if="activeMenuAuditSate===2" type="primary" @click="auditEvent">审核</Button>
                        <Button icon="md-refresh" class="operatingSpaceMargin" v-if="activeMenuAuditSate===3" type="warning" @click="unAuditEvent">撤销审核</Button>
                        <Button icon="ios-trash" class="operatingSpaceMargin" v-if="activeMenuAuditSate===1" type="error" @click="deletePartsEvent">删除</Button>
                    </Col>
                    <Col>
                        <Row type="flex" justify="space-between" class="screenRightMarginTop">
                            <Col>
                                <Row type="flex" justify="space-between">
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <DatePicker v-model="queryBarStartTime" type="date" placeholder="请选择开始时间" class="searchHurdles"></DatePicker>
                                    </Col>
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <DatePicker v-model="queryBarOverTime" type="date" placeholder="请选择结束时间" class="searchHurdles"></DatePicker>
                                    </Col>
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <Input type="text" v-model="queryBarCode" placeholder="请输入单据编号" class="searchHurdles"/>
                                    </Col>
                                    <Col class="operatingSpaceMargin">
                                        <Select clearable v-model="workshopValue" placeholder="请选择车间" class="searchHurdles">
                                            <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                                <Row type="flex" justify="space-between" v-show="showScreenSub">
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <Select clearable v-model="queryBarProcess" placeholder="请选择工序" class="searchHurdles">
                                            <Option v-for="item in queryBarProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </Col>
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <Input type="text" v-model="queryBarMachineCode" placeholder="请输入设备编号" class="searchHurdles"/>
                                    </Col>
                                    <Col class="queryBarMarginRight operatingSpaceMargin">
                                        <Select clearable v-model="queryBarCodeSource" placeholder="请选择单据来源" class="searchHurdles">
                                            <Option v-for="item in queryBarPlanStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </Col>
                                    <Col class="operatingSpaceMargin">
                                        <Select clearable v-model="queryBarUserState" placeholder="请选择领用状态" class="searchHurdles">
                                            <Option v-for="item in queryBarUserStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                            <Col class="searchButtonStyle operatingSpaceMargin">
                                <a class="moreStyle" @click="showQueryChange">···</a>
                                <Button icon="ios-search" type="primary" @click="searchClickEvent" class="queryButtonStyle">搜索</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row class="marginBottom-10 tableOffsetTopList">
                    <Col>
                        <Table @on-selection-change="getCheckBoxEvent" :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
                    </Col>
                </Row>
                <Row class="pageHeight">
                    <Col class="pageStyle">
                        <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageCodeEvent" :show-sizer="true" @on-page-size-change="getPageOptsEvent"></Page>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <delete-tips
                                :tipMsg="deleteTipsMsg"
                                :loading="deleteButtonLoading"
                                :v-model="deleteTipsState"
                                @cancel="deleteTipsCancel"
                                @confirm="deleteTipsConfirm"
                        >
                        </delete-tips>
                    </Col>
                </Row>
            </div>
        </left-menu>
    </div>
</template>

<script>
    let _this = this;
    import publicJs, { noticeTips,compClientHeight,setPage,clearSpace, toDay, formatDate } from '../../../libs/common';
    import deleteTips from '../../public/deleteWarning';
    import leftMenu from '../../layout/layout';
    export default {
        components: {
            deleteTips, leftMenu
        },
        data () {
            return {
                globalLoadingShow: false,
                activeMenuAuditSate: 1,
                currentMessageType: false,
                pageHeights: 0,
                deleteTipsMsg: '',
                deleteButtonLoading: false,
                deleteTipsState: false,
                checkArr: [],
                menuArr: [],
                pageTotal: 0,
                pageIndex: 1,
                pageOpts: setPage.pageOpts,
                pageSize: setPage.pageSize,
                tableHeight: document.documentElement.clientHeight - 270,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '单据日期',
                        key: 'orderDate',
                        sortable: true,
                        minWidth: 120,
                        align: 'left',
                        fixed: 'left'
                    },
                    {
                        title: '单据编号',
                        key: 'code',
                        minWidth: 120,
                        align: 'left',
                        sortable: true,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        'click': () => {
                                            _this.editPartsEvent(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '设备编号',
                        key: 'machineCode',
                        minWidth: 120,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '设备名称',
                        key: 'machineName',
                        minWidth: 110,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '所属工序',
                        key: 'processName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '所属车间',
                        key: 'workshopName',
                        minWidth: 110,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '单据来源',
                        key: 'billSourceName',
                        minWidth: 110,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '来源单号',
                        key: 'sourceCode',
                        minWidth: 110,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '领用状态',
                        key: 'userStateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '申请人',
                        key: 'createName',
                        minWidth: 100,
                        align: 'center',
                        sortable: true
                    }
                ],
                tableData: [],
                queryBarUserState: null,
                workshopValue: null,
                queryBarWorkshopList: [],
                queryBarProcess: null,
                queryBarProcessList: [],
                queryBarMachineCode: '',
                queryBarUserStateList: [
                    {
                        value: 'false',
                        label: '未领用'
                    },
                    {
                        value: 'true',
                        label: '已领用'
                    }
                ],
                queryBarDateMonth: '',
                queryBarCodeSource: null,
                queryBarCodeSourceList: [],
                queryBarReceiveStateList: [],
                showScreenSub: false,
                queryBarStartTime: '',
                queryBarOverTime: '',
                queryBarCode: '',
                queryBarPlanStateList: [],
                toCreated: false
            };
        },
        methods: {
            setCurrentMesType () {
                this.currentMessageType = !this.currentMessageType;
            },
            // 提交modal的取消事件
            deleteTipsCancel () {
                this.deleteTipsMsg = '';
                this.deleteTipsState = false;
                this.deleteButtonLoading = false;
            },
            // 提交modal的确认事件
            deleteTipsConfirm () {
                this.deleteButtonLoading = true;
                let ids = [];
                this.checkArr.forEach((item) => {ids.push(item.id);});
                if (this.isDelete === true) {
                    this.deleteHttp(ids);
                };
            },
            // 删除的请求
            deleteHttp (ids) {
                this.$api.parts.deleteHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的事件
            deletePartsEvent () {
                if (this.checkArr.length !== 0) {
                    this.deleteTipsMsg = '确认删除?';
                    this.deleteTipsState = true;
                    this.isDelete = true;
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核的事件
            unAuditEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.checkArr.forEach((item) => {ids.push(item.id);});
                    this.unAuditHttp(ids);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 反审核的请求
            unAuditHttp (ids) {
                this.$api.parts.unApproveHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'unAuditTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 审核的事件
            auditEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.checkArr.forEach((item) => {ids.push(item.id);});
                    this.auditHttp(ids);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 审核的请求
            auditHttp (ids) {
                this.$api.parts.approveHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'auditTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 撤销的事件
            clickCancelEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.checkArr.forEach((item) => {ids.push(item.id);});
                    this.cancelHttp(ids);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 撤销的请求
            cancelHttp (ids) {
                this.$api.parts.cancelHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'cancelTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 提交的请求
            pushHttp (ids) {
                this.$api.parts.submitHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                        this.getMenuHttp();
                        noticeTips(this, 'submitTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 提交的事件
            getPushEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.checkArr.forEach((item) => {ids.push(item.id);});
                    this.pushHttp(ids);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 勾选事件
            getCheckBoxEvent (e) {
                this.checkArr = e;
            },
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.activeMenuAuditSate = obj.id;
                this.queryBarStartTime = '';
                this.queryBarOverTime = '';
                this.queryBarCode = '';
                this.queryBarProcess = '';
                this.queryBarMachineCode = '';
                this.queryBarCodeSource = '';
                this.queryBarUserState = null;
                this.getListHttp();
            },
            // 编辑
            editPartsEvent (id) {
                this.$router.push({
                    path: 'editPartsReplace',
                    query: {
                        editId: id,
                        activated: true
                    }
                });
            },
            getPageOptsEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            addUpkeepEvent () {
                this.$router.push({
                    path: 'addPartsReplace',
                    query: {
                        isUpkRep: 0,
                        activated: true
                    }
                });
            },
            // 查询栏展开的点击事件
            showQueryChange () {
                let tableDom = document.getElementsByClassName('tableOffsetTopList')[0];
                if (this.showScreenSub) {
                    this.showScreenSub = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {this.tableHeight = compClientHeight(tableDom.offsetTop + 140 + this.pageHeights + 30);}, 0);
                } else if (this.showScreenSub === false) {
                    this.showScreenSub = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {this.tableHeight = compClientHeight(tableDom.offsetTop + 140 + this.pageHeights + 30);}, 0);
                };
            },
            searchClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getMenuHttp();
                this.getListHttp();
            },
            getListHttp () {
                this.queryBarCode = clearSpace(this.queryBarCode);
                this.queryBarMachineCode = clearSpace(this.queryBarMachineCode);
                this.queryBarOverTime ? this.queryBarOverTime = formatDate(this.queryBarOverTime) : '';
                this.queryBarStartTime ? this.queryBarStartTime = formatDate(this.queryBarStartTime) : '';
                let userState = false;
                if (this.queryBarUserState === 'false') {
                    userState = false;
                } else if (this.queryBarUserState === 'true') {
                    userState = true;
                } else if (this.queryBarUserState === null) {
                    userState = null;
                };
                return this.$call('parts.replace.order.list',
                    {
                        'from': this.queryBarStartTime,
                        'to': this.queryBarOverTime,
                        'code': this.queryBarCode,
                        'workshopId': this.workshopValue,
                        'processId': this.queryBarProcess,
                        'machineCode': this.queryBarMachineCode,
                        'billSource': this.queryBarCodeSource,
                        'auditState': this.activeMenuAuditSate,
                        'usedStatus': userState,
                        'pageIndex': this.pageIndex,
                        'pageSize': this.pageSize
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.userStateConverterCN(res.data.res);
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
                    };
                });
            },
            // 领用状态转中文
            userStateConverterCN (data) {
                data.forEach((item) => {
                    if (item.usedStatus === true) {
                        this.$set(item, 'userStateName', '已领用');
                    } else if (item.usedStatus === false) {
                        this.$set(item, 'userStateName', '未领用');
                    };
                });
            },
            getMenuHttp () {
                this.$call('parts.replace.order.stateCount', {workshopId: this.workshopValue}).then(res => {
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
            getWorkshopList () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        this.workshopValue = res.data.res.defaultDeptId;
                        this.queryBarWorkshopList = res.data.res.userData;
                    };
                });
            },
            // 获取单据来源
            getBillSourceHttp () {
                this.$api.parts.billSourceHttp({}).then(res => {
                    if (res.data.status === 200) {
                        this.queryBarPlanStateList = res.data.res;
                    };
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTopList')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                publicJs.processLevel().then(res => { this.queryBarProcessList = res; });
                (async ()=>{
                    await this.getWorkshopList();
                    await this.getMenuHttp();
                    await this.getBillSourceHttp();
                    await this.getListHttp();
                })();
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

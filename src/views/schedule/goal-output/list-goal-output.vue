<template>
    <Card>
        <Row type="flex" justify="space-between">
            <Col span="12" class="headerMargin flex-left">
            <div class="queryBarMarginRight">
                <Button icon="md-add" type="primary" @click="addEvent">新增</Button>
            </div>
            <Button icon="ios-trash" type="error" @click="deleteEvent">删除</Button>
            </Col>
            <Col class="flex-left">
                <Select clearable v-model="queryBarWorkshopId" placeholder="请选择车间" class="queryBarMarginRight searchHurdles">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <DatePicker v-model="queryBarMonth" type="month" placeholder="请选择日期" class="queryBarMarginRight searchHurdles"></DatePicker>
                <Button icon="ios-search" type="primary" @click="searchButtonClickEvent" class="queryButtonStyle">搜索</Button>
            </Col>
        </Row>
        <Row class="margin-top-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData" @on-selection-change="getCheckObjEvent"></Table>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col class="pageStyle">
                <Page show-sizer :page-size="pageSize" show-total :total="pageTotal" show-elevator :page-size-opts="pageOpts" @on-change="getPageIndex" @on-page-size-change="getPageSizeEvent"></Page>
            </Col>
        </Row>
        <tips-modal
                :v-model="deleteModalStatus"
                :tipMsg="deleteModalMsg"
                :loading="deleteButtonLoading"
                @cancel="deleteModalCancel"
                @confirm="deleteModalConfirm"
        >
        </tips-modal>
        <save-modal
                :saveModalState="saveModalState"
                :showOther="showOther"
                :saveModalData="saveModalData"
                :saveModalTitle="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                @on-confirm="saveConfirmEvent"
                @on-cancel="saveCancelEvent"
        ></save-modal>
    </Card>
</template>
<script>
    import tipsModal from '../../public/deleteWarning';
    import { compClientHeight, noticeTips, translateState, emptyTips, toDay, formatMonth, setPage } from '../../../libs/common';
    import saveModal from './save-modal';
    export default {
        components: { tipsModal, saveModal },
        data () {
            return {
                pageTotal: 0,
                pageIndex: 1,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                queryBarMonth: '',
                queryBarWorkshopId: null,
                defaultWorkshopName: '',
                defaultWorkshopId: '',
                workshopList: [],
                saveModalData: {},
                paramsTypeList: [
                    {
                        paramType: 1,
                        paramTypeName: '腰绳'
                    },
                    {
                        paramType: 2,
                        paramTypeName: '封包绳'
                    }
                ],
                saveModalState: false,
                deleteButtonLoading: false,
                buttonLoading: false,
                tableHeight: 0,
                showOther: false,
                formValidate: {},
                deleteModalStatus: false,
                deleteModalMsg: '',
                saveModalTitle: '',
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '月份',
                        key: 'month',
                        sortable: true,
                        minWidth: 130,
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    innerHTML: params.row.month
                                },
                                on: {
                                    'click': () => {
                                        this.editEvent(params.row.workshopId, params.row.month);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        sortable: true,
                        minWidth: 150
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true,
                        minWidth: 150
                    }
                ],
                tableData: [],
                checkArray: []
            };
        },
        methods: {
            // 获取页码事件
            getPageIndex (e) {
                this.pageIndex = e;
                this.getListRequest();
            },
            // 获取每页条数
            getPageSizeEvent (e) {
                this.pageSize = e;
                this.getListRequest();
            },
            // 编辑的方法
            editEvent (workshopId, month) {
                this.showOther = true;
                this.saveModalTitle = '编辑目标产量配置';
                this.$call('output.goal.date.detail', {workshopId, month}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.workshopList = JSON.parse(JSON.stringify(this.workshopList));
                        this.saveModalData = responseData;
                        this.saveModalState = true;
                    };
                });
            },
            // 验证是否允许审核等操作
            validatorState (state) {
                let switchState = true;
                let ids = this.checkArray.map(item => {
                    if (item.auditState !== state) switchState = false;
                    return item.id;
                });
                return {
                    ids: ids,
                    switchState: switchState
                };
            },
            // 搜索事件
            searchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListRequest();
            },
            saveConfirmEvent () {
                this.getListRequest();
                this.saveModalState = false;
            },
            saveCancelEvent () {
                this.saveModalState = false;
            },
            saveModalStateChangeEvent (e) {
                this.saveModalState = e;
            },
            // 获取勾选的对象
            getCheckObjEvent (e) {
                this.checkArray = e;
            },
            // 删除的方法
            deleteEvent () {
                if (this.checkArray.length !== 0) {
                    this.deleteModalStatus = true;
                    this.deleteModalMsg = '确认删除?';
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 删除提示框的确认按钮
            deleteModalConfirm () {
                this.deleteButtonLoading = true;
                this.$call('output.goal.date.delete', this.checkArray).then(res => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.deleteModalMsg = '';
                        noticeTips(this, 'deleteTips');
                        this.deleteModalStatus = false;
                        this.getListRequest();
                        this.checkArray = [];
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteModalCancel () {
                this.deleteModalMsg = '';
                this.deleteButtonLoading = '';
                this.deleteModalStatus = false;
            },
            getListRequest () {
                this.queryBarMonth = this.queryBarMonth ? formatMonth(this.queryBarMonth) : '';
                this.$call('output.goal.date.list', {
                    workshopId: this.queryBarWorkshopId,
                    month: this.queryBarMonth,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = translateState(res.data.res);
                        this.checkArray = [];
                        this.pageTotal = res.data.count;
                    };
                });
            },
            // 新增的方法
            addEvent () {
                let date = new Date(toDay());
                //let outputGoalDateList = this.getMonthAllDay(date.getFullYear(), date.getMonth() + 1);
                let outputGoalDateList = [];
                this.saveModalData = {
                    //month: toDay(),
                    month: '',
                    name: '',
                    workshopId: JSON.parse(JSON.stringify(this.defaultWorkshopId)),
                    workshopName: JSON.parse(JSON.stringify(this.defaultWorkshopName)),
                    workshopList: JSON.parse(JSON.stringify(this.workshopList)),
                    outputGoalDateList: outputGoalDateList
                };
                this.showOther = false;
                this.saveModalTitle = '新增目标产量配置';
                this.saveModalState = true;
            },
            // 获取每月所有的天数
            getMonthAllDay (fullYears, months) {
                let fullYear = fullYears;
                let month = months;
                let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
                let arr = [];
                for (let i = 1; i <= lastDayOfMonth; i++) {
                    arr.push({
                        date: fullYear + '-' + month + '-' + i,
                        stock: 0,
                        discountStock: 0,
                        spunYarn: 0
                    });
                };
                return arr;
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                this.tableHeight = compClientHeight(tableDom.offsetTop + 200);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 200);
                };
            },
            getWorkshopHttp (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopId = responseData.defaultDeptId;
                        this.defaultWorkshopId = responseData.defaultDeptId;
                        this.defaultWorkshopName = responseData.defaultDeptName;
                        this.workshopList = responseData.userData;
                        resolve(res);
                    }
                });
            }
        },
        created () {
            let workshopList = new Promise((resolve, reject) => this.getWorkshopHttp(resolve, reject));
            Promise.all([workshopList]).then(res => {
                this.getListRequest();
            });
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>

<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between" align="middle">
            <Col>
                <Button type="success" :disabled="disableStartUpkeepButton" class="margin-bottom-10" @click="startUpkeepEvent">开始保养</Button>
            </Col>
            <Col>
                <Row type="flex" justify="space-between" class="screenRightMarginTop">
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarWorkshop" placeholder="请选择车间" class="searchHurdles">
                                    <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </Col>
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarProcess" placeholder="请选择工序" class="searchHurdles">
                                    <Option v-for="item in queryBarProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col class="margin-bottom-10">
                                <Input type="text" v-model="queryBarPlanCode" placeholder="请输入计划单号" class="searchHurdles"/>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between" v-show="showScreenSub">
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <DatePicker type="month" placeholder="请选择保养月份" @on-change="getYearMonthEven" class="searchHurdles" v-model="queryBarDateMonth"></DatePicker>
                            </Col>
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarUpkeepState" placeholder="请选择保养状态" class="searchHurdles">
                                    <Option v-for="item in queryBarUpkeepStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col class="margin-bottom-10">
                                <Input type="text" v-model="queryBarMachineNameOrCode" placeholder="请输入设备编号或名称" class="searchHurdles"/>
                            </Col>
                        </Row>
                    </Col>
                    <Col class="searchButtonStyle margin-bottom-10">
                        <a class="moreStyle" @click="showQueryChange">···</a>
                        <Button icon="ios-search" type="primary" @click="searchClickEvent" class="queryButtonStyle">搜索</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="marginBottom-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageCodeEvent" :show-sizer="true" @on-page-size-change="getPageOptsEvent"></Page>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="startUpkeepModal"
                        title="开始保养"
                        width="800"
                        :mask-closable="false"
                        @on-visible-change="getModalChangeEvent"
                >
                    <div>
                        <modal-content-loading
                                :spinShow="spinShow"
                        ></modal-content-loading>
                    </div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :show-message="false">
                        <Row type="flex" justify="space-between">
                            <Col span="11">
                                <FormItem label="保养计划单号:" class="formItemMargin">
                                    <div class="exhibitionInputBackground">{{modalUpkeepPlanCodeValue}}</div>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="车间:" class="formItemMargin">
                                    <div class="exhibitionInputBackground">{{modalWorkshopValue}}</div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="11">
                                <FormItem label="工序:" class="formItemMargin">
                                    <div class="exhibitionInputBackground">{{modalProcessValue}}</div>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="设备编号:" class="formItemMargin">
                                    <div class="exhibitionInputBackground">{{modalMachineCodeValue}}</div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="11">
                                <FormItem label="设备名称:" class="formItemMargin">
                                    <div class="exhibitionInputBackground">{{modalMachineNameValue}}</div>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="保养类型:" class="formItemMargin">
                                    <Select v-model="modalUpkeepTypeValue">
                                        <Option v-for="item in upkeepTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="11">
                                <FormItem label="保养开始时间:" class="formItemMargin" prop="modalUpkeepStartTime">
                                    <DatePicker :editable="false" v-model="formValidate.modalUpkeepStartTime" @on-change="getModalStartEvent" type="datetime"  format="yyyy-MM-dd HH:mm" placeholder="请选择保养开始时间" class="widthPercentage"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="11">
                                <FormItem label="重点检修:" class="formItemMargin">
                                    <Input v-model="modalKeyOverhaulValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="备注:" class="formItemMargin">
                                    <Input v-model="modalRemarksValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                                <FormItem label="保养内容:" class="formItemMargin">
                                    <Input v-model="modalDescribeValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="24">
                                <Tabs value="upkeepCycle">
                                    <TabPane label="保养周期项目" name="upkeepCycle">
                                        <Table size="small" border :columns="startUpkeepTableHeader" :data="startUpkeepTableData"></Table>
                                    </TabPane>
                                    <TabPane label="其他信息" name="other">
                                        <other-message
                                                :createName="createName"
                                                :createTime="createTime"
                                                :updateName="updateName"
                                                :updateTime="updateTime"
                                                :auditName="auditName"
                                                :auditTime="auditTime"
                                                :closeName="closeName"
                                                :closeTime="closeTime"
                                        ></other-message>
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </Form>
                    <div slot="footer">
                        <modal-footer
                                :buttonLoading="buttonLoading"
                                @saveModalConfirmEvent="confirmEvent"
                                @saveModalCancelEvent="cancelEvent"
                        ></modal-footer>
                    </div>
                </Modal>
            </Col>
        </Row>
    </card>
</template>
<script>
    import { noticeTips, compClientHeight, clearSpace, formatDate, toDaySeconds, setPage} from '../../../libs/common';
    import otherMessage from '../../components/otherMessage';
    import modalFooter from '../../components/modal-footer';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: {
            otherMessage, modalFooter, modalContentLoading
        },
        data () {
            const validateStartTime = (rule, value, callback) => value ? callback() : callback(new Error(''));
            return {
                globalLoadingShow: false,
                spinShow: false,
                otherCreateTime: '',
                otherCreateName: '',
                otherSubmitName: '',
                otherSubmitTime:'',
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                auditName: '',
                auditTime: '',
                closeName: '',
                closeTime: '',
                submitName: '',
                submitTime: '',
                disableStartUpkeepButton: true,
                queryBarWorkshop: '',
                queryBarWorkshopList: [],
                queryBarProcess: '',
                queryBarProcessList: [],
                queryBarPlanCode: '',
                queryBarDateMonth: '',
                queryBarMachineNameOrCode: '',
                queryBarUpkeepState: '',
                queryBarUpkeepStateList: [],
                showScreenSub: false,
                tableHeight: document.documentElement.clientHeight - 250,
                pageHeights: null,
                buttonLoading: false,
                formValidate: {
                    modalUpkeepStartTime: ''
                },
                ruleValidate: {
                    modalUpkeepStartTime: [
                        { required: true, validator: validateStartTime, trigger: 'change' }
                    ]
                },
                pageTotal: 0,
                pageIndex: 1,
                pageOpts: setPage.pageOpts,
                pageSize: setPage.pageSize,
                modalUpkeepPlanCodeValue: '',
                modalMachineUpkeepCodeValue: '',
                modalUpkeepTypeValue: '',
                modalMachineCodeValue: '',
                modalMachineNameValue: '',
                modalRemarksValue: '',
                modalDescribeValue: '',
                modalKeyOverhaulValue: '',
                modalProcessValue: '',
                modalWorkshopValue: '',
                startUpkeepTableHeader: [
                    {
                        title: '保养周期项目名称',
                        key: 'name',
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '上一次周期保养时间',
                        key: 'lastMaintenanceTime',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '预计下次周期保养时间',
                        key: 'expectMaintenanceTime',
                        align: 'center',
                        minWidth: 110
                    }
                ],
                startUpkeepTableData: [],
                upkeepTypeList: [],
                startUpkeepModal: false,
                tableHeader: [
                    {
                        title: '选择',
                        key: 'checkValue',
                        width: 80,
                        align: 'center',
                        fixed: 'left',
                        render: (h, param) => {
                            return h('div', [
                                h('Checkbox', {
                                    props: {
                                        value: param.row.checkValue
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.tableData.forEach((item) => {
                                                this.$set(item, 'checkValue', false);
                                            });
                                            this.tableData[param.index].checkValue = e;
                                            if (e === true) {
                                                this.getCheckBoxEvent(param.row);
                                            } else {
                                                this.getCheckBoxEvent(null);
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '保养计划单号',
                        key: 'planCode',
                        minWidth: 130,
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '计划保养日期',
                        key: 'maintenancePlanDate',
                        align: 'left',
                        minWidth: 130,
                        sortable: true
                    },
                    {
                        title: '设备编号',
                        key: 'machineCode',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '设备名称',
                        key: 'machineName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        align: 'left',
                        minWidth: 80,
                        sortable: true
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 80,
                        sortable: true
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        align: 'left',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        align: 'left',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '保养类型',
                        key: 'typeName',
                        align: 'left',
                        minWidth: 130,
                        sortable: true
                    },
                    {
                        title: '保养状态',
                        key: 'completionStateName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        align: 'center',
                        minWidth: 100,
                        sortable: true
                    }
                ],
                tableData: [],
                checkObj: null,
                modalDataObj: null
            };
        },
        methods: {
            // 勾选事件
            getCheckBoxEvent (obj) {
                this.checkObj = obj;
                if (obj) {
                    obj.completionState !== 0 ? this.disableStartUpkeepButton = true : this.disableStartUpkeepButton = false;
                } else {
                    this.disableStartUpkeepButton = true;
                };
            },
            // 获取modal的保养开始时间
            getModalStartEvent (e) {
                this.formValidate.modalUpkeepStartTime = e;
            },
            // 获取列表的请求
            getListHttp () {
                this.queryBarPlanCode = clearSpace(this.queryBarPlanCode);
                this.queryBarMachineNameOrCode = clearSpace(this.queryBarMachineNameOrCode);
                return this.$call('maintenance.plan.detail.list',
                    {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        code: this.queryBarPlanCode,
                        workshopId: this.queryBarWorkshop,
                        processId: this.queryBarProcess,
                        yearMonth: this.queryBarDateMonth,
                        completionState: this.queryBarUpkeepState,
                        machineNameCode: this.queryBarMachineNameOrCode
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.checkObj = null;
                        this.pageTotal = res.data.count;
                        this.tableData = res.data.res;
                        this.globalLoadingShow = false;
                    };
                });
            },
            // 确认事件
            confirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        // 赋值修改
                        this.$set(this.modalDataObj, 'beginTime', formatDate(this.formValidate.modalUpkeepStartTime));
                        this.$set(this.modalDataObj, 'overhaul', this.modalKeyOverhaulValue);
                        this.$set(this.modalDataObj, 'remarks', this.modalRemarksValue);
                        this.$set(this.modalDataObj, 'maintenanceContents', this.modalDescribeValue);
                        this.$set(this.modalDataObj, 'typeId', this.modalUpkeepTypeValue);
                        this.$set(this.modalDataObj, 'maintenancePlanId', this.checkObj.maintenancePlanId);
                        this.$set(this.modalDataObj, 'maintenancePlanCalendarId', this.checkObj.maintenancePlanCalendarId);
                        this.$set(this.modalDataObj, 'maintenancePlanMachineId', this.checkObj.maintenancePlanMachineId);
                        delete this.modalDataObj.createTime;
                        delete this.modalDataObj.createId;
                        delete this.modalDataObj.createName;
                        delete this.modalDataObj.updateTime;
                        delete this.modalDataObj.updateId;
                        delete this.modalDataObj.updateName;
                        delete this.modalDataObj.closeTime;
                        delete this.modalDataObj.closeId;
                        delete this.modalDataObj.closeName;
                        delete this.modalDataObj.id;
                        this.saveStartUpkeepHttp();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            saveStartUpkeepHttp () {
                this.buttonLoading = true;
                this.$api.upkeep.upkeepScheduleBeginHttp(this.modalDataObj).then(res => {
                    if (res.data.status === 200) {
                        this.buttonLoading = false;
                        this.startUpkeepModal = false;
                        noticeTips(this, 'saveTips');
                        this.getListHttp();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 监听modal状态
            getModalChangeEvent (e) {
                if (e === false) {
                    this.initModalData();
                };
            },
            // 取消事件
            cancelEvent () {
                this.initModalData();
            },
            // 初始化数据
            initModalData () {
                this.buttonLoading = false;
                this.spinShow = false;
                this.startUpkeepModal = false;
                this.modalUpkeepPlanCodeValue = '';
                this.modalMachineUpkeepCodeValue = '';
                this.modalWorkshopValue = '';
                this.modalProcessValue = '';
                this.modalUpkeepTypeValue = '';
                this.formValidate.modalUpkeepStartTime = '';
                this.modalKeyOverhaulValue = '';
                this.modalRemarksValue = '';
                this.modalDescribeValue = '';
                this.startUpkeepTableData = [];
                this.$refs['formValidate'].resetFields();
            },
            // 搜索的点击事件
            searchClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 筛选栏的省略号点击事件
            showQueryChange () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                if (this.showScreenSub) {
                    this.showScreenSub = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                } else if (this.showScreenSub === false) {
                    this.showScreenSub = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                };
            },
            // 获取查询栏月份
            getYearMonthEven (e) {
                this.queryBarDateMonth = e;
            },
            // 获取页码
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 获取每页条数
            getPageOptsEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 开始保养的点击事件
            startUpkeepEvent () {
                if (this.checkObj) {
                    this.spinShow = true;
                    this.startUpkeepModal = true;
                    this.$api.upkeep.upkeepScheduleMachineHttp({
                        maintenancePlanId: this.checkObj.maintenancePlanId,
                        maintenancePlanCalendarId: this.checkObj.maintenancePlanCalendarId,
                        maintenancePlanMachineId: this.checkObj.maintenancePlanMachineId
                    }).then(res => {
                        if (res.data.status === 200) {
                            this.spinShow = false;
                            let responseData = null;
                            responseData = res.data.res;
                            this.modalDataObj = responseData;
                            this.startUpkeepTableData = this.modalDataObj.maintenanceItemList;
                            this.modalUpkeepPlanCodeValue = responseData.maintenancePlanCode;
                            this.modalMachineUpkeepCodeValue = responseData.planId;
                            this.modalWorkshopValue = responseData.workshopName;
                            this.modalProcessValue = responseData.processName;
                            this.modalUpkeepTypeValue = responseData.typeId;
                            this.modalMachineCodeValue = responseData.machineCode;
                            this.modalMachineNameValue = responseData.machineName;
                            this.modalKeyOverhaulValue = responseData.overhaul;
                            this.modalRemarksValue = responseData.remarks;
                            this.modalDescribeValue = responseData.maintenanceContents;
                            this.formValidate.modalUpkeepStartTime = toDaySeconds();
                            this.createName = responseData.createName;
                            this.createTime = responseData.createTime;
                            this.updateName = responseData.updateName;
                            this.updateTime = responseData.updateTime;
                            this.submitName = responseData.submitName;
                            this.submitTime = responseData.submitTime;
                            this.auditName = responseData.auditName;
                            this.auditTime = responseData.auditTime;
                            this.closeName = responseData.closeName;
                            this.closeTime = responseData.closeTime;
                        };
                    })
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取保养类型的请求
            getUpkeepTypeHttp () {
                this.$call('maintenance.type.list').then(res => {
                    if (res.data.status === 200) {
                        this.upkeepTypeList = res.data.res;
                    };
                });
            },
            getWorkshop () {
                return this.$api.dept.getWorkshopList().then(res => {
                    if (res.data.status === 200) {
                        let responseData = [];
                        responseData = res.data.res;
                        if (responseData !== null) {
                            let isDefaultWorkshop = null;
                            responseData.forEach((item) => {
                                if (item.isDefault === 1) {
                                    isDefaultWorkshop = item.deptId;
                                };
                            });
                            isDefaultWorkshop !== null ? this.queryBarWorkshop = isDefaultWorkshop : this.queryBarWorkshop = responseData[0].deptId;
                            // 赋值下拉框
                            this.queryBarWorkshopList = res.data.res;
                        };
                    }
                });
            },
            // 获取设备保养状态
            getMachineUpkeepState () {
                this.$api.upkeep.planCodeUpkeepStateHttp().then(res => {
                    if (res.data.status === 200) {
                        this.queryBarUpkeepStateList = res.data.res;
                    };
                });
            },
            getProcessList () {
                this.$api.process.getSearchProcessList().then(res => {
                    this.queryBarProcessList = res;
                });
            }
        },
        created () {
           this.globalLoadingShow = true;
            this.getProcessList();
            (async ()=>{
                await this.getMachineUpkeepState();
                await this.getWorkshop();
                await this.getUpkeepTypeHttp();
                await this.getListHttp();
            })();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            window.onresize = () => {
                this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
            };
        }
    };
</script>

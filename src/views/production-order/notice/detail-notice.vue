<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col>
                <Row type="flex" justify="start">
                    <Button icon="ios-create" v-show="saveParams.auditState===3" type="primary" class="queryBarMarginRight operatingSpaceMargin" @click="saveMachineEvent">保存</Button>
                    <Button v-show="parseInt(saveParams.auditState) === 1" icon="ios-create" type="primary" class="queryBarMarginRight operatingSpaceMargin" @click="editEvent">编辑</Button>
                    <Button icon="ios-create" type="primary" class="queryBarMarginRight operatingSpaceMargin" @click="backListEvent">返回列表页</Button>
                    <!--<Button v-show="saveParams.auditState===1" icon="md-checkmark" type="primary" @click="saveEvent" class="queryBarMarginRight operatingSpaceMargin">保存</Button>-->
                    <!--<Button v-show="pushSwitch" icon="ios-create" type="primary" @click="pushEvent" class="queryBarMarginRight operatingSpaceMargin">提交</Button>-->
                    <Button v-show="saveParams.auditState===2" icon="ios-undo" type="warning" @click="cancelEvent" class="queryBarMarginRight operatingSpaceMargin">撤销提交</Button>
                    <Button v-show="saveParams.auditState===2" icon="md-done-all" type="primary" @click="auditEvent" class="queryBarMarginRight operatingSpaceMargin">审核</Button>
                    <Button v-show="saveParams.auditState===3 && saveParams.startState === 0 && saveParams.isFeedingSetted === false" icon="md-refresh" type="warning" @click="unAuditEvent" class="queryBarMarginRight operatingSpaceMargin">撤销审核</Button>
                    <Button v-show="saveParams.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeClickEvent">关闭单据</Button>
                    <Button v-show="saveParams.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="openClickEvent">撤销关闭</Button>
                </Row>
            </Col>
        </Row>
        <Form :label-width="110" :show-message="false" ref="saveParams" :model="saveParams">
            <Row class="mainBar">
                <Col>
                    <Row>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="通知单号:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.code }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 单据日期:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.date }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 生产单号:" class="margin-bottom-0">
                                <Poptip class="exhibitionInputBackground widthPercentage" trigger="hover" placement="bottom">
                                    <a class="bom-box-ellipsis">{{ saveParams.prdOrderCodes }}</a>
                                    <div slot="content" style="color: #515a6e;">
                                        <p v-for="(item, index) in saveParams.prdOrderCodeArr" :key="index">{{item}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="生产车间:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.workshopName }}</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="所属工段:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.processTypeName }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="产品:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.productCode + '(' + saveParams.productName + ')' }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="规格型号:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.productModels }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="批号:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.batchCode }}</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="计量单位:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.unitName + '(' + saveParams.unitCode + ')' }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="生产数量:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.productionQty }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="完工数量:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.completionQty }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="未完工数量:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ computeNum }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="纱线用途:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.purposeName }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="纱线捻向:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.twistDirectionName }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 开台状态:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.startStateName }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 了机状态:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.finishStateName }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 溢短装(±%):" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.weightRate }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 单据状态:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.auditStateName }}</div>
                            </FormItem>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tabs v-model="activeTabPane">
                        <TabPane label="机台排产" name="0">
                            <div class="tabPaneBar">
                                <Row>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="生产工序:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.processName }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="设备机型:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.machineModelName }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="标准克重:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.gramWeight }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="标准米长:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.meters }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="公定回潮率%:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.moistureRegain }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="运转效率%:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.efficiencyPercent }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label=" 台时单产:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.hourYield }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label=" 上机准备时间:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.preparationHours }}</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label="计划开工时间:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.planStartDate }}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label=" 计划完工时间:" class="formItemMargin">
                                            <div class="exhibitionInputBackground">{{ saveParams.planFinishDate }}</div>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                            <Row>
                                <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                                    <div class="margin-bottom-10">
                                        <Button v-show="saveParams.auditState===3" type="success" icon="md-add" @click="addMachineButtonEvent">添加生产机台</Button>
                                    </div>
                                    <div>
                                        <Table border size="small" :columns="tableHeader" :data="tableData"></Table>
                                    </div>
                                    <Row type="flex" justify="end" class="total-num-big-box">
                                        合计：<Col class="total-num-box total-num-box-width border-right-none">{{ totalProductionQty }}</Col>
                                        <Col class="total-num-box total-num-box-width border-right-none">{{ totalCompletionQty }}</Col>
                                        <Col class="total-num-box total-num-box-width">{{ totalUnCompletionQty }}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane label="其他信息" name="1">
                            <operation-log
                                    :operationData="operationData"
                            ></operation-log>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Form>
        <select-machine-modal
                :spin-show="spinShow"
                :select-machine-modal-state="selectMachineModalState"
                :select-machine-machine-and-date="selectMachineMachineAndDate"
                :select-machine-modal-work-center-list="selectMachineModalWorkCenterList"
                :select-machine-modal-table-data="selectMachineModalTableData"
                @on-visible-change="selectMachineModalStateChangeEvent"
                @select-machine-modal-search-event="selectMachineModalSearchBtnEvent"
                @select-machine-modal-confirm-event="selectMachineModalConfirmEvent"
        ></select-machine-modal>
        <delete-modal
                :v-model="deleteModalState"
                :tipMsg="deleteModalMessage"
                :loading="deleteModalConfirmButtonLoading"
                @cancel="deleteModalCancelEvent"
                @confirm="deleteModalConfirmEvent"
        >
        </delete-modal>
    </card>
</template>
<script>
    import { compClientHeight, toDay, noticeTips, formatDate, accMul, getOperationData, addNum, accSub, emptyTips } from '../../../libs/common';
    import selectMachineModal from './select-machine';
    import operationLog from '../../components/operation-log';
    import deleteModal from '../../public/deleteWarning';
    export default{
        name: 'edit-notice',
        components: {
            selectMachineModal, operationLog, deleteModal
        },
        data () {
            return {
                deleteOldMachineId: null,
                deleteOldMachineIndex: null,
                deleteModalState: false,
                deleteModalMessage: '',
                deleteModalConfirmButtonLoading: false,
                spinShow: false,
                selectMachineModalState: false,
                selectMachineModalWorkCenterList: [],
                selectMachineMachineAndDate: {},
                selectMachineModalTableData: [],
                globalLoadingShow: false,
                operationData: [],
                saveParams: {},
                billDateValue: toDay(),
                activeTabPane: '0',
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 90,
                        render: (h, params) => {
                            if (!params.row.isNewMachine) {
                                return h('Button', {
                                    domProps: {
                                        innerHTML: '删除'
                                    },
                                    props: {
                                        size: 'small',
                                        disabled: params.row.machineOpenState !== 0 // 未开台的可以删除
                                    },
                                    on: {
                                        'click': () => {
                                            this.deleteOldMachineEvent(params.row.id, params.index);
                                        }
                                    }
                                });
                            } else {
                                return h('Button', {
                                    domProps: {
                                        innerHTML: '删除'
                                    },
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.tableData.splice(params.index, 1);
                                            this.calculationTotalProductionQty();
                                        }
                                    }
                                });
                            };
                        }
                    },
                    {
                        title: '生产机台',
                        key: 'machineCode',
                        minWidth: 120,
                        sortable: true
                    },
                    {
                        title: '生产机台名称',
                        key: 'machineName',
                        minWidth: 120,
                        sortable: true
                    },
                    {
                        title: '计划开台时间',
                        key: 'planDateFrom',
                        minWidth: 120,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            // 新增添加的机台可编辑
                            if (params.row.isNewMachine) {
                                return h('DatePicker', {
                                    props: {
                                        value: params.row.planDateFrom,
                                        type: 'datetime',
                                        format: 'yyyy-MM-dd HH:mm:ss',
                                        transfer: true
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.planDateFrom = e;
                                            this.$set(this.tableData, params.index, params.row);
                                            if (params.row.planDateFrom) {
                                                if (params.row.planDateTo) {
                                                    // 判断开台时间是否大于了机时间
                                                    if (new Date(params.row.planDateFrom).valueOf() > new Date(params.row.planDateTo).valueOf()) {
                                                        emptyTips(this, '计划开台时间不能大于计划了机时间');
                                                        params.row.productionQty = null;
                                                    } else {
                                                        this.$set(params.row, 'productionQty', this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                    };
                                                };
                                            } else {
                                                params.row.productionQty = e;
                                            };
                                            this.$set(this.tableData, params.index, params.row);
                                            this.calculationTotalProductionQty();
                                        },
                                        'on-open-change': () => {
                                            if (params.row.planDateFrom) {
                                                if (params.row.planDateTo) {
                                                    // 判断开台时间是否大于了机时间
                                                    if (new Date(params.row.planDateFrom).valueOf() > new Date(params.row.planDateTo).valueOf()) {
                                                        emptyTips(this, '计划开台时间不能大于计划了机时间');
                                                        params.row.productionQty = null;
                                                        params.row.planDateFrom = '';
                                                        this.$set(this.tableData, params.index, params.row);
                                                    };
                                                };
                                            };
                                        }
                                    }
                                });
                            } else {
                                return h('div', {
                                    domProps: {
                                        innerHTML: params.row.planDateFrom
                                    }
                                });
                            };
                        }
                    },
                    {
                        title: '计划了机时间',
                        key: 'planDateTo',
                        minWidth: 120,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            // 新增添加的机台可编辑
                            if (params.row.isNewMachine) {
                                return h('DatePicker', {
                                    props: {
                                        value: params.row.planDateTo,
                                        type: 'datetime',
                                        format: 'yyyy-MM-dd HH:mm:ss',
                                        transfer: true
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.planDateTo = e;
                                            this.$set(this.tableData, params.index, params.row);
                                            if (params.row.planDateTo) {
                                                if (params.row.planDateFrom) {
                                                    if (new Date(params.row.planDateTo).valueOf() > new Date(params.row.planDateFrom).valueOf()) {
                                                        this.$set(params.row, 'productionQty', this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                    } else {
                                                        emptyTips(this, '计划了机时间下于计划开台时间');
                                                        params.row.productionQty = 0;
                                                    }
                                                };
                                            } else {
                                                params.row.productionQty = e;
                                            };
                                            this.$set(this.tableData, params.index, params.row);
                                            this.calculationTotalProductionQty();
                                        },
                                        'on-open-change': () => {
                                            if (params.row.planDateTo) {
                                                if (params.row.planDateFrom) {
                                                    if (new Date(params.row.planDateTo).valueOf() > new Date(params.row.planDateFrom).valueOf()) {
                                                        // this.$set(params.row, 'productionQty', this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                    } else {
                                                        emptyTips(this, '计划了机时间下于计划开台时间');
                                                        params.row.planDateTo = '';
                                                        params.row.productionQty = 0;
                                                        this.tableData[params.index] = params.row;
                                                    }
                                                };
                                            };
                                        }
                                    }
                                });
                            } else {
                                return h('div', {
                                    domProps: {
                                        innerHTML: params.row.planDateTo
                                    }
                                });
                            };
                        }
                    },
                    {
                        title: '实际开台时间',
                        key: 'startTime',
                        minWidth: 120,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '实际了机时间',
                        key: 'endTime',
                        minWidth: 120,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '排产数量',
                        key: 'productionQty',
                        width: 161,
                        sortable: true,
                        fixed: 'right',
                        align: 'left',
                        render: (h, params) => {
                            // 新增添加的机台可编辑
                            if (params.row.isNewMachine) {
                                return h('InputNumber', {
                                    props: {
                                        value: params.row.productionQty ? params.row.productionQty : null
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.productionQty = e;
                                            this.$set(this.tableData, params.index, params.row);
                                            this.calculationTotalProductionQty();
                                        }
                                    }
                                });
                            } else {
                                return h('div', {
                                    style: {
                                        paddingLeft: '8px'
                                    }
                                }, [
                                    h('p', {
                                        domProps: {
                                            innerHTML: params.row.productionQty
                                        }
                                    })
                                ]);
                            };
                        }
                    },
                    {
                        title: '完工数量',
                        key: 'completionQty',
                        width: 161,
                        sortable: true,
                        fixed: 'right',
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    paddingLeft: '8px'
                                }
                            }, [
                                h('div', {
                                    domProps: {
                                        innerHTML: params.row.completionQty ? params.row.completionQty : 0
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '未完工数量',
                        key: 'unCompletionQty',
                        width: 160,
                        sortable: true,
                        fixed: 'right',
                        align: 'left',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    paddingLeft: '8px'
                                }
                            }, [
                                h('div', {
                                    domProps: {
                                        innerHTML: params.row.unCompletionQty
                                    }
                                })
                            ]);
                        }
                    }
                ],
                tableData: [],
                totalProductionQty: 0,
                totalUnCompletionQty: 0,
                totalCompletionQty: 0,
                toCreated: false
            };
        },
        methods: {
            closeClickEvent () {
                if (this.saveParams.finishState === 2) {
                    this.$call('prd.notice.close', [this.$route.query.id]).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'closeTips');
                            this.getDetailHttp();
                        };
                    });
                } else {
                    emptyTips(this, '全部了机,才能进行关闭!');
                };
            },
            openClickEvent () {
                this.$call('prd.notice.unclose', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unCloseTips');
                        this.getDetailHttp();
                    };
                });
            },
            getWorkCenterListHttp () {
                return this.$call('work.center.list', {
                    processId: this.saveParams.processId,
                    auditState: 3,
                    enableState: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        this.selectMachineModalWorkCenterList = res.data.res;
                    };
                });
            },
            // 保存机台事件
            saveMachineEvent () {
                let isEmpty = false;
                if (this.tableData && this.tableData.length !== 0) {
                    let paramsData = this.tableData.filter(item => {
                        item.prdNoticeId = this.saveParams.id;
                        item.hourYield = this.saveParams.hourYield;
                        return item.isNewMachine === true;
                    });
                    paramsData.forEach((item) => {
                        if (!item.planDateFrom || !item.planDateTo || !item.productionQty) {
                            isEmpty = true;
                        };
                    });
                    if (!isEmpty) {
                        this.globalLoadingShow = true;
                        this.$call('prd.notice.machine.save', paramsData).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'saveTips');
                                this.getDetailHttp();
                            } else {
                                this.globalLoadingShow = false;
                            };
                        });
                    } else {
                        emptyTips(this, '机台信息不能为空!');
                    };
                } else {
                    emptyTips(this, '请添加机台!');
                };
            },
            // 删除modal
            deleteModalCancelEvent () {
                this.deleteOldMachineId = null;
                this.deleteOldMachineIndex = null;
                this.deleteModalConfirmButtonLoading = false;
                this.deleteModalState = false;
            },
            deleteModalConfirmEvent () {
                this.$call('prd.notice.machine.delete', [this.deleteOldMachineId]).then(res => {
                    if (res.data.status === 200) {
                        this.tableData.splice(this.deleteOldMachineIndex, 1);
                        this.deleteOldMachineId = null;
                        this.deleteOldMachineIndex = null;
                        this.deleteModalConfirmButtonLoading = false;
                        this.deleteModalState = false;
                        this.calculationTotalProductionQty();
                    } else {
                        this.deleteModalConfirmButtonLoading = false;
                    };
                });
            },
            // 删除原机台
            deleteOldMachineEvent (id, index) {
                this.deleteOldMachineId = id;
                this.deleteOldMachineIndex = index;
                this.deleteModalState = true;
                this.deleteModalMessage = '确认删除?';
            },
            selectMachineModalStateChangeEvent (e) {
                this.selectMachineModalState = e;
            },
            // 选择机台modal的搜索按钮事件
            selectMachineModalSearchBtnEvent (event) {
                this.getWorkCenterMachineListHttp(event.machineCodeOrName, event.workCenterId);
            },
            // 累加机台
            addMachineToTable (checkArray) {
                checkArray.forEach(item => {
                    if (!item._disabled) {
                        this.$delete(item, 'id');
                        if (item.lastPlanDateTo) {
                            this.$set(item, 'planDateFrom', formatDate(new Date(item.lastPlanDateTo).valueOf() + parseFloat(this.saveParams.preparationHours) * 60 * 60 * 1000));
                        };
                        this.$set(item, 'planDateTo', '');
                        this.$set(item, 'isNewMachine', true);
                        this.$set(item, 'completionQty', 0);
                        this.$set(item, 'unCompletionQty', 0);
                        this.$set(item, 'productionQty', 0);
                        this.tableData.push(item);
                    };
                });
            },
            // 选择机台modal的确认按钮
            selectMachineModalConfirmEvent (checkArray) {
                if (this.tableData && this.tableData.length !== 0) {
                    if (this.tableData[this.tableData.length - 1].planDateFrom) {
                        this.addMachineToTable(checkArray);
                    } else {
                        this.addMachineToTable(checkArray);
                    };
                } else {
                    this.addMachineToTable(checkArray);
                };
                this.selectMachineModalState = false;
            },
            // 计算时间差(小时)
            dateDiff (sDate1, sDate2) {
                let oDate1, oDate2;
                oDate1 = new Date(sDate1).getTime();
                oDate2 = new Date(sDate2).getTime();
                let totalMilliseconds = oDate1 - oDate2;// 相差的毫秒数
                if (isNaN(totalMilliseconds) || totalMilliseconds < 0) {
                    return null;
                }
                return parseInt(totalMilliseconds / 1000 / 60 / 60);
            },
            productionQtyCalculation (beginDate, endDate) {
                let readyTime = this.saveParams.preparationHours; // 上机准备时间
                let dateFromTime = null;
                let dateToTime = null;
                let diffHoure = null;
                let dateFrom = null;
                let dateTo = null;
                dateFrom = formatDate(new Date(beginDate).getTime() + (readyTime * 60 * 60 * 1000)); // 格式****-**-** **:**
                dateTo = formatDate(new Date(endDate).getTime() + (readyTime * 60 * 60 * 1000));
                dateFromTime = new Date(beginDate).getTime(); // 开始时间戳
                dateToTime = new Date(endDate).getTime(); // 结束时间戳
                diffHoure = this.dateDiff(dateToTime, dateFromTime); // 时间差(时)
                return {
                    productionQty: accMul(diffHoure, parseFloat(this.saveParams.hourYield)), // 排产数量
                    dateFrom: dateFrom,
                    dateTo: dateTo
                };
            },
            addMachineButtonEvent () {
                this.spinShow = true;
                this.selectMachineModalState = true;
                this.getWorkCenterMachineListHttp();
            },
            // 获取工作中心下的机台
            getWorkCenterMachineListHttp (machineCodeOrName = '', workCenterId = '') {
                this.$call('work.center.machine.driving.list', {
                    machine: machineCodeOrName,
                    workCenterId: workCenterId,
                    processId: this.saveParams.processId,
                    workshopId: this.saveParams.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.machineList.forEach((allMachineItem) => {
                            allMachineItem.machineMonthList.forEach(machineDayItem => {
                                let month = new Date(machineDayItem.day).getMonth() + 1;
                                let day = new Date(machineDayItem.day).getDate();
                                allMachineItem[`${month}-${day}`] = machineDayItem.productList;
                            });
                            this.tableData.forEach((selectMachineItem) => {
                                if (allMachineItem.machineId === selectMachineItem.machineId) {
                                    allMachineItem._disabled = true;
                                    allMachineItem._checked = true;
                                };
                            });
                        });
                        this.selectMachineMachineAndDate = res.data.res;
                        this.selectMachineModalTableData = res.data.res.machineList;
                        this.spinShow = false;
                    };
                });
            },
            // 合计排产数量
            calculationTotalProductionQty () {
                let totalNum = 0;
                let unCompletionQty = 0;
                let completionQty = 0;
                this.tableData.forEach((item) => {
                    if (item.productionQty) {
                        totalNum = addNum(item.productionQty, totalNum);
                        item.unCompletionQty = accSub(item.productionQty, item.completionQty);
                        !item.unCompletionQty ? item.unCompletionQty = 0 : false;
                        unCompletionQty = addNum(unCompletionQty, item.unCompletionQty);
                        completionQty = addNum(completionQty, item.completionQty);
                    };
                });
                this.totalProductionQty = totalNum;
                this.totalUnCompletionQty = unCompletionQty;
                this.totalCompletionQty = completionQty;
            },
            backListEvent () {
                this.$router.push({
                    path: 'notice',
                    query: {
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'notice-detail');
            },
            // 保存的事件
            saveEvent () {
                this.tableData.forEach(item => this.$delete(item, 'id'));
                this.$set(this.saveParams, 'noticeMachineList', this.tableData);
                this.$set(this.saveParams, 'date', formatDate(this.billDateValue));
                this.saveHttp(this.saveParams).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.getDetailHttp();
                    };
                });
            },
            editEvent () {
                this.$router.push({
                    path: 'editNotice',
                    query: {
                        id: this.$route.query.id,
                        edit: true,
                        activated: true
                    }
                });
                this.$store.commit('removeTag', 'notice-detail');
            },
            // 保存的请求
            saveHttp (params) {
                params.planStartDate = formatDate(params.planStartDate);
                params.planFinishDate = formatDate(params.planFinishDate);
                return this.$call('prd.notice.save', params);
            },
            pushEvent () {
                this.$refs['saveParams'].validate((valid) => {
                    if (valid) {
                        let isEmpty = false;
                        if (this.tableData.length !== 0) {
                            this.tableData.forEach((item) => {
                                if (!item.planDateFrom) {
                                    isEmpty = true;
                                } else if (!item.planDateTo) {
                                    isEmpty = true;
                                } else if (!item.productionQty) {
                                    isEmpty = true;
                                } else {
                                    this.$set(item, 'planDateFrom', item.planDateFrom + ':00');
                                    this.$set(item, 'planDateTo', item.planDateTo + ':00');
                                };
                            });
                            if (isEmpty === false) {
                                this.tableData.forEach(item => this.$delete(item, 'id'));
                                this.$set(this.saveParams, 'noticeMachineList', this.tableData);
                                this.$set(this.saveParams, 'date', formatDate(this.billDateValue));
                                this.saveHttp(this.saveParams).then(res => {
                                    if (res.data.status === 200) {
                                        this.$call('prd.notice.submit', [this.$route.query.id]).then(res => {
                                            if (res.data.status === 200) {
                                                noticeTips(this, 'submitTips');
                                                this.getDetailHttp();
                                            };
                                        });
                                    };
                                });
                            } else {
                                this.$Notice.warning({
                                    title: '提示',
                                    desc: '预计生产时间不能为空!'
                                });
                            };
                        } else {
                            this.$Notice.warning({
                                title: '提示',
                                desc: '请选择机台!'
                            });
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            cancelEvent () {
                this.$call('prd.notice.cancel', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'cancelTips');
                        this.getDetailHttp();
                    };
                });
            },
            auditEvent () {
                this.$call('prd.notice.approve', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'auditTips');
                        this.getDetailHttp();
                    };
                });
            },
            unAuditEvent () {
                this.$call('prd.notice.unapprove', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unAuditTips');
                        this.getDetailHttp();
                    };
                });
            },
            closeEvent () {
                this.$call('prd.notice.close', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'closeTips');
                        this.getDetailHttp();
                    };
                });
            },
            unCloseEvent () {
                this.$call('prd.notice.unclose', [this.$route.query.id]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unCloseTips');
                        this.getDetailHttp();
                    };
                });
            },
            // 获取通知单的详情
            getDetailHttp () {
                return this.$call('prd.notice.detail', { id: this.$route.query.id }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.saveParams = responseData;
                        !this.saveParams.completionQty ? this.saveParams.completionQty = 0 : false;
                        responseData.prdOrderCodeArr = responseData.prdOrderCodes.split(',');
                        this.tableData = responseData.noticeMachineList;
                        this.operationData = getOperationData(responseData);
                        this.calculationTotalProductionQty();
                        this.globalLoadingShow = false;
                        this.getWorkCenterListHttp();
                        return responseData;
                    };
                });
            }
        },
        computed: {
            computeNum () {
                return accSub(this.saveParams.productionQty, this.saveParams.completionQty);
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDetailHttp();
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                this.globalLoadingShow = true;
                this.getDetailHttp();
            };
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>
<style scoped>
    .bom-box-ellipsis{
        width:100px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900
    }
</style>


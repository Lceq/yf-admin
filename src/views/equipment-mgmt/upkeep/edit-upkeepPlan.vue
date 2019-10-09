<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row>
            <Col>
                <Button icon="md-checkmark" :disabled="keptSwitch" @click="saveButtonEvent" type="primary">保存</Button>
                <Dropdown class="margin-bottom-10" @on-click="getPushEvent" trigger="click">
                    <Button type="primary">
                        提交
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="pushSwitch" name="提交">提交</DropdownItem>
                        <DropdownItem :disabled="cancelSwitch" name="撤销">撤销</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="margin-bottom-10" @on-click="getAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="margin-bottom-10" @on-click="getCloseEvent" trigger="click">
                    <Button type="info">
                        业务操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="closeSwitch" name="关闭">关闭</DropdownItem>
                        <DropdownItem :disabled="openSwitch" name="反关闭">反关闭</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
            <Row>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养计划单:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{formValidate.code}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="生产车间:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{formValidate.workshopName}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="所属工序:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{formValidate.processName}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养月份:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{formValidate.yearMonth}}</div>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养类型:" class="formItemMargin" prop="typeId">
                        <Select readonly v-model="formValidate.typeId" placeholder="请选择保养类型">
                            <Option v-for="item in upkeepTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="单据状态:" class="formItemMargin">
                        <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :md="24" :sm="24" :lg="24">
                    <Tabs value="upkeepSchedule">
                        <TabPane label="保养日程" name="upkeepSchedule">
                            <div class="tableFont">
                                <Row type="flex" align="middle" class="tableHeaderStyle">
                                    <Col :sm="2" :md="2" :lg="2" class="textCenter">操作</Col>
                                    <Col :sm="3" :md="2" :lg="2" class="textCenter">计划保养日期</Col>
                                    <Col :sm="3" :md="2" :lg="2" class="textCenter">是否工作日</Col>
                                    <Col :sm="10" :md="10" :lg="10" class="textCenter">
                                        <Row type="flex" align="middle">
                                            <Col :sm="6" :md="5" :lg="5">设备编号</Col>
                                            <Col :sm="6" :md="6" :lg="6">设备名称</Col>
                                            <Col :sm="6" :md="5" :lg="5">总保养次数</Col>
                                            <Col :sm="6" :md="5" :lg="5">上次保养时间</Col>
                                        </Row>
                                    </Col>
                                    <Col :sm="3" :md="4" :lg="4" class="textCenter">重点检修</Col>
                                    <Col :sm="3" :md="4" :lg="4" class="textCenter">备注</Col>
                                </Row>
                                <div :style="{ 'height':tableHeight + 'px' ,'overflow-y':'auto'}">
                                    <Row v-for="(item,index) in formValidate.maintenancePlanCalendarList" :key="index" type="flex" align="middle" class="tableRowStyle">
                                        <Col :sm="2" :md="2" :lg="2" class="textCenter">
                                            <Button size="small" @click="clickSelectMachineEvent(index)">选择机台</Button>
                                        </Col>
                                        <Col :sm="3" :md="2" :lg="2" class="textCenter machineLineHeight">{{item.maintenancePlanDate}}</Col>
                                        <Col :sm="3" :md="2" :lg="2" class="textCenter machineLineHeight">
                                            <Button size="small" @click="clickIsWorkDataEvent(index)">{{item.isWorking === false?'否':'是'}}</Button>
                                        </Col>
                                        <Col :sm="10" :md="10" :lg="10" class="textCenter colTextAreaPadding rowMinHeightStyle">
                                            <Row v-for="(machineItem,machineIndex) in item.maintenancePlanMachineList" :key="machineIndex" class="machineRowMargin">
                                                <Col :sm="6" :md="5" :lg="5" class="machineLineHeight">{{machineItem.machineCode}}</Col>
                                                <Col :sm="6" :md="6" :lg="6" class="machineLineHeight">{{machineItem.machineName}}</Col>
                                                <Col :sm="6" :md="5" :lg="5" class="machineLineHeight">{{machineItem.maintenanceTimes ? machineItem.maintenanceTimes : 0}}</Col>
                                                <Col :sm="6" :md="5" :lg="5" class="machineLineHeight">{{machineItem.lastMaintenanceTime ? machineItem.lastMaintenanceTime : '无'}}</Col>
                                            </Row>
                                        </Col>
                                        <Col :sm="3" :md="4" :lg="4" class="textAreaStyle"><Input v-model="item.overhaul" type="textarea" placeholder="请输入" /></Col>
                                        <Col :sm="3" :md="4" :lg="4" class="textAreaStyle"><Input v-model="item.remarks" type="textarea" placeholder="请输入" /></Col>
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane label="其他信息" name="other">
                            <operation-log :operationData="operationData"></operation-log>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col>
                <Modal
                        v-model="selectMachineModalState"
                        title="选择机台"
                        width="1000"
                        :mask-closable="false"
                >
                    <modal-content-loading :spinShow="spinShow"></modal-content-loading>
                    <Button :loading="confirmSelectLoading" class="margin-bottom-10" type="success" @click="returnMachineEvent">确认选择</Button>
                    <Table :row-class-name="rowClassName" height="600" @on-selection-change="getCheckMachineChangeEven" size="small" border ref="selection" :columns="selectMachineTableHeader" :data="selectMachineTableData"></Table>
                    <div slot="footer"></div>
                </Modal>
            </Col>
        </Row>
    </card>
</template>
<script>
    import { noticeTips, emptyTips, getOperationData } from '../../../libs/common';
    import pageOtherMessage from '../../components/pageOtherMessage';
    import modalContentLoading from '../../components/modal-content-loading';
    import operationLog from '../../components/operation-log';
    export default {
        components: { pageOtherMessage, modalContentLoading, operationLog },
        data () {
            const validateTypeId = (rulue, value, callback) => { value ? callback() : callback(new Error) };
            return {
                operationData: [],
                globalLoadingShow: false,
                confirmSelectLoading: false,
                spinShow: false,
                tableHeight: 0,
                toCreated: false,
                isPush: false,
                keptSwitch: false,
                pushSwitch: true,
                cancelSwitch: true,
                auditSwitch: true,
                againstSwitch: true,
                closeSwitch: true,
                openSwitch: true,
                formValidate: {
                    upkeepPlanCode: '',
                    workshopName: '',
                    processName: '',
                    typeId: '',
                    yearMonth: '',
                    upkeepPlanCodeState: ''
                },
                ruleValidate: {
                    typeId: [{ required: true, validator: validateTypeId, trigger: 'change' }]
                },
                processList: [],
                upkeepTypeList: [],
                editId: '',
                checkMachineData: [],
                selectMachineIndex: '',
                selectMachineModalState: false,
                dayMachineList: [],
                selectMachineTableHeader: [
                    {type: 'selection', width: 60},
                    {title: '设备编号', key: 'code', width: 100},
                    {title: '设备名称', key: 'name', width: 100},
                    {title: '车间', key: 'workshopName', width: 100},
                    {title: '工序', key: 'processName', width: 80},
                    {title: '当前品种', key: 'productName', width: 120},
                    {title: '当前批号', key: 'batchCode', width: 120},
                    {title: '上次保养时间', key: 'lastMaintenanceTime', width: 150, align: 'center'},
                    {title: '总保养次数', key: 'maintenanceTimes', minWidth: 110, align: 'right'}
                ],
                selectMachineTableData: [],
                workshopId: '',
                processId: '',
                AllMachineList: []
            };
        },
        methods: {
            // 关闭事件
            getCloseEvent (e) {
                if (e === '关闭' && this.closeSwitch === false) {
                    this.$api.upkeep.planCodeCloseHttp([this.editId]).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'closeTips');
                            this.getDetailHttp();
                        };
                    });
                } else if (e === '反关闭' && this.openSwitch === false) {
                    this.$api.upkeep.planCodeUnCloseHttp([this.editId]).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'unCloseTips');
                            this.getDetailHttp();
                        };
                    });
                };
            },
            // 审核事件
            getAuditEvent (e) {
                if (e === '审核' && this.auditSwitch === false) {
                    this.$api.upkeep.planCodeApproveHttp([this.editId]).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'auditTips');
                            this.getDetailHttp();
                        };
                    });
                } else if (e === '反审核' && this.againstSwitch === false) {
                    if (this.upkeepState === '1' || this.upkeepState === '2') {
                        this.$Message.warning('该计划单不可反审核!');
                    } else {
                        this.$api.upkeep.planCodeUnApproveHttp([this.editId]).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'unAuditTips');
                                this.getDetailHttp();
                            };
                        });
                    }
                };
            },
            // 提交的请求
            pushHttp () {
                this.$api.upkeep.planCodeSubmitHttp([this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.isPush = false;
                        noticeTips(this, 'submitTips');
                        this.getDetailHttp();
                    };
                });
            },
            // 提交事件
            getPushEvent (e) {
                if (e === '提交' && this.pushSwitch === false) {
                    // 先保存
                    this.$refs['formValidate'].validate((valid) => {
                        if (valid) {
                            this.isPush = true;
                            this.editHttp();
                        } else {
                            noticeTips(this, 'unCompleteTips');
                        };
                    });
                } else if (e === '撤销' && this.cancelSwitch === false) {
                    this.$api.upkeep.planCodeCancelHttp([this.editId]).then(res => {
                        if (res.data.status === 200) {
                            noticeTips(this, 'cancelTips');
                            this.getDetailHttp();
                        };
                    });
                };
            },
            // 编辑的请求
            editHttp () {
                this.$api.upkeep.planCodeSaveHttp(this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        if (this.isPush === true) {
                            this.pushHttp();
                        } else {
                            noticeTips(this, 'saveTips');
                            this.getDetailHttp();
                        };
                    };
                });
            },
            // 表格行样式
            rowClassName (row, index) {
                if (row.isOtherSelect) {
                    return 'rowClassName';
                } else {
                    return '';
                };
            },
            // 返回机台的点击事件
            returnMachineEvent () {
                if (this.dayMachineList && this.dayMachineList.length !== 0) {
                    this.confirmSelectLoading = true;
                    this.$call('machine.maintenance.repair.listByIds', this.dayMachineList.map(item => item.machineId)).then(res => {
                        if (res.data.status === 200) {
                            this.formValidate.maintenancePlanCalendarList[this.selectMachineIndex].maintenancePlanMachineList = res.data.res.map(item => {
                                this.$set(item, 'machineId', item.id);
                                this.$set(item, 'machineName', item.name);
                                this.$set(item, 'machineCode', item.code);
                                this.$delete(item, 'id');
                                return item;
                            });
                            this.selectMachineModalState = false;
                            this.confirmSelectLoading = false;
                        } else {
                            this.confirmSelectLoading = false;
                        };
                    })
                } else {
                    this.formValidate.maintenancePlanCalendarList[this.selectMachineIndex].maintenancePlanMachineList = [];
                    this.selectMachineModalState = false;
                    this.confirmSelectLoading = false;
                    // this.$Message.warning('请选择操作对象!');
                };
            },
            // 获取勾选的机台
            getCheckMachineChangeEven (e) {
                this.dayMachineList = e;
            },
            // 保存的事件
            saveButtonEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.$api.upkeep.planCodeSaveHttp(this.formValidate).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'saveTips');
                                this.getDetailHttp();
                            };
                        });
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 选中机台的点击事件
            clickSelectMachineEvent (index) {
                this.spinShow = true;
                this.selectMachineModalState = true;
                this.AllMachineList = [];
                // 获取所有日期的机台
                this.formValidate.maintenancePlanCalendarList.forEach((datesItem) => {
                    if (datesItem.maintenancePlanMachineList !== null) {
                        datesItem.maintenancePlanMachineList.forEach((dateMachineItem) => {
                            this.AllMachineList.push(dateMachineItem);
                        });
                    };
                });
                this.dayMachineList = [];
                this.selectMachineIndex = index;
                this.getMachineListHttp();
                // 获取当前日期的所有机台id
                if (this.formValidate.maintenancePlanCalendarList[index].maintenancePlanMachineList !== null) {
                    this.dayMachineList = this.formValidate.maintenancePlanCalendarList[index].maintenancePlanMachineList;
                } else {
                    this.dayMachineList = [];
                };
            },
            //  获取机台列表的请求
            getMachineListHttp () {
                this.$call('machine.maintenance.repair.list', {
                    workshopId: this.workshopId,
                    processId: this.processId
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((allMachineItem) => {
                            this.$set(allMachineItem, 'machineId', allMachineItem.id);
                            this.$set(allMachineItem, 'machineName', allMachineItem.name);
                            this.$set(allMachineItem, 'machineCode', allMachineItem.code);
                            delete allMachineItem.id;
                            if (this.dayMachineList !== null) {
                                if (this.dayMachineList.length !== 0) {
                                    this.dayMachineList.forEach((dayMachineItem) => {
                                        if (allMachineItem.machineId === dayMachineItem.machineId) {
                                            this.$set(allMachineItem, '_checked', true);
                                            this.$set(allMachineItem, 'isOtherSelect', true);
                                        };
                                        delete dayMachineItem.id;
                                    });
                                    this.AllMachineList.forEach((bgItem) => {
                                        if (allMachineItem.machineId === bgItem.machineId) {
                                            this.$set(allMachineItem, 'isOtherSelect', true);
                                        };
                                    });
                                } else {
                                    this.AllMachineList.forEach((bgItem) => {
                                        if (allMachineItem.machineId === bgItem.machineId) {
                                            this.$set(allMachineItem, 'isOtherSelect', true);
                                        };
                                    });
                                };
                            };
                            delete allMachineItem.id;
                        });
                        this.spinShow = false;
                        this.selectMachineTableData = res.data.res;
                    };
                });
            },
            // 是否工作日的点击事件
            clickIsWorkDataEvent (index) {
                this.$set(this.formValidate.maintenancePlanCalendarList[index], 'isWorking', !this.formValidate.maintenancePlanCalendarList[index].isWorking);
            },
            // 获取保养类型的请求
            getUpkeepTypeHttp () {
                return this.$api.upkeep.upkeepTypeListHttp().then(res => {
                    if (res.data.status === 200) {
                        this.upkeepTypeList = res.data.res;
                    };
                });
            },
            // 设置DropDown的状态
            getDropdownStateChange (e) {
                if (e !== null) {
                    // 根据选中的auditState状态决定按钮的状态
                    if (e.auditState === 1) {
                        // 保存
                        this.keptSwitch = false;
                        this.auditSwitch = true;
                        this.againstSwitch = true;
                        this.pushSwitch = false;
                        this.cancelSwitch = true;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    } else if (e.auditState === 2) {
                        // 待审核
                        this.keptSwitch = true;
                        this.auditSwitch = false;
                        this.againstSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = false;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    } else if (e.auditState === 3) {
                        // 已审核
                        if (e.completionState === 1 || e.completionState === 2) {
                            this.againstSwitch = true;
                        } else {
                            this.againstSwitch = false;
                        };
                        this.keptSwitch = true;
                        this.auditSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.closeSwitch = false;
                        this.openSwitch = true;
                    } else if (e.auditState === 4) {
                        // 已关闭
                        this.keptSwitch = true;
                        this.auditSwitch = true;
                        this.againstSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.closeSwitch = true;
                        this.openSwitch = false;
                    };
                } else {
                    this.keptSwitch = true;
                    this.auditSwitch = true;
                    this.againstSwitch = true;
                    this.pushSwitch = true;
                    this.cancelSwitch = true;
                    this.closeSwitch = true;
                    this.openSwitch = true;
                };
            },
            // 获取详情
            getDetailHttp () {
                return this.$call('maintenance.plan.detail', {id: this.editId}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = {};
                        responseData = res.data.res;
                        this.getDropdownStateChange(responseData);
                        this.globalLoadingShow = false;
                        responseData.maintenancePlanCalendarList.forEach((dateListItem) => {
                            if (dateListItem.maintenancePlanMachineList !== null && dateListItem.maintenancePlanMachineList.length !== 0) {
                                dateListItem.maintenancePlanMachineList.forEach((machineListItem) => {
                                    delete machineListItem.id;
                                });
                            };
                        });
                        this.formValidate = responseData;
                        this.operationData = getOperationData(responseData);
                        this.workshopId = responseData.workshopId;
                        this.processId = responseData.processId;
                    };
                });
            },
            getProcessList () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.processList = res;
                });
            },
            getDependentDataHttp () {
                this.editId = this.$route.query.editId;
                this.globalLoadingShow = true;
                (async () => {
                    await this.getProcessList();
                    await this.getUpkeepTypeHttp();
                    await this.getDetailHttp();
                })()
            },
            calculationTableHeight () {
                this.tableHeight = document.documentElement.clientHeight - 380;
                window.onresize = () => {
                    this.tableHeight = document.documentElement.clientHeight - 380;
                };
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        activated () {
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                setTimeout(() => {
                    this.$refs['formValidate'].resetFields();
                    this.getDependentDataHttp();
                },0);
            };
            this.$nextTick(()=>{ this.calculationTableHeight(); });
            this.toCreated = false;
            this.$route.query.activated = false;
        },
        mounted () {
            this.$nextTick(()=>{ this.calculationTableHeight(); });
        }
    };
</script>
<style>
    .ivu-table .rowClassName td{
        color: red;
    }
    .colTextAreaPadding{
        padding:2px 0;
    }
    .machineLineHeight{
        /*line-height: 30px;*/
    }
    .machineRowMargin{
        margin:1px 0;
    }
    .textAreaStyle{
        padding:2px 1px;
    }
    .tableRowStyle{
        border-bottom:1px solid #dcdee2;
        border-left:1px solid #dcdee2;
        border-right:1px solid #dcdee2;
    }
    .tableFont{
        font-size: 12px;
    }
    .tableHeaderStyle{
        overflow-x: auto;
        border:1px solid #dcdee2;
        padding:4px 0;
        font-weight: bold;
    }
</style>

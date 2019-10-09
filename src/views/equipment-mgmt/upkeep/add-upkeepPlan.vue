<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex">
            <Col class="margin-bottom-10">
                <Button icon="md-checkmark" @click="saveButtonEvent" type="primary">保存</Button>
                <Button icon="ios-create" @click="pushButtonEvent" type="primary">提交</Button>
            </Col>
        </Row>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
            <Row>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养计划单:" class="formItemMargin">
                        <Input readonly v-model="formValidate.upkeepPlanCode" placeholder="自动生成保养计划单"></Input>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="生产车间:" prop="workshopValue" class="formItemMargin">
                        <Select clearable v-model="formValidate.workshopValue" placeholder="请选择车间">
                            <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="所属工序:" prop="processValue" class="formItemMargin">
                        <Select clearable v-model="formValidate.processValue" @on-change="getProcessEvent" placeholder="请选择工序">
                            <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养月份:" prop="monthValue" class="formItemMargin">
                        <DatePicker :editable="false" class="widthPercentage" v-model="formValidate.monthValue" @on-change="getUpkeepDateEvent" type="month" placeholder="请选择保养月份"></DatePicker>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="8" :lg="6">
                    <FormItem label="保养类型:" prop="upkeepTypeValue" class="formItemMargin">
                        <Select v-model="formValidate.upkeepTypeValue" placeholder="请选择保养类型">
                            <Option v-for="item in upkeepTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :md="24" :sm="24" :lg="24">
                    <Tabs value="upkeepSchedule">
                        <TabPane label="保养日程" name="upkeepSchedule">
                            <div style="font-size: 12px;">
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
                                <div :style="{ 'height':tableContentScroll + 'px' ,'overflow-y':'auto'}">
                                    <Row v-for="(item,index) in tableData" :key="index" type="flex" align="middle" class="tableRowStyle">
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
                                        <Col :sm="3" :md="4" :lg="4" class="textAreaStyle"><Input v-model="item.overhaul" :autosize="{minRows: 2,maxRows: 2}" type="textarea" placeholder="请输入" /></Col>
                                        <Col :sm="3" :md="4" :lg="4" class="textAreaStyle"><Input v-model="item.remarks" :autosize="{minRows: 2,maxRows: 2}" type="textarea" placeholder="请输入" /></Col>
                                    </Row>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Form>
        <Modal
                v-model="selectMachineModalState"
                title="选择机台"
                width="1000"
                :mask-closable="false"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Button class="margin-bottom-10" :loading="confirmSelectLoading" type="success" @click="returnMachineEvent">确认选择</Button>
            <Table :row-class-name="rowClassName" height="600" @on-selection-change="getCheckMachineChangeEven" size="small" border ref="selection" :columns="selectMachineTableHeader" :data="selectMachineTableData"></Table>
            <div slot="footer"></div>
        </Modal>
    </card>
</template>
<script>
    import { noticeTips, emptyTips } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        name: 'add-upkeep-plan',
        components: { modalContentLoading },
        data () {
            const validateMonth = (rule, value, callback) => value ? callback() : callback(new Error(''));
            const validateWorkshopValue = (rule, value, callback) => value ? callback() : callback(new Error(''));
            const validateProcessValue = (rule, value, callback) => value ? callback() : callback(new Error(''));
            const validateUpkeepTypeValue = (rule, value, callback) => value ? callback() : callback(new Error(''));
            return {
                confirmSelectLoading: false,
                globalLoadingShow: false,
                spinShow: false,
                tableContentScroll: document.documentElement.clientHeight - 380,
                formValidate: {
                    upkeepPlanCode: '',
                    workshopValue: '',
                    processValue: '',
                    upkeepTypeValue: '',
                    monthValue: '',
                    upkeepPlanCodeState: ''
                },
                ruleValidate: {
                    workshopValue: [{ required: true, validator: validateWorkshopValue, trigger: 'change' }],
                    processValue: [{ required: true, validator: validateProcessValue, trigger: 'change' }],
                    upkeepTypeValue: [{ required: true, validator: validateUpkeepTypeValue, trigger: 'change' }],
                    monthValue: [{ required: true, validator: validateMonth, trigger: 'change' }]
                },
                requestData: {
                    'code': '00001',
                    'workshopId': 21,
                    'processId': 4,
                    'yearMonth': '201812',
                    'typeId': 1,
                    maintenancePlanCalendarList: []
                },
                selectMachineIndex: '',
                dayMachineList: [],
                selectMachineTableHeader: [
                    {type: 'selection', width: 60, align: 'center'},
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
                selectMachineModalState: false,
                tableData: [],
                workshopList: [],
                processList: [],
                upkeepTypeList: [],
                isPush: false,
                AllMachineList: [],
                isActivating: false,
                toCreated: false
            };
        },
        methods: {
            // 获取工序
            getProcessEvent () {
                this.tableData.forEach((item) => {
                    item.maintenancePlanMachineList = [];
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
                            this.tableData[this.selectMachineIndex].maintenancePlanMachineList = res.data.res.map(item => {
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
                    this.tableData[this.selectMachineIndex].maintenancePlanMachineList = [];
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
                        this.addPlanHttp();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 提交的事件
            pushButtonEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.isPush = true;
                        this.addPlanHttp();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            //  新增的请求
            addPlanHttp () {
                let requestData = {
                    'workshopId': this.formValidate.workshopValue,
                    'processId': this.formValidate.processValue,
                    'yearMonth': this.formValidate.monthValue,
                    'typeId': this.formValidate.upkeepTypeValue,
                    'maintenancePlanCalendarList': this.tableData
                };
                this.$api.upkeep.planCodeSaveHttp(requestData).then(res => {
                    if (res.data.status === 200) {
                        if (this.isPush === true) {
                            this.pushHttp(res.data.res);
                        } else {
                            this.$store.commit('removeTag', 'addUpkeep');
                            noticeTips(this, 'saveTips');
                            this.$router.push({
                                path: 'editUpkeep',
                                query: {
                                    editId: res.data.res,
                                    activated: true
                                }
                            });
                        };
                    };
                });
            },
            // 提交的请求
            pushHttp (id) {
                this.$api.upkeep.planCodeSubmitHttp([id]).then(res => {
                    if (res.data.status === 200) {
                        this.isPush = false;
                        noticeTips(this, 'submitTips');
                        this.$store.commit('removeTag', 'addUpkeep');
                        this.$router.push({
                            path: 'editUpkeep',
                            query: {
                                editId: id,
                                activated: true
                            }
                        });
                    };
                });
            },
            // 选中机台的点击事件
            clickSelectMachineEvent (index) {
                this.spinShow = true;
                this.selectMachineModalState = true;
                this.AllMachineList = [];
                // 获取所有日期的机台
                this.tableData.forEach((datesItem) => {
                    datesItem.maintenancePlanMachineList.forEach((dateMachineItem) => {
                        this.AllMachineList.push(dateMachineItem);
                    });
                });
                this.dayMachineList = [];
                this.selectMachineIndex = index;
                // 获取当前日期的所有机台id
                this.dayMachineList = this.tableData[index].maintenancePlanMachineList;
                this.getMachineListHttp();
            },
            // 是否工作日的点击事件
            clickIsWorkDataEvent (index) {
                this.tableData[index].isWorking = !this.tableData[index].isWorking;
            },
            // 获取保养月份的事件
            getUpkeepDateEvent (e) {
                this.formValidate.monthValue = e;
                let dates = new Date(e);
                this.getMonthAllDay(dates.getFullYear(), dates.getMonth() + 1);
            },
            // 获取每月所有的天数及星期
            getMonthAllDay (fullYears, months) {
                let fullYear = fullYears;
                let month = months;
                let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
                this.tableData = [];
                let weekday = '';
                for (let i = 1; i <= lastDayOfMonth; i++) {
                    let dateStr = new Date(fullYear + '-' + month + '-' + i);
                    weekday = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')[dateStr.getDay()];
                    let isWorkDayStr = false;
                    weekday === '星期六' ? isWorkDayStr = false : isWorkDayStr = true;
                    this.tableData.push({
                        maintenancePlanDate: fullYear + '-' + month + '-' + i,
                        weekDay: weekday,
                        isWorking: isWorkDayStr,
                        maintenancePlanMachineList: []
                    });
                };
            },
            getWorkshop () {
                return this.$post('user/data/workshops').then(res => {
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
                            isDefaultWorkshop !== null ? this.formValidate.workshopValue = isDefaultWorkshop : this.formValidate.workshopValue = responseData[0].deptId;
                            // 赋值下拉框
                            this.workshopList = responseData;
                            this.globalLoadingShow = false ;
                        };
                    }
                });
            },
            // 获取保养类型的请求
            getUpkeepTypeHttp () {
                return this.$api.upkeep.upkeepTypeListHttp().then(res => {
                    if (res.data.status === 200) {
                        this.upkeepTypeList = res.data.res;
                    };
                });
            },
            //  获取机台列表的请求
            getMachineListHttp () {
                this.$call('machine.maintenance.repair.list', {
                    workshopId: this.formValidate.workshopValue,
                    processId: this.formValidate.processValue
                }).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((allMachineItem) => {
                            this.$set(allMachineItem, 'machineId', allMachineItem.id);
                            this.$set(allMachineItem, 'machineName', allMachineItem.name);
                            this.$set(allMachineItem, 'machineCode', allMachineItem.code);
                            this.$set(allMachineItem, 'overhaul', '');
                            this.$set(allMachineItem, 'remarks', '');
                            delete allMachineItem.id;
                            this.dayMachineList.forEach((dayMachineItem) => {
                                if (allMachineItem.machineId === dayMachineItem.machineId) {
                                    this.$set(allMachineItem, '_checked', true);
                                    this.$set(allMachineItem, 'isOtherSelect', true);
                                };
                            });
                            this.AllMachineList.forEach((bgItem) => {
                                if (allMachineItem.machineId === bgItem.machineId) {
                                    this.$set(allMachineItem, 'isOtherSelect', true);
                                };
                            });
                        });
                        this.spinShow = false;
                        this.selectMachineTableData = res.data.res;
                    };
                });
            },
            getProcessList () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.processList = res;
                });
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                (async () => {
                    await this.getProcessList();
                    await this.getUpkeepTypeHttp();
                    await this.getWorkshop();
                })()
            },
            calculationTableHeight () {
                this.tableContentScroll = document.documentElement.clientHeight - 380;
                window.onresize = () => {
                    this.tableContentScroll = document.documentElement.clientHeight - 380;
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
    .rowMinHeightStyle{
        min-height: 37px;
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
    .tableHeaderStyle{
        overflow-x: auto;
        border:1px solid #dcdee2;
        padding:4px 0;
        font-weight: bold;
    }
</style>

<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col>
                <Row type="flex" justify="start">
                    <Button type="primary" icon="md-checkmark" @click="saveEvent" class="queryBarMarginRight operatingSpaceMargin">保存</Button>
                    <Button type="primary" icon="ios-create" @click="pushEvent" class="queryBarMarginRight operatingSpaceMargin">提交</Button>
                </Row>
            </Col>
        </Row>
        <Form :label-width="120" :show-message="false" ref="saveParams" :model="saveParams" :rules="ruleCustom">
            <Row class="mainBar">
                <Col>
                    <Row>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="通知单号:" class="formItemMargin">
                                <div class="exhibitionInputBackground">自动生成订单编号</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 单据日期:" class="formItemMargin">
                                <DatePicker :clearable="false" :editable="false" type="date" v-model="billDateValue" class="widthPercentage" placeholder="请选择单据日期"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label=" 生产单号:" class="margin-bottom-0">
                                <Poptip trigger="hover" placement="bottom" class="exhibitionInputBackground widthPercentage">
                                    <a class="bom-box-ellipsis">{{ saveParams.prdOrderCodes }}</a>
                                    <div slot="content" style="color: #515a6e;">
                                        <p v-for="(item, index) in saveParams.prdOrderCodeArr" :key="index">{{item}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="生产车间:" prop="workshopValue" class="formItemMargin">
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
                            <FormItem label="产品:" prop="materielCodeValue" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ `${saveParams.productCode}(${saveParams.productName})` }}</div>
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
                                <div class="exhibitionInputBackground">{{ `${saveParams.unitName}(${saveParams.unitCode})` }}</div>
                            </FormItem>
                        </Col>
                        <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                            <FormItem label="生产数量:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.productionQty }}</div>
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
                            <FormItem label=" 溢短装(±%):" prop="unitValue" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{ saveParams.weightRate }}</div>
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
                                        <FormItem label="计划开工时间:" prop="planStartDate" class="formItemMargin">
                                            <DatePicker transfer type="date" v-model="saveParams.planStartDate" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label=" 计划完工时间:" prop="planFinishDate" class="formItemMargin">
                                            <DatePicker transfer type="date" v-model="saveParams.planFinishDate"  class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="5">
                                        <FormItem label=" 单台排产数量:" prop="perPlannedOutput" class="formItemMargin">
                                            <InputNumber :min="1" v-model="saveParams.perPlannedOutput" @on-blur="getPerPlannedOutputBlurEvent" class="widthPercentage"/>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                            <div class="margin-bottom-10">
                                <Button type="success" icon="md-add" @click="addMachineButtonEvent">添加生产机台</Button>
                            </div>
                            <Row>
                                <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="20">
                                    <div>
                                        <Table border size="small" :columns="tableHeader" :data="tableData"></Table>
                                    </div>
                                    <Row type="flex" justify="end" class="total-num-big-box">
                                        合计：<Col class="total-num-box total-num-box-width">{{ totalProductionQty }}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </Form>
        <Row>
            <Col>
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
            </Col>
        </Row>
    </card>
</template>
<script>
    let _this = this;
    import mathJs from 'mathjs';
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, compClientHeight, toDay, noticeTips, formatDate, accMul, addNum, accDivision, accSub, emptyTips } from '../../../libs/common';
    import selectMachineModal from './select-machine';
    export default{
        name: 'add-notice',
        components: {
            selectMachineModal
        },
        data () {
            const validatePlanStartDate = (rule, value, callback) => {value ? callback() : callback(new Error())};
            const validatePlanFinishDate = (rule, value, callback) => {value ? callback() : callback(new Error())};
            const validatePerPlannedOutput = (rule, value, callback) => {value ? callback() : callback(new Error())};
            return {
                globalLoadingShow: false,
                spinShow: false,
                selectMachineMachineAndDate: {},
                selectMachineModalTableData: [],
                saveParams: {
                    perPlannedOutput: 0
                },
                ruleCustom: {
                    planStartDate: [{required: true, validator: validatePlanStartDate, trigger: 'change'}],
                    planFinishDate: [{required: true, validator: validatePlanFinishDate, trigger: 'change'}],
                    perPlannedOutput: [{required: true, validator: validatePerPlannedOutput, trigger: 'change'}]
                },
                selectMachineModalState: false,
                selectMachineModalWorkCenterList: [],
                billDateValue: toDay(),
                saveSwitch: true,
                activeTabPane: '0',
                tableHeight: null,
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
                        key: 'operation',
                        width: 120,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'
                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            _this.reduceTableButtonEvent(params.index);
                                        }
                                    }
                                })
                            ]);
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
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '计划开台时间',
                        key: 'planDateFrom',
                        minWidth: 120,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('DatePicker', {
                                props: {
                                    value: params.row.planDateFrom,
                                    type: 'datetime',
                                    format:"yyyy-MM-dd HH:mm:ss",
                                    transfer: true,
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (e) => {
                                        params.row.planDateFrom = e;
                                        _this.$set(_this.tableData, params.index, params.row);
                                        // 判断开台时间是否在开工时间区间内（只做提示,不影响赋值）
                                        _this.judgePlanDateInStartWorkRange(params.row.planDateFrom, params.index);
                                        if (params.row.planDateFrom) {
                                            if (params.row.planDateTo) {
                                                // 判断开台时间是否大于了机时间
                                                if (new Date(params.row.planDateFrom).valueOf() > new Date(params.row.planDateTo).valueOf()) {
                                                    emptyTips(_this, '计划开台时间大于计划了机时间');
                                                    params.row.productionQty = null;
                                                } else {
                                                    _this.$set(params.row, 'productionQty', _this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                };
                                            };
                                        } else {
                                            params.row.productionQty = e;
                                        };
                                        _this.$set(_this.tableData, params.index, params.row);
                                        _this.calculationTotalProductionQty();
                                    },
                                    'on-open-change': () => {
                                        if (params.row.planDateFrom) {
                                            if (params.row.planDateTo) {
                                                // 判断开台时间是否大于了机时间
                                                if (new Date(params.row.planDateFrom).valueOf() > new Date(params.row.planDateTo).valueOf()) {
                                                    emptyTips(_this, '计划开台时间大于计划了机时间');
                                                    params.row.productionQty = null;
                                                    params.row.planDateFrom = '';
                                                    _this.$set(_this.tableData, params.index, params.row);
                                                } else {
                                                    _this.calculationTotalProductionQty();
                                                };
                                            };
                                        };
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '计划了机时间',
                        key: 'planDateTo',
                        minWidth: 120,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('DatePicker', {
                                props: {
                                    value: params.row.planDateTo,
                                    type: 'datetime',
                                    format:"yyyy-MM-dd HH:mm:ss",
                                    transfer: true,
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (e) => {
                                        params.row.planDateTo = e;
                                        _this.$set(_this.tableData, params.index, params.row);
                                        // 判断开台时间是否在开工时间区间内（只做提示,不影响赋值）
                                        this.judgePlanDateInStartWorkRange(params.row.planDateTo, params.index);
                                        if (params.row.planDateTo) {
                                            if (params.row.planDateFrom) {
                                                if (new Date(params.row.planDateTo).valueOf() > new Date(params.row.planDateFrom).valueOf()) {
                                                    _this.$set(params.row, 'productionQty', _this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                } else {
                                                    emptyTips(_this, '计划了机时间不能小于计划开台时间!')
                                                    params.row.productionQty = 0;
                                                }
                                            };
                                        } else {
                                            params.row.productionQty = e;
                                        };
                                        _this.$set(_this.tableData, params.index, params.row);
                                        _this.calculationTotalProductionQty();
                                    },
                                    'on-open-change': () => {
                                        if (params.row.planDateTo) {
                                            if (params.row.planDateFrom) {
                                                if (new Date(params.row.planDateTo).valueOf() > new Date(params.row.planDateFrom).valueOf()) {
                                                    _this.$set(params.row, 'productionQty', _this.productionQtyCalculation(params.row.planDateFrom, params.row.planDateTo).productionQty);
                                                    _this.tableData[params.index] = params.row;
                                                    _this.calculationTotalProductionQty();
                                                } else {
                                                    emptyTips(_this, '计划了机时间不能小于计划开台时间!');
                                                    params.row.planDateTo = '';
                                                    params.row.productionQty = 0;
                                                    _this.tableData[params.index] = params.row;
                                                }
                                            };
                                        };
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '排产数量',
                        key: 'productionQty',
                        width: 160,
                        sortable: true,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
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
                                        if (e && params.row.planDateFrom) {
                                            params.row.planDateTo = _this.calculatePlanDateTo(params.row.planDateFrom, e, params.index);
                                        };
                                        _this.tableData[params.index] = params.row;
                                        _this.calculationTotalProductionQty();
                                    },
                                    'on-blur': () => {
                                        if (params.row.productionQty > _this.saveParams.perPlannedOutput) emptyTips(_this, '排产数量不能大于单台排产数量!');
                                        _this.judgePlanDateInStartWorkRange(params.row.planDateTo, params.index);
                                    }
                                }
                            })
                        }
                    }
                ],
                tableData: [],
                totalProductionQty: 0,
                minNum: 0,
                maxNum: 0,
                toCreated: false
            };
        },
        methods: {
            // 单台排产数量的失焦事件
            getPerPlannedOutputBlurEvent () {
                if (this.saveParams.perPlannedOutput && this.tableData && this.tableData.length !== 0) {
                    // 理论需要的机台 = 生产数量 / 单机台排产数量
                    let machineNum = Math.ceil(parseFloat(mathJsDiv(this.saveParams.productionQty, this.saveParams.perPlannedOutput)));
                    let overFlowNum = this.saveParams.productionQty;
                    let machineList = JSON.parse(JSON.stringify(this.tableData));
                    // 实际机台大于理论机台
                    if (machineList.length >= machineNum) {
                        machineList.forEach((item, index) => {
                            if (overFlowNum >= parseFloat(this.saveParams.perPlannedOutput)) { // 余数大与等于单台排产数量时,机台的排产数量等于单台排产数量
                                this.$set(item, 'productionQty', parseFloat(this.saveParams.perPlannedOutput));
                                item.planDateTo = this.calculatePlanDateTo(item.planDateFrom, item.productionQty, index); // 根据排产数量计算计划了机时间
                                overFlowNum = mathJsSub(overFlowNum, this.saveParams.perPlannedOutput);
                            } else {
                                this.$set(item, 'productionQty', overFlowNum);
                            };
                        });
                    } else {
                        let totalNum = 0;
                        this.totalProductionQty = totalNum;
                        machineList.forEach((item, index) => {
                            this.$set(item, 'productionQty', parseFloat(this.saveParams.perPlannedOutput));
                            item.planDateTo = this.calculatePlanDateTo(item.planDateFrom, item.productionQty, index); // 根据排产数量计算计划了机时间
                            totalNum = mathJsAdd(item.productionQty, totalNum);
                        });
                        let lastNum1 = Math.ceil(mathJsSub(this.saveParams.productionQty, totalNum));
                        let lastNum2 = Math.ceil(mathJsAdd(lastNum1, machineList[machineList.length - 1].productionQty));
                        machineList[machineList.length - 1].productionQty = lastNum2;
                        machineList[machineList.length - 1].planDateTo = this.calculatePlanDateTo(machineList[machineList.length - 1].planDateFrom, machineList[machineList.length - 1].productionQty, machineList.length - 1);
                    };
                    this.tableData = machineList;
                    this.calculationTotalProductionQty();
                };
            },
            // 判断开台时间是否在开工时间区间内（只做提示,不影响赋值）
            judgePlanDateInStartWorkRange (planDate, index) {
                let planStartTimesTamp = new Date(_this.saveParams.planStartDate).valueOf();
                let planFinishTimesTamp = new Date(_this.saveParams.planFinishDate).valueOf();
                let planDateTimesTamp = new Date(planDate).valueOf();
                if (planDateTimesTamp >= planStartTimesTamp && planDateTimesTamp <= planFinishTimesTamp) {
                    this.$set(this.tableData[index], 'cellClassName', {
                        machineCode: ''
                    });
                    return false;
                } else {
                    this.$set(this.tableData[index], 'cellClassName', {
                        machineCode: 'demo-table-info-cell-age'
                    });
                    // return emptyTips(_this, '开台时间不在开工时间区间!');
                };
            },
            // 合计排产数量
            calculationTotalProductionQty () {
                let totalNum = 0;
                this.tableData.forEach((item)=>{
                    if (item.productionQty) {
                        totalNum = mathJsAdd(item.productionQty, totalNum);
                    };
                });
                this.totalProductionQty = totalNum;
            },
            productionQtyCalculation (beginDate, endDate) {
                let readyTime = this.saveParams.preparationHours; //上机准备时间
                let dateFromTime = null;
                let dateToTime = null;
                let diffHoure = null;
                let dateFrom = null;
                let dateTo = null;
                dateFrom = formatDate(new Date(beginDate).getTime() + (readyTime * 60 * 60 * 1000)); // 格式****-**-** **:**
                dateTo = formatDate(new Date(endDate).getTime() + (readyTime * 60 * 60 * 1000));
                dateFromTime = new Date(beginDate).getTime();  // 开始时间戳
                dateToTime = new Date(endDate).getTime();  // 结束时间戳
                diffHoure = this.dateDiff(dateToTime, dateFromTime);  // 时间差(时)
                // 排产数量 = （计划了机时间- 计划开台时间)*运转效率*台时单产
                // 运转效率/100
                let num1 = mathJsDiv(this.saveParams.efficiencyPercent, 100);
                // *运转效率
                let num2 = mathJsMul(diffHoure, num1);
                // *台时单产
                let num3 = Math.floor(mathJsMul(num2, this.saveParams.hourYield));
                return {
                    productionQty: num3,  // 排产数量
                    dateFrom: dateFrom,
                    dateTo: dateTo
                };
            },
            selectMachineModalConfirmEvent (checkArray) {
                if (this.tableData.length !== 0) {
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
            addMachineToTable (checkArray) {
                checkArray.forEach(item => {
                    if (!item._disabled) {
                        this.$delete(item, 'id');
                        // 最后排产产品计划了机时间+上机准备时间
                        if (item.lastPlanDateTo) {
                            this.$set(item, 'planDateFrom', formatDate(new Date(item.lastPlanDateTo).valueOf() + parseFloat(this.saveParams.preparationHours) * 60 * 60 * 1000));
                        } else {
                            // 获取计划开工时间，并累加8小时
                            if (typeof this.saveParams.planStartDate  === 'object') {
                                this.$set(item, 'planDateFrom', formatDate(new Date(this.saveParams.planStartDate).valueOf() + 8 * 60 * 60 * 1000));
                            } else {
                                // 转换成yyyy/MM/dd格式，再累加8小时
                                let d = new Date(this.saveParams.planStartDate.replace(/-/g, '/')).valueOf();
                                let times = d + 8 * 60 * 60 * 1000;
                                this.$set(item, 'planDateFrom', formatDate(times));
                            };
                        };
                        this.$set(item, 'planDateTo', '');
                        this.tableData.push(item);
                    };
                });
                this.setDefaultValue();
            },
            // 设置每个机台的排产数量和计划了机时间
            setDefaultValue () {
                let totalNum = 0;
                this.saveParams.perPlannedOutput = Math.floor(mathJsDiv(this.saveParams.productionQty, this.tableData.length));
                this.tableData.forEach((item, index) => {
                    item.productionQty = this.saveParams.perPlannedOutput; // 计算单台排产数量并赋值每个机台（生产数量/机台数）
                    item.planDateTo = this.calculatePlanDateTo(item.planDateFrom, item.productionQty, index); // 根据排产数量计算计划了机时间
                    totalNum = mathJsAdd(item.productionQty, totalNum); // 计算合计
                });
                this.totalProductionQty = totalNum;
                // 最后一个机台的排产数量 = 自身平均值 + （生产数量 - 合计）
                let overFlowNum = mathJsSub(this.saveParams.productionQty, totalNum); // 计算余数
                let lastProQty = mathJsAdd(this.tableData[this.tableData.length - 1].productionQty, overFlowNum);
                this.tableData[this.tableData.length - 1].productionQty = lastProQty;
                this.calculationTotalProductionQty();
            },
            // 根据排产数量计算计划了机时间
            calculatePlanDateTo (planDateFrom, productionQty, index) {
                let num1 = 0;
                let num2 = 0;
                let timeConsume = 0;
                let timeStamp = 0;
                // 运转效率/100
                num1 = mathJsDiv(this.saveParams.efficiencyPercent, 100);
                // 排产数量/运转效率
                num2 = mathJsDiv(productionQty, num1);
                // /台时单产
                timeConsume = Math.ceil(mathJsDiv(num2, this.saveParams.hourYield));
                // 累加耗时
                timeStamp = (new Date(planDateFrom).valueOf() + (timeConsume * 60 * 60 * 1000));
                _this.judgePlanDateInStartWorkRange(formatDate(timeStamp), index);
                return formatDate(timeStamp);
            },
            // 选择机台modal的搜索按钮事件
            selectMachineModalSearchBtnEvent (event) {
                this.getWorkCenterMachineListHttp(event.machineCodeOrName,event.workCenterId);
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
                        this.spinShow = false;
                        res.data.res.machineList.forEach((allMachineItem) => {
                            allMachineItem.machineMonthList.forEach(machineDayItem => {
                                let month = new Date(machineDayItem.day).getMonth()+1;
                                let day = new Date(machineDayItem.day).getDate();
                                allMachineItem[`${month}-${day}`] = machineDayItem.productList;
                            });
                            this.tableData.forEach((selectMachineItem)=>{
                                if (allMachineItem.machineId === selectMachineItem.machineId) {
                                    allMachineItem._disabled = true;
                                    allMachineItem._checked = true;
                                };
                            });
                        });
                        this.selectMachineMachineAndDate = res.data.res;
                        this.selectMachineModalTableData = res.data.res.machineList;
                    };
                })
            },
            // 计算时间差(小时)
            dateDiff (sDate1, sDate2){
                let oDate1, oDate2;
                oDate1 = new Date(sDate1).getTime();
                oDate2 = new Date(sDate2).getTime();
                let totalMilliseconds = oDate1 - oDate2;//相差的毫秒数
                if (isNaN(totalMilliseconds) || totalMilliseconds < 0) {
                    return null;
                }
                return parseInt(totalMilliseconds / 1000 / 60 / 60);
            },
            selectMachineModalStateChangeEvent (e) {
                this.selectMachineModalState = e;
            },
            addMachineButtonEvent () {
                this.spinShow = true;
                this.selectMachineModalState = true;
                this.getWorkCenterMachineListHttp();
            },
            reduceTableButtonEvent (rowIndex) {
                this.tableData.splice(rowIndex, 1);
                if (this.tableData && this.tableData.length !== 0) {
                    this.calculationTotalProductionQty();
                    this.setDefaultValue();
                } else {
                    this.totalProductionQty = 0;
                };
            },
            pushEvent () {
                this.$refs['saveParams'].validate((valid) => {
                    if (valid) {
                        let isEmpty = false;
                        if (this.tableData && this.tableData.length !== 0) {
                            this.tableData.forEach((item) => {
                                if (!item.planDateFrom) {
                                    isEmpty = true;
                                } else if (!item.planDateTo) {
                                    isEmpty = true;
                                } else if (!item.productionQty) {
                                    isEmpty = true;
                                } else {
                                    this.$set(item, 'planDateFrom' , item.planDateFrom + ':00');
                                    this.$set(item, 'planDateTo' , item.planDateTo + ':00');
                                };
                            });
                            if (isEmpty === false) {
                                // 最大值、最小值
                                this.minNum = 0;
                                this.maxNum = 0;
                                this.minNum = accMul(this.saveParams.productionQty, accSub(1, this.saveParams.weightRate / 100));
                                this.maxNum = accMul(this.saveParams.productionQty, addNum(1, this.saveParams.weightRate / 100));
                                // 判断排产总数是否在合理区间：（生产数量*（1-溢短装%）< 排产总数量 < （生产数量*（1+溢短装%））
                                if (this.minNum <= this.totalProductionQty && this.totalProductionQty <= this.maxNum) {
                                    this.$set(this.saveParams, 'noticeMachineList', this.tableData);
                                    this.$set(this.saveParams, 'date', formatDate(this.billDateValue));
                                    // 先保存再提交
                                    this.saveHttp(this.saveParams).then(res => {
                                        if (res.data.status === 200) {
                                            this.submitHttp(res.data.res);
                                        };
                                    });
                                } else {
                                    emptyTips(this, `排产总数量应在${this.minNum}~${this.maxNum}区间内!`);
                                };
                            } else {
                                emptyTips(this, '机台信息不能为空!');
                            };
                        } else {
                            emptyTips(this, '机台不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                })
            },
            // 提交的请求
            submitHttp (id) {
                this.$call('prd.notice.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        this.$router.push({
                            path: 'editNotice',
                            query: {
                                id: id,
                                activated: true
                            }
                        });
                        this.$store.commit('removeTag', 'addNotice');
                    };
                });
            },
            // 保存的事件
            saveEvent () {
                this.$set(this.saveParams, 'noticeMachineList', this.tableData);
                this.$set(this.saveParams, 'date', formatDate(this.billDateValue));
                this.saveHttp(this.saveParams).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.$router.push({
                            path: 'editNotice',
                            query: {
                                id: res.data.res,
                                activated: true
                            }
                        });
                        this.$store.commit('removeTag', 'addNotice');
                    };
                });
            },
            // 保存的请求
            saveHttp (params) {
                params.planStartDate = formatDate(params.planStartDate);
                params.planFinishDate = formatDate(params.planFinishDate);
                return this.$call('prd.notice.save', params);
            },
            // 获取生产排产的详情
            getArrangeDetailHttp () {
                return this.$call('prd/bom/product/detail2', JSON.parse(this.$route.query.arrangeId)).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.$delete(responseData, 'id');
                        responseData.prdOrderCodeArr = responseData.prdOrderCodes.split(',');
                        this.saveParams = responseData;
                        this.saveParams.perPlannedOutput = 0;
                        return responseData;
                    };
                });
            },
            calculationTableHeight () {
                let mainBarOffsetHeight = document.getElementsByClassName('mainBar')[0].offsetHeight;
                let tabPaneBarOffsetHeight = document.getElementsByClassName('tabPaneBar')[0].offsetHeight;
                this.tableHeight = compClientHeight(mainBarOffsetHeight + tabPaneBarOffsetHeight + 300);
                window.onresize = () => {
                    let mainBarOffsetHeight = document.getElementsByClassName('mainBar')[0].offsetHeight;
                    this.tableHeight = compClientHeight(mainBarOffsetHeight + tabPaneBarOffsetHeight + 300);
                };
            },
            // 获取工作中心列表数据
            getWorkCenterListHttp (processId) {
                return this.$call('work.center.list', {
                    processId: processId,
                    auditState: 3,
                    enableState: 1
                }).then(res => {
                    if (res.data.status === 200) {
                        this.selectMachineModalWorkCenterList = res.data.res
                        this.globalLoadingShow = false;
                    };
                });
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                (async () => {
                    let arrangeDetailData = await this.getArrangeDetailHttp();
                    this.tableData = [];
                    await this.getWorkCenterListHttp(arrangeDetailData.processId);
                })();
            }
        },
        created () {
            _this = this;
            this.toCreated = true;
            this.globalLoadingShow = true;
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
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style>
    .ivu-table .demo-table-info-cell-age {
        background-color: #ff6600;
        color: #fff;
    }
    .bom-box-ellipsis{
        width:100px;
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ff9900
    }
</style>

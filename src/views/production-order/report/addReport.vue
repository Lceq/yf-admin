<template>
    <div>
        <Card :style="'height:' + cardHeight + 'px'">
            <Row class="margin-bottom-10">
                <Col>
                    <Button type="primary" @click="resetReportModalData">重置</Button>
                    <Button icon="md-checkmark" @click="saveReportSheet('save')" :disabled="saveDisabled" type="primary">保存</Button>
                    <Button icon="md-checkmark" @click="saveReportSheet('submit')" :disabled="saveDisabled" type="primary">提交</Button>
                </Col>
            </Row>
            <Row id="selectedHeight">
                <Col>
                    <Form ref="formAddValidate" :model="formAddValidate" :rules="ruleAddValidate" :label-width="100" :show-message="false">
                        <FormItem label="报工单号：" class="displayInlineBlock">
                            <Input class="formWidth" readonly placeholder="自动生成报工单号"></Input>
                        </FormItem>
                        <FormItem label="报工日期：" class="displayInlineBlock" prop="reportDate">
                            <DatePicker class="formWidth" @on-change="changeReportDate" type="date" :clearable="false" :value="formAddValidate.reportDate" placeholder="请输入报工日期"></DatePicker>
                        </FormItem>
                        <FormItem label="生产车间：" class="displayInlineBlock" prop="workshopId">
                            <Select class="formWidth" @on-change="changeWorkShop" v-model="formAddValidate.workshopId">
                                <Option v-for="(item, index) in WorkShopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="报工班次：" class="displayInlineBlock" prop="shiftId">
                            <Select class="formWidth" @on-change="changeShiftId" v-model="formAddValidate.shiftId">
                                <Option v-for="(item, index) in ShiftList" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
                            </Select>
                        </FormItem>
                        <br>
                        <FormItem label="工序：" class="displayInlineBlock" prop="processId">
                            <Select class="formWidth" @on-change="changeProcessId" v-model="formAddValidate.processId">
                                <Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <!--<FormItem label="损耗率%：" class="displayInlineBlock"  prop="wasteRate">-->
                            <!--&lt;!&ndash;<Input class="formWidth" v-model="formAddValidate.wasteRate" placeholder="请输入损耗率"></Input>&ndash;&gt;-->
                            <!--<InputNumber readonly class="formWidth" :max="100" :min="0" @on-change="changeWaste" v-model="formAddValidate.wasteRate" placeholder="请输入损耗率"></InputNumber>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="班次总产量：" class="displayInlineBlock" prop="output">-->
                            <!--<Input class="formWidth" readonly v-model="formAddValidate.output" placeholder="班次总产量"></Input>-->
                        <!--</FormItem>-->
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table border ref="selection" :height="reportModalHeight" :loading="reportModalLoading" border size="small" class="marginBottom" :columns="reportModalColumns" :data="reportModalData"></Table>
                    <p class="totalPclass"><span class="totalClass">合计</span><span class="totalClass">{{differenceValue}}</span><span  class="totalClass">{{output}}</span><span  class="totalClass">{{outputKg}}</span></p>
                </Col>
            </Row>
            <delete-warning
                :v-model="reportModalShow"
                :tipMsg="reportModalMessage"
                @confirm="reportModalConfirm"
                @cancel="reportModalCancel"
                :cancelShow="isShowCancel"
            ></delete-warning>
        </Card>
    </div>
</template>

<script>

import iView from 'iview';
import excel from '../../../libs/excel.js';
import AboutTime from '../../public/AboutTime';
import {isNull} from "../../../libs/tools";
// import publicJs from '../../public/common/common';
import xwValidate from '@/libs/xwValidate';
import deleteWarning from '../../public/deleteWarning';
export default {
    components: {
        AboutTime,
        deleteWarning
    },
    data () {
        return {
            differenceValue: '',
            output: '',
            outputKg: '',
            cardHeight: '',
            // 获取一个报工列表的数据
            reportSheetDataList: [],
            shiftList: [],
            processList: [],
            WorkShopList: [],
            ShiftList: [],
            formAddValidate:
                {
                    shiftElectricEnergy: 0,
                    code: '1',
                    reportDate: '2018-8-16',
                    workshopId: '',
                    shiftId: '',
                    processId: '',
                    wasteRate: 0,
                    output: ''
                },
            ruleAddValidate: {
                reportDate: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                workshopId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                shiftId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                processId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            reportModalLoading: false,
            reportModalHeight: '',
            reportModalColumns: [
                {
                    title: '机台号',
                    align: 'center',
                    sortable: true,
                    minWidth: 80,
                    fixed: 'left',
                    key: 'machineCode'
                },
                // {
                //     title: '机台锭数',
                //     align: 'center',
                //     sortable: true,
                //     fixed: 'left',
                //     minWidth: 120,
                //     key: 'spinCount'
                // },
                // {
                //     title: '开台锭数',
                //     align: 'center',
                //     minWidth: 120,
                //     fixed: 'left',
                //     sortable: true,
                //     key: 'spinUsed'
                // },
                {
                    title: '当班开台',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'currentMachineOpen'
                },
                {
                    title: '当班了机',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'currentMachineEnd'
                },
                {
                    title: '生产通知单号',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'prdNoticeCode'
                },
                {
                    title: '产品',
                    align: 'center',
                    sortable: true,
                    minWidth: 100,
                    key: 'productName'
                },
                {
                    title: '批号',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'batchCode'
                },
                {
                    title: '班组',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'groupName'
                },
                {
                    title: '运转效率%',
                    align: 'center',
                    sortable: true,
                    minWidth: 100,
                    key: 'efficiencyPercent'
                },
                {
                    title: '锭数',
                    align: 'right',
                    sortable: true,
                    minWidth: 65,
                    key: 'openSpinCount'
                },
                {
                    title: '开始能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'startElectricEnergy',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.startElectricEnergy,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.startElectricEnergy = event;
                                    params.row.shiftElectricEnergy = ((params.row.endElectricEnergy - params.row.startElectricEnergy) * params.row.openSpinCount / params.row.spinCount);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '结束能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'endElectricEnergy',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.endElectricEnergy,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.endElectricEnergy = event;
                                    params.row.shiftElectricEnergy = ((params.row.endElectricEnergy - params.row.startElectricEnergy) * params.row.openSpinCount / params.row.spinCount);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '当班能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'shiftElectricEnergy',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.shiftElectricEnergy,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.shiftElectricEnergy = event < 0 ? 0 : event;
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '开始产量表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'startOutput',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.startOutput,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.startOutput = event;
                                    // params.row.differenceValue = params.row.endOutput - params.row.startOutput;
                                    params.row.differenceValue = this.getDifferenceValue(params.row.startOutput, params.row.endOutput, params.row.maxOutputQty);
                                    params.row.output = params.row.isSpinOutput ? Math.round((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio) : Math.round(params.row.differenceValue * params.row.outputRatio);
                                    params.row.differenceValue = params.row.differenceValue > 1000000 ? 0 : params.row.differenceValue;
                                    params.row.outputKg = this.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
                                    // item.outputKg = (item.differenceValue * (item.gramWeight / item.metres)).toFixed(2);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '结束产量表数',
                    align: 'center',
                    sortable: true,
                    width: 120,
                    key: 'endOutput',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.endOutput,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.endOutput = event;
                                    // params.row.differenceValue = params.row.endOutput - params.row.startOutput;
                                    params.row.differenceValue = this.getDifferenceValue(params.row.startOutput, params.row.endOutput, params.row.maxOutputQty);
                                    params.row.output = params.row.isSpinOutput ? Math.round((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio) : Math.round(params.row.differenceValue * params.row.outputRatio);
                                    params.row.differenceValue = params.row.differenceValue > 1000000 ? 0 : params.row.differenceValue;
                                    params.row.outputKg = this.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '当班产量表量',
                    width: 120,
                    align: 'center',
                    fixed: 'right',
                    sortable: true,
                    key: 'differenceValue',
                    render: (h, params) => {
                        const vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.differenceValue,
                                min: 0,
                                max: 999999999,
                                precision: 0
                            },
                            style: {
                                width: '100px'
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.differenceValue = event;
                                    params.row.output = params.row.isSpinOutput ? ((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio).toFixed(0) : (params.row.differenceValue * params.row.outputRatio).toFixed(0);
                                    // params.row.output = params.row.output > 1000000 ? 0 : params.row.output;
                                    params.row.outputKg = this.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '当班产量',
                    width: 120,
                    align: 'right',
                    fixed: 'right',
                    sortable: true,
                    key: 'output',
                    render: (h, params) => {
                        return h('span', {}, params.row.output);
                    }
                },
                {
                    title: '当班产量(KG)',
                    width: 120,
                    align: 'right',
                    fixed: 'right',
                    sortable: true,
                    key: 'outputKg',
                    render: (h, params) => {
                        return h('span', {}, params.row.outputKg);
                    }
                }
            ],
            reportModalData: [],
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            forbidTime: '',
            forbidName: '',
            midShiftId: '',
            shiftTypeId: '',
            defaultWorkShopId: '',
            isSureReset: false,
            reportModalShow: false,
            reportModalMessage: '',
            saveDisabled: true,
            isShowCancel: false,
            inSertDisabled: true,
            tableData: [],
            reportSheetOutputKg: 0,
            shiftElectricEnergy: 0
        };
    },
    methods: {
        // 重置数据
        resetReportModalData () {
            this.isSureReset = true;
            this.reportModalShow = true;
            this.isShowCancel = true;
            this.reportModalMessage = '数据尚未保存，确认清空？';
        },
        // 获取所有工序
        getProcess () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res.filter(x => x.isReport === true);
            });
        },
        changeWaste () {
            this.reportModalData.map(item => {
                item.outputKg = this.getMetreTurnKg(item.differenceValue, item.gramWeight, item.metres, item.efficiencyPercent, item.openSpinCount, item.outputRatio, item.isSpinOutput);
                return item;
            });
            this.getAllOutput();
        },
        getDifferenceValue (start, end, max) {
            let resault = 0;
            if (end >= start) {
                resault = end - start;
            } else {
                if (!max) {
                    resault = end;
                } else {
                    resault = max - start + end;
                }
            }
            return Math.round(resault);
        },
        // 计算公斤数据
        getMetreTurnKg (differenceValue, gramWeight, metres, efficiencyPercent, openSpinCount, outputRatio, isSpinOutput) {
            var kgMetreState = true;
            if (gramWeight === null || gramWeight === undefined || gramWeight === '' || metres === null || metres === undefined || metres === '' || efficiencyPercent === null || efficiencyPercent === undefined || efficiencyPercent === '') {
                kgMetreState = false;
                this.$Modal.warning({
                    content: '<p>注意: 存在产品对应工序没有进行分配定量或者运转效率为空的问题</p>',
                    title: '注意'
                });
            }
            if (!openSpinCount || !outputRatio) {
                this.$Modal.warning({
                    content: '<p>存在机台没有具体的锭数或者系数</p>',
                    title: '注意'
                });
                return false;
            }
            let outputKg = 0;
            // if (this.formAddValidate.processName === '络筒') {
            if (kgMetreState) {
                if (isSpinOutput) {
                    outputKg = (((differenceValue * (gramWeight / metres) / 1000) * (100 / 100) * openSpinCount * outputRatio)).toFixed(2);
                } else {
                    outputKg = (differenceValue * outputRatio).toFixed(2);
                }
            } else {
                outputKg = 0.00;
            }
            // } else {
            //     if (kgMetreState) outputKg = (differenceValue * (gramWeight / metres)).toFixed(2);
            //     else outputKg = 0;
            // }
            return outputKg;
        },
        // 判断是否有默认车间
        getUserWorkshop (isActivated) {
            this.$api.dept.getUserWorkshop().then(res => {
                this.defaultWorkShopId = res.curWorkshopId;
                this.formAddValidate.workshopId = res.curWorkshopId;
                this.WorkShopList = res.workshopList;
                this.getDefaultShift(isActivated);
            });
        },
        // 获取默认的班制
        getDefaultShift (isActivated) {
            let time = this.formAddValidate.reportDate;
            this.$call('schedule.list3', {
                belongDate: time,
                workshopId: this.formAddValidate.workshopId
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res.length === 0) {
                        this.$Modal.warning({
                            title: '警告',
                            content: '<p>该时间该车间下没有进行排班</p>'
                        });
                        this.ShiftList = [];
                        this.formAddValidate.shiftId = '';
                        this.reportModalData = [];
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                        return false;
                    }
                    // debugger
                    this.ShiftList = content.res;
                    this.formAddValidate.shiftId = content.res[0].shiftId;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    if (isActivated) {
                        return false;
                    }
                    this.getVerification();
                }
            });
        },
        // 改变车间
        changeWorkShop (val) {
            this.formAddValidate.workshopId = val;
            this.getDefaultShift();
        },
        // 改变报工日期
        changeReportDate (val) {
            this.formAddValidate.reportDate = val;
            this.getDefaultShift();
        },
        // 改变班次
        changeShiftId (val) {
            this.formAddValidate.shiftId = val;
            this.getVerification();
        },
        // 改变工序
        changeProcessId (val) {
            this.formAddValidate.processId = val === undefined ? '' : val;
            if (this.formAddValidate.processId === '') {
                this.saveDisabled = true;
            }
            this.getVerification();
        },
        // 验证是否车间，报工日期，班次，工序是否都选择
        getVerification () {
            if (this.formAddValidate.reportDate !== '' && this.formAddValidate.workshopId !== '' && this.formAddValidate.shiftId !== '' && this.formAddValidate.shiftId !== undefined && this.formAddValidate.processId !== '') {
                this.reportToReportList();
            }
        },
        // 获取reportToReportList数据，也就是table数据， 条件均为必传
        reportToReportList () {
            const _this = this;
            this.reportModalLoading = true;
            this.$call('prd.report.new.report', {
                belongDate: this.formAddValidate.reportDate,
                shiftId: this.formAddValidate.shiftId,
                workshopId: this.formAddValidate.workshopId,
                processId: this.formAddValidate.processId
            }).then((res) => {
                let content = res.data;
                _this.reportModalLoading = false;
                if (content.status === 200) {
                    if (content.res.length === 0) {
                        _this.saveDisabled = true;
                    } else {
                        _this.saveDisabled = false;
                    }
                    _this.reportModalData = content.res.map(item => {
                        item.currentMachineOpen = item.isDutyOpen === true ? '是' : '否';
                        item.currentMachineEnd = item.isDutyEnd === true ? '是' : '否';
                        item.endOutput = item.endOutput === 0 ? item.startOutput : item.endOutput;
                        item.shiftElectricEnergy = item.endElectricEnergy - item.startElectricEnergy;
                        item.differenceValue = this.getDifferenceValue(isNull(item.startOutput), isNull(item.endOutput), isNull(item.maxOutputQty));
                        item.output = item.isSpinOutput ? Math.round((isNull(item.differenceValue) * isNull(item.openSpinCount)) * item.outputRatio) : Math.round(item.differenceValue * item.outputRatio);
                        item.outputKg = this.getMetreTurnKg(item.differenceValue, item.gramWeight, item.metres, item.efficiencyPercent, item.openSpinCount, item.outputRatio, item.isSpinOutput);
                        return item;
                    });
                    _this.inSertDisabled = false;
                    _this.getAllOutput();
                }
                if (content.status === 415) {
                    this.reportModalData = [];
                }
            });
        },
        // 计算班次总产量
        getAllOutput () {
            let num = 0;
            let differenceValue = 0;
            let output = 0;
            let outputKg = 0;
            let shiftElectricEnergy = 0;
            this.formAddValidate.reportSheetOutputKg = 0;
            for (let k of this.reportModalData) {
                num += parseInt(k.output);
                output += parseInt(k.output);
                shiftElectricEnergy += parseInt(k.shiftElectricEnergy);
                differenceValue += parseInt(k.differenceValue);
                outputKg += Number(k.outputKg);
                // this.formAddValidate.reportSheetOutputKg += Math.round(k.outputKg);
            }
            // debugger
            this.formAddValidate.output = num;
            this.outputKg = outputKg.toFixed(2);
            this.differenceValue = differenceValue;
            this.output = output;
            this.formAddValidate.reportSheetOutputKg = outputKg.toFixed(2);
            this.formAddValidate.shiftElectricEnergy = shiftElectricEnergy.toFixed(2);
        },
        // 导入数据
        insertExcel () {
            this.initUpload();
        },
        initUpload () {
            this.file = null;
            this.tableData = [];
        },
        handleBeforeUpload (file) {
            const fileExt = file.name.split('.').pop().toLocaleLowerCase();
            if (fileExt === 'xlsx' || fileExt === 'xls') {
                this.readFile(file);
                this.file = file;
            } else {
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
                });
            }
            return false;
        },
        // 读取文件
        // readFile (file) {
        //     const reader = new FileReader();
        //     reader.readAsArrayBuffer(file);
        //     reader.onloadstart = e => {
        //         iView.LoadingBar.start();
        //     };
        //     reader.onprogress = e => {
        //         this.progressPercent = Math.round(e.loaded / e.total * 100);
        //     };
        //     reader.onerror = e => {
        //         this.$Message.error('文件读取出错');
        //     };
        //     reader.onload = e => {
        //         this.$Message.info('文件读取成功');
        //         const data = e.target.result;
        //         const { header, results } = excel.read(data, 'array');
        //         const tableTitle = header.map(item => { return { title: item, key: item }; });
        //         this.tableData = results;
        //         // console.log(this.reportModalData);
        //         for (let data of this.reportModalData) {
        //             let AllData = this.tableData.filter(x => x.machineCode.trim() === data.machineCode);
        //             for (let i of AllData) {
        //                 if (data.noticeSheetCode === i.noticeSheetCode) {
        //                     data.beginOutput = i.beginOutput === undefined ? 0 : parseFloat(i.beginOutput);
        //                     data.endOutput = i.endOutput === undefined ? 0 : parseFloat(i.endOutput);
        //                     // debugger;
        //                     if (i.differenceValue === undefined) {
        //                         data.differenceValue = data.endOutput - data.beginOutput;
        //                         data.outputKg = this.getMetreTurnKg(data.differenceValue, data.gramWeight, data.metres, data.spinUsed);
        //                         // data.outputKg = this.formAddValidate.processName === '并条' ? (data.differenceValue * (data.gramWeight / data.metres) * data.spinUsed * 100).toFixed(2) : (data.differenceValue * (data.gramWeight / data.metres) * data.spinUsed).toFixed(2);
        //                     } else {
        //                         data.differenceValue = parseFloat(i.differenceValue);
        //                         data.outputKg = this.getMetreTurnKg(parseFloat(i.differenceValue), data.gramWeight, data.metres, data.spinUsed);
        //                         // data.outputKg = this.formAddValidate.processName === '并条' ? (parseFloat(i.differenceValue) * (data.gramWeight / data.metres) * data.spinUsed * 100).toFixed(2) : (parseFloat(i.differenceValue) * (data.gramWeight / data.metres) * data.spinUsed).toFixed(2);
        //                     }
        //                 }
        //             }
        //         }
        //         this.getAllOutput();
        //         iView.LoadingBar.finish();
        //     };
        // },
        // 保存报工单
        saveReportSheet (type) {
            this.$refs['formAddValidate'].validate((valid) => {
                if (valid) {
                    const _this = this;
                    let params = {
                        shiftId: this.formAddValidate.shiftId,
                        shiftName: this.ShiftList.find(x => x.shiftId === this.formAddValidate.shiftId).shiftName,
                        workshopId: this.formAddValidate.workshopId,
                        workshopName: this.WorkShopList.find(x => x.deptId === this.formAddValidate.workshopId).deptName,
                        processId: this.formAddValidate.processId,
                        processName: this.processList.find(x => x.id === this.formAddValidate.processId).name,
                        // differenceValue: this.formAddValidate.differenceValue,
                        shiftOutput: this.formAddValidate.output,
                        shiftQty: this.formAddValidate.reportSheetOutputKg,
                        shiftElectricEnergy: this.formAddValidate.shiftElectricEnergy,
                        auditState: type === 'save' ? 1 : 2,
                        belongDate: this.formAddValidate.reportDate,
                        // reportDate: this.Today,
                        wasteRate: this.formAddValidate.wasteRate,
                        prdReportMachineList: []
                    };
                    // params.getOutputList.push()
                    // debugger
                    for (let p of _this.reportModalData) {
                        params.prdReportMachineList.push({
                            scheduleId: p.scheduleId,
                            startOutput: p.startOutput,
                            startElectricEnergy: p.startElectricEnergy,
                            endElectricEnergy: p.endElectricEnergy,
                            shiftElectricEnergy: p.shiftElectricEnergy,
                            endOutput: p.endOutput,
                            differenceValue: parseFloat(p.differenceValue) < 0 ? 0 : p.differenceValue,
                            shiftOutput: parseFloat(p.output) < 0 ? 0 : p.output,
                            shiftQty: p.outputKg,
                            machineId: p.machineId,
                            machineCode: p.machineCode,
                            machineName: p.machineName,
                            groupId: p.groupId,
                            groupName: p.groupName,
                            prdNoticeMachineId: p.prdNoticeMachineId,
                            prdNoticeMachineOpeningId: p.prdNoticeMachineOpeningId,
                            prdNoticeId: p.prdNoticeId,
                            prdNoticeCode: p.prdNoticeCode,
                            productId: p.productId,
                            productName: p.productName,
                            productCode: p.productCode,
                            batchCode: p.batchCode,
                            isDutyOpen: p.currentMachineOpen === '是',
                            isDutyEnd: p.currentMachineEnd === '是'
                        });
                    }
                    this.$store.dispatch({
                        type: 'showLoading'
                    });
                    this.$call('prd.report.save', params).then(res => {
                        let content = res.data;
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                        if (content.status === 200) {
                            if (type === 'save') {
                                this.$Message.success('保存成功');
                                this.$router.push({
                                    path: 'report'
                                });
                                this.$route.meta.keepAlive = false;
                            } else {
                                this.$Message.success('提交成功');
                                this.$router.push({
                                    path: 'report-detail',
                                    query: {
                                        id: content.res,
                                        edit: true,
                                        activated: true
                                    }
                                });
                                this.$route.meta.keepAlive = false;
                            }
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // 取消重置按钮
        reportModalCancel () {
            this.reportModalShow = false;
            this.isShowCancel = false;
        },
        // 确认警告
        reportModalConfirm () {
            if (this.isSureReset) {
                this.isSureReset = false;
                this.formAddValidate.processId = '';
                this.formAddValidate.reportDate = this.Today;
                this.formAddValidate.workshopId = this.defaultWorkShopId;
                this.formAddValidate.output = '';
                this.formAddValidate.wasteRate = 0;
                this.reportModalData = [];
                this.isShowCancel = false;
                this.reportModalShow = false;
            } else {
                this.reportModalShow = false;
            }
        }
        // 已经报工的工序不能再次报工
        // getReportSheetList () {
        //     const _this = this;
        //     this.$fetch('report/sheet/list', {
        //         datefrom: this.formAddValidate.reportDate,
        //         dateto: this.formAddValidate.reportDate,
        //         workshopid: this.formAddValidate.workshopId,
        //         shiftid: this.formAddValidate.shiftId
        //     }).then((res) => {
        //         let content = res.data;
        //         if (content.status === 200) {
        //             _this.reportSheetDataList = content.res;
        //             if (_this.reportSheetDataList.map(x => x.processId).includes(this.formAddValidate.processId)) {
        //                 let processName = this.processList.find(x => x.id === this.formAddValidate.processId).name;
        //                 this.saveDisabled = true;
        //                 this.reportModalData = [];
        //                 this.$Modal.warning({
        //                     title: '警告',
        //                     content: '<p>该班次的' + processName + '工序已报工</p>'
        //                 });
        //             } else {
        //                 this.reportToReportList();
        //             }
        //         }
        //     });
        // }
    },
    mounted () {
        // debugger
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.cardHeight = document.documentElement.clientHeight - 120;
            this.reportModalHeight = document.documentElement.clientHeight - H - 220;
        });
        // this.$nextTick(() => {
        //     let tableHeight = document.getElementById('tableHeight').offsetTop;
        //     this.tableHeight = document.documentElement.clientHeight - tableHeight - 160;
        // })
        window.onresize = () => {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.reportModalHeight = document.documentElement.clientHeight - H - 220;
            });
        };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getProcess();
        this.formAddValidate.output = '';
        this.formAddValidate.reportDate = this.Today;
        this.getUserWorkshop();
    },
    activated () {
        if (this.$route.query.activated === true) {
            this.formAddValidate.processId = '';
            this.formAddValidate.reportDate = this.Today;
            this.formAddValidate.workshopId = this.defaultWorkShopId;
            this.formAddValidate.output = '';
            this.formAddValidate.wasteRate = 0;
            this.reportModalData = [];
            this.isShowCancel = false;
            this.reportModalShow = false;
        }
        this.$route.query.activated = false;
    },
    computed: {
        Today: () => {
            const date = new Date();
            const seperator1 = '-';
            const year = date.getFullYear();
            const month = parseInt(date.getMonth() + 1) < 10 ? '0' + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
            const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            // const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            // const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            // const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            const currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
    }
};
</script>

<style scoped>
.displayInlineBlock{
    display: inline-block;
    line-height: 32px;
    margin-bottom: 0;
    vertical-align: middle;
}
.formWidth{
    vertical-align: middle;
    margin-bottom: 10px;
}
.marginButtonBottom{
    margin-bottom: 20px;
}
.dispalyTime{
    justify-content: flex-start;
}
.otherNameStyle{
    width: 150px;
}
.totalPclass{
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
}
.totalClass{
    width: 120px;
    display: inline-block;
    text-align: center;
    /*border-right: 1px solid red;*/
}
</style>

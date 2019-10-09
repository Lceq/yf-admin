<template>
    <div>
        <Card :style="'height:' + cardHeight + 'px'">
            <Row class="marginButtonBottom">
                <Col>
                    <Button icon="md-add" @click="addReportSheet" type="success">新增</Button>
                    <Button icon="md-checkmark" v-show="auditState === 1" @click="saveReportSheet" type="primary">保存</Button>
                    <Button icon="ios-create" v-show="auditState === 1" @click="submitReportSheet" type="primary">提交</Button>
                </Col>
            </Row>
            <Row id="selectedHeight">
                <Col>
                    <Form ref="formAddValidate" :model="formAddValidate" :rules="ruleAddValidate" :label-width="100">
                        <FormItem label="报工单号：" class="displayInlineBlock" prop="code">
                            <Input readonly class="formWidth" v-model="formAddValidate.code" placeholder="自动生成报工单号"></Input>
                        </FormItem>
                        <FormItem label="报工日期：" class="displayInlineBlock" prop="reportDate">
                            <DatePicker readonly class="formWidth" type="date" :clearable="false" :value="formAddValidate.reportDate" placeholder="请输入报工日期"></DatePicker>
                        </FormItem>
                        <FormItem label="生产车间：" class="displayInlineBlock" prop="workshopName">
                            <Input readonly class="formWidth" v-model="formAddValidate.workshopName" placeholder="请输入生产车间"></Input>
                        </FormItem>
                        <FormItem label="报工班次：" class="displayInlineBlock" prop="shiftName">
                            <!--<Select class="formWidth" v-model="formAddValidate.shiftId">-->
                                <!--<Option v-for="(item, index) in ShiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                            <!--</Select>-->
                            <Input readonly class="formWidth" v-model="formAddValidate.shiftName" placeholder="请输入报工班次"></Input>
                        </FormItem>
                        <br>
                        <FormItem label="工序：" class="displayInlineBlock" prop="processName">
                            <Input readonly class="formWidth" v-model="formAddValidate.processName" placeholder="请输入工序"></Input>
                        </FormItem>
                        <!--<FormItem label="损耗率%：" class="displayInlineBlock"  prop="wasteRate">-->
                            <!--<Input readonly class="formWidth" :max="100" :min="0" v-model="formAddValidate.wasteRate" placeholder="请输入损耗率"></Input>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="班次总产量：" class="displayInlineBlock" prop="shiftOutput">-->
                            <!--<Input readonly class="formWidth" v-model="formAddValidate.shiftOutput" placeholder="请输入班次总产量"></Input>-->
                        <!--</FormItem>-->
                        <FormItem label="单据状态：" class="displayInlineBlock" prop="shiftOutput">
                            <!--<Input readonly class="formWidth" v-model="auditStateMean" placeholder="请输入班次总产量"></Input>-->
                            <p class="">{{ auditStateMean }}</p>
                        </FormItem>
                    </Form>
                    <!--<Row>-->
                        <!--<Col>-->
                            <!--<other-message-->
                                <!--:createName="createName"-->
                                <!--:createTime="createTime"-->
                                <!--:updateName="updateName"-->
                                <!--:updateTime="updateTime"-->
                                <!--:submitName="submitName"-->
                                <!--:submitTime="submitTime"-->
                            <!--&gt;-->
                            <!--</other-message>-->
                        <!--</Col>-->
                    <!--</Row>-->
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table border ref="selection" size="small" :height="reportModalHeight" class="marginBottom" :columns="reportModalColumns" :data="reportModalData"></Table>
                    <p class="totalPclass"><span class="totalClass">合计</span><span class="totalClass">{{differenceValue}}</span><span  class="totalClass">{{output}}</span><span  class="totalClass">{{outputKg}}</span></p>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import iView from 'iview';
import excel from '../../../libs/excel.js';
import AboutTime from '../../public/AboutTime';
import publicJs from '../../../libs/common';
import otherMessage from '../../components/otherMessage';
export default {
    components: {
        AboutTime,
        otherMessage
    },
    data () {
        return {
            differenceValue: '',
            output: '',
            outputKg: '',
            cardHeight: '',
            isSave: false,
            isSubmit: false,
            auditState: '',
            auditStateMean: '',
            reportSheetOutputKg: 0,
            inSertDisabled: false,
            outputList: [],
            defaultOutput: '',
            defaultWasteRate: '',
            saveDisabled: true,
            buttonAuditState: true,
            buttonUnAuditState: true,
            reportModalHeight: '',
            curReportId: '',
            shiftList: [],
            processList: [],
            workShopId: '',
            WorkShopList: [],
            ShiftList: [],
            formAddValidate:
                {
                    code: '1',
                    reportDate: '2018-8-16',
                    workshopId: '1',
                    shiftId: '2',
                    processId: '3',
                    wasteRate: 0,
                    shiftOutput: '5',
                    shiftQty: '5'
                },
            ruleAddValidate: {
                reportDate: [
                    { required: true, trigger: 'blur' }
                ],
                workshopName: [
                    { required: true, trigger: 'blur' }
                ],
                shiftName: [
                    { required: true, trigger: 'blur' }
                ],
                processName: [
                    { required: true, trigger: 'blur' }
                ]
            },
            reportModalColumns: [
                {
                    title: '机台号',
                    align: 'center',
                    fixed: 'left',
                    sortable: true,
                    minWidth: 80,
                    key: 'machineCode'
                },
                // {
                //     title: '机台锭数',
                //     align: 'center',
                //     sortable: true,
                //     key: 'spinCount'
                // },
                // {
                //     title: '开台锭数',
                //     align: 'center',
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
                    minWidth: 90,
                    sortable: true,
                    key: 'currentMachineEnd'
                },
                {
                    title: '生产通知单号',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
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
                    minWidth: 90,
                    sortable: true,
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
                                    if (vm.auditStateChange === 1) {
                                        vm.saveDisabled = false;
                                        vm.buttonAuditState = true;
                                    }
                                    if (vm.auditStateChange !== 1) {
                                        vm.saveDisabled = true;
                                    }
                                    // params.row.differenceValue = params.row.endOutput - params.row.startOutput;
                                    params.row.differenceValue = this.getDifferenceValue(params.row.startOutput, params.row.endOutput, params.row.maxOutputQty);
                                    // params.row.shiftOutput = params.row.differenceValue * params.row.openSpinCount;
                                    params.row.differenceValue = params.row.differenceValue > 1000000 ? 0 : params.row.differenceValue;
                                    params.row.shiftOutput = params.row.isSpinOutput ? Math.round((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio) : Math.round(params.row.differenceValue * params.row.outputRatio);
                                    params.row.shiftQty = vm.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
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
                                    if (vm.auditStateChange === 1) {
                                        vm.saveDisabled = false;
                                        vm.buttonAuditState = true;
                                    }
                                    if (vm.auditStateChange !== 1) {
                                        vm.saveDisabled = true;
                                    }
                                    // params.row.differenceValue = params.row.endOutput - params.row.startOutput;
                                    // params.row.shiftOutput = params.row.differenceValue * params.row.openSpinCount;
                                    params.row.differenceValue = this.getDifferenceValue(params.row.startOutput, params.row.endOutput, params.row.maxOutputQty);
                                    params.row.differenceValue = params.row.differenceValue > 1000000 ? 0 : params.row.differenceValue;
                                    params.row.shiftOutput = params.row.isSpinOutput ? Math.round((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio) : Math.round(params.row.differenceValue * params.row.outputRatio);
                                    params.row.shiftQty = vm.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '当班产量表量',
                    align: 'center',
                    sortable: true,
                    width: 120,
                    fixed: 'right',
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
                                    if (vm.auditStateChange === 1) {
                                        vm.saveDisabled = false;
                                        vm.buttonAuditState = true;
                                    }
                                    if (vm.auditStateChange !== 1) {
                                        vm.saveDisabled = true;
                                    }
                                    params.row.differenceValue = event;
                                    // params.row.shiftOutput = params.row.differenceValue * params.row.openSpinCount;
                                    params.row.shiftOutput = params.row.isSpinOutput ? Math.round((params.row.differenceValue * params.row.openSpinCount) * params.row.outputRatio) : Math.round(params.row.differenceValue * params.row.outputRatio);
                                    params.row.shiftQty = vm.getMetreTurnKg(params.row.differenceValue, params.row.gramWeight, params.row.metres, params.row.efficiencyPercent, params.row.openSpinCount, params.row.outputRatio, params.row.isSpinOutput);
                                    vm.reportModalData[params.index] = params.row;
                                    vm.getAllOutput();
                                }
                            }
                        });
                    }
                },
                {
                    title: '当班产量',
                    align: 'center',
                    width: 120,
                    fixed: 'right',
                    sortable: true,
                    key: 'shiftOutput'
                },
                {
                    title: '当班产量(KG)',
                    align: 'center',
                    width: 120,
                    fixed: 'right',
                    sortable: true,
                    key: 'shiftQty'
                }
            ],
            reportModalData: [
            ],
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            submitName: '',
            submitTime: ''
        };
    },
    methods: {
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
            // debugger
            if (gramWeight === null || gramWeight === undefined || metres === null || metres === undefined || metres === ''|| efficiencyPercent === null || efficiencyPercent === undefined || efficiencyPercent === '') {
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
            let outputKg = 0.00;
            if (kgMetreState) {
                if (isSpinOutput) {
                    outputKg = (((differenceValue * (gramWeight / metres) / 1000) * (100 / 100) * openSpinCount)).toFixed(2);
                } else {
                    outputKg = (differenceValue * outputRatio).toFixed(2);
                }
            } else {
                outputKg = 0.00;
            }
            return outputKg;
        },
        // 新增报工单
        addReportSheet () {
            this.$router.push({path: 'addReport'});
        },
        // 获取报工单机器列表
        getReportOutList () {
            this.$call('prd.report.detail', {id: this.curReportId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.reportModalData = content.res.map(item => {
                        item.currentMachineOpen = item.isDutyOpen === true ? '是' : '否';
                        item.currentMachineEnd = item.isDutyEnd === true ? '是' : '否';
                        return item;
                    });
                    this.getAllOutput();
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 消耗率；
        changeWasteRate (e) {
            if (this.defaultWasteRate !== e.target.value) {
                if (this.auditStateChange !== 1) {
                    this.saveDisabled = true;
                } else {
                    this.saveDisabled = false;
                }
            } else {
                this.saveDisabled = true;
            }
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
                num += parseInt(k.shiftOutput);
                output += parseInt(k.shiftOutput);
                shiftElectricEnergy += parseInt(k.shiftElectricEnergy);
                differenceValue += parseInt(k.differenceValue);
                outputKg += Number(k.shiftQty);
                // this.formAddValidate.reportSheetOutputKg += Math.round(k.outputKg);
            }
            // debugger
            this.formAddValidate.shiftOutput = num;
            this.formAddValidate.shiftElectricEnergy = shiftElectricEnergy;
            this.outputKg = outputKg.toFixed(2);
            this.differenceValue = differenceValue;
            this.output = output;
            this.formAddValidate.reportSheetOutputKg = outputKg.toFixed(2);
            // let num = 0;
            // this.formAddValidate.reportSheetOutputKg = 0;
            // for (let k of this.reportModalData) {
            //     num += parseInt(k.shiftOutput);
            //     // debugger
            //     this.formAddValidate.reportSheetOutputKg += Math.round(k.shiftQty);
            // }
            // this.formAddValidate.shiftOutput = num;
        },
        // 保存报工单
        saveReportSheet () {
            this.isSave = true;
            this.isSubmit = false;
            this.getSaveSubmitData();
        },
        submitReportSheet () {
            this.isSave = false;
            this.isSubmit = true;
            this.getSaveSubmitData();
        },
        getSaveSubmitData () {
            let params = {
                id: this.curReportId,
                shiftOutput: this.formAddValidate.shiftOutput,
                shiftQty: this.formAddValidate.reportSheetOutputKg,
                shiftElectricEnergy: this.formAddValidate.shiftElectricEnergy,
                auditState: this.isSave ? 1 : 2,
                wasteRate: this.formAddValidate.wasteRate,
                prdReportMachineList: []
            };
            for (let p of this.reportModalData) {
                params.prdReportMachineList.push({
                    id: p.id,
                    prdNoticeId: p.prdNoticeId,
                    startOutput: p.startOutput,
                    machineId: p.machineId,
                    startElectricEnergy: p.startElectricEnergy,
                    endElectricEnergy: p.endElectricEnergy,
                    shiftElectricEnergy: p.shiftElectricEnergy,
                    endOutput: p.endOutput,
                    differenceValue: parseFloat(p.differenceValue) < 0 ? 0 : p.differenceValue,
                    shiftOutput: parseFloat(p.shiftOutput) < 0 ? 0 : p.shiftOutput,
                    shiftQty: p.shiftQty
                });
            }
            this.outputList = params.outputList;
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.$call('prd.report.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.defaultWasteRate = this.formAddValidate.wasteRate;
                    this.saveDisabled = true;
                    this.buttonAuditState = false;
                    this.getReportOutDetail();
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    this.isSave ? this.$Message.success('保存成功') : this.$Message.success('提交成功');
                    if (!this.isSave) {
                        this.$router.push({
                            path: 'report-detail',
                            query: {
                                id: this.curReportId,
                                edit: true,
                                activated: true
                            }
                        });
                        this.$route.meta.keepAlive = false;
                    }
                    if (this.isSubmit) {
                        let ids = Number(this.curReportId);
                        let params = [];
                        params.push(ids);
                        this.$call('prd.report.submit', params).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                this.buttonAuditState = !this.buttonAuditState;
                                this.buttonUnAuditState = !this.buttonUnAuditState;
                                this.getReportOutDetail();
                                this.saveDisabled = true;
                            }
                        });
                    }
                }
            });
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
        // 导入数据
        insertExcel () {
            this.initUpload();
        },
        initUpload () {
            this.file = null;
            this.tableData = [];
        },
        // 读取文件
        readFile (file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadstart = e => {
                iView.LoadingBar.start();
            };
            reader.onprogress = e => {
                this.progressPercent = Math.round(e.loaded / e.total * 100);
            };
            reader.onerror = e => {
                this.$Message.error('文件读取出错');
            };
            reader.onload = e => {
                const _this = this;
                this.$Message.info('文件读取成功');
                const data = e.target.result;
                const {header, results} = excel.read(data, 'array');
                const tableTitle = header.map(item => {
                    return {title: item, key: item};
                });
                this.tableData = results;
                for (let data of this.reportModalData) {
                    let AllData = this.tableData.filter(x => x.machineCode.trim() === data.machineCode);
                    for (let i of AllData) {
                        if (data.noticeSheetCode === i.noticeSheetCode) {
                            data.startOutput = i.startOutput === undefined ? 0 : parseFloat(i.startOutput);
                            data.endOutput = i.endOutput === undefined ? 0 : parseFloat(i.endOutput);
                            if (i.shiftOutput === undefined) {
                                data.shiftOutput = data.endOutput - data.startOutput;
                                data.outputKg = _this.getMetreTurnKg(data.shiftOutput, data.gramWeight, data.metres, data.spinUsed, data.openSpinCount, data.outputRatio, data.isSpinOutput);
                            } else {
                                data.shiftOutput = parseFloat(i.shiftOutput);
                                data.outputKg = _this.getMetreTurnKg(parseFloat(i.shiftOutput), data.gramWeight, data.metres, data.spinUsed, data.openSpinCount, data.outputRatio, data.isSpinOutput);
                            }
                        }
                    }
                }
                if (this.auditStateChange === 1) {
                    this.saveDisabled = false;
                    this.buttonAuditState = true;
                }
                if (this.auditStateChange !== 1) {
                    this.saveDisabled = true;
                }
                this.getAllOutput();
                iView.LoadingBar.finish();
            };
        },
        getReportOutDetail () {
            const _this = this;
            this.$call('prd.report.detail', {id: this.curReportId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    let data = content.res;
                    _this.formAddValidate.code = data.code;
                    _this.formAddValidate.reportDate = data.belongDate;
                    _this.formAddValidate.workshopId = data.workshopId;
                    _this.formAddValidate.workshopName = data.workshopName;
                    _this.formAddValidate.shiftId = data.shiftId;
                    _this.formAddValidate.shiftName = data.shiftName;
                    _this.formAddValidate.processId = data.processId;
                    _this.formAddValidate.processName = data.processName;
                    _this.formAddValidate.wasteRate = data.wasteRate === null ? 0 : data.wasteRate;
                    _this.defaultWasteRate = data.wasteRate;
                    _this.formAddValidate.shiftOutput = data.shiftOutput;
                    // _this.formAddValidate.shiftQty = data.shiftQty;
                    _this.formAddValidate.reportSheetOutputKg = data.shiftQty;
                    _this.auditState = data.auditState;
                    _this.auditStateMean = data.auditState === 1 ? '待提交' : (data.auditState === 2 ? '待审核' : (data.auditState === 3 ? '已审核' : (data.auditState === 4 ? '已关闭' : '')));
                    _this.defaultOutput = data.shiftOutput;
                    _this.createName = data.createName;
                    _this.createTime = data.createTime;
                    _this.updateName = data.updateName;
                    _this.updateTime = data.updateTime;
                    _this.submitName = data.submitName;
                    _this.submitTime = data.submitTime;
                    if (data.auditState === 1) {
                        _this.auditStateChange = 1;
                        this.buttonAuditState = false;
                        this.buttonUnAuditState = true;
                        this.saveDisabled = true;
                    } else if (data.auditState === 3) {
                        _this.auditStateChange = 3;
                        this.buttonAuditState = true;
                        this.buttonUnAuditState = false;
                        this.saveDisabled = true;
                    } else {
                        _this.auditStateChange = 4;
                        this.saveDisabled = true;
                        this.buttonAuditState = true;
                        this.buttonUnAuditState = true;
                    }
                    this.reportModalData = content.res.prdReportMachineList.map(item => {
                        item.currentMachineOpen = item.isDutyOpen === true ? '是' : '否';
                        item.currentMachineEnd = item.isDutyEnd === true ? '是' : '否';
                        return item;
                    });
                    this.getAllOutput();
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        }
        //
    },
    mounted () {
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.cardHeight = document.documentElement.clientHeight - 122;
            this.reportModalHeight = document.documentElement.clientHeight - H - 235;
        });
        // this.$nextTick(() => {
        //     let tableHeight = document.getElementById('tableHeight').offsetTop;
        //     this.tableHeight = document.documentElement.clientHeight - tableHeight - 160;
        // })
        window.onresize = () => {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 122;
                this.reportModalHeight = document.documentElement.clientHeight - H - 235;
            });
        };
        // window.onresize = () => {
        //     this.tableHeight = publicJs.compClientHeight(360);
        // };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.curReportId = this.$route.query.id;
        this.getReportOutDetail();
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

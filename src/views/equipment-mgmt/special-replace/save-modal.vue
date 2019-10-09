<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="modalStateChange"
                :width="1000"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="8">
                        <FormItem label="日期：" prop="date" class="formItemMargin">
                            <DatePicker v-model="formValidate.date" @on-change="getDateEvent" type="date" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="保全员：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.createName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择生产车间" @on-change="getWorkshopEvent">
                                <Option v-for="(item, index) in formValidate.workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="设备：" prop="workshopId" class="formItemMargin">
                            <div class="flex-left">
                                <Select
                                        class="remoteSearchSelect"
                                        filterable
                                        placeholder="请选择设备"
                                        v-model="formValidate.machineId"
                                        @on-change="getSelectMachineEvent"
                                >
                                    <Option v-for="(item, index) in formValidate.machineList" :value="item.id" :key="index">{{ `${item.name}(${item.code})` }}</Option>
                                </Select>
                                <Button @click="searchIconClickEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="工序：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.processName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="专件：" class="formItemMargin" prop="machinePartsId">
                            <Select v-model="formValidate.machinePartsId" placeholder="请选择专件" @on-change="getMachinePartsEvent">
                                <Option v-for="(item, index) in formValidate.machinePartsList" :value="item.id" :key="index">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="周期单位：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{computeUnit(formValidate.periodUnit)}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="更换周期值：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.periodValue}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="上次更换日期：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.lastReplaceDate}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="预计更换日期：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.expectReplaceDate}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="上次上车时间(天)：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.lastBoardingTime}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="上次上车表数：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.lastDriveOutput}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="当前表数：" class="formItemMargin">
                            <InputNumber :min="0" @on-change="getCurrentOutputEvent" v-model="formValidate.currentOutput" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="上次上车产量：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.lastBoardingOutput}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="更换日期：" class="formItemMargin" prop="replaceDate">
                            <DatePicker v-model="formValidate.replaceDate" type="date" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="下次更换日期：" class="formItemMargin" prop="nextReplaceDate">
                            <DatePicker v-model="formValidate.nextReplaceDate" type="date" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="formValidate.id?true:false">
                        <FormItem label="数据状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="备注：" class="formItemMargin">
                            <Input v-model="formValidate.remarks" :autosize="{minRows: 5,maxRows: 5}" type="textarea" placeholder="请输入"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div v-if="formValidate.id?true:false">
                <operation-log :operationData="operationData"></operation-log>
            </div>
            <div slot="footer">
                <modal-footer
                        :isDisableSaveAndSubmitButton="formValidate.auditState!==1?true:false"
                        :isDisableConfirm="formValidate.auditState!==1?true:false"
                        :showSaveAndSubmitButton="true"
                        :buttonLoading="buttonLoading"
                        :saveAndSubmitButtonLoading="saveAndSubmitButtonLoading"
                        @on-save-submit-event="saveAndSubmitEvent"
                        @saveModalConfirmEvent="confirmEvent"
                        @saveModalCancelEvent="cancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <select-machine-modal
                :selectMachineModalState="selectMachineModalState"
                :selectMachineModalProcessList="selectMachineModalProcessList"
                @on-visible-change="selectMachineModalStateChangeEvent"
                @on-confirm="selectMachineModalConfirmEvent"
        ></select-machine-modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { emptyTips, noticeTips, formatDate, getOperationData, translateState, mathJsMul, mathJsSub } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import operationLog from '../../components/modal-operation-log';
    import selectMachineModal from './select-machine-modal';
    export default {
        components: { modalFooter, modalContentLoading, operationLog, selectMachineModal },
        props: {
            saveModalState: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            saveModalData: {
                type: Object
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            selectMachineModalProcessList: {
                type: Array
            }
        },
        data () {
            const validateCode = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePeriodValue = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWarningValue = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateMachineParts = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateNextReplaceDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateReplaceDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDate = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                selectMachineModalState: false,
                operationData: [],
                saveAndSubmitButtonLoading: false,
                showModal: false,
                buttonLoading: false,
                formValidate: {
                    machinePartsList: []
                },
                ruleValidate: {
                    date: [ { required: true, validator: validateDate, trigger: 'change' } ],
                    code: [ { required: true, validator: validateCode, trigger: 'change' } ],
                    name: [ { required: true, validator: validateName, trigger: 'change' } ],
                    workshopId: [ { required: true, validator: validateWorkshopId, trigger: 'change' } ],
                    periodValue: [ { required: true, validator: validatePeriodValue, trigger: 'change' } ],
                    warningValue: [ { required: true, validator: validateWarningValue, trigger: 'change' } ],
                    machinePartsId: [ { required: true, validator: validateMachineParts, trigger: 'change' } ],
                    nextReplaceDate: [ { required: true, validator: validateNextReplaceDate, trigger: 'change' } ],
                    replaceDate: [ { required: true, validator: validateReplaceDate, trigger: 'change' } ]
                }
            };
        },
        computed: {
            computeUnit () {
                return (e) => {
                    let str = '';
                    if (e) {
                        e === 1 ? str = '时间单位(天)' : str = '机采产量单位';
                    } else {
                        str = '';
                    };
                    return str;
                };
            }
        },
        methods: {
            getCurrentOutputEvent (e) {
                this.calculateOutput();
            },
            getDateEvent (e) {
                if (this.formValidate.date && this.formValidate.lastReplaceDate) {
                    this.formValidate.lastBoardingTime = this.dateDifference(this.formValidate.date, this.formValidate.lastReplaceDate);
                };
            },
            // 选择设备modal的确认选择事件
            selectMachineModalConfirmEvent (e) {
                this.selectMachineModalState = false;
                this.formValidate.machineId = e.id;
                this.formValidate.machineCode = e.code;
                this.formValidate.machineName = e.name;
                this.$set(this.formValidate, 'machinePartsId', null);
                this.$set(this.formValidate, 'machinePartsList', []);
                if (e.processId) {
                    this.formValidate.processId = e.processId;
                    this.formValidate.processCode = e.processCode;
                    this.formValidate.processName = e.processName;
                    this.getMachinePartsList(e.processId);
                };
            },
            // 根据工序获取专件档案
            getMachinePartsList (processId) {
                this.$call('machine.parts.list', {
                    auditState: 3,
                    processId: processId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.$set(this.formValidate, 'machinePartsList', res.data.res);
                    };
                });
            },
            // 监听选择设备modal
            selectMachineModalStateChangeEvent (e) {
                this.selectMachineModalState = e;
            },
            searchIconClickEvent () {
                this.selectMachineModalState = true;
            },
            // 获取选择的专件
            getMachinePartsEvent (e) {
                this.$call('special.parts.replace.lastReplace', {
                    machineId: this.formValidate.machineId,
                    machinePartsId: this.formValidate.machinePartsId
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        // this.formValidate = {...this.formValidate, ...res.data.res};
                        this.formValidate.machinePartsList.forEach(item => {
                            if (item.id === e) {
                                this.formValidate.machinePartsCode = item.code;
                                this.formValidate.machinePartsName = item.name;
                            };
                        });
                        this.formValidate.currentOutput = responseData.currentOutput;
                        this.formValidate.expectReplaceDate = responseData.expectReplaceDate;
                        this.formValidate.isSpinOutput = responseData.isSpinOutput;
                        this.formValidate.lastDriveOutput = responseData.lastDriveOutput;
                        this.formValidate.lastReplaceDate = responseData.lastReplaceDate;
                        this.formValidate.lastSpecialPartsReplaceId = responseData.lastSpecialPartsReplaceId;
                        this.formValidate.outputRatio = responseData.outputRatio;
                        this.formValidate.periodUnit = responseData.periodUnit;
                        this.formValidate.periodValue = responseData.periodValue;
                        this.formValidate.spinUsed = responseData.spinUsed;
                        this.formValidate.warningValue = responseData.warningValue;
                        this.calculateOutput();
                    };
                });
            },
            // 计算相差天数
            dateDifference(sDate1, sDate2) {
                let dateSpan = null;
                let iDays = null;
                sDate1 = Date.parse(sDate1);
                sDate2 = Date.parse(sDate2);
                dateSpan = sDate2 - sDate1;
                dateSpan = Math.abs(dateSpan);
                iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
                return iDays;
            },
            // 计算上次上车产量
            calculateOutput () {
                // 如果是单锭（isSpinOutput=false=true），上次上车产量 = （当前表数 - 上次上车表数 ）* 产量系数outputRatio
                let num1 = mathJsSub(this.formValidate.currentOutput, this.formValidate.lastDriveOutput);
                if (this.formValidate.isSpinOutput) {
                    this.$set(this.formValidate, 'lastBoardingOutput', mathJsMul(num1, this.formValidate.outputRatio));
                } else {
                    // 不是单定（isSpinOutput=false）：上次上车产量 = （当前表数 - 上次上车表数 ）* 产量系数outputRatio * 锭数spinUsed
                    this.formValidate.lastBoardingOutput = mathJsMul(mathJsMul(num1, this.formValidate.outputRatio), this.formValidate.spinUsed);
                };
                // 计算相差天数
                if (this.formValidate.date && this.formValidate.lastReplaceDate) {
                    this.formValidate.lastBoardingTime = this.dateDifference(this.formValidate.date, this.formValidate.lastReplaceDate);
                };
            },
            // 获取选择的机台
            getSelectMachineEvent (e) {
                if (e) {
                    this.$set(this.formValidate, 'machinePartsId', null);
                    this.$set(this.formValidate, 'machinePartsList', []);
                    this.formValidate.machineList.forEach(item => {
                        if (item.id === e) {
                            if (item.processId) {
                                this.formValidate.machineCode = item.code;
                                this.formValidate.machineName = item.name;
                                this.formValidate.processId = item.processId;
                                this.formValidate.processCode = item.processCode;
                                this.formValidate.processName = item.processName;
                                this.getMachinePartsList(item.processId);
                            };
                        };
                    });
                };
            },
            // 获取工序
            getProcessEvent (e) {
                if (e) {
                    this.formValidate.processId = e.value;
                    this.formValidate.processName = e.label;
                } else {
                    this.formValidate.processId = null;
                    this.formValidate.processName = '';
                };
            },
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            // 保存并提交
            saveAndSubmitEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if (Date.parse(this.formValidate.replaceDate) < Date.parse(this.formValidate.nextReplaceDate)) {
                            this.saveAndSubmitButtonLoading = true;
                            this.saveRequest().then(res => {
                                if (res.data.status === 200) {
                                    this.submitRequest(res.data.res);
                                } else {
                                    this.saveAndSubmitButtonLoading = false;
                                };
                            });
                        } else {
                            emptyTips(this, '更换时间必须早于下次更换时间！');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            submitRequest (id) {
                this.$call('special.parts.replace.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                        this.saveAndSubmitButtonLoading = false;
                        noticeTips(this, 'submitTips');
                    };
                });
            },
            // 获取通知分类
            getNoticeTypeEvent (e) {
                if (e) {
                    this.formValidate.noticeTypeName = e.label;
                } else {
                    this.formValidate.noticeTypeId = null;
                    this.formValidate.noticeTypeName = '';
                };
            },
            confirmEvent () {
                this.buttonLoading = true;
                this.saveRequest().then(res => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                        this.buttonLoading = false;
                        noticeTips(this, 'saveTips');
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 保存的请求
            saveRequest () {
                this.formValidate.date ? this.formValidate.date = formatDate(this.formValidate.date) : '';
                this.formValidate.replaceDate ? this.formValidate.replaceDate = formatDate(this.formValidate.replaceDate) : '';
                this.formValidate.nextReplaceDate ? this.formValidate.nextReplaceDate = formatDate(this.formValidate.nextReplaceDate) : '';
                return this.$call('special.parts.replace.save', this.formValidate);
            },
            cancelEvent () {
                this.$emit('on-cancel');
            },
            modalStateChange (e) {
                this.$emit('on-visible-change', e);
                if (!e) {
                    this.$refs['formValidate'].resetFields();
                }
            }
        },
        watch: {
            saveModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            saveModalData: {
                handler (newVal, oldVal) {
                    this.formValidate = newVal;
                    newVal.id ? this.operationData = getOperationData(newVal) : false;
                    this.formValidate.auditStateName = translateState(newVal.auditState);
                    this.calculateOutput();
                },
                deep: true
            }
        }
    };
</script>

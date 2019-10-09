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
                            <div class="exhibitionInputBackground">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="设备：" prop="workshopId" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.machineName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="工序：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.processName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="专件：" class="formItemMargin" prop="machinePartsId">
                            <div class="exhibitionInputBackground">{{formValidate.machinePartsName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="周期单位：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.periodUnit===1?'时间单位(天)':'机采产量单位'}}</div>
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
                            <div class="exhibitionInputBackground">{{formValidate.currentOutput}}</div>
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
                        :buttonLoading="buttonLoading"
                        :saveAndSubmitButtonLoading="saveAndSubmitButtonLoading"
                        @on-save-submit-event="saveAndSubmitEvent"
                        @saveModalConfirmEvent="confirmEvent"
                        @saveModalCancelEvent="cancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { emptyTips, noticeTips, formatDate, getOperationData, translateState, mathJsMul, mathJsSub } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import operationLog from '../../components/modal-operation-log';
    export default {
        components: { modalFooter, modalContentLoading, operationLog },
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
        methods: {
            getDateEvent (e) {
                if (this.formValidate.date && this.formValidate.lastReplaceDate) {
                    this.formValidate.lastBoardingTime = this.dateDifference(this.formValidate.date, this.formValidate.lastReplaceDate);
                };
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
            // 保存并提交
            saveAndSubmitEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveAndSubmitButtonLoading = true;
                        this.saveRequest().then(res => {
                            if (res.data.status === 200) {
                                this.submitRequest(res.data.res);
                            } else {
                                this.saveAndSubmitButtonLoading = false;
                            };
                        });
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
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
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
                    } else {
                        noticeTips(this, 'unCompleteTips');
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
                    if (Object.keys(newVal).length !== 0) {
                        this.formValidate = newVal;
                        newVal.id ? this.operationData = getOperationData(newVal) : false;
                        this.formValidate.auditStateName = translateState(newVal.auditState);
                        this.calculateOutput();
                    };
                },
                deep: true
            }
        }
    };
</script>

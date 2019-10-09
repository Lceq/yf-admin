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
            <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="8">
                        <FormItem label="专件编号：" prop="code" class="formItemMargin">
                            <Input type="text" v-model="formValidate.code" placeholder="请输入专件编号"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="专件名称：" prop="name" class="formItemMargin">
                            <Input type="text" v-model="formValidate.name" placeholder="请输入专件名称"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="工序：" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.processId" placeholder="请选择工序" @on-change="getProcessEvent">
                                <Option v-for="(item, index) in formValidate.processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="专件单位：" class="formItemMargin">
                            <RadioGroup v-model="formValidate.periodUnit">
                                <Radio :label="1">时间单位(天)</Radio>
                                <Radio :label="2">机采产量单位</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="使用周期值：" prop="periodValue" class="formItemMargin">
                            <InputNumber :min="0" v-model="formValidate.periodValue" class="widthPercentage" placeholder="请输入使用周期值"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="提前预警值：" prop="warningValue" class="formItemMargin">
                            <InputNumber :min="0" v-model="formValidate.warningValue" class="widthPercentage" placeholder="请输入提前预警值"/>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择生产车间" @on-change="getWorkshopEvent">
                                <Option v-for="(item, index) in formValidate.workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="formValidate.id?true:false">
                        <FormItem label="数据状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
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
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { emptyTips, noticeTips, formatDate, getOperationData, translateState } from '../../../libs/common';
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
            return {
                operationData: [],
                saveAndSubmitButtonLoading: false,
                showModal: false,
                buttonLoading: false,
                formValidate: {},
                ruleValidate: {
                    code: [ { required: true, validator: validateCode, trigger: 'change' } ],
                    name: [ { required: true, validator: validateName, trigger: 'change' } ],
                    workshopId: [ { required: true, validator: validateWorkshopId, trigger: 'change' } ],
                    periodValue: [ { required: true, validator: validatePeriodValue, trigger: 'change' } ],
                    warningValue: [ { required: true, validator: validateWarningValue, trigger: 'change' } ]
                }
            };
        },
        methods: {
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
                this.$call('machine.parts.submit', [id]).then(res => {
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
                return this.$call('machine.parts.save', this.formValidate);
            },
            cancelEvent () {
                this.$emit('on-cancel');
            },
            modalStateChange (e) {
                this.$emit('on-visible-change', e);
                if (!e) {
                    this.$refs['formValidate'].resetFields();
                    this.buttonLoading = false;
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
                },
                deep: true
            }
        }
    };
</script>

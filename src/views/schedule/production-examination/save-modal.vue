<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="modalStateChangeEvent"
                :width="800"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="8">
                        <FormItem label="当班日期：" prop="belongDate" class="formItemMargin">
                            <DatePicker v-model="formValidate.belongDate" type="date" @on-change="getDateEvent" placeholder="请选择当班日期" class="widthPercentage"></DatePicker>
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
                        <FormItem label="班次：" prop="shiftId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.shiftId" placeholder="请选择班次" @on-change="getShiftEvent">
                                <Option v-for="(item, index) in formValidate.shiftList" :value="item.shiftId" :key="index">{{ item.shiftName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="员工：" prop="userId" class="formItemMargin">
                            <Select
                                    v-model="formValidate.userId"
                                    filterable
                                    clearable
                                    transfer
                                    @on-change="getSelectUserEvent"
                                    placeholder="请输入员工名称"
                            >
                                <Option v-for="(option, index) in formValidate.userList" :value="option.id" :key="index">{{option.label}}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="班组：" class="formItemMargin">
                            <div class="exhibitionInputBackground widthPercentage">{{formValidate.groupName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="岗位：" class="formItemMargin">
                            <div class="exhibitionInputBackground widthPercentage">{{formValidate.postName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="奖惩方式：" prop="isReward" class="formItemMargin">
                            <Select v-model="formValidate.isReward" placeholder="请选择奖惩方式" class="widthPercentage">
                                <Option v-for="(item, index) in formValidate.isRewardList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="金额：" class="formItemMargin">
                            <InputNumber v-model="formValidate.amount" :min="0" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="formValidate.id?true:false">
                        <FormItem label="开单人：" class="formItemMargin">
                            <div class="exhibitionInputBackground widthPercentage">{{formValidate.createName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8" v-if="formValidate.id?true:false">
                        <FormItem label="数据状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="原因说明：" class="formItemMargin">
                            <Input v-model="formValidate.remarks" type="textarea" :autosize="{ minRows: 2, maxRows: 2 }" placeholder="请输入..." />
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
    import { emptyTips, noticeTips, formatDate, getOperationData, translateState, toDay } from '../../../libs/common';
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
            const validateBelongDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateShift = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateIsReward = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            const validateUser = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                operationData: [],
                saveAndSubmitButtonLoading: false,
                showModal: false,
                buttonLoading: false,
                formValidate: {},
                ruleValidate: {
                    belongDate: [ { required: true, validator: validateBelongDate, trigger: 'change' } ],
                    shiftId: [ { required: true, validator: validateShift, trigger: 'change' } ],
                    workshopId: [ { required: true, validator: validateWorkshopId, trigger: 'change' } ],
                    isReward: [ { required: true, validator: validateIsReward, trigger: 'change' } ],
                    userId: [ { required: true, validator: validateUser, trigger: 'change' } ]
                }
            };
        },
        methods: {
            // 获取当班日期
            getDateEvent (e) {
                if (e) {
                    if (this.formValidate.workshopId) {
                        this.getShiftListRequest();
                    };
                } else {
                    this.formValidate.shiftId = null;
                    this.formValidate.shiftName = '';
                    this.formValidate.shiftList = [];
                };
            },
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                    if (this.formValidate.belongDate) {
                        this.getShiftListRequest();
                    };
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            // 根据日期和车间，获取的班次
            getShiftListRequest () {
                this.$call('schedule.list3', {
                    belongDate: formatDate(this.formValidate.belongDate),
                    workshopId: this.formValidate.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.shiftList = res.data.res;
                    };
                });
            },
            getSelectUserEvent (e) {
                if (e) {
                    this.formValidate.userList.forEach(item => {
                        if (item.id === e) {
                            this.formValidate.userId = item.id;
                            this.formValidate.userCode = item.code;
                            this.formValidate.userName = item.name;
                            this.formValidate.postName = item.postName;
                            this.formValidate.groupId = item.deptId;
                            this.formValidate.groupName = item.deptName;
                        }
                    });
                };
            },
            // 获取选中的计划员
            getSelectPlanner (e) {
                if (e) {
                    this.userList.forEach(item => {
                        if (item.id === e) {
                            this.formValidate.userId = item.id;
                            this.formValidate.userCode = item.code;
                            this.formValidate.userName = item.name;
                        };
                    });
                } else {
                    this.formValidate.userId = null;
                    this.formValidate.userCode = '';
                    this.formValidate.userName = '';
                };
            },
            // 获取班次
            getShiftEvent (e) {
                if (e) {
                    this.formValidate.shiftId = e.value;
                    this.formValidate.shiftName = e.label;
                } else {
                    this.formValidate.shiftId = null;
                    this.formValidate.shiftName = '';
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
                this.$call('user.examination.submit', [id]).then(res => {
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
                this.formValidate.belongDate ? this.formValidate.belongDate = formatDate(this.formValidate.belongDate) : '';
                return this.$call('user.examination.save', this.formValidate);
            },
            cancelEvent () {
                this.$emit('on-cancel');
            },
            modalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (!e) {
                    this.$refs['formValidate'].resetFields();
                    this.buttonLoading = false;
                };
            }
        },
        watch: {
            saveModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            saveModalData: {
                handler (newVal, oldVal) {
                    let values = JSON.parse(JSON.stringify(newVal));
                    this.formValidate = values;
                    values.id ? this.operationData = getOperationData(values) : false;
                    this.formValidate.auditStateName = translateState(values.auditState);
                },
                deep: true
            }
        }
    };
</script>

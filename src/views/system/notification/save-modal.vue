<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="modalStateChange"
                width="900"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col span="24">
                        <FormItem label="公告标题：" prop="title" class="formItemMargin">
                            <Input v-model="formValidate.title" :autosize="{minRows: 2,maxRows: 2}" type="textarea" placeholder="请输入公告标题"></Input>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="公告分类：" prop="noticeTypeId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.noticeTypeId" placeholder="请输入公告分类" @on-change="getNoticeTypeEvent">
                                <Option v-for="(item, index) in formValidate.noticeTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
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
                        <FormItem label="发布日期：" prop="publicationDate" class="formItemMargin">
                            <DatePicker v-model="formValidate.publicationDate" @on-change="getPublicationDateEvent" type="date" placeholder="请选择发布日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="失效日期：" prop="expiringDate" class="formItemMargin">
                            <DatePicker v-model="formValidate.expiringDate" @on-change="getExpiringDateEvent" type="date" placeholder="请选择失效日期" class="widthPercentage"></DatePicker>
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
                        <FormItem label="公告内容：" class="formItemMargin" prop="contents">
                            <Input v-model="formValidate.contents" :autosize="{minRows: 5,maxRows: 5}" type="textarea" placeholder="请输入"></Input>
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
    import operationLog from '../../components/modal-operation-log'
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
            const validateTitle = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateNoticeType = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePublicationDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateExpiringDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateContents = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                operationData: [],
                saveAndSubmitButtonLoading: false,
                showModal: false,
                buttonLoading: false,
                formValidate: {},
                ruleValidate: {
                    title: [ { required: true, validator: validateTitle, trigger: 'change' } ],
                    noticeTypeId: [ { required: true, validator: validateNoticeType, trigger: 'change' } ],
                    workshopId: [ { required: true, validator: validateWorkshopId, trigger: 'change' } ],
                    publicationDate: [ { required: true, validator: validatePublicationDate, trigger: 'change' } ],
                    expiringDate: [ { required: true, validator: validateExpiringDate, trigger: 'change' } ],
                    contents: [ { required: true, validator: validateContents, trigger: 'change' } ]
                }
            };
        },
        methods: {
            // 获取发布日期
            getPublicationDateEvent (e) {
                if (this.formValidate.expiringDate) {
                    if (new Date(this.formValidate.publicationDate).valueOf() > new Date(this.formValidate.expiringDate).valueOf()) {
                        emptyTips(this, '发布日期必须早于失效日期！');
                        this.formValidate.publicationDate = '';
                    };
                };
            },
            // 获取失效日期
            getExpiringDateEvent (e) {
                if (this.formValidate.publicationDate) {
                    if (new Date(this.formValidate.publicationDate).valueOf() > new Date(this.formValidate.expiringDate).valueOf()) {
                        emptyTips(this, '失效日期必须晚于发布日期！');
                        this.formValidate.expiringDate = '';
                    };
                };
            },
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null
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
                this.$call('notice.submit', [id]).then(res => {
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
            saveRequest () {
                this.formValidate.publicationDate ? this.formValidate.publicationDate = formatDate(this.formValidate.publicationDate) : this.formValidate.publicationDate = '';
                this.formValidate.expiringDate ? this.formValidate.expiringDate = formatDate(this.formValidate.expiringDate) : this.formValidate.expiringDate = '';
                return this.$call('notice.save', this.formValidate);
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
                },
                deep: true
            }
        }
    }
</script>

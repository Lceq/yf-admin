<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                :maskClosable="false"
        >
            <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col span="24">
                        <FormItem label="名称：" prop="name" class="formItemMargin">
                            <Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>
                        </FormItem>
                    </Col>
                   <!-- <Col span="24">
                        <FormItem label="简称：" prop="shortName" class="formItemMargin">
                            <Input type="text" v-model="formValidate.shortName" placeholder="请输入简称"/>
                        </FormItem>
                    </Col>-->
                    <Col span="24">
                        <FormItem label="包装料类型：" prop="paramType" class="formItemMargin">
                            <Select v-model="formValidate.paramType" placeholder="请选择包装料类型">
                                <Option v-for="item in paramsTypeList" :value="item.paramType" :key="item.paramType">{{ item.paramTypeName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div v-show="showOther">
                    <other-message
                            :createName="formValidate.createName"
                            :createTime="formValidate.createTime"
                            :updateName="formValidate.updateName"
                            :updateTime="formValidate.updateTime"
                            :auditName="formValidate.auditName"
                            :auditTime="formValidate.auditTime"
                    ></other-message>
                </div>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="confirmButtonLoading"
                        :isDisableConfirm="isDisableConfirm"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import { noticeTips } from '../../../libs/common';
    import modalFooter from '../../components/modal-footer';
    import otherMessage from '../../components/otherMessage';
    export default {
        components: { modalFooter, otherMessage },
        props: {
            detailData: {
                type: Object
            },
            saveModalState: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            showOther: {
                type: Boolean,
                default: false
            }
        },
        data () {
            const validateName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateShortName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateParamsType = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                isDisableConfirm: false,
                showModal: false,
                formValidate: {
                    name: '',
                    shortName: '',
                    paramType: null,
                    paramTypeName: null
                },
                ruleValidate: {
                    name: [{ required: true, validator: validateName, trigger: 'blur' }],
                    shortName: [{ required: true, validator: validateShortName, trigger: 'blur' }],
                    paramType: [{ required: true, validator: validateParamsType, trigger: 'blur' }]
                },
                confirmButtonLoading: false,
                paramsTypeList: [
                    {
                        paramType: 1,
                        paramTypeName: '腰绳'
                    },
                    {
                        paramType: 2,
                        paramTypeName: '封包绳'
                    }
                ]
            };
        },
        methods: {
            // 确认事件
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.confirmButtonLoading = true;
                        this.saveRequest();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 保存的请求
            saveRequest () {
                this.paramsTypeList.forEach(item => {
                    if (item.paramType === this.formValidate.paramType) this.formValidate.paramTypeName = item.paramTypeName;
                });
                this.$call('pack.color.save', this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                    } else {
                        this.confirmButtonLoading = false;
                    };
                });
            },
            saveModalCancelEvent () {
                this.$emit('on-cancel');
                this.$refs['formValidate'].resetFields();
            },
            saveModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.confirmButtonLoading = false;
                    this.formValidate = {};
                }
            }
        },
        watch: {
            saveModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            detailData: {
                handler (newVal, oldVal) {
                    this.formValidate = newVal;
                    if (this.formValidate.auditState) {
                        this.formValidate.auditState === 1 ? this.isDisableConfirm = false : this.isDisableConfirm = true;
                    } else {
                        this.isDisableConfirm = false;
                    };
                },
                deep: true
            }
        }
    };
</script>

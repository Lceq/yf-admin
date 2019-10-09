<template>
    <div>
        <Modal
                v-model="showModal"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="saveModalStateChangeEvent"
        >
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="60" :show-message="false">
                <FormItem :label="labelFirst" prop="code" class="formItemMargin">
                    <Input type="text" v-model="formCustom.code"/>
                </FormItem>
                <FormItem :label="labelSecond" prop="name" class="formItemMargin">
                    <Input type="text" v-model="formCustom.name"/>
                </FormItem>
            </Form>
            <div v-show="showOther">
                <other-message
                        :createName="createName"
                        :createTime="createTime"
                        :auditName="auditName"
                        :auditTime="auditTime"
                ></other-message>
            </div>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="saveModalLoading"
                        :isDisableConfirm="disableConfirm"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>

<script>
    import otherMessage from '../../../components/otherMessage';
    import modalFooter from '../../../components/modal-footer';
    import { noticeTips } from '../../../../libs/common';
    export default {
        props: {
            saveModalState: {
                type: Boolean,
                default: false
            },
            saveModalLoading: {
                type: Boolean,
                default: false
            },
            showOther: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            saveModalCode: {
                type: String
            },
            saveModalName: {
                type: String
            },
            createName: {
                type: String
            },
            createTime: {
                type: String
            },
            auditName: {
                type: String
            },
            auditTime: {
                type: String
            },
            disableConfirm: {
                type: Boolean,
                default: false
            }
        },
        components: {
            otherMessage, modalFooter
        },
        data () {
            const validateCode = (rule, value, callback) => {
                if (this.saveModalTitle.indexOf('供应商') === -1) {
                    if (value || value === '0') {
                        if (/[\u4e00-\u9fa5]/g.test(value)) {
                            callback(new Error());
                            this.$Message.warning('编号不能为中文!');
                        } else {
                            callback();
                        };
                    } else {
                        callback(new Error());
                    };
                } else {
                    value ? callback() : callback(new Error());
                };
            };
            const validateName = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            return {
                labelFirst: '',
                labelSecond: '',
                showModal: false,
                formCustom: {
                    code: '',
                    name: ''
                },
                ruleCustom: {
                    code: [
                        { required: true, validator: validateCode, trigger: 'change' }
                    ],
                    name: [
                        { required: true, validator: validateName, trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            saveModalConfirmEvent () {
                this.$refs['formCustom'].validate((valid) => {
                    if (valid) {
                        let obj = {
                            saveModalCode: this.formCustom.code,
                            saveModalName: this.formCustom.name
                        };
                        this.$emit('saveModalConfirmEvent', obj);
                    } else {
                        // noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            saveModalCancelEvent () {
                this.$emit('saveModalCancelEvent');
            },
            saveModalStateChangeEvent (e) {
                e === false ? this.$refs['formCustom'].resetFields() : '';
                this.$emit('saveModalStateChangeEvent', e);
            }
        },
        watch: {
            saveModalState (newData, oldData) {
                this.showModal = newData;
            },
            saveModalCode (newData, oldData) {
                this.formCustom.code = newData;
            },
            saveModalName (newData, oldData) {
                this.formCustom.name = newData;
            },
            saveModalTitle (newData, oldData) {
                if (newData.indexOf('供应商') === -1) {
                    this.labelFirst = '编号:';
                    this.labelSecond = '名称:';
                } else {
                    this.labelFirst = '全称:';
                    this.labelSecond = '简称:';
                };
            }
        }
    };
</script>

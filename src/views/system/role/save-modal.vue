<template>
    <div>
        <Modal
                v-model="showModal"
                :title="modalTitle"
                @on-visible-change="onVisibleChange"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :show-message="false">
                <Row>
                    <Col span="24">
                        <FormItem label="角色编号：" prop="code" class="margin-bottom-10">
                            <Input v-model="formValidate.code" placeholder="请输入角色编号"></Input>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="角色名称：" prop="name" class="margin-bottom-10">
                            <Input v-model="formValidate.name" placeholder="请输入角色名称"></Input>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="排序：" class="margin-bottom-10">
                            <InputNumber v-model="formValidate.sortNum" :min="1"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem label="备注：" class="margin-bottom-10">
                            <Input v-model="formValidate.remark" type="textarea" :autosize="{maxRows: 2,maxRows: 2}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import modalContentLoading from '../../components/modal-content-loading';
    import {noticeTips} from '../../../libs/common';
    export default {
        name: 'role-save',
        components: { modalFooter, modalContentLoading },
        props: {
            modalState: {
                type: Boolean,
                default: false
            },
            modalTitle: {
                type: String
            },
            roleId: {
                type: [String, Number]
            }
        },
        data () {
            return {
                showModal: false,
                buttonLoading: false,
                formValidate: {
                    code: '',
                    name: '',
                    sortNum: 1,
                    remark: ''
                },
                ruleValidate: {
                    code: [{required: true, trigger: 'change'}],
                    name: [{required: true, trigger: 'change'}]
                },
                spinShow: false
            };
        },
        methods: {
            onVisibleChange (e) {
                if (!e) {
                    this.formValidate = {
                        code: '',
                        name: '',
                        sortNum: 1,
                        remark: ''
                    };
                };
                this.$emit('on-visible-change', e);
            },
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveRequest();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            saveRequest () {
                this.buttonLoading = true;
                this.$call('role.save', this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('on-confirm');
                        this.showModal = false;
                        this.buttonLoading = false;
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            saveModalCancelEvent () {
                this.showModal = false;
            },
            getRoleDetail (id) {
                this.spinShow = true;
                this.$call('role.detail', {id}).then((res) => {
                    if (res.data.status === 200) {
                        this.formValidate = res.data.res;
                        this.spinShow = false;
                    }
                });
            }
        },
        watch: {
            modalState (newVal) {
                this.showModal = newVal;
            },
            roleId (newVal) {
                if (newVal) {
                    this.getRoleDetail(newVal);
                };
            }
        }
    };
</script>

<template>
    <div>
        <Modal
                v-model="showModal"
                title="新增批号"
                :mask-closable="false"
                @on-visible-change="addBatchCodeModalVisibleChangeEvent"
                width="600"
        >
            <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col span="12">
                        <FormItem label="物料：" class="formItemMargin" :label-width="60">
                            <p class="modal-readonly">{{ addBatchModalProductCodeItem.productCode ? `${addBatchModalProductCodeItem.productName}(${addBatchModalProductCodeItem.productCode})` : '' }}</p>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="规格：" prop="productModels" class="formItemMargin">
                            <p class="modal-readonly">{{ addBatchModalProductCodeItem.productModels }}</p>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="批号：" prop="batchCode" class="formItemMargin" :label-width="60">
                            <Input v-model="formValidate.batchCode" placeholder="请输入批号" :maxlength="12"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="批号日期：" prop="batchDate" class="formItemMargin">
                            <DatePicker type="date" @on-change="getBatchCodeDateEvent" v-model="formValidate.batchDate" placeholder="请选择批号日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <modalFooter
                    :buttonLoading="addBatchCodeModalConfirmBtnLoading"
                    @saveModalConfirmEvent="addBatchCodeModalConfirmEvent"
                    @saveModalCancelEvent="addBatchCodeModalCancelEvent"
                ></modalFooter>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalFooter from '../../../components/modal-footer';
    import { toDaySeconds, noticeTips, formatDate } from '../../../../libs/common';
    export default {
        components: { modalFooter },
        props: {
            addBatchModalState: {
                type: Boolean,
                default: false
            },
            addBatchModalProductCodeItem: {
                type: Object
            }
        },
        data () {
            const validateBatchCode = (rule, value, callback) => {
                if (value) {
                    let reg = /[\u4e00-\u9fa5]/g;
                    if (reg.test(value)) {
                        callback(new Error());
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                }
            };
            const validateBatchDate = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                showModal: false,
                formValidate: {
                    productCode: '',
                    productModels: '',
                    batchCode: '',
                    batchDate: toDaySeconds()
                },
                ruleValidate: {
                    batchCode: [ { required: true, validator: validateBatchCode, trigger: 'change' } ],
                    batchDate: [ { required: true, validator: validateBatchDate, trigger: 'change' } ]
                },
                remoteMaterialLoading: false,
                remoteMaterialList: [],
                materialList: [],
                addBatchCodeModalConfirmBtnLoading: false
            };
        },
        methods: {
            materialSearchButtonIconEvent () {

            },
            getSelectMaterialEvent () {},
            remoteMaterialMethod () {},
            getBatchCodeDateEvent () {

            },
            addBatchCodeModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.saveHttp();
                    } else {
                        if (this.formValidate.batchCode) {
                            let reg = /[\u4e00-\u9fa5]/g;
                            if (reg.test(this.formValidate.batchCode)) {
                                this.$Message.warning('批号不能为中文!');
                            } else {
                                noticeTips(this, 'unCompleteTips');
                            };
                        } else {
                            noticeTips(this, 'unCompleteTips');
                        };
                    };
                });
            },
            saveHttp () {
                this.addBatchCodeModalConfirmBtnLoading = true;
                let params = {
                    batchCode: this.formValidate.batchCode,
                    productId: this.addBatchModalProductCodeItem.productId,
                    productCode: this.addBatchModalProductCodeItem.productCode,
                    batchDate: formatDate(this.formValidate.batchDate),
                    productName: this.addBatchModalProductCodeItem.productName,
                    productModels: this.addBatchModalProductCodeItem.productModels,
                    auditState: 3
                };
                this.$call('product.batch.save', params).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.showModal = false;
                        this.addBatchCodeModalConfirmBtnLoading = false;
                        this.$emit('add-batch-code-modal-confirm-event', this.formValidate.batchCode);
                    } else {
                        this.addBatchCodeModalConfirmBtnLoading = false;
                    }
                });
            },
            addBatchCodeModalCancelEvent () {
                // this.$emit('addBatchCodeModalCancelEvent');
                this.showModal = false;
            },
            addBatchCodeModalVisibleChangeEvent (e) {
                if (e === true) {
                    this.formValidate.batchCode = '';
                    this.formValidate.batchDate = toDaySeconds();
                    this.$refs['formValidate'].resetFields();
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            addBatchModalState (newData, oldData) {
                this.showModal = newData;
            },
            addBatchModalProductCodeItem (newVal, oldVal) {
                if (newVal) {
                    newVal.mproductId ? newVal.productId = newVal.mproductId : '';
                    newVal.mproductCode ? newVal.productCode = newVal.mproductCode : '';
                    newVal.mproductName ? newVal.productName = newVal.mproductName : '';
                    newVal.mproductModels ? newVal.productModels = newVal.mproductModels : '';
                }
            }
        }
    };
</script>

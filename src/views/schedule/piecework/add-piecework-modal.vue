<template>
    <div>
        <Modal
                v-model="showModal"
                title="计件核算"
                :mask-closable="false"
                @on-visible-change="addPieceWorkModalStateChangeEvent"
                width="450"
        >
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="90" :show-message="false">
                <Row>
                    <Col span="23">
                        <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                            <Select clearable v-model="formCustom.workshopId" class="widthPercentage" placeholder="请选择车间">
                                <Option v-for="(item, index) in formCustom.workshopList" :value="item.deptId" :style="item.deptId" :key="index">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="23">
                        <FormItem label="计件日期：" prop="end" class="formItemMargin">
                            <DatePicker v-model="formCustom.daterange" type="daterange" format="yyyy-MM-dd" class="widthPercentage" placeholder="请选择日期" @on-change="getDateEvent"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row slot="footer" type="flex" justify="space-between" align="middle">
                <Col>
                    <span>注：所选日期必须排班才能计件核算!</span>
                </Col>
                <Col>
                    <modal-footer
                            :buttonLoading="addPieceWorkModalConfirmLoading"
                            @saveModalConfirmEvent="addPieceWorkModalConfirmEvent"
                            @saveModalCancelEvent="addPieceWorkModalCancelEvent"
                    ></modal-footer>
                </Col>
            </Row>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage, noticeTips } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import modalFooter from '../../components/modal-footer';
    export default {
        components: {
            modalContentLoading, modalFooter
        },
        props: {
            addPieceWorkModalConfirmLoading: {
                type: Boolean,
                default: false
            },
            addPieceWorkModalState: {
                type: Boolean,
                default: false
            },
            addPieceWorkFromData: {
                type: Object
            }
        },
        data () {
            const validateWorkshop = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateBeginDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateEndDate = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                formCustom: {},
                ruleCustom: {
                    workshopId: [ { required: true, validator: validateWorkshop, trigger: 'blur' } ],
                    begin: [ { required: true, validator: validateBeginDate, trigger: 'blur' } ],
                    end: [ { required: true, validator: validateEndDate, trigger: 'blur' } ]
                },
                showModal: false
            };
        },
        methods: {
            // 获取登录时间
            getDateEvent (dateEvent) {
                this.formCustom.begin = dateEvent[0];
                this.formCustom.end = dateEvent[1];
            },
            addPieceWorkModalConfirmEvent () {
                this.$refs['formCustom'].validate((valid) => {
                    if (valid) {
                        this.$emit('confirm-event', this.formCustom);
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            addPieceWorkModalCancelEvent () {
                this.$refs['formCustom'].resetFields();
                this.$emit('cancel-event');
            },
            addPieceWorkModalStateChangeEvent (e) {
                if (e === false) {
                    this.selectRow = null;
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            addPieceWorkModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            addPieceWorkFromData: {
                handler (newVal, oldVal) {
                    newVal.daterange = [newVal.begin, newVal.end]
                    this.formCustom = newVal;
                },
                deep: true
            }
        }
    };
</script>

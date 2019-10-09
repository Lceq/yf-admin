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
                        <FormItem label="开台时间：" prop="startTime" class="formItemMargin">
                            <DatePicker @on-change="getStartTImeEvent" type="datetime" v-model="formValidate.startTime" placeholder="请输入开台时间" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="班次日期：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.scheduleBelongDate}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="开台班次：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.scheduleShiftName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="排包区域：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.packingAreaName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="生产工序：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.processName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="生产车间：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="生产批号：" class="formItemMargin">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.batchCode}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" 投料包数：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.packetQty}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label=" 投料重量：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.weightQty}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table border size="small" :columns="tableHeader" :data="formValidate.machineList"></Table>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="confirmEvent"
                        @saveModalCancelEvent="cancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { emptyTips, noticeTips, formatDate, translateState } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: { modalFooter, modalContentLoading },
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
            const validateStartTime = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePeriodValue = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWarningValue = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center'
                    },
                    {
                        title: '梳棉机编号',
                        key: 'machineCode'
                    },
                    {
                        title: '梳棉机名称',
                        key: 'machineName'
                    },
                    {
                        title: '开台产量表数',
                        key: 'startOutput',
                        align: 'center',
                        render: (h, params) => {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.startOutput,
                                    min: 0,
                                    precision: 0
                                },
                                style: {width: '100%'},
                                on: {
                                    'on-change': (e) => {
                                        params.row.startOutput = e;
                                        this.formValidate.machineList[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    }
                ],
                showModal: false,
                buttonLoading: false,
                formValidate: {},
                ruleValidate: {
                    startTime: [ { required: true, validator: validateStartTime, trigger: 'change' } ],
                    name: [ { required: true, validator: validateName, trigger: 'change' } ],
                    workshopId: [ { required: true, validator: validateWorkshopId, trigger: 'change' } ],
                    periodValue: [ { required: true, validator: validatePeriodValue, trigger: 'change' } ],
                    warningValue: [ { required: true, validator: validateWarningValue, trigger: 'change' } ]
                }
            };
        },
        methods: {
            getStartTImeEvent (e) {
                if (e) {
                    this.$call('schedule.current.schedule', {
                        now: formatDate(this.formValidate.startTime),
                        workshopId: this.formValidate.workshopId
                    }).then(res => {
                        if (res.data.status === 200) {
                            if (res.data.res) {
                                this.formValidate.scheduleBelongDate = res.data.res.belongDate;
                                this.formValidate.startScheduleId = res.data.res.id;
                                this.formValidate.scheduleShiftId = res.data.res.shiftId;
                                this.formValidate.scheduleShiftName = res.data.res.shiftName;
                            } else {
                                this.formValidate.scheduleBelongDate = '';
                                this.formValidate.startScheduleId = null;
                                this.formValidate.scheduleShiftId = null;
                                this.formValidate.scheduleShiftName = '';
                            };
                        };
                    });
                };
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
                                noticeTips(this, 'saveTips');
                                this.$emit('on-confirm');
                                this.buttonLoading = false;
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
                this.$delete(this.formValidate, 'id');
                this.$delete(this.formValidate, 'ids');
                this.formValidate.machineList.forEach(item => { this.$delete(item, 'id'); });
                this.formValidate.startTime = this.formValidate.startTime ? formatDate(this.formValidate.startTime) : '';
                return this.$call('prd.material.feeding.opening.start.save', this.formValidate);
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
                    this.formValidate.auditStateName = translateState(newVal.auditState);
                },
                deep: true
            }
        }
    };
</script>

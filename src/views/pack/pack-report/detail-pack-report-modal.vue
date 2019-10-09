<template>
    <div>
        <Modal
                v-model="showModal"
                title="包装报工单详情"
                :mask-closable="false"
                @on-visible-change="detailPackReportModalStateChangeEvent"
                width="1200"
        >
            <modal-content-loading
                    :spinShow="detailPackReportModalSpinShow"
            ></modal-content-loading>
            <Form ref="formValidate" :model="formValidate" :label-width="110" :show-message="false">
                <Tabs v-model="activeTabPane">
                    <TabPane label="基本信息" name="0">
                        <Row>
                            <Col span="6">
                                <FormItem label="报工日期:" class="formItemMargin" prop="date">
                                    <div class="exhibitionInputBackground widthPercentage">{{ formValidate.date }}</div>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="生产车间:" class="formItemMargin" prop="workshopId">
                                    <div class="exhibitionInputBackground widthPercentage">{{ formValidate.workshopName }}</div>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="报工总产量(KG):" class="formItemMargin">
                                    <div class="exhibitionInputBackground widthPercentage">{{ formValidate.totalQty }}</div>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单据状态:" class="formItemMargin">
                                    <div class="exhibitionInputBackground widthPercentage">{{ auditStateEvent(formValidate.auditState) }}</div>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row class="tableMargin">
                            <Col span="24">
                                <Table highlight-row :columns="tableHeader" :data="formValidate.packReportDetailList" :height="560" size="small" border></Table>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="1">
                        <modal-operation-log
                                :operationData="operationData"
                        ></modal-operation-log>
                    </TabPane>
                </Tabs>
            </Form>
            <div slot="footer">
                <Button type="error" @click="detailPackReportModalCloseEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    import { addNum, getOperationData } from '../../../libs/common';
    import modalOperationLog from '../../components/modal-operation-log';
    let _this = this;

    export default {
        components: { modalContentLoading, modalOperationLog },
        props: {
            detailPackReportModalState: {
                type: Boolean,
                default: false
            },
            detailPackReportModalSpinShow: {
                type: Boolean,
                default: false
            },
            detailPackReportModalData: {
                type: Object
            }
        },
        data () {
            return {
                operationData: [],
                activeTabPane: '0',
                showModal: false,
                formValidate: {},
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '产品',
                        key: 'productName',
                        minWidth: 200,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 120,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '生产订单号',
                        key: 'prdOrderCode',
                        minWidth: 120,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        minWidth: 110,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '未完成数量',
                        key: 'unCompletionQty',
                        minWidth: 110,
                        align: 'center'
                    },
                    {
                        title: '报工产量(KG)',
                        key: 'reportQty',
                        minWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '包装人',
                        key: 'reporterName',
                        minWidth: 160,
                        align: 'center'
                    }
                ]
            };
        },
        computed: {
            auditStateEvent () {
                return (e) => {
                    if (e === 1) {
                        return '创建';
                    } else if (e === 2) {
                        return '待审核';
                    } else if (e === 3) {
                        return '已审核';
                    } else if (e === 4) {
                        return '已关闭';
                    };
                };
            }
        },
        methods: {
            // 计算总产量
            calculationTotalReport () {
                let totalNum = 0;
                this.formValidate.packReportDetailList.forEach((item) => {
                    if (item.reportQty) {
                        totalNum = addNum(totalNum, item.reportQty);
                    };
                });
                this.$set(this.formValidate, 'totalQty', totalNum);
            },
            // 关闭按钮事件
            detailPackReportModalCloseEvent () {
                this.$emit('close-event');
            },
            // 监听modal
            detailPackReportModalStateChangeEvent (e) {
                if (e) {
                    this.$refs['formValidate'].resetFields();
                } else {
                    this.$refs['formValidate'].resetFields();
                    this.formValidate = {};
                    this.activeTabPane = '0';
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            detailPackReportModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            detailPackReportModalData: {
                handler (newVal, oldVal) {
                    this.operationData = getOperationData(newVal);
                    this.formValidate = newVal;
                },
                deep: true
            }
        }
    };
</script>

<template>
    <div>
        <Modal
                v-model="showModal"
                :title="savePackReportModalTitle"
                :mask-closable="false"
                @on-visible-change="savePackReportModalStateChangeEvent"
                width="1200"
        >
            <modal-content-loading
                    :spinShow="savePackReportModalSpinShow"
            ></modal-content-loading>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110" :show-message="false">
                <Row>
                    <Col span="6">
                        <FormItem label="报工日期:" class="formItemMargin" prop="date">
                            <DatePicker :clearable="false" type="date"  v-model="formValidate.date" placeholder="请选择报工日期" class="modal-input-length queryBarMarginRight widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="生产车间:" class="formItemMargin" prop="workshopId">
                            <Select clearable v-model="formValidate.workshopId" placeholder="请选择车间" @on-change="getSelectWorkshopEvent" label-in-value class="modal-input-length queryBarMarginRight widthPercentage">
                                <Option v-for="item in formValidate.workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
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
                <Tabs v-model="activeTabPane">
                    <TabPane label="基本信息" name="0">
                        <Button icon="md-add" type="success" @click="addMaterialEvent">添加产品</Button>
                        <Row class="tableMargin">
                            <Col span="24">
                                <Table highlight-row :columns="tableHeader" :data="formValidate.packReportDetailList" :height="520" size="small" border></Table>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="其他信息" name="1" v-if="savePackReportModalTitle.indexOf('新增')=== 0?false:true">
                        <modal-operation-log
                                :operationData="operationData"
                        ></modal-operation-log>
                    </TabPane>
                </Tabs>
            </Form>
            <div slot="footer">
                <Button :loading="savePackReportModalSaveLoading" type="success" @click="saveEvent">保存</Button>
                <Button :loading="savePackReportModalSubmitLoading" type="info" @click="saveAndSubmitEvent">保存并提交</Button>
                <Button class="cancelButton" @click="saveModalCancelEvent">取消</Button>
            </div>
        </Modal>
        <select-product-modal
                :confirmLoading="confirmLoading"
                :selectMaterialModalState="selectMaterialModalState"
                :selectMaterielModalTableData="selectMaterielModalTableData"
                :spinShow="selectMaterialSpinShow"
                :selectMaterialPageTotal="selectMaterialPageTotal"
                @on-visible-change="selectMaterialModalVisibleChangeEvent"
                @on-change-page="selectMaterialModalChangePageEvent"
                @select-material-modal-search-event="selectMaterialModalSearchEvent"
                @confirm-event="selectMaterialModalConfirmEvent"
        ></select-product-modal>
        <tips-modal
                :tipsModalMessage="tipsModalMessage"
                :tipsIcon="'md-help-circle'"
                :tipsModalState="tipsModalState"
                :confirmButtonLoading="tipsModalConfirmButtonLoading"
                @confirm-event="tipsModalConfirmEvent"
                @cancel-event="tipsModalCancelEvent"
        ></tips-modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    import selectProductModal from './select-product-modal';
    import {setPage, addNum, emptyTips, noticeTips, getOperationData, accSub} from '../../../libs/common';
    import modalOperationLog from '../../components/modal-operation-log';
    import tipsModal from '../../components/tips-modal';
    export default {
        components: { selectProductModal, modalContentLoading, modalOperationLog, tipsModal },
        props: {
            savePackReportModalTitle: {
                type: String
            },
            savePackReportModalState: {
                type: Boolean,
                default: false
            },
            savePackReportModalSaveLoading: {
                type: Boolean,
                default: false
            },
            savePackReportModalSubmitLoading: {
                type: Boolean,
                default: false
            },
            savePackReportModalSpinShow: {
                type: Boolean,
                default: false
            },
            detailData: {
                type: Object
            },
            remoteReporterList: {
                type: Array
            },
            defaultUser: {
                type: Object
            },
            tipsModalConfirmButtonLoading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            const validateDate = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateWorkshopId = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                tipsModalMessage: '',
                tipsModalState: false,
                operationData: [],
                activeTabPane: '0',
                confirmLoading: false,
                selectMaterialModalPageIndex: 1,
                selectMaterialPageTotal: 0,
                selectMaterialSpinShow: false,
                selectMaterielModalTableData: [],
                selectMaterialModalState: false,
                showModal: false,
                formValidate: {},
                ruleValidate: {
                    date: [{ required: true, validator: validateDate, trigger: 'change' }],
                    workshopId: [{ required: true, validator: validateWorkshopId, trigger: 'change' }]
                },
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 90,
                        sortable: true,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'
                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            this.reduceTableButtonEvent(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
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
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.reportQty,
                                        min: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.reportQty = e;
                                            this.formValidate.packReportDetailList[params.index] = params.row;
                                            this.calculationTotalReport();
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '包装人',
                        key: 'reporterId',
                        minWidth: 160,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex',
                                    paddingTop: '2px'
                                }
                            }, [
                                h('Select', {
                                    props: {
                                        value: params.row.reporterId,
                                        clearable: true,
                                        icon: 'ios-search',
                                        filterable: true,
                                        transfer: true,
                                        remote: true,
                                        labelInValue: true,
                                        placeholder: '请输入员工姓名',
                                        remoteMethod: (e) => {
                                            this.onQueryChangeEvent(e, params);
                                        }
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e) {
                                                params.row.reporterId = e.value;
                                                params.row.reporterName = e.label;
                                            } else {
                                                params.row.reporterId = null;
                                                params.row.reporterName = '';
                                            };
                                            this.formValidate.packReportDetailList[params.index] = params.row;
                                        }
                                    }
                                }, params.row.reporterList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.id,
                                            label: item.name
                                        }
                                    });
                                }))
                            ]);
                        }
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
            tipsModalConfirmEvent () {
                this.$emit('save-and-submit-event', this.formValidate);
                this.tipsModalState = false;
            },
            tipsModalCancelEvent () {
                this.tipsModalState = false;
            },
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
            selectMaterialModalSearchEvent (e) {
                this.selectMaterialPageTotal = 1;
                this.getOrderListHttp(1, setPage.pageSize, e.name, e.orderCode);
            },
            getSelectWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            onQueryChangeEvent (e, params) {
                if (e !== '') {
                    setTimeout(() => {
                        let productItem = {};
                        params.row.reporterList = params.row.remoteReporterList.filter((item) => {
                            if (item.name.indexOf(e) > -1) {
                                productItem = item;
                            };
                            return productItem;
                        });
                        this.formValidate.packReportDetailList[params.index] = params.row;
                    }, 200);
                } else {
                    params.row.reporterList = [];
                }
            },
            // 添加产品的按钮事件
            addMaterialEvent () {
                this.selectMaterialSpinShow = true;
                this.selectMaterialModalState = true;
                this.getOrderListHttp();
            },
            // 获取订单列表数据
            getOrderListHttp (pageIndex = 1, pageSize = setPage.pageSize, product = '', orderCode = '') {
                this.$call('prd.order.list2', {
                    auditState: 3,
                    workshopId: this.formValidate.workshopId,
                    pageSize: pageSize,
                    pageIndex: pageIndex,
                    product: product,
                    code: orderCode
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.forEach((allItem) => {
                            // 未完工数量 = 生产数量 - 完工数量
                            if (!allItem.completionQty) allItem.completionQty = 0;
                            allItem.unCompletionQty = accSub(allItem.productionQty, allItem.completionQty);
                            allItem.prdOrderId = allItem.id;
                            if (this.formValidate.packReportDetailList && this.formValidate.packReportDetailList.length !== 0) {
                                this.formValidate.packReportDetailList.forEach((selectItem) => {
                                    // 已选过的禁用+勾选图标
                                    if (allItem.id === selectItem.prdOrderId) {
                                        allItem._checked = true;
                                        allItem._disabled = true;
                                    };
                                });
                            };
                        });
                        this.selectMaterialPageTotal = res.data.count;
                        this.selectMaterielModalTableData = responseData;
                        this.selectMaterialSpinShow = false;
                    };
                });
            },
            // 选择产品的modal分页事件
            selectMaterialModalChangePageEvent (e) {
                this.getOrderListHttp(e.pageIndex, setPage.pageSize, e.name, e.orderCode);
                this.selectMaterialModalPageIndex = e.pageIndex;
            },
            // 选择产品的modal确认事件
            selectMaterialModalConfirmEvent (checkRow) {
                this.confirmLoading = true;
                if (checkRow && checkRow.length !== 0) {
                    checkRow.forEach((checkItem) => {
                        // 添加没有选过
                        if (!checkItem._checked) {
                            this.$set(checkItem, 'remoteReporterList', this.remoteReporterList);
                            this.$set(checkItem, 'prdOrderId', checkItem.id);
                            this.$set(checkItem, 'prdOrderCode', checkItem.code);
                            checkItem.reportQty = null;
                            checkItem.reporterList = [];
                            this.$set(checkItem, 'reporterId', this.defaultUser.id);
                            this.$set(checkItem, 'reporterName', this.defaultUser.name);
                            this.$delete(checkItem, 'id');
                            this.formValidate.packReportDetailList.push(checkItem);
                        };
                    });
                    this.selectMaterialModalState = false;
                };
                this.confirmLoading = false;
            },
            // 监听选择产品的modal事件
            selectMaterialModalVisibleChangeEvent (e) {
                this.selectMaterialModalState = e;
                if (e === false) {
                    // this.confirmLoading = false;
                };
            },
            // 保存并提交的时间
            saveAndSubmitEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if (this.formValidate.packReportDetailList && this.formValidate.packReportDetailList.length !== 0) {
                            let isEmpty = false;
                            let reportQtyOverflow = false;
                            // 判断报工产量和包装人是否为空
                            this.formValidate.packReportDetailList.forEach((item) => {
                                if (item.reportQty === '' || item.reportQty === null || !item.reporterId) { isEmpty = true; };
                                // 判断报工产量大于未完工数量时，抛出提示
                                if (item.reportQty > item.unCompletionQty) { reportQtyOverflow = true; };
                            });
                            if (!isEmpty) {
                                if (reportQtyOverflow) { // 报工产量超出时
                                    this.tipsModalMessage = '报工产量超出未完成数量, 继续保存?';
                                    this.tipsModalState = true;
                                } else {
                                    this.$emit('save-and-submit-event', this.formValidate);
                                };
                            } else {
                                emptyTips(this, '报工产量或包装人不能为空!');
                            };
                        } else {
                            emptyTips(this, '产品不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            // 保存事件
            saveEvent () {
                this.$emit('save-event', this.formValidate);
            },
            // 取消按钮事件
            saveModalCancelEvent () {
                this.$emit('cancel-event');
            },
            // 监听modal
            savePackReportModalStateChangeEvent (e) {
                if (e) {
                    this.$refs['formValidate'].resetFields();
                } else {
                    this.$refs['formValidate'].resetFields();
                    this.formValidate = {};
                    this.activeTabPane = '0';
                };
                this.$emit('on-visible-change', e);
            },
            reduceTableButtonEvent (rowIndex) {
                if (this.formValidate.packReportDetailList.length > 1) {
                    this.formValidate.packReportDetailList.splice(rowIndex, 1);
                };
                this.calculationTotalReport();
            }
        },
        watch: {
            savePackReportModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            detailData: {
                handler (newVal, oldVal) {
                    if (newVal.formActionList) {
                        this.operationData = getOperationData(newVal);
                    };
                    this.formValidate = newVal;
                },
                deep: true
            }
        }
    };
</script>

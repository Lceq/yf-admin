<template>
    <div>
        <Modal
                v-model="showModal"
                title="入库申请详情"
                @on-visible-change="detailModalVisibleChangeEvent"
                :width="1600"
                :mask-closable="false"
                :styles="{top: '50px'}"
        >
            <modal-content-loading :spinShow="detailModalSpinShow"></modal-content-loading>
            <Form :label-width="100" :show-message="false">
                <Row>
                    <Col span="6">
                        <FormItem label="申请单号：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.code}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="申请日期：" prop="date" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="班次：" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.shiftName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="打包工：" class="formItemMargin">
                            <div class="read-only-item">{{ formValidate.packerNames }}</div>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="备注：" class="formItemMargin">
                            <Input readonly v-model="formValidate.remarks" type="textarea" :autosize="{ minRows: 1, maxRows: 1 }" placeholder="请输入..." :maxlength="100"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="6">
                        <FormItem label="入库状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.inStockStateName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="入库时间：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.inStockTime}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="是否被引用：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.isQuote ? '是' : '否'}}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="单据状态：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="activeTabPane">
                    <TabPane label="基本信息" name="0">
                        <Table :height="500" border size="small" :columns="tableHeader" :data="tableData"></Table>
                        <div class="flex-right">
                            <div class="flex-right">
                                <p class="line-height-30">合计：</p>
                                <div class="flex-left">
                                    <p class="total-packer-item line-height-30">{{formValidate.totalNumber}}</p>
                                    <p class="total-empty-item line-height-30"></p>
                                    <p class="total-qty-item line-height-30">{{formValidate.totalQty}}</p>
                                    <p class="total-remark-item line-height-30"></p>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane label="其他信息" name="1">
                        <operation-log :operationData="operationData"></operation-log>
                    </TabPane>
                </Tabs>
            </Form>
            <div slot="footer" class="endFlex">
                <Button type="error" @click="detailModalCancelEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../components/modal-footer';
    import { getOperationData } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import operationLog from '../../components/operation-log';
    export default {
        components: { modalFooter, modalContentLoading, operationLog },
        props: {
            detailModalSpinShow: {
                type: Boolean
            },
            detailModalData: {
                type: Object
            },
            detailModalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                operationData: [],
                activeTabPane: '0',
                remoteProductList: [],
                showModal: false,
                formValidate: {},
                tableHeader: [
                    {title: '序号', type: 'index', width: 80, align: 'center'},
                    {
                        title: '产品',
                        key: 'productCode',
                        minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '原料成分', key: 'componentName', minWidth: 90},
                    {title: '原料配比', key: 'materialRatio', minWidth: 90},
                    {title: '是否可回用',
                        key: 'isReused',
                        minWidth: 90,
                        render: (h, params) => {
                            let isReStr;
                            switch (params.row.isReused) {
                                case true:
                                    isReStr = '是';
                                    break;
                                case false:
                                    isReStr = '否';
                                    break;
                                default:
                                    isReStr = '';
                            };
                            return h('div', {
                                domProps: { innerHTML: isReStr }
                            });
                        }
                    },
                    {title: '规格', align: 'center', key: 'productModels', minWidth: 100},
                    {title: '生产工序', key: 'processName', align: 'center', minWidth: 90},
                    {
                        title: '单位',
                        key: 'unitName',
                        align: 'center',
                        minWidth: 90,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '批号', key: 'batchCode', align: 'center', minWidth: 110},
                    {title: '申请入库包数', key: 'packNumber', align: 'right', width: 120},
                    {title: '平均包重', key: 'packetWeight', width: 120},
                    {title: '申请入库重量', key: 'qty', align: 'right', width: 120},
                    {title: '备注', key: 'remarks', align: 'center', width: 150}
                ],
                tableData: []
            };
        },
        methods: {
            detailModalCancelEvent () {
                this.$emit('detailModalCancelEvent');
            },
            detailModalVisibleChangeEvent (e) {
                if (e === false) {
                    this.activeTabPane = '0';
                };
                this.$emit('detailModalVisibleChangeEvent', e);
            }
        },
        watch: {
            detailModalState (newData, oldData) {
                this.showModal = newData;
            },
            detailModalData (newData, oldData) {
                this.formValidate = newData;
                newData.packerNames && newData.packerNames.length !== 0 ? newData.packerNames = newData.packerNames.join(',') : newData.packerNames = '';
                this.operationData = getOperationData(newData);
                this.tableData = newData.inStockApplyDetailList;
            }
        }
    };
</script>
<style scoped lang="less">
    @width_total: 120px;
    .line-height-30 {
        line-height: 30px;
    }
    .total-packer-item {
        width: @width_total;
        border: solid 1px #dcdee2;
        border-top: none;
        text-align: right;
        border-right: none;
        padding: 0 4px;overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .total-empty-item {
        width: @width_total;
        border: solid 1px #dcdee2;
        border-top: none;
        text-align: right;
        border-right: none;
    }
    .total-qty-item {
        width: @width_total;
        border: solid 1px #dcdee2;
        border-top: none;
        text-align: right;
        border-right: none;
        padding: 0 4px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .total-remark-item {
        width: 150px;
        border: solid 1px #dcdee2;
        border-top: none;
        text-align: right;
    }
</style>

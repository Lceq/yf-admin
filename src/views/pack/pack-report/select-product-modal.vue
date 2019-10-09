<template>
    <div>
        <Modal
            v-model="showModal"
            title="选择产品"
            :mask-closable="false"
            @on-visible-change="selectMaterialModalStateChangeEvent"
            width="1310"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectMaterialConfirmEvent" :loading="confirmLoading">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Input type="text" v-model="queryBarOrderCode" class="modal-input-length queryBarMarginRight" placeholder="请输入订单编号"/>
                    <Input type="text" v-model="queryBarName" class="modal-input-length queryBarMarginRight" placeholder="请输入产品编号或名称"/>
                    <Button icon="ios-search" type="primary" @click="selectMaterialModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table @on-selection-change="getCheckRowChangeEvent" :columns="tableHeader" :data="selectMaterielModalTableData" :height="620" size="small" border></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="selectMaterialPageTotal" size="small" @on-change="getSelectMaterialModalPageCodeEvent"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage, accSub } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: {
            modalContentLoading
        },
        props: {
            confirmLoading: {
                type: Boolean,
                default: false
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            selectMaterialModalState: {
                type: Boolean,
                default: false
            },
            selectMaterielModalTableData: {
                type: Array
            },
            selectMaterialPageTotal: {
                type: Number
            }
        },
        data () {
            return {
                pageSize: setPage.pageSize,
                pageCount: null,
                checkRow: [],
                showModal: false,
                queryBarName: '',
                queryBarOrderCode: '',
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '生产订单号',
                        key: 'code',
                        align: 'left',
                        minWidth: 110
                    },
                    {
                        title: '产品',
                        key: 'productCode',
                        align: 'left',
                        minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productCode ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '规格型号',
                        key: 'productModels',
                        align: 'left',
                        minWidth: 130
                    },
                    {
                        title: '生产工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '生产数量',
                        key: 'productionQty',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '完成数量',
                        key: 'completionQty',
                        align: 'center',
                        minWidth: 106
                    },
                    {
                        title: '未完成数量',
                        key: 'unCompletionQty',
                        align: 'center',
                        minWidth: 106
                    },
                    {
                        title: '交货结束时间',
                        key: 'deliveryDateTo',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '计量单位',
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
                    }
                ]
            };
        },
        methods: {
            getSelectMaterialModalPageCodeEvent (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.queryBarOrderCode = clearSpace(this.queryBarOrderCode);
                this.$emit('on-change-page', {pageIndex: e, name: this.queryBarName, orderCode: this.queryBarOrderCode});
            },
            // 搜索按钮的点击事件
            selectMaterialModalSearchBtnEvent () {
                this.queryBarName = clearSpace(this.queryBarName);
                this.queryBarOrderCode = clearSpace(this.queryBarOrderCode);
                this.$emit('select-material-modal-search-event', {name: this.queryBarName, orderCode: this.queryBarOrderCode});
            },
            // 勾选事件
            getCheckRowChangeEvent (e) {
                this.checkRow = e;
            },
            // 确认选择事件
            selectMaterialConfirmEvent () {
                if (this.checkRow && this.checkRow.length !== 0) {
                    this.$emit('confirm-event', this.checkRow);
                } else {
                    this.$Message.warning('请选择产品!');
                };
            },
            selectMaterialModalStateChangeEvent (e) {
                if (e === false) {
                    this.queryBarName = '';
                    this.queryBarOrderCode = '';
                    this.checkRow = [];
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            selectMaterialModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

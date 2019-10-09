<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择配棉产品"
                :mask-closable="false"
                @on-visible-change="selectCottonBlendModalStateChange"
                width="900"
        >
            <modal-content-loading
                    :spinShow="selectCottonBlendModalSpinShow"
            ></modal-content-loading>
            <Row>
                <Col span="12">
                    <Button type="success" @click="selectCottonBlendConfirmEvent" class="margin-bottom-10">确认选择</Button>
                </Col>
                <Col span="12" class="flex-between-center">
                    <Input v-model="product" placeholder="请输入产品编号或名称" class="queryBarMarginRight"/>
                    <Input v-model="batchCode" placeholder="请输入批号" class="queryBarMarginRight"/>
                    <Button icon="ios-search" type="primary" @click="searchEvent">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table highlight-row :height="600" @on-row-click="getCheckEvent" @on-row-dblclick="getDblclickEvent" size="small" border :columns="isPremix?isPremixTableHeader:noPremixTableHeader" :data="selectCottonBlendModalTableData"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <!--<Page show-total :page-size="pageSize" :total="selectCottonBlendPageTotal" size="small" @on-change="getPageCodeEvent"></Page>-->
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    import { accSub, noticeTips, setPage, clearSpace } from '../../../libs/common';
    import moreOrder from './more-order.vue';
    export default {
        components: { modalContentLoading, moreOrder },
        props: {
            selectCottonBlendPageTotal: {
                type: Number
            },
            selectCottonBlendModalState: {
                type: Boolean,
                default: false
            },
            selectCottonBlendModalSpinShow: {
                type: Boolean,
                default: false
            },
            selectCottonBlendModalTableData: {
                type: Array
            },
            isPremix: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                product: '',
                batchCode: '',
                pageSize: setPage.pageSize,
                checkObj: {},
                showModal: false,
                noPremixTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '产品编号',
                        key: 'productCode',
                        minWidth: 120
                    },
                    {
                        title: '产品名称',
                        key: 'productName',
                        minWidth: 100
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        minWidth: 100
                    },
                    {
                        title: '生产单号',
                        key: 'prdOrderCodes',
                        align: 'left',
                        minWidth: 120,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: params.row.prdOrderCodes
                                }
                            });
                        }
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unitName',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitCode}(${params.row.unitName})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '需求数量',
                        key: 'demandQty',
                        align: 'right',
                        minWidth: 100
                    }
                ],
                isPremixTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '产品编号',
                        key: 'code',
                        minWidth: 120
                    },
                    {
                        title: '产品名称',
                        key: 'name',
                        minWidth: 100
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        minWidth: 100
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 120
                    },
                    {
                        title: '单位',
                        key: 'unitName',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitCode}(${params.row.unitName})` : ''
                                }
                            });
                        }
                    }
                ],
                tableData: []
            };
        },
        methods: {
            searchEvent () {
                this.product = clearSpace(this.product);
                this.batchCode = clearSpace(this.batchCode);
                this.$emit('search-button-event', { product: this.product, batchCode: this.batchCode });
            },
            // 获取页码
            getPageCodeEvent (pageIndex) {
                this.product = clearSpace(this.product);
                this.batchCode = clearSpace(this.batchCode);
                this.$emit('page-change-event', { pageIndex: pageIndex, product: this.product, batchCode: this.batchCode });
            },
            getCheckEvent (e) {
                this.checkObj = e;
            },
            selectCottonBlendConfirmEvent () {
                if (Object.keys(this.checkObj).length !== 0) {
                    this.$emit('confirm-event', this.checkObj);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            getDblclickEvent (e) {
                this.checkObj = e;
                this.$emit('confirm-event', this.checkObj);
            },
            selectCottonBlendModalStateChange (e) {
                if (e === false) {
                    this.checkObj = {};
                    this.product = '';
                    this.batchCode = '';
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            selectCottonBlendModalState (newVal, oldVal) {
                this.showModal = newVal;
            }
        }
    };
</script>

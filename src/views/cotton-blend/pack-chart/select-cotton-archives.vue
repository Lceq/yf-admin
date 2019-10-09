<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择配棉原料"
                :mask-closable="false"
                @on-visible-change="selectCottonMaterialModalStateChange"
                width="1000"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectCottonMaterialModalConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Input type="text" v-model="queryBarName" class="modal-input-length queryBarMarginRight" placeholder="请输入版本号"/>
                    <Button icon="ios-search" type="primary" @click="selectCottonMaterialModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table :loading="selectCottonMaterialModalTableLoading" highlight-row @on-row-dblclick="doubleClickRowEvent" @on-row-click="clickRowEvent" :height="600" size="small" border :columns="tableHeader" :data="selectCottonMaterialModalTableData"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="selectCottonMaterialModalPageTotal" size="small" @on-change="selectCottonMaterialModalPageCodeChange"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage } from '../../../libs/common';
    import moreOrder from '../archives/more-order';
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: { modalContentLoading, moreOrder },
        props: {
            spinShow: {
                type: Boolean,
                default: false
            },
            selectCottonMaterialState: {
                type: Boolean,
                default: false
            },
            selectCottonMaterialModalTableData: {
                type: Array
            },
            selectCottonMaterialModalPageTotal: {
                type: Number
            },
            selectCottonMaterialModalTableLoading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pageSize: setPage.pageSize,
                pageCount: null,
                selectRow: null,
                showModal: false,
                queryBarName: '',
                tableHeader: [
                    /*{
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'center'
                    },*/
                    {
                        title: '配棉日期',
                        key: 'date',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '配棉版本号',
                        key: 'versionNumber',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                    {
                        title: '生产批号',
                        key: 'batchCode',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                   /* {
                        title: '生产单号',
                        key: 'prdOrderCodes',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: typeof params.row.prdOrderCodes === 'string' ? JSON.parse(params.row.prdOrderCodes) : params.row.prdOrderCodes
                                }
                            });
                        }
                    },*/
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '产品数量',
                        key: 'blendingQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '原棉包数',
                        key: 'packetQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '原棉数量',
                        key: 'weightQty',
                        align: 'right',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    }
                ],
            };
        },
        methods: {
            selectCottonMaterialModalPageCodeChange (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('on-change-page', {pageIndex: e, name: this.queryBarName});
            },
            // 搜索按钮的点击事件
            selectCottonMaterialModalSearchBtnEvent () {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('on-search-event', {name: this.queryBarName});
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
                this.$emit('on-confirm', this.selectRow);
            },
            // 单击
            clickRowEvent (e) {
                this.selectRow = e;
            },
            // 确认选择事件
            selectCottonMaterialModalConfirmEvent () {
                if (this.selectRow !== null) {
                    this.$emit('on-confirm', this.selectRow);
                } else {
                    this.$Message.warning('请选择产品!');
                };
            },
            selectCottonMaterialModalStateChange (e) {
                if (e === false) {
                    this.queryBarName = '';
                    this.selectRow = null;
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            selectCottonMaterialState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

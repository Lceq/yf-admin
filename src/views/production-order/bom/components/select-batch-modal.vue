<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择批号"
                :mask-closable="false"
                @on-visible-change="selectBatchModalStateChangeEvent"
                width="1000"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectBatchModalConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Input type="text" v-model="queryBarName" class="modal-input-length queryBarMarginRight" placeholder="请输入批号"/>
                    <Button icon="ios-search" type="primary" @click="selectBatchModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table :loading="selectBatchTableLoading" highlight-row @on-row-dblclick="doubleClickRowEvent" @on-row-click="clickRowEvent" :height="630" size="small" border :columns="tableHeader" :data="selectBatchModalTableData"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="selectBatchPageTotal" size="small" @on-change="getSelectBatchModalPageCodeEvent"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage, toTree } from '../../../../libs/common';
    import modalContentLoading from '../../../components/modal-content-loading';
    export default {
        components: {
            modalContentLoading
        },
        props: {
            spinShow: {
                type: Boolean,
                default: false
            },
            selectBatchModalState: {
                type: Boolean,
                default: false
            },
            selectBatchModalTableData: {
                type: Array
            },
            selectBatchPageTotal: {
                type: Number
            },
            selectBatchTableLoading: {
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
                    {
                        title: '批号',
                        key: 'batchCode',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: '批号日期',
                        minWidth: 130,
                        key: 'batchDate',
                        align: 'center'
                    },
                    {
                        title: '物料编码',
                        key: 'productCode',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        minWidth: 130,
                        align: 'center'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 130,
                        align: 'center'
                    },
                    {
                        title: '审核状态',
                        key: 'auditStateName',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '批号状态',
                        key: 'batchStateName',
                        minWidth: 90,
                        align: 'center'
                    },
                    {
                        title: '创建人',
                        minWidth: 90,
                        key: 'createName',
                        align: 'center'
                    }
                ]
            };
        },
        methods: {
            getSelectBatchModalPageCodeEvent (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('on-change-page', {pageIndex: e, name: this.queryBarName});
            },
            // 搜索按钮的点击事件
            selectBatchModalSearchBtnEvent () {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('select-batch-modal-search-event', {name: this.queryBarName});
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
                this.$emit('select-batch-modal-confirm-event', this.selectRow);
            },
            // 单击
            clickRowEvent (e) {
                this.selectRow = e;
            },
            // 选择产品分类事件
            getMaterialCategoryEvent (e) {
                this.queryBarName = clearSpace(this.queryBarName);
                this.$emit('getMaterialCategoryEvent', {name: this.queryBarName, categoryIdArr: e});
            },
            // 确认选择事件
            selectBatchModalConfirmEvent () {
                if (this.selectRow !== null) {
                    this.$emit('select-batch-modal-confirm-event', this.selectRow);
                } else {
                    this.$Message.warning('请选择批号!');
                };
            },
            selectBatchModalStateChangeEvent (e) {
                if (e === false) {
                    this.queryBarName = '';
                };
                this.$emit('on-visible-change', e);
            },
            getMaterialCategoryHttp () {
                this.$api.category.getProductCategoryList({}).then(res => {
                    let arr = toTree(res.data.res);
                    this.queryBarMaterialCategoryList = arr;
                });
            }
        },
        watch: {
            selectBatchModalState (newData, oldData) {
                this.showModal = newData;
            }
        },
        created () {
            // 获取产品类别的请求
            this.getMaterialCategoryHttp();
        }
    };
</script>

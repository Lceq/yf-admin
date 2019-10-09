<template>
    <div>
        <Modal
                v-model="showModal"
                :title="selectBillModalTitle"
                :mask-closable="false"
                @on-visible-change="selectBillModalStateChangeEvent"
                width="900"
        >
            <modal-content-loading
                    :spinShow="spinShow"
            ></modal-content-loading>
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectBillConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Input type="text" v-model="queryBarBillCodeValue" class="modal-input-length queryBarMarginRight" placeholder="请输入单据编号"/>
                    <Input v-if="selectBillModalShowMaterialInput" type="text" v-model="queryBarMaterialName" class="modal-input-length queryBarMarginRight" placeholder="请输入产品编号或名称"/>
                    <Button icon="ios-search" type="primary" @click="selectBillModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table :loading="selectBillTableLoading" highlight-row @on-row-dblclick="doubleClickRowEvent" @on-row-click="clickRowEvent" :columns="selectBillTableHeader" :data="selectBillModalTableData" :height="630" size="small" border></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="selectBillPageTotal" size="small" @on-change="getSelectBillModalPageCodeEvent"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage, emptyTips } from '../../libs/common';
    import modalContentLoading from '../components/modal-content-loading';
    export default {
        components: {
            modalContentLoading
        },
        props: {
            spinShow: {
                type: Boolean,
                default: false
            },
            selectBillModalState: {
                type: Boolean,
                default: false
            },
            selectBillModalTableData: {
                type: Array
            },
            selectBillPageTotal: {
                type: Number
            },
            selectBillTableLoading: {
                type: Boolean,
                default: false
            },
            selectBillModalTitle: {
                type: String
            },
            selectBillTableHeader: {
                type: Array
            },
            selectBillModalShowMaterialInput: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pageCount: null,
                selectRow: null,
                showModal: false,
                queryBarMaterialName: '',
                queryBarBillCodeValue: '',
                pageSize: setPage.pageSize
            };
        },
        methods: {
            getSelectBillModalPageCodeEvent (e) {
                this.$emit('on-change-page', e);
            },
            // 搜索按钮的点击事件
            selectBillModalSearchBtnEvent () {
                this.queryBarMaterialName = clearSpace(this.queryBarMaterialName);
                this.queryBarBillCodeValue = clearSpace(this.queryBarBillCodeValue);
                this.$emit('select-bill-modal-search-event', {materialName: this.queryBarMaterialName, code: this.queryBarBillCodeValue});
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
                this.$emit('confirm-event', this.selectRow);
            },
            // 单击
            clickRowEvent (e) {
                this.selectRow = e;
            },
            // 确认选择事件
            selectBillConfirmEvent () {
                if (this.selectRow !== null) {
                    this.$emit('confirm-event', this.selectRow);
                } else {
                    emptyTips(this, '请选择单据!');
                };
            },
            selectBillModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.queryBarBillCodeValue = '';
                    this.queryBarMaterialName = '';
                    this.selectRow = null;
                };
            }
        },
        watch: {
            selectBillModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

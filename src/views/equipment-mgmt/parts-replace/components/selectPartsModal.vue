<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择配件"
                :mask-closable="false"
                :width="800"
                @on-visible-change="selectPartsModalStateEvent"
        >
            <div>
                <Button type="success" :loading="selectPartsConfirmLoading" @click="confirm">确认选择</Button>
                <!--<Button @click="cancel">取消</Button>-->
            </div>
            <div class="tableMargin">
                <Table :loading="selectPartsTableLoading" :height="500" @on-row-click="singleClickPartsRowEvent" @on-row-dblclick="doubleClickPartsRowEvent" :row-class-name="rowClassNameEvent" highlight-row size="small" border :columns="selectPartsTableHeader" :data="selectPartsTableData"></Table>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    export default {
        props: {
            selectPartsConfirmLoading: {
                type: Boolean,
                default: false
            },
            selectPartsTableLoading: {
                type: Boolean,
                default: false
            },
            selectPartsModalState: {
                type: Boolean,
                default: false
            },
            selectPartsTableData: {
                type: Array
            },
            selectPartsTableHeader: {
                type: Array
            }
        },
        data () {
            return {
                showModal: false
            };
        },
        methods: {
            // 行样式
            rowClassNameEvent (row, index) {
                if (row.singleClickStyle !== undefined) {
                    if (row.singleClickStyle === true) {
                        return 'demo-table-info-row';
                    } else {
                        return 'demo-table-no-row';
                    };
                };
            },
            confirm () {
                this.$emit('confirm');
            },
            cancel () {
                this.$emit('cancel');
            },
            singleClickPartsRowEvent (e, index) {
                this.$emit('singleClickPartsRowEvent', e, index);
            },
            doubleClickPartsRowEvent (e, index) {
                this.$emit('doubleClickPartsRowEvent', e, index);
            },
            selectPartsModalStateEvent (e) {
                this.$emit('selectPartsModalStateEvent', e);
            }
        },
        watch: {
            selectPartsModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

<style>
    .ivu-table .demo-table-info-row td{
        background-color: #EBF7FF;
        color: red;
    }
    .ivu-table .demo-table-no-row td{
        color: #515a6e;
    }
</style>

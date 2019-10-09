<template>
    <div>
        <Modal
                v-model="modalState"
                title="配件信息"
                :mask-closable="false"
                :closable="true"
                width="1400"
                @on-visible-change="visibleChangeEvent"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Table :height="600" :loading="seePartsLoading" size="small" :columns="seePartsTableHeader" :data="seePartsTableData"></Table>
            <div slot="footer">
                <modal-footer
                        :showConfirmButton="false"
                        @saveModalCancelEvent="seePartsCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalContentLoading from '../../../components/modal-content-loading';
    import modalFooter from '../../../components/modal-footer';
    export default {
        components: { modalContentLoading, modalFooter },
        props: {
            seePartsModalState: {
                type: Boolean,
                default: false
            },
            seePartsLoading: {
                type: Boolean,
                default: false
            },
            seePartsTableData: {
                type: Array
            },
            spinShow: {
                type: false
            }
        },
        data () {
            return {
                modalState: false,
                seePartsTableHeader: [
                    {
                        title: '配件更换单号',
                        key: 'code',
                        minWidth: 126,
                        align: 'center',
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '单据状态',
                        key: 'auditStateName',
                        width: 106,
                        align: 'center',
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '配件编号',
                        key: 'productCode',
                        width: 126,
                        align: 'center',
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '配件名称',
                        key: 'productName',
                        width: 106,
                        align: 'center',
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '申请数量',
                        key: 'qty',
                        width: 106,
                        align: 'center',
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '设备编号',
                        key: 'machineCode',
                        width: 106,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '设备名称',
                        key: 'machineName',
                        width: 116,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '所属车间',
                        key: 'workshopName',
                        width: 106,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '所属工序',
                        key: 'processName',
                        width: 102,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '申请人',
                        key: 'createName',
                        width: 96,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '申请时间',
                        key: 'createTime',
                        width: 150,
                        align: 'center',
                        sortable: true
                    }
                ]
            };
        },
        methods: {
            seePartsCancelEvent () {
                this.$emit('seePartsCancelEvent');
            },
            visibleChangeEvent (e) {
                this.$emit('visibleChangeEvent', e);
            }
        },
        watch: {
            seePartsModalState (newData, oldData) {
                this.modalState = newData;
            }
        }
    };
</script>

<style>

</style>

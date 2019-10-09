<template>
    <div>
        <Modal
                v-model="showModal"
                title="产品对比色"
                :draggable="true"
                :mask-closable="false"
                @on-visible-change="contrastProductColorModalStateChangeEvent"
                width="250"
                :styles="{top: '0px'}"
                class-name="vertical-center-modal"
        >
            <Row class="contrast-color">
                <Col span="24">
                    <Table :columns="tableHeader" :data="contrastProductColorModalTableData" :max-height="630" size="small" border></Table>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    export default {
        props: {
            contrastProductColorModalState: {
                type: Boolean,
                default: false
            },
            contrastProductColorModalTableData: {
                type: Array
            }
        },
        data () {
            return {
                tableHeader: [
                    {
                        title: '产品',
                        key: 'productName',
                        align: 'left',
                        minWidth: 130,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                },
                                style: {
                                    paddingLeft: '4px'
                                }
                            });
                        }
                    },
                    {
                        title: '颜色',
                        key: 'workCenterName',
                        align: 'center',
                        width: 40,
                        render: (h, params) => {
                            return h('div', {
                                props: {
                                    productData: params.row.colorStyle
                                },
                                style: {
                                    width: '40px',
                                    height: '40px',
                                    background: params.row.colorStyle
                                }
                            });
                        }
                    }
                ],
                showModal: false
            };
        },
        methods: {
            contrastProductColorModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            contrastProductColorModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>
<style lang="less">
    .tableMargin .ivu-form-item-content {
        position: relative;
        line-height: 24px;
        font-size: 12px;
    }
    .tableMargin .ivu-table-small td {
        height: 30px;
    }
    .vertical-center-modal .ivu-modal{
        /*left: -760px;*/
    }
    .contrast-color {
        .ivu-table-cell {
            padding-left: 0px;
            padding-right: 0px;
        }
        .ivu-table-cell span{
            padding-left: 4px;
            padding-right: 0;
        }
    }
</style>


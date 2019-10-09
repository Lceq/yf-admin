<template>
    <div>
        <Modal
                v-model="showModal"
                :title="moreScheduleModalTitle"
                :mask-closable="false"
                @on-visible-change="moreScheduleModalChangeEvent"
                width="800"
        >
            <modal-content-loading
                    :spinShow="moreScheduleModalSpinShow"
            ></modal-content-loading>
            <!--<Row>
                <Col v-for="(item, index) in moreScheduleModalData" :key="index" span="4">
                    <div class="margin-bottom-10" style="text-align: center;">
                        <p>{{item.planDateTo}}</p>
                        <p>{{item.productName ? `${item.productName}(${item.productCode})` : ''}}</p>
                    </div>
                </Col>
            </Row>-->
            <Table :columns="moreScheduleModalTableHeader" :data="moreScheduleModalData" :height="650" size="small" border></Table>
            <div slot="footer">
                <Button type="error" @click="closeEvent">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    export default {
        components: { modalContentLoading },
        props: {
            moreScheduleModalState: {
                type: Boolean,
                default: false
            },
            moreScheduleModalSpinShow: {
                type: Boolean,
                default: false
            },
            moreScheduleModalData: {
                type: Array
            },
            moreScheduleModalTitle: {
                type: String
            }
        },
        data () {
            return {
                showModal: false,
                moreScheduleModalTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '排产产品',
                        key: 'productName',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '预计开台时间',
                        key: 'planDateFrom',
                        align: 'center'
                    },
                    {
                        title: '预计了机时间',
                        key: 'planDateTo',
                        align: 'center'
                    }
                ]
            };
        },
        methods: {
            closeEvent () {
                this.$emit('close-modal-event');
            },
            moreScheduleModalChangeEvent (e) {
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            moreScheduleModalState (newVal, oldVal) {
                this.showModal = newVal;
            }
        }
    };
</script>

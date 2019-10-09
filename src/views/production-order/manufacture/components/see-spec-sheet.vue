<template>
    <div>
        <Modal
                v-model="showModal"
                title="工艺信息"
                :mask-closable="false"
                @on-visible-change="setProcessModalStateChangeEvent"
                width="800"
        >
            <modal-content-loading
                :spinShow="spinShow"
            ></modal-content-loading>
            <Form :label-width="90" :show-message="false">
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="设备机型:">
                            <div class="exhibitionInputBackground">{{specProductObj.machineModelName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="标准克重:">
                            <div class="exhibitionInputBackground">{{specProductObj.gramWeight}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="标准米长:">
                            <div class="exhibitionInputBackground">{{specProductObj.meters}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="台时单产:">
                            <div class="exhibitionInputBackground">{{specProductObj.hourYield}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="公定回潮率%:">
                            <div class="exhibitionInputBackground">{{specProductObj.moistureRegain}}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem class="formItemMargin" label="运转效率%:">
                            <div class="exhibitionInputBackground">{{specProductObj.efficiencyPercent}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <Table :height="550" size="small" border :columns="tableHeader" :data="specProductObj.specSheetParamList"></Table>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="error" @click="setProcessModalCancelEvent">关闭</Button>
                <!--<modal-footer
                        :buttonLoading="setProcessModalBtnLoading"
                        @saveModalConfirmEvent="setProcessModalConfirmEvent"
                        @saveModalCancelEvent="setProcessModalCancelEvent"
                ></modal-footer>-->
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../../../components/modal-footer';
    import modalContentLoading from '../../../components/modal-content-loading';
    export default {
        components: { modalContentLoading, modalFooter },
        props: {
            spinShow: {
                type: Boolean
            },
            setProcessModalState: {
                type: Boolean
            },
            setProcessModalBtnLoading: {
                type: Boolean
            },
            specProductObj: {
                type: Object
            }
        },
        data () {
            return {
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '工艺项目',
                        key: 'specParamName',
                        align: 'center'
                    },
                    {
                        title: '项目类型',
                        key: 'paramType',
                        align: 'center'
                    },
                    {
                        title: '设计工艺',
                        key: 'val',
                        align: 'center'
                    },
                    {
                        title: '数据类型',
                        key: 'dataTypeName'
                    },
                    {
                        title: '是否翻改项目',
                        key: 'isBusiName',
                        align: 'center'
                    }
                ],
                showModal: false,
                formValidate: {},
                machineModelList: []
            };
        },
        methods: {
            setProcessModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
            },
            setProcessModalConfirmEvent () {
                this.$emit('see-process-modal-confirm-event');
            },
            setProcessModalCancelEvent () {
                this.$emit('see-process-modal-cancel-event');
            }
        },
        watch: {
            setProcessModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

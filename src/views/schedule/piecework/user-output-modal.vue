<template>
    <div>
        <Modal
                v-model="showModal"
                title="人员品种产量"
                :mask-closable="false"
                @on-visible-change="userOutputModalStateChangeEvent"
                width="1000"
        >
            <modal-content-loading
                :spinShow="userOutputModalShow"
            ></modal-content-loading>
            <Form :label-width="90">
                <Row>
                    <Col span="8">
                        <FormItem label="用户名：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ userOutputModalData.userName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="岗位：" prop="passwdCheck" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ userOutputModalData.postName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="品种：" prop="age" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ userOutputModalData.productName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="班次：" prop="age" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ userOutputModalData.shiftName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="班组：" prop="age" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ userOutputModalData.groupName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="计件总产量：" prop="age" class="formItemMargin">
                            <InputNumber v-model="userOutputModalData.output" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span="24">
                    <Table highlight-row @on-row-dblclick="doubleClickRowEvent" :height="600" size="small" border :columns="tableHeader" :data="userOutputModalTableData"></Table>
                </Col>
            </Row>
            <div slot="footer">
                <modal-footer
                        :isDisableConfirm="userOutputDisableConfirmButton"
                        :buttonLoading="userOutputModalConfirmLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import modalFooter from '../../components/modal-footer';
    export default {
        components: {
            modalContentLoading, modalFooter
        },
        props: {
            userOutputDisableConfirmButton: {
                type: Boolean,
                default: false
            },
            userOutputModalConfirmLoading: {
                type: Boolean,
                default: false
            },
            userOutputModalShow: {
                type: Boolean,
                default: false
            },
            userOutputModalState: {
                type: Boolean,
                default: false
            },
            userOutputModalDetailData: {
                type: Object
            }
        },
        data () {
            return {
                userOutputModalTableData: [],
                userOutputModalData: {},
                pageCount: null,
                selectRow: null,
                showModal: false,
                tableHeader: [
                    {
                        title: '机台编码',
                        sortable: true,
                        key: 'machineCode',
                        minWidth: 130
                    },
                    {
                        title: '产量(系统)',
                        sortable: true,
                        key: 'computeOutput',
                        minWidth: 130
                    },
                    // --不展示--
                    /*{
                        title: '克重',
                        sortable: true,
                        key: 'gramWeight',
                        minWidth: 100
                    },
                    {
                        title: '米长',
                        sortable: true,
                        key: 'metres',
                        minWidth: 100
                    },
                    {
                        title: '系数',
                        sortable: true,
                        key: 'outputRatio',
                        minWidth: 100
                    },
                    {
                        title: '运转效率',
                        sortable: true,
                        key: 'efficiencyPercent',
                        minWidth: 100
                    },
                    {
                        title: '锭数',
                        sortable: true,
                        key: 'openSpinCount',
                        minWidth: 100
                    },
                    {
                        title: '损耗率',
                        sortable: true,
                        key: 'wasteRate',
                        minWidth: 100
                    },*/
                    // ---end----
                    {
                        title: '运行效率%',
                        sortable: true,
                        key: 'efficiencyPercent',
                        minWidth: 120
                    },
                    {
                        title: '米数',
                        sortable: true,
                        key: 'output',
                        minWidth: 120,
                        render: (h, params) => {
                            return h('inputNumber', {
                                props: {
                                    value: params.row.output,
                                    min: 0,
                                    max: 999999999
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (e) => {
                                        e ? params.row.output = e : params.row.output = 0;
                                        this.userOutputModalTableData[params.index] = params.row;
                                        if (params.row.gramWeight && params.row.metres) {
                                            // 是单锭产量时, 班次产量（kg）= 米数 *（定量/定长）/1000
                                            if (params.row.isSpinOutput) {
                                                // 定量/定长
                                                let num1 = mathJsDiv(params.row.gramWeight, params.row.metres);
                                                // 米数 * （定量/定长）
                                                let num2 = mathJsMul(params.row.output, num1);
                                                // /1000
                                                params.row.outputKg = mathJsDiv(num2, 1000);
                                                this.calculationOutputMethods();
                                            } else {
                                                // 是单锭产量时, 班次产量（kg）= 米数
                                                params.row.outputKg = parseFloat(params.row.output);
                                                this.calculationOutputMethods();
                                            };
                                        };
                                        this.userOutputModalTableData[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '产量(公斤)',
                        sortable: true,
                        key: 'outputKg',
                        minWidth: 120
                    }
                ]
            };
        },
        methods: {
            // 计算产量方法
            calculationOutputMethods () {
                let totalOutput = 0;
                let totalOutputKG = 0;
                this.userOutputModalTableData.forEach(item => {
                    if (item.gramWeight && item.metres) {
                        // 计算：班次产量（kg）=（定量 / 定长）* 班次产量
                        totalOutputKG = mathJsAdd(item.outputKg, totalOutputKG);
                        totalOutput = mathJsAdd(item.output, totalOutput);
                    };
                });
                this.userOutputModalData.outputKg = totalOutputKG;
                this.userOutputModalData.output = totalOutput;
            },
            saveModalConfirmEvent () {
                let params = {
                    ...this.userOutputModalData,
                    outputUserMachineList: this.userOutputModalTableData
                };
                this.$emit('confirm-event', params);
            },
            saveModalCancelEvent () {
                this.$emit('cancel-event');
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
            },
            userOutputModalStateChangeEvent (e) {
                if (e === false) { this.selectRow = null; };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            userOutputModalState (newData, oldData) {
                this.showModal = newData;
            },
            userOutputModalDetailData: {
                handler (newVal, oldVal) {
                    this.userOutputModalData = newVal;
                    this.userOutputModalTableData = newVal.outputUserMachineList;
                },
                deep: true
            }
        }
    };
</script>

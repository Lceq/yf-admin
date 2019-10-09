<template>
    <div>
        <Modal
                v-model="showModal"
                title="计件产量"
                :mask-closable="false"
                @on-visible-change="pieceWorkOutputModalStateChangeEvent"
                width="1200"
        >
            <modal-content-loading
                :spinShow="pieceWorkOutputModalShow"
            ></modal-content-loading>
            <Form ref="pieceWorkObj" :model="pieceWorkObj" :label-width="80" :show-message="false">
                <Row>
                    <Col span="6">
                        <FormItem label="日期：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ pieceWorkObj.belongDate }}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="生产车间：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ pieceWorkObj.workshopName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="班制：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ pieceWorkObj.shiftTypeName }}</div>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="核算人：" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{ pieceWorkObj.createName }}</div>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span="24">
                    <Table :stripe="false" highlight-row @on-row-dblclick="doubleClickRowEvent" :height="680" size="small" border :columns="tableHeader" :data="pieceWorkOutputModalTableData"></Table>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
        <user-output-modal
                :userOutputDisableConfirmButton="pieceWorkObj.auditState===3?true:false"
                :userOutputModalState="userOutputModalState"
                :userOutputModalConfirmLoading="userOutputModalConfirmLoading"
                :userOutputModalShow="userOutputModalShow"
                :userOutputModalDetailData="userOutputModalDetailData"
                @on-visible-change="userOutputModalStateChangeEvent"
                @confirm-event="userOutputModalConfirmEvent"
                @cancel-event="userOutputModalCancelEvent"
        ></user-output-modal>
    </div>
</template>

<script>
    import { clearSpace, setPage, noticeTips } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import userOutputModal from './user-output-modal';
    export default {
        components: {
            modalContentLoading, userOutputModal
        },
        props: {
            pieceWorkDetailData: {
                type: Object
            },
            pieceWorkOutputModalShow: {
                type: Boolean,
                default: false
            },
            pieceWorkOutputModalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                userOutputModalConfirmLoading: false,
                userOutputModalShow: false,
                userOutputModalDetailData: {},
                pieceWorkObj: {},
                userOutputModalState: false,
                pageCount: null,
                selectRow: null,
                showModal: false,
                tableHeader: [
                    {
                        key: 'userName',
                        align: 'left',
                        width: 80,
                        sortable: true,
                        title: '人员'
                    },
                    {
                        key: 'shiftName',
                        align: 'left',
                        width: 80,
                        sortable: true,
                        title: '班次'
                    },
                    {
                        key: 'groupName',
                        align: 'left',
                        width: 100,
                        sortable: true,
                        title: '班组'
                    },
                    {
                        key: 'postName',
                        align: 'left',
                        minWidth: 100,
                        sortable: true,
                        title: '岗位'
                    },
                    {
                        key: 'productName',
                        align: 'left',
                        minWidth: 200,
                        sortable: true,
                        title: '产品',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        key: 'computeOutput',
                        align: 'right',
                        minWidth: 116,
                        sortable: true,
                        title: '计件产量(系统)'
                    },
                    {
                        key: 'output',
                        align: 'right',
                        minWidth: 150,
                        sortable: true,
                        title: '计件产量'
                    },
                    {
                        key: 'outputKg',
                        align: 'right',
                        minWidth: 150,
                        sortable: true,
                        title: '计件产量(公斤)'
                    },
                    {
                        title: '详情',
                        align: 'center',
                        sortable: true,
                        width: 150,
                        render: (h, params) => {
                            return h('a', {
                                on: {
                                    'click': () => {
                                        this.doubleClickRowEvent(params.row);
                                    }
                                }
                            }, '详情');
                        }
                    }
                ],
                pieceWorkOutputModalTableData: []
            };
        },
        methods: {
            // 员工品种产量modal取消按钮事件
            userOutputModalConfirmEvent (e) {
                this.userOutputModalConfirmLoading = true;
                this.$call('output.user.saveOutputUser', e).then(res => {
                    if (res.data.status === 200) {
                        this.$emit('user-output-modal-confirm-event');
                        noticeTips(this, 'saveTips');
                        this.userOutputModalState = false;
                        this.userOutputModalConfirmLoading = false;
                    } else {
                        this.userOutputModalConfirmLoading = false;
                    };
                });
            },
            // 员工品种产量modal确认按钮事件
            userOutputModalCancelEvent () {
                this.userOutputModalState = false;
            },
            // 人员产量modal
            userOutputModalStateChangeEvent (e) {
                this.userOutputModalState = e;
            },
            // 双击
            doubleClickRowEvent (e) {
                this.selectRow = e;
                this.userOutputModalShow = true;
                this.userOutputModalState = true;
                // 获取员工品种产量
                this.$call('output.user.detail', {id: e.id}).then(res => {
                    if (res.data.status === 200) {
                        this.userOutputModalDetailData = res.data.res;
                        this.userOutputModalShow = false;
                    };
                });
            },
            pieceWorkOutputModalStateChangeEvent (e) {
                if (e === false) {
                    this.selectRow = null;
                };
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            pieceWorkOutputModalState (newData, oldData) {
                this.showModal = newData;
            },
            pieceWorkDetailData: {
                handler (newVal, oldVal) {
                    console.log('状态', newVal.auditState)
                    this.pieceWorkObj = newVal;
                    this.pieceWorkOutputModalTableData = newVal.outputUserList;
                },
                deep: true
            }
        }
    };
</script>

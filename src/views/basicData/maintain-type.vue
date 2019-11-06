<template>
    <card>
        <Row>
            <Col span="12" class="headerMargin">
                <Button icon="md-add" type="primary" @click="addMaintainEvent">新增</Button>
                <Button icon="ios-trash" type="error" @click="deleteMaintain">删除</Button>
            </Col>
        </Row>
        <Row class="margin-top-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData" @on-selection-change="getCheckObjEvent"></Table>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="saveModalState"
                        :title="saveModalTitle"
                        @on-visible-change="saveModalStateChangeEvent"
                        :maskClosable="false"
                >
                    <Form :label-width="110" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                        <Row>
                            <Col span="24">
                            <FormItem label="保养类型编码：" prop="maintainCodeIpt" class="formItemMargin">
                                <Input type="text" v-model="formValidate.maintainCodeIpt" placeholder="请输入保养类型编码"/>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="24">
                            <FormItem label="保养类型名称：" prop="maintainNameIpt" class="formItemMargin">
                                <Input type="text" v-model="formValidate.maintainNameIpt" placeholder="请输入保养类型名称"/>
                            </FormItem>
                            </Col>
                        </Row>
                        <Row v-show="showOther">
                            <Col>
                                <other-message
                                        :createName="createName"
                                        :createTime="createTime"
                                        :updateName="updateName"
                                        :updateTime="updateTime"
                                ></other-message>
                            </Col>
                        </Row>
                    </Form>
                    <div slot="footer">
                        <modal-footer
                            :buttonLoading="buttonLoading"
                            @saveModalConfirmEvent="confirmEvent"
                            @saveModalCancelEvent="cancelEvent"
                        ></modal-footer>
                    </div>
                </Modal>
            </Col>
        </Row>
        <Row>
            <tips-modal
                    :v-model="deleteModalStatus"
                    :tipMsg="deleteModalMsg"
                    :loading="deleteButtonLoading"
                    @cancel="deleteModalCancel"
                    @confirm="deleteModalConfirm"
            >
            </tips-modal>
        </Row>
    </card>
</template>
<script>
    import tipsModal from '../public/deleteWarning';
    import { compClientHeight, noticeTips } from '../../libs/common';
    import otherMessage from '../components/otherMessage';
    import modalFooter from '../components/modal-footer';
    export default {
        components: {
            tipsModal, otherMessage, modalFooter
        },
        data () {
            const validateCode = (rule, value, callback) => {
                if (!value) {
                    callback(new Error());
                } else {
                    if (!/[\u4e00-\u9fa5]+/.test(value)) {
                        callback();
                    } else {
                        callback(new Error());
                    };
                }
            };
            return {
                deleteButtonLoading: false,
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                editId: '',
                buttonLoading: false,
                tableHeight: document.documentElement.clientHeight - 250,
                showOther: false,
                formValidate: {
                    maintainCodeIpt: '',
                    maintainNameIpt: ''
                },
                ruleValidate: {
                    maintainCodeIpt: { required: true, validator: validateCode, trigger: 'blur' },
                    maintainNameIpt: { required: true, trigger: 'blur' }
                },
                deleteModalStatus: false,
                deleteModalMsg: '',
                saveModalState: false,
                saveModalTitle: '',
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '保养类型编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '保养类型名称',
                        key: 'name',
                        align: 'left',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editMaintain(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                tableData: [],
                checkArray: []
            };
        },
        methods: {
            // 获取勾选的对象(返回数组)
            getCheckObjEvent (e) {
                this.checkArray = e;
            },
            // 删除的方法
            deleteMaintain () {
                if (this.checkArray.length !== 0) {
                    this.deleteModalStatus = true;
                    this.deleteModalMsg = '确认删除?';
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 删除提示框的确认按钮
            deleteModalConfirm () {
                let arrId = [];
                this.checkArray.forEach((items) => { arrId.push(items.id); });
                this.deleteButtonLoading = true;
                this.$post('maintenance/type/delete', arrId).then(res => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.deleteModalMsg = '';
                        noticeTips(this, 'deleteTips');
                        this.deleteModalStatus = false;
                        this.getListHttp();
                        this.checkArray = [];
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteModalCancel () {
                this.deleteModalMsg = '';
                this.deleteButtonLoading = '';
                this.deleteModalStatus = false;
            },
            // 编辑的方法
            editMaintain (id) {
                this.showOther = true;
                this.editId = id;
                this.saveModalTitle = '编辑保养类型';
                this.$fetch('maintenance/type/detail/' + id).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = true;
                        this.formValidate.maintainNameIpt = res.data.res.name;
                        this.formValidate.maintainCodeIpt = res.data.res.code;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.updateName = res.data.res.updateName;
                        this.updateTime = res.data.res.updateTime;
                    };
                });
            },
            // modal确认的按钮
            confirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        this.saveHttp();
                    } else {
                        /[\u4e00-\u9fa5]+/.test(this.formValidate.maintainCodeIpt) ? this.$Message.warning('编码格式不能为中文!') : noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            saveHttp () {
                this.$post('maintenance/type/save',
                    {
                        id: this.editId,
                        name: this.formValidate.maintainNameIpt,
                        code: this.formValidate.maintainCodeIpt
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.saveModalState = false;
                        this.buttonLoading = false;
                        this.getListHttp();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            getListHttp () {
                this.$call('maintenance.type.list').then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                    };
                });
            },
            // modal取消的按钮
            cancelEvent () {
                this.editId = '';
                this.saveModalState = false;
                this.buttonLoading = false;
                this.$refs['formValidate'].resetFields();
            },
            // 监听新增和编辑栏的状态
            saveModalStateChangeEvent (e) {
                if (e === false) {
                    this.editId = '';
                    this.saveModalState = false;
                    this.buttonLoading = false;
                    this.$refs['formValidate'].resetFields();
                };
            },
            // 新增的方法
            addMaintainEvent () {
                this.editId = '';
                this.showOther = false;
                this.saveModalTitle = '新增保养类型';
                this.saveModalState = true;
            }
        },
        created () {
            this.getListHttp();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            this.tableHeight = compClientHeight(tableDom.offsetTop + 130);
            window.onresize = () => {
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160);
            };
        }
    };
</script>

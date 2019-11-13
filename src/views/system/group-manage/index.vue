<template>
    <Card class="car-bar">
        <global-loading v-show="showGlobalLoading"></global-loading>
        <Row type="flex" justify="space-between">
            <Col>
                <Button icon="md-add" type="primary" @click="addEvent">新增</Button>
                <Button icon="ios-trash" type="error" :disabled="selectArr.length ===0" @click="deleteEvent">删除</Button>
                <Button type="success" @click="syncOrgEvent" class="add-dept-margin">同步</Button>
            </Col>
        </Row>
        <Table class="margin-top-10" 　ref="tableCsv" @on-selection-change="getSelectEvent" :height="tableHeight" border :columns="columns" :data="tableData" size="small"></Table>
        <yf-modal
                :modal-state="modalState"
                :title="modalTitle"
                :confirm-loading="saveModalConfirmLoading"
                @on-cancel="onCancelEvent"
                @on-confirm="onConfirmEvent"
                @on-visible-change="onVisibleEvent"
        >
            <div slot="content">
                <modal-content-loading :spinShow="showModalContentLoading"></modal-content-loading>
                <Form :show-message="false" ref="formValidate" :model="formValidate" :rules="ruleValidate"
                      :label-width="80">
                    <FormItem label="班组编号" prop="code" class="margin-bottom-10">
                        <Input v-model="formValidate.code" placeholder="请输入班组编号"></Input>
                    </FormItem>
                    <FormItem label="班组名称" prop="name" class="margin-bottom-10">
                        <Input v-model="formValidate.name" placeholder="请输入班组名称"></Input>
                    </FormItem>
                    <FormItem label="是否启用" prop="city">
                        <Checkbox v-model="formValidate.isEnable">是</Checkbox>
                    </FormItem>
                </Form>
            </div>
        </yf-modal>
        <tip-modal
                :tips-modal-state="tipsModalState"
                :confirm-button-loading="confirmButtonLoading"
                :tips-modal-message="tipsModalMessage"
                @cancel-event="tipsModalCancelEvent"
                @confirm-event="tipsModalConfirmEvent"
        >
        </tip-modal>
        <sync-modal
                :modal-state="syncModalState"
                @on-visible-change="onSyncModalVisibleChangeEvent"
                @on-confirm="onSyncModalConfirmEvent"
        ></sync-modal>
    </Card>
</template>
<script>
    import {toDay, formatDate, mathJsAdd} from '../../../libs/common';
    import {noticeTips, emptyTips} from '../../../libs/common';
    import tipModal from '../../components/tips-modal';
    import modalContentLoading from '../../components/modal-content-loading';
    import syncModal from './sync-modal';

    export default {
        name: 'group-mange',
        components: {tipModal, modalContentLoading, syncModal},
        data () {
            return {
                syncModalState: false,
                showModalContentLoading: false,
                saveModalConfirmLoading: false,
                selectArr: [],
                tipsModalMessage: '',
                tipsModalState: false,
                confirmButtonLoading: false,
                formValidate: {
                    code: '',
                    name: '',
                    isEnable: false
                },
                ruleValidate: {
                    code: [{required: true, message: '请输入班组编号!', trigger: 'change'}],
                    name: [{required: true, message: '请输入班组名称!', trigger: 'change'}]
                },
                modalState: false,
                confirmSubmitLoading: false,
                modalTitle: '',
                columns: [
                    {type: 'selection', width: 60, align: 'center'},
                    {title: '班组编号', key: 'code', minWidth: 160, sortable: true},
                    {title: '班组名称', key: 'name', minWidth: 100, sortable: true},
                    {
                        title: '启用',
                        key: 'isEnable',
                        minWidth: 100,
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.isEnable ? '是' : '否'
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 100,
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.editEvent(params.row.id);
                                    }
                                }
                            }, '编辑');
                        }
                    }
                ],
                tableData: [],
                showGlobalLoading: false,
                tableHeight: 0
            };
        },
        methods: {
            onSyncModalConfirmEvent (e) {
                this.syncModalState = false;
                this.formValidate.hrGroupId = e.id;
                this.formValidate.code = e.code;
                this.formValidate.name = e.name;
                this.modalTitle = '新增';
                this.modalState = true;
            },
            onSyncModalVisibleChangeEvent (e) {
                this.syncModalState = e;
            },
            syncOrgEvent () {
                this.syncModalState = true;
            },
            // 选择
            getSelectEvent (arr) {
                this.disabled = true;
                this.selectArr = arr.map(item => item.id);
            },
            // 修改
            editEvent (id) {
                this.showModalContentLoading = true;
                this.modalTitle = '编辑班组';
                this.modalState = true;
                this.$call('group.detail', {id}).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate = res.data.res;
                        this.showModalContentLoading = false;
                    };
                });
            },
            // 删除
            deleteEvent () {
                if (this.selectArr && this.selectArr.length !== 0) {
                    this.tipsModalState = true;
                    this.tipsModalMessage = '确认删除?';
                } else {
                    emptyTips(this, '请选择操作对象!');
                };
            },
            tipsModalCancelEvent () {
                this.tipsModalState = false;
            },
            tipsModalConfirmEvent () {
                this.confirmButtonLoading = true;
                this.$call('group.delete', this.selectArr).then(res => {
                    if (res.data.status === 200) {
                        this.getListRequest();
                        this.tipsModalState = false;
                        this.confirmButtonLoading = false;
                        this.selectArr = [];
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.confirmButtonLoading = false;
                    };
                });
            },
            onVisibleEvent (e) {
                this.modalState = e;
                if (!e) {
                    this.modalTitle = '';
                    this.saveModalConfirmLoading = false;
                    this.formValidate.isEnable = false;
                    this.$delete(this.formValidate, 'id');
                    this.$refs['formValidate'].resetFields();
                };
            },
            onCancelEvent () {
                this.modalState = false;
            },
            // 确认时间
            onConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        // this.$Message.success('保存成功!');
                        this.saveModalConfirmLoading = true;
                        this.saveRequest();
                    } else {
                        this.$Message.warning('请填写完整!');
                    }
                });
            },
            saveRequest () {
                this.$call('group.save', {...this.formValidate}).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.modalState = false;
                        this.saveModalConfirmLoading = false;
                        this.getListRequest();
                    } else {
                        this.saveModalConfirmLoading = false;
                    };
                });
            },
            addEvent () {
                this.modalTitle = '新增班组';
                delete this.formValidate.id;
                delete this.formValidate.hrGroupId;
                this.modalState = true;
            },
            getListRequest () {
                return this.$call('group.list', {}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.tableData = responseData;
                        this.showGlobalLoading = false;
                        this.$nextTick(() => {
                            this.calculationTableHeight();
                        });
                    };
                });
            },
            calculationTableHeight () {
                this.tableHeight = document.documentElement.clientHeight - 200;
                window.onresize = () => {
                    this.tableHeight = document.documentElement.clientHeight - 200;
                    this.tableHeight = document.documentElement.clientHeight - 200;
                };
            }
        },
        created () {
            this.showGlobalLoading = true;
            this.getListRequest();
        },
        mounted () {
            this.$nextTick(() => {
                this.calculationTableHeight();
            });
        }
    };
</script>

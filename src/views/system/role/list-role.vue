<template>
    <Card>
        <div class="margin-bottom-10">
            <Button type="primary" @click="addEvent">新增</Button>
        </div>
        <Row>
            <Col span="24">
                <Table :height="tableHeight" border :columns="tableHeader" :data="tableData" size="small"></Table>
            </Col>
        </Row>
        <module-modal
                :modal-state="moduleState"
                :role-id="roleId"
                @on-visible-change="onModuleVisibleChange"
        ></module-modal>
        <save-modal
            :modal-state="saveModalState"
            :role-id="editRoleId"
            :modal-title="saveModalTitle"
            @on-confirm="saveModalConfirmEvent"
            @on-visible-change="onSaveModalVisibleChange"
        ></save-modal>
        <tips-modal
                :tips-modal-state="tipsModalState"
                :tips-modal-message="tipsModalMessage"
                :confirm-button-loading="confirmButtonLoading"
                @confirm-event="tipsConfirmEvent"
                @cancel-event="tipsCancelEvent"
        ></tips-modal>
    </Card>
</template>
<script>
    import moduleModal from './module-modal';
    import saveModal from './save-modal';
    import tipsModal from '../../components/tips-modal';
    import {noticeTips} from '../../../libs/common';
    export default {
        name: 'list-role',
        data () {
            return {
                tipsModalMessage: '',
                deleteId: null,
                confirmButtonLoading: false,
                tipsModalState: false,
                saveModalTitle: '',
                editRoleId: null,
                saveModalState: false,
                tableHeight: 0,
                roleId: null,
                moduleState: false,
                tableHeader: [
                    {title: '编码', sortable: true, width: 80, align: 'left', key: 'code'},
                    {title: '名称', sortable: true, minWidth: 160, align: 'left', key: 'name'},
                    {title: '排序', key: 'sortNum', width: 80, sortable: true, align: 'center'},
                    {title: '备注', minWidth: 200, align: 'left', key: 'remark'},
                    {title: '操作', key: 'action', width: 180, align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editEvent(params.row.id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    },
                                    on: {
                                        click: (val) => {
                                            this.moduleButtonEvent(params.row.id);
                                        }
                                    }
                                }, '模块'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteEvent(params.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: []
            };
        },
        components: { moduleModal, saveModal, tipsModal },
        methods: {
            saveModalConfirmEvent () {
                this.getAllRoleList();
            },
            tipsConfirmEvent () {
                this.confirmButtonLoading = true;
                this.$call('role.delete', [this.deleteId]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'deleteTips');
                        this.confirmButtonLoading = false;
                        this.tipsModalState = false;
                        this.deleteId = null;
                        this.getAllRoleList();
                    } else {
                        this.confirmButtonLoading = false;
                    };
                });
            },
            tipsCancelEvent () {
                this.tipsModalMessage = '';
                this.tipsModalState = false;
            },
            deleteEvent (id) {
                this.tipsModalState = true;
                this.tipsModalMessage = '确认删除？';
                this.deleteId = id;
            },
            onSaveModalVisibleChange (e) {
                this.saveModalState = e;
                if (!e) this.editRoleId = null;
            },
            addEvent () {
                this.saveModalTitle = '新增';
                this.saveModalState = true;
            },
            editEvent (id) {
                this.saveModalTitle = '编辑';
                this.editRoleId = id;
                this.saveModalState = true;
            },
            onModuleVisibleChange (e) {
                this.moduleState = e;
                if (!e) this.roleId = null;
            },
            moduleButtonEvent (id) {
                this.moduleState = true;
                this.roleId = id;
            },
            // 获取所有模块列表
            getAllRoleList () {
                this.$call('role.list').then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                    };
                });
            },
            // 计算展示区的高度
            calViewHeight () {
                this.$nextTick(() => this.tableHeight = this.$store.getters.getManiViewHeight - 100);
            }
        },
        created () {
            this.getAllRoleList();
        },
        mounted () {
            this.calViewHeight();
        }
    };
</script>

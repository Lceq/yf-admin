<template>
    <card>
        <global-loading v-show="globalLoadingState"></global-loading>
        <Row type="flex" justify="end">
            <Col>
                <Input v-model="searchData" placeholder="请输入关键字" class="modal-input-length"/>
                <Button icon="ios-search" type="primary" @click="searchButtonEvent">搜索</Button>
            </Col>
        </Row>
        <Row class="tableMargin tableOffsetTop">
            <Col>
                <Table :height="tableHeight" border :columns="tableHeader" :data="tableData" size="small" @on-selection-change="getSelectUserEvent"></Table>
            </Col>
        </Row>
        <Row class="pageHeight" type="flex" justify="end">
            <Col class="pageStyle">
                <Page :total="totalPage" :page-size-opts="pageSizeOpts" :show-total="true" :show-elevator="true" :show-sizer="true" :page-size="pageSize" @on-change="getPageCodeEvent" @on-page-size-change="pageSizeChangeEvent"></Page>
            </Col>
        </Row>
        <save-user-modal
                :saveUserModalState="saveUserModalState"
                :saveUserModalData="saveUserModalData"
                @on-visible-change="saveUserModalStateChangeEvent"
                @on-confirm="saveModalConfirmEvent"
                @on-cancel="saveModalCancelEvent"
        ></save-user-modal>
    </card>
</template>
<script>
    import { setPage, compClientHeight, clearSpace } from '../../../libs/common';
    import saveUserModal from './save-user-modal';
    export default {
        components: { saveUserModal },
        data () {
            return {
                searchData: '',
                saveUserModalData: {},
                saveUserModalState: false,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        fixed: 'left',
                        align: 'left'
                    },
                    {
                        title: '集团编号',
                        key: 'code',
                        sortable: true,
                        align: 'left',
                        fixed: 'left',
                        minWidth: 130
                    },
                    {
                        title: '内部编号',
                        sortable: true,
                        key: 'internalCode',
                        minWidth: 130,
                        fixed: 'left',
                        align: 'left'
                    },
                    {
                        title: '姓名',
                        key: 'name',
                        align: 'left',
                        sortable: true,
                        fixed: 'left',
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('div', {
                                    domProps: {
                                        innerHTML: params.row.name
                                    },
                                    on: {
                                        click: () => {
                                            this.clickUserNameEvent(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        align: 'left',
                        sortable: true,
                        minWidth: 80,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.gender === 1 ? '男' : '女'
                                }
                            });
                        }
                    },
                    {
                        title: '工作手机',
                        key: 'mobile',
                        align: 'left',
                        sortable: true,
                        minWidth: 114
                    },
                    {
                        title: '直接上级',
                        key: 'leaderName',
                        align: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '岗位工种',
                        key: 'postName',
                        align: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '所属部门',
                        key: 'deptName',
                        align: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '是否在职',
                        key: 'onJob',
                        align: 'center',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.onJob ? '在职' : '离职'
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 90,
                        fixed: 'right',
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
                                            this.clickUserNameEvent(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                tableData: [],
                tableHeight: 0,
                pageSizeOpts: setPage.pageOpts,
                totalPage: 0,
                pageSize: setPage.pageSize,
                globalLoadingState: false
            };
        },
        methods: {
            // 搜索事件
            searchButtonEvent () {
                this.pageIndex = 1;
                this.getUserListRequest();
            },
            // 保存modal的确认事件
            saveModalConfirmEvent () {
                this.pageIndex = 1;
                this.getUserListRequest();
                this.saveUserModalState = false;
            },
            // 保存modal的取消事件
            saveModalCancelEvent () {
                this.saveUserModalState = false;
            },
            // 监听saveModal
            saveUserModalStateChangeEvent (e) {
                this.saveUserModalState = e;
            },
            clickUserNameEvent (id) {
                this.saveUserModalState = true;
                this.getDetailRequest(id);
            },
            // 获取详情
            getDetailRequest (id) {
                this.$fetch('user/detail/' + id).then(res => {
                    if (res.data.status === 200) {
                        this.saveUserModalData = res.data.res;
                    };
                });
            },
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getUserListRequest();
            },
            pageSizeChangeEvent (e) {
                this.pageSize = e;
                this.totalPage = 1;
                this.getUserListRequest();
            },
            getSelectUserEvent () {},
            // 获取员工列表数据
            getUserListRequest () {
                this.searchData || this.searchData === 0 ? this.searchData = clearSpace(this.searchData) : this.searchData = '';
                return this.$call('user.list', {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    name: this.searchData,
                    isImport: true
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.totalPage = res.data.count;
                        this.globalLoadingState = false;
                    };
                });
            }
        },
        created () {
            this.globalLoadingState = true;
            this.getUserListRequest();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            this.tableHeight = compClientHeight(tableDom.offsetTop + 100 + this.pageHeights);
            window.onresize = () => {
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
            };
        }
    };
</script>

<template>
    <div>
        <left-menu
                :stateList="menuArr"
                :curTabStateId="activeMenuAuditSate"
                @on-select="getClickMenuEvent"
        >
            <div slot="content">
                <global-loading v-show="globalLoadingState"></global-loading>
                <Row type="flex" justify="end">
                    <Col>
                        <Input v-model.trim="queryBarName" placeholder="请输入关键字" class="modal-input-length"/>
                        <Button icon="ios-search" type="primary" @click="searchButtonEvent">搜索</Button>
                    </Col>
                </Row>
                <Row class="tableMargin tableOffsetTop">
                    <Col>
                        <Table :loading="tableLoading" :height="tableHeight" border :columns="tableHeader" :data="tableData" size="small"></Table>
                    </Col>
                </Row>
                <Row class="pageHeight" type="flex" justify="end">
                    <Col class="pageStyle">
                        <Page :total="totalPage" :page-size-opts="pageSizeOpts" :show-total="true" :show-elevator="true" :show-sizer="true" :page-size="pageSize" @on-change="getPageCodeEvent" @on-page-size-change="pageSizeChangeEvent"></Page>
                    </Col>
                </Row>
            </div>
        </left-menu>
        <save-user-modal
                :saveUserModalState="saveUserModalState"
                :saveUserModalData="saveUserModalData"
                @on-visible-change="saveUserModalStateChangeEvent"
                @on-confirm="saveModalConfirmEvent"
                @on-cancel="saveModalCancelEvent"
        ></save-user-modal>
    </div>
</template>
<script>
    import { setPage, compClientHeight, clearSpace } from '../../../libs/common';
    import saveUserModal from './save-user-modal';
    import leftMenu from '../../layout/layout';
    export default {
        name: 'oa-user',
        components: { saveUserModal, leftMenu },
        data () {
            return {
                tableLoading: false,
                activeMenuAuditSate: 1,
                menuArr: [],
                queryBarName: '',
                saveUserModalData: {
                    'name': '',
                    'code': '',
                    'internalCode': '',
                    'loginName': '',
                    'password': '123456',
                    'sortNum': 1,
                    'deptId': null,
                    'deptName': '',
                    'mobile': '',
                    'email': '',
                    'gender': '',
                    'tel': '',
                    'leaderId': null,
                    'leaderName': '',
                    'remark': '',
                    'birthday': '',
                    'postId': null,
                    'postName': '',
                    'idCard': '',
                    'groupId': null,
                    'groupName': ''
                },
                saveUserModalState: false,
                tableHeader: [
                    {title: '集团编号', key: 'code', sortable: true, align: 'left', fixed: 'left', minWidth: 130},
                    {title: '内部编号', sortable: true, key: 'internalCode', minWidth: 130, fixed: 'left', align: 'left'},
                    {title: '姓名', key: 'name', align: 'left', sortable: true, fixed: 'left', minWidth: 110},
                    {title: '性别', key: 'gender', align: 'left', sortable: true, minWidth: 80,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.gender === 1 ? '男' : '女'
                                }
                            });
                        }
                    },
                    {title: '工作手机', key: 'mobile', align: 'left', sortable: true, minWidth: 114},
                    {title: '直接上级', key: 'leaderName', align: 'left', sortable: true, minWidth: 110},
                    {title: '岗位工种', key: 'postName', align: 'left', sortable: true, minWidth: 110},
                    {title: '所属部门', key: 'deptName', align: 'left', sortable: true, minWidth: 110},
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
                                        size: 'small',
                                        disabled: this.activeMenuAuditSate === 2
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.onSyncEvent(params.row);
                                        }
                                    }
                                }, '同步')
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
            // 菜单的点击事件
            getClickMenuEvent (obj) {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.queryBarName = '';
                this.activeMenuAuditSate = obj.id;
                this.getListRequest();
            },
            // 搜索事件
            searchButtonEvent () {
                this.pageIndex = 1;
                this.getListRequest();
            },
            // 保存modal的确认事件
            saveModalConfirmEvent () {
                this.pageIndex = 1;
                this.getListRequest();
                this.saveUserModalState = false;
            },
            // 保存modal的取消事件
            saveModalCancelEvent () {
                this.saveUserModalState = false;
            },
            // 监听saveModal
            saveUserModalStateChangeEvent (e) {
                if (!e) {
                    this.saveUserModalData = {};
                };
                this.saveUserModalState = e;
            },
            onSyncEvent (row) {
                this.saveUserModalState = true;
                Object.assign(this.saveUserModalData, row);
                this.$delete(this.saveUserModalData, 'corpId');
                this.saveUserModalData.hrUserId = row.id;
                this.$delete(this.saveUserModalData, 'id');
            },
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getListRequest();
            },
            pageSizeChangeEvent (e) {
                this.pageSize = e;
                this.totalPage = 1;
                this.getListRequest();
            },
            // 获取员工列表数据
            getListRequest () {
                this.tableLoading = true;
                return this.$api.user.hrUserListRequest({
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    userName: this.queryBarName,
                    isSync: this.activeMenuAuditSate === 2 // 1是未同步，2是已同步
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.totalPage = res.data.count;
                        this.globalLoadingState = false;
                        this.tableLoading = false;
                    };
                });
            },
            getMenListRequest () {
                return this.$api.user.hrUserStateCountRequest().then(res => {
                    if (res.data.status === 200) this.menuArr = res.data.res;
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 160 + this.pageHeights);
                };
            },
            async getDependentData () {
                await this.getMenListRequest();
                await this.getListRequest();
            }
        },
        created () {
            this.globalLoadingState = true;
            this.getDependentData();
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>

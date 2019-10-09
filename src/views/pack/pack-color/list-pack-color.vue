<template>
    <Card>
        <Row type="flex" justify="space-between">
            <Col span="12" class="headerMargin flex-left">
                <div class="queryBarMarginRight">
                    <Button icon="md-add" type="primary" @click="addEvent">新增</Button>
                </div>
                <div class="queryBarMarginRight">
                    <Dropdown trigger="click" @on-click="getDropAuditEvent">
                        <Button type="primary">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="审核">审核</DropdownItem>
                            <DropdownItem name="反审核">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <Button icon="ios-trash" type="error" @click="deleteEvent">删除</Button>
            </Col>
            <Col class="flex-left">
                <Select clearable v-model="queryBarParamType" placeholder="请选择包装料类型" class="queryBarMarginRight searchHurdles">
                    <Option v-for="item in paramsTypeList" :value="item.paramType" :key="item.paramType">{{ item.paramTypeName }}</Option>
                </Select>
                <Select clearable v-model="queryBarAuditStateId" placeholder="请选择数据状态" class="queryBarMarginRight searchHurdles">
                    <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="searchValue" placeholder="请输入名称" class="queryBarMarginRight searchHurdles"/>
                <Button icon="ios-search" type="primary" @click="searchButtonClickEvent" class="queryButtonStyle">搜索</Button>
            </Col>
        </Row>
        <Row class="margin-top-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData" @on-selection-change="getCheckObjEvent"></Table>
            </Col>
        </Row>
        <tips-modal
                :v-model="deleteModalStatus"
                :tipMsg="deleteModalMsg"
                :loading="deleteButtonLoading"
                @cancel="deleteModalCancel"
                @confirm="deleteModalConfirm"
        >
        </tips-modal>
        <save-modal
                :saveModalState="saveModalState"
                :showOther="showOther"
                :detailData="detailData"
                :saveModalTitle="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                @on-confirm="saveConfirmEvent"
                @on-cancel="saveCancelEvent"
        ></save-modal>
    </Card>
</template>
<script>
    import tipsModal from '../../public/deleteWarning';
    import { compClientHeight, noticeTips, translateState, emptyTips } from '../../../libs/common';
    import saveModal from './save-modal';
    export default {
        components: { tipsModal, saveModal },
        data () {
            return {
                queryBarAuditStateId: '',
                auditStateList: [],
                queryBarParamType: null,
                detailData: {},
                paramsTypeList: [
                    {
                        paramType: 1,
                        paramTypeName: '腰绳'
                    },
                    {
                        paramType: 2,
                        paramTypeName: '封包绳'
                    }
                ],
                searchValue: '',
                saveModalState: false,
                deleteButtonLoading: false,
                editId: '',
                buttonLoading: false,
                tableHeight: 0,
                showOther: false,
                formValidate: {},
                deleteModalStatus: false,
                deleteModalMsg: '',
                saveModalTitle: '',
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '名称',
                        key: 'name',
                        sortable: true,
                        minWidth: 130,
                        render: (h, params) => {
                            return h('a', {
                                domProps: {
                                    innerHTML: params.row.name
                                },
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.editEvent(params.row.id);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '包装料类型',
                        key: 'paramTypeName',
                        align: 'center',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        align: 'center',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        align: 'center',
                        sortable: true,
                        minWidth: 130
                    }
                ],
                tableData: [],
                checkArray: []
            };
        },
        methods: {
            getDropAuditEvent (e) {
                if (this.checkArray && this.checkArray.length !== 0) {
                    if (e === '审核') {
                        if (this.validatorState(1).switchState) {
                            this.approveRequest(this.validatorState().ids);
                        } else {
                            emptyTips(this, '只有创建状态下才能审核!');
                        }
                    } else {
                        if (this.validatorState(3).switchState) {
                            this.unApproveRequest(this.validatorState().ids);
                        } else {
                            emptyTips(this, '只有审核状态下才能反审核!');
                        }
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            validatorState (state) {
                let switchState = true;
                let ids = this.checkArray.map(item => {
                    if (item.auditState !== state) { switchState = false; };
                    return item.id;
                });
                return {
                    ids: ids,
                    switchState: switchState
                };
            },
            unApproveRequest (ids) {
                this.$call('pack.color.cancel', ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'unAuditTips');
                        this.getListRequest();
                    };
                });
            },
            approveRequest (ids) {
                this.$call('pack.color.approve', ids).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'auditTips');
                        this.getListRequest();
                    };
                });
            },
            // 搜索事件
            searchButtonClickEvent () {
                this.searchValue = this.searchValue.trimStart();
                this.searchValue = this.searchValue.trimEnd();
                this.getListRequest();
            },
            saveConfirmEvent () {
                this.getListRequest();
                this.saveModalState = false;
            },
            saveCancelEvent () {
                this.saveModalState = false;
            },
            saveModalStateChangeEvent (e) {
                this.saveModalState = e;
            },
            // 获取勾选的对象
            getCheckObjEvent (e) {
                this.checkArray = e;
            },
            // 删除的方法
            deleteEvent () {
                if (this.checkArray.length !== 0) {
                    if (this.validatorState(1).switchState) {
                        this.deleteModalStatus = true;
                        this.deleteModalMsg = '确认删除?';
                    } else {
                        emptyTips(this, '只有创建状态下才能删除!');
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 删除提示框的确认按钮
            deleteModalConfirm () {
                this.deleteButtonLoading = true;
                this.$call('pack.color.delete', this.validatorState(1).ids).then(res => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.deleteModalMsg = '';
                        noticeTips(this, 'deleteTips');
                        this.deleteModalStatus = false;
                        this.getListRequest();
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
            editEvent (id) {
                this.showOther = true;
                this.editId = id;
                this.saveModalTitle = '编辑包装料颜色';
                this.$call('pack.color.detail', { id: id }).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = true;
                        this.detailData = res.data.res;
                    };
                });
            },
            getListRequest () {
                this.$call('pack.color.list', {
                    name: this.searchValue,
                    paramType: this.queryBarParamType,
                    auditState: this.queryBarAuditStateId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = translateState(res.data.res);
                        this.checkArray = [];
                    };
                });
            },
            // 新增的方法
            addEvent () {
                this.detailData = {
                    name: '',
                    shortName: '',
                    paramType: null,
                    paramTypeName: null
                };
                this.editId = '';
                this.showOther = false;
                this.saveModalTitle = '新增包装料颜色';
                this.saveModalState = true;
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                this.tableHeight = compClientHeight(tableDom.offsetTop + 180);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 180);
                };
            },
            // 获取数据状态列表
            getAuditStateListRequest () {
                return this.$call('enum.audit.state3').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.auditStateList = responseData;
                    }
                });
            }
        },
        created () {
            this.getAuditStateListRequest();
            this.getListRequest();
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>

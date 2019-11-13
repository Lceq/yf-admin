<template>
    <div>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row :gutter='16'>
            <Col class="leftMenu">
                <Card>
                    <Tree :data="treeData" @on-select-change="clickTreeEvent"></Tree>
                </Card>
            </Col>
            <Col class="rightContent">
                <Card>
                    <div class="rightContentTitleFont">
                        {{organizationTitle !== '' ? organizationTitle : organizationTitle = null}}
                    </div>
                    <div>
                        <Button icon="md-add" type="primary" @click="addOrgEvent" class="add-dept-margin">新增下级组织</Button>
                        <Button type="success" @click="syncOrgEvent" class="add-dept-margin">同步</Button>
                    </div>
                    <Table size="small" :height="tableHeight" :loading="loadingStatus" border :columns="tableHeaders" :data="tableData"></Table>
                </Card>
            </Col>
        </Row>
        <Modal
                v-model="saveModalState"
                :title="saveModalTitle"
                @on-visible-change="saveModalStateChangeEvent"
                :mask-closable="false"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="100" ref="formValidate" :rules="ruleValidate" :model="formValidate" :show-message="false">
                <Row>
                    <Col span="22">
                        <div v-show="isSync">
                            <FormItem v-if="isSync" label="上级组织：" prop="saveModalDeptId" class="formItemMargin">
                                <Cascader :data="treeData" v-model="formValidate.saveModalDeptId" change-on-select placeholder="请选择上级组织" @on-change="onSyncModalSelectDeptEvent"></Cascader>
                            </FormItem>
                        </div>
                        <div v-if="!isSync">
                            <FormItem label="上级组织：" class="formItemMargin">
                                <span>{{organizationTitle}}</span>
                            </FormItem>
                        </div>
                        <FormItem label="组织简称：" prop="shortName" class="formItemMargin">
                            <Input type="text" placeholder="请输入组织简称" v-model="formValidate.shortName"></Input>
                        </FormItem>
                        <FormItem label="组织全称：" prop="name" class="formItemMargin">
                            <Input type="text" value="" placeholder="请输入组织全称" v-model="formValidate.name"/>
                        </FormItem>
                        <FormItem label="组织属性：" prop="OrganizationalAttributesRule" class="formItemMargin">
                            <RadioGroup v-model="formValidate.typeId" @on-change="radioSelectEvent">
                                <Radio v-for="(items,index) in typeList" :label="items.id" :key="items.id">{{items.name}}</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="负责人：" class="formItemMargin">
                            <Select
                                    v-model="formValidate.leaderId"
                                    filterable
                                    remote
                                    :clearable="true"
                                    :remote-method="leaderRemoteMethod"
                                    @on-change="getSelectLeaderEvent"
                                    label-in-value
                                    :loading="addSearchSwitch"
                                    placeholder="请输入负责人的名称"
                            >
                                <Option v-for="(option, index) in headerDataList" :value="option.id" :key="index">{{option.label}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="排序：" class="formItemMargin">
                            <InputNumber :max="100" :min="1" v-model="formValidate.sortNum"></InputNumber>
                        </FormItem>
                        <FormItem v-if="isGroupItem" label="工段:" class="formItemMargin" prop="processTypeId">
                            <Select clearable label-in-value v-model="formValidate.processTypeId" @on-change="getSelectProcessTypeEvent" @on-clear="clearProcessTypeEvent" placeholder="请选择工段">
                                <Option v-for="item in processTypeList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="isGroupItem" label="工序:" class="formItemMargin" prop="deptProcessList">
                            <Select multiple :max-tag-count="4" label-in-value v-model="formValidate.deptProcessList" @on-change="getSelectProcessEvent" placeholder="请选择工序">
                                <Option v-for="item in processList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <div v-show="showOther">
                    <other-message
                            :createName="formValidate.createName"
                            :createTime="formValidate.createTime"
                            :updateName="formValidate.updateName"
                            :updateTime="formValidate.updateTime"
                    ></other-message>
                </div>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="buttonLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <tips-modal
                :v-model="publicHintsData"
                :tipMsg="publicHintsMsg"
                :loading="deleteButtonLoading"
                @cancel="publicHintsCancel"
                @confirm="publicHintsConfirm"
        >
        </tips-modal>
        <tips-modal
                :v-model="deleteHintsState"
                :tipMsg="deleteHintsMsg"
                :loading="deleteHintsButtonLoading"
                @cancel="deleteHintsCancelEvent"
                @confirm="deleteHintsConfirmEvent"
        >
        </tips-modal>
        <sync-modal
            :modal-state="syncModalState"
            @on-visible-change="onSyncModalVisibleChangeEvent"
            @on-confirm="onSyncModalConfirmEvent"
        ></sync-modal>
    </div>
</template>
<script>
    import tipsModal from '../../public/deleteWarning';
    import { compClientHeight, toTree, noticeTips } from '../../../libs/common';
    import otherMessage from '../../components/otherMessage';
    import modalFooter from '../../components/modal-footer';
    import syncModal from './sync-modal';
    import modalContentLoading from '../../components/modal-content-loading';
    import { deptSaveRequest, deptListRequest, deptDetailRequest, deptEnableRequest, deptDisableRequest, deptDeleteRequest } from '@api/basic/dept';
    import { dictListRequest } from '@api/basic/dictionary';
    import { userSearchRequest } from '@api/user/user';
    export default {
        name: 'list-user',
        components: { tipsModal, otherMessage, modalFooter, syncModal, modalContentLoading },
        data () {
            const validateProcessType = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDeptProcessList = (rule, value, callback) => value && value.length !== 0 ? callback() : callback(new Error());
            const validateSyncDept = (rule, value, callback) => value && value.length !== 0 ? callback() : callback(new Error());
            return {
                spinShow: false,
                isSync: false,
                syncModalState: false,
                globalLoadingShow: false,
                deptProcessList: [],
                deleteHintsState: false,
                deleteHintsMsg: '',
                deleteHintsButtonLoading: false,
                isGroupItem: false,
                processList: [],
                deleteButtonLoading: false,
                showOther: false,
                buttonLoading: false,
                tableHeight: document.documentElement.clientHeight - 236,
                loadingStatus: false,
                leaderObj: null,
                saveModalTitle: '',
                addSearchSwitch: false,
                organizationTitle: '',
                publicHintsData: false,
                publicHintsMsg: '暂无信息',
                formValidate: {
                    saveModalDeptId: [],
                    shortName: '',
                    name: '',
                    processTypeId: null,
                    processTypeName: '',
                    sortNum: 1,
                    leaderId: null,
                    deptProcessList: [],
                    typeId: 0
                },
                ruleValidate: {
                    shortName: [{required: true, trigger: 'blur'}],
                    name: [{required: true, trigger: 'blur'}],
                    processTypeId: [{required: true, validator: validateProcessType, trigger: 'change'}],
                    deptProcessList: [{required: true, validator: validateDeptProcessList, trigger: 'change'}],
                    saveModalDeptId: [{required: true, validator: validateSyncDept, trigger: 'change'}]
                },
                headerDataList: [],
                selectSuperiorData: '',
                cascadingSelectionData: [],
                displaySuperior: '',
                saveModalState: false,
                tableHeaders: [
                    {title: '组织名称', key: 'name', sortable: true, minWidth: 110},
                    {title: '负责人', key: 'leaderName', sortable: true, align: 'left', minWidth: 110},
                    {title: '组织属性', key: 'typeName', sortable: true, align: 'left', minWidth: 110},
                    {title: '禁用状态', key: 'stateName', minWidth: 110, align: 'center', sortable: true},
                    {
                        title: '操作',
                        key: 'operation',
                        width: 180,
                        align: 'center',
                        render: (h, params) => {
                            let disableMsg = '';
                            let buttonType = '';
                            if (parseInt(params.row.state) === 1) {
                                disableMsg = '禁用';
                                buttonType = 'success';
                            } else if (parseInt(params.row.state) === 0) {
                                disableMsg = '启用';
                                buttonType = 'error';
                            };
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
                                            this.editEvent(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteEvent(params.row.id);
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: buttonType,
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.disableEvent(params.row, params.row.id);
                                        }
                                    }
                                }, disableMsg)
                            ]);
                        }
                    }
                ],
                tableData: [],
                treeObj: [],
                treeData: [],
                roleList: [],
                deleteId: null,
                treeListSubData: null,
                typeId: null,
                disableId: null,
                isEnable: false,
                allDeptList: [],
                orgTypeCN: '',
                typeList: '',
                familyArray: [],
                leaderSplitName: '',
                leaderSplitId: null,
                editParentId: '',
                editId: ''
            };
        },
        methods: {
            onSyncModalSelectDeptEvent (e) {
                this.formValidate.parentId = e[e.length - 1];
            },
            onSyncModalConfirmEvent (e) {
                this.syncModalState = false;
                this.formValidate.shortName = e.shortName;
                this.formValidate.name = e.name;
                this.formValidate.typeId = e.typeId;
                this.isSync = true;
                this.saveModalTitle = '新增';
                this.saveModalState = true;
            },
            onSyncModalVisibleChangeEvent (e) {
                this.syncModalState = e;
            },
            syncOrgEvent () {
                this.syncModalState = true;
            },
            clearProcessTypeEvent () {
                this.formValidate.processTypeId = null;
                this.formValidate.processTypeName = '';
                this.selectDeptProcessList = [];
                this.formValidate.deptProcessList = [];
                this.processList = [];
            },
            getSelectProcessEvent (event) {
                this.selectDeptProcessList = event;
            },
            // 获取选中的工段
            getSelectProcessTypeEvent (event) {
                if (event) {
                    this.selectDeptProcessList = [];
                    this.formValidate.deptProcessList = [];
                    this.formValidate.processTypeName = event.label;
                    this.getProcessListHttp(event.value).then(res => {
                        if (res.data.status === 200) this.processList = res.data.res;
                    });
                } else {
                    this.formValidate.processTypeId = null;
                    this.formValidate.processTypeName = '';
                };
            },
            deleteHintsCancelEvent () {
                this.deleteId = '';
                this.deleteHintsMsg = '确认删除?';
                this.deleteHintsState = false;
            },
            deleteHintsConfirmEvent () {
                this.deleteHintsButtonLoading = true;
                this.postDeleteHttp(this.deleteId);
            },
            leaderRemoteMethod (query) {
                if (query !== '') {
                    this.addSearchSwitch = true;
                    setTimeout(() => {
                        this.addSearchSwitch = false;
                        this.headerDataList = this.remoteHeaderDataList.filter(item => item.id + ''.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.headerDataList = [];
                };
            },
            // 获取工序列表
            getProcessListHttp (processTypeId) {
                return this.$call('process.list', {processTypeId: processTypeId, auditState: 3});
            },
            // 获取负责人对象
            getSelectLeaderEvent (e) {
                if (e) {
                    this.leaderSplitId = e.value;
                    this.leaderSplitName = e.label.split('(')[0];
                } else {
                    this.leaderSplitId = 0;
                    this.leaderSplitName = '';
                };
            },
            // 搜索负责人
            getSuperiorRequest (query, type) {
                userSearchRequest({name: ''}).then((res) => {
                    if (res.data.status === 200) {
                        this.addSearchSwitch = false;
                        res.data.res.forEach((item) => {
                            item.value = item.name + '(' + item.code + ')';
                            item.label = item.name + '(' + item.code + ')';
                        });
                        this.remoteHeaderDataList = res.data.res;
                    };
                });
            },
            // 禁用的方法
            disableEvent (row, id) {
                this.disableId = id;
                if (parseInt(row.state) === 1) {
                    this.isEnable = false;
                    this.publicHintsMsg = '确定禁用?';
                    this.publicHintsData = true;
                } else if (parseInt(row.state) === 0) {
                    this.isEnable = true;
                    this.publicHintsMsg = '确定启用?';
                    this.publicHintsData = true;
                };
            },
            // 新增下级组织的点击事件
            addOrgEvent () {
                this.editId = null;
                this.isSync = false;
                this.isGroupItem = false;
                this.showOther = false;
                this.formValidate.sortNum = 1;
                this.formValidate.leaderId = '';
                this.saveModalTitle = '新增组织';
                this.formValidate.parentId = this.treeObj[0].id;
                if (this.treeObj.length === 0) {
                    this.publicHintsMsg = '请选择上级部门！';
                    this.publicHintsData = true;
                } else {
                    this.saveModalState = true;
                }
            },
            // 监听保存modal状态
            saveModalStateChangeEvent (e) {
                if (e === false) {
                    this.$refs['formValidate'].resetFields();
                    this.buttonLoading = false;
                    this.formValidate.sortNum = 1;
                    this.formValidate.processTypeId = null;
                    this.formValidate.leaderId = null;
                    this.formValidate.typeId = 0;
                    this.selectDeptProcessList = [];
                    this.formValidate.deptProcessList = [];
                    this.processList = [];
                }
            },
            // 禁用的请求
            postDisableHttp (id) {
                deptDisableRequest([id]).then((res) => {
                    if (res.data.status === 200) {
                        this.getAllDeptListHttp();
                        this.isEnable = false;
                        this.deleteButtonLoading = false;
                        this.publicHintsData = false;
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 取消禁用的请求
            postEnableHttp (id) {
                deptEnableRequest([id]).then((res) => {
                    if (res.data.status === 200) {
                        this.getAllDeptListHttp();
                        this.isEnable = false;
                        this.deleteButtonLoading = false;
                        this.publicHintsData = false;
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的请求
            postDeleteHttp (param) {
                this.deleteHintsButtonLoading = true;
                deptDeleteRequest([param]).then((res) => {
                    if (res.data.status === 200) {
                        this.getAllDeptListHttp();
                        this.deleteHintsButtonLoading = false;
                        this.deleteHintsState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteHintsButtonLoading = false;
                        this.deleteId = '';
                        this.deleteHintsMsg = '';
                        this.deleteHintsState = false;
                        this.$Loading.finish();
                    };
                });
            },
            // 公共提示框确认与取消按钮的方法
            publicHintsConfirm () {
                if (this.isEnable === true) {
                    this.deleteButtonLoading = true;
                    this.postEnableHttp(this.disableId);
                } else {
                    this.postDisableHttp(this.disableId);
                };
            },
            publicHintsCancel () {
                this.publicHintsData = false;
                this.deleteButtonLoading = false;
            },
            // 组织属性
            radioSelectEvent (e) {
                if (e === 2) this.isGroupItem = true;
                else this.isGroupItem = false;
                this.formValidate.processTypeId = null;
                this.formValidate.deptProcessList = [];
                this.processList = [];
            },
            // 获取上级部门的名称
            getFartherName (list, pId) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === pId) {
                        this.familyArray.push(list[i].name);
                        this.$set(list[i], 'expand', true);
                        this.getFartherName(list, list[i].parentId);
                    };
                };
            },
            // 保存modal的确认按钮
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        this.saveHttp();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            saveHttp () {
                // 组织属性不为班组时，工段和工序为空
                if (this.formValidate.typeId === 0 || this.formValidate.typeId === 1) {
                    this.formValidate.processTypeId = null;
                    this.formValidate.processTypeName = '';
                    this.selectDeptProcessList = [];
                    this.formValidate.deptProcessList = [];
                } else {
                    this.selectDeptProcessList.forEach((item) => {
                        item.processId = item.value;
                        item.processName = item.label;
                    });
                };
                let params = {
                    'id': this.editId,
                    'name': this.formValidate.name,
                    'code': this.formValidate.shortName,
                    'shortName': this.formValidate.shortName,
                    'parentId': this.formValidate.parentId,
                    'typeId': this.formValidate.typeId,
                    'leaderId': this.leaderSplitId,
                    'leaderName': this.leaderSplitName,
                    'sortNum': this.formValidate.sortNum,
                    'processTypeId': this.formValidate.processTypeId,
                    'processTypeName': this.formValidate.processTypeName,
                    'deptProcessList': this.selectDeptProcessList
                };
                deptSaveRequest(params).then((res) => {
                    if (res.data.status === 200) {
                        this.editParentId = '';
                        this.buttonLoading = false;
                        this.saveModalState = false;
                        this.getAllDeptListHttp();
                        noticeTips(this, 'saveTips');
                    } else if (res.data.status === 415) {
                        this.buttonLoading = false;
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 新增下级的取消按钮方法
            saveModalCancelEvent () {
                this.saveModalState = false;
                this.formValidate.leaderId = 0;
                this.$refs['formValidate'].resetFields();
            },
            // 编辑的方法
            editEvent (obj) {
                this.isSync = false;
                this.showOther = true;
                this.editId = obj.id;
                this.editParentId = obj.parentId;
                this.saveModalTitle = '编辑组织';
                this.saveModalState = true;
                this.spinShow = true;
                deptDetailRequest({id: this.editId}).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.getProcessListHttp().then(res => {
                            if (res.data.status === 200) {
                                this.processList = res.data.res;
                                this.formValidate = responseData;
                                this.spinShow = false;
                                this.displaySuperior = this.organizationTitle;
                                this.selectDeptProcessList = responseData.deptProcessList;
                                this.formValidate.deptProcessList = responseData.deptProcessList.map(item => item.processId);
                                this.leaderSplitId = responseData.leaderId;
                                this.leaderSplitName = responseData.leaderName;
                                this.isGroupItem = responseData.typeId === 2;
                            };
                        });
                    };
                });
            },
            // 删除事件
            deleteEvent (id) {
                this.deleteId = id;
                this.deleteHintsMsg = '确认删除？';
                this.deleteHintsState = true;
            },
            // 获取所有部门
            getAllDeptListHttp () {
                return deptListRequest({}).then((res) => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.treeData = toTree(res.data.res);
                        this.allDeptList = res.data.res;
                        this.getDeptNameLevel(this.allDeptList, this.treeObj[0].id);
                        this.getListHttp();
                    };
                });
            },
            // 获取列表数据
            getListHttp () {
                this.loadingStatus = true;
                deptListRequest({parentId: this.treeObj[0].id}).then((res) => {
                    if (res.data.status === 200) {
                        this.loadingStatus = false;
                        this.treeListSubData = this.translateChinese(res.data.res);
                        this.tableData = this.treeListSubData;
                    };
                });
            },
            translateChinese (data) {
                return data.map((item) => {
                    parseInt(item.state) === 1 ? item.stateName = '启用' : item.stateName = '禁用';
                    item.typeId === 1 ? item.typeName = '否' : item.typeName = '是';
                    if (parseInt(item.typeId) === 0) {
                        this.$set(item, 'typeName', '普通');
                    } else if (parseInt(item.typeId) === 1) {
                        this.$set(item, 'typeName', '车间');
                    } else if (parseInt(item.typeId) === 2) {
                        this.$set(item, 'typeName', '班组');
                    };
                    return item;
                });
            },
            // 获取部门名称的层级
            getDeptNameLevel (list, id) {
                this.familyArray = [];
                this.getFartherName(list, id);
                let superiorDept = this.familyArray.reverse();
                let superiorDeptStr = '';
                superiorDept.forEach((items, index) => {
                    if (index === superiorDept.length - 1) {
                        superiorDeptStr += items;
                    } else {
                        superiorDeptStr += items + ' / ';
                    }
                });
                this.organizationTitle = superiorDeptStr;
            },
            // 树的点击事件
            clickTreeEvent (data) {
                if (data && data.length !== 0) {
                    this.treeObj = data;
                    this.displaySuperior = this.treeObj[0].title;
                    // 拼接部门名称
                    this.getDeptNameLevel(this.allDeptList, this.treeObj[0].id);
                    this.getListHttp();
                } else {
                    this.displaySuperior = '';
                };
            },
            getTreeListRequest () {
                return deptListRequest({}).then((res) => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.treeData = toTree(res.data.res);
                        this.treeObj = this.treeData;
                        this.allDeptList = res.data.res;
                        this.getDeptNameLevel(this.allDeptList, this.treeObj[0].id);
                        this.getListHttp();
                    };
                });
            },
            // 获取组织属性
            getOrgTypeRequest () {
                this.$call('enum.dept.type').then((res) => {
                    if (res.data.status === 200) {
                        this.typeList = res.data.res;
                    };
                });
            },
            // 获取工段类别
            getProcessTypeListRequest () {
                dictListRequest({parentCode: 'process_type'}).then(res => {
                    if (res.data.status === 200) {
                        this.processTypeList = res.data.res;
                    };
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getSuperiorRequest();
            this.getOrgTypeRequest();
            this.getTreeListRequest();
            this.getProcessTypeListRequest();
        },
        mounted () {
            window.onresize = () => {
                this.tableHeight = compClientHeight(236);
            };
        }
    };
</script>
<style scoped>
    .add-dept-margin{
        margin:5px 0 10px 0;
    }
</style>

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
                    <Row>
                        <Col class="rightContentTitleFont">
                            {{organizationTitle !== '' ? organizationTitle : organizationTitle = null}}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button icon="md-add" type="primary" @click="addOrgEvent" class="add-dept-margin">新增下级组织</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table size="small" :height="tableHeight" :loading="loadingStatus" border :columns="tableHeaders" :data="tableData"></Table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="saveModalState"
                        :title="saveModalTitle"
                        @on-visible-change="saveModalStateChangeEvent"
                        :mask-closable="false"
                >
                    <Form :label-width="100" ref="formValidate" :rules="ruleValidate" :model="formValidate" :show-message="false">
                        <Row>
                            <Col span="22">
                                <FormItem label="上级组织：" prop="SuperiorOrganizationRule" class="formItemMargin">
                                    <span>{{organizationTitle}}</span>
                                </FormItem>
                                <FormItem label="组织简称：" prop="shortName" class="formItemMargin">
                                    <Input type="text" placeholder="请输入组织简称" v-model="formValidate.shortName"></Input>
                                </FormItem>
                                <FormItem label="组织全称：" prop="name" class="formItemMargin">
                                    <Input type="text" value="" placeholder="请输入组织全称" v-model="formValidate.name"/>
                                </FormItem>
                                <FormItem label="组织属性：" prop="OrganizationalAttributesRule" class="formItemMargin">
                                    <RadioGroup v-model="organizationAttr" @on-change="radioSelectEvent">
                                        <Radio v-for="(items,index) in typeList" :label="items.name" :key="items.id"></Radio>
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
            </Col>
        </Row>
        <Row>
            <Col>
                <tips-modal
                        :v-model="publicHintsData"
                        :tipMsg="publicHintsMsg"
                        :loading="deleteButtonLoading"
                        @cancel="publicHintsCancel"
                        @confirm="publicHintsConfirm"
                >
                </tips-modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <tips-modal
                        :v-model="deleteHintsState"
                        :tipMsg="deleteHintsMsg"
                        :loading="deleteHintsButtonLoading"
                        @cancel="deleteHintsCancelEvent"
                        @confirm="deleteHintsConfirmEvent"
                >
                </tips-modal>
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../../ajax/api';
    import tipsModal from '../public/deleteWarning';
    import { compClientHeight, toTree, noticeTips } from '../../libs/common';
    import otherMessage from '../components/otherMessage';
    import modalFooter from '../components/modal-footer';
    export default {
        name: 'list-user',
        components: {
            tipsModal, otherMessage, modalFooter
        },
        data () {
            const validateProcessType = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateDeptProcessList = (rule, value, callback) => value && value.length !== 0 ? callback() : callback(new Error());
            return {
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
                    shortName: '',
                    name: '',
                    processTypeId: null,
                    processTypeName: '',
                    sortNum: 1,
                    leaderId: null,
                    deptProcessList: []
                },
                ruleValidate: {
                    shortName: [{required: true, trigger: 'blur'}],
                    name: [{required: true, trigger: 'blur'}],
                    processTypeId: [{required: true, validator: validateProcessType, trigger: 'change'}],
                    deptProcessList: [{required: true, validator: validateDeptProcessList, trigger: 'change'}]
                },
                organizationAttr: '普通',
                headerDataList: [],
                selectSuperiorData: '',
                cascadingSelectionData: [],
                displaySuperior: '',
                saveModalState: false,
                tableHeaders: [
                    {
                        title: '组织名称',
                        key: 'name',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '负责人',
                        key: 'leaderName',
                        sortable: true,
                        align: 'left',
                        minWidth: 110
                    },
                    {
                        title: '组织属性',
                        key: 'typeName',
                        sortable: true,
                        align: 'left',
                        minWidth: 110
                    },
                    {
                        title: '禁用状态',
                        key: 'stateName',
                        minWidth: 110,
                        align: 'center',
                        sortable: true
                    },
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
                totalSize: 0,
                pageIndex: 0,
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
                        if (res.data.status === 200) {
                            this.processList = res.data.res;
                        };
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
            getSuperior (query, type) {
                this.$api.user.listHttp({name: ''}).then((res) => {
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
                this.isGroupItem = false;
                this.currentProcessIds = null;
                this.showOther = false;
                this.formValidate.sortNum = 1;
                this.formValidate.leaderId = '';
                this.organizationAttr = '普通';
                this.saveModalTitle = '新增组织';
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
                    this.selectDeptProcessList = [];
                    this.formValidate.deptProcessList = [];
                    this.processList = [];
                }
            },
            // 禁用的请求
            postDisableHttp (id) {
                this.$post(api.orgDisable(id)).then((res) => {
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
                this.$post(api.orgEnable(id)).then((res) => {
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
                this.$post(api.orgDelete(param)).then((res) => {
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
                if (e === '班组') this.isGroupItem = true;
                else this.isGroupItem = false;
                this.organizationAttr = e;
                this.formValidate.processTypeId = null;
                this.formValidate.deptProcessList = [];
                this.processList = [];
            },
            // 获取上级部门的名称
            getFartherName (list, pId) {
                for (var i = 0; i < list.length; i++) {
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
                let typeId = this.orgConverterNum(this.organizationAttr);
                if (typeId === 0 || typeId === 1) { // 组织属性不为班组时，工段和工序为空
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
                    'parentId': this.treeObj[0].id,
                    'typeId': typeId,
                    'leaderId': this.leaderSplitId,
                    'leaderName': this.leaderSplitName,
                    'sortNum': this.formValidate.sortNum,
                    'processTypeId': this.formValidate.processTypeId,
                    'processTypeName': this.formValidate.processTypeName,
                    'deptProcessList': this.selectDeptProcessList
                };
                this.$post(api.orgSave(), params).then((res) => {
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
                this.showOther = true;
                this.editId = obj.id;
                this.editParentId = obj.parentId;
                this.saveModalTitle = '编辑组织';
                this.$fetch(api.orgDetail(this.editId)).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.getProcessListHttp(event.processTypeId).then(res => {
                            if (res.data.status === 200) {
                                this.processList = res.data.res;
                                this.formValidate = responseData;
                                this.saveModalState = true;
                                this.displaySuperior = this.organizationTitle;
                                this.organizationAttr = this.orgConverterCN(responseData.typeId);
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
            // 转换组织属性为number方法
            orgConverterNum (param) {
                let typeId = null;
                if (param === '普通') {
                    typeId = 0;
                } else if (param === '车间') {
                    typeId = 1;
                } else if (param === '班组') {
                    typeId = 2;
                };
                return typeId;
            },
            orgConverterCN (param) {
                let typeId = '';
                if (param === 0) {
                    typeId = '普通';
                } else if (param === 1) {
                    typeId = '车间';
                } else if (param === 2) {
                    typeId = '班组';
                };
                return typeId;
            },
            // 删除事件
            deleteEvent (id) {
                this.deleteId = id;
                this.deleteHintsMsg = '确认删除？';
                this.deleteHintsState = true;
            },
            // 获取所有部门
            getAllDeptListHttp () {
                return this.$api.dept.getDeptList({}).then((res) => {
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
                this.$api.dept.getDeptList({parentId: this.treeObj[0].id}).then((res) => {
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
                    // 获取列表数据
                    this.getListHttp();
                } else {
                    this.displaySuperior = '';
                };
            },
            getTreeListHttp () {
                return this.$api.dept.getDeptList({}).then((res) => {
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
            getOrgTypeHttp () {
                this.$call('enum.dept.type').then((res) => {
                    if (res.data.status === 200) {
                        this.typeList = res.data.res;
                    };
                });
            },
            // 获取工段类别
            getProcessTypeListHttp () {
                this.$call('dict.list', {parentCode: 'process_type'}).then(res => {
                    if (res.data.status === 200) {
                        this.processTypeList = res.data.res;
                    };
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getSuperior();
            this.getOrgTypeHttp();
            this.getTreeListHttp();
            this.getProcessTypeListHttp();
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

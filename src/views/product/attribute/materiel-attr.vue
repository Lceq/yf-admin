<template>
    <div>
        <Tabs value="1" @on-click="clickTabsEvent">
            <TabPane label="原料成分" name="1">
                <Button icon="md-add" type="primary" @click="addMaterialIngredientEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getMaterialIngredientAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" @click="deleteMaterialIngredientEvent">删除</Button>
                <Row>
                    <Col span="24">
                        <Table @on-selection-change="getSelectMaterialIngredientEvent" :height="tableHeight" size="small" border :columns="materialIngredientColumn" :data="materialIngredientData"></Table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="供应商" name="5">
                <Button icon="md-add" type="primary" @click="addSupplierEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getSupplierAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem name="审核">审核</DropdownItem>
                        <DropdownItem name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" @click="deleteSupplierEvent">删除</Button>
                <Row>
                    <Col span="24">
                        <Table :height="tableHeight" @on-selection-change="getSelectSupplierEvent" size="small" border :columns="supplierColumn" :data="supplierData"></Table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="纱线用途" name="2">
                <Button icon="md-add" type="primary" @click="addYarnUseEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getYarnUseAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" @click="deleteYarnUseEvent">删除</Button>
                <Row>
                    <Col span="24">
                        <Table @on-selection-change="getSelectYarnUseEvent" :height="tableHeight" size="small" border :columns="yarnUseColumn" :data="yarnUseData"></Table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="纺纱工艺" name="3">
                <Button icon="md-add" type="primary" @click="addSpinningProcessEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getSpinningProcessAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" @click="deleteSpinningProcessEvent">删除</Button>
                <Row>
                    <Col span="24">
                        <Table @on-selection-change="getSelectSpinningProcessEvent" :height="tableHeight" size="small" border :columns="spinningProcessColumn" :data="spinningProcessData"></Table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="包装方式" name="6">
                <Button icon="md-add" type="primary" @click="addPackingModeEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getPackingModeAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" @click="deletePackingModeEvent">删除</Button>
                <Row>
                    <Col span="24">
                        <Table @on-selection-change="getSelectPackingModeEvent" :height="tableHeight" size="small" border :columns="packingModeColumn" :data="packingModeData"></Table>
                    </Col>
                </Row>
            </TabPane>
            <TabPane label="辅助属性" name="4">
                <Button icon="md-add" class="operatingSpaceMargin" type="primary" @click="addMaterielAttrEvent">新增</Button>
                <Row>
                    <Col span="24">
                        <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
        <Row>
            <Col>
                <Modal
                        v-model="adEdModalState"
                        :title="materielTitle"
                        :mask-closable="false"
                        @on-visible-change="adEdModalStateChange"
                >
                    <Row>
                        <Form :label-width="100" :rules="ruleValidate" ref="formValidate" :model="formValidate" :show-message="false">
                            <Col span="20">
                            <FormItem label="编号" prop="materielCode" class="formItemMargin">
                                <Input type="text" placeholder="请输入编码" v-model="formValidate.materielCode" :disabled="disableCode"/>
                            </FormItem>
                            </Col>
                            <Col span="20">
                            <FormItem label="名称" prop="materielName" class="formItemMargin">
                                <Input type="text" placeholder="请输入名称" v-model="formValidate.materielName"/>
                            </FormItem>
                            </Col>
                            <Col span="24">
                                <Table height="500" size="small" border :columns="addTableHeader" :data="addTableData.rows"></Table>
                            </Col>
                        </Form>
                    </Row>
                    <div slot="footer">
                        <modal-footer
                                :buttonLoading="buttonLoading"
                                @saveModalConfirmEvent="materielConfirm"
                                @saveModalCancelEvent="materielCancel"
                        ></modal-footer>
                    </div>
                </Modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <tips-modal
                        :v-model="pubPromptState"
                        :tipMsg="pubPromptMsg"
                        :loading="deleteButtonLoading"
                        @cancel="pubPromptCancel"
                        @confirm="pubPromptConfirm"
                >
                </tips-modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <save-modal
                        :saveModalState="saveModalState"
                        :saveModalTitle="saveModalTitle"
                        :saveModalCode="saveModalCode"
                        :saveModalName="saveModalName"
                        :saveModalLoading="saveModalLoading"
                        :createName="createName"
                        :createTime="createTime"
                        :auditName="auditName"
                        :auditTime="auditTime"
                        :showOther="showOther"
                        :disableConfirm="disableConfirm"
                        @saveModalStateChangeEvent="saveModalStateChangeEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                >
                </save-modal>
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../../../ajax/api';
    import tipsModal from '../../public/deleteWarning';
    import { translateState, compClientHeight, noticeTips } from '../../../libs/common';
    import saveModal from './components/save-modal';
    import modalFooter from '../../components/modal-footer';
    export default {
        components: {
            tipsModal, saveModal, modalFooter
        },
        data () {
            const validateCode = (rule, value, callback) => {
                if (value || value === '0') {
                    if (/[\u4e00-\u9fa5]/g.test(value)) {
                        callback(new Error());
                        this.$Message.warning('编号不能为中文!');
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                };
            };
            return {
                packingModeColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        'click': () => {
                                            this.editPackingModeEvent(params.row, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 200,
                        align: 'left'
                    }
                ],
                packingModeData: [],
                initTableData: [
                    {
                        name: '',
                        code: ''
                    }
                ],
                supplierColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '全称',
                        key: 'name',
                        sortable: true,
                        minWidth: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.name
                                    },
                                    on: {
                                        'click': () => {
                                            this.editSupplierEvent(params.row, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '简称',
                        key: 'shortName',
                        sortable: true,
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        sortable: true,
                        minWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        sortable: true,
                        minWidth: 120,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true,
                        minWidth: 160,
                        align: 'left'
                    }
                ],
                supplierData: [],
                disableConfirm: false,
                isError: false,
                checkArr: [],
                isSwitch: '1',
                editId: null,
                showOther: false,
                createName: '',
                createTime: '',
                auditName: '',
                auditTime: '',
                saveModalCode: '',
                saveModalName: '',
                saveModalTitle: '',
                saveModalState: false,
                saveModalLoading: false,
                auditSwitch: false,
                againstSwitch: false,
                tableHeight: document.documentElement.clientHeight - 230,
                deleteButtonLoading: false,
                formValidate: {
                    materielCode: '',
                    materielName: ''
                },
                ruleValidate: {
                    materielCode: [
                        { required: true, validator: validateCode, trigger: 'blur' }
                    ],
                    materielName: [
                        { required: true, trigger: 'blur' }
                    ]
                },
                buttonLoading: false,
                adEdModalState: false,
                spinningProcessColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        'click': () => {
                                            this.editSpinningProcessEvent(params.row, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 200,
                        align: 'left'
                    }
                ],
                spinningProcessData: [],
                yarnUseColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        'click': () => {
                                            this.editYarnUseEvent(params.row, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 200,
                        align: 'left'
                    }
                ],
                yarnUseData: [],
                materialIngredientColumn: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        'click': () => {
                                            this.editMaterialIngredientEvent(params.row, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '创建人',
                        key: 'createName',
                        width: 130,
                        align: 'center'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: 200,
                        align: 'left'
                    }
                ],
                materialIngredientData: [],
                tableHeader: [
                    {
                        title: '属性编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        click: () => {
                                            this.editMateriel(params.row, params.index, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '属性名称',
                        key: 'name',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '属性值',
                        key: 'valStrs',
                        align: 'center',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '操作',
                        key: 'set',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeMateriel(params.row.id, params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [],
                addTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'addOperation',
                        width: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-add'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.addRowEvent(params.index);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeRowEvent(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '属性值',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.name
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.name = event.target.value;
                                            _this.addTableData.rows[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '属性值编码',
                        key: 'code',
                        align: 'center',
                        render: (h, params) => {
                            let _this = this;
                            return h('div', [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: params.row.code
                                    },
                                    style: {
                                        zIndex: 999
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.code = event.target.value;
                                            _this.addTableData.rows[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                addTableData: {
                    rows: [
                        {
                            name: '',
                            code: ''
                        }
                    ]
                },
                materielTitle: '',
                editAttrId: null,
                deleteId: null,
                pubPromptState: false,
                pubPromptMsg: '',
                disableCode: false
            };
        },
        methods: {
            // 包装方式
            editPackingModeEvent (obj, id) {
                obj.auditState === 1 ? this.disableConfirm = false : this.disableConfirm = true;
                this.editId = id;
                this.saveModalTitle = '编辑包装方式';
                this.$call('product.packing.mode.detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalName = res.data.res.name;
                        this.saveModalCode = res.data.res.code;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.auditName = res.data.res.auditName;
                        this.auditTime = res.data.res.auditTime;
                        this.showOther = true;
                        this.saveModalState = true;
                    };
                });
            },
            getSelectPackingModeEvent (e) {
                this.checkArr = e;
            },
            deletePackingModeEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.isError = false;
                    this.checkArr.forEach((item) => {
                        item.auditState === 3 ? this.isError = true : false;
                        ids.push(item.id);
                    });
                    if (this.isError === false) {
                        this.pubPromptMsg = '确认删除?';
                        this.pubPromptState = true;
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '包含已审核对象，不能删除!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            addPackingModeEvent () {
                this.disableConfirm = false;
                this.editId = null;
                this.saveModalState = true;
                this.showOther = false;
                this.saveModalTitle = '新增包装方式';
            },
            // 保存modal的确认事件
            saveModalConfirmEvent (e) {
                this.saveModalLoading = true;
                if (this.isSwitch === '1') {
                    // 保存原料成分的请求
                    this.saveMaterialHttp(e);
                } else if (this.isSwitch === '2') {
                    // 保存纱线用途的请求
                    this.saveYarnUseHttp(e);
                } else if (this.isSwitch === '3') {
                    // 保存纺纱工艺的请求
                    this.saveSpinningProcessHttp(e);
                } else if (this.isSwitch === '5') {
                    // 保存供应商
                    this.saveSupplierHttp(e);
                } else if (this.isSwitch === '6') {
                    // 保存包装方式
                    this.savePackingModeHttp(e);
                };
            },
            savePackingModeHttp (e) {
                this.$call('product.packing.mode.save',
                    {
                        id: this.editId,
                        code: e.saveModalCode,
                        name: e.saveModalName
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.saveModalLoading = false;
                        this.getPackingModeListHttp();
                        noticeTips(this, 'saveTips');
                    } else {
                        this.saveModalLoading = false;
                    };
                });
            },
            getPackingModeAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    ids = this.checkArr.map(item => item.id);
                    if (e === '审核') {
                        this.$call('product.packing.mode.approve', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getPackingModeListHttp();
                                noticeTips(this, 'auditTips');
                            }
                        });
                    } else if (e === '反审核') {
                        this.$call('product.packing.mode.unapprove', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getPackingModeListHttp();
                                noticeTips(this, 'unAuditTips');
                            }
                        });
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            getPackingModeListHttp () {
                this.$call('product.packing.mode.list', {codeName: ''}).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.packingModeData = translateState(res.data.res);
                    };
                });
            },
            clickTabsEvent (e) {
                this.checkArr = [];
                this.isSwitch = e;
                if (e === '1') { // 原料成分
                    this.getMaterialIngredientListHttp();
                } else if (e === '2') { // 纱线用途
                    this.getYarnUseListHttp();
                } else if (e === '3') { // 纺纱工艺
                    this.getSpinningProcessListHttp();
                } else if (e === '4') { // 辅助属性
                    this.getMaterialAttrListHttp();
                } else if (e === '5') { // 供应商方式
                    this.getSupplierListHttp();
                } else if (e === '6') { // 包装方式
                    this.getPackingModeListHttp();
                };
            },
            // 编辑供应商
            editSupplierEvent (obj, id) {
                obj.auditState === 1 ? this.disableConfirm = false : this.disableConfirm = true;
                this.editId = id;
                this.saveModalTitle = '编辑供应商';
                this.$call('product.supplier.detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalName = res.data.res.shortName;
                        this.saveModalCode = res.data.res.name;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.auditName = res.data.res.auditName;
                        this.auditTime = res.data.res.auditTime;
                        this.showOther = true;
                        this.saveModalState = true;
                    };
                });
            },
            // 供应商
            getSupplierListHttp () {
                this.$call('product.supplier.list', {codeName: ''}).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.supplierData = translateState(res.data.res);
                    };
                });
            },
            getSelectSupplierEvent (e) {
                this.checkArr = e;
            },
            deleteSupplierEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.isError = false;
                    this.checkArr.forEach((item) => {
                        parseInt(item.auditState) === 3 ? this.isError = true : false;
                        ids.push(item.id);
                    });
                    if (this.isError === false) {
                        this.pubPromptMsg = '确认删除?';
                        this.pubPromptState = true;
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '包含已审核对象，不能删除!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            addSupplierEvent () {
                this.disableConfirm = false;
                this.editId = null;
                this.saveModalState = true;
                this.showOther = false;
                this.saveModalTitle = '新增供应商';
            },
            saveSupplierHttp (e) {
                this.$call('product.supplier.save',
                    {
                        id: this.editId,
                        name: e.saveModalCode,
                        shortName: e.saveModalName
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.saveModalLoading = false;
                        this.getSupplierListHttp();
                        noticeTips(this, 'saveTips');
                    } else {
                        this.saveModalLoading = false;
                    };
                });
            },
            getSupplierAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    ids = this.checkArr.map(item => item.id);
                    if (e === '审核') {
                        this.$call('product.supplier.approve', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getSupplierListHttp();
                                noticeTips(this, 'auditTips');
                            }
                        });
                    } else if (e === '反审核') {
                        this.$call('product.supplier.cancel', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getSupplierListHttp();
                                noticeTips(this, 'unAuditTips');
                            }
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 公共提示框的确认按钮
            pubPromptConfirm () {
                this.deleteButtonLoading = true;
                let ids = [];
                ids = this.checkArr.map(item => item.id);
                if (this.isSwitch === '1') {
                    this.deleteMaterialIngredientHttp(ids);
                } else if (this.isSwitch === '2') {
                    this.deleteYarnUseHttp(ids);
                } else if (this.isSwitch === '3') {
                    this.deleteSpinningProcessHttp(ids);
                } else if (this.isSwitch === '4') {
                    this.deleteHttp();
                } else if (this.isSwitch === '5') {
                    this.deleteSupplierHttp(ids);
                } else if (this.isSwitch === '6') {
                    this.deletePackingModeHttp(ids);
                };
            },
            deletePackingModeHttp (ids) {
                this.$call('product.packing.mode.delete', ids).then(res => {
                    if (res.data.status === 200) {
                        this.getPackingModeListHttp();
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteSupplierHttp (ids) {
                this.$call('product.supplier.delete', ids).then(res => {
                    if (res.data.status === 200) {
                        this.getSupplierListHttp();
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteHttp () {
                this.$post(api.attrDelete(this.deleteId)).then((res) => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        this.getAttrList();
                        noticeTips(this, 'deleteTips');
                    } else if (res.data.status === 415) {
                        this.pubPromptState = false;
                        this.deleteButtonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 纺纱工艺的审核事件
            getSpinningProcessAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    ids = this.checkArr.map(item => item.id);
                    if (e === '审核') {
                        this.$post('product/technology/approve', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getSpinningProcessListHttp();
                                noticeTips(this, 'auditTips');
                            }
                        });
                    } else if (e === '反审核') {
                        this.$post('product/technology/cancel', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getSpinningProcessListHttp();
                                noticeTips(this, 'unAuditTips');
                            }
                        });
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 纺纱工艺勾选事件
            getSelectSpinningProcessEvent (e) {
                this.checkArr = e;
            },
            // 纱线用途的勾选事件
            getSelectYarnUseEvent (e) {
                this.checkArr = e;
            },
            // 纱线用途的审核事件
            getYarnUseAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    ids = this.checkArr.map(item => item.id);
                    if (e === '审核') {
                        this.$post('product/purpose/approve', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getYarnUseListHttp();
                                noticeTips(this, 'auditTips');
                            }
                        });
                    } else if (e === '反审核') {
                        this.$post('product/purpose/cancel', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getYarnUseListHttp();
                                noticeTips(this, 'unAuditTips');
                            }
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取勾选的原料成分
            getSelectMaterialIngredientEvent (e) {
                this.checkArr = e;
            },
            // 编辑纺纱工艺
            editSpinningProcessEvent (obj, id) {
                obj.auditState === 1 ? this.disableConfirm = false : this.disableConfirm = true;
                this.editId = id;
                this.saveModalTitle = '编辑纺纱工艺';
                this.$post('product/technology/detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalName = res.data.res.name;
                        this.saveModalCode = res.data.res.code;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.auditName = res.data.res.auditName;
                        this.auditTime = res.data.res.auditTime;
                        this.showOther = true;
                        this.saveModalState = true;
                    };
                });
            },
            // 编辑纱线用途
            editYarnUseEvent (obj, id) {
                obj.auditState === 1 ? this.disableConfirm = false : this.disableConfirm = true;
                this.editId = id;
                this.saveModalTitle = '编辑纱线用途';
                this.$post('product/purpose/detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalName = res.data.res.name;
                        this.saveModalCode = res.data.res.code;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.auditName = res.data.res.auditName;
                        this.auditTime = res.data.res.auditTime;
                        this.showOther = true;
                        this.saveModalState = true;
                    };
                });
            },
            // 编辑原料成分
            editMaterialIngredientEvent (obj, id) {
                obj.auditState === 1 ? this.disableConfirm = false : this.disableConfirm = true;
                this.editId = id;
                this.saveModalTitle = '编辑原料成分';
                this.$post('product/component/detail', {id: id}).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalName = res.data.res.name;
                        this.saveModalCode = res.data.res.code;
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.auditName = res.data.res.auditName;
                        this.auditTime = res.data.res.auditTime;
                        this.showOther = true;
                        this.saveModalState = true;
                    };
                });
            },
            saveSpinningProcessHttp (e) {
                this.$post('product/technology/save',
                    {
                        id: this.editId,
                        code: e.saveModalCode,
                        name: e.saveModalName
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.saveModalLoading = false;
                        this.getSpinningProcessListHttp();
                        noticeTips(this, 'saveTips');
                    } else {
                        this.saveModalLoading = false;
                    };
                });
            },
            // 保存纱线用途
            saveYarnUseHttp (e) {
                this.$post('product/purpose/save',
                    {
                        id: this.editId,
                        code: e.saveModalCode,
                        name: e.saveModalName
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.saveModalLoading = false;
                        this.getYarnUseListHttp();
                        noticeTips(this, 'saveTips');
                    } else {
                        this.saveModalLoading = false;
                    }
                });
            },
            // 保存原料成分
            saveMaterialHttp (e) {
                this.$post('product/component/save',
                    {
                        id: this.editId,
                        code: e.saveModalCode,
                        name: e.saveModalName
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalState = false;
                        this.saveModalLoading = false;
                        this.getMaterialIngredientListHttp();
                        noticeTips(this, 'saveTips');
                    } else {
                        this.saveModalLoading = false;
                    };
                });
            },
            // 保存modal的取消按钮事件
            saveModalCancelEvent () {
                this.saveModalState = false;
            },
            // 监听保存modal的状态
            saveModalStateChangeEvent (e) {
                this.saveModalState = e;
                if (e === false) {
                    this.saveModalCode = '';
                    this.saveModalName = '';
                };
            },
            // 新增原料成分
            addMaterialIngredientEvent () {
                this.disableConfirm = false;
                this.editId = null;
                this.saveModalState = true;
                this.showOther = false;
                this.saveModalTitle = '新增原料成分';
            },
            deleteYarnUseEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.isError = false;
                    this.checkArr.forEach((item) => {
                        item.auditState === 3 ? this.isError = true : false;
                        ids.push(item.id);
                    });
                    if (this.isError === false) {
                        this.pubPromptMsg = '确认删除?';
                        this.pubPromptState = true;
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '包含已审核对象，不能删除!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            deleteYarnUseHttp (ids) {
                this.$post('product/purpose/delete', ids).then(res => {
                    if (res.data.status === 200) {
                        this.getYarnUseListHttp();
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 原料的删除
            deleteMaterialIngredientEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.isError = false;
                    this.checkArr.forEach((item) => {
                        item.auditState === 3 ? this.isError = true : false;
                        ids.push(item.id);
                    });
                    if (this.isError === false) {
                        this.pubPromptMsg = '确认删除?';
                        this.pubPromptState = true;
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '包含已审核对象，不能删除!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            deleteMaterialIngredientHttp (ids) {
                this.$post('product/component/delete', ids).then(res => {
                    if (res.data.status === 200) {
                        // 保存原料成分的请求
                        this.getMaterialIngredientListHttp();
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            deleteSpinningProcessEvent () {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.isError = false;
                    this.checkArr.forEach((item) => {
                        item.auditState === 3 ? this.isError = true : false;
                        ids.push(item.id);
                    });
                    if (this.isError === false) {
                        this.pubPromptMsg = '确认删除?';
                        this.pubPromptState = true;
                    } else {
                        this.$Modal.warning({
                            title: '提示',
                            content: '包含已审核对象，不能删除!'
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            deleteSpinningProcessHttp (ids) {
                this.$post('product/technology/delete', ids).then(res => {
                    if (res.data.status === 200) {
                        // 保存原料成分的请求
                        this.getSpinningProcessListHttp();
                        this.deleteButtonLoading = false;
                        this.pubPromptState = false;
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 原料成分的审核事件
            getMaterialIngredientAuditEvent (e) {
                if (this.checkArr.length !== 0) {
                    let ids = [];
                    this.checkArr.forEach((item) => ids.push(item.id));
                    if (e === '审核') {
                        this.$post('product/component/approve', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getMaterialIngredientListHttp();
                                noticeTips(this, 'auditTips');
                            }
                        });
                    } else if (e === '反审核') {
                        this.$post('product/component/cancel', ids).then(res => {
                            if (res.data.status === 200) {
                                this.getMaterialIngredientListHttp();
                                noticeTips(this, 'unAuditTips');
                            }
                        });
                    }
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 新增纱线用途
            addYarnUseEvent () {
                this.disableConfirm = false;
                this.editId = null;
                this.saveModalState = true;
                this.showOther = false;
                this.saveModalTitle = '新增纱线用途';
            },
            // 新增纺纱工艺
            addSpinningProcessEvent () {
                this.disableConfirm = false;
                this.editId = null;
                this.saveModalState = true;
                this.showOther = false;
                this.saveModalTitle = '新增纺纱工艺';
            },
            // 获取辅助属性的详情
            getDetailHttp (id) {
                this.$fetch(api.getAttrDetail(id)).then((res) => {
                    if (res.data.status === 200) {
                        // 拼接展示属性值和属性编码
                        let attrValue = '';
                        let attrCode = '';
                        res.data.res.values.forEach((items) => {
                            attrValue += items.name + '、';
                            attrCode += items.code + '、';
                        });
                    };
                });
            },
            // 公共提示框的取消按钮
            pubPromptCancel () {
                this.deleteButtonLoading = false;
                this.pubPromptState = false;
            },
            // 监听新增和编辑的modal状态
            adEdModalStateChange (e) {
                if (e === false) {
                    this.buttonLoading = false;
                    this.disableCode = false;
                    this.addTableData.rows = JSON.parse(JSON.stringify(this.initTableData));
                    this.$refs['formValidate'].resetFields();
                }
            },
            // 新增物料
            addMaterielAttrEvent () {
                this.editAttrId = null;
                this.adEdModalState = true;
                this.materielTitle = '新增物料属性';
            },
            // 新增行的方法
            addRowEvent (index) {
                this.addTableData.rows.splice(index + 1, 0, {
                    name: '',
                    code: ''
                });
            },
            // 新增的请求
            addMaterialHttp () {
                this.$post(api.attrSave(),
                    {
                        'id': this.editAttrId,
                        'name': this.formValidate.materielName,
                        'code': this.formValidate.materielCode,
                        'values': this.addTableData.rows
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.buttonLoading = false;
                        this.adEdModalState = false;
                        noticeTips(this, 'saveTips');
                        // 调用获取列表的请求
                        this.getAttrList();
                    } else if (res.data.status === 415) {
                        this.adEdModalState = false;
                        this.buttonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 新增和编辑的确认按钮
            materielConfirm () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        let contain = [];// 过滤空
                        this.addTableData.rows.forEach((items) => items.code !== '' || items.name !== '' ? contain.push(items) : false);
                        this.addTableData.rows = contain;
                        this.addMaterialHttp();
                    } else {
                        // noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 新增和编辑的取消按钮
            materielCancel () {
                this.adEdModalState = false;
            },
            // 编辑的按钮
            editMateriel (obj, index, id) {
                this.editAttrId = id;
                this.disableCode = true;
                this.materielTitle = '编辑物料属性';
                this.$fetch(api.getAttrDetail(this.editAttrId)).then((res) => {
                    if (res.data.status === 200) {
                        this.formValidate.materielCode = res.data.res.code;
                        this.formValidate.materielName = res.data.res.name;
                        if (res.data.res.values.length !== 0) {
                            this.addTableData.rows = res.data.res.values;
                        } else {
                            // 为空时，内部表格为初始值
                            this.addTableData.rows = JSON.parse(JSON.stringify(this.initTableData));
                        };
                    };
                    this.adEdModalState = true;
                });
            },
            // 删除的按钮
            removeMateriel (id, index) {
                this.deleteId = id;
                this.pubPromptMsg = '确定删除?';
                this.pubPromptState = true;
            },
            // 新增内部表格行的删除限制
            removeRowEvent (index) {
                if (this.addTableData.rows.length > 1) {
                    this.addTableData.rows.splice(index, 1);
                };
            },
            // 获取列表的请求
            getAttrList () {
                this.deleteId = null;
                this.$fetch(api.getAttrList()).then((res) => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                    };
                });
            },
            getMaterialAttrListHttp () {
                this.$fetch(api.getAttrList()).then((res) => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.$store.dispatch({type: 'hideLoading'});
                    };
                });
            },
            getMaterialIngredientListHttp () {
                this.$api.attr.productComponentList({codeName: ''}).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.$store.dispatch({type: 'hideLoading'});
                        this.materialIngredientData = translateState(res.data.res);
                    };
                });
            },
            // 纱线用途
            getYarnUseListHttp () {
                this.$api.attr.productPurposeList({codeName: ''}).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.yarnUseData = translateState(res.data.res);
                    };
                });
            },
            // 纺纱工艺
            getSpinningProcessListHttp () {
                this.$api.attr.productTechnologyList({codeName: ''}).then(res => {
                    if (res.data.status === 200) {
                        this.checkArr = [];
                        this.spinningProcessData = translateState(res.data.res);
                    };
                });
            }
        },
        created () {
            this.$store.dispatch({type: 'showLoading'});
            this.getMaterialIngredientListHttp();
        },
        mounted () {
            window.onresize = () => {
                this.tableHeight = compClientHeight(230);
            };
        }
    };
</script>

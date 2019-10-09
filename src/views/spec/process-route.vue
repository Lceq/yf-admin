<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" :gutter="4">
            <Col >
                <Button icon="md-add" type="primary" @click="addClickEvent">新增</Button>
                <Dropdown class="operatingSpaceMargin" @on-click="getPushEvent" trigger="click">
                    <Button type="primary">
                        提交
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="pushSwitch" name="提交">提交</DropdownItem>
                        <DropdownItem :disabled="cancelSwitch" name="撤销">撤销</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="operatingSpaceMargin" @on-click="getAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="unAuditSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Modal
                v-model="saveModalState"
                :title="saveModalTitle"
                :width="1000"
                @on-visible-change="saveModalStateChangeEvent"
                :mask-closable="false"
        >
            <Form :label-width="100"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col>
                        <FormItem label="工艺路线编码:" prop="processCodeIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.processCodeIpt" placeholder="请输入工艺路线编码"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="工艺路线名称:" prop="processNameIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.processNameIpt" placeholder="请输入工艺路线名称"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="投料工序:" class="formItemMargin">
                            <Select clearable v-model="formValidate.feedingProcessId" style="width:200px" @on-change="getSelectFeedingProcessEvent">
                                <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table size="small" height="400" :columns="saveModalTableHeader" border :data="saveModalTableData"></Table>
                    </Col>
                </Row>
                <div v-show="otherShow">
                    <operation-log
                            :operationData="operationData"
                    ></operation-log>
                </div>
            </Form>
            <div slot="footer" class="modalFooterStyle">
                <span class="editFormErrorStyle">{{ errorMsg }}</span>
                <div>
                    <Button :disabled="disableSaveModalConfirm" type="success" :loading="buttonLoading" @click="handleSubmit('formValidate')">确认</Button>
                    <Button class="cancelButton" @click="adEdCancel">取消</Button>
                </div>
            </div>
        </Modal>
        <tips-modal
                :v-model="promptState"
                :tipMsg="promptMsg"
                :loading="deleteButtonLoading"
                @cancel="promptCancel"
                @confirm="publicConfirm"
        >
        </tips-modal>
    </card>
</template>
<script>
    import tipsModal from '../public/deleteWarning';
    import { noticeTips, translateState, compClientHeight, getOperationData } from '../../libs/common';
    import processDetail from '../basicData/process/process-step';
    import operationLog from '../components/modal-operation-log';
    export default {
        name: 'processRoute',
        components: {
            tipsModal, processDetail, operationLog
        },
        data () {
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error());
                } else {
                    if (!/[\u4e00-\u9fa5]+/.test(value)) {
                        this.errorMsg = '';
                        callback();
                    } else {
                        // this.errorMsg = '编码格式不能为中文！';
                        callback(new Error());
                    };
                }
            };
            return {
                globalLoadingShow: false,
                operationData: [],
                unAuditSwitch: true,
                auditSwitch: true,
                cancelSwitch: true,
                pushSwitch: true,
                disableSaveModalConfirm: false,
                tableHeight: document.documentElement.clientHeight - 200,
                deleteButtonLoading: false,
                promptMsg: '',
                promptState: false,
                formValidate: {
                    processCodeIpt: '',
                    processNameIpt: '',
                    feedingProcessId: null,
                    feedingProcessCode: '',
                    feedingProcessName: '',
                },
                ruleValidate: {
                    processCodeIpt: [{ required: true, validator: validateCode, trigger: 'blur' }],
                    processNameIpt: [{ required: true, trigger: 'blur' }]
                },
                errorMsg: '',
                processList: [],
                tableHeader: [
                    {
                        title: '选择',
                        width: 80,
                        align: 'center',
                        key: 'checkBox',
                        render: (h, params) => {
                            return h('div', [
                                h('Checkbox', {
                                    props: {
                                        value: params.row.checkBox
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.tableData.forEach((items) => {
                                                this.$set(items, 'checkBox', false);
                                            });
                                            this.tableData[params.index].checkBox = e;
                                            if (e === true) {
                                                this.getCheckBoxEvent(this.tableData[params.index]);
                                            } else {
                                                this.getCheckBoxEvent(null);
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '工艺路线编码',
                        key: 'code',
                        sortable: 'true',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    domProps: {
                                        innerHTML: params.row.code
                                    },
                                    on: {
                                        click: () => {
                                            this.editPathEvent(params.row.auditState, params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '工艺路线名称',
                        key: 'name',
                        align: 'left',
                        sortable: 'true',
                        width: 160
                    },
                    {
                        title: '工序明细',
                        key: 'pathProcessList',
                        align: 'left',
                        sortable: 'true',
                        minWidth: 400,
                        render: (h, params) => {
                            return h('div', [
                                h(processDetail, {
                                    props: {
                                        processCombinateData: params.row.pathProcessList
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '数据状态',
                        key: 'auditStateName',
                        align: 'center',
                        sortable: 'true',
                        width: 100
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
                        align: 'center',
                        render: (h, params) => {
                            let disableDeleteButton = false;
                            params.row.auditState === 1 ? disableDeleteButton = false : disableDeleteButton = true;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        disabled: disableDeleteButton
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
                disableDeleteButton: false,
                tableData: [],
                saveModalState: false,
                saveModalTitle: '',
                saveModalTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '调整位置',
                        align: 'center',
                        width: 110,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    domProps: {
                                        innerHTML: '上移'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        'click': () => {
                                            if (params.index !== 0) {
                                                let obj = JSON.parse(JSON.stringify(params.row));
                                                this.saveModalTableData.splice(params.index, 1);
                                                this.saveModalTableData.splice(params.index - 1, 0, obj);
                                            }
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    domProps: {
                                        innerHTML: '下移'
                                    },
                                    on: {
                                        'click': () => {
                                            if (parseFloat(params.index + 1) !== this.saveModalTableData.length) {
                                                let obj = JSON.parse(JSON.stringify(params.row));
                                                this.saveModalTableData.splice(params.index, 1);
                                                this.saveModalTableData.splice(params.index + 1, 0, obj);
                                            }
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 100,
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
                                            this.addButtonClick(params.index);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'
                                    },
                                    style: {},
                                    on: {
                                        click: () => {
                                            this.reduceButtonClick(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '工序',
                        key: 'processId',
                        minWidth: 140,
                        render: (h, params) => {
                            return h('div', [
                                h('Select', {
                                    props: {
                                        // 将选中的vl属性赋值给select
                                        value: this.saveModalTableData[params.index].processId,
                                        placeholder: '请选择工序',
                                        transfer: true
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.values.forEach((item) => {
                                                if (item.id === event) {
                                                    this.saveModalTableData[params.index].processCode = item.code;
                                                    this.saveModalTableData[params.index].processName = item.name;
                                                }
                                            });
                                            // 新增一个vl属性用于保存选中的项
                                            this.saveModalTableData[params.index].processId = event;
                                        }
                                    }
                                }, params.row.values.map((items) => {
                                    return h('Option', {
                                        props: {
                                            label: items.label,
                                            value: items.value
                                        },
                                        style: {
                                            marginLeft: items.renderStyle
                                        }
                                    });
                                }))
                            ]);
                        }
                    },
                    /* {
                        title: '前置工序',
                        key: 'preProcessId',
                        align: 'left',
                        width: 150,
                        render: (h, params) => {
                            return h('Select', {
                                props: {
                                    placeholder: '请选择工序',
                                    value: params.row.preProcessId,
                                    clearable: true
                                },
                                on: {
                                    'on-change': (e) => {
                                        if (e) {
                                            params.row.preProcessId = e;
                                            params.row.preProcessCode = params.row.values.find(x => x.id === e).code;
                                            params.row.preProcessName = params.row.values.find(x => x.id === e).name;
                                        } else {
                                            params.row.preProcessId = '';
                                            params.row.preProcessCode = '';
                                            params.row.preProcessName = '';
                                        }
                                        this.saveModalTableData[params.index] = params.row;
                                    }
                                }
                            }, params.row.values.map((items) => {
                                return h('Option', {
                                    props: {
                                        label: items.label,
                                        value: items.value
                                    },
                                    style: {
                                        marginLeft: items.renderStyle
                                    }
                                });
                            }));
                        }
                    }, */
                    {
                        title: '上机准备时间(小时)',
                        key: 'preparationHours',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.preparationHours,
                                        min: 0
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.preparationHours = e;
                                            this.saveModalTableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '前道提前时间(小时)',
                        key: 'feedingHours',
                        align: 'center',
                        width: 130,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.feedingHours,
                                        min: 0
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.feedingHours = e;
                                            this.saveModalTableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '是否报工',
                        key: 'isReport',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('Checkbox', {
                                    props: {
                                        value: params.row.isReport
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.isReport = e;
                                            this.saveModalTableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                saveModalTableData: [],
                initModalTableData: {
                    preProcessId: '',
                    preProcessCode: '',
                    preProcessName: '',
                    values: [],
                    processId: null,
                    processCode: '',
                    processName: '',
                    isReport: false,
                    preparationHours: 0,
                    feedingHours: 0
                },
                buttonLoading: false,
                deleteId: '',
                editId: '',
                otherShow: true,
                checkObj: null
            };
        },
        methods: {
            getSelectFeedingProcessEvent (id) {
                if (id) {
                    this.processList.forEach((item) => {
                        if (id === item.id) {
                            this.formValidate.feedingProcessId = item.id;
                            this.formValidate.feedingProcessCode = item.code;
                            this.formValidate.feedingProcessName = item.name;
                        };
                    });
                } else {
                    this.formValidate.feedingProcessId = null;
                    this.formValidate.feedingProcessCode = '';
                    this.formValidate.feedingProcessName = '';
                };
            },
            // 勾选的事件
            getCheckBoxEvent (e) {
                this.checkObj = e;
                if (e) {
                    if (e.auditState === 1) {
                        this.pushSwitch = false;
                        this.cancelSwitch = true;
                        this.auditSwitch = true;
                        this.unAuditSwitch = true;
                    } else if (e.auditState === 2) {
                        this.pushSwitch = true;
                        this.cancelSwitch = false;
                        this.auditSwitch = false;
                        this.unAuditSwitch = true;
                    } else if (e.auditState === 3) {
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.auditSwitch = true;
                        this.unAuditSwitch = false;
                    };
                } else {
                    this.pushSwitch = true;
                    this.cancelSwitch = true;
                    this.auditSwitch = true;
                    this.unAuditSwitch = true;
                };
            },
            // 提交的事件
            getPushEvent (e) {
                if (this.checkObj) {
                    let ids = [];
                    ids.push(this.checkObj.id);
                    if (e === '提交' && this.pushSwitch === false) {
                        this.$api.path.submitHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'submitTips');
                                this.checkObj = null;
                                this.getListHttpHttp();
                            };
                        });
                    } else if (e === '撤销' && this.cancelSwitch === false) {
                        this.$api.path.cancelHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'cancelTips');
                                this.checkObj = null;
                                this.getListHttpHttp();
                            };
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                }
            },
            // 审核的事件
            getAuditEvent (e) {
                if (this.checkObj) {
                    let ids = [];
                    ids.push(this.checkObj.id);
                    if (e === '审核' && this.auditSwitch === false) {
                        this.$api.path.approveHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkObj = null;
                                noticeTips(this, 'auditTips');
                                this.getListHttpHttp();
                            };
                        });
                    } else if (e === '反审核' && this.unAuditSwitch === false) {
                        this.$api.path.unapproveHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                noticeTips(this, 'unAuditTips');
                                this.checkObj = null;
                                this.getListHttpHttp();
                            };
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 删除的方法
            promptCancel () {
                this.promptState = false;
                this.deleteButtonLoading = false;
            },
            publicConfirm () {
                this.deleteButtonLoading = true;
                this.$api.path.deleteHttp([this.deleteId]).then(res => {
                    if (res.data.status === 200) {
                        this.promptState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttpHttp();
                        noticeTips(this, 'deleteTips');
                    } else {
                        this.promptState = false;
                        this.deleteButtonLoading = false;
                        this.$Loading.finish();
                    };
                });
            },
            // 删除的事件
            deleteEvent (id) {
                this.deleteId = id;
                this.promptState = true;
                this.promptMsg = '确认删除？';
            },
            // 监听保存modal的状态
            saveModalStateChangeEvent (e) {
                if (e === false) {
                    this.buttonLoading = false;
                    this.$refs['formValidate'].resetFields();
                    this.errorMsg = '';
                    this.formValidate.feedingProcessId = null;
                    this.formValidate.feedingProcessCode = '';
                    this.formValidate.feedingProcessName = '';
                    this.saveModalTableData = [JSON.parse(JSON.stringify(this.initModalTableData))];
                };
            },
            // modal内表格的添加事件
            addButtonClick (index) {
                this.saveModalTableData.splice(index + 1, 0, JSON.parse(JSON.stringify(this.initModalTableData)));
            },
            // 新增和编辑内表格的减少事件
            reduceButtonClick (index) {
                if (this.saveModalTableData.length > 1) {
                    this.saveModalTableData.splice(index, 1);
                };
            },
            getAddTableSelect () {},
            // 新增工艺的取消按钮
            adEdCancel () {
                this.saveModalState = false;
            },
            // 保存的请求
            saveHttp () {
                let params = {
                    'id': this.editId,
                    'name': this.formValidate.processNameIpt,
                    'code': this.formValidate.processCodeIpt,
                    'pathProcessList': this.saveModalTableData
                };
                this.$api.path.saveHttp(params).then((res) => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.saveModalState = false;
                        this.getListHttpHttp();
                        this.$refs['formValidate'].resetFields();
                        this.buttonLoading = false;
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 新增和编辑工艺的确认按钮
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        this.saveModalTableData.forEach((item) => { delete item.id; });
                        if (this.formValidate.feedingProcessId) {
                            this.saveModalTableData[0].preProcessId = this.formValidate.feedingProcessId;
                            this.saveModalTableData[0].preProcessCode = this.formValidate.feedingProcessCode;
                            this.saveModalTableData[0].preProcessName = this.formValidate.feedingProcessName;
                        } else {
                            this.saveModalTableData[0].preProcessId = null;
                            this.saveModalTableData[0].preProcessCode = '';
                            this.saveModalTableData[0].preProcessName = '';
                        };
                        // 赋值前置工序
                        this.getPreProcessMethod();
                        this.saveHttp();
                    } else {
                        /* if (this.formValidate.processCodeIpt === '') {
                            this.errorMsg = '工艺路线编码不能为空！';
                        } else if (this.formValidate.processNameIpt === '') {
                            this.errorMsg = '工艺路线名称不能为空！';
                        }; */
                        /[\u4e00-\u9fa5]+/.test(this.formValidate.processCodeIpt) ? this.$Message.warning('编码格式不能为中文!') : noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 获取前置工序
            getPreProcessMethod () {
                this.saveModalTableData.forEach((item, index) => {
                    if (index !== 0) {
                        this.saveModalTableData[index].preProcessId = this.saveModalTableData[index - 1].processId;
                        this.saveModalTableData[index].preProcessCode = this.saveModalTableData[index - 1].processCode;
                        this.saveModalTableData[index].preProcessName = this.saveModalTableData[index - 1].processName;
                    };
                });
            },
            // 新增的方法
            addClickEvent () {
                this.editId = null;
                this.disableSaveModalConfirm = false;
                this.otherShow = false;
                this.saveModalTitle = '新增工艺路线';
                this.saveModalState = true;
            },
            // 编辑事件
            editPathEvent (auditState, id) {
                this.otherShow = true;
                this.saveModalTitle = '编辑工艺路线';
                auditState === 1 ? this.saveModalTitle = '编辑工艺路线' : this.saveModalTitle = '工艺路线详情';
                this.saveModalState = true;
                this.editId = id;
                auditState === 1 ? this.disableSaveModalConfirm = false : this.disableSaveModalConfirm = true;
                this.$api.path.detailHttp({ id: id }).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.operationData = getOperationData(responseData);
                        this.formValidate.feedingProcessId = responseData.pathProcessList[0].preProcessId;
                        this.formValidate.feedingProcessCode = responseData.pathProcessList[0].preProcessCode;
                        this.formValidate.feedingProcessName = responseData.pathProcessList[0].preProcessName;
                        this.formValidate.processCodeIpt = responseData.code;
                        this.formValidate.processNameIpt = responseData.name;
                        responseData.pathProcessList.forEach(item => this.$set(item, 'values', this.processList));
                        this.saveModalTableData = responseData.pathProcessList;
                    };
                });
            },
            getListHttpHttp () {
                this.$api.path.listHttp().then(res => {
                    if (res.data.status === 200) {
                        this.tableData = translateState(res.data.res);
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.auditSwitch = true;
                        this.unAuditSwitch = true;
                        this.globalLoadingShow = false;
                    }
                });
            },
            getProcessList () {
                this.$call('process.list2').then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((processItem) => {
                            processItem.value = processItem.id;
                            processItem.label = processItem.name;
                        });
                        this.processList = res.data.res;
                        this.initModalTableData.values = res.data.res;
                        this.saveModalTableData = [JSON.parse(JSON.stringify(this.initModalTableData))];
                    };
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getProcessList(); // 获取没有子工序的工序
            this.getListHttpHttp(); // 获取列表数据
        },
        mounted () {
            window.onresize = () => {
                this.tableHeight = compClientHeight(200);
            };
        }
    };
</script>


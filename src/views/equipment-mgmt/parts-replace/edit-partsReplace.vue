<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row>
            <Col :sm="12" :md="8" :lg="6">
                <Button icon="md-add" type="primary" class="margin-bottom-10" @click="addEvent">新增</Button>
                <Button icon="md-checkmark" class="margin-bottom-10" v-if="addSwitch" type="primary" @click="saveButtonEvent">保存</Button>
                <Button icon="ios-create" class="margin-bottom-10" v-if="pushSwitch" type="primary" @click="pushButtonEvent">提交</Button>
                <Button icon="ios-undo" class="margin-bottom-10" v-if="cancelSwitch" type="warning" @click="clickCancelEvent">撤销提交</Button>
                <Button icon="md-done-all" class="margin-bottom-10" v-if="auditSwitch" type="primary" @click="auditEvent">审核</Button>
                <Button icon="md-refresh" class="margin-bottom-10" v-if="againstSwitch" type="warning" @click="unAuditEvent">撤销审核</Button>
            </Col>
        </Row>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
            <div class="tableOffsetTop">
                <Row type="flex">
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="单据编号:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.billCodeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="单据日期:" class="formItemMargin" prop="billDateValue">
                            <DatePicker class="widthPercentage" :editable="false" :readonly="disableDatePicker" :disabled="disableDatePicker" v-model="formValidate.billDateValue" type="date" placeholder="请选择单据日期"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="单据来源:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{billSourceNameValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="来源单号:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.sourceCodeValue}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="生产车间:" prop="workshopValue" class="formItemMargin">
                            <Select @on-change="getWorkshopEvent" v-model="formValidate.workshopValue" placeholder="请选择生产车间">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="设备编号:" prop="machineCodeValue" class="formItemMargin">
                            <div class="flex-left" v-if="formValidate.isAuxiliary">
                                <Select
                                        class="remoteSearchSelect"
                                        filterable
                                        placeholder="请输入设备编号"
                                        transfer
                                        clearable
                                        v-model="formValidate.machineCodeValue"
                                        @on-change="getSelectMachineChangeEvent"
                                        @on-clear="clearMachineEvent"
                                >
                                    <Option v-for="(option, index) in remoteMachineList" :value="option.code" :key="option.id">{{ `${option.name}(${option.code})` }}</Option>
                                </Select>
                                <Button @click="getSearchMachineEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
                            <div v-else class="read-only-item">{{formValidate.machineCodeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="设备名称:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.machineNameValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="所属工序:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.processNameValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="是否生产主机:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.isAuxiliary ? '是' : '否'}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="单据状态:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{formValidate.auditStateValue}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="领用状态:" class="formItemMargin">
                            <Select v-model="formValidate.UsedStateValue" placeholder="请选择领用状态">
                                <Option v-for="item in UsedStateList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="5">
                        <FormItem label="领用单号:" class="formItemMargin">
                            <Input v-model="formValidate.machineUsedCodeValue" placeholder="领用单号自动生成"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="10">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input class="textAreaWidth" v-model="remarkValue" :autosize="{ minRows: 2, maxRows: 2 }" type="textarea" placeholder="请输入" />
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col span="24">
                    <Tabs v-model="activeTabPane">
                        <TabPane label="配件列表" name="0">
                            <Table :height="listTableHeight" border size="small" stripe :columns="tableHeader" :data="tableData"></Table>
                        </TabPane>
                        <TabPane label="其他信息" name="1">
                            <operation-log :operationData="operationData"></operation-log>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
            <Row>
                <Col>
                    <select-machine-modal
                            :selectMachineModalState="selectMachineModalState"
                            :selectMachineTableData="selectMachineTableData"
                            :selectMachineConfirmLoading="selectMachineConfirmLoading"
                            :selectMachineTableLoading="selectMachineTableLoading"
                            :selectMachineModalProcessList="selectMachineModalProcessList"
                            @selectMachineModalSearchEvent="selectMachineModalSearchEvent"
                            @selectMachineModalProcessEvent="selectMachineModalProcessEvent"
                            @selectMachineModalStateChangeEvent="selectMachineModalStateChangeEvent"
                            @selectMachineModalConfirmEvent="selectMachineModalConfirmEvent"
                            @selectMachineModalCancelEvent="selectMachineModalCancelEvent"
                    >
                    </select-machine-modal>
                </Col>
            </Row>
            <Row>
                <Col>
                    <select-parts-modal
                            :selectPartsModalState="selectPartsModalState"
                            :selectPartsTableHeader="selectPartsTableHeader"
                            :selectPartsTableData="selectPartsTableData"
                            :selectPartsConfirmLoading="selectPartsConfirmLoading"
                            :selectPartsTableLoading="selectPartsTableLoading"
                            @selectPartsModalStateEvent="selectPartsModalStateEvent"
                            @singleClickPartsRowEvent="singleClickPartsRowEvent"
                            @doubleClickPartsRowEvent="doubleClickPartsRowEvent"
                            @confirm="selectPartsConfirmEvent"
                            @cancel="selectPartsCancelEvent"
                    >
                    </select-parts-modal>
                </Col>
            </Row>
        </Form>
    </card>
</template>
<script>
    let _this = this;
    import { noticeTips, compClientHeight, clearSpace, getOperationData, emptyTips } from '../../../libs/common';
    import selectMachineModal from './components/selectMachineModal';
    import selectPartsModal from './components/selectPartsModal';
    import operationLog from '../../components/operation-log';
    export default {
        name: 'edit-parts-replace',
        components: {
            selectMachineModal, selectPartsModal, operationLog
        },
        data () {
            const validateBillDateValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateWorkshopValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateBillSourceValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateSourceCodeValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateMachineCodeValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            return {
                globalLoadingShow: false,
                machineList: [],
                remoteMachineList: [],
                operationData: [],
                activeTabPane: '0',
                selectMachineModalProcessList: [],
                selectModalMachineCode: '',
                selectMachineModalProcessValue: null,
                toCreated: false,
                isActivating: false,
                billSourceNameValue: '',
                listTableHeight: document.documentElement.clientHeight - 450,
                addSwitch: true,
                pushSwitch: true,
                cancelSwitch: true,
                auditSwitch: true,
                againstSwitch: true,
                machineIdValue: null,
                selectPartsModalState: false,
                selectPartsTableLoading: false,
                selectPartsTableHeader: [
                    {
                        title: '配件编号',
                        key: 'code',
                        sortable: true
                    },
                    {
                        title: '配件名称',
                        key: 'name',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '规格',
                        key: 'models',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        align: 'center',
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    }
                ],
                selectPartsTableData: [],
                selectPartsConfirmLoading: false,
                selectMachineTableData: [],
                selectMachineConfirmLoading: false,
                selectMachineTableLoading: false,
                selectMachineModalState: false,
                remarkValue: '',
                workshopList: [],
                UsedStateList: [],
                formValidate: {
                    billCodeValue: '',
                    billSourceValue: '',
                    billDateValue: '',
                    sourceCodeValue: '',
                    workshopValue: '',
                    machineCodeValue: '',
                    machineNameValue: '',
                    processValue: null,
                    processNameValue: '',
                    auditStateValue: '',
                    UsedStateValue: '',
                    machineUsedCodeValue: ''
                },
                ruleValidate: {
                    billDateValue: [{required: true, validator: validateBillDateValue, trigger: 'change'}],
                    workshopValue: [{ required: true, validator: validateWorkshopValue, trigger: 'change' }],
                    billSourceValue: [{ required: true, validator: validateBillSourceValue, trigger: 'change' }],
                    sourceCodeValue: [{ required: true, validator: validateSourceCodeValue, trigger: 'change' }],
                    machineCodeValue: [{required: true, validator: validateMachineCodeValue, trigger: 'change'}]
                },
                tableHeader: [
                    {title: '序号', type: 'index', width: 80, align: 'center'},
                    {
                        title: '操作',
                        width: 100,
                        align: 'center',
                        render: (h, param) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        icon: 'md-add',
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            _this.clickAddEvent(param.index);
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        icon: 'md-remove',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '4px'
                                    },
                                    on: {
                                        'click': () => {
                                            _this.clickRemoveEvent(param.row.id, param.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '配件编号',
                        key: 'productCode',
                        minWidth: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex',
                                    paddingTop: '2px'
                                }
                            }, [
                                h('Select', {
                                    props: {
                                        value: params.row.productCode,
                                        icon: 'ios-search',
                                        filterable: true,
                                        transfer: true,
                                        // remote: true,
                                        clearable: true,
                                        placeholder: '请输入配件编号',
                                        /*remoteMethod: (e) => {
                                            if (e) {
                                                setTimeout(() => {
                                                    params.row.productList = params.row.remoteProductList.filter((item) => {
                                                        return item.code.toLowerCase().indexOf(e.toLowerCase()) > -1 || item.name.indexOf(e) > -1;
                                                    });
                                                    _this.tableData[params.index] = params.row;
                                                }, 200);
                                            } else {
                                                params.row.productList = [];
                                            }
                                        }*/
                                    },
                                    on: {
                                        'on-clear': () => {
                                            params.row.productId = null;
                                            params.row.productCode = ''
                                            params.row.productName = '';
                                            params.row.productModels = '';
                                            params.row.unitId = null;
                                            params.row.unitCode = '';
                                            params.row.unitName = '';
                                            _this.tableData[params.index] = params.row;
                                        },
                                        'on-change': (e) => {
                                            if (e) {
                                                params.row.productCode = e;
                                                params.row.remoteProductList.forEach((item) => {
                                                    if (item.code === e) {
                                                        params.row.productId = item.id;
                                                        params.row.productCode = item.code;
                                                        params.row.productName = item.name;
                                                        params.row.productModels = item.models;
                                                        params.row.unitId = item.unitId;
                                                        params.row.unitCode = item.unitCode;
                                                        params.row.unitName = item.unitName;
                                                    };
                                                });
                                                _this.tableData[params.index] = params.row;
                                            }
                                        }
                                    }
                                }, params.row.remoteProductList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.code,
                                            label: `${item.name}(${item.code})`
                                        }
                                    });
                                })),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search',
                                        size: 'small'
                                    },
                                    style: {
                                        marginLeft: '-2px',
                                        zIndex: '99'
                                    },
                                    on: {
                                        'click': () => {
                                            _this.clickPartEvent(params.index, params.row.id, params.row.productCode);
                                        }
                                    }
                                })
                            ]);
                        }

                    },
                    {title: '配件名称', key: 'productName', minWidth: 100, align: 'center'},
                    {title: '规格', key: 'productModels', minWidth: 100, align: 'center'},
                    {title: '计量单位', key: 'unitName', minWidth: 100, align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {title: '备注', key: 'remarks', minWidth: 160, align: 'center',
                        render: (h, param) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        value: param.row.remarks,
                                        type: 'textarea',
                                        autosize: {maxRows: 1, minRows: 1}
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            param.row.remarks = e.target.value;
                                            _this.tableData[param.index] = param.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {title: '申请数量', key: 'qty', width: 200, align: 'center',
                        render: (h, param) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: param.row.qty,
                                        min: 1
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            param.row.qty = e;
                                            _this.tableData[param.index] = param.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                tableData: [
                    {
                        ordinal: 1,
                        productCode: '',
                        productId: null,
                        productName: '',
                        productModels: '',
                        unitName: '',
                        qty: null,
                        remarks: '',
                        remoteProductList: [],
                        productList: []
                    }
                ],
                initTableData: {
                    ordinal: 1,
                    productCode: '',
                    productId: null,
                    productName: '',
                    productModels: '',
                    unitName: '',
                    qty: null,
                    remarks: '',
                    remoteProductList: [],
                    productList: []
                },
                remoteProductList: [],
                disableDatePicker: false,
                clickMachineObj: null,
                clickMachineIndex: '',
                clickPartsIndex: '',
                clickPartsObj: null,
                editId: ''
            };
        },
        methods: {
            addEvent () {
                this.$router.push({
                    path: 'addPartsReplace',
                    query: {activated: true}
                })
            },
            clearMachineEvent () {
                this.$set(this.formValidate, 'machineCodeValue', '');
                this.formValidate.machineNameValue = '';
                this.formValidate.processValue = null;
                this.formValidate.processNameValue = '';
                this.machineIdValue = null;
                this.clickMachineObj = null;
                this.selectMachineTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
            },
            getSelectMachineChangeEvent (e) {
                this.remoteMachineList.forEach((item)=>{
                    if (e === item.code) {
                        this.clickMachineObj = item;
                        this.machineIdValue = item.id;
                        this.$set(this.formValidate, 'processValue', item.processId);
                        this.$set(this.formValidate, 'processNameValue', item.processName);
                        this.$set(this.formValidate, 'machineCodeValue', item.code);
                        this.$set(this.formValidate, 'machineNameValue', item.name);
                    };
                });
            },
            // 获取车间的事件
            getWorkshopEvent (e) {
                this.getAllMachineList();
                this.machineIdValue = null;
                this.formValidate.machineCodeValue = null;
                this.formValidate.machineNameValue = '';
                this.formValidate.processValue = null;
                this.formValidate.processNameValue = '';
                this.formValidate.machineNameValue = '';
            },
            // 选择设备modal的工序事件
            selectMachineModalProcessEvent (e) {
                this.selectMachineModalProcessValue = e;
                this.clickGetMachineHttp();
            },
            // 选择设备modal的搜索事件
            selectMachineModalSearchEvent (data) {
                this.selectModalMachineCode = data.machineCode;
                this.selectMachineModalProcessValue = data.processId;
                this.clickGetMachineHttp();
            },
            // 监听选配件的modal状态
            selectPartsModalStateEvent (e) {
                this.selectPartsModalState = e;
            },
            // 监听选择机台modal的状态
            selectMachineModalStateChangeEvent (e) {
                this.selectMachineModalState = e;
                if (e === false) {
                    this.selectModalMachineCode = '';
                    this.selectMachineModalProcessValue = null;
                };
            },
            // 提交的事件
            pushButtonEvent () {
                this.globalLoadingShow = true;
                this.saveHttp().then(res => {
                    if (res.data.status === 200) {
                        this.$api.parts.submitHttp([this.editId]).then(res => {
                            if (res.data.status === 200) {
                                this.getDetailHttp();
                                noticeTips(this, 'submitTips');
                            };
                        });
                    };
                });
            },
            clickCancelEvent () {
                this.globalLoadingShow = true;
                this.$api.parts.cancelHttp([this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'cancelTips');
                    };
                });
            },
            auditEvent () {
                this.globalLoadingShow = true;
                this.$api.parts.approveHttp([this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'auditTips');
                    };
                });
            },
            unAuditEvent () {
                this.globalLoadingShow = true;
                this.$api.parts.unApproveHttp([this.editId]).then(res => {
                    if (res.data.status === 200) {
                        this.getDetailHttp();
                        noticeTips(this, 'unAuditTips');
                    };
                });
            },
            // 菜单的点击事件
            getClickMenuEvent (e) {
                if (e === 1) {
                    this.addSwitch = true;
                    this.pushSwitch = true;
                    this.cancelSwitch = false;
                    this.auditSwitch = false;
                    this.againstSwitch = false;
                    this.deleteSwitch = true;
                } else if (e === 2) {
                    this.addSwitch = false;
                    this.pushSwitch = false;
                    this.cancelSwitch = true;
                    this.auditSwitch = true;
                    this.againstSwitch = false;
                    this.deleteSwitch = false;
                } else if (e === 3) {
                    this.addSwitch = false;
                    this.pushSwitch = false;
                    this.cancelSwitch = false;
                    this.auditSwitch = false;
                    this.againstSwitch = true;
                    this.deleteSwitch = false;
                } else if (e === 4) {
                    this.addSwitch = false;
                    this.pushSwitch = false;
                    this.cancelSwitch = false;
                    this.auditSwitch = false;
                    this.againstSwitch = false;
                    this.deleteSwitch = false;
                };
            },
            // 失去焦点请求配件
            blurGetPartsHttpEvent (obj, index, code) {
                this.$api.product.machineMaterial({ code: code }).then(res => {
                    if (res.data.status === 200) {
                        if (res.data.res.length === 1) {
                            let responseData = [];
                            responseData = res.data.res;
                            this.$set(this.tableData[index], 'productId', responseData[0].id);
                            this.$set(this.tableData[index], 'productName', responseData[0].name);
                            this.$set(this.tableData[index], 'productCode', responseData[0].code);
                            this.$set(this.tableData[index], 'productModels', responseData[0].models);
                            this.$set(this.tableData[index], 'unitName', responseData[0].unitName);
                        } else {
                            this.$set(this.tableData[index], 'productId', null);
                            this.$set(this.tableData[index], 'productName', '');
                            this.$set(this.tableData[index], 'productCode', '');
                            this.$set(this.tableData[index], 'productModels', '');
                            this.$set(this.tableData[index], 'unitName', '');
                        };
                    };
                });
            },
            // 搜索设备的事件
            getSearchMachineEvent () {
                this.selectMachineTableData = [];
                // this.selectModalMachineCode = this.formValidate.machineCodeValue;
                // this.selectMachineModalProcessValue = this.formValidate.processValue;
                this.selectMachineTableData = [];
                this.selectMachineTableLoading = true;
                this.selectMachineModalState = true;
                this.clickGetMachineHttp();
            },
            // 点击搜索获取设备的请求
            clickGetMachineHttp () {
                this.selectModalMachineCode = clearSpace(this.selectModalMachineCode);
                this.$post('machine/maintenance/repair/list', {
                    name: this.selectModalMachineCode,
                    processId: this.selectMachineModalProcessValue,
                    workshopId: this.formValidate.workshopValue
                }).then(res => {
                    if (res.data.status === 200) {
                        this.selectMachineTableLoading = false;
                        let responseData = res.data.res;
                        responseData.forEach((item) => {
                            if (item.id === this.machineIdValue) {
                                this.$set(item, 'singleClickStyle', true);
                            } else {
                                this.$set(item, 'singleClickStyle', false);
                            };
                        });
                        this.selectMachineTableData = responseData;
                    };
                });
            },
            saveHttp () {
                if (this.tableData[0].productCode !== '' && this.tableData[0].productName !== '') {
                    // 排除空值
                    let partsReplaceList = [];
                    this.tableData.forEach((item) => { if (item.productCode !== '') partsReplaceList.push(item); });
                    return this.$api.parts.saveHttp({
                        'id': this.editId,
                        'code': this.formValidate.billCodeValue,
                        'orderDate': this.formValidate.billDateValue,
                        'billSource': this.formValidate.billSourceValue,
                        'sourceCode': this.formValidate.sourceCodeValue,
                        'workshopId': this.formValidate.workshopValue,
                        'machineId': this.machineIdValue,
                        'machineCode': this.formValidate.machineCodeValue,
                        'machineName': this.formValidate.machineNameValue,
                        'processId': this.formValidate.processValue,
                        'usedStatus': this.formValidate.UsedStateValue,
                        'usedCode': this.formValidate.machineUsedCodeValue,
                        'remarks': this.remarkValue,
                        'partsReplaceOrderDetailList': partsReplaceList
                    });
                } else {
                    emptyTips(this, '配件不能为空!');
                };
            },
            // 保存的请求
            saveButtonEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.globalLoadingShow = true;
                        this.saveHttp().then(res => {
                            if (res.data.status === 200) {
                                this.getDetailHttp();
                                noticeTips(this, 'saveTips');
                            };
                        });
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 搜索配件的点击事件
            clickPartEvent (index, id, code) {
                this.selectPartsTableData = [];
                this.selectPartsModalState = true;
                this.selectPartsTableLoading = true;
                this.clickPartsIndex = index;
                this.getPartsHttp().then(res => {
                    if (res.data.status === 200) {
                        this.selectPartsTableLoading = false;
                        let responseData = res.data.res;
                        responseData.forEach((listItem) => {
                            this.tableData.forEach((tableItem) => {
                                if (listItem.id === tableItem.productId) {
                                    this.$set(listItem, 'singleClickStyle', true);
                                };
                            });
                        });
                        this.selectPartsTableData = responseData;
                    };
                });
            },
            // 获取配件的请求
            getPartsHttp (code = '') {
                return this.$api.product.machineMaterial({ code: code });
            },
            // 配件modal表格的单击
            singleClickPartsRowEvent (e, index) {
                this.clickPartsObj = e;
                this.selectPartsTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
                this.$set(this.selectPartsTableData[index], 'singleClickStyle', true);
            },
            // 配件modal表格的双击
            doubleClickPartsRowEvent (e, index) {
                this.clickPartsObj = e;
                this.selectPartsTableData.forEach((item) => { this.$set(item, 'singleClickStyle', false); });
                this.$set(this.selectPartsTableData[index], 'singleClickStyle', true);
                this.$set(this.tableData[this.clickPartsIndex], 'productList', [this.clickPartsObj]);
                this.$set(this.tableData[this.clickPartsIndex], 'productId', this.clickPartsObj.id);
                this.$set(this.tableData[this.clickPartsIndex], 'productCode', '');
                setTimeout(()=>{
                    this.$set(this.tableData[this.clickPartsIndex], 'productCode', this.clickPartsObj.code);
                },0);
                this.$set(this.tableData[this.clickPartsIndex], 'productName', this.clickPartsObj.name);
                this.$set(this.tableData[this.clickPartsIndex], 'productModels', this.clickPartsObj.models);
                this.$set(this.tableData[this.clickPartsIndex], 'unitId', this.clickPartsObj.unitId);
                this.$set(this.tableData[this.clickPartsIndex], 'unitCode', this.clickPartsObj.unitCode);
                this.$set(this.tableData[this.clickPartsIndex], 'unitName', this.clickPartsObj.unitName);
                this.selectPartsModalState = false;
            },
            // 配件modal的确认
            selectPartsConfirmEvent () {
                this.$set(this.tableData[this.clickPartsIndex], 'productId', this.clickPartsObj.id);
                this.$set(this.tableData[this.clickPartsIndex], 'productCode', this.clickPartsObj.code);
                this.$set(this.tableData[this.clickPartsIndex], 'productName', this.clickPartsObj.name);
                this.$set(this.tableData[this.clickPartsIndex], 'productModels', this.clickPartsObj.models);
                this.$set(this.tableData[this.clickPartsIndex], 'unitId', this.clickPartsObj.unitId);
                this.$set(this.tableData[this.clickPartsIndex], 'unitCode', this.clickPartsObj.unitCode);
                this.$set(this.tableData[this.clickPartsIndex], 'unitName', this.clickPartsObj.unitName);
                this.selectPartsModalState = false;
            },
            // 配件modal的取消
            selectPartsCancelEvent () {
                this.selectPartsModalState = false;
            },
            // 设备modal的双击
            selectMachineModalConfirmEvent (e, index) {
                this.machineIdValue = e.id;
                this.clickMachineObj = e;
                this.selectMachineTableData.forEach((item) => { this.$set(item, 'singleClickStyle', false); });
                this.$set(this.selectMachineTableData[index], 'singleClickStyle', true);
                this.formValidate.processValue = this.clickMachineObj.processId;
                this.$set(this.formValidate, 'machineCodeValue', '');
                setTimeout(() => { this.$set(this.formValidate, 'machineCodeValue', e.code); },0);
                this.formValidate.processNameValue = e.processName;
                this.formValidate.machineNameValue = this.clickMachineObj.name;
                this.selectMachineModalState = false;
            },
            selectMachineModalCancelEvent () {
                this.selectMachineModalState = false;
            },
            // 添加的按钮
            clickAddEvent (index) {
                this.tableData.splice(index + 1, 0, JSON.parse(JSON.stringify(this.initTableData)));
                this.initOrdinal(this.tableData);
            },
            // 删除的按钮
            clickRemoveEvent (id, index) {
                if (this.tableData.length > 1) {
                    this.tableData.splice(index, 1);
                    this.initOrdinal(this.tableData);
                };
            },
            initOrdinal (data) {
                data.forEach((item, index) => { delete item.id; });
            },
            getDetailHttp () {
                return this.$api.parts.detailHttp({id: this.editId}).then(res => {
                    if (res.data.status === 200) {
                        let responseData = null;
                        responseData = res.data.res;
                        this.operationData = getOperationData(res.data.res);
                        this.getClickMenuEvent(responseData.auditState);
                        // true为生产主机，false为辅助设备；为false时不可修改
                        this.formValidate.isAuxiliary = responseData.isAuxiliary;
                        this.formValidate.billCodeValue = responseData.code;
                        this.formValidate.billDateValue = responseData.orderDate;
                        this.formValidate.billSourceValue = responseData.billSource;
                        this.billSourceNameValue = responseData.billSourceName;
                        this.formValidate.sourceCodeValue = responseData.sourceCode;
                        this.formValidate.workshopValue = responseData.workshopId;
                        this.machineIdValue = responseData.machineId;
                        this.formValidate.machineCodeValue = '';
                        setTimeout(() => { this.formValidate.machineCodeValue = responseData.machineCode; }, 500);
                        this.formValidate.machineNameValue = responseData.machineName;
                        this.formValidate.processValue = responseData.processId;
                        this.formValidate.processNameValue = responseData.processName;
                        this.remarkValue = responseData.remarks;
                        this.formValidate.auditStateValue = responseData.auditStateName;
                        this.formValidate.UsedStateValue = JSON.stringify(responseData.usedStatus);
                        this.formValidate.machineUsedCodeValue = responseData.usedCode;
                        this.initOrdinal(responseData.partsReplaceOrderDetailList);
                        this.tableData = responseData.partsReplaceOrderDetailList.map((item)=>{
                            this.$set(item, 'remoteProductList', this.remoteProductList);
                            this.$set(item, 'productList', [{code: item.productCode, name: item.productName}]);
                            return item;
                        });
                        this.globalLoadingShow = false;
                    }
                });
            },
            getWorkshop () {
                return this.$post('user/data/workshops').then(res => {
                    if (res.data.status === 200) {
                        let responseData = [];
                        responseData = res.data.res;
                        if (responseData !== null) {
                            let isDefaultWorkshop = null;
                            responseData.forEach((item) => {
                                if (item.isDefault === 1) {
                                    isDefaultWorkshop = item.deptId;
                                };
                            });
                            isDefaultWorkshop !== null ? this.formValidate.workshopValue = isDefaultWorkshop : this.formValidate.workshopValue = responseData[0].deptId;
                            this.workshopList = responseData;
                        };
                    }
                });
            },
            getProcessList () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.selectMachineModalProcessList = res;
                });
            },
            // 获取所有机台
            getAllMachineList () {
                return this.$post('machine/maintenance/repair/list', {workshopId: this.formValidate.workshopValue}).then(res => {
                    if (res.data.status === 200) {
                        this.remoteMachineList = res.data.res;
                    };
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                this.listTableHeight = compClientHeight(tableDom.offsetHeight + 280);
                window.onresize = () => {
                    this.listTableHeight = compClientHeight(tableDom.offsetHeight + 280);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                this.editId = this.$route.query.editId;
                (async () => {
                    await this.getProcessList();
                    await this.getWorkshop();
                    await this.getAllMachineList();
                    await this.getPartsHttp().then(res => {
                        if (res.data.status === 200) {
                            this.remoteProductList = res.data.res;
                            this.tableData[0].remoteProductList = res.data.res;
                            this.initTableData.remoteProductList = res.data.res;
                        };
                    });
                    await this.getDetailHttp();
                })();
            }
        },
        mounted () {
            this.$nextTick(()=>{ this.calculationTableHeight(); });
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                setTimeout(() => {
                    this.$refs['formValidate'].resetFields();
                    this.getDependentDataHttp();
                },0)
            };
            this.$nextTick(()=>{ this.calculationTableHeight(); });
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style>
    .textAreaWidth{
        min-width:490px;
        max-width:780px;
    }
    .ivu-table .rowClassName td{
        color: red;
    }
</style>

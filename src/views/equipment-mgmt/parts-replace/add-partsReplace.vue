<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row>
            <Col class="margin-bottom-10">
                <Button icon="md-checkmark" @click="saveButtonEvent" type="primary">保存</Button>
                <Button icon="ios-create" @click="pushButtonEvent" type="primary">提交</Button>
            </Col>
        </Row>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
            <div class="tableOffsetTop">
                <Row type="flex">
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="单据编号:" class="formItemMargin">
                            <Input readonly v-model="formValidate.billCodeValue" placeholder="自动生成单据编号"></Input>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="单据日期:" class="formItemMargin" prop="billDateValue">
                            <DatePicker class="widthPercentage" :editable="false" :clearable="false" :readonly="disableDatePicker" :disabled="disableDatePicker" v-model="formValidate.billDateValue" type="date" placeholder="请选择单据日期"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="单据来源:" class="formItemMargin" prop="billSourceValue">
                            <Select :clearable="false" v-model="formValidate.billSourceValue" placeholder="请选择单据来源">
                                <Option v-for="item in billSourceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex">
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="来源单号:" class="formItemMargin">
                            <Input readonly v-model="formValidate.sourceCodeValue" placeholder="自动生成来源单号"></Input>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="生产车间:" prop="workshopValue" class="formItemMargin">
                            <Select :disabled="disableWorkshop" @on-change="getWorkshopEvent" v-model="formValidate.workshopValue" placeholder="请选择生产车间">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="设备编号:" prop="machineCodeValue" class="formItemMargin">
                            <div class="flex-left">
                                <Select
                                        class="remoteSearchSelect"
                                        filterable
                                        placeholder="请输入设备编号"
                                        remote
                                        transfer
                                        clearable
                                        v-model="formValidate.machineCodeValue"
                                        :remote-method="remoteMachineQueryChangeEvent"
                                        :loading="remoteMachineLoading"
                                        @on-change="getSelectMachineChangeEvent"
                                        @on-clear="clearMachineEvent"
                                        :disabled="disableMachineCode"
                                >
                                    <Option v-for="(option, index) in machineList" :value="option.code" :key="option.id">{{option.code}}</Option>
                                </Select>
                                <Button :disabled="disableMachineCode" @click="getSearchMachineEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="设备名称:" class="formItemMargin">
                            <Input readonly v-model="formValidate.machineNameValue"/>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="8" :lg="6">
                        <FormItem label="所属工序:" class="formItemMargin">
                            <Select readonly disabled v-model="formValidate.processValue" placeholder="">
                                <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="12">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input class="textAreaWidth" v-model="remarkValue" :autosize="{ minRows: 2, maxRows: 2 }" type="textarea" placeholder="请输入" />
                        </FormItem>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col span="24">
                    <FormItem label="配件列表:" class="formItemMargin">
                        <Table :height="listTableHeight" border size="small" stripe :columns="tableHeader" :data="tableData"></Table>
                    </FormItem>
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
    import { noticeTips, compClientHeight, clearSpace, formatDate, toDaySeconds, emptyTips } from '../../../libs/common';
    import selectMachineModal from './components/selectMachineModal';
    import selectPartsModal from './components/selectPartsModal';
    export default {
        components: {
            selectMachineModal, selectPartsModal
        },
        data () {
            const validateBillDateValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateWorkshopValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateBillSourceValue = (rule, value, callback) => { value || value === 0 ? callback() : callback(new Error('')); };
            const validateSourceCodeValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            const validateMachineCodeValue = (rule, value, callback) => { value ? callback() : callback(new Error('')); };
            return {
                globalLoadingShow: false,
                machineList: [],
                remoteMachineList: [],
                remoteMachineLoading: false,
                selectMachineModalProcessValue: null,
                selectModalMachineCode: '',
                selectMachineModalProcessList: [],
                disableWorkshop: false,
                disableMachineCode: false,
                machineIdValue: '',
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
                processList: [],
                remarkValue: '',
                workshopList: [],
                billSourceList: [],
                formValidate: {
                    billCodeValue: '',
                    billSourceValue: '',
                    billDateValue: toDaySeconds(),
                    sourceCodeValue: '',
                    workshopValue: '',
                    machineCodeValue: '',
                    machineNameValue: '',
                    processValue: null
                },
                ruleValidate: {
                    billDateValue: [{required: true, validator: validateBillDateValue, trigger: 'change'}],
                    workshopValue: [{ required: true, validator: validateWorkshopValue, trigger: 'change' }],
                    billSourceValue: [{ required: true, validator: validateBillSourceValue, trigger: 'change' }],
                    sourceCodeValue: [{ required: true, validator: validateSourceCodeValue, trigger: 'change' }],
                    machineCodeValue: [{required: true, validator: validateMachineCodeValue, trigger: 'change'}]
                },
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 80,
                        align: 'center'
                    },
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
                                        clearable: true,
                                        // remote: true,
                                        placeholder: '请输入配件编号',
                                       /* remoteMethod: (e) => {
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
                                            params.row.productCode = '';
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
                    {
                        title: '配件名称',
                        key: 'productName',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        minWidth: 100,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        minWidth: 160,
                        align: 'center',
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
                    {
                        title: '申请数量',
                        key: 'qty',
                        width: 200,
                        align: 'center',
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
                tableData: [{
                    ordinal: 1,
                    productCode: '',
                    productName: '',
                    productModels: '',
                    unitName: '',
                    qty: 1,
                    remarks: '',
                    remoteProductList: [],
                    productList: []
                }],
                remoteProductList: [],
                disableDatePicker: false,
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                auditName: '',
                auditTime: '',
                closeName: '',
                closeTime: '',
                clickMachineObj: null,
                clickMachineIndex: '',
                clickPartsIndex: '',
                clickPartsObj: null,
                toPush: false,
                listTableHeight: document.documentElement.clientHeight - 410,
                toCreated: false,
                isActivating: false,
                initTableData: {
                    productCode: '',
                    productName: '',
                    productModels: '',
                    unitName: '',
                    qty: 1,
                    remarks: '',
                    remoteProductList: [],
                    productList: []
                },
                sourceId: ''
            };
        },
        methods: {
            clearMachineEvent () {
                this.$set(this.formValidate, 'machineCodeValue', '');
                this.formValidate.machineNameValue = '';
                this.formValidate.processValue = null;
                this.machineIdValue = null;
                this.clickMachineObj = null;
                this.selectMachineTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
                let query = this.formValidate.machineCodeValue;
                this.remoteMachineMethod(query);
            },
            remoteMachineMethod (query) {
                if (query) {
                    this.remoteMachineLoading = true;
                    setTimeout(() => {
                        this.remoteMachineLoading = false;
                        this.machineList = this.remoteMachineList.filter(item => {
                            return item.code.toLowerCase().indexOf(query.toLowerCase()) > -1 || item.name.indexOf(query) > -1;
                        });
                    }, 200);
                } else {
                    this.machineList = [];
                };
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
            remoteMachineQueryChangeEvent (query) {
                this.remoteMachineMethod(query);
            },
            // 获取车间的事件
            getWorkshopEvent (e) {
                this.machineIdValue = null;
                this.formValidate.machineCodeValue = null;
                this.formValidate.machineNameValue = '';
                this.formValidate.processValue = null;
                this.formValidate.machineNameValue = '';
                this.getAllMachineList().then(res => {
                    if (res.data.status === 200) {
                        this.remoteMachineList = res.data.res;
                    };
                });
            },
            // 选择设备modal的搜索事件
            selectMachineModalSearchEvent (data) {
                this.selectModalMachineCode = data.machineCode;
                this.selectMachineModalProcessValue = data.processId;
                this.clickGetMachineHttp();
            },
            // 选择设备modal的工序事件
            selectMachineModalProcessEvent (e) {
                this.selectMachineModalProcessValue = e;
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
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if (this.tableData[0].productCode !== '' && this.tableData[0].productName !== '') {
                            this.toPush = true;
                            this.addHttp();
                        } else {
                            emptyTips(this, '配件不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            // 新增的事件
            saveButtonEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        if (this.tableData[0].productCode !== '' && this.tableData[0].productName !== '') {
                            this.toPush = false;
                            this.addHttp();
                        } else {
                            emptyTips(this, '配件不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            // 新增的请求
            addHttp () {
                let partsReplaceList = [];// 排除空值
                this.tableData.forEach((item) => {
                    if (item.productCode !== '') { partsReplaceList.push(item); };
                });
                this.$api.parts.saveHttp({
                    'code': this.formValidate.billCodeValue,
                    'orderDate': formatDate(this.formValidate.billDateValue),
                    'billSource': this.formValidate.billSourceValue,
                    'sourceCode': this.formValidate.sourceCodeValue,
                    'sourceId': this.sourceId,
                    'workshopId': this.formValidate.workshopValue,
                    'machineId': this.machineIdValue,
                    'machineCode': this.formValidate.machineCodeValue,
                    'machineName': this.formValidate.machineNameValue,
                    'processId': this.formValidate.processValue,
                    'remarks': this.remarkValue,
                    'partsReplaceOrderDetailList': partsReplaceList
                }).then(res => {
                    if (res.data.status === 200) {
                        if (this.toPush === true) {
                            this.pushHttp(res.data.res);
                        } else {
                            this.$store.commit('removeTag', 'addPartsReplace');
                            this.$router.push({
                                path: 'editPartsReplace',
                                query: {
                                    editId: res.data.res,
                                    activated: true
                                }
                            });
                            noticeTips(this, 'saveTips');
                        };
                    };
                });
            },
            // 提交的请求
            pushHttp (id) {
                this.$api.parts.submitHttp([id]).then(res => {
                    if (res.data.status === 200) {
                        this.$store.commit('removeTag', 'addPartsReplace');
                        this.toPush = false;
                        noticeTips(this, 'submitTips');
                        this.$router.push({
                            path: 'editPartsReplace',
                            query: {
                                editId: id,
                                activated: true
                            }
                        });
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
                        this.selectPartsTableData = res.data.res;
                    };
                });
            },
            // 配件modal表格的单击
            singleClickPartsRowEvent (e, index) {
                this.clickPartsObj = e;
                this.selectPartsTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
                this.$set(this.selectPartsTableData[index], 'singleClickStyle', true);
            },
            // 获取配件的请求
            getPartsHttp (code='') {
                return this.$api.product.machineMaterial({code: code});
            },
            // 配件modal表格的双击
            doubleClickPartsRowEvent (e, index) {
                this.clickPartsObj = e;
                this.selectPartsTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
                this.$set(this.selectPartsTableData[index], 'singleClickStyle', true);
                this.$set(this.tableData[this.clickPartsIndex], 'productList', [this.clickPartsObj]);
                this.$set(this.tableData[this.clickPartsIndex], 'productId', this.clickPartsObj.id);
                this.$set(this.tableData[this.clickPartsIndex], 'productCode', '');
                setTimeout(()=>{ this.$set(this.tableData[this.clickPartsIndex], 'productCode', this.clickPartsObj.code); },0);
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
                this.selectMachineTableData.forEach((item) => {
                    this.$set(item, 'singleClickStyle', false);
                });
                this.$set(this.selectMachineTableData[index], 'singleClickStyle', true);
                this.formValidate.processValue = this.clickMachineObj.processId;
                this.$set(this.formValidate, 'machineCodeValue', '');
                setTimeout(() => { this.$set(this.formValidate, 'machineCodeValue', e.code); },0);
                this.formValidate.machineNameValue = this.clickMachineObj.name;
                this.selectMachineModalState = false;
            },
            selectMachineModalCancelEvent () {
                this.selectMachineModalState = false;
            },
            // 搜索设备的icon事件
            getSearchMachineEvent () {
                if (this.disableMachineCode === false) {
                    this.selectMachineTableData = [];
                    this.selectMachineModalState = true;
                    this.selectMachineTableLoading = true;
                    // this.selectModalMachineCode = this.formValidate.machineCodeValue;
                    // this.selectMachineModalProcessValue = this.formValidate.processValue;
                    this.clickGetMachineHttp();
                };
            },
            clickGetMachineHttp () {
                this.selectModalMachineCode = clearSpace(this.selectModalMachineCode);
                this.$post(
                    'machine/maintenance/repair/list',
                    {
                        name: this.selectModalMachineCode,
                        processId: this.selectMachineModalProcessValue,
                        workshopId: this.formValidate.workshopValue
                    }
                ).then(res => {
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
                        this.selectMachineTableData = res.data.res;
                    };
                });
            },
            // 添加的按钮
            clickAddEvent (index) {
                this.tableData.splice(index + 1, 0, JSON.parse(JSON.stringify(this.initTableData)));
            },
            // 删除的按钮
            clickRemoveEvent (id, index) {
                if (this.tableData.length > 1) {
                    this.tableData.splice(index, 1);
                };
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
            // 获取单据来源
            getBillSourceHttp () {
                return this.$api.parts.billSourceHttp().then(res => {
                    if (res.data.status === 200) {
                        this.billSourceList = res.data.res;
                    };
                });
            },
            // 获取保养单的设备
            getUpkeepDetailHttp () {
                this.$api.upkeep.upkeepCodeDetailHttp({id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        let detailResponse = {};
                        detailResponse = res.data.res;
                        this.getAllMachineList().then(res => {
                            if (res.data.status === 200) {
                                this.remoteMachineList = res.data.res;
                                this.sourceId = detailResponse.id;
                                this.machineList = [{code: detailResponse.machineCode}];
                                this.machineIdValue = detailResponse.machineId;
                                this.formValidate.machineCodeValue = '';
                                setTimeout(()=>{ this.formValidate.machineCodeValue = detailResponse.machineCode; },500)
                                this.formValidate.machineNameValue = detailResponse.machineName;
                                this.formValidate.workshopValue = detailResponse.workshopId;
                                this.formValidate.processValue = detailResponse.processId;
                                this.formValidate.sourceCodeValue = detailResponse.code;
                            };
                        });
                    };
                });
            },
            // 获取维修单的设备
            getRepairDetailHttp () {
                this.$post('repair/order/detail', {id: this.$route.query.id}).then(res => {
                    if (res.data.status === 200) {
                        let detailResponse = {};
                        detailResponse = res.data.res;
                        this.getAllMachineList().then(res => {
                            if (res.data.status === 200) {
                                this.remoteMachineList = res.data.res;
                                this.sourceId = detailResponse.id;
                                this.machineList = [{code: detailResponse.machineCode}];
                                this.formValidate.machineCodeValue = '';
                                this.machineIdValue = detailResponse.machineId;
                                setTimeout(()=>{ this.formValidate.machineCodeValue = detailResponse.machineCode; },500);
                                this.formValidate.machineNameValue = detailResponse.machineName;
                                this.formValidate.workshopValue = detailResponse.workshopId;
                                this.formValidate.processValue = detailResponse.processId;
                                this.formValidate.sourceCodeValue = detailResponse.code;
                            };
                        });
                    };
                });
            },
            getProcessList () {
                return this.$api.process.getSearchProcessList().then(res => {
                    this.processList = res;
                    this.selectMachineModalProcessList = res;
                });
            },
            // 获取所有机台
            getAllMachineList () {
                return this.$post('machine/maintenance/repair/list', {
                    workshopId: this.formValidate.workshopValue
                });
            },
            isUpkeepOrRepair () {
                if (this.$route.query.isUpkRep === 1 || this.$route.query.isUpkRep === '1') {
                    // 保养
                    this.getUpkeepDetailHttp();
                    this.formValidate.billSourceValue = 1;
                    this.disableWorkshop = true;
                    this.disableMachineCode = true;
                } else if (this.$route.query.isUpkRep === 2 || this.$route.query.isUpkRep === '2') {
                    // 维修
                    this.getRepairDetailHttp();
                    this.formValidate.billSourceValue = 2;
                    this.disableWorkshop = false;
                    this.disableMachineCode = false;
                } else if (this.$route.query.isUpkRep === 0 || this.$route.query.isUpkRep === '0') {
                    this.formValidate.billSourceValue = 0;
                    this.disableWorkshop = false;
                    this.disableMachineCode = false;
                };
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                window.onresize = () => {
                    this.listTableHeight = compClientHeight(tableDom.offsetHeight + 220);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                (async () => {
                    await this.getProcessList();
                    await this.getWorkshop();
                    await this.getBillSourceHttp();
                    await this.getAllMachineList().then(res => {
                        if (res.data.status === 200) { this.remoteMachineList = res.data.res; };
                    });
                    await this.getPartsHttp().then(res => {
                        if (res.data.status === 200) {
                            this.remoteProductList = res.data.res;
                            this.tableData[0].remoteProductList = res.data.res;
                            this.initTableData.remoteProductList = res.data.res;
                            this.globalLoadingShow = false;
                        };
                    });
                    // 判断路由来源保养或者维修,则禁用部分选项
                    if (this.$route.query.isUpkRep !== undefined) {
                        this.isUpkeepOrRepair();
                    };
                })();
            },
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
                },0);
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

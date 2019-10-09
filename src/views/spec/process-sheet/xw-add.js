import xwSelectProduct from '../../components/xw-select-product/xw-select-product-spec';
import {curDate} from '../../../libs/tools';
import tipsClear from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
import mathJs from 'mathjs';
export default ({
    components: {
        xwSelectProduct,
        tipsClear
    },
    data () {
        return {
            clearTipsStatus: false,
            clearTipsMsg: '',
            formValidate: {
                selectProductCode: '',
                isCanSave: '',
                curDate: curDate(),
                specUser: '',
                specUserId: '',
                productModels: '',
                processName: ''
            },
            ruleValidate: {
                curDate: [{required:true,validator:xwValidate.input,trigger:'change'}],
                specUser: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                selectProductCode: [{required: true, validator:xwValidate.select, trigger: 'change'}]
            },
            remoteUserLoading: false,
            userList: [],
            curUserList: [],
            curDate: curDate(),
            selectProductCode: '',
            formSpecParams: {
                machineModelId: null,
                gramWeight: null,
                meters: null,
                numbers: null,
                hourYield: null,
                moistureRegain: null,
                efficiencyPercent: null
            },
            formRulesSpecParams: {
                machineModelId: [{required: true, validator:xwValidate.input, trigger: 'change'}],
                gramWeight: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                meters: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                numbers: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                hourYield: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                moistureRegain: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                efficiencyPercent: [{required: true, validator:xwValidate.input, trigger: 'blur'}]
            },
            machineModelList: [],
            tableHeight: '',
            copyId: '',
            processParamColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 80,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '工艺项目',
                    key: 'name',
                    align: 'left'
                },
                {
                    title: '工艺项目值',
                    key: 'val',
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        if (params.row.inputType === 2) {
                            return h('Select', {
                                props: {
                                    value: params.row.val,
                                },
                                style: {
                                    textAlign: 'left'
                                },
                                on: {
                                    'on-change': (data) => {
                                        params.row.val = params.row.dataTypeStateList === 1 ? parseFloat(data) : data;
                                        this.processParamList[params.index] = params.row;
                                        this.getFormulaData();
                                    }
                                }
                            }, [
                                params.row.paramValueList.map(item => {
                                    return h('Option', {
                                        props: {value: item.value, key: item.value},
                                        style: {
                                        }
                                    }, item.value);
                                })
                            ])
                        } else {
                            if (params.row.dataType === 1) {
                                if (params.row.isFormula === true) {
                                    return h('div', [
                                        h('span', {}, params.row.val)
                                    ]);
                                } else {
                                    return h('div', [
                                        h('InputNumber', {
                                            props: {
                                                value: params.row.val ? parseFloat(params.row.val) : null,
                                                min: 0
                                            },
                                            style: {
                                                width: '100%'
                                            },
                                            on: {
                                                'on-change': (e) => {
                                                    params.row.val = e;
                                                    _this.processParamList[params.index] = params.row;
                                                    _this.getFormulaData();
                                                }
                                            }
                                        })
                                    ]);
                                }
                            } else {
                                return h('div', [
                                    h('Input', {
                                        props: {
                                            value: params.row.val
                                        },
                                        on: {
                                            'on-change': (event) => {
                                                params.row.val = event.target.value;
                                                _this.processParamList[params.index] = params.row;
                                            }
                                        }
                                    })
                                ]);
                            }
                        }
                    }
                },
                {
                    title: '项目类型',
                    key: 'paramTypeVal',
                    align: 'center'
                },
                {
                    title: '是否允许为空',
                    key: 'isNull',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.row.isNull === true ? '是' : '否')
                    }
                },
                {
                    title: '是否计算项目',
                    key: 'isFormula',
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.row.isFormula === true ? '是' : '否')
                    }
                },
                {
                    title: '是否翻改项目',
                    key: 'isBusiName',
                    align: 'center',
                    filters: [
                        {
                            label: '是',
                            value: '是'
                        },
                        {
                            label: '否',
                            value: '否'
                        }
                    ],
                    filterMultiple: false,
                    filterMethod (value, row) {
                        if (value === '是') {
                            return row.isBusiName ===  '是';
                        } else if (value === '否') {
                            return row.isBusiName === '否';
                        }
                    }
                },
                {
                    title: '数据类型',
                    key: 'dataTypeName',
                    align: 'center'
                }
            ],
            processParamList: [],
            specUserId: '',
            specUserName: '',
            processName: '',
            editId: '',
            isPush: false,
            isSave: false,
            isActivated: true,
            isShowProcessParams: false,
            isRefresh: false,
            middleSpecUser: '',
            processId: '',
            selectProductVal: {},
            obj: {}
        };
    },
    methods: {
        getFormulaData () {
            let obj = {};
            this.processParamList.filter(x => x.dataType === 1).map(item => {
                obj[item.code] = parseFloat(item.val);
            });
            this.processParamList.filter(x => x.isFormula === true).map(item => {
                if (item.formula) {
                    let value = (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) || (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) !== 'Infinity')) ? (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')'))) : 0;
                    item.val = value ? value : null;
                }
                return item;
            });
        },
        changeTime (val) {
            this.formValidate.curDate = val;
        },
        clearTipsCancel () {
            this.clearTipsMsg = '';
            this.clearTipsStatus = false;
        },
        async clearTipsConfirm () {
            this.$refs['formValidate'].resetFields();
            this.$refs['formSpecParams'].resetFields();
            this.isRefresh = true;
            await this.getUserInfo();
            this.clearTipsStatus = false;
        },
        newAddClick () {
            this.clearTipsStatus = true;
            this.clearTipsMsg = '数据尚未保存，确认清空？';
        },
        saveClickEvent (name, name2) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$refs[name2].validate((valid) => {
                        if (valid) {
                            this.isSave = true;
                            this.isPush = false;
                            this.getParamsSavePush();
                        } else {
                            this.$Message.error('填写必要信息!');
                        }
                    });
                } else {
                    this.$Message.error('填写必要信息!');
                }
            });
        },
        pushClickEvent (name, name2) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$refs[name2].validate((valid) => {
                        if (valid) {
                            this.isSave = false;
                            this.isPush = true;
                            this.getParamsSavePush();
                        } else {
                            this.$Message.error('填写必要信息!');
                        }
                    });
                } else {
                    this.$Message.error('填写必要信息!');
                }
            });
        },
        getParamsSavePush () {
            const _this = this;
            let isContinue = false;
            this.processParamList.map(x => {
                if (!x.isNull && !x.val) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '<span>存在不能为空的工艺项目</span>'
                    });
                    isContinue = true
                }
            });
            if (isContinue) {
                return false
            }
            let params = {
                auditState: this.isSave ? 1 : 2,
                productId: this.formValidate.productId,
                productCode: this.formValidate.productCode,
                productName: this.formValidate.productName,
                productModels: this.formValidate.productModels,
                processId: this.formValidate.processId,
                processName: this.formValidate.processName,
                specUserId: this.userList.find(x => x.codeName === this.formValidate.specUser).id,
                specUserName: this.userList.find(x => x.codeName === this.formValidate.specUser).name,
                specDate: this.formValidate.curDate,
                specSheetProcessModel: {
                    machineModelId: _this.formSpecParams.machineModelId,
                    gramWeight: _this.formSpecParams.gramWeight,
                    meters: _this.formSpecParams.meters,
                    numbers: _this.formSpecParams.numbers,
                    hourYield: _this.formSpecParams.hourYield,
                    moistureRegain: _this.formSpecParams.moistureRegain,
                    efficiencyPercent: _this.formSpecParams.efficiencyPercent,
                    specSheetParamList: _this.processParamList.map(x => {
                        return {
                            specParamId: _this.copyId ? x.specParamId : x.id,
                            val: x.val ? (x.inputType === 2 ? x.val : (x.dataType === 1 ? Number(x.val).toFixed(3) : x.val)) : null
                        };
                    })
                }
            };
            // debugger
            this.$api.specSheet.saveHttp(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isSave ? this.$Message.success('保存成功') : this.$Message.success('提交成功');
                    if (!this.isSave) {
                        this.$call('spec.sheet.submit', [content.res]).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                            }
                        })
                    }
                    this.isShowProcessParams = false;
                    this.$store.commit('removeTag', 'addProSheet');
                    this.$router.push({
                        path: 'editProSheet',
                        query: {
                            id: content.res,
                            isEdit: true,
                            activated: true
                        }
                    });
                    this.$route.meta.keepAlive = false;
                }
            });
        },
        remoteMethod (query) {
            const _this = this;
            if (query !== '') {
                this.remoteUserLoading = true;
                setTimeout(() => {
                    _this.remoteUserLoading = false;
                    const list = _this.userList;
                    _this.curUserList = list.filter(item => item.codeName.toLowerCase().includes(query.toLowerCase()));
                    // debugger
                    if (this.isRefresh) {
                        this.isRefresh = false;
                        this.formValidate.specUser = this.middleSpecUser;
                    }
                }, 200);
            } else {
                _this.curUserList = [];
            }
        },
        // 选择产品
        async selectProduct (val) {
            if (val.id) {
                if (!val.processId) {
                    this.$Modal.warning({
                        title: '提示',
                        content: '该产品没有对应的加工工序，请重新选择'
                    });
                    this.processId = '';
                    this.selectProductVal = {};
                    this.formValidate.processId = '';
                    this.formValidate.productId = '';
                    this.formValidate.processName = '';
                    this.formValidate.productModels = '';
                    this.isShowProcessParams = false;
                    this.formValidate.selectProductCode = Math.random();
                    return false;
                }
                this.formValidate.selectProductCode = Math.random();
                this.formValidate.productId = val.id;
                this.formValidate.productCode = val.code;
                this.formValidate.productModels = val.models;
                this.formValidate.productName = val.name;
                this.processId = val.processId;
                // this.productId = val.productId;
                this.selectProductVal = val;
            } else {
                this.formValidate.selectProductCode = '';
                this.processId = '';
                this.selectProductVal = {};
                this.formSpecParams.machineModelId = null;
                this.formSpecParams.gramWeight = null;
                this.formSpecParams.meters = null;
                this.formSpecParams.numbers = null;
                this.formSpecParams.productId = null;
                this.formSpecParams.hourYield = null;
                this.formSpecParams.moistureRegain = null;
                this.formSpecParams.efficiencyPercent = null;
                this.machineModelList = [];
                //
                this.formValidate.productModels = '';
                this.formValidate.processName = '';
                this.isShowProcessParams = false;
            }
        },
        getModelList2 () {
            let params = {
                processId: this.formValidate.processId
            };
            this.$api.model.getModelList2(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineModelList = content.res;
                }
            });
        },
        getProcessParams () {
            let params = {
                processId: this.formValidate.processId
            };
            this.$api.specParams.getSpecParamsList2(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processParamList = content.res.map(x => {
                        x.paramTypeVal = x.paramType === 1 ? '设备工艺' : (x.paramType === 2 ? '运转工艺' : '');
                        x.nameCode = x.name + x.code;
                        x.dataTypeName = x.dataType === 1 ? '数值型' : '字符型';
                        x.isBusiName = x.isBusi === true ? '是' : '否';
                        x.val = '';
                        return x;
                    });
                }
            });
        },
        getCopyDetail (val) {
            // debugger
            const _this = this;
            this.$api.specSheet.detailHttp({id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.formValidate.curDate = content.res.specDate;
                    this.formValidate.processId = content.res.processId;
                    this.processId = content.res.processId;
                    this.formValidate.processName = content.res.processName;
                    this.getModelList2(content.res.specSheetProcessModel.machineModelId);
                    this.formValidate.productId = content.res.productId;
                    this.formValidate.productCode = content.res.productCode;
                    // this.formValidate.specUser = '';
                    this.formValidate.productName = content.res.productName;
                    this.formValidate.selectProductCode = content.res.productName + ' (' + content.res.productCode + ')';
                    this.formValidate.productModels = content.res.productModels;
                    this.isShowProcessParams = true;
                    this.formSpecParams.machineModelId = content.res.specSheetProcessModel.machineModelId;
                    this.formSpecParams.machineModelName = content.res.specSheetProcessModel.machineModelName;
                    this.formSpecParams.meters = content.res.specSheetProcessModel.meters;
                    this.formSpecParams.gramWeight = content.res.specSheetProcessModel.gramWeight;
                    this.formSpecParams.hourYield = content.res.specSheetProcessModel.hourYield;
                    this.formSpecParams.numbers = content.res.specSheetProcessModel.numbers;
                    this.formSpecParams.moistureRegain = content.res.specSheetProcessModel.moistureRegain;
                    this.formSpecParams.efficiencyPercent = content.res.specSheetProcessModel.efficiencyPercent;
                    _this.processParamList = content.res.specSheetProcessModel.specSheetParamList.map(x => {
                        x.paramTypeVal = x.paramType;
                        x.nameCode = x.specParamName + x.specParamCode;
                        x.name = x.specParamName;
                        return x;
                    });
                    _this.$store.dispatch({
                        type:'hideLoading'
                    });
                }
            })
        },
        getUserInfo () {
            this.$api.user.getUserInfo().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.specUserId = content.res.id;
                    this.formValidate.specUser = content.res.name + ' (' + content.res.code + ')';
                    this.middleSpecUser = this.formValidate.specUser;
                    this.formValidate.specUserName = content.res.name;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        getUserList () {
            // debugger
            const _this = this;
            this.$api.user.getUserList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.userList = content.res.map(x => {
                        x.codeName = x.name + ' (' + x.code + ')';
                        return x;
                    });
                    this.getUserInfo();
                }
            });
        },
    },
    watch: {
        async processId (newData, oldData) {
            if (!this.selectProductVal.processName) {
                return false;
            }
            // this.formValidate.productId = this.selectProductVal.productId;
            // debugger
            this.formValidate.productModels = this.selectProductVal.productModels;
            this.formValidate.processName = this.selectProductVal.processName;
            this.processName = this.selectProductVal.processName;
            this.formValidate.processId = this.selectProductVal.processId;
            if (newData !== oldData) {
                this.$refs['formSpecParams'].resetFields();
                await this.getModelList2();
                await this.getProcessParams();
            }
            // 保存需要
            this.formValidate.selectProductCode = Math.random();
            this.formValidate.productCode = this.selectProductVal.productCode;
            this.formValidate.productId = this.selectProductVal.id;
            this.formValidate.productName = this.selectProductVal.name;
            // this.formValidate.selectProductCode = this.selectProductVal.name + ' (' + this.selectProductVal.code + ')';
            this.formValidate.productCode = this.selectProductVal.code;
            this.formValidate.productModels = this.selectProductVal.models;
            this.isShowProcessParams = true;
        }
    },
    activated () {
        // debugger;
        this.$refs['formValidate'].resetFields();
        this.$refs['formSpecParams'].resetFields();
        this.machineModelList = [];
        this.isShowProcessParams = false;
        this.copyId = this.$route.query.id;
        (async () => {
            this.isRefresh = true;
            await this.getUserList();
            if (this.copyId) {
                await this.getCopyDetail(this.copyId);
            }
        })()
    },
    mounted () {
        // debugger;
        this.copyId = '';
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.$refs['formValidate'].resetFields();
        // this.isActivated = false;
        this.formValidate.curDate= curDate();
        // this.editId = '';
        this.isShowProcessParams = false;
        this.copyId = this.$route.query.id;
        // this.getUserList();
        (async () => {
            this.isRefresh = true;
            await this.getUserList();
            if (this.copyId) {
                await this.getCopyDetail(this.copyId);
            }
        })()
    }
});

import xwSelectProduct from '../../components/xw-select-product/xw-select-product-spec';
import {curDate} from '../../../libs/tools';
import tipsClear from '../../public/deleteWarning';
import pageOtherMessage from '../../components/pageOtherMessage';
import xwOperationLog from '../../components/xw-operation-log/xw-operation-log';
import xwValidate from '@/libs/xwValidate';
export default ({
    components: {
        xwSelectProduct, tipsClear, pageOtherMessage, xwOperationLog
    },
    data () {
        return {
            showOther: false,
            selectProductCode: '',
            clearTipsStatus: false,
            clearTipsMsg: '',
            code: '',
            // curDate: curDate(),
            editId: '',
            // isShowProcessParams: false,
            remoteUserLoading: false,
            formValidate: {
                curDate: curDate(),
                specUse: null,
                specUser: null,
                specUserId: null,
                productModels: '',
                processName: '',
                selectProductCode: ''
            },
            ruleValidate: {
                curDate: [{required:true, validator:xwValidate.input, trigger:'change'}],
                specUser: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                selectProductCode: [{required: true, validator:xwValidate.select, trigger: 'blur'}]
            },
            curUserList: '',
            processName: '',
            formSpecParams: {
                machineModelId: null,
                gramWeight: null,
                meters: null,
                numbers: null,
                hourYield: null,
                moistureRegain: null,
                efficiencyPercent: null,
            },
            formRulesSpecParams: {
                machineModelId: [{required: true, validator:xwValidate.select, trigger: 'change'}],
                gramWeight: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                meters: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                numbers: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                hourYield: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                moistureRegain: [{required: true, validator:xwValidate.input, trigger: 'blur'}],
                efficiencyPercent: [{required: true, validator:xwValidate.input, trigger: 'blur'}]
            },
            machineModelList: [],
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
                                        params.row.val = params.row.dataTypeStateList === 1 ? Number(data) : data;
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
                            if (!this.isAuditState) {
                                if (params.row.dataType === 1) {
                                    if (params.row.isFormula === true) {
                                        return h('div', [
                                            h('span', {
                                            }, params.row.val)
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
                                                        this.processParamList[params.index] = params.row;
                                                        this.getFormulaData();
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
                                                    this.processParamList[params.index] = params.row;
                                                }
                                            }
                                        })
                                    ]);
                                }
                            } else {
                                return h('span', params.row.val);
                            }
                        }
                    }
                },
                {
                    title: '项目类型',
                    key: 'paramType',
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
            isShowProcessParams: false,
            toCreated: false,
            againGetDataSwitch: false,
            // auditSwitch:true,
            // againstSwitch:true,
            // disableSwitch:true,
            // enableSwitch:true,
            // pushSwitch:false,
            // cancelSwitch:true,
            // saveSwitch:false,
            isAuditStateVal:'',
            isAuditState:false,
            isEnableStateVal:false,
            changeProductState:false,
            updateName:'',
            updateTime:'',
            createName:'',
            createTime:'',
            operationList: [],
            processId: '',
            selectProductVal: {}
        }
    },
    methods: {
        getFormulaData () {
            let obj = {};
            this.processParamList.filter(x => x.dataType === 1).map(item => {
                obj[item.specParamCode] = Number(item.val);
            });
            this.processParamList.filter(x => x.isFormula === true).map(item => {
                if (item.formula) {
                    item.val = (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) || (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')')) !== 'Infinity')) ? (eval(item.formula.trim().replace(/\[/g, '(obj.').replace(/\]/g, ')'))) : 0;
                }
                return item;
            });
        },
        copyClick () {
            this.$router.push({
                path:'addProSheet',
                query:{
                    id:this.editId,
                    activated:true
                }
            });
            this.$route.meta.keepAlive = false;
        },
        cancelClickEvent () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.$api.specSheet.cancelHttp([this.editId]).then(res=>{
                if(res.data.status === 200){
                    this.$Notice.success({
                        title:'提示',
                        desc: '撤销提交成功!'
                    });
                    this.getDetailHttp(this.editId);
                }
            });
        },
        auditClickEvent () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.$api.specSheet.auditHttp([this.editId]).then(res=>{
                // 获取详情
                this.getDetailHttp(this.editId);
                this.$Notice.success({
                    title:'提示',
                    desc: '审核成功!'
                });
            });
        },
        unAuditClickEvent () {
         this.$store.dispatch({
             type: 'showLoading'
         });
            this.$api.specSheet.unapproveHttp([this.editId]).then(res=>{
                // 获取详情
                this.getDetailHttp(this.editId);
                this.$Notice.success({
                    title:'提示',
                    desc: '反审核成功!'
                });
            });},
        disableClickEvent () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.$api.specSheet.disableHttp([this.editId]).then(res=>{
                if(res.data.status === 200){
                    //调用获取详情的方法
                    this.getDetailHttp(this.editId);
                    this.$Notice.error({
                        title:'提示',
                        desc: '禁用成功!'
                    });
                };
            });
        },
        enableClickEvent () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.$api.specSheet.enableHttp([this.editId]).then(res=>{
                if(res.data.status === 200){
                    // 获取详情
                    this.getDetailHttp(this.editId);
                    this.$Notice.success({
                        title:'提示',
                        desc: '启用成功!'
                    });
                }
            });
        },
        clearTipsCancel () {
            this.clearTipsMsg = '';
            this.clearTipsStatus = false;
        },
        clearTipsConfirm () {
            this.formValidate = {
                // processNameAndId:[],
            };
            this.isShowProcessParams = false;
            this.clearTipsStatus = false;
            setTimeout(() => {
                this.$refs['formSpecParams'].resetFields();
            }, 0);
        },
        // 新增的事件
        newAddClick () {
            this.$router.push({
                path:'addProSheet',
                query:{
                    activated:true
                }
            });
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
        changeTime (val) {
            this.formValidate.curDate = val;
        },
        getParamsSavePush () {
            // debugger
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
                id: this.editId,
                auditState: this.isSave ? 1 : 2,
                productId: this.formValidate.productId,
                productCode: this.formValidate.productCode,
                productName: this.formValidate.productName,
                productModels: this.formValidate.productModels,
                processId: this.formValidate.processId,
                processName: this.formValidate.processName,
                specUserId: this.formValidate.specUserId,
                specUserName: this.formValidate.specUserName,
                specDate: this.formValidate.curDate,
                specSheetProcessModel: {
                    machineModelId: this.formSpecParams.machineModelId,
                    gramWeight: this.formSpecParams.gramWeight,
                    meters: this.formSpecParams.meters,
                    hourYield: this.formSpecParams.hourYield,
                    numbers: this.formSpecParams.numbers,
                    moistureRegain: this.formSpecParams.moistureRegain,
                    efficiencyPercent: this.formSpecParams.efficiencyPercent,
                    specSheetParamList: this.processParamList.map(x => {
                        return {
                            specParamId: this.changeProductState ? x.id : x.specParamId,
                            // val: x.val ? (x.dataType === 1 ? Number(x.val).toFixed(3) : x.val) : null
                            val: x.val ? (x.inputType === 2 ? x.val : (x.dataType === 1 ? Number(x.val).toFixed(3) : x.val)) : null
                        };
                    })
                }
            };
            // debugger;
            if (this.changeProductState) {
                this.changeProductState = false;
            }
            this.$api.specSheet.saveHttp(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isShowProcessParams = false;
                    if (this.isSave) {
                        this.$Notice.success({
                            title:'提示',
                            desc: '保存成功!'
                        });
                        this.getDetailHttp();
                    } else {
                        this.$call('spec.sheet.submit', [this.editId]).then(res => {
                            let content = res.data;
                            if (content.status === 200) {
                                this.$Notice.success({
                                    title:'提示',
                                    desc: '提交成功!'
                                });
                                this.getDetailHttp();
                            }
                        })
                    }
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
                }, 200);
            } else {
                _this.curUserList = [];
            }
        },
        selectSpecUserEvent (val) {
            if (this.formValidate.specUse) {
                this.formValidate.specUser = this.formValidate.specUse;
                this.formValidate.specUse = '';
                return false;
            }
            if (val) {
                this.formValidate.specUserId = this.userList.find(x => x.codeName === val).id;
                this.formValidate.specUserName = this.userList.find(x => x.codeName === val).name;
            } else {
                this.formValidate.specUserId = '';
                this.formValidate.specUserName = '';
            }
        },
        async selectProduct (val) {
            // debugger
            if (val.id) {
                if (!val.processId) {
                    this.$Modal.warning({
                       title: '提示',
                       content: '该产品没有对应的加工工序，请重新选择'
                    });
                    this.formValidate.selectProductCode = '';
                    this.processId = '';
                    this.selectProductVal = {};
                    this.formValidate.processId = '';
                    this.formValidate.productId = '';
                    this.formValidate.processName = '';
                    this.formValidate.productModels = '';
                    this.formValidate.specSheetAuditState = '';
                    // this.isShowProcessParams = false;
                    this.machineModelList = [];
                    return false;
                }
                this.processId = val.processId;
                this.formValidate.productId = val.id;
                this.formValidate.productCode = val.code;
                this.formValidate.productName = val.name;
                this.formValidate.productModels = val.models;
                // this.formValidate.productId = val.id;
                this.selectProductVal = val;
            } else {
                this.formValidate.selectProductCode = '';
                this.processId = '';
                this.selectProductVal = {};
                this.formSpecParams.machineModelId = null;
                this.formSpecParams.productId = null;
                this.formSpecParams.gramWeight = null;
                this.formSpecParams.meters = null;
                this.formSpecParams.numbers = null;
                this.formSpecParams.hourYield = null;
                this.formSpecParams.moistureRegain = null;
                this.formSpecParams.efficiencyPercent = null;
                //
                this.formValidate.productModels = '';
                this.formValidate.processName = '';
                this.isShowProcessParams = false;
            }
        },
        getProcessParams () {
            let params = {
                processId: this.formValidate.processId
            };
            this.$api.specParams.getSpecParamsList2(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processParamList = content.res.map(x => {
                        x.nameCode = x.name + x.code;
                        x.dataTypeName = x.dataType === 1 ? '数值型' : '字符型';
                        x.isBusiName = x.isBusi === true ? '是' : '否';
                        return x;
                    });
                }
            });
        },
        getDetailHttp () {
            // debugger
            const _this = this;
            this.$api.specSheet.detailHttp({id: this.editId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.isAuditStateVal = content.res.auditState;
                    this.isEnableStateVal = content.res.enableState;
                    this.isAuditState = content.res.auditState > 1 ? true : false;
                    this.formValidate.code = content.res.code;
                    this.formValidate.curDate = content.res.specDate;
                    // this.formValidate.specUse = content.res.specUserId ? _this.userList.find(x => x.id === content.res.specUserId).codeName : null;
                    this.formValidate.specUser = content.res.specUserId ? _this.userList.find(x => x.id === content.res.specUserId).codeName : null;
                    this.formValidate.specUserId = content.res.specUserId;
                    this.formValidate.specUserName = content.res.specUserName;
                    this.formValidate.processId = content.res.processId;
                    this.processId = content.res.processId;
                    this.formValidate.processName = content.res.processName;
                    this.getModelList2(content.res.specSheetProcessModel.machineModelId);
                    // this.processName = content.res.processName;
                    this.formValidate.productId = content.res.productId;
                    this.formValidate.productCode = content.res.productCode;
                    this.formValidate.specSheetAuditState = content.res.enableState === 0 ? '禁用' : (content.res.auditState === 1 ? '创建' : (content.res.auditState === 2 ? '待审核' : (content.res.auditState === 3 ? '已审核' : '')));
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
                    //
                    _this.showOther = true;
                    _this.createName = content.res.createName;
                    _this.createTime = content.res.createTime;
                    _this.updateName = content.res.updateName;
                    _this.updateTime = content.res.updateTime;
                    _this.operationList = content.res.formActionList;
                    _this.processParamList = content.res.specSheetProcessModel.specSheetParamList.map(x => {
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
        getModelList2 (val) {
            let params = {
                processId: this.formValidate.processId
            };
            this.$api.model.getModelList2(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.machineModelList = content.res;
                    if (val) {
                        this.formSpecParams.machineModelId = val;
                    }
                }
            });
        },
        getUserListHttp () {
            // debugger
            const _this = this;
            this.$api.user.getUserList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.userList = content.res.map(x => {
                        x.codeName = x.name + ' (' + x.code + ')';
                        return x;
                    });
                    this.getDetailHttp()
                }
                // debugger
            });
        },
        async getSpecList () {
            // await this.getDetailHttp();
            await this.getUserListHttp();
        }
    },
    mounted () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.$refs['formValidate'].resetFields();
        this.editId = this.$route.query.id;
        this.getUserListHttp()
    },
    watch: {
        async processId (newData, oldData) {
            if (!this.selectProductVal.processName) {
                return false;
            }
            // debugger;
            // this.formValidate.productId = this.selectProductVal.productId;
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
            this.changeProductState = true;
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
    activated(){
        // debugger
        // console.log(this.editId);
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.$refs['formValidate'].resetFields();
        this.editId = this.$route.query.id;
        this.getUserListHttp();
        // this.getSpecList();
        // (async () => {
        //     await this.getUserListHttp();
        //     //判断是否有id
        //     this.editId = this.$route.query.id;
        //     if(this.editId !== undefined){
        //         await this.getDetailHttp();
        //     }
        // })();
    },
    created () {
    }
})

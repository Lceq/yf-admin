import modal from '../../public/modal';
import {curDate, page} from "../../../libs/tools";
import {checkoutTypeList, submissionTypeList, auditStateList} from "../../../libs/utilState";
// import selectMachine from '../../components/select-machine';
import selectMachineQuality from '../../components/xw-select-machine/xw-select-machine-quality';
import deleteWarning from '../../public/deleteWarning';
// import Cookies from 'js-cookie';
import otherMessage from '../../components/otherMessage';
import qualityModal from '../inspection/modal';
export default ({
    components: {
        qualityModal,
        deleteWarning,
        modal,
        otherMessage,
        selectMachineQuality
    },
    data () {
        return {
            qualityShow: false,
            weightPageOpts: page().pageOpts,
            weightPageSize: page().pageSize,
            auditDisabled: true,
            curQmWeightProcessId: '',
            curQmWeightParamsTypeId: '',
            curQmWeightAuditStateId: '',
            isShowWeight: false,
            processList: [],
            QmWeightCode: '',
            auditStateList: auditStateList,
            curQmWeightId: '',
            isEdit: false,
            weightColumns: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '操作',
                    key: 'colorValue',
                    align: 'center',
                    fixed: 'left',
                    width: 180,
                    render: (h, params) => {
                        return h('div', {}, [
                            h('Button', {
                                style: {
                                    marginRight: '5px'
                                },
                                props: {
                                    size: 'small',
                                    disabled: params.row.isStandard === true ? true : (params.row.isStopNotice === true ? true : false)
                                },
                                on: {
                                    'click': () => {
                                        this.qualityShow = true;
                                        this.qmTestId = params.row.id;
                                    }
                                }
                            }, params.row.isStopNotice === true ? '已通知' : '停车通知'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: (params.row.isStandard === true && params.row.testType === 1) ? false : true
                                },
                                on: {
                                    'click': () => {
                                        this.isShowSaveOrSubmit = true;
                                        this.curQmWeightId = params.row.id;
                                        this.isEdit = true;
                                        this.reexamine = true;
                                        this.getQmWeightDetail();
                                        this.weightTitle = '编辑重量质检';
                                    }
                                }
                            }, '复试')
                        ])
                    }
                },
                {
                    title: '检验日期',
                    key: 'qmDate',
                    align: 'left',
                    fixed: 'left',
                    minWidth: 120
                },
                {
                    title: '测试类型',
                    key: 'testTypeMean',
                    fixed: 'left',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '机台',
                    key: 'machineCode',
                    fixed: 'left',
                    align: 'left',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 1) {
                                        this.isShowSaveOrSubmit = true;
                                    } else {
                                        this.isShowSaveOrSubmit = false;
                                    }
                                    this.curQmWeightId = params.row.id;
                                    this.isEdit = true;
                                    this.getQmWeightDetail();
                                    this.weightTitle = params.row.auditState === 2 ? '重量质检详情' : '编辑重量质检';
                                }
                            }
                        }, params.row.machineCode);
                    }
                },
                {
                    title: '车间',
                    key: 'workshopName',
                    align: 'left',
                    minWidth: 80
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '产品',
                    key: 'productName',
                    align: 'left',
                    minWidth: 120
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '取样米数',
                    key: 'samplingMeters',
                    align: 'right',
                    minWidth: 100
                },
                {
                    title: '称重次数',
                    key: 'weightNum',
                    align: 'right',
                    minWidth: 100
                },
                {
                    title: '平均重量',
                    key: 'weight',
                    align: 'right',
                    minWidth: 100
                },
                {
                    title: '平均干重',
                    key: 'dryWeight',
                    align: 'right',
                    minWidth: 100
                },
                {
                    title: '定量',
                    key: 'gramWeight',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '重量偏差',
                    key: 'weightDeviation',
                    align: 'right',
                    minWidth: 120
                },
                {
                    title: '是否合格',
                    key: 'isStandardMean',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '实验员',
                    key: 'inspectorName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    minWidth: 100
                }
            ],
            weightData: [],
            tableHeight: '',
            weightTotal: 0,
            weightPageIndex: 0,
            // modal
            weightShow: false,
            weightLoading: false,
            weightSaveLoading: false,
            weightSaveSubmitLoading: false,
            weightTitle: '',
            isCouldSave: true,
            // form
            weightFormValidate: {
                inspectorName: '',
                testType: '',
                workshopId: null,
                processName: '',
                productName: '',
                batchCode: '',
                gramWeight: '',
                meters: '',
                // numbers: '',
                isTest: '0',
                moistureRegain: null,
                rangeRate: null,
                gramDeviation: null,
                samplingMeters: null,
                testMeters: null
            },
            weightRuleValidate: {},
            weightModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1 === this.weightModalData.length ? '平均值' : params.index + 1);
                    }
                },
                {
                    title: '重量',
                    key: 'weight',
                    align: 'right',
                    minWidth: 120,
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('InputNumber', {
                                props: {
                                    value: params.row.weight,
                                    min: 0.1
                                },
                                style: {
                                    width: '100%',
                                    display: params.index + 1 === this.weightModalData.length ? 'none' : 'inline-block'
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.weight = val;
                                        if (this.weightFormValidate.moistureRegain === '' || this.weightFormValidate.moistureRegain === undefined || this.weightFormValidate.moistureRegain === null) {
                                            _this.weightModalData.map(x => {
                                                x.dryWeight = '';
                                                x.weightDeviation = '';
                                                return x;
                                            });
                                            _this.$Modal.warning({
                                                title: '提示',
                                                content: '<p>请先选择机台</p>'
                                            });
                                            return false;
                                        } else {
                                            if (params.row.weight === '' || params.row.weight === undefined || params.row.weight === null) {
                                                params.row.dryWeight = '';
                                                params.row.weightDeviation = '';
                                                params.row.isStandard = '';
                                            } else {
                                                params.row.dryWeight = (params.row.weight / (1 + _this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                                                params.row.weightDeviation = ((params.row.dryWeight - params.row.gramWeight) / params.row.gramWeight).toFixed(2);
                                                params.row.isStandard = Math.abs(params.row.weightDeviation / params.row.gramWeight) < (_this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                                            }
                                        }
                                        this.weightModalData[params.index] = params.row;
                                    },
                                    'on-blur': () => {
                                        this.getWeightTotal();
                                    }
                                }
                            }, params.row.weight),
                            h('Span', {
                                style: {
                                    display: params.index + 1 === this.weightModalData.length ? 'inline-block' : 'none'
                                }
                            }, params.row.weight)
                        ]);
                    }
                },
                {
                    title: '干重',
                    key: 'dryWeight',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '定量',
                    key: 'gramWeight',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '重量偏差',
                    key: 'weightDeviation',
                    align: 'right',
                    minWidth: 80
                },
                {
                    title: '是否合格',
                    key: 'isStandard',
                    align: 'center',
                    minWidth: 80
                }
            ],
            weightModalData: [],
            ModalData: [],
            // 条件
            curDate: '',
            dateFrom: '',
            dataType: {},
            dateTo: curDate(),
            curWorkshopId: '',
            workshopList: [],
            curCheckoutTypeId: '',
            curSubmissionTypeId: '',
            checkoutTypeList: checkoutTypeList,
            submissionTypeList: submissionTypeList,
            productCodeName: '',
            machineCodeName: '',
            testDate: curDate(),
            weightProcessName: '',
            weightProductCode: '',
            isShowMachineList: false,
            selectMachineCode: '',
            machineWorkshopId: '',
            // 选中的机台
            curQmWeightIds: [],
            curQmWeightValue: [],
            // 提示
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            isSave: false,
            isSaveSubmit: false,
            num: 1,
            isShowSaveOrSubmit: true,
            createTime: '',
            createName: '',
            submitName: '',
            submitTime: '',
            // isSave: true,
            // 是否复试
            reexamine: false
        };
    },
    methods: {
        onClick (val) {
            // debugger
            let param = {
                qmTypeId: this.dataType.id,
                stopReason: val,
                workshopId: this.curWorkshopId,
                qmTestId: this.qmTestId
            };
            this.$call('qm.stop.notice.save', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.qualityShow = false;
                    this.$Message.success('停车通知');
                    this.getQmWeightList();
                }
            });
        },
        onCancel () {
            this.qualityShow = false;
        },
        async addNewQmWeight () {
            this.createTime = '';
            this.createName = '';
            this.submitName = '';
            this.submitTime = '';
            this.selectMachineCode = '';
            this.reexamine = false;
            this.isEdit = false;
            this.isShowSaveOrSubmit = true;
            this.weightShow = true;
            this.weightTitle = '新增重量质检';
            this.weightModalData = [];
            this.weightModalData = [];
            this.curQmWeightId = null;
            this.selectMachineCode = null;
            //
            this.weightFormValidate.samplingMeters = 1;
            this.weightFormValidate.testMeters = 1;
            this.weightFormValidate.gramDeviation = null;
            // this.weightFormValidate.moistureRegain = 0;
            this.weightFormValidate.workshopId = this.curWorkshopId;
            this.weightFormValidate.testType = 1;
            this.weightFormValidate.isTest = '0';
            this.weightFormValidate.testTypeMean = checkoutTypeList.find(x => x.id === this.weightFormValidate.testType).name;
            //
            this.weightFormValidate.productCode = '';
            this.weightFormValidate.processName = '';
            this.weightFormValidate.productName = '';
            this.weightFormValidate.batchCode = '';
            this.weightFormValidate.gramWeight = '';
            this.weightFormValidate.moistureRegain = null;
            this.weightFormValidate.meters = '';
            // this.weightFormValidate.numbers = '';
            // 重置数据
            await this.getWeightModalNumber();
            await this.getUserInfo();
        },
        submitQmWeight () {
            this.$api.weight.getQmWeightSubmit(this.curQmWeightIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmWeightList();
                    this.$Message.success('提交成功');
                }
            });
        },
        changeDateFrom (val) {
            this.dateFrom = val;
        },
        changeDateTo (val) {
            this.dateTo = val;
        },
        cancelQmWeight () {
            this.$api.weight.getQmWeightCancel(this.curQmWeightIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmWeightList();
                    this.$Message.success('撤销成功');
                }
            });
        },
        deleteQmWeight () {
            if (this.curQmWeightIds.length !== this.curQmWeightValue.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已提交数据，不能删除！</p>'
                });
                return false;
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        searchQmWeight () {
            this.weightPageIndex = 1;
            setTimeout(() => {
                this.weightTotal = 1;
            });
            this.getQmWeightList();
        },
        changeWeightShow () {
            this.isShowWeight = !this.isShowWeight;
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - H - 200;
            });
        },
        // 获取详情
        getQmWeightDetail () {
            this.$api.weight.getQmWeightDetail({id: this.curQmWeightId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.testDate = content.res.qmDate;
                    this.weightFormValidate.inspectorId = content.res.inspectorId;
                    this.weightFormValidate.inspectorName = content.res.inspectorName;
                    this.weightFormValidate.testType = content.res.testType;
                    this.weightFormValidate.machineId = content.res.machineId;
                    this.weightFormValidate.machineCode = content.res.machineCode;
                    this.selectMachineCode = content.res.machineCode;
                    this.weightFormValidate.testType = this.reexamine === true ? 2 : 1;
                    // this.weightFormValidate.testTypeMean = checkoutTypeList.find(x => x.id === this.weightFormValidate.testType).name;
                    this.weightFormValidate.testTypeMean = parseFloat(content.res.testType) === 1 ? '初试' : '复试';

                    this.weightFormValidate.workshopId = content.res.workshopId;
                    this.weightFormValidate.workshopName = content.res.workshopName;
                    this.weightFormValidate.isTest = content.res.isTest === true ? '1' : '0';
                    //
                    this.weightFormValidate.productId = content.res.productId;
                    this.weightFormValidate.productCode = content.res.productCode;
                    this.weightFormValidate.processId = content.res.processId;
                    this.weightFormValidate.processName = content.res.processName;
                    this.weightFormValidate.productName = content.res.productName;
                    this.weightFormValidate.batchCode = content.res.batchCode;
                    this.weightFormValidate.gramWeight = content.res.gramWeight;
                    this.weightFormValidate.gramDeviation = content.res.gramDeviation ? content.res.gramDeviation : 0;
                    this.weightFormValidate.moistureRegain = content.res.moistureRegain;
                    this.weightFormValidate.meters = content.res.meters;
                    // this.weightFormValidate.testMeters = content.res.meters;
                    // this.weightFormValidate.numbers = content.res.numbers;
                    //
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.submitName = content.res.submitName;
                    this.submitTime = content.res.submitTime;
                    this.weightFormValidate.samplingMeters = Number(content.res.samplingMeters);
                    this.weightFormValidate.testMeters = Number(content.res.testMeters);
                    this.weightFormValidate.gramDeviation = Number(content.res.gramDeviation);
                    this.weightModalData = content.res.qmWeightDetailList.map(x => {
                        x.isStandard = x.isStandard === false ? '不合格' : '合格';
                        x.gramWeight = content.res.gramWeight;
                        return x;
                    });
                    this.weightModalData.push(
                        {
                            qmWeightId: content.res.id,
                            weight: Number(content.res.weight),
                            gramWeight: content.res.gramWeight,
                            dryWeight: content.res.dryWeight,
                            weightDeviation: content.res.weightDeviation,
                            isStandard: content.res.isStandard === false ? '不合格' : '合格'
                        });
                    // debugger
                    if (this.reexamine) {
                        this.weightModalData.map(x => {
                            x.weight = null;
                            x.dryWeight = null;
                            x.gramWeight = content.res.gramWeight,
                            x.weightDeviation = null;
                            x.isStandard = null;
                            return x;
                        });
                    }
                    this.weightShow = true;
                    // this.weightTitle = '编辑重量质检';
                }
            });
        },
        selectWeight (val) {
            if (val.length) this.auditDisabled = false;
            else this.auditDisabled = true;
            this.curQmWeightIds = val.map(x => x.id);
            this.curQmWeightValue = val.filter(x => x.auditState === 1);
        },
        // 改变页码---页数------------------
        changePageIndexWeight (val) {
            this.weightPageIndex = val;
            this.getQmWeightList();
        },
        changePageSizeWeight (val) {
            this.weightPageSize = val;
            this.getQmWeightList();
        },
        // 改变页码---页数------------------
        // modal提交-取消-------------------
        changeWorkshop (val) {
            this.weightFormValidate.productCode = '';
            this.weightFormValidate.processName = '';
            this.weightFormValidate.productName = '';
            this.weightFormValidate.batchCode = '';
            this.weightFormValidate.gramWeight = null;
            this.weightFormValidate.moistureRegain = null;
            this.weightFormValidate.meters = null;
            // this.weightFormValidate.numbers = null;
            this.weightModalData.map(x => {
                x.weight = null;
                x.dryWeight = null;
                x.gramWeight = null;
                x.weightDeviation = null;
                x.isStandard = null;
                return x;
            });
        },
        getDryWeightNumber () {
            const _this = this;
            if (this.weightFormValidate.moistureRegain === '' || this.weightFormValidate.moistureRegain === undefined || this.weightFormValidate.moistureRegain === null) {
                _this.weightModalData.map(x => {
                    x.dryWeight = '';
                    x.weightDeviation = '';
                    return x;
                });
                _this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择机台</p>'
                });
                return false;
            } else {
                _this.weightModalData.map(x => {
                    if (x.weight === '' || x.weight === undefined || x.weight === null) {
                        x.dryWeight = '';
                    } else {
                        x.dryWeight = (x.weight / (1 + _this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                        x.weightDeviation = ((x.dryWeight - x.gramWeight) / x.gramWeight).toFixed(2);
                        x.isStandard = Math.abs(x.weightDeviation) < (_this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                    }
                    return x;
                });
                if (this.weightModalData.length === 1) {
                    this.weightModalData = [];
                }
            }
            this.getWeightTotal();
        },
        weightSave () {
            this.isSave = true;
            this.isSaveSubmit = false;
            this.judgeParams();
        },
        weightSaveSubmit () {
            this.isSave = false;
            this.isSaveSubmit = true;
            this.judgeParams();
            // this.weightLoading = false;
            // this.weightShow = false;
        },
        changeMoistureRegin (val) {
            this.weightFormValidate.moistureRegain = val;
            // debugger
            this.weightModalData.map(item => {
                item.dryWeight = (item.weight / (1 + this.weightFormValidate.moistureRegain / 100)).toFixed(2);
                item.weightDeviation = ((item.dryWeight - item.gramWeight) / item.gramWeight).toFixed(2);
                item.isStandard = Math.abs(item.weightDeviation) < (this.weightFormValidate.gramDeviation / 100) ? '合格' : '不合格';
                return item;
            })
        },
        judgeParams () {
            if (this.weightFormValidate.productId === undefined || this.weightFormValidate.productId === '' || this.weightFormValidate.productId === null) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择机台！</p>'
                });
                return false;
            }
            if (this.weightModalData.find(x => x.weight === '') || this.weightModalData.find(x => x.weight === undefined) || this.weightModalData.find(x => x.weight === null)) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请将所有的检验填写完整！</p>'
                });
                return false;
            }
            const _this = this;
            let params = {
                id: this.reexamine === true ? null : (this.curQmWeightId ? _this.curQmWeightId : null),
                qmDate: this.testDate,
                inspectorId: this.weightFormValidate.inspectorId,
                inspectorName: this.weightFormValidate.inspectorName,
                testType: this.weightFormValidate.testType,
                workshopId: this.weightFormValidate.workshopId,
                processId: this.weightFormValidate.processId,
                processName: this.weightFormValidate.processName,
                productId: this.weightFormValidate.productId,
                machineId: this.weightFormValidate.machineId,
                productCode: this.weightFormValidate.productCode,
                productName: this.weightFormValidate.productName,
                batchCode: this.weightFormValidate.batchCode,
                // gramWeight: this.weightFormValidate.gramWeight,
                gramWeight: this.weightModalData[this.weightModalData.length - 1].gramWeight,
                meters: this.weightFormValidate.meters,
                qmTypeId: this.dataType.id,
                isTest: this.weightFormValidate.isTest === '1' ? true : false,
                auditState: this.isSave ? 1 : 2,
                weightNum: this.weightModalData.length - 1,
                weight: this.weightModalData[this.weightModalData.length - 1].weight,
                dryWeight: this.weightModalData[this.weightModalData.length - 1].dryWeight,
                weightDeviation: this.weightModalData[this.weightModalData.length - 1].weightDeviation,
                isStandard: this.weightModalData[this.weightModalData.length - 1].isStandard === '合格' ? true : false,
                // numbers: this.weightFormValidate.numbers,
                moistureRegain: this.weightFormValidate.moistureRegain,
                gramDeviation: this.weightFormValidate.gramDeviation,
                samplingMeters: this.weightFormValidate.samplingMeters,
                testMeters: this.weightFormValidate.testMeters,
                qmWeightDetailList: this.weightModalData.slice(0, this.weightModalData.length - 1).map(item => {
                    return {
                        qmWeightId: this.reexamine === true ? null : (this.curQmWeightId ? _this.curQmWeightId : null),
                        weight: item.weight,
                        dryWeight: item.dryWeight,
                        weightDeviation: item.weightDeviation,
                        isStandard: item.isStandard === '合格' ? true : false
                    };
                })
            };
            this.saveQmWeight(params);
        },
        saveQmWeight (params) {
            if (this.isSave) {
                this.weightSaveLoading = true;
                this.weightSaveSubmitLoading = false;
            } else {
                this.weightSaveLoading = false;
                this.weightSaveSubmitLoading = true;
            }
            this.$api.weight.getQmWeightSave(params).then(res => {
                let content = res.data;
                this.weightSaveLoading = false;
                this.weightSaveSubmitLoading = false;
                if (content.status === 200) {
                    this.getQmWeightList();
                    this.isSave ? this.$Message.success('保存成功') : this.$Message.success('提交成功');
                    this.isSave = false;
                    this.isSaveSubmit = false;
                    this.reexamine = false;
                    this.weightShow = false;
                    this.selectMachineCode = '';
                }
            });
        },
        weightCancel () {
            this.weightLoading = false;
            this.weightShow = false;
            this.isSave = false;
            this.isSaveSubmit = false;
            this.selectMachineCode = '';
            this.reexamine = false;
        },
        // modal提交-取消-------------------
        // modal ---------------------------
        changeTestDate (val) {
            this.testData = val;
        },
        // 测试是否合格
        testStandard () {
            this.getDryWeightNumber();
        },
        // 选择机台
        selectMachine (val) {
            if (val.machineId) {
                this.weightFormValidate.machineId = val.machineId;
                this.weightFormValidate.productId = val.productId;
                this.weightFormValidate.processId = val.processId;
                this.weightFormValidate.productCode = val.productCode;
                this.weightFormValidate.processName = val.processName;
                this.weightFormValidate.productName = val.productName;
                this.weightFormValidate.batchCode = val.batchCode;
                this.weightFormValidate.gramWeight = val.gramWeight;
                this.weightFormValidate.gramDeviation = val.gramDeviation ? val.gramDeviation : 0;
                this.weightFormValidate.moistureRegain = val.moistureRegain;
                this.weightFormValidate.meters = val.meters;
                this.weightFormValidate.testMeters = val.meters;
                // this.weightFormValidate.numbers = val.numbers;
                this.getWeightModalNumber();
            } else {
                this.weightFormValidate.machineId = null;
                this.weightFormValidate.productId = null;
                this.weightFormValidate.processId = null;
                this.weightFormValidate.gramDeviation = 0;
                this.weightFormValidate.productCode = '';
                this.weightFormValidate.processName = '';
                this.weightFormValidate.productName = '';
                this.weightFormValidate.batchCode = '';
                this.weightFormValidate.gramWeight = '';
                this.weightFormValidate.moistureRegain = null;
                this.weightFormValidate.meters = '';
                this.weightFormValidate.testMeters = '';
                // this.weightFormValidate.numbers = '';
            }
        },
        changeSamplingMeters (val) {
            this.weightFormValidate.samplingMeters = val;
            // 计算分成几个
            this.getWeightModalNumber();
        },
        //
        changeTestMeters (val) {
            this.weightFormValidate.testMeters = val;
            // 计算分成几个
            this.getWeightModalNumber();
        },
        //
        getWeightModalNumber () {
            this.num = parseInt(this.weightFormValidate.samplingMeters / this.weightFormValidate.testMeters);
            this.weightModalData = [];
            let data = {
                weight: 0,
                dryWeight: null,
                // gramWeight: ((this.weightFormValidate.gramWeight / this.weightFormValidate.meters) * this.weightFormValidate.testMeters).toFixed(2),
                gramWeight: this.weightFormValidate.gramWeight,
                weightDeviation: null,
                isStandard: ''
            };
            for (let i = 0; i <= this.num; i++) {
                this.weightModalData.push(data);
            }
        },
        getWeightTotal () {
            let aReturn = false;
            for (let i = 0; i < this.weightModalData.length - 1; i++) {
                if (!this.weightModalData[i].weight) {
                    aReturn = true;
                }
            }
            if (aReturn) {
                return false
            }
            // debugger;
            let weight = this.getAverageValue(this.weightModalData.map(x => x.weight));
            let dryWeight = this.getAverageValue(this.weightModalData.map(x => x.dryWeight));
            let weightDeviation = this.getAverageValue(this.weightModalData.map(x => x.weightDeviation));
            let isStandard = '合格';
            for (let j = 0; j < this.weightModalData.length - 1; j++) {
                if (this.weightModalData[j].isStandard === '不合格') {
                    isStandard = '不合格';
                }
                if (this.weightModalData[j].isStandard === '' || this.weightModalData[j].isStandard === undefined || this.weightModalData[j].isStandard === null) {
                    isStandard = '';
                }
            }
            this.weightModalData[this.weightModalData.length - 1].weight = Number(weight);
            this.weightModalData[this.weightModalData.length - 1].dryWeight = dryWeight;
            this.weightModalData[this.weightModalData.length - 1].gramWeight = this.weightFormValidate.gramWeight;
            this.weightModalData[this.weightModalData.length - 1].weightDeviation = weightDeviation;
            this.weightModalData[this.weightModalData.length - 1].isStandard = isStandard;
        },
        getAverageValue (params) {
            let num = null;
            for (let i = 0; i < params.length - 1; i++) {
                if (params[i] === '' || params[i] === undefined || params[i] === null) {
                    params[i] = 0;
                }
                num += Number(params[i]);
            }
            return (num / (params.length - 1)).toFixed(2);
        },
        getQmWeightList () {
            const _this = this;
            let params = {
                pageSize: this.weightPageSize,
                pageIndex: this.weightPageIndex,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                workshopId: this.curWorkshopId,
                processId: this.curQmWeightProcessId,
                testType: this.curCheckoutTypeId,
                auditState: this.curSubmissionTypeId,
                productCodeName: this.productCodeName.trim(),
                machineCodeName: this.machineCodeName.trim()
            };
            this.$call('qm.weight.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.weightTotal = content.count;
                    this.weightData = content.res.map(item => {
                        item.isStandardMean = item.isStandard === true ? '合格' : '不合格';
                        item.testTypeMean = checkoutTypeList.find(x => x.id === item.testType).name;
                        item.auditStateMean = submissionTypeList.find(x => x.id === item.auditState).name;
                        item.workshopName = _this.workshopList.find(x => x.deptId === item.workshopId).deptName;
                        return item;
                    });
                    _this.auditDisabled = true;
                    this.curQmWeightIds = [];
                    this.curQmWeightValue = [];
                    this.auditDisabled = true;
                }
            });
        },
        //
        deleteWarnCancel () {
            this.deleteWarnShow = false;
            this.deleteWarnLoading = false;
        },
        deleteWarnConfirm () {
            let ids = this.curQmWeightValue.map(x => x.id);
            if (ids.length === 0) {
                return false;
            }
            this.deleteWarnLoading = true;
            this.$api.weight.deleteQmWeight(ids).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.$Message.success('删除成功');
                    this.deleteWarnShow = false;
                    this.getQmWeightList();
                }
            });
        },
        rowClassName (row, index) {
            if (index === this.weightModalData.length -1) {
                return 'fontTableBold';
            }
            return '';
        },
        // modal ----------------------
        // 公共区域 -----------------------------------
        // 获取车间
        getWorkshopList () {
            const _this = this;
            this.$api.dept.getWorkshopList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.workshopList = content.res;
                    if (_this.workshopList.find(x => x.isDefault === 1)) _this.curWorkshopId = _this.workshopList.find(x => x.isDefault === 1).deptId;
                    else _this.curWorkshopId = _this.workshopList[0].deptId;
                    _this.getQmWeightList();
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
        },
        // 获取当前员工
        getUserInfo () {
            this.$api.user.getUserInfo().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.weightFormValidate.inspectorName = content.res.name;
                    this.weightFormValidate.inspectorId = content.res.id;
                }
            });
        },
        //
        getStartDay () {
            let mydate = new Date();
            let y = mydate.getFullYear();
            let m = mydate.getMonth() + 1;
            let d = mydate.getDate();
            if (m < 10) {
                m = '0' + m;
            }
            if (d < 10) {
                d = '0' + d;
            }
            return this.curDate = y + '-' + m + '-' + d;
        }
    },
    created () {
        this.getStartDay();
        this.getWorkshopList();
        this.getProcessList();
        this.getUserInfo();
    },
    mounted () {
        this.$api.dictionary.getQmType().then(res => {
            let content = res.data;
            if (content.status === 200) {
                this.dataType = content.res.find(x => x.name === '重量检验');
            }
        });
        this.$nextTick(() => {
            // this.processList = Cookies.get('allProcessList');
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 200;
            }
        };
    }
});

// import publicJs from "../../public/common/common";
import {curDate, page} from '../../../libs/tools';
// import {mapState} from 'vuex';
// import publicJs from '../../public/common/common';
import modal from '../../public/modal';
import selectMachineQuality from '../../components/xw-select-machine/xw-select-machine-quality';
import {checkoutTypeList, submissionTypeList, enableState, auditStateList} from '../../../libs/utilState';
import deleteWarning from '../../public/deleteWarning';
import otherMessage from '../../components/otherMessage';
import qualityModal from './modal';
export default ({
    // computed: {
    //     ...mapState({
    //         searchPageOpts: state => state.pageOpts,
    //         searchPageSize: state => state.pageSize
    //     })
    // },
    components: {
        qualityModal,
        deleteWarning,
        otherMessage,
        modal,
        selectMachineQuality
    },
    props: {
        // dataType: {
        //     type: Object
        // }
    },
    data () {
        return {
            qualityShow: false,
            searchPageOpts: page().pageOpts,
            searchPageSize: page().pageSize,
            dataType: {},
            auditDisabled: false,
            dateFrom: '',
            dateTo: curDate(),
            curWorkshopId: null,
            curQmSearchProcessId: '',
            curCheckoutTypeId: '',
            curSubmissionTypeId: '',
            productCodeName: '',
            machineCodeName: '',
            workshopList: [],
            processList: [],
            isShowSearch: false,
            checkoutTypeList: checkoutTypeList,
            submissionTypeList: submissionTypeList,
            //
            isEdit: false,
            curQmSearchId: '',
            searchColumns: [
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
                    width: 200,
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
                                        this.curQmSearchId = params.row.id;
                                        this.isEdit = true;
                                        this.reexamine = true;
                                        this.testTitle = '编辑' + this.dataType.name;
                                        this.getQmSearchDetail();
                                    }
                                }
                            }, '复试')
                        ]);
                    }
                },
                {
                    title: '机台',
                    key: 'machineCode',
                    fixed: 'left',
                    align: 'left',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('a', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 2) {
                                        this.isShowSaveOrSubmit = false;
                                    } else {
                                        this.isShowSaveOrSubmit = true;
                                    }
                                    this.reexamine = false;
                                    // this.isShowSaveOrSubmit = false;
                                    this.curQmSearchId = params.row.id;
                                    this.isEdit = true;
                                    this.getQmSearchDetail();
                                    this.testTitle = params.row.auditState === 2 ? this.dataType.name + '详情' : '编辑' + this.dataType.name;
                                }
                            }
                        }, params.row.machineCode);
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
                    title: '质检类别',
                    key: 'dataTypeMean',
                    fixed: 'left',
                    align: 'left',
                    minWidth: 100
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
                    minWidth: 100
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    align: 'left',
                    minWidth: 80
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
                    title: '测试类型',
                    key: 'testTypeMean',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    minWidth: 100
                }
            ],
            tableHeight: '',
            searchData: [],
            searchTotal: 0,
            searchPageIndex: 1,
            testShow: false,
            testSaveLoading: false,
            testSaveSubmitLoading: false,
            testTitle: '',
            isShowSaveOrSubmit: true,
            testFormValidate: {
                inspectorId: '',
                prdOrderId: '',
                inspectorName: '',
                dataTypeName: '',
                workshopName: '',
                machineCode: '',
                processName: '',
                productCode: '',
                productName: '',
                batchCode: '',
                isTest: '1',
                testTypeMean: '',
                prdNoticeId: '',
                prdNoticeCode: '',
                isStandard: ''
            },
            testRuleValidate: {},
            testDate: '',
            testModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                // {
                //     title: '生产通知单号',
                //     key: 'prdNoticeCode',
                //     align: 'center',
                //     minWidth: 80
                // },
                {
                    title: '检测指标',
                    key: 'qmParamName',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标上限值',
                    key: 'valueMax',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标下限值',
                    key: 'valueMin',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '指标检测值',
                    key: 'detectionValue',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.detectionValue === null ? null : Number(params.row.detectionValue)
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.detectionValue = val;
                                    if (val >= params.row.valueMin && val <= params.row.valueMax) {
                                        params.row.isStandard = '合格';
                                    } else {
                                        params.row.isStandard = '不合格';
                                    }
                                    this.testModalData[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '是否合格',
                    key: 'isStandard',
                    align: 'center',
                    minWidth: 80
                }
            ],
            testModalData: [],
            isShowMachineList: false,
            selectMachineCode: '',
            isStandardTypeList: enableState,
            machineOpenId: null,
            curQmSearchIds: [],
            curQmSearchValue: [],
            // 提示
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            isSave: false,
            isSaveSubmit: false,
            createTime: '',
            createName: '',
            submitName: '',
            submitTime: ''
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
                // this.qualityShow = false;
                if (content.status === 200) {
                    this.qualityShow = false;
                    this.$Message.success('停车通知');
                    this.getQmInspectionList();
                }
            });
        },
        onCancel () {
            this.qualityShow = false;
        },
        getQmInspectionList () {
            let params = {
                pageSize: this.searchPageSize,
                pageIndex: this.searchPageIndex,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                workshopId: this.curWorkshopId,
                processId: this.curQmSearchProcessId,
                testType: this.curCheckoutTypeId,
                auditState: this.curSubmissionTypeId,
                productCodeName: this.productCodeName.trim(),
                machineCodeName: this.machineCodeName.trim(),
                qmTypeId: this.dataType.id
            };
            this.$api.inspection.getQmInspectionList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.searchData = content.res.map(item => {
                        this.searchTotal = content.count;
                        item.dataTypeMean = this.dataType.name;
                        item.testTypeMean = checkoutTypeList.find(x => x.id === item.testType).name;
                        // item.isStandard = item.isStandard === '123' ? 123 : '123';
                        item.auditStateMean = submissionTypeList.find(x => x.id === item.auditState).name;
                        item.isStandardMean = item.isStandard === true ? '合格' : '不合格';
                        // debugger
                        return item;
                    });
                    this.curQmSearchIds = [];
                    this.curQmSearchValue = [];
                    this.auditDisabled = true;
                    this.reexamine = false;
                }
            });
        },
        getQmSearchDetail () {
            this.$api.inspection.getQmInspectionDetail({id: this.curQmSearchId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.testDate = content.res.qmDate;
                    this.testFormValidate.workshopName = content.res.workshopName;
                    this.testFormValidate.dataTypeName = content.res.qmTypeId;
                    this.testFormValidate.dataTypeName = content.res.qmTypeName;
                    // this.curWorkshopId = null;
                    this.testFormValidate.machineId = content.res.machineId;
                    this.testFormValidate.machineCode = content.res.machineCode;
                    this.testFormValidate.processId = content.res.processId;
                    this.testFormValidate.processName = content.res.processName;
                    this.testFormValidate.productId = content.res.productId;
                    this.testFormValidate.productCode = content.res.productCode;
                    this.testFormValidate.productName = content.res.productName;
                    this.testFormValidate.batchCode = content.res.batchCode;
                    this.testFormValidate.prdNoticeId = content.res.prdNoticeId;
                    this.testFormValidate.prdNoticeCode = content.res.prdNoticeCode;
                    this.testFormValidate.isTest = content.res.isTest === true ? '1' : '0';
                    this.testFormValidate.testType = this.reexamine === true ? 2 : 1;
                    this.testFormValidate.testTypeMean = checkoutTypeList.find(x => x.id === this.testFormValidate.testType).name;
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.submitName = content.res.submitName;
                    this.submitTime = content.res.submitTime;
                    // this.testFormValidate.testTypeMean = '';
                    // this.testFormValidate.testTypeMean = checkoutTypeList[0].name;
                    this.testFormValidate.isStandard = content.res.isStandard === true ? 1 : 0;
                    this.testModalData = content.res.qmInspectionParamList.map(x => {
                        x.detectionValue = this.reexamine ? null : x.detectionValue;
                        x.isStandard = this.reexamine ? null : (x.isStandard === false ? '不合格' : '合格');
                        return x;
                    });
                    // if (this.reexamine) {
                    //     this.testModalData = [];
                    // }
                    this.testShow = true;
                }
            });
        },
        addNewQmSearch () {
            this.createTime = '';
            this.createName = '';
            this.submitName = '';
            this.submitTime = '';
            this.isShowSaveOrSubmit = true;
            this.reexamine = false;
            this.curQmSearchId = null;
            this.selectMachineCode = null;
            this.isEdit = false;
            this.testShow = true;
            this.testTitle = '新增' + this.dataType.name;
            //
            this.testDate = curDate();
            // this.testFormValidate.testTypeMean = '';
            this.testFormValidate.workshopName = '';
            this.testFormValidate.dataTypeName = this.dataType.name;
            // this.curWorkshopId = null;
            //
            this.testFormValidate.machineCode = '';
            this.testFormValidate.machineId = '';
            this.testFormValidate.processId = '';
            this.testFormValidate.productId = '';
            this.testFormValidate.processName = '';
            this.testFormValidate.productCode = '';
            this.testFormValidate.productName = '';
            this.testFormValidate.batchCode = '';
            this.testFormValidate.prdNoticeCode = '';
            this.testFormValidate.isTest = '1';
            this.testFormValidate.testType = 1;
            // this.testFormValidate.testTypeMean = '';
            this.testFormValidate.testTypeMean = checkoutTypeList[0].name;
            this.testFormValidate.isStandard = 1;
            this.testModalData = [];
        },
        submitQmSearch () {
            this.$api.inspection.getQmInspectionSubmit(this.curQmSearchIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmInspectionList();
                    this.$Message.success('提交成功');
                }
            });
        },
        selectSearch (val) {
            if (val.length) this.auditDisabled = false;
            else this.auditDisabled = true;
            this.curQmSearchIds = val.map(x => x.id);
            this.curQmSearchValue = val.filter(x => x.auditState !== 1 || x.isStopNotice === true);
        },
        cancelQmSearch () {
            this.$api.inspection.getQmInspectionCancel(this.curQmSearchIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getQmInspectionList();
                    this.$Message.success('撤销成功');
                }
            });
        },
        deleteQmWeight () {
            if (this.curQmSearchValue.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已提交或者已通知数据，不能删除！</p>'
                });
                return false;
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        changeDateFrom (val) {
            this.dateFrom = val;
        },
        changeDateTo (val) {
            this.dateTo = val;
        },
        changeTestDate (val) {
            this.testDate = val;
        },
        changePageIndexSearch (val) {
            this.searchPageIndex = val;
            this.getQmInspectionList();
        },
        changePageSizeSearch (val) {
            this.searchPageSize = val;
            this.getQmInspectionList();
        },
        changeSearchShow () {
            this.isShowSearch = !this.isShowSearch;
        },
        searchQmSearch () {
            this.searchPageIndex = 1;
            setTimeout(() => {
                this.searchTotal = 0;
            });
            this.getQmInspectionList();
        },
        // 选择机台
        selectMachine (val) {
            if (val) {
                this.machineOpenId = val.id;
                this.testFormValidate.machineId = val.machineId;
                this.testFormValidate.productId = val.productId;
                this.testFormValidate.processId = val.processId;
                this.testFormValidate.productCode = val.productCode;
                this.testFormValidate.processId = val.processId;
                this.testFormValidate.processName = val.processName;
                this.testFormValidate.productName = val.productName;
                this.testFormValidate.batchCode = val.batchCode;
                this.testFormValidate.prdNoticeCode = val.prdNoticeCode;
                this.testFormValidate.prdNoticeId = val.prdNoticeId;
                this.testFormValidate.prdOrderId = val.prdOrderId;
                this.testFormValidate.machineCode = val.machineCode;
                this.getMachineOpenDetailList();
            } else {
                this.weightFormValidate.machineId = null;
                this.weightFormValidate.productId = null;
                this.weightFormValidate.processId = null;
                this.weightFormValidate.prdNoticeCode = '';
                this.weightFormValidate.prdNoticeId = '';
                this.weightFormValidate.productCode = '';
                this.weightFormValidate.processName = '';
                this.weightFormValidate.productName = '';
                this.weightFormValidate.batchCode = '';
                this.weightFormValidate.machineCode = '';
                this.testModalData = [];
            }
        },
        getMachineOpenDetailList () {
            let params = {
                productId: this.testFormValidate.productId,
                // processId: this.testFormValidate.processId,
                // prdOrderId: this.testFormValidate.prdOrderId,
                qmTypeId: this.dataType.id
            };
            this.$api.quota.getQmProductParamList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.testModalData = content.res.map(item => {
                        item.detectionValue = null;
                        item.isStandard = null;
                        return item;
                    });
                }
            });
        },
        // modal
        testSave () {
            this.selectMachineCode = '';
            this.isSave = true;
            this.isSaveSubmit = false;
            this.getParams();
        },
        testCancel () {
            this.testShow = false;
            this.selectMachineCode = '';
            this.isSave = false;
            this.isSaveSubmit = false;
        },
        testSaveSubmit () {
            this.selectMachineCode = '';
            this.isSave = false;
            this.isSaveSubmit = true;
            this.getParams();
        },
        getParams () {
            if (this.testFormValidate.machineId === null || this.testFormValidate.machineId === '' || this.testFormValidate.machineId === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请选择机台</p>'
                });
                return false;
            }
            if (this.testModalData.length === 0) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>没有检测指标</p>'
                });
                return false;
            }
            if (this.testModalData.find(x => x.detectionValue === '') || this.testModalData.find(x => x.detectionValue === null) || this.testModalData.find(x => x.detectionValue === undefined)) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>存在指标测试值为空</p>'
                });
                return false;
            }
            // debugger
            let params = {
                id: this.reexamine === true ? null : (this.curQmSearchId ? this.curQmSearchId : null),
                qmDate: this.testDate,
                qmTypeId: this.dataType.id,
                testType: this.testFormValidate.testType,
                isTest: this.testFormValidate.isTest === '1',
                isStandard: this.testFormValidate.isStandard === 1,
                inspectorId: this.testFormValidate.inspectorId,
                inspectorName: this.testFormValidate.inspectorName,
                workshopId: this.curWorkshopId,
                machineId: this.testFormValidate.machineId,
                processId: this.testFormValidate.processId,
                productId: this.testFormValidate.productId,
                batchCode: this.testFormValidate.batchCode,
                prdNoticeId: this.testFormValidate.prdNoticeId,
                prdNoticeCode: this.testFormValidate.prdNoticeCode,
                auditState: this.isSave ? 1 : 2,
                qmInspectionParamList: this.testModalData.map(item => {
                    return {
                        detectionValue: item.detectionValue,
                        isStandard: item.isStandard !== '不合格',
                        qmInspectionId: this.reexamine === true ? null : (this.curQmSearchId ? this.curQmSearchId : null),
                        qmParamId: item.qmParamId,
                        qmParamName: item.qmParamName,
                        valueMax: item.valueMax,
                        valueMin: item.valueMin
                    };
                })
            };
            this.getParamsSave(params);
        },
        getParamsSave (params) {
            // console.log(params);
            if (this.isSave) {
                this.testSaveLoading = true;
            }
            if (this.isSaveSubmit) {
                this.testSaveSubmitLoading = true;
            }
            this.$api.inspection.getQmInspectionSave(params).then(res => {
                let content = res.data;
                if (this.isSave) {
                    this.testSaveLoading = false;
                }
                if (this.isSaveSubmit) {
                    this.testSaveSubmitLoading = false;
                }
                if (content.status === 200) {
                    this.getQmInspectionList();
                    this.testShow = false;
                    this.isSave ? this.$Message.success('保存成功') : this.$Message.success('提交成功');
                    // this.$Message.success('保存成功');
                }
            });
        },
        changeWorkshop (val) {
            this.weightFormValidate.machineId = null;
            this.weightFormValidate.productId = null;
            this.weightFormValidate.processId = null;
            this.weightFormValidate.productCode = '';
            this.weightFormValidate.processName = '';
            this.weightFormValidate.productName = '';
            this.weightFormValidate.batchCode = '';
            this.weightFormValidate.prdNoticeId = '';
            this.weightFormValidate.prdNoticeCode = '';
            this.weightFormValidate.machineCode = '';
            this.testModalData = [];
        },
        //
        deleteWarnCancel () {
            this.deleteWarnShow = false;
            this.deleteWarnLoading = false;
        },
        deleteWarnConfirm () {
            let ids = this.curQmSearchValue.map(x => x.id);
            if (ids.length === 0) {
                return false;
            }
            this.deleteWarnLoading = true;
            this.$api.inspection.deleteQmInspection(ids).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.getQmInspectionList();
                    this.$Message.success('删除成功');
                    this.deleteWarnShow = false;
                }
            });
        },
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
                    this.getQmInspectionList();
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
                    // this.testFormValidate.machineCode = val.machineCode;
                    this.testFormValidate.inspectorName = content.res.name;
                    this.testFormValidate.inspectorId = content.res.id;
                }
            });
        }
    },
    created () {
        this.selectMachineCode = null;
        this.$api.dictionary.getQmType().then(res => {
            let content = res.data;
            if (content.status === 200) {
                // this.dataType = content.res[3];
                this.dataType = content.res.find(x => x.name === '强度检验');
                this.getWorkshopList();
            }
        });
        // console.log(this.dataType);
        this.getProcessList();
        this.getUserInfo();
    },
    mounted () {
        this.$nextTick(() => {
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

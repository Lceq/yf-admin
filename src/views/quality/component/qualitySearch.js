import {curDate} from '../../../libs/tools';
import {mapState} from 'vuex';
import publicJs from '../../../libs/common';
import modal from '../../public/modal';
import selectMachine from '../../components/select-machine';
export default ({
    computed: {
        ...mapState({
            searchPageOpts: state => state.pageOpts,
            searchPageSize: state => state.pageSize
        })
    },
    components: {
        modal,
        selectMachine
    },
    props: {
        dataType: {
            type: Object
        }
    },
    data () {
        return {
            auditDisabled: false,
            dateFrom: curDate(),
            dateTo: curDate(),
            curWorkshopId: '',
            curQmWeightProcessId: '',
            curCheckoutTypeId: '',
            curSubmissionTypeId: '',
            productCodeName: '',
            machineCodeName: '',
            workshopList: [],
            processList: [],
            isShowSearch: false,
            checkoutTypeList: [],
            submissionTypeList: [],
            //
            isEdit: false,
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
                    minWidth: 100
                },
                {
                    title: '机台',
                    key: 'machineCode',
                    fixed: 'left',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '检验日期',
                    key: 'qmDate',
                    align: 'center',
                    fixed: 'left',
                    minWidth: 120
                },
                {
                    title: '质检类别',
                    key: 'testTypeMean',
                    fixed: 'left',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '车间',
                    key: 'workshopName',
                    align: 'center',
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
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '是否合格',
                    key: 'samplingMeters',
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
                    title: '检验类型',
                    key: 'testTypeMean',
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
                inspectorName: ''
            },
            testRuleValidate: {},
            testDate: '',
            testModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    minWidth: 80
                },
                {
                    title: '检测指标',
                    key: 'detectionValue',
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
                    key: 'isStandard',
                    align: 'center',
                    minWidth: 80
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
            isEditMachineCode: false
        };
    },
    methods: {
        getQmInspectionList () {
            // this.$api.inspection.getQmInspectionList().then(res => {
            //     let content = res.data;
            //     if (content.status === 200) {
            //         // this.searchData = content.res;
            //     }
            // });
        },
        addNewQmSearch () {
            this.testShow = true;
            this.testTitle = '新增' + this.dataType.name;
        },
        submitQmSearch () {},
        cancelQmSearch () {},
        deleteQmWeight () {},
        changeDateFrom () {},
        changeDateTo () {},
        changeTestDate () {},
        changePageIndexSearch () {},
        changePageSizeSearch () {},
        changeSearchShow () {
            this.isShowSearch = !this.isShowSearch;
        },
        searchQmSearch () {},
        confirmMachine () {},
        // modal
        testSave () {
            this.testShow = false;
        },
        testCancel () {
            this.testShow = false;
        },
        testSaveSubmit () {
            this.testShow = false;
        },
        changeWorkshop () {},
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
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        },
        // 获取当前员工
        getUserInfo () {
            this.$api.user.getUserInfo().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.testFormValidate.inspectorName = content.res.loginName;
                    this.testFormValidate.inspectorId = content.res.id;
                }
            });
        }
    },
    created () {
        console.log(this.dataType);
        this.getWorkshopList();
        this.getProcessList();
        this.getUserInfo();
    }
});

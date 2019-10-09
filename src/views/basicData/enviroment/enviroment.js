import modal from  '../../public/modal';
import deleteWarning from  '../../public/deleteWarning';
import {page, curDate} from "../../../libs/tools";
import xwValidate from '../../../libs/xwValidate';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';

export default ({
    components: {
        modal,
        xwOperationLogModal,
        deleteWarning
    },
    data () {
        return {
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
            disabled: true,
            processId: '',
            processList: [],
            postName: '',
            codeName: '',
            total: 0,
            list: [],
            tableHeight: '',
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '区域编号',
                    key: 'code',
                    align: 'left',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 3) {
                                        this.isSave = false;
                                    } else {
                                        this.isSave = true;
                                    }
                                    this.getDetail(params.row.id);
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '区域名称',
                    key: 'name',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '生产车间',
                    key: 'workshopName',
                    align: 'left',
                    minWidth: 110
                },
                {
                    title: '设置温度',
                    key: 'settingTemperature',
                    align: 'right',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '温度偏差值',
                    key: 'temperatureDeviation',
                    align: 'right',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '设置湿度%',
                    key: 'settingHumidity',
                    align: 'right',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '湿度偏差值%',
                    key: 'humidityDeviation',
                    align: 'right',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '数据状态',
                    key: 'auditState',
                    align: 'center',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.auditState === 1 ? '创建' : (params.row.auditState === 3 ? '已审核' : ''));
                    }
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    minWidth: 130
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'left',
                    minWidth: 130
                }
            ],
            pageOpts: page().pageOpts,
            pageSize: page().pageSize,
            pageIndex: 1,
            //
            show: false,
            loading: false,
            isSave: true,
            title: '',
            fixedTitle: '',
            fixedList: [],
            fixedColumns: [],
            productColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '品种',
                    key: 'productName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '定额看台数',
                    key: 'quotaOpeningNumber',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.quotaOpeningNumber,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.quotaOpeningNumber = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班标准产量',
                    key: 'standardOutput',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutput,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutput = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班折合公斤数',
                    key: 'standardOutputKg',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutputKg,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutputKg = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '单价工资标准(千米/公斤)',
                    key: 'unitPriceWage',
                    align: 'center',
                    sortable: true,
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.unitPriceWage,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.unitPriceWage = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            packColumns: [
                {
                    title: '序号',
                    key: 'index',
                    width: 60,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '是否带纸板',
                    key: 'isCardboard',
                    align: 'center',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('span', {}, params.row.isCardboard === true ? '是' : '否');
                    }
                },
                {
                    title: '每天标准产量',
                    key: 'standardOutput',
                    align: 'center',
                    minWidth: 110,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutput,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutput = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '台班折合公斤数',
                    key: 'standardOutputKg',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.standardOutputKg,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.standardOutputKg = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '单价工资标准(吨)',
                    key: 'unitPriceWage',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.unitPriceWage,
                                min: 0
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.unitPriceWage = val;
                                    this.fixedList[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            postList: [],
            workshopList: [],
            editId: '',
            formValidate: {
                code: '',
                workshopId: '',
                name: '',
                processId: '',
                remark: '',
                settingTemperature: null,
                temperatureDeviation: null,
                settingHumidity: null,
                humidityDeviation: null
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                workshopId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                processId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                settingTemperature: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                temperatureDeviation: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                settingHumidity: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                humidityDeviation: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            hourState: false,
            quotaType: null,
            selectIds: [],
            deleteWarnShow: false,
            deleteWarnLoading: false,
            deleteWarnMsg: '',
            defaultWorkshopId: '',
            option: [],
            remoteloading: false,
            workshopId: '',
            stateId: '',
            stateList: [
                {
                    id: 1,
                    name: '创建'
                },
                {
                    id: 3,
                    name: '已审核'
                }
            ]
        };
    },
    methods: {
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getList();
            });
        },
        getProcess () {
            let params = {
                auditState: 3,
                state: 1
            };
            this.$call('process.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = content.res;
                }
            });
        },
        getList () {
            let params = {
                processId: this.processId,
                workshopId: this.workshopId,
                auditState: this.stateId,
                codeName: this.codeName,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('environment.area.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.total = content.count;
                    this.list = content.res;
                    this.selectIds = [];
                    this.selectVal = [];
                }
            });
        },
        getDetail (val) {
            this.$call('environment.area.detail', {id: val}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.editId = val;
                    this.title = content.res.auditState === 3 ? '环境区域配置详情' : '编辑环境区域配置';
                    this.formValidate = content.res;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.show = true;
                }
            });
        },
        add () {
            this.show = true;
            this.isSave = true;
            this.editId = null;
            this.title = '新增环境区域配置';
            this.formValidate.date = curDate();
            this.formValidate.workshopId = this.workshopId;
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.processId = '';
            this.formValidate.settingTemperature = null;
            this.formValidate.temperatureDeviation = null;
            this.formValidate.settingHumidity = null;
            this.formValidate.humidityDeviation = null;
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
        },
        audit () {
            this.$call('environment.area.approve', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getList();
                }
            });
        },
        unAudit () {
            this.$call('environment.area.unapprove', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getList();
                }
            });
        },
        deleteList () {
            if (this.selectVal.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核的而数据，不能删除！</p>'
                });
                return false;
            } else {
                this.deleteWarnMsg = '确定要删除吗';
                this.deleteWarnShow = true;
            }
        },
        searchList () {
            this.pageIndex = 1;
            setTimeout(() => {
                this.total = 0;
            });
            this.getList();
        },
        select (val) {
            this.selectIds = val.map(x => x.id);
            this.selectVal = val.filter(x => x.auditState === 3);
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getList();
        },
        submit () {
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.editId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        remark: this.formValidate.remark,
                        workshopId: this.formValidate.workshopId,
                        settingTemperature: this.formValidate.settingTemperature,
                        temperatureDeviation: this.formValidate.temperatureDeviation,
                        settingHumidity: this.formValidate.settingHumidity,
                        humidityDeviation: this.formValidate.humidityDeviation,
                        workshopName: this.formValidate.workshopId ? this.workshopList.find(x => x.deptId === this.formValidate.workshopId).deptName : '',
                        processId: this.formValidate.processId,
                        processName: this.formValidate.processId ? this.processList.find(x => x.id === this.formValidate.processId).name : '',
                        processCode: this.formValidate.processId ? this.processList.find(x => x.id === this.formValidate.processId).code : ''
                    };
                    this.$call('environment.area.save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.$Message.success('保存成功');
                            this.getList();
                            this.show = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        cancel () {
            this.show = false;
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.$call('environment.area.delete', this.selectIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getList();
                }
            });
        }
    },
    mounted () {
        this.getProcess();
        this.getUserWorkshop();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - H - 200;
            });
        };
    }
});

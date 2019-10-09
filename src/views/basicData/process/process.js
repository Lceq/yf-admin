import publicJs from '../../../libs/common';
import deleteWarning from '../../public/deleteWarning';
import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import processStep from './process-step';
import xwValidate from '@/libs/xwValidate';
export default {
    name: 'process',
    components: {
        otherMessage,
        deleteWarning,
        modal,
        processStep
    },
    computed: {
        cardHeight () {
            return this.$store.state.documentHeight;
        },
        rightItems () {
            return this.$store.state.moduleRightItems;
        }
    },
    data () {
        return {
            isReadonlyCode: false,
            processCombinateModalMessage: '',
            tableHeight: document.documentElement.clientHeight - 200,
            warnProcessCombinateShow: false,
            warnProcessCombinateMessage: '',
            deleteProcessCombinateLoading: false,
            processCombinateItem: {
                code: '',
                name: '',
                typeId: '',
                sortNum: 1
            },
            isDelete: false,
            isEnable: false,
            processTypeList: [],
            processColumns: [
                {
                    title: '工序组合编码',
                    key: 'code',
                    fixed: 'left',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '工序组合名称',
                    key: 'name',
                    align: 'center',
                    fixed: 'left',
                    minWidth: 120
                },
                {
                    title: '工序组合类别',
                    key: 'typeName',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    align: 'center',
                    width: 80
                },
                {
                    title: '禁用状态',
                    key: 'enableState',
                    align: 'center',
                    width: 100
                },
                {
                    title: '工序组合明细',
                    key: 'processCombinateDetail',
                    minWidth: 250,
                    render: (h, params) => {
                        return h(processStep, {
                            props: {
                                processCombinateData: params.row.processGroupDetailList
                            }
                        });
                    }
                },
                {
                    title: '操作',
                    minWidth: 150,
                    align: 'center',
                    render: (h, params) => {
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: this.rightItems.edit === false ? 'none' : 'inline-block',
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.isCouldSave = true;
                                        this.isReadonlyCode = true;
                                        this.processGroupId = params.row.id;
                                        // 获取对应的工序组合详情；
                                        this.processCombinateModalMessage = '编辑工序组合';
                                        this.getProcessGroupDetail();
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    display: this.rightItems.delete === false ? 'none' : 'inline-block',
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.processGroupId = params.row.id;
                                        // 是否删除；
                                        this.warnProcessCombinateMessage = '确定要删除吗？';
                                        this.isDelete = true;
                                        this.warnProcessCombinateShow = true;
                                    }
                                }
                            }, '删除'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type: params.row.enableState === '启用' ? 'success' : 'error'
                                },
                                style: {
                                    display: this.rightItems.disable === false ? 'none' : 'inline-block'
                                },
                                on: {
                                    click: () => {
                                        this.processGroupId = params.row.id;
                                        // 是否禁用；
                                        this.warnProcessCombinateMessage = params.row.enableState === '启用' ? '确定要启用吗？' : '确定要禁用吗？';
                                        this.isEnable = true;
                                        this.warnProcessCombinateShow = true;
                                    }
                                }
                            }, params.row.enableState)
                        ]);
                    }
                }
            ],
            ruleprocessCombinateItem: {
                code: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                typeId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            processData: [
            ],
            processCombinateModalShow: false,
            processCombinateModalLoading: false,
            processCombinateDetailColumns: [
                {
                    title: '操作',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    icon: 'md-add'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    'click': (e) => {
                                        _this.processCombinateDetailData.splice(params.index + 1, 0, {
                                            processId: '',
                                            isReport: 1,
                                            processList: _this.processList
                                        });
                                    }
                                }
                            }),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    icon: 'md-remove'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    'click': (e) => {
                                        if (_this.processCombinateDetailData.length <= 1) return;
                                        _this.processCombinateDetailData.splice(params.index, 1);
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '序号',
                    align: 'center',
                    width: 80,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '工序',
                    key: 'processId',
                    render: (h, params) => {
                        const _this = this;
                        return h('Select', {
                            props: {
                                value: params.row.processId
                            },
                            on: {
                                'on-change': (data) => {
                                    _this.processCombinateDetailData[params.index].processId = data;
                                }
                            }
                        }, [
                            _this.processList.map(item => {
                                return h('Option', {
                                    props: {
                                        value: item.id,
                                        key: item.id
                                        // style: item.style ? item.style : ''
                                    },
                                    style: {
                                        marginLeft: item.style ? '10px' : ''
                                    }
                                }, item.name);
                            })
                        ]);
                    }
                },
                {
                    title: '是否汇报',
                    key: 'isReport',
                    render: (h, params) => {
                        const _this = this;
                        return h('Select', {
                            props: {
                                value: params.row.isReport
                            },
                            on: {
                                'on-change': (data) => {
                                    _this.processCombinateDetailData[params.index].isReport = data;
                                }
                            }
                        }, [
                            _this.isReportList.map(item => {
                                return h('Option', {
                                    props: {value: item.id, key: item.id}
                                }, item.name);
                            })
                        ]);
                    }
                }
            ],
            isReportList: [
                {
                    id: 0,
                    name: '否'
                },
                {
                    id: 1,
                    name: '是'
                }
            ],
            processCombinateDetailData: [
                {
                    processId: 4,
                    isReport: '是'
                },
                {
                    processId: 4,
                    isReport: '是'
                }
            ],
            processGroupId: '',
            processList: [],
            createTime: '',
            createName: '',
            reverseTime: '',
            reverseName: '',
            forbidName: '',
            forbidTime: '',
            isCouldSave: false
        };
    },
    methods: {
        // 获取工序列表
        getProcessList () {
            const _this = this;
            this.$api.process.getSearchProcessList().then(res => {
                _this.processList = res;
                _this.processCombinateDetailData.map(item => {
                    item.processList = res;
                    return item;
                });
                _this.$store.dispatch({
                    type: 'hideLoading'
                });
            });
        },
        // // 获取工序列表
        // getProcessList () {
        //     const _this = this;
        //     this.$api.process.getSearchProcessList({
        //
        //   }).then(res => {
        //     })
        //     publicJs.processLevel().then(res => {
        //         _this.processList = res;
        //         _this.processCombinateDetailData.map(item => {
        //             item.processList = res;
        //             return item;
        //         });
        //         _this.$store.dispatch({
        //             type: 'hideLoading'
        //         });
        //     });
        // },
        blurProcessCombinateCode (val) {
            if (this.processGroupId === '' && this.processData.map(x => x.code).includes(val)) {
                this.$Modal.warning({
                    content: '<p>当前编码已存在</p>',
                    title: '提示'
                });
            }
        },
        // 字典-获取工序类别
        getProcessType () {
            this.$fetch('dict/list', {parentcode: 'process_type'}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processTypeList = content.res;
                }
            });
        },
        // 获取工序组合列表的数据
        getProcessCombinate () {
            this.$fetch('process/group/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processData = content.res.map(item => {
                        item.enableState = item.enableState === 1 ? '禁用' : '启用';
                        return item;
                    });
                    this.getProcessList();
                }
            });
        },
        // 获取对应的工序组合详情
        getProcessGroupDetail () {
            this.$fetch('process/group/detail/' + this.processGroupId).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processCombinateItem.code = content.res.code;
                    this.processCombinateItem.name = content.res.name;
                    this.processCombinateItem.sortNum = content.res.sortNum;
                    this.processCombinateItem.typeId = content.res.typeId;
                    this.processCombinateDetailData = content.res.processGroupDetailList;
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.reverseTime = content.res.updateTime;
                    this.reverseName = content.res.updateName;
                    this.forbidName = content.res.enableName;
                    this.forbidTime = content.res.enableTime;
                    this.processCombinateModalShow = true;
                }
            });
        },
        // 取消警告
        onCancelWarnProcessCombinate () {
            this.warnProcessCombinateShow = false;
        },
        // 确认警告
        onConfirmWarnProcessCombinate () {
            if (this.isDelete) {
                this.isDelete = false;
                this.deleteProcessCombinateLoading = true;
                this.$post('process/group/delete/' + this.processGroupId).then(res => {
                    let content = res.data;
                    this.deleteProcessCombinateLoading = false;
                    if (content.status === 200) {
                        this.getProcessCombinate();
                        this.warnProcessCombinateShow = false;
                        this.$Message.warning('删除成功');
                    }
                });
            }
            if (this.isEnable) {
                this.isEnable = false;
                this.deleteProcessCombinateLoading = true;
                this.$post('process/group/enable/' + this.processGroupId).then(res => {
                    let content = res.data;
                    this.deleteProcessCombinateLoading = false;
                    if (content.status === 200) {
                        this.getProcessCombinate();
                        this.warnProcessCombinateShow = false;
                        this.$Message.warning('操作成功');
                    }
                });
            }
        },
        // 新增
        addAndEditProcessCombinate () {
            this.isCouldSave = false;
            this.isReadonlyCode = false;
            this.processCombinateModalMessage = '新增工序组合';
            this.createTime = '';
            this.createName = '';
            this.reverseTime = '';
            this.reverseName = '';
            this.forbidName = '';
            this.forbidTime = '';
            this.processGroupId = '';
            this.processCombinateItem.name = '';
            this.processCombinateItem.code = '';
            this.processCombinateItem.sortNum = 1;
            this.processCombinateItem.typeId = '';
            this.processCombinateDetailData = [
                {
                    processId: '',
                    isReport: 1
                }
            ];
            this.processCombinateModalShow = true;
        },
        processCombinateModalCancel () {
            this.processCombinateModalShow = false;
        },
        // 工序组合的保存
        processCombinateModalSubmit (name) {
            const _this = this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let processDetails = [];
                    for (let i = 0; i < this.processCombinateDetailData.length; i++) {
                        if (this.processCombinateDetailData[i].processId === undefined || this.processCombinateDetailData[i].processId === '') {
                            this.$Modal.warning({
                                title: '警告',
                                content: '<p>工序组合中有工序没有进行选择</p>'
                            });
                            return false;
                        }
                        processDetails.push(
                            {
                                processId: _this.processCombinateDetailData[i].processId,
                                seqnumber: i + 1,
                                isReport: _this.processCombinateDetailData[i].isReport,
                                outProcessId: i < (_this.processCombinateDetailData.length - 1) ? _this.processCombinateDetailData[i + 1].processId : '',
                                outProcessName: i < (_this.processCombinateDetailData.length - 1) ? _this.processCombinateDetailData[i + 1].processName : '',
                                outProcessCode: i < (_this.processCombinateDetailData.length - 1) ? _this.processCombinateDetailData[i + 1].processCode : ''
                            }
                        );
                    }
                    let params = {
                        id: this.processGroupId ? this.processGroupId : null,
                        name: this.processCombinateItem.name,
                        code: this.processCombinateItem.code,
                        sortNum: this.processCombinateItem.sortNum,
                        typeId: this.processCombinateItem.typeId,
                        enableState: '',
                        processGroupDetailList: processDetails
                    };
                    this.$post('process/group/save', params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.getProcessCombinate();
                            this.$Message.success('保存成功');
                        }
                    });
                    this.processCombinateModalShow = false;
                } else {
                    // xwValidate.message();
                    xwValidate.message();
                }
            });
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        // 获取所有工序
        // this.getProcessList();
        // 字典-获取工序类别
        this.getProcessType();
        // 获取工序组合列表的数据
        this.getProcessCombinate();
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
        // let H = document.getElementById('selectedHeight').clientHeight;
        // this.tableHeight = document.documentElement.clientHeight - H - 160;
    }
};

import modal from '../../public/modal';
import {auditStateList} from '../../../libs/utilState';
import xwOperationLogModal from '../../components/xw-operation-log/xw-operation-log-modal';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
import {page} from '../../../libs/tools';
import seriesSh from './series-sh.vue';
export default ({
    components: {
        modal,
        seriesSh,
        xwOperationLogModal,
        deleteWarning
    },
    data () {
        return {
            auditDisabled: true,
            tableHeight: 660,
            isEdit: false,
            curRoundelId: null,
            auditStateList: auditStateList,
            curAuditStateId: '',
            roundelNameCode: '',
            roundelColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编号',
                    key: 'code',
                    sortable: true,
                    minWidth: 110,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.curRoundelId = params.row.id;
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.getRoundelDetail(params.row.id);
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '内圈包数',
                    key: 'innerPacketNumber',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '外圈包数',
                    key: 'outerPacketNumber',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    minWidth: 110
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    sortable: true,
                    minWidth: 110
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'center',
                    sortable: true,
                    minWidth: 130
                }
            ],
            roundelData: [],
            roundelShow: false,
            roundelLoading: false,
            roundelTitle: '',
            isCouldSave: true,
            formValidate: {
                code: '',
                name: '',
                innerPacketNumber: 1,
                outerPacketNumber: 1
            },
            ruleValidate: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                innerPacketNumber: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                outerPacketNumber: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            colorValue: '#ffffff',
            roundelTotal: 0,
            roundelPageIndex: 1,
            roundelPageOpts: page().pageOpts,
            roundelPageSize: page().pageSize,
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            operationList: [],
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            curRoundelIds: [],
            curRoundelValue: [],
            roundelSeriesShow: false,
            average: 5,
            dataList: [],
            seriesListInner: {
                average: 5,
                radius: ['33%', '90%'],
                style: 'width: 400px; height: 400px;border-radius: 100px; overflow: hidden; display: inline-block'
            },
            seriesListOutSet: {
                average: 14,
                radius: ['61%', '95%'],
                style: 'width: 600px; height: 600px;display: inline-block'
            },
            dataColorList: [],
            roundelSeriesMath: null
        };
    },
    methods: {
        addNewRoundel () {
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.operationList = [];
            this.$refs['formValidate'].resetFields();
            this.curRoundelId = null;
            this.isEdit = false;
            this.roundelShow = true;
            this.isCouldSave = true;
            this.roundelTitle = '新增清花圆盘';
            this.formValidate.code = '';
            this.formValidate.name = '';
            this.formValidate.innerPacketNumber = 1;
            this.formValidate.outerPacketNumber = 1;
        },
        auditRoundel () {
            this.$call('machine.roundel.approve', this.curRoundelIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getRoundelList();
                }
            });
        },
        unAuditRoundel () {
            this.$call('machine.roundel.unapprove', this.curRoundelIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('反审核成功');
                    this.getRoundelList();
                }
            });
        },
        deleteRoundel () {
            if (this.curRoundelIds.length !== this.curRoundelValue.filter(x => x.auditState === 1).length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核的数据，不能删除!</p>'
                });
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        roundelSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curRoundelId,
                        code: this.formValidate.code,
                        name: this.formValidate.name,
                        innerPacketNumber: this.formValidate.innerPacketNumber,
                        outerPacketNumber: this.formValidate.outerPacketNumber
                    };
                    this.roundelLoading = true;
                    this.$call('machine.roundel.save', params).then(res => {
                        let content = res.data;
                        this.roundelLoading = false;
                        if (content.status === 200) {
                            this.roundelShow = false;
                            this.getRoundelList();
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        roundelCancel () {
            this.roundelShow = false;
            this.roundelLoading = false;
        },
        getRoundelList () {
            let params = {
                roundelNameCode: this.roundelNameCode,
                pageSize: this.roundelPageSize,
                pageIndex: this.roundelPageIndex
            };
            this.$call('machine.roundel.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.roundelTotal = content.count;
                    this.roundelData = content.res.map(item => {
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        return item;
                    });
                    this.curRoundelValue = [];
                    this.curRoundelIds = [];
                    this.auditDisabled = true;
                }
            });
        },
        getRoundelDetail (id) {
            this.$call('machine.roundel.detail', {'id': id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.formValidate.code = content.res.code;
                    this.formValidate.name = content.res.name;
                    this.formValidate.innerPacketNumber = content.res.innerPacketNumber;
                    this.formValidate.outerPacketNumber = content.res.outerPacketNumber;
                    this.colorValue = content.res.colorValue;
                    this.createName = content.res.createName;
                    this.createTime = content.res.createTime;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.operationList = content.res.formActionList;
                    this.roundelShow = true;
                    this.roundelTitle = content.res.auditState === 3 ? '清花圆盘详情' : '编辑清花圆盘';
                }
            });
        },
        changePageIndexRoundel (val) {
            this.roundelPageIndex = val;
            this.getRoundelList();
        },
        changePageSizeRoundel (val) {
            this.roundelPageSize = val;
            this.getRoundelList();
        },
        selectRoundel (val) {
            if (val.length > 0) {
                this.curRoundelValue = val;
                this.curRoundelIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curRoundelValue = [];
                this.curRoundelIds = [];
                this.auditDisabled = true;
            }
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$call('machine.roundel.delete', this.curRoundelIds).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                if (content.status === 200) {
                    this.deleteWarnShow = false;
                    this.$Message.success('删除成功');
                    this.getRoundelList();
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnLoading = false;
            this.deleteWarnShow = false;
        },
        searchRoundelList () {
            this.roundelPageIndex = 1;
            setTimeout(() => {
                this.roundelTotal = 1;
            }, 0);
            this.getRoundelList();
        },
        roundelPreview () {
            this.seriesListInner.average = this.formValidate.innerPacketNumber;
            this.seriesListOutSet.average = this.formValidate.outerPacketNumber;
            this.roundelSeriesMath = Math.random();
            this.roundelSeriesShow = true;
        },
        roundelSeriesCancel () {
            this.roundelSeriesShow = false;
        }
    },
    created () {
        this.getRoundelList();
    },
    updated () {
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 200;
    },
    mounted () {
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
    }
});

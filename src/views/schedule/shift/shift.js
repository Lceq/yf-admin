import api from '../../../ajax/api';
import deleteWarning from '../../public/deleteWarning';
// import modalButton from '../../public/modalButton';
import xwOperationLog from '../../components/xw-operation-log/xw-operation-log-modal';
import {auditStateList} from '../../../libs/utilState';
import modal from '../../public/modal';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        xwOperationLog,
        deleteWarning,
        modal
        // modalButton
    },
    data () {
        return {
            tableHeight: '',
            tableLoading: false,
            deleteLoading: false,
            loading: false,
            treeIndex: '',
            typeName: '',
            addEditShow: false,
            addEditData: '',
            warnShow: false,
            apartIndex: 0,
            warnMessage: '',
            beginHour: '00:00',
            editData: '',
            endHour: '00:00',
            deleteRow: '',
            isAdd: false,
            isEdit: false,
            isCouldSave: true,
            isSureDelete: false,
            newAddLowerErrorMsg: '',
            newFormValidate: {
                typeName: '',
                name: '',
                remark: '',
                beginHour: '00:00',
                endHour: '00:00'
            },
            newFormValidateRules: {
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                typeName: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '班制',
                    sortable: true,
                    fixed: 'left',
                    align: 'left',
                    key: 'typeName',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    if (params.row.auditState === 3) {
                                        this.isCouldSave = false;
                                    } else {
                                        this.isCouldSave = true;
                                    }
                                    this.newAddLowerErrorMsg = '';
                                    // console.log(params.index);
                                    this.addEditShow = true;
                                    this.isEdit = true;
                                    this.getShiftDetail(params.row.id);
                                }
                            }
                        }, params.row.typeName);
                    }
                },
                {
                    title: '名称',
                    sortable: true,
                    align: 'left',
                    key: 'name'
                },
                {
                    title: '开始时间',
                    align: 'left',
                    sortable: true,
                    key: 'beginHour'
                },
                {
                    title: '结束时间',
                    align: 'left',
                    sortable: true,
                    key: 'endHour'
                },
                {
                    title: '数据状态',
                    sortable: true,
                    align: 'center',
                    key: 'auditStateMean'
                },
                {
                    title: '工时',
                    sortable: true,
                    align: 'right',
                    key: 'workingHours'
                },
                {
                    title: '备注',
                    align: 'left',
                    key: 'remark'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 180,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    // type: 'error',
                                    disabled: params.row.auditState === 3,
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.warnShow = true;
                                        this.warnMessage = '确定要删除吗';
                                        this.deleteRow = params.row;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    typeName: '两班制',
                    name: '早1',
                    remark: '12',
                    beginHour: '8:00',
                    endHour: '20:00'
                }
            ],
            shiftData: [
                {
                    typeId: 1,
                    typeName: '两班制'
                }
            ],
            auditDisabled: true,
            curShiftValue: [],
            curShiftIds: [],
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            auditName: '',
            auditTime: ''
        };
    },
    methods: {
        getShiftDetail (id) {
            const _this = this;
            this.$api.shift.getShiftDetail({'id': id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.addEditData = content.res.auditState === 3 ? '班制详情' : '编辑班制';
                    _this.newFormValidate.id = content.res.id;
                    _this.newFormValidate.name = content.res.name;
                    // this.newFormValidate.typeId = params.row.typeId;
                    _this.newFormValidate.typeName = content.res.typeId;
                    _this.newFormValidate.remark = content.res.remark;
                    _this.newFormValidate.beginHour = content.res.beginHour === 0 ? '00:00' : _this.getTimeStyle(content.res.beginHour);
                    _this.newFormValidate.endHour = content.res.endHour === 0 ? '00:00' : _this.getTimeStyle(content.res.endHour);
                    _this.beginHour = content.res.beginHour === 0 ? '00:00' : _this.getTimeStyle(content.res.beginHour);
                    _this.endHour = content.res.endHour === 0 ? '00:00' : _this.getTimeStyle(content.res.endHour);
                    _this.newFormValidate.workingHours = content.res.workingHours !== null ? _this.getTimeStyle(content.res.workingHours) : null;
                    _this.createName = content.res.createName;
                    _this.createTime = content.res.createTime;
                    _this.updateName = content.res.updateName;
                    _this.updateTime = content.res.updateTime;
                    _this.auditName = content.res.auditName;
                    _this.auditTime = content.res.auditTime;
                }
            });
        },
        // 时间格式的转换
        getTimeStyle (time) {
            // debugger
            let timeStyle = '';
            if (time && time < 10 && time >= 0) {
                timeStyle = '000' + time;
            } else if (time && time < 100 && time >= 10) {
                timeStyle = '00' + time;
            } else if (time && time < 1000 && time >= 100) {
                timeStyle = '0' + time;
            } else if (time) {
                timeStyle = time + '';
            } else {
                timeStyle = '';
            }
            const obj = timeStyle.substring(0, 2) + ':' + timeStyle.substring(2, 4);
            return obj;
        },
        // 获取时间班次表
        getShiftTime () {
            const _this = this;
            this.tableLoading = true;
            this.$api.shift.getShiftList().then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableData = (content.res || []).map(item => {
                        item.workingHours = item.workingHours ? _this.getTimeStyle(item.workingHours) : null;
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        item.beginHour = item.beginHour === 0 ? '00:00' : this.getTimeStyle(item.beginHour);
                        item.endHour = item.endHour === 0 ? '00:00' : this.getTimeStyle(item.endHour);
                        return item;
                    });
                    this.curShiftValue = [];
                    this.curShiftIds = [];
                    this.auditDisabled = true;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    this.tableLoading = false;
                }
            });
        },
        addNewRole () {
            // console.log('添加按钮');
            this.isCouldSave = true;
            this.addEditShow = true;
            this.newAddLowerErrorMsg = '';
            this.isAdd = true;
            this.addEditData = '增加班制';
            this.newFormValidate.name = '';
            // this.newFormValidate.typeId = params.row.typeId;
            this.newFormValidate.typeName = '';
            this.newFormValidate.remark = '';
            this.newFormValidate.id = '';
            this.newFormValidate.beginHour = '00:00';
            this.beginHour = '00:00';
            this.endHour = '00:00';
            this.newFormValidate.endHour = '00:00';
            this.newFormValidate.workingHours = null;
            this.createName = '';
            this.createTime = '';
            this.updateName = '';
            this.updateTime = '';
            this.auditName = '';
            this.auditTime = '';
        },
        auditShift () {
            this.$api.shift.getShiftApprove(this.curShiftIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getShiftTime();
                }
            });
        },
        unAuditShift () {
            this.$api.shift.getShiftUnApprove(this.curShiftIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getShiftTime();
                }
            });
        },
        selectShift (val) {
            if (val.length > 0) {
                this.curShiftValue = val;
                this.curShiftIds = val.map(x => x.id);
                this.auditDisabled = false;
            } else {
                this.curShiftValue = [];
                this.curShiftIds = [];
                this.auditDisabled = true;
            }
        },
        onCancelWarn () {
            this.warnShow = false;
            this.deleteLoading = false;
        },
        onConfirmWarn () {
            this.deleteLoading = true;
            this.$api.shift.getShiftDelete({id: this.deleteRow.id}).then((res) => {
                let content = res.data;
                this.deleteLoading = false;
                if (content.status === 200) {
                    this.getShiftTime();
                    this.warnShow = false;
                    this.$Message.success('删除成功');
                }
            });
        },
        newAddLowerCancel () {
            // console.log('取消添加按钮');
            this.loading = false;
            this.addEditShow = false;
        },
        getBeginTime (value) {
            this.beginHour = value;
            if (value && this.endHour) {
                this.newFormValidate.workingHours = this.getWorkingHour(this.endHour, value);
            } else {
                this.newFormValidate.workingHours = null;
            }
        },
        getWorkingHour (endHour, beginHour) {
            let data = null;
            // debugger;
            if (endHour.split(':')[0] >= beginHour.split(':')[0]) {
                if (endHour.split(':')[1] >= beginHour.split(':')[1]) {
                    // debugger;
                    data = (Number(endHour.split(':')[0]) - Number(beginHour.split(':')[0])) + ':' + (Number(endHour.split(':')[1]) - Number(beginHour.split(':')[1]));
                    // console.log(data);
                } else {
                    data = (Number(endHour.split(':')[0]) - Number(beginHour.split(':')[0]) - 1) + ':' + (Number(endHour.split(':')[1]) + 60 - Number(beginHour.split(':')[1]));
                }
            }
            if (endHour.split(':')[0] < beginHour.split(':')[0]) {
                if (endHour.split(':')[1] >= beginHour.split(':')[1]) {
                    // debugger
                    data = (Number(endHour.split(':')[0]) + 24 - Number(beginHour.split(':')[0])) + ':' + (Number(endHour.split(':')[1]) - Number(beginHour.split(':')[1]));
                } else {
                    data = (Number(endHour.split(':')[0]) + 24 - Number(beginHour.split(':')[0]) - 1) + ':' + (Number(endHour.split(':')[1]) + 60 - Number(beginHour.split(':')[1]));
                }
            }
            let hour = data.split(':')[0] < 10 ? '0' + data.split(':')[0] : data.split(':')[0];
            let min = data.split(':')[1] < 10 ? '0' + data.split(':')[1] : data.split(':')[1];
            return hour + ':' + min;
            // let data = endHour.split(':')[1] - beginHour.split(':')[1];
            // console.log(data);
        },
        getEndTime (value) {
            this.endHour = value;
            if (value === '00:00') {
                value = '24:00';
            }
            if (value && this.beginHour) {
                this.newFormValidate.workingHours = this.getWorkingHour(value, this.beginHour);
            } else {
                this.newFormValidate.workingHours = null;
            }
        },
        getTwentyFour (val) {
            if (val === '' || val.split(':').join('') === '0000') {
                return 2400;
            } else {
                return val.split(':').join('');
            }
        },
        submitAddSubordinate (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    const _this = this;
                    const params = {
                        id: this.newFormValidate.id,
                        name: this.newFormValidate.name,
                        typeId: this.newFormValidate.typeName,
                        typeName: this.shiftData.find(x => x.typeId === this.newFormValidate.typeName).typeName,
                        remark: this.newFormValidate.remark,
                        workingHours: this.newFormValidate.workingHours !== null ? Number(this.newFormValidate.workingHours.split(':').join('')) : null,
                        beginHour: this.getTwentyFour(this.beginHour),
                        endHour: this.getTwentyFour(this.endHour)
                    };

                    // debugger
                    this.loading = true;
                    this.$post(api.ShiftManager(), params).then((res) => {
                        let content = res.data;
                        _this.loading = false;
                        if (content.status === 200) {
                            _this.isEdit = false;
                            _this.$Message.success('保存成功');
                            _this.getShiftTime();
                        }
                    });
                    this.addEditShow = false;
                    // this.$Message.success('Success!');
                } else {
                    xwValidate.message();
                }
            });
        },
        // 获取班制
        getShifts () {
            this.$fetch('dict/list', {parentcode: 'shift_type'}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.shiftData = (content.res || []).map(item => {
                        return {
                            typeId: item.id,
                            typeName: item.name
                        };
                    });
                }
            });
        }
    },
    created () {
        this.getShifts();
        this.getShiftTime();
        // window.onresize = () => {
        //     this.tableHeight = publicJs.compClientHeight(236);
        // };
    },
    mounted () {
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 160;
        });
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 160;
        };
    }
};

import {auditStateList, paramsStateList, dataTypeStateList, paramsTypeList} from '../../../libs/utilState';
// import {mapState} from 'vuex';
import publicJs from '../../../libs/common';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import otherMessage from '../../components/otherMessage';
import xwValidate from '@/libs/xwValidate';
import {page} from '../../../libs/tools';
var savedSelection, saveSelection, restoreSelection;
export default ({
    components: {
        modal,
        deleteWarning,
        otherMessage
    },
    data () {
        return {
            processParamsPageOpts: page().pageOpts,
            processParamsPageSize: page().pageSize,
            auditDisabled: true,
            curProcessParamsProcessId: '',
            curProcessParamsParamsTypeId: '',
            curProcessParamsAuditStateId: '',
            // curProcessParamsAuditStateId: '',
            processList: [],
            auditStateList: auditStateList,
            processParamsCode: '',
            isEdit: false,
            processParamsList: [],
            isHaveAudit: false,
            processParamsColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                    minWidth: 68
                },
                {
                    title: '编号',
                    key: 'code',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 80,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.isHaveAudit = params.row.auditState !== 3;
                                    this.curProcessParamsId = params.row.id;
                                    this.isShowUserMessage = true;
                                    this.getProcessParamsDetail();
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 100
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 130,
                    sortable: true
                },
                {
                    title: '是否翻改项目',
                    key: 'isBusiMean',
                    align: 'center',
                    minWidth: 130,
                    sortable: true
                },
                {
                    title: '项目类型',
                    key: 'paramTypeMean',
                    align: 'left',
                    sortable: true,
                    minWidth: 130
                },
                {
                    title: '数据类型',
                    key: 'dataTypeMean',
                    align: 'left',
                    sortable: true,
                    minWidth: 130
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    sortable: true,
                    minWidth: 130
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    align: 'center',
                    sortable: true,
                    minWidth: 80
                }
            ],
            processParamsLoading: false,
            processParamsTotal: 0,
            processParamsPageIndex: 1,
            tableHeight: '',
            //
            processParamsModalShow: false,
            processParamsModalLoading: false,
            processParamsModalMessage: '',
            selectVal: false,
            formProcessParams: {
                ParamsCode: '',
                ParamsName: '',
                formula: '',
                isFormula: '0',
                selectMode: '1',
                selectVal: '',
                processId: '',
                paramType: null,
                businessParams: '1',
                dataType: '1',
                isEmpty: '1'
            },
            ruleProcessParamsValidate: {
                ParamsCode: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                ParamsName: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                processId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            businessParams: '',
            dataType: '',
            isEmpty: '',
            sortNum: null,
            selectMode: false,
            // 选中table
            curProcessParamsIds: [],
            curProcessParamsValue: [],
            // 删除警告
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            // 是否显示任务信息
            isShowUserMessage: false,
            createName: '',
            createTime: '',
            updateName: '',
            updateTime: '',
            auditName: '',
            auditTime: '',
            // 参数类型
            paramsTypeList: paramsTypeList,
            curProcessParams: [],
            visible: false,
            contextLeft: 0,
            contextWidth: 0,
            contextTop: 0,
            isShowFormula: false,
            calculation: [
                {
                    id: 1,
                    code: '+'
                },
                {
                    id: 2,
                    code: '-'
                },
                {
                    id: 3,
                    code: '*'
                },
                {
                    id: 4,
                    code: '/'
                }
            ],
            hoverIndex: 0,
            formulaShow: false,
            modalShow: false,
            modalLoading: false,
            // modalShow: false,
            // modalShow: false,
            modalData: [
                {
                }
            ],
            modalColumns: [
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
                    title: '操作',
                    align: 'center',
                    sortable: true,
                    minWidth: 100,
                    render: (h, params) => {
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
                                        // debugger
                                        this.modalData.splice(params.index + 1, 0, {
                                            value: ''
                                        });
                                        // console.log(this.modalData);
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
                                        if (this.modalData.length <= 1) {
                                            this.modalData[0].value = null;
                                        } else {
                                            this.modalData.splice(params.index, 1);
                                        }
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '属性值',
                    key: 'value',
                    align: 'center',
                    sortable: true,
                    minWidth: 80,
                    render: (h, params) => {
                        if (this.formProcessParams.dataType === '1') {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.value
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.value = val;
                                        this.modalData[params.index] = params.row;
                                    }
                                }
                            });
                        } else {
                            return h('Input', {
                                props: {
                                    value: params.row.value
                                },
                                style: {
                                    width: '100%'
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.value = val.target.value;
                                        this.modalData[params.index] = params.row;
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        };
    },
    methods: {
        // 改变公式
        doSave (item) {
            savedSelection = saveSelection(document.getElementById('editor'));
            setTimeout(() => {
                if (savedSelection) {
                    if (item) {
                        let arr = this.formProcessParams.formula.replace('&nbsp;', ' ');
                        this.formProcessParams.formula = arr;
                        let list = this.formProcessParams.formula;
                        let obj = '[' + item.name + ']';
                        this.formProcessParams.formula = list.slice(0, savedSelection.start) + obj + list.slice(savedSelection.start);
                        let length = obj.length;
                        savedSelection.start += length;
                        savedSelection.end += length;
                        document.getElementById('editor').innerHTML = this.formProcessParams.formula;
                        restoreSelection(document.getElementById('editor'), savedSelection);
                    } else {
                        restoreSelection(document.getElementById('editor'), savedSelection);
                    }
                }
            }, 200);
        },
        changeIsFormula (val) {
            if (val === '1') {
                this.formulaShow = true;
                this.selectMode = false;
                // this.formProcessParams.selectVal = '';
                // this.modalData = [{value: ''}];
            } else {
                this.formulaShow = false;
                this.selectMode = false;
                this.formProcessParams.selectMode = '1';
                // this.formProcessParams.selectVal = '';
                // this.modalData = [{value: ''}];
            }
            this.formProcessParams.isFormula = val;
        },
        changeSelectMode (val) {
            if (val === '2') {
                this.selectMode = true;
            } else {
                this.selectMode = false;
            }
            this.formProcessParams.selectMode = val;
        },
        getFormulaText () {
            if (window.getSelection && document.createRange) {
                saveSelection = function (containerEl) {
                    var range = window.getSelection().getRangeAt(0);
                    var preSelectionRange = range.cloneRange();
                    preSelectionRange.selectNodeContents(containerEl);
                    preSelectionRange.setEnd(range.startContainer, range.startOffset);
                    var start = preSelectionRange.toString().length;
                    return {
                        start: start,
                        end: start + range.toString().length
                    };
                };
                restoreSelection = function (containerEl, savedSel) {
                    var charIndex = 0, range = document.createRange();
                    range.setStart(containerEl, 0);
                    range.collapse(true);
                    var nodeStack = [containerEl], node, foundStart = false, stop = false;
                    while (!stop && (node = nodeStack.pop())) {
                        if (node.nodeType === 3) {
                            var nextCharIndex = charIndex + node.length;
                            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                                range.setStart(node, savedSel.start - charIndex);
                                foundStart = true;
                            }
                            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                                range.setEnd(node, savedSel.end - charIndex);
                                stop = true;
                            }
                            charIndex = nextCharIndex;
                        } else {
                            var i = node.childNodes.length;
                            while (i--) {
                                nodeStack.push(node.childNodes[i]);
                            }
                        }
                    }
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                };
            } else if (document.selection && document.body.createTextRange) {
                saveSelection = function (containerEl) {
                    var selectedTextRange = document.selection.createRange();
                    var preSelectionTextRange = document.body.createTextRange();
                    preSelectionTextRange.moveToElementText(containerEl);
                    preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange);
                    var start = preSelectionTextRange.text.length;
                    return {
                        start: start,
                        end: start + selectedTextRange.text.length
                    };
                };
                restoreSelection = function (containerEl, savedSel) {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(containerEl);
                    textRange.collapse(true);
                    textRange.moveEnd('character', savedSel.end);
                    textRange.moveStart('character', savedSel.start);
                    textRange.select();
                };
            }
        },
        changeNameToIds (items) {
            let n = items.split('[').length - 1;
            let arr = items.split('[');
            let i = 1;
            let text = arr[0];
            while (i <= n) {
                let end = arr[i].indexOf(']');
                text += '[' + this.curProcessParams.find(x => x.name === arr[i].substring(0, end)).code + arr[i].substring(end);
                i++;
            }
            return text;
        },
        changeIdsToNames (items) {
            let n = items.split('[').length - 1;
            let arr = items.split('[');
            let i = 1;
            let text = arr[0];
            while (i <= n) {
                let end = arr[i].indexOf(']');
                text += '[' + this.curProcessParams.find(x => x.code === arr[i].substring(0, end)).name + arr[i].substring(end);
                i++;
            }
            this.formProcessParams.formula = text;
            document.getElementById('editor').innerHTML = text;
        },
        clickFormulaIcon () {
            this.visible = false;
        },
        changeFormulaValue (event) {
            // debugger
            let arr;
            if (!this.formProcessParams.formula) {
                arr = event.currentTarget.innerHTML.trim();
            } else {
                arr = event.currentTarget.innerHTML.replace('&nbsp;', ' ');
            }
            this.formProcessParams.formula = arr;
            this.doSave();
        },
        changeValue (event) {
            if (!this.formProcessParams.processId) {
                // this.$Message.warning('请先选择工序');
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择工序！</p>'
                });
                return false;
            }
            let H = document.getElementById('editor').clientHeight;
            this.contextLeft = event.currentTarget.clientLeft + 116;
            this.contextTop = H + 276;
            this.contextWidth = event.currentTarget.clientWidth;
            this.visible = true;
        },
        changeProcess () {
            this.getProcessParams();
        },
        getProcessParams (items) {
            // debugger
            if (!this.formProcessParams.processId) {
                return false;
            }
            let params = {
                auditState: 3,
                dataType: 1,
                processId: this.formProcessParams.processId
            };
            this.$call('spec.param.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.curProcessParams = content.res;
                    // debugger
                    if (items) {
                        this.changeIdsToNames(items);
                    }
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
        // 获取列表
        getSpecParamsList () {
            let params = {
                paramType: this.curProcessParamsParamsTypeId,
                auditState: this.curProcessParamsAuditStateId,
                processId: this.curProcessParamsProcessId,
                name: this.processParamsCode.trim(),
                pageIndex: this.processParamsPageIndex,
                pageSize: this.processParamsPageSize
            };
            this.processParamsLoading = true;
            this.$call('spec.param.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processParamsTotal = content.count;
                    this.processParamsLoading = false;
                    // debugger;
                    this.processParamsList = content.res.map(item => {
                        // debugger
                        item.paramTypeMean = item.paramType ? paramsTypeList.find(x => x.id === item.paramType).name : null;
                        item.auditStateMean = item.auditState ? auditStateList.find(x => x.id === item.auditState).name : null;
                        item.isBusiMean = paramsStateList.find(x => x.type === item.isBusi).name;
                        item.dataTypeMean = dataTypeStateList.find(x => x.id === item.dataType).name;
                        // item.auditStateMean = x.auditState ? x.auditState : null;
                        return item;
                    });
                    this.auditDisabled = true;
                    this.curProcessParamsValue = [];
                    this.curProcessParamsIds = [];
                }
            });
        },
        // 新增
        addNewProcessParams () {
            //
            this.formProcessParams.ParamsCode = '';
            this.formProcessParams.ParamsName = '';
            this.formProcessParams.processId = null;
            this.formProcessParams.paramType = '2';
            this.formProcessParams.businessParams = '1';
            this.formProcessParams.dataType = '1';
            this.isShowFormula = true;
            this.formProcessParams.isEmpty = '1';
            this.formProcessParams.isFormula = '0';
            this.formProcessParams.selectMode = '1';
            this.formProcessParams.selectVal = '';
            this.modalData = [{value: null}];
            this.formProcessParams.sortNum = 0;
            this.formProcessParams.formula = '';
            document.getElementById('editor').innerText = '';
            this.visible = false;
            this.formulaShow = false;
            // visible = false;
            //
            this.processParamsModalMessage = '新增工艺项目';
            this.processParamsModalShow = true;
            // 几个判断
            this.isEdit = false;
            this.curProcessParamsId = null;
            this.isShowUserMessage = false;
            this.isHaveAudit = true;
        },
        auditProcessParams () {
            this.$api.specParams.getSpecParamsApprove(this.curProcessParamsIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功');
                    this.getSpecParamsList();
                }
            });
        },
        unAuditProcessParams () {
            this.$api.specParams.getSpecParamsUnApprove(this.curProcessParamsIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销审核成功');
                    this.getSpecParamsList();
                }
            });
        },
        deleteProcessParams () {
            if (this.curProcessParamsIds.length !== this.curProcessParamsValue.length) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>包含已审核数据，不能进行删除!</p>'
                });
                return false;
            } else {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '确定要删除吗？';
            }
        },
        getDetail (items) {
            this.getProcessParams(items);
        },
        // getFormula () {
        // },
        getProcessParamsDetail () {
            const _this = this;
            this.$api.specParams.getSpecParamsDetail({id: this.curProcessParamsId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processParamsModalMessage = content.res.auditState === 3 ? '工艺项目详情' : '编辑工艺项目';
                    _this.formProcessParams.ParamsCode = content.res.code;
                    _this.formProcessParams.sortNum = content.res.sortNum;
                    _this.formProcessParams.ParamsName = content.res.name;
                    _this.formProcessParams.processId = content.res.processId + '';
                    _this.formProcessParams.paramType = content.res.paramType + '';
                    _this.formProcessParams.businessParams = content.res.isBusi ? '1' : '0';
                    _this.formProcessParams.dataType = content.res.dataType + '';
                    // _this.formProcessParams.formula = this.changeIdsToNames(content.res.formula);
                    _this.formulaShow = content.res.isFormula ? true : false;
                    // _this.visible = content.res.formula ? true : false;
                    _this.isShowFormula = content.res.dataType === 1 ? true : false;
                    _this.visible = false;
                    _this.formProcessParams.isEmpty = content.res.isNull ? '1' : '0';
                    _this.formProcessParams.isFormula = content.res.isFormula ? '1' : '0';
                    _this.formProcessParams.selectMode = content.res.inputType + '';
                    _this.selectMode = content.res.inputType === 2 ? true : false;
                    _this.formProcessParams.selectVal = content.res.paramValueList.map(x => x.value).toString().split(',').join('，');
                    _this.modalData = content.res.paramValueList.length === 0 ? [{value: ''}] : content.res.paramValueList;
                    _this.createName = content.res.createName;
                    _this.createTime = content.res.createTime;
                    _this.updateName = content.res.updateName;
                    _this.updateTime = content.res.updateTime;
                    _this.auditName = content.res.auditName;
                    _this.auditTime = content.res.auditTime;
                    _this.processParamsModalShow = true;
                    // debugger
                    _this.getDetail(content.res.formula);
                }
            });
        },
        changeDataType (val) {
            if (val === '1') {
                this.formProcessParams.isFormula = '0';
                this.formProcessParams.formula = '';
                document.getElementById('editor').innerHTML = '';
                this.isShowFormula = true;
                this.formulaShow = false;
                this.visible = false;
            } else {
                this.formProcessParams.isFormula = '0';
                this.formProcessParams.formula = '';
                document.getElementById('editor').innerHTML = '';
                this.isShowFormula = false;
                this.formulaShow = false;
                this.visible = false;
            }
        },
        searchProcessParams () {
            this.processParamsPageIndex = 1;
            setTimeout(() => {
                this.processParamsTotal = 0;
            }, 0);
            this.getSpecParamsList();
        },
        selectProcessParams (val) {
            if (val.length > 0) this.auditDisabled = false;
            else this.auditDisabled = true;
            this.curProcessParamsIds = val.map(x => x.id);
            this.curProcessParamsValue = val.filter(x => x.auditState === 1);
        },
        changePageIndexProcessParams (val) {
            this.processParamsPageIndex = val;
            this.getSpecParamsList();
        },
        changePageSizeProcessParams (val) {
            this.processParamsPageSize = val;
            this.getSpecParamsList();
        },
        processParamsModalCancel () {
            this.processParamsModalShow = false;
        },
        processParamsModalSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curProcessParamsId,
                        code: this.formProcessParams.ParamsCode.toUpperCase(),
                        name: this.formProcessParams.ParamsName,
                        processId: this.formProcessParams.processId,
                        paramType: this.formProcessParams.paramType,
                        processName: this.processList.find(x => x.id === Number(this.formProcessParams.processId)).name,
                        isBusi: !!Number(this.formProcessParams.businessParams),
                        dataType: this.formProcessParams.dataType,
                        formula: this.formulaShow ? this.changeNameToIds(this.formProcessParams.formula) : '',
                        sortNum: this.formProcessParams.sortNum,
                        isNull: !!Number(this.formProcessParams.isEmpty),
                        inputType: this.selectMode ? this.formProcessParams.selectMode : '1',
                        paramValueList: this.selectMode ? this.modalData.map(x => {
                            return {
                                value: x.value
                            };
                        }) : [],
                        isFormula: !!Number(this.formProcessParams.isFormula)
                    };
                    this.$api.specParams.getSpecParamsSave(params).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.$Message.success('保存成功');
                            this.getSpecParamsList();
                            this.processParamsModalShow = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            let ids = this.curProcessParamsValue.map(x => x.id);
            if (ids.length === 0) {
                this.deleteWarnShow = false;
                return false;
            };
            this.$api.specParams.getSpecParamsDelete(ids).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getSpecParamsList();
                    this.$Message.success('删除成功');
                }
            });
            this.deleteWarnShow = false;
        },
        modalCancel () {
            this.modalShow = false;
        },
        modalSubmit () {
            this.formProcessParams.selectVal = this.modalData.map(x => x.value).toString().split(',').join('，');
            this.modalShow = false;
        },
        setModalVal () {
            this.modalShow = true;
        }
    },
    created () {
        // 获取工序参数列表
        this.getSpecParamsList();
        this.getProcessList();
    },
    watch: {
        // visible (newData, oldData) {
        //     debugger
        //     this.visible = newData;
        // }
    },
    mounted () {
        this.getFormulaText();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
    }
});

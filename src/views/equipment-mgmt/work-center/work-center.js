import { auditStateList, enableStateList } from '../../../libs/utilState';
import {page} from '../../../libs/tools';
// import { mapState } from 'vuex';
import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import addMachines from '../../components/xw-select-machine/add-machines';
import xwSelectProductWorkCenter from '../../components/xw-select-product/xw-select-products-work-center';
// import publicJs from '../../public/common/publiceJs';
import deleteWarning from '../../public/deleteWarning';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        modal,
        addMachines,
        xwSelectProductWorkCenter,
        deleteWarning,
        otherMessage
    },
    data () {
        return {
            defaultName: 'machine',
            workCenterModalTitle: '',
            workCenterResourceList: [
                {
                    label: '机台资源',
                    name: 'machine',
                    button: '添加机台资源',
                    data: [],
                    columns: [
                        {
                            title: '序号',
                            key: 'index',
                            align: 'center',
                            width: 100,
                            render: (h, params) => {
                                return h('Span', {
                                }, params.index + 1);
                            }
                        },
                        {
                            title: '操作',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                const _this = this;
                                return h('Div', [
                                    h('Button', {
                                        props: {
                                            size: 'small',
                                            icon: 'md-remove'
                                        },
                                        style: {
                                        },
                                        on: {
                                            'click': (e) => {
                                                if (!_this.isCouldSave) {
                                                    return false;
                                                }
                                                // _this.workCenterModalData.splice(params.index, 1);
                                                _this.workCenterResourceList[0].data.splice(params.index, 1);
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: '机台编号',
                            key: 'machineCode',
                            align: 'left',
                            minWidth: 100
                        },
                        {
                            title: '机台名称',
                            key: 'machineName',
                            align: 'left',
                            minWidth: 100
                        },
                        {
                            title: '设备机型',
                            key: 'machineModelName',
                            align: 'left',
                            minWidth: 100
                        }
                    ]
                },
                {
                    label: '适纺品种',
                    name: 'product',
                    button: '添加品种资源',
                    data: [],
                    columns: [
                        {
                            title: '序号',
                            key: 'index',
                            align: 'center',
                            width: 100,
                            render: (h, params) => {
                                return h('Span', {
                                }, params.index + 1);
                            }
                        },
                        {
                            title: '操作',
                            align: 'center',
                            minWidth: 100,
                            render: (h, params) => {
                                const _this = this;
                                return h('Div', [
                                    h('Button', {
                                        props: {
                                            size: 'small',
                                            icon: 'md-remove'
                                        },
                                        style: {
                                        },
                                        on: {
                                            'click': (e) => {
                                                if (!_this.isCouldSave) {
                                                    return false;
                                                }
                                                _this.workCenterResourceList[1].data.splice(params.index, 1);
                                            }
                                        }
                                    })
                                ]);
                            }
                        },
                        {
                            title: '产品编码',
                            key: 'code',
                            align: 'left',
                            minWidth: 100
                        },
                        {
                            title: '产品名称',
                            key: 'name',
                            align: 'left',
                            minWidth: 120
                        },
                        {
                            title: '规格型号',
                            key: 'models',
                            align: 'left',
                            minWidth: 100
                        }
                        // {
                        //     title: '计量单位',
                        //     key: 'unitCode',
                        //     align: 'center',
                        //     minWidth: 80
                        // },
                        // {
                        //     title: '图片',
                        //     key: 'picUrl',
                        //     align: 'center',
                        //     minWidth: 100,
                        //     render: (h, params) => {
                        //         return h('Div', {
                        //             style: {
                        //                 padding: '5px 0 0 0'
                        //             }
                        //         }, [
                        //             h('img', {
                        //                 attrs: {
                        //                     src: params.row.picUrl ? params.row.picUrl : 'https://service.shengtex.com/images/default.png'
                        //                 },
                        //                 style: {
                        //                     width: '30px',
                        //                     height: '30px'
                        //                 }
                        //             })
                        //         ]);
                        //     }
                        // }
                    ]
                }
            ],
            workCenterPageOpts: page().pageOpts,
            workCenterPageSize: page().pageSize,
            // pageSize: page(),
            // 按钮
            repairOrderName: '接单213123',
            auditDisabled: false,
            unAuditDisabled: false,
            disableDisabled: false,
            enableDisabled: false,
            // 条件搜索
            workCenterWorkshopId: '',
            workCenterProcessId: '',
            workCenterTypeId: '',
            workshopList: [],
            processList: [],
            code: '',
            auditStateList: auditStateList,
            enableStateList: enableStateList,
            curAuditStateId: '',
            curEnableStateId: '',
            // 表格
            isEdit: false,
            tableHeight: '',
            curWorkCenterId: '',
            isCouldSave: true,
            workCenterColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编码',
                    key: 'code',
                    align: 'left',
                    width: 120,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isEdit = true;
                                    this.isCouldSave = params.row.auditState !== 3;
                                    this.curWorkCenterId = params.row.id;
                                    this.getWorkCenterDetail();
                                }
                            }
                        }, params.row.code);
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    width: 100
                },
                {
                    title: '所属车间',
                    key: 'workshopName',
                    align: 'left',
                    width: 100
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '机台资源',
                    key: 'machineCodes',
                    align: 'left',
                    minWidth: 200
                },
                {
                    title: '适纺品种',
                    key: 'productNames',
                    align: 'left',
                    minWidth: 150
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    align: 'center',
                    width: 100
                },
                {
                    title: '禁用状态',
                    key: 'enableStateMean',
                    align: 'center',
                    width: 100
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center',
                    width: 100
                },
                {
                    title: '创建时间',
                    key: 'createTime',
                    align: 'left',
                    width: 150
                }
            ],
            workCenterList: [],
            workCenterLoading: false,
            // 审核、反审核、禁用、取消禁用的对象
            curWorkCenterIds: [],
            curWorkCenterData: [], // 用于删除
            // 分页
            workCenterTotal: 0,
            workCenterPageIndex: 1,
            // ----modal
            // form
            workCenterModal: {
                code: '',
                name: ''
            },
            // workCenterModelValidate: {},
            workCenterModelValidate: {
                code: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            // form
            workCenterModalShow: false,
            workCenterModalLoading: false,
            // workCenterModalHeight: 300,
            workCenterModalData: [
                {
                    machineName: '132'
                }
            ],
            workCenterModalColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h('Span', {
                        }, params.index + 1);
                    }
                },
                {
                    title: '操作',
                    key: 'name',
                    align: 'center',
                    minWidth: 100,
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    icon: 'md-remove'
                                },
                                style: {
                                },
                                on: {
                                    'click': (e) => {
                                        _this.workCenterModalData.splice(params.index, 1);
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '机台编号',
                    key: 'machineCode',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '机台名称',
                    key: 'machineName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '设备机型',
                    key: 'machineModelName',
                    align: 'center',
                    minWidth: 100
                }
            ],
            // ----modal
            // 人物信息
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            auditName: '',
            auditTime: '',
            // 添加机台
            addMachinesShow: false,
            xwSelectProductShow: false,
            selectedMachineList: [],
            // 删除警告
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            selectProductList: []
        };
    },
    methods: {
        getWorkCenterList () {
            let params = {
                pageSize: this.workCenterPageSize,
                pageIndex: this.workCenterPageIndex,
                workshopId: this.workCenterWorkshopId,
                processId: this.workCenterProcessId,
                auditState: this.curAuditStateId,
                enableState: this.curEnableStateId,
                code: this.code.trim()
            };
            this.workCenterLoading = true;
            this.$api.workCenter.getWorkCenterList(params).then(res => {
                let content = res.data;
                this.workCenterLoading = false;
                if (content.status === 200) {
                    // console.log(content.res);
                    this.workCenterTotal = content.count;
                    this.workCenterList = content.res.map(item => {
                        item.machineCodes = item.workCenterMachineList ? item.workCenterMachineList.map(x => x.machineCode).toString() : null;
                        item.productNames = item.workCenterProductList ? item.workCenterProductList.map(x => x.productName).toString() : null;
                        item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                        item.enableStateMean = enableStateList.find(x => x.id === item.enableState).name;
                        return item;
                    });
                    // 审核、禁用、删除后的添加清除
                    this.curWorkCenterIds = [];
                    this.curWorkCenterData = [];
                    this.auditDisabled = true;
                }
            });
        },
        // 新增
        addWorkCenter () {
            this.workCenterModalTitle = '新增工作中心';
            this.$refs['workCenterModal'].resetFields();
            // 清空对象
            this.defaultName = 'machine';
            this.curWorkCenterId = null;
            this.workCenterModal.code = '';
            this.workCenterModal.name = '';
            this.workCenterModal.workshopId = this.workCenterWorkshopId;
            this.workCenterModal.processId = this.workCenterProcessId;
            //
            this.createTime = '';
            this.createName = '';
            this.updateName = '';
            this.updateTime = '';
            this.auditName = '';
            this.auditTime = '';
            // this.workCenterModalData = [];
            this.workCenterResourceList.map(x => {
                x.data = [];
                return x;
            });
            this.workCenterModalShow = true;
        },
        selectWorkCenter (val) {
            this.curWorkCenterData = val.filter(x => x.auditState === 1);
            this.curWorkCenterIds = val.map(x => x.id);
            if (this.curWorkCenterIds.length > 0) {
                this.auditDisabled = false;
            } else {
                this.auditDisabled = true;
            }
        },
        // 审核
        auditWorkCenter () {
            if (this.curWorkCenterIds.length === 0) {
                return false;
            }
            this.$api.workCenter.approveWorkCenter(this.curWorkCenterIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getWorkCenterList();
                    this.$Message.success('审核成功');
                }
            });
        },
        // 反审核
        unAuditWorkCenter () {
            if (this.curWorkCenterIds.length === 0) {
                return false;
            }
            this.$api.workCenter.unApproveWorkCenter(this.curWorkCenterIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getWorkCenterList();
                    this.$Message.success('撤销审核成功');
                }
            });
        },
        // 禁用
        disableWorkCenter () {
            if (this.curWorkCenterIds.length === 0) {
                return false;
            }
            this.$api.workCenter.disableWorkCenter(this.curWorkCenterIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getWorkCenterList();
                    this.$Message.success('禁用成功');
                }
            });
        },
        // 反禁用
        enableWorkCenter () {
            if (this.curWorkCenterIds.length === 0) {
                return false;
            }
            this.$api.workCenter.enableWorkCenter(this.curWorkCenterIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.getWorkCenterList();
                    this.$Message.success('启用成功');
                }
            });
        },
        // 删除
        deleteWorkCenter () {
            if (this.curWorkCenterIds.length === 0) {
                return false;
            }
            this.deleteWarnMsg = '确定要删除吗？';
            if (this.curWorkCenterData.length !== this.curWorkCenterIds.length) {
                this.deleteWarnMsg = '包含已审核数据，不能删除！';
            }
            this.deleteWarnShow = true;
        },
        // 搜索
        searchWorkCenter () {
            this.workCenterPageIndex = 1;
            setTimeout(() => {
                this.workCenterTotal = 0;
            });
            this.getWorkCenterList();
        },
        // 改变页数
        changePageIndexWorkCenter (val) {
            this.workCenterPageIndex = val;
            this.getWorkCenterList();
        },
        // 改变每页的数据量
        changePageSizeWorkCenter (val) {
            this.workCenterPageSize = val;
            this.getWorkCenterList();
        },
        // modal ----------开始
        getWorkCenterDetail () {
            const _this = this;
            this.$api.workCenter.getWorkCenterDetail({id: this.curWorkCenterId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workCenterModal.code = content.res.code;
                    this.workCenterModal.name = content.res.name;
                    this.workCenterModal.workshopId = content.res.workshopId;
                    this.workCenterModal.workshopName = _this.workshopList.find(x => x.deptId === content.res.workshopId).deptName;
                    this.workCenterModal.processId = content.res.processId;
                    this.workCenterModal.processName = _this.processList.find(x => x.id === content.res.processId).name;
                    this.workCenterModalTitle = content.res.auditState === 3 ? '工作中心详情' : '编辑工作中心';
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.updateName = content.res.updateName;
                    this.updateTime = content.res.updateTime;
                    this.auditName = content.res.auditName;
                    this.auditTime = content.res.auditTime;
                    this.workCenterResourceList[0].data = content.res.workCenterMachineList.map(item => {
                        return {
                            machineCode: item.machineCode,
                            machineId: item.machineId,
                            machineModelId: item.machineModelId,
                            machineModelName: item.machineModelName,
                            machineName: item.machineName,
                            workCenterId: item.workCenterId
                        };
                    });
                    this.workCenterResourceList[1].data = content.res.workCenterProductList.map(item => {
                        return {
                            code: item.productCode,
                            productId: item.productId,
                            models: item.productModels,
                            name: item.productName,
                            workCenterId: item.workCenterId
                        };
                    });
                    this.workCenterModalShow = true;
                }
            });
        },
        workCenterModalSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    var isTip = false;
                    this.workCenterResourceList.map(x => {
                        if (x.data.length === 0) {
                            this.$Modal.warning({
                                title: '提示',
                                content: '<p>请添加机台资源或品种资源</p>'
                            });
                            isTip = true;
                        }
                    });
                    if (isTip) {
                        return false;
                    }
                    let params = {
                        id: this.curWorkCenterId,
                        code: this.workCenterModal.code.toUpperCase(),
                        name: this.workCenterModal.name,
                        workshopId: this.workCenterModal.workshopId,
                        processId: this.workCenterModal.processId,
                        workCenterMachineList: this.workCenterResourceList[0].data,
                        workCenterProductList: this.workCenterResourceList[1].data.map(item => {
                            return {
                                productId: this.curWorkCenterId ? item.productId : item.id,
                                productCode: item.code,
                                productName: item.name,
                                productModels: item.models
                            };
                        })
                    };
                    this.$api.workCenter.getWorkCenterSave(params).then(res => {
                        let content = res.data;
                        this.isEdit = false;
                        this.isCouldSave = true;
                        if (content.status === 200) {
                            this.getWorkCenterList();
                            this.workCenterModalShow = false;
                            this.$Message.success('保存成功');
                        }
                    });
                    // this.$Message.success('Success!');
                } else {
                    xwValidate.message();
                }
            });
        },
        workCenterModalCancel () {
            this.isEdit = false;
            this.isCouldSave = true;
            // 取消必填
            this.workCenterModalShow = false;
        },
        // modal ----------结束
        // 添加机台----------start--------
        addMachinesToCenter (type) {
            if (this.workCenterModal.processId === '' || this.workCenterModal.processId === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择工序</p>'
                });
                return false;
            }
            if (type === 'machine') {
                let params = {
                    workshopId: this.workCenterModal.workshopId,
                    processId: this.workCenterModal.processId,
                    workCenterId: this.curWorkCenterId
                };
                this.$api.workCenter.getWorkCenterMachineList(params).then((res) => {
                // this.$call('work/center/machine/listByType', params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.selectedMachineList = [];
                        let data = content.res.map(item => {
                            if (this.workCenterResourceList[0].data.map(x => x.machineId).includes(item.machineId)) {
                                item._checked = true;
                                item._disabled = false;
                            } else {
                                item._checked = true;
                                item._disabled = true;
                            }
                            return item;
                        });
                        for (let j of this.workCenterResourceList[0].data) {
                            if (!data.map(x => x.machineId).includes(j.machineId)) {
                                j._checked = true;
                                j._disabled = false;
                                data.push(j);
                            }
                        }
                        this.selectedMachineList = data;
                        this.addMachinesShow = true;
                    }
                });
            }
            if (type === 'product') {
                this.selectProductList = this.workCenterResourceList[1].data;
                this.xwSelectProductShow = true;
            }
        },
        changeProcess () {
            this.workCenterResourceList.map(x => {
                x.data = [];
                return x;
            });
        },
        addMachinesCancel () {
            this.addMachinesShow = false;
        },
        addMachinesSubmit (val) {
            this.workCenterResourceList[0].data = val.map(item => {
                return {
                    machineCode: item.code,
                    machineName: item.name,
                    machineId: item.id,
                    machineModelName: item.modelName,
                    machineModelId: item.modelId
                };
            });
            this.addMachinesShow = false;
        },
        selectProducts (val) {
            // console.log(val);
            this.workCenterResourceList[1].data = val.map(x => {
                x.productId = x.id;
                return x;
            });
            // this.selectProductList = this.workCenterResourceList[1].data;
            this.xwSelectProductShow = false;
            // console.log(val);
        },
        selectProductsCancel () {
            this.xwSelectProductShow = false;
        },
        // 添加机台----------end--------
        // 删除警告
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            let ids = this.curWorkCenterData.map(x => x.id);
            if (ids.length === 0) {
                this.deleteWarnShow = false;
                return false;
            }
            this.deleteWarnLoading = true;
            this.$api.workCenter.deleteWorkCenter(ids).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                this.deleteWarnShow = false;
                if (content.status === 200) {
                    this.getWorkCenterList();
                    this.$Message.success('删除成功');
                }
            });
        },
        // 可以封装的一些组件
        // 获取车间
        getWorkshopList () {
            this.$api.dept.getWorkshopList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopList = res.data.res;
                    this.workCenterWorkshopId = res.data.res.find(item => item.isDefault === 1).deptId;
                }
            });
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res;
            });
            // const _this = this;
            // publicJs.processLevel().then(res => {
            //     _this.processList = res;
            // });
        }
    },
    created () {
        // console.log(this.pageSize);
        // 车间
        this.getWorkshopList();
        this.getProcessList();
        // 工作中心列表
        this.getWorkCenterList();
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
};

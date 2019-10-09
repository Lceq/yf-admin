<template>
    <div>
        <Card>
            <Row :gutter='16'>
                <Col>
                    <Card>
                        <Row class="buttonBottom">
                            <Button  @click="addNewRole" type="success">新增</Button>
                        </Row>
                        <Row class="margin-top-10">
                            <Table :height="tableHeight" border size="small" ref="selection" :columns="columns4" :data="tableData"></Table>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Modal
                v-model="addEditShow"
                :title="addEditData"
                :mask-closable="false">
                <Form :label-width="130" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                    <Row>
                        <Col :span="20">
                            <FormItem label="角色编码：" class="formItemMargin" prop="code">
                                <Input v-model="newFormValidate.code" placeholder="请输入编码"></Input>
                            </FormItem>
                            <FormItem label="角色名称：" class="formItemMargin" prop="name">
                                <Input v-model="newFormValidate.name" placeholder="请输入名称"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="sortNum" label="排序：">
                                <InputNumber :min="1" v-model="newFormValidate.sortNum" size="large"></InputNumber>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="remark" label="备注：">
                                <Input v-model="newFormValidate.remark" type="textarea" :rows="4" placeholder="请输入..."></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <AboutTime
                            v-if="isEditShow"
                            :createTime="createTime"
                            :createName="createName"
                            :reviseTime="updateTime"
                            :reviseName="updateName"
                    >
                    </AboutTime>
                </Form>
                <modal-button
                        slot="footer"
                        :WarnMsg="newAddLowerErrorMsg"
                        :loading="addEditLoading"
                        @cancel="newAddLowerCancel"
                        @submit="submitAddSubordinate"
                >
                </modal-button>
            </Modal>
            <Modal
                    v-model="modalModule"
                    :title="currentRoleModuleTitle">
                <div class="moduleAssembly">
                    <Tree @on-check-change="selectionModuleData" :data="moduleList" show-checkbox></Tree>
                </div>
                <modal-button
                        slot="footer"
                        :loading="moduleLoading"
                        @cancel="cancelRoleModule"
                        @submit="confirmRoleModule"
                >
                </modal-button>
            </Modal>
            <Modal
                    v-model="powerModule"
                    title="权限设置"
                    :width="800">
                <div>
                    <Table height="300" size="small" :columns="columnsPower" :data="powerData"></Table>
                </div>
                <modal-button
                        slot="footer"
                        :loading="powerLoading"
                        @cancel="cancelRoleAssembly"
                        @submit="confirmRoleAssembly"
                >
                </modal-button>
            </Modal>
            <delete-warning
                    :v-model="warnShow"
                    :tipMsg="warnMessage"
                    :loading="deleteLoading"
                    @cancel="onCancelWarn"
                    @confirm="onConfirmWarn"
            ></delete-warning>
        </Card>
    </div>
</template>

<script>
import AboutTime from '../public/AboutTime';
import modalButton from '../public/modalButton';
import deleteWarning from '../public/deleteWarning';
import publicJs from '../../libs/common';
import api from '../../ajax/api';
export default {
    name: 'role-anagement',
    components: {
        AboutTime,
        modalButton,
        deleteWarning
    },
    data () {
        return {
            tableHeight: document.documentElement.clientHeight - 236,
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            powerLoading: false,
            moduleLoading: false,
            addEditLoading: false,
            assemblyName: '',
            deleteLoading: false,
            moduleData: [],
            currentRoleModule: '',
            currentUserId: '',
            currentRoleModuleTitle: '',
            rightItem: [],
            single: true,
            assembData: [],
            currentAssembly: {},
            currentModId: '',
            currentModCode: '',
            currentModAssembly: [],
            // currentModAssem: [],
            currentRoleId: '',
            assemblyModal: false,
            moduleList: [],
            powerModule: false,
            modalModule: false,
            warnShow: false,
            addEditShow: false,
            addEditData: '',
            warnMessage: '',
            value5: 2,
            isAddShow: false,
            isEditShow: false,
            // 获取树点击的数据
            treeIndex: [],
            // 显示提示的开关
            isWarnShow: false,
            loading: false,
            newAddLowerErrorMsg: '',
            // 获取编辑数据
            dataRow: [],
            deleteRow: [],
            assemblyColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '名称',
                    sortable: true,
                    key: 'name'
                },
                {
                    title: '编号',
                    sortable: true,
                    key: 'code'
                }
            ],
            columnsPower: [
                {
                    title: '模块名称',
                    key: 'name',
                    width: 150,
                    render: (h, params) => {
                        return h('div', [
                            h('Span', {
                                props: {
                                },
                                style: {
                                    fontSize: '14px'
                                }
                            }, params.row.moduleName)
                        ]);
                    }
                },
                {
                    title: '权限项',
                    key: 'power',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            // h('Div', [
                            (params.row.rightItems).map(item => {
                                return h('Checkbox', {
                                    props: {
                                        label: item.rightName,
                                        value: item.checked
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            // debugger
                                            _this.powerData[params.index].rightItems.find(x => x.rightCode === item.rightCode).checked = event;
                                            // debugger
                                        }
                                    }
                                }, item.rightName + '(' + item.rightCode + ')');
                            })
                            // ])
                        ]);
                    }
                }
            ],
            // powerData: [],
            assemblyData: [
                {
                    name: '增加',
                    code: 'add'
                },
                {
                    name: '移除',
                    code: 'remove'
                }
            ],
            // columnsPower: [
            //     {
            //         type: 'selection',
            //         width: 60,
            //         align: 'center'
            //     },
            //     {
            //         title: '模块名称',
            //         key: 'name',
            //         width: 150,
            //         render: (h, params) => {
            //             return h('div', [
            //                 h('Span', {
            //                     props: {
            //                     },
            //                     style: {
            //                         fontSize: '14px'
            //                     }
            //                 }, params.row.moduleName)
            //             ]);
            //         }
            //     },
            //     {
            //         title: '权限项',
            //         key: 'power',
            //         render: (h, params) => {
            //             const _this = this
            //             return h('div', [
            //                 h('Div', [
            //                     h('CheckboxGroup', {
            //                         props: {
            //                             value: [],
            //                             label: []
            //                         },
            //                         on: {
            //                             'on-change': (val) => {
            //                                 console.log(val);
            //                                 // _this.getModuleAssembly(val, params.row.moduleId);
            //                                 // console.log(params)
            //                                 // debugger
            //                             }
            //                         }
            //                     },
            //                     params.row.rightItems.map(item => {
            //                         return h('Checkbox', {
            //                             props: {label: item.rightCode, value: item.label}
            //                         }, item.rightName + '(' + item.rightCode + ')');
            //                     })
            //                     )
            //                 ])
            //             ]);
            //         }
            //     }
            // ],
            assPowerData: [
                {
                    label: '增加',
                    value: 1,
                    title: 'add'
                },
                {
                    label: '移除',
                    value: 2,
                    title: 'remove'
                }
            ],
            powerData: [],
            // powerData: [],
            newFormValidate: {
                code: '',
                name: '',
                sort: '',
                remark: ''
            },
            newFormValidateRules: {
                code: [
                    {required: true, message: 'The code cannot be empty', trigger: 'blur'}
                ],
                name: [
                    { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                ]
            },
            columns4: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '编码',
                    sortable: true,
                    width: 120,
                    key: 'code'
                },
                {
                    title: '名称',
                    sortable: true,
                    width: 200,
                    align: 'center',
                    key: 'name'
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    width: 100,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '备注',
                    key: 'remark'
                },
                {
                    title: '权限设置',
                    key: 'power',
                    width: 120,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Div', {
                                on: {
                                    'click': () => {
                                        _this.powerModule = true;
                                        _this.currentRoleId = params.row.id;
                                        _this.assemblyName = params.row.name;
                                        // _this.currentRoleId = params.row.id;
                                        // debugger
                                        _this.getModuleCode();
                                    }
                                }
                            }, [
                                h('Icon', {
                                    props: {
                                        type: 'wrench',
                                        size: 20,
                                        // hover: 'red',
                                        cursor: 'pointer'
                                    },
                                    style: {
                                        // color: 'red',
                                        cursor: 'pointer'
                                    }
                                })
                            ])
                        ]);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 280,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Button', {
                                props: {
                                    // type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        // this.dataRow = params.row;
                                        this.getRoleDetail(params.row.id);
                                        // debugger
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    // type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: (val) => {
                                        // debugger
                                        _this.modalModule = true;
                                        _this.currentRoleModuleTitle = params.row.name;
                                        _this.currentRoleId = params.row.id;
                                        for (let z of _this.moduleData) {
                                            _this.$set(z, 'checked', false);
                                        }
                                        _this.moduleTree(_this.moduleData);
                                        // debugger
                                        // _this.currentUserId = params.row.id;
                                        _this.getRoleModuleList();
                                        // this.remove(params.index);
                                    }
                                }
                            }, '模块'),
                            h('Button', {
                                props: {
                                    // type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        // debugger
                                        this.warnShow = true;
                                        this.warnMessage = '确定要删除吗';
                                        this.deleteRow = params.row;
                                        // this.remove(params.index);
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            tableData: [
                {
                    code: '123',
                    name: '系统管理员',
                    sortNum: 12,
                    remark: ''
                }
            ]
        };
    },
    computed: {
        time: () => {
            const date = new Date();
            const seperator1 = '-';
            const year = date.getFullYear();
            const month = parseInt(date.getMonth() + 1);
            const strDate = date.getDate();
            const currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
    },
    methods: {
        // 获取所有模块
        getAllModule () {
            this.$fetch('/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取所有模块');
                }
            });
        },
        getRoleDetail (id) {
            this.$fetch('role/detail/' + id).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.isEditShow = true;
                    this.addEditData = '编辑';
                    this.newFormValidate.id = content.res.id;
                    this.newFormValidate.name = content.res.name;
                    this.newFormValidate.code = content.res.code;
                    this.newFormValidate.remark = content.res.remark;
                    this.newFormValidate.sortNum = content.res.sortNum;
                    this.newAddLowerErrorMsg = '';
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.updateTime = content.res.updateTime;
                    this.updateName = content.res.updateName;
                    this.addEditShow = true;
                }
            });
        },
        // 这里需要对模块进行树状结构的解析、
        // getTreeModule (data) {
        //     const treeId = data.map(x => x.id)
        //     const parentId = data.map(y => y.parentId);
        //     for (let i of treeId) {
        //         this.continue = true;
        //         for (let k of parentId) {
        //             if (i === k && this.continue) {
        //                 this.$set(data.find(x => x.id === k), 'expand', true);
        //                 this.$set(data.find(x => x.id === k), 'childrec', data.find( => x.map))
        //             }
        //         }
        //     }
        // },
        handleSelectAll (status) {
            this.$refs.selection.selectAll(status);
        },
        addNewRole () {
            this.isAddShow = true; // 判断是不是新增框
            this.addEditData = '添加'; // 新增框title
            // 输入框的值调为空值
            this.newFormValidate.name = '';
            this.newFormValidate.code = '';
            this.newFormValidate.remark = '';
            this.newFormValidate.sortNum = 0;
            this.newAddLowerErrorMsg = '';
            this.addEditShow = true; // 显示新增框
        },
        onCancelWarn () {
            this.warnShow = false;
        },
        onConfirmWarn () {
            this.warnShow = false;
            const _this = this;
            this.deleteLoading = true;
            if (this.deleteRow.id) {
                this.$post(api.deleteRoleManager(_this.deleteRow.id)).then((res) => {
                    // debugger
                    if (res.data.status === 200) {
                        _this.getRoleList();
                        this.deleteLoading = false;
                        this.$Message.success('删除成功');
                        console.log('删除成功');
                    }
                });
            }
            this.warnShow = false;
        },
        newAddLowerCancel () {
            console.log('取消键');
            this.loading = false;
            this.addEditShow = false;
            this.isAddShow = false;
            this.isEditShow = false;
        },
        submitAddSubordinate () {
            const _this = this;
            if (this.newFormValidate.name === '') {
                this.newAddLowerErrorMsg = '角色名称不能为空';
                return false;
            }
            if (this.newFormValidate.code === '') {
                this.newAddLowerErrorMsg = '角色编码不能为空';
                return false;
            }
            this.addEditLoading = true;
            // debugger
            this.$post(api.getRoleSaveManager(), {
                id: this.newFormValidate.id,
                name: this.newFormValidate.name,
                code: this.newFormValidate.code,
                sortNum: this.newFormValidate.sortNum,
                remark: this.newFormValidate.remark,
                typeId: 0
            }).then((res) => {
                // debugger
                let content = res.data;
                if (content.status === 200) {
                    _this.addEditLoading = false;
                    _this.getRoleList();
                    console.log('编辑成功');
                    this.addEditShow = false; // 关掉增加模块
                    this.$Message.success(' 保存成功');
                }
            });
            this.isAddShow = false;
            this.isEditShow = false;
        },
        getRoleList () {
            this.$fetch(api.getRoleListManager()).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log('链接成功');
                    this.tableData = content.res;
                    // debugger
                }
            });
        },
        // 要获取一个模块目录
        getModuleList () {
            this.$fetch('module/list').then(res => {
                const _this = this;
                let content = res.data;
                if (content.status === 200) {
                    _this.moduleData = (content.res || []).map(item => {
                        return {
                            title: item.name,
                            parentId: item.parentId,
                            id: item.id
                        };
                    });
                    _this.moduleTree(_this.moduleData);
                }
            });
        },
        moduleTree (data) {
            const treeParentId = data.map(x => x.parentId);
            const treeId = data.map(x => x.id);
            this.$set(data.find(x => x.id === 1), 'expand', true);
            for (let i of treeId) {
                const children = [];
                this.isTrue = true;
                for (let j of treeParentId) {
                    if (i === j && this.isTrue) {
                        this.isTrue = false;
                        children.push(data.filter(x => x.parentId === i));
                        // console.log(data);
                    }
                }
                this.$set(data.find(x => x.id === i), 'children', children[0]);
                this.$set(data.find(x => x.id === i), 'expand', true);
            }
            // debugger
            this.moduleList = Array.of(data.find(x => x.parentId === 0));
        },
        // 已经选中的模块
        selectionModuleData (val) {
            console.log(val);
            this.currentRoleModule = val.map(x => x.id);
            // debugger
        },
        cancelRoleModule () {
            this.modalModule = false;
        },
        confirmRoleModule () {
            const _this = this;
            for (let k of this.currentRoleModule) {
                // const parentId = this.moduleData.find(x => x.parentId === k).parentId;
                if (_this.moduleData.find(x => x.id === k).parentId !== 0) {
                    if (!_this.currentRoleModule.includes(_this.moduleData.find(x => x.id === k).parentId)) {
                        _this.currentRoleModule.push(_this.moduleData.find(x => x.id === k).parentId);
                    }
                }
            }
            this.saveRoleModule();
        },
        // 保存模块
        saveRoleModule () {
            console.log('保存模块');
            // debugger
            this.moduleLoading = true;
            // debugger
            this.$post('role/module/save?roleid=' + this.currentRoleId, this.currentRoleModule).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('保存用户对应的模块');
                    this.modalModule = false;
                    this.moduleLoading = false;
                    this.$Message.success(' 保存成功');
                    // debugger
                }
            });
        },
        // 获取用户对应的模块列表
        getRoleModuleList () {
            const _this = this;
            // debugger
            this.$fetch('role/module/list?roleid=' + this.currentRoleId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === []) {
                        return false;
                    };
                    _this.currentRoleModule = content.res;
                    for (let z of content.res) {
                        if (!_this.moduleData.map(x => x.parentId).includes(z)) {
                            _this.$set(_this.moduleData.find(x => x.id === z), 'checked', true);
                        }
                    }
                    _this.moduleTree(_this.moduleData);
                    console.log('保存用户对应的模块列表');
                }
            });
        },
        // 获取模块
        getModuleCode () {
            // debugger
            const _this = this;
            this.$fetch('right/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log('获取模块列表');
                    _this.assembData = content.res;
                    var AllRealData = [];
                    for (let i of _this.assembData) {
                        if (i.rightItems.length !== 0) {
                            for (var j = 0; j < i.rightItems.length; j++) {
                                i.rightItems[j].checked = false;
                            }
                            AllRealData.push(i);
                        }
                    }
                    this.$fetch('right/role/list/' + _this.currentRoleId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            var assembSelectData = content.res;
                            for (let m of AllRealData) {
                                for (let k of assembSelectData) {
                                    if (m.moduleId === k.moduleId) {
                                        for (var l = 0; l < m.rightItems.length; l++) {
                                            if (m.rightItems[l].rightCode === k.rightCode) {
                                                m.rightItems[l].checked = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        _this.powerData = AllRealData;
                    });
                }
            });
        },
        cancelRoleAssembly () {
            this.powerModule = false;
        },
        confirmRoleAssembly () {
            // console.log(this.powerData);
            var params = [];
            for (let d of this.powerData) {
                for (let f of d.rightItems) {
                    if (f.checked === true) {
                        params.push(
                            {
                                moduleId: d.moduleId,
                                moduleCode: d.moduleCode,
                                rightCode: f.rightCode,
                                ownerId: this.currentRoleId
                            }
                        );
                    }
                }
            }
            // debugger
            this.powerLoading = true;
            this.$post('right/role/save?roleid=' + this.currentRoleId, params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log('保存成功');
                    // debugger
                    this.powerLoading = false;
                    this.powerModule = false;
                    this.$Message.success(' 保存成功');
                }
            });
            // console.log('保存模块');
        }
    },
    mounted () {
        // this.token = Cookies.get('token');
        this.getRoleList();
        this.getAllModule();
        this.getModuleList();
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(236);
        };
    }
};
</script>

<style scoped>
    .moduleAssembly{
        color: #495060;
        /*font-weight: 600;*/
        background-color: #fff;
        border-bottom: 1px solid #e9eaec;
    }
    .moduleAssembly span{
        display: inline-block;
        line-height: 48px;
        height: 48px;
    }
    .moduleAssemblyHeader{
        font-weight: 600;
        background-color: #e9eaec;
    }
    .moduleAssembly span:first-child {
        width: 200px;
        text-align: center;
    }
</style>

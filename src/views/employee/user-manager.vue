<template>
    <Card>
        <Row :gutter='16'>
            <Col span="4">
                <Card>
                    <Tree
                        :data="treeData"
                        @on-select-change="handleTree"></Tree>
                </Card>
            </Col>
            <Col :span="20">
                <Card>
                    <Row class="margin-top-10">
                        <Table border ref="selection" :columns="columnsTable" :data="tableData"></Table>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal
                v-model="modalRole"
                title="角色">
            <div>
                <Table height="300" border @on-selection-change="SelectionRoleData" :columns="columnsRole" :data="roleData"></Table>
            </div>
            <!--<div slot="footer" class="modalFooterStyle">-->
                <!--<span class="editFormErrorStyle"></span>-->
                <!--<div>-->
                    <!--<Button type="error" @click="cancelUserRole">取消</Button>-->
                    <!--<Button type="success" :loading="roleLoading" @click="confirmUserRole">确认</Button>-->
                <!--</div>-->
            <!--</div>-->
            <modal-button
                    slot="footer"
                    :loading="roleLoading"
                    @cancel="cancelUserRole"
                    @submit="confirmUserRole"
            >
            </modal-button>
        </Modal>
        <Modal
                v-model="modalModule"
                title="模块">
            <div class="moduleAssembly">
                <Tree @on-check-change="selectionModuleData" :data="moduleList" show-checkbox></Tree>
            </div>
            <!--<div slot="footer" class="modalFooterStyle">-->
                <!--<span class="editFormErrorStyle"></span>-->
                <!--<div>-->
                    <!--<Button type="error" @click="cancelUserModule">取消</Button>-->
                    <!--<Button type="success" :loading="moduleLoading" @click="confirmUserModule">确认</Button>-->
                <!--</div>-->
            <!--</div>-->
            <modal-button
                    slot="footer"
                    :loading="moduleLoading"
                    @cancel="cancelUserModule"
                    @submit="confirmUserModule"
            >
            </modal-button>
        </Modal>
        <Modal
                v-model="powerModule"
                title="权限设置"
                :width="800">
            <div>
                <Table height="300" :columns="columnsPower" :data="powerData"></Table>
                <!--<div style="border: 1px solid #e9eaec;">-->
                    <!--<div class="moduleAssembly moduleAssemblyHeader"><span>模块名称</span><span>权限项</span></div>-->
                    <!--<div class="moduleAssembly" v-for="item of powerData">-->
                        <!--<span>{{item.moduleName}}</span>-->
                        <!--<span>-->
                                <!--<Checkbox v-for="k of item.rightItems" v-model="k.checked" :label="k.rightCode">{{k.rightName}}</Checkbox>-->
                            <!--</span>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
            <!--<div slot="footer" class="modalFooterStyle">-->
                <!--<span class="editFormErrorStyle"></span>-->
                <!--<div>-->
                    <!--<Button type="error" @click="cancelUserAssembly">取消</Button>-->
                    <!--<Button type="success" :loading="powerLoading" @click="confirmUserAssembly">确认</Button>-->
                <!--</div>-->
            <!--</div>-->
            <modal-button
                slot="footer"
                :loading="powerLoading"
                @cancel="cancelUserAssembly"
                @submit="confirmUserAssembly"
            >
            </modal-button>
        </Modal>
    </Card>
</template>

<script>
import modalButton from '../public/modalButton';
export default {
    components: {
        modalButton
    },
    data () {
        return {
            beginHour: '',
            endHour: '',
            roleLoading: false,
            moduleLoading: false,
            powerLoading: false,
            AssemblyData: [],
            currentUserId: '',
            currentModuleAssembly: [],
            currentUserRole: [],
            currentUserModule: [],
            rightItem: [],
            currentModId: '',
            currentModAssembly: [],
            currentModuleId: '',
            assemblyModal: false,
            powerModule: false,
            modalRole: false,
            modalModule: false,
            treeData: [],
            moduleList: [],
            moduleData: [],
            roleList: [],
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
            powerData: [
            ],
            columnsRole: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '角色编号',
                    key: 'roleCode'
                },
                {
                    title: '角色名称',
                    key: 'roleName'
                }
            ],
            roleData: [],
            columnsTable: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '用户编号',
                    key: 'code'
                },
                {
                    title: '用户姓名',
                    key: 'name'
                },
                {
                    title: '部门名称',
                    key: 'deptName'
                },
                {
                    title: '岗位名称',
                    key: 'postName'
                },
                // {
                //     title: '角色',
                //     key: 'role'
                // },
                // {
                //     title: '权限设置',
                //     key: 'power',
                //     width: 100,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [
                //             h('Div', {
                //                 on: {
                //                     'click': () => {
                //                         console.log(1);
                //                         this.powerModule = true;
                //                         this.currentUserId = params.row.id;
                //                         this.getModuleCode();
                //                     }
                //                 }
                //             }, [
                //                 h('Icon', {
                //                     props: {
                //                         type: 'ios-settings-strong',
                //                         size: 20
                //                     }
                //                 })
                //             ])
                //         ]);
                //     }
                // },
                {
                    title: '操作',
                    width: 200,
                    render: (h, params) => {
                        const _this = this;
                        return h('Div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: (e) => {
                                        this.powerModule = true;
                                        this.currentUserId = params.row.id;
                                        this.getModuleCode();
                                    }
                                }
                            }, '权限'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: (e) => {
                                        _this.modalRole = true;
                                        // console.log(e);
                                        // console.log(params);
                                        // debugger
                                        for (let z of _this.roleData) {
                                            _this.$set(z, '_checked', false);
                                        }
                                        _this.currentUserId = params.row.id;
                                        // debugger;
                                        _this.getUserRoleList();
                                    }
                                }
                            }, '角色'),
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                },
                                on: {
                                    click: (e) => {
                                        _this.modalModule = true;
                                        // debugger
                                        for (let z of _this.moduleData) {
                                            _this.$set(z, 'checked', false);
                                        }
                                        _this.moduleTree(_this.moduleData);
                                        // debugger
                                        _this.currentUserId = params.row.id;
                                        _this.getUserModuleList();
                                        console.log(e);
                                        console.log(params);
                                        // debugger;
                                    }
                                }
                            }, '模块')
                        ]);
                    }
                }
            ],
            tableData: [
            ],
            treeIndex: '',
            deptDataList: []
        };
    },
    methods: {
        // 获取部门的数据
        getDeptList () {
            const _this = this;
            this.$fetch('dept/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取部门数据');
                    _this.deptDataList = content.res.map(item => {
                        return {
                            id: item.id,
                            parentId: item.parentId,
                            title: item.name
                        };
                    });
                    _this.tree(_this.deptDataList);
                };
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        handleTree (treeIndex) {
            if (treeIndex.length === 1) {
                this.treeIndex = treeIndex;
            }
            console.log(this.deptDataList);
            this.getDeptUser();
        },
        tree (data) {
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
            }
            this.treeData = Array.of(data[0]);
        },
        // 根据部门获取用户
        getDeptUser () {
            const _this = this;
            this.$fetch('user/list?deptid=' + this.treeIndex[0].id).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // console.log('获取成功');
                    _this.tableData = (content.res || []).map(item => {
                        return {
                            id: item.id,
                            code: item.code,
                            name: item.name,
                            deptId: item.deptId,
                            deptName: item.deptName,
                            postId: item.postId,
                            postName: item.postName,
                            role: item.role
                        };
                    });
                    // debugger
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 要获取一个角色目录
        // getRoleList () {
        //     this.$fetch('role/list').then(res => {
        //         const _this = this
        //         let content = res.data;
        //         if (content.status === 200) {
        //             console.log('角色目录');
        //             _this.roleList = (content.res || []).map(item => {
        //                 return {
        //                     title: item.name,
        //                     id: item.id
        //                 };
        //             });
        //         }
        //     });
        // },
        // 要获取一个模块目录
        getModuleList () {
            this.$fetch('module/list').then(res => {
                const _this = this;
                let content = res.data;
                if (content.status === 200) {
                    console.log('模块目录');
                    _this.moduleData = (content.res || []).map(item => {
                        return {
                            title: item.name,
                            parentId: item.parentId,
                            id: item.id
                        };
                    });
                    _this.moduleTree(_this.moduleData);
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
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
                        console.log(data);
                    }
                }
                this.$set(data.find(x => x.id === i), 'children', children[0]);
                this.$set(data.find(x => x.id === i), 'expand', true);
            }
            this.moduleList = Array.of(data[0]);
        },
        // 选择模块
        selectionModuleData (val) {
            console.log(val);
            this.currentUserModule = val.map(x => x.id);
        },
        // 保存用户对应的模块
        cancelUserModule () {
            this.modalModule = false;
        },
        // 记载选中父元素的id
        confirmUserModule () {
            const _this = this;
            for (let k of this.currentUserModule) {
                // const parentId = this.moduleData.find(x => x.parentId === k).parentId;
                if (_this.moduleData.find(x => x.id === k).parentId !== 0) {
                    if (!_this.currentUserModule.includes(_this.moduleData.find(x => x.id === k).parentId)) {
                        _this.currentUserModule.push(_this.moduleData.find(x => x.id === k).parentId);
                    }
                }
            }
            this.saveUserModule();
        },
        // 保存模块
        saveUserModule () {
            console.log('保存模块');
            // debugger
            this.moduleLoading = true;
            // if () {
            // }
            // debugger
            this.$post('user/module/save?userid=' + this.currentUserId, this.currentUserModule).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.modalModule = false;
                    this.moduleLoading = false;
                    console.log('保存用户对应的模块');
                    // debugger
                } else {
                    this.$Modal.error({
                        title: '保存失败',
                        content: content.message
                    });
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 获取用户对应的模块列表
        getUserModuleList () {
            const _this = this;
            // debugger
            this.$fetch('user/module/list?userid=' + this.currentUserId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === []) {
                        return false;
                    };
                    // debugger
                    // if () {
                    //
                    // }
                    _this.currentUserModule = content.res;
                    // debugger
                    for (let z of content.res) {
                        // debugger
                        if (!_this.moduleData.map(x => x.parentId).includes(z)) {
                            _this.$set(_this.moduleData.find(x => x.id === z), 'checked', true);
                        }
                        // _this.$set(_this.moduleData.find(x => x.id === z), 'checked', true);
                    }
                    // debugger
                    _this.moduleTree(_this.moduleData);
                    console.log('保存用户对应的模块列表');
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // confirmRole () {
        //     console.log('提交角色');
        // },
        // 获取模块
        getModuleCode () {
            // debugger
            const _this = this;
            this.$fetch('right/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取模块列表');
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
                    // debugger
                    // _this.powerData = AllRealData;
                    this.$fetch('right/user/list/' + _this.currentUserId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            var assembSelectData = content.res;
                            // debugger
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
                    });
                    _this.powerData = AllRealData;
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 角色管理
        getAllRole () {
            this.$fetch('role/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取成功');
                    this.roleData = (content.res || []).map(item => {
                        return {
                            id: item.id,
                            roleCode: item.code,
                            roleName: item.name
                        };
                    });
                    // debugger
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 选择角色
        SelectionRoleData (val) {
            console.log(val);
            this.currentUserRole = val.map(item => item.id);
        },
        cancelUserRole () {
            this.modalRole = false;
        },
        // 保存角色
        confirmUserRole () {
            console.log('保存角色');
            this.roleLoading = true;
            this.$post('user/role/save?userid=' + this.currentUserId, this.currentUserRole).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.modalRole = false;
                    this.roleLoading = false;
                    console.log('保存用户对应的角色');
                    // debugger
                } else {
                    this.$Modal.error({
                        title: '保存失败',
                        content: content.message
                    });
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // 获取对应的角色列表
        getUserRoleList () {
            const _this = this;
            this.$fetch('/user/role/list?userid=' + this.currentUserId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('获取对应的角色列表');
                    // _this.tableData = [];
                    if (content.res === []) {
                        return false;
                    };
                    for (let z of content.res) {
                        _this.$set(_this.roleData.find(x => x.id === z), '_checked', true);
                    }
                    // debugger
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
        },
        // ChangeRight (item) {
        //     // console.log(item);
        //     this.currentModId = item.moduleId;
        //     debugger;
        // },
        // ChangeRightItem (val) {
        //     console.log(val);
        //     const _this = this;
        //     this.currentModAssembly = val;
        //     if (this.AssemblyData.length === 0) {
        //         const para = {
        //             moduleId: _this.currentModId,
        //             rightItems: _this.currentModAssembly
        //         }
        //         debugger
        //         _this.AssemblyData.push(para);
        //     } else {
        //         if (_this.AssemblyData.map(x => x.moduleId).includes(_this.currentModId)) {
        //             _this.AssemblyData.find(x => x.moduleId === _this.currentModId).rightItems.push();
        //         }
        //     }
        //     debugger;
        // },
        // selectRightModule (val) {
        //     // console.log(val);
        //     this.currentModId = val.moduleId;
        //     // debugger;
        // },
        cancelUserAssembly () {
            this.powerModule = false;
        },
        confirmUserAssembly () {
            console.log(this.powerData);
            var params = [];
            for (let d of this.powerData) {
                for (let f of d.rightItems) {
                    if (f.checked === true) {
                        params.push(
                            {
                                moduleId: d.moduleId,
                                moduleCode: d.moduleCode,
                                rightCode: f.rightCode,
                                ownerId: this.currentUserId
                            }
                        );
                    }
                }
            }
            // debugger
            this.powerLoading = true;
            this.$post('right/user/save?userid=' + this.currentUserId, params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    console.log('保存成功');
                    this.powerModule = false;
                    this.powerLoading = false;
                    // debugger
                } else {
                    this.$Modal.error({
                        title: '保存失败',
                        content: content.message
                    });
                }
            }).catch(function (error) {
                this.$Modal.error({
                    title: '网络错误',
                    content: error
                });
            });
            console.log('保存模块');
        }
    },
    mounted () {
        this.getDeptList();
        // this.getRoleList();
        this.getModuleList();
        // this.getModuleCode();
        this.getAllRole();
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

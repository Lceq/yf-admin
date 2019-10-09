<template>
    <div>
        <Card>
            <Row :gutter='16'>
                <Col>
                    <Row class="buttonBottom">
                        <Button icon="md-add" @click="addNewRole" type="primary">新增</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Table :height="tableHeight" :loading="tableLoading" border size="small" ref="selection" :columns="columnsRole" :data="tableRoleData"></Table>
                    </Row>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="roleShow"
            :title="roleTitle"
            :warnMsg="warnMsg"
            :loading="roleLoading"
            @cancel="roleCancel"
            @submit="roleSubmit('newFormValidate')"
        >
            <div slot="content">
                <Form :label-width="130" ref="newFormValidate" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
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
                    <!--<AboutTime-->
                        <!--v-if="timeShow"-->
                        <!--:createTime="createTime"-->
                        <!--:createName="createName"-->
                        <!--:reviseTime="updateTime"-->
                        <!--:reviseName="updateName"-->
                    <!--&gt;-->
                    <!--</AboutTime>-->
                    <other-message
                        :createTime="createTime"
                        :createName="createName"
                        :updateName="updateName"
                        :updateTime="updateTime"
                    ></other-message>
                </Form>
            </div>
        </modal>
        <modal
                :isShow="assemblyRoleShow"
                :title="assemblyRoleTitle"
                :width="800"
                :loading="assemblyRoleLoading"
                @cancel="assemblyRoleCancel"
                @submit="assemblyRoleSubmit"
        >
           <div slot="content">
               <Table class="AssemblyHeight" :loading="tableRoleAssemblyLoading" height="600" :columns="roleAssemblyColumns" size="small" :data="roleAssemblyData"></Table>
           </div>
        </modal>
        <modal
                :isShow="RoleModuleShow"
                :title="RoleModuleTitle"
                :width="800"
                :loading="RoleModuleLoading"
                @cancel="RoleModuleCancel"
                @submit="RoleModuleSubmit"
        >
            <div slot="content" class="moduleAssembly">
                <Tree @on-check-change="selectionModuleData" :data="RoleModuleList" show-checkbox></Tree>
            </div>
        </modal>
        <delete-warning
                :v-model="warnShow"
                :tipMsg="warnMessage"
                :loading="deleteLoading"
                @cancel="onCancelWarn"
                @confirm="onConfirmWarn"
        ></delete-warning>
    </div>
</template>

<script>
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
import xwValidate from '@/libs/xwValidate';
import otherMessage from '../../components/otherMessage';
export default {
    components: {
        modal,
        otherMessage,
        deleteWarning
    },
    data () {
        return {
            tableHeight: document.documentElement.clientHeight - 200,
            tableRoleData: [],
            tableLoading: false,
            columnsRole: [
                {
                    title: '编码',
                    sortable: true,
                    width: 80,
                    align: 'left',
                    key: 'code'
                },
                {
                    title: '名称',
                    sortable: true,
                    minWidth: 160,
                    align: 'left',
                    key: 'name'
                },
                {
                    title: '排序',
                    key: 'sortNum',
                    width: 80,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '备注',
                    minWidth: 200,
                    align: 'left',
                    key: 'remark'
                },
                {
                    title: '权限设置',
                    key: 'power',
                    minWidth: 120,
                    align: 'center',
                    render: (h, params) => {
                        // const _this = this;
                        return h('div', [
                            h('Div', {
                                on: {
                                    'click': () => {
                                        this.currentRoleId = params.row.id;
                                        this.getModuleCodeList();
                                    }
                                }
                            }, [
                                h('Icon', {
                                    props: {
                                        type: 'md-build',
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
                    minWidth: 180,
                    align: 'center',
                    render: (h, params) => {
                        // const _this = this;
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.getRoleDetail(params.row.id);
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: (val) => {
                                        this.currentRoleId = params.row.id;
                                        this.getModuleList();
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
                                        this.warnShow = true;
                                        this.warnMessage = '确定要删除吗';
                                        // debugger;
                                        this.deleteId = params.row.id;
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            roleShow: false,
            roleTitle: '',
            warnMsg: '',
            roleLoading: false,
            newFormValidate: {
                code: '',
                name: '',
                sortNum: 0
            },
            newFormValidateRules: {
                code: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ]
            },
            timeShow: '',
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            assemblyRoleShow: false,
            assemblyRoleTitle: '',
            assemblyRoleLoading: false,
            tableRoleAssemblyLoading: false,
            roleAssemblyColumns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h('Table', {
                            props: {
                                size: 'small',
                                showHeader: false,
                                columns: this.RoleModuleColumns,
                                data: params.row.children
                            }
                        });
                    }
                },
                {
                    title: '模块名称',
                    // _expanded: true,
                    width: 200,
                    key: 'moduleName'
                },
                {
                    title: '权限项',
                    key: 'rightItem'
                }
            ],
            roleAssemblyData: [],
            RoleModuleColumns: [
                {
                    title: '模块名称',
                    width: 200,
                    key: 'moduleName',
                    render: (h, params) => {
                        return h('Span', [
                            h('Span', {}, params.row.moduleName)
                        ]);
                    }
                },
                {
                    title: '权限项',
                    key: 'rightItem',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            params.row.rightItems.map(item => {
                                return h('Checkbox', {
                                    props: {
                                        label: item.rightName,
                                        value: item.checked
                                    },
                                    style: {
                                        margin: '5px'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.rightItems.find(x => x.rightCode === item.rightCode).checked = event;
                                            _this.roleAssemblyData.find(x => x.moduleId === params.row.parentId).children.find(y => y.moduleId === params.row.moduleId).rightItems = params.row.rightItems;
                                        }
                                    }
                                }, item.rightName + '(' + item.rightCode + ')');
                            })
                        ]);
                    }
                }
            ],
            // basicAssemblyData: [],
            RoleModuleShow: false,
            RoleModuleTitle: '',
            RoleModuleLoading: false,
            RoleModuleList: [],
            currentRoleModule: [],
            roleModuleData: [],
            warnShow: false,
            warnMessage: '',
            deleteId: '',
            deleteLoading: false
        };
    },
    methods: {
        addNewRole () {
            this.createTime = '';
            this.createName = '';
            this.updateTime = '';
            this.updateName = '';
            this.newFormValidate.code = '';
            this.newFormValidate.name = '';
            this.newFormValidate.sortNum = 0;
            this.newFormValidate.remark = '';
            this.newFormValidate.id = null;
            this.timeShow = false;
            this.roleTitle = '新增角色';
            this.roleShow = true;
        },
        getRoleList () {
            this.tableLoading = true;
            this.$fetch('role/list').then((res) => {
                let content = res.data;
                this.tableLoading = false;
                if (content.status === 200) {
                    this.tableRoleData = content.res;
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        roleCancel () {
            this.roleShow = false;
            this.roleLoading = false;
        },
        roleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.newFormValidate.id,
                        name: this.newFormValidate.name,
                        code: this.newFormValidate.code,
                        sortNum: this.newFormValidate.sortNum,
                        remark: this.newFormValidate.remark,
                        typeId: 0
                    };
                    this.roleLoading = true;
                    this.$post('role/save', params).then((res) => {
                        // debugger
                        this.roleLoading = false;
                        let content = res.data;
                        this.roleShow = false; // 关掉增加模块
                        if (content.status === 200) {
                            this.$Message.success(' 保存成功');
                            this.getRoleList();
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // 编辑
        getRoleDetail (id) {
            this.$fetch('role/detail/' + id).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.newFormValidate.id = content.res.id;
                    this.newFormValidate.name = content.res.name;
                    this.newFormValidate.code = content.res.code;
                    this.newFormValidate.remark = content.res.remark;
                    this.newFormValidate.sortNum = content.res.sortNum;
                    this.createTime = content.res.createTime;
                    this.createName = content.res.createName;
                    this.updateTime = content.res.updateTime;
                    this.updateName = content.res.updateName;
                    this.roleShow = true;
                    this.warnMsg = '';
                    this.roleTitle = '编辑角色';
                    this.addEditShow = true;
                }
            });
        },
        // 删除
        onCancelWarn () {
            this.warnShow = false;
            this.deleteLoading = false;
        },
        onConfirmWarn () {
            const _this = this;
            this.deleteLoading = true;
            // debugger
            this.$post('role/delete/' + _this.deleteId).then((res) => {
                this.deleteLoading = false;
                if (res.data.status === 200) {
                    this.warnShow = false;
                    this.$Message.success('删除成功');
                    _this.getRoleList();
                }
            });
        },
        // 权限
        getModuleCodeList () {
            const _this = this;
            this.$fetch('right/module/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    for (let k of content.res) {
                        if (k.parentId === 1) {
                            k._expanded = true;
                        }
                        if (k.rightItems.length !== 0) {
                            for (let i of k.rightItems) {
                                i.checked = false;
                            }
                        }
                    }
                    let data = content.res;
                    this.$fetch('right/role/list/' + _this.currentRoleId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            for (let m of data) {
                                for (let j of content.res) {
                                    if (m.moduleId === j.moduleId) {
                                        for (let p of m.rightItems) {
                                            if (p.rightCode === j.rightCode) {
                                                p.checked = true;
                                            }
                                        }
                                    }
                                }
                            }
                            // debugger
                            // 这里呢对数据进行处理;
                            _this.assemblyRoleTitle = '权限项分配';
                            _this.assemblyRoleShow = true;
                            // _this.basicAssemblyData = data;
                            _this.getTrees(data, 1);this.$call
                        }
                    });
                }
            });
        },
        getTrees (list, parentId) {
            let items = {};
            // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
            for (let i = 0; i < list.length; i++) {
                let key = list[i].parentId;
                if (items[key]) {
                    items[key].push(list[i]);
                } else {
                    items[key] = [];
                    items[key].push(list[i]);
                }
            }
            return this.formatTree(items, parentId);
        },
        // 利用递归格式化每个节点/**/
        formatTree (items, parentId) {
            const _this = this;
            let result = [];
            if (!items[parentId]) {
                return result;
            }
            for (let t of items[parentId]) {
                t.children = _this.formatTree(items, t.moduleId);
                result.push(t);
            }
            // console.log(result);
            return this.roleAssemblyData = result;
        },
        assemblyRoleCancel () {
            this.assemblyRoleShow = false;
            this.assemblyRoleLoading = false;
        },
        assemblyRoleSubmit () {
            let params = [];
            for (let basic of this.roleAssemblyData) {
                for (let p of basic.children) {
                    for (let c of p.rightItems) {
                        if (c.checked === true) {
                            params.push({
                                moduleId: p.moduleId,
                                moduleCode: p.moduleCode,
                                rightCode: c.rightCode,
                                ownerId: this.currentRoleId
                            });
                        }
                    }
                }
            }
            // debugger;
            this.assemblyRoleLoading = true;
            this.$post('right/role/save?roleid=' + this.currentRoleId, params).then((res) => {
                let content = res.data;
                this.assemblyRoleLoading = false;
                if (content.status === 200) {
                    this.assemblyRoleShow = false;
                    this.$Message.success(' 保存成功');
                }
            });
        },
        // 模块
        // 模块列表
        getModuleList () {
            const _this = this;
            this.$fetch('module/list').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.roleModuleData = (content.res || []).map(item => {
                        return {
                            title: item.name,
                            parentId: item.parentId,
                            id: item.id,
                            checked: false,
                            expand: true
                        };
                    });
                    this.$fetch('role/module/list?roleid=' + this.currentRoleId).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            let pid = _this.roleModuleData.find(x => x.parentId === 0).id;
                            for (let z of content.res) {
                                if (_this.roleModuleData.find(x => x.id === z).parentId !== pid || _this.roleModuleData.find(x => x.id === z).parentId !== 0) {
                                    _this.roleModuleData.find(x => x.id === z).checked = true;
                                }
                            }
                            _this.currentRoleModule = _this.roleModuleData.filter(x => x.checked === true).map(y => y.id);
                        }
                    });
                    _this.getModuleTrees(_this.roleModuleData, 0);
                    _this.RoleModuleShow = true;
                    _this.RoleModuleTitle = '模块分配';
                }
            });
        },
        getModuleTrees (list, parentId) {
            let items = {};
            // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
            for (let i = 0; i < list.length; i++) {
                let key = list[i].parentId;
                if (items[key]) {
                    items[key].push(list[i]);
                } else {
                    items[key] = [];
                    items[key].push(list[i]);
                }
            }
            return this.ModuleFormatTree(items, parentId);
        },
        // 利用递归格式化每个节点/**/
        ModuleFormatTree (items, parentId) {
            const _this = this;
            let result = [];
            if (!items[parentId]) {
                return result;
            }
            for (let t of items[parentId]) {
                t.children = _this.ModuleFormatTree(items, t.id);
                result.push(t);
            }
            return this.RoleModuleList = result;
        },
        RoleModuleCancel () {
            this.RoleModuleLoading = false;
            this.RoleModuleShow = false;
        },
        RoleModuleSubmit () {
            this.saveRoleModule();
        },
        selectionModuleData (val) {
            let Data = val.map(x => x.id);
            let pId = this.roleModuleData.find(x => x.parentId === 0).id;
            this.currentRoleModule = [];
            // debugger
            for (let i of Data) {
                if (this.roleModuleData.find(x => x.id === i).parentId !== 0 && !this.roleModuleData.map(x => x.parentId).includes(i.id) && !this.currentRoleModule.includes(i)) {
                    this.currentRoleModule.push(i);
                }
            }
            // debugger
        },
        // 保存模块
        saveRoleModule () {
            this.RoleModuleLoading = true;
            this.$post('role/module/save?roleid=' + this.currentRoleId, this.currentRoleModule).then((res) => {
                let content = res.data;
                this.RoleModuleLoading = false;
                if (content.status === 200) {
                    this.RoleModuleShow = false;
                    this.$Message.success(' 保存成功');
                }
            });
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.getRoleList();
    },
    mounted () {
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(200);
        };
    }
};
</script>

<style scoped>
</style>

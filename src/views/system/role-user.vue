<template>
    <div>
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
                        <Row>
                            <Col>
                                <a @click="addRoleUser" style="margin-right: 10px;" class="newAddLowerColor"><Icon style="margin-right: 5px" type="plus" class="newAddLowerColor"></Icon>添加新的角色用户</a>
                                <a @click="removeRoleUser" class="newAddLowerColor"><Icon style="margin-right: 5px" type="minus" class="newAddLowerColor"></Icon>移除</a>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Table border ref="selection" @on-selection-change="selectRemoveUser" :columns="Rolecolumns" :data="tableData"></Table>
                        </Row>
                        <Row style="margin-top: 10px; text-align: right">
                            <Col>
                                <Page :total="totalNum" :page-size="pageSize" @on-change="ChangePage" show-elevator></Page>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Modal
                    v-model="warnShow"
                    title="提示"
                    @on-ok="onConfirmWarn">
                <p>{{ warnMessage }}</p>
            </Modal>
            <Row>
                <Col>
                    <Modal
                            v-model="addEditShow"
                            :title="addEditData"
                            :mask-closable="false">
                        <Form :model="newFormValidate" :label-width="40" :rules="newFormValidateRules" :show-message="false">
                            <Row>
                                <Col span="10">
                                    <FormItem prop="apart" label="部门">
                                        <Cascader :change-on-select="true" :data="apartData" @on-change="onChange" v-model="newFormValidate.apart"></Cascader>
                                    </FormItem>
                                </Col>
                                <Col span="10">
                                    <FormItem prop="name" label="名称">
                                        <Input @on-enter="searchUser(newFormValidate.name)" v-model="newFormValidate.name" placeholder="姓名/工号" value="newFormValidate.name"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="4" style="text-align: center"><Button type="success">查询</Button></Col>
                            </Row>
                        </Form>
                        <Row style="margin-bottom: 20px">
                            <Col>
                                <Table border ref="selection" @on-selection-change="selectTableUser" height="300" :columns="RoleSelectcolumns" :data="tableSelectData"></Table>
                            </Col>
                        </Row>
                        <div slot="footer" class="modalFooterStyle">
                            <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                            <div>
                                <Button type="error" @click="newAddLowerCancel">取消</Button>
                                <Button type="success" @click="submitAddSubordinate">确认</Button>
                            </div>
                        </div>
                    </Modal>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    // import axios from 'axios';
    import api from '../../ajax/api';
    export default {
        name: 'role-anagement',
        data () {
            return {
                warnShow: false,
                addEditShow: false,
                addEditData: '',
                warnMessage: '',
                // 选择列表
                isTrue: false,
                // 选中的部门
                apartIndex: '',
                // 获取管理员的id
                treeIndex: '',
                removeIndex: '',
                // 选中的员工数据
                SelectedUser: '',
                model1: '',
                totalNum: 0,
                pageSize: 20,
                pageIndex: 1,
                // params: {},
                // 用户的分页
                userTotalNum: 0,
                userPageSize: 10,
                userPageIndex: 1,
                getAlltableDataSwitch: true,
                newAddLowerErrorMsg: '',
                apartData: [{
                    value: 'beijing',
                    label: '北京'
                }],
                treeData: [
                    {
                        title: '根目录',
                        expand: true
                    }
                ],
                newFormValidate: {
                    apart: [],
                    code: '',
                    name: ''
                },
                newFormValidateRules: {
                    // code: [
                    //     {required: true, message: 'The code cannot be empty', trigger: 'blur'}
                    // ],
                    // name: [
                    //     { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    // ]
                },
                Rolecolumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户编码',
                        sortable: true,
                        key: 'code'
                    },
                    {
                        title: '用户名称',
                        sortable: true,
                        key: 'name'
                    }
                ],
                RoleSelectcolumns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '用户编码',
                        sortable: true,
                        key: 'code'
                    },
                    {
                        title: '用户名称',
                        key: 'name',
                        sortable: true,
                        width: 200
                    }
                ],
                tableData: [
                ],
                tableSelectData: [
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
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            handleTree (params) {
                console.log(params);
                if (params.length === 1) {
                    this.treeIndex = params;
                }
                console.log(this.treeIndex.length);
                console.log('点击树状结构');
                this.getUserFromIn();
            },
            addRoleUser () {
                console.log('点击增加新的用户');
                this.addEditShow = true;
                this.addEditData = '添加用户';
            },
            removeRoleUser () {
                if (this.removeIndex.length > 0) {
                    console.log('点击移除用户');
                    this.warnShow = true;
                    this.warnMessage = '确定要移除吗?';
                } else {
                    this.warnShow = true;
                    this.warnMessage = '请选择要移除的用户';
                }
            },
            onConfirmWarn () {
                console.log('提示确认');
                // debugger
                this.$post(api.removeRoleUser(this.treeIndex[0].id), this.removeIndex.map(x => x.id)).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        console.log('移除成功');
                        this.getUserFromIn();
                    };
                });
                this.warnShow = false;
            },
            newAddLowerCancel () {
                console.log('取消键');
                this.addEditShow = false;
            },
            submitAddSubordinate () {
                console.log('确认键');
                // debugger
                if (this.treeIndex.length > 0) {
                    // const UserId = this.SelectedUser.map(x => x.id);
                    // const params = []
                    this.addRoleUserList();
                }
                this.addEditShow = false;
            },
            selectTableUser (params) {
                this.SelectedUser = params;
                console.log(params);
                console.log('1');
            },
            // 利用paerntId进行层级的划分
            getApartData (data) {
                const treeParentId = data.map(x => x.parentId);
                const treeId = data.map(x => x.id);
                for (let i of treeId) {
                    this.isTrue = true;
                    const children = [];
                    if (treeParentId.includes(i) || this.isTrue) {
                        this.isTrue = false;
                        children.push(data.filter(x => x.parentId === i));
                    }
                    this.$set(data.find(x => x.id === i), 'children', children[0]);
                }
                // debugger
                this.apartData = data[0].children;
                // debugger
                // console.log(this.apartData);
                // debugger
            },
            searchUser (value) {
                console.log(value);
                // 点击进行一次筛选
                this.$fetch(api.empSearch(value)).then((res) => {
                    // debugger
                    let content = res.data;
                    if (content.status === 200) {
                        this.tableSelectData = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            };
                        });
                        console.log('筛选');
                    }
                });
            },
            selectRemoveUser (params) {
                console.log(params);
                this.removeIndex = params;
            },
            // 部门式筛选
            onChange (params) {
                console.log(params);
                this.apartIndex = params.reverse()[0];
                this.getUserListByDept();
                // debugger
            },
            // 调取部门
            getApart () {
                this.$fetch(api.getOrgList()).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        let apartData = content.res.map(item => {
                            return {
                                value: item.id,
                                label: item.name,
                                id: item.id,
                                parentId: item.parentId
                            };
                        });
                        this.getApartData(apartData);
                    }
                });
            },
            // 根据部门调取员工的数据
            getUserListByDept () {
                // const _this = this;
                // debugger
                this.$fetch(api.getEmpList(this.apartIndex)).then((res) => {
                    const content = res.data;
                    if (content.status === 200) {
                        // debugger
                        this.tableSelectData = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            };
                        });
                        console.log('员工调取成功');
                    }
                });
            },
            // 调取角色列表
            getRoleList () {
                const _this = this;
                this.$fetch(api.getRoleListManager()).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        console.log('链接成功');
                        const children = content.res.map(item => {
                            return {
                                title: item.name,
                                id: item.id
                            };
                        });
                        this.$set(_this.treeData[0], 'children', children);
                    }
                });
            },
            // 保存数据
            addRoleUserList () {
                // const _this = this
                const params = this.SelectedUser.map(x => x.id);
                // debugger
                this.$post(api.AddRoleUser(this.treeIndex[0].id), params)
                    .then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.getUserFromIn();
                            console.log('保存成功');
                        };
                    });
            },
            // 获取页码
            ChangePage (index) {
                console.log(index);
                this.pageIndex = index;
                this.getUserFromIn();
            },
            getUserFromIn () {
                const params = {
                    roleid: this.treeIndex[0].id
                };
                this.getAlltableDataSwitch = true;
                this.getRoleUserList(params);
            },
            // pagesize: this.pageSize,
            // pageindex: this.pageIndex
            // 调取角色用户列表
            getRoleUserList (params) {
                const _this = this;
                if (this.treeIndex[0].id === undefined) {
                    this.tableData = [];
                    return;
                };
                this.$fetch(api.getRoleUserList(), params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        if (_this.getAlltableDataSwitch) {
                            _this.totalNum = content.count;
                            const params = {
                                roleid: this.treeIndex[0].id,
                                pagesize: this.pageSize,
                                pageindex: this.pageIndex
                            };
                            _this.getRoleUserList(params);
                            _this.getAlltableDataSwitch = false;
                        } else {
                            _this.tableData = (content.res || []).map(item => {
                                return {
                                    id: item.id,
                                    code: item.code,
                                    name: item.name
                                };
                            });
                        }
                        console.log('调取角色用户列表');
                    };
                });
            }
        },
        mounted () {
            this.token = Cookies.get('token');
            this.getRoleList();
            // this.getUserList();
            this.getApart();
        }
    };
</script>
<style scoped>
</style>

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
                        <Row style="margin-bottom: 10px">
                            <Button  @click="addRoleUser" type="success">添加</Button>
                            <Button @click="removeUser" type="error">移除</Button>
                        </Row>
                        <Row class="margin-top-10">
                            <Table border ref="selection"  @on-selection-change="selectRemoveUser" :columns="Rolecolumns" :data="tableData"></Table>
                        </Row>
                        <Row style="margin-top: 10px; text-align: right">
                            <Page :total="totalNum" :page-size="pageSize" @on-change="ChangePage" :page-size-opts="[10, 15, 20]" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
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
                                        <Cascader :change-on-select="true" :data="apartData" @on-change="ChangeGroup" v-model="newFormValidate.apart"></Cascader>
                                    </FormItem>
                                </Col>
                                <Col span="10">
                                    <FormItem prop="name" label="名称">
                                        <Input @on-change="searchUser(newFormValidate.name)" v-model="newFormValidate.name" placeholder="姓名/工号" value="newFormValidate.name"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="4" style="text-align: center"><Button @click="searchTargetUser" :loading="Searchloading" type="success">查询</Button></Col>
                            </Row>
                        </Form>
                        <Row style="margin-bottom: 20px">
                            <Col>
                                <Table border ref="selection" @on-selection-change="selectTableUser" height="300" :columns="RoleSelectcolumns" :data="tableSelectData"></Table>
                            </Col>
                            <Row style="margin-top: 10px; text-align: right">
                                <Col>
                                    <Page size="small" :total="userTotalNum" :page-size="userPageSize" @on-change="ChangeUserPage" show-elevator></Page>
                                </Col>
                            </Row>
                        </Row>
                        <div slot="footer" class="modalFooterStyle">
                            <span class="editFormErrorStyle">{{ newAddLowerErrorMsg }}</span>
                            <div>
                                <Button type="error" @click="newAddLowerCancel">取消</Button>
                                <Button type="success" :loading="loading" @click="submitAddSubordinate">确认</Button>
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
            Searchloading: false,
            loading: false,
            warnShow: false,
            addEditShow: false,
            addEditData: '',
            warnMessage: '',
            // 选择列表
            treeIndex: '',
            apartIndex: '',
            removeIndex: '',
            searchValue: '',
            // 选中的员工数据
            isSureRemove: false,
            totalNum: 0,
            pageSize: 10,
            pageIndex: 1,
            // 用户的分页
            userTotalNum: 0,
            userPageSize: 10,
            userPageIndex: 1,
            isUserTotal: false,
            getAlltableDataSwitch: true,
            newAddLowerErrorMsg: '',
            treeData: [],
            AllData: [],
            isSearch: '',
            newFormValidate: {
                apart: [],
                code: '',
                name: ''
            },
            newFormValidateRules: {
            },
            apartData: [],
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
                    sortable: true,
                    key: 'name',
                    width: 200
                }
            ],
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
            tableData: [
            ],
            tableSelectData: [
                {
                    code: '123',
                    name: 'John'
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
        handleSelectAll (status) {
            this.$refs.selection.selectAll(status);
        },
        handleTree (params) {
            console.log(params);
            if (params.length === 1 && params[0].id !== 1) {
                this.treeIndex = params;
                this.getModuleFromIn();
            }
            this.getModuleList();
            console.log('点击树状结构');
        },
        addRoleUser () {
            console.log('点击增加新的用户');
            if (this.treeIndex === '' || this.treeIndex[0].id === 1) {
                this.warnMessage = '请选择根目录';
                this.warnShow = true;
            } else {
                this.addEditShow = true;
                this.addEditData = '添加模块用户';
                this.newFormValidate.apart = [];
                this.newFormValidate.name = '';
                this.tableSelectData = [];
                this.userTotalNum = 0;
                this.getApart();
            }
        },
        //
        selectRemoveUser (params) {
            console.log(params);
            this.removeIndex = params;
        },
        removeUser () {
            console.log('点击删除用户');
            if (this.removeIndex.length > 0) {
                console.log('点击移除用户');
                this.isSureRemove = true;
                this.warnShow = true;
                this.warnMessage = '确定要移除吗?';
            } else {
                this.warnShow = true;
                this.warnMessage = '请选择移除用户';
            }
        },
        // 选择用户
        selectTableUser (params) {
            console.log('选择用户');
            this.SelectedUser = (params || []).map(item => {
                return {
                    id: item.id,
                    name: item.name
                };
            });
            console.log(params);
        },
        // 查询
        searchTargetUser () {
            console.log('查询');
            console.log('查询');
            if (this.GroupIndex === {}) {
                this.newAddLowerErrorMsg = '请先选择部门';
            } else {
                this.getApartUserFrom();
            }
        },
        searchUser (value) {
            console.log(value);
            this.searchValue = value;
        },
        onConfirmWarn () {
            console.log('提示确认');
            if (this.isSureRemove) {
                this.$post(api.moduleUserRemove(this.treeIndex[0].id), this.removeIndex.map(x => x.id)).then((res) => {
                    this.isSureRemove = false;
                    let content = res.data;
                    if (content.status === 200) {
                        console.log('移除成功');
                        // 再次重新加载列表
                        this.getModuleFromIn();
                    };
                });
            }
            this.warnShow = false;
        },
        newAddLowerCancel () {
            console.log('取消键');
            this.addEditShow = false;
        },
        submitAddSubordinate () {
            const _this = this;
            console.log('确认键');
            if (this.SelectedUser.length !== 0) {
                // debugger
                this.loading = true;
                this.$post(api.moduleUserAddList(_this.treeIndex[0].id), _this.SelectedUser.map(x => x.id)).then((res) => {
                    let content = res.data;
                    // debugger
                    if (content.status === 200) {
                        this.loading = false;
                        this.getModuleFromIn();
                        console.log('添加成功');
                    }
                });
            }
            this.addEditShow = false;
        },
        // // 部门式筛选
        // onChange (params) {
        //     console.log(params);
        //     this.apartIndex = params;
        //     this.getUserTotalByDept();
        // },
        // 选择部门
        ChangeGroup (params) {
            this.GroupIndex = params.reverse()[0];
            console.log(params);
            console.log('改变部门');
            this.getApartUserFrom();
        },
        // 改变页码
        ChangeUserPage (index) {
            console.log(index);
            this.userPageIndex = index;
            this.getApartUserFrom();
            console.log('改变页码');
        },
        getHierarchy (num) {
            var obj1 = '';
            for (let i = 0; i < num - 2; i++) {
                obj1 += '----';
            }
            return obj1;
            // debugger
        },
        // 获取所有部门
        getApart () {
            this.$fetch(api.getOrgList()).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.apartData = content.res.map(item => {
                        return {
                            value: item.id,
                            label: item.name,
                            id: item.id,
                            parentId: item.parentId,
                            depth: item.depth
                        };
                    });
                    this.getApartData(this.apartData);
                }
            });
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
            this.apartData = data[0].children;
        },
        // 根据部门获取用户
        getApartUserFrom () {
            if (this.GroupIndex === {}) {
                return false;
            }
            const params = {
                deptid: this.GroupIndex
            };
            this.isUserTotal = true;
            this.getApartUser(params);
        },
        getApartUser (params) {
            const _this = this;
            this.Searchloading = true;
            this.$fetch(api.getRoleUserList(), params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.Searchloading = false;
                    if (this.isUserTotal) {
                        _this.userTotalNum = content.count;
                        const params = {
                            deptid: _this.GroupIndex,
                            pageindex: _this.userPageIndex,
                            pagesize: _this.userPageSize,
                            name: _this.searchName
                        };
                        this.isUserTotal = false;
                        this.getApartUser(params);
                    } else {
                        _this.tableSelectData = (content.res || []).map((item) => {
                            return {
                                code: item.code,
                                name: item.name,
                                id: item.id,
                                postName: item.postId,
                                post: item.postName
                            };
                        });
                    }
                    console.log('获取员工数据成功');
                }
            });
        },
        // // 根据部门调取员工的数据
        // getUserListByDept (params) {
        //     const _this = this;
        //     // debugger
        //     this.$fetch(api.getRoleUserList(), params).then((res) => {
        //         const content = res.data
        //         if (content.status === 200) {
        //             // 获取数据的数量
        //             // debugger
        //             if (this.isUserTotal) {
        //                 _this.userTotalNum = content.count;
        //                 _this.isUserTotal = false;
        //                 _this.getUserPageByDept();
        //             } else {
        //                 _this.tableSelectData = (content.res || []).map(item => {
        //                     // debugger
        //                     return {
        //                         id: item.id,
        //                         code: item.code,
        //                         name: item.name
        //                     };
        //                 });
        //             }
        //             console.log('员工调取成功');
        //         }
        //     });
        // },
        // getUserPageByDept () {
        //     const params = {
        //         deptid: this.apartIndex,
        //         pagesize: this.userPageSize,
        //         pageindex: this.userPageIndex,
        //         name: this.isSearch === true ? this.searchValue : ''
        //     }
        //     this.isUserTotal = false;
        //     this.getUserListByDept(params);
        // },
        // 获取页码
        ChangePage (index) {
            console.log(index);
            this.pageIndex = index;
            this.getAlltableDataSwitch = true;
            this.getModuleFromIn();
        },
        changePageSize (index) {
            this.pageSize = index;
            this.getAlltableDataSwitch = true;
            this.getModuleFromIn();
        },
        getModuleFromIn () {
            const params = {
                moduleid: this.treeIndex[0].id
            };
            this.getAlltableDataSwitch = true;
            this.getModuleUser(params);
        },
        // 根据模块id调取用户
        getModuleUser (params) {
            const _this = this;
            if (this.treeIndex[0].id === undefined) {
                this.tableData = [];
                return;
            };
            // debugger
            this.$fetch(api.getModuleUserList(), params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (_this.getAlltableDataSwitch) {
                        _this.totalNum = content.count;
                        const params = {
                            moduleid: _this.treeIndex[0].id,
                            pagesize: _this.pageSize,
                            pageindex: _this.pageIndex
                        };
                        _this.getAlltableDataSwitch = false;
                        _this.getModuleUser(params);
                    } else {
                        _this.tableData = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                code: item.code,
                                name: item.name
                            };
                        });
                    }
                    console.log('获取模块用户数据');
                }
            });
        },
        // 调取所有模块列表
        getModuleList () {
            const _this = this;
            this.$fetch(api.getModulemanager()).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.treeData = (content.res || []).map((item) => {
                        return {
                            title: item.name,
                            parentId: item.parentId,
                            id: item.id
                        };
                    });
                    if (_this.treeIndex.length === 1) {
                        _this.giveExpandTrueForTree(_this.treeData);
                    }
                    if (_this.treeIndex.length === 0) {
                        _this.tree(_this.treeData);
                    }
                    // this.tree(treeData);
                }
                console.log('获取成功');
            });
        },
        giveExpandTrueForTree (treeData) {
            this.$set(treeData.find(x => x.id === this.treeIndex[0].id), 'expand', true);
            const currentTreeParentId = treeData.find(x => x.id === this.treeIndex[0].id).parentId;
            if (currentTreeParentId === 0) {
                this.tree(this.treeData);
            };
            if (currentTreeParentId !== 0) {
                this.qerqqqe(treeData, currentTreeParentId);
            }
        },
        qerqqqe (treeData, currentTreeParentId) {
            // debugger
            const treeId = treeData.map(x => x.id);
            // const currentTreeParentId = treeData.find(x => x.id === this.treeIndex[0].id).parentId;
            if (treeId.includes(currentTreeParentId)) {
                this.$set(treeData.find(x => x.id === currentTreeParentId), 'expand', true);
            }
            const curTreeParentId = treeData.find(x => x.id === currentTreeParentId).parentId;
            if (curTreeParentId === 0) {
                this.tree(this.treeData);
            };
            if (curTreeParentId !== 0) {
                this.qerqqqe(treeData, curTreeParentId);
            }
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
                        console.log(data);
                    }
                }
                this.$set(data.find(x => x.id === i), 'children', children[0]);
            }
            this.treeData = Array.of(data[0]);
        }
    },
    mounted () {
        this.token = Cookies.get('token');
        this.getModuleList();
        // this.getModuleUser();
    }
};
</script>

<style scoped>

</style>
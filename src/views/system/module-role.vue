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
                            <!--<Col>-->
                                <!--<a @click="addRoleUser" style="margin-right: 10px;" class="newAddLowerColor"><Icon style="margin-right: 5px" type="plus" class="newAddLowerColor"></Icon>添加</a>-->
                                <!--<a @click="removeRole" class="newAddLowerColor"><Icon style="margin-right: 5px" type="minus" class="newAddLowerColor"></Icon>移除</a>-->
                                <Button  @click="addRoleUser" type="success">添加</Button>
                                <Button @click="removeRole" type="error">移除</Button>
                            <!--</Col>-->
                        </Row>
                        <Row class="margin-top-10">
                            <Table border ref="selection" @on-selection-change="selectRemoveRole" :columns="Rolecolumns" :data="tableData"></Table>
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
                        <Row style="margin-bottom: 20px">
                            <Col>
                                <Table border ref="selection" @on-selection-change="selectTableRole"  :height="300" :columns="Rolecolumns" :data="RoleData"></Table>
                            </Col>
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
            loading: false,
            warnShow: false,
            addEditShow: false,
            addEditData: '',
            warnMessage: '',
            isSureRemove: false,
            // 选择列表
            model1: '',
            value5: 2,
            treeIndex: '',
            SelectedRole: '',
            removeIndex: '',
            value6: '',
            moduleParams: {},
            newAddLowerErrorMsg: '',
            treeData: [],
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
                {
                    code: '123',
                    name: 'John'
                }
            ],
            RoleData: [
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
        getModuleFromIn () {
            // debugger
            if (this.treeIndex === '') {
                this.tableData = [];
                return;
            };
            const params = {
                moduleid: this.treeIndex[0].id
            };
            this.getModuleRoleList(params);
        },
        // 根据模块调取角色
        getModuleRoleList (params) {
            // debugger
            this.$fetch(api.getModuleList(), params).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableData = content.res;
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
                    // debugger
                    if (_this.treeIndex.length === 1) {
                        _this.giveExpandTrueForTree(_this.treeData);
                    }
                    if (_this.treeIndex.length === 0) {
                        _this.tree(_this.treeData);
                    }
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
        },
        // 调取所有角色列表
        getRoleList () {
            this.$fetch(api.getRoleListManager()).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.RoleData = (content.res || []).map(item => {
                        return {
                            code: item.code,
                            name: item.name,
                            id: item.id
                        };
                    });
                }
            });
        },
        //
        selectRemoveRole (params) {
            console.log(params);
            this.removeIndex = params;
        },
        // 已选择角色
        selectTableRole (params) {
            this.SelectedRole = params;
            console.log(params);
            console.log('1');
        },
        handleSelectAll (status) {
            this.$refs.selection.selectAll(status);
        },
        // 点击树
        handleTree (params) {
            // debugger
            if (params.length > 0) {
                this.treeIndex = params;
            }
            this.getModuleList();
            this.getModuleFromIn();
            console.log(this.treeIndex);
        },
        // 点击增加新的用户，提示或者添加
        addRoleUser () {
            // console.log('点击增加新的用户');
            if (this.treeIndex === '' || this.treeIndex[0].id === 1) {
                this.warnShow = true;
                this.warnMessage = '请选择父级结构';
            } else {
                this.addEditShow = true;
                // this.addEditData = '添加模块用户';
                this.addEditData = '添加模块角色';
                this.getRoleList(); // 获取所有角色
            }
        },
        // 删除用户
        removeRole () {
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
        // 提示框确认键盘
        onConfirmWarn () {
            console.log('提示确认');
            if (this.isSureRemove) {
                this.$post(api.moduleRemoveRole(this.treeIndex[0].id), this.removeIndex.map(x => x.id)).then((res) => {
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
        // 取消键
        newAddLowerCancel () {
            console.log('取消键');
            this.addEditShow = false;
        },
        // 保存
        submitAddSubordinate () {
            console.log('确认键');
            // if () {}
            if (this.SelectedRole.length > 0) {
                this.Loading = true;
                this.$post(api.moduleAddRole(this.treeIndex[0].id),
                    this.SelectedRole.map(x => x.id))
                    .then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            console.log('成功');
                            this.Loading = false;
                            this.getModuleFromIn();
                        }
                    });
            }
            this.addEditShow = false;
        }
    },
    mounted () {
        this.token = Cookies.get('token');
        this.getModuleList();
        this.getModuleFromIn();
    }
};
</script>

<style scoped>

</style>
<template>
    <div>
        <Card :bordered="false">
            <Row :gutter='16'>
                <Col span="4">
                    <Card>
                        <Tree :data="treeData" @on-select-change="handleTree"></Tree>
                    </Card>
                </Col>
                <Col span="20">
                    <Row class="buttonBottom">
                        <Button  @click="addNewMaterial" type="success">新增</Button>
                    </Row>
                    <Row class="margin-top-10">
                        <Table border :height="tableHeight" size="small" :columns="tableColumns" :data="tableData"></Table>
                    </Row>
                </Col>
            </Row>
        </Card>
        <Modal
            v-model="addEditShow"
            :title="addEditData"
            :mask-closable="false">
            <Form :label-width="130" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                <Row>
                    <Col span="20">
                        <FormItem label="上级分类：" class="formItemMargin" prop="parent">
                            <span v-model="newFormValidate.path">{{ newFormValidate.path }}</span>
                        </FormItem>
                        <FormItem label="分类编码：" class="formItemMargin" prop="code">
                            <Input v-model="newFormValidate.code" placeholder="请输入编码"></Input>
                        </FormItem>
                        <FormItem label="分类名称：" class="formItemMargin" prop="title">
                            <Input v-model="newFormValidate.title" placeholder="请输入名称"></Input>
                        </FormItem>
                        <FormItem label="物料属性：" class="formItemMargin" prop="productProperty">
                            <Col>
                                <Select @on-change="onChange" v-model="newFormValidate.productPropertyItem" filterable multiple placeholder="请选择物料属性">
                                    <Option v-for="productProperty in productPropertyItem" :value="productProperty.id" :key="productProperty.id">{{ productProperty.name }}</Option>
                                </Select>
                            </Col>
                        </FormItem>
                        <FormItem label="是否配件：" class="formItemMargin" prop="isParts">
                            <Checkbox v-model="newFormValidate.isParts">是否配件</Checkbox>
                        </FormItem>
                        <FormItem label="批号管理：" class="formItemMargin" prop="enableBatch">
                            <Checkbox v-model="newFormValidate.enableBatch">启用</Checkbox>
                        </FormItem>
                    </Col>
                </Row>
                <about-time
                        v-if="isEdit"
                        :createTime="createTime"
                        :createName="createName"
                        :reviseTime="updateTime"
                        :reviseName="updateName"
                >
                </about-time>
            </Form>
            <modal-button
                slot="footer"
                :WarnMsg="newAddLowerErrorMsg"
                :loading="loading"
                @cancel="newAddLowerCancel"
                @submit="submitAddSubordinate"
        >
        </modal-button>
        </Modal>
        <!--<Modal-->
                <!--v-model="warnShow"-->
                <!--title="提示">-->
            <!--<p>{{ warnMessage }}</p>-->
            <!--<module-button-->
                    <!--slot="footer"-->
                    <!--@submit="onConfirmWarn"-->
                    <!--@cancel="onCancelWarn"-->
            <!--&gt;</module-button>-->
            <!--&lt;!&ndash;<div slot="footer" class="modalFooterStyle">&ndash;&gt;-->
            <!--&lt;!&ndash;<span class="editFormErrorStyle"></span>&ndash;&gt;-->
            <!--&lt;!&ndash;<div>&ndash;&gt;-->
            <!--&lt;!&ndash;<Button type="success" @click="onConfirmWarn">确认</Button>&ndash;&gt;-->
            <!--&lt;!&ndash;<Button class="cancelButton" @click="onCancelWarn">取消</Button>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--</Modal>-->
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
    import AboutTime from '../public/AboutTime';
    import modalButton from '../public/modalButton';
    import deleteWarning from '../public/deleteWarning';
    import publicJs from '../public/public-js/publiceJs';
    import api from '../../ajax/api';
    export default {
        name: 'kate',
        components: {
            AboutTime,
            deleteWarning,
            modalButton
        },
        data () {
            return {
                tableHeight: document.documentElement.clientHeight - 200,
                createTime: '',
                createName: '',
                updateTime: '',
                updateName: '',
                loading: false,
                warnShow: false,
                warnMessage: '',
                deleteLoading: false,
                addEditShow: false,
                addEditData: '',
                productPropertyItem: [],
                newAddLowerErrorMsg: '',
                treeIndex: [],
                isSureDelete: '',
                // 判断是添加还是编辑
                isAdd: false,
                isEdit: false,
                // 判断parentid
                paId: {},
                // 编辑的数据
                editRow: '',
                // 获取删除数据， 是否确定删除
                deleteRow: '',
                isSwitch: true,
                treeData: [],
                tableColumns: [
                    {
                        title: '分类编码',
                        sortable: true,
                        width: 150,
                        key: 'code'
                    },
                    {
                        title: '分类名称',
                        sortable: true,
                        align: 'center',
                        width: 150,
                        key: 'title'
                    },
                    {
                        title: '上级分类',
                        align: 'center',
                        sortable: true,
                        width: 150,
                        key: 'parent'
                    },
                    {
                        title: '物料属性',
                        sortable: true,
                        key: 'productProperty'
                    },
                    {
                        title: '是否配件',
                        key: 'isParts',
                        sortable: true,
                        width: 110,
                        align: 'center'
                    },
                    {
                        title: '批号启用',
                        key: 'enableBatch',
                        width: 110,
                        sortable: true,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        width: 180,
                        align: 'center',
                        key: 'operation',
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
                                            console.log('编辑');
                                            this.addEditShow = true;
                                            this.isEdit = true;
                                            this.addEditData = '编辑物料类别';
                                            this.editRow = params.row;
                                            _this.categoryIds = [];
                                            _this.getPathNameFrom(params.row.parentId);
                                            _this.getProductCategotyDetail(params.row.id);
                                            // debugger
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        // type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            console.log('删除');
                                            this.deleteRow = params.row.id;
                                            this.warnShow = true;
                                            this.warnMessage = '确定要删除吗';
                                            // 是否确定删除
                                            this.isSureDelete = true;
                                            console.log('删除');
                                            console.log(this.deleteRow);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [
                    {
                        code: '001',
                        title: 'deep',
                        parent: '',
                        productProperty: '',
                        isParts: 1,
                        enableBatch: ''
                    }
                ],
                newFormValidateRules: {
                    code: [
                        {required: true, message: 'The code cannot be empty', trigger: 'blur'}
                    ],
                    title: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ]
                },
                newFormValidate: {
                    parent: '',
                    parentId: 0,
                    code: '',
                    title: '',
                    productPropertyItem: [],
                    isParts: true,
                    enableBatch: true
                },
                categoryIds: [],
                treetreeData: [],
                treeOrderList: true,
                parentId: '',
                parentName: ''
            };
        },
        methods: {
            getProductCategotyDetail (id) {
                const _this = this;
                this.$fetch('product/category/detail/' + id).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.newFormValidate.parent = _this.tableData.find(x => x.parentId === content.res.parentId).parent;
                        this.newFormValidate.parentId = content.res.parentId;
                        this.newFormValidate.path = _this.getLineCategoryName(_this.categoryIds);
                        this.newFormValidate.code = content.res.code;
                        this.newFormValidate.enableBatch = content.res.enableBatch;
                        this.newFormValidate.isParts = content.res.isParts;
                        this.newFormValidate.title = content.res.name;
                        this.newFormValidate.id = content.res.id;
                        this.newFormValidate.productPropertyItem = _this.getGroup(content.res.productPropertyItemIds) || []; // 这里需要转化
                        // console.log(this.newFormValidate.productProperty);
                        this.createTime = content.res.createTime;
                        this.createName = content.res.createName;
                        this.updateTime = content.res.updateTime;
                        this.updateName = content.res.updateName;
                        // debugger
                    }
                });
            },
            getPathNameFrom (id) {
                // debugger
                if (id === 0) {
                    return this.categoryIds.reverse();
                }
                if (this.treetreeData.find(x => x.id === id)) {
                    this.getPathName(id);
                }
            },
            getPathName (id) {
                // debugger
                this.categoryIds.push(this.treetreeData.find(x => x.id === id).name);
                this.getPathNameFrom(this.treetreeData.find(x => x.id === id).parentId);
            },
            getGroup (darta) {
                const obj = [];
                const arr = darta.split(',');
                for (let k of arr) {
                    obj.push(parseInt(k));
                }
                return obj;
            },
            // 缺少编辑是物料的转换以及parentid的的展示时候的转换
            // 获取物料属性数据
            getAttrList () {
                this.$fetch(api.getAttrList()).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.productPropertyItem = content.res.map(item => {
                            return {
                                id: item.id,
                                name: item.name
                            };
                        });
                    }
                });
            },
            getCategoryFromIn () {
                // 获取tree列表
                const params = {};
                this.isSwitch = true;
                this.getCategoryList(params);
            },
            // 获取物料类别的数据
            getCategoryList (params) {
                const _this = this;
                // console.log('获取物料类别的数据');
                this.$fetch(api.getCryList(), params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        if (_this.isSwitch) {
                            this.treetreeData = content.res;
                            _this.treeData = content.res.map(item => {
                                return {
                                    title: item.code + ' ' + item.name,
                                    id: item.id,
                                    parentId: item.parentId
                                };
                            });
                            // 如果点击树到达这里，应该获取点击的id进行expand=true
                            if (_this.treeIndex.length !== 0) {
                                this.$set(_this.treeData.find(x => x.id === _this.treeIndex[0].id), 'expand', true);
                            }
                            // 默认加载的时候排列一次
                            if (_this.treeIndex.length === 1) {
                                _this.giveExpandTrueForTree(_this.treeData);
                            }
                            _this.tree(_this.treeData);
                            _this.isSwitch = false;
                            const params = {parentid: _this.treeIndex.length === 0 ? 1 : this.treeIndex[0].id};
                            this.getCategoryList(params);
                            // }
                        } else {
                            _this.tableData = content.res.map(item => {
                                return {
                                    title: item.name,
                                    id: item.id,
                                    isParts: item.isParts === true ? '是' : '否',
                                    enableBatch: item.enableBatch === true ? '是' : '否',
                                    code: item.code,
                                    parentId: item.parentId,
                                    parent: _this.treetreeData.find(x => x.id === item.parentId).name,
                                    path: item.path,
                                    state: item.state,
                                    // 这里不应该是数组，用一个对象就可以
                                    productProperty: item.productPropertyItemNames,
                                    productPropertyId: item.productPropertyItemIds,
                                    createId: item.createId,
                                    createName: item.createName,
                                    updateId: item.updateId,
                                    updateName: item.updateName
                                };
                            });
                        }
                    }
                });
            },
            giveExpandTrueForTree (treeData) {
                this.$set(treeData.find(x => x.id === this.treeIndex[0].id), 'expand', true);
                const currentTreeParentId = treeData.find(x => x.id === this.treeIndex[0].id).parentId;
                if (currentTreeParentId !== 0) {
                    this.qerqqqe(treeData, currentTreeParentId);
                }
            },
            qerqqqe (treeData, currentTreeParentId) {
                const treeId = treeData.map(x => x.id);
                // const currentTreeParentId = treeData.find(x => x.id === this.treeIndex[0].id).parentId;
                if (treeId.includes(currentTreeParentId)) {
                    this.$set(treeData.find(x => x.id === currentTreeParentId), 'expand', true);
                }
                const curTreeParentId = treeData.find(x => x.id === currentTreeParentId).parentId;
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
                        }
                    }
                    this.$set(data.find(x => x.id === i), 'children', children[0]);
                }
                // this.data1 = Array.of(this.data[0]);
                this.treeData = Array.of(data.find(x => x.parentId === 0));
            },
            onChange (data) {
                // console.log(data);
            },
            handleTree (params) {
                if (params.length === 1) {
                    this.treeIndex = params;
                }
                // console.log(this.treeIndex);
                this.parentName = params[0].title;
                this.parentId = params[0].id;
                this.categoryIds = [];
                this.newFormValidate.parentModel = [];
                // debugger;
                this.getPathNameFrom(params[0].id);
                // this.tree(this.treeData);
                this.getCategoryFromIn();
            },
            addNewMaterial () {
                // console.log('xinzeng');
                if (this.treeIndex.length === 1) {
                    this.addEditShow = true;
                    this.isAdd = true;
                    this.addEditData = '新增物料类别';
                    this.newFormValidate.code = '';
                    this.newFormValidate.path = this.getLineCategoryName(this.categoryIds);
                    this.newFormValidate.parent = this.parentName;
                    this.newFormValidate.parentId = this.parentId;
                    this.newFormValidate.enableBatch = true;
                    this.newFormValidate.isParts = true;
                    this.newFormValidate.title = '';
                    this.newFormValidate.id = '';
                    this.newFormValidate.productPropertyItem = [];
                } else {
                    // this.warnShow = true;
                    this.warnShow = true;
                    this.warnMessage = '请选择父级结构';
                }
            },
            getLineCategoryName (Names) {
                // debugger
                let result = '';
                if (Names.length === 0) {
                    result = '';
                    return result;
                }
                for (let k of Names) {
                    result = result.concat(k + ' / ');
                }
                return result = result.slice(0, result.length - 2);
            },
            onCancelWarn () {
                this.warnShow = false;
                this.deleteLoading = false;
            },
            onConfirmWarn () {
                // console.log('确认警告');
                this.warnShow = false;
                if (this.isSureDelete) {
                    this.deleteLoading = true;
                    this.$post(api.cryDelete(this.deleteRow)
                    ).then((res) => {
                        if (res.data.status === 200) {
                            // 重新获取所有部门信息渲染页面
                            // console.log('确定删除');
                            this.watch = true;
                            this.$Message.success('删除成功');
                            this.deleteLoading = false;
                            this.isSwitch = true;
                            this.getCategoryFromIn();
                            this.isSureDelete = false;
                        };
                    });
                }
            },
            newAddLowerCancel () {
                // console.log('框取消');
                this.addEditShow = false;
                this.loading = false;
            },
            submitAddSubordinate () {
                const _this = this;
                if (!this.newFormValidate.code) {
                    this.newAddLowerErrorMsg = '编码不能为空';
                    return;
                }
                if (!this.newFormValidate.title) {
                    this.newAddLowerErrorMsg = '名称不能为空';
                    return;
                }
                this.params = {
                    id: this.newFormValidate.id,
                    parentId: this.newFormValidate.parentId,
                    code: this.newFormValidate.code.toLocaleUpperCase(),
                    name: this.newFormValidate.title,
                    productPropertyItemIds: _this.newFormValidate.productPropertyItem.toString(), // id  2,3
                    productPropertyItemNames: _this.getName(_this.newFormValidate.productPropertyItem),
                    isParts: this.newFormValidate.isParts,
                    enableBatch: this.newFormValidate.enableBatch
                };
                console.log(this.params);
                _this.loading = true;
                _this.$post(
                    api.getCrySave(), _this.params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.loading = false;
                        this.isSwitch = true;
                        this.getCategoryList({});
                        console.log('编辑成功');
                        this.$Message.success('保存成功');
                    }
                });
                this.addEditShow = false;
                _this.isAdd = false;
                _this.isEdit = false;
            },
            getName (data) {
                let obj = [];
                for (let k of data) {
                    if (this.productPropertyItem.map(x => x.id).includes(k)) {
                        obj.push(this.productPropertyItem.find(x => x.id === k));
                    }
                }
                let pp = obj.map(x => x.name).toString();
                return pp;
            }
        },
        mounted () {
            // this.token = Cookies.get('token');
            this.getAttrList();
            this.getCategoryFromIn();
            window.onresize = () => {
                this.tableHeight = publicJs.compClientHeight(200);
            };
        }
    };
</script>

<style scoped>

</style>

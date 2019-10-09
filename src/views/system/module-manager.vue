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
                        <Row class="buttonBottom">
                            <Button  @click="addNewModule" type="success">新增</Button>
                        </Row>
                        <Row class="margin-top-10">
                            <Table :height="tableHeight" size="small" border ref="selection" :columns="columns4" :data="tableData"></Table>
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
                            <FormItem label="模块编码：" class="formItemMargin" prop="code">
                                <Input v-model="newFormValidate.code" placeholder="请输入模块编码"></Input>
                            </FormItem>
                            <FormItem label="模块名称：" class="formItemMargin" prop="name">
                                <Input v-model="newFormValidate.name" placeholder="请输入模块名称"></Input>
                            </FormItem>
                            <FormItem label="上级模块：" class="formItemMargin" prop="parentModel">
                                <Cascader @on-change="changeModule" v-model="newFormValidate.parentModel" :data="moduleData" change-on-select></Cascader>
                            </FormItem>
                            <FormItem label="Url地址：" class="formItemMargin" prop="navUrl">
                                <Input v-model="newFormValidate.navUrl" placeholder="请输入Url地址"></Input>
                            </FormItem>
                            <FormItem label="图标样式：" class="formItemMargin" prop="iconUrl">
                                <Row>
                                    <Col :span="4">
                                        <div data-v-394040b0="" class="icons-item"><i data-v-394040b0="" :class="'ivu-icon ivu-icon-' + newFormValidate.iconUrl"></i>
                                        </div>
                                    </Col>
                                    <Col :span="6">
                                        <Button @click="selectIcon(newFormValidate.iconUrl)" type="success">选择</Button>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="sortNum" label="排序：">
                                <InputNumber :min="1" v-model="newFormValidate.sortNum" size="large"></InputNumber>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="state" label="是否显示：">
                                <Checkbox v-model="newFormValidate.state">显示</Checkbox>
                            </FormItem>
                            <FormItem class="formItemMargin" prop="remark" label="备注：">
                                <Input v-model="newFormValidate.remark" value="'remark'" type="textarea" :rows="2" placeholder="..."></Input>
                            </FormItem>
                        </Col>
                    </Row>
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
            <Modal
                    v-model="iconShow"
                    :title="'请选择图标'"
                    :mask-closable="false">
                <Row>
                    <Col>
                        <w-icon-list
                                v-on:value="getIconName" ></w-icon-list>
                    </Col>
                    <Icon type="ios-arrow-down" />
                </Row>
                <div slot="footer" class="modalFooterStyle">
                    <span class="editFormErrorStyle" style="display: inline-block;height: 30px;line-height: 30px; color:#495060; vertical-align: middle">已选择&nbsp;
                        <!--<i data-v-394040b0="" style="font-size: 20px; line-height: 30px; vertical-align: middle" :class="'ivu-icon ivu-icon-' + iconMsg"></i>-->
                        <Icon :type="iconMsg" :size="20"></Icon>
                    </span>
                    <div>
                        <Button type="success" @click="submitIcon">确认</Button>
                        <Button class="cancelButton" @click="iconCancel">取消</Button>
                    </div>
                </div>
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
    import WIconList from './WIconList';
    import modalButton from '../public/modalButton';
    import deleteWarning from '../public/deleteWarning';
    import api from '../../ajax/api';
    import publicJs from '../public/public-js/publiceJs';
    export default {
        components: {
            AboutTime,
            WIconList,
            deleteWarning,
            modalButton
        },
        data () {
            return {
                tableHeight: document.documentElement.clientHeight - 236,
                selectedIcon: '',
                parentModel: [],
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    title: 'js',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            title: 'w',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                    title: 'q'
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            title: 's',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    title: 'z',
                                    label: '拙政园'
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                    title: 'd'
                                }
                            ]
                        }
                    ]
                }],
                moduleData: [],
                cascadeData: [],
                deleteLoading: false,
                powerModule: false,
                assemblyModal: false,
                continue: false,
                iconMsg: '',
                userIconMsg: '',
                loading: false,
                warnShow: false,
                addEditShow: false,
                addEditData: '',
                warnMessage: '',
                value5: 2,
                remark: '',
                value6: '',
                deleteRow: '',
                // 获取树点击的数据
                treeIndex: [],
                // 显示提示的开关
                isWarnShow: false,
                newAddLowerErrorMsg: '',
                // 图标是否显示
                iconShow: false,
                isUpdateTreeData: true,
                isAddSwitch: false,
                isEditSwitch: false,
                dataRow: '',
                isSureDelete: false,
                treeData: [
                    {
                        title: '根目录',
                        expand: true
                    }
                ],
                parentName: '根目录',
                moduleIds: [],
                newFormValidate: {
                    category: '',
                    code: '',
                    parentName: '',
                    parentModel: [],
                    name: '',
                    navUrl: '',
                    iconUrl: 'ionic',
                    sortNum: 0,
                    state: true,
                    remark: ''
                },
                newFormValidateRules: {
                    name: [
                        {required: true, trigger: 'blur'}
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
                        width: 150,
                        sortable: true,
                        key: 'code'
                    },
                    {
                        title: '名称',
                        sortable: true,
                        width: 150,
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '状态',
                        sortable: true,
                        width: 150,
                        align: 'center',
                        key: 'state'
                    },
                    {
                        title: '图标',
                        sortable: true,
                        key: 'iconUrl',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: params.row.iconUrl,
                                        size: 20
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '排序',
                        key: 'sortNum',
                        sortable: true,
                        align: 'center',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Input', {
                                    props: {
                                        type: 'text',
                                        value: this.tableData[params.index].sortNum
                                    },
                                    style: {
                                        width: '50px',
                                        textAlign: 'center'
                                        // marginRight: '5px'
                                    },
                                    on: {
                                        'on-blur': (val) => {
                                            console.log(val.target.value);
                                            // this.dataRow = params.row;
                                            const param = {
                                                id: params.row.id,
                                                code: params.row.code,
                                                name: params.row.name,
                                                parentId: params.row.parentId,
                                                navUrl: params.row.navUrl,
                                                iconUrl: params.row.iconUrl,
                                                sortNum: val.target.value,
                                                remark: params.row.remark,
                                                state: params.row.state === '显示' ? 1 : 0
                                            };
                                            // debugger
                                            this.$post(api.SaveModulemanager(), param).then((res) => {
                                                // debugger
                                                let content = res.data;
                                                if (content.status === 200) {
                                                    this.isUpdateTreeData = true;
                                                    this.getModuleList('');
                                                    console.log('编辑成功');
                                                    this.$Message.success('保存成功');
                                                }
                                            });
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '备注',
                        key: 'remark'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
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
                                            this.newAddLowerErrorMsg = '';
                                            this.isEditSwitch = true;
                                            this.addEditData = '编辑';
                                            // debugger
                                            this.moduleIds = [];
                                            this.getModuleIdsFrom(params.row.parentId);
                                            this.getModuleDetail(params.row.id);
                                            console.log(params.index);
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
                                            this.deleteRow = params.row.id;
                                            this.warnShow = true;
                                            this.warnMessage = '确定要删除吗';
                                            // 是否确定删除
                                            this.isSureDelete = true;
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
                        name: 'John',
                        state: true,
                        sortNum: 12,
                        remark: '备注'
                    }
                ],
                curParentId: ''
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
            getIconName (value) {
                // console.log(value);
                this.iconMsg = value;
            },
            iconCancel () {
                this.iconShow = false;
                // console.log('取消');
            },
            submitIcon () {
                this.iconShow = false;
                this.newFormValidate.iconUrl = this.iconMsg;
                // console.log('确定');
            },
            handleTree (params) {
                // console.log(params)
                if (params.length === 1) {
                    this.treeIndex = params;
                    this.parentName = params[0].title;
                    this.curParentId = params[0].id;
                }
                // debugger
                this.moduleIds = [];
                this.newFormValidate.parentModel = [];
                this.getModuleIds(params[0].id);
                this.getModuleListFrom();
                // debugger
                // console.log('树状结构');
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
            selectIcon (val) {
                this.iconMsg = val;
                this.iconShow = true;
            },
            getModuleDetail (id) {
                const _this = this;
                this.$fetch('module/detail/' + id).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        console.log(_this.tableData);
                        // debugger
                        this.addEditShow = true;
                        this.newFormValidate.id = content.res.id;
                        this.newFormValidate.code = content.res.code;
                        this.newFormValidate.name = content.res.name;
                        this.curParentId = content.res.parentId;
                        // this.newFormValidate.parentName = _this.tableData.find(x => x.parentId === content.res.parentId).parentName;
                        this.newFormValidate.parentModel = _this.moduleIds;
                        this.newFormValidate.navUrl = content.res.navUrl;
                        this.newFormValidate.iconUrl = content.res.iconUrl;
                        this.newFormValidate.sortNum = content.res.sortNum;
                        this.newFormValidate.remark = content.res.remark;
                        this.newFormValidate.state = content.res.state === 1;
                        // console.log('获取详情');
                        // this.moduleId = content.res.parentId;
                        // debugger
                    }
                }).catch(function (error) {
                    this.$Modal.error({
                        title: '网络错误',
                        content: error
                    });
                });
            },
            getModuleIdsFrom (id) {
                // debugger
                if (id === 1) {
                    return this.moduleIds.reverse();
                }
                if (this.cascadeData.find(x => x.id === id)) {
                    this.getModuleIds(id);
                }
            },
            getModuleIds (id) {
                this.moduleIds.push(id);
                this.getModuleIdsFrom(this.cascadeData.find(x => x.id === id).parentId);
            },
            addNewModule () {
                // debugger
                this.newAddLowerErrorMsg = '';
                console.log('增加新的表单');
                this.addEditData = '添加'; // 新增框title
                // 新增数据清空
                this.newFormValidate.code = '';
                this.newFormValidate.name = '';
                this.newFormValidate.parentModel = this.moduleIds;
                // this.newFormValidate.parentId = this.treeIndex[0].id;
                // this.newFormValidate.parentName = this.treeIndex[0].title;
                this.newFormValidate.navUrl = '';
                this.newFormValidate.iconUrl = 'ionic';
                this.newFormValidate.sortNum = 0;
                this.newFormValidate.state = true;
                this.newFormValidate.remark = '';
                this.newFormValidate.id = '';
                this.addEditShow = true; // 显示新增框
                this.isAddSwitch = true;
            },
            onCancelWarn () {
                this.warnShow = false;
                this.deleteLoading = false;
            },
            onConfirmWarn () {
                console.log('提示确认');
                if (this.isSureDelete) {
                    this.deleteLoading = true;
                    this.$post(api.removeModule(this.deleteRow)).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            // console.log('移除成功');
                            this.isUpdateTreeData = true;
                            this.deleteLoading = false;
                            this.warnShow = false;
                            this.$Message.success('移除成功');
                            this.getModuleListFrom();
                        };
                    });
                    this.isSureDelete = false;
                }
                // this.warnShow = false;
            },
            newAddLowerCancel () {
                console.log('取消键');
                // this.warnShow = false;
                this.addEditShow = false;
            },
            submitAddSubordinate () {
                console.log('确认键');
                // 保存数据
                const _this = this;
                if (this.newFormValidate.name === '') {
                    this.newAddLowerErrorMsg = '模块名称不能为空';
                    return false;
                }
                // debugger
                this.loading = true;
                this.$post(api.SaveModulemanager(), {
                    id: this.newFormValidate.id,
                    name: this.newFormValidate.name,
                    code: this.newFormValidate.code,
                    state: this.newFormValidate.state === true ? 1 : 0,
                    sortNum: this.newFormValidate.sortNum,
                    remark: this.newFormValidate.remark,
                    iconUrl: this.newFormValidate.iconUrl,
                    navUrl: this.newFormValidate.navUrl,
                    parentId: _this.curParentId === undefined || _this.curParentId === '' ? 1 : _this.curParentId
                }).then((res) => {
                    // debugger
                    let content = res.data;
                    if (content.status === 200) {
                        this.loading = false;
                        this.addEditShow = false;
                        this.isUpdateTreeData = true;
                        this.$Message.success('保存成功');
                        this.getModuleListFrom();
                        console.log('编辑成功');
                    }
                });
            },
            // 树状结构的展示
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
                    if (children.length !== 0) {
                        this.$set(data.find(x => x.id === i), 'children', children[0]);
                    }
                }
                // debugger
                this.treeData = Array.of(data.find(x => x.parentId === 0));
                this.moduleData = data.find(x => x.parentId === 0).children;
                // debugger
            },
            getModuleListFrom () {
                this.isUpdateTreeData = true;
                // var paramsData = '';
                this.getModuleList('');
            },
            // 获取模块列表默认id={}
            getModuleList (params) {
                const _this = this;
                // debugger
                this.$fetch('module/list?parentid=' + params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        console.log('链接成功');
                        // debugger
                        if (this.isUpdateTreeData === false) {
                            _this.tableData = content.res.map(item => {
                                return {
                                    id: item.id,
                                    name: item.name,
                                    code: item.code,
                                    state: item.state === 1 ? '显示' : '隐藏',
                                    sortNum: item.sortNum,
                                    remark: item.remark,
                                    iconUrl: item.iconUrl,
                                    navUrl: item.navUrl,
                                    parentId: item.parentId,
                                    parentName: this.parentName
                                };
                            });
                        }
                        if (this.isUpdateTreeData) {
                            _this.cascadeData = content.res.map(item => {
                                return {
                                    id: item.id,
                                    title: item.name,
                                    label: item.name,
                                    value: item.id,
                                    parentId: item.parentId
                                };
                            });
                            if (_this.treeIndex.length === 1) {
                                _this.giveExpandTrueForTree(_this.cascadeData);
                            }
                            _this.tree(_this.cascadeData);
                            _this.isUpdateTreeData = false;
                            var paramsData = '';
                            if (_this.treeIndex.length === 0) {
                                paramsData = 1;
                            }
                            if (_this.treeIndex.length === 1) {
                                paramsData = _this.treeIndex[0].id;
                            }
                            _this.getModuleList(paramsData);
                        }
                    }
                });
            },
            changeModule (val) {
                this.curParentId = val.reverse()[0];
            }
        },
        mounted () {
            this.getModuleListFrom();
            window.onresize = () => {
                this.tableHeight = publicJs.compClientHeight(236);
            };
        }
    };
</script>

<style scoped>
    .newAddLowerColor{
        margin: 5px ;
    }
    .icons-item{
        display: inline-block;
        width: 10%;
        padding: 0 10px
    }
    .icons-item i{
        font-size: 32px;
    }
</style>

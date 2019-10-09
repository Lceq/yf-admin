import publicJs from '../../../libs/common';
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import {auditStateList} from '../../../libs/utilState';
import otherMessage from '../../components/otherMessage';
import xwValidate from '@/libs/xwValidate';
export default {
    components: {
        modal,
        otherMessage,
        deleteWarning
    },
    data () {
        return {
            // 审核
            auditDisabled: false,
            curStockTypeId: '',
            stockTypeList: [],
            // 树状结构的平级数据。用户获取父级的name
            basicTreeData: [],
            // 通过这个变量解决 取消树状的点击，val.length===0的情况
            handleTreeVal: [],
            // 是否获取树状结构数据, 如果是的话让parentId为''，否则为当前curParentId
            isTreeData: false,
            // 树状结构的数据
            treeData: [],
            AllMaterialCaterialData: [],
            // table表格属性
            curMaterialCategoryId: '',
            isCouldSave: true,
            tableHeight: document.documentElement.clientHeight - 200,
            tableColumns: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '分类编码',
                    sortable: true,
                    minWidth: 110,
                    fixed: 'left',
                    key: 'code'
                },
                {
                    title: '分类名称',
                    fixed: 'left',
                    sortable: true,
                    align: 'left',
                    minWidth: 110,
                    key: 'name',
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                'click': () => {
                                    this.isShowUserMessage = true;
                                    this.isCouldSave = params.row.auditState !== 3;
                                    this.curMaterialCategoryId = params.row.id;
                                    this.getProductCategotyDetail();
                                }
                            }
                        }, params.row.name);
                    }
                },
                {
                    title: '上级分类',
                    align: 'left',
                    sortable: true,
                    minWidth: 110,
                    key: 'parentName'
                },
                {
                    title: '物料属性',
                    sortable: true,
                    align: 'left',
                    minWidth: 350,
                    key: 'productPropertyItemNames'
                },
                {
                    title: '存货类型',
                    sortable: true,
                    minWidth: 110,
                    align: 'center',
                    key: 'typeName'
                },
                {
                    title: '是否配件',
                    key: 'isParts',
                    sortable: true,
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '数据状态',
                    key: 'auditStateMean',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '批号启用',
                    key: 'enableBatch',
                    minWidth: 110,
                    sortable: true,
                    align: 'center'
                }
            ],
            tableData: [],
            // 当前parentId，默认为1
            curParentId: 0,
            curId: '',
            // modal的属性
            categoryTitle: '',
            categoryShow: false,
            categoryLoading: false,
            categoryMsg: '',
            newFormValidate: {
                code: '',
                name: '',
                stockTypeId: ''
            },
            newFormValidateRules: {
                code: [
                    {required: true, validator: xwValidate.code, trigger: 'change'}
                ],
                name: [
                    {required: true, validator: xwValidate.input, trigger: 'blur'}
                ],
                stockTypeId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            stockTypeId: '',
            // 物料属性
            productProperty: [],
            // 对上级元素进行处理
            parentName: '',
            // 物料属性
            productPropertyItem: [],
            productPropertyItemValue: [],
            // 删除
            warnShow: false,
            warnMessage: '',
            deleteLoading: false,
            // 删除的id
            deleteRow: '',
            // 辅助
            curProductCategoryData: [],
            curProductCategoryIds: [],
            selectProductCategoryData: [],
            // curProductCategoryData: [],
            // 文件下方是否包含已经审核文件
            isHaveAudit: false,
            haveSelectData: [],
            // 人物信息
            isShowUserMessage: false,
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            auditName: '',
            auditTime: '',
            cityList: [
                {
                    value: 'New York',
                    label: 'New York'
                },
                {
                    value: 'London',
                    label: 'London'
                },
                {
                    value: 'Sydney',
                    label: 'Sydney'
                },
                {
                    value: 'Ottawa',
                    label: 'Ottawa'
                },
                {
                    value: 'Paris',
                    label: 'Paris'
                },
                {
                    value: 'Canberra',
                    label: 'Canberra'
                }
            ],
            model11: '',
            productPropertyItemNames: '',
            model12: []
        };
    },
    methods: {
        // 选中数据
        changeProductCategory (val) {
            this.curProductCategoryIds = val.map(x => x.id);
            this.selectProductCategoryData = val;
            if (val.length === 0) {
                this.curProductCategoryData = val;
            } else {
                this.curProductCategoryData = val;
                this.selectProductCategory(val);
            }
        },
        selectProductCategory (val) {
            for (let i of val) {
                if (this.basicTreeData.find(x => x.parentId === i.id) !== undefined) {
                    let items = this.basicTreeData.filter(x => x.parentId === i.id);
                    this.curProductCategoryData = this.curProductCategoryData.concat(items);
                    this.selectProductCategory(items);
                }
            }
        },
        // 审核
        auditMaterialType () {
            if (this.curProductCategoryIds.length === 0) {
                return false;
            }
            this.$api.category.productCategoryApprove(this.curProductCategoryIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.isTreeData = true;
                    this.getCategoryList();
                    this.$Message.success({
                        top: 400,
                        duration: 3,
                        content: '审核成功'
                    });
                }
            });
        },
        // 反审核
        unAuditMaterialType () {
            if (this.curProductCategoryIds.length === 0) {
                return false;
            }
            if (this.selectProductCategoryData.find(x => x.isQuote === true)) {
                let name = this.selectProductCategoryData.find(x => x.isQuote === true).name;
                this.$Modal.warning({
                    title: '提示',
                    // content: '<p>存在已引用的数据，不能进行删除!</p>'
                    content: '<span>物料分类</span>' + name + '<span>已引用，不能进行反审核!</span>'
                });
                return false;
            }
            this.$api.category.productCategoryUnApprove(this.curProductCategoryIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.status === 200) {
                        this.isTreeData = true;
                        this.getCategoryList();
                        this.$Message.success({
                            top: 300,
                            duration: 5,
                            content: '撤销审核成功'
                        });
                    }
                }
            });
        },
        // 删除
        deleteMaterialType () {
            // console.log(this.curProductCategoryData);
            const _this = this;
            if (this.curProductCategoryData.length === 0) {
                return false;
            } else if (_this.curProductCategoryData.find(x => x.isQuote === true) !== undefined) {
                let name = _this.curProductCategoryData.find(x => x.isQuote === true).name;
                _this.$Modal.warning({
                    title: '提示',
                    content: '<span>物料分类</span>' + name + '<span>已引用，不能进行删除!</span>'
                });
                return false;
            } else if (_this.curProductCategoryData.find(x => x.auditState === 3) !== undefined) {
                _this.$Modal.warning({
                    title: '提示',
                    content: '<p>存在已审核的数据，不能进行删除!</p>'
                });
                return false;
            } else {
                this.warnShow = true;
                this.warnMessage = '确定要删除吗？';
            }
        },
        // 搜索
        searchMaterialType () {
            this.getCategoryList();
        },
        // 获取物料属性数据
        getAttrList () {
            this.$api.attr.getProductPropertyItemList().then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.productProperty = content.res.map(x => {
                        return x;
                    });
                }
            });
        },
        // 点击树状结构
        handleTree (val) {
            // 这个逻辑是点击获取这个下面的数据，再次点击就是取消，然后获取全部下面的数据，逻辑有点不好
            // if (val.length === 0) {
            //     this.curParentId = 1;
            // } else {
            //     this.basicTreeData.filter(x => x.parentId === val[0].parentId).map(item => {
            //         item.expand = false;
            //         return item;
            //     });
            //     this.basicTreeData.find(x => x.id === val[0].id).expand = true;
            //     this.curParentId = val[0].id;
            // }
            // 点击取消无效
            if (val.length === 1) {
                this.handleTreeVal = val;
            }
            // debugger
            if (val.length === 0) {
                this.basicTreeData.filter(x => x.parentId === this.curParentId).map(item => {
                    item.expand = false;
                    return item;
                });
                this.basicTreeData.find(x => x.id === this.curId).expand = false;
                this.curParentId = 0;
                this.curId = this.basicTreeData.find(x => x.parentId === this.curParentId).id;
            } else {
                this.basicTreeData.filter(x => x.parentId === this.handleTreeVal[0].parentId).map(item => {
                    item.expand = false;
                    return item;
                });
                this.basicTreeData.find(x => x.id === this.handleTreeVal[0].id).expand = true;
                this.curParentId = this.handleTreeVal[0].parentId;
                this.curId = this.handleTreeVal[0].id;
            }
            this.getTreeDirect();
            this.isTreeData = false;
            this.getCategoryList();
        },
        getParentNameFrom (id) {
            this.parentName = this.basicTreeData.find(x => x.id === id).name + ' / ' + this.parentName;
            if (this.basicTreeData.find(x => x.id === id).parentId === 0) {
                this.newFormValidate.parentName = this.parentName.slice(0, this.parentName.length - 2);
                this.categoryShow = true;
            } else {
                this.getParentNameFrom(this.basicTreeData.find(x => x.id === id).parentId);
            }
        },
        // 新增物料分类
        addNewMaterial () {
            this.$refs['newFormValidate'].resetFields();
            this.isShowUserMessage = false;
            this.isCouldSave = true;
            this.categoryTitle = '新增物料分类';
            this.parentName = '';
            this.getParentNameFrom(this.curId);
            this.newFormValidate.name = '';
            this.newFormValidate.code = '';
            this.curMaterialCategoryId = null;
            this.newFormValidate.isParts = false;
            this.newFormValidate.newFormValidate = '';
            this.newFormValidate.stockTypeId = '';
            this.newFormValidate.enableBatch = true;
            this.productPropertyItem = [];
            this.productPropertyItemValue = [];
            // this.categoryShow = true;
        },
        // 获取物料分类的数据
        getCategoryList () {
            // debugger
            if (!this.isTreeData && this.curParentId === 0) {
                this.curId = this.basicTreeData.find(x => x.parentId === this.curParentId).id;
            }
            const _this = this;
            this.$api.category.getProductCategoryList(this.isTreeData === true ? null : {parentId: this.curId, typeId: this.curStockTypeId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    if (this.isTreeData) {
                        _this.isTreeData = false;
                        let data = content.res.map(item => {
                            item.expand = item.parentId === 0;
                            item.title = item.code + ' ' + item.name;
                            return item;
                        });
                        _this.basicTreeData = data;
                        _this.getTreeDirect();
                        _this.getCategoryList();
                    } else {
                        _this.tableData = content.res.map(item => {
                            item.parentName = _this.basicTreeData.find(x => x.id === item.parentId).name;
                            item.isParts = item.isParts === true ? '是' : '否';
                            item.enableBatch = item.enableBatch === true ? '是' : '否';
                            item.auditStateMean = auditStateList.find(x => x.id === item.auditState).name;
                            return item;
                        });
                        this.curProductCategoryData = [];
                        this.selectProductCategoryData = [];
                        this.curProductCategoryIds = [];
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                    }
                }
            });
        },
        // 获取树状结构入口
        getTreeDirect () {
            this.getTrees(this.basicTreeData, 0);
        },
        // 获取树状结构函数
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
                t.children = _this.formatTree(items, t.id);
                result.push(t);
            }
            return this.treeData = result;
        },
        // 改变物料属性
        changeAttribute (val) {
            // debugger;
            // console.log(val);
            // console.log(this.productPropertyItem);
            // this.productPropertyItemValue = val;
        },
        // 确定保存物料分类
        categorySubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        id: this.curMaterialCategoryId,
                        parentId: this.curId,
                        code: this.newFormValidate.code.toLocaleUpperCase(),
                        name: this.newFormValidate.name,
                        productPropertyItemIds: isNaN(this.productPropertyItem) ? '' : this.productPropertyItem.toString(), // id  2,3
                        productPropertyItemNames: isNaN(this.productPropertyItem) ? '' : (this.productPropertyItem ? this.getProductPropertyName(this.productPropertyItem).toString() : null),
                        isParts: this.newFormValidate.isParts,
                        typeId: this.newFormValidate.stockTypeId,
                        typeName: this.stockTypeList.find(x => x.id === this.newFormValidate.stockTypeId).name,
                        enableBatch: this.newFormValidate.enableBatch
                    };
                    this.categoryLoading = true;
                    this.$api.category.productCategorySave(params).then((res) => {
                        let content = res.data;
                        this.categoryLoading = false;
                        if (content.status === 200) {
                            this.isTreeData = true;
                            this.getCategoryList();
                            this.categoryShow = false;
                            this.$Message.success('保存成功');
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        // 获取属性的name
        getProductPropertyName (ids) {
            let data = [];
            data = ids.map(item => {
                return this.productProperty.find(x => x.id === item).name;
            });
            return data;
        },
        // 编辑 获取物料分类的数据
        getProductCategotyDetail (id) {
            const _this = this;
            this.$api.category.getProductCategoryDetail({id: this.curMaterialCategoryId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.categoryTitle = content.res.auditState === 3 ? '物料分类详情' : '编辑物料分类';
                    // _this.curParentId = content.res.curParentId;
                    _this.curId = content.res.parentId;
                    _this.newFormValidate.code = content.res.code;
                    _this.newFormValidate.enableBatch = content.res.enableBatch;
                    _this.newFormValidate.isParts = content.res.isParts;
                    _this.newFormValidate.name = content.res.name;
                    _this.newFormValidate.id = content.res.id;
                    _this.newFormValidate.stockTypeId = content.res.typeId;
                    _this.newFormValidate.stockTypeName = content.res.typeName;
                    _this.productPropertyItem = content.res.productPropertyItemIds.split(',').map(item => {
                        return parseInt(item);
                    });
                    _this.productPropertyItemNames = content.res.productPropertyItemNames;
                    _this.createTime = content.res.createTime;
                    _this.createName = content.res.createName;
                    _this.updateTime = content.res.updateTime;
                    _this.updateName = content.res.updateName;
                    _this.auditName = content.res.auditName;
                    _this.auditTime = content.res.auditTime;
                    _this.parentName = '';

                    _this.getParentNameFrom(_this.curId);
                }
            });
        },
        // 获取存货类型
        getStockType () {
            this.$api.dictionary.getStockType().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.stockTypeList = content.res;
                }
            });
        },
        // 取消保存物料分类
        categoryCancel () {
            this.categoryLoading = false;
            this.categoryShow = false;
        },
        // 取消删除
        onCancelWarn () {
            this.deleteLoading = false;
            this.warnShow = false;
        },
        // 确认删除
        onConfirmWarn () {
            this.deleteLoading = true;
            this.$api.category.productCategoryDelete(this.curProductCategoryIds).then((res) => {
                this.deleteLoading = false;
                if (res.data.status === 200) {
                    this.isTreeData = true;
                    this.getCategoryList();
                    this.warnShow = false;
                    this.$Message.success('删除成功');
                };
            });
        }
    },
    created () {
        // 获取存货类型
        this.getStockType();
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.isTreeData = true;
        // 获取物料分类数据
        this.getCategoryList();
        // 获取物料属性
        this.getAttrList();
    },
    mounted () {
        window.onresize = () => {
            this.tableHeight = publicJs.compClientHeight(200);
        };
    }
};

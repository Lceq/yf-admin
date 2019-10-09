<template>
    <div class="select-product">
        <div class="select-product-search">
            <Select
                ref="setQuery"
                class="select-product-select"
                placeholder="填写产品编码或名称"
                v-model="selectProductCodeName"
                filterable
                clearable
                remote
                @on-change="changeProduct"
                @on-query-change="queryChangeProduct"
                :remote-method="remoteMethod"
                :loading="loading">
                    <Option v-for="(option, index) in curProductList" :value="option.codeName" :key="index">{{ option.codeName}})</Option>
            </Select>
            <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
            :isShow="selectProductShow"
            :loading="selectProductLoading"
            :width="800"
            :title="'选择产品'"
            @cancel="selectProductCancel"
            @submit="selectProductSubmit"
        >
            <div slot="content">
                <div class="endFlex marginBottom">
                    <Cascader clearable change-on-select @on-change="changeProductCategory" v-model="value1" ref="CascaderType" class="formWidth textLeft" placeholder="请选择物料分类" :data="productCategoryList"></Cascader>
                    <Select clearable class="textLeft formWidth marginButtonLeft" @on-change="changeCascaderType" v-model="curProductTypeId" placeholder="请选择存货类型">
                        <Option v-for="item in stockTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input @on-change="changeProductCodeName" clearable class="formWidth textLeft marginButtonLeft" type="text" v-model="codeName" placeholder="请输入产品编码或名称"/>
                </div>
                <Table :highlight-row="true" @on-row-dblclick="dbClickSelectProduct" @on-row-click="clickRowProduct" class="marginBottom" size="small" :columns="selectProductColumns" :data="selectProductData" :height="420" border :loading="selectProductLoading"></Table>
                <Page class="textRight" :total="selectProductTotal" show-elevator :page-size-opts="selectProductPageOpts" show-total :page-size="selectProductSize" @on-change="changePageIndexProduct" show-sizer @on-page-size-change="changePageSizeProduct"></Page>
            </div>
        </modal>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import modal from '../../public/modal';
    export default {
        name: 'select-product',
        components: {
            modal
        },
        computed: {
            ...mapState({
                selectProductPageOpts: state => state.pageOpts,
                selectProductSize: state => state.pageSize
            })
        },
        props: {
            selectProductCode: {
                type: String
            }
        },
        data () {
            return {
                curProductCodeName: '',
                value1: [],
                productCategoryList: [],
                code: '',
                selectProduct: '',
                loading: false,
                selectProductShow: false,
                options: [],
                selectProductLoading: false,
                selectProductColumns: [
                    {
                        title: '存货类型',
                        key: 'categoryName',
                        fixed: 'left',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '产品编码',
                        key: 'code',
                        align: 'center',
                        fixed: 'left',
                        minWidth: 100
                    },
                    {
                        title: '产品名称',
                        key: 'name',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '规格型号',
                        key: 'models',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '计量单位',
                        key: 'unitCode',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '加工工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 80
                    },
                    {
                        title: '图片',
                        key: 'picUrl',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('Div', {
                                style: {
                                    padding: '5px 0 0 0'
                                }
                            }, [
                                h('img', {
                                    attrs: {
                                        src: params.row.picUrl ? params.row.picUrl : 'https://service.shengtex.com/images/default.png'
                                    },
                                    style: {
                                        width: '30px',
                                        height: '30px'
                                    }
                                })
                            ]);
                        }
                    }
                ],
                selectProductData: [],
                selectProductTotal: 1,
                selectProductIndex: 0,
                productList: [],
                curProductList: [],
                selectedProduct: '',
                selectProductCodeName: '',
                selectProductId: '',
                //
                stockTypeList: [],
                // modal 搜索
                CascaderType: '',
                idLoad: false,
                curCategoryId: '',
                curProductTypeId: '',
                codeName: '',
                curProductRow: []
            };
        },
        methods: {
            // 远程搜索
            remoteMethod (query) {
                const _this = this;
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        _this.loading = false;
                        const list = _this.selectProductData;
                        _this.curProductList = list.filter(item => item.codeName.toLowerCase().includes(query.toLowerCase()));
                    }, 200);
                } else {
                    _this.curProductList = [];
                }
            },
            // 点击图标搜索物料
            searchProductVal () {
                this.curProductRow = [];
                this.selectProductIndex = 1;
                setTimeout(() => {
                    this.selectProductTotal = 1;
                });
                this.curProductTypeId = null;
                this.curCategoryId = null;
                this.codeName = '';
                this.value1 = [];
                this.getProductListTo();
            },
            // 取消选择产品
            selectProductCancel () {
                this.selectProductShow = false;
            },
            // 确认选择产品
            selectProductSubmit () {
                if (this.curProductRow.length === 0) {
                    return false;
                }
                // debugger
                this.selectProductCodeName = this.curProductRow.name + ' (' + this.curProductRow.code + ')';
                this.$emit('selectProductVal', this.curProductRow);
                this.selectProductShow = false;
            },
            // 改变页数
            changePageIndexProduct (val) {
                this.selectProductIndex = val;
                this.getProductListTo();
            },
            // 改变页码
            changePageSizeProduct (val) {
                this.selectProductSize = val;
                this.getProductListTo();
            },
            // 远程搜索的时候改变产品
            changeProduct (val) {
                // debugger
                if (val === undefined) {
                    this.selectProductCodeName = this.curProductCodeName;
                    this.$emit('selectProductVal', '');
                    return false;
                }
                let id = this.selectProductData.find(x => x.codeName === val).id;
                // this.selectProductCodeName = val;
                if (val) {
                    // this.$refs.setQuery.setQuery(val);
                    this.selectProductCodeName = val;
                    // this.selectProductCodeName = this.curProductCodeName;
                    this.$api.product.getProductDetail({id: id}).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.selectedProduct = content.res;
                            this.$emit('selectProductVal', this.selectedProduct);
                        }
                    });
                } else {
                    this.$emit('selectProductVal', '');
                }
            },
            // 远程搜索的时候改变每一个字节的时候都会变化
            queryChangeProduct () {
            },
            // 双击产品产生的变化
            dbClickSelectProduct (val, index) {
                // debugger
                if (!val.processId) {
                    this.selectProductCodeName = '';
                    this.$refs.setQuery.clearSingleSelect();
                } else {
                    // debugger
                    this.selectProductCodeName = val.name + ' (' + val.code + ')';
                    // this.$refs.setQuery.setQuery(val.name + '(' + val.code + ')');
                }
                // debugger
                this.$emit('selectProductVal', val);
                this.selectProductShow = false;
                // 双击产品
            },
            // 单击某一行的时候触发
            clickRowProduct (val) {
                this.curProductRow = val;
            },
            // 获取树状结构
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
                return this.productCategoryList = result;
            },
            // 获取存货类别
            getStockType () {
                this.$api.dictionary.getStockType().then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.stockTypeList = content.res;
                    }
                });
            },
            // 通过产品类别获取数据 ---- 更改存货类型
            changeCascaderType (val) {
                this.curProductTypeId = val;
                this.getProductListFrom();
            },
            // 通过物料分类获取数据 ---- 更改物料分类
            changeProductCategory (val) {
                this.curCategoryId = val.reverse()[0];
                this.getProductListFrom();
            },
            // 通过编码名称选择产品
            changeProductCodeName (val) {
                this.codeName = val.target.value;
                this.getProductListFrom();
            },
            // 从这里获取产品列表数据
            getProductListFrom () {
                this.selectProductIndex = 1;
                setTimeout(() => {
                    this.selectProductTotal = 1;
                });
                this.getProductListTo();
            },
            // 获取到产品列表数据
            getProductListTo () {
                let param = {
                    enableState: 1,
                    auditState: 3,
                    name: this.codeName,
                    categoryId: this.curCategoryId,
                    typeId: this.curProductTypeId
                };
                this.selectProductLoading = true;
                this.$api.quota.productListXS(param).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.selectProductLoading = false;
                        this.selectProductTotal = content.count;
                        // this.selectProductData = content.res;
                        this.selectProductData = content.res.map(x => {
                            x.codeName = x.name + ' (' + x.code + ')';
                            return x;
                        });
                    }
                });
                if (this.idLoad) {
                    this.idLoad = false;
                    this.selectProductShow = false;
                } else {
                    this.selectProductShow = true;
                }
            }
        },
        created () {
            this.idLoad = true;
            this.getProductListFrom();
            // 获取所有的产品列表
            // this.getAllProductList();
            // 获取存货类型
            this.getStockType();
        },
        watch: {
            selectProduct (newData, oldData) {
                // debugger
                if (newData === null || newData === undefined || newData === '' || newData.includes('true')) {
                    this.selectProductId = '';
                    this.$refs.setQuery.clearSingleSelect();
                    this.selectProductCodeName = '';
                } else {
                    this.curProductCodeName = newData;
                    // debugger
                    let params = {
                        auditState: 3,
                        enableState: 1,
                        pageSize: this.selectProductSize,
                        pageIndex: this.selectProductIndex,
                        name: this.codeName,
                        categoryId: this.curCategoryId,
                        typeId: this.curProductTypeId
                    };
                    this.selectProductLoading = true;
                    this.$api.product.getProductList(params).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.selectProductLoading = false;
                            this.selectProductTotal = content.count;
                            this.selectProductData = content.res;
                        }
                    });
                    this.selectProductCodeName = newData;
                }
            },
            selectProductCode (newData, oldData) {
                // debugger
                if (newData === null || newData === undefined || newData === '' || newData.includes('true')) {
                    // debugger
                    this.selectProductId = '';
                    this.$refs.setQuery.clearSingleSelect();
                    this.selectProductCodeName = '';
                } else {
                    this.curProductCodeName = newData;
                    // this.getProductListFrom();
                    let param = {
                        enableState: 1,
                        auditState: 3,
                        name: this.codeName,
                        categoryId: this.curCategoryId,
                        typeId: this.curProductTypeId
                    };
                    this.selectProductLoading = true;
                    this.$api.quota.productListXS(param).then((res) => {
                        let content = res.data;
                        if (content.status === 200) {
                            this.selectProductLoading = false;
                            this.selectProductTotal = content.count;
                            // this.selectProductData = content.res;
                            this.selectProductData = content.res.map(x => {
                                x.codeName = x.name + ' (' + x.code + ')';
                                return x;
                            });
                        }
                    });
                    this.selectProductCodeName = newData;
                }
            }
        },
        mounted () {
            // this.getProductListFrom();
            // 获取到产品列表数据
            // getProductListTo () {
            let params = {
                auditState: 3
            };
            this.$api.category.getProductCategoryList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let data = content.res.map(item => {
                        return {
                            id: item.id,
                            parentId: item.parentId,
                            value: item.id,
                            label: item.name
                        };
                    });
                    let pId = data.find(x => x.parentId === 0).id;
                    this.getTrees(data, pId);
                }
            });
        }
    };
</script>

<style scoped>
    .select-product-select{
        padding-right: 32px;
    }
    .select-product-search{
        width: 100%;
        position: relative;
        top: 0;
        left: 0
    }
    .select-product-icon-search{
        font-size: 12px;
        text-align: center;
        position: absolute;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        width: 34px;
        right: 0;
        top: 1px;
        border: 1px solid #dcdee2;
        border-left: none;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
</style>

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
                    :remote-method="remoteMethod"
                    :loading="loading">
                <Option v-for="(option, index) in curProductList" :value="option.codeName" :key="index">{{option.codeName}}</Option>
            </Select>
            <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
                :isShow="selectProductShow"
                :loading="selectProductLoading"
                :width="800"
                :title="'选择产品'"
                @visibleChange="visibleChange"
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
                <!--<Page class="textRight" :total="selectProductTotal" show-elevator :page-size-opts="selectProductPageOpts" show-total :page-size="selectProductSize" @on-change="changePageIndexProduct" show-sizer @on-page-size-change="changePageSizeProduct"></Page>-->
            </div>
        </modal>
    </div>
</template>

<script>
    import {page} from '../../../libs/tools';
    import modal from '../../public/modal';
    import xwTools from '../../../libs/xwTool'
    export default {
        name: 'xw-select-product',
        components: {
            modal
        },
        props: {
            selectProductCode: {
                type: String
            },
            processTypeId: {
                type: Number
            }
        },
        data () {
            return {
                value1: [],
                selectProductSize: page().pageSize,
                selectProductPageOpts: page().pageOpts,
                loading: false,
                selectProductCodeName: '',
                curProductList: [],
                productCategoryList: [],
                curProductTypeId: '',
                stockTypeList: [],
                codeName: '',
                selectProductColumns: [
                    {
                        title: '物料分类',
                        key: 'categoryName',
                        fixed: 'left',
                        align: 'center',
                        minWidth: 100
                    },
                    // {
                    //     title: '产品编码',
                    //     key: 'code',
                    //     align: 'center',
                    //     fixed: 'left',
                    //     minWidth: 100
                    // },
                    {
                        title: '产品名称(编码)',
                        key: 'name',
                        align: 'center',
                        minWidth: 120,
                        render: (h, param) => {
                            return h('span', {}, param.row.name + ' (' + param.row.code + ')')
                        }
                    },
                    {
                        title: '加工工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 100
                    },
                    // {
                    //     title: '规格型号',
                    //     key: 'models',
                    //     align: 'center',
                    //     minWidth: 100
                    // },
                    // {
                    //     title: '计量单位',
                    //     key: 'unitCode',
                    //     align: 'center',
                    //     minWidth: 80
                    // },
                    {
                        title: '存货类型',
                        key: 'typeName',
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
                selectProductShow: false,
                selectProductLoading: false,
                isdbClick: false,
                selectProductIndex: 1,
                selectProductTotal: 0,
                curProductCodeName: '',
                curProductRow: {},
                curCategoryId: '',
                middleSelectList: [],
                onceEditSure: false,
                selectProductCodeNameMiddle: ''
            };
        },
        methods: {
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
            visibleChange (val) {
                console.log(val)
            },
            async searchProductVal () {
                this.isdbClick = false;
                this.curProductTypeId = null;
                this.curCategoryId = null;
                this.codeName = '';
                this.value1 = [];
                await this.getProductList();
                this.selectProductShow = true;
            },
            changeProductCategory (val) {
                this.curCategoryId = val.reverse()[0];
                this.getProductList();
            },
            changeProductCodeName (val) {
                this.selectProductData = this.middleSelectList.filter(x => x.codeName.includes(this.codeName))
            },
            changeCascaderType (val) {
                this.curProductTypeId = val;
                this.getProductList();
            },
            clickRowProduct (val) {
                this.curProductRow = val;
            },
            selectProductCancel () {
                this.curProductTypeId = null;
                this.curCategoryId = null;
                this.codeName = '';
                this.value1 = [];
                //
                this.curProductList = this.middleSelectList;
                this.isdbClick = false;
                this.selectProductShow = false;
                this.selectProductLoading = false;
                this.curProductRow = {};
            },
            getProductList () {
                let params = {
                    auditState: 3,
                    enableState: 1,
                    enableBatch: true,
                    processTypeId: this.processTypeId,
                    categoryId: this.curCategoryId,
                    typeId: this.curProductTypeId,
                    name: this.codeName
                };
                this.$call('product.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.selectProductData = content.res.map(x => {
                            x.codeName = x.name + ' (' + x.code + ')';
                            return x;
                        });
                        this.middleSelectList = this.selectProductData;
                        this.curProductList = this.middleSelectList;
                    }
                });
            },
            // 获取存货类别
            getStockType () {
                let params = {
                    auditState: 3
                };
                this.$api.dictionary.getStockType(params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.stockTypeList = content.res;
                    }
                });
            },
            getProductCategoryList () {
                let params = {
                    auditState: 3
                };
                this.$call('product.category.list', params).then(res => {
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
                        this.productCategoryList = xwTools.getTrees(data, pId);
                    }
                });
            },
            selectProductSubmit () {
                this.onceEditSure = false;
                if (!this.curProductRow.codeName) {
                    return false;
                } else {
                    // this.selectProductCodeName = this.curProductRow.codeName;
                    this.$emit('selectProductVal', this.curProductRow);
                    //
                    this.isdbClick = false;
                    this.selectProductShow = false;
                    this.selectProductLoading = false;
                    this.curProductRow = {};
                    //
                    this.curProductList = this.middleSelectList;
                    this.curProductTypeId = null;
                    this.curCategoryId = null;
                    this.codeName = '';
                    this.value1 = [];
                }
            },
            dbClickSelectProduct (val, index) {
                this.$emit('selectProductVal', val);
                this.onceEditSure = false;
                this.selectProductShow = false;
            },
            changeProduct (val) {
                if (!val) {
                    // if (this.onceEditSure) {
                    //     this.onceEditSure = false;
                    this.selectProductCodeName = '';
                    //     return false;
                    // }
                    this.$emit('selectProductVal', {});
                } else {
                    this.selectProductCodeName = val;
                    let value = this.selectProductData.find(x => x.codeName === this.selectProductCodeName);
                    this.$emit('selectProductVal', value);
                }
            },
        },
        mounted () {
            // 获取多有的产品
            this.getProductList();
            // 获取物料分类
            this.getStockType();
            // 获取物料分类
            this.getProductCategoryList();
        },
        watch: {
            selectProductCode (newData, oldData) {
                if (newData === null || newData === undefined || newData === '') {
                    this.selectProductCodeName = '';
                    this.selectProductCodeNameMiddle = '';
                    // this.$emit('selectProductVal', {});
                } else {
                    this.selectProductCodeName = newData;
                    this.selectProductCodeNameMiddle = newData;
                    this.onceEditSure = true;
                }
            }
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
        top: 0px;
        border: 1px solid #dcdee2;
        border-left: none;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
</style>

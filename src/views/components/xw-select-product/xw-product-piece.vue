<template>
    <div class="select-product">
        <div class="select-product-search">
            <Select
                ref="setQuery"
                class="select-product-select"
                placeholder="请填写产品编码或名称"
                v-model="productCodeName"
                clearable
                filterable
                remote
                @on-change="changeProduct"
                :remote-method="remoteMethod"
                :loading="loading">
                <Option v-for="(option, index) in curProductList" :value="option.codeName" :key="index">{{option.codeName}}</Option>
            </Select>
            <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
            :isShow="selectShow"
            :loading="selectLoading"
            :title="'选择产品'"
            @cancel="cancel"
            @submit="submit"
        >
            <div slot="content">
                <Table :highlight-row="true" @on-row-dblclick="dbClickProduct" @on-row-click="clickProduct" class="marginBottom" size="small" :columns="selectColumns" :data="productList" :height="420" border :loading="selectLoading"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
    import modal from '../../public/modal';
    // import xwTools from '../../../libs/xwTool';
    export default {
        name: 'xw-select-product-spec',
        components: {
            modal
        },
        props: ['workshopId', 'productMath', 'productList'],
        data () {
            return {
                // productList: [],
                productCodeName: '',
                loading: false,
                curProductList: [],
                selectColumns: [
                    {
                        title: '物料分类',
                        key: 'categoryName',
                        fixed: 'left',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '产品名称(编码)',
                        key: 'name',
                        align: 'left',
                        minWidth: 120,
                        render: (h, param) => {
                            return h('span', {}, param.row.name + ' (' + param.row.code + ')');
                        }
                    },
                    {
                        title: '生产工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 100
                    },
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
                selectList: [],
                selectShow: false,
                selectLoading: false,
                productMiddleCodeName: ''
            };
        },
        methods: {
            remoteMethod (query) {
                // debugger
                const _this = this;
                if (query) {
                    this.loading = true;
                    setTimeout(() => {
                        _this.loading = false;
                        const list = _this.productList;
                        _this.curProductList = list.filter(item => item.codeName.toLowerCase().includes(query.toLowerCase()));
                    }, 200);
                } else {
                    _this.curProductList = _this.productList;
                }
            },
            changeProduct (val) {
                // debugger;
                if (!val) {
                    if (this.productMiddleCodeName) {
                        this.curProductList = this.productList;
                        this.productCodeName = this.productMiddleCodeName;
                        this.productMiddleCodeName = '';
                    } else {
                        this.$emit('submit', {});
                    }
                } else {
                    let obj = this.productList.find(x => x.codeName === val);
                    this.$emit('submit', obj);
                }
            },
            searchProductVal () {
                this.selectShow = true;
            },
            dbClickProduct (val, index) {
                this.curProductRow = {};
                this.productCodeName = val.codeName;
                this.productMiddleCodeName = val.codeName;
                // debugger;
                this.selectShow = false;
                this.$emit('submit', val);
            },
            clickProduct (val) {
                this.curProductRow = val;
            },
            submit () {
                if (!this.curProductRow.codeName) {
                    this.$Message.warning('请选择产品');
                    return false;
                } else {
                    this.productCodeName = this.curProductRow.codeName;
                    // this.productMiddleCodeName = this.curProductRow.codeName;
                    this.$emit('submit', this.curProductRow);
                    this.selectShow = false;
                    // this.curProductList = this.productList;
                }
            },
            cancel () {
                // this.curProductList = this.productList;
                this.curProductRow = {};
                this.selectShow = false;
            }
        },
        mounted () {
        },
        watch: {
            productMath (newData, oldData) {
                // debugger;
                // this.curProductList = [];
                if (!newData) {
                    this.productCodeName = '';
                    this.productMiddleCodeName = '';
                } else {
                    // debugger;
                    // getProductList () {
                    // let params = {
                    //     workshopId: this.workshopId,
                    //     productNameCode: ''
                    // };
                    // this.$call('product.listWhithCp', params).then(res => {
                    //     let content = res.data;
                    //     if (content.status === 200) {
                    //         // debugger
                    //         this.productList = content.res.map(x => {
                    //             x.codeName = x.name + '(' + x.code + ')';
                    //             return x;
                    //         });
                    //     }
                    // });
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
        top: 1px;
        border: 1px solid #dcdee2;
        border-left: none;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
</style>

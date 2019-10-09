<template>
    <div>
        <modal
            :title="'选择产品'"
            :isShow="addProductsShow"
            :loading="addProductsLoading"
            :width="800"
            @cancel="addProductsCancel"
            @submit="addProductsSubmit"
        >
            <div slot="content">
                <div class="endFlex marginBottom">
                    <Input @on-change="changeProductCodeName" clearable class="formWidth textLeft marginButtonLeft" type="text" v-model="codeName" placeholder="请输入产品编码或名称"/>
                </div>
                <Table border ref="selection" size="small" :loading="productLoading" @on-selection-change="selectAllProduct" :row-class-name="rowClassName" :columns="productColumns" :data="productList" height="400"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
export default {
    components: {
        modal
    },
    name: 'xw-select-products-work-center',
    props: {
        xwSelectProductShow: {
            type: Boolean,
            default: false
        },
        processId: {
            type: String
        },
        selectProductList: {
            type: Array
        }
    },
    data () {
        return {
            addProductsShow: false,
            addProductsLoading: false,
            productLoading: false,
            productColumns: [
                {
                    type: 'selection',
                    width: 60,
                    fixed: 'left',
                    align: 'center'
                },
                {
                    title: '物料分类',
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
                    minWidth: 80,
                    render: (h, params) => {
                        return h('span', {}, params.row.unitName + '(' + params.row.unitCode + ')');
                    }
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
            productList: [],
            codeName: ''
        };
    },
    methods: {
        addProductsSubmit () {
            let value = this.middleProducts.filter(item => item._checked === true);
            if (value.length === 0) {
                this.$Message.warning('请选择产品');
                return false;
            }
            this.$emit('selectProducts', value);
            this.addProductsShow = false;
        },
        addProductsCancel () {
            this.$emit('cancel');
            this.addProductsShow = false;
        },
        changeProductCodeName () {
            this.productList = this.middleProducts.filter(x => x.codeName.includes(this.codeName));
        },
        selectAllProduct (val) {
            if (val.length === 0) {
                for (let v of this.productList) {
                    this.middleProducts.find(x => x.id === v.id)._checked = false;
                }
            } else {
                for (let v of this.productList) {
                    this.middleProducts.find(x => x.id === v.id)._checked = false;
                }
                for (let v of val) {
                    this.middleProducts.find(x => x.id === v.id)._checked = true;
                }
            }
        },
        rowClassName () {
        }
    },
    mounted () {
    },
    watch: {
        xwSelectProductShow (newState, oldState) {
            const _this = this;
            this.addProductsShow = newState;
            this.codeName = '';
            if (newState) {
                let params = {
                    auditState: 3,
                    processId: this.processId,
                    enableState: 1
                };
                this.productLoading = true;
                this.$call('product.list', params).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.productLoading = false;
                        _this.productList = content.res.map(item => {
                            item.codeName = item.code + item.name;
                            item._checked = false;
                            return item;
                        });
                        if (_this.selectProductList.length > 0) {
                            for (let v of _this.selectProductList) {
                                _this.productList.find(x => x.id === v.productId)._checked = true;
                            }
                        }
                        _this.middleProducts = this.productList;
                    }
                });
            }
        }
    }
};
</script>

<style scoped>

</style>

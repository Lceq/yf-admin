<template>
    <div class="select-product">
        <div class="select-product-search">
            <Select
                    class="select-product-select"
                    v-model="curProductId"
                    filterable
                    clearable
                    remote
                    :remote-method="remoteMethod"
                    :loading="productLoading">
                <Option v-for="(option, index) in curProductList" :value="option.id" :key="index">{{option.code}}</Option>
            </Select>
            <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
            :isShow="isShowProduct"
            :title="productTitle"
            :width="800"
            @cancel="productCancel"
            @submit="productSubmit"
        >
            <div slot="content">
                <Table :data="productModalData" :columns="productModalColumns" border size="small" :height="400"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../public/modal';
export default {
    name: 'selectProduct',
    components: {
        modal
    },
    data () {
        return {
            curProductId: '',
            productLoading: false,
            productList: [],
            curProductList: [],
            isShowProduct: false,
            productTitle: '',
            productModalData: [],
            productModalColumns: [
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
            ]
        };
    },
    methods: {
        remoteMethod (query) {
            if (query !== '') {
                this.productLoading = true;
                setTimeout(() => {
                    this.productLoading = false;
                    const list = this.productList;
                    this.curProductList = list.filter(item => item.code.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                this.curProductList = [];
            }
        },
        searchProductVal () {
            this.$api.product.getProductList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.productModalData = content.res;
                    console.log(this.productList);
                    this.isShowProduct = true;
                    this.productTitle = '选择物料';
                }
            });
        },
        getProductVal () {
            this.$api.product.getProductList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.productList = content.res;
                    console.log(this.productList);
                }
            });
        },
        productSubmit () {
            this.isShowProduct = false;
        },
        productCancel () {
            this.isShowProduct = false;
        }
    },
    mounted () {
        this.getProductVal();
    }
};
</script>

<style scoped>
    .select-product-select{
        padding-right: 32px;
    }
    .select-product-search{
        width: 200px;
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
        /*border-left: none;*/
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
    .select-product-icon-search{
        /*border-color: #f8f8f8;*/
    }
</style>

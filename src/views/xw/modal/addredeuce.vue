<template>
<div>
    <Table ref="table" :data="data" :columns="columns"  border @on-selection-change="selectionChange">
    </Table>
</div>
</template>

<script>
export default {
    name: 'addredeuce',
    data () {
        return {
            selected: [],
            data: [
                {
                    demandQty: 20,
                    purchasedQty: 10,
                    purchaseQty: null,
                    PurchaseBrand: null
                },
                {
                    demandQty: 20,
                    purchasedQty: 5,
                    purchaseQty: null,
                    PurchaseBrand: null
                }
            ],
            columns: [
                {
                    title: '需求数量',
                    key: 'demandQty'
                },
                {
                    title: '已采购数量',
                    key: 'purchasedQty'
                },
                {
                    title: '本次采购数量',
                    key: 'purchaseQty',
                    render: (h, params) => {
                        params.row.purchaseQty = params.row.demandQty - params.row.purchasedQty;
                        return h(
                            'div',
                            [
                                h(
                                    'a',
                                    {
                                        style: {
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                params.row.purchaseQty--;
                                                if (params.row.purchaseQty < 0) {
                                                    params.row.purchaseQty = 0;
                                                }
                                            }
                                        }
                                    },
                                    '-'
                                ),
                                h(
                                    'Input',
                                    {
                                        style: {
                                            width: '70px',
                                            margin: '0px 10px'
                                        },
                                        props: {
                                            type: 'text',
                                            value: params.row.purchaseQty
                                        }
                                    }
                                ),
                                h(
                                    'a',
                                    {
                                        style: {
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                console.log(params.row.purchaseQty++);

                                                params.row.purchaseQty++;
                                            }
                                        }
                                    },
                                    '+'
                                )

                            ]
                        );
                    }
                }
            ]
        };
    },
    methods: {
        selectionChange (list) {
            this.selected = list;
        }
    }
};
</script>

<style scoped>

</style>

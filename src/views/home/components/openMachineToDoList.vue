<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col>
            <Table height="260" ref="child" size="small" :columns="tableHeader" :data="openMachineData"></Table>
        </Col>
    </Row>
</template>

<script>
export default {
    name: 'specToDoList',
    data () {
        return {
            tableHeader: [
                {
                    title: '产品',
                    key: 'productName',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            domProps: {
                                innerHTML: params.row.productName
                            },
                            on: {
                                'click': () => {
                                    this.clickCode(params.row.id);
                                }
                            }
                        });
                    }
                },
                {
                    title: '排产数量',
                    key: 'planOutput',
                    align: 'center'
                }
            ]
        };
    },
    props: {
        content: String,
        openMachineData: Array
    },
    methods: {
        // 点击订单的编号
        clickCode (id) {
            // 调转详情页
            this.$router.push({
                path: 'close'
            });
        }
    }
};
</script>
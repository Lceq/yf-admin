<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col>
            <Table height="150" ref="child" size="small" :columns="tableHeader" :data="noticeSheetData"></Table>
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
                    title: '通知单号',
                    key: 'code',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            domProps: {
                                innerHTML: params.row.code
                            },
                            on: {
                                'click': () => {
                                    // this.clickCode(params.row.id);
                                }
                            }
                        });
                    }
                },
                {
                    title: '物料名称',
                    key: 'productName',
                    align: 'center'
                },
                {
                    title: '提交人',
                    key: 'submitName',
                    align: 'center'
                }
            ]
        };
    },
    props: {
        content: String,
        noticeSheetData: Array
    },
    methods: {
        // 点击订单的编号
        clickCode (id) {
            this.$router.push({
                path: 'editNotice',
                query: {
                    editId: id
                }
            });
        }
    }
};
</script>

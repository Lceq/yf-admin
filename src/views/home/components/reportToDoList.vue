<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <Col>
            <Table height="150" ref="child" size="small" :columns="tableHeader" :data="reportSheetData"></Table>
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
                    title: '报工单号',
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
                    title: '车间',
                    key: 'workshopName',
                    align: 'center'
                },
                {
                    title: '班次',
                    key: 'shiftName',
                    align: 'center'
                },
                {
                    title: '创建人',
                    key: 'createName',
                    align: 'center'
                }
            ]
        };
    },
    props: {
        content: String,
        reportSheetData: Array
    },
    methods: {
        // 点击订单的编号
        clickCode (id) {
            // 调转详情页
            this.$router.push({
                path: 'editReport',
                query: {
                    id: id
                }
            });
        }
    }
};
</script>

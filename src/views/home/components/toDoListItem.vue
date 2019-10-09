<style lang="less">
    @import './styles/to-do-list-item.less';
</style>

<template>
    <Row class="to-do-list-item">
        <!--<Col span="2" class="height-100">
            <Row type="flex" justify="center" align="middle" class="height-100">
                <Checkbox v-model="todoitem"></Checkbox>
            </Row>
        </Col>
        <Col span="22" class="height-100">
            <Row type="flex" justify="start" align="middle" class="height-100">
                <p class="to-do-list-item-text" @click="handleHasDid" :class="{hasDid: todoitem}">{{ content }}</p>
            </Row>
        </Col>-->
        <Col>
            <Table stripe height="150" ref="child" size="small" :columns="tableHeader" :data="orderTableData"></Table>
        </Col>
    </Row>
</template>

<script>
export default {
    name: 'toDoListItem',
    data () {
        return {
            todoitem: false,
            tableHeader: [
                {
                    title: '订单编号',
                    key: 'code',
                    align: 'center',
                    render: (h, params) => {
                        return h('a', {
                            domProps: {
                                innerHTML: params.row.code
                            },
                            on: {
                                'click': () => {
                                    // this.clickOrderCode(params.row.id);
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
                    title: '数量',
                    key: 'amount',
                    align: 'center'
                }
            ]
        };
    },
    props: {
        content: String,
        orderTableData: Array
    },
    methods: {
        // 点击订单的编号
        clickOrderCode (id) {
            // 调转详情页
            this.$router.push({
                path: 'editOrder',
                query: {
                    id: id,
                    otherDisable: false,
                    edit: true
                }
            });
        },
        handleHasDid () {
            this.todoitem = !this.todoitem;
        }
    }
};
</script>

<template>
    <div>
        <Card  :bordered="false">
            <Row :gutter='16'>
                <Card>
                    <Row>
                        <Col span="20">
                            <Icon type="plus" class="newAddLowerColor"></Icon><a @click="addNewMaterial" class="newAddLowerColor">新增物料属性</a>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Table border @on-row-dblclick="showDetail" :columns="tableHeaders" :data="tableData"></Table>
                    </Row>
                </Card>
            </Row>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'attribute',
        data () {
            return {
                tableData: [
                    {
                        code: '01',
                        name: '纱线用途',
                        value: '针织用纱、机织用纱、机针用纱'
                    },
                    {
                        code: '02',
                        name: '染色等级',
                        value: '包漂、可漂、染色'
                    }
                ],
                tableHeaders: [
                    {
                        title: '属性编码',
                        key: 'code'
                    },
                    {
                        title: '属性名称',
                        key: 'name'
                    },
                    {
                        title: '属性值',
                        key: 'value'
                    },
                    {
                        title: '操作',
                        width: 180,
                        align: 'center',
                        key: 'operation',
                        render: (h, params) => {
                            const _this = this;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editShow = true;
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            _this.remove(params.index);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ]
            };
        },
        methods: {
            // 新增一个新的表单
            addNewMaterial () {
                if (!this.treeIndex.length) {
                    // 显示提示框
                    this.warnShow = true;
                } else {
                    // 显示增加框
                    this.addShow = true;
                }
                console.log(this.treeIndex.length);
            },
            // 查看每一行的数据显示
            showDetail () {
                console.log('展示该行的信息');
            },
            // 删除此行的信息
            remove (index) {
                this.tableData.splice(index, 1);
            }
        }
    };
</script>

<style scoped>

</style>
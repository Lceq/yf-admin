<template>
    <div>
        <Card>
            <Row>
                <Col>
                    <Table size="small" :data="paraData" :height="tableHeight" :columns="paraColumns" border></Table>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
export default {
    name: 'para',
    data () {
        return {
            tableHeight: '',
            paraValueData: [],
            paraValueDataList: [],
            paraData: [
                {
                    paraKey: '123'
                }
            ],
            paraColumns: [
                {
                    title: '操作',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        const _this = this;
                        return h('Poptip', {
                            props: {
                                placement: 'right'
                            }
                        }, [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        _this.paraValueData = _this.paraValueDataList.filter(item => item.paraKey === params.row.paraKey);
                                    }
                                }
                            }, '参数配置'),
                            h('div', {
                                slot: 'content'
                            }, [
                                h('Select', {
                                    props: {
                                        value: params.row.paraValue
                                    },
                                    style: {
                                        width: '80px'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            params.row.paraValue = event;
                                            _this.paraData[params.index] = params.row;
                                            _this.$api.para.getParaSave({
                                                id: params.row.id,
                                                paraValue: event
                                            }).then(res => {
                                                let content = res.data;
                                                if (content.status === 200) {
                                                    _this.getParaList();
                                                    _this.$Message.success('保存成功');
                                                }
                                            });
                                        }
                                    }
                                },
                                _this.paraValueData.map(item => {
                                    return h('Option', {
                                        props: {value: item.paraValue, key: item.paraValue}
                                    }, item.paraValueName);
                                })
                                )
                            ])
                        ]);
                    }
                },
                {
                    title: '序号',
                    align: 'center',
                    width: 80,
                    key: 'index',
                    render: (h, params) => {
                        return h('Span', {
                        }, params.index + 1);
                    }
                },
                {
                    title: '系统参数Key',
                    minWidth: 130,
                    align: 'center',
                    key: 'paraKey'
                },
                {
                    title: '参数值',
                    minWidth: 120,
                    sortable: true,
                    align: 'center',
                    key: 'paraValueM'
                },
                {
                    title: '参数说明',
                    minWidth: 120,
                    sortable: true,
                    align: 'center',
                    key: 'remark'
                },
                {
                    title: '排序',
                    width: 80,
                    sortable: true,
                    align: 'center',
                    key: 'sortNum'
                }
            ]
        };
    },
    methods: {
        getParaList () {
            this.$api.para.getParaList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.paraData = content.res.map(x => {
                        x.paraValueM = x.paraValue === 'True' ? '启用' : '不启用';
                        return x;
                    });
                }
            });
        },
        getParaValueList () {
            this.$api.para.getParaValueList().then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.paraValueDataList = content.res;
                    // console.log(this.paraValueData);
                }
            });
        }
    },
    mounted () {
        this.getParaList();
        this.getParaValueList();
        this.$nextTick(() => {
            this.tableHeight = document.documentElement.clientHeight - 160;
        });
        window.onresize = () => {
            this.tableHeight = document.documentElement.clientHeight - 160;
        };
    }
};
</script>

<style scoped>

</style>

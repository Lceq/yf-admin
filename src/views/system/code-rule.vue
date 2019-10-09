<template>
    <div class="main-box">
        <div class="content-left">
            <Menu
                    active-name="物料编码规则"
                    width="auto"
                    @on-select="clickMenu"
            >
                <MenuItem name="物料编码规则">物料编码规则</MenuItem>
                <MenuItem name="生产订单编码规则">生产订单编码规则</MenuItem>
                <MenuItem name="品种工艺单编码规则">品种工艺单编码规则</MenuItem>
                <MenuItem name="生产通知单编码规则">生产通知单编码规则</MenuItem>
            </Menu>
        </div>
        <div class="content-right">
            <Row>
                <Col>
                    <span class="header-name">规则名称：{{ !headerName ? headerName ='物料编码规则': headerName}}</span>
                </Col>
            </Row>
            <Row class="table-margin">
                <Col>
                    <Table border :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 100,
                        align: 'center'
                    },
                    {
                        title: '取值来源',
                        key: 'getValueFrom',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Select', {
                                    props: {
                                        placeholder: params.row.sourceValue,
                                        disabled: true
                                    }
                                }, params.row.getValueFrom.map((items) => {
                                    return h('Option', {
                                        props: {
                                            value: items.value,
                                            label: items.label
                                        }
                                    });
                                }))
                            ]);
                        }
                    },
                    {
                        title: '来源值',
                        key: 'fromValue',
                        render: (h, params) => {
                            if (params.index === 0) {
                                return h('div', [
                                    h('Input', {
                                        props: {
                                            value: params.row.vl,
                                            disabled: true
                                        },
                                        style: {
                                            textAlign: 'center'
                                        },
                                        on: {
                                            'on-change': (e) => {
                                            }
                                        }
                                    })
                                ]);
                            };
                            if (params.index === 1) {
                                return h('div', [
                                    h('Select', {
                                        props: {
                                            placeholder: params.row.sourceValue,
                                            disabled: true
                                        },
                                        style: {},
                                        on: {
                                            'on-change': (e) => {
                                            }
                                        }
                                    }, params.row.fromValue.map((items) => {
                                        return h('Option', {
                                            props: {
                                                value: items.value,
                                                label: items.label
                                            }
                                        });
                                    }))
                                ]);
                            };
                            if (params.index === 2) {
                                return h('div', [
                                    h('InputNumber', {
                                        props: {
                                            min: 0,
                                            value: params.row.fromValue,
                                            disabled: true
                                        },
                                        style: {
                                            width: '100%',
                                            textAlign: 'center'
                                        },
                                        on: {
                                            'on-change': (e) => {
                                            }
                                        }
                                    })
                                ]);
                            };
                        }
                    }
                ],
                contain2: [
                    {
                        vl: 'PO',
                        sourceValue: '常量',
                        getValueFrom: [
                            {
                                value: 1,
                                label: 1
                            }
                        ],
                        fromValue: 4
                    },
                    {
                        sourceValue: 'YYMM',
                        dateValue: '日期字段',
                        getValueFrom: [
                            {
                                value: 2,
                                label: 2
                            }
                        ],
                        fromValue: [
                            {
                                value: 4,
                                label: 4
                            }
                        ]
                    },
                    {
                        getValueFrom: [
                            {
                                value: 2,
                                label: 2
                            }
                        ],
                        sourceValue: '流水号',
                        dateValue: '日期字段',
                        fromValue: 4
                    }
                ],
                tableData: [
                    {
                        vl: '系统自动填写',
                        sourceValue: '物料类别编码',
                        getValueFrom: [
                            {
                                value: 1,
                                label: 1
                            }
                        ],
                        fromValue: 4
                    },
                    {
                        sourceValue: '流水号',
                        dateValue: '日期字段',
                        getValueFrom: [
                            {
                                value: 2,
                                label: 2
                            }
                        ],
                        fromValue: [
                            {
                                value: 4,
                                label: 4
                            }
                        ]
                    }
                ],
                headerName: '',
                contain1: [
                    {
                        vl: '系统自动填写',
                        sourceValue: '物料类别编码',
                        getValueFrom: [
                            {
                                value: 1,
                                label: 1
                            }
                        ],
                        fromValue: 4
                    },
                    {
                        dateValue: '日期字段',
                        getValueFrom: [
                            {
                                value: 2,
                                label: 2
                            }
                        ],
                        sourceValue: '流水号',
                        fromValue: [
                            {
                                value: 4,
                                label: 4
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            // 点击菜单
            clickMenu (e) {
                this.headerName = e;
                if (e === '物料编码规则') {
                    this.tableData = this.contain1;
                } else if (e === '生产订单编码规则') {
                    this.tableData = this.contain2;
                } else if (e === '品种工艺单编码规则') {
                    this.tableData = this.contain2;
                } else if (e === '生产通知单编码规则') {
                    this.tableData = this.contain2;
                };
            }
        }
    };
</script>
<style scoped>
    .table-margin{
        margin: 5px 0 10px 0;
    }
    .main-box{
        position: absolute;
        left:10px;
        right:10px;
        top:10px;
        bottom:10px;
        background: #fff;
    }
    .content-left{
        width:160px;
        position: absolute;
        left:16px;
        top:16px;
        bottom:0;
    }
    .content-right{
        position: absolute;
        top:16px;
        right: 16px;
        bottom:0;
        left:186px;
        background: #fff;
    }
    .header-name{
        font: bold 18px/28px '';
    }
</style>

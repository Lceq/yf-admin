<template>
    <card>
        <Row :gutter="16" class="rowMargin">
            <Col :sm="24" :md="24" :lg="12">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">清花</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="blowingArr"></Table>
                </card>
            </Col>
            <Col :sm="24" :md="24" :lg="12" class="moduleBarBorder">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">梳棉</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="cardingArr"></Table>
                </card>
            </Col>
        </Row>
        <Row :gutter="16" class="rowMargin">
            <Col :sm="24" :md="24" :lg="12" class="moduleBarBorder">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">并条</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="drawingArr"></Table>
                </card>
            </Col>
            <Col :sm="24" :md="24" :lg="12" class="moduleBarBorder">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">粗纱</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="rovingArr"></Table>
                </card>
            </Col>
        </Row>
        <Row :gutter="16" class="rowMargin">
            <Col :sm="24" :md="24" :lg="12">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">细纱</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="yarnArr"></Table>
                </card>
            </Col>
            <Col :sm="24" :md="24" :lg="12" class="moduleBarBorder">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">络筒</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="spoolingArr"></Table>
                </card>
            </Col>
        </Row>
        <Row :gutter="16" class="rowMargin">
            <Col :sm="24" :md="24" :lg="12" class="moduleBarBorder">
                <card>
                    <p slot="title" class="card-title">
                        <span class="fontSizeTitle">包装</span>
                    </p>
                    <Table :height="tableHeight" size="small" :columns="blowingHeader" :data="packingArr"></Table>
                </card>
            </Col>
        </Row>
    </card>
</template>

<script>
    export default {
        data () {
            return {
                tableHeight: 316,
                blowingHeader: [
                    {
                        title: '设备名称',
                        key: 'machineName',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '单号',
                        key: 'order',
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '排产数量',
                        key: 'numbers',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '完工数量',
                        key: 'finishedNum',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '未完工数量',
                        key: 'unfinishedNum',
                        align: 'center',
                        minWidth: 100
                    },
                    {
                        title: '状态',
                        key: 'unfinishedNum',
                        align: 'left',
                        width: 64,
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    style: {
                                        width: '24px',
                                        height: '24px',
                                        background: '#3dcb26',
                                        textAlign: 'center',
                                        borderRadius: '4px'
                                    }
                                })
                            ]);
                        }
                    }

                ],
                blowingArr: [
                    {
                        machineName: '01#清花',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '01#清花',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#清花',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#清花',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#清花',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                cardingArr: [
                    {
                        machineName: '01#梳棉',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#梳棉',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#梳棉',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#梳棉',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                drawingArr: [
                    {
                        machineName: '01#末并',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#末并',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#末并',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#末并',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                rovingArr: [
                    {
                        machineName: '01#粗纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#粗纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#粗纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#粗纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                yarnArr: [
                    {
                        machineName: '01#细纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#细纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#细纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#细纱',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                spoolingArr: [
                    {
                        machineName: '01#络筒',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '02#络筒',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#络筒',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#络筒',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ],
                packingArr: [
                    {
                        machineName: '01#包装',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'

                    },
                    {
                        machineName: '02#包装',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '03#包装',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    },
                    {
                        machineName: '04#包装',
                        order: 'PO18100044',
                        productName: 'Siro R 40S',
                        numbers: '200000',
                        finishedNum: '100000',
                        unfinishedNum: '100000'
                    }
                ]
            };
        }
    };
</script>

<style>
    /*取消row的边框*/
    .rowMargin .ivu-table td, .ivu-table th{
        border:none;
    }
    /*表头的边框*/
    .rowMargin .ivu-table-row .ivu-table td, .ivu-table th{
        border-bottom:1px solid #e8eaec;
        border-right:1px solid #e8eaec;
    }
    .rowMargin .ivu-table-small td {
        height:29px;
    }
    .rowMargin{
        margin:10px 0;
    }

</style>
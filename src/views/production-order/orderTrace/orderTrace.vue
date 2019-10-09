<template>
    <div>
        <Card :style="orderTraceCardHeight">
            <Row class="marginBottom">
                <Col>
                    <span class="disSpan"><span class="fontBold">通知单号：</span><span class="fontInherit">{{noticeSheet.code}}</span></span>
                    <span class="disSpan"><span class="fontBold">单据日期：</span><span class="fontInherit">{{noticeSheet.noticeDate}}</span></span>
                    <span class="disSpan"><span class="fontBold">生产单号：</span><span class="fontInherit">{{noticeSheet.orderCode}}</span></span>
                    <span class="disSpan"><span class="fontBold">工艺单号：</span><span class="fontInherit">{{noticeSheet.specSheetCode}}</span></span>
                    <br>
                <!--</Col>-->
                <!--<Col class="parentFlexBetween">-->
                    <span class="disSpan"><span class="fontBold">物料编号：</span><span class="fontInherit">{{noticeSheet.productCode}}</span></span>
                    <span class="disSpan"><span class="fontBold">物料名称：</span><span class="fontInherit">{{noticeSheet.productName}}</span></span>
                    <span class="disSpan"><span class="fontBold">规格型号：</span><span class="fontInherit">{{noticeSheet.productModels}}</span></span>
                    <span class="disSpan"><span class="fontBold">批次号：</span><span class="fontInherit">{{noticeSheet.batchCode}}</span></span>
                    <br>
                <!--</Col>-->
                <!--<Col class="parentFlexBetween">-->
                    <span class="disSpan"><span class="fontBold">计量单位：</span><span class="fontInherit">{{noticeSheet.productUnitCode}}</span></span>
                    <span class="disSpan"><span class="fontBold">订单数量：</span><span class="fontInherit">{{noticeSheet.orderCount}}</span></span>
                    <span class="disSpan"><span class="fontBold">生产数量：</span><span class="fontInherit">{{noticeSheet.produceCount}}</span></span>
                    <span class="disSpan"><span class="fontBold">生产车间：</span><span class="fontInherit">{{noticeSheet.workshopName}}</span></span>
                    <br>
                <!--</Col>-->
                <!--<Col class="parentFlexBetween">-->
                    <span class="disSpan"><span class="fontBold">计划开工时间：</span><span class="fontInherit">{{noticeSheet.planFrom}}</span></span>
                    <span class="disSpan"><span class="fontBold">计划完工时间：</span><span class="fontInherit">{{noticeSheet.planTo}}</span></span>
                    <br>
                <!--</Col>-->
                <!--<Col class="parentFlexBetween">-->
                    <!--<span><span class="fontBold">工艺要求：</span><span class="fontInherit">{{noticeSheet.techRequirement}}</span></span>-->
                    <!--<span><span class="fontBold">质量要求：</span><span class="fontInherit">{{noticeSheet.qualityRequirement}}</span></span>-->
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tabs value="-1">
                        <TabPane label="原料" :name="'-1'">
                            <Table border ref="selection" size="small" :columns="originMaterialColumns" :data="originMaterialData"></Table>
                        </TabPane>
                        <TabPane v-for="(processItem, index) of processMachine" :key="index" :label="processItem.processName" :name="index + ''">
                            <Table class="marginBottom" ref="selection" size="small" border :data="processItem.machineList" :columns="orderTraceColumns"></Table>
                            <!--<p class="textRight">-->
                                <!--<span class="marginRight">原料投入总数：{{processItem.originTotalNum}}</span>-->
                                <!--<span class="marginRight">工序产出总数：{{processItem.haveAllPut}}</span>-->
                                <!--<span></span>-->
                                <!--<span class="marginRight">工序制成率：{{processItem.percentage}}</span>-->
                            <!--</p>-->
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
            <!--<Row>-->
                <!--<Col class="textRight">-->
                    <!--<p>-->
                        <!--<span class="marginRight">原料投入总数：{{originTotalNum}}</span>-->
                        <!--<span class="marginRight">工序产出总数：</span>-->
                        <!--<span></span>-->
                        <!--<span class="marginRight">工序制成率：</span>-->
                    <!--</p>-->
                <!--</Col>-->
            <!--</Row>-->
        </Card>
    </div>
</template>

<script>
import publicJs from '../../../libs/common';
export default {
    // name: 'orderTrace',
    data () {
        return {
            orderTraceCardHeight: {},
            result: 0,
            originTotalNum: '',
            noticeSheet: {},
            processMachine: [],
            originMaterialData: [],
            originMaterialColumns: [
                {
                    title: '序号',
                    key: 'index',
                    render: (h, params) => {
                        return h('Span', {}, params.index + 1);
                    }
                },
                {
                    title: '物料编码',
                    key: 'productCode'
                },
                {
                    title: '物料名称',
                    key: 'productName'
                },
                {
                    title: '规格型号',
                    key: 'productModels'
                },
                {
                    title: '批次号',
                    key: 'batchCode'
                },
                {
                    title: '计量单位',
                    key: 'productUnitCode'
                },
                {
                    title: '比例',
                    key: 'scale'
                },
                {
                    title: '数量',
                    key: 'num'
                }
            ],
            orderTraceData: [],
            orderTraceColumns: [
                {
                    title: '机台名称',
                    key: 'machineName',
                    minWidth: 120,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '物料编码',
                    key: 'productCode',
                    sortable: true,
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '物料名称',
                    minWidth: 120,
                    sortable: true,
                    key: 'productName',
                    align: 'center'
                },
                {
                    title: '批次号',
                    key: 'batchCode',
                    minWidth: 120,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '计量单位',
                    key: 'productUnitCode',
                    sortable: true,
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '开始时间',
                    minWidth: 150,
                    sortable: true,
                    key: 'planFrom',
                    align: 'center'
                },
                {
                    title: '排产数量',
                    key: 'planOutput',
                    minWidth: 120,
                    sortable: true,
                    align: 'center'
                },
                {
                    title: '已生产数量',
                    key: 'outPut',
                    sortable: true,
                    minWidth: 130,
                    align: 'center'
                },
                {
                    title: '未完成数量',
                    sortable: true,
                    minWidth: 130,
                    key: 'unOutPut',
                    align: 'center'
                }
            ]
        };
    },
    methods: {
        // getOriginTotalNum (data) {
        //     let result = 0;
        //     for (let i of data) {
        //         result += i;
        //     }
        //     return this.originTotalNum = result;
        // },
        // getTotalOutPut () {
        //     this.processMachine.map(x => {
        //         let result = 0;
        //         for (let i of x.machineList) {
        //             debugger
        //             result += parseFloat(i.haveOutPut);
        //         }
        //         x.haveAllPut = result.toFixed(2);
        //         x.percentage = (100 * (x.haveAllPut / x.originTotalNum)).toFixed(2) + '/%';
        //         return x;
        //     });
        // },
        getProcessMachine () {
            this.$store.dispatch({
                type: 'hideLoading'
            });
        }
    },
    mounted () {
        window.onresize = () => {
            // this.tableHeight = publicJs.compClientHeight(350);
            let het = publicJs.compClientHeight(120);
            this.orderTraceCardHeight = {height: het + 'px'};
        };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        let het = document.documentElement.clientHeight - 120 + 'px';
        this.orderTraceCardHeight = {height: het};
        this.orderTraceId = this.$route.query.id;
        this.$fetch('notice/material/list?sheetid=' + this.orderTraceId).then((res) => {
            const _this = this;
            let content = res.data;
            if (content.status === 200) {
                this.originMaterialData = content.res;
                this.$fetch('notice/sheet/detail/' + _this.orderTraceId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.noticeSheet = content.res.noticeSheet;
                        // let result = parseFloat(_this.originTotalNum);
                        _this.processMachine = content.res.processList.map(item => {
                            item.machineList.map(x => {
                                x.unOutput = x.planOutput - x.output;
                                return x;
                            });
                            return item;
                        });
                        this.getProcessMachine();
                        // console.log(_this.originTotalNum);
                    }
                });
            }
        });
    }
};
</script>

<style scoped>
    .disSpan{
        display: inline-block;
        width: 300px;
    }
    .marginRight{
        font-weight: bold;
    }
</style>

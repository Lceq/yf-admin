<template>
    <Card class="car-bar">
        <global-loading v-show="showGlobalLoading"></global-loading>
        <Row type="flex" justify="end">
            <Col class="flex-left">
                <div>
                    <Select v-model="workshopId" class="searchHurdles queryBarMarginRight">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                </div>
                <div>
                    <DatePicker :clearable="false" v-model="dateValue" type="date" placeholder="请选择日期" class="searchHurdles queryBarMarginRight"></DatePicker>
                </div>
                <Button icon="ios-search" type="primary" @click="queryBarSearchClickEvent" class="queryButtonStyle queryBarMarginRight">搜索</Button>
                <Button type="success" @click="exportEvent" class="queryButtonStyle">导出</Button>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col>
                <Table ref="tableCsv" :height="tableHeight" border :columns="columns" :data="tableData" size="small"></Table>
                <div style="display: flex;justify-content: flex-end">
                    <p style="line-height: 36px;">合计：</p>
                    <p class="total-num-box total-bar-item border-right-none">{{openNumTotal}}</p>
                    <p class="total-num-box total-bar-item border-right-none">{{kgOutputTotal}}</p>
                    <p class="total-num-box total-bar-item border-right-none">{{productionQtyTotal}}</p>
                    <p class="total-num-box total-bar-item border-right-none">{{completionQtyTotal}}</p>
                    <p class="total-num-box total-bar-item border-right-none">{{residualTotal}}</p>
                    <p class="total-num-box total-bar-item"></p>
                </div>
            </Col>
        </Row>
        <Row class="footer">
            <Col span="2" class="output-item">备注:</Col>
            <Col span="22">
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4" v-for="(item, index) in processOutput" :key="index" class="flex-left">
                        <p class="output-item">{{item.processName}}产量：{{item.output}}</p>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Card>
</template>
<script>
    import excel from '@/libs/excel'
    import { toDay, formatDate, mathJsAdd } from '../../libs/common';
    export default {
        data () {
            return {
                columns: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 90,
                        align: 'center'
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        minWidth: 160,
                        align: 'left',
                        sortable: true
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 100,
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '特数',
                        key: 'numbers',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '支数',
                        key: 'yarnCount',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '锭速(r/m)',
                        key: 'spindleSpeed',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '捻系数',
                        key: 'twistMultiplier',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '捻度(T/m)',
                        key: 'twist',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '台数',
                        key: 'openNum',
                        width: 100,
                        fixed: 'right',
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '总产(kg)',
                        key: 'kgOutput',
                        width: 100,
                        fixed: 'right',
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '订单(kg)',
                        key: 'productionQty',
                        width: 100,
                        fixed: 'right',
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '已完成(kg)',
                        key: 'completionQty',
                        width: 100,
                        fixed: 'right',
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '剩余(kg)',
                        key: 'residual',
                        width: 100,
                        fixed: 'right',
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '交期',
                        key: 'deliveryDate',
                        width: 100,
                        fixed: 'right',
                        align: 'center',
                        sortable: true
                    }
                ],
                tableData: [],
                workshopList: [],
                workshopId: null,
                dateValue: toDay(),
                showGlobalLoading: false,
                processOutput: [],
                openNumTotal: 0,
                kgOutputTotal: 0,
                productionQtyTotal: 0,
                completionQtyTotal: 0,
                residualTotal: 0,
                tableHeight: 0
            };
        },
        methods: {
            exportEvent () {
                let dataList = JSON.parse(JSON.stringify(this.tableData));
                dataList.push({
                    twist: '合计：',
                    openNum: this.openNumTotal,
                    kgOutput: this.kgOutputTotal,
                    productionQty: this.productionQtyTotal,
                    completionQty: this.completionQtyTotal,
                    residual: this.residualTotal,
                });
                this.processOutput.forEach(item => {
                    dataList.push({
                        productName: '工序产量：',
                        batchCode: item.processName,
                        numbers: item.output
                    });
                });
                const params = {
                    title: this.columns.map(item => item.title),
                    key: this.columns.map(item => item.key),
                    data: dataList,
                    autoWidth: true,
                    filename: '生产日报表'
                }
                excel.export_array_to_excel(params)
            },
            queryBarSearchClickEvent () {
                this.getListRequest();
            },
            getWorkshopListRequest () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        this.workshopId = res.data.res.defaultDeptId;
                        this.workshopList = res.data.res.userData;
                    };
                })
            },
            getListRequest () {
                this.dateValue ? this.dateValue = formatDate(this.dateValue).split(' ')[0] : this.dateValue = '';
                return this.$call('statistic.daily.output', {
                    date: this.dateValue,
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.openNumTotal = 0;
                        this.kgOutputTotal = 0;
                        this.productionQtyTotal = 0;
                        this.completionQtyTotal = 0;
                        this.residualTotal = 0;
                        responseData.outputDailyList.forEach(item => {
                            this.openNumTotal = mathJsAdd(this.openNumTotal, item.openNum);
                            this.kgOutputTotal = mathJsAdd(this.kgOutputTotal, item.kgOutput);
                            this.productionQtyTotal = mathJsAdd(this.productionQtyTotal, item.productionQty);
                            this.completionQtyTotal = mathJsAdd(this.completionQtyTotal, item.completionQty);
                            this.residualTotal = mathJsAdd(this.residualTotal, item.residual);
                        });
                        this.tableData = responseData.outputDailyList;
                        this.processOutput = responseData.processOutput;
                        this.showGlobalLoading = false;
                        this.$nextTick(() => { this.calculationTableHeight(); });
                    };
                })
            },
            async getDependentDataHttp () {
                await this.getWorkshopListRequest();
                await this.getListRequest();
            },
            calculationTableHeight () {
                let footerBarHeight = document.getElementsByClassName('footer')[0].offsetHeight;
                this.tableHeight = document.documentElement.clientHeight - footerBarHeight - 250;
                window.onresize = () => {
                    let footerBarHeight = document.getElementsByClassName('footer')[0].offsetHeight;
                    this.tableHeight = document.documentElement.clientHeight - footerBarHeight - 250;
                    this.tableHeight = document.documentElement.clientHeight - footerBarHeight - 250;
                }
            }
        },
        created () {
            this.showGlobalLoading = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>
<style>
    .output-item {
        line-height: 32px;
    }
    .total-bar-item {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: right;
    }
</style>

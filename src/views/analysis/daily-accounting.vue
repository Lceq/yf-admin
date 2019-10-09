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
                initColumns: [
                    {
                        title: '序号',
                        key: 'index',
                        width: 90,
                        align: 'center',
                        fixed: 'left'
                    },
                    {
                        title: '品种',
                        key: 'productName',
                        minWidth: 160,
                        align: 'left',
                        sortable: true,
                        fixed: 'left'
                    },
                    {
                        title: '本月订单',
                        key: 'productionQty',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '开台',
                        key: 'openingNumber',
                        minWidth: 100,
                        align: 'right',
                        sortable: true
                    },
                    {
                        title: '品种日产',
                        minWidth: 100,
                        align: 'right',
                        children: [
                            {
                                title: '公斤',
                                key: 'productDailyYield',
                                align: 'right',
                                minWidth: 100
                            }
                        ]
                    },
                    {
                        title: '细纱管',
                        minWidth: 200,
                        children: [
                            {
                                title: '标识',
                                key: 'yarnTubeColor',
                                minWidth: 200
                            }
                        ]
                    },
                    {
                        title: '纸管',
                        minWidth: 150,
                        children: [
                            {
                                title: '标识',
                                key: 'paperTubeColor',
                                minWidth: 150
                            }
                        ]
                    }
                ],
                columns: [],
                tableData: [],
                workshopList: [],
                workshopId: null,
                dateValue: toDay(),
                showGlobalLoading: false,
                processOutput: [],
                openNumTotal: 0,
                productDailyYieldTotal: 0,
                productionQtyTotal: 0,
                surplusQtyTotal: 0,
                tableHeight: 0
            };
        },
        methods: {
            exportEvent () {
                let dataList = JSON.parse(JSON.stringify(this.tableData));
                const params = {
                    title: this.columns.map(item => item.title),
                    key: this.columns.map(item => {
                        let keys = null;
                        if (item.key) {
                            keys = item.key;
                        } else if (item.children) {
                            keys = item.children[0].key;
                        };
                        return keys
                    }),
                    data: dataList,
                    autoWidth: true,
                    filename: '生产日报表'
                };
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
                return this.$call('statistic.daily.calculate.output', {
                    date: this.dateValue,
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        responseData.dailyCalculateList.forEach((item, index) => {
                            // 创建一个属性，格式如：'2019-06-05': 100
                            item.dailyList.forEach(dateItem => item[dateItem.daily] = dateItem.dailyQty);
                        });
                        let dateHeader = [];
                        let totalObj = {};
                        responseData.monthDateList.forEach(item => totalObj[item] = 0);
                        responseData.monthDateList.forEach(item => {
                            dateHeader.push({ key: item, title: item, minWidth: 120, align: 'right' });
                            this.openNumTotal = 0;
                            this.productDailyYieldTotal = 0;
                            this.productionQtyTotal = 0;
                            this.surplusQtyTotal = 0;
                            responseData.dailyCalculateList.forEach(dataItem => {
                                this.openNumTotal = mathJsAdd(this.openNumTotal, dataItem.openingNumber); // 开台合计
                                this.productDailyYieldTotal = mathJsAdd(this.productDailyYieldTotal, dataItem.productDailyYield); // 品种日产合计
                                this.productionQtyTotal = mathJsAdd(this.productionQtyTotal, dataItem.totalQty); // 合计
                                this.surplusQtyTotal = mathJsAdd(this.surplusQtyTotal, dataItem.surplusQty); // 剩余订单
                                totalObj[item] = mathJsAdd(totalObj[item], dataItem[item]); // 日期合计
                            });
                        });
                        totalObj.openingNumber = this.openNumTotal;
                        totalObj.productDailyYield = this.productDailyYieldTotal;
                        totalObj.totalQty = this.productionQtyTotal;
                        totalObj.surplusQty = this.surplusQtyTotal;
                        totalObj.batchCode = '合计：';
                        dateHeader.push({ key: 'totalQty', title: '合计', minWidth: 120, align: 'right' });
                        dateHeader.push({ key: 'surplusQty', title: '剩余订单', minWidth: 120, align: 'right' });
                        this.columns = [...this.initColumns, ...dateHeader]
                        this.tableData = responseData.dailyCalculateList.map((item, index) => {
                            item.index = index + 1;
                            return item;
                        });
                        this.tableData.push(totalObj)
                        this.processOutput = responseData.processOutput;
                        this.$nextTick(() => this.calculationTableHeight());
                        this.showGlobalLoading = false;
                    };
                })
            },
            // 获取依赖数据
            async getDependentDataHttp () {
                await this.getWorkshopListRequest();
                await this.getListRequest();
            },
            calculationTableHeight () {
                this.tableHeight = document.documentElement.clientHeight - 250;
                window.onresize = () => {
                    this.tableHeight = document.documentElement.clientHeight - 250;
                }
            }
        },
        created () {
            this.showGlobalLoading = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(() => this.calculationTableHeight());
        }
    };
</script>

<template>
    <div>
        <Card :style="'height:' + cardHeight + 'px'">
            <Row class="parentFlexBetween" id="selectedHeight">
                <Col class="leftFlex marginBottom">
                    <select-date
                        @change-date="changeDate"
                        :dateId="dateId"
                    >
                    </select-date>
                </Col>
                <Col>
                    <span class="formSpanStyle">开始日期：</span>
                    <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                    <span class="formSpanStyle">结束日期：</span>
                    <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                    <span class="formSpanStyle">车间：</span>
                    <Select class="formEachStyle textLeft" clearable v-model="currentWorkshopId">
                        <Option v-for="item in reportWorkshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Input class="formEachStyle" v-model="productCodeName" placeholder="请输入品种" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row>
                <Col id="tableHeight">
                    <Table border ref="selection" :height="reportHeight" :loading="reportLoading" size="small" :data="reportList" :columns="reportColumns"></Table>
                </Col>
                <Col>
                    <Table style="margin-top: -1px;" :no-data-text="''" size="small" :data="totalList" :columns="reportColumns" :show-header="false"></Table>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import excel from '../../libs/excel.js';
    import {curDate} from "../../libs/tools";
    import { reportList, getReportList } from './report-list';
    import selectDate from './select-date';
    export default {
        name: 'group-output',
        components: {
            selectDate
        },
        data () {
            return {
                dateId: 1,
                cardHeight: '',
                dateFrom: curDate(),
                dateTo: curDate(),
                productCodeName: '',
                currentWorkshopId: '',
                reportWorkshopList: [],
                exportLoading: false,
                reportLoading: false,
                reportHeight: '',
                middleList: [],
                reportList: [],
                totalList: [
                    {
                        belongDate: '汇总'
                    }
                ],
                reportColumns: [
                    {
                        title: '日期',
                        key: 'belongDate',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '工段',
                        align: 'left',
                        sortable: true,
                        minWidth: 90,
                        key: 'typeName'
                    },
                    {
                        title: '工序',
                        align: 'center',
                        sortable: true,
                        minWidth: 120,
                        key: 'processName'
                    },
                    {
                        title: '甲班',
                        align: 'center',
                        key: 'aGroupName',
                        children: [
                            {
                                title: '产量(kg)',
                                key: 'shiftQtyA',
                                align: 'right',
                                minWidth: 100
                            },
                            {
                                title: '运转效率%',
                                key: 'efficiencyPercentA',
                                align: 'right',
                                minWidth: 100
                            }
                        ]
                    },
                    {
                        title: '乙班',
                        align: 'center',
                        key: 'bGroupName',
                        children: [
                            {
                                title: '产量(kg)',
                                key: 'shiftQtyB',
                                align: 'right',
                                minWidth: 100
                            },
                            {
                                title: '运转效率%',
                                key: 'efficiencyPercentB',
                                align: 'right',
                                minWidth: 100
                            }
                        ]
                    },
                    {
                        title: '丙班',
                        align: 'center',
                        key: 'bGroupName',
                        children: [
                            {
                                title: '产量(kg)',
                                key: 'shiftQtyC',
                                align: 'right',
                                minWidth: 100
                            },
                            {
                                title: '运转效率%',
                                key: 'efficiencyPercentC',
                                align: 'right',
                                minWidth: 100
                            }
                        ]
                    }
                ]
            };
        },
        methods: {
            changeDate (val) {
                this.dateId = val.id;
                if (!this.dateId) {
                    this.reportList = [];
                    return false;
                }
                this.dateFrom = val.dateFrom;
                this.dateTo = val.dateTo;
                this.getReportList();
            },
            changeStartDate (val) {
                this.dateFrom = val;
                this.dateId = 0;
            },
            changeEndDate (val) {
                this.dateTo = val;
                this.dateId = 0;
            },
            searchResult () {
                this.getReportList();
            },
            exportExcel () {
                if (this.reportList.length) {
                    this.reportLoading = true;
                    const params = {
                        // title: ['一级分类', '二级分类', '三级分类'],
                        title: this.reportColumns.map(x => x.title),
                        // key: ['category1', 'category2', 'category3'],
                        key: this.reportColumns.map(x => x.key),
                        data: this.reportList.concat(this.totalList),
                        autoWidth: true,
                        filename: '班组产量统计'
                    };
                    excel.export_array_to_excel(params);
                    this.reportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            },
            getTotal () {
                let shiftQtyA = 0;
                let shiftQtyB = 0;
                let shiftQtyC = 0;
                // let planOutput = 0;
                // let valOutput = 0;
                this.reportList.map(x => {
                    shiftQtyA += x.shiftQtyA;
                    shiftQtyB += x.shiftQtyB;
                    shiftQtyC += x.shiftQtyC;
                    // valOutput += x.valOutput;
                });
                return this.totalList = [
                    {
                        belongDate: '汇总',
                        shiftQtyA: shiftQtyA.toFixed(2),
                        shiftQtyB: shiftQtyB.toFixed(2),
                        shiftQtyC: shiftQtyC.toFixed(2)
                    }
                ];
            },
            getReportList () {
                let params = {
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo,
                    productCodeName: this.productCodeName,
                    workshopId: this.currentWorkshopId
                };
                this.$call('statistic.output', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.reportList = content.res;
                        this.getTotal();
                    }
                });
            },
            // 判断是否有默认车间
            getUserWorkshop () {
                this.$api.dept.getUserWorkshop().then(res => {
                    this.currentWorkshopId = res.curWorkshopId;
                    this.reportWorkshopList = res.workshopList;
                    // this.reportList = this.getReportList();
                    // this.middleList = this.getReportList();
                    // this.getReportList();
                    // this.getTotal();
                });
            }
        },
        activated () {
        },
        created () {
        },
        mounted () {
            this.getUserWorkshop();
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.reportHeight = document.documentElement.clientHeight - H - 200;
            });
            window.onresize = () => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.reportHeight = document.documentElement.clientHeight - H - 200;
            };
        }
    };
</script>

<style scoped>

</style>

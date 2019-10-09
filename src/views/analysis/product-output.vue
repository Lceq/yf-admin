<template>
    <div>
        <Card  :style="'height:' + cardHeight + 'px'">
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
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight">
                <Col>
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
    import { reportList, getReportList } from './report-list';
    import {curDate} from "../../libs/tools";
    import selectDate from './select-date';
    export default {
        name: 'group-output',
        components: {
            selectDate
        },
        data () {
            return {
                totalList: [
                    {
                        belongDate: '汇总'
                    }
                ],
                cardHeight: '',
                dateId: 1,
                processList: [],
                processId: '',
                dateFrom: curDate(),
                dateTo: curDate(),
                currentWorkshopId: '',
                reportWorkshopList: [],
                exportLoading: false,
                reportLoading: false,
                reportHeight: '',
                reportList: [
                    {
                        productName: '',
                        batchCode: '',
                        openNames: '',
                        yelidOutput: '',
                        planOutput: '',
                        acOutput: '',
                        valOutput: ''
                    }
                ],
                middleList: [],
                reportColumns: [
                    {
                        title: '日期',
                        key: 'belongDate',
                        minWidth: 110,
                        align: 'left'
                    },
                    {
                        title: '品种',
                        align: 'left',
                        sortable: true,
                        minWidth: 100,
                        key: 'productName'
                    },
                    {
                        title: '批号',
                        align: 'left',
                        sortable: true,
                        minWidth: 100,
                        key: 'batchCode'
                    },
                    {
                        title: '工序',
                        align: 'center',
                        sortable: true,
                        minWidth: 80,
                        key: 'processName'
                    },
                    {
                        title: '开台数',
                        align: 'right',
                        minWidth: 90,
                        sortable: true,
                        key: 'openNum'
                    },
                    {
                        title: '台日产量（kg/天）',
                        align: 'right',
                        sortable: true,
                        minWidth: 110,
                        key: 'dateYield'
                    },
                    {
                        title: '理论产量（kg）',
                        align: 'right',
                        sortable: true,
                        minWidth: 110,
                        key: 'theoryQty'
                        // render: (h, params) => {
                        //     return h('span', {}, params.row.planOutput.toFixed(2));
                        // }
                    },
                    {
                        title: '实际产量（kg）',
                        align: 'right',
                        minWidth: 110,
                        sortable: true,
                        key: 'kgOutput'
                    },
                    {
                        title: '亏欠（kg）',
                        align: 'right',
                        sortable: true,
                        minWidth: 100,
                        key: 'deficit'
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
                this.getProductOutputList();
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
                // let List = this.reportList;
                // this.reportList = [];
                // this.reportList = this.middleList.filter(x => x.date >= this.dateFrom && x.date <= this.dateTo && x.workshopId === this.currentWorkshopId);
                this.getProductOutputList();
            },
            // exportExcel () {},
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
                        filename: '品种产量分析'
                    };
                    excel.export_array_to_excel(params);
                    this.reportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            },
            getTotal () {
                let openNum = 0;
                let kgOutput = 0;
                let theoryQty = 0;
                let deficit = 0;
                this.reportList.map(x => {
                    openNum += x.openNum;
                    kgOutput += x.kgOutput;
                    theoryQty += x.theoryQty;
                    deficit += x.deficit;
                });
                return this.totalList = [{
                    belongDate: '汇总',
                    openNum: openNum,
                    kgOutput: kgOutput.toFixed(2),
                    theoryQty: theoryQty.toFixed(2),
                    deficit: deficit.toFixed(2)
                }];
            },
            getProcess () {
                let params = {
                    auditState: 3,
                    state: 1
                };
                this.$call('process.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.processList = content.res;
                    }
                });
            },
            // getReportList () {
            //     // debugger;
            //     let data = [];
            //     let List = getReportList().filter(y => y.processName === '细纱');
            //     for (let i of List) {
            //         let obj = {};
            //         obj = data.find(x => x.productName === i.productName && x.batchCode === i.batchCode);
            //         if (obj) {
            //             obj.openNames++;
            //             obj.acOutput = Math.floor((obj.acOutput + i.acOutput) * 100) / 100;
            //             obj.planOutput = Math.floor((obj.planOutput + i.planOutput) * 100) / 100;
            //             obj.valOutput = (obj.planOutput - obj.acOutput).toFixed(2);
            //         } else {
            //             data.push(i);
            //         }
            //     }
            //     return data;
            // },
            getProductOutputList () {
                let params = {
                    workshopId: this.currentWorkshopId,
                    processId: this.processId,
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo
                };
                this.$call('statistic.analyze.output', params).then(res => {
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
                    // console.log(this.reportList)
                    // debugger
                    // this.middleList = this.getReportList();
                    // this.getProductOutputList();
                });
            }
        },
        activated () {
            // debugger
        },
        created () {
            // debugger
        },
        mounted () {
            // debugger;
            this.getProcess();
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

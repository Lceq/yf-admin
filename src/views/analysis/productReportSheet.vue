<template>
    <div>
        <Card :style="'height:' + cardHeight + 'px'">
            <Row class="parentFlexBetween" id="selectedHeight">
                <Col class="leftFlex marginBottom">
                    <select-date
                        @change-date="changeDate"
                        :dateId= "dateId"
                    >
                    </select-date>
                </Col>
                <Col>
                    <span class="formSpanStyle">开始日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                    <span class="formSpanStyle">结束日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                    <span class="formSpanStyle">车间：</span>
                    <Select class="formEachStyle textLeft" v-model="workshopId">
                        <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">品种：</span>
                    <Input class="formEachStyle" v-model="productCodeName" placeholder="请输入品种" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" @click="exportExcel" type="success">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight" class="marginBottom">
                <Col>
                    <Table :height="productReportHeight" size="small" border :loading="productReportLoading" :columns="productReportColumns" :data="productReportData"></Table>
                </Col>
                <Col>
                    <Table style="margin-top: -1px;" :no-data-text="''" size="small" :data="totalList" :columns="productReportColumns" :show-header="false"></Table>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    // import publicJs from '../../libs/common';
    import excel from '../../libs/excel.js';
    import {curDate} from '../../libs/tools';
    import selectDate from './select-date';
    export default {
        components: {
            selectDate
        },
        data () {
            return {
                dateId: 1,
                totalList: [
                    {
                        belongDate: '汇总'
                    }
                ],
                dateFrom: curDate(),
                dateTo: curDate(),
                processList: [],
                workshopId: '',
                cardHeight: '',
                currentGroupId: '',
                processId: '',
                productReportShiftGroupList: [],
                workshopList: [],
                productCodeName: '',
                exportLoading: false,
                productReportColumns: [
                    {
                        title: '日期',
                        minWidth: 120,
                        align: 'left',
                        key: 'belongDate'
                    },
                    {
                        title: '品种',
                        minWidth: 120,
                        align: 'left',
                        key: 'productName'
                    },
                    {
                        title: '批号',
                        minWidth: 120,
                        align: 'left',
                        key: 'batchCode'
                    },
                    {
                        title: '工序',
                        minWidth: 120,
                        align: 'left',
                        key: 'processName'
                    },
                    {
                        title: '产量(米)',
                        minWidth: 120,
                        align: 'right',
                        key: 'output'
                    },
                    {
                        title: '产量(公斤)',
                        minWidth: 120,
                        align: 'right',
                        key: 'kgOutput'
                    },
                    {
                        title: '能耗',
                        minWidth: 120,
                        align: 'right',
                        key: 'electricEnergy'
                    }
                ],
                productReportData: [],
                productReportLoading: false,
                productReportHeight: '',
                productReportTotal: 0,
                productReportPageUp: 'top',
                productReportPageSize: 10,
                productReportPageOpts: ['10', '20']
            };
        },
        methods: {
            changeDate (val) {
                this.dateId = val.id;
                if (!this.dateId) {
                    this.productReportData = [];
                    return false;
                }
                this.dateFrom = val.dateFrom;
                this.dateTo = val.dateTo;
                this.searchResult();
            },
            //  获取所有工序
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
            // 判断时都有默认车间
            getUserWorkshop () {
                this.$api.dept.getUserWorkshop().then(res => {
                    this.workshopId = res.curWorkshopId;
                    this.workshopList = res.workshopList;
                    // this.getShiftGroup();
                });
            },
            // 改变开始时间
            changeStartDate (val) {
                this.dateFrom = val;
                this.dateId = 0;
            },
            changeEndDate (val) {
                this.dateTo = val;
                this.dateId = 0;
            },
            searchResult () {
                const _this = this;
                let params = {
                    dateFrom: this.dateFrom,
                    dateTo: this.dateTo,
                    workshopId: this.workshopId,
                    processId: this.processId,
                    productCodeName: this.productCodeName,
                    groupId: this.groupId
                };
                this.productReportLoading = false;
                this.$call('statistic.product.output', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.productReportData = [];
                        for (let i of content.res) {
                            if (i.productId !== null || i.productId !== undefined) {
                                _this.productReportData.push(i);
                            }
                        }
                        let Total = 0;
                        let TotalKg = 0;
                        if (content.res.length) {
                            for (let i of content.res) {
                                Total += parseFloat(i.output);
                                TotalKg += parseFloat(i.kgOutput === null ? 0 : i.kgOutput);
                            }
                            this.totalList = [
                                {
                                    belongDate: '汇总',
                                    output: Total.toFixed(2),
                                    kgOutput: TotalKg.toFixed(2)
                                }
                            ];
                        }
                        _this.productReportLoading = false;
                    }
                });
            },
            exportExcel () {
                if (this.productReportData.length) {
                    this.exportLoading = true;
                    const params = {
                        // title: ['一级分类', '二级分类', '三级分类'],
                        title: this.productReportColumns.map(x => x.title),
                        // key: ['category1', 'category2', 'category3'],
                        key: this.productReportColumns.map(x => x.key),
                        data: this.productReportData,
                        autoWidth: true,
                        filename: '品种产量报表'
                    };
                    excel.export_array_to_excel(params);
                    this.exportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            }
        },
        mounted () {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.productReportHeight = document.documentElement.clientHeight - H - 200;
            });
            window.onresize = () => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.productReportHeight = document.documentElement.clientHeight - H - 200;
            };
            // let tableHeight = document.getElementById('tableHeight').offsetTop;
            // this.productReportHeight = document.documentElement.clientHeight - tableHeight - 40;
            // window.onresize = () => {
            //     let tableHeight = document.getElementById('tableHeight').offsetTop;
            //     this.productReportHeight = document.documentElement.clientHeight - tableHeight - 150;
            // };
        },
        created () {
            this.getProcess();
            this.getUserWorkshop();
        }
    };
</script>

<style scoped>

</style>

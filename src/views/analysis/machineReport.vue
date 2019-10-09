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
                    <DatePicker class="formEachStyle"@on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="true" :value="dateTo"></DatePicker>
                    <span class="formSpanStyle">选择车间：</span>
                    <Select class="formEachStyle textLeft" v-model="workshopId">
                        <Option v-for="item in machineReportWorkshopList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">设备机台：</span>
                    <Input class="formEachStyle" v-model="machineCodeName" placeholder="请输入设备机台" />
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">品种：</span>
                    <Input class="formEachStyle" v-model="productCodeName" placeholder="请输入品种" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight" class="marginBottom">
                <Col>
                    <Table :height="machineReportHeight" ref="machineReportExcel" :loading="machineReportLoading" size="small" border :columns="machineReportColumns" :data="machineReportData"></Table>
                </Col>
                <Col>
                    <Table style="margin-top: -1px;" :no-data-text="''" size="small" :data="totalList" :columns="machineReportColumns" :show-header="false"></Table>
                </Col>
            </Row>
            <!--<Row class="textRight">-->
                <!--<Col>-->
                    <!--<Page show-elevator show-total show-sizer :total="machineReportTotal" :placement="machineReportPageUp" :page-size="machineReportPageSize" :page-size-opts="machineReportPageOpts"></Page>-->
                <!--</Col>-->
            <!--</Row>-->
        </Card>
    </div>
</template>

<script>
import publicJs from '../../libs/common';
import excel from '../../libs/excel.js';
import {curDate} from "../../libs/tools";
import selectDate from './select-date';

export default {
    name: 'machineReport',
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
            dateId: 1,
            machineReportLoading: false,
            machineReportWorkshopList: [],
            workshopId: '',
            cardHeight: '',
            machineCodeName: '',
            processId: '',
            productCodeName: '',
            curShift: '',
            processList: [],
            shiftList: [],
            exportLoading: false,
            machineReportColumns: [
                {
                    title: '日期',
                    key: 'belongDate',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '车间',
                    align: 'left',
                    sortable: true,
                    minWidth: 120,
                    key: 'workshopName'
                },
                // {
                //     title: '班次',
                //     align: 'center',
                //     sortable: true,
                //     minWidth: 90,
                //     fixed: 'left',
                //     key: 'shiftName'
                // },
                {
                    title: '工序',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'processName'
                },
                {
                    title: '设备编号',
                    align: 'left',
                    sortable: true,
                    minWidth: 120,
                    key: 'machineCode'
                },
                {
                    title: '品种',
                    align: 'left',
                    minWidth: 90,
                    sortable: true,
                    key: 'productName'
                },
                // {
                //     title: '开始时间',
                //     minWidth: 120,
                //     align: 'center',
                //     sortable: true,
                //     key: 'startTime'
                // },
                // {
                //     title: '结束时间',
                //     minWidth: 120,
                //     align: 'center',
                //     sortable: true,
                //     key: 'endTime'
                // },
                {
                    title: '产量(米)',
                    minWidth: 120,
                    align: 'right',
                    sortable: true,
                    key: 'output'
                },
                {
                    title: '产量(公斤)',
                    minWidth: 120,
                    align: 'right',
                    sortable: true,
                    key: 'kgOutput'
                },
                {
                    title: '能耗',
                    minWidth: 120,
                    align: 'right',
                    key: 'electricEnergy'
                }
            ],
            machineReportData: [],
            machineReportExcel: {},
            machineReportTotal: 6,
            machineReportPageIndex: 1,
            machineReportHeight: document.documentElement.clientHeight - 260,
            machineReportPageUp: publicJs.pageUp,
            machineReportPageSize: publicJs.pageSize,
            machineReportPageOpts: publicJs.pageOpts,
            dateFrom: curDate(),
            dateTo: curDate()
        };
    },
    methods: {
        changeDate (val) {
            this.dateId = val.id;
            if (!this.dateId) {
                this.machineReportData = [];
                return false;
            }
            this.dateFrom = val.dateFrom;
            this.dateTo = val.dateTo;
            this.searchResult();
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.workshopId = _this.machineReportWorkshopList[0].id;
                    } else {
                        _this.workshopId = content.res.id;
                    }
                }
            });
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
                machineCodeName: this.machineCodeName
            };
            this.machineReportLoading = true;
            this.$call('statistic.machine.output', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.machineReportData = [];
                    for (let i of content.res) {
                        if (i.productId !== null || i.productId !== undefined) {
                            _this.machineReportData.push(i);
                        }
                    }
                    let Total = 0;
                    let TotalKg = 0;
                    if (content.res.length) {
                        for (let i of content.res) {
                            Total += parseFloat(i.output === null ? 0 : i.output);
                            TotalKg += parseFloat(i.kgOutput === null ? 0 : i.kgOutput);
                        }
                        // _this.machineReportData.push({
                        //     belongDate: '汇总',
                        //     output: Total,
                        //     kgOutput: TotalKg
                        // });
                        _this.totalList = [
                            {
                                belongDate: '汇总',
                                output: Total.toFixed(2),
                                kgOutput: TotalKg.toFixed(2)
                            }
                        ];
                    }
                    _this.machineReportLoading = false;
                }
            });
        },
        exportExcel () {
            if (this.machineReportData.length) {
                this.exportLoading = true;
                const params = {
                    // title: ['一级分类', '二级分类', '三级分类'],
                    title: this.machineReportColumns.map(x => x.title),
                    // key: ['category1', 'category2', 'category3'],
                    key: this.machineReportColumns.map(x => x.key),
                    data: this.machineReportData.concat(this.totalList),
                    autoWidth: true,
                    filename: '机台产量报表'
                };
                excel.export_array_to_excel(params);
                this.exportLoading = false;
            } else {
                this.$Message.info('表格数据不能为空！');
            }
        }
    },
    computed: {
    },
    mounted () {
        this.$nextTick(() => {
            // let H = document.getElementById('selectedHeight').clientHeight;
            // this.machineReportHeight = document.documentElement.clientHeight - H - 170;
            if (document.getElementById('selectedHeight')) {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.machineReportHeight = document.documentElement.clientHeight - H - 200;
            }
        });
        window.onresize = () => {
            // let H = document.getElementById('selectedHeight').clientHeight;
            // this.machineReportHeight = document.documentElement.clientHeight - H - 170;
            if (document.getElementById('selectedHeight')) {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.machineReportHeight = document.documentElement.clientHeight - H - 200;
            }
        };
        // window.onresize = () => {
        //     let tableHeight = document.getElementById('tableHeight').offsetTop;
        //     this.machineReportHeight = document.documentElement.clientHeight - tableHeight - 185;
        // };
    },
    created () {
        // this.getStartDay();
        this.getProcess();
        // this.getShift();
        // 车间列表
        const _this = this;
        this.$fetch('dept/workshops').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                _this.machineReportWorkshopList = content.res;
                _this.getUserWorkshop();
            }
        });
    }
};
</script>

<style scoped>
</style>

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
                    <Select class="formEachStyle textLeft" :clearable="false" v-model="processId">
                    <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">班组：</span>
                    <Select class="formEachStyle textLeft" :clearable="false" v-model="groupId">
                        <Option v-for="item in groupReportShiftGroupList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">品种：</span>
                    <Input class="formEachStyle" v-model="productCodeName" placeholder="请输入品种" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" @click="exportExcel" type="success">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight" class="marginBottom">
                <Col>
                    <Table :height="groupReportHeight" size="small" border :loading="groupReportLoading" :columns="groupReportColumns" :data="groupReportData"></Table>
                </Col>
                <Col>
                    <Table style="margin-top: -1px;" :no-data-text="''" size="small" :data="totalList" :columns="groupReportColumns" :show-header="false"></Table>
                </Col>
            </Row>
            <!--<Row class="textRight">-->
                <!--<Col>-->
                    <!--<Page show-elevator show-total show-sizer :total="groupReportTotal" :placement="groupReportPageUp" :page-size="groupReportPageSize" :page-size-opts="groupReportPageOpts"></Page>-->
                <!--</Col>-->
            <!--</Row>-->
        </Card>
    </div>
</template>

<script>
    import excel from '../../libs/excel.js';
    import {curDate, page} from '../../libs/tools';
    import selectDate from './select-date';
    export default {
        name: 'userReport',
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
                cardHeight: '',
                groupReportLoading: false,
                dateFrom: curDate(),
                dateTo: curDate(),
                processId: '',
                processList: [],
                workshopId: '',
                groupId: '',
                groupReportShiftGroupList: [],
                workshopList: [{id: '', name: '',deptId:''}],
                productCodeName: '',
                exportLoading: false,
                groupReportColumns: [
                    {
                        title: '日期',
                        key: 'belongDate',
                        minWidth: 120,
                        align: 'left'
                    },
                    {
                        title: '车间',
                        minWidth: 120,
                        align: 'left',
                        key: 'workshopName'
                    },
                    {
                        title: '班组',
                        minWidth: 120,
                        align: 'left',
                        key: 'groupName'
                    },
                    {
                        title: '品种',
                        minWidth: 120,
                        align: 'left',
                        key: 'productName'
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
                groupReportData: [],
                groupReportHeight: '',
                groupReportTotal: 0,
                groupReportPageUp: page().pageUp,
                groupReportPageSize: page().pageSize,
                groupReportPageOpts: page().pageOpts
            };
        },
        methods: {
            changeDate (val) {
                this.dateId = val.id;
                if (!this.dateId) {
                    this.groupReportData = [];
                    return false;
                }
                this.dateFrom = val.dateFrom;
                this.dateTo = val.dateTo;
                this.searchResult();
            },
            // 获取工序列表
            // 判断时都有默认车间
            getUserWorkshop () {
                this.$api.dept.getUserWorkshop().then(res => {
                    this.workshopId = res.curWorkshopId;
                    this.workshopList = res.workshopList;
                    this.getShiftGroup();
                });
            },
            // 根据车间判断车间班组信息
            getShiftGroup () {
                const _this = this;
                this.$fetch('dept/groups?parentid=' + this.workshopId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.groupReportShiftGroupList = content.res;
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
            // 改变开始时间
            changeStartDate (val) {
                this.dateFrom = val;
                this.dateId = 0;
            },
            changeEndDate (val) {
                this.dateTo = val;
                this.dateId = 0;
            },
            // 搜索
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
                _this.groupReportLoading = true;
                this.$call('statistic.group.output', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.groupReportData = [];
                        for (let i of content.res) {
                            if (i.productId !== null || i.productId !== undefined) {
                                _this.groupReportData.push(i);
                            }
                        }
                        let Total = 0;
                        let TotalKg = 0;
                        if (content.res.length) {
                            for (let i of content.res) {
                                Total += parseFloat(i.output);
                                TotalKg += parseFloat(i.kgOutput === null ? 0 : i.kgOutput);
                            }
                            _this.totalList = [{
                                belongDate: '汇总',
                                output: Total.toFixed(2),
                                kgOutput: TotalKg.toFixed(2)
                            }];
                        }
                        _this.groupReportLoading = false;
                    }
                });
            },
            // 到处表格
            exportExcel () {
                if (this.groupReportData.length) {
                    this.exportLoading = true;
                    const params = {
                        // title: ['一级分类', '二级分类', '三级分类'],
                        title: this.groupReportColumns.map(x => x.title),
                        // key: ['category1', 'category2', 'category3'],
                        key: this.groupReportColumns.map(x => x.key),
                        data: this.groupReportData.concat(this.totalList),
                        autoWidth: true,
                        filename: '班组产量报表'
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
                this.groupReportHeight = document.documentElement.clientHeight - H - 200;
            });
            window.onresize = () => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 120;
                this.groupReportHeight = document.documentElement.clientHeight - H - 200;
            };
        },
        created () {
            this.getProcess();
            this.getUserWorkshop();
        }
    };
</script>

<style scoped>

</style>

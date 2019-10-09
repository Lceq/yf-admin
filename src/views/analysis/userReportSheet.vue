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
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">班组：</span>
                    <Select class="formEachStyle textLeft" v-model="groupId">
                        <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">人员姓名：</span>
                    <Input class="formEachStyle" v-model="userReporName" placeholder="请输入人员姓名" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight">
                <Col>
                    <Table ref="selection" border :height="userReportHeight" :loading="userReportLoading" size="small" :data="userReportData" :columns="userReportColumns"></Table>
                </Col>
                <Col>
                    <Table style="margin-top: -1px;" :no-data-text="''" size="small" :data="totalList" :columns="userReportColumns" :show-header="false"></Table>
                </Col>
            </Row>
            <!--<Row class="textRight">-->
                <!--<Col span="24">-->
                    <!--<Page show-elevator show-total show-sizer :total="userReportTotal" :placement="userReportPageUp" :page-size="userReportPageSize" :page-size-opts="userReportPageOpts"></Page>-->
                <!--</Col>-->
            <!--</Row>-->
        </Card>
    </div>
</template>

<script>
// import publicJs from '../public/public-js/publiceJs';
import excel from '../../libs/excel.js';
import {curDate} from '../../libs/tools';
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
            cardHeight: '',
            dateId: 1,
            userReportLoading: false,
            dateFrom: curDate(),
            dateTo: curDate(),
            processId: '',
            workshopId: '',
            processList: [],
            groupId: '',
            groupList: [{
                id: '',
                name: ''
            }],
            workshopList: [{id: '', name: '',deptId:''}],
            userReporName: '',
            exportLoading: false,
            userReportColumns: [
                {
                    title: '日期',
                    key: 'belongDate',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '人员',
                    key: 'userName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '机台',
                    key: 'machineName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '岗位',
                    key: 'postName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '工序',
                    key: 'processName',
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '品种',
                    key: 'productName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '当前米数',
                    key: 'output',
                    minWidth: 120,
                    align: 'right'
                },
                {
                    title: '当前斤数',
                    key: 'kgOutput',
                    minWidth: 120,
                    align: 'right'
                }
            ],
            userReportData: [],
            userReportHeight: null
            // userReportTotal: 0,
            // userReportPageUp: 'top',
            // userReportPageSize: 10,
            // userReportPageOpts: ['10', '20']
        };
    },
    methods: {
        changeDate (val) {
            this.dateId = val.id;
            if (!this.dateId) {
                this.userReportData = [];
                return false;
            }
            this.dateFrom = val.dateFrom;
            this.dateTo = val.dateTo;
            this.searchResult();
        },
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
                    _this.groupList = content.res;
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
        searchResult () {
            const _this = this;
            let params = {
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                workshopId: this.workshopId,
                processId: this.processId,
                groupId: this.groupId,
                userName: this.userReporName
            };
            _this.userReportLoading = true;
            this.$call('statistic.user.output', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // _this.userReportData = content.res;
                    _this.userReportData = [];
                    for (let i of content.res) {
                        if (i.productId !== null || i.productId !== undefined) {
                            _this.userReportData.push(i);
                        }
                    }
                    let Total = 0;
                    let TotalKg = 0;
                    if (content.res.length) {
                        for (let i of content.res) {
                            Total += parseFloat(i.output);
                            TotalKg += parseFloat(i.kgOutput === null ? 0 : i.kgOutput);
                        }
                        this.totalList = [{
                            belongDate: '汇总',
                            output: Total.toFixed(2),
                            kgOutput: TotalKg.toFixed(2)
                        }];
                    }
                    _this.userReportLoading = false;
                }
            });
        },
        exportExcel () {
            if (this.userReportData.length) {
                this.exportLoading = true;
                const params = {
                    // title: ['一级分类', '二级分类', '三级分类'],
                    title: this.userReportColumns.map(x => x.title),
                    // key: ['category1', 'category2', 'category3'],
                    key: this.userReportColumns.map(x => x.key),
                    data: this.userReportData.concat(this.totalList),
                    autoWidth: true,
                    filename: '人员产量报表'
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
            this.userReportHeight = document.documentElement.clientHeight - H - 200;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.cardHeight = document.documentElement.clientHeight - 120;
            this.userReportHeight = document.documentElement.clientHeight - H - 200;
        };
        // this.$nextTick(() => {
        //     let H = document.getElementById('selectedHeight').clientHeight;
        //     this.userReportHeight = document.documentElement.clientHeight - H - 160;
        // });
        // window.onresize = () => {
        //     let H = document.getElementById('selectedHeight').clientHeight;
        //     this.userReportHeight = document.documentElement.clientHeight - H - 160;
        // };
    },
    created () {
        this.getProcess();
        this.getUserWorkshop();
    },
    computed: {
        Today: () => {
            const date = new Date();
            const seperator1 = '-';
            const year = date.getFullYear();
            const month = parseInt(date.getMonth() + 1) < 10 ? '0' + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
            const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
    }
};
</script>
<style>
    .overf{
        width: 100%;
        height: 720px;
        overflow: hidden;
    }
    #example-container{
        overflow: auto;
        width: 100%;
        height: 100%;
    }
</style>

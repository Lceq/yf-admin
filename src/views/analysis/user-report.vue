<template>
    <div>
        <Card>
            <Row class="parentFlex">
                <Col>
                    <span class="formSpanStyle">开始日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="beginTime"></DatePicker>
                    <span class="formSpanStyle">结束日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="endTime"></DatePicker>
                    <span class="formSpanStyle">车间：</span>
                    <Select class="formEachStyle textLeft" v-model="currentWorkshopId">
                        <Option v-for="item in userReportWorkshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle">班组：</span>
                    <Select class="formEachStyle textLeft" v-model="currentGroupId">
                        <Option v-for="item in userReportShiftGroupList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">人员姓名：</span>
                    <Input class="formEachStyle" v-model="userReporName" placeholder="请输入人员姓名" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight">
                <Col>
                    <Table ref="selection" :height="userReportHeight" :loading="userReportLoading" size="small" :data="userReportData" :columns="userReportColumns"></Table>
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
import { reportList, getReportList } from './report-list';
// import publicJs from '../public/public-js/publiceJs';
import excel from '../../libs/excel.js';
export default {
    name: 'userReport',
    data () {
        return {
            userReportLoading: false,
            beginTime: '2018-10-27',
            endTime: '2018-10-27',
            currentWorkshopId: '',
            processList: [],
            currentGroupId: '',
            userReportShiftGroupList: [],
            userReportWorkshopList: [{id: '', name: ''}],
            userReporName: '',
            exportLoading: false,
            userReportColumns: [
                {
                    title: '车间',
                    key: 'workshopName'
                },
                {
                    title: '班组',
                    key: 'groupName'
                },
                {
                    title: '人员',
                    key: 'userName'
                },
                {
                    title: '品种',
                    key: 'productName'
                },
                {
                    title: '当前米数',
                    key: 'userMetres'
                },
                {
                    title: '当前斤数',
                    key: 'userOutputKg'
                }
            ],
            userReportData: [],
            middleList: [],
            userReportHeight: '',
            userReportTotal: 0,
            userReportPageUp: 'top',
            userReportPageSize: 10,
            userReportPageOpts: ['10', '20']
        };
    },
    methods: {
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.currentWorkshopId = res.curWorkshopId;
                this.userReportWorkshopList = res.workshopList;
                this.userReportData = this.getReportList();
                this.middleList = this.userReportData;
                this.getShiftGroup();
            });
        },
        getTotal () {
            let userMetres = 0;
            // let userOutputKg = 0;
            this.userReportData.map(x => {
                userMetres += x.userMetres;
                // userOutputKg += x.userOutputKg;
            });
            return this.userReportData.push({
                userMetres: userMetres.toFixed(2)
                // userOutputKg: userOutputKg.toFixed(2)
            });
        },
        // 根据车间判断车间班组信息
        getShiftGroup () {
            const _this = this;
            this.$fetch('dept/groups?parentid=' + this.currentWorkshopId).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.getTotal();
                    _this.userReportShiftGroupList = content.res;
                }
            });
        },
        changeStartDate (val) {
            this.beginTime = val;
        },
        changeEndDate (val) {
            this.endTime = val;
        },
        searchResult () {
            this.userReportData = [];
            let ListA = [];
            let ListB = [];
            let ListC = [];
            ListA = this.middleList.filter(x => x.date >= this.beginTime && x.date <= this.endTime && x.workshopId === this.currentWorkshopId);
            if (this.currentGroupId) {
                ListB = ListA.filter(x => x.groupId === this.currentGroupId);
            } else {
                ListB = ListA;
            }
            if (this.userReporName) {
                ListC = ListB.filter(x => x.userName.includes(this.userReporName));
            } else {
                ListC = ListB;
            }
            this.userReportData = ListC;
        },
        getReportList () {
            let dataA = [];
            let dataB = [];
            let List = getReportList();
            for (let i of List) {
                if (dataA.find(x => x.aUser === i.aUser && x.productName === i.productName)) {
                    let obj = dataA.find(x => x.aUser === i.aUser && x.productName === i.productName);
                    obj.userMetres = Math.floor((obj.aOutput + i.aOutput) * 100) / 100;
                } else {
                    i.groupId = i.aGroupId;
                    i.groupName = i.aGroupName;
                    i.userName = i.aUser;
                    i.userMetres = i.aOutput;
                    dataA.push(i);
                }
            }
            for (let i of List) {
                if (dataB.find(x => x.bUser === i.bUser && x.productName === i.productName)) {
                    let obj = dataB.find(x => x.bUser === i.bUser && x.productName === i.productName);
                    obj.userMetres = Math.floor((obj.bOutput + i.bOutput) * 100) / 100;
                } else {
                    i.groupId = i.bGroupId;
                    i.groupName = i.bGroupName;
                    i.userName = i.bUser;
                    i.userMetres = i.bOutput;
                    dataB.push(i);
                }
            }
            return dataA.concat(dataB);
        },
        exportExcel () {
            if (this.userReportData.length) {
                this.exportLoading = true;
                const params = {
                    title: this.userReportColumns.map(x => x.title),
                    key: this.userReportColumns.map(x => x.key),
                    data: this.userReportData,
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
        this.getUserWorkshop();
        let tableHeight = document.getElementById('tableHeight').offsetTop;
        this.userReportHeight = document.documentElement.clientHeight - tableHeight - 80;
        window.onresize = () => {
            let tableHeight = document.getElementById('tableHeight').offsetTop;
            this.userReportHeight = document.documentElement.clientHeight - tableHeight - 140;
        };
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

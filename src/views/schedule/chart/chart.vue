<template>
    <div>
        <Card id="chart" class="cardClass" :style="'height:' + tableHeight + 'px'">
            <Row>
                <Col class="">
                    <span class="formSpanStyle transfer-class">车间：</span>
                    <Select class="transfer-class formEachStyle textLeft transfer-class-name" @on-change="changeWorkshop" v-model="workshopId">
                        <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle transfer-class">日期：</span>
                    <!--<DatePicker :clearable="false" v-model="dateValue" type="date" placeholder="请选择日期" class="searchHurdles queryBarMarginRight"></DatePicker>-->
                    <DatePicker class="formEachStyle" @on-change="changeTime" :value="date" type="date" format="yyyy-MM-dd"  placeholder="请选择时间" style="width: 150px; margin-right: 10px;"></DatePicker>
                    <span class="formSpanStyle transfer-class">班次：</span>
                    <Select class="transfer-class formEachStyle textLeft transfer-class-name" @on-change="changeShift" v-model="shiftId">
                        <Option v-for="item in shiftList"  :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
                    </Select>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" type="primary" shape="circle" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>
                </Col>
            </Row>
            <Row>
                <Col span="16" :style="'height:' + chartHeight + 'px; padding: 10px;'">
                    <div class="mainColour">
                        <renovate :pieMath="pieMath" :pieList="pieList" :height="chartHeight"></renovate>
                    </div>
                </Col>
                <Col span="8" :style="'height:' + chartHeight + 'px; padding: 10px'">
                    <div class="mainColour">
                        <user :attendanceMath="attendanceMath" :attendanceList="attendanceList" :height="chartHeight / 2"></user>
                        <Table id="view-pack" class="xw-chart-Table" border :data="userList" :columns="userColumns" :height="chartHeight / 2"></Table>
                    </div>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import user from './user';
import renovate from './renove';
import {curDate} from "../../../libs/tools";
// import machineModal from '../renovate/modal';
export default {
    name: 'chart',
    components: {
        renovate,
        user
        // machineModal
    },
    data () {
        return {
            userColumns: [
                {
                    title: '员工编号',
                    key: 'userCode',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '姓名',
                    key: 'userName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '缺勤原因',
                    key: 'cause',
                    minWidth: 100,
                    align: 'left'
                }
            ],
            userList: [],
            shiftId: '',
            shiftList: [],
            qualityShow: false,
            workshopId: '',
            workshopList: [],
            pieMath: null,
            attendanceMath: null,
            pieList: [],
            attendanceList: {},
            chartHeight: null,
            tableHeight: null,
            date: curDate(),
            disposeId: '',
            qmTestId: '',
            qmTypeId: '',
            scheduleId: '',
            value: false,
            fullScreen: true
        };
    },
    methods: {
        expandCharts () {
            const main = document.getElementById('chart');
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.fullScreen = true;
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
                this.fullScreen = false;
            }
            this.value = !this.value;
        },
        changeWorkshop () {
            this.getScheduleTime();
        },
        changeTime (val) {
            this.date = val;
            this.getScheduleTime();
        },
        changeShift () {
            if (this.shiftList.length) {
                this.scheduleId = this.shiftList.find(x => x.shiftId === this.shiftId).id;
            }
        },
        getScheduleTime (val) {
            let params = {
                belongDate: this.date,
                workshopId: this.workshopId
            };
            this.$call('schedule.list3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res.length === 0) {
                        this.$Message.warning('该时间点尚未排班');
                        this.shiftId = '';
                        this.scheduleId = '';
                        this.shiftList = [];
                        return false;
                    }
                    this.shiftList = content.res;
                    this.scheduleId = content.res[0].id;
                    this.shiftId = content.res[0].shiftId;
                    if (val) {
                        if (!this.shiftId) {
                            this.$Message.warning('该时间点尚未排班');
                            return false;
                        }
                        this.getPieList();
                        this.attendanceAnalyze();
                    }
                }
            });
        },
        searchResult () {
            if (!this.shiftId) {
                this.$Message.warning('该时间点尚未排班');
                return false;
            }
            this.getPieList();
            this.attendanceAnalyze();
        },
        getPieList () {
            let params = {
                scheduleId: this.scheduleId
            };
            this.$call('schedule.user.userWithProcess', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.pieList = content.res;
                    this.pieMath = Math.random();
                }
            });
        },
        attendanceAnalyze () {
            let params = {
                scheduleId: this.scheduleId
            };
            this.$call('schedule.user.attendanceAnalyze', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.attendanceList = content.res;
                    this.userList = content.res.userList;
                    this.attendanceMath = Math.random();
                }
            });
        },
        // 判断时都有默认车间
        getUserWorkshop (val) {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getScheduleTime(val);
            });
        }
    },
    mounted () {
        // this.renovateMath = Math.random();
        this.getUserWorkshop(1);
        this.$nextTick(() => {
            this.tableHeight = document.documentElement.clientHeight - 130;
            this.chartHeight = (this.tableHeight - 120);
        });
        window.onresize = () => {
            if (this.value) {
                this.chartHeight = (window.screen.height - 120);
                //
                // this.tableHeight = document.documentElement.clientHeight - 130;
                // this.chartHeight = (this.tableHeight - 120);
            } else {
                // this.tableHeight = document.documentElement.clientHeight - 130;
                this.tableHeight = document.documentElement.clientHeight - 130;
                this.chartHeight = (this.tableHeight - 120);
            }
            // this.tableHeight = document.documentElement.clientHeight - 130;
            // this.chartHeight = (this.tableHeight - 120);
            this.pieMath = Math.random();
            this.attendanceMath = Math.random();
        };
    }
};
</script>

<style scoped>
.main-charts{
    padding: 16px 16px 0 16px
}
.mainColour{
    background: #22272d;
    border:solid 1px #515970;
    padding: 10px;
    border-radius:4px;
}
.transfer-class{
    color: #fff;
}
.cardClass{
    background-color: #22272d !important;
}
</style>

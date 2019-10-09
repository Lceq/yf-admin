<!--<template>-->
<!--&lt;!&ndash;    <Card id="screen" :style="'height:' + theight + 'px'">&ndash;&gt;-->
    <!--<div id="tv" :style="'width: ' + width + 'px; height: ' + height + 'px;display: inline-block;'">-->
<!--&lt;!&ndash;        <div class="parentFlexBetween">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="left-parent">&ndash;&gt;-->
<!--&lt;!&ndash;                <img style="vertical-align: middle;height:24px;" class="" src="../../../images/zg.png"  alt="正凯" />&ndash;&gt;-->
<!--&lt;!&ndash;                <Select style="display: inline;line-height: 24px; width: 100px;" class="selectBackground textLeft margin-right-10" placeholder="请选择车间" clearable v-model="workshopId">&ndash;&gt;-->
<!--&lt;!&ndash;                    <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>&ndash;&gt;-->
<!--&lt;!&ndash;                </Select>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;                <Button class="" type="primary" shape="circle" size="large" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <p class="margin-right-10">{{ title }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;            <p>当前时间：{{ time }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="tech-bar parentFlexBetween">&ndash;&gt;-->
<!--&lt;!&ndash;            <div class="flex-left" v-for="item of region">&ndash;&gt;-->
<!--&lt;!&ndash;                <p class="margin-right-10">区域：{{ item.name }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;                <p class="margin-right-10">28℃</p>&ndash;&gt;-->
<!--&lt;!&ndash;                <p>56%</p>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
        <!--<Carousel-->
                <!--v-model="active"-->
                <!--:autoplay="false"-->
                <!--:radius-dot="false"-->
                <!--arrow="never"-->
                <!--dots="none"-->
        <!--&gt;-->
            <!--<CarouselItem>-->
                <!--<div class="process-bar">-->
                    <!--<xw-table-->
                            <!--:turn="turnOne"-->
                            <!--:height="height"-->
                            <!--:top="viewTop"-->
                            <!--@topTurn="viewTopTurn"-->
                            <!--:tableTitle="tableTitle"-->
                            <!--:tableList="tableList"-->
                    <!--&gt;-->
                    <!--</xw-table>-->
                <!--</div>-->
            <!--</CarouselItem>-->
            <!--<CarouselItem>-->
                <!--<div class="process-bar">-->
                    <!--<xw-table-two-->
                        <!--:turn="turnTwo"-->
                        <!--:height="height"-->
                        <!--:top="viewTwoTop"-->
                        <!--@topTurn="twoTopTurn"-->
                        <!--:tableTitle="tableWarnTitle"-->
                        <!--:tableList="tableWarnList"-->
                    <!--&gt;-->
                    <!--</xw-table-two>-->
                <!--</div>-->
            <!--</CarouselItem>-->
            <!--<CarouselItem>-->
                <!--<div class="process-bar">-->
                    <!--<xw-table-three-->
                        <!--:turn="turnThree"-->
                        <!--:height="height"-->
                        <!--:top="viewThreeTop"-->
                        <!--@topTurn="threeTopTurn"-->
                        <!--:tableTitle="tableThreeTitle"-->
                        <!--:tableList="tableThreeList"-->
                    <!--&gt;-->
                    <!--</xw-table-three>-->
                <!--</div>-->
            <!--</CarouselItem>-->
            <!--<CarouselItem>-->
                <!--<div class="process-bar">-->
                    <!--<xw-table-four-->
                            <!--:turn="turnFour"-->
                            <!--:height="height"-->
                            <!--:top="viewFourTop"-->
                            <!--@topTurn="fourTopTurn"-->
                            <!--:tableTitle="tableFourTitle"-->
                            <!--:tableList="tableFourList"-->
                    <!--&gt;-->
                    <!--</xw-table-four>-->
                <!--</div>-->
            <!--</CarouselItem>-->
        <!--</Carousel>-->
<!--&lt;!&ndash;        <div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div id="notice-bar" class="notice-bar">&ndash;&gt;-->
<!--&lt;!&ndash;                <p id="notice-content" class="notice-content" :style="'left:' + leftNotice + 'px;'">{{ noticeContent }}</p>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
<!--&lt;!&ndash;    </Card>&ndash;&gt;-->
    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--import {curDatetime} from '../../../libs/tools';-->
    <!--// import xwTable from '../../components/xw-table/xw-table';-->
    <!--import xwTable from './components/xw-table';-->
    <!--import xwTableTwo from './components/xw-table-two';-->
    <!--import xwTableThree from './components/xw-table-three';-->
    <!--import xwTableFour from './components/xw-table-four';-->
    <!--export default {-->
        <!--name: 'process-machine',-->
        <!--components: {-->
            <!--xwTable,-->
            <!--xwTableTwo,-->
            <!--xwTableThree,-->
            <!--xwTableFour-->
        <!--},-->
        <!--props: {-->
            <!--width: {-->
                <!--type: Number-->
            <!--},-->
            <!--height: {-->
                <!--type: Number-->
            <!--},-->
            <!--theight: {-->
                <!--type: Number-->
            <!--}-->
        <!--},-->
        <!--data () {-->
            <!--return {-->
                <!--region: '',-->
                <!--temperature: '28℃',-->
                <!--humidity: '28℃',-->
                <!--leftNotice: 0,-->
                <!--title: '',-->
                <!--turnOne: false,-->
                <!--turnTwo: false,-->
                <!--turnThree: false,-->
                <!--turnFour: false,-->
                <!--active: 0,-->
                <!--cardHeight: 0,-->
                <!--leftOne: 0,-->
                <!--leftTwo: 0,-->
                <!--viewTop: null,-->
                <!--viewTwoTop: null,-->
                <!--viewThreeTop: null,-->
                <!--viewFourTop: null,-->
                <!--// height: 0,-->
                <!--slideHeight: 0,-->
                <!--time: curDatetime(),-->
                <!--workshopId: '',-->
                <!--workshopList: [],-->
                <!--value: false,-->
                <!--techList: [-->
                    <!--{-->
                        <!--id: 1,-->
                        <!--name: '区域',-->
                        <!--code: '28℃'-->
                    <!--},-->
                    <!--{-->
                        <!--id: 2,-->
                        <!--name: '湿度',-->
                        <!--code: '28℃'-->
                    <!--},-->
                    <!--{-->
                        <!--id: 3,-->
                        <!--name: '湿度',-->
                        <!--code: '28℃'-->
                    <!--}-->
                <!--],-->
                <!--tableTitle: [-->
                    <!--{-->
                        <!--title: '人员编号',-->
                        <!--key: 'userCode',-->
                        <!--minWidth: 60,-->
                        <!--span: 5,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '人员姓名',-->
                        <!--key: 'userName',-->
                        <!--minWidth: 90,-->
                        <!--span: 5,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '班组',-->
                        <!--span: 5,-->
                        <!--key: 'groupName',-->
                        <!--minWidth: 60,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '是否缺勤',-->
                        <!--key: 'isAbsenteeism',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'left',-->
                        <!--render: (h, params) => {-->
                            <!--return h('span', {}, params.row.isAbsenteeism === true ? '是' : '否');-->
                        <!--}-->
                    <!--},-->
                    <!--{-->
                        <!--title: '日期',-->
                        <!--key: 'date',-->
                        <!--span: 5,-->
                        <!--minWidth: 60,-->
                        <!--align: 'right'-->
                    <!--}-->
                <!--],-->
                <!--tableList: [-->
                    <!--// {-->
                    <!--//     machineCode: '124123',-->
                    <!--//     productName: 'T/R65/35 JS50S',-->
                    <!--//     qty: '123',-->
                    <!--//     effect: '张三王',-->
                    <!--//     reportName: '',-->
                    <!--//     close: '11-14 12点',-->
                    <!--//     time: '5'-->
                    <!--// },-->
                    <!--// {-->
                    <!--//     machineCode: '124123',-->
                    <!--//     productName: 'T/R65/35 JS50S',-->
                    <!--//     qty: '123',-->
                    <!--//     effect: '张三王',-->
                    <!--//     reportName: '',-->
                    <!--//     close: '11-14 12点',-->
                    <!--//     time: '5'-->
                    <!--// },-->
                    <!--// {-->
                    <!--//     machineCode: '124123',-->
                    <!--//     productName: 'T/R65/35 JS50S',-->
                    <!--//     qty: '123',-->
                    <!--//     effect: '张三王',-->
                    <!--//     reportName: '',-->
                    <!--//     close: '11-14 12点',-->
                    <!--//     time: '5'-->
                    <!--// },-->
                    <!--// {-->
                    <!--//     machineCode: '124123',-->
                    <!--//     productName: 'T/R65/35 JS50S',-->
                    <!--//     qty: '123',-->
                    <!--//     effect: '张三王',-->
                    <!--//     reportName: '',-->
                    <!--//     close: '11-14 12点',-->
                    <!--//     time: '5'-->
                    <!--// },-->
                    <!--// {-->
                    <!--//     machineCode: '124123',-->
                    <!--//     productName: 'T/R65/35 JS50S',-->
                    <!--//     qty: '123',-->
                    <!--//     effect: '张三王',-->
                    <!--//     reportName: '',-->
                    <!--//     close: '11-14 12点',-->
                    <!--//     time: '5'-->
                    <!--// }-->
                <!--],-->
                <!--tableWarnTitle: [-->
                    <!--{-->
                        <!--title: '工序',-->
                        <!--key: 'processName',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '机台号',-->
                        <!--key: 'machineCode',-->
                        <!--minWidth: 80,-->
                        <!--span: 4,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '异常质量参数',-->
                        <!--key: 'qmParamName',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '异常值',-->
                        <!--key: 'value',-->
                        <!--minWidth: 80,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '上限',-->
                        <!--span: 4,-->
                        <!--key: 'valueMax',-->
                        <!--minWidth: 110,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '下限',-->
                        <!--span: 4,-->
                        <!--key: 'valueMin',-->
                        <!--minWidth: 110,-->
                        <!--align: 'left'-->
                    <!--}-->
                <!--],-->
                <!--tableWarnList: [-->
                    <!--{-->
                        <!--bagMouthName: '张三'-->
                    <!--}-->
                <!--],-->
                <!--tableThreeTitle: [-->
                    <!--{-->
                        <!--title: '工序',-->
                        <!--key: 'processName',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '机台号',-->
                        <!--key: 'machineCode',-->
                        <!--minWidth: 80,-->
                        <!--span: 4,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '故障原因',-->
                        <!--key: 'qmParamName',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '呼叫时间',-->
                        <!--key: 'value',-->
                        <!--minWidth: 80,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '接单时间',-->
                        <!--span: 4,-->
                        <!--key: 'valueMax',-->
                        <!--minWidth: 110,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '接单人',-->
                        <!--span: 4,-->
                        <!--key: 'valueMin',-->
                        <!--minWidth: 110,-->
                        <!--align: 'left'-->
                    <!--}-->
                <!--],-->
                <!--tableThreeList: [],-->
                <!--tableFourTitle: [-->
                    <!--{-->
                        <!--title: '工序',-->
                        <!--key: 'processName',-->
                        <!--minWidth: 60,-->
                        <!--span: 4,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '机台号',-->
                        <!--key: 'machineCode',-->
                        <!--minWidth: 80,-->
                        <!--span: 5,-->
                        <!--align: 'left'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '异常电压',-->
                        <!--key: 'qmParamName',-->
                        <!--minWidth: 60,-->
                        <!--span: 5,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '电压上限',-->
                        <!--key: 'value',-->
                        <!--minWidth: 80,-->
                        <!--span: 5,-->
                        <!--align: 'center'-->
                    <!--},-->
                    <!--{-->
                        <!--title: '电压下限',-->
                        <!--span: 5,-->
                        <!--key: 'valueMax',-->
                        <!--minWidth: 110,-->
                        <!--align: 'left'-->
                    <!--}-->
                <!--],-->
                <!--tableFourList: [],-->
                <!--noticeContent: '',-->
                <!--processId: '',-->
                <!--processName: '',-->
                <!--noticeShow: false-->
            <!--};-->
        <!--},-->
        <!--methods: {-->
            <!--expandCharts () {-->
                <!--const main = document.getElementById('screen');-->
                <!--if (this.value) {-->
                    <!--if (document.exitFullscreen) {-->
                        <!--document.exitFullscreen();-->
                    <!--} else if (document.mozCancelFullScreen) {-->
                        <!--document.mozCancelFullScreen();-->
                    <!--} else if (document.webkitCancelFullScreen) {-->
                        <!--document.webkitCancelFullScreen();-->
                    <!--} else if (document.msExitFullscreen) {-->
                        <!--document.msExitFullscreen();-->
                    <!--}-->
                <!--} else {-->
                    <!--if (main.requestFullscreen) {-->
                        <!--main.requestFullscreen();-->
                    <!--} else if (main.mozRequestFullScreen) {-->
                        <!--main.mozRequestFullScreen();-->
                    <!--} else if (main.webkitRequestFullScreen) {-->
                        <!--main.webkitRequestFullScreen();-->
                    <!--} else if (main.msRequestFullscreen) {-->
                        <!--main.msRequestFullscreen();-->
                    <!--}-->
                <!--}-->
                <!--this.value = !this.value;-->
            <!--},-->
            <!--getUserWorkshop () {-->
                <!--this.$api.dept.getUserWorkshop().then(res => {-->
                    <!--this.workshopId = res.curWorkshopId;-->
                    <!--this.workshopList = res.workshopList;-->
                    <!--this.processShowMonitoring(1);-->
                <!--});-->
            <!--},-->
            <!--twoTopTurn (val) {-->
                <!--this.$nextTick(() => {-->
                    <!--setTimeout(() => {-->
                        <!--this.earlyWarning();-->
                        <!--if (val > 0) {-->
                            <!--this.viewThreeTop = 0;-->
                            <!--setTimeout(() => {-->
                                <!--this.active = 2;-->
                                <!--this.turnOne = false;-->
                                <!--this.turnTwo = false;-->
                                <!--this.turnThree = true;-->
                            <!--}, 2000);-->
                        <!--} else {-->
                            <!--const timer = setInterval(() => {-->
                                <!--if (val >= this.viewTwoTop) {-->
                                    <!--clearTimeout(timer);-->
                                    <!--this.viewThreeTop = 0;-->
                                    <!--setTimeout(() => {-->
                                        <!--this.active = 2;-->
                                        <!--this.title = this.processName + '机器异常';-->
                                        <!--this.turnOne = false;-->
                                        <!--this.turnTwo = false;-->
                                        <!--this.turnThree = true;-->
                                    <!--}, 3000);-->
                                <!--} else {-->
                                    <!--this.viewTwoTop += -4;-->
                                <!--}-->
                            <!--}, 100);-->
                        <!--}-->
                    <!--}, 3000);-->
                <!--});-->
            <!--},-->
            <!--viewTopTurn (val) {-->
                <!--this.$nextTick(() => {-->
                    <!--setTimeout(() => {-->
                        <!--this.processShowEarlyWarning();-->
                        <!--if (val > 0) {-->
                            <!--this.viewTwoTop = 0;-->
                            <!--setTimeout(() => {-->
                                <!--this.active = 1;-->
                                <!--this.turnOne = false;-->
                                <!--this.turnTwo = true;-->
                            <!--}, 2000);-->
                        <!--} else {-->
                            <!--const timer = setInterval(() => {-->
                                <!--if (val >= this.viewTop) {-->
                                    <!--clearTimeout(timer);-->
                                    <!--this.viewTwoTop = 0;-->
                                    <!--setTimeout(() => {-->
                                        <!--this.active = 1;-->
                                        <!--this.title = this.processName + '质量异常';-->
                                        <!--this.turnOne = false;-->
                                        <!--this.turnTwo = true;-->
                                    <!--}, 3000);-->
                                <!--} else {-->
                                    <!--this.viewTop += -4;-->
                                <!--}-->
                            <!--}, 100);-->
                        <!--}-->
                    <!--}, 3000);-->
                <!--});-->
            <!--},-->
            <!--threeTopTurn (val) {-->
                <!--this.$nextTick(() => {-->
                    <!--setTimeout(() => {-->
                        <!--this.electricitiy();-->
                        <!--if (val > 0) {-->
                            <!--this.viewFourTop = 0;-->
                            <!--setTimeout(() => {-->
                                <!--this.active = 3;-->
                                <!--this.turnThree = false;-->
                                <!--this.turnFour = true;-->
                                <!--this.turnOne = false;-->
                            <!--}, 2000);-->
                        <!--} else {-->
                            <!--const timer = setInterval(() => {-->
                                <!--if (val >= this.viewThreeTop) {-->
                                    <!--clearTimeout(timer);-->
                                    <!--this.viewTwoTop = 0;-->
                                    <!--setTimeout(() => {-->
                                        <!--this.title = this.processName + '电压异常';-->
                                        <!--this.active = 3;-->
                                        <!--this.turnThree = false;-->
                                        <!--this.turnFour = true;-->
                                        <!--this.turnOne = false;-->
                                    <!--}, 3000);-->
                                <!--} else {-->
                                    <!--this.viewThreeTop += -4;-->
                                <!--}-->
                            <!--}, 100);-->
                        <!--}-->
                    <!--}, 3000);-->
                <!--});-->
            <!--},-->
            <!--fourTopTurn (val) {-->
                <!--this.$nextTick(() => {-->
                    <!--setTimeout(() => {-->
                        <!--this.processShowMonitoring();-->
                        <!--if (val > 0) {-->
                            <!--this.viewTwoTop = 0;-->
                            <!--setTimeout(() => {-->
                                <!--this.active = 0;-->
                                <!--this.turnOne = true;-->
                                <!--this.turnTwo = false;-->
                                <!--this.turnFour = false;-->
                            <!--}, 2000);-->
                        <!--} else {-->
                            <!--const timer = setInterval(() => {-->
                                <!--if (val >= this.viewFourTop) {-->
                                    <!--clearTimeout(timer);-->
                                    <!--this.viewTwoTop = 0;-->
                                    <!--setTimeout(() => {-->
                                        <!--this.active = 0;-->
                                        <!--this.title = this.processName + '工序机台预警';-->
                                        <!--this.turnOne = true;-->
                                        <!--this.turnTwo = false;-->
                                        <!--this.turnFour = false;-->
                                    <!--}, 3000);-->
                                <!--} else {-->
                                    <!--this.viewFourTop += -4-->
                                <!--}-->
                            <!--}, 100);-->
                        <!--}-->
                    <!--}, 3000);-->
                <!--});-->
            <!--},-->
            <!--processShowMonitoring (val) {-->
                <!--let params = {-->
                    <!--workshopId: this.workshopId-->
                <!--};-->
                <!--this.$call('large.screen.userAbnormity', params).then(res => {-->
                    <!--let content = res.data;-->
                    <!--if (content.status === 200) {-->
                        <!--this.tableList = content.res;-->
                        <!--if (val) {-->
                            <!--this.turnOne = true;-->
                            <!--// this.getNoticeContent();-->
                        <!--}-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--processShowEarlyWarning () {-->
                <!--let params = {-->
                    <!--workshopId: this.workshopId-->
                <!--};-->
                <!--this.$call('large.screen.qmEarlyWarning', params).then(res => {-->
                    <!--let content = res.data;-->
                    <!--if (content.status === 200) {-->
                        <!--// debugger-->
                        <!--this.tableWarnList = content.res;-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--earlyWarning () {-->
                <!--let params = {-->
                    <!--workshopId: this.workshopId-->
                <!--};-->
                <!--this.$call('large.screen.earlyWarning', params).then(res => {-->
                    <!--let content = res.data;-->
                    <!--if (content.status === 200) {-->
                        <!--this.tableThreeList = content.res;-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--electricitiy () {-->
                <!--let params = {-->
                    <!--workshopId: this.workshopId-->
                <!--};-->
                <!--this.$call('large.screen.electricitiy', params).then(res => {-->
                    <!--let content = res.data;-->
                    <!--if (content.status === 200) {-->
                        <!--this.tableFourList = content.res;-->
                    <!--}-->
                <!--});-->
            <!--},-->
            <!--getSlide () {-->
                <!--this.noticeShow = false;-->
                <!--let widthBar = document.getElementById('notice-bar').clientWidth;-->
                <!--let width = document.getElementById('notice-content').clientWidth;-->
                <!--this.leftNotice = widthBar;-->
                <!--const timer = setInterval(() => {-->
                    <!--if (this.leftNotice < -width) {-->
                        <!--clearInterval(timer);-->
                        <!--// this.getNoticeContent();-->
                    <!--} else {-->
                        <!--this.leftNotice&#45;&#45;;-->
                    <!--}-->
                <!--}, 10);-->
            <!--}-->
            <!--// getNoticeContent () {-->
            <!--//     const _this = this;-->
            <!--//     this.$call('notice.contents').then(res => {-->
            <!--//         let content = res.data;-->
            <!--//         if (content.status === 200) {-->
            <!--//             _this.noticeContent = content.res;-->
            <!--//             _this.noticeShow = true;-->
            <!--//         }-->
            <!--//     });-->
            <!--// }-->
        <!--},-->
        <!--watch: {-->
            <!--noticeShow (newData, oldData) {-->
                <!--if (newData) {-->
                    <!--this.getSlide();-->
                <!--}-->
            <!--}-->
        <!--},-->
        <!--mounted () {-->
            <!--this.getUserWorkshop();-->
            <!--setInterval(() => {-->
                <!--this.time = curDatetime();-->
            <!--}, 1000);-->
            <!--this.$nextTick(() => {-->
                <!--this.title = this.processName + '人员异常';-->
                <!--this.cardHeight = window.screen.height;-->
                <!--this.height = window.screen.height - 290;-->
                <!--this.width = window.screen.width;-->
            <!--});-->
        <!--}-->
    <!--};-->
<!--</script>-->
<!--<style scoped>-->
    <!--verticalMiddle{-->
        <!--vertical-align: middle;-->
    <!--}-->
    <!--.formEachStyle{-->
        <!--line-height: 24px;-->
    <!--}-->
    <!--.left-parent{-->
        <!--display: flex;-->
        <!--vertical-align: middle;-->
        <!--font-size: 12px;-->
        <!--line-height: 56px;-->
        <!--align-items: center-->
    <!--}-->
    <!--#tv{-->
        <!--font-size: 12px;-->
        <!--line-height: 24px;-->
        <!--color: #FFF;-->
        <!--background-color: #22272d;-->
    <!--}-->
    <!--.slide-bar{-->
        <!--width: 100%;-->
        <!--position: relative;-->
        <!--left: 0;-->
        <!--top: 0;-->
    <!--}-->
    <!--.process-bar{-->
        <!--border: 1px solid #5B657E;-->
        <!--border-radius: 5px;-->
        <!--/*position: absolute;*/-->
        <!--/*top: 0;*/-->
        <!--/*width: 100%;*/-->
    <!--}-->
    <!--.tech-bar{-->
        <!--font-size: 12px;-->
        <!--background-color: #2D333D;-->
        <!--padding: 0 20px;-->
        <!--height: 24px;-->
        <!--line-height: 24px;-->
    <!--}-->
    <!--.notice-bar{-->
        <!--background-color: #2D333D;-->
        <!--padding: 0 20px;-->
        <!--position: relative;-->
        <!--left: 0;-->
        <!--top: 0;-->
        <!--/*overflow: hidden;*/-->
    <!--}-->
    <!--.notice-content{-->
        <!--position: absolute;-->
        <!--top: 0;-->
        <!--z-index: 1000;-->
        <!--padding: 5px 10px;-->
        <!--color:#EE8300;-->
        <!--font-size: 54px;-->
        <!--display: inline-block;-->
        <!--white-space: nowrap;-->
        <!--overflow: hidden;-->
    <!--}-->
<!--</style>-->

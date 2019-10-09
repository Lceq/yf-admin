<!--<template>-->
<!--&lt;!&ndash;    <Card id="tv" :style="'height:' + height + 'px'">&ndash;&gt;-->
    <!--<div id="tv" :style="'width: ' + width + 'px; height: ' + height + 'px;display: inline-block;'">-->
        <!--&lt;!&ndash;        <div class="parentFlexBetween">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="left-parent">&ndash;&gt;-->
<!--&lt;!&ndash;            <img style="vertical-align: middle;height:24px;" class="" src="../../../images/zg.png"  alt="正凯" />&ndash;&gt;-->
<!--&lt;!&ndash;            <Select style="display: inline;line-height: 24px; width: 100px;" class="selectBackground textLeft margin-right-10" placeholder="请选择车间" clearable v-model="workshopId">&ndash;&gt;-->
<!--&lt;!&ndash;                <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>&ndash;&gt;-->
<!--&lt;!&ndash;            </Select>&ndash;&gt;-->
<!--&lt;!&ndash;&lt;!&ndash;            <Button class="" type="primary" shape="circle" size="large" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>&ndash;&gt;&ndash;&gt;-->
<!--&lt;!&ndash;        </div>&ndash;&gt;-->
        <!--<div>-->
            <!--<div class="process-bar">-->
                <!--<xw-table-->
                    <!--:turn="turn"-->
                    <!--:height="theight"-->
                    <!--:top="viewTop"-->
                    <!--@topTurn="viewTopTurn"-->
                    <!--:tableTitle="tableTitle"-->
                    <!--:tableList="tableList"-->
                <!--&gt;-->
                <!--</xw-table>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
<!--&lt;!&ndash;    </Card>&ndash;&gt;-->
<!--</template>-->

<!--<script>-->
<!--import xwTable from '../../components/xw-table/xw-open-close';-->
<!--// import xwMarquee from '../../components/xw-table/xw-marquee';-->
<!--export default {-->
    <!--name: 'open-close',-->
    <!--components: {-->
        <!--xwTable-->
        <!--// xwMarquee-->
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
            <!--tableShow: true,-->
            <!--time: '',-->
            <!--tableTitle: [-->
                <!--{-->
                    <!--title: '工序',-->
                    <!--key: 'processName',-->
                    <!--minWidth: 60,-->
                    <!--span: 2,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '机台号',-->
                    <!--span: 3,-->
                    <!--key: 'machineCode',-->
                    <!--minWidth: 60,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '品种',-->
                    <!--span: 4,-->
                    <!--key: 'productName',-->
                    <!--minWidth: 60,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '订单号',-->
                    <!--span: 4,-->
                    <!--key: 'prdOrderCodes',-->
                    <!--minWidth: 100,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '批号',-->
                    <!--key: 'batchCode',-->
                    <!--span: 3,-->
                    <!--minWidth: 100,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '预计了机',-->
                    <!--span: 5,-->
                    <!--key: 'planDateTo',-->
                    <!--minWidth: 100,-->
                    <!--align: 'left'-->
                <!--},-->
                <!--{-->
                    <!--title: '剩余时间',-->
                    <!--key: 'timeRemaining',-->
                    <!--span: 3,-->
                    <!--minWidth: 100,-->
                    <!--align: 'left'-->
                <!--}-->
            <!--],-->
            <!--tableList: [],-->
            <!--value: false,-->
            <!--turn: false,-->
            <!--viewTop: 0,-->
            <!--// height: 0,-->
            <!--// theight: 0,-->
            <!--cardHeight: '',-->
            <!--workshopId: '',-->
            <!--workshopList: []-->
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
            <!--// this.tableShow = false;-->
            <!--// this.machineFinishDetail();-->
            <!--this.value = !this.value;-->
        <!--},-->
        <!--getUserWorkshop () {-->
            <!--this.$api.dept.getUserWorkshop().then(res => {-->
                <!--this.workshopId = res.curWorkshopId;-->
                <!--this.workshopList = res.workshopList;-->
                <!--this.machineFinishDetail();-->
            <!--});-->
        <!--},-->
        <!--machineFinishDetail () {-->
            <!--this.$call('large.screen.machineFinishDetail').then(res => {-->
                <!--let content = res.data;-->
                <!--if (content.status === 200) {-->
                    <!--this.tableList = content.res;-->
                    <!--this.turn = true;-->
                <!--}-->
            <!--});-->
        <!--},-->
        <!--viewTopTurn (val) {-->
            <!--this.turn = false;-->
            <!--this.$nextTick(() => {-->
                <!--setTimeout(() => {-->
                    <!--if (val > 0) {-->
                        <!--this.viewTop = 0;-->
                        <!--setTimeout(() => {-->
                            <!--this.machineFinishDetail();-->
                        <!--}, 5000);-->
                    <!--} else {-->
                        <!--const timer = setInterval(() => {-->
                            <!--if (val >= this.viewTop) {-->
                                <!--clearTimeout(timer);-->
                                <!--this.viewTop = 0;-->
                                <!--setTimeout(() => {-->
                                    <!--this.machineFinishDetail();-->
                                    <!--// this.active = 1;-->
                                    <!--// this.title = this.processName + '工序机台预警';-->
                                    <!--// this.turnOne = false;-->
                                    <!--// this.turnTwo = true;-->
                                <!--}, 3000);-->
                            <!--} else {-->
                                <!--this.viewTop += -4;-->
                            <!--}-->
                        <!--}, 100);-->
                    <!--}-->
                <!--}, 3000);-->
            <!--});-->
        <!--}-->
    <!--},-->
    <!--mounted () {-->
        <!--this.getUserWorkshop();-->
        <!--this.$nextTick(() => {-->
            <!--// this.theight = this.height - 30;-->
            <!--// debugger-->
            <!--// this.cardHeight = window.screen.height - 30;-->
        <!--});-->
    <!--}-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
    <!--.left-parent{-->
        <!--display: flex;-->
        <!--vertical-align: middle;-->
        <!--font-size: 18px;-->
        <!--line-height: 56px;-->
        <!--align-items: center-->
    <!--}-->
    <!--#screen{-->
        <!--font-size: 34px;-->
        <!--line-height: 56px;-->
        <!--color: #FFF;-->
        <!--background-color: #22272d;-->
    <!--}-->
    <!--.process-bar{-->
        <!--border: 1px solid #5B657E;-->
        <!--border-radius: 5px;-->
        <!--/*position: absolute;*/-->
        <!--/*top: 0;*/-->
        <!--/*width: 100%;*/-->
    <!--}-->
    <!--.xw-table-title{-->
        <!--width: 100%;-->
        <!--background-color: #5B657E;-->
        <!--font-weight: bold;-->
        <!--padding: 10px 5px;-->
        <!--font-size: 34px;-->
        <!--/*border: 1px solid #999999;*/-->
        <!--border-left: none;-->
        <!--text-align: center;-->
    <!--}-->
    <!--.xw-table-list{-->
        <!--font-size: 34px;-->
        <!--width: 100%;-->
        <!--padding: 12px 5px;-->
        <!--border-right: 1px solid #5B657E;-->
        <!--border-bottom: 1px solid #5B657E;-->
        <!--/*border-left: none;*/-->
        <!--overflow: hidden;-->
        <!--word-wrap: break-word;-->
        <!--word-break: normal;-->
        <!--border-top: none;-->
        <!--text-align: center;-->
    <!--}-->
    <!--.xw-table-list:last-child{-->
        <!--border-right: none;-->
    <!--}-->
    <!--.table-list-bar{-->
        <!--overflow: hidden;-->
    <!--}-->
    <!--#table-list-height{-->
        <!--position: relative;-->
        <!--left: 0;-->
        <!--transition: 2s;-->
    <!--}-->
    <!--.parent-around{-->
        <!--display: flex;-->
        <!--justify-content: space-around;-->
    <!--}-->
<!--</style>-->

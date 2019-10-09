<template>
    <Card id="screen" :style="'height:' + cardHeight + 'px'">
        <div class="parentFlexBetween">
            <div class="left-parent">
                <img style="vertical-align: middle;height:56px;" class="" src="../../../images/zg.png"  alt="正凯" />
                <Select style="display: inline;line-height: 56px; width: 100px;" class="selectBackground textLeft margin-right-10" placeholder="请选择车间" clearable v-model="workshopId">
                    <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Button class="" type="primary" shape="circle" size="large" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>
            </div>
            <p class="margin-right-10">{{ title }}</p>
            <p>当前时间：{{ time }}</p>
        </div>
        <div class="tech-bar parentFlexBetween">
            <div class="flex-left" v-for="item of region">
                <p class="margin-right-10">区域：{{ item.name }}</p>
                <p class="margin-right-10" :style="'color:' + ( item.temNormal ? '' : 'rgb(237, 64, 20)')">{{ item.actualTemperature }}℃</p>
                <p :style="'color:' + ( item.humNormal ? '' : 'rgb(237, 64, 20)')">{{ item.actualHumidity }}%</p>
            </div>
        </div>
        <Carousel
            v-model="active"
            :autoplay="false"
            :radius-dot="false"
            arrow="never"
            dots="none"
        >
            <CarouselItem>
                <div class="process-bar">
                    <xw-table
                        :turn="turnOne"
                        :height="height"
                        :top="viewTop"
                        @topTurn="viewTopTurn"
                        :tableTitle="tableTitle"
                        :tableList="tableList"
                    >
                    </xw-table>
                </div>
            </CarouselItem>
            <CarouselItem>
                <div class="process-bar">
                    <xw-table-two
                        :turn="turnTwo"
                        :height="height"
                        :top="viewTwoTop"
                        @topTurn="twoTopTurn"
                        :tableTitle="tableWarnTitle"
                        :tableList="tableWarnList"
                    >
                    </xw-table-two>
                </div>
            </CarouselItem>
        </Carousel>
        <div>
            <div id="notice-bar" class="notice-bar">
                <p id="notice-content" class="notice-content" :style="'left:' + leftNotice + 'px;'">{{ noticeContent }}</p>
            </div>
        </div>
    </Card>
</template>

<script>
import {curDatetime} from '../../../libs/tools';
import xwTable from '../../components/xw-table/xw-table';
import xwTableTwo from '../../components/xw-table/xw-table-two';
export default {
    name: 'process-machine',
    components: {
        xwTable,
        xwTableTwo
    },
    data () {
        return {
            region: '',
            temperature: '28℃',
            humidity: '28℃',
            leftNotice: 0,
            title: '',
            turnOne: false,
            turnTwo: false,
            active: 0,
            cardHeight: 0,
            leftOne: 0,
            leftTwo: 0,
            viewTop: null,
            viewTwoTop: null,
            height: 0,
            slideHeight: 0,
            time: curDatetime(),
            workshopId: '',
            workshopList: [],
            value: false,
            techList: [
                {
                    id: 1,
                    name: '区域',
                    code: '28℃'
                },
                {
                    id: 2,
                    name: '湿度',
                    code: '28℃'
                },
                {
                    id: 3,
                    name: '湿度',
                    code: '28℃'
                }
            ],
            tableTitle: [],
            tableMiddleTitle: [
                {
                    title: '机台',
                    key: 'machineCode',
                    minWidth: 60,
                    span: 2,
                    align: 'center'
                },
                {
                    title: '品种',
                    key: 'productName',
                    minWidth: 90,
                    span: 3,
                    align: 'left'
                },
                {
                    title: '生产批号',
                    span: 2,
                    key: 'batchCode',
                    minWidth: 60,
                    align: 'left'
                },
                {
                    title: '当班产量',
                    key: 'output',
                    minWidth: 60,
                    span: 2,
                    align: 'right'
                },
                {
                    title: '效率',
                    key: 'efficiency',
                    span: 1,
                    minWidth: 60,
                    align: 'right'
                },
                {
                    title: '预计了机',
                    key: 'planDateTo',
                    minWidth: 100,
                    span: 2,
                    align: 'center'
                },
                // {
                //     title: '满桶长度',
                //     key: 'fullTime',
                //     minWidth: 100,
                //     align: 'left'
                // },
                // {
                //     title: '桶内长度',
                //     key: 'fullTime',
                //     minWidth: 100,
                //     align: 'left'
                // },
                // {
                //     title: '筒圈颜色',
                //     key: 'tubeColorNames',
                //     minWidth: 100,
                //     span: 3,
                //     processName: 'shumian',
                //     align: 'left'
                // },
                {
                    title: '管圈颜色',
                    span: 2,
                    key: 'tubeColorNames',
                    minWidth: 100,
                    processName: 'xisha',
                    align: 'left'
                },
                {
                    title: '定长',
                    key: 'fullLength',
                    minWidth: 60,
                    span: 1,
                    processName: 'xisha',
                    align: 'left'
                },
                {
                    title: '已纺长度',
                    key: 'currentLength',
                    minWidth: 100,
                    span: 2,
                    processName: 'xisha',
                    align: 'left'
                },
                {
                    title: '剩余时间',
                    key: 'fullTime',
                    minWidth: 100,
                    span: 2,
                    align: 'left'
                },
                {
                    title: '操作工',
                    key: 'userNames',
                    span: 2,
                    minWidth: 60,
                    align: 'left'
                },
                {
                    title: '计件工资',
                    key: 'jijian',
                    span: 2,
                    minWidth: 60,
                    align: 'left'
                },
                {
                    title: '考核',
                    span: 1,
                    key: 'kaohe',
                    minWidth: 60,
                    align: 'left'
                }
            ],
            tableList: [
                // {
                //     machineCode: '124123',
                //     productName: 'T/R65/35 JS50S',
                //     qty: '123',
                //     effect: '张三王',
                //     reportName: '',
                //     close: '11-14 12点',
                //     time: '5'
                // },
                // {
                //     machineCode: '124123',
                //     productName: 'T/R65/35 JS50S',
                //     qty: '123',
                //     effect: '张三王',
                //     reportName: '',
                //     close: '11-14 12点',
                //     time: '5'
                // },
                // {
                //     machineCode: '124123',
                //     productName: 'T/R65/35 JS50S',
                //     qty: '123',
                //     effect: '张三王',
                //     reportName: '',
                //     close: '11-14 12点',
                //     time: '5'
                // },
                // {
                //     machineCode: '124123',
                //     productName: 'T/R65/35 JS50S',
                //     qty: '123',
                //     effect: '张三王',
                //     reportName: '',
                //     close: '11-14 12点',
                //     time: '5'
                // },
                // {
                //     machineCode: '124123',
                //     productName: 'T/R65/35 JS50S',
                //     qty: '123',
                //     effect: '张三王',
                //     reportName: '',
                //     close: '11-14 12点',
                //     time: '5'
                // }
            ],
            tableWarnTitle: [
                {
                    title: '机台号',
                    key: 'machineCode',
                    minWidth: 60,
                    span: 3,
                    align: 'center'
                },
                {
                    title: '故障信息',
                    key: 'faultDescription',
                    minWidth: 80,
                    span: 12,
                    align: 'left'
                },
                {
                    title: '接单时间',
                    key: 'receivingTime',
                    minWidth: 60,
                    span: 3,
                    align: 'center'
                },
                {
                    title: '呼叫时间',
                    key: 'callTime',
                    minWidth: 80,
                    span: 3,
                    align: 'center'
                },
                {
                    title: '呼叫人员',
                    span: 3,
                    key: 'callUserName',
                    minWidth: 110,
                    align: 'left'
                }
            ],
            tableWarnList: [
                {
                    bagMouthName: '张三'
                }
            ],
            noticeContent: '',
            processId: '',
            processName: '',
            noticeShow: false
        };
    },
    methods: {
        expandCharts () {
            const main = document.getElementById('screen');
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
            }
            this.value = !this.value;
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.processShowMonitoring(1);
            });
        },
        twoTopTurn (val) {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.processShowMonitoring();
                    if (val > 0) {
                        this.viewTop = 0;
                        setTimeout(() => {
                            this.active = 0;
                            this.turnOne = true;
                            this.turnTwo = false;
                        }, 2000);
                        // return false;
                    } else {
                        const timer = setInterval(() => {
                            if (val >= this.viewTop) {
                                clearTimeout(timer);
                                this.viewTop = 0;
                                setTimeout(() => {
                                    this.active = 0;
                                    this.title = this.processName + '工序机台监控';
                                    this.turnOne = true;
                                    this.turnTwo = false;
                                }, 3000);
                            } else {
                                this.viewTwoTop += -8;
                            }
                        }, 100);
                    }
                }, 3000);
            });
        },
        viewTopTurn (val) {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.processShowEarlyWarning();
                    if (val > 0) {
                        this.viewTwoTop = 0;
                        setTimeout(() => {
                            this.active = 1;
                            this.turnOne = false;
                            this.turnTwo = true;
                        }, 2000);
                        // this.active = 1;
                    } else {
                        const timer = setInterval(() => {
                            if (val >= this.viewTop) {
                                clearTimeout(timer);
                                this.viewTwoTop = 0;
                                setTimeout(() => {
                                    this.active = 1;
                                    this.title = this.processName + '工序机台预警';
                                    this.turnOne = false;
                                    this.turnTwo = true;
                                }, 3000);
                            } else {
                                this.viewTop += -8;
                            }
                        }, 100);
                    }
                }, 3000);
            });
        },
        processShowMonitoring (val) {
            let params = {
                workshopId: this.workshopId,
                processId: this.processId
            };
            this.$call('large.screen.processShowMonitoring', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableList = content.res.monitoringList.map(x => {
                        x.tubeColorNames = x.tubeColorNames ? x.tubeColorNames.toString() : '';
                        return x;
                    });
                    this.region = content.res.area;
                    if (val) {
                        this.turnOne = true;
                        this.getNoticeContent();
                    }
                    // this.$nextTick(() => {
                    // this.cardHeight = window.screen.height;
                    // this.slideHeight = window.screen.height - 290;
                    // this.height = window.screen.height - 370;
                    // this.width = window.screen.width;
                    // this.leftTwo = this.width;
                    // setTimeout(() => {
                    //     this.turnOne = true;
                    // }, 1000);
                    // });
                }
            });
        },
        processShowEarlyWarning () {
            let params = {
                workshopId: this.workshopId,
                processId: this.processId
            };
            this.$call('large.screen.processShowEarlyWarning', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableWarnList = content.res;
                }
            });
        },
        getSlide () {
            this.noticeShow = false;
            let widthBar = document.getElementById('notice-bar').clientWidth;
            let width = document.getElementById('notice-content').clientWidth;
            this.leftNotice = widthBar;
            const timer = setInterval(() => {
                if (this.leftNotice < -width) {
                    clearInterval(timer);
                    this.getNoticeContent();
                } else {
                    this.leftNotice--;
                }
            }, 10);
        },
        getNoticeContent () {
            const _this = this;
            this.$call('notice.contents').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.noticeContent = content.res;
                    _this.noticeShow = true;
                }
            });
        }
    },
    watch: {
        noticeShow (newData, oldData) {
            if (newData) {
                this.getSlide();
            }
        }
    },
    mounted () {
        this.getUserWorkshop();
        setInterval(() => {
            this.time = curDatetime();
        }, 1000);
        this.$nextTick(() => {
            this.processId = this.$route.query.id;
            this.processName = this.$route.query.name;
            // if (this.processId === 23 || this.processId === 24) {
            this.tableTitle = this.tableMiddleTitle.filter(x => x.processName !== 'shumian');
            // } else {
            //     this.tableTitle = this.tableMiddleTitle.filter(x => x.processName !== 'xisha');
            // }
            this.title = this.processName + '工序机台监控';
            this.cardHeight = window.screen.height;
            // this.slideHeight = window.screen.height - 290;
            this.height = window.screen.height - 290;
            this.width = window.screen.width;
            // this.leftTwo = this.width;
        });
    }
};
</script>
<style scoped>
verticalMiddle{
    vertical-align: middle;
}
.formEachStyle{
    line-height: 56px;
}
.left-parent{
    display: flex;
    vertical-align: middle;
    font-size: 18px;
    line-height: 56px;
    align-items: center
}
#screen{
    font-size: 28px;
    line-height: 56px;
    color: #FFF;
    background-color: #22272d;
}
.slide-bar{
    width: 100%;
    position: relative;
    left: 0;
    top: 0;
}
.process-bar{
    border: 1px solid #5B657E;
    border-radius: 5px;
    /*position: absolute;*/
    /*top: 0;*/
    /*width: 100%;*/
}
.tech-bar{
    font-size: 28px;
    background-color: #2D333D;
    padding: 0 20px;
    height: 56px;
    line-height: 56px;
}
.notice-bar{
    background-color: #2D333D;
    padding: 0 20px;
    position: relative;
    left: 0;
    top: 0;
    /*overflow: hidden;*/
}
.notice-content{
    position: absolute;
    top: 0;
    z-index: 1000;
    padding: 5px 10px;
    color:#EE8300;
    font-size: 54px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
}
</style>

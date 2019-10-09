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
        <div class="tech-bar leftFlex">
            <!--            <p v-for="item of techList">{{ item.name }}：{{ item.code }}</p>-->
            <p class="margin-right-10">{{ region }}</p>
            <p class="margin-right-10">{{ temperature }}</p>
            <p>{{ humidity }}</p>
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
                        :title="tableTitle"
                        :list="tableList"
                        :turn="turn"
                        @getTurn="getTurn"
                        :top="top"></xw-table>
                </div>
            </CarouselItem>
            <CarouselItem>
                <xw-table
                    :title="tableWarnTitle"
                    :list="tableWarnList"
                    :turn="turnTwo"
                    @getTurn="getTurnTwo"
                    :top="topTwo"></xw-table>
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
            </CarouselItem>
            <CarouselItem>
                <xw-table
                    :title="tableThreeTitle"
                    :list="tableThreeList"
                    :turn="turnThree"
                    @getTurn="getTurnThree"
                    :top="topThree"></xw-table>
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
            </CarouselItem>
        </Carousel>
        <div>
            <div class="notice-content">
                <marquee style="color: #EE8300;" scrolldelay="30">{{ noticeContent }}</marquee>
            </div>
        </div>
    </Card>
</template>

<script>
    import {curDatetime} from '../../../libs/tools';
    import xwTable from './x-table';
    // import xwTable from '../../components/xw-table/xw-table';
    // import xwTableTwo from '../../components/xw-table/xw-table-two';
    // import xwTableThree from '../../components/xw-table/xw-table-three';
    export default {
        name: 'process-machine',
        components: {
            xwTable
            // xwTableThree,
            // xwTableTwo
        },
        data () {
            return {
                fontSize: 1,
                numbers: 9,
                top: 0,
                topTwo: 0,
                topThree: 0,
                turn: false,
                turnTwo: false,
                turnThree: false,
                region: '',
                temperature: '28℃',
                humidity: '56%',
                leftNotice: 0,
                title: '',
                turnOne: false,
                active: 0,
                cardHeight: 0,
                leftOne: 0,
                leftTwo: 0,
                viewTop: null,
                viewTwoTop: null,
                viewThreeTop: null,
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
                tableTitle: [
                    {
                        title: '物料批号',
                        key: 'batchCode',
                        minWidth: 60,
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        minWidth: 90,
                        span: 5,
                        align: 'left'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 60,
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '计划数量',
                        key: 'weightQty',
                        minWidth: 60,
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '已领数量',
                        key: 'leadOutQty',
                        span: 2,
                        minWidth: 60,
                        align: 'left'
                    },
                    {
                        title: '待领数量',
                        key: 'stayWeightQty',
                        minWidth: 100,
                        span: 2,
                        align: 'left'
                    },
                    {
                        title: '已投数量',
                        key: 'feedingQty',
                        minWidth: 100,
                        span: 2,
                        align: 'left'
                    },
                    {
                        title: '待投数量',
                        key: 'stayFeedingQty',
                        minWidth: 100,
                        span: 2,
                        align: 'left'
                    }
                ],
                tableList: [],
                tableWarnTitle: [
                    {
                        title: '姓名',
                        key: 'createName',
                        minWidth: 60,
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '物料批号',
                        key: 'batchCode',
                        minWidth: 80,
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        minWidth: 60,
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 80,
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '当天投料量',
                        key: 'feedingQty',
                        minWidth: 110,
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '本月投料量',
                        key: 'monthFeedingQty',
                        minWidth: 80,
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '计件工资',
                        span: 2,
                        key: 'pieceworkWage',
                        minWidth: 110,
                        align: 'left'
                    },
                    {
                        title: '当班考核',
                        key: 'assessment',
                        span: 2,
                        minWidth: 110,
                        align: 'left'
                    }
                ],
                tableWarnList: [],
                tableThreeTitle: [
                    {
                        title: '圆盘号',
                        key: 'packingAreaName',
                        span: 5,
                        minWidth: 60,
                        align: 'left'
                    },
                    {
                        title: '物料批号',
                        key: 'batchCode',
                        minWidth: 80,
                        span: 5,
                        align: 'left'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        span: 6,
                        minWidth: 60,
                        align: 'left'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 80,
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '投料量',
                        key: 'feedingQty',
                        minWidth: 110,
                        span: 4,
                        align: 'left'
                    }
                ],
                tableThreeList: [],
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
                    this.getNoticeContent();
                    setInterval(() => {
                        this.getNoticeContent();
                    }, 600000);
                    this.processShowMonitoring();
                });
            },
            getTurn (theight, height) {
                setTimeout(() => {
                    this.getTime1(theight, height);
                }, this.stoptime);
            },
            getTime1 (theight, height) {
                this.$nextTick(() => {
                    // console.log(theight, height);
                    // debugger
                    if (theight >= (height + this.top)) {
                        this.topTwo = 0;
                        this.turnTwo = false;
                        setTimeout(() => {
                            this.processShowEarlyWarning();
                        }, 8000);
                    } else {
                        this.top += -10;
                        setTimeout(() => {
                            this.getTime1(theight, height);
                        }, 100);
                    }
                });
            },
            getTurnTwo (theight, height) {
                setTimeout(() => {
                    this.getTime2(theight, height);
                }, this.stoptime);
            },
            getTime2 (theight, height) {
                this.$nextTick(() => {
                    // debugger
                    // console.log(theight, height);
                    if (theight >= (height + this.topTwo)) {
                        this.topThree = 0;
                        this.turnThree = false;
                        setTimeout(() => {
                            this.userStatistic();
                        }, 8000);
                    } else {
                        this.topTwo += -10;
                        setTimeout(() => {
                            this.getTime2(theight, height);
                        }, 100);
                    }
                });
            },
            getTurnThree (theight, height) {
                setTimeout(() => {
                    this.getTime3(theight, height);
                }, this.stoptime);
            },
            getTime3 (theight, height) {
                this.$nextTick(() => {
                    // console.log(theight, height);
                    if (theight >= (height + this.topThree)) {
                        this.top = 0;
                        this.turn = false;
                        setTimeout(() => {
                            this.processShowMonitoring();
                        }, 8000);
                    } else {
                        this.topThree += -10;
                        setTimeout(() => {
                            this.getTime2(theight, height);
                        }, 100);
                    }
                });
            },
            // threeTopTurn (val) {
            //     this.$nextTick(() => {
            //         setTimeout(() => {
            //             this.processShowMonitoring();
            //             if (val > 0) {
            //                 this.viewTop = 0;
            //                 setTimeout(() => {
            //                     this.active = 0;
            //                     this.turnOne = true;
            //                     this.turnTwo = false;
            //                     this.turnThree = false;
            //                 }, 2000);
            //             } else {
            //                 const timer = setInterval(() => {
            //                     if (val >= this.viewThreeTop) {
            //                         // clearTimeout(timer);
            //                         clearInterval(timer);
            //                         this.viewTop = 0;
            //                         setTimeout(() => {
            //                             this.active = 0;
            //                             this.title = this.processName + '原料投料情况';
            //                             this.turnOne = true;
            //                             this.turnTwo = false;
            //                             this.turnThree = false;
            //                         }, 3000);
            //                     } else {
            //                         this.viewThreeTop += -20;
            //                     }
            //                 }, 100);
            //             }
            //         }, 3000);
            //     });
            // },
            // twoTopTurn (val) {
            //     this.$nextTick(() => {
            //         setTimeout(() => {
            //             this.userStatistic();
            //             // debugger;
            //             if (val > 0) {
            //                 this.viewThreeTop = 0;
            //                 setTimeout(() => {
            //                     this.active = 2;
            //                     this.turnOne = false;
            //                     this.turnTwo = false;
            //                     this.turnThree = true;
            //                 }, 2000);
            //                 // return false;
            //             } else {
            //                 const timer = setInterval(() => {
            //                     if (val >= this.viewTwoTop) {
            //                         // clearTimeout(timer);
            //                         clearInterval(timer);
            //                         this.viewThreeTop = 0;
            //                         setTimeout(() => {
            //                             this.active = 2;
            //                             this.title = this.processName + '圆盘消耗分析';
            //                             this.turnOne = false;
            //                             this.turnTwo = false;
            //                             this.turnThree = true;
            //                         }, 3000);
            //                     } else {
            //                         this.viewTwoTop += -20;
            //                     }
            //                 }, 100);
            //             }
            //         }, 3000);
            //     });
            // },
            // viewTopTurn (val) {
            //     this.$nextTick(() => {
            //         setTimeout(() => {
            //             this.processShowEarlyWarning();
            //             if (val > 0) {
            //                 // debugger;
            //                 this.viewTwoTop = 0;
            //                 setTimeout(() => {
            //                     this.active = 1;
            //                     this.turnThree = false;
            //                     this.turnOne = false;
            //                     this.turnTwo = true;
            //                 }, 2000);
            //                 // this.active = 1;
            //             } else {
            //                 const timer = setInterval(() => {
            //                     if (val >= this.viewTop) {
            //                         // clearTimeout(timer);
            //                         clearInterval(timer);
            //                         this.viewTwoTop = 0;
            //                         setTimeout(() => {
            //                             this.active = 1;
            //                             this.title = this.processName + '人员投料情况';
            //                             this.turnThree = false;
            //                             this.turnOne = false;
            //                             this.turnTwo = true;
            //                         }, 3000);
            //                     } else {
            //                         this.viewTop += -20;
            //                     }
            //                 }, 100);
            //             }
            //         }, 3000);
            //     });
            // },
            processShowMonitoring (val) {
                let params = {
                    workshopId: this.workshopId
                };
                this.$call('prd.material.feeding.materialStatistic', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.tableList = content.res;
                        this.turn = true;
                        this.title = '原料投料情况';
                        this.active = 0;
                    }
                });
            },
            processShowEarlyWarning () {
                let params = {
                    workshopId: this.workshopId
                };
                this.$call('prd.material.feeding.userStatistic', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.tableWarnList = content.res;
                        this.turnTwo = true;
                        this.title = '人员投料情况';
                        this.active = 1;
                    }
                });
            },
            userStatistic () {
                let params = {
                    workshopId: this.workshopId
                };
                this.$call('prd.material.feeding.diskStatistic', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.tableThreeList = content.res;
                        this.turnThree = true;
                        this.title = '圆盘消耗分析';
                        this.active = 2;
                    }
                });
            },
            // getSlide () {
            //     this.noticeShow = false;
            //     let widthBar = document.getElementById('notice-bar').clientWidth;
            //     let width = document.getElementById('notice-content').clientWidth;
            //     this.leftNotice = widthBar;
            //     const timer = setInterval(() => {
            //         if (this.leftNotice < -width) {
            //             clearInterval(timer);
            //             this.getNoticeContent();
            //         } else {
            //             this.leftNotice--;
            //         }
            //     }, 10);
            // },
            getNoticeContent () {
                const _this = this;
                let params = { workshopId: this.workshopId };
                this.$call('notice.contents', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.noticeContent = content.res;
                        // _this.noticeShow = true;
                    }
                });
            }
        },
        watch: {
            // getNoticeContent (newData, oldData) {
            //     if (newData) {
            //         this.getSlide();
            //     }
            // }
        },
        mounted () {
            this.getUserWorkshop();
            setInterval(() => {
                this.time = curDatetime();
            }, 1000);
            this.$nextTick(() => {
                // this.processId = this.$route.query.id;
                // this.processName = this.$route.query.name;
                this.title = this.processName + '原料投料情况';
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
    .parentFlexBetween{
        padding: 10px 0;
    }
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
        background-color: #2D333D;
        padding: 10px 20px;
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
    /*.notice-content{*/
        /*position: absolute;*/
        /*top: 0;*/
        /*z-index: 1000;*/
        /*color:#EE8300;*/
        /*font-size: 54px;*/
        /*display: inline-block;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
    /*}*/
    .notice-content{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60px;
        font-size: 48px;
        line-height: 50px;
        /*background-color: #9b9b9b;*/
    }
</style>

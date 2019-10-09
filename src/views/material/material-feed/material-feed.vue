<template>
    <div id="pack" style="background-color: #fff;">
        <div class="parentFlexBetween" style="background-color: #f1f1f1">
            <div class="leftFlex">
                <div class="pack-tab" :class="(active === 0 || active === 1) ? 'active' : ''" @click="changePackType(1)">圆 盘</div>
                <div class="pack-tab" :class="active === 2 ? 'active' : ''" @click="changePackType(2)">原料消耗</div>
                <div class="pack-tab" :class="active === 3 ? 'active' : ''" @click="changePackType(3)">圆盘消耗</div>
                <div class="pack-tab" :class="active === 4 ? 'active' : ''" @click="changePackType(4)">人员投料</div>
            </div>
            <div class="rightFlex">
                <div v-if="(active === 0 || active === 1)" class="pack-right">登录人：{{ loginName }}</div>
                <div v-if="(active === 0 || active === 1)" class="pack-right">当班日期：{{ loginMes[0].date }}</div>
                <div class="pack-right">车间：{{loginMes[0].workshopName}}</div>
                <div class="pack-logout" @click="packLogout">下班</div>
            </div>
        </div>
        <Row v-if="successShow" class="tip-bar">
            <Col span="24" class="tip-bar-item">
                <Button type="text" shape="circle" icon="ios-checkmark-circle" style="color: #19be6b;"></Button>
                {{tipMessage}}
            </Col>
        </Row>
        <Carousel
                v-if="show"
                :style="'height:' + packHeight + 'px;' + 'width: 100%'"
                v-model="active"
                :autoplay="false"
                :radius-dot="false"
                arrow="never"
                dots="none"
        >
            <CarouselItem>
                <pack-area-item :isPackAreaShow="isPackAreaShow" @on-feed-material="feedMaterialEvent"></pack-area-item>
            </CarouselItem>
            <CarouselItem>
                <feed-material-detail @submitReport="submitReport" @returnReport="returnReport" :isUserReport="isUserReport" :curOrderId="curOrderId"></feed-material-detail>
            </CarouselItem>
            <CarouselItem>
                <material-consume :isSearchShow="isSearchShow"></material-consume>
            </CarouselItem>
            <CarouselItem>
                <disc-consume :isDiscConsumeShow="isDiscConsumeShow"></disc-consume>
            </CarouselItem>
            <CarouselItem>
                <user-feed @to-user-feed-detail="toUserFeedDetailEvent" :isUserFeed="isUserFeed"></user-feed>
            </CarouselItem>
            <CarouselItem>
                <user-feed-detail @on-return="userFeedDetailReturnEvent" :toUserFeedDetailData="toUserFeedDetailData" :isUserFeedDetail="isUserFeedDetail"></user-feed-detail>
            </CarouselItem>
        </Carousel>
        <warning
            :packWarningShow="packWarningShow"
            @submitWarning="submitWarning"
            @cancelWarning="cancelWarning"
        >
        </warning>
    </div>
</template>

<script>
    import {curDate} from '../../../libs/tools';
    import {breakUpList} from "../../../libs/tools";
    import packAreaItem from './components/pack-area-item';
    import materialConsume from './components/material-consume';
    import userFeed from './components/user-feed';
    import userFeedDetail from './components/user-feed-detail';
    import discConsume from './components/disc-consume';
    import warning from '../../pack/view-pack/warning';
    import feedMaterialDetail from './components/feed-material-detail';
    import Cookies from 'js-cookie';
    import iView from 'iview';
    import leftRight from '../../pack/view-pack/left-right';
    export default {
        name: 'user-pack',
        components: {userFeed, packAreaItem, feedMaterialDetail, leftRight, warning, materialConsume, discConsume, userFeedDetail},
        data () {
            return {
                toUserFeedDetailData: {},
                show: false,
                trigger: false,
                packWarningShow: false,
                loginName: '',
                isUserReport: false,
                curOrderId: null,
                packHeight: '',
                curTime: curDate(),
                loginMes: [{date: ''}],
                active: 0,
                pageTotal: 1,
                isPackAreaShow: false,
                isSearchShow: false,
                isDiscConsumeShow: false,
                isUserFeed: false,
                isUserFeedDetail: true,
                reportOrderList: [],
                packWidth: '100%',
                tipMessage: '',
                successShow: false
            };
        },
        methods: {
            changePackType (val) {
                this.active = val;
                switch (val) {
                    case 1:
                        this.isPackAreaShow = true;
                        this.isUserReport = false;
                        this.isSearchShow = false;
                        this.isDiscConsumeShow = false;
                        this.isUserFeed = false;
                        break;
                    case 2:
                        this.isPackAreaShow = false;
                        this.isUserReport = false;
                        this.isSearchShow = true;
                        this.isDiscConsumeShow = false;
                        this.isUserFeed = false;
                        break;
                    case 3:
                        this.isPackAreaShow = false;
                        this.isUserReport = false;
                        this.isSearchShow = false;
                        this.isDiscConsumeShow = true;
                        this.isUserFeed = false;
                        break;
                    case 4:
                        this.isPackAreaShow = false;
                        this.isUserReport = false;
                        this.isSearchShow = false;
                        this.isDiscConsumeShow = false;
                        this.isUserFeed = true;
                        break;
                    default :
                        this.isPackAreaShow = true;
                        this.isUserReport = false;
                        this.isSearchShow = false;
                        this.isDiscConsumeShow = false;
                        this.isUserFeed = false;
                }
            },
            // 人员投料详情的返回事件
            userFeedDetailReturnEvent () {
                this.active = 4;
            },
            // 跳转人员投料
            toUserFeedDetailEvent (data) {
                this.active = 5;
                this.toUserFeedDetailData = data;
                this.isUserFeedDetail = true;
            },
            getUserInfo () {
                this.$call('user.info').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.loginName = content.res.loginName;
                    }
                });
            },
            getLoginMsg () {
                this.$call('user.get.post').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.loginMes = content.res;
                        this.getOrderList();
                    };
                });
            },
            packLogout () {
                this.packWarningShow = true;
            },
            submitWarning () {
                Cookies.remove('routeName');
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({
                    name: 'login'
                });
                setTimeout(function () {
                    iView.LoadingBar.finish();
                }, 0);
                this.packWarningShow = false;
            },
            cancelWarning () {
                this.packWarningShow = false;
            },
            returnReport (e) {
                this.active = 0;
                this.isUserReport = false;
                this.isSearchShow = false;
                this.isDiscConsumeShow = false;
                this.isPackAreaShow = true;
                if (e === '1') {
                    this.successShow = true;
                    this.tipMessage = '提交成功!';
                    setTimeout(() => { this.successShow = false; }, 3000);
                };
            },
            submitReport () {
                this.isPackAreaShow = true;
                this.isSearchShow = true;
                this.isDiscConsumeShow = true;
            },
            // 投料事件
            feedMaterialEvent (id) {
                this.isPackAreaShow = false;
                this.curOrderId = id;
                this.active = 1;
                this.isUserReport = true;
            },
            leftRightClick (val) {
                this.pageIndex = val;
                this.getOrderList();
            },
            getScreen () {
                let main = document.getElementById('pack');
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
                this.packHeight = window.screen.height - 130;
                this.packWidth = '100%';
            },
            getOrderList () {
                const _this = this;
                let params = {
                    workshopId: this.loginMes[0].workshopId,
                    groupId: this.loginMes[0].groupId,
                    date: this.loginMes[0].date,
                    pageIndex: this.pageIndex,
                    pageSize: 16
                };
                this.$call('prd.order.pack.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.pageTotal = Math.ceil(content.count / 16);
                        _this.reportOrderList = breakUpList(content.res, 4);
                        setTimeout(() => {
                            this.getScreen();
                        }, 100);
                    }
                });
            }
        },
        mounted () {
            // 获取当前登陆人所在的班组
            this.$nextTick(() => {
                this.getUserInfo();
                this.getLoginMsg();
                this.packHeight = window.screen.height - 130;
                this.packWidth = '100%';
                this.show = true;
            });
        }
    };
</script>

<style scoped>
    .tip-bar {
        position: absolute;
        left: 42%;
        z-index: 99999;
        top: 3%;
    }
    .tip-bar-item {
        text-align: left;font-size: 16px;position: relative;margin-left: 40px;border: solid 1px #dcdee2;border-radius: 4px;
    }
    .parentFlexBetween{
        height: 100px;
    }
    .pack-tab{
        /*padding: 30px 60px;*/
        width: 200px;
        height: 100%;
        text-align: center;
        line-height: 100px;
        border-left: 1px solid #515a6e;
        font-size: 24px;
    }
    .pack-tab:first-child{
        border-left: none;
    }
    .pack-tab:last-child{
    }
    .pack-logout{
        display: inline-block;
        border: 1px solid crimson;
        color: crimson;
        font-size: 20px;
        padding: 10px 30px;
        border-radius: 3px;
    }
    .active-report{
        background-color: #f1f1f1;
        border-left: none;
        border-top: none;
    }
    .active{
        /*border-bottom: 1px solid #fff;*/
        background-color: #fff;
        /*border-bottom: 1px solid #fff;*/
    }
    .pack-right{
        display: inline-block;
        margin-right: 40px;
        font-size: 20px;
        line-height: 100px;
    }
    .rightFlex{
        /*display: flex;*/
        /*justify-content: flex-end;*/
        text-align: right;
        padding-right: 20px;
        /*padding-top: 20px;*/
        /*;*/
    }
    /*.pack-bar{*/
    /*border-top: 1px solid #515a6e;*/
    /*padding: 10px;*/
    /*!*margin-top: -1px;*!*/
    /*background-color: #f1f1f1;*/
    /*}*/
</style>

<template>
    <div id="pack" style="background-color: #fff;">
        <div class="parentFlexBetween" style="background-color: #f1f1f1">
            <div class="leftFlex">
                <div class="pack-tab" :class="(active === 0 || active === 1) ? 'active' : ''" @click="changePackType(0)">报 工</div>
                <div class="pack-tab" :class="active === 2 ? 'active' : ''" @click="changePackType(2)">查 询</div>
                <div class="pack-tab" :class="active === 3 ? 'active' : ''" @click="changePackType(3)">个 人</div>
            </div>
            <div class="rightFlex">
                <div v-if="(active === 0 || active === 1)" class="pack-right">登录人：{{ loginName }}</div>
                <div v-if="(active === 0 || active === 1)" class="pack-right">当班日期：{{ loginMes[0].date }}</div>
                <div class="pack-right">车间：{{loginMes[0].workshopName}}</div>
                <div class="pack-right">班组：{{loginMes[0].groupName}}</div>
                <div class="pack-logout" @click="packLogout">下班</div>
            </div>
        </div>
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
                <report :isReportShow="isReportShow" :loginMes="loginMes" @userReport="userReport"></report>
            </CarouselItem>
            <CarouselItem>
                <user-report @submitReport="submitReport" @returnReport="returnReport" :isUserReport="isUserReport" :loginMes="loginMes" :curOrderId="curOrderId"></user-report>
            </CarouselItem>
            <CarouselItem>
                <search :isSearchShow="isSearchShow" :loginMes="loginMes"></search>
            </CarouselItem>
            <CarouselItem>
                <people :isPeopleShow="isPeopleShow" :loginMes="loginMes"></people>
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
import report from './report';
import search from './search';
import people from './people';
import warning from './warning';
import userReport from './user-report';
import Cookies from 'js-cookie';
import iView from 'iview';
import leftRight from './left-right';
export default {
    name: 'user-pack',
    components: {
        people,
        report,
        userReport,
        leftRight,
        warning,
        search
    },
    data () {
        return {
            show: false,
            trigger: false,
            packWarningShow: false,
            loginName: '',
            isUserReport: false,
            curOrderId: null,
            packHeight: '',
            curTime: curDate(),
            loginMes: [
                {
                    groupName: '',
                    workshopName: ''
                }
            ],
            active: 0,
            pageTotal: 1,
            isReportShow: false,
            isSearchShow: false,
            isPeopleShow: false,
            reportOrderList: [],
            packWidth: '100%'
        };
    },
    methods: {
        getUserInfo () {
            this.$call('user.info').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.loginName = content.res.loginName;
                }
            });
        },
        getLoginMsg () {
            this.$call('schedule.user.get.group').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.loginMes = content.res;
                    this.getOrderList();
                }
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
        returnReport () {
            this.active = 0;
            this.isUserReport = false;
            this.isSearchShow = false;
            this.isPeopleShow = false;
        },
        submitReport () {
            this.isReportShow = true;
            this.isSearchShow = true;
            this.isPeopleShow = true;
        },
        userReport (val) {
            this.isReportShow = false;
            this.curOrderId = val.id;
            this.active = 1;
            this.isUserReport = true;
        },
        changePackType (val) {
            this.active = val;
            switch (val) {
                case 0:
                    this.isReportShow = true;
                    this.isSearchShow = false;
                    this.isUserReport = false;
                    this.isPeopleShow = false;
                    break;
                case 2:
                    this.isReportShow = false;
                    this.isSearchShow = true;
                    this.isUserReport = false;
                    this.isPeopleShow = false;
                    break;
                case 3:
                    this.isReportShow = false;
                    this.isSearchShow = false;
                    this.isUserReport = false;
                    this.isPeopleShow = true;
                    break;
                default:
                    this.isReportShow = true;
                    this.isSearchShow = false;
                    this.isUserReport = false;
                    this.isPeopleShow = false;
            }
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
            // debugger
            this.$call('prd.order.pack.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.pageTotal = Math.ceil(content.count / 16);
                    // debugger
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
        //
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

<template>
    <div id="pack" style="background-color: #fff;">
        <div class="parentFlexBetween">
            <div class="leftFlex">
                <div class="pack-tab" :class="(active === 'report') ? 'active' : ''" @click="changePackType('report')">报工</div>
                <div class="pack-tab" :class="active === 'search' ? 'active' : ''" @click="changePackType('search')">查询</div>
                <div class="pack-tab" :class="active === 'people' ? 'active' : ''" @click="changePackType('people')">个人</div>
            </div>
            <div class="rightFlex">
                <div v-if="active === 'report'" class="pack-right">日期：{{ curTime }}</div>
                <div class="pack-right">车间：{{loginMes[0].workshopName}}</div>
                <div class="pack-right">班组：{{loginMes[0].groupName}}</div>
                <div class="pack-logout" @click="packLogout">下班</div>
            </div>
        </div>
        <div v-show="(active === 'report' && userActive === false )" class="pack-bar">
            <div :style="'height:' + packHeight + 'px'">
<!--                <report :reportOrderList="reportOrderList" @userReport="userReport"></report>-->
                <report :isReportShow="isReportShow" :loginMes="loginMes" @userReport="userReport"></report>
            </div>
        </div>
        <div v-show="(active === 'report' && userActive === true )" class="pack-bar">
            <div :style="'height:' + packHeight + 'px'">
<!--                <user-report :userReportShow="userReportShow" :userReportList="userReportList" @returnReport="returnReport"></user-report>-->
                <user-report :isUserActiveShow="isUserActiveShow" :loginMes="loginMes" :curOrderId="curOrderId" @returnReport="returnReport"></user-report>
            </div>
        </div>
        <div v-show="active === 'search'" class="pack-bar">
            <div :style="'height:' + packHeight + 'px'">
                <search :isSearchShow="isSearchShow" :loginMes="loginMes"></search>
            </div>
        </div>
        <div  v-show="active === 'people'" class="pack-bar">
            <div :style="'height:' + packHeight + 'px'">
<!--                <change-time></change-time>-->
                <people :isPeopleShow="isPeopleShow" :loginMes="loginMes"></people>
            </div>
        </div>
       <warning
               :packWarningShow="packWarningShow"
               @submitWarning="submitWarning"
               @cancelWarning="cancelWarning"
       >
       </warning>
    </div>
</template>

<script>
import report from './report';
import search from './search';
import people from './people';
import leftRight from './left-right';
import changeTime from './change-time';
import userReport from './user-report';
import {curDate} from "../../../libs/tools";
import Cookies from 'js-cookie';
import iView from 'iview';
import warning from './warning';
// import deleteWarning from '../../public/deleteWarning';
// import {breakUpList} from "../../../libs/tools";

export default {
    components: {
        report,
        people,
        userReport,
        changeTime,
        search,
        warning,
        leftRight
    },
    data () {
        return {
            deleteWarnShow: false,
            deleteWarnLoading: false,
            deleteWarnMsg: '',
            curTime: curDate(),
            packHeight: '',
            active: 'report',
            userActive: false,
            fullFullCreen: false,
            value: false,
            reportOrderList: [],
            searchList: {},
            userReportShow: false,
            loginMes: [
                {
                    workshopName: '',
                    groupName: ''
                }
            ],
            isReportShow: false,
            isSearchShow: false,
            isUserActiveShow: false,
            isPeopleShow: false,
            curOrderId: null,
            packWarningShow: false
        };
    },
    methods: {
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
        getLoginMsg () {
            this.$call('schedule.user.get.group', {date: curDate()}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.loginMes = content.res;
                    this.isReportShow = true;
                }
            });
        },
        // 获取订单列表数据
        changePackType (val) {
            this.active = val;
            // 报工
            if (val === 'report') {
                this.isReportShow = true;
                this.isSearchShow = false;
                this.isPeopleShow = false;
            }
            // 查询
            if (val === 'search') {
                this.isSearchShow = true;
                this.isReportShow = false;
                this.isPeopleShow = false;
            }
            if (val === 'people') {
                this.isPeopleShow = true;
                this.isReportShow = false;
                this.isSearchShow = false;
            }
        },
        userReport (item) {
            // this.isSearchShow = true;
            this.userActive = true;
            this.curOrderId = item.id;
            this.isUserActiveShow = true;
        },
        returnReport () {
            this.userActive = false;
            this.isUserActiveShow = false;
            this.isReportShow = false;
            setTimeout(() => {
                this.isReportShow = true;
            }, 0);
        },
        packLogout () {
            this.packWarningShow = true;
            // this.deleteWarnMsg = '确定要退出吗？';
        },
        expandCharts () {
            let main = document.getElementById('pack');
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
                this.fullFullCreen = false;
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
                this.fullFullCreen = true;
            }
        }
    },
    created () {
        // 获取当前登陆人所在的班组
        this.getLoginMsg();
    },
    mounted () {
        this.$nextTick(() => {
            this.expandCharts();
            this.packHeight = window.screen.height - 100;
        });
        window.onresize = () => {
            if (this.fullFullCreen) {
                return false;
            }
        };
    }
};
</script>

<style scoped>
.pack-tab{
    padding: 20px 40px;
    border: 1px solid #515a6e;
    /*background-color: #f1f1f1;*/
    font-size: 16px;
    border-bottom: none;
}
.pack-tab:first-child{
    border-right: none;
}
.pack-tab:last-child{
    border-left: none;
}
.pack-logout{
    display: inline-block;
    border: 1px solid crimson;
    color: crimson;
    font-size: 16px;
    padding: 5px 20px;
    border-radius: 3px;
}
.active-report{
    background-color: #f1f1f1;
    border-left: none;
    border-top: none;
}
.active{
    /*border-bottom: 1px solid #fff;*/
    background-color: #f1f1f1;
    /*border-bottom: 1px solid #fff;*/
}
.pack-right{
    display: inline-block;
    margin-right: 40px;
    font-size: 16px;
}
.rightFlex{
    /*display: flex;*/
    /*justify-content: flex-end;*/
    text-align: right;
    padding-right: 20px;
    padding-top: 20px;
}
.pack-bar{
    border-top: 1px solid #515a6e;
    padding: 10px;
    margin-top: -1px;
    background-color: #f1f1f1;
}
</style>

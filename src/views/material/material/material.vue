<template>
    <div id="material" style="background-color: #fff;">
        <div class="parentFlexBetween">
            <div class="leftFlex">
                <div class="pack-tab" :class="(active === 'disc') ? 'active' : ''" @click="changePackType('disc')">圆盘</div>
                <div class="pack-tab" :class="active === 'consume' ? 'active' : ''" @click="changePackType('consume')">原料消耗</div>
                <div class="pack-tab" :class="active === 'consumption' ? 'active' : ''" @click="changePackType('consumption')">圆盘消耗</div>
                <div class="pack-tab" :class="active === 'user' ? 'active' : ''" @click="changePackType('user')">人员投料</div>
            </div>
            <div class="rightFlex">
                <div v-if="active === 'disc'" class="pack-right">日期：2019-06-17</div>
                <div class="pack-right">车间：一车间</div>
                <div class="pack-right">班组：后纺甲班</div>
                <div class="pack-logout" @click="materialLogout">下班</div>
            </div>
        </div>
        <div v-if="(active === 'disc' && discActive === false )" class="pack-bar">
            <div :style="'height:' + materialHeight + 'px'" class="discFlex">
                <div @click="seletDisc" v-for="i of 11" class="material-disc">{{i}}</div>
<!--                <left-right></left-right>-->
            </div>
        </div>
        <div v-if="(active === 'disc' && discActive === true )" class="pack-bar">
            <feeding @returnFeeding="returnFeeding"></feeding>
        </div>
        <div v-if="(active === 'consumption')" class="pack-bar">
            <disc @returnDisc="returnDisc"></disc>
        </div>
        <div class="pack-bar" v-if="active === 'consume'">
            <situation></situation>
            <left-right></left-right>
        </div>
        <div class="pack-bar" v-if="active === 'user' && userActive === false">
            <user @returnUserDetail="returnUserDetail" ></user>
        </div>
        <div class="pack-bar" v-if="active === 'user' && userActive === true">
            <user-detail @returnUser="returnUser"></user-detail>
        </div>
    </div>
</template>

<script>
import feeding from './feeding';
import situation from './situation';
import leftRight from './left-right';
import user from './user';
import disc from './disc';
import userDetail from './user-detail';
export default {
    name: 'material',
    components: {
        userDetail,
        disc,
        leftRight,
        feeding,
        user,
        situation
    },
    data () {
        return {
            active: 'disc',
            materialHeight: '',
            value: false,
            discActive: false,
            userActive: false,
            fullFullCreen: false
        };
    },
    methods: {
        seletDisc (val) {
            this.discActive = true;
        },
        changePackType (val) {
            this.active = val;
        },
        returnFeeding () {
            this.discActive = false;
        },
        returnDisc () {
        },
        returnUserDetail () {
            this.userActive = true;
        },
        returnUser () {
            this.userActive = false;
        },
        // materialLogout (val) {},
        materialLogout () {
            // this.$router.push({ name: 'charts-top' });
            let main = document.getElementById('material');
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
                // this.chartHeight = parseInt((document.documentElement.clientHeight - 100 - 220) / 2);
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
                // this.chartHeight = parseInt((document.documentElement.clientHeight - 100) / 2);
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.expandCharts();
            this.materialHeight = window.screen.height - 150;
            // this.packHeight = document.documentElement.clientHeight - 230;
        });
        window.onresize = () => {
            if (this.fullFullCreen) {
                // this.packHeight = window.screen.height - 150;
                return false;
            }
            // this.packHeight = document.documentElement.clientHeight;
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
        border-right: none;
    }
    .pack-tab:first-child{
        /*border-right: none;*/
    }
    .pack-tab:last-child{
        /*border-left: none;*/
        border-right: 1px solid #515a6e;
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
    .discFlex{
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    .material-disc{
        width: 180px;
        height: 180px;
        display: inline-block;
        border: 2px solid #999999;
        border-radius: 50%;
        margin-right: 10px;
        /*margin-bottom: 10px;*/
        line-height: 180px;
        font-size: 24px;
        text-align: center;
    }
</style>
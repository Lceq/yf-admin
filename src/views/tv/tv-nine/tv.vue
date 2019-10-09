<template>
    <div id="tv">
        <Row>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-one :width="width" :height="height" :workshopList="workshopList" :workshopId="workshopId" @expandCharts="expandCharts"></tv-one>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-two :width="width" :height="height" :workshopId="workshopId"></tv-two>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-eight @changePack="changePack" :width="width" :height="height" :workshopId="workshopId"></tv-eight>
                </div>
            </Col>
        </Row>
        <Row>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-six :width="width" :height="height" :workshopId="workshopId"></tv-six>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-scada :width="width" :height="height" :workshopId="workshopId"></tv-scada>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-quality :width="width" :fontSize="fontSize" :height="height" :workshopId="workshopId"></tv-quality>
                </div>
            </Col>
        </Row>
        <Row>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-feed :width="width" :height="height" :workshopId="workshopId">
                    </tv-feed>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-three :width="width" :height="height" :workshopId="workshopId"></tv-three>
                </div>
            </Col>
            <Col class="tv-bar" span="8">
                <div class="tv-bar-content" :style="'height:' + height + 'px'">
                    <tv-four :width="width" :fontSize="fontSize" :height="height" :workshopId="workshopId"></tv-four>
                </div>
            </Col>
        </Row>
        <div class="notice-content">
            <marquee style="color: #EE8300; opacity: 0.7"  scrolldelay="30">{{ noticeContent }}</marquee>
            <!--<marquee style="color: #EE8300;" behavior="scroll" direction="right" height="60" width='100%'>{{ noticeContent }}</marquee>-->
        </div>
        <pack-chart-modal
                :packChartModal="shModalState"
                packChartModalTitle="排包详情"
                :packChartId="packChartId"
                @on-visible-change="packChartModalStateChange"
        >
        </pack-chart-modal>
    </div>
</template>

<script>
import tvOne from './tv-month-qty';
import tvTwo from './tv-order';
import tvFour from './xw-tv/tv-open-close';
import tvSix from './xw-tv/tv-abnormal';
import tvQuality from './xw-tv/tv-quality';
import tvFeed from './xw-tv/tv-feed';
import tvThree from './xw-tv/tv-envir';
import tvEight from './xw-tv/tv-eight';
import tvScada from './xw-tv/tv-scada';
import packChartModal from './components/pack-chart-modal';
export default {
    name: 'tv',
    components: {
        tvOne,
        tvTwo,
        tvThree,
        tvFour,
        tvSix,
        tvEight,
        tvQuality,
        tvFeed,
        tvScada,
        packChartModal
    },
    data () {
        return {
            packChartId: null,
            shModalState: false,
            width: 0,
            height: 0,
            fontSize: 1,
            workshopId: null,
            workshopList: [],
            value: false,
            noticeContent: ''
        };
    },
    methods: {
        packChartModalStateChange (e) {
            this.shModalState = e;
            if (!e) {
                this.packChartId = null;
            }
        },
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getNoticeContent();
                setInterval(() => {
                    this.getNoticeContent();
                }, 1800000);
            });
        },
        getNoticeContent () {
            const _this = this;
            let params = {
                workshopId: this.workshopId
            };
            this.$call('notice.contents', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.noticeContent = content.res;
                }
            });
        },
        expandCharts (val) {
            const main = document.getElementById('tv');
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
        changePack (val) {
            this.packChartId = val.prdCottonBlendingAreaId;
            this.shModalState = true;
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.$nextTick(() => {
            this.width = (window.screen.width - 60) / 3;
            this.height = (window.screen.height - 30) / 3;
        });
    }
};
</script>
<style scoped>
#tv{
    /*font-size: 12px;*/
    /*line-height: 24px;*/
    color: #FFF;
    background-color: #22272d;
    /*padding: 5px;*/
    position: relative;
    left: 0;
    top: 0;
}
.tv-bar{
    padding: 5px;
}
.tv-bar-content{
    border: 1px solid #5B657E;
    border-radius: 5px;
    height: 100px;
    padding: 5px;
    overflow: hidden;
}
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

<!--<template>-->
    <!--<Card id="screen" :style="'height:' + cardHeight + 'px'">-->
       <!--<Row>-->
           <!--<Col class="tv-bar" span="8">-->
               <!--<div class="tv-num-bar">-->
                   <!--<tv-one :width="width" :height="height"></tv-one>-->
               <!--</div>-->
           <!--</Col>-->
           <!--<Col class="tv-bar" span="8">-->
               <!--<div class="tv-num-bar">-->
                   <!--<tv-two :width="width" :height="height"></tv-two>-->
               <!--</div>-->
           <!--</Col>-->
           <!--<Col span="8"  class="tv-bar">-->
               <!--<div class="tv-num-bar">-->
                   <!--<tv-three :width="width" :height="height" :theight="theight"></tv-three>-->
               <!--</div>-->
           <!--</Col>-->
       <!--</Row>-->
        <!--<Row>-->
            <!--<Col  class="tv-bar"  span="8">-->
                <!--<div class="tv-num-bar">-->
                    <!--<tv-four :width="width" :height="theight" :theight="height"></tv-four>-->
                <!--</div>-->
            <!--</Col>-->
            <!--<Col span="8"  class="tv-bar">-->
                <!--<div class="tv-num-bar">-->
<!--&lt;!&ndash;                <tv-four :width="width" :height="theight" :theight="height"></tv-four>&ndash;&gt;-->
                <!--5-->
                <!--</div>-->
            <!--</Col>-->
            <!--<Col class="tv-bar" span="8">-->
                <!--<div class="tv-num-bar">-->
<!--&lt;!&ndash;                <tv-four :width="width" :height="theight" :theight="height"></tv-four>&ndash;&gt;-->
                    <!--<tv-six :width="width" :height="height"></tv-six>-->
                <!--</div>-->
            <!--</Col>-->
        <!--</Row>-->
        <!--<Row>-->
            <!--<Col span="8"  class="tv-bar">-->
                <!--<div :style="'width:' +  width + 'px;height:' + height + 'px'" class="tv-bar-block">-->
                    <!--<tv-seven :width="width" :height="height"></tv-seven>-->
                <!--</div>-->
            <!--</Col>-->
            <!--<Col span="8"  class="tv-bar">-->
                <!--<div :style="'width:' +  width + 'px;height:' + height + 'px'" class="tv-bar-block">-->
<!--&lt;!&ndash;                    <tv-seven :width="width" :height="height"></tv-seven>&ndash;&gt;-->
                    <!--<tv-eight :width="width" :height="height"></tv-eight>-->
                <!--</div>-->
            <!--</Col>-->
<!--&lt;!&ndash;            &ndash;&gt;-->
            <!--<Col span="8" class="tv-bar">-->
                <!--<div class="tv-num-bar">-->
                    <!--<marquee style="color: #EE8300;" behavior="scroll" direction="up" :height="height" :width='width'>{{ noticeContent }}</marquee>-->
                <!--</div>-->
            <!--</Col>-->
        <!--</Row>-->
    <!--</Card>-->
<!--</template>-->

<!--<script>-->
<!--import tvOne from './tv-month-qty';-->
<!--import tvTwo from './tv-order';-->
<!--import tvThree from './open-close';-->
<!--import tvFour from './tv-four';-->
<!--import tvSix from './tv-six';-->
<!--import tvSeven from '../maintain-specialty/index';-->
<!--import tvEight from '../material-feed/index';-->
<!--export default {-->
    <!--name: 'tv-nine',-->
    <!--components: {-->
        <!--tvOne,-->
        <!--tvTwo,-->
        <!--tvThree,-->
        <!--tvSix,-->
        <!--tvFour,-->
        <!--tvSeven,-->
        <!--tvEight-->
    <!--},-->
    <!--data () {-->
        <!--return {-->
            <!--height: '',-->
            <!--width: '30%',-->
            <!--cardHeight: '',-->
            <!--noticeContent: '',-->
            <!--number: [1, 2, 3, 4, 5, 6, 7, 8, 9]-->
        <!--};-->
    <!--},-->
    <!--mounted () {-->
        <!--this.$nextTick(() => {-->
            <!--this.cardHeight = window.screen.height;-->
            <!--this.height = window.screen.height / 3 - 80;-->
            <!--this.theight = window.screen.height / 3 - 80;-->
            <!--this.width = window.screen.width / 3 - 100;-->
            <!--this.getNoticeContent();-->
        <!--});-->
    <!--},-->
    <!--methods: {-->
        <!--getNoticeContent () {-->
            <!--const _this = this;-->
            <!--this.$call('notice.contents').then(res => {-->
                <!--let content = res.data;-->
                <!--if (content.status === 200) {-->
                    <!--_this.noticeContent = content.res;-->
                <!--}-->
            <!--});-->
        <!--},-->
        <!--handleTv (item) {-->
            <!--if (item === 3) {-->
                <!--this.$router.push({-->
                    <!--path: 'open-close'-->
                <!--});-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.item-bar{-->
    <!--border: 1px solid #5B657E;-->
    <!--padding: 10px 20px;-->
    <!--margin-right: 20px;-->
<!--}-->
<!--#screen{-->
    <!--font-size: 34px;-->
    <!--line-height: 56px;-->
    <!--color: #FFF;-->
    <!--background-color: #22272d;-->
<!--}-->
<!--.tv-bar {-->
    <!--padding: 5px;-->
<!--}-->
<!--.tv-bar-block{-->

<!--}-->
<!--.tv-num-bar{-->
    <!--border: 1px solid #f2dede;-->
    <!--padding: 5px;-->
    <!--border-radius: 5px;-->
<!--}-->
<!--</style>-->

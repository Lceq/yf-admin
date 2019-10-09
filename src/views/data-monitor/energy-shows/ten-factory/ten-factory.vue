<template>
    <section>
        <header class="main-title margin-top-20 margin-bottom-10">纺十厂能源看板</header>
        <Row class="margin-top-10">
            <Col span="12">
                <current-time></current-time>
            </Col>
            <Col span="12" class="temperature text-right">{{temperatureVal}}</Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24" class="big-bar">
                <electricity-daily></electricity-daily>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="small-bar">
                <qf-ele-daily></qf-ele-daily>
            </Col>
            <Col span="12" class="small-bar">
                <hf-ele-daily></hf-ele-daily>
            </Col>
        </Row>
        <Row>
            <Col span="12" class="small-bar">
                <assist-ele-daily></assist-ele-daily>
            </Col>
            <Col span="12" class="small-bar">
                <assist-ele-daily></assist-ele-daily>
            </Col>
        </Row>
    </section>
</template>
<script>
    import electricityDaily from '../charts-components/electricity-daily/electricity-daily';
    import qfEleDaily from '../charts-components/qian-fang-daily/qian-fang-daily';
    import hfEleDaily from '../charts-components/hou-fang-daily/hou-fang-daily';
    import assistEleDaily from '../charts-components/assist-fang-daily/assist-fang-daily';
    import currentTime from '../../components/current-time';
    export default {
        components: { electricityDaily, qfEleDaily, hfEleDaily, assistEleDaily, currentTime },
        data () {
            return {
                contentHeight: 900,
                temperatureVal: '36℃'
            };
        },
        methods: {

        },
        mounted () {

        }
    };
</script>
<style lang="less">
    @font_size: 28px;
    @small_bar_height: 200px;
    @big_bar_height: 400px;
    section{
        main-title {
            font: bold @font_size/32px '';
            color: #fff;
        }
        .temperature {
            font: bold 18px/24px '';
        }
        .big-bar {
            height: @big_bar_height;
        }
        .small-bar {
            height: @small_bar_height;
        }
    }
</style>

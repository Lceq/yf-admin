<template>
    <section>
        <header class="main-title margin-top-20 margin-bottom-10">远纺工业(无锡)能源看板</header>
        <Row class="margin-top-20">
            <Col span="12">
                <current-time></current-time>
            </Col>
            <Col span="12" class="temperature text-right">{{temperatureVal}}</Col>
        </Row>
        <Row class="general-information-val margin-top-20">
            <Col span="6" class="text-center">8455KW</Col>
            <Col span="6" class="text-center">28T</Col>
            <Col span="6" class="text-center">8455Nm³</Col>
            <Col span="6" class="text-center">8455KW</Col>
        </Row>
        <Row class="general-information-label">
            <Col span="6" class="text-center">电electricity</Col>
            <Col span="6" class="text-center">水water</Col>
            <Col span="6" class="text-center">压缩空气Air</Col>
            <Col span="6" class="text-center">太阳能PV</Col>
        </Row>
        <Row>
            <Col span="12" class="big-bar" style="height: 600px;">
                <p class="sub-title">用电结构</p>
                <electricity-structure></electricity-structure>
            </Col>
            <Col span="12" class="big-bar" style="height: 600px;">
                <p class="sub-title">每吨纱能源耗用</p>
                <energy-consume></energy-consume>
            </Col>
        </Row>
    </section>
</template>
<script>
    import energyConsume from '../charts-components/energy-consume/energy-consume';
    import electricityStructure from '../charts-components/electricity-structure/electricity-structure';
    import currentTime from '../../components/current-time';
    export default {
        components: { energyConsume, electricityStructure, currentTime },
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
    @font_size: 32px;
    @small_bar_height: 200px;
    @big_bar_height: 800px;
    section{
        header {
            font: bold @font_size/38px '';
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
        .main-title {
            text-align: center;
            font: bold 38px/42px '';
        }
        .sub-title {
            text-align: center;
            font: bold @font_size/42px '';
        }
        .general-information-label {
            font: 800 24px/38px '';
            color: gray;
            margin-bottom: 40px;
        }
        .general-information-val {
            border-bottom: 4px solid gray;
            font: 800 24px/38px '';
        }
    }
</style>

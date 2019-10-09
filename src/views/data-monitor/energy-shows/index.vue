<template>
    <Card class="content-bar" :style="{height: `${contentHeight}px`}">
        <Row>
            <Col>
                <RadioGroup v-model="dynamicComponents" type="button" @on-change="getMenuEvent">
                    <Radio label="energyHome">公司</Radio>
                    <Radio label="tenFactory">纺十厂</Radio>
                    <Radio label="cardMachine">纺十一厂</Radio>
                    <Radio label="drawingMachine">公用</Radio>
                    <Radio label="tJuanMachine">汇总</Radio>
                </RadioGroup>
<!--                <Button type="primary" shape="circle" @click="fullScreenEvent" :icon="isPresentFullScreen ? 'ios-exit' : 'ios-expand'" class="full-screen-button"></Button>-->
            </Col>
        </Row>
        <component :is="dynamicComponents"></component>
    </Card>
</template>
<script>
    import energyHome from './energy-home/energy-home';
    import tenFactory from './ten-factory/ten-factory';

    export default {
        components: { energyHome, tenFactory },
        data () {
            return {
                contentHeight: 950,
                dynamicComponents: 'energyHome'
            };
        },
        methods: {
            getMenuEvent (e) {
                this.dynamicComponents = e;
            }
        },
        mounted () {

        }
    };
</script>
<style lang="less">
    @font_size: 28px;
    @small_bar_height: 200px;
    @big_bar_height: 400px;
    .content-bar{
        background: #22272d;
        border:solid 1px #515970;
        border-radius:4px;
        color: #fff;
        header {
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
        .ivu-radio-group-button .ivu-radio-wrapper {
             display: inline-block;
             height: 32px;
             line-height: 30px;
             margin: 0;
             padding: 0 15px;
             font-size: 12px;
             color: #fff;
             transition: all .2s ease-in-out;
             cursor: pointer;
             border: 1px solid #dcdee2;
             background: none;
             position: relative;
         }
        .ivu-radio-group-button .ivu-radio-wrapper-checked {
            background: none;
            border-color: #2d8cf0;
            color: #2d8cf0;
            box-shadow: -1px 0 0 0 #2d8cf0;
            z-index: 1;
        }
    }
</style>

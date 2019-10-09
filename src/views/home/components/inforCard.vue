<style lang="less">
    @import './styles/infor-card.less';
    .textStyle{
        font-size:20px;
        color:white;
    }
    .textOpenStyle{
        font-size:14px;
        color:#525a71;
    }
</style>

<template>
    <Card :padding="0">
        <div class="infor-card-con">
            <!--<Col class="infor-card-icon-con" :style="{backgroundColor: color, color: 'white'}" span="8">
                <Row class="height-100" type="flex" align="middle" justify="center">
                    &lt;!&ndash;<p class="infor-intro-text textStyle">{{ introText }}</p>&ndash;&gt;
                </Row>
            </Col>-->
            <Col span="16" class="height-100">
                <Row type="flex" align="middle" justify="center" class="height-100">
                    <count-up
                        class="infor-card-count user-created-count" 
                        :id-name="idName" 
                        :end-val="endVal" 
                        :color="color"
                        :countSize="countSize"
                        :countWeight="countWeight"
                    >
                        <p class="infor-intro-text textOpenStyle" slot="intro">{{ introText }}已开台</p>

                    </count-up>
                </Row>
            </Col>
        </div>
    </Card>
</template>

<script>
import countUp from './countUp.vue';

export default {
    name: 'inforCard',
    components: {
        countUp
    },
    props: {
        idName: String,
        endVal: Number,
        color: String,
        iconType: String,
        introText: String,
        countSize: {
            type: String,
            default: '30px'
        },
        countWeight: {
            type: Number,
            default: 700
        },
        iconSize: {
            type: Number,
            default: 40
        }
    }
};
</script>


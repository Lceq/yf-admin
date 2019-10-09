<template>
    <div>
        <Row type="flex">
            <Col span="8" v-for="(item, index) in dataList" :key="index" class="machine-box margin-top-15 flex-between-center">
                <div class="machine-box-left" :style="setBgMethods(item.machineState)">
                    <div class="progress-bar1">
                        <div class="progress-bar1-item1" :style="{height: item.values1<=100?item.values1+'%': '100%'}"></div>
                    </div>
                    <div class="progress-bar2">
                        <div class="progress-bar2-item2" :style="{height: item.values2<=100?item.values2+'%': '100%'}"></div>
                    </div>
                </div>
                <div class="machine-box-right">
                    <div class="machine-box-right-item">
                        <p>设定长度：{{item.setLengthValue}}M</p>
                        <p>桶内长度：{{item.bucketValue}}M</p>
                        <p>车速：{{item.carSpeed}}M/s</p>
                    </div>
                    <div class="edit-button">
                        <Icon @click="getDetailEvent(index)" type="ios-add-circle" :size="24" color="#5ee85e"/>
                    </div>
                </div>
            </Col>
        </Row>
        <backward-forward
                @on-backward="backwardEvent"
                @on-forward="forwardEvent"
        ></backward-forward>
    </div>
</template>
<script>
    import backwardForward from './backward-forward';
    export default {
        name: 'drawing-machine',
        components: {backwardForward},
        props: {
            dataList: {
                type: Array
            }
        },
        data () {
            return {};
        },
        methods: {
            forwardEvent () {
                // alert(1)
            },
            backwardEvent () {
                // alert(2)
            },
            getDetailEvent (e) {
                // console.log(e)
            }
        },
        computed: {
            setBgMethods () {
                return (e) => {
                    if (!e) {
                        return {
                            backgroundImage: `url(${require('../../../images/bing-tiao-red.png')})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '100%',
                            transition: 'all .5s'
                        };
                    } else {
                        return {
                            backgroundImage: `url(${require('../../../images/bing-tiao-green.png')})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '100%',
                            transition: 'all .5s'
                        };
                    }
                };
            }
        }
    };
</script>

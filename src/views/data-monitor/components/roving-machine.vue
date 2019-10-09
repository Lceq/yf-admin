<template>
    <div>
        <Row type="flex">
            <Col span="8" v-for="(item, index) in dataList" :key="index" class="machine-box margin-top-15 flex-between-center">
                <div class="machine-box-left" :style="setBgMethods(item.machineState)">
                    <!--<div class="cs-progress-bar">
                        <div class="cs-progress-bar-item" :style="{height: item.values4<=100?item.values4+'%': '100%'}"></div>
                    </div>-->
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
        name: 'roving-machine',
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
                            backgroundImage: `url(${require('../../../images/cs-red.png')})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '100%',
                            transition: 'all .5s'
                        };
                    } else {
                        return {
                            backgroundImage: `url(${require('../../../images/cs-blue.png')})`,
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

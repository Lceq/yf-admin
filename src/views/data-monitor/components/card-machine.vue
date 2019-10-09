<template>
    <div>
        <Row type="flex">
            <Col span="8" v-for="(item, index) in dataList" :key="index" class="machine-box margin-top-15 flex-left">
                <div class="machine-box-left" :style="setBgMethods(item.machineState)">
                    <div class="sm-progress-bar">
                        <div class="sm-progress-bar-item" :style="{height: item.values3<=100?item.values3+'%': '100%'}"></div>
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
        <sh-modal
                shModalTitle="编辑"
                :shModalState="shModalState"
                :confirmButtonLoading="shModalConfirmButtonLoading"
                @on-visible-change="shModalStateChange"
                @on-confirm="shModalConfirmEvent"
                @on-cancel="shModalCancelEvent"
        >
            <div slot="shModalContent">
                <div style="height: 300px;"></div>
            </div>
        </sh-modal>
    </div>
</template>
<script>
    import backwardForward from './backward-forward';
    import shModal from './sh-modal';
    export default {
        name: 'card-machine',
        components: { backwardForward, shModal },
        props: {
            dataList: {
                type: Array
            }
        },
        data () {
            return {
                shModalState: false,
                shModalConfirmButtonLoading: false
            };
        },
        methods: {
            shModalConfirmEvent () {
                this.shModalConfirmButtonLoading = true;
                // this.shModalState = false;
            },
            shModalCancelEvent () {
                this.shModalState = false;
            },
            shModalStateChange (e) {
                this.shModalState = e;
                if (!e) {
                    this.shModalConfirmButtonLoading = false;
                }
            },
            forwardEvent () {
                // alert(1)
            },
            backwardEvent () {
                // alert(2)
            },
            getDetailEvent (e) {
                // console.log(e)
                this.shModalState = true;
            }
        },
        computed: {
            setBgMethods () {
                return (e) => {
                    if (!e) {
                        return {
                            backgroundImage: `url(${require('../../../images/sm-gray.png')})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: '100%',
                            transition: 'all .5s'
                        };
                    } else {
                        return {
                            backgroundImage: `url(${require('../../../images/sm-red.png')})`,
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

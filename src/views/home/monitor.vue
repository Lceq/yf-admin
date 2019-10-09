<template>
    <card class="contentBigBox">
        <Row :gutter="20">
            <Col :xs="24" :sm="24" :md="24" :lg="18" :style="{ height: machineListHeight + 'px','overflow-y': 'auto','overflow-x': 'hidden'}">
                <div class="contentStyle">
                    <p class="leftTopIcon"></p>
                    <p class="rightTopIcon"></p>
                    <p class="leftBottomIcon"></p>
                    <p class="rightBottomIcon"></p>
                    <work-monitor
                            :allData="allData"
                            :activeMachineId="activeMachineId"
                            @clickMachineEvent="clickMachineEvent"
                    >
                    </work-monitor>
                </div>
            </Col>
            <Col :xs="24" :sm="24" :md="24" :lg="6" :style="{ height: machineListHeight + 'px',overflow: 'auto','overflow-x': 'hidden'}">
                <div class="contentStyle">
                    <p class="leftTopIcon"></p>
                    <p class="rightTopIcon"></p>
                    <p class="leftBottomIcon"></p>
                    <p class="rightBottomIcon"></p>
                    <Row>
                        <Col span="24" class="rightTimeStyle">
                            <p class="timeIcon"></p>
                            <p class="sh-timeFont">{{ times }}</p>
                        </Col>
                    </Row>
                    <Row class="machineDetailBar">
                        <Col>
                            <div>
                                <p class="machineDetailHeader">设备机台详情</p>
                                <div class="dashedStyle">
                                    <div class="machineDetailBar_subBar">
                                        <span>机台号</span>
                                        <span>{{ productObj.machineCode }}</span>
                                    </div>
                                    <div class="machineDetailBar_subBar">
                                        <span>工序</span>
                                        <span>{{ productObj.processName }}</span>
                                    </div>
                                    <div class="machineDetailBar_subBar">
                                        <span>下次计划保养时间</span>
                                        <span>{{ productObj.planMaintainTime }}</span>
                                    </div>
                                </div>
                                <div>
                                    <div class="dashedStyle marginTop10" v-for="(productItem,productIndex) in productObj.productList">
                                        <div class="machineDetailBar_subBar">
                                            <span>品种</span>
                                            <span>{{ productItem.productName }}</span>
                                        </div>
                                        <div class="machineDetailBar_subBar">
                                            <span>排产数量</span>
                                            <span>{{ productItem.planOutput }}</span>
                                        </div>
                                        <div class="machineDetailBar_subBar">
                                            <span>完工数量</span>
                                            <span>{{ productItem.output }}</span>
                                        </div>
                                        <div class="machineDetailBar_subBar">
                                            <span>未完工数量</span>
                                            <span>{{ productItem.planOutput - productItem.output }}</span>
                                        </div>
                                        <div class="machineDetailBar_subBar">
                                            <span>生产通知单</span>
                                            <span>{{ productItem.noticeSheetCode }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
    </card>
</template>

<script>
    import workMonitor from '../data-monitor/components/product-detail.vue';
    import publicJs from '../../libs/common';
    import api from '../../ajax/api';
    export default {
        components: {
            workMonitor
        },
        data () {
            return {
                times: publicJs.getDate(),
                machineListHeight: document.documentElement.clientHeight - 154,
                activeMachineId: null,
                allData: [],
                productObj: {
                    'machineCode': '',
                    'processName': '',
                    'productList': []
                }
            };
        },
        methods: {
            // 设备的点击事件
            clickMachineEvent (param) {
                this.activeMachineId = param.machineId;
                this.getMachineListHttp();
            },
            getMachineListHttp () {
                this.$fetch(
                    api.getNoticeMachineProductList(),
                    {
                        machineId: this.activeMachineId
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.productList.forEach((items) => {
                            if (items.output === null) {
                                items.output = 0;
                            };
                            if (items.planOutput === null) {
                                items.planOutput = 0;
                            }
                        });
                        this.productObj = res.data.res;
                    }
                });
            }
        },
        created () {
            this.$fetch(api.getProcessMachinesList()).then(res => {
                if (res.data.status === 200) {
                    let colors = ['#ef410b', '#50cef7', '#f7ce51', '#50f77c', '#ef6c0b', '#ec03f5', '#076eef'];
                    res.data.res.forEach((item, index) => {
                        this.$set(item, 'processId', item.id);
                        this.$set(item, 'processName', item.name);
                        this.$set(item, 'color', colors[index]);
                    });
                    this.allData = res.data.res;
                    // 默认第一个机台
                    this.activeMachineId = this.allData[0].machines[0].machine.id;
                    this.getMachineListHttp();
                }
            });
        },
        mounted () {
            // 窗口变化事件
            window.onresize = () => {
                // 表格的offsetTop + 菜单的距离 + 分页的高度
                this.machineListHeight = document.documentElement.clientHeight - 154;
            };
        }
    };
</script>

<style>
    .marginTop10{
        margin-top: 10px;
    }
    .dashedStyle{
        border-bottom: dashed 1px #166d78;
    }
    .machineDetailBar{
        background: #202d3e;
        border: solid 1px #2a7c7f;
        margin-top: 10px;
        border-radius: 4px;
        padding:14px;
    }
    .machineDetailHeader{
        font-size: 16px;
        color:#0cffe9;
        margin-bottom: 10px;
    }
    .machineDetailBar_subBar{
        height:40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #1e424f;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;
        margin-bottom: 10px;
    }
    .timeIcon{
        width:26px;
        height:26px;
        background: url('../../images/time.png') no-repeat center;
        margin-right:16px;
    }
    .rightTimeStyle{
        height:50px;
        border: solid 1px #1d6678;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#0cffe9;
        font-size: 18px;
        font-weight: bold;
    }
    .leftTopIcon{
        width:12px;
        height:12px;
        position: absolute;
        left:-1px;
        top:-1px;
        background: url("../../images/left-top.png") no-repeat;
    }
    .rightTopIcon{
        width:12px;
        height:12px;
        position: absolute;
        right:-1px;
        top:-1px;
        background: url("../../images/right-top.png") no-repeat;
    }
    .leftBottomIcon{
        width:12px;
        height:12px;
        position: absolute;
        left:-1px;
        bottom:-1px;
        background: url("../../images/left-bottom.png") no-repeat;
    }
    .rightBottomIcon{
        width:12px;
        height:12px;
        position: absolute;
        right:-1px;
        bottom:-1px;
        background: url("../../images/right-bottom.png") no-repeat;
    }
    .processTitle{
        line-height: 24px;
        margin-left:20px;
    }
    .contentBigBox{
        background: #243046;
    }
    .contentStyle{
        color: #fff;
        border: solid 1px #18a7a3;
        box-shadow: 0 0 60px #1d6678 inset;
        padding:20px 24px 6px 19px;
        position: relative;
        border-radius: 10px;
    }
    @font-face {
        font-family: 'sh-font-time';
        src:url("../../styles/fonts/DIGITAL-Dreamfat.ttf");
    }
    .sh-timeFont{
        font-family: 'sh-font-time';
        font-size: 16px;
        letter-spacing:2px
    }
</style>

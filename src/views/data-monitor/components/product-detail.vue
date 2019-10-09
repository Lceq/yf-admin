<template>
    <div>
        <div v-for="(processItem,processIndex) in allData" :key="processIndex">
            <div>
                <p :style="{width:'4px',height: '24px',background: processItem.color}"></p>
                <p class="processTitle">{{processItem.processName}}</p>
            </div>
            <Row :gutter="10" class="process-bar" type="flex">
                <Col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" :xxl="3" v-for="(machineItem,machineIndex) in processItem.machines" :key="machineIndex" class="margin-bottom-10">
                    <div @click="clickMachineEvent(processItem.processId,machineItem.machine.id)" :class="activeMachineId === machineItem.machine.id ? 'activeStyle' : 'machine-bar-item'">
                        <p style="width: 80%;">{{machineItem.machine.name}}</p>
                        <p :style="setMachineStateIcon(machineItem.machineState)"></p>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['allData', 'activeMachineId'],
        methods: {
            // 设备的点击事件
            clickMachineEvent (processId, machineId) {
                this.$emit('clickMachineEvent', { processId: processId, machineId: machineId });
            }
        },
        computed: {
            setMachineStateIcon () {
                return (e) => {
                    if (e === 0) {
                        return {
                            width: '26px',
                            height: '26px',
                            background: 'url(\'/src/images/working.png\') no-repeat center'
                        };
                    } else if (e === 1) {
                        return {
                            width: '26px',
                            height: '26px',
                            background: 'url(\'/src/images/stop.png\') no-repeat center'
                        };
                    } else if (e === 2) {
                        return {
                            width: '26px',
                            height: '26px',
                            background: 'url(\'/src/images/warning.png\') no-repeat center'
                        };
                    } else if (e === 3) {
                        return {
                            width: '26px',
                            height: '26px',
                            background: 'url(\'/src/images/pause.png\') no-repeat center'
                        };
                    };
                };
            }
        }
    };
</script>
<style scoped>
    .activeStyle{
        border: solid 1px #189898;
        border-radius: 4px;
        box-shadow: 0 0 10px #189898;
        color: #fff;
        background: #284e69;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        width: 100%;
        height: 100%;
        background-size: 100% 100%;
        padding: 0 4px;
        font-size: 12px;
        box-sizing: border-box;
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
    }
    .processTitle{
        line-height: 24px;
        margin-left:20px;
        font-weight: bold;
        font-size: 16px;
    }
    .machine-bar-item{
        width: 100%;
        height: 100%;
        background:url("../../../images/workMachineBar.png") no-repeat;
        background-size: 100% 100%;
        color: #c2d8ff;
        padding: 0 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        font-size: 12px;
        border: solid 1px rgba(24, 152, 152, 0);
    }
    .process-bar{
        margin:20px 0;
    }
</style>

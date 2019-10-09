<template>
    <Card class="big-box">
        <div class="flex-left">
            <div class="margin-right-10 query-bar-left flex-left">
                <RadioGroup v-model="dynamicComponents" type="button" @on-change="getMenuEvent">
                    <Radio label="1" disabled>总貌</Radio>
                    <Radio label="2" disabled>清花</Radio>
                    <Radio label="cardMachine">梳棉</Radio>
                    <Radio label="drawingMachine">并条</Radio>
                    <Radio label="rovingMachine">粗纱</Radio>
                    <Radio label="spinningMachine">细纱</Radio>
                    <Radio label="7" disabled>电耗</Radio>
                    <Radio label="8" disabled>空调</Radio>
                </RadioGroup>
                <Button type="primary" shape="circle" @click="fullScreenEvent" :icon="isPresentFullScreen ? 'ios-exit' : 'ios-expand'" class="full-screen-button"></Button>
            </div>
        </div>
        <component :is="dynamicComponents" :dataList="dataList"></component>
    </Card>
</template>
<script>
    import drawingMachine from './components/drawing-machine';// 并条机
    import rovingMachine from './components/roving-machine';// 粗纱机
    import spinningMachine from './components/spinning-machine';// 细纱机
    import cardMachine from './components/card-machine';// 梳棉机
    let clearTimes1;
    let clearTimes2;
    let clearTimes3;
    export default {
        components: { drawingMachine, rovingMachine, spinningMachine, cardMachine },
        data () {
            return {
                dynamicComponents: 'cardMachine',
                isPresentFullScreen: false,
                dataList: [
                    {
                        setLengthValue: 123,
                        bucketValue: 333,
                        carSpeed: 500,
                        machineState: false,
                        values1: 100,
                        values2: 20,
                        values3: 90,
                        values4: 20
                    },
                    {
                        setLengthValue: 67,
                        bucketValue: 8,
                        carSpeed: 98,
                        machineState: true,
                        values1: 40,
                        values2: 30,
                        values3: 10,
                        values4: 90
                    },
                    {
                        setLengthValue: 46,
                        bucketValue: 83,
                        carSpeed: 79,
                        machineState: false,
                        values1: 70,
                        values2: 60,
                        values3: 40,
                        values4: 10
                    },
                    {
                        setLengthValue: 97,
                        bucketValue: 3637,
                        carSpeed: 278,
                        machineState: true,
                        values1: 0,
                        values2: 90,
                        values3: 70,
                        values4: 60
                    },
                    {
                        setLengthValue: 75,
                        bucketValue: 35,
                        carSpeed: 283,
                        machineState: false,
                        values1: 50,
                        values2: 70,
                        values3: 80,
                        values4: 100
                    },
                    {
                        setLengthValue: 46,
                        bucketValue: 83,
                        carSpeed: 79,
                        machineState: true,
                        values1: 60,
                        values2: 80,
                        values3: 100,
                        values4: 40
                    },
                    {
                        setLengthValue: 97,
                        bucketValue: 3637,
                        carSpeed: 278,
                        machineState: true,
                        values1: 20,
                        values2: 60,
                        values3: 30,
                        values4: 75
                    },
                    {
                        setLengthValue: 75,
                        bucketValue: 35,
                        carSpeed: 283,
                        machineState: false,
                        values1: 10,
                        values2: 50,
                        values3: 50,
                        values4: 20
                    },
                    {
                        setLengthValue: 75,
                        bucketValue: 35,
                        carSpeed: 283,
                        machineState: false,
                        values1: 10,
                        values2: 50,
                        values3: 50,
                        values4: 20
                    }
                ],
                showSwitch: true
            };
        },
        methods: {
            fullScreenChangeEvent () {
                // 全屏
                if (document.isFullScreen || document.mozFullScreen || document.webkitIsFullScreen || document.msIsFullScreen) {
                    if (document.getElementsByClassName('big-box')[0].clientWidth >= document.body.offsetWidth - 100) {
                        this.isPresentFullScreen = true;
                    };
                } else {
                    this.isPresentFullScreen = false;
                };
            },
            // 全屏事件
            fullScreenEvent () {
                let main = document.getElementsByClassName('big-box')[0];
                if (!this.isPresentFullScreen) {
                    if (main.requestFullscreen) {
                        main.requestFullscreen();
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen();
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen();
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen();
                    }
                    this.isPresentFullScreen = true;
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.isPresentFullScreen = false;
                };
            },
            getMenuEvent (e) {
                this.dynamicComponents = e;
                if (e === 'cardMachine') {
                    clearTimes1 = setInterval(() => {
                        this.dataList.forEach((item, idnex) => {
                            this.dataList[idnex].values3 = this.dataList[idnex].values3 + 20;
                            this.dataList[idnex].machineState = !this.dataList[idnex].machineState;
                            if (this.dataList[idnex].values3 > 100) {
                                this.dataList[idnex].values3 = 0;
                            };
                        });
                    }, 1000);
                    clearInterval(clearTimes2);
                } else if (e === 'drawingMachine') {
                    clearTimes2 = setInterval(() => {
                        this.dataList.forEach((item, idnex) => {
                            this.dataList[idnex].values1 = this.dataList[idnex].values1 + 20;
                            this.dataList[idnex].values2 = this.dataList[idnex].values2 + 20;
                            this.dataList[idnex].machineState = !this.dataList[idnex].machineState;
                            if (this.dataList[idnex].values1 > 100) {
                                this.dataList[idnex].values1 = 0;
                            };
                            if (this.dataList[idnex].values2 > 100) {
                                this.dataList[idnex].values2 = 0;
                            };
                        });
                    }, 1000);
                    clearInterval(clearTimes1);
                } else if (e === 'rovingMachine') {
                    clearTimes3 = setInterval(() => {
                        this.dataList.forEach((item, idnex) => {
                            this.dataList[idnex].values4 = this.dataList[idnex].values4 + 20;
                            this.dataList[idnex].machineState = !this.dataList[idnex].machineState;
                            if (this.dataList[idnex].values4 > 100) {
                                this.dataList[idnex].values4 = 0;
                            };
                        });
                    }, 1000);
                    clearInterval(clearTimes1);
                    clearInterval(clearTimes2);
                } else if (e === 'cardMachine') {
                    clearInterval(clearTimes1);
                    clearInterval(clearTimes2);
                } else {
                    clearInterval(clearTimes1);
                    clearInterval(clearTimes2);
                };
            }
        },
        mounted () {
            document.addEventListener('fullscreenchange', () => {
                this.fullScreenChangeEvent();
            });
            setInterval(() => {
                this.showSwitch = !this.showSwitch;
            }, 1000);
        }
    };
</script>
<style>
    @import "monitort.css";
</style>


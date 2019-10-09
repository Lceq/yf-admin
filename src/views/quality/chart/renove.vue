<template>
    <div>
        <div ref="series" :style="'width: 100%; height: ' + height + 'px;display: inline-block;'"></div>
    </div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'renove',
        props: {
            renovateList: {
                type: Array
            },
            renovateMath: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        methods: {
            getRenovateList () {
                let data = [];
                this.renovateList.map(item => {
                    data.push({
                        name: item.name,
                        type: 'bar',
                        data: item.qmProcessList.map(x => x.count)
                    });
                });
                return data;
            },
            drawLineEN () {
                // debugger
                let myChart = echarts.init(this.$refs.series);
                // 绘制图表
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        // data: ['蒸发量', '降水量']
                        data: this.renovateList.map(x => x.name),
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            // data: ['1', '2', '3']
                            data: this.renovateList[0].qmProcessList.map(x => x.processName),
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }
                    ],
                    series: this.getRenovateList()
                };
                myChart.setOption(option);
            }
        },
        watch: {
            renovateMath () {
                // debugger
                this.$nextTick(() => {
                    this.drawLineEN();
                    let myChart = echarts.init(this.$refs.series);
                    myChart.resize();
                });
            }
        },
        created () {
            // debugger
        },
        mounted () {
            // debugger
            // this.drawLineEN();
            let myChart = echarts.init(this.$refs.series);
            window.addEventListener('resize', function () {
                myChart.resize();
                // this.drawLineEN();
            });
        }
    };
</script>

<style scoped>

</style>

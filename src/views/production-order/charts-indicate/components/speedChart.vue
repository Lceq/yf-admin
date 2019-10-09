<template>
    <div style="width:100%;height:100%;" id="speedChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'speedChart',
        props: {
            xAxisData: Array,
            spindleLength: Array,
            currentLength: Array,
            spindleSpeed: Array
        },
        data () {
            return {

            };
        },
        methods: {
            initChart () {
                this.$nextTick(() => {
                    let visiteVolume = echarts.init(document.getElementById('speedChart'));
                    const option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                crossStyle: {
                                    color: '#999'
                                }
                            }
                        },
                        toolbox: {
                            feature: {
                                dataView: {show: true, readOnly: false},
                                magicType: {show: true, type: ['line', 'bar']},
                                saveAsImage: {show: true}
                            },
                            iconStyle: {
                                normal: {
                                    borderColor: '#fff'// 边框颜色
                                }
                            }
                        },
                        legend: {
                            data: ['锭速', '定长', '当前长度'],
                            textStyle: {
                                color: '#fff'
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: this.xAxisData,
                                axisPointer: {
                                    type: 'shadow'
                                },
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: 'orange',
                                        width: '1'// 坐标线的宽度
                                    }
                                },
                                axisLabel: {
                                    textStyle: {
                                        color: '#fff'// 坐标值得具体的颜色

                                    }
                                }
                            }
                        ],
                        grid: {
                            x: 90,
                            x2: 66,
                            y2: 40
                        },
                        yAxis: [
                            {
                                type: 'value',
                                name: '锭速',
                                min: 0,
                                max: 20000,
                                interval: 4000,
                                axisLabel: {
                                    formatter: '{value} m/min',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: 'orange', // 左边线的颜色
                                        width: '1'// 坐标线的宽度
                                    },
                                    textStyle: {
                                        color: 'red'
                                    }
                                }
                            },
                            {
                                type: 'value',
                                name: '定长',
                                min: 0,
                                max: 5000,
                                interval: 500,
                                axisLabel: {
                                    formatter: '{value} m',
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: 'orange', // 左边线的颜色
                                        width: '1'// 坐标线的宽度
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#3e4555',
                                        type: 'solid'
                                    }
                                }
                            }

                        ],
                        series: [
                            {
                                name: '锭速',
                                type: 'line',
                                data: this.spindleSpeed,
                                yAxisIndex: 0,
                                axisLine: {
                                    lineStyle: {
                                        type: 'solid',
                                        color: '#fff', // 左边线的颜色
                                        width: '1'// 坐标线的宽度
                                    }
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: 'red',
                                        type: 'solid'
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: '#01C4D6',
                                        lineStyle: {
                                            color: '#01C4D6'
                                        }
                                    }
                                }
                            },
                            {
                                name: '定长',
                                type: 'bar',
                                yAxisIndex: 1,
                                data: this.spindleLength,
                                itemStyle: {
                                    normal: {
                                        color: '#C23531',
                                        lineStyle: {
                                            color: '#C23531'
                                        }
                                    }
                                }
                            },
                            {
                                name: '当前长度',
                                type: 'scatter',
                                yAxisIndex: 1,
                                data: this.currentLength,
                                itemStyle: {
                                    normal: {
                                        color: '#EFC51B',
                                        lineStyle: {
                                            color: '#EFC51B'
                                        }
                                    }
                                }
                            }
                        ]
                    };

                    visiteVolume.setOption(option);

                    window.addEventListener('resize', function () {
                        visiteVolume.resize();
                    });
                });
            }
        },
        watch: {
            xAxisData (a, b) {
                console.log(a, b);
                this.initChart();
            }
        },
        mounted () {
            this.initChart();
        }
    };
</script>

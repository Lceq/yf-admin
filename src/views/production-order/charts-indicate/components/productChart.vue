<template>
    <div style="width:100%;height:100%;" id="productOutputChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'productOutputChart',
        data () {
            return {
                //
            };
        },
        mounted () {
            this.$nextTick(() => {
                let visiteVolume = echarts.init(document.getElementById('productOutputChart'));
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['Ring 30S', 'Siro 30S', 'Siro 40S'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#fff', // 左边线的颜色
                                width: '1'// 坐标线的宽度
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'// 坐标值得具体的颜色

                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#fff', // 左边线的颜色
                                width: '1'// 坐标线的宽度
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#fff'// 坐标值得具体的颜色

                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: '#3e4555',
                                type: 'solid'
                            }
                        }
                    },
                    series: [
                        {
                            name: 'Ring 30S',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#1f9cf0'

                                }
                            },
                            data: [13307.69, 12855.28, 13343.4, 13177.55, 0, 0, 0]
                        },
                        {
                            name: 'Siro 30S',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f2622d'

                                }
                            },
                            data: [4212.66, 4857.6, 4781.86, 6281.54, 0, 0, 0]
                        },
                        {
                            name: 'Siro 40S',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#efc51b'

                                }
                            },
                            data: [2883.01, 2965.2, 2979, 3012.43, 0, 0, 0]
                        }
                    ]
                };

                visiteVolume.setOption(option);

                window.addEventListener('resize', function () {
                    visiteVolume.resize();
                });
            });
        }
    };
</script>

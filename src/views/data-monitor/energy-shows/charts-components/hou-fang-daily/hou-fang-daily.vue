<template>
    <div style="width: 100%;height: 100%;" id="hfElectricityDailyChart"></div>
</template>
<script>
    import echarts from 'echarts';
    let _this = this;
    export default {
        data () {
            return {
                chartsData: [10, 52, 200, 334, 390, 330, 220]
            };
        },
        methods: {

        },
        mounted () {
            _this = this;
            this.$nextTick(() => {
                let echartsExample = echarts.init(document.getElementById('hfElectricityDailyChart'));
                let option = {
                    title: {
                        text: '后纺用电',
                        subtext: '当前日用电',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['后纺用电'],
                        textStyle: {
                            color: '#a6bbcc'
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                            axisLine: {
                                color: 'blur', //
                                lineStyle: {
                                    type: 'solid',
                                    color: '#C9CCD0'// y轴的颜色
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#C9CCD0'// y坐标轴的刻度值的颜色
                                }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                color: 'blur', //
                                lineStyle: {
                                    type: 'solid',
                                    color: '#C9CCD0'// y轴的颜色
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#C9CCD0'// y坐标轴的刻度值的颜色
                                }
                            },
                            splitLine: { // 分割线的颜色、类型：虚线和实线
                                show: true,
                                lineStyle: {
                                    color: '#555252',
                                    type: 'solid'
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '后纺用电',
                            type: 'bar',
                            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                            itemStyle: {
                                normal: {
                                    color: '#2d8cf0'
                                },
                                emphasis: {
                                    color: '#c5c8ce'
                                }
                            },
                            markPoint: {
                                data: [
                                    {type: 'max', name: '最大值'},
                                    {type: 'min', name: '最小值'}
                                ]
                            },
                            markLine: {
                                data: [
                                    {type: 'average', name: '平均值'}
                                ]
                            }
                        }
                    ]
                };

                echartsExample.setOption(option);
                let index = 0; // 播放所在下标
                let mTime = setInterval(() => {
                    echartsExample.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: index
                    });
                    index++;
                    if (index >= _this.chartsData.length) {
                        index = 0;
                    }
                }, 1000);
                window.addEventListener('resize', function () {
                    echartsExample.resize();
                });
            });
        }
    };
</script>

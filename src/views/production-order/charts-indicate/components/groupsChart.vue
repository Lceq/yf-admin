<template>
    <div style="width:100%;height:100%;" id="groupsOutputChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'groupsOutputChart',
        data () {
            return {
                //
            };
        },
        mounted () {
            this.$nextTick(() => {
                let visiteVolume = echarts.init(document.getElementById('groupsOutputChart'));
                let xAxisData = [];
                let data1 = [];
                let data2 = [];
                for (let i = 0; i < 20; i++) {
                    xAxisData.push('类目' + i);
                    data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
                    data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
                }

                const option = {
                    title: {
                        // text: '世界人口总量',
                        // subtext: '数据来自网络'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['上周', '当周'],
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
                        data: ['前纺甲班(粗纱)', '前纺乙班(粗纱)', '后纺甲班(细纱)', '后纺乙班(细纱)'],

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
                        boundaryGap: [0, 0.01],
                        axisLine: {
                            lineStyle: {
                                type: 'solid',
                                color: '#fff', // 左边线的颜色
                                width: '1'// 坐标线的宽度
                            }
                        },
                        axisLabel: {
                            // formatter: '{value} 公斤',//单位
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
                            name: '上周',
                            type: 'bar',
                            data: [79086.73, 90230.54, 78618.24, 72895.5],
                            itemStyle: {
                                normal: {
                                    color: '#025f64',
                                    lineStyle: {
                                        color: '#05b0c2'
                                    }
                                }
                            }
                        },
                        {
                            name: '当周',
                            type: 'bar',
                            data: [41352.78, 48669.26, 39450.55, 42126.43],
                            itemStyle: {
                                normal: {
                                    color: '#03c4d5',
                                    lineStyle: {
                                        color: '#005d65'
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
    };
</script>

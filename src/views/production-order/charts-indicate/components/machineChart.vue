<template>
    <div style="width:100%;height:100%;" id="machineOutputChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'machineOutputChart',
        data () {
            return {
                //
            };
        },
        mounted () {
            this.$nextTick(() => {
                let visiteVolume = echarts.init(document.getElementById('machineOutputChart'));
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
                        // text: '机台产量'
                    },
                    tooltip: {
                        trigger: 'axis'
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
                    /* toolbox: {
                        feature: {
                            saveAsImage: {
                                show: true,                         //是否显示该工具。
                                type:"png",                         //保存的图片格式。支持 'png' 和 'jpeg'。
                                name:"pic1",                        //保存的文件名称，默认使用 title.text 作为名称
                                backgroundColor:"red",        //保存的图片背景色，默认使用 backgroundColor，如果backgroundColor不存在的话会取白色
                                title:"导出",
                                pixelRatio:1
                            }
                        }
                    }, */
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
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
                            name: '当周',
                            type: 'line',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    color: '#03c4d5',
                                    lineStyle: {
                                        color: '#05b0c2'
                                    }
                                }
                            },
                            data: [20857.84168, 21159.75663, 21590.5474, 22968.84356, 0, 0, 0]
                        },
                        {
                            name: '上周',
                            type: 'line',
                            // stack: '总量',
                            itemStyle: {
                                normal: {
                                    color: '#025f64',
                                    lineStyle: {
                                        color: '#005d65'
                                    }
                                }
                            },
                            data: [20172.67505, 21714.04182, 11356.07937, 22980.75812, 22908.63532, 22373.94958, 22366.32426]
                        }
                        /* {
                            name:'当周',
                            type:'line',
                            stack: '总量',
                            itemStyle : {
                                normal : {
                                    color:'#03c4d5',
                                    lineStyle:{
                                        color:'#05b0c2'
                                    }
                                }
                            },
                            data:[220, 82, 191, 234, 290, 330, 210]
                        } */
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

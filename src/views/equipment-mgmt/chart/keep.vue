<template>
    <div>
        <div ref="series" :style="'width: 100%; height: ' + height + 'px;display: inline-block;top:-57px'"></div>
    </div>
</template>
<script>
import echarts from 'echarts';
export default {
    name: 'repair',
    props: {
        keepOrderList: {
            type: Array
        },
        keepMath: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    methods: {
        getKeepList () {
            let List = [];
            this.keepOrderList.map(item => {
                let obj = {
                    id: item.id,
                    color: item.id === 0 ? '#F2622D' : (item.id === 1 ? '#2DCC70' : '#EFC51B'),
                    name: item.name,
                    typeNumList: item.typeNumList,
                    value: item.count
                };
                List.push(obj);
            });
            return List;
        },
        drawLineEN () {
            // debugger
            let myChart = echarts.init(this.$refs.series);
            // 绘制图表
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        for (var i = 0; i < option.series[0].data.length; i++) {
                            if (option.series[0].data[i].name === params.data.name && option.series[0].data[i].id === params.data.id) {
                                let obj = '';
                                for (var j = 0; j < params.data.typeNumList.length; j++) {
                                    obj = obj + (j > 0 ? '<br/>' : '') + params.data.typeNumList[j].name + ': ' + params.data.typeNumList[j].count;
                                }
                                return obj;
                            }
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    top: 80,
                    left: 'left',
                    data: this.getKeepList().map(item => item.name),
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: '保养统计',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        color: this.getKeepList().map(item => item.color),
                        data: this.getKeepList(),
                        label: {
                            normal: { // 正常的样式
                                show: true,
                                position: 'inside',
                                formatter: function (params) {
                                    return params.value;
                                },
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '14',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false,
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            normal: {
                            },
                            emphasis: {
                                // shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            myChart.setOption(option);
        }
    },
    watch: {
        keepMath () {
            this.$nextTick(() => {
                // debugger
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

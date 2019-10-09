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
            pieList: {
                type: Array
            },
            pieMath: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        methods: {
            getRenovateList () {
                let data = [];
                this.pieList.map(item => {
                    data.push({
                        processCount: item.processName + '：' + item.count,
                        count: item.count,
                        processName: item.processName
                    });
                });
                return data;
            },
            drawLineEN () {
                // debugger
                let myChart = echarts.init(this.$refs.series);
                // 绘制图表
                let option = {
                    color: ['#01c4d6', '#f2622d', '#efc51b', '#c23531', '#2dcc70', '#025F64'],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        bottom: '15%',
                        top: '5%',
                        containLabel: true
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y: 'left',
                        data: this.pieList.map(x => x.processName),
                        formatter: function (name) {
                            let count = option.series[0].data.find(x => x.name === name).value;
                            return name + '：' + count;
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: '20'
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                        }
                    },
                    calculable: false,
                    series: [
                        {
                            name: '工序',
                            type: 'pie',
                            radius: '70%',
                            center: ['50%', '60%'],
                            label: {
                                normal: { // 正常的样式
                                    show: true,
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: '20',
                                        fontWeight: 'normal'
                                    }
                                }
                            },
                            data: this.getRenovateList().map(x => {
                                return {
                                    value: x.count,
                                    name: x.processName
                                };
                            })
                        }
                    ]
                };
                myChart.setOption(option);
            }
        },
        watch: {
            pieMath () {
                this.$nextTick(() => {
                    this.drawLineEN();
                    let myChart = echarts.init(this.$refs.series);
                    myChart.resize();
                });
            }
        },
        created () {
        },
        mounted () {
            // debugger
            this.drawLineEN();
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

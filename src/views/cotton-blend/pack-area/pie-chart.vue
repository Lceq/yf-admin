<template>
    <div style="width:568px;height:600px;background: #22272d" id="reciprocatingPieChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'pieChart',
        props: {
            pieChartData: {
                type: Object
            }
        },
        data () {
            return {
                innerPacketData: [],
                outPacketData: []
            };
        },
        methods: {
            getOuterData (val) {
                let outerData = [];
                for (let j = 1; j <= this.pieChartData.outerPacketNumber; j++) {
                    outerData.push({
                        value: 300,
                        name: j
                    });
                    outerData.push({
                        value: 50,
                        name: j + '#'
                    });
                };
                return outerData;
            },
            getInnerData (val) {
                let innerData = [];
                for (let i = 1; i <= this.pieChartData.innerPacketNumber; i++) {
                    innerData.push({
                        value: 300,
                        name: i
                    });
                    innerData.push({
                        value: 50,
                        name: i + '#'
                    });
                };
                return innerData;
            },
            // 实例化图形
            initCharts () {
                this.$nextTick(() => {
                    let visitVolume = echarts.init(document.getElementById('reciprocatingPieChart'));
                    const option = {
                        legend: {
                            orient: 'vertical',
                            x: 'top'
                        },
                        series: [
                            {
                                name: '内圈包数',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: ['30%', '48%'],
                                color: ['#f1f1f1', '#fff'],
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inner',
                                        textStyle: {
                                            color: '#000',
                                            fontSize: '14',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: this.innerPacketData,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#515A6E'
                                    }
                                }
                            },
                            {
                                name: '外圈包数',
                                type: 'pie',
                                selectedMode: 'single',
                                radius: ['50%', '90%'],
                                color: ['#f1f1f1', '#fff'],
                                label: {
                                    normal: { // 正常的样式
                                        show: true,
                                        position: 'inside',
                                        textStyle: {
                                            color: '#000',
                                            fontSize: '14',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    emphasis: { // 选中时候的样式
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                data: this.outPacketData,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#515A6E'
                                    }
                                }
                            }
                        ]
                    };
                    visitVolume.setOption(option);
                    window.addEventListener('resize', function () {
                        visitVolume.resize();
                    });
                });
            }
        },
        mounted () {
            this.initCharts();
        },
        watch: {
            pieChartData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        this.outPacketData = [];
                        this.innerPacketData = [];
                        for (let j = 1; j <= this.pieChartData.outerPacketNumber; j++) {
                            this.outPacketData.push({value: 300, name: '外' + j + '#'});
                            this.outPacketData.push({value: 50, name: '外' + j});
                        };
                        for (let i = 1; i <= this.pieChartData.innerPacketNumber; i++) {
                            this.innerPacketData.push({value: 300, name: '内' + i + '#'});
                            this.innerPacketData.push({value: 50, name: '内' + i});
                        };
                        this.initCharts();
                    }
                },
                deep: true
            }
        }
    };
</script>

<template>
    <div style="width:700px;height:700px;background: #22272d" id="reciprocatingPieChart"></div>
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
                innerPacketColorList: [],
                outPacketColorList: [],
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
                        name: '外' + j
                    });
                    outerData.push({
                        value: 100,
                        name: '外' + j + '#'
                    });
                };
                return outerData;
            },
            getInnerData (val) {
                let innerData = [];
                for (let i = 1; i <= this.pieChartData.innerPacketNumber; i++) {
                    innerData.push({
                        value: 300,
                        name: '内' + i
                    });
                    innerData.push({
                        value: 100,
                        name: '内' + i + '#'
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
                                color: this.innerPacketColorList,
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
                                itemStyle: {
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#515A6E'
                                    }
                                },
                                data: this.innerPacketData
                            },
                            {
                                selectedMode: 'single',
                                name: '外圈包数',
                                type: 'pie',
                                radius: ['50%', '90%'],
                                color: this.outPacketColorList,
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inside',
                                        textStyle: {
                                            color: '#000',
                                            fontSize: '14',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '16',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        borderWidth: 2,
                                        borderColor: '#515A6E'
                                    }
                                },
                                data: this.outPacketData
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
                        this.outPacketColorList = this.pieChartData.outPacketColorList;
                        this.innerPacketColorList = this.pieChartData.innerPacketColorList;
                        this.outPacketData = [];
                        this.innerPacketData = [];
                        if (newVal.hasCrevice) {
                            // 有缝
                            for (let j = 1; j <= this.pieChartData.outerPacketNumber; j++) {
                                this.outPacketData.push({value: 300, name: '外' + j + '#'});
                                this.outPacketData.push({value: 100, name: '外' + j});
                            };
                            for (let i = 1; i <= this.pieChartData.innerPacketNumber; i++) {
                                this.innerPacketData.push({value: 300, name: '内' + i + '#'});
                                this.innerPacketData.push({value: 100, name: '内' + i});
                            };
                        } else {
                            // 无缝
                            for (let j = 1; j <= this.pieChartData.outerPacketNumber; j++) {
                                this.outPacketData.push({value: 300, name: '外' + j + '#'});
                            };
                            for (let i = 1; i <= this.pieChartData.innerPacketNumber; i++) {
                                this.innerPacketData.push({value: 300, name: '内' + i + '#'});
                            };
                        };
                        this.initCharts();
                    };
                },
                deep: true
            }
        }
    };
</script>

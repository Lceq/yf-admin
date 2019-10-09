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
            attendanceList: {
                type: Object
            },
            attendanceMath: {
                type: Number
            },
            height: {
                type: Number
            }
        },
        methods: {
            // getRenovateList () {
            //     let data = [];
            //     this.renovateList.map(item => {
            //         data.push({
            //             name: item.name,
            //             type: 'bar',
            //             data: item.qmProcessList.map(x => x.count)
            //         });
            //     });
            //     return data;
            // },
            drawLineEN () {
                // debugger
                let myChart = echarts.init(this.$refs.series);
                // 绘制图表
                let option = {
                    // title : {
                    //     text: '某站点用户访问来源',
                    //     subtext: '纯属虚构',
                    //     x:'center'
                    // },
                    color: ['#01c4d6', '#f2622d', '#efc51b'],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        // orient: 'vertical',
                        x: 'center',
                        data: ['实到', '旷工', '请假'],
                        formatter: function (name) {
                            let count = option.series[0].data.find(x => x.name === name).value;
                            return name + '：' + count;
                        },
                        textStyle: {
                            color: '#fff',
                            fontSize: '18'
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
                            name: '人员考勤',
                            type: 'pie',
                            radius: '55%',
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
                            data: [
                                {value: this.attendanceList.actual, name: '实到',
                                    label: {
                                        normal: { // 正常的样式
                                            show: true,
                                            textStyle: {
                                                color: '#fff',
                                                fontSize: '20',
                                                fontWeight: 'normal'
                                            }
                                        }
                                    }
                                },
                                {value: this.attendanceList.absenteeism, name: '旷工'},
                                {value: this.attendanceList.leave, name: '请假'}
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
            }
        },
        watch: {
            attendanceMath () {
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

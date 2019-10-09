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
        repairOrderList: {
            type: Array
        },
        repairMath: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    methods: {
        getRepairList () {
            let List = [];
            this.repairOrderList.map(item => {
                let obj = {
                    id: item.id,
                    color: item.id === 0 ? '#F2622D' : (item.id === 1 ? '#2DCC70' : '#EFC51B'),
                    // name: item.count,
                    name: item.name,
                    // name: x.typeName + '(' + item.name.split('')[0] + '): ' + x.count,
                    typeNumList: item.typeNumList,
                    value: item.count
                };
                List.push(obj);
                // });
            });
            // console.log(List);
            return List;
        },
        drawLineEN () {
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
                                    obj = obj + (j > 0 ? '<br/>' : '') + params.data.typeNumList[j].typeName + ': ' + params.data.typeNumList[j].count;
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
                    data: this.getRepairList().map(item => item.name),
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: [
                    {
                        name: '故障统计',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        color: this.getRepairList().map(x => x.color),
                        data: this.getRepairList(),
                        label: {
                            normal: { // 正常的样式
                                show: true,
                                position: 'inside',
                                formatter: function (params) {
                                    return params.value;
                                },
                                textStyle: {
                                    color: '#fff',
                                    fontSize: '12',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true,
                                color: '#fff'
                            }
                        },
                        itemStyle: {
                            normal: {
                                // color: #000,
                                // opacity: 0.7,
                                // borderWidth: 1,
                                // borderColor: '#fff'
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
        repairMath () {
            // let myChart = echarts.init(this.$refs.series);
            // window.addEventListener('resize', function () {
            //     myChart.resize();
            // });
            this.$nextTick(() => {
                // debugger
                this.drawLineEN();
                let myChart = echarts.init(this.$refs.series);
                myChart.resize();
            });
        }
    },
    mounted () {
        this.drawLineEN();
        let myChart = echarts.init(this.$refs.series);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    }
};
</script>

<style scoped>

</style>

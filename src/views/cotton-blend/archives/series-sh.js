import echarts from 'echarts';
export default ({
    props: {
        seriesList: {
            type: Object
        },
        roundelSeriesMath: {
            type: Number
        }
    },
    data () {
        return {
            average: 5,
            dataList: [],
            dataColorList: [],
            // baseColorList: ['#666', '#555'],
            baseList: [
                {
                    value: 1,
                    name: 1
                },
                {
                    value: 4,
                    name: 1
                }
            ]
        };
    },
    methods: {
        getDataList (val) {
            // const _this = this;
            let data = [];
            // _this.dataColorList = []
            for (let i = 1; i <= val; i++) {
                data.push({
                    value: 3,
                    name: i
                });
                data.push({
                    value: 17,
                    name: i + '#'
                });
            }
            return data;
        },
        getColorList (val) {
            const _this = this;
            let data = [];
            // _this.dataColorList = []
            for (let i = 1; i <= val; i++) {
                data.push('#fff');
                data.push('#fff');
            }
            return data;
        },
        drawLineEN () {
            let myChart = echarts.init(this.$refs.series);
            // 绘制图表
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}:'
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: ['直接访问']
                },
                series: [
                    {
                        name: '内圈',
                        type: 'pie', // 环形图的type和饼图相同
                        radius: this.seriesList.radius, // 饼图的半径，第一个为内半径，第二个为外半径
                        // avoidLabelOverlap: true,
                        color: this.seriesList.colorList,
                        label: {
                            normal: { // 正常的样式
                                show: true,
                                position: 'inside',
                                textStyle: {
                                    color: '#000',
                                    fontSize: '14',
                                    fontWeight: 'normal'
                                }
                            },
                            emphasis: { // 选中时候的样式
                                show: true,
                                textStyle: {
                                    fontSize: '16',
                                    fontWeight: 'bold'
                                }
                            }
                        }, // 提示文字
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                // color: #000,
                                // opacity: 0.7,
                                borderWidth: 2,
                                borderColor: '#515A6E'
                            }
                        },
                        data: this.getDataList(this.seriesList.average)
                    }
                ]
            };
            myChart.setOption(option);
            myChart.on('click', this.eConsole);
        },
        eConsole: function (param) {
            // alert(option.series[0].data.length);
            // alert(option.series[0].data[i]);
            // param.dataIndex 获取当前点击索引，
            console.log(param.dataIndex);
            // debugger
        }
    },
    watch: {
        roundelSeriesMath () {
            this.$nextTick(() => {
            // this.getDataList()
                this.drawLineEN();
            });
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.getDataList()
            this.drawLineEN();
        });
    }
});

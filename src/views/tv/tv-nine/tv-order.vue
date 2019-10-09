<template>
    <div id="tv" :style="'width: ' + width + 'px; height: ' + height + 'px;display: inline-block;'">
        <div ref="series" style="width: 100%; height: 100%;display: inline-block;"></div>
    </div>
</template>
<script>
import echarts from 'echarts';
import { curDatetime } from '../../../libs/tools';

export default {
    name: 'renove',
    data () {
        return {
            // width: 400,
            // height: 400,
            time: curDatetime(),
            // workshopId: '',
            // workshopList: [],
            orderList: [],
            value: false
        };
    },
    props: {
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        workshopId: {
            type: Number
        }
    },
    methods: {
        expandCharts () {
            const main = document.getElementById('screen');
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            }
            this.value = !this.value;
        },
        // getUserWorkshop () {
        //     this.$api.dept.getUserWorkshop().then(res => {
        //         this.workshopId = res.curWorkshopId;
        //         this.workshopList = res.workshopList;
        //         this.orderDetail();
        //     });
        // },
        orderDetail () {
            this.$call('large.screen.orderDetail', {workshopId: this.workshopId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    let i = 1;
                    this.orderList = content.res.map(x => {
                        x.id = i;
                        i++;
                        return x;
                    });
                    this.drawLineEN();
                }
            });
        },
        getEndOrderCode (val) {
            let data = [];
            val.map(x => {
                let length = x.length;
                data.push(x.substr(length - 3));
            });
            return data;
        },
        drawLineEN () {
            let myChart = echarts.init(this.$refs.series);
            // 绘制图表
            const _this = this;
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        let obj = _this.orderList[params.dataIndex].prdOrderCode + '<br/>' + _this.orderList[params.dataIndex].productName + '<br/>' + _this.orderList[params.dataIndex].batchCode;
                        for (var j = 0; j < option.series.length; j++) {
                            obj = obj + '<br/>' + option.series[j].name + ': ' + option.series[j].data[params.dataIndex];
                        }
                        return obj;
                    }
                },
                legend: {
                    data: ['未开始', '在线', '已入库'],
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
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.getEndOrderCode(this.orderList.map(x => x.prdOrderCode)),
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                series: [
                    {
                        name: '未开始',
                        type: 'bar',
                        stack: '总量',
                        data: this.orderList.map(x => x.notStarted)
                    },
                    {
                        name: '在线',
                        type: 'bar',
                        stack: '总量',
                        data: this.orderList.map(x => x.onLine)
                    },
                    {
                        name: '已入库',
                        type: 'bar',
                        stack: '总量',
                        data: this.orderList.map(x => x.inStock)
                    }
                ]
            };
            myChart.setOption(option);
        }
    },
    watch: {
        workshopId (newData, oldData) {
            this.orderDetail();
            setInterval(() => {
                this.orderDetail();
            }, 1800000);
        }
    },
    created () {
    },
    mounted () {
        // this.width = window.screen.width - 100;
        // this.height = window.screen.height - 130;
        // this.getUserWorkshop();
    }
};
</script>

<style scoped>
#tv{
    background-color: #22272d;
    font-size: 12px;
    line-height: 24px;
    color: #FFF;
}
.verticalMiddle{
    vertical-align: middle;
}
</style>

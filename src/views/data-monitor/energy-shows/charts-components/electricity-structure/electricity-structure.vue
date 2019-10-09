<template>
    <div style="width: 100%;height: 100%;" id="electricityStructureChart"></div>
</template>
<script>
    import echarts from 'echarts';
    let _this = this;
    export default {
        data () {
            return {
                chartsData: [10, 52, 200, 334, 390, 330, 220]
            };
        },
        methods: {

        },
        mounted () {
            _this = this;
            this.$nextTick(() => {
                let echartsExample = echarts.init(document.getElementById('electricityStructureChart'));
                let option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            name:'访问来源',
                            type:'pie',
                            selectedMode: 'single',
                            radius: [0, '30%'],

                            label: {
                                normal: {
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            }
                        },
                        {
                            name:'访问来源',
                            type:'pie',
                            radius: ['40%', '55%'],
                            label: {
                                normal: {
                                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#eee',
                                    borderColor: '#aaa',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 22,
                                            align: 'center'
                                        },
                                        // abg: {
                                        //     backgroundColor: '#333',
                                        //     width: '100%',
                                        //     align: 'right',
                                        //     height: 22,
                                        //     borderRadius: [4, 4, 0, 0]
                                        // },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 16,
                                            lineHeight: 33
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data:[
                                {value:335, name:'直达'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1048, name:'百度'},
                            ]
                        }
                    ]
                };
                echartsExample.setOption(option);
                let index = 0; // 播放所在下标
                let mTime = setInterval(() => {
                    echartsExample.dispatchAction({
                        type: 'showTip',
                        seriesIndex: 0,
                        dataIndex: index
                    });
                    index++;
                    if (index >= _this.chartsData.length) {
                        index = 0;
                    }
                }, 1000);
                window.addEventListener('resize', function () {
                    echartsExample.resize();
                });
            });
        }
    };
</script>

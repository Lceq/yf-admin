<template>
    <div style="width:100%;height:100%;background: #22272d" id="employeeChart"></div>
</template>

<script>
    import echarts from 'echarts';
    export default {
        name: 'employeeChart',
        data () {
            return {
                //
            };
        },
        mounted () {
            this.$nextTick(() => {
                let visiteVolume = echarts.init(document.getElementById('employeeChart'));
                const option = {
                    color: ['#01c4d6', '#f2622d', '#efc51b', '#c23531', '#2dcc70', '#025F64'],
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b}: {c} ({d}%)'
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        y: 'top',
                        data: ['清花', '梳棉', '并条', '粗纱', '细纱', '络筒'],
                        textStyle: {
                            color: '#fff',
                            marginTop: '20px'
                        }
                    },
                    series: [

                        {
                            name: '数据',
                            type: 'pie',
                            radius: ['0%', '50%'],
                            label: {
                                normal: {
                                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                    backgroundColor: '#343a46',
                                    borderColor: '#515970',
                                    borderWidth: 1,
                                    borderRadius: 4,
                                    // shadowBlur:3,
                                    // shadowOffsetX: 2,
                                    // shadowOffsetY: 2,
                                    // shadowColor: '#999',
                                    // padding: [0, 7],
                                    rich: {
                                        a: {
                                            color: '#fff',
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
                                            fontSize: 14,
                                            lineHeight: 22
                                        },
                                        per: {
                                            color: '#fefefe',
                                            backgroundColor: '#5f86c9',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data: [
                                {value: 1, name: '清花'},
                                {value: 2, name: '梳棉'},
                                {value: 2, name: '并条'},
                                {value: 3, name: '粗纱'},
                                {value: 14, name: '细纱'},
                                {value: 3, name: '络筒'}
                            ]
                        }
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

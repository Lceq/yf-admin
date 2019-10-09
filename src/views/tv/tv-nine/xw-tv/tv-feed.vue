<template>
    <div>
        <Carousel
                v-model="active"
                :autoplay="false"
                :radius-dot="false"
                arrow="never"
                dots="none">
            <CarouselItem>
                <xw-table
                    :title="title"
                    :fontSize="fontSize"
                    :numbers="numbers"
                    :list="list"
                    :turn="turn"
                    @getTurn="getTurn"
                    :top="top"></xw-table>
            </CarouselItem>
            <CarouselItem>
                <xw-table
                    :title="titleTwo"
                    :fontSize="fontSize"
                    :numbers="numbers"
                    :list="listTwo"
                    :turn="turnTwo"
                    @getTurn="getTurnTwo"
                    :top="topTwo"></xw-table>
            </CarouselItem>
        </Carousel>
    </div>
</template>
<script>
    import xwTable from './xw-table';
    export default {
        components: {
            xwTable
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
        data () {
            return {
                active: 0,
                fontSize: 0,
                numbers: 9,
                list: [],
                title: [
                    {
                        title: '工序',
                        key: 'processName',
                        span: 2,
                        align: 'left'
                    },
                    {
                        title: '机型',
                        key: 'machineName',
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '机台号',
                        key: 'machineCode',
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '保养项目',
                        key: 'maintenanceItemName',
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '上次保养',
                        key: 'maintenanceTime',
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '预计下次保养',
                        key: 'expectMaintenanceTime',
                        span: 5,
                        align: 'left'
                    },
                    {
                        title: '剩余时间',
                        key: 'hours',
                        span: 3,
                        align: 'right'
                    }
                ],
                top: 0,
                turn: false,
                stoptime: 8000,
                titleTwo: [
                    {
                        title: '工序',
                        key: 'processName',
                        align: 'left',
                        span: 2
                    },
                    {
                        title: '机型',
                        align: 'left',
                        key: 'machineName',
                        span: 3
                    },
                    {
                        title: '机台号',
                        key: 'machineCode',
                        align: 'left',
                        span: 3
                    },
                    {
                        title: '更换专件',
                        key: 'machinePartsName',
                        align: 'left',
                        span: 3
                    },
                    {
                        title: '上次更换',
                        key: 'replaceDate',
                        align: 'left',
                        span: 4
                    },
                    {
                        title: '预计下次更换',
                        key: 'nextReplaceDate',
                        span: 4,
                        align: 'left'
                    },
                    {
                        title: '剩余时间',
                        key: 'hours',
                        span: 2,
                        align: 'right'
                    },
                    {
                        title: '剩余产量',
                        key: 'output',
                        span: 3,
                        align: 'right'
                    }
                ],
                listTwo: [],
                topTwo: 0,
                turnTwo: false,
                topThree: 0,
                turnThree: false,
                titleThree: [
                    {
                        title: '工序',
                        key: 'processName',
                        span: 4,
                        align: 'center'
                    },
                    {
                        title: '机台号',
                        key: 'machineCode',
                        span: 5,
                        align: 'left'
                    },
                    {
                        title: '异常电压',
                        key: 'value',
                        span: 5,
                        align: 'right'
                    },
                    {
                        title: '电压上限',
                        key: 'valueMax',
                        span: 5,
                        align: 'right'
                    },
                    {
                        title: '电压下限',
                        span: 5,
                        key: 'valueMin',
                        align: 'right'
                    }
                ],
                listThree: []
            };
        },
        methods: {
            maintainSpecialScreen () {
                this.$call('large.screen.maintainSpecialScreen', {
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.list = res.data.res.maintenanceOrderItemList;
                        // this.titleTwo = res.data.res.specialPartsReplaceList;
                        // this.isStart = true;
                        this.turn = true;
                        this.active = 0;
                    };
                });
            },
            earlyWarning () {
                this.$call('large.screen.maintainSpecialScreen', {
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.listTwo = res.data.res.specialPartsReplaceList;
                        this.turnTwo = true;
                        this.active = 1;
                    };
                });
            },
            getTurn (num, length, theight) {
                setTimeout(() => {
                    this.getTime1(num, length, theight);
                }, this.stoptime);
            },
            getTime1 (num, length, theight) {
                this.$nextTick(() => {
                    if (num >= length) {
                        this.topTwo = 0;
                        this.turnTwo = false;
                        setTimeout(() => {
                            this.earlyWarning();
                        }, 1000);
                    } else {
                        this.top += -theight;
                        num += 1;
                        setTimeout(() => {
                            this.getTime1(num, length, theight);
                        }, this.stoptime);
                    }
                });
            },
            getTurnTwo (num, length, theight) {
                setTimeout(() => {
                    this.getTime2(num, length, theight);
                }, this.stoptime);
            },
            getTime2 (num, length, theight) {
                this.$nextTick(() => {
                    if (num >= length) {
                        this.top = 0;
                        this.turn = false;
                        setTimeout(() => {
                            this.maintainSpecialScreen();
                        }, 1000);
                    } else {
                        this.topTwo += -theight;
                        num += 1;
                        setTimeout(() => {
                            this.getTime2(num, length, theight);
                        }, this.stoptime);
                    }
                });
            }
        },
        watch: {
            workshopId (newData, oldData) {
                this.maintainSpecialScreen();
            }
        }
    };
</script>
<style scoped>
</style>

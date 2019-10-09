<template>
    <div>
        <xw-table :title="title" :fontSize="fontSize" :numbers="numbers" :list="list" :turn="turn" @getTurn="getTurn" :top="top"></xw-table>
    </div>
</template>

<script>
import xwTable from './xw-table';
export default {
    components: {
        xwTable
    },
    props: {
        workshopId: {
            type: Number
        },
        fontSize: {
            type: Number,
            default: 1
        }
    },
    name: 'tv-order',
    data () {
        return {
            title: [
                {
                    title: '工序',
                    key: 'processName',
                    span: 2,
                    align: 'left'
                },
                {
                    title: '机台号',
                    span: 3,
                    key: 'machineCode',
                    align: 'left'
                },
                {
                    title: '品种',
                    span: 6,
                    key: 'productName',
                    minWidth: 60,
                    align: 'left'
                },
                // {
                //     title: '订单号',
                //     span: 4,
                //     key: 'prdOrderCodes',
                //     align: 'left'
                // },
                {
                    title: '生产批号',
                    key: 'batchCode',
                    span: 3,
                    align: 'left'
                },
                {
                    title: '预计了机',
                    span: 4,
                    key: 'planDateTo',
                    align: 'left'
                },
                {
                    title: '剩余时间',
                    key: 'timeRemaining',
                    span: 3,
                    align: 'left'
                },
                {
                    title: '接批批号',
                    span: 3,
                    key: 'nextBatchCode',
                    align: 'left'
                }
            ],
            list: [],
            numbers: 9,
            top: 0,
            turn: false,
            stoptime: 8000
        };
    },
    methods: {
        machineFinishDetail () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('large.screen.machineFinishDetail', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.list = content.res.map(x => {
                        let date = x.planDateTo.split(' ')[0].split('-')[1] + '-' + x.planDateTo.split(' ')[0].split('-')[2];
                        let hour = x.planDateTo.split(' ')[1].split(':')[0];
                        x.planDateTo = date + ' ' + hour + 'h';
                        return x;
                    });
                    this.turn = true;
                }
            });
        },
        getTurn (num, length, theight) {
            setTimeout(() => {
                this.getEmitTime(num, length, theight);
            }, this.stoptime);
        },
        getEmitTime (num, length, theight) {
            this.$nextTick(() => {
                if (num >= length) {
                    this.top = 0;
                    this.turn = false;
                    setTimeout(() => {
                        this.machineFinishDetail();
                    }, 1000);
                } else {
                    this.top += -theight;
                    // console.log('top', this.top);
                    // console.log('height:', theight);
                    num += 1;
                    setTimeout(() => {
                        this.getEmitTime(num, length, theight);
                    }, this.stoptime);
                }
            });
        }
    },
    watch: {
        workshopId (newData, oldData) {
            this.machineFinishDetail();
        }
    }
};
</script>

<style scoped>

</style>

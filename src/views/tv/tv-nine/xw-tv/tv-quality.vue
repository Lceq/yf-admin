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
                    align: 'center'
                },
                {
                    title: '机台号',
                    key: 'machineCode',
                    span: 4,
                    align: 'left'
                },
                {
                    title: '异常质量参数',
                    key: 'qmParamName',
                    span: 6,
                    align: 'center'
                },
                {
                    title: '异常值',
                    key: 'value',
                    span: 4,
                    align: 'center'
                },
                {
                    title: '上限',
                    span: 4,
                    key: 'valueMax',
                    align: 'left'
                },
                {
                    title: '下限',
                    span: 4,
                    key: 'valueMin',
                    align: 'left'
                }
            ],
            list: [
            ],
            numbers: 9,
            top: 0,
            turn: false,
            stoptime: 8000
        };
    },
    methods: {
        processShowEarlyWarning () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('large.screen.qmEarlyWarning', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.list = content.res;
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
                        this.processShowEarlyWarning();
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
            this.processShowEarlyWarning();
        }
    }
};
</script>

<style scoped>

</style>

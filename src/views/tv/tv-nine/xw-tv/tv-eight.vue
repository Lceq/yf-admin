<template>
    <div>
        <xw-table :title="title" :fontSize="fontSize" :list="list" :turn="turn" @getTurn="getTurn" :top="top"></xw-table>
        <div style="padding: 15px 5px;" class="parentFlexBetween">
            <div class="open-bar" @click="changePack(item)" v-for="(item, index) of machineOpenStateList" :key="index" :style="'background-color:' + (item.openingState === 1 ? 'rgb(237, 64, 20)' : 'rgb(25, 190, 107)')">{{ item.name }}</div>
        </div>
    </div>
</template>

<script>
    import xwTable from './xw-table-eight';
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
                        title: '物料批号',
                        key: 'productCode',
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '物料名称',
                        key: 'productName',
                        span: 5,
                        align: 'left'
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        span: 3,
                        align: 'left'
                    },
                    {
                        title: '计划量',
                        key: 'weightQty',
                        span: 3,
                        align: 'right'
                    },
                    {
                        title: '已领量',
                        key: 'leadOutQty',
                        span: 2,
                        align: 'right'
                    },
                    {
                        title: '待领量',
                        key: 'stayWeightQty',
                        span: 2,
                        align: 'right'
                    },
                    {
                        title: '已投量',
                        key: 'feedingQty',
                        span: 2,
                        align: 'right'
                    },
                    {
                        title: '待投量',
                        key: 'stayFeedingQty',
                        span: 2,
                        align: 'right'
                    },
                    {
                        title: '需购量',
                        key: 'needWeightQty',
                        span: 2,
                        align: 'right'
                    }
                ],
                list: [],
                numbers: 5,
                top: 0,
                turn: false,
                stoptime: 8000,
                machineOpenStateList: []
            };
        },
        methods: {
            changePack (val) {
                this.$emit('changePack', val);
            },
            materialStatisticScreen () {
                this.$call('large.screen.materialStatisticScreen', {
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.list = res.data.res.detailList;
                        this.machineOpenStateList = res.data.res.areaModelList;
                        this.turn = true;
                    };
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
                            this.materialStatisticScreen();
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
                this.materialStatisticScreen();
            }
        }
    };
</script>

<style scoped>
.open-bar{
    width: 40px;
    height: 40px;
    background-color: rgb(25, 190, 107);
    display: inline-block;
    /*margin: 5px 8px;*/
    border-radius: 50%;
    line-height: 40px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    box-shadow: 0 5px 0 #b7c4ce94;
    cursor: pointer;
}
.open-bar-shadow{

}
</style>

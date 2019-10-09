<template>
    <div>
        <Modal
                v-model="showModal"
                :title="previewModalTitle"
                @on-visible-change="previewModalStateChangeEvent"
                :maskClosable="false"
                width="600"
        >
            <div style="width: 600px;height: 600px">
                <!--圆盘式-->
                <div v-if="isPieChart">
                    <pie-chart :pieChartData="pieChartList"></pie-chart>
                </div>
                <!--往复式-->
                <div v-if="isRecChart">
                    <div v-for="(rowItem, rowIndex) in rowNumber" :key="rowIndex" class="flex-left">
                        <p v-for="(columnItem, columnIndex) in rowItem.columnNumber" :key="columnIndex" class="cell-item"></p>
                    </div>
                </div>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import pieChart from './pie-chart';
    export default {
        components: { pieChart },
        name: 'previewModal',
        props: {
            previewModalState: {
                type: Boolean,
                default: false
            },
            pieChartData: {
                type: Object
            }
        },
        data () {
            return {
                pieChartList: {},
                previewModalTitle: '',
                isPieChart: false,
                isRecChart: false,
                showModal: false,
                rowNumber: [
                    {
                        columnNumber: []
                    }
                ]
            };
        },
        methods: {
            previewModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
            }
        },
        watch: {
            previewModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            pieChartData (newVal, oldVal) {
                if (newVal.typeName.indexOf('圆盘式') !== -1) {
                    this.isPieChart = true;
                    this.isRecChart = false;
                    this.previewModalTitle = '圆盘式';
                    setTimeout(() => { this.pieChartList = newVal; }, 0);
                } else {
                    this.isPieChart = false;
                    this.isRecChart = true;
                    this.rowNumber = [];
                    this.previewModalTitle = '往复式';
                    for (var i = 0; i < newVal.rowNumber; i++) {
                        this.rowNumber.push({columnNumber: []});
                    };
                    for (var j = 0; j < this.rowNumber.length; j++) {
                        for (var k = 0; k < newVal.columnNumber; k++) {
                            this.rowNumber[j].columnNumber.push(k);
                        };
                    };
                }
            }
        }
    };
</script>
<style scoped>
    .flex-left .cell-item {
        width: 25px;
        height: 25px;
        background: #ff9900;
        border: solid 1px #fff;
    }
</style>

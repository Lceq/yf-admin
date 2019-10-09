<template>
    <div>
        <div class="report-bar" v-for="(list, index) of reportOrderList">
            <div class="report-bar-item" v-for="item of list" @click="userReport(item)">
                <p class="report-title">{{ item.productName }}</p>
                <p class="report-text">{{ item.batchCode }}</p>
                <p class="report-text">订单数量/未完成量：{{ item.productionQty }} / {{ item.onCompletionQty }}</p>
                <p class="report-text">当班报工产量：<span class="report-text-red">{{ item.totalQty }}</span></p>
            </div>
        </div>
        <left-right
            @leftRightClick="leftRightClick"
            :pageTotal="pageTotal"
        ></left-right>
    </div>
</template>

<script>
    import {breakUpList} from "../../../libs/tools";
    import leftRight from './left-right';
    import {curDate} from "../../../libs/tools";

    export default {
        name: 'report',
        components: {
            leftRight
        },
        data () {
            return {
                reportOrderList: [],
                pageIndex: 1,
                pageTotal: 1
            };
        },
        props: {
            isReportShow: {
                type: Boolean,
                default: false
            },
            loginMes: {
                type: Array
            }
        },
        methods: {
            userReport (item) {
                this.$emit('userReport', item);
            },
            leftRightClick (val) {
                this.pageIndex = val;
                this.getOrderList();
            },
            getOrderList () {
                const _this = this;
                let params = {
                    workshopId: this.loginMes[0].workshopId,
                    groupId: this.loginMes[0].groupId,
                    date: curDate(),
                    pageIndex: this.pageIndex,
                    pageSize: 16
                };
                // debugger
                this.$call('prd.order.pack.list', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.pageTotal = Math.ceil(content.count / 16);
                        // debugger
                        _this.reportOrderList = breakUpList(content.res, 4);
                    }
                });
            }
        },
        watch: {
            isReportShow (newData, oldData) {
                if (newData) {
                    this.getOrderList();
                }
            }
        }
    };
</script>

<style scoped>
    .report-bar {
        display: flex;
        justify-content: space-between;
        flex: auto;
    }
    .report-bar-item{
        background-color: #f9f9f9;
        border: 1px solid #515a6e;
        display: inline-block;
        padding: 10px;
        margin-bottom: 10px;
        width: 24%;
    }
    .report-title{
        font-size: 24px;
    }
    .report-text {
        font-size: 14px;
    }
    .report-text-red{
        color: red;
    }
</style>
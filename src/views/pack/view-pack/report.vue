<template>
    <div v-if="show" style="padding: 30px;">
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
import {curDate, breakUpList} from '../../../libs/tools';
import leftRight from './left-right';
export default {
    name: 'report',
    components: {
        leftRight
    },
    props: {
        loginMes: {
            type: Array
        },
        isReportShow: {
            type: Boolean
        }
    },
    data () {
        return {
            show: false,
            pageTotal: 1,
            reportOrderList: [
                {
                    productName: '',
                    batchCode: '',
                    onCompletionQty: '',
                    totalQty: ''
                }
            ]
        };
    },
    methods: {
        leftRightClick (val) {
            this.pageIndex = val;
            this.getOrderList();
        },
        userReport (item) {
            this.$emit('userReport', item);
        },
        getOrderList () {
            const _this = this;
            let params = {
                workshopId: this.loginMes[0].workshopId,
                groupId: this.loginMes[0].groupId,
                date: this.loginMes[0].date,
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
        loginMes (newData, oldData) {
            this.show = true;
            this.getOrderList();
        },
        isReportShow (newData, oldData) {
            // debugger
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
        justify-content: flex-start;
        flex: auto;
    }
    .report-bar-item{
        background-color: #f9f9f9;
        border: 1px solid #515a6e;
        display: inline-block;
        padding: 20px;
        margin-bottom: 20px;
        margin-right: 20px;
        width: 24%;
    }
    .report-title{
        color: #2d8cf0;
        font-size: 30px;
    }
    .report-text {
        font-size: 18px;
        line-height: 30px;
    }
    .report-text-red{
        color: red;
    }
</style>

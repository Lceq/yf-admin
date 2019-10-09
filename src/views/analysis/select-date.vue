<template>
    <div>
        <Select @on-change="changeDate" class="formWidth report-sheet-date" v-model="dateId">
            <Option v-for="(item, index) in dateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
        </Select>
    </div>
</template>

<script>
import {curDate, getCurMonth, getWeekTime, lastDay, getLastMonth} from '../../libs/tools';

export default {
    name: 'select-date',
    props: {
        dateId: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            // dateId: 0,
            dateList: []
        };
    },
    methods: {
        changeDate (val) {
            let value = this.dateList.find(x => x.id === val);
            this.$emit('change-date', value);
        }
    },
    mounted () {
        this.dateList = [
            {
                id: 0,
                name: '未选',
                dateFrom: '',
                dateTo: ''
            },
            {
                id: 1,
                name: '今天',
                dateFrom: curDate(),
                dateTo: curDate()
            },
            {
                id: 2,
                name: '昨天',
                dateFrom: lastDay(),
                dateTo: lastDay()
            },
            {
                id: 3,
                name: '本周',
                dateFrom: getWeekTime(0),
                dateTo: curDate()
            },
            {
                id: 4,
                name: '上周',
                dateFrom: getWeekTime(7),
                dateTo: getWeekTime(1)
            },
            {
                id: 5,
                name: '本月',
                dateFrom: getCurMonth(1),
                dateTo: getCurMonth(30)
            },
            {
                id: 6,
                name: '上月',
                dateFrom: getLastMonth(1),
                dateTo: getLastMonth(30)
            }
        ];
        console.log(this.dateList);
    },
    watch: {
        dateId (newData, oldData) {
            this.dateId = newData;
        }
    }
};
</script>

<style scoped>
    .formWidth{
        /*background-color: #2b85e4;*/
        width: 80px;
        color:#fff;
    }
</style>

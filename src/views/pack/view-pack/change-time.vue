<template>
    <div class="flex-around">
        <div class="step" @click="getLastNextDay('last')"> < </div>
        <div class="step-time"> {{curTime}} </div>
        <div class="step" @click="getLastNextDay('next')"> > </div>
    </div>
</template>

<script>
    import {curDate} from "../../../libs/tools";
    import {lastDay, nextDay} from "../../../libs/tools";
    export default {
        name: 'change-time',
        data () {
            return {
                curTime: curDate()
            };
        },
        methods: {
            getLastNextDay (val) {
                if (val === 'last') {
                    this.curTime = lastDay(this.curTime);
                }
                if (val === 'next') {
                    this.curTime = nextDay(this.curTime);
                }
                this.$emit('getLastNextDay', this.curTime);
            }
        }
    };
</script>

<style scoped>
    .flex-around{
        display: flex;
        margin-bottom: 20px;
        justify-content: center;
    }
    .step{
        margin: 10px 20px;
        border: 1px solid #999999;
        /*padding: 5px 10px;*/
        background-color: #f9f9f9;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 16px;
    }
    .step-time{
        margin: 10px 20px;
        border: 1px solid #999999;
        background-color: #f9f9f9;
        width: auto;
        padding-left:20px;
        padding-right:20px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 16px;}
</style>

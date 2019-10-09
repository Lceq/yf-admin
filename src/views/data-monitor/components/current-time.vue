<template>
    <div class="current-time">{{timeVal}}</div>
</template>
<script>
    import { toDaySeconds } from '../../../libs/common';
    let timer = '';
    export default {
        data () {
            return {
                timeVal: toDaySeconds()
            };
        },
        mounted () {
            timer = setInterval(() => {
                this.timeVal = toDaySeconds();
            }, 1000);
        },
        beforeRouteLeave (from, to, next) {
            next();
            clearInterval(timer);
        }
    };
</script>
<style scoped>
    .current-time {
        font: bold 18px/24px '';
        color: #fff;
    }
</style>

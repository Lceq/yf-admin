<template>
    <div class="flex-around">
        <div class="step" @click="leftRightClick('left')"> < </div>
        <div class="step-time"> {{pageIndex}} </div>
        <div class="step" @click="leftRightClick('right')"> > </div>
    </div>
</template>

<script>
    export default {
        name: 'left-right',
        props: {
            pageTotal: {
                type: Number
            },
            pageIndex: {
                type: Number,
                default: 1
            }
        },
        data () {
            return {
                // value: 1
            };
        },
        methods: {
            leftRightClick (val) {
                if (val === 'left') {
                    if (this.pageIndex <= 1) {
                        return false;
                    }
                    this.pageIndex--;
                }
                if (val === 'right') {
                    if (this.pageIndex >= this.pageTotal) {
                        return false;
                    }
                    this.pageIndex++;
                }
                this.$emit('leftRightClick', this.pageIndex);
            }
        }
    };
</script>

<style scoped>
    .flex-around{
        display: flex;
        justify-content: center;
    }
    .step{
        margin: 10px 20px;
        border: 1px solid #999999;
        background-color: #f9f9f9;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-size: 20px;
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
        font-size: 20px;}
</style>

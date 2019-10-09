<template>
    <div class="flex-around">
        <div class="step" @click="leftRightClick('left')"> < </div>
        <div class="step-time"> {{value}} </div>
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
        value: {
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
                if (this.value <= 1) {
                    return false;
                }
                this.value--;
            }
            if (val === 'right') {
                if (this.value >= this.pageTotal) {
                    return false;
                }
                this.value++;
            }
            this.$emit('leftRightClick', this.value);
        }
        // rightClick () {
        //     this.value++;
        //     this.$emit('rightClick', this.value);
        // }
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
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
}
.step-time{
    margin: 10px 20px;
    border: 1px solid #999999;
    background-color: #f9f9f9;
    width: auto;
    padding-left:20px;
    padding-right:20px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 16px;}
</style>
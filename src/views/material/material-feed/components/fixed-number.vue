<template>
    <div v-if="isShowNumber" class="number-bar-block" @click.stop="cancel">
        <div class="number" @click.stop="clickBar">
            <div class="number-bar">
                <div>
                    <div class="num-bar-screen">{{ value }}</div>
                    <div class="number-bar-num" id="number-num">
                        <div class="num-bar" @click.stop="clickNum(item)" v-for="item of numList">{{ item }}</div>
                    </div>
                    <div class="num-button">
                        <div class="num-bar border-left btn-submit" @click.stop="submitNumber">确定</div>
                        <div class="num-space border-right"></div>
                        <div class="num-bar btn-cancel" @click.stop="cancelNumber">取消</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'fixed-number',
    props: {
        isShowNumber: {
            type: Boolean,
            default: false
        },
        fixedNumber: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            value: 0,
            numList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '.', 'X']
        };
    },
    watch: {
        isShowNumber (newData, oldData) {
            // debugger
            if (newData) {
                // console.log(this.fixedNumber);
                this.value = this.fixedNumber;
                // debugger;
                // this.value = null;
            }
        }
    },
    methods: {
        clickNum (val) {
            if (val === 'X') {
                if (typeof (this.value) === 'number') {
                    this.value = this.value + '';
                }
                if (this.value.length === 1) {
                    this.value = 0;
                } else {
                    this.value = this.value.slice(0, this.value.length - 1);
                }
                // this.$store.commit('setNumberKey', this.value);
                return false;
            };
            if (this.value !== null && this.value.length > 16) {
                // this.$store.commit('setNumberKey', this.value);
                return false;
            };
            if (this.value === null || this.value === 0) {
                this.value = val;
            } else {
                this.value += val + '';
            }
            // this.$store.commit('setNumberKey', this.value);
        },
        submitNumber () {
            // console.log(this.value);
            this.$emit('submitNumber', Number(this.value));
            // debugger
        },
        cancelNumber () {
            this.$emit('cancelNumber');
        },
        cancel () {
            this.$emit('cancelNumber');
        },
        clickBar () {
            // console.log(2);
        },
    }
};
</script>

<style scoped>
.number-bar-block{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    text-align: center;
}
.number{
    position: relative;
    width: 400px;
    z-index: 9999;
    background-color: #f9f9f9;
    box-shadow: 0 0 5px #999999;
    padding: 20px;
    top: 50%;
    left: 50%;
    margin-top: -200px;
    margin-left: -200px;
    /*position: fixed;*/
    /*z-index: 9999;*/
    /*background-color: #f9f9f9;*/
    /*box-shadow: 0 0 5px #999999;*/
    /*padding: 20px;*/
    /*top: 20%;*/
    /*left: 30%;*/
}
.number-bar{
    /*border: 1px solid #999999;*/
    display: flex;
    justify-items: center;
    justify-content: center;
    width: 360px;
}
.number-bar-num{
    display: flex;
    flex-wrap: wrap;
    /*width: 210px;*/
    align-content: flex-start;
}
.number-bar-num .num-bar:nth-child(3n + 1){
    border-left: 1px solid #999999;
}
.num-bar{
    border-right: 1px solid #999999;
    border-bottom: 1px solid #999999;
    /*display: inline-block;*/
    width: 120px;
    height: 70px;
    /*box-sizing: border-box;*/
    text-align: center;
    line-height: 70px;
    font-size: 28px;
}
.num-bar-screen{
    width: 360px;
    overflow: hidden;
    border: 1px solid #999999;
    height: 70px;
    text-align: right;
    font-size: 28px;
    line-height: 70px;
    padding: 0 10px;
}
.num-button{
    display: flex;
    justify-content: space-between;
}
.num-space{
    width: 120px;
    margin-top: 10px;
}
.border-left{
    border-left: 1px solid #999999;
}
.border-right{
    /*border-right: 1px solid #999999;*/
}
.num-button .num-bar{
    margin-top: 10px;
    color: #fff;
    /*border-top: 1px solid #999999;*/
    border: none;
    font-size: 16px;
    background-color: #19be6b;
}
.num-button .btn-cancel{
    background-color: #f90;
}
</style>

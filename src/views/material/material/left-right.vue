<template>
    <div class="flex-around">
        <div class="step"> < </div>
        <div class="step-time"> 1 </div>
        <div class="step"> > </div>
    </div>
</template>

<script>
export default {
    name: 'left-right'
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
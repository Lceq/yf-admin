<template>
    <div v-if="successShow" class="success-bar">
        <div class="success-tip">提交成功</div>
    </div>
</template>

<script>
export default {
    name: 'success-tip',
    props: {
        successShow: {
            type: Boolean
        }
    }
};
</script>

<style scoped>
    .success-bar{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 0;
        background-color: rgba(0, 0, 0, 0.3);
        text-align: center;
    }
    .success-tip{
        padding: 10px 20px;
        font-size: 20px;
        display: inline-block;
        background-color: #0C25F1;
        color: #fff;
        position: relative;
        top: 100px;
        border-radius: 4px;
    }
</style>
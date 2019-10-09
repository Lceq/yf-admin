<template>
    <div v-if="successShow" class="success-bar">
        <div class="success-tip">{{ tipMessage }}</div>
    </div>
</template>

<script>
export default {
    name: 'success-tip',
    props: {
        successShow: {
            type: Boolean
        },
        tipMessage: {
            type: String
        }
    }
};
</script>

<style scoped>
    .success-bar{
        position: fixed;
        left: 0;
        top: 0;
        width: 50%;
        height: 0;
        background-color: rgba(0, 0, 0, 1);
        text-align: center;
    }
    .success-tip{
        padding: 10px 20px;
        font-size: 20px;
        display: inline-block;
        background-color: #0C25F1;
        color: #fff;
        left: 25%;
        position: relative;
        top: 100px;
        border-radius: 4px;
    }
</style>

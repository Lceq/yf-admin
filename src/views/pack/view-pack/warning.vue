<template>
    <div v-if="packWarningShow" class="pack-warning">
        <div class="pack-warning-bar">
            <div class="warning-title">提示:</div>
            <div class="warning-content">确定要退出登录吗?</div>
            <div class="parentFlexBetween button-bar">
                <div @click="submitWarning" class="pack-button button-submit">确定</div>
                <div @click="cancelWarning" class="pack-button button-cancel">取消</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'logout',
    props: {
        packWarningShow: {
            type: Boolean
        }
    },
    methods: {
        submitWarning () {
            this.$emit('submitWarning');
        },
        cancelWarning () {
            this.$emit('cancelWarning');
        }
    }
};
</script>

<style scoped>
.pack-warning{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    text-align: center;
    font-size: 20px;
}
.pack-warning-bar{
    position: relative;
    background-color: #fff;
    top: 40%;
    width: 400px;
    border-radius: 10px;
    display: inline-block;
}
.warning-title, .warning-content{
    text-align: left;
    padding: 10px 20px;
}
.warning-title{
    /*text-align: left;*/
    color: #f5a623;
}
.pack-button{
    padding: 10px 20px;

}
.button-bar{
    margin-top: 30px;
    padding: 10px 20px;
    color:#fff;
    /*border-radius: 10px;*/
}
.button-submit{
    border: 1px solid #0C25F1;
    background-color: #0C25F1;
    border-radius: 10px;
}
.button-cancel{
    background-color: #f5a623;
    border: 1px solid #f5a623;
    border-radius: 10px;
}
</style>

<template>
    <div class="modalFooterStyle">
        <span class="editFormErrorStyle">{{ WarnMsg }}</span>
        <div>
            <Button v-if="show" type="success" :loading="loading" @click="submit">确认</Button>
            <Button v-if="show"  class="cancelButton" @click="cancel">取消</Button>
        </div>
    </div>
</template>
<!--注意权限项管理没有引用-->
<script>
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },
        show: {
            type: Boolean,
            default: true
        },
        WarnMsg: {
            type: String
        }
    },
    methods: {
        cancel: function () {
            this.$emit('cancel');
        },
        submit () {
            this.$emit('submit');
        }

    }
};
</script>

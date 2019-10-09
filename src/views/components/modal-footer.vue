<template>
    <div>
        <Button v-if="showSaveAndSubmitButton" :disabled="isDisableSaveAndSubmitButton" type="primary" :loading="saveAndSubmitButtonLoading" @click="saveAndSubmitButtonEvent">保存并提交</Button>
        <Button v-if="showPreviewButton" :disabled="isDisablePreviewButton" type="primary" :loading="previewButtonLoading" @click="previewButtonEvent">预览</Button>
        <Button v-if="showConfirmButton" :disabled="isDisableConfirm" type="success" :loading="buttonLoading" @click="saveModalConfirmEvent">确认</Button>
        <Button v-if="showCancelButton" class="cancelButton" @click="saveModalCancelEvent">取消</Button>
    </div>
</template>
<script>
    export default {
        props: {
            showSaveAndSubmitButton: {
                type: Boolean,
                default: false
            },
            isDisableSaveAndSubmitButton: {
                type: Boolean,
                default: false
            },
            saveAndSubmitButtonLoading: {
                type: Boolean,
                default: false
            },
            isDisableConfirm: {
                type: Boolean,
                default: false
            },
            buttonLoading: {
                type: Boolean,
                default: false
            },
            showConfirmButton: {
                type: Boolean,
                default: true
            },
            showCancelButton: {
                type: Boolean,
                default: true
            },
            showPreviewButton: {
                type: Boolean,
                default: false
            },
            isDisablePreviewButton: {
                type: Boolean,
                default: false
            },
            previewButtonLoading: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            saveAndSubmitButtonEvent () {
                this.$emit('on-save-submit-event');
            },
            previewButtonEvent () {
                this.$emit('on-preview-event');
            },
            saveModalConfirmEvent () {
                this.$emit('saveModalConfirmEvent');
            },
            saveModalCancelEvent () {
                this.$emit('saveModalCancelEvent');
            }
        }
    };
</script>

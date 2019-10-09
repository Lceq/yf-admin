<template>
    <Modal
            v-model="isShow"
            :width="width"
            :mask-closable="false"
            :closable="false"
            @on-visible-change="visibleChange"
            :title="title">
        <modal-content-loading
                :spinShow="spinShow"
        ></modal-content-loading>
        <slot name="content">
        </slot>
        <!--<div slot="close"><p>close</p></div>-->
       <a class="IconPosition"><Icon class="IconColse" @click="cancel" type="ios-close" /></a>
        <div slot="footer" class="modalFooterStyle">
            <span class="editFormErrorStyle">{{ WarnMsg }}
            </span>
            <div>
                <Button v-if="isPreview" :disabled="disabled" type="primary" :loading="loading" @click="preview">预览</Button>
                <Button v-if="isSubmit" :disabled="disabled" type="success" :loading="loading" @click="submit">确认</Button>
                <Button v-if="isSave" :disabled="disabled" type="success" :loading="saveLoading" @click="save">保存</Button>
                <Button v-if="isSaveSubmit" :disabled="disabled" type="info" :loading="saveSubmitLoading" @click="saveSubmit">保存并提交</Button>
                <Button v-if="isDelete" type="error" @click="deleteit">删除</Button>
                <Button v-if="isCancel" class="cancelButton" @click="cancel">取消</Button>
            </div>
        </div>
    </Modal>
</template>
<script>
    import modalContentLoading from '../components/modal-content-loading';
    export default {
        name: 'ModalBlock',
        components: {
            modalContentLoading
        },
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            iconSelected: {
                type: Boolean,
                default: false
            },
            iconName: {
                type: String
            },
            isShow: {
                type: Boolean,
                default: false
            },
            title: {
                type: String
            },
            width: {
                type: Number
            },
            loading: {
                type: Boolean,
                default: false
            },
            saveLoading: {
                type: Boolean,
                default: false
            },
            saveSubmitLoading: {
                type: Boolean,
                default: false
            },
            WarnMsg: {
                type: String
            },
            isDelete: {
                type: Boolean,
                default: false
            },
            isPreview: {
                type: Boolean,
                default: false
            },
            isSubmit: {
                type: Boolean,
                default: true
            },
            isSave: {
                type: Boolean,
                default: false
            },
            isSaveSubmit: {
                type: Boolean,
                default: false
            },
            isCancel: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            cancel: function () {
                this.$emit('cancel');
            },
            submit () {
                this.$emit('submit');
            },
            preview () {
                this.$emit('preview');
            },
            save () {
                this.$emit('save');
            },
            saveSubmit () {
                this.$emit('saveSubmit');
            },
            deleteit () {
                this.$emit('deleteit');
            },
            visibleChange () {
                this.$emit('visibleChange');
            }
        }
    };
</script>

<style scoped>
.IconPosition{
    position: absolute;
    right: 8px;
    top: -40px;
}
.IconColse{
    font-size: 31px;
    cursor: pointer;
    color: #999;
    top:1px;
    transition: color 0.2s ease;
}
</style>

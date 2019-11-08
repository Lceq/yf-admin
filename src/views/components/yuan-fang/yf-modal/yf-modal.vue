<template>
    <div>
        <Modal
                v-model="showModal"
                :title="title"
                :width="width"
                :styles="styles"
                :transfer="transfer"
                :z-index="zIndex"
                :mask-closable="maskClosable"
                :footer-hide="footerHide"
                @on-visible-change="visibleChangeEvent"

        >
            <slot name="content"></slot>
            <div slot="footer">
                <Button
                        :disabled="disableConfirmBtn"
                        v-show="showConfirmBtn"
                        :loading="confirmLoading"
                        @click="confirmEvent"
                        type="success"
                >确认</Button>
                <Button
                        :disabled="disableConfirmSubmitBtn"
                        v-show="showConfirmSubmitBtn"
                        :loading="confirmSubmitLoading"
                        @click="confirmAndSubmitEvent"
                        type="info"
                >保存并提交</Button>
                <Button
                        :disabled="disableCancelBtn"
                        v-show="showCancelBtn"
                        :loading="cancelLoading"
                        @click="cancelEvent"
                        style="background:#BCBCBC;color: #ffffff"
                >取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    /* 对iview modal组件的二次封装 */
    export default {
        name: 'yf-modal',
        props: {
            modalState: { // modal的状态
                type: Boolean,
                default: false
            },
            title: { // modal的标题
                type: String,
                default: '提示'
            },
            maskClosable: { // 是否允许点击遮罩层关闭
                type: Boolean,
                default: false
            },
            width: { // modal的宽度
                type: Number,
                default: 520
            },
            styles: { // 设置浮层样式，调整浮层位置等，该属性设置的是.ivu-modal的样式
                type: Object
            },
            transfer: {
                type: Boolean, // 是否将弹层放置于 body 内
                default: true
            },
            zIndex: { // 层级
                type: Number,
                default: 1000
            },
            footerHide: { // 不显示底部
                type: Boolean,
                default: false
            },
            confirmLoading: { // 确认按钮的loading
                type: Boolean,
                default: false
            },
            confirmSubmitLoading: {
                type: Boolean,
                default: false
            },
            cancelLoading: {
                type: Boolean,
                default: false
            },
            showConfirmBtn: { // 是否显示确认按钮
                type: Boolean,
                default: true
            },
            showCancelBtn: {
                type: Boolean,
                default: true
            },
            showConfirmSubmitBtn: {
                type: Boolean,
                default: false
            },
            disableConfirmBtn: { // 是否禁用确认按钮
                type: Boolean,
                default: false
            },
            disableConfirmSubmitBtn: {
                type: Boolean,
                default: false
            },
            disableCancelBtn: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                showModal: false
            };
        },
        methods: {
            cancelEvent () {
                this.$emit('on-cancel');
            },
            confirmEvent () {
                this.$emit('on-confirm');
            },
            visibleChangeEvent (e) {
                this.$emit('on-visible-change', e);
            },
            confirmAndSubmitEvent () {
                this.$emit('on-confirm-submit');
            }
        },
        watch: {
            modalState (newVal) {
                this.showModal = newVal;
            }
        }
    };
</script>

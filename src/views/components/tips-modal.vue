<template>
    <div class="deleteWarning">
        <Modal
                v-model="showModal"
                title="提示"
                :mask-closable="false"
                :width="416"
                :closable="false"
        >
            <div class="icon-box">
                <Icon class="icon-style" :type="tipsIcon" />
                <span class="tip-message">{{ tipsModalMessage }}</span>
            </div>
            <div slot="footer">
                <modal-footer
                        :showCancelButton="cancelShow"
                        :buttonLoading="confirmButtonLoading"
                        @saveModalConfirmEvent="confirmEvent"
                        @saveModalCancelEvent="cancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../components/modal-footer';
    export default {
        name: 'deleteWarning',
        components: { modalFooter },
        props: {
            tipsIcon: {
                type: String,
                default: 'md-information-circle'
            },
            cancelShow: {
                type: Boolean,
                default: true
            },
            tipsModalState: {
                type: Boolean,
                default: false
            },
            confirmButtonLoading: {
                type: Boolean,
                default: false
            },
            tipsModalMessage: {
                type: String
            }
        },
        data () {
            return {
                showModal: false
            };
        },
        methods: {
            confirmEvent () {
                this.$emit('confirm-event');
            },
            cancelEvent () {
                this.$emit('cancel-event');
            }
        },
        watch: {
            tipsModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>
<style scoped>
    .icon-box{
        text-align:left
    }
    .icon-style{
        font-size: 36px;
        color:#f60;
        vertical-align: middle;
    }
    .tip-message{
        margin-left:20px;
        vertical-align: middle;
    }
</style>

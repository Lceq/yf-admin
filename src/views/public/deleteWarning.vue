<template>
    <div class="deleteWarning">
        <Modal
                v-model="VModel"
                title="提示"
                :mask-closable="false"
                :width="416"
                :closable="false"
        >
            <div style="text-align:left">
                <Icon class="iconStyle" type="md-information-circle" />
                <span class="tipMessage">{{ tipMsg }}</span>
            </div>
            <div slot="footer">
                <modal-footer
                        :showCancelButton="cancelShow"
                        :buttonLoading="loading"
                        @saveModalConfirmEvent="confirm"
                        @saveModalCancelEvent="cancel"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalFooter from '../components/modal-footer';
    export default {
        name: 'deleteWarning',
        components: {modalFooter},
        props: {
            cancelShow: {
                type: Boolean,
                default: true
            },
            VModel: {
                type: Boolean,
                default: false
            },
            // deleteWarnShow: {
            //     type: Boolean,
            //     default: false
            // },
            loading: {
                type: Boolean,
                default: false
            },
            tipMsg: {
                type: String
            }
        },
        data () {
            return {
                // VModel: false
            };
        },
        methods: {
            confirm () {
                this.$emit('confirm');
            },
            cancel () {
                this.$emit('cancel');
            }
        },
        watch: {
            deleteWarnShow (newData, oldData) {
                this.VModel = newData;
            }
        }
    };
</script>

<style scoped>
.iconStyle{
    font-size: 36px;
    color:#f60;
    vertical-align: middle;
}
.tipMessage{
    margin-left:20px;
    vertical-align: middle;
}
</style>

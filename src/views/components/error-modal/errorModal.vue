<template>
    <div>
        <Modal
                v-model="showModal"
                title="提示"
                :closable="false"
                :mask-closable="false"
                :width="416"
        >
            <div style="text-align:left">
                <Icon type="ivu-icon ivu-icon-md-close-circle" class="iconStyle"></Icon>
                <span class="tipMessage">{{tipMsg}}</span>
            </div>
            <div slot="footer">
                <Button type="success" @click="confirmEvent">确认</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import iView from 'iview';
    import global from '../../../libs/common';
    import Cookies from 'js-cookie';
    export default {
        name: 'error-tips',
        props: {
            tipMsg: {
                type: String
            },
            status: {
                type: Number
            },
            modalState: {
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
            confirmEvent () {
                this.$store.dispatch({
                    type: 'hideErrorModal',
                    payload: ''
                });
                // 如果是登录超时
                if (this.status === 4001) {
                    this.$store.commit('logout', this);
                    this.$store.commit('clearOpenedSubmenu');
                    this.$router.push({ name: 'login' });
                    this.$router.go(0);
                    Cookies.remove('token');
                    Cookies.remove('routeName');
                    setTimeout(() => { iView.LoadingBar.finish(); }, 0);
                };
                global.isTimeout = false;
            }
        },
        watch: {
            modalState (newVal) {
                this.showModal = newVal;
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

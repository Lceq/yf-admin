<template>
    <div>
        <transition name="show-unlock">
            <div class="unlock-body-con" v-if="showUnlock" @keydown.enter="handleUnlock">
                <div @click="handleClickAvator" class="unlock-avator-con" :style="{marginLeft: avatorLeft}">
                    <img class="unlock-avator-img" :src="avatorPath">
                    <div  class="unlock-avator-cover">
                        <span><Icon type="md-unlock" :size="30"></Icon></span>
                        <p>解锁</p>
                    </div>
                </div>
                <div class="unlock-avator-under-back" :style="{marginLeft: avatorLeft}"></div>
                <div class="unlock-input-con">
                    <div class="unlock-input-overflow-con">
                        <div class="unlock-overflow-body" :style="{right: inputLeft}">
                            <input ref="inputEle" v-model="password" class="unlock-input" type="password" placeholder="请输入登录密码" />
                            <Button icon="md-key" ref="unlockBtn" @mousedown="unlockMousedown" @mouseup="unlockMouseup" @click="handleUnlock" class="unlock-btn"></Icon></Button>
                        </div>
                    </div>
                </div>
                <div class="unlock-locking-tip-con">已锁定</div>
            </div>
        </transition>
        <Modal
                v-model="tipsModalState"
                title="提示"
                :mask-closable="false"
                :width="416"
                :closable="false"
        >
            <div class="icon-box">
                <Icon class="icon-style" :type="'md-information-circle'" />
                <span class="tip-message">{{ tipsModalMessage }}</span>
            </div>
            <div slot="footer">
                <Button @click="tipsModalCancelEvent" type="success">重试</Button>
                <Button @click="tipsModalConfirmEvent" type="primary">前往登录页</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import tipsModal from '../../../components/tips-modal';
    export default {
        name: 'Unlock',
        data () {
            return {
                avatorLeft: '0px',
                inputLeft: '400px',
                password: '',
                check: null,
                tipsModalState: false,
                tipsModalMessage: ''
            };
        },
        props: {
            showUnlock: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            avatorPath () {
                return localStorage.avatorImgPath;
            }
        },
        methods: {
            tipsModalConfirmEvent () {
                Cookies.set('locking', '0');
                this.$emit('on-unlock');
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({ name: 'login' });
                Cookies.remove('token');
                Cookies.remove('routeName');
                this.tipsModalState = false;
            },
            tipsModalCancelEvent () {
                this.tipsModalState = false;
            },
            validator () {
                return true; // 你可以在这里写密码验证方式，如发起ajax请求将用户输入的密码this.password与数据库用户密码对比
            },
            handleClickAvator () {
                this.avatorLeft = '-180px';
                this.inputLeft = '0px';
                this.$refs.inputEle.focus();
            },
            handleUnlock () {
                this.loginHttp();
            },
            // 登录请求
            loginHttp () {
                this.$call('user.lock.screen.login', {
                    authToken: Cookies.get('token'),
                    password: this.password
                }).then(res => {
                    if (res.data.status === 200) {
                        this.avatorLeft = '0px';
                        this.inputLeft = '400px';
                        this.password = '';
                        Cookies.set('locking', '0');
                        this.$router.push({
                            name: Cookies.get('last_page_name') // 解锁之后跳转到锁屏之前的页面
                        });
                        this.$emit('on-unlock');
                    } else {
                        this.tipsModalMessage = '密码有误!';
                        this.tipsModalState = true;
                    };
                });
            },
            unlockMousedown () {
                this.$refs.unlockBtn.className = 'unlock-btn click-unlock-btn';
            },
            unlockMouseup () {
                this.$refs.unlockBtn.className = 'unlock-btn';
            }
        }
    };
</script>

<style lang="less">
    @import '../styles/unlock.less';
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

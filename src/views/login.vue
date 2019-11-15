<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="copyRight">@2017-2020 杭州昇虹智能科技有限公司版权所有</div>
        <div class="logoPosition"></div>
        <div class="loginFrame">
            <div>
                <div class="loginInputBackground">
                    <div class="loginHeaderFlex">
                        <p class="loginLogo"></p>
                        <p class="loginHeaderTitle">昇虹纺纱智造管理平台 - <span class="loginHeaderSmallFont">纺纱专版</span></p>
                        <!--<p class="loginHeaderTitle">{{loginTitle}}  <span class="loginHeaderSmallFont">{{loginTitleMin}}</span></p>-->
                    </div>
                    <div class="form-con">
                        <Form ref="loginForm" :model="form" :rules="rules" method="post">
                            <FormItem prop="companyCode" class="input-length">
                                <Input v-model="form.companyCode" placeholder="请输入公司码" size="large" class="bgStyle">
                                <span slot="prepend">
                                    <Icon :size="22" type="md-code"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="userName" class="input-length">
                                <Input v-model="form.userName" placeholder="请输入用户名" size="large" class="bgStyle">
                                <span slot="prepend">
                                    <Icon :size="22" type="md-person"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem prop="password" class="input-length">
                                <Input type="password" v-model="form.password" placeholder="请输入密码" size="large" class="bgStyle">
                                <span slot="prepend">
                                    <Icon :size="22" type="md-lock"></Icon>
                                </span>
                                </Input>
                            </FormItem>
                            <FormItem style="margin-top:40px;">
                                <Button :loading="buttonLoading" @click="handleSubmit" type="warning" long>登 录</Button>
                            </FormItem>
                        </Form>
                        <p class="loginErrorStyle">{{loginErrorMsg}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    var timeStr = null;
    import Cookies from 'js-cookie';
    import qs from 'qs';
    import api from '../ajax/api';
    import global from '../libs/common';
    export default {
        data () {
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('公司码不能为空!'));
                } else {
                    this.loginErrorMsg = '';
                    callback();
                }
            };
            const validateUserName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不能为空!'));
                } else {
                    this.loginErrorMsg = '';
                    callback();
                }
            };
            const validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空!'));
                } else {
                    this.loginErrorMsg = '';
                    callback();
                }
            };
            return {
                loginTitle: process.env.LOGIN_TITLE,
                loginTitleMin: process.env.LOGIN_TITLE_MIN ? process.env.LOGIN_TITLE_MIN : '',
                form: {
                    userName: 'admin',
                    password: '',
                    companyCode: '1008'
                },
                rules: {
                    companyCode: [
                        { required: true, validator: validateCode, trigger: 'blur' }
                    ],
                    userName: [
                        { required: true, validator: validateUserName, trigger: 'blur' }
                    ],
                    password: [
                        { required: true, validator: validatePassword, trigger: 'blur' }
                    ]
                },
                loginErrorMsg: '',
                buttonLoading: false
            };
        },
        methods: {
            // 全屏
            fullScreenEvent () {
                let main = document.body;
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
            },
            getLoginMsgHttp () {
                this.$api.common.userInfoRequest().then(res => {
                    if (res.data.status === 200) {
                        Cookies.set('user', res.data.res.name);
                        Cookies.set('routeName', 'home_index');
                        // this.$router.go(0);
                        this.$router.push({ path: 'home_index', query: {}, params: {} });
                    };
                });
            },
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        // 创建form-data数据
                        var data = new FormData();
                        data.append('loginname', this.form.userName);
                        data.append('password', this.form.password);
                        data.append('corpcode', this.form.companyCode);
                        // 设置请求头
                        let config = {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        this.$http.post('user/login', data, config).then(res => {
                            if (res.data.status === 200) {
                                setTimeout(() => {
                                    this.fullScreenEvent(); // 全屏事件
                                }, 100)
                                clearInterval(timeStr);
                                this.$store.dispatch({type: 'hideErrorModal', payload: ''});
                                global.isTimeout = false;
                                this.getLoginMsgHttp();
                                Cookies.set('token', res.data.res);// 保存用户名和token
                                this.loginErrorMsg = '';
                                this.$store.commit('clearAllTags');// 清空小菜单栏
                            } else if (res.data.status === 415) {
                                this.loginErrorMsg = '用户名或密码错误，请重新输入！';
                                this.buttonLoading = false;
                                this.$store.commit('logout', this);
                                this.$Loading.destroy();
                                if (res.data.message === '该用户已离职') {
                                    this.loginErrorMsg = res.data.message;
                                } else if (res.data.message === '该用户已停用') {
                                    this.loginErrorMsg = res.data.message;
                                }
                            } else {
                                this.buttonLoading = false;
                                this.$Modal.error({
                                    title: '提示',
                                    content: '服务器端错误，请稍后重试!'
                                });
                            }
                        }).catch(error => {
                            this.loginErrorMsg = '网络错误，请重试！';
                            this.buttonLoading = false;
                        });
                    }
                });
            },
            getQueryString (name) {
                let urlStr = location.href;
                let index = urlStr.indexOf('?')
                let str = urlStr.substring(index + 1);
                let arr = str.split('&');
                let result = {};
                arr.forEach((item) => {
                    let a = item.split('=');
                    result[a[0]] = a[1];
                });
                return result[name];
            },
            payByCardLogin () {
                if (this.getQueryString('loginToken')) {
                    this.$call('user.loginByToken', {
                        'loginToken': this.getQueryString('loginToken')
                    }).then(res => {
                        if (res.data.status === 200) {
                            clearInterval(timeStr);
                            this.$store.dispatch({type: 'hideErrorModal', payload: ''});
                            global.isTimeout = false;
                            this.getLoginMsgHttp();
                            Cookies.set('token', res.data.res);// 保存用户名和token
                            this.loginErrorMsg = '';
                            this.$store.commit('clearAllTags');// 清空小菜单栏
                        } else if (res.data.status === 415) {
                            this.loginErrorMsg = '用户名或密码错误，请重新输入！';
                            this.buttonLoading = false;
                            this.$store.commit('logout', this);
                            this.$Loading.destroy();
                            if (res.data.message === '该用户已离职') {
                                this.loginErrorMsg = res.data.message;
                            } else if (res.data.message === '该用户已停用') {
                                this.loginErrorMsg = res.data.message;
                            };
                        } else {
                            this.buttonLoading = false;
                            this.$Modal.error({
                                title: '提示',
                                content: '服务器端错误，请稍后重试!'
                            });
                        }
                    }).catch(error => {
                        this.loginErrorMsg = '网络错误，请重试！';
                        this.buttonLoading = false;
                    });
                };
            }
        },
        mounted () {
            this.payByCardLogin();
        }
    };
</script>
<style>
    .bgStyle .ivu-input-group-prepend{
        background:rgba(255,255,255,0);
        color: #fff;
    }
    .copyRight{
        width:320px;
        color:#fff;
        text-align: center;
        position:absolute;
        bottom:30px;
        left:50%;
        font-size: 14px;
        margin-left:-155px;
    }
    .bgStyle .ivu-input{
        background:rgba(255,255,255,0);
        color: #fff;
    }
    .loginHeaderFlex{
        width:360px;
        display:flex;
        justify-content: space-between;
        align-items: center;
    }
    .loginHeaderSmallFont{
        font-size:16px;
    }
    .input-length{
        width:360px;
        margin-bottom:30px;
    }
    .loginLogo{
        width:33px;
        height:44px;
        margin-right: 4px;
        background: url("../images/login-logo.png");
    }
    .loginInputBackground{
        width:432px;
        height:414px;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: url("../images/login-input.png");
    }
    .loginErrorStyle{
        height:21px;
        color:red;
        text-align:center
    }
    .loginHeaderTitle{
        text-align: center;
        font-size:23px;
        margin:40px 0;
    }
    .logoPosition{
        width:590px;
        height:649px;
        position: absolute;
        top:50%;
        margin-top:-324px;
        margin-left:60px;
        left:0;
        background:url('../images/bg-text.png');
    }
    .loginFrame{
        height:400px;
        position: absolute;
        top:50%;
        right:0;
        margin-top:-200px;
        margin-right:60px;
        float: right;
        color:#fff;
    }
</style>

<template>
    <div>
        <Card>
            <p slot="title"><Icon type="person"></Icon>个人信息</p>
            <div>
                <Form ref="userForm" :model="userForm" :label-width="80" label-position="right" :rules="infoValidate">
                    <FormItem label="用户姓名：" class="formItemMargin"><div>{{userForm.name}}</div></FormItem>
                    <FormItem label="集团编号：" class="formItemMargin">{{userForm.userCode}}</FormItem>
                    <FormItem label="内部编号：" class="formItemMargin">{{userForm.internalCode}}</FormItem>
                    <FormItem label="性别：" class="formItemMargin">{{userForm.userGender}}</FormItem>
                    <FormItem label="部门：" class="formItemMargin"><span>{{ userForm.department }}</span></FormItem>
                    <FormItem label="岗位：" class="formItemMargin"><span>{{ userForm.postName }}</span></FormItem>
                    <FormItem label="用户手机：" class="formItemMargin"><div>{{userForm.cellphone}}</div></FormItem>
                    <!--<FormItem label="公司："><span>{{ userForm.company }}</span></FormItem>-->
                    <FormItem label="登录密码："><Button size="small" @click="showEditPassword">修改密码</Button></FormItem>
                    <div>
                        <Button type="success" @click="cancelEditUserInfor">返回</Button>
                        <!--<Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>-->
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500" title="修改密码" @on-visible-change="setPasswordModalStateChangeEvent">
            <Form ref="editPasswordForm" :show-message="false" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError" class="formItemMargin">
                    <Input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入原密码" />
                </FormItem>
                <FormItem label="新密码" prop="newPass" class="formItemMargin">
                    <Input type="password" v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" />
                </FormItem>
                <FormItem label="确认新密码" prop="rePass" class="formItemMargin">
                    <Input type="password" v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" />
                </FormItem>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="savePassLoading"
                        @saveModalCancelEvent="setPasswordModalCancelEvent"
                        @saveModalConfirmEvent="setPasswordModalConfirmEvent"
                ></modal-footer>
            </div>
        </Modal>
        <tips-modal
                :cancelShow="false"
                :tipsModalMessage="tipsModalMessage"
                :tipsModalState="tipsModalState"
                @confirm-event="tipsModalConfirmEvent"
        ></tips-modal>
    </div>
</template>

<script>
    import modalFooter from '../components/modal-footer';
    import {noticeTips} from '../../libs/common';
    import Cookies from 'js-cookie';
    import tipsModal from '../components/tips-modal';
    export default {
        name: 'ownspace_index',
        components: { modalFooter, tipsModal },
        data () {
            const validateOldPass = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateNewPass = (rule, value, callback) => {
                if (value) {
                    if (value.length < 6) {
                        this.$Message.warning('请至少输入6个字符!');
                        callback(new Error());
                    } else if (value.length > 32) {
                        this.$Message.warning('最多只能输入32个字符!');
                        callback(new Error());
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                };
            };
            const validatePhone = (rule, value, callback) => {
                var re = /^1[0-9]{10}$/;
                if (!re.test(value)) {
                    callback(new Error('请输入正确格式的手机号'));
                } else {
                    callback();
                }
            };
            const validateRePassword = (rule, value, callback) => {
                if (value !== this.editPasswordForm.newPass) {
                    callback(new Error());
                    this.$Message.warning('两次输入密码不一致!');
                } else {
                    callback();
                }
            };
            return {
                tipsModalMessage: '',
                tipsModalState: false,
                userForm: {
                    name: '',
                    postName: '',
                    cellphone: '',
                    company: '',
                    department: '',
                    userCode: '',
                    userGender: '',
                    internalCode: ''
                },
                phoneHasChanged: false, // 是否编辑了手机
                save_loading: false,
                identifyError: '', // 验证码错误
                editPasswordModal: false, // 修改密码模态框显示
                savePassLoading: false,
                oldPassError: '',
                identifyCodeRight: false, // 验证码是否正确
                hasGetIdentifyCode: false, // 是否点了获取验证码
                infoValidate: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                    cellphone: [
                        { required: true, message: '请输入手机号码' },
                        { validator: validatePhone }
                    ]
                },
                editPasswordForm: {
                    oldPass: '',
                    newPass: '',
                    rePass: ''
                },
                passwordValidate: {
                    oldPass: [{ required: true, validator: validateOldPass, trigger: 'blur' }],
                    newPass: [{ required: true, validator: validateNewPass, trigger: 'blur' }],
                    rePass: [{ required: true, validator: validateRePassword, trigger: 'blur' }]
                },
                initPhone: ''
            };
        },
        methods: {
            tipsModalConfirmEvent () {
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$router.push({ name: 'login' });
                Cookies.remove('routeName');
            },
            fullscreen () {
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
            // 监听设置密码modal
            setPasswordModalStateChangeEvent (e) {
                this.$refs['editPasswordForm'].resetFields();
            },
            // 获取登录人的信息
            getLoginMsgHttp () {
                this.$call('user.info').then(res => {
                    if (res.data.status === 200) {
                        this.userForm.name = res.data.res.name;
                        this.userForm.cellphone = res.data.res.mobile;
                        this.userForm.department = res.data.res.deptName;
                        this.userForm.internalCode = res.data.res.internalCode;
                        this.userForm.postName = res.data.res.postName;
                        this.userForm.userCode = res.data.res.code;
                        res.data.res.gender === 0 ? this.userForm.userGender = '女' : this.userForm.userGender = '男';
                    };
                });
            },
            showEditPassword () {
                this.editPasswordModal = true;
            },
            cancelEditUserInfor () {
                this.$store.commit('removeTag', 'ownspace_index');
                localStorage.pageOpenedList = JSON.stringify(this.$store.state.app.pageOpenedList);
                let lastPageName = '';
                if (this.$store.state.app.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.app.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.app.pageOpenedList[0].name;
                };
                this.$router.push({ name: lastPageName });
            },
            saveEdit () {
                this.$refs['userForm'].validate((valid) => {
                    if (valid) {
                        if (this.phoneHasChanged && this.userForm.cellphone !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
                            if (this.hasGetIdentifyCode) { // 判断是否点了获取验证码
                                if (this.identifyCodeRight) { // 判断验证码是否正确
                                    this.saveInfoAjax();
                                } else {
                                    this.$Message.error('验证码错误，请重新输入');
                                }
                            } else {
                                this.$Message.warning('请先点击获取验证码');
                            }
                        } else {
                            this.saveInfoAjax();
                        }
                    }
                });
            },
            // 设置密码modal的取消按钮事件
            setPasswordModalCancelEvent () {
                this.editPasswordModal = false;
            },
            // 设置密码modal的取消按钮事件
            setPasswordModalConfirmEvent () {
                this.$refs['editPasswordForm'].validate((valid) => {
                    if (valid) {
                        this.savePassLoading = true;
                        this.$call('user.setPassword', {
                            oldPassword: this.editPasswordForm.oldPass,
                            newPassword: this.editPasswordForm.newPass,
                            confirmPassword: this.editPasswordForm.rePass
                        }).then(res => {
                            if (res.data.status === 200) {
                                this.savePassLoading = false;
                                this.editPasswordModal = false;
                                noticeTips(this, 'saveTips');
                                this.tipsModalMessage = '登录失效，请重新登录!';
                                this.tipsModalState = true;
                            } else {
                                this.savePassLoading = false;
                            };
                        });
                    }
                });
            },
            saveInfoAjax () {
                this.save_loading = true;
                setTimeout(() => {
                    this.$Message.success('保存成功');
                    this.save_loading = false;
                }, 1000);
            }
        },
        created () {
            this.getLoginMsgHttp();
        }
    };
</script>
<style lang="less">
    @import './own-space.less';
</style>

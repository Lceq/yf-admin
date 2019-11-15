<template>
    <div>
        <div class="about-me">
            <Card>
                <p slot="title"><Icon type="person"></Icon>关于我</p>
                <div>
                    <div class="avatar-bar">
                        <div style="position: relative">
                            <img :src="userForm.picUrl" class="avatar-image">
                            <Icon type="ios-create" :size="24" @click="modifyAvatarButtonEvent" class="modify-avatar-icon"></Icon>
                        </div>
                        <h3>{{userForm.name}}</h3>
                    </div>
                    <div class="user-message-bar">
                        <Icon type="ios-book" :size="24" class="margin-right-10"></Icon>基本信息
                    </div>
                    <Form ref="userForm" :model="userForm" :label-width="80" label-position="right" :rules="infoValidate">
                        <FormItem label="集团编号：" class="margin-bottom-0">{{userForm.code}}</FormItem>
                        <FormItem label="内部编号：" class="margin-bottom-0">{{userForm.internalCode}}</FormItem>
                        <FormItem label="性别：" class="margin-bottom-0">{{userForm.gender}}</FormItem>
                        <FormItem label="部门：" class="margin-bottom-0"><span>{{ userForm.deptName }}</span></FormItem>
                        <FormItem label="岗位：" class="margin-bottom-0"><span>{{ userForm.postName }}</span></FormItem>
                        <FormItem label="用户手机：" class="margin-bottom-0"><div>{{userForm.mobile}}</div></FormItem>
                        <!--<FormItem label="公司："><span>{{ userForm.company }}</span></FormItem>-->
                        <FormItem label="登录密码："><Button size="small" @click="showEditPassword">修改密码</Button></FormItem>
                        <div>
                            <Button type="success" @click="cancelEditUserInfor">返回</Button>
                            <!--<Button type="primary" style="width: 100px;" :loading="save_loading" @click="saveEdit">保存</Button>-->
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500" title="修改密码" @on-visible-change="setPasswordModalStateChangeEvent">
            <Form ref="editPasswordForm" :show-message="false" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError" class="margin-bottom-0">
                    <Input type="password" v-model="editPasswordForm.oldPass" placeholder="请输入原密码" />
                </FormItem>
                <FormItem label="新密码" prop="newPass" class="margin-bottom-0">
                    <Input type="password" v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" />
                </FormItem>
                <FormItem label="确认新密码" prop="rePass" class="margin-bottom-0">
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
        <Modal
                v-model="modifyAvatarModalState"
                :mask-closable="false"
                title="修改头像"
                @on-visible-change="modifyAvatarModalVisibleChange"
        >
            <div>
                <img :src="modifyAvatarModalImagePath" class="modify-modal-Avatar margin-right-10">
                <Upload
                        ref="upload"
                        :headers="uploadHeader"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        v-show="showUpload"
                        type="drag"
                        :action="uploadRequestUrl"
                        class="upload-bar">
                    <div class="upload-icon">
                        <Icon type="ios-camera" size="20"></Icon>
                    </div>
                </Upload>
            </div>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="avatarConfirmLoading"
                        @saveModalCancelEvent="modifyAvatarModalCancelEvent"
                        @saveModalConfirmEvent="modifyAvatarModalConfirmEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>

<script>
    import modalFooter from '../components/modal-footer';
    import {noticeTips, emptyTips, defaultImgPath} from '../../libs/common';
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
                let re = /^1[0-9]{10}$/;
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
                modifyAvatarModalImagePath: '',
                avatarConfirmLoading: false,
                modifyAvatarModalState: false,
                showUpload: true,
                uploadHeader: { 'auth-token': Cookies.get('token') },
                defaultList: [{'name': 'a42', 'url': defaultImgPath}],
                uploadRequestUrl: process.env.REQUEST_HOST + '/image/upload',
                tipsModalMessage: '',
                tipsModalState: false,
                userForm: {},
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
                    mobile: [
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
            modifyAvatarModalConfirmEvent () {
                this.avatarConfirmLoading = true;
                this.$call('user.pictureSave', {
                    picUrl: this.modifyAvatarModalImagePath
                }).then(res => {
                    if (res.data.status === 200) {
                        this.getLoginMsgData();
                        this.$store.dispatch({
                            type: 'avatarPath',
                            payload: this.modifyAvatarModalImagePath
                        });
                        this.avatarConfirmLoading = false;
                        this.modifyAvatarModalState = false;
                    } else {
                        this.avatarConfirmLoading = false;
                    };
                });
            },
            modifyAvatarModalCancelEvent () {
                this.modifyAvatarModalState = false;
                this.avatarConfirmLoading = false;
            },
            modifyAvatarModalVisibleChange (e) {
                this.modifyAvatarModalState = e;
                if (!e) {
                    this.avatarConfirmLoading = false;
                };
            },
            modifyAvatarButtonEvent () {
                this.modifyAvatarModalState = true;
            },
            handleSuccess (res, file) {
                if (res.status === 4001) {
                    this.$store.dispatch({
                        type: 'showErrorModal',
                        payload: {
                            message: res.message,
                            status: res.status
                        }
                    });
                } else if (res.status === 200) {
                    this.uploadUrl = res.res.absUrl;
                    this.$set(this.$refs.upload.fileList[0], 'url', res.res.absUrl);
                    this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                    this.$set(this.uploadList[0], 'url', res.res.absUrl);
                    this.$set(this.uploadList[0], 'status', 'finished');
                    this.modifyAvatarModalImagePath = res.res.absUrl;
                };
            },
            handleBeforeUpload () {
                this.$refs.upload.fileList.splice(0, 1);
                const check = this.uploadList.length < 5;
                if (!check) {
                    emptyTips(this, '超出上传的最多数量!', 'error');
                };
                return check;
            },
            handleMaxSize (file) {
                emptyTips(this, '上传的图片太大了!', 'error');
            },
            handleFormatError (file) {
                emptyTips(this, '上传失败,仅支持jpg,jpeg,png格式!', 'error');
            },
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
            getLoginMsgData () {
                this.$api.common.userInfoRequest().then(res => {
                    if (res.data.status === 200) {
                        this.modifyAvatarModalImagePath = res.data.res.picUrl;
                        this.userForm = res.data.res;
                        res.data.res.gender === 0 ? this.userForm.gender = '女' : this.userForm.gender = '男';
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
                        if (this.phoneHasChanged && this.userForm.mobile !== this.initPhone) { // 手机号码修改过了而且修改之后的手机号和原来的不一样
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
                    noticeTips(this, 'saveTips');
                    this.save_loading = false;
                }, 1000);
            }
        },
        created () {
            this.getLoginMsgData();
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>
<style lang="less">
    @import './own-space.less';
</style>

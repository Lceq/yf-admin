<template>
    <Card>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100">
            <Row>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="公司编码:">
                        <Input type="text" v-model="formCustom.code" number disabled></Input>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="公司简称:" prop="shorthand">
                        <Input type="text" v-model="formCustom.shorthand" placeholder="请输入公司简称"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="公司全称:">
                        <Input type="text" v-model="formCustom.fullNameOfTheCompany" disabled/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="公司地址:">
                        <Input type="text" v-model="formCustom.address" number placeholder="请输入公司所在地址"/>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="公司Logo:">
                        <div class="demo-upload-list" v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <img :src="item.url" style="width: 58px;height: 58px;">
                                <div class="demo-upload-list-cover">
                                    <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                    <Icon v-show="showUpload" type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                </div>
                            </template>
                            <template v-else>
                                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                        </div>
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
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="签到IP:">
                        <Input type="text" v-model="formCustom.sign" number placeholder="请输入有效签到IP地址"></Input>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="服务地址:">
                        <Input type="text" v-model="formCustom.serviceAddress" number></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="联系人:" prop="contacts">
                        <Input type="text" v-model="formCustom.contacts" number placeholder="请输入联系人"></Input>
                    </FormItem>
                </Col>
                <Col :sm="12" :md="12" :lg="6">
                    <FormItem label="手机号:" prop="tell">
                        <Input type="text" v-model="formCustom.tell" number placeholder="请输入联系人手机号"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormItem>
                        <Button :loading="buttonLoading" type="primary" @click="handleSubmit('formCustom')">保存</Button>
                        <Button @click="handleReset('formCustom')">重置</Button>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Modal title="预览" v-model="visible" style="z-index: 99999;">
                        <img :src="uploadUrl" v-if="visible" style="width: 100%">
                        <div slot="footer"></div>
                    </Modal>
                </Col>
            </Row>
        </Form>
    </Card>
</template>
<script>
    import api from '../../ajax/api';
    import { noticeTips } from '../../libs/common';
    import Cookies from 'js-cookie';
    export default {
        data () {
            const validateAddress = (rule, value, callback) => { value ? callback() : callback(new Error('服务地址不能为空！')); };
            const validateTell = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error('手机号不能为空！'));
                } else if (value && /^1\d{10}$/.test(value)) {
                    callback();
                } else {
                    callback(new Error('手机号格式错误！'));
                }
            };
            const validateShorthand = (rule, value, callback) => { value ? callback() : callback(new Error('公司简称不能为空！')); };
            const validateContacts = (rule, value, callback) => { value ? callback() : callback(new Error('联系人不能为空！')); };
            return {
                uploadRequestUrl: process.env.REQUEST_HOST + '/image/upload',
                visible: false,
                uploadUrl: '',
                uploadList: [],
                showUpload: true,
                uploadHeader: { 'auth-token': Cookies.get('token') },
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': ''
                    }
                ],
                formCustom: {
                    address: '',
                    sign: '',
                    tell: '',
                    contacts: '',
                    fullNameOfTheCompany: '',
                    serviceAddress: '',
                    shorthand: '',
                    code: ''
                },
                ruleCustom: {
                    address: [
                        { validator: validateAddress, trigger: 'blur' }
                    ],
                    tell: [
                        { required: true, validator: validateTell, trigger: 'blur' }
                    ],
                    contacts: [
                        { required: true, validator: validateContacts, trigger: 'blur' }
                    ],
                    shorthand: [
                        { required: true, validator: validateShorthand, trigger: 'blur' }
                    ]
                },
                imgName: '',
                companyId: '',
                buttonLoading: false
            };
        },
        methods: {
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
                    this.$refs.upload.fileList = [{
                        url: '',
                        status: 'finished'
                    }];
                    this.uploadList = [{
                        url: '',
                        status: 'finished'
                    }];
                    this.$set(this.$refs.upload.fileList[0], 'url', res.res.absUrl);
                    this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                    this.$set(this.uploadList[0], 'url', res.res.absUrl);
                    this.$set(this.uploadList[0], 'status', 'finished');
                };
            },
            handleFormatError (file) {
                this.$Notice.error({
                    title: '提示',
                    desc: '上传失败,仅支持jpg,jpeg,png格式!'
                });
            },
            handleMaxSize (file) {
                this.$Notice.error({
                    title: '提示',
                    desc: '上传的图片太大了!'
                });
            },
            handleBeforeUpload () {
                this.$refs.upload.fileList.splice(0, 1);
                const check = this.uploadList.length < 5;
                if (!check) {
                    this.$Notice.error({
                        title: '提示',
                        desc: '超出上传的最多数量!'
                    });
                }
                return check;
            },
            handleView (name) {
                this.visible = true;
            },
            handleRemove (file) {
                this.uploadUrl = '';
                const fileList = this.$refs.upload.fileList;
                this.uploadList.splice(fileList.indexOf(file), 1);
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            // 保存的提交事件
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        this.$post(api.corpSave(),
                            {
                                'id': this.companyId,
                                'name': this.formCustom.fullNameOfTheCompany,
                                'shortName': this.formCustom.shorthand,
                                'code': this.formCustom.code,
                                'serviceHost': this.formCustom.serviceAddress,
                                'addr': this.formCustom.address,
                                'logo': this.uploadUrl,
                                'contacts': this.formCustom.contacts,
                                'mobile': this.formCustom.tell,
                                'checkinIp': this.formCustom.sign
                            }
                        ).then((res) => {
                            if (res.data.status === 200) {
                                this.buttonLoading = false;
                                this.getCompanyDetailHttp(); // 调用获取公司信息的请求
                                noticeTips(this, 'saveTips');
                            };
                        });
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
                this.formCustom.address = '';
                this.formCustom.sign = '';
                this.formCustom.serviceAddress = '';
                this.$refs.upload.clearFiles();
            },
            // 获取公司信息
            getCompanyDetailHttp () {
                this.$fetch(api.corpDetail()).then((res) => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        if (responseData.logo) {
                            this.uploadUrl = responseData.logo;
                            this.$set(this.$refs.upload.fileList[0], 'url', responseData.logo);
                            this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                            this.$set(this.uploadList[0], 'url', responseData.logo);
                            this.$set(this.uploadList[0], 'status', 'finished');
                        } else {
                            this.$refs.upload.fileList = [{
                                url: '',
                                status: 'finished'
                            }];
                            this.uploadList = [{
                                url: '',
                                status: 'finished'
                            }];
                            this.$set(this.$refs.upload.fileList[0], 'url', '');
                            this.$set(this.$refs.upload.fileList[0], 'status', 'finished');
                            this.$set(this.uploadList[0], 'url', '');
                            this.$set(this.uploadList[0], 'status', 'finished');
                        };
                        this.companyId = responseData.id;
                        this.formCustom.code = responseData.code;
                        this.formCustom.shorthand = responseData.shortName;
                        this.formCustom.fullNameOfTheCompany = responseData.name;
                        this.formCustom.address = responseData.addr;
                        this.formCustom.sign = responseData.checkinIp;
                        this.formCustom.serviceAddress = responseData.serviceHost;
                        this.formCustom.contacts = responseData.contacts;
                        this.formCustom.tell = responseData.mobile;
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                    };
                });
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        created () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            this.getCompanyDetailHttp();
        }
    };
</script>

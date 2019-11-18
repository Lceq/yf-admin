<template>
    <div>
        <Modal
                v-model="showModal"
                title="同步员工"
                :mask-closable="false"
                :width="800"
                @on-visible-change="visibleChangeEvent"
        >
            <modal-content-loading :spinShow="saveUserModalLoading"></modal-content-loading>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :show-message="false">
                <Row>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="姓名：" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输入姓名"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="登录名：" prop="loginName">
                            <Input v-model="formValidate.loginName" placeholder="请输入登录名"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="集团编号：" prop="code">
                            <Input v-model="formValidate.code" placeholder="请输入集团编号"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="内部编号：" prop="internalCode">
                            <Input v-model="formValidate.internalCode" placeholder="请输入内部编号"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="身份证号：" prop="corpId">
                            <Input v-model="formValidate.idCard" placeholder="请输入身份证号"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="直接上级：" prop="leaderId">
                            <Select v-model="formValidate.leaderId" @on-change="getLeaderEvent" label-in-value filterable placeholder="请选择直接上级" clearable>
                                <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="性别：" prop="gender">
                            <Select v-model="formValidate.gender" @on-change="getLeaderEvent" label-in-value placeholder="请选择性别">
                                <Option v-for="item in genderList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="出生日期：" prop="birthday">
                            <DatePicker v-model="formValidate.birthday" type="date" placeholder="请选择出生日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="手机号：" prop="mobile">
                            <InputNumber v-model="formValidate.mobile" placeholder="请输入手机号" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="办公电话：" prop="tel">
                            <Input v-model="formValidate.tel" placeholder="请输入办公电话"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="所属部门：" prop="deptArray">
                            <Cascader :data="deptList" v-model="formValidate.deptArray" @on-change="getDeptEvent" placeholder="请选择所属部门" change-on-select></Cascader>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="办公邮箱：" prop="email">
                            <Input v-model="formValidate.email" placeholder="请输入办公邮箱"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="岗位工种：" prop="postId">
                            <Select
                                    v-model="formValidate.postId"
                                    @on-change="getPostEvent"
                                    :filterable="true"
                                    placeholder="请选择岗位工种"
                                    :label-in-value="true"
                                    :clearable="true"
                            >
                                <OptionGroup v-for="(items,index) in postList" :key="index" :label="items.typeName">
                                    <Option v-for="item in items.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </OptionGroup>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem class="formItemMargin" label="排序：" prop="sortNum">
                            <InputNumber v-model="formValidate.sortNum" :min="1"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="班组：" class="formItemMargin">
                            <Select
                                    v-model="formValidate.groupId"
                                    @on-change="getGroupEvent"
                                    :filterable="true"
                                    :label-in-value="true"
                                    :clearable="true"
                                    placeholder="请选择班组"
                            >
                                <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="24">
                        <FormItem class="formItemMargin" label="描述：">
                            <Input v-model="formValidate.remark" type="textarea" :rows="4" placeholder="请输入..." :maxlength="512" :autosize="{minRows:2,maxRows:10}"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="saveModalButtonLoading"
                        @saveModalConfirmEvent="saveModalConfirmEvent"
                        @saveModalCancelEvent="saveModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
    </div>
</template>
<script>
    import modalContentLoading from '../../components/modal-content-loading';
    import modalFooter from '../../components/modal-footer';
    import { toTree, noticeTips, formatDate, emptyTips } from '../../../libs/common';
    export default {
        components: { modalContentLoading, modalFooter },
        props: {
            saveUserModalState: {
                type: Boolean,
                default: false
            },
            saveUserModalData: {
                type: Object
            }
        },
        data () {
            const validatorName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatorLoginName = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatorCode = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error());
                } else if (value !== '' && !/[\u4e00-\u9fa5]/g.test(value)) {
                    callback();
                } else {
                    callback(new Error());
                }
            };
            const validatorInternalCode = (rule, value, callback) => {
                if (value) {
                    if (/[\u4e00-\u9fa5]/g.test(value)) {
                        callback(new Error());
                    } else {
                        callback();
                    };
                } else {
                    callback(new Error());
                }
            };
            const validatorMobile = (rule, value, callback) => {
                if (value && /^1\d{10}$/.test(value)) {
                    this.onJobValidatorMessage = '';
                    callback();
                } else {
                    callback(new Error());
                }
            };
            const validatorDeptId = (rule, value, callback) => this.formValidate.deptArray && this.formValidate.deptArray.length !== 0 ? callback() : callback(new Error());
            const validatorPostId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatorGender = (rule, value, callback) => value || value === 0 ? callback() : callback(new Error());
            return {
                saveUserModalLoading: false,
                groupList: [],
                genderList: [
                    {id: 1, name: '男'},
                    {id: 0, name: '女'}
                ],
                sourcePostList: [],
                allDeptData: [],
                familyArray: [],
                postList: [],
                deptList: [],
                userList: [],
                saveModalButtonLoading: false,
                formValidate: {},
                ruleValidate: {
                    name: [{ required: true, validator: validatorName, trigger: 'change' }],
                    loginName: [{ required: true, validator: validatorLoginName, trigger: 'change' }],
                    code: [{ required: true, validator: validatorCode, trigger: 'change' }],
                    internalCode: [{ required: true, validator: validatorInternalCode, trigger: 'change' }],
                    mobile: [{ required: true, validator: validatorMobile, trigger: 'change' }],
                    deptArray: [{ required: true, validator: validatorDeptId, trigger: 'change' }],
                    postId: [{ required: true, validator: validatorPostId, trigger: 'change' }],
                    gender: [{ required: true, validator: validatorGender, trigger: 'change' }],
                },
                showModal: false
            };
        },
        methods: {
            getGroupEvent (e) {
                if (e) {
                    this.formValidate.groupId = e.value;
                    this.formValidate.groupName = e.label;
                };
            },
            getLeaderEvent (e) {
                if (e) this.formValidate.leaderName = e.label;
            },
            // 获取部门
            getDeptEvent (e) {
                if (e && e.length !== 0) {
                    this.allDeptData.forEach((item) => {
                        if (item.id === e[e.length - 1]) {
                            this.formValidate.deptId = item.id;
                            this.formValidate.deptName = item.name;
                        }
                    });
                };
            },
            getFartherName (list, pId) {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === pId) {
                        this.familyArray.push(list[i].id);
                        this.getFartherName(list, list[i].parentId);
                    };
                };
            },
            // 拼所属部门的方法
            getSubDeptMethods (param) {
                this.familyArray = [];
                this.getFartherName(this.allDeptData, param);
                let arrayRev = this.familyArray.reverse();
                this.formValidate.deptArray = arrayRev;
            },
            // 岗位的请求
            getPostHttp () {
                this.$api.post.getPostList({auditState: 3}).then((res) => {
                    if (res.data.status === 200) {
                        this.sourcePostList = JSON.parse(JSON.stringify(res.data.res));
                        this.postClassMethod(res.data.res);// 根据typeName归类
                    };
                });
            },
            postClassMethod (arr) {
                let classTypeName = {};
                this.postList = [];
                for (let i = 0; i < arr.length; i++) {
                    let ai = arr[i];
                    if (!classTypeName[ai.typeName]) {
                        this.postList.push({
                            typeName: ai.typeName,
                            data: [ai]
                        });
                        classTypeName[ai.typeName] = ai;
                    } else {
                        for (let j = 0; j < this.postList.length; j++) {
                            let classObj = this.postList[j];
                            if (classObj.typeName === ai.typeName) {
                                classObj.data.push(ai);
                                break;
                            }
                        }
                    }
                };
            },
            // 获取岗位的事件
            getPostEvent (e) {
                if (e) this.formValidate.postName = e.label;
            },
            saveModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        // 身份证和邮箱都没填
                        if (!this.formValidate.email && !this.formValidate.idCard) {
                            this.buttonLoading = true;
                            this.saveRequest();
                        } else {
                            // 身份证和邮箱都填
                            if (this.formValidate.email && this.formValidate.idCard) {
                                let validateFail = false;
                                if (/[\u4e00-\u9fa5]/g.test(this.formValidate.idCard)) {
                                    this.$Message.warning('身份证号不能有中文!');
                                    validateFail = true;
                                };
                                if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.formValidate.email)) {
                                    this.$Message.warning('邮箱格式不正确!');
                                    validateFail = true;
                                };
                                if (!validateFail) {
                                    this.saveRequest();
                                };
                            } else {
                                // 身份证填了
                                if (this.formValidate.idCard) {
                                    // 没有中文
                                    if (!/[\u4e00-\u9fa5]/g.test(this.formValidate.idCard)) {
                                        this.saveRequest();
                                    } else {
                                        this.$Message.warning('身份证号不能为中文!');
                                    };
                                }
                                // 邮箱填了
                                if (this.formValidate.email) {
                                    // 格式正确
                                    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.formValidate.email)) {
                                        this.saveRequest();
                                    } else {
                                        this.$Message.warning('办公邮箱格式不正确!');
                                    };
                                };
                            };
                        };
                    } else {
                        this.validatorTips();
                    };
                });
            },
            // 校验提示
            validatorTips () {
                if (this.formValidate.name === '') {
                    this.$Message.warning('姓名不能为空！');
                } else if (this.formValidate.loginName === '') {
                    this.$Message.warning('登录名不能为空！');
                } else if (this.formValidate.code === '' || /[\u4e00-\u9fa5]/g.test(this.formValidate.code)) {
                    this.$Message.warning('集团编号不能为空或中文！');
                } else if (this.formValidate.internalCode === '' || /[\u4e00-\u9fa5]/g.test(this.formValidate.internalCode)) {
                    this.$Message.warning('内部编号不能为空或中文！');
                } else if (this.formValidate.gender === null) {
                    this.$Message.warning('性别不能为空！');
                } else if (!/^1\d{10}$/.test(this.formValidate.mobile)) {
                    this.$Message.warning('手机号格式不正确！');
                } else if (this.formValidate.empSubDep.length === 0) {
                    this.$Message.warning('所属部门不能为空！');
                } else if (!this.formValidate.postId) {
                    this.$Message.warning('岗位工种不能为空！');
                };
            },
            saveModalCancelEvent () {
                this.$emit('on-cancel');
            },
            visibleChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.$refs['formValidate'].resetFields();
                };
            },
            // 保存的请求
            saveRequest () {
                this.saveModalButtonLoading = true;
                this.formValidate.birthday ? this.formValidate.birthday = formatDate(this.formValidate.birthday) : this.formValidate.birthday = '';
                this.formValidate.isImport = false;
                this.$api.user.userSaveRequest(this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        this.saveModalButtonLoading = false;
                        noticeTips(this, 'saveTips');
                        this.$emit('on-confirm');
                    } else {
                        this.saveModalButtonLoading = false;
                    };
                });
            },
            // 获取员工列表数据
            getUserListRequest () {
                this.$api.user.userListRequest().then(res => {
                    if (res.data.status === 200) {
                        this.userList = res.data.res;
                    };
                });
            },
            // 获取部门列表数据
            getDeptListRequest () {
                this.$api.dept.deptListRequest().then(res => {
                    if (res.data.status === 200) {
                        this.allDeptData = JSON.parse(JSON.stringify(res.data.res));
                        this.deptList = toTree(res.data.res)[0].children;
                    };
                });
            }
        },
        watch: {
            saveUserModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            saveUserModalData: {
                handler (newVal) {
                    this.saveUserModalLoading = true;
                    this.$api.user.groupListRequest().then(res => {
                        if (res.data.status === 200) {
                            this.groupList = res.data.res;
                            this.formValidate = JSON.parse(JSON.stringify(newVal));
                            this.getSubDeptMethods(this.formValidate.deptId);
                            this.formValidate.mobile = parseFloat(this.formValidate.mobile);
                            this.saveUserModalLoading = false;
                        };
                    });
                },
                deep: true
            }
        },
        created () {
            this.getUserListRequest();
            this.getDeptListRequest();
            this.getPostHttp();
        }
    };
</script>

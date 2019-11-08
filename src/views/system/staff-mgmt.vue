<template>
    <Card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row>
            <Col span="24">
                <Tabs :animated="false" @on-click="clickTabsEvent">
                    <TabPane label="在职员工管理" name="onJob" :style="{height: tableHeight + 90 +'px'}">
                        <Row>
                            <Col class="leftMenu">
                                <Card :style="{'height': tableHeight + 90 + 'px','overflow': 'auto'}">
                                    <Tree :data="deptTreeData" @on-select-change="deptTreeChangeEvent"></Tree>
                                </Card>
                            </Col>
                            <Col class="contentPadding rightContent">
                                <Row type="flex" justify="space-between" align="middle">
                                    <Col>
                                        <Button icon="md-add" type="primary" @click="inServiceAddStaffEvent">新增</Button>
                                        <Button type="info" @click="setUserVipEvent">设为操作用户</Button>
                                        <Button type="warning" @click="cancelUserVipEvent">取消操作用户</Button>
                                        <Button type="error" @click="quitHandleEvent">离职处理</Button>
                                    </Col>
                                    <Col>
                                        <Input v-model="searchData" placeholder="请输入关键字" class="modal-input-length" @on-enter="onJobSearchInputEnterEvent"/>
                                        <Button icon="ios-search" type="primary" @click="onJobSearchButtonEvent">搜索</Button>
                                    </Col>
                                </Row>
                                <Row class="margin-top-10 margin-bottom-10 tableOffsetTop">
                                    <Col>
                                        <Table :height="tableHeight" :loading="loadingStatus" border :columns="inServiceTableHeaders" :data="inSerTableData" size="small" @on-selection-change="inServiceSelectTableAll" ref="inSevSelection"></Table>
                                    </Col>
                                </Row>
                                <Row class="pageHeight" type="flex" justify="end">
                                    <Col class="pageStyle">
                                        <Page :placement="pageUp" :total="inServiceTotalPage" :page-size-opts="pageSizeOpts" :show-total="true" :show-elevator="true" :show-sizer="true" :page-size="pageSize" @on-change="getPageNumber" @on-page-size-change="pageChange"></Page>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane label="离职员工管理" name="quit" :style="{height: quitTableHeight + 90 +'px'}">
                        <Row>
                            <Col class="leftMenu">
                                <Card :style="{'height': quitTableHeight + 90 + 'px','overflow': 'auto'}">
                                    <Tree :data="quitTreeData" @on-select-change="getClickQuitDept"></Tree>
                                </Card>
                            </Col>
                            <Col class="rightContent tablePaddingLeft">
                                <Card :bordered="false" :padding="0" :dis-hover="true">
                                    <Row type="flex" justify="space-between">
                                        <Col>
                                            <Button type="success" @click="recoveryEvent">恢复所选</Button>
                                        </Col>
                                        <Col>
                                            <Input v-model="quitEmpName" placeholder="请输入姓名或登录名" class="modal-input-length" @on-enter="quitSearchEnterStaff"></Input>
                                            <Button icon="ios-search" type="primary" @click="quitSearchClickStaff">搜索</Button>
                                        </Col>
                                    </Row>
                                    <Row class="margin-top-10 margin-bottom-10 tableOffsetTop">
                                        <Col>
                                            <Table :height="quitTableHeight" border :columns="quitEmpTableHeader" size="small" :data="quitEmpTableData" @on-selection-change="checkQuitEvent" ref="selection"></Table>
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="end" class="quitPageHeight">
                                        <Col>
                                            <Page :placement="quitPageUp" :total="quitTotalPage" :page-size-opts="quitPageSizeOpts" :show-total="true" :show-elevator="true" :show-sizer="true" :page-size="quitPageSize" @on-change="getQuitPageNumber" @on-page-size-change="getQuitPageChange"></Page>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Col>
        </Row>
        <Modal
                v-model="saveModalState"
                :title="saveModalTitle"
                :mask-closable="false"
                @on-visible-change="saveModalStateVisibleChangeEvent"
                :width="800"
        >
            <Form ref="addEmpForCus" :rules="addEmpRuleCus" :model="addEmpForCus" :label-width="90" :show-message="false">
                <Row>
                    <Col span="12">
                        <FormItem label="姓名：" prop="name" class="formItemMargin">
                            <Input type="text" value="" v-model="addEmpForCus.name" placeholder="请输入员工姓名"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="登录名：" prop="loginName" class="formItemMargin">
                            <Input type="text" v-model="addEmpForCus.loginName" placeholder="请输入登录名"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="集团编号：" prop="code" class="formItemMargin">
                            <Input type="text" v-model="addEmpForCus.code" placeholder="请输入集团编号" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="内部编号：" prop="internalCode" class="formItemMargin">
                            <Input type="text" v-model="addEmpForCus.internalCode" placeholder="请输入内部编号" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="身份证号：" class="formItemMargin">
                            <Input type="text" v-model="addEmpForCus.idCard" placeholder="请输入身份证号" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="直接上级：" class="formItemMargin">
                            <Select
                                    v-model="addEmpForCus.leaderId"
                                    @on-change="getInWorkSelectSuper"
                                    filterable
                                    :label-in-value="true"
                                    remote
                                    placeholder="请输入"
                                    :clearable="true"
                                    :loading="searchSwitch"
                                    :remote-method="remoteLeaderMethod"
                            >
                                <Option v-for="item in staffSuperList" :value="item.id" :key="item.id">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="性别：" prop="gender" class="formItemMargin">
                            <Select v-model="addEmpForCus.gender">
                                <Option v-for="item in genderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="出生日期：" prop="emploayeeDateOfBirth" class="formItemMargin">
                            <DatePicker class="widthPercentage" type="date" placeholder="请选择日期" @on-change="getAddEmpBirth" confirm :value="birthData" ></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="手机号：" prop="mobile" class="formItemMargin">
                            <Input number type="text" v-model="addEmpForCus.mobile" placeholder="请输入手机号码" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="办公电话：" class="formItemMargin">
                            <Input type="text" v-model="addEmpForCus.tel" placeholder="请输入办公电话" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="所属部门：" prop="empSubDep" class="formItemMargin">
                            <Cascader
                                    :data="addSubDeptData"
                                    v-model="addEmpForCus.empSubDep"
                                    filterable
                                    change-on-select
                                    @on-change="getSubDepartment"
                            >
                            </Cascader>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="办公邮箱：" class="formItemMargin">
                            <Input type="email" v-model="addEmpForCus.email" placeholder="请输入办公邮箱" @on-blur="emailInputBlurEvent"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="岗位工种：" prop="postId" class="formItemMargin">
                            <Select
                                    v-model="addEmpForCus.postId"
                                    @on-change="getInServicePostEvent"
                                    :filterable="true"
                                    :label-in-value="true"
                                    :clearable="true"
                                    v-if="showPostSelect"
                            >
                                <OptionGroup v-for="(items,index) in classContain" :key="index" :label="items.typeName">
                                    <Option v-for="item in items.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </OptionGroup>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="排序：" prop="employeeSort" class="formItemMargin">
                            <InputNumber :max="100" :min="1" v-model="addEmpForCus.employeeSortData"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="班组：" class="formItemMargin">
                            <Select
                                    v-model="addEmpForCus.groupId"
                                    @on-change="getGroupEvent"
                                    :filterable="true"
                                    :label-in-value="true"
                                    :clearable="true"
                            >
                                <Option v-for="item in groupList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="描述：" class="formItemMargin">
                            <Input v-model="addEmpForCus.remark" type="textarea" :rows="4" placeholder="请输入..." :maxlength="512" :autosize="{minRows:2,maxRows:10}"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <div v-show="showOther">
                    <other-message
                            :createName="addEmpForCus.createName"
                            :createTime="addEmpForCus.createTime"
                            :updateName="addEmpForCus.updateName"
                            :updateTime="addEmpForCus.updateTime"
                    ></other-message>
                </div>
            </Form>
            <div slot="footer" class="modal-footer-bar">
                <!--<span class="editFormErrorStyle">{{onJobValidatorMessage}}</span>-->
                <div>
                    <Button :loading="buttonLoading" type="success" @click="saveModalConfirmEvent">确认</Button>
                    <Button class="cancelButton" @click="saveModalCancelEvent">取消</Button>
                </div>
            </div>
        </Modal>
        <tips-modal
                :v-model="publicModalState"
                :tipMsg="publicModalMsg"
                :loading="publicConfirmButtonLoading"
                @cancel="publicCancelEvent"
                @confirm="publicConfirmEvent"
        >
        </tips-modal>
        <user-detail
                :detailModalState="detailModalState"
                :detailResponseData="detailResponseData"
                @detailModalStateChangeEvent="detailModalStateChangeEvent"
                @closeUserDetailModalEvent="closeUserDetailModalEvent"
        ></user-detail>
        <Modal
                v-model="setPasswordModal"
                title="设置密码"
                :mask-closable="false"
                @on-visible-change="getSetPasswordChange"
        >
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="90" :show-message="false">
                <Row>
                    <Col>
                        <FormItem label="密码：" prop="passwordIpt" class="formItemMargin">
                            <Input type="password" v-model="formValidate.passwordIpt"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="确认密码：" prop="againPasswordIpt" class="formItemMargin">
                            <Input type="password" v-model="formValidate.againPasswordIpt"/>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer" class="modalFooterStyle">
                <span class="editFormErrorStyle">{{errorMsg}}</span>
                <div>
                    <Button :loading="passwordConfirmLoading" type="success" @click="setPasswordConfirm">确认</Button>
                    <Button class="cancelButton" @click="setPasswordCancel">取消</Button>
                </div>
            </div>
        </Modal>
        <Modal
                v-model="modalRole"
                :width="800"
                title="角色">
            <div>
                <Table height="600" size="small" border @on-selection-change="SelectionRoleData" :columns="columnsRole" :data="roleData"></Table>
            </div>
            <modal-button
                    slot="footer"
                    :loading="roleLoading"
                    @cancel="cancelUserRole"
                    @submit="confirmUserRole"
            >
            </modal-button>
        </Modal>
        <Modal
                v-model="modalModule"
                :width="800"
                title="模块">
            <div class="moduleAssembly">
                <Tree @on-check-change="selectionModuleData" :data="newModuleList" show-checkbox></Tree>
            </div>
            <modal-button
                    slot="footer"
                    :loading="moduleLoading"
                    @cancel="cancelUserModule"
                    @submit="confirmUserModule"
            >
            </modal-button>
        </Modal>
        <Modal
                v-model="powerModule"
                title="权限设置"
                :width="800">
            <div>
                <Table :loading="tableRoleAssemblyLoading" height="600" :columns="roleAssemblyColumns" size="small" :data="roleAssemblyData"></Table>
            </div>
            <modal-button
                    slot="footer"
                    :loading="powerLoading"
                    @cancel="cancelUserAssembly"
                    @submit="confirmUserAssembly"
            >
            </modal-button>
        </Modal>
        <modal
                :isShow="dataPromiseShow"
                :loading="dataPromiseLoading"
                :width="800"
                @cancel="dataPromiseCancel"
                @submit="dataPromiseSubmit"
                :title="dataPromiseUserName + '数据权限'"
        >
            <div slot="content">
                <Tabs v-model="defaultName" :animated="false">
                    <TabPane label="车间数据授权" name="workshop">
                        <!--<Button class="marginBottom" type="success" @click="setDefaultWorkshop">设为默认车间</Button>-->
                        <Table :height="400" border size="small" :columns="workshopDataPromiseColumns" :data="workshopDataPromiseData"></Table>
                    </TabPane>
                    <TabPane label="班组数据授权" name="shiftGroup">
                        <!--<Button class="marginBottom" type="success" @click="setShiftGroup">设为默认班组</Button>-->
                        <Table :height="400" border size="small" :columns="shiftGroupDataPromiseColumns" :data="shiftGroupDataPromiseData"></Table>
                    </TabPane>
                </Tabs>
            </div>
        </modal>
        <quit-tips
                :v-model="quitTipsStatus"
                :tipMsg="quitTipsMsg"
                :loading="quitTipsLoading"
                @cancel="quitTipsCancel"
                @confirm="quitTipsConfirm"
        >
        </quit-tips>
    </Card>
</template>
<script>
    import Icon from '../../../node_modules/iview/src/components/icon/icon.vue';
    import modal from '../public/modal';
    import api from '../../ajax/api';
    import modalButton from '../public/modalButton';
    import tipsModal from '../public/deleteWarning';
    import quitTips from '../public/deleteWarning';
    import { noticeTips, setPage, compClientHeight, formatDate, clearSpace, toDaySeconds } from '../../libs/common';
    import otherMessage from '../components/otherMessage';
    import userDetail from './user/user-detail';
    export default{
        components: {
            userDetail, Icon, modalButton, tipsModal, quitTips, modal, otherMessage
        },
        data () {
            const subDept = (rule, value, callback) => { value.length === 0 ? callback(new Error()) : callback(); };
            const validatePost = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePhone = (rule, value, callback) => {
                if (value && /^1\d{10}$/.test(value)) {
                    this.onJobValidatorMessage = '';
                    callback();
                } else {
                    this.onJobValidatorMessage = '手机号格式错误!';
                    callback(new Error());
                }
            };
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error());
                } else if (value !== '' && !/[\u4e00-\u9fa5]/g.test(value)) {
                    this.onJobValidatorMessage = '';
                    callback();
                } else {
                    this.onJobValidatorMessage = '编号必须是字母或者数字!';
                    callback(new Error());
                }
            };
            const validateInternalCode = (rule, value, callback) => {
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
            const validateEmail = (rule, value, callback) => {
                if (value === '') {
                    return callback();
                } else if (value !== '') {
                    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
                        this.onJobValidatorMessage = '';
                        return callback();
                    } else {
                        this.onJobValidatorMessage = '邮箱格式不正确!';
                        return callback(new Error());
                    };
                };
            };
            const validateLoginUser = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error());
                } else {
                    this.onJobValidatorMessage = '';
                    return callback();
                };
            };
            const validateEmployeeName = (rule, value, callback) => {
                if (value === '') {
                    return callback(new Error());
                } else {
                    this.onJobValidatorMessage = '';
                    return callback();
                };
            };
            const validateEmployeeSex = (rule, value, callback) => {
                if (value || value === 0) {
                    this.onJobValidatorMessage = '';
                    return callback();
                } else {
                    return callback(new Error());
                };
            };
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error());
                } else if (value !== '') {
                    if (/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
                        if (this.formValidate.againPasswordIpt !== '') {
                            // 对第二个密码框单独验证
                            this.$refs.formValidate.validateField('againPasswordIpt');
                        };
                        callback();
                        this.errorMsg = '';
                    } else {
                        // 密码必须是六位，只能是数字、字母，下划线，-
                        this.errorMsg = '密码必须是六位以上，且只能是数字、字母，下划线,-';
                        callback(new Error());
                    };
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error());
                } else if (value !== '') {
                    if (/^[a-zA-Z0-9_-]{6,16}$/.test(this.formValidate.passwordIpt)) {
                        if (value !== this.formValidate.passwordIpt) { // 判断两个密码是否一致
                            callback(new Error());
                            this.errorMsg = '两次密码输入不一致！';
                        } else {
                            callback();
                            this.errorMsg = '';
                        }
                    } else {
                        callback(new Error());
                        this.errorMsg = '密码必须是六位以上，且只能是数字、字母，下划线,-';
                    };
                };
            };
            return {
                globalLoadingShow: false,
                detailResponseData: {},
                quitItems: [],
                quitEmpName: '',
                selectQuitDeptId: '',
                quitPageIndex: '',
                isQuitRecovery: false,
                isQuitDeleteSwitch: false,
                quitTipsStatus: false,
                quitTipsMsg: '',
                quitTipsLoading: false,
                checkQuit: [],
                pageHeights: null,
                quitPageHeights: null,
                tableHeight: null,
                quitTableHeight: null,
                pageUp: setPage.pageUp,
                quitPageUp: setPage.pageUp,
                pageSizeOpts: setPage.pageOpts,
                quitPageSizeOpts: setPage.pageOpts,
                moduleTreeData: [],
                currentUserRole: [],
                modalRole: false,
                roleLoading: false,
                modalModule: false,
                moduleLoading: false,
                powerModule: false,
                powerLoading: false,
                currentUserId: '',
                columnsRole: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '角色编号',
                        key: 'roleCode'
                    },
                    {
                        title: '角色名称',
                        key: 'roleName'
                    }
                ],
                roleData: [],
                moduleList: [],
                columnsPower: [
                    {
                        title: '模块名称',
                        key: 'name',
                        width: 150,
                        render: (h, params) => {
                            return h('div', [
                                h('Span', {
                                    props: {
                                    },
                                    style: {
                                        fontSize: '14px'
                                    }
                                }, params.row.moduleName)
                            ]);
                        }
                    },
                    {
                        title: '权限项',
                        key: 'power',
                        render: (h, params) => {
                            const _this = this;
                            return h('div', [
                                (params.row.rightItems).map(item => {
                                    return h('Checkbox', {
                                        props: {
                                            label: item.rightName,
                                            value: item.checked,
                                            checked: item.checked,
                                            disabled: item.disabled
                                        },
                                        on: {
                                            'on-change': (event) => {
                                                _this.powerData[params.index].rightItems.find(x => x.rightCode === item.rightCode).checked = event;
                                            }
                                        }
                                    }, item.rightName + '(' + item.rightCode + ')');
                                })
                            ]);
                        }
                    }
                ],
                powerData: [],
                powerBasicData: [],
                formValidate: {
                    passwordIpt: '',
                    againPasswordIpt: ''
                },
                ruleValidate: {
                    passwordIpt: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    againPasswordIpt: [
                        { required: true, validator: validatePassCheck, trigger: 'blur' }
                    ]
                },
                setPasswordModal: false,
                showOther: false,
                buttonLoading: false,
                loadingStatus: false,
                pageTotal: 0,
                adEdContainer: [],
                superObjId: null,
                birthData: '',
                detailModalState: false,
                editFormError: '',
                pageSize: setPage.pageSize,
                quitPageSize: setPage.pageSize,
                inServicePostData: {
                    value: '',
                    label: ''
                },
                value1: [],
                addSubDeptData: [],
                genderList: [
                    {value: 1, label: '男'},
                    {value: 0, label: '女'}
                ],
                inServiceDeleteBtn: false,
                setUserOperation: false,
                cancelUserOperation: false,
                employeeDeleteBtn: false,
                disable: '',
                publicModalState: false,
                publicModalMsg: '',
                selectTableData: [],
                remoteStaffSuperList: [],
                staffSuperList: [],
                addEmpForCus: {
                    idCard: '',
                    loginName: '',
                    loginPassword: '123456',
                    passwordAgain: '',
                    code: '',
                    internalCode: '',
                    name: '',
                    gender: 1,
                    mobile: '',
                    tel: '',
                    email: '',
                    empSubDep: [],
                    employeeSortData: 1,
                    remark: '',
                    employeeSort: '',
                    postId: null,
                    postName: '',
                    leaderId: null,
                    leaderName: '',
                    deptId: null,
                    deptName: ''
                },
                showPostSelect: false,
                addEmpRuleCus: {
                    loginName: [{ required: true, validator: validateLoginUser, trigger: 'change' }],
                    loginPassword: [{ required: true, validator: validatePass, trigger: 'change' }],
                    passwordAgain: [{ required: true, validator: validatePassCheck, trigger: 'change' }],
                    code: [{ required: true, validator: validateCode, trigger: 'change' }],
                    internalCode: [{ required: true, validator: validateInternalCode, trigger: 'blur' }],
                    email: [{ validator: validateEmail, trigger: 'change' }],
                    name: [{ required: true, validator: validateEmployeeName, trigger: 'change' }],
                    gender: [{ required: true, validator: validateEmployeeSex, trigger: 'change' }],
                    mobile: [
                        { required: true, validator: validatePhone, trigger: 'change' },
                        { type: 'number' }
                    ],
                    empSubDep: [{ required: true, validator: subDept, trigger: 'change' }],
                    postId: [{ required: true, validator: validatePost, trigger: 'change' }]
                },
                deleteOnJobId: null,
                saveModalState: false,
                quitEmpTabRowIdx: 0,
                deptTreeData: [],
                quitTreeData: [],
                searchData: '',
                quitEmpTableHeader: [
                    {type: 'selection', width: 80, align: 'center', fixed: 'left'},
                    {title: '集团编号', sortable: true, key: 'code', minWidth: 130, fixed: 'left', align: 'left'},
                    {title: '内部编号', sortable: true, key: 'internalCode', minWidth: 130, fixed: 'left', align: 'left'},
                    {title: '名称', key: 'name', sortable: true, align: 'left', minWidth: 110, fixed: 'left'},
                    {title: '性别', sortable: true, key: 'gender', align: 'left', minWidth: 110},
                    {title: '工作手机', sortable: true, key: 'mobile', align: 'left', minWidth: 130},
                    {title: '直接上级', sortable: true, key: 'leaderName', align: 'left', minWidth: 110},
                    {title: '岗位工种', key: 'postName', sortable: true, align: 'left', minWidth: 110},
                    {title: '所属部门', sortable: true, key: 'deptName', align: 'left', minWidth: 110},
                ],
                quitEmpTableData: [
                    {
                        code: 'BJ0001',
                        name: '李四',
                        mobile: '136000000001',
                        gender: '女',
                        postName: '厂长',
                        deptName: '总经理室',
                        leaderName: '杨朝凯'
                    }
                ],
                inServiceTableHeaders: [
                    {type: 'selection', width: 80, fixed: 'left', align: 'center'},
                    {title: '集团编号', key: 'code', sortable: true, align: 'left', fixed: 'left', minWidth: 130},
                    {title: '内部编号', sortable: true, key: 'internalCode', minWidth: 130, fixed: 'left', align: 'left'},
                    {title: '姓名', key: 'name', align: 'left', sortable: true, fixed: 'left', minWidth: 110,
                        render: (h, params) => {
                            return h('span', {
                                domProps: {
                                    innerHTML: params.row.name
                                },
                                style: {
                                    cursor: 'pointer',
                                    color: '#2D8CF0'
                                },
                                on: {
                                    click: () => {
                                        this.clickInSerName(params.row.id);
                                    }
                                }
                            });
                        }
                    },
                    {title: '性别', key: 'gender', align: 'left', sortable: true, minWidth: 80},
                    {title: 'loginToken', key: 'loginToken', align: 'left', sortable: true, minWidth: 100},
                    {title: '工作手机', key: 'mobile', align: 'left', sortable: true, minWidth: 114},
                    {title: '直接上级', key: 'leaderName', align: 'left', sortable: true, minWidth: 110},
                    {title: '岗位工种', key: 'postName', align: 'left', sortable: true, minWidth: 110},
                    {title: '所属部门', key: 'deptName', align: 'left', sortable: true, minWidth: 110},
                    {title: '是否在职', key: 'onJob', align: 'center', sortable: true, minWidth: 110},
                    {title: '是否操作用户', key: 'state', minWidth: 130, align: 'center', sortable: true},
                    {title: '分配', align: 'center', sortable: true, fixed: 'right', minWidth: 220,
                        render: (h, params) => {
                            const _this = this;
                            return h('Div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            _this.currentUserId = params.row.id;
                                            _this.defaultName = 'workshop';
                                            _this.getDataPermission();
                                        }
                                    }
                                }, '数据'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            _this.currentUserId = params.row.id;
                                            _this.roleUserAssembly = true;
                                            _this.getUserRoleList();
                                        }
                                    }
                                }, '权限'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: (e) => {
                                            _this.RoleBlock = true;
                                            _this.currentUserId = params.row.id;
                                            _this.getUserRoleList();
                                        }
                                    }
                                }, '角色'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                    },
                                    on: {
                                        click: (e) => {
                                            _this.currentUserId = params.row.id;
                                            _this.currentUserModule = [];
                                            _this.roleUserModule = true;
                                            _this.getUserRoleList();
                                        }
                                    }
                                }, '模块')
                            ]);
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 200,
                        fixed: 'right',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.onJobEditEvent(params.row.id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.setPasswordClick(params.row.id);
                                        }
                                    }
                                }, '设置密码'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.removeTableRow(params.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                deleteQuitEmpId: '',
                inSerTableData: [],
                allDepartmentData: [],
                treeNodeObj: [],
                inServiceTotalPage: null,
                quitTotalPage: 0,
                onJobPageIndex: 1,
                onJobValidatorMessage: '',
                token: '',
                userName: null,
                password: null,
                searchSwitch: false,
                familyArray: [],
                saveModalTitle: '',
                workState: null,
                classContain: [],
                editInWorkId: '',
                setPasswordId: '',
                passwordConfirmLoading: false,
                errorMsg: '',
                publicConfirmButtonLoading: false,
                roleUserModule: false,
                roleUserAssembly: false,
                tableRoleAssemblyLoading: false,
                roleAssemblyColumns: [
                    {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h('Table', {
                                props: {
                                    size: 'small',
                                    showHeader: false,
                                    columns: this.RoleModuleColumns,
                                    data: params.row.children
                                }
                            });
                        }
                    },
                    {title: '模块名称', _expanded: true, width: 200, key: 'moduleName'},
                    {title: '权限项', key: 'rightItem'}
                ],
                roleAssemblyData: [],
                RoleModuleColumns: [
                    {
                        title: '模块名称',
                        width: 200,
                        key: 'moduleName',
                        render: (h, params) => {
                            return h('Span', [
                                h('Span', {}, params.row.moduleName)
                            ]);
                        }
                    },
                    {
                        title: '权限项',
                        key: 'rightItem',
                        render: (h, params) => {
                            const _this = this;
                            return h('div', [
                                params.row.rightItems.map(item => {
                                    return h('Checkbox', {
                                        props: {
                                            label: item.rightName,
                                            value: item.checked,
                                            disabled: item.disabled
                                        },
                                        style: {
                                            margin: '5px'
                                        },
                                        on: {
                                            'on-change': (event) => {
                                                _this.basicAssemblyData.find(x => x.moduleId === params.row.moduleId).rightItems.find(y => y.rightCode === item.rightCode).checked = event;
                                            }
                                        }
                                    }, item.rightName + '(' + item.rightCode + ')');
                                })
                            ]);
                        }
                    }
                ],
                basicAssemblyData: [],
                curRoles: [],
                newModuleList: [],
                currentUserModule: [],
                RoleBlock: false,
                // 数据权限的设置
                deptDataList: [],
                defaultName: 'workshop',
                dataPromiseShow: false,
                dataPromiseLoading: false,
                dataPromiseUserName: '',
                workshopDataPromiseColumns: [
                    {title: '车间', key: 'deptName'},
                    {
                        title: '查看',
                        align: 'center',
                        key: 'isWatch',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                    value: params.row.isWatch === true ? true : (params.row.isDefault === true)
                                },
                                on: {
                                    'on-change': (val) => {
                                        this.workshopDataPromiseData[params.index].isWatch = val;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '默认',
                        key: 'isDefault',
                        align: 'center',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                    value: params.row.isDefault,
                                    disabled: params.row.isDefault
                                },
                                on: {
                                    'on-change': (val) => {
                                        this.workshopDataPromiseData.map(x => {
                                            x.isDefault = false;
                                            return x;
                                        });
                                        this.workshopDataPromiseData[params.index].isDefault = val;
                                    }
                                }
                            });
                        }
                    }
                ],
                workshopDataPromiseData: [],
                shiftGroupDataPromiseColumns: [
                    {title: '班组', key: 'deptName'},
                    {title: '所属车间', key: 'parentName'},
                    {
                        title: '查看',
                        align: 'center',
                        key: 'isWatch',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                    value: params.row.isWatch === true ? true : (params.row.isDefault === true)
                                },
                                on: {
                                    'on-change': (val) => {
                                        this.shiftGroupDataPromiseData[params.index].isWatch = val;
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '默认',
                        key: 'isDefault',
                        align: 'center',
                        render: (h, params) => {
                            const _this = this;
                            return h('Checkbox', {
                                props: {
                                    value: params.row.isDefault,
                                    disabled: params.row.isDefault
                                },
                                on: {
                                    'on-change': (val) => {
                                        _this.shiftGroupDataPromiseData.map(x => {
                                            x.isDefault = false;
                                            return x;
                                        });
                                        _this.shiftGroupDataPromiseData[params.index].isDefault = val;
                                    }
                                }
                            });
                        }
                    }
                ],
                shiftGroupDataPromiseData: []
            };
        },
        methods: {
            getGroupEvent (e) {
                console.log(e)
            },
            // 数据权限的设置----------开始
            // 获取数据权限
            getDataPermission () {
                const _this = this;
                this.workshopDataPromiseData.map(x => {
                    x.isWatch = false;
                    x.isDefault = false;
                    return x;
                });
                this.shiftGroupDataPromiseData.map(x => {
                    x.isWatch = false;
                    x.isDefault = false;
                    return x;
                });
                this.$post('user/data/list', {userId: this.currentUserId}).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        for (let i of content.res) {
                            if (_this.workshopDataPromiseData.map(x => x.deptId).includes(i.deptId)) {
                                _this.workshopDataPromiseData.find(x => x.deptId === i.deptId).isWatch = true;
                                _this.workshopDataPromiseData.find(x => x.deptId === i.deptId).isDefault = (i.isDefault === 1);
                            }
                            if (_this.shiftGroupDataPromiseData.map(x => x.deptId).includes(i.deptId)) {
                                _this.shiftGroupDataPromiseData.find(x => x.deptId === i.deptId).isWatch = true;
                                _this.shiftGroupDataPromiseData.find(x => x.deptId === i.deptId).isDefault = (i.isDefault === 1);
                            }
                        }
                        _this.dataPromiseShow = true;
                    }
                });
            },
            // 数据权限确定
            dataPromiseSubmit () {
                let params = [];
                let paramsWork = [];
                let paramsGroup = [];
                let dataParams = [];
                let saveParams = {};
                paramsWork = this.workshopDataPromiseData.filter(item => (item.isWatch === true || item.isDefault === true));
                paramsGroup = this.shiftGroupDataPromiseData.filter(item => (item.isWatch === true || item.isDefault === true));
                params = paramsWork.concat(paramsGroup);
                dataParams = params.map(x => {
                    return {
                        deptName: x.deptName,
                        deptId: x.deptId,
                        parentId: x.parentId,
                        dataType: x.dataType,
                        isDefault: x.isDefault === true ? 1 : 0
                    };
                });
                saveParams = {
                    userId: this.currentUserId,
                    userData: dataParams
                };
                this.$post('user/data/save', saveParams).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.dataPromiseShow = false;
                        this.defaultName = 'workshop';
                        noticeTips(this, 'saveTips');
                    }
                });
            },
            // 数据权限取消
            dataPromiseCancel () {
                this.defaultName = 'workshop';
                this.dataPromiseShow = false;
            },
            // 获取所有车间
            getWorkshopList () {
                const _this = this;
                this.$fetch('dept/workshops').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.workshopDataPromiseData = content.res.map(item => {
                            return {
                                deptId: item.id,
                                deptName: item.name,
                                dataType: 1,
                                parentId: 0,
                                isWatch: false,
                                isDefault: false
                            };
                        });
                    }
                });
            },
            // 获取所有班组
            getShiftGroupList () {
                const _this = this;
                this.$fetch('dept/groups').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.shiftGroupDataPromiseData = content.res.map(item => {
                            return {
                                deptId: item.id,
                                deptName: item.name,
                                dataType: 2,
                                parentId: item.parentId,
                                parentName: this.deptDataList.find(x => x.id === item.parentId).name,
                                isWatch: false,
                                isDefault: false
                            };
                        });
                    }
                });
            },
            // 数据权限设置---------------- 结束
            remoteLeaderMethod (query) {
                if (query) {
                    this.searchSwitch = true;
                    setTimeout(() => {
                        this.searchSwitch = false;
                        this.staffSuperList = this.remoteStaffSuperList.filter(item => item.id + ''.indexOf(query) > -1);
                    }, 200);
                } else {
                    this.staffSuperList = [];
                }
            },
            closeUserDetailModalEvent () {
                this.detailModalState = false;
            },
            detailModalStateChangeEvent (e) {
                this.detailModalState = e;
            },
            emailInputBlurEvent () {
                if (this.addEmpForCus.email === '') {
                    this.onJobValidatorMessage = '';
                }
            },
            // 离职的删除事件
            quitEmpDeleteEvent (id) {
                this.deleteQuitEmpId = id;
                this.quitTipsStatus = true;
                this.quitTipsMsg = '确认删除该员工？';
                this.isQuitDeleteSwitch = true;
            },
            // 恢复所选
            recoveryEvent () {
                if (this.checkQuit.length !== 0) {
                    this.quitTipsStatus = true;
                    this.quitTipsMsg = '确认恢复为\'在职员工\'？';
                    this.isQuitRecovery = true;
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 离职员工表格勾选事件
            checkQuitEvent (arr) {
                this.checkQuit = arr;
            },
            // 离职的提示modal按钮事件
            quitTipsCancel () {
                this.quitTipsStatus = false;
                this.quitTipsMsg = '';
                this.quitTipsLoading = false;
                this.isQuitDeleteSwitch = false;
                this.isQuitRecovery = false;
            },
            quitTipsConfirm () {
                this.quitTipsLoading = true;
                if (this.isQuitDeleteSwitch === true) { // 删除离职员工
                    this.$post(api.empDelete(this.deleteQuitEmpId)).then(res => {
                        if (res.data.status === 200) {
                            this.quitTipsStatus = false;
                            this.quitTipsMsg = '';
                            this.quitTipsLoading = false;
                            this.isQuitDeleteSwitch = false;
                            this.deleteQuitEmpId = '';
                            this.getQuitUserListHttp();
                        } else {
                            this.quitTipsLoading = false;
                        };
                    });
                };
                // 恢复离职员工
                if (this.isQuitRecovery === true) {
                    let requestNum = 0;
                    this.checkQuit.forEach((items) => {
                        this.$post(api.recoveryInser() + items.id).then(res => {
                            if (res.data.status === 200) {
                                requestNum++;
                                if (requestNum === this.checkQuit.length) {
                                    this.$Message.success('操作成功！');
                                    this.checkQuit = [];
                                };
                                this.getQuitUserListHttp();
                                this.quitTipsStatus = false;
                                this.quitTipsMsg = '';
                                this.quitTipsLoading = false;
                                this.isQuitRecovery = false;
                            } else {
                                this.quitTipsLoading = false;
                            };
                        });
                    });
                };
            },
            // 离职搜索框的回车事件
            quitSearchEnterStaff () {
                this.quitPageIndex = 1;
                this.quitTotalPage = 1;
                this.getQuitUserListHttp();
                this.quitEmpName = clearSpace(this.quitEmpName);
            },
            // 离职搜索框的点击事件
            quitSearchClickStaff () {
                this.quitPageIndex = 1;
                this.quitTotalPage = 1;
                this.getQuitUserListHttp();
                this.quitEmpName = clearSpace(this.quitEmpName);
            },
            // 获取离职的页码
            getQuitPageNumber (e) {
                this.quitPageIndex = e;
                this.getQuitUserListHttp();
            },
            // 获取离职每页展示的数量
            getQuitPageChange (e) {
                this.quitPageSize = e;
                this.getQuitUserListHttp();
            },
            // 点击离职部门的事件
            getClickQuitDept (arr) {
                this.quitEmpName = '';
                this.quitTotalPage = 1;
                this.quitPageIndex = 1;
                if (arr.length !== 0) {
                    this.selectQuitDeptId = arr[0].id;
                    // 调用获取离职员工的方法
                    this.getQuitUserListHttp();
                };
            },
            getQuitUserListHttp () {
                this.$call('user.list',
                    {
                        'onJob': false,
                        'deptId': this.selectQuitDeptId,
                        'pageSize': this.quitPageSize,
                        'pageIndex': this.quitPageIndex,
                        'name': clearSpace(this.quitEmpName),
                        isSupplement: false
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((items) => {
                            items.gender = parseInt(items.gender) === 1 ? items.gender = '男' : items.gender = '女';
                        });
                        this.quitEmpTableData = res.data.res;
                        this.quitTotalPage = res.data.count;
                    };
                });
            },
            getSetPasswordChange (e) {
                if (e === false) {
                    this.$refs['formValidate'].resetFields();
                    this.errorMsg = '';
                };
            },
            // 设置密码的确认按钮
            setPasswordConfirm () {
                this.setPasswordModal = true;
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.passwordConfirmLoading = true;
                        this.$post(api.userSetPassword() + this.setPasswordId, this.formValidate.againPasswordIpt).then((res) => {
                            if (res.data.status === 200) {
                                this.passwordConfirmLoading = false;
                                this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                                this.setPasswordId = '';
                                this.setPasswordModal = false;
                                noticeTips(this, 'saveTips');
                            } else {
                                this.passwordConfirmLoading = false;
                            };
                        });
                    } else {
                        this.errorMsg = '密码输入有误！';
                    };
                });
            },
            // 设置密码的取消按钮
            setPasswordCancel () {
                this.setPasswordModal = false;
            },
            setPasswordClick (id) {
                this.setPasswordId = id;
                this.setPasswordModal = true;
            },
            // 在职的名称点击事件
            clickInSerName (id) {
                this.getInWorkDetailHttp(id);
            },
            // 获取添加员工的直接上级
            getInWorkSelectSuper (e) {
                if (e) {
                    let superName = e.label.split('(');
                    this.addEmpForCus.leaderId = e.value;
                    this.addEmpForCus.leaderName = superName[0];
                } else {
                    this.addEmpForCus.leaderId = null;
                    this.addEmpForCus.leaderName = '';
                };
            },
            // 获取点击的页序列号
            getPageNumber (ev) {
                this.onJobPageIndex = ev;
                if (this.treeNodeObj.length !== 0) {
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                };
            },
            // 获取每页的条数
            pageChange (e) {
                if (this.treeNodeObj.length !== 0) {
                    this.pageSize = e;
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                };
            },
            // 在职的搜索框按下回车
            onJobSearchInputEnterEvent () {
                if (this.treeNodeObj.length !== 0) {
                    this.onJobPageIndex = 1;
                    this.inServiceTotalPage = 1;
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                };
            },
            // 在职搜索的点击事件
            onJobSearchButtonEvent () {
                if (this.treeNodeObj.length !== 0) {
                    this.onJobPageIndex = 1;
                    this.inServiceTotalPage = 1;
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                };
            },
            // 获取在职列表数据
            getOnjobUserListHttp (id) {
                this.searchData = clearSpace(this.searchData);
                this.loadingStatus = true;
                this.$call('user.list',
                    {
                        'deptId': id,
                        'pageSize': this.pageSize,
                        'pageIndex': this.onJobPageIndex,
                        'name': this.searchData,
                        'onJob': true,
                        isSupplement: false
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        res.data.res.forEach((item) => {
                            parseFloat(item.state) === 1 ? item.state = '是' : item.state = '否';
                            item.onJob === true ? item.onJob = '在职' : item.onJob = '离职';
                            item.gender = parseInt(item.gender) === 1 ? item.gender = '男' : item.gender = '女';
                        });
                        this.loadingStatus = false;
                        this.inServiceTotalPage = res.data.count;
                        this.inSerTableData = res.data.res;
                    };
                });
            },
            // 获取添加员工的生日
            getAddEmpBirth (e) {
                let birth = e + ' ' + '00:00:00';
                this.birthData = birth;
            },
            // 获取在职所属部门
            getSubDepartment (e, selectedData) {
                if (selectedData.length !== 0) {
                    this.onJobValidatorMessage = '';
                };
                this.addEmpForCus.empSubDep = e;
                this.adEdContainer = selectedData;
                this.addEmpForCus.deptId = selectedData[selectedData.length - 1].id;
                this.addEmpForCus.deptName = selectedData[selectedData.length - 1].name;
            },
            // 选择在职的岗位事件
            getInServicePostEvent (e) {
                if (e) {
                    this.addEmpForCus.postId = e.value;
                    this.addEmpForCus.postName = e.label;
                } else {
                    this.addEmpForCus.postId = null;
                    this.addEmpForCus.postName = '';
                };
            },
            // 操作用户转中文
            stateConverterCN (value) {
                parseInt(value) === 1 ? value = '是' : value = '否';
                return value;
            },
            // 在职详情的请求
            getInWorkDetailHttp (id) {
                this.$fetch(api.empDetail(id)).then((res) => {
                    if (res.data.status === 200) {
                        let detailObj = res.data.res;
                        detailObj.onJob = this.jobStateConverterCN(detailObj.onJob);
                        detailObj.gender = parseInt(detailObj.gender) === 1 ? detailObj.gender = '男' : detailObj.gender = '女';
                        detailObj.state = this.stateConverterCN(detailObj.state);
                        this.detailModalState = true;
                        this.detailResponseData = res.data.res;
                    };
                });
            },
            // 获取直接上级的请求方法
            getSuperior (query, type) {
                this.$fetch(api.empSearch(query)).then((res) => {
                    if (res.data.status === 200) {
                        if (type === 'addSearch') {
                            this.searchSwitch = false;
                            res.data.res.forEach((item) => {
                                this.staffSuperList.push({
                                    value: item.id,
                                    label: item.name + '(' + item.code + ')',
                                    id: item.id
                                });
                            });
                        };
                    }
                });
            },
            getFartherName (list, pId) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id === pId) {
                        this.familyArray.push(list[i].name);
                        this.getFartherName(list, list[i].parentId);
                    };
                };
            },
            // 拼所属部门的方法
            getSubDirMethods (param) {
                this.familyArray = [];
                this.getFartherName(this.allDepartmentData, param);
                this.familyArray.unshift(this.treeNodeObj[0].name);
                let arrayRev = this.familyArray.reverse();
                this.addEmpForCus.empSubDep = arrayRev;
            },
            // 在职的添加员工的方法
            inServiceAddStaffEvent () {
                this.editInWorkId = null;
                this.$refs.addEmpForCus.resetFields(); // 移除校验结果
                this.addEmpForCus.postId = null;
                this.showPostSelect = true;
                this.showOther = false;
                this.saveModalTitle = '新增员工';
                this.birthData = toDaySeconds();
                if (this.treeNodeObj[0].parentId !== 0) {
                    this.saveModalState = true;
                    let clkTreeNodeParenId = this.treeNodeObj[0].id;
                    this.getSubDirMethods(clkTreeNodeParenId);
                } else {
                    this.saveModalState = true;
                };
            },
            // 监听保存modal状态
            saveModalStateVisibleChangeEvent (e) {
                if (e === false) {
                    this.addEmpForCus.email = '';
                    this.showPostSelect = false;
                    this.onJobValidatorMessage = '';
                    this.addEmpForCus.remark = '';
                    this.addEmpForCus.leaderId = '';
                    this.addEmpForCus.employeeSortData = 1;
                    this.buttonLoading = false;
                    this.editInWorkId = '';
                    this.addEmpForCus.postId = null;
                    this.addEmpForCus.postName = '';
                    this.addEmpForCus.tel = '';
                    this.addEmpForCus.idCard = '';
                    this.$refs['addEmpForCus'].resetFields();
                };
            },
            jobStateConverterCN (value) {
                if (value === 1) {
                    value = '在职';
                } else if (value === 0) {
                    value = '离职';
                };
                return value;
            },
            // 保存的请求
            saveUserHttp () {
                let params = {
                    'id': this.editInWorkId,
                    'name': this.addEmpForCus.name,
                    'code': this.addEmpForCus.code,
                    'internalCode': this.addEmpForCus.internalCode,
                    'loginName': this.addEmpForCus.loginName,
                    'password': this.addEmpForCus.loginPassword,
                    'sortNum': this.addEmpForCus.employeeSortData,
                    'deptId': this.addEmpForCus.deptId,
                    'deptName': this.addEmpForCus.deptName,
                    'mobile': this.addEmpForCus.mobile,
                    'email': this.addEmpForCus.email,
                    'gender': this.addEmpForCus.gender,
                    'tel': this.addEmpForCus.tel,
                    'leaderId': this.addEmpForCus.leaderId,
                    'leaderName': this.addEmpForCus.leaderName,
                    'remark': this.addEmpForCus.remark,
                    'birthday': formatDate(this.birthData),
                    'postId': this.addEmpForCus.postId,
                    'postName': this.addEmpForCus.postName,
                    'idCard': this.addEmpForCus.idCard
                };
                this.$post(api.empSave(), params).then((res) => {
                    if (res.data.status === 200) {
                        this.showPostSelect = false;
                        this.buttonLoading = false;
                        this.saveModalState = false;
                        this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                        noticeTips(this, 'saveTips');
                    } else if (res.data.status === 415) {
                        this.saveModalState = false;
                        this.buttonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 保存modal的确定事件
            saveModalConfirmEvent () {
                this.$refs['addEmpForCus'].validate((valid) => {
                    if (valid) {
                        // 身份证和邮箱都没填
                        if (!this.addEmpForCus.email && !this.addEmpForCus.idCard) {
                            this.buttonLoading = true;
                            this.saveUserHttp();
                        } else {
                            // 身份证和邮箱都填
                            if (this.addEmpForCus.email && this.addEmpForCus.idCard) {
                                let validateFail = false;
                                if (/[\u4e00-\u9fa5]/g.test(this.addEmpForCus.idCard)) {
                                    this.$Message.warning('身份证号不能有中文!');
                                    validateFail = true;
                                };
                                if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.addEmpForCus.email)) {
                                    this.$Message.warning('邮箱格式不正确!');
                                    validateFail = true;
                                };
                                if (!validateFail) {
                                    // 格式都正确
                                    this.buttonLoading = true;
                                    this.saveUserHttp();
                                };
                            } else {
                                // 身份证填了
                                if (this.addEmpForCus.idCard) {
                                    // 没有中文
                                    if (!/[\u4e00-\u9fa5]/g.test(this.addEmpForCus.idCard)) {
                                        this.buttonLoading = true;
                                        this.saveUserHttp();
                                    } else {
                                        this.$Message.warning('身份证号不能为中文!');
                                    };
                                }
                                // 邮箱填了
                                if (this.addEmpForCus.email) {
                                    // 格式正确
                                    if (/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(this.addEmpForCus.email)) {
                                        this.buttonLoading = true;
                                        this.saveUserHttp();
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
                if (this.addEmpForCus.name === '') {
                    this.$Message.warning('姓名不能为空！');
                } else if (this.addEmpForCus.loginName === '') {
                    this.$Message.warning('登录名不能为空！');
                } else if (this.addEmpForCus.code === '' || /[\u4e00-\u9fa5]/g.test(this.addEmpForCus.code)) {
                    this.$Message.warning('集团编号不能为空或中文！');
                } else if (this.addEmpForCus.internalCode === '' || /[\u4e00-\u9fa5]/g.test(this.addEmpForCus.internalCode)) {
                    this.$Message.warning('内部编号不能为空或中文！');
                } else if (this.addEmpForCus.gender === null) {
                    this.$Message.warning('性别不能为空！');
                } else if (!/^1\d{10}$/.test(this.addEmpForCus.mobile)) {
                    this.$Message.warning('手机号格式不正确！');
                } else if (this.addEmpForCus.empSubDep.length === 0) {
                    this.$Message.warning('所属部门不能为空！');
                } else if (!this.addEmpForCus.postId) {
                    this.$Message.warning('岗位工种不能为空！');
                };
            },
            // 添加员工的modal取消按钮
            saveModalCancelEvent () {
                this.$refs['addEmpForCus'].resetFields();
                this.saveModalState = false;
                this.onJobValidatorMessage = '';
                this.showPostSelect = false;
            },
            // 获取勾选的对象（在职员工管理）
            inServiceSelectTableAll (e) {
                this.selectTableData = e;
            },
            // 离职处理
            quitHandleEvent () {
                if (this.selectTableData.length !== 0) {
                    let onJobRequestNum = 0;
                    this.selectTableData.forEach((items) => {
                        this.$post(api.userOnjob() + items.id).then(res => {
                            if (res.data.status === 200) {
                                onJobRequestNum++;
                                this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                                if (onJobRequestNum === this.selectTableData.length) {
                                    this.$Message.success('操作成功！');
                                    this.selectTableData = [];
                                };
                            };
                        });
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 设置为操作用户
            setUserVipEvent () {
                if (this.selectTableData.length !== 0) {
                    let setContain = [];
                    this.selectTableData.forEach((items) => { setContain.push(items.id); });
                    this.$post(api.userEnable(), setContain).then(res => {
                        if (res.data.status === 200) {
                            this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                            this.selectTableData = [];
                            this.$Message.success('操作成功！');
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 取消操作用户
            cancelUserVipEvent () {
                if (this.selectTableData.length !== 0) {
                    let setContain = [];
                    this.selectTableData.forEach((items) => { setContain.push(items.id); });
                    this.$post(api.userDisable(), setContain).then(res => {
                        if (res.data.status === 200) {
                            this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                            this.selectTableData = [];
                            this.$Message.success('操作成功！');
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 公共modal确认按钮事件
            publicConfirmEvent () {
                // 如果是设置为操作用户
                if (this.setUserOperation === true) {
                    this.$refs.inSevSelection.selectAll(false);
                    this.setUserOperation = false;
                };
                // 如果是取消操作用户
                if (this.cancelUserOperation === true) {
                    this.$refs.inSevSelection.selectAll(false);
                    this.cancelUserOperation = false;
                };
                // 在职员工管理的删除按钮
                if (this.inServiceDeleteBtn === true) {
                    this.publicConfirmButtonLoading = true;
                    this.$post(api.empDelete(this.deleteOnJobId)).then((res) => {
                        if (res.data.status === 200) {
                            this.publicConfirmButtonLoading = false;
                            this.publicModalState = false;
                            this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                            this.inServiceDeleteBtn = false;
                            noticeTips(this, 'deleteTips');
                        } else if (res.data.status === 415) {
                            this.publicModalState = false;
                            this.publicConfirmButtonLoading = false;
                            this.$Loading.finish();
                        } else {
                            this.publicConfirmButtonLoading = false;
                        };
                    });
                };
            },
            publicCancelEvent () {
                this.publicModalState = false;
                this.publicConfirmButtonLoading = false;
            },
            // 部门的选择事件
            deptTreeChangeEvent (e) {
                this.searchData = '';
                this.treeNodeObj = e;
                this.adEdContainer = e;
                this.onJobPageIndex = 1;
                this.inServiceTotalPage = 1;
                if (this.treeNodeObj.length !== 0) {
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                    this.addEmpForCus.deptId = e[0].id;
                    this.addEmpForCus.deptName = e[0].name;
                };
            },
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
                this.$refs.inSevSelection.selectAll(status);
            },
            // 在职的编辑按钮
            onJobEditEvent (id) {
                this.showPostSelect = true;
                this.editInWorkId = id;
                this.showOther = true;
                this.saveModalTitle = '编辑员工';
                this.$fetch(api.empDetail(this.editInWorkId)).then((res) => {
                    if (res.data.status === 200) {
                        this.saveModalState = true;
                        let detailResponseData = res.data.res;
                        this.adEdContainer = [{
                            id: detailResponseData.deptId,
                            name: detailResponseData.deptName
                        }];
                        this.addEmpForCus = detailResponseData;
                        this.addEmpForCus.passwordAgain = detailResponseData.password;
                        this.addEmpForCus.loginPassword = detailResponseData.password;
                        this.addEmpForCus.loginName = detailResponseData.loginName ? clearSpace(detailResponseData.loginName) : '';
                        this.addEmpForCus.code = detailResponseData.code ? clearSpace(detailResponseData.code) : '';
                        this.addEmpForCus.internalCode = detailResponseData.internalCode ? clearSpace(detailResponseData.internalCode) : '';
                        this.addEmpForCus.name = detailResponseData.name ? clearSpace(detailResponseData.name) : '';
                        this.addEmpForCus.mobile = parseFloat(clearSpace(detailResponseData.mobile));
                        this.getSubDirMethods(detailResponseData.deptId);// 调用拼所属部门的方法
                        this.birthData = detailResponseData.birthday;
                    };
                });
            },
            // 在职员工表格行的删除方法
            removeTableRow (id) {
                this.publicModalState = true;
                this.publicModalMsg = '确定删除？';
                this.deleteOnJobId = id;
                this.inServiceDeleteBtn = true;
            },
            // 拼树的方法
            getAllTreeNode (list, parentId) {
                this.items = [];
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;
                    if (this.items[key]) {
                        this.items[key].push(list[i]);
                    } else {
                        this.items[key] = [];
                        this.items[key].push(list[i]);
                    };
                };
                return this.formatTree(this.items, parentId);
            },
            // 归类tree子节点的方法
            formatTree (items, parentId) {
                let result = [];
                if (!items[parentId]) {
                    return result;
                };
                for (let t of items[parentId]) {
                    t.children = this.formatTree(items, t.id);
                    result.push(t);
                };
                return result;
            },
            // 渲染tree的方法
            getTreeNode () {
                this.getAllTreeNode(this.allDepartmentData, 0);
                for (var key in this.items) {
                    this.items[key].forEach((value, index) => {
                        value.title = value.name;
                        value.value = value.name;
                        value.label = value.name;
                    });
                };
                this.$set(this.items[0][0], 'expand', true);// 默认展开根节点
                this.deptTreeData = this.items[0];
                this.treeNodeObj = [];
                this.treeNodeObj.push(this.items[0][0]);
                this.adEdContainer = [];
                this.adEdContainer.push(this.items[0][0].children[0]);
                // 排除根
                this.addSubDeptData = [];
                this.items[0][0].children.forEach((obj) => {
                    this.addSubDeptData.push(obj);
                });
            },
            // 获取所有部门信息的方法
            getAllDepartmentData () {
                this.$fetch(api.getDept()).then((res) => {
                    if (res.data.status === 200) {
                        this.allDepartmentData = res.data.res;
                        this.getTreeNode();
                    };
                });
            },
            // 岗位的请求
            getPostHttp () {
                this.$api.post.getPostList({auditState: 3}).then((res) => {
                    if (res.data.status === 200) {
                        let arr = res.data.res;
                        this.postClassMethod(arr);// 根据typeName归类
                    };
                });
            },
            postClassMethod (arr) {
                let classTypeName = {};
                this.classContain = [];
                for (var i = 0; i < arr.length; i++) {
                    var ai = arr[i];
                    if (!classTypeName[ai.typeName]) {
                        this.classContain.push({
                            typeName: ai.typeName,
                            data: [ai]
                        });
                        classTypeName[ai.typeName] = ai;
                    } else {
                        for (var j = 0; j < this.classContain.length; j++) {
                            var classObj = this.classContain[j];
                            if (classObj.typeName === ai.typeName) {
                                classObj.data.push(ai);
                                break;
                            }
                        }
                    }
                };
            },
            getModuleCodeList () {
                const _this = this;
                this.$fetch('right/module/list').then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        let data = content.res;
                        for (let k of data) {
                            if (k.parentId === 1) {
                                k._expanded = true;
                            }
                            if (k.rightItems.length !== 0) {
                                for (let i of k.rightItems) {
                                    i.checked = false;
                                    i.disabled = false;
                                }
                            }
                        }
                        if (_this.curRoles.length !== 0) {
                            this.$post('right/role/list', _this.curRoles).then((res) => {
                                let content = res.data;
                                if (content.status === 200) {
                                    for (let m of data) {
                                        for (let k of content.res) {
                                            if (m.moduleId === k.moduleId) {
                                                for (var l = 0; l < m.rightItems.length; l++) {
                                                    if (m.rightItems[l].rightCode === k.rightCode) {
                                                        m.rightItems[l].checked = true;
                                                        m.rightItems[l].disabled = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    this.$fetch('right/user/list/' + _this.currentUserId).then((res) => {
                                        let con = res.data;
                                        if (con.status === 200) {
                                            for (let m of data) {
                                                for (let k of con.res) {
                                                    if (m.moduleId === k.moduleId) {
                                                        for (var l = 0; l < m.rightItems.length; l++) {
                                                            if (m.rightItems[l].rightCode === k.rightCode) {
                                                                m.rightItems[l].checked = true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            _this.basicAssemblyData = data;
                                            _this.getAssemblyTrees(data, 1);
                                            _this.powerModule = true;
                                        }
                                    });
                                }
                            });
                        } else {
                            this.$fetch('right/user/list/' + _this.currentUserId).then((res) => {
                                let con = res.data;
                                if (con.status === 200) {
                                    for (let m of data) {
                                        for (let k of con.res) {
                                            if (m.moduleId === k.moduleId) {
                                                for (var l = 0; l < m.rightItems.length; l++) {
                                                    if (m.rightItems[l].rightCode === k.rightCode) {
                                                        m.rightItems[l].checked = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    _this.basicAssemblyData = data;
                                    _this.getAssemblyTrees(data, 1);
                                    _this.powerModule = true;
                                }
                            });
                        }
                    }
                });
            },
            getAssemblyTrees (list, parentId) {
                let items = {};
                // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;
                    if (items[key]) {
                        items[key].push(list[i]);
                    } else {
                        items[key] = [];
                        items[key].push(list[i]);
                    }
                }
                return this.formatAssemblyTree(items, parentId);
            },
            // 利用递归格式化每个节点/**/
            formatAssemblyTree (items, parentId) {
                const _this = this;
                let result = [];
                if (!items[parentId]) {
                    return result;
                }
                for (let t of items[parentId]) {
                    t.children = _this.formatAssemblyTree(items, t.moduleId);
                    result.push(t);
                }
                return this.roleAssemblyData = result;
            },
            getModuleCode () {
                const _this = this;
                this.$fetch('right/user/list/' + _this.currentUserId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        // var assembSelectData = content.res;
                        for (let m of _this.powerBasicData) {
                            for (let k of content.res) {
                                if (m.moduleId === k.moduleId) {
                                    for (var l = 0; l < m.rightItems.length; l++) {
                                        if (m.rightItems[l].rightCode === k.rightCode) {
                                            m.rightItems[l].checked = true;
                                        }
                                    }
                                }
                            }
                        }
                        _this.powerData = _this.powerBasicData;
                    }
                });
            },
            // 角色管理
            getAllRole () {
                this.$fetch('role/list').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.roleData = (content.res || []).map(item => {
                            return {
                                id: item.id,
                                roleCode: item.code,
                                roleName: item.name,
                                _checked: false
                            };
                        });
                    }
                });
            },
            // 选择角色
            SelectionRoleData (val) {
                this.currentUserRole = val.map(item => item.id);
            },
            cancelUserRole () {
                this.roleLoading = false;
                this.modalRole = false;
            },
            // 保存角色
            confirmUserRole () {
                this.roleLoading = true;
                this.$post('user/role/save?userid=' + this.currentUserId, this.currentUserRole).then((res) => {
                    let content = res.data;
                    this.roleLoading = false;
                    if (content.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.modalRole = false;
                    }
                });
            },
            // 选择模块
            selectionModuleData (val) {
                // this.currentUserModule = val.map(x => x.id);
                let Data = val.map(x => x.id);
                let pId = this.moduleData.find(x => x.parentId === 0).id;
                this.currentUserModule = [];
                for (let i of Data) {
                    if (this.moduleData.find(x => x.id === i).parentId !== 0 && this.moduleData.find(x => x.id === i).parentId !== pId && !this.moduleData.includes(i)) {
                        this.currentUserModule.push(i);
                    }
                }
            },
            // 保存用户对应的模块
            cancelUserModule () {
                this.modalModule = false;
                this.moduleLoading = false;
            },
            // 记载选中父元素的id
            confirmUserModule () {
                this.saveUserModule();
            },
            // 保存模块
            saveUserModule () {
                this.moduleLoading = true;
                this.$post('user/module/save?userid=' + this.currentUserId, this.currentUserModule).then((res) => {
                    let content = res.data;
                    this.moduleLoading = false;
                    if (content.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.modalModule = false;
                    }
                });
            },
            // 获取用户对应的模块列表
            getUserModuleList () {
                const _this = this;
                this.$fetch('module/list').then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        let data = content.res;
                        for (var d of data) {
                            d.title = d.name;
                            d.checked = false;
                            d.disabled = false;
                        }
                        data.map(item => {
                            if (data.map(x => x.parentId).includes(item.id)) {
                                item.disabled = true;
                            }
                            return item;
                        });
                        _this.moduleData = [];
                        _this.moduleData = data;
                        if (_this.curRoles.length !== 0) {
                            this.$post('role/module/list', _this.curRoles).then((res) => {
                                let con = res.data;
                                if (con.status === 200) {
                                    for (let z of con.res) {
                                        data.find(x => x.id === z).checked = true;
                                        data.find(x => x.id === z).disabled = true;
                                    }
                                    this.$fetch('user/module/list?userid=' + _this.currentUserId).then((res) => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            for (let z of content.res) {
                                                if (data.map(x => x.id).includes(z)) {
                                                    data.find(x => x.id === z).checked = true;
                                                }
                                            }
                                            _this.newModuleList = [];
                                            _this.getModuleTrees(data, 0);
                                            _this.modalModule = true;
                                        }
                                    });
                                }
                            });
                        } else {
                            this.$fetch('user/module/list?userid=' + _this.currentUserId).then((res) => {
                                let content = res.data;
                                if (content.status === 200) {
                                    // debugger
                                    for (let z of content.res) {
                                        if (data.map(x => x.id).includes(z)) {
                                            data.find(x => x.id === z).checked = true;
                                        }
                                    }
                                    _this.newModuleList = [];
                                    _this.getModuleTrees(data, 0);
                                    _this.modalModule = true;
                                }
                            });
                        }
                    }
                });
            },
            getModuleTrees (list, parentId) {
                let items = {};
                // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;
                    if (items[key]) {
                        items[key].push(list[i]);
                    } else {
                        items[key] = [];
                        items[key].push(list[i]);
                    }
                }
                return this.formatModuleTree(items, parentId);
            },
            // 利用递归格式化每个节点/**/
            formatModuleTree (items, parentId) {
                const _this = this;
                let result = [];
                if (!items[parentId]) {
                    return result;
                }
                for (let t of items[parentId]) {
                    t.children = _this.formatModuleTree(items, t.id);
                    result.push(t);
                }
                return this.newModuleList = result;
            },
            // 获取对应的角色列表
            getUserRoleList () {
                const _this = this;
                this.$fetch('user/role/list?userid=' + this.currentUserId).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.roleData.map(item => {
                            item._checked = false;
                            return item;
                        });
                        for (let z of content.res) {
                            _this.roleData.find(x => x.id === z)._checked = true;
                        }
                        _this.currentUserRole = content.res;
                        _this.curRoles = content.res;
                        if (_this.RoleBlock) {
                            _this.RoleBlock = false;
                            _this.modalRole = true;
                        }
                        if (_this.roleUserAssembly) {
                            _this.roleUserAssembly = false;
                            _this.getModuleCodeList();
                        }
                        if (_this.roleUserModule) {
                            _this.roleUserModule = false;
                            _this.getUserModuleList();
                        }
                    }
                });
            },
            cancelUserAssembly () {
                this.powerModule = false;
                this.powerLoading = false;
            },
            confirmUserAssembly () {
                var params = [];
                for (let d of this.roleAssemblyData) {
                    for (let f of d.children) {
                        for (let r of f.rightItems) {
                            if (r.checked === true) {
                                params.push(
                                    {
                                        moduleId: r.moduleId,
                                        moduleCode: r.moduleCode,
                                        rightCode: r.rightCode,
                                        ownerId: this.currentUserId
                                    }
                                );
                            }
                        }
                    }
                }
                this.powerLoading = true;
                this.$post('right/user/save?userid=' + this.currentUserId, params).then((res) => {
                    let content = res.data;
                    this.powerLoading = false;
                    if (content.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.powerModule = false;
                    }
                });
            },
            // 拼树的方法
            getAllQuitTreeNode (list, parentId) {
                this.quitItems = [];
                for (let i = 0; i < list.length; i++) {
                    let key = list[i].parentId;
                    if (this.quitItems[key]) {
                        this.quitItems[key].push(list[i]);
                    } else {
                        this.quitItems[key] = [];
                        this.quitItems[key].push(list[i]);
                    };
                };
                return this.formatQuitTree(this.quitItems, parentId);
            },
            // 归类tree子节点的方法
            formatQuitTree (items, parentId) {
                let result = [];
                if (!items[parentId]) {
                    return result;
                }
                for (let t of items[parentId]) {
                    t.children = this.formatTree(items, t.id);
                    result.push(t);
                }
                return result;
            },
            getDeptList () {
                this.$api.dept.getDeptList({state: 1}).then((res) => {
                    if (res.data.status === 200) {
                        this.deptDataList = res.data.res;
                        this.allDepartmentData = res.data.res;
                        this.getTreeNode();
                        this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                        this.getAllQuitTreeNode(res.data.res, 0);
                        for (var key in this.quitItems) { // 给每一个节点都添加title
                            this.quitItems[key].forEach((value) => {
                                value.title = value.name;
                                value.value = value.name;
                                value.label = value.name;
                            });
                        };
                        this.$set(this.quitItems[0][0], 'expand', true);// 默认展开根节点
                        this.quitTreeData = this.quitItems[0];
                        // 获取所有车间
                        this.getWorkshopList();
                        // 获取所有班组
                        this.getShiftGroupList();
                    };
                });
            },
            // 获取所有人员列表
            getAllUserHttp () {
                this.$call('user.list', {
                    name: '',
                    isSupplement: false
                }).then((res) => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            item.value = item.id;
                            item.label = item.name + '(' + item.code + ')';
                        });
                        this.remoteStaffSuperList = res.data.res;
                    }
                });
            },
            clickTabsEvent (name) {
                this.quitEmpName = '';
                this.searchData = '';
                if (name === 'onJob') {
                    this.onJobPageIndex = 1;
                    this.getOnjobUserListHttp(this.treeNodeObj[0].id);
                    // 设置在职表格的高度
                    let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                    let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                    this.pageHeights = pageHeightDom.offsetHeight + 82;
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 230 + this.pageHeights);
                } else {
                    this.quitPageIndex = 1;
                    this.quitTotalPage = 1;
                    this.getQuitUserListHttp();
                    // 设置离职表格的高度
                    let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                    let quitPageHeightDom = document.getElementsByClassName('quitPageHeight')[0];
                    this.quitPageHeights = quitPageHeightDom.offsetHeight + 40;
                    this.quitTableHeight = compClientHeight(tableDom.offsetTop + 240 + this.quitPageHeights);
                };
            }
        },
        mounted () {
            this.getAllRole();
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            let quitPageHeightDom = document.getElementsByClassName('quitPageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            this.tableHeight = compClientHeight(tableDom.offsetTop + 204 + this.pageHeights);
            this.quitPageHeights = quitPageHeightDom.offsetHeight + 10;
            this.quitTableHeight = compClientHeight(tableDom.offsetTop + 230 + this.quitPageHeights);
            window.onresize = () => {
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                this.tableHeight = compClientHeight(tableDom.offsetTop + 240 + this.pageHeights);
                this.quitPageHeights = quitPageHeightDom.offsetHeight + 40;
                this.quitTableHeight = compClientHeight(tableDom.offsetTop + 240 + this.quitPageHeights);
            };
        },
        created () {
            this.globalLoadingShow = true;
            this.getAllUserHttp();
            // 获取离职员工
            this.getQuitUserListHttp();
            // 调用获取岗位的请求
            this.getPostHttp();
            // 获取部门信息的请求
            this.getDeptList();
        }
    };
</script>
<style scoped>
    .tablePaddingLeft{
        padding-left: 16px;
    }
    .editFormErrorStyle{
        color:#ff0000;
    }
    .modalFooterStyle{
        display:flex;
        justify-content: space-between;
    }
    .contentPadding{
        padding: 0 0 1px 16px;
    }
    .modal-footer-bar{
        display: flex;
        justify-content: flex-end;
    }
</style>

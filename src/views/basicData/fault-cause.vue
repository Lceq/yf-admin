<template>
    <card>
        <Row>
            <Col span="12" class="headerMargin">
                <Button icon="md-add" type="primary" @click="addFault">新增</Button>
                <Button icon="ios-trash" type="error" @click="deleteFault">删除</Button>
            </Col>
            <Col span="12">
                <div class="searchFault">
                    <Select clearable v-model="faultTypeValue" style="width:200px" placeholder="请选择故障类型" @on-change="getQueryBarFaultTypeEvent">
                        <Option v-for="item in faultTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Input v-model="searchData" placeholder="请输入故障原因名称" class="searchStyle" @on-enter="searchClick"/>
                    <Button icon="ios-search" class="searchMargin" type="primary" @click="searchClick">搜索</Button>
                </div>
            </Col>
        </Row>
        <Row class="margin-top-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData" @on-selection-change="getCheckObj"></Table>
            </Col>
        </Row>
        <Row>
            <Col>
            <Modal
                    v-model="adEdFaultStatus"
                    :title="faultTitle"
                    @on-visible-change="adEdFaultStatusChange"
                    :maskClosable="false"
            >
                <Form :label-width="110" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="22">
                        <FormItem label="故障原因编码：" prop="faultCodeIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.faultCodeIpt" placeholder="请输入故障原因编码"/>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="22">
                        <FormItem label="故障原因名称：" prop="faultNameIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.faultNameIpt" placeholder="请输入故障原因名称"/>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="22">
                        <FormItem label="故障类型：" class="formItemMargin" prop="faultType">
                            <Select v-model="formValidate.faultType" placeholder="请选择故障类型" @on-change="getFaultTypeIpt" label-in-value>
                                <Option v-for="item in adEdFaultTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                        </Col>
                    </Row>
                    <div v-show="showOther">
                        <other-message
                                :createName="createMan"
                                :createTime="createTime"
                                :updateName="updateMan"
                                :updateTime="updateTime"
                        ></other-message>
                    </div>
                </Form>
                <div slot="footer" class="modalFooterStyle">
                    <span class="editFormErrorStyle">{{faultErrorMsg}}</span>
                    <div>
                        <Button :loading="modalButtonLoading" type="success" @click="AdEdConfirm">确认</Button>
                        <Button class="cancelButton" @click="AdEdCancel">取消</Button>
                    </div>
                </div>
            </Modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <delete-modal
                        :v-model="promptStatus"
                        :tipMsg="deletePromptMsg"
                        :loading="modalButtonLoading"
                        @cancel="promptCancel"
                        @confirm="promptConfirm"
                >
                </delete-modal>
            </Col>
        </Row>
    </card>
</template>
<script>
    import api from '../../ajax/api';
    import deleteModal from '../public/deleteWarning';
    import {clearSpace, noticeTips, compClientHeight} from '../../libs/common';
    import otherMessage from '../components/otherMessage';
    export default {
        components: {
            otherMessage,
            deleteModal
        },
        data () {
            const validateCode = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error());
                } else {
                    if (!/[\u4e00-\u9fa5]+/.test(value)) {
                        this.faultErrorMsg = '';
                        callback();
                    } else {
                        // this.faultErrorMsg = '编码格式不能为中文！';
                        callback(new Error());
                    };
                }
            };
            const validateFaultType = (rule, value, callback) => {
                console.log(value);
                if (value) {
                    this.faultErrorMsg = '';
                    callback();
                } else {
                    callback(new Error());
                }
            };
            return {
                tableHeight: document.documentElement.clientHeight - 210,
                createMan: '',
                createTime: '',
                updateMan: '',
                updateTime: '',
                selectQueryBarFaultType: '',
                modalButtonLoading: false,
                faultClassifyId: '',
                showOther: false,
                formValidate: {
                    faultCodeIpt: '',
                    faultNameIpt: '',
                    faultType: null
                },
                ruleValidate: {
                    faultCodeIpt: { required: true, validator: validateCode, trigger: 'change' },
                    faultNameIpt: { required: true, trigger: 'change' },
                    faultType: { required: true, validator: validateFaultType, trigger: 'change' }
                },
                promptStatus: false,
                deletePromptMsg: '',
                faultErrorMsg: '',
                adEdFaultTypeList: [
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    }
                ],
                adEdFaultStatus: false,
                faultTitle: '',
                faultTypeValue: '',
                faultTypeList: [
                    {
                        value: 'New',
                        label: 'New'
                    }
                ],
                searchData: '',
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '故障原因编码',
                        key: 'code',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '故障原因名称',
                        key: 'name',
                        align: 'left',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '故障类型',
                        key: 'faultTypeName',
                        align: 'left',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 80,
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
                                            this.editMaintain(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                tableData: [],
                checkArray: [],
                selectModalFaultType: {
                    label: '',
                    value: ''
                }
            };
        },
        methods: {
            // 监听新增和编辑栏的状态
            adEdFaultStatusChange (e) {
                if (e === false) {
                    this.$refs['formValidate'].resetFields();
                    this.faultTitle = '';
                    this.modalButtonLoading = false;
                    this.faultClassifyId = '';
                }
            },
            // 编辑的方法
            editMaintain (id) {
                this.$fetch(api.getFaultClassify() + id).then(res => {
                    if (res.data.status === 200) {
                        this.showOther = true;
                        this.faultTitle = '编辑故障原因';
                        this.adEdFaultStatus = true;
                        this.formValidate.faultNameIpt = res.data.res.name;
                        this.formValidate.faultType = res.data.res.faultTypeId;
                        this.formValidate.faultCodeIpt = res.data.res.code;
                        this.selectModalFaultType.label = res.data.res.faultTypeName;
                        this.selectModalFaultType.value = res.data.res.faultTypeId;
                        this.createMan = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.updateMan = res.data.res.updateName;
                        this.updateTime = res.data.res.updateTime;
                        this.faultClassifyId = res.data.res.id;
                    };
                });
            },
            // 获取查询栏的故障类型
            getQueryBarFaultTypeEvent (e) {
                if (e !== null && e !== undefined) {
                    this.selectQueryBarFaultType = e;
                } else {
                    this.selectQueryBarFaultType = '';
                };
            },
            // 搜索的方法
            searchClick () {
                this.searchData = clearSpace(this.searchData);
                this.$call('fault.type.list', {
                    faultTypeId: this.selectQueryBarFaultType,
                    name: this.searchData
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                    };
                });
            },
            // 删除提示框的确认按钮
            promptConfirm () {
                this.deleteHttp();
            },
            deleteHttp () {
                let arrIds = [];
                this.checkArray.forEach((items) => {
                    arrIds.push(items.id);
                });
                this.modalButtonLoading = true;
                this.$post(api.faultClassifyDelete(), arrIds).then(res => {
                    if (res.data.status === 200) {
                        this.promptStatus = false;
                        this.deletePromptMsg = '';
                        this.modalButtonLoading = false;
                        this.getFaultTypeListHttp();
                    } else {
                        this.modalButtonLoading = false;
                    };
                });
            },
            promptCancel () {
                this.promptStatus = false;
                this.deletePromptMsg = '';
                this.modalButtonLoading = false;
            },
            saveFaultClassifyHttp () {
                this.$post('/fault/type/save',
                    {
                        'id': this.faultClassifyId,
                        'name': this.formValidate.faultNameIpt,
                        'code': this.formValidate.faultCodeIpt,
                        'faultTypeName': this.selectModalFaultType.label,
                        'faultTypeId': this.selectModalFaultType.value
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.getFaultTypeListHttp();
                        this.adEdFaultStatus = false;
                        this.modalButtonLoading = false;
                        this.faultClassifyId = '';
                    } else {
                        this.modalButtonLoading = false;
                    };
                });
            },
            // 新增的确认按钮
            AdEdConfirm () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.modalButtonLoading = true;
                        this.saveFaultClassifyHttp();
                    } else {
                        if (this.formValidate.faultCodeIpt === '' || !/^[0-9a-zA-Z]+$/.test(this.formValidate.faultCodeIpt)) {
                            this.$Message.warning('编号不能为中文！');
                        } else {
                            noticeTips(this, 'completeTipsTips');
                        };
                    }
                });
            },
            // 新增的取消按钮
            AdEdCancel () {
                this.adEdFaultStatus = false;
                this.$refs['formValidate'].resetFields();
            },
            // 获取新增和编辑栏内的故障类型
            getFaultTypeIpt (e) {
                if (e !== null && e !== undefined) {
                    this.selectModalFaultType = e;
                };
            },
            // 新增的方法
            addFault () {
                this.showOther = false;
                this.faultTitle = '新增故障原因';
                this.adEdFaultStatus = true;
                this.faultClassifyId = '';
            },
            // 获取勾选的对象(返回数组)
            getCheckObj (e) {
                this.checkArray = e;
            },
            // 删除的方法
            deleteFault () {
                if (this.checkArray.length !== 0) {
                    this.promptStatus = true;
                    this.deletePromptMsg = '确认删除？';
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            remove (index) {
                this.tableData.splice(index, 1);
            },
            getFaultTypeListHttp () {
                this.$fetch(api.getFaultTypeList()).then(res => {
                    if (res.data.status === 200) {
                        this.$store.dispatch({type: 'hideLoading'});
                        this.tableData = res.data.res;
                    };
                });
            },
            getFaultCauseListHttp () {
                this.$fetch(api.getFaultType(), {'parentcode': 'fault_type'}).then(res => {
                    if (res.data.status === 200) {
                        res.data.res.forEach((item) => {
                            item.value = item.id;
                            item.label = item.name;
                        });
                        this.adEdFaultTypeList = res.data.res;
                        this.faultTypeList = res.data.res;
                    };
                });
            }
        },
        created () {
            this.$store.dispatch({type: 'showLoading'});
            // 获取故障原因的列表数据
            this.getFaultTypeListHttp();
            // 获取故障类型的数据
            this.getFaultCauseListHttp();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            window.onresize = () => {
                this.tableHeight = compClientHeight(tableDom.offsetTop + 160);
            };
        }

    };
</script>
<style scoped>
    .searchStyle{
        width: 200px;
        margin-left: 10px;
    }
    .searchFault{
        display: flex;
        justify-content: flex-end;
    }
</style>

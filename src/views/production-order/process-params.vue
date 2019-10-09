<template>
    <Card>
        <Row type="flex" justify="space-between">
            <Col>
                <Button type="success" @click="addModel">新增</Button>
                <Button type="error" @click="deleteClick">删除</Button>
            </Col>
            <Col>
                <Row type="flex" justify="space-between">
                    <Col class="queryBarMarginRight">
                        <Select clearable v-model="screenProcessValue" class="searchHurdles" placeholder="请选择所属工序" @on-change="getScreenProcess">
                            <Option v-for="(item,index) in searchProcessList" :style="item.style" :value="item.id+''" :key="index">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Input v-model="searchData" placeholder="请输入参数名称" class="searchHurdles" @on-enter="searchEnter"/>
                        <Button icon="ios-search" type="primary" @click="searchClick">搜索</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="tableMargin tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" :loading="tableLoading" @on-selection-change="getCheckTableRow" border ref="selection" :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page placement="top" :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPage" :show-sizer="true" @on-page-size-change="pageChange"></Page>
            </Col>
        </Row>
        <Row>
            <Col>
            <Modal
                    v-model="adEdParamsStatus"
                    :title="modalTitle"
                    @on-visible-change="adEdModelStatusChange"
                    :maskClosable="false"
            >
                <Form :label-width="130" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="18">
                        <FormItem label="参数编码：" prop="ParamsCodeIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.ParamsCodeIpt" placeholder="请输入参数编码"/>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                        <FormItem label="参数名称：" prop="ParamsNameIpt" class="formItemMargin">
                            <Input type="text" v-model="formValidate.ParamsNameIpt" placeholder="请输入参数名称"/>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                            <FormItem label="所属工序：" class="formItemMargin" prop="processIpt">
                                <Select label-in-value v-model="formValidate.processIpt" @on-change="getProcess">
                                    <Option v-for="(item,index) in processList" :style="item.style" :value="item.id+''" :key="index">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16">
                        <FormItem label="运转参数：" class="formItemMargin">
                            <RadioGroup v-model="workParams">
                                <Radio label="true">是</Radio>
                                <Radio label="false">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16">
                        <FormItem label="业务参数：" class="formItemMargin">
                            <RadioGroup v-model="businessParams">
                                <Radio label="true">是</Radio>
                                <Radio label="false">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16">
                        <FormItem label="数据类型：" class="formItemMargin">
                            <RadioGroup v-model="dataTypes">
                                <Radio label="true">数值型</Radio>
                                <Radio label="false">字符型</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16">
                        <FormItem label="允许为空：" class="formItemMargin">
                            <RadioGroup v-model="ifEmpty">
                                <Radio label="true">是</Radio>
                                <Radio label="false">否</Radio>
                            </RadioGroup>
                        </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="16">
                        <FormItem label="排序：" class="formItemMargin">
                            <InputNumber :max="9999" :min="1" v-model="sort"></InputNumber>
                        </FormItem>
                        </Col>
                    </Row>
                    <div v-show="showOther">
                        <other-message
                                :createName="createName"
                                :createTime="createTime"
                                :updateName="updateName"
                                :updateTime="updateTime"
                        ></other-message>
                    </div>
                </Form>
                <div slot="footer" class="modalFooterStyle">
                    <span class="editFormErrorStyle">{{errorMsg}}</span>
                    <div>
                        <Button :loading="buttonLoading" type="success" @click="handleSubmit('formValidate')">确认</Button>
                        <Button class="cancelButton" @click="AdEdCancel">取消</Button>
                    </div>
                </div>
            </Modal>
            </Col>
        </Row>
        <Row>
            <Col>
            <tips-modal
                    :v-model="promptData"
                    :tipMsg="promptMsg"
                    :loading="deleteButtonLoading"
                    @cancel="promptCancel"
                    @confirm="publicConfirm"
            >
            </tips-modal>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import tipsModal from '../public/deleteWarning';
    import publicJs from '../public/public-js/publiceJs';
    import api from '../../ajax/api';
    import otherMessage from '../components/otherMessage';
    export default {
        components: {
            tipsModal, otherMessage
        },
        data () {
            const validateProcess = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error());
                } else {
                    this.errorMsg = '';
                    callback();
                }
            };
            return {
                pageHeights: null,
                searchProcessList: [],
                promptData: false,
                promptMsg: '',
                deleteButtonLoading: false,
                tableHeight: document.documentElement.clientHeight - 250,
                top: publicJs.pageUp,
                formValidate: {
                    ParamsCodeIpt: '',
                    ParamsNameIpt: '',
                    processIpt: ''
                },
                ruleValidate: {
                    ParamsCodeIpt: [
                        { required: 'true', trigger: 'blur' }
                    ],
                    ParamsNameIpt: [
                        { required: 'true', trigger: 'blur' }
                    ],
                    processIpt: [
                        { required: 'true', validator: validateProcess, trigger: 'change' }
                    ]
                },
                pageTotal: 1,
                pageOpts: publicJs.pageOpts,
                pageSize: publicJs.pageSize,
                pageIndex: 1,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed: 'left',
                        minWidth: 68
                    },
                    {
                        title: '编号',
                        key: 'code',
                        sortable: true,
                        fixed: 'left',
                        minWidth: 80
                    },
                    {
                        title: '名称',
                        key: 'name',
                        align: 'center',
                        sortable: true,
                        fixed: 'left',
                        minWidth: 80
                    },
                    {
                        title: '所属工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 130,
                        sortable: true
                    },
                    {
                        title: '是否业务参数',
                        key: 'isBusi',
                        align: 'center',
                        minWidth: 130,
                        sortable: true
                    },
                    {
                        title: '是否数值类型',
                        key: 'isNumeric',
                        align: 'center',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '排序',
                        key: 'sortNum',
                        align: 'center',
                        sortable: true,
                        minWidth: 80
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        align: 'center',
                        width: 80,
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
                                            this.editProcessParams(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                tableLoading: false,
                errorMsg: '',
                adEdParamsStatus: false,
                tableData: [],
                screenProcessValue: '',
                searchData: '',
                modalTitle: '',
                processList: [],
                workParams: 'true',
                businessParams: 'false',
                dataTypes: 'false',
                ifEmpty: 'false',
                sort: 0,
                buttonLoading: false,
                selectAddProcess: null,
                addSwitch: false,
                editSwitch: false,
                checkArray: [],
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                editParamsId: '',
                showOther: false
            };
        },
        methods: {
            // 删除的方法
            promptCancel () {
                this.promptData = false;
                this.deleteButtonLoading = false;
            },
            publicConfirm () {
                this.deleteButtonLoading = true;
                let ids = [];
                this.checkArray.forEach((items) => {
                    ids.push(items.id);
                });
                // 发送删除的请求
                this.$post(
                    api.specParamDelete(),
                    ids
                ).then(res => {
                    if (res.data.status === 200) {
                        this.deleteButtonLoading = false;
                        this.promptData = false;
                        // 发送查询的请求
                        this.searchHttp();
                        this.$Message.success('操作成功！');
                    } else if (res.data.status === 415) {
                        this.promptData = false;
                        this.deleteButtonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 删除的事件
            deleteClick (e) {
                if (this.checkArray.length !== 0) {
                    this.promptMsg = '确认删除？';
                    this.promptData = true;
                } else {
                    this.$Modal.warning({
                        title: '提示：',
                        content: '请选择操作对象！'
                    });
                };
            },
            // 获取每页条数
            pageChange (e) {
                this.pageSize = e;
                this.tableLoading = true;
                // 发送查询的请求
                this.searchHttp();
            },
            // 获取页码
            getPage (e) {
                this.pageIndex = e;
                this.tableLoading = true;
                // 发送查询的请求
                this.$fetch(
                    api.specParamList(),
                    {
                        'processid': this.selectProcessId,
                        'name': this.searchData,
                        'pageindex': this.pageIndex,
                        'pagesize': this.pageSize
                    }
                ).then(res => {
                    if (res.data.status === 200) {
                        this.tableLoading = false;
                        // 转中文处理
                        this.paramsAndTypeConverterCN(res.data.res);
                        // 赋值表格
                        this.tableData = res.data.res;
                    };
                });
            },
            // 获取勾选的对象（返回数组）
            getCheckTableRow (e) {
                this.checkArray = e;
            },
            // 获取所属工序
            getProcess (e) {
                this.selectAddProcess = e;
            },
            // 监听新增和编辑的modal
            adEdModelStatusChange (e) {
                if (e === false) {
                    this.addSwitch = false;
                    this.editSwitch = false;
                    this.handleReset('formValidate');
                    this.errorMsg = '';
                    this.createName = '';
                    this.createTime = '';
                    this.updateName = '';
                    this.updateTime = '';
                    this.workParams = 'true';
                    this.businessParams = 'false';
                    this.dataTypes = 'false';
                    this.ifEmpty = 'false';
                    this.sort = 0;
                };
            },
            // 新增和编辑的取消按钮
            AdEdCancel () {
                this.adEdParamsStatus = false;
            },
            // 业务参数和数据类型转中文处理
            paramsAndTypeConverterCN (array) {
                array.forEach((items) => {
                    if (items.isBusi === true || items.isBusi === 'true') {
                        items.isBusi = '是';
                    } else if (items.isBusi === false || items.isBusi === 'false') {
                        items.isBusi = '否';
                    };
                    if (items.isNumeric === true || items.isNumeric === 'true') {
                        items.isNumeric = '是';
                    } else if (items.isNumeric === false || items.isNumeric === 'false') {
                        items.isNumeric = '否';
                    };
                });
            },
            // 新增的事件
            addModel () {
                // 隐藏其他信息
                this.showOther = false;
                this.modalTitle = '新增工艺参数';
                this.adEdParamsStatus = true;
                this.addSwitch = true;
            },
            // 搜索的点击事件
            searchClick () {
                this.tableLoading = true;
                this.pageIndex = 1;
                this.pageTotal = 1;
                // 发送查询的请求
                this.searchHttp();
            },
            searchEnter () {
                this.tableLoading = true;
                this.pageIndex = 1;
                // 发送查询的请求
                this.searchHttp();
            },
            // 获取所属工序
            getScreenProcess (e) {
                this.selectProcessId = e;
                if (e === '全部') {
                    this.selectProcessId = '';
                };
                this.pageIndex = 1;
            },
            // 编辑的事件(返回id)
            editProcessParams (id) {
                this.showOther = true;
                this.editParamsId = id;
                this.modalTitle = '编辑工艺参数';
                // 发送获取详情的请求
                this.$fetch(
                    api.specParamDetail() + id
                ).then(res => {
                    if (res.data.status === 200) {
                        this.adEdParamsStatus = true;
                        this.editSwitch = true;
                        // 赋值输入框
                        this.formValidate.ParamsCodeIpt = res.data.res.code;
                        this.formValidate.ParamsNameIpt = res.data.res.name;
                        this.formValidate.processIpt = res.data.res.processId + '';
                        this.workParams = res.data.res.isRun + '';
                        this.businessParams = res.data.res.isBusi + '';
                        this.dataTypes = res.data.res.isNumeric + '';
                        this.ifEmpty = res.data.res.isNull + '';
                        this.sort = res.data.res.sortNum;
                        this.selectAddProcess = {
                            value: res.data.res.processId,
                            label: res.data.res.processName
                        };
                        // 其他信息
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.updateName = res.data.res.updateName;
                        this.updateTime = res.data.res.updateTime;
                    };
                });
            },
            handleSelectAll (status) {
                this.$refs.selection.selectAll(status);
            },
            // 新增和编辑的确认按钮
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.buttonLoading = true;
                        // 添加
                        if (this.addSwitch === true) {
                            // 发送添加的请求
                            this.addHttp();
                        };
                        // 编辑
                        if (this.editSwitch === true) {
                            // 发送编辑的请求
                            this.editHttp();
                        };
                    } else {
                        if (this.formValidate.ParamsCodeIpt === '') {
                            this.errorMsg = '参数编码不能为空！';
                        } else if (this.formValidate.ParamsNameIpt === '') {
                            this.errorMsg = '参数名称不能为空！';
                        } else if (this.formValidate.processIpt === '') {
                            this.errorMsg = '所属工序不能为空！';
                        };
                    }
                });
            },
            // 添加的请求
            addHttp () {
                this.$post(
                    api.specParamSave(),
                    {
                        'name': this.formValidate.ParamsNameIpt,
                        'code': this.formValidate.ParamsCodeIpt,
                        'processId': this.selectAddProcess.value,
                        'processName': this.selectAddProcess.label,
                        'isRun': this.workParams,
                        'isBusi': this.businessParams,
                        'isNumeric': this.dataTypes,
                        'isNull': this.ifEmpty,
                        'sortNum': this.sort
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.adEdParamsStatus = false;
                        this.buttonLoading = false;
                        this.handleReset('formValidate');
                        this.addSwitch = false;
                        this.$Message.success('操作成功！');
                        // 发送查询的请求
                        this.searchHttp();
                    } else if (res.data.status === 415) {
                        this.adEdParamsStatus = false;
                        this.buttonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            // 编辑的请求
            editHttp () {
                this.$post(
                    api.specParamSave(),
                    {
                        'id': this.editParamsId,
                        'name': this.formValidate.ParamsNameIpt,
                        'code': this.formValidate.ParamsCodeIpt,
                        'processId': this.selectAddProcess.value,
                        'processName': this.selectAddProcess.label,
                        'isRun': this.workParams,
                        'isBusi': this.businessParams,
                        'isNumeric': this.dataTypes,
                        'isNull': this.ifEmpty,
                        'sortNum': this.sort
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.adEdParamsStatus = false;
                        this.buttonLoading = false;
                        this.$Message.success('操作成功！');
                        this.editSwitch = false;
                        this.handleReset('formValidate');
                        // 发送查询的请求
                        this.searchHttp();
                    } else if (res.data.status === 415) {
                        this.adEdParamsStatus = false;
                        this.buttonLoading = false;
                        this.$Loading.finish();
                    } else {
                        this.buttonLoading = false;
                    };
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            // 获取列表数据的请求
            searchHttp () {
                this.searchData = publicJs.clearSpace(this.searchData);
                this.$fetch(
                    api.specParamList(),
                    {
                        'processid': this.selectProcessId,
                        'name': this.searchData,
                        'pageindex': this.pageIndex,
                        'pagesize': this.pageSize
                    }
                ).then((res) => {
                    if (res.data.status === 200) {
                        this.$store.dispatch({
                            type: 'hideLoading'
                        });
                        this.tableLoading = false;
                        // 转中文处理
                        this.paramsAndTypeConverterCN(res.data.res);
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
                    };
                });
            }
        },
        created () {
            this.$store.dispatch({
                type: 'showLoading'
            });
            // 调用获取列表数据的请求
            this.searchHttp();
            publicJs.processLevel().then(res => {
                this.processList = res;
                res.forEach((items) => {
                    this.searchProcessList.push(items);
                });
            });
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            // 120为顶部选项卡和菜单的高度
            this.tableHeight = publicJs.compClientHeight(tableDom.offsetTop + 120 + this.pageHeights);
            // 窗口变化事件
            window.onresize = () => {
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                // 表格的offsetTop + 菜单的距离 + 分页的高度
                this.tableHeight = publicJs.compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
            };
        }
    };
</script>

<style>
    .searchStyle{
        width: 200px;
        margin-left:10px;
        margin-right: 4px;
    }
</style>

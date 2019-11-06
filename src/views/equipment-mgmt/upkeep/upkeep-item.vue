<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col>
                <Button icon="md-add" type="primary" class="margin-bottom-10" @click="startUpkeepEvent">新增</Button>
            </Col>
            <Col>
                <Select clearable v-model="queryBarProcess" class="formWidth" placeholder="请选择工序">
                    <Option v-for="item in queryBarProcessList" :value="item.id" :style="item.style" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input placeholder="请输入项目名称" type="text" v-model="queryBarUpkeepItemName" class="formWidth"/>
                <Button icon="ios-search" type="primary" @click="clickSearchEvent">搜索</Button>
            </Col>
        </Row>
        <Row class="margin-bottom-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :placement="pageUp" :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageEvent" :show-sizer="true" @on-page-size-change="pageChange"></Page>
            </Col>
        </Row>
        <Row>
            <Col>
                <Modal
                        v-model="addUpkeepItemModalState"
                        :title="adEdModalTitle"
                        :mask-closable="false"
                        @on-visible-change="getAdEdModalStateChangeEvent"
                >
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="130" :show-message="false">
                        <Row type="flex" justify="space-between">
                            <Col span="20">
                                <FormItem label="保养项目名称:" class="formItemMargin" prop="modalCycleUpkeepName">
                                    <Input placeholder="请输入保养项目名称" type="text" v-model="formValidate.modalCycleUpkeepName"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="20">
                                <FormItem label="工序:" class="formItemMargin" prop="modalProcess">
                                    <Select v-model="formValidate.modalProcess" placeholder="请选择工序">
                                        <Option v-for="item in modalProcessList":style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="20">
                                <FormItem label="周期最小值:" class="formItemMargin" prop="modalCycleMin">
                                    <InputNumber class="widthPercentage" :precision="0" :min="0" v-model="formValidate.modalCycleMin"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between">
                            <Col span="20">
                                <FormItem label="周期最大值:" class="formItemMargin" prop="modalCycleMax">
                                    <InputNumber class="widthPercentage" :precision="0" :min="0" v-model="formValidate.modalCycleMax"/>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormItem label="周期单位:" class="formItemMargin" prop="modalCycleUnit">
                                    <RadioGroup v-model="formValidate.modalCycleUnit">
                                        <Radio label="0">天</Radio>
                                        <Radio label="1">月</Radio>
                                        <Radio label="2">年</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-show="showOtherBar">
                            <Col>
                                <other-message
                                        :createName="createName"
                                        :createTime="createTime"
                                        :updateName="updateName"
                                        :updateTime="updateTime"
                                ></other-message>
                            </Col>
                        </Row>
                    </Form>
                    <div slot="footer">
                        <Button :loading="adEdButtonLoading" type="success" @click="confirmEvent">确认</Button>
                        <Button class="cancelButton" @click="cancelEvent">取消</Button>
                    </div>
                </Modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <delete-tips
                    :tipMsg="deleteTipsMsg"
                    :loading="deleteButtonLoading"
                    :v-model="deleteTipsState"
                    @cancel="deleteTipsCancel"
                    @confirm="deleteTipsConfirm"
                >
                </delete-tips>
            </Col>
        </Row>
    </card>
</template>
<script>
    import deleteTips from '../../public/deleteWarning';
    import { noticeTips, clearSpace, compClientHeight, setPage } from '../../../libs/common';
    import otherMessage from '../../components/otherMessage';
    export default {
        components: {
            deleteTips, otherMessage
        },
        data () {
            const validateModalCycleUpkeepName = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateModalProcess = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateModalCycleMin = (rule, value, callback) => {
                if (!value) {
                    callback(new Error());
                } else {
                    if (this.formValidate.modalCycleMin > this.formValidate.modalCycleMax) {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '周期最小值不能大于周期最大值!'
                        });
                        callback(new Error());
                    } else {
                        callback();
                    };
                };
            };
            const validateModalCycleMax = (rule, value, callback) => {
                if (!value) {
                    callback(new Error());
                } else {
                    if (this.formValidate.modalCycleMin > this.formValidate.modalCycleMax) {
                        this.$Notice.warning({
                            title: '提示',
                            desc: '周期最小值不能大于周期最大值!'
                        });
                        callback(new Error());
                    } else {
                        callback();
                    };
                };
            };
            return {
                globalLoadingShow: false,
                queryBarProcess: '',
                queryBarUpkeepItemName: '',
                queryBarProcessList: [],
                pageUp: setPage.pageUp,
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                pageHeights: null,
                tableHeight: document.documentElement.clientHeight - 250,
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                showOtherBar: false,
                adEdModalTitle: '',
                editId: '',
                deleteId: '',
                deleteTipsMsg: '',
                deleteButtonLoading: false,
                deleteTipsState: false,
                adEdButtonLoading: false,
                formValidate: {
                    modalCycleUpkeepName: '',
                    modalProcess: '',
                    modalCycleMin: 1,
                    modalCycleMax: 1,
                    modalCycleUnit: '0'
                },
                ruleValidate: {
                    modalCycleUpkeepName: [
                        {required: true, validator: validateModalCycleUpkeepName, trigger: 'change'}
                    ],
                    modalProcess: [
                        {required: true, validator: validateModalProcess, trigger: 'change'}
                    ],
                    modalCycleMin: [
                        {required: true, validator: validateModalCycleMin, trigger: 'change'}
                    ],
                    modalCycleMax: [
                        {required: true, validator: validateModalCycleMax, trigger: 'change'}
                    ]
                },
                modalProcessList: [],
                modalUpkeepPlanCodeValue: '',
                modalMachineUpkeepCodeValue: '',
                modalUpkeepTypeValue: '',
                modalRemarksValue: '',
                modalDescribeValue: '',
                modalKeyOverhaulValue: '',
                modalProcessValue: '',
                modalWorkshopValue: '',
                upkeepTypeList: [],
                addUpkeepItemModalState: false,
                tableHeader: [
                    {
                        title: '保养项目名称',
                        key: 'name',
                        minWidth: 124,
                        fixed: 'left',
                        sortable: true
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        align: 'center',
                        minWidth: 80,
                        sortable: true
                    },
                    {
                        title: '周期最小值',
                        key: 'cycleMin',
                        align: 'right',
                        minWidth: 120,
                        sortable: true
                    },
                    {
                        title: '周期最大值',
                        key: 'cycleMax',
                        align: 'right',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '周期单位',
                        key: 'cycleUnitName',
                        align: 'left',
                        minWidth: 100,
                        sortable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 140,
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    domProps: {
                                        innerHTML: '编辑'
                                    },
                                    style: {
                                        marginRight: '4px'
                                    },
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.editClickEvent(params.row.id);
                                        }
                                    }
                                }),
                                h('Button', {
                                    domProps: {
                                        innerHTML: '删除'
                                    },
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            this.deleteClickEvent(params.row.id);
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                tableData: []
            };
        },
        methods: {
            // 获取页码
            getPageEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            pageChange (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 搜索按钮的事件
            clickSearchEvent () {
                this.pageTotal = 1;
                this.pageIndex = 1;
                this.getListHttp();
            },
            // 删除的取消事件
            deleteTipsCancel () {
                this.deleteTipsState = false;
                this.deleteTipsMsg = '';
                this.deleteButtonLoading = false;
            },
            // 删除的确认事件
            deleteTipsConfirm () {
                this.deleteButtonLoading = true;
                let ids = [];
                ids.push(this.deleteId);
                this.$api.upkeep.upkeepItemDeleteHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.deleteButtonLoading = false;
                        noticeTips(this, 'deleteTips');
                        this.deleteTipsState = false;
                        this.deleteTipsMsg = '';
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 编辑的点击事件
            editClickEvent (id) {
                this.editId = id;
                this.showOtherBar = true;
                this.adEdModalTitle = '编辑保养项目';
                this.getDetailHttp();
            },
            getDetailHttp () {
                this.$api.upkeep.upkeepItemDetailHttp(this.editId).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.modalCycleUpkeepName = res.data.res.name;
                        this.formValidate.modalProcess = res.data.res.processId;
                        this.formValidate.modalCycleMin = res.data.res.cycleMin;
                        this.formValidate.modalCycleMax = res.data.res.cycleMax;
                        this.formValidate.modalCycleUnit = res.data.res.cycleUnit + '';
                        this.createName = res.data.res.createName;
                        this.createTime = res.data.res.createTime;
                        this.updateName = res.data.res.updateName;
                        this.updateTime = res.data.res.updateTime;
                        this.addUpkeepItemModalState = true;
                    };
                });
            },
            // 删除的点击事件
            deleteClickEvent (id) {
                if (id !== '') {
                    this.deleteId = id;
                    this.deleteTipsState = true;
                    this.deleteTipsMsg = '确认删除?';
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 新增和编辑的请求
            postSaveHttp () {
                this.$api.upkeep.upkeepItemSaveHttp({
                    'id': this.editId,
                    'name': this.formValidate.modalCycleUpkeepName,
                    'processId': this.formValidate.modalProcess,
                    'cycleMin': this.formValidate.modalCycleMin,
                    'cycleMax': this.formValidate.modalCycleMax,
                    'cycleUnit': this.formValidate.modalCycleUnit
                }).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.adEdButtonLoading = false;
                        this.addUpkeepItemModalState = false;
                        noticeTips(this, 'saveTips');
                    } else {
                        this.adEdButtonLoading = false;
                    };
                });
            },
            // 新增和编辑modal的确认事件
            confirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.adEdButtonLoading = true;
                        this.postSaveHttp();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 监听新增和编辑modal的状态
            getAdEdModalStateChangeEvent (e) {
                if (e === false) {
                    this.addUpkeepItemModalState = false;
                    this.showOtherBar = false;
                    this.adEdButtonLoading = false;
                    this.$refs['formValidate'].resetFields();
                };
            },
            // 新增和编辑modal的取消事件
            cancelEvent () {
                this.addUpkeepItemModalState = false;
                this.showOtherBar = false;
                this.adEdButtonLoading = false;
                this.$refs['formValidate'].resetFields();
            },
            // 开始保养的点击事件
            startUpkeepEvent () {
                this.addUpkeepItemModalState = true;
                this.adEdModalTitle = '新增保养项目';
                this.editId = '';
                this.showOtherBar = false;
            },
            // 日期转换
            dateConvert (data) {
                data.forEach((items) => {
                    if (items.cycleUnit === 0) {
                        items.cycleUnitName = '天';
                    } else if (items.cycleUnit === 1) {
                        items.cycleUnitName = '月';
                    } else if (items.cycleUnit === 2) {
                        items.cycleUnitName = '年';
                    };
                });
            },
            // 获取列表查询
            getListHttp () {
                !this.queryBarProcess ? this.queryBarProcess = '' : this.queryBarProcess;
                this.queryBarUpkeepItemName = clearSpace(this.queryBarUpkeepItemName);
                this.$call('maintenance.item.list', {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    name: this.queryBarUpkeepItemName,
                    processId: this.queryBarProcess
                }).then(res => {
                    if (res.data.status === 200) {
                        this.dateConvert(res.data.res);
                        this.pageTotal = res.data.count;
                        this.tableData = res.data.res;
                        this.globalLoadingShow = false;
                    };
                });
            },
            getProcessListHttp () {
                this.$api.process.getSearchProcessList().then(res => {
                    this.modalProcessList = res;
                    this.queryBarProcessList = res;
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getProcessListHttp();
            this.getListHttp();
        },
        mounted () {
            let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
            let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
            this.pageHeights = pageHeightDom.offsetHeight + 10;
            window.onresize = () => {
                this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
            };
        }
    };
</script>

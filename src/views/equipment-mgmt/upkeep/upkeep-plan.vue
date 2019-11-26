<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between" align="middle">
            <Col>
                <Button icon="md-add" type="primary" @click="addUpkeepEvent">新增</Button>
                <Dropdown class="margin-bottom-10" @on-click="getPushEvent" trigger="click">
                    <Button type="primary">
                        提交
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="pushSwitch" name="提交">提交</DropdownItem>
                        <DropdownItem :disabled="cancelSwitch" name="撤销">撤销</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="margin-bottom-10" @on-click="getAuditEvent" trigger="click">
                    <Button type="primary">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="auditSwitch" name="审核">审核</DropdownItem>
                        <DropdownItem :disabled="againstSwitch" name="反审核">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown class="margin-bottom-10" @on-click="getCloseEvent" trigger="click">
                    <Button type="info">
                        业务操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="closeSwitch" name="关闭">关闭</DropdownItem>
                        <DropdownItem :disabled="openSwitch" name="反关闭">反关闭</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Upload style="display: inline-block" action="" :before-upload="handleBeforeUpload" accept=".xls, .xlsx">
                    <!--<Button icon="ios-cloud-upload-outline" :loading="uploadLoading" @click="handleUploadFile">上传文件</Button>-->
                    <Button type="primary" @click="insertExcel">导入</Button>
                </Upload>
            </Col>
            <Col>
                <Row type="flex" justify="space-between" class="screenRightMarginTop">
                    <Col>
                        <Row type="flex" justify="space-between">
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarWorkshop" placeholder="请选择车间" class="searchHurdles">
                                    <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </Col>
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarProcess" placeholder="请选择工序" class="searchHurdles">
                                    <Option v-for="item in queryBarProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col class="margin-bottom-10">
                                <Input type="text" v-model="queryBarPlanCode" placeholder="请输入计划单号" class="searchHurdles"/>
                            </Col>
                        </Row>
                        <Row type="flex" justify="space-between" v-show="showScreenSub">
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <DatePicker type="month" placeholder="请选择保养月份" @on-change="getYearMonthEven" class="searchHurdles" v-model="queryBarDateMonth"></DatePicker>
                            </Col>
                            <Col class="queryBarMarginRight margin-bottom-10">
                                <Select clearable v-model="queryBarPlanState" placeholder="请选择单据状态" class="searchHurdles">
                                    <Option v-for="item in queryBarPlanStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                            <Col class="margin-bottom-10">
                                <Select clearable v-model="queryBarUpkeepState" placeholder="请选择保养状态" class="searchHurdles">
                                    <Option v-for="item in queryBarUpkeepStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Col>
                    <Col class="searchButtonStyle margin-bottom-10">
                        <a class="moreStyle" @click="showQueryChange">···</a>
                        <Button icon="ios-search" type="primary" @click="searchClickEvent" class="queryButtonStyle">搜索</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row class="marginBottom-10 tableOffsetTop">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPageCodeEvent" :show-sizer="true" @on-page-size-change="getPageOptsEvent"></Page>
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
    let _this = this;
    import { noticeTips, clearSpace, compClientHeight, setPage} from '../../../libs/common';
    import deleteTips from '../../public/deleteWarning';
    import excel from '../../../libs/excel.js';
    import iView from 'iview';
    import api from '../../../ajax/api';
    export default {
        name:'upkeepPlan',
        components: {
            deleteTips
        },
        data () {
            return {
                globalLoadingShow: false,
                pushSwitch: true,
                cancelSwitch: true,
                auditSwitch: true,
                againstSwitch: true,
                closeSwitch: true,
                openSwitch: true,
                deleteId: '',
                deleteTipsMsg: '',
                deleteButtonLoading: false,
                deleteTipsState: false,
                tableHeight: document.documentElement.clientHeight - 250,
                queryBarPlanCode: '',
                queryBarWorkshop: '',
                queryBarWorkshopList: [],
                queryBarProcess: '',
                queryBarProcessList: [],
                queryBarDateMonth: '',
                queryBarPlanState: '',
                queryBarPlanStateList: [],
                queryBarUpkeepState: '',
                queryBarUpkeepStateList: [],
                pageTotal: 0,
                pageIndex: 1,
                pageOpts: setPage.pageOpts,
                pageSize: setPage.pageSize,
                showScreenSub: false,
                tableHeader: [
                    {
                        title: '选择',
                        key: 'checkValue',
                        width: 80,
                        align: 'center',
                        fixed: 'left',
                        render: (h, param) => {
                            return h('div', [
                                h('Checkbox', {
                                    props: { value: param.row.checkValue },
                                    on: {
                                        'on-change': (e) => {
                                            _this.tableData.forEach((item) => {
                                                _this.$set(item, 'checkValue', false);
                                            });
                                            _this.tableData[param.index].checkValue = e;
                                            if (e === true) {
                                                _this.getCheckBoxEvent(param.row, param.row.id);
                                            } else {
                                                _this.getCheckBoxEvent(null);
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {title: '保养计划单号', key: 'code', sortable: true, minWidth: 130, align: 'left', fixed: 'left'},
                    {title: '车间', key: 'workshopName', minWidth: 80, align: 'left', sortable: true},
                    {title: '工序', key: 'processName', minWidth: 80, align: 'center', sortable: true},
                    {title: '保养月份', key: 'yearMonth', minWidth: 110, align: 'left', sortable: true},
                    {title: '保养类型', key: 'maintenanceTypeName', minWidth: 110, align: 'left', sortable: true},
                    {title: '保养状态', key: 'completionStateName', minWidth: 110, align: 'center', sortable: true},
                    {title: '单据状态', key: 'auditStateName', minWidth: 110, align: 'center', sortable: true},
                    {title: '引用状态', key: 'isQuote', minWidth: 110, align: 'center', sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.isQuote ? '已引用' : '未引用'
                                }
                            })
                        }
                    },
                    {title: '创建人', key: 'createName', minWidth: 100, align: 'center', sortable: true},
                    {
                        title: '操作',
                        width: 130,
                        fixed: 'right',
                        align: 'center',
                        render: (h, param) => {
                            let deleteButtonDisable = false;
                            // 非创建状态下和引用状态下都不能删除
                            param.row.auditState !== 1 || param.row.isQuote ? deleteButtonDisable = true : deleteButtonDisable = false;
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        'click': () => {
                                            _this.editPlanCodeEvent(param.row.id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        disabled: deleteButtonDisable
                                    },
                                    style: {
                                        marginLeft: '4px'
                                    },
                                    on: {
                                        'click': () => {
                                            _this.deletePlanCodeEvent(param.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [],
                checkId: '',
                upkeepState: '',
                toCreated: false,
                insertList: [],
                file: null,
            };
        },
        methods: {
            // 导入数据
            insertExcel () {
                this.initUpload();
            },
            initUpload () {
                this.file = null;
                this.insertList = [];
            },
            handleBeforeUpload (file) {
                const fileExt = file.name.split('.').pop().toLocaleLowerCase();
                if (fileExt === 'xlsx' || fileExt === 'xls') {
                    this.readFile(file);
                    this.file = file;
                } else {
                    this.$Notice.warning({
                        title: '文件类型错误',
                        desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
                    });
                }
                return false;
            },
            // 读取文件
            readFile (file) {
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);
                reader.onloadstart = e => {
                    iView.LoadingBar.start();
                };
                reader.onprogress = e => {
                    this.progressPercent = Math.round(e.loaded / e.total * 100);
                };
                reader.onerror = e => {
                    this.$Message.error('文件读取出错');
                };
                reader.onload = e => {
                    const data = e.target.result;
                    const { header, results } = excel.read(data, 'array');
                    const tableTitle = header.map(item => { return { title: item, key: item } });
                    this.insertList = results;
                   this.$call('maintenance.plan.importData', this.insertList).then(res => {
                       let content = res.data;
                       if (content.status === 200) {
                           this.$Message.info('文件读取成功');
                           this.getListHttp();
                       }
                   });
                    iView.LoadingBar.finish();
                };
            },
            initButtonState () {
                this.pushSwitch = true;
                this.cancelSwitch = true;
                this.auditSwitch = true;
                this.againstSwitch = true;
                this.closeSwitch = true;
                this.openSwitch = true;
            },
            // 删除modal的取消事件
            deleteTipsCancel () {
                this.deleteId = '';
                this.deleteTipsMsg = '';
                this.deleteTipsState = false;
                this.deleteButtonLoading = false;
            },
            // 删除modal的确认事件
            deleteTipsConfirm () {
                this.deleteButtonLoading = true;
                this.$api.upkeep.planCodeDeleteHttp([this.deleteId]).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'deleteTips');
                        this.deleteId = '';
                        this.deleteTipsMsg = '';
                        this.deleteTipsState = false;
                        this.deleteButtonLoading = false;
                        this.getListHttp();
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            //  删除事件
            deletePlanCodeEvent (id) {
                this.deleteTipsState = true;
                this.deleteId = id;
                this.deleteTipsMsg = '确认删除?';
            },
            // 获取勾选
            getCheckBoxEvent (e, id) {
                this.getDropdownStateChange(e, id);
            },
            // 设置Dropdown的状态
            getDropdownStateChange (e, id) {
                if (e !== null) {
                    this.checkId = id;
                    this.upkeepState = e.completionState;
                    if (e.auditState === 1) {
                        // 保存
                        this.auditSwitch = true;
                        this.againstSwitch = true;
                        this.pushSwitch = false;
                        this.cancelSwitch = true;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    } else if (e.auditState === 2) {
                        // 待审核
                        this.auditSwitch = false;
                        this.againstSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = false;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    } else if (e.auditState === 3) {
                        // 已审核
                        this.auditSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.closeSwitch = false;
                        this.openSwitch = true;
                        // 已引用不能反审核
                        e.isQuote ? this.againstSwitch = true : this.againstSwitch = false;
                    } else if (e.auditState === 4) {
                        // 已关闭
                        this.auditSwitch = true;
                        this.againstSwitch = true;
                        this.pushSwitch = true;
                        this.cancelSwitch = true;
                        this.closeSwitch = true;
                        this.openSwitch = false;
                    };
                } else {
                    this.auditSwitch = true;
                    this.againstSwitch = true;
                    this.pushSwitch = true;
                    this.cancelSwitch = true;
                    this.closeSwitch = true;
                    this.openSwitch = true;
                };
            },
            // 获取月份
            getYearMonthEven (e) {
                this.queryBarDateMonth = e;
            },
            //  编辑的事件
            editPlanCodeEvent (id) {
                this.$router.push({
                    path: 'editUpkeep',
                    query: {
                        editId: id,
                        activated: true
                    }
                });
            },
            // 获取页码
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 获取每页条数
            getPageOptsEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 搜索的事件
            searchClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListHttp();
            },
            // 筛选栏的省略号点击事件
            showQueryChange () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                if (this.showScreenSub) {
                    this.showScreenSub = false;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                } else if (this.showScreenSub === false) {
                    this.showScreenSub = true;
                    // 先减去一行的高度
                    this.tableHeight = this.tableHeight - 84;
                    setTimeout(() => {
                        this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                    }, 0);
                };
            },
            // 新增计划事件
            addUpkeepEvent () {
                this.$router.push({
                    path: 'addUpkeep',
                    query: {
                        activated: true
                    }
                });
            },
            // 提交的事件
            getPushEvent (e) {
                if (this.checkId !== '') {
                    let ids = [];
                    ids.push(this.checkId);
                    if (e === '提交' && this.pushSwitch === false) {
                        this.$api.upkeep.planCodeSubmitHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkId = '';
                                noticeTips(this, 'submitTips');
                                this.getListHttp();
                            };
                        });
                    } else if (e === '撤销' && this.cancelSwitch === false) {
                        this.$api.upkeep.planCodeCancelHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkId = '';
                                noticeTips(this, 'cancelTips');
                                this.getListHttp();
                            };
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 关闭事件
            getCloseEvent (e) {
                if (this.checkId !== '') {
                    let ids = [];
                    ids.push(this.checkId);
                    if (e === '关闭' && this.closeSwitch === false) {
                        this.$api.upkeep.planCodeCloseHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkId = '';
                                noticeTips(this, 'closeTips');
                                this.getListHttp();
                            };
                        });
                    } else if (e === '反关闭' && this.openSwitch === false) {
                        this.$api.upkeep.planCodeUnCloseHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkId = '';
                                noticeTips(this, 'unCloseTips');
                                this.getListHttp();
                            };
                        });
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 审核事件
            getAuditEvent (e) {
                if (this.checkId !== '') {
                    let ids = [];
                    ids.push(this.checkId);
                    if (e === '审核' && this.auditSwitch === false) {
                        this.$api.upkeep.planCodeApproveHttp(ids).then(res => {
                            if (res.data.status === 200) {
                                this.checkId = '';
                                noticeTips(this, 'auditTips');
                                this.getListHttp();
                            };
                        });
                    } else if (e === '反审核' && this.againstSwitch === false) {
                        if (this.upkeepState === '1' || this.upkeepState === '2') {
                            this.$Message.warning('该计划单不可反审核!');
                        } else {
                            this.$api.upkeep.planCodeUnApproveHttp(ids).then(res => {
                                if (res.data.status === 200) {
                                    this.checkId = '';
                                    noticeTips(this, 'unAuditTips');
                                    this.getListHttp();
                                };
                            });
                        }
                    };
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 获取列表数据的请求
            getListHttp () {
                this.queryBarPlanCode = clearSpace(this.queryBarPlanCode);
                return this.$call('maintenance.plan.list', {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    workshopId: this.queryBarWorkshop,
                    processId: this.queryBarProcess,
                    code: this.queryBarPlanCode,
                    yearMonth: this.queryBarDateMonth,
                    completionState: this.queryBarUpkeepState,
                    auditState: this.queryBarPlanState
                }).then(res => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.initButtonState();
                        this.pageTotal = res.data.count;
                        this.tableData = res.data.res;
                    };
                });
            },
            getWorkshop () {
                return this.$api.dept.getWorkshopList().then(res => {
                    if (res.data.status === 200) {
                        let responseData = [];
                        responseData = res.data.res;
                        if (responseData !== null) {
                            let isDefaultWorkshop = null;
                            responseData.forEach((item) => {
                                if (item.isDefault === 1) {
                                    isDefaultWorkshop = item.deptId;
                                };
                            });
                            isDefaultWorkshop !== null ? this.queryBarWorkshop = isDefaultWorkshop : this.queryBarWorkshop = responseData[0].deptId;
                            this.queryBarWorkshopList = responseData;
                        };
                    }
                });
            },
            // 获取保养单据的状态
            getUpkeepCodeStateHttp () {
                this.$api.upkeep.planCodeStateHttp().then(res => {
                    if (res.data.status === 200) {
                        this.queryBarPlanStateList = res.data.res;
                    };
                });
            },
            // 获取计划单中设备的保养状态
            getMachineUpkeepState () {
                this.$api.upkeep.planCodeUpkeepStateHttp().then(res => {
                    if (res.data.status === 200) {
                        this.queryBarUpkeepStateList = res.data.res;
                    };
                });
            },
            getProcessListHttp () {
                this.$api.process.getSearchProcessList().then(res => {
                    this.queryBarProcessList = res;
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                let pageHeightDom = document.getElementsByClassName('pageHeight')[0];
                this.pageHeights = pageHeightDom.offsetHeight + 10;
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 120 + this.pageHeights + 30);
                };
            },
            getDependentDataHttp () {
                this.globalLoadingShow = true;
                this.getProcessListHttp();
                (async () => {
                    await this.getWorkshop();
                    await this.getListHttp();
                })();
                this.getUpkeepCodeStateHttp();
                this.getMachineUpkeepState();
            }
        },
        created () {
            this.toCreated = true;
            this.getDependentDataHttp();
        },
        mounted () {
            _this = this;
            this.$nextTick(()=>{ this.calculationTableHeight(); });
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.getDependentDataHttp();
            };
            this.$nextTick(()=>{ this.calculationTableHeight(); });
            this.$route.query.activated = false;
            this.toCreated = false;
        }
    };
</script>

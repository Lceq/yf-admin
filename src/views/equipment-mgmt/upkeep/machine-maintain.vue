<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between" align="middle">
            <Col>
                <Button :disabled="disableOverUpkeep" type="success" class="" @click="overUpkeepEvent">完成保养</Button>
                <Dropdown @on-click="clickPartsReplaceEvent" trigger="click" class="margin-bottom-10">
                    <Button type="primary">
                        配件更换
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="disableCreateParts" name="申请">申请</DropdownItem>
                        <DropdownItem :disabled="disableSeeParts" name="查看">查看</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown @on-click="getCloseEvent" trigger="click" class="margin-bottom-10">
                    <Button type="info">
                        业务操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="closeSwitch" name="关闭">关闭</DropdownItem>
                        <DropdownItem :disabled="openSwitch" name="反关闭">反关闭</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
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
                                <Input type="text" v-model="queryBarUpkeepCode" placeholder="请输入保养单号" class="searchHurdles"/>
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
        <Modal
                v-model="startUpkeepModal"
                :title="startUpkeepModalTitle"
                width="800"
                :mask-closable="false"
                @on-visible-change="getModalChangeEvent"
        >
            <modal-conten-loading :spinShow="modalContentSpinShow"></modal-conten-loading>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" :show-message="false">
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="设备保养单号:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalMachineUpkeepCodeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="保养计划单号:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalUpkeepPlanCodeValue}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="车间:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalWorkshopValue}}</div>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="工序:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalProcessValue}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="设备编号:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalMachineCodeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="设备名称:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalMachineNameValue}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="保养类型:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalUpkeepTypeValue}}</div>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="保养状态:" class="formItemMargin">
                            <div class="exhibitionInputBackground">{{modalUpkeepStateValue}}</div>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="保养开始时间:" class="formItemMargin" prop="modalStartUpkeepValue">
                            <DatePicker :editable="false" @on-open-change="closeDateStartEvent" :options="startUpkeepOptions" v-model="formValidate.modalStartUpkeepValue" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择保养开始时间" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="保养结束时间:" class="formItemMargin" prop="modalOverUpkeepValue">
                            <DatePicker :editable="false" @on-open-change="closeDateOverEvent" :options="overUpkeepOptions" v-model="formValidate.modalOverUpkeepValue" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="请选择保养结束时间" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="11">
                        <FormItem label="重点检修:" class="formItemMargin">
                            <Input v-model="modalKeyOverhaulValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input v-model="modalRemarksValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24">
                        <FormItem label="保养描述:" class="formItemMargin">
                            <Input v-model="modalDescribeValue" type="textarea" :autosize="{minRows: 1,maxRows: 1}" placeholder="请输入" />
                        </FormItem>
                    </Col>
                </Row>
                <Row type="flex" justify="space-between">
                    <Col span="24">
                        <Tabs value="upkeepCycle">
                            <TabPane label="保养周期项目" name="upkeepCycle">
                                <Table :row-class-name="rowClassName" size="small" border :columns="startUpkeepTableHeader" :data="startUpkeepTableData"></Table>
                            </TabPane>
                            <TabPane label="其他信息" name="other">
                                <other-message
                                        :createName="createName"
                                        :createTime="createTime"
                                        :updateName="updateName"
                                        :updateTime="updateTime"
                                        :closeName="closeName"
                                        :closeTime="closeTime"
                                ></other-message>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button :disabled="disableModalConfirmButton" :loading="buttonLoading" type="success" @click="confirmEvent">确认</Button>
                <Button @click="cancelEvent">取消</Button>
            </div>
        </Modal>
        <delete-tips
                :tipMsg="deleteTipsMsg"
                :loading="deleteButtonLoading"
                :v-model="deleteTipsState"
                @cancel="deleteTipsCancel"
                @confirm="deleteTipsConfirm"
        >
        </delete-tips>
        <see-parts
                :spinShow="spinShow"
                :seePartsModalState="seePartsModalState"
                :seePartsTableData="seePartsTableData"
                :seePartsLoading="seePartsLoading"
                @seePartsCancelEvent="seePartsCancelEvent"
                @visibleChangeEvent="visibleChangeEvent"
        >
        </see-parts>
    </card>
</template>
<script>
    import { noticeTips, compClientHeight, setPage, clearSpace, toDaySeconds, formatDate, emptyTips} from '../../../libs/common';
    import deleteTips from '../../public/deleteWarning';
    import seeParts from './components/see-parts';
    import otherMessage from '../../components/otherMessage';
    import modalContenLoading from '../../components/modal-content-loading';
    export default {
        components: {
            deleteTips,seeParts,otherMessage,modalContenLoading
        },
        data () {
            const validateModalStartUpkeepValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateModalOverUpkeepValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            return {
                modalContentSpinShow: false,
                globalLoadingShow: false,
                spinShow: false,
                formValidate: {
                    modalOverUpkeepValue: '',
                    modalStartUpkeepValue: ''
                },
                ruleValidate: {
                    modalStartUpkeepValue: [
                        {required: true, validator: validateModalStartUpkeepValue, trigger: 'change'}
                    ],
                    modalOverUpkeepValue: [
                        {required: true, validator: validateModalOverUpkeepValue, trigger: 'change'}
                    ]
                },
                seePartsTableHeader: [
                    {title: '配件更换单号', key: 'code', minWidth: 126, align: 'center', fixed:'left', sortable: true},
                    {title: '单据状态', key: 'auditStateName', width: 106, align: 'center', fixed:'left', sortable: true},
                    {title: '配件编号', key: 'productCode', width: 126, align: 'center', fixed:'left', sortable: true},
                    {title: '配件名称', key: 'productName', width: 106, align: 'center', fixed:'left', sortable: true},
                    {title: '申请数量', key: 'qty', width: 106, align: 'center', fixed:'left', sortable: true},
                    {title: '设备编号', key: 'machineCode', width: 106, align: 'center', sortable: true},
                    {title: '设备名称', key: 'machineName', width: 116, align: 'center', sortable: true},
                    {title: '所属车间', key: 'workshopName', width: 106, align: 'center', sortable: true},
                    {title: '所属工序', key: 'processName', width: 102, align: 'center', sortable: true},
                    {title: '申请人', key: 'createName', width: 96, align: 'center', sortable: true},
                    {title: '申请时间', key: 'createTime', width: 150, align: 'center', sortable: true}
                ],
                checkSourceCode: '',
                seePartsTableData: [],
                seePartsModalState: false,
                seePartsLoading: false,
                startUpkeepOptions: {},
                overUpkeepOptions: {},
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                closeName: '',
                closeTime: '',
                isEdit: false,
                deleteTipsMsg: '',
                deleteButtonLoading: false,
                deleteTipsState: false,
                closeSwitch: true,
                openSwitch: true,
                disableOverUpkeep: true,
                disableCreateParts: true,
                disableSeeParts: true,
                checkId: null,
                showScreenSub: false,
                queryBarUpkeepCode: '',
                queryBarPlanCode: '',
                queryBarWorkshop: '',
                queryBarWorkshopList: [],
                queryBarProcess: '',
                queryBarProcessList: [],
                queryBarPlanState: '',
                queryBarPlanStateList: [],
                queryBarUpkeepState: '',
                queryBarUpkeepStateList: [],
                pageTotal: 0,
                pageIndex: 1,
                pageOpts: setPage.pageOpts,
                pageSize: setPage.pageSize,
                tableHeight: document.documentElement.clientHeight - 240,
                buttonLoading: false,
                modalUpkeepPlanCodeValue: '',
                modalMachineUpkeepCodeValue: '',
                modalUpkeepTypeValue: '',
                modalUpkeepStateValue: '',
                modalRemarksValue: '',
                modalDescribeValue: '',
                modalKeyOverhaulValue: '',
                modalProcessValue: '',
                modalMachineCodeValue: '',
                modalMachineNameValue: '',
                modalWorkshopValue: '',
                startUpkeepTableHeader: [
                    {title: '保养周期项目名称', key: 'maintenanceItemName', align: 'center', minWidth: 110},
                    {title: '上一次周期保养时间', key: 'lastTime', align: 'center', minWidth: 100},
                    {title: '预计下次周期保养时间', key: 'expectMaintenanceTime', align: 'center', minWidth: 110},
                    {
                        title: '是否保养',
                        width: 90,
                        key: 'isMaintenance',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('checkbox', {
                                    props: {
                                        value: params.row.isMaintenance
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.responseObj.maintenanceOrderItemList[params.index].isMaintenance = e;
                                            if(e === true){
                                                this.responseObj.maintenanceOrderItemList[params.index].maintenanceTime = toDaySeconds();
                                            }else{
                                                this.responseObj.maintenanceOrderItemList[params.index].maintenanceTime = '';
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '保养时间',
                        key: 'upkeepOverTime',
                        align: 'center',
                        width: 210,
                        render: (h, params) => {
                            let disableDatePicker = false;
                            if (params.row.isMaintenance === true) {
                                disableDatePicker = false;
                            } else {
                                disableDatePicker = true;
                            };
                            return h('div', [
                                h('DatePicker', {
                                    props: {
                                        value: params.row.maintenanceTime,
                                        transfer: true,
                                        placeholder: '请选择保养时间',
                                        disabled: disableDatePicker,
                                        readonly: disableDatePicker,
                                        editable: false
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.responseObj.maintenanceOrderItemList[params.index].maintenanceTime = e + ' ' + '00:00:00';
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                startUpkeepTableData: [],
                upkeepTypeList: [],
                startUpkeepModal: false,
                startUpkeepModalTitle: '',
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
                                    props: {
                                        value: param.row.checkValue
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            this.tableData.forEach((item) => {
                                                this.$set(item, 'checkValue', false);
                                            });
                                            this.tableData[param.index].checkValue = e;
                                            if (e === true) {
                                                this.getCheckBoxEvent(param.row);
                                            } else if (e === false) {
                                                this.getCheckBoxEvent(null);
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {title: '保养计划单号', key: 'maintenancePlanCode', minWidth: 130, fixed: 'left', sortable: true},
                    {title: '设备保养单号', key: 'code', align: 'left', minWidth: 130, sortable: true},
                    {title: '设备编号', key: 'machineCode', align: 'left', minWidth: 110, sortable: true},
                    {title: '设备名称', key: 'machineName', align: 'left', minWidth: 110, sortable: true},
                    {title: '车间', key: 'workshopName', align: 'left', minWidth: 80, sortable: true},
                    {title: '工序', key: 'processName', align: 'center', minWidth: 80, sortable: true},
                    {title: '品种', key: 'productName', align: 'left', minWidth: 100, sortable: true},
                    {title: '批号', key: 'batchCode', align: 'left', minWidth: 100, sortable: true},
                    {title: '保养月份', key: 'yearMonth', align: 'left', minWidth: 110, sortable: true},
                    {title: '保养类型', key: 'typeName', align: 'left', minWidth: 150, sortable: true},
                    {title: '保养状态', key: 'completionStateName', align: 'center', minWidth: 110, sortable: true},
                    {title: '单据状态', key: 'auditStateName', align: 'center', minWidth: 110, sortable: true},
                    {title: '创建人', key: 'createName', align: 'center', minWidth: 100, sortable: true},
                    {
                        title: '操作',
                        align: 'center',
                        fixed: 'right',
                        width: 130,
                        render: (h, params) => {
                            let disableDelete = false;
                            if (params.row.auditState === 4 || params.row.isQuote) disableDelete = true;// 已关闭,已关闭，不能删除
                            return h('div', [
                                h('Button', {
                                    props: { size: 'small' },
                                    on: {
                                        'click': () => {
                                            this.editClickEvent(params.row, params.row.id);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        disabled: disableDelete
                                    },
                                    style: { marginLeft: '4px' },
                                    on: {
                                        'click': () => {
                                            this.clickDeleteEvent(params.row.id);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                tableData: [],
                responseObj: null,
                disableModalConfirmButton: false
            };
        },
        methods: {
            closeDateOverEvent (e) {
                if (!e) {
                    if (this.formValidate.modalOverUpkeepValue !== '' && this.formValidate.modalStartUpkeepValue !== '') {
                        if (Date.parse(this.formValidate.modalOverUpkeepValue) < Date.parse(this.formValidate.modalStartUpkeepValue)) {
                            this.formValidate.modalOverUpkeepValue = '';
                            emptyTips(this, '保养结束时间不能小于保养开始时间!');
                        };
                    };
                }
            },
            closeDateStartEvent (e) {
                if (!e) {
                    if (this.formValidate.modalOverUpkeepValue !== '' && this.formValidate.modalStartUpkeepValue !== '') {
                        if (Date.parse(this.formValidate.modalStartUpkeepValue) > Date.parse(this.formValidate.modalOverUpkeepValue)) {
                            this.formValidate.modalStartUpkeepValue = '';
                            emptyTips(this, '保养开始时间不能大于保养结束时间!');
                        };
                    };
                }
            },
            // 监听组件的状态
            visibleChangeEvent (e) {
                this.seePartsModalState = e;
                if (e === false) { this.spinShow = false; };
            },
            // 配件的点击事件
            clickPartsReplaceEvent (e) {
                if(this.checkId !== '' && this.checkId !== null){
                    if (e === '申请' && this.disableCreateParts === false) {
                        this.$router.push({
                            path: 'addPartsReplace',
                            query: {
                                isUpkRep: 1,
                                id: this.checkId,
                                activated: true
                            }
                        });
                    } else if (e === '查看' && this.disableSeeParts === false){
                        this.spinShow = true;
                        this.seePartsModalState = true;
                        this.seePartsLoading = true;
                        this.$api.parts.upkeepPartsList({
                            "sourceCode":this.checkSourceCode
                        }).then(res => {
                            if(res.data.status === 200){
                                this.spinShow = false;
                                this.seePartsLoading = false;
                                this.seePartsTableData = res.data.res;
                            };
                        })
                    };
                } else{
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 查看配件modal的取消事件
            seePartsCancelEvent () {
                this.seePartsModalState = false;
            },
            // 表格row颜色
            rowClassName (row) {
                if (row.expectMaintenanceTime !== null && row.expectMaintenanceTime !== 0) {
                    let d = new Date();
                    let year = d.getFullYear();
                    let month = d.getMonth() + 1;
                    let day = d.getDate();
                    let nowTimeStamp = new Date(year + '-' + month + '-' + day).getTime();
                    let planTimeStamp = new Date(row.expectMaintenanceTime).getTime();
                    if (planTimeStamp <= nowTimeStamp) {
                        return 'tableRowBackground';
                    };
                };
            },
            // 删除的事件
            clickDeleteEvent (id) {
                this.checkId = id;
                this.deleteTipsMsg = '确认删除?';
                this.deleteTipsState = true;
            },
            // 删除modal的取消事件
            deleteTipsCancel () {
                this.deleteTipsMsg = '';
                this.deleteButtonLoading = false;
                this.deleteTipsState = false;
            },
            // 删除modal的确认事件
            deleteTipsConfirm () {
                this.deleteButtonLoading = true;
                this.$api.upkeep.machineUpkeepCodeDeleteHttp({id: this.checkId}).then(res => {
                    if (res.data.status === 200) {
                        this.deleteTipsMsg = '';
                        this.deleteButtonLoading = false;
                        this.deleteTipsState = false;
                        noticeTips(this, 'deleteTips');
                        this.getListHttp();
                    } else {
                        this.deleteButtonLoading = false;
                    };
                });
            },
            // 编辑的事件
            editClickEvent (obj, id) {
                // 已完成和创建时，允许编辑
                if (obj.completionState === 2 && obj.auditState === 1) {
                    this.disableModalConfirmButton = false;
                } else {
                    this.disableModalConfirmButton = true;
                };
                this.isEdit = true;
                this.modalContentSpinShow = true;
                this.checkId = id;
                this.startUpkeepModalTitle = '编辑保养单';
                this.getDetailHttp();
            },
            // 完成保养的点击事件
            overUpkeepEvent () {
                if (this.checkId !== '' && this.checkId !== null) {
                    this.isEdit = false;
                    this.modalContentSpinShow = true;
                    this.startUpkeepModalTitle = '完成保养';
                    this.getDetailHttp();
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            // 勾选事件
            getCheckBoxEvent (obj) {
                if (obj) {
                    this.checkId = obj.id;
                    this.checkSourceCode = obj.code;
                    if (obj.completionState === 2) {
                        // 已完成
                        this.disableCreateParts = true;
                        this.disableOverUpkeep = true;
                        if (obj.auditState === 4) {
                            this.closeSwitch = true;
                            this.openSwitch = false;
                        } else if (obj.auditState === 1) {
                            this.closeSwitch = false;
                            this.openSwitch = true;
                        };
                    } else if (obj.completionState === 1) {
                        // 进行中
                        this.disableCreateParts = false;
                        this.disableOverUpkeep = false;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    } else if (obj.completionState === 0) {
                        // 未开始
                        this.disableCreateParts = true;
                        this.disableOverUpkeep = false;
                        this.closeSwitch = true;
                        this.openSwitch = true;
                    };
                    // 判断配置更换状态
                    obj.isReplace === true ? this.disableSeeParts = false : this.disableSeeParts = true;
                } else {
                    this.disableCreateParts = true;
                    this.disableSeeParts = true;
                    this.checkSourceCode = '';
                    this.checkId = null;
                    this.disableOverUpkeep = true;
                    this.closeSwitch = true;
                    this.openSwitch = true;
                };
            },
            // 获取详情
            getDetailHttp () {
                this.$api.upkeep.upkeepCodeDetailHttp({ id: this.checkId }).then(res => {
                    if (res.data.status === 200) {
                        this.startUpkeepModal = true;
                        let responseData = res.data.res;
                        if (responseData.maintenanceOrderItemList) {
                            responseData.maintenanceOrderItemList.forEach((items) => {
                                let str = '';
                                if (items.lastMaintenanceTime !== null) {
                                    str = items.lastMaintenanceTime.split(' ')[0];
                                    this.$set(items, 'lastTime', str);
                                } else {
                                    this.$set(items, 'lastTime', '');
                                };
                            });
                            this.startUpkeepTableData = responseData.maintenanceOrderItemList;
                        };
                        this.responseObj = res.data.res;
                        this.modalUpkeepPlanCodeValue = responseData.maintenancePlanCode;
                        this.modalMachineUpkeepCodeValue = responseData.code;
                        this.modalWorkshopValue = responseData.workshopName;
                        this.modalProcessValue = responseData.processName;
                        this.modalMachineCodeValue = responseData.machineCode;
                        this.modalMachineNameValue = responseData.machineName;
                        this.modalUpkeepTypeValue = responseData.typeName;
                        this.modalUpkeepStateValue = responseData.completionStateName;
                        this.formValidate.modalStartUpkeepValue = responseData.beginTime;
                        this.formValidate.modalOverUpkeepValue = responseData.endTime;
                        this.modalKeyOverhaulValue = responseData.overhaul;
                        this.modalRemarksValue = responseData.remarks;
                        this.modalDescribeValue = responseData.maintenanceContents;
                        this.createName = responseData.createName;
                        this.createTime = responseData.createTime;
                        this.updateName = responseData.updateName;
                        this.updateTime = responseData.updateTime;
                        this.closeName = responseData.closeName;
                        this.closeTime = responseData.closeTime;
                        this.modalContentSpinShow = false;
                    };
                });
            },
            // 搜索事件
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
            // 获取每页条数
            getPageOptsEvent (e) {
                this.pageSize = e;
                this.getListHttp();
            },
            // 获取页码
            getPageCodeEvent (e) {
                this.pageIndex = e;
                this.getListHttp();
            },
            // 关闭
            closeHttp () {
                let ids = [];
                ids.push(this.checkId);
                this.$api.upkeep.machineUpkeepCodeCloseHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.checkId = null;
                        noticeTips(this, 'closeTips');
                    };
                });
            },
            // 反关闭
            openHttp () {
                let ids = [];
                ids.push(this.checkId);
                this.$api.upkeep.machineUpkeepCodeUncloseHttp(ids).then(res => {
                    if (res.data.status === 200) {
                        this.getListHttp();
                        this.checkId = null;
                        noticeTips(this, 'unCloseTips');
                    };
                });
            },
            // 关闭事件
            getCloseEvent (e) {
                if (e === '关闭' && this.closeSwitch === false) {
                    this.closeHttp();
                } else if (e === '反关闭' && this.openSwitch === false) {
                    this.openHttp();
                };
            },
            // 确认事件
            confirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.$set(this.responseObj, 'beginTime', formatDate(this.formValidate.modalStartUpkeepValue));
                        this.$set(this.responseObj, 'endTime', formatDate(this.formValidate.modalOverUpkeepValue));
                        this.$set(this.responseObj, 'overhaul', this.modalKeyOverhaulValue);
                        this.$set(this.responseObj, 'remarks', this.modalRemarksValue);
                        this.$set(this.responseObj, 'maintenanceContents', this.modalDescribeValue);
                        if (this.isEdit === false) {
                            this.buttonLoading = true;
                            this.$api.upkeep.machineUpkeepCodeEndHttp(this.responseObj).then(res => {
                                if (res.data.status === 200) {
                                    this.startUpkeepModal = false;
                                    this.buttonLoading = false;
                                    this.isEdit = false;
                                    this.getListHttp();
                                    noticeTips(this, 'saveTips');
                                } else {
                                    this.buttonLoading = false;
                                };
                            });
                        } else {
                            this.buttonLoading = true;
                            this.$api.upkeep.machineUpkeepCodeEditHttp(this.responseObj).then(res => {
                                if (res.data.status === 200) {
                                    this.startUpkeepModal = false;
                                    this.buttonLoading = false;
                                    this.isEdit = false;
                                    this.getListHttp();
                                    noticeTips(this, 'saveTips');
                                } else {
                                    this.buttonLoading = false;
                                };
                            });
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    }
                });
            },
            // 监听modal状态
            getModalChangeEvent (e) {
                if (e === false) {
                    this.initModalData();
                };
            },
            // 取消事件
            cancelEvent () {
                this.initModalData();
            },
            // 初始化modal数据
            initModalData () {
                this.buttonLoading = false;
                this.disableModalConfirmButton = false;
                this.modalContentSpinShow = false;
                this.isEdit = false;
                this.startUpkeepModal = false;
                this.startUpkeepModalTitle = '';
                this.modalUpkeepPlanCodeValue = '';
                this.modalMachineUpkeepCodeValue = '';
                this.modalWorkshopValue = '';
                this.modalProcessValue = '';
                this.modalUpkeepTypeValue = '';
                this.formValidate.modalStartUpkeepValue = '';
                this.formValidate.modalOverUpkeepValue = '';
                this.modalKeyOverhaulValue = '';
                this.modalRemarksValue = '';
                this.modalDescribeValue = '';
                this.startUpkeepTableData = [];
                this.$refs['formValidate'].resetFields();
            },
            // 获取列表的请求
            getListHttp () {
                this.queryBarUpkeepCode = clearSpace(this.queryBarUpkeepCode);
                this.queryBarPlanCode = clearSpace(this.queryBarPlanCode);
                return this.$api.upkeep.machineUpkeepCodeListHttp({
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    workshopId: this.queryBarWorkshop,
                    processId: this.queryBarProcess,
                    code: this.queryBarUpkeepCode,
                    maintenancePlanCode: this.queryBarPlanCode,
                    completionState: this.queryBarUpkeepState,
                    auditState: this.queryBarPlanState
                }).then(res => {
                    if (res.data.status === 200) {
                        this.globalLoadingShow = false;
                        this.tableData = res.data.res;
                        this.pageTotal = res.data.count;
                        this.initButtonState();
                    };
                });
            },
            initButtonState () {
                this.disableCreateParts = true;
                this.disableSeeParts = true;
                this.closeSwitch = true;
                this.openSwitch = true;
            },
            // 车间的请求
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
                            // 赋值下拉框
                            this.queryBarWorkshopList = res.data.res;
                        };
                    };
                });
            },
            // 获取设备保养状态
            getMachineUpkeepState () {
                this.$api.upkeep.planCodeUpkeepStateHttp().then(res => {
                    if (res.data.status === 200) this.queryBarUpkeepStateList = res.data.res;
                });
            },
            // 获取保养单据的状态
            getUpkeepCodeStateHttp () {
                this.$api.upkeep.machineUpkeepCodeStateHttp().then(res => {
                    if (res.data.status === 200) this.queryBarPlanStateList = res.data.res;
                });
            },
            // 获取保养类型的请求
            getUpkeepTypeHttp () {
                this.$api.upkeep.upkeepTypeListHttp().then(res => {
                    if (res.data.status === 200) this.upkeepTypeList = res.data.res;
                });
            },
            getProcessListHttp () {
                this.$api.process.getSearchProcessList().then(res => {
                    this.queryBarProcessList = res;
                });
            }
        },
        created () {
            this.globalLoadingShow = true;
            this.getProcessListHttp();
            this.getMachineUpkeepState();
            (async () => {
                await this.getWorkshop();
                await this.getListHttp();
            })();
            this.getUpkeepCodeStateHttp();
            this.getUpkeepTypeHttp();
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
<style>
    .ivu-table .tableRowBackground td{
        color: red;
    }
</style>

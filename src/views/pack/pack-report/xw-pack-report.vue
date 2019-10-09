<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'报工状态'" :curTabStateId="curPackStateId" :stateList="packStateList">
            <div slot="content">
                <Row id="selectedHeight" class="parentFlexBetween">
                    <Col class="leftFlex">
                        <Button v-show="curPackStateId === 0" class="marginBottom margin-right-5" type="primary" @click="addPackData">员工补报</Button>
                        <Button v-show="curPackStateId === 0" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="primary" @click="firstAudit">审核</Button>
                        <Button v-show="curPackStateId === 0" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="warning" @click="deletePack">删除</Button>
                        <Button v-show="curPackStateId === 1" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="warning" @click="unfirstAudit">撤销班长审核</Button>
                        <Button v-show="curPackStateId === 1" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="primary" @click="secondAudit">主任审核</Button>
                        <Button v-show="curPackStateId === 2" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="warning" @click="unsecondAudit">撤销主任审核</Button>
                        <Button v-show="curPackStateId === 2" class="marginBottom margin-right-5" :disabled="!selectedIds.length" type="primary" @click="thirdAudit">入库</Button>
                    </Col>
                    <Col>
                        <span class="formSpanStyle">日期：</span>
                        <!--<DatePicker type="date" placeholder="请选择日期" @on-change="changeStartDate" clearable class="formEachStyle" :value="dateFrom"></DatePicker>-->
                        <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                        <!--<span class="formSpanStyle">结束日期：</span>-->
                        <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                        <Select class="formEachStyle textLeft" clearable v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                        <Select class="formEachStyle textLeft" placeholder="请选择班组" clearable v-model="groupId">
                            <Option v-for="item in groupList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                        <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    </Col>
                </Row>
                <Table class="marginBottom" border @on-selection-change="changeSelectChange" :height="tableHeight" :loading="packLoading" :data="packList" :columns="packColumns" size="small"></Table>
                <Page class="textRight" :total="packTotal" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
            </div>
        </layout>
        <modal
            :isShow="groupShow"
            :title="'班组报工明细'"
            :width="800"
            @submit="groupSubmit"
            @cancel="groupCancel"
        >
            <div slot="content">
                <div class="parentFlexBetween marginBottom">
                    <p>产品：{{ productName }}</p>
                    <p>批号：{{ batchCode }}</p>
                    <p>订单号：{{ proOrderCode }}</p>
                </div>
                <Table border :height="500" :data="groupReportList" :columns="groupReportColumns" size="small"></Table>
            </div>
        </modal>
        <modal
            :isShow="userShow"
            :title="'员工报工明细'"
            :width="800"
            @submit="userSubmit"
            @cancel="userCancel"
        >
            <div slot="content">
                <div class="parentFlexBetween marginBottom">
                    <p>产品：{{ productName }}</p>
                    <p>批号：{{ batchCode }}</p>
                    <p>订单号：{{ proOrderCode }}</p>
                </div>
                <Table border :height="500" :data="userReportList" :columns="userReportColumns" size="small"></Table>
            </div>
        </modal>
        <modal
            :isShow="addShow"
            :title="'补报班组报工'"
            :width="800"
            @submit="addSubmit"
            @cancel="addCancel"
        >
            <div slot="content">
                <Row>
                    <!--<DatePicker class="formEachStyle" @on-change="changeDate" type="date" placeholder="请选择日期" :clearable="false" :value="date"></DatePicker>-->
                    <DatePicker class="formEachStyle" clearable @on-change="changeDate" type="date" placeholder="请选择日期" :clearable="false" v-model="date"></DatePicker>
                    <Select class="formEachStyle textLeft" @on-change="changeGroup" clearable v-model="groupAddId" placeholder="请选择班组">
                        <Option v-for="item in groupAddList"  :value="item.groupId" :key="item.groupId">{{ item.groupName }}</Option>
                    </Select>
<!--                    <p>注意： 这里没有品种-订单--考虑一下是否展示</p>-->
                    <Button class="marginBottom" @click="searchOrder">确认补报班组</Button>
                </Row>
                <Table border :height="500" :data="addReportList" :columns="addReportColumns" size="small"></Table>
            </div>
        </modal>
        <modal
            :isShow="userPackShow"
            :title="'补报员工订单数据'"
            :width="800"
            @submit="userPackSubmit"
            @cancel="userPackCancel"
        >
            <div slot="content">
                <div class="parentFlexBetween marginBottom">
                    <p>产品：{{ productName }}</p>
                    <p>批号：{{ batchCode }}</p>
                    <p>订单号：{{ proOrderCode }}</p>
                </div>
                <Table border :height="500" :data="userPackList" :columns="userPackColumns" size="small"></Table>
            </div>
        </modal>
        <modal
            :isShow="packInstockShow"
            :title="'入库申请'"
            :width="800"
            @submit="packInstockSubmit"
            @cancel="packInstockCancel"
        >
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="入库申请单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">入库申请单自动生成</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="申请日期：" prop="code" class="formItemMargin">
                                <DatePicker class="formEachStyle" clearable @on-change="changeInDate" type="date" placeholder="请选择日期" :clearable="false" :value="formValidate.stockDate"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.workshopName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table border :data="packInList" :columns="packInColumns" :height="300"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import layout from '../../layout/layout';
import modal from '../../public/modal';
import {curDate} from '../../../libs/tools';
import {page} from "../../../libs/tools";
let _this;
export default {
    name: 'xw-pack-report',
    components: {
        layout,
        modal
    },
    data () {
        return {
            groupAddId: '',
            groupAddList: [],
            packInstockShow: false,
            packTotal: 0,
            pageSize: page().pageSize,
            paheIndex: 1,
            pageOpts: page().pageOpts,
            productCode: '',
            productName: '',
            batchCode: '',
            proOrderId: '',
            proOrderCode: '',
            orderList: {},
            dateFrom: '',
            dateTo: '',
            curPackStateId: 0,
            tableHeight: '',
            packLoading: false,
            packStateList: [],
            packColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '操作',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        _this = this;
                        return h('Button', {
                            on: {
                                'click': () => {
                                    this.proOrderId = params.row.prdOrderId;
                                    this.proOrderCode = params.row.prdOrderCode;
                                    this.productCode = params.row.productCode;
                                    this.productName = params.row.productName;
                                    this.batchCode = params.row.batchCode;
                                    this.orderList = params.row;
                                    _this.$call('pack.report.user.list2', {id: params.row.id}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.groupReportList = content.res;
                                            _this.groupShow = true;
                                        }
                                    });
                                }
                            }
                        }, '班组报工明细');
                    }
                },
                {
                    title: '报工日期',
                    key: 'date',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '产品',
                    key: 'productName',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '订单号',
                    key: 'prdOrderCode',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '报工包数',
                    key: 'totalNumber',
                    minWidth: 110,
                    align: 'right'
                },
                {
                    title: '报工产量(Kg)',
                    key: 'totalQty',
                    minWidth: 100,
                    align: 'right'
                },
                {
                    title: '入库包数',
                    key: 'inStockPacketQty',
                    minWidth: 110,
                    align: 'right'
                },
                {
                    title: '入库重量(Kg)',
                    key: 'inWeightPacketQty',
                    minWidth: 100,
                    align: 'right'
                },
                {
                    title: '未入库包数',
                    key: 'onStockPacketQty',
                    minWidth: 110,
                    align: 'right'
                },
                {
                    title: '未入库重量(Kg)',
                    key: 'onWeightPacketQty',
                    minWidth: 100,
                    align: 'right'
                }
            ],
            packList: [],
            groupShow: false,
            groupReportList: [],
            groupReportColumns: [
                {
                    title: '操作',
                    align: 'center',
                    width: 130,
                    render: (h, params) => {
                        _this = this;
                        return h('Button', {
                            on: {
                                'click': () => {
                                    _this.$call('pack.report.user.list3', {packReportId: params.row.packReportId, reporterId: params.row.reporterId}).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.userReportList = content.res;
                                        }
                                    });
                                    _this.userShow = true;
                                }
                            }
                        }, '员工报工明细');
                    }
                },
                {
                    title: '工号',
                    key: 'reporterCode',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '员工姓名',
                    key: 'reporterName',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '报工重量(Kg)',
                    key: 'reportQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '报工包数',
                    key: 'packNumber',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            userShow: false,
            userReportList: [],
            userReportColumns: [
                {
                    title: '工号',
                    key: 'reporterCode',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '员工姓名',
                    key: 'reporterName',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '是否自动打包',
                    key: 'isAuto',
                    minWidth: 110,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('div', {
                            domProps: {
                                innerHTML: params.row.isAuto ? '是' : '否'
                            }
                        });
                    }
                },
                {
                    title: '报工时间',
                    key: 'reportTime',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '报工重量(Kg)',
                    key: 'reportQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '报工包数',
                    key: 'packNumber',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            addShow: false,
            date: curDate(),
            addReportList: [],
            addReportColumns: [
                {
                    title: '产品',
                    key: 'productName',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '订单号',
                    key: 'code',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '当班产量(Kg)',
                    key: 'totalQty',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '操作',
                    minWidth: 110,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    if (!_this.date || !_this.groupAddId) {
                                        _this.$Modal.warning({
                                            title: '提示',
                                            content: '<p>请先确认补报员工班组数据！</p>'
                                        });
                                        return false;
                                    }
                                    _this.proOrderId = params.row.id;
                                    _this.proOrderCode = params.row.code;
                                    _this.productCode = params.row.productCode;
                                    _this.productName = params.row.productName;
                                    _this.batchCode = params.row.batchCode;
                                    _this.orderList = params.row;
                                    let para = {
                                        date: new Date(_this.date).toLocaleDateString().replace(/\//g, '-'),
                                        prdOrderId: params.row.id,
                                        groupId: _this.groupAddId
                                    };
                                    _this.$call('pack.report.supplement', para).then(res => {
                                        let content = res.data;
                                        if (content.status === 200) {
                                            _this.userPackList = content.res;
                                        }
                                    });
                                    _this.userPackShow = true;
                                }
                            }
                        }, '员工补报');
                    }
                }
            ],
            groupId: '',
            groupList: [],
            userPackShow: false,
            userPackList: [],
            userPackColumns: [
                {
                    title: '操作',
                    key: 'code',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                'click': () => {
                                    _this.userPackList.splice(params.index + 1, 0, {
                                        id: null,
                                        reporterId: params.row.reporterId,
                                        reporterName: params.row.reporterName,
                                        reporterCode: params.row.reporterCode,
                                        reportQty: null,
                                        packNumber: null,
                                        isAuto: false
                                    });
                                }
                            }
                        }, '+');
                    }
                },
                {
                    title: '人员编号',
                    key: 'reporterCode',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '员工姓名',
                    key: 'reporterName',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '报工时间',
                    key: 'reportTime',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '是否自动打包',
                    key: 'isAuto',
                    align: 'center',
                    minWidth: 90,
                    render: (h, params) => {
                        _this = this;
                        return h('Checkbox', {
                            props: {
                                value: params.row.isAuto ? params.row.isAuto : false
                            },
                            on: {
                                'on-change': (e) => {
                                    params.row.isAuto = e;
                                    _this.userPackList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '折合包数',
                    key: 'packNumber',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            style: {
                                width: '100%'
                            },
                            props: {
                                value: params.row.packNumber
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.packNumber = val;
                                    params.row.reportQty = val * 25;
                                    this.userPackList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '报工重量(Kg)',
                    key: 'reportQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            style: {
                                width: '100%'
                            },
                            props: {
                                value: params.row.reportQty,
                                min: 0
                            },
                            on: {
                                'on-change': (val) => {
                                    // debugger
                                    params.row.reportQty = val;
                                    this.userPackList[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            workshopId: '',
            workshopList: [],
            selectedIds: [],
            formValidate: {
                stockDate: curDate(),
                workshopName: ''
            },
            ruleValidate: {},
            stockDate: curDate(),
            packInList: [],
            packInColumns: [
                {
                    title: '序号',
                    key: 'index',
                    align: 'center',
                    width: 60,
                    render: (h, params) => {
                        return h('span', {}, params.index + 1);
                    }
                },
                {
                    title: '产品',
                    key: 'productName',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '未入库包数',
                    key: 'onStockPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '未入库重量',
                    key: 'onWeightPacketQty',
                    align: 'left',
                    minWidth: 90
                },
                {
                    title: '入库包数',
                    key: 'inStockPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.inStockPacketQty,
                                max: params.row.onStockPacketQty
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.inStockPacketQty = val;
                                    params.row.inWeightPacketQty = Math.ceil(params.row.inStockPacketQty * 25);
                                    this.packInList[params.index] = params.row;
                                    this.getTotal();
                                }
                            }
                        });
                    }
                },
                {
                    title: '入库重量',
                    key: 'inWeightPacketQty',
                    minWidth: 100,
                    sortable: true,
                    align: 'left',
                    render: (h, params) => {
                        return h('InputNumber', {
                            props: {
                                value: params.row.inWeightPacketQty,
                                max: params.row.onWeightPacketQty
                            },
                            style: {
                                width: '100%'
                            },
                            on: {
                                'on-change': (val) => {
                                    params.row.inWeightPacketQty = val;
                                    // params.row.inStockPacketQty = Math.ceil(params.row.inStockPacketQty / 25);
                                    this.packInList[params.index] = params.row;
                                    this.getTotal();
                                }
                            }
                        });
                    }
                }
            ]
        };
    },
    methods: {
        changeInDate (val) {
            this.formValidate.stockDate = val;
        },
        packInstockSubmit () {
            let params = {
                date: this.formValidate.stockDate,
                workshopName: this.formValidate.workshopName,
                workshopId: this.formValidate.workshopId,
                inStockPacketQty: this.packInList[this.packInList.length - 1].inStockPacketQty,
                inWeightPacketQty: this.packInList[this.packInList.length - 1].inWeightPacketQty,
                packInStockProductList: []
            };
            params.packInStockProductList = this.packInList.slice(0, this.packInList.length - 1).map(x => {
                return {
                    productId: x.productId,
                    productName: x.productName,
                    productCode: x.productCode,
                    productModels: x.productModels,
                    batchCode: x.batchCode,
                    unitId: x.unitId,
                    unitCode: x.unitCode,
                    unitName: x.unitName,
                    inStockPacketQty: x.inStockPacketQty,
                    inWeightPacketQty: x.inWeightPacketQty,
                    packReportIds: x.packReportIds
                };
            });
            this.$call('pack.in.stock.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功！');
                    this.getPackReportStateCount();
                    this.packInstockShow = false;
                }
            });
        },
        packInstockCancel () {
            this.packInstockShow = false;
        },
        // 判断是否有默认车间
        getUserWorkshops () {
            this.$call('user/data/workshops2').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopId = content.res.defaultDeptId;
                    this.workshopList = content.res.userData;
                    this.getUserGroup();
                }
            });
        },
        getUserGroup () {
            this.$call('user/data/groups3', {parentId: this.workshopId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.groupId = content.res.defaultDeptId;
                    this.groupList = content.res.userData;
                    this.getPackReportStateCount();
                }
            });
        },
        searchResult () {
            this.getPackReportStateCount();
        },
        changeStartDate (val) {
            this.dateFrom = val;
        },
        changeEndDate (val) {
            this.dateTo = val;
        },
        getPackReportStateCount () {
            this.$call('pack.report.stateCount', {workshopId: this.workshopId, groupId: this.groupId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.packStateList = content.res;
                    // this.curPackStateId = content.res[0].id;
                    this.getPackReportlist();
                }
            });
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getPackReportStateCount();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getPackReportStateCount();
        },
        getPackReportlist () {
            let params = {
                workshopId: this.workshopId,
                groupId: this.groupId,
                packState: this.curPackStateId,
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.packLoading = true;
            this.$call('pack.report.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.packTotal = content.count;
                    this.packList = content.res;
                    this.packLoading = false;
                    this.selectedIds = [];
                } else {
                    this.packList = [];
                }
            });
        },
        selectMenu (val) {
            this.dateFrom = '';
            this.dateTo = '';
            this.curPackStateId = val.id;
            this.pageIndex = 1;
            this.getPackReportStateCount();
        },
        groupSubmit () {
            this.groupShow = false;
            setTimeout(() => {
                this.date = curDate();
            }, 0);
        },
        groupCancel () {
            this.groupShow = false;
            setTimeout(() => {
                this.date = curDate();
            }, 0);
        },
        userSubmit () {
            this.userShow = false;
        },
        userCancel () {
            this.userShow = false;
        },
        addPackData () {
            this.addReportList = [];
            this.schduleGroup();
        },
        schduleGroup () {
            this.groupAddId = '';
            this.addReportList = [];
            // 根据时间获取当天班组数据
            let params = {
                workshopId: this.workshopId,
                dateFrom: new Date(this.date).toLocaleDateString().replace(/\//g, '-'),
                dateTo: new Date(this.date).toLocaleDateString().replace(/\//g, '-')
            };
            this.$call('schedule/group/list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.groupAddList = content.res;
                    this.addShow = true;
                }
            });
        },
        searchOrder () {
            if (!this.groupAddId) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请先选择班组！</p>'
                });
                return false;
            }
            let params = {
                workshopId: this.workshopId,
                date: new Date(this.date).toLocaleDateString().replace(/\//g, '-'),
                groupId: this.groupAddId
            };
            this.$call('prd.order.pack.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.addReportList = content.res;
                }
            });
        },
        changeDate (val) {
            this.date = val;
            this.groupAddId = '';
            this.addReportList = [];
            this.addPackData();
        },
        changeGroup () {
            this.addReportList = [];
        },
        addSubmit () {
            this.date = curDate();
            this.addShow = false;
        },
        addCancel () {
            this.date = curDate();
            this.addShow = false;
        },
        userPackSubmit () {
            let params = {
                packReportDetailList: []
            };
            params.date = new Date(this.date).toLocaleDateString().replace(/\//g, '-');
            params.workshopId = this.orderList.workshopId;
            params.workshopName = this.orderList.workshopName;
            params.groupId = this.groupAddId;
            params.groupName = this.groupAddList.find(x => x.groupId === this.groupAddId).groupName;
            params.productId = this.orderList.productId;
            params.productName = this.orderList.productName;
            params.productCode = this.orderList.productCode;
            params.productModels = this.orderList.productModels;
            params.batchCode = this.orderList.batchCode;
            params.prdOrderId = this.orderList.id;
            params.prdOrderCode = this.orderList.code;
            params.unitId = this.orderList.unitId;
            params.unitCode = this.orderList.unitCode;
            params.unitName = this.orderList.unitName;
            this.userPackList.map(item => {
                if (!item.id && !item.reportQty) {
                    //
                } else {
                    params.packReportDetailList.push({
                        id: item.id,
                        reportQty: item.reportQty,
                        packNumber: item.packNumber,
                        reporterId: item.reporterId,
                        reporterName: item.reporterName,
                        reporterCode: item.reporterCode,
                        isAuto: item.isAuto
                    });
                }
            });
            this.$call('pack.report.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('保存成功');
                    this.getPackReportStateCount();
                    this.userPackShow = false;
                }
            });
        },
        userPackCancel () {
            this.userPackShow = false;
        },
        changeSelectChange (val) {
            this.selectedIds = val.map(x => x.id);
        },
        // 班长审核
        firstAudit () {
            this.$call('pack.report.monitor.approve', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('审核成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        deletePack () {
            this.$call('pack.report.delete', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('删除成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        // 撤销班长反审核
        unfirstAudit () {
            this.$call('pack.report.monitor.unapprove', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销班长审核成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        secondAudit () {
            this.$call('pack.report.director.approve', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('主任审核成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        unsecondAudit () {
            this.$call('pack.report.director.unapprove', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销主任审核成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        thirdAudit () {
            _this = this;
            this.formValidate.workshopName = this.workshopList.find(x => x.deptId === this.workshopId).deptName;
            this.formValidate.workshopId = this.workshopId;
            this.$call('pack.in.stock.apply', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res.length) {
                        _this.packInList = content.res;
                        _this.packInList.push(
                            {
                                batchCode: '合计',
                                onStockPacketQty: 0,
                                onWeightPacketQty: 0,
                                inStockPacketQty: 0,
                                inWeightPacketQty: 0
                            }
                        );
                        _this.getTotal();
                    } else {
                        _this.packInList = [];
                    }
                    _this.packInstockShow = true;
                }
            });
        },
        getTotal () {
            let onStockPacketQty = 0;
            let onWeightPacketQty = 0;
            let inStockPacketQty = 0;
            let inWeightPacketQty = 0;
            // debugger
            this.packInList.slice(0, this.packInList.length - 1).map(x => {
                onStockPacketQty += (x.onStockPacketQty === null ? 0 : x.onStockPacketQty);
                onWeightPacketQty += (x.onWeightPacketQty === null ? 0 : x.onWeightPacketQty);
                inStockPacketQty += (x.inStockPacketQty === null ? 0 : x.inStockPacketQty);
                inWeightPacketQty += (x.inWeightPacketQty === null ? 0 : x.inWeightPacketQty);
            });
            this.packInList[this.packInList.length - 1].onStockPacketQty = onStockPacketQty;
            this.packInList[this.packInList.length - 1].onWeightPacketQty = onWeightPacketQty;
            this.packInList[this.packInList.length - 1].inStockPacketQty = inStockPacketQty;
            this.packInList[this.packInList.length - 1].inWeightPacketQty = inWeightPacketQty;
        },
        unthirdAudit () {
            this.$call('pack.report.cancel.inStock', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销入库成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        closeDate () {
            this.$call('pack.report.close', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('关闭成功！');
                    this.getPackReportStateCount();
                }
            });
        },
        uncloseDate () {
            this.$call('pack.report.unclose', this.selectedIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$Message.success('撤销关闭成功！');
                    this.getPackReportStateCount();
                }
            });
        }
        // selectMenu () {},
    },
    created () {
        _this = this;
        this.getUserWorkshops();
    },
    mounted () {
        _this = this;
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        };
    }
};
</script>

<style scoped>
.margin-right-5{
    margin-right: 5px;
}
</style>

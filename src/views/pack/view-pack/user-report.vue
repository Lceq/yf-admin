<template>
    <div id="view-pack" class="user-report" style="padding: 30px;">
        <div class="endFlex marginBottom-20">
            <div class="user-report-return" style="margin-right: 20px;" @click="submitReport">提交</div>
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <Form :label-width="160" ref="userReportValidate" :model="userReportList" :rules="userReportRules" :show-message="false">
            <Row>
                <Col span="6">
                    <FormItem label="产品：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.productName}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="批号：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.batchCode}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="订单号：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.code}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="封包绳颜色：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.bagMouthName}}</p>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <FormItem label="纸筒颜色：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.paperTubeName}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="腰绳颜色：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.waistRopeName}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="装袋要求：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.packetQty}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="编织袋规格：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.packingBag}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="包重范围：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.packetWeightMin}} - {{userReportList.orderPackingEntity.packetWeightMax}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="订单数量：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.productionQty}}</p>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="未完成数量：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.onCompletionQty}}</p>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="6">
                    <FormItem label="当班报工总量：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.totalQty}}</p>
                    </FormItem>
                </Col>
            </Row>
        </Form>
        <Table  v-if="tableContentShow" :height="tableHeight" border :data="userReportTableList" :columns="userReportColumns"></Table>
        <left-right
            :pageTotal="pageTotal"
            :pageIndex="pageIndex"
            @leftRightClick="leftRightClick"
        ></left-right>
        <fixed-number
            :fixedNumber="fixedNumber"
            :isShowNumber="isShowNumber"
            @submitNumber="submitNumber"
            @cancelNumber="cancelNumber"
        ></fixed-number>
        <success-tip
            :tipMessage="tipMessage"
            :successShow="successShow"
        ></success-tip>
    </div>
</template>

<script>
import fixedNumber from './fixed-number';
import leftRight from './left-right';
import xwTableContent from '../../components/xw-table/xw-table-content';
import {curDate} from '../../../libs/tools';
import {breakUpList} from "../../../libs/tools";
import successTip from './success-tip';
export default {
    name: 'user-report',
    // computed: {
    //     numberKey () {
    //         return this.$store.state.app.numberKey;
    //     }
    // },
    components: {
        leftRight,
        fixedNumber,
        successTip,
        xwTableContent
    },
    props: {
        loginMes: {
            type: Array,
            default: []
        },
        isUserReport: {
            type: Boolean,
            default: false
        },
        curOrderId: {
            type: Number
        },
        isUserActiveShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tipMessage: '',
            fixedNumber: 0,
            leftRightShow: true,
            successShow: false,
            valueNumber: 1,
            tableContentShow: true,
            tableHeight: null,
            isShowNumber: false,
            changeTableState: false,
            userReportValidate: {},
            userReportRules: {},
            userReportList: {
                orderPackingEntity: {
                    bagMouthName: '',
                    paperTubeName: '',
                    waistRopeName: '',
                    packetQty: '',
                    packingBag: '',
                    packetWeightMin: '',
                    packetWeightMax: ''
                },
                packReportDetailList: [
                ]
            },
            userReportTableList: [],
            userReportColumns: [
                {
                    title: '人员编号',
                    key: 'reporterCode',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '包装人',
                    key: 'reporterName',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '已报工重量',
                    key: 'reportQty',
                    minWidth: 90,
                    align: 'center'
                },
                {
                    title: '已报工包数',
                    key: 'packNumber',
                    minWidth: 100,
                    align: 'center'
                },
                {
                    title: '是否自动打包',
                    key: 'isAuto',
                    minWidth: 100,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('Checkbox', {
                            props: {
                                value: params.row.isAuto
                            },
                            on: {
                                'on-change': (e) => {
                                    params.row.isAuto = e;
                                    _this.userReportTableListTotal[params.index].isAuto = e;
                                    _this.userReportTableList[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '包装重量(Kg)',
                    key: 'qty',
                    minWidth: 110,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', {
                            style: {
                                width: '100%',
                                textAlign: 'left',
                                border: '1px solid #dcdee2',
                                padding: '5px 5px',
                                borderRadius: '5px'
                            },
                            on: {
                                'click': () => {
                                    _this.fixedNumber = params.row.qty;
                                    setTimeout(() => {
                                        _this.isShowNumber = true;
                                    }, 0);
                                    _this.dataIndex = params.index;
                                    _this.dataName = 'qty';
                                }
                            }
                        }, params.row.qty);
                    }
                },
                {
                    title: '折合包数',
                    key: 'number',
                    minWidth: 90,
                    align: 'center',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', {
                            style: {
                                width: '100%',
                                textAlign: 'left',
                                border: '1px solid #dcdee2',
                                padding: '5px 5px',
                                borderRadius: '5px'
                            },
                            on: {
                                'click': () => {
                                    _this.fixedNumber = params.row.number;
                                    setTimeout(() => {
                                        _this.isShowNumber = true;
                                    }, 0);
                                    _this.dataIndex = params.index;
                                    _this.dataName = 'number';
                                }
                            }
                        }, params.row.number);
                    }
                }
            ],
            dataIndex: 0,
            dataName: '',
            pageIndex: 1,
            pageTotal: 1,
            realList: []
        };
    },
    methods: {
        leftRightClick (val) {
            this.pageIndex = val;
            this.userReportTableList = breakUpList(this.userReportTableListTotal, 8)[this.pageIndex - 1];
            this.tableContentShow = false;
            setTimeout(() => {
                this.tableContentShow = true;
            }, 0);
        },
        submitNumber (val) {
            this.isShowNumber = false;
            this.userReportTableList[this.dataIndex][this.dataName] = val;
            this.userReportTableListTotal[(this.pageIndex - 1) * 8 + this.dataIndex][this.dataName] = val;
            if (this.dataName === 'qty') {
                this.userReportTableList[this.dataIndex].number = Math.round(val / 25);
                this.userReportTableListTotal[(this.pageIndex - 1) * 8 + this.dataIndex].number = Math.round(val / 25);
            }
            this.tableContentShow = false;
            setTimeout(() => {
                this.tableContentShow = true;
            }, 0);
        },
        focusSubmit (key, index) {
            this.isShowNumber = true;
            this.dataIndex = index - 1;
            this.dataName = key;
        },
        getUserReport () {
            let params = {
                id: this.curOrderId,
                date: this.loginMes[0].date,
                groupId: this.loginMes[0].groupId
            };
            this.$call('prd.order.pack.detail', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.userReportList = content.res;
                    this.userReportTableListTotal = content.res.packReportDetailList.map(x => {
                        x.qty = 0;
                        x.number = 0;
                        x.isAuto = false;
                        return x;
                    });
                    this.userReportTableList = breakUpList(this.userReportTableListTotal, 8)[0];
                    this.pageTotal = Math.ceil(this.userReportTableListTotal.length / 8);
                }
            });
        },
        submitReport () {
            const _this = this;
            let params = {};
            params.date = this.loginMes[0].date;
            params.workshopId = this.userReportList.workshopId;
            params.workshopName = this.userReportList.workshopName;
            params.groupId = this.loginMes[0].groupId;
            params.groupName = this.loginMes[0].groupName;
            params.productId = this.userReportList.productId;
            params.productName = this.userReportList.productName;
            params.productCode = this.userReportList.productCode;
            params.productModels = this.userReportList.productModels;
            params.batchCode = this.userReportList.batchCode;
            params.prdOrderId = this.userReportList.id;
            params.prdOrderCode = this.userReportList.code;
            params.unitId = this.userReportList.unitId;
            params.unitCode = this.userReportList.unitCode;
            params.unitName = this.userReportList.unitName;
            // params.totalQty = this.userReportList.totalQty;
            // params.totalNumber = 0;
            params.packState = 0;
            params.packReportDetailList = [];
            this.userReportTableListTotal.map(item => {
                if (item.qty || item.number) {
                    params.packReportDetailList.push({
                        reportQty: item.qty,
                        packNumber: item.number,
                        reporterId: item.reporterId,
                        reporterName: item.reporterName,
                        reporterCode: item.reporterCode,
                        isAuto: item.isAuto ? item.isAuto : false
                    });
                }
            });
            if (params.packReportDetailList.length === 0) {
                this.tipMessage = '没有报工数据';
                this.successShow = true;
                setTimeout(() => {
                    this.successShow = false;
                }, 1000);
                return false;
            }
            this.$call('pack.report.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.$emit('submitReport');
                    this.tipMessage = '提交成功';
                    this.successShow = true;
                    _this.pageIndex = 1;
                    this.getUserReport();
                    setTimeout(() => {
                        this.successShow = false;
                    }, 1000);
                }
            });
        },
        cancelNumber () {
            this.isShowNumber = false;
        },
        returnReport () {
            this.$emit('returnReport', '1');
        }
    },
    watch: {
        isUserReport (newData, oldData) {
            if (newData) {
                this.getUserReport();
            } else {
                this.userReportTableList = [];
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.tableHeight = window.screen.height - 490;
        });
        window.onresize = () => {
            this.tableHeight = window.screen.height - 490;
        };
    }
};
</script>

<style scoped>
    .endFlex{
        /*margin: 10px 0;*/
    }
    .user-report-return{
        background-color: #f9f9f9;
        border-radius: 2px;
        padding: 10px 30px;
        font-size: 20px;
        border: 1px solid #515a6e;
    }
    /*.user-report{*/
        /*font-size: 20px;*/
    /*}*/
    .marginBottom-20{
        margin-bottom: 20px;
    }
    .formItemMargin{
        font-size: 16px !important;
    }
    .modal-readonly{
        font-size: 16px;
    }
</style>

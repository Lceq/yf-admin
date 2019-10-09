<template>
    <div class="user-report" >
        <div class="endFlex">
            <div class="user-report-return" style="margin-right: 5px;" @click="submitReport">提交</div>
            <div class="user-report-return" @click="returnReport">返回</div>
        </div>
        <Form :label-width="130" ref="userReportValidate" :model="userReportValidate" :rules="userReportRules" :show-message="false">
            <Row>
                <Col span="6">
                    <FormItem label="产品：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.productCode}}</p>
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
            </Row>
            <Row>
                <Col span="6">
                    <FormItem label="封包绳颜色：" prop="code" class="formItemMargin">
                        <p class="modal-readonly">{{userReportList.orderPackingEntity.bagMouthName}}</p>
                    </FormItem>
                </Col>
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
            </Row>
            <Row>
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
        <Table :height="tableHeight" border :data="userReportTableList" :columns="userReportColumns"></Table>
        <fixed-number
            :isShowNumber="isShowNumber"
            @submitNumber="submitNumber"
            @cancelNumber="cancelNumber"
        ></fixed-number>
    </div>
</template>

<script>
import fixedNumber from './fixed-number';
export default {
    name: 'user-report',
    components: {
        fixedNumber
    },
    props: {
        userReportList: {
            type: Object,
            default: {
                orderPackingEntity: {
                    bagMouthName: ''
                }
            }
        },
        userReportShow: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            tableHeight: '',
            isShowNumber: false,
            userReportValidate: {},
            userReportRules: {},
            userReportTableList: [
                {
                    code: '00001',
                    name: '张三'
                }
            ],
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
                    title: '包装重量',
                    key: 'qty',
                    minWidth: 110,
                    align: 'center',
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                value: params.row.qty
                            },
                            on: {
                                'on-focus': () => {
                                    // debugger;
                                    this.isShowNumber = true;
                                    // params.row.qty = this.submitNumber;
                                    // this.userReportList.packReportDetailList[params.index] = params.row;
                                    this.dataIndex = params.index;
                                    this.dataName = 'qty';
                                }
                            }
                        }, params.row.output);
                    }
                },
                {
                    title: '折合包数',
                    key: 'number',
                    minWidth: 90,
                    align: 'center'
                }
            ],
            dataIndex: 0,
            dataName: ''
        };
    },
    methods: {
        submitNumber (val) {
            this.isShowNumber = false;
            console.log(val);
            // debugger;
            // this.userReportTableList[this.dataIndex][this.dataName] = val;
            this.userReportTableList.map(x => {
                x.qty = 1;
                x.number = 1;
                return x;
            });
            // console.log(this.userReportTableList);
            // // debugger;
        },
        submitReport () {
            // console.log(this.userReportTableList);
            let params = {};
            params.date = '2019-06-26';
            params.workshopId = this.userReportList.workshopId;
            params.workshopName = this.userReportList.workshopName;
            params.groupId = 1027;
            params.groupName = '后纺甲班';
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
            params.totalQty = this.userReportList.totalQty;
            params.totalNumber = 0;
            params.packState = 0;
            params.packReportDetailList = this.userReportTableList.map(item => {
                return {
                    reportQty: item.qty,
                    packNumber: item.number,
                    reporterId: item.reporterId,
                    reporterName: item.reporterName,
                    reporterCode: item.reporterCode
                };
            });
            this.$call('pack.report.save', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    debugger
                }
            })
        },
        cancelNumber () {
            this.isShowNumber = false;
        },
        returnReport () {
            this.$emit('returnReport', '1');
        }
    },
    watch: {
        userReportShow (newData, oldData) {
            if (newData) {
                this.userReportTableList = this.userReportList.packReportDetailList.map(item => {
                    item.qty = 1;
                    item.number = 2;
                    return item;
                });
            } else {
                this.userReportTableList = [];
            }
        }
    },
    mounted () {
        this.$nextTick(() => {
            // this.tableHeight = document.documentElement.clientHeight - 350;
            this.tableHeight = window.screen.height - 470;
        });
        window.onresize = () => {
            this.tableHeight = window.screen.height - 470;
        };
    }
};
</script>

<style scoped>
    .user-report-return{
        background-color: #f9f9f9;
        border-radius: 2px;
        padding: 5px 20px;
        font-size: 14px;
        border: 1px solid #515a6e;
    }
    /*.user-report{*/
        /*font-size: 20px;*/
    /*}*/
    .formItemMargin{
        font-size: 16px !important;
    }
    .modal-readonly{
        font-size: 16px;
    }
</style>
<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row class="rightContentStyle headerMargin">
            <Col span="9" class="flex-left">
                <Button icon="md-checkmark" class="queryBarMarginRight" type="primary" @click="saveEvent">保存</Button>
                <Button icon="ios-create" class="queryBarMarginRight" type="primary" @click="submitEvent">提交</Button>
                <Button type="primary" class="queryBarMarginRight" @click="resetEvent">重置</Button>
            </Col>
        </Row>
        <div class="margin-top-20">
            <Form :label-width="100"  ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="领料申请单号:" class="formItemMargin">
                            <div class="modal-readonly">自动生成领料申请单号</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="申请日期:" prop="date" class="formItemMargin" :label-width="80">
                            <DatePicker :editable="false" type="date" v-model="formValidate.date" placeholder="请选择日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="8" :xxl="5">
                        <FormItem label="生产车间:" prop="workshopId" class="formItemMargin">
                            <Select label-in-value v-model="formValidate.workshopId" placeholder="请选择生产车间" @on-change="getWorkshopEvent">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col :sm="24" :md="24" :lg="24" :xl="16" :xxl="15">
                        <FormItem label="备注:" class="formItemMargin">
                            <Input :autosize="{minRows: 1,maxRows: 1}" v-model="formValidate.remark" type="textarea" placeholder="请输入"/>
                        </FormItem>
                    </Col>
                </Row>
                <Tabs v-model="activeTabs">
                    <TabPane label="基本信息" name="0">
                        <Row type="flex">
                            <Col :sm="24" :md="24" :lg="24" :xl="24" :xxl="24">
                                <Button icon="md-add" type="success" class="margin-bottom-10" @click="addPackChartEvent">添加配棉排包图</Button>
                                <div>
                                    <Table size="small" border :columns="tableHeader" :data="tableData"></Table>
                                </div>
                                <div class="total-bar">
                                    <p class="max-label-width item-line-height">合计：</p>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">配棉包数：</p>
                                        <p class="item-line-height text-left">{{packetQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">已领包数：</p>
                                        <p class="item-line-height text-left">{{usedPacketQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left apply-num-bar">
                                        <span class="max-label-width item-line-height text-left">申领包数：</span>
                                        <p class="item-line-height text-left">{{applyPacketQtyTotal}}</p>
                                    </div>
                                   <!-- <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">配棉重量：</p>
                                        <p class="item-line-height text-left">{{weightQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width apply-num-bar">
                                        <p class="max-label-width item-line-height text-left">已领重量：</p>
                                        <p class="item-line-height text-left">{{usedWeightQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width">
                                        <p class="middle-label-width item-line-height text-left margin-left-2">现存量：</p>
                                        <p class="item-line-height text-left">{{stockQtyTotal}}</p>
                                    </div>
                                    <div class="flex-left packet-bar-width">
                                        <p class="middle-label-width item-line-height text-left margin-left-2">可用量：</p>
                                        <p class="item-line-height text-left">{{usableQtyTotal}}</p>
                                    </div>-->
                                    <div class="flex-left apply-num-bar">
                                        <span class="max-label-width item-line-height ">申领重量：</span>
                                        <p class="item-line-height text-left">{{applyWeightQtyTotal}}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </Tabs>
            </Form>
        </div>
        <clear-tips-modal
                :tipsIcon="'md-help-circle'"
                :tipsModalState="clearTipsModalState"
                :tipsModalMessage="clearTipsModalMessage"
                @confirm-event="clearTipsModalConfirmEvent"
                @cancel-event="clearTipsModalCancelEvent"
        ></clear-tips-modal>
        <create-tips-modal
                :tipsIcon="'md-help-circle'"
                :tipsModalState="createTipsModalState"
                :tipsModalMessage="createTipsModalMessage"
                @confirm-event="createTipsModalConfirmEvent"
                @cancel-event="createTipsModalCancelEvent"
        ></create-tips-modal>
        <select-pack-chart-modal
                :selectedData="tableData"
                :selectPackChartModalState="selectPackChartModalState"
                @on-visible-change="selectPackChartModalStateChange"
                @on-confirm="selectPackChartModalConfirmEvent"
                @on-cancel="selectPackChartModalCancelEvent"
        ></select-pack-chart-modal>
    </card>
</template>
<script>
    import { mathJsAdd, mathJsSub, mathJsDiv, mathJsMul, toDaySeconds, toDay, setPage, noticeTips, compClientHeight, clearSpace, formatDate, getOperationData, emptyTips } from '../../../libs/common';
    import clearTipsModal from '../../components/tips-modal';
    import createTipsModal from '../../components/tips-modal';
    import selectPackChartModal from './select-pack-chart-modal';
    import moreOrder from '../archives/more-order';
    import moreMaterial from './more-material';
    let _this = this;
    export default {
        components: { clearTipsModal, createTipsModal, moreOrder, selectPackChartModal, moreMaterial },
        data () {
            const validateWorkshop = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            const validateDateValue = (rule, value, callback) => { value ? callback() : callback(new Error()); };
            return {
                stockQtyTotal: 0,
                usableQtyTotal: 0,
                selectPackChartModalState: false,
                packetQtyTotal: 0,
                usedPacketQtyTotal: 0,
                applyPacketQtyTotal: 0,
                weightQtyTotal: 0,
                usedWeightQtyTotal: 0,
                applyWeightQtyTotal: 0,
                globalLoadingShow: false,
                createTipsModalState: false,
                createTipsModalMessage: '',
                clearTipsModalMessage: '',
                clearTipsModalState: false,
                activeTabs: '0',
                formValidate: {
                    date: toDaySeconds(),
                    workshopId: null,
                    remark: ''
                },
                defaultWorkshop: null,
                ruleValidate: {
                    workshopId: [{required: true, validator: validateWorkshop, trigger: 'change'}],
                    date: [{required: true, validator: validateDateValue, trigger: 'change'}]
                },
                tableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 60,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        size: 'small',
                                        icon: 'md-remove'

                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.reduceTableButton(params.index);
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        width: 100,
                        title: '配棉版本号',
                        key: 'versionNumber'
                    },
                    {
                        width: 100,
                        title: '排包区域',
                        key: 'packingAreaName'
                    },
                    {
                        title: '次数',
                        key: 'number',
                        align: 'center',
                        width: 60/*,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.number,
                                        min: 0,
                                        max: 99999999
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.number = e;
                                            params.row.applicationDetailList.map(item => {
                                                item.applyPacketQty = mathJsMul(e, item.discQty);
                                                item.applyWeightQty = mathJsMul(item.packetWeight, item.applyPacketQty);
                                            });
                                            _this.tableData[params.index] = params.row;
                                            _this.calculateTotal();
                                        }
                                    }
                                })
                            ]);
                        }*/
                    },
                    {
                        title: '生产批号',
                        key: 'batchCode',
                        minWidth: 100
                    },
                    {
                        title: '生产单号',
                        key: 'prdOrderCodes',
                        minWidth: 120,
                        render: (h, params) => {
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: typeof params.row.prdOrderCodes === 'string' ? JSON.parse(params.row.prdOrderCodes) : params.row.prdOrderCodes
                                }
                            });
                        }
                    },
                    {
                        title: '原料',
                        key: 'productCode',
                        width: 900,
                        render: (h, params) => {
                            return h(moreMaterial, {
                                props: {
                                    listData: params.row.applicationDetailList
                                },
                                on: {
                                    'packet-change': (e, index) => {
                                        params.row.applicationDetailList[index].applyPacketQty = e;
                                        _this.tableData[params.index] = params.row;
                                        _this.calculateTotal();
                                    },
                                    'weight-change': (e, index) => {
                                        params.row.applicationDetailList[index].applyWeightQty = e;
                                        _this.tableData[params.index] = params.row;
                                        _this.calculateTotal();
                                    }
                                }
                            });
                        }
                    }
                ],
                tableData: [],
                workshopList: [],
                toCreated: false
            };
        },
        methods: {
            // 取消按钮事件
            selectPackChartModalCancelEvent () {
                this.selectPackChartModalState = false;
            },
            // 确认按钮事件
            selectPackChartModalConfirmEvent (e) {
                e.forEach(item => {
                    item.applicationDetailList.forEach(prdItem => {
                        if (prdItem.prdOrderCodes) {
                            typeof prdItem.prdOrderCodes === 'string' ? prdItem.prdOrderCodes = JSON.parse(prdItem.prdOrderCodes) : false;
                        } else {
                            prdItem.prdOrderCodes = [];
                        };
                    });
                });
                this.tableData = [...this.tableData, ...e];
                this.calculateTotal();
                this.selectPackChartModalState = false;
            },
            // 监听
            selectPackChartModalStateChange (e) {
                this.selectPackChartModalState = e;
            },
            // 合计
            calculateTotal () {
                this.packetQtyTotal = 0;
                this.usedPacketQtyTotal = 0;
                this.applyPacketQtyTotal = 0;
                this.weightQtyTotal = 0;
                this.usedWeightQtyTotal = 0;
                this.applyWeightQtyTotal = 0;
                this.stockQtyTotal = 0;
                this.usableQtyTotal = 0;
                this.tableData.forEach(item => {
                    item.applicationDetailList.forEach(subItem => {
                        this.packetQtyTotal = mathJsAdd(this.packetQtyTotal, subItem.packetQty);
                        this.usedPacketQtyTotal = mathJsAdd(this.usedPacketQtyTotal, subItem.usedPacketQty);
                        this.applyPacketQtyTotal = mathJsAdd(this.applyPacketQtyTotal, subItem.applyPacketQty);
                        this.weightQtyTotal = mathJsAdd(this.weightQtyTotal, subItem.weightQty);
                        this.usedWeightQtyTotal = mathJsAdd(this.usedWeightQtyTotal, subItem.usedWeightQty);
                        this.applyWeightQtyTotal = mathJsAdd(this.applyWeightQtyTotal, subItem.applyWeightQty);
                        this.stockQtyTotal = mathJsAdd(this.stockQtyTotal, subItem.stockQty);
                        this.usableQtyTotal = mathJsAdd(this.usableQtyTotal, subItem.usableQty);
                    });
                });
            },
            // 添加配棉排包图
            addPackChartEvent () {
                this.selectPackChartModalState = true;
            },
            createTipsModalConfirmEvent () {
                this.tableData = [];
                this.formValidate.remark = '';
                this.formValidate.date = '';
                this.createTipsModalState = false;
                this.activeTabs = '0';
                this.$refs['formValidate'].resetFields();
                this.packetQtyTotal = 0;
                this.usedPacketQtyTotal = 0;
                this.applyPacketQtyTotal = 0;
                this.weightQtyTotal = 0;
                this.usedWeightQtyTotal = 0;
                this.stockQtyTotal = 0;
                this.usableQtyTotal = 0;
                this.applyWeightQtyTotal = 0;
                this.getDependencyData();
            },
            createTipsModalCancelEvent () {
                this.createTipsModalState = false;
                this.$store.commit('removeTag', 'add-material-apply');// 关闭新增的快捷入口
                this.$router.push({
                    path: 'list-material-apply',
                    query: {
                        activated: true
                    }
                });
            },
            // 保存请求
            saveHttp () {
                let data = JSON.parse(JSON.stringify(this.tableData));
                data.forEach((allItem) => {
                    this.$delete(allItem, 'id');
                    allItem.applicationDetailList.forEach(item => {
                        item.prdOrderCodes = JSON.stringify(item.prdOrderCodes);
                        this.$delete(item, 'id');
                    });
                });
                return this.$call('prd.material.application.save', {
                    'code': this.formValidate.code,
                    'date': formatDate(this.formValidate.date),
                    'workshopId': this.formValidate.workshopId,
                    'workshopName': this.formValidate.workshopName,
                    'remark': this.formValidate.remark,
                    'applyPacketQty': this.applyPacketQtyTotal,
                    'applyWeightQty': this.applyWeightQtyTotal,
                    'applicationAreaList': data
                });
            },
            // 重置事件
            resetEvent () {
                this.clearTipsModalState = true;
                this.clearTipsModalMessage = '数据尚未保存，确认清空？';
            },
            // 清除提示modal的确认事件
            clearTipsModalConfirmEvent () {
                this.tableData = [];
                this.clearTipsModalState = false;
                this.activeTabs = '0';
                this.packetQtyTotal = 0;
                this.usedPacketQtyTotal = 0;
                this.applyPacketQtyTotal = 0;
                this.weightQtyTotal = 0;
                this.usedWeightQtyTotal = 0;
                this.stockQtyTotal = 0;
                this.usableQtyTotal = 0;
                this.applyWeightQtyTotal = 0;
                this.$refs['formValidate'].resetFields();
                this.getDependencyData();
            },
            clearTipsModalCancelEvent () {
                this.clearTipsModalState = false;
            },
            // 配棉生条表移除事件
            reduceTableButton (index) {
                if (this.tableData.length > 1) {
                    this.tableData.splice(index, 1);
                };
                this.calculateTotal();
            },
            // 保存按钮事件
            saveEvent () {
                if (this.tableData && this.tableData.length !== 0) {
                    this.globalLoadingShow = true;
                    this.saveHttp().then(res => {
                        if (res.data.status === 200) {
                            this.createTipsModalState = true;
                            this.globalLoadingShow = false;
                            this.createTipsModalMessage = '保存成功，是否继续新增?';
                        } else {
                            this.globalLoadingShow = false;
                        };
                    });
                } else {
                    emptyTips(this, '原料不能为空!');
                };
            },
            // 提交的请求
            submitHttp (id) {
                this.$call('prd.material.application.submit', [id]).then(res => {
                    if (res.data.status === 200) {
                        this.createTipsModalState = true;
                        this.createTipsModalMessage = '提交成功，是否继续新增?';
                    };
                });
            },
            submitEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        let isEmpty = false;
                        if (this.tableData && this.tableData.length !== 0) {
                            this.tableData.forEach((allItem) => {
                                allItem.applicationDetailList.forEach(item => {
                                    !item.applyPacketQty || !item.applyWeightQty ? isEmpty = true : false;
                                });
                            });
                            if (isEmpty) {
                                emptyTips(this, '申领包数或申领重量不能为空!');
                            } else {
                                this.globalLoadingShow = true;
                                this.saveHttp().then(res => {
                                    if (res.data.status === 200) {
                                        this.submitHttp(res.data.res);
                                    } else {
                                        this.globalLoadingShow = false;
                                    };
                                });
                            };
                        } else {
                            emptyTips(this, '原料不能为空!');
                        };
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            getWorkshopEvent (e) {
                if (e) {
                    this.formValidate.workshopId = e.value;
                    this.formValidate.workshopName = e.label;
                } else {
                    this.formValidate.workshopId = null;
                    this.formValidate.workshopName = '';
                };
            },
            getWorkshopRequest (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.formValidate.workshopId = responseData.defaultDeptId;
                        this.formValidate.workshopName = responseData.defaultDeptName;
                        this.workshopList = responseData.userData;
                        resolve(res);
                    }
                }).catch(error => {
                    reject(error);
                });
            },
            // 获取依赖的数据
            getDependencyData () {
                let workshopList = new Promise((resolve, reject) => {
                    this.getWorkshopRequest(resolve, reject);
                });
                Promise.all([workshopList]).then(res => {
                    this.globalLoadingShow = false;
                });
            }
        },
        created () {
            this.toCreated = true;
            this.globalLoadingShow = true;
            this.getDependencyData();
        },
        activated () {
            _this = this;
            if (!this.toCreated && this.$route.query.activated === true) {
                Object.assign(this.$data, this.$options.data());
                this.globalLoadingShow = true;
                setTimeout(() => {
                    this.$refs['formValidate'].resetFields();
                    this.getDependencyData();
                }, 0);
            };
            this.toCreated = false;
            this.$route.query.activated = false;
        }
    };
</script>
<style scoped>
    .total-width-120{
        width: 120px;
    }
    .total-width-121 {
        width: 121px;
    }
    .total-num-box {
        border: solid 1px #e8eaec;
        padding: 0 8px;
        font-size: 13px;
        border-top: none;
    }
    .middle-label-width {
        font-weight: bold;
        width: 52px;
    }
    .max-label-width {
        font-weight: bold;
        width: 64px;
    }
    .min-label-width {
        font-weight: bold;
        width: 36px;
    }
    .packet-bar-width {
        width: 100px;
    }
    .material-bar-width {
        width: 250px;
    }
    .material-value-width {
        width: 200px;
    }
    .item-line-height {
        line-height: 24px;
    }
    .text-left {
        text-align: left;
    }
    .label-width {
        width: 60px;
    }
    .pack-number-width {
        width: 100px;
    }
    .apply-num-bar {
        margin: 0px 0 2px 4px;
    }
    .margin-left-2 {
        margin-left: 4px;
    }
    .total-bar {
        display: flex;justify-content: flex-end;font-size: 12px;
    }
</style>

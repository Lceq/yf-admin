<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col class="flex-between-center">
                <Button v-show="formValidate.auditState===2" icon="ios-undo" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="cancelClickEvent">撤销提交</Button>
                <Button v-show="formValidate.auditState===2" icon="md-done-all" class="queryBarMarginLeft margin-bottom-10" type="primary" @click="auditClickEvent">审核</Button>
                <Button v-show="formValidate.auditState===3&&formValidate.isQuote===false" type="warning" icon="md-refresh" class="queryBarMarginLeft margin-bottom-10" @click="unAuditClickEvent">撤销审核</Button>
                <Button v-show="formValidate.auditState===3" icon="md-close" class="queryBarMarginLeft margin-bottom-10" type="error" @click="closeClickEvent">关闭单据</Button>
                <Button v-show="formValidate.auditState===4" icon="md-swap" class="queryBarMarginLeft margin-bottom-10" type="warning" @click="openClickEvent">撤销关闭</Button>
            </Col>
        </Row>
        <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
            <div>
                <Row>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="BOM单号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.code}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据日期:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.date}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产单号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.prdOrderCode}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="生产车间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.workshopName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="产品:" prop="materielCodeIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productCode ? `${formValidate.productName}(${formValidate.productCode})` : ''}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="规格:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productModels}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线用途:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.purposeName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="纱线捻向:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.twistDirectionName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="批号:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.batchCode}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="计量单位:" class="formItemMargin">
                            <div class="read-only-item">{{`${formValidate.unitName}(${formValidate.unitCode})`}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="订单数量:" prop="specUserIpt" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.productionQty}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="工艺路线:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.specPathName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货开始时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateFrom}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="交货结束时间:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.deliveryDateTo}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="日供货量:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.dailySupplyQty}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="单据状态:" class="formItemMargin">
                            <div class="read-only-item">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>
                    <Col :sm="12" :md="12" :lg="8" :xl="6" :xxl="4">
                        <FormItem label="引用状态:" class="formItemMargin">
                            <div class="read-only-item">{{ formValidate.isQuoteName }}</div>
                        </FormItem>
                    </Col>
                </Row>
            </div>
        </Form>
        <RadioGroup v-model="tabProcessId" type="button">
            <Radio v-for="(item, index) in processPathList" :key="index" :label="item.id">{{item.processName}}</Radio>
        </RadioGroup>
        <div class="view-bar">

            <!--<Tabs @on-click="getTabEvent">
                <TabPane v-for="(item, index) in processPathList" :key="index" :label="item.processName" :name="item.id+''"></TabPane>
            </Tabs>-->
            <article style="overflow: hidden;position: relative;padding: 10px 10px;">
                <div>
                    <content-loading :spinShow="showTabLoading"></content-loading>
                    <Form :style="{'overflow-y': 'auto'}" ref="formDynamic" :model="formDynamic" :label-width="90" :show-message="false">
                        <Tabs v-model="activeTabPane" type="card">
                            <TabPane :label="item.productName" :name="index + ''"  v-for="(item, index) in formDynamic.prdBomProductList" :key="index" class="product-module" :class="index >= 1 ? 'product-module-border' : ''">
                                <Row class="margin-bottom-10">
                                    <Col><Icon type="logo-buffer" /><span class="margin-left-10">产出物料</span></Col>
                                </Row>
                                <Row>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="产出物料:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.productCode ? `${item.productName}(${item.productCode})` : ''}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="规格:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.productModels}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="批号:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.batchCode}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计量单位:" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.unitName ? `${item.unitName}(${item.unitCode})` : ''}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="生产数量:" prop="specUserIpt" class="formItemMargin" :label-width="110">
                                            <div class="read-only-item">{{item.productionQty}}</div>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计划开工时间:" class="formItemMargin" :label-width="110"

                                        >
                                            <DatePicker @on-change="getPlanStartDateEvent($event, item.planFinishDate, index)" :clearable="false" transfer v-model="item.planStartDate" type="date" placeholder="请选择计划开工时间" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计划完工时间:" class="formItemMargin" :label-width="110"

                                        >
                                            <DatePicker @on-change="getPlanFinishDateEvent($event, item.planStartDate, index)" :clearable="false" transfer v-model="item.planFinishDate" type="date" placeholder="请选择计划完工时间" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row class="margin-bottom-10">
                                    <Col><Icon type="ios-color-filter" /><span class="margin-left-10">工艺</span></Col>
                                </Row>
                                <Row>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="上机准备时间(小时):" class="formItemMargin"
                                                  :label-width="140"
                                                  :key="index"
                                                  :prop="'prdBomProductList.' + index + '.preparationHours'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :precision="0" :min="1" v-model="item.preparationHours" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="前道提前时间(小时):" class="formItemMargin"
                                                  :label-width="140"
                                                  :key="index"
                                                  :prop="'prdBomProductList.' + index + '.feedingHours'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :precision="0" :min="1" v-model="item.feedingHours" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem
                                                :label-width="110"
                                                label="工艺单号:"
                                                class="formItemMargin"
                                                :key="index"
                                                :prop="'prdBomProductList.' + index + '.specSheetCode'"
                                                :rules="{required: true, type: 'string', trigger: 'change'}"
                                        >
                                            <div class="flex-left">
                                                <Select
                                                        class="remoteSearchSelect"
                                                        filterable
                                                        clearable
                                                        placeholder="请输入工艺单号"
                                                        transfer
                                                        v-model="item.specSheetCode"
                                                        @on-change="getSelectSpecSheetChangeEvent($event, index)"
                                                        @on-clear="clearSpecSheetEvent($event, index)"
                                                >
                                                    <Option v-for="(option, index) in item.remoteSpecSheetList" :value="option.code" :key="option.id">{{option.code}}</Option>
                                                </Select>
                                                <Button @click="clickSpecSheetButtonEvent($event, index)" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                                <Button size="small" :disabled="item.disableSetSpecButton" type="success" @click="setProcessEvent($event, index)">查看工艺信息</Button>
                                            </div>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <div v-if="showFeeding">
                                    <Row class="margin-bottom-10">
                                        <Col><Icon type="ios-cube" /><span class="margin-left-10">投料</span></Col>
                                    </Row>
                                    <Row>
                                        <Col>

                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Form>

                </div>
            </article>
        </div>
    </card>
</template>
<script>
    import contentLoading from '../../components/modal-content-loading';
    import { noticeTips, formatDate, toDay, setPage, translateState, compClientHeight, emptyTips, translateIsQuote, addNum } from '../../../libs/common';
    export default {
        name: 'add-bom',
        components: { contentLoading },
        data () {
            return {
                tabProcessId: null,
                editId: null,
                formValidate: {},
                ruleValidate: {},
                globalLoadingShow: false,
                processPathList: [],
                showTabLoading: false,
                formDynamic: {
                    prdBomProductList: []
                },
                activeTabPane: '0',
                showFeeding: true
            };
        },
        methods: {
            getPlanStartDateEvent (dateFrom, dateTo, index) {
                if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateFrom + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划开台时间应在交货日期范围内!');
                } else {
                    if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(formatDate(dateTo)).valueOf()) {
                        this.formDynamic.productModuleList[index].planStartDate = '';
                        this.$set(this.formDynamic.productModuleList[index], 'planStartDate', '');
                        emptyTips(this, '计划开台时间不能大于计划完工时间!');
                    };
                };
            },
            getPlanFinishDateEvent (dateTo, dateFrom, index) {
                if (new Date(dateTo + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateTo + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划完工时间应在交货日期范围内!');
                } else {
                    if (new Date(formatDate(dateFrom)).valueOf() > new Date(dateTo + ' 00:00:00').valueOf()) {
                        this.$set(this.formDynamic.productModuleList[index], 'planFinishDate', '');
                        emptyTips(this, '计划完工时间不能小于计划开台时间!');
                    };
                };
            },
            getTabEvent (e) {
                console.log(e)
                this.tabProcessId = e;
                this.getBomProcessDetailData();
            },
            cancelClickEvent () {},
            auditClickEvent () {},
            unAuditClickEvent () {},
            closeClickEvent () {},
            openClickEvent () {},
            // bom主表的详情
            getBomDetailData () {
                return this.$api.manufacture.prdBomDetailRequest({ id: this.editId }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate = res.data.res;
                        this.formValidate.auditStateName = translateState(res.data.res.auditState);
                        this.formValidate.isQuoteName = res.data.res.isQuote ? '引用' : '未引用';
                        this.processPathList = res.data.res.prdBomProcessList;
                        this.globalLoadingShow = false;
                        this.tabProcessId = res.data.res.prdBomProcessList[0].id;
                    }
                })
            },
            // 子表产出物的详情
            getBomProcessDetailData () {
                this.showTabLoading = true;
                return this.$api.manufacture.prdBomProcessDetailRequest({ prdBomProcessId: this.tabProcessId }).then(res => {
                    if (res.data.status === 200) {
                        this.formDynamic.prdBomProductList = res.data.res.prdBomProductList;
                        this.showTabLoading = false;
                    }
                })
            },
            async getDependentDataRequest () {
                await this.getBomDetailData();
                await this.getBomProcessDetailData();
            }
        },
        created () {
            this.editId = this.$route.query.id;
            this.globalLoadingShow = true;
        },
        mounted () {
            this.editId = this.$route.query.id;
            this.getDependentDataRequest();
        },
        watch: {
            tabProcessId (newVal) {
                console.log('监听', newVal)
                if (newVal) {
                    this.getBomProcessDetailData();
                }
            }
        }
    };
</script>
<style lang="less">
    .view-bar {
        background: #f3f3f3;
        border-radius: 8px;
    }
</style>

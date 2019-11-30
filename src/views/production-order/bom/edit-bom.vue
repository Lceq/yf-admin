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
        <div class="view-bar margin-top-10">
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
                                            <Table border size="small" :columns="tableHeader" :data="item.prdBomMaterielList"></Table>
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
                showFeeding: true,
                tableHeader: [
                    {title: '序号', type: 'index', width: 60, align: 'center'},
                    {title: '投入物料', key: 'mproductCode', minWidth: 200},
                    {title: '规格', key: 'mproductModels', align: 'center', minWidth: 100},
                    {
                        title: '计量单位',
                        key: 'munitCode',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.munitCode ? `${params.row.munitName}(${params.row.munitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '批号',
                        key: 'mbatchCode',
                        minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    display: 'flex',
                                    paddingTop: '2px'
                                }
                            }, [
                                h('Select', {
                                    props: {
                                        value: params.row.mbatchCode,
                                        icon: 'ios-search',
                                        filterable: true,
                                        transfer: true,
                                        placeholder: '请输入批号',
                                        disabled: !params.row.mproductCode
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e) {
                                                params.row.mbatchCode = e;
                                                this.tableData[params.index] = params.row;
                                                this.$emit('getSelectBatchCodeEvent', {
                                                    dataIndex: this.dataIndex,
                                                    rowIndex: params.index,
                                                    row: this.tableData[params.index]
                                                });
                                            }
                                        }
                                    }
                                }, params.row.remoteBatchList.map((item) => {
                                    return h('Option', {
                                        props: {
                                            value: item.batchCode,
                                            label: item.batchCode
                                        }
                                    });
                                })),
                                h('Button', {
                                    props: {
                                        icon: 'ios-search',
                                        size: 'small',
                                        disabled: !params.row.mproductCode
                                    },
                                    style: {
                                        marginLeft: '-2px',
                                        zIndex: '2'
                                    },
                                    on: {
                                        'click': () => {
                                            this.$emit('remoteSelectBatchSearchIconBtnEvent', {
                                                dataIndex: this.dataIndex,
                                                rowIndex: params.index,
                                                mproductCode: params.row.mproductCode
                                            });
                                        }
                                    }
                                }),
                                h('Tooltip', {
                                    props: {
                                        transfer: true,
                                        content: '点击新增批号'
                                    },
                                    style: {
                                        display: 'flex'
                                    }
                                }, [
                                    h('Button', {
                                        props: {
                                            icon: 'ios-create',
                                            size: 'small',
                                            disabled: !params.row.mproductCode
                                        },
                                        style: {
                                            height: '32px',
                                            marginLeft: '4px'
                                        },
                                        on: {
                                            click: () => {
                                                this.$emit('addBatchCodeSearchButtonEvent', {
                                                    dataIndex: this.dataIndex,
                                                    rowIndex: params.index
                                                });
                                            }
                                        }
                                    })
                                ])
                            ]);
                        }
                    },
                    {
                        title: '占比%',
                        key: 'mmixtureRatio',
                        fixed: 'right',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mmixtureRatio,
                                        min: 0,
                                        max: 100
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                if (params.row.mattritionRate === 0 || params.row.mattritionRate) {
                                                    let putinQtyNum = accMul(this.productionQty, e);
                                                    if (params.row.mattritionRate === 100) {
                                                        params.row.mputinQty = 0;
                                                    } else {
                                                        params.row.mputinQty = parseInt(accDivision(putinQtyNum, accSub(100, params.row.mattritionRate)));
                                                    };
                                                };
                                                this.mMixtureRatioChangeEvent(e, params.index);
                                                params.row.mmixtureRatio = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '损耗率%',
                        key: 'mattritionRate',
                        fixed: 'right',
                        align: 'center',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mattritionRate,
                                        min: 0,
                                        max: 100
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                if (params.row.mmixtureRatio === 0 || params.row.mmixtureRatio) {
                                                    let putinQtyNum = accMul(this.productionQty, params.row.mmixtureRatio);
                                                    if (e === 100) {
                                                        params.row.mputinQty = 0;
                                                    } else {
                                                        params.row.mputinQty = parseInt(accDivision(putinQtyNum, accSub(100, e)));
                                                    };
                                                };
                                                this.mAttritionRateChangeEvent(e, params.index);
                                                params.row.mattritionRate = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '投料数量',
                        key: 'mputinQty',
                        align: 'center',
                        fixed: 'right',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.mputinQty,
                                        min: 0,
                                        precision: 0
                                    },
                                    style: {
                                        width: '100%'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            if (e === 0 || e) {
                                                this.mPutinQtyChangeEvent(e, params.index);
                                                params.row.mputinQty = e;
                                                this.tableData[params.index] = params.row;
                                                this.calculationTotalPutinQty();
                                            };
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                activeProcessId: null,
                allBatchCodeList: [],
                allSpecSheetList: []
            };
        },
        methods: {
            clickSpecSheetButtonEvent () {},
            clearSpecSheetEvent () {},
            getSelectSpecSheetChangeEvent () {},
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
            // 获取产品和工序对应的工艺单列表
            getSpecSheetListRequest (productId) {
                return this.$api.specSheet.listHttp({
                    auditState: 3,
                    productId: productId,
                    processId: this.activeProcessId,
                    enableState: 1,
                });
            },
            // 获取投料对应的批号列表
            getMaterialBatchCodeRequest (productCode) {
                return this.$call('product.batch.list',{
                    productNameCode: productCode,
                    auditState: 3
                });
            },
            // 获取各个产品下的工艺单和批号列表
            /*async getSubDependentDataRequest (responseData) {
                for (let productItem of responseData) {
                    await this.getSpecSheetListRequest(productItem.productId).then(res => {
                        if (res.data.status === 200) {
                            productItem.remoteSpecSheetList = res.data.res;
                        }
                    });
                    for (let materialItem of productItem.prdBomMaterielList) {
                        materialItem.remoteBatchList = [];
                        await this.getMaterialBatchCodeRequest(materialItem.mproductCode).then(res => {
                            if (res.data.status === 200) {
                                materialItem.remoteBatchList = res.data.res;
                            }
                        })
                    }
                };
                this.formDynamic.prdBomProductList = responseData;
                this.showTabLoading = false;
            },*/
            // 子表产出物的详情
            getBomProcessDetailData () {
                this.showTabLoading = true;
                return this.$api.manufacture.prdBomProcessDetailRequest({ prdBomProcessId: this.tabProcessId }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res.prdBomProductList;
                        this.activeProcessId = res.data.res.processId;
                        this.getSubDependentDataRequest(responseData);
                    }
                })
            },
            // 获取各个产品下的工艺单和批号列表
            getSubDependentDataRequest (responseData) {
                for (let productItem of responseData) {
                    productItem.remoteSpecSheetList = [];
                    // 工序和产品相同的工艺单列表
                    productItem.remoteSpecSheetList  = this.allSpecSheetList.filter(item => item.processId === this.activeProcessId && item.productId === productItem.productId);
                    for (let materialItem of productItem.prdBomMaterielList) {
                        materialItem.remoteBatchList = [];
                        // 产品相同的批号列表
                        materialItem.remoteBatchList  = this.allBatchCodeList.filter(item =>  item.productCode === materialItem.mproductCode);
                    }
                };
                this.formDynamic.prdBomProductList = responseData;
                this.showTabLoading = false;
            },
            // 子表产出物的详情
            getBomProcessDetailData () {
                this.showTabLoading = true;
                return this.$api.manufacture.prdBomProcessDetailRequest({ prdBomProcessId: this.tabProcessId }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res.prdBomProductList;
                        this.activeProcessId = res.data.res.processId;
                        this.getSubDependentDataRequest(responseData);
                    }
                })
            },
            async getDependentDataRequest () {
                // 获取所有已审核的工艺单列表
                await this.getSpecSheetListRequest().then(res => {
                    if (res.data.status === 200) this.allSpecSheetList = res.data.res;
                });
                // 获取所有已审核的批号列表
                await this.getMaterialBatchCodeRequest().then(res => {
                    if (res.data.status === 200) this.allBatchCodeList = res.data.res;
                });
                await this.getBomDetailData();
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
                if (newVal) {
                    this.activeTabPane = '0';
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

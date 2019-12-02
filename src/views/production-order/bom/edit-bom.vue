<template>
    <card>
        <global-loading v-show="globalLoadingShow"></global-loading>
        <Row type="flex" justify="space-between">
            <Col class="flex-between-center">
                <Button @click="testEvent">测试</Button>
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
        <RadioGroup v-model="tabProcessId" type="button" @on-change="onSelectProcessEvent">
            <Radio v-for="(item, index) in processPathList" :key="index" :label="item.id">{{item.processName}}</Radio>
        </RadioGroup>
        <div class="view-bar margin-top-10">
            <article style="overflow: hidden;position: relative;padding: 10px 10px;">
                <div>
                    <content-loading :spinShow="showTabLoading"></content-loading>
                    <Form :style="{'overflow-y': 'auto'}" ref="formDynamic" :model="formDynamic" :label-width="90" :show-message="false">
                        <Tabs v-model="activeTabPane" type="card">
                            <TabPane :label="item.productName" :name="moduleIndex + ''"  v-for="(item, moduleIndex) in formDynamic.prdBomProductList" :key="moduleIndex" class="product-module" :class="moduleIndex >= 1 ? 'product-module-border' : ''">
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
                                            <DatePicker @on-change="getPlanStartDateEvent($event, item.planFinishDate, moduleIndex)" :clearable="false" transfer v-model="item.planStartDate" type="date" placeholder="请选择计划开工时间" class="widthPercentage"></DatePicker>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="计划完工时间:" class="formItemMargin" :label-width="110"

                                        >
                                            <DatePicker @on-change="getPlanFinishDateEvent($event, item.planStartDate, moduleIndex)" :clearable="false" transfer v-model="item.planFinishDate" type="date" placeholder="请选择计划完工时间" class="widthPercentage"></DatePicker>
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
                                                  :key="moduleIndex"
                                                  :prop="'prdBomProductList.' + moduleIndex + '.preparationHours'"
                                                  :rules="{required: true, type: 'number', trigger: 'change'}"
                                        >
                                            <InputNumber :precision="0" :min="1" v-model="item.preparationHours" class="widthPercentage"></InputNumber>
                                        </FormItem>
                                    </Col>
                                    <Col :sm="12" :md="12" :lg="12" :xl="8" :xxl="6">
                                        <FormItem label="前道提前时间(小时):" class="formItemMargin"
                                                  :label-width="140"
                                                  :key="moduleIndex"
                                                  :prop="'prdBomProductList.' + moduleIndex + '.feedingHours'"
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
                                                :key="moduleIndex"
                                                :prop="'prdBomProductList.' + moduleIndex + '.specSheetCode'"
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
                                                        @on-change="getSelectSpecSheetChangeEvent($event, moduleIndex)"
                                                        @on-clear="clearSpecSheetEvent($event, moduleIndex)"
                                                >
                                                    <Option v-for="(option) in item.remoteSpecSheetList" :value="option.code" :key="option.id">{{option.code}}</Option>
                                                </Select>
                                                <Button @click="clickSpecSheetButtonEvent($event, moduleIndex)" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                                <Button :disabled="!item.specSheetCode" type="success" @click="setProcessEvent($event, item.specSheetCode, moduleIndex)">查看工艺信息</Button>
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
                                            <Table border size="small" :columns="tableHeader" :data="item.prdBomMaterielList">
                                                <template slot-scope="{ row, index }" slot="mbatchCodeAction">
                                                    <div class="flex-left">
                                                        <Select
                                                                class="remoteSearchSelect"
                                                                filterable
                                                                placeholder="请输入批号"
                                                                transfer
                                                                v-model="row.mbatchCode"
                                                                @on-change="onSelectBatchCodeChangeEvent($event, moduleIndex, index)"
                                                        >
                                                            <Option v-for="(option) in row.remoteBatchList" :value="option.batchCode" :key="option.id">{{option.batchCode}}</Option>
                                                        </Select>
                                                        <Button @click="onClickBatchCodeButtonEvent(row.mproductCode, moduleIndex, index)" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                                                        <Tooltip content="点击创建批号" transfer>
                                                            <Button @click="onCreatedBatchCodeButtonEvent(row.mproductCode, moduleIndex, index)" icon="ios-create" size="small" style="margin-left: 4px;line-height: 27px;"></Button>
                                                        </Tooltip>
                                                    </div>
                                                </template>
                                            </Table>
                                        </Col>
                                    </Row>
                                    <Row type="flex" justify="end" class="total-num-big-box">
                                        合计：
                                        <div class="total-num-box total-MixtureRatio-width">
                                            <div>{{ totalMixtureRatioNum }}%</div>
                                        </div>
                                        <div class="total-num-box total-MixtureRatio-width">
                                            <!--<div>{{ totalMattritionRateNum }}%</div>-->
                                        </div>
                                        <div class="total-num-box total-num-box-width">
                                            <div>{{ totalPutinQty }}</div>
                                        </div>
                                    </Row>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Form>
                </div>
            </article>
        </div>
        <see-spec-sheet
                :spin-show="seeSpecModalSpinShow"
                :set-process-modal-state="seeProcessModalState"
                :spec-product-obj="specProductObj"
                @on-visible-change="seeProcessModalStateChangeEvent"
                @see-process-modal-cancel-event="seeProcessModalCancelEvent"
        ></see-spec-sheet>
        <select-spec-sheet-modal
                :spin-show="specModalContentSpinShow"
                :select-bill-modal-state="selectSpecModalState"
                :select-bill-modal-title="selectSpecModalTitle"
                :select-bill-table-header="selectSpecTableHeader"
                :select-bill-modal-table-data="selectSpecModalTableData"
                :select-bill-table-loading="selectSpecTableLoading"
                :select-bill-page-total="selectSpecPageTotal"
                :select-bill-modal-show-material-input="false"
                @on-visible-change="selectSpecModalStateChangeEvent"
                @select-bill-modal-search-event="selectSpecModalSearchBtnEvent"
                @on-change-page="getSelectSpecModalPageCodeEvent"
                @confirm-event="selectSpecModalConfirmEvent"
        ></select-spec-sheet-modal>
        <select-batch-modal
                :spin-show="selectBatchModalSpinShow"
                :select-batch-page-total="selectBatchPageTotal"
                :select-batch-modal-state="selectBatchModalState"
                :select-batch-modal-table-data="selectBatchModalTableData"
                @on-visible-change="selectBatchModalStateChangeEvent"
                @on-change-page="onSelectBatchModalPageCodeEvent"
                @select-batch-modal-search-event="onSelectBatchModalSearchBtnEvent"
                @select-batch-modal-confirm-event="selectBatchModalConfirmEvent"
        ></select-batch-modal>
    </card>
</template>
<script>
    import selectSpecSheetModal from '../../components/select-bill-modal';
    import seeSpecSheet from '../manufacture/components/see-spec-sheet';
    import contentLoading from '../../components/modal-content-loading';
    import selectBatchModal from '../manufacture/components/select-batch-modal';
    import { formatDay, noticeTips, formatDate, toDay, setPage, translateState, compClientHeight, emptyTips, translateIsQuote, mathJsAdd, mathJsSub, mathJsDiv, mathJsMul } from '../../../libs/common';
    export default {
        name: 'add-bom',
        components: { contentLoading, seeSpecSheet, selectSpecSheetModal, selectBatchModal },
        data () {
            return {
                selectBatchModalState: false,
                selectBatchModalSpinShow: false,
                selectBatchPageTotal: 0,
                selectBatchModalTableData: [],

                specModalContentSpinShow: false,
                selectSpecModalState: false,
                selectSpecModalTitle: '',
                selectSpecModalTableData: [],
                selectSpecTableHeader: [
                    {title: '单据日期', key: 'specDate', align: 'center'},
                    {title: '工艺单号', key: 'code', align: 'center'},
                    {title: '产品编号', key: 'productCode', align: 'center'},
                    {title: '产品名称', key: 'productName', align: 'center'},
                    {title: '工序', key: 'processName', align: 'center'},
                    {title: '工艺员', key: 'specUserName', align: 'center'}
                ],
                selectSpecTableLoading: false,
                selectSpecPageTotal: 0,
                totalPutinQty: 0,
                totalMixtureRatioNum: 0,
                totalMattritionRateNum: 0,

                seeSpecModalSpinShow: false,
                specProductObj: {},
                seeProcessModalState: false,
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
                    {title: '投入物料', key: 'mproductCode', minWidth: 200,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.mproductCode ? `${params.row.mproductName}(${params.row.mproductCode})` : ''
                                }
                            })
                        }
                    },
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
                        slot: 'mbatchCodeAction'/*,
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
                        }*/
                    },
                    {title: '占比%', key: 'mmixtureRatio', fixed: 'right', align: 'center', width: 100},
                    {title: '损耗率%', key: 'mattritionRate', fixed: 'right', align: 'center', width: 100},
                    {title: '投料数量', key: 'mputinQty', align: 'center', fixed: 'right', width: 160}
                ],
                activeProcessId: null,
                allBatchCodeList: [],
                allSpecSheetList: [],
                productModuleIndex: 0,
                selectBatchModalPageSize: setPage.pageSize,
                bomMaterialTableRowProduct: '',
                bomMaterialTableRowIndex: null
            };
        },
        methods: {
            // 选择批次的modal
            selectBatchModalConfirmEvent (event) {
                this.$set(this.formDynamic.prdBomProductList[this.productModuleIndex].prdBomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', '');
                setTimeout(()=>{
                    this.$set(this.formDynamic.prdBomProductList[this.productModuleIndex].prdBomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCodeList', [{ batchCode: event.batchCode}]);
                    this.$set(this.formDynamic.prdBomProductList[this.productModuleIndex].prdBomMaterielList[this.bomMaterialTableRowIndex], 'mbatchCode', event.batchCode);
                    this.selectBatchModalState = false;
                },500);
            },
            getProductToBatchCodeListRequest (productCode, batchCode = '') {
                return this.$call('product.batch.list',{
                    productNameCode: productCode,
                    batchCode: batchCode,
                    auditState: 3,
                    pageIndex: this.selectBatchModalPageIndex,
                    pageSize: setPage.pageSize
                });
            },
            onSelectBatchModalSearchBtnEvent (event) {
                // 获取投料对应的所有批次
                this.selectBatchModalPageIndex = 1;
                this.selectBatchPageTotal = 1;
                this.getProductToBatchCodeListRequest(this.formDynamic.prdBomProductList[this.productModuleIndex].prdBomMaterielList[this.bomMaterialTableRowIndex].mproductCode, event.name).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            onSelectBatchModalPageCodeEvent (event) {
                this.selectBatchModalPageIndex = event.pageIndex;
                // 获取投料对应的所有批次
                this.getProductToBatchCodeListRequest(this.formDynamic.prdBomProductList[this.productModuleIndex].prdBomMaterielList[this.bomMaterialTableRowIndex].mproductCode, event.name).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            selectBatchModalStateChangeEvent (e) {
                this.selectBatchModalState = e;
            },
            onCreatedBatchCodeButtonEvent (e, moduleIndex, index) {
                this.formDynamic.prdBomProductList[moduleIndex].prdBomMaterielList[index].mbatchCode = e;

            },
            // 获取下拉选择的批号
            onSelectBatchCodeChangeEvent (e, moduleIndex, index) {
                this.formDynamic.prdBomProductList[moduleIndex].prdBomMaterielList[index].mbatchCode = e;
            },
            // 点击搜索的批号按钮事件
            onClickBatchCodeButtonEvent (mproductCode, moduleIndex, index) {
                this.selectBatchModalState = true;
                this.productModuleIndex = moduleIndex;
                this.bomMaterialTableRowIndex = index;
                this.bomMaterialTableRowProduct = mproductCode;
                this.selectBatchModalPageSize = setPage.pageSize;
                this.selectBatchModalPageIndex = 1;
                this.selectBatchPageTotal = 1;
                this.selectBatchModalSpinShow = true;
                // 获取投料对应的所有批次
                this.getProductToBatchCodeListRequest(mproductCode).then(res => {
                    if (res.data.status === 200) {
                        this.selectBatchModalSpinShow = false;
                        this.selectBatchModalTableData = res.data.res;
                        this.selectBatchPageTotal = res.data.count;
                    };
                });
            },
            // 保存的请求
            saveRequest () {
                this.showTabLoading = true;
                this.formDynamic.prdBomProductList.forEach(item => {
                    item.planStartDate = formatDay(item.planStartDate);
                    item.planFinishDate = formatDay(item.planFinishDate);
                });
                this.$api.manufacture.prdBomProcessSaveRequest({
                    ...this.formDynamic
                }).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.activeTabPane = '0';
                        this.getBomProcessDetailData();
                    }
                })
            },
            onSelectProcessEvent (e) {
                // alert(e)
                this.saveRequest();
            },
            testEvent () {
                console.log('测试', this.formDynamic)
            },
            // 投料
            mPutinQtyChangeEvent (event) {
                this.formDynamic.prdBomProductList[event.dataIndex].prdBomMaterielList[event.moduleIndex] = event.materialData;
            },
            // 合计
            calculationTotalPutinQty () {
                let totalNum = 0;
                let totalMixtureRatio = 0;
                let totalMattritionRate = 0;
                this.tableData.forEach((item) => {
                    if (item.mputinQty) {
                        totalNum = mathJsAdd(item.mputinQty, totalNum);
                    };
                    if (item.mmixtureRatio) {
                        totalMixtureRatio = mathJsAdd(item.mmixtureRatio, totalMixtureRatio);
                    };
                    if (item.mattritionRate) {
                        totalMattritionRate = mathJsAdd(item.mattritionRate, totalMattritionRate);
                    };
                });
                this.totalPutinQty = totalNum;
                this.totalMixtureRatioNum = totalMixtureRatio;
                this.totalMattritionRateNum = totalMattritionRate;
            },
            // 根据产品获取工艺单
            getSpecListHttp (productId = null, processId = '', pageIndex = 1, code = '') {
                return this.$api.specSheet.listHttp({
                    auditState: 3,
                    productId: productId,
                    processId: processId,
                    pageIndex:pageIndex,
                    code: code,
                    enableState: 1,
                    pageSize: setPage.pageSize,
                })
            },
            selectSpecModalConfirmEvent (e) {
                let specParamsData = null;
                this.selectSpecModalState = false;
                this.formDynamic.prdBomProductList[this.productModuleIndex].specSheetId = e.id;
                this.$set(this.formDynamic.prdBomProductList[this.productModuleIndex], 'specSheetCode', '');
                setTimeout(() => {
                    this.$set(this.formDynamic.prdBomProductList[this.productModuleIndex], 'specSheetCode', e.code);
                }, 200);
                (async () => {
                    await this.getSpecDetailHttp(e.id).then(res => {
                        if (res.data.status === 200) {
                            this.$delete(res.data.res, 'id');
                            specParamsData = res.data.res;
                            Object.assign(this.formDynamic.prdBomProductList[this.productModuleIndex], JSON.parse(JSON.stringify(specParamsData.specSheetProcessModel)));
                        }
                    })
                })()
            },

            // 工艺modal的分页
            getSelectSpecModalPageCodeEvent (pageIndex) {
                this.getSpecListHttp(this.formDynamic.prdBomProductList[this.productModuleIndex].productId, this.activeProcessId, pageIndex).then(res => {
                    if (res.data.status === 200) {
                        this.selectSpecPageTotal = res.data.count;
                        this.selectSpecModalTableData = res.data.res;
                    };
                });
            },
            selectSpecModalSearchBtnEvent (event) {
                this.getSpecListHttp(this.formDynamic.prdBomProductList[this.productModuleIndex].productId, this.activeProcessId, 1, event.code).then(res => {
                    if (res.data.status === 200) {
                        this.selectSpecPageTotal = res.data.count;
                        this.selectSpecModalTableData = res.data.res;
                    }
                });
            },
            selectSpecModalStateChangeEvent (e) {
                this.selectSpecModalState = e;
            },
            // 工艺单的icon搜索按钮事件
            clickSpecSheetButtonEvent (event, index) {
                this.selectSpecModalTitle = '选择工艺单';
                this.specModalContentSpinShow = true;
                this.selectSpecModalState = true;
                this.productModuleIndex = index;
                this.getSpecListHttp(this.formDynamic.prdBomProductList[index].productId, this.activeProcessId).then(res => {
                    if (res.data.status === 200) {
                        this.selectSpecPageTotal = res.data.count;
                        this.selectSpecModalTableData = res.data.res;
                        this.specModalContentSpinShow = false;
                    };
                });
            },
            // 上级工艺modal事件
            seeProcessModalCancelEvent () {
                this.seeProcessModalState = false;
            },
            // 获取工艺参数和设备
            getSpecDetailHttp (id) {
                return this.$call('spec.sheet.detail', {id: id});
            },
            seeProcessModalStateChangeEvent (e) {
                this.seeProcessModalState = e;
            },
            // 设置工艺的事件
            setProcessEvent (e, code, index) {
                this.seeProcessModalState = true;
                this.formDynamic.prdBomProductList[index].remoteSpecSheetList.forEach((item)=>{
                    if (item.code === code) {
                        // 请求工艺单的参数
                        this.seeSpecModalSpinShow = true;
                        this.getSpecDetailHttp(item.id).then(res => {
                            if (res.data.status === 200) {
                                this.specProductObj = res.data.res.specSheetProcessModel;
                                this.seeSpecModalSpinShow = false;
                            };
                        });
                    };
                });
            },
            clearSpecSheetEvent () {},
            getSelectSpecSheetChangeEvent () {},
            getPlanStartDateEvent (dateFrom, dateTo, index) {
                if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateFrom + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划开台时间应在交货日期范围内!');
                } else {
                    if (new Date(dateFrom + ' 00:00:00').valueOf() > new Date(formatDate(dateTo)).valueOf()) {
                        this.formDynamic.prdBomProductList[index].planStartDate = '';
                        this.$set(this.formDynamic.prdBomProductList[index], 'planStartDate', '');
                        emptyTips(this, '计划开台时间不能大于计划完工时间!');
                    };
                };
            },
            getPlanFinishDateEvent (dateTo, dateFrom, index) {
                if (new Date(dateTo + ' 00:00:00').valueOf() > new Date(this.formValidate.deliveryDateTo + ' 00:00:00').valueOf() || new Date(dateTo + ' 00:00:00').valueOf() < new Date(this.formValidate.deliveryDateFrom + ' 00:00:00').valueOf()) {
                    emptyTips(this, '计划完工时间应在交货日期范围内!');
                } else {
                    if (new Date(formatDate(dateFrom)).valueOf() > new Date(dateTo + ' 00:00:00').valueOf()) {
                        this.$set(this.formDynamic.prdBomProductList[index], 'planFinishDate', '');
                        emptyTips(this, '计划完工时间不能小于计划开台时间!');
                    };
                };
            },
            cancelClickEvent () {},
            auditClickEvent () {},
            unAuditClickEvent () {},
            closeClickEvent () {},
            openClickEvent () {},
            // 获取产品和工序对应的工艺单列表
            getSpecSheetListRequest (productId) {
                return this.$api.specSheet.listHttp({
                    auditState: 3,
                    productId: productId,
                    processId: this.activeProcessId,
                    enableState: 1,
                    productIds: this.formValidate.productIds
                });
            },
            // 获取投料对应的批号列表
            getMaterialBatchCodeRequest (productCode) {
                return this.$call('product.batch.list',{
                    productNameCode: productCode,
                    auditState: 3,
                    productIds: this.formValidate.productIds
                });
            },
            // bom主表的详情
            getBomDetailData () {
                return this.$api.manufacture.prdBomDetailRequest({ id: this.editId }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate = res.data.res;
                        this.formValidate.auditStateName = translateState(res.data.res.auditState);
                        this.formValidate.isQuoteName = res.data.res.isQuote ? '引用' : '未引用';
                        this.processPathList = res.data.res.prdBomProcessList;
                    }
                })
            },
            // 子表产出物的详情
            getBomProcessDetailData () {
                return this.$api.manufacture.prdBomProcessDetailRequest({ prdBomProcessId: this.tabProcessId }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res.prdBomProductList;
                        this.activeProcessId = res.data.res.processId;
                        // 赋值各个产品下的工艺单和批号列表
                        for (let productItem of responseData) {
                            productItem.remoteSpecSheetList = [];
                            // 工序和产品相同的工艺单列表
                            // productItem.remoteSpecSheetList  = this.allSpecSheetList.filter(item => item.processId === this.activeProcessId && item.productId === productItem.productId);
                            productItem.remoteSpecSheetList  = this.allSpecSheetList.filter(item => item.productId === productItem.productId);
                            for (let materialItem of productItem.prdBomMaterielList) {
                                materialItem.remoteBatchList = [];
                                // 产品相同的批号列表
                                materialItem.remoteBatchList  = this.allBatchCodeList.filter(item =>  item.productCode === materialItem.mproductCode);
                            }
                        }
                        this.formDynamic = res.data.res;
                        this.formDynamic.prdBomProductList = responseData;
                        this.showTabLoading = false;
                        this.globalLoadingShow = false;
                    }
                })
            },
            async getDependentDataRequest () {
                await this.getBomDetailData();
                // 获取当前bom产品下可用，且已审核的批号列表
                await this.getMaterialBatchCodeRequest().then(res => {
                    if (res.data.status === 200) this.allBatchCodeList = res.data.res;
                });
                // 获取当前bom产品下可用，且已审核的工艺单列表
                await this.getSpecSheetListRequest().then(res => {
                    if (res.data.status === 200) {
                        this.allSpecSheetList = res.data.res;
                        this.tabProcessId = this.processPathList[0].id;
                        this.activeTabPane = '0';
                        this.getBomProcessDetailData();
                    }
                });
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
                    /*this.activeTabPane = '0';
                    this.getBomProcessDetailData();*/
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
    .total-MixtureRatio-width{
        width: 100px;
        border-right: none;
    }
</style>

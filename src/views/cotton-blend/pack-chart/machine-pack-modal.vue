<template>
    <div>
        <Modal
                v-model="showModal"
                title="机台排包"
                @on-visible-change="machinePackModalStateChangeEvent"
                :maskClosable="false"
                width="1750"
                :styles="{top: '20px'}"
        >
            <modal-content-loading :spinShow="spinShow"></modal-content-loading>
            <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                <Row type="flex">
                    <Col span="4">
                        <FormItem label="排包日期：" class="formItem-margin-0" prop="cottonPackingDate">
                            <DatePicker v-model="formValidate.cottonPackingDate" type="date" placeholder="请选择排包日期" class="widthPercentage"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="配棉版本号：" class="formItem-margin-0" prop="prdCottonBlendingId">
                            <div class="flex-left">
                                <Select
                                        :disabled="isCopy"
                                        class="remoteSearchSelect"
                                        label-in-value
                                        filterable
                                        placeholder="请选择配棉版本号"
                                        v-model="formValidate.prdCottonBlendingId"
                                        @on-change="getCottonVersionEvent"
                                >
                                    <Option v-for="(option, index) in formValidate.cottonArchivesList" :value="option.id" :key="option.id">{{option.versionNumber}}</Option>
                                </Select>
                                <Button :disabled="isCopy" @click="searchCottonArchivesEvent" class="remoteSearchButton" size="small" icon="ios-search"></Button>
                            </div>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem label="生产批号：" class="formItem-margin-0">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.batchCode}}</div>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem label="排包区域：" prop="packingAreaId" class="formItem-margin-0">
                            <Select v-model="formValidate.packingAreaId" placeholder="请选择排包区域" @on-change="getPackingAreaEvent">
                                <Option v-for="item in formValidate.packAreaList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem label="清花机台：" class="formItem-margin-0">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.machineName}}</div>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem label="原料包数：" class="formItem-margin-0" prop="materialPacketQty">
                            <InputNumber :precision="0" :min="0" v-model="formValidate.materialPacketQty" class="widthPercentage"/>
                        </FormItem>
                    </Col>
                    <Col span="3">
                        <FormItem label="副产品包数：" class="formItem-margin-0">
                            <div class="widthPercentage exhibitionInputBackground">{{formValidate.lapWastePacketQty}}</div>
                        </FormItem>
                    </Col>
                    <!--<Col span="4" v-show="isEdit">
                        <FormItem label="数据状态：" class="formItem-margin-0">
                            <div class="widthPercentage">{{formValidate.auditStateName}}</div>
                        </FormItem>
                    </Col>-->
                </Row>
                <Row :gutter="6" class="chart-param">
                    <Col>
                        <div class="flex-left">
                            <div v-if="isDiscType">
                                <span>外圈包数</span>
                                <Table border :columns="discOutTableHeader" :data="tableDataLeft" :height="650" size="small"></Table>
                            </div>
                            <div class="queryBarMarginLeft" v-if="isDiscType">
                                <span>内圈包数</span>
                                <Table border :columns="discInnerTableHeader" :data="tableDataRight" :height="650" size="small"></Table>
                            </div>
                            <div class="queryBarMarginLeft" v-if="isDiscType">
                                <span>缝包数</span>
                                <Table border :columns="creviceTableHeader" :data="creviceTableData" size="small"></Table>
                            </div>
                        </div>
                        <Row class="margin-top-10" v-if="formValidate.cottonBlendingDetailList&&formValidate.cottonBlendingDetailList.length!==0">
                            <Col>汇总统计</Col>
                            <div class="total-bar-border">
                                <Row type="flex" :gutter="20" v-for="(item, index) in formValidate.cottonBlendingDetailList" :key="index">
                                    <Col span="6">
                                        <div class="flex-left">
                                            <div class="total-label-width">原料：</div>
                                            <div>{{`${item.productName}(${item.productCode})`}}</div>
                                        </div>
                                    </Col>
                                    <Col span="4">
                                        <div class="flex-left">
                                            <div class="total-label-width">批号：</div>
                                            <div>{{item.batchCode}}</div>
                                        </div>
                                    </Col>
                                    <Col span="4">
                                        <div class="flex-left">
                                            <div class="total-label-width">包数：</div>
                                            <div>{{item.packetQty}}</div>
                                        </div>
                                    </Col>
                                    <Col span="4">
                                        <div class="flex-left">
                                            <div class="total-label-width">重量：</div>
                                            <div>{{item.weightQty}}</div>
                                        </div>
                                    </Col>
                                    <Col span="4">
                                        <div class="flex-left">
                                            <div class="total-label-width">比例：</div>
                                            <div>{{item.mixtureRatio}}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Row>
                    </Col>
                    <Col style="width: 700px;">
                        <div v-if="isDiscType">
                            <pieChart :pieChartData="pieChartData"></pieChart>
                        </div>
                        <div v-if="isRecType">
                            <div v-for="(rowItem, rowIndex) in rowNumber" :key="rowIndex" class="flex-left">
                                <p v-for="(columnItem, columnIndex) in rowItem.columnNumber" :key="columnIndex" class="cell-item"></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <modal-footer
                        :buttonLoading="confirmButtonLoading"
                        :isDisableConfirm="(formValidate.auditState&&formValidate.auditState===1)||isCopy?false:true"
                        @saveModalConfirmEvent="machinePackModalConfirmEvent"
                        @saveModalCancelEvent="machinePackModalCancelEvent"
                ></modal-footer>
            </div>
        </Modal>
        <select-cotton-archives-modal
                :selectCottonMaterialModalTableLoading="selectCottonMaterialModalTableLoading"
                :selectCottonMaterialState="selectCottonMaterialState"
                :selectCottonMaterialModalTableData="formValidate.cottonArchivesList"
                :selectCottonMaterialModalPageTotal="selectCottonMaterialModalPageTotal"
                @on-change-page="selectCottonMaterialModalPageCodeChange"
                @on-search-event="selectCottonMaterialModalSearchBtnEvent"
                @on-visible-change="selectCottonMaterialModalStateChange"
                @on-confirm="selectCottonMaterialModalConfirm"
        ></select-cotton-archives-modal>
    </div>
</template>
<script>
    import { noticeTips, translateState, mathJsAdd, setPage, emptyTips, toDay, formatDate } from '../../../libs/common';
    import modalFooter from '../../components/modal-footer';
    import otherMessage from '../../components/otherMessage';
    import pieChart from './pie-chart';
    import modalContentLoading from '../../components/modal-content-loading.vue';
    import selectCottonArchivesModal from './select-cotton-archives.vue';
    export default {
        components: { modalFooter, otherMessage, pieChart, modalContentLoading, selectCottonArchivesModal },
        props: {
            isCopy: {
                type: Boolean,
                default: false
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            saveModalData: {
                type: Object
            },
            machinePackModalState: {
                type: Boolean,
                default: false
            },
            saveModalTitle: {
                type: String
            },
            machinePackModalData: {
                type: Object
            },
            spinShow: {
                type: Boolean,
                default: false
            },
            cottonPackChartId: {
                type: Number
            }
        },
        data () {
            const validatePrdCottonBlendingId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validatePackingAreaId = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateMaterialPacketQty = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateLapWastePacketQty = (rule, value, callback) => value ? callback() : callback(new Error());
            const validateCottonPackingDate = (rule, value, callback) => value ? callback() : callback(new Error());
            return {
                creviceTableHeader: [
                    {
                        title: '副产品',
                        key: 'msPrdCottonBlendingMaterialId',
                        width: 250,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Select', {
                                    props: {
                                        clearable: true,
                                        value: params.row.msPrdCottonBlendingMaterialId,
                                        placeholder: '请选择副产品',
                                        transfer: true,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            this.setCreviceMaterialValue(params, event);
                                        }
                                    }
                                }, params.row.byProductList.map((items) => {
                                    return h('Option', {
                                        props: {
                                            value: items.id,
                                            label: `${items.productName}--${items.batchCode}`
                                        }
                                    });
                                }))
                            ]);
                        }
                    },
                    {
                        title: '平均包重',
                        key: 'packetWeight',
                        width: 90
                    },
                    {
                        title: '包数',
                        width: 90,
                        key: 'packetQty',
                        render: (h, params) => {
                            return h('div', [
                                h('InputNumber', {
                                    props: {
                                        value: params.row.packetQty,
                                        min: 0,
                                        precision: 0,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (e) => {
                                            params.row.packetQty = e;
                                            this.formValidate.lapWastePacketQty = e;
                                            this.creviceTableData[params.index] = params.row;
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                creviceTableData: [],
                selectCottonMaterialModalTableLoading: false,
                selectCottonMaterialModalPageTotal: 0,
                selectCottonMaterialState: false,
                initData: {},
                // 外圆盘式表头
                discOutTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '包',
                        key: 'mpPrdCottonBlendingMaterialId',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            return h('div', [
                                h('Select', {
                                    props: {
                                        clearable: true,
                                        value: params.row.mpPrdCottonBlendingMaterialId,
                                        placeholder: '请选择',
                                        transfer: true,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            if (event) {
                                                params.row.rawMaterialList.forEach((item) => {
                                                    if (item.id === event) {
                                                        params.row.mpPrdCottonBlendingMaterialId = item.id;
                                                        params.row.mpProductId = item.productId;
                                                        params.row.mpProductName = item.productName;
                                                        params.row.mpProductCode = item.productCode;
                                                        params.row.mpBatchCode = item.batchCode;
                                                    };
                                                });
                                                this.tableDataLeft[params.index] = params.row;
                                                // 给chart上色（有缝，无缝）
                                                if (params.row.byProductList && params.row.byProductList.length !== 0) {
                                                    this.initData.outPacketColorList.splice(params.index * 2, 1, '#2b85e4');
                                                } else {
                                                    this.initData.outPacketColorList.splice(params.index * 2, 1, '#2b85e4');
                                                };
                                                this.pieChartData = JSON.parse(JSON.stringify(this.initData));
                                            } else {
                                                params.row.mpPrdCottonBlendingMaterialId = null;
                                                params.row.mpProductId = null;
                                                params.row.mpProductName = '';
                                                params.row.mpProductCode = '';
                                                params.row.mpBatchCode = '';
                                                // 清空chart色块（有缝，无缝）
                                                if (params.row.byProductList && params.row.byProductList.length !== 0) {
                                                    this.initData.outPacketColorList.splice(params.index * 2, 1, '#f1f1f1');
                                                } else {
                                                    this.initData.outPacketColorList.splice(params.index * 2, 1, '#f1f1f1');
                                                };
                                                this.pieChartData = JSON.parse(JSON.stringify(this.initData));
                                                this.tableDataLeft[params.index] = params.row;
                                            };
                                            this.calculatePacket();
                                        }
                                    }
                                }, params.row.rawMaterialList.map((items) => {
                                    return h('Option', {
                                        props: {
                                            value: items.id,
                                            label: `${items.productName}--${items.batchCode}`
                                        }
                                    });
                                }))
                            ]);
                        }
                    }
                ],
                // 内圆盘式表头
                discInnerTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '包',
                        key: 'mpPrdCottonBlendingMaterialId',
                        align: 'center',
                        width: 250,
                        render: (h, params) => {
                            return h('div', [
                                h('Select', {
                                    props: {
                                        clearable: true,
                                        value: params.row.mpPrdCottonBlendingMaterialId,
                                        placeholder: '请选择',
                                        transfer: true,
                                        size: 'small'
                                    },
                                    on: {
                                        'on-change': (event) => {
                                            if (event) {
                                                params.row.rawMaterialList.forEach((item) => {
                                                    if (item.id === event) {
                                                        params.row.mpPrdCottonBlendingMaterialId = item.id;
                                                        params.row.mpProductId = item.productId;
                                                        params.row.mpProductName = item.productName;
                                                        params.row.mpProductCode = item.productCode;
                                                        params.row.mpBatchCode = item.batchCode;
                                                    };
                                                });
                                                // 给chart上色（有缝，无缝）
                                                if (params.row.byProductList && params.row.byProductList.length !== 0) {
                                                    this.initData.innerPacketColorList.splice(params.index * 2, 1, '#2b85e4');
                                                } else {
                                                    this.initData.innerPacketColorList.splice(params.index * 2, 1, '#2b85e4');
                                                };
                                                this.pieChartData = JSON.parse(JSON.stringify(this.initData));
                                                this.tableDataRight[params.index] = params.row;
                                            } else {
                                                params.row.mpPrdCottonBlendingMaterialId = null;
                                                params.row.mpProductId = null;
                                                params.row.mpProductName = '';
                                                params.row.mpProductCode = '';
                                                params.row.mpBatchCode = '';
                                                // 清空chart色块（有缝，无缝）
                                                if (params.row.byProductList && params.row.byProductList.length !== 0) {
                                                    this.initData.innerPacketColorList.splice(params.index * 2, 1, '#f1f1f1');
                                                } else {
                                                    this.initData.innerPacketColorList.splice(params.index * 2, 1, '#f1f1f1');
                                                };
                                                this.pieChartData = JSON.parse(JSON.stringify(this.initData));
                                                this.tableDataRight[params.index] = params.row;
                                            };
                                            this.calculatePacket();
                                        }
                                    }
                                }, params.row.rawMaterialList.map((items) => {
                                    return h('Option', {
                                        props: {
                                            value: items.id,
                                            label: `${items.productName}--${items.batchCode}`
                                        }
                                    });
                                }))
                            ]);
                        }
                    }
                ],
                recTableHeader: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 50
                    },
                    {
                        title: '行',
                        key: 'rowNumber',
                        minWidth: 90
                    },
                    {
                        title: '列',
                        key: 'columnNumber',
                        minWidth: 90
                    }
                ],
                tableHeaderLeft: [],
                tableHeaderRight: [],
                tableDataLeft: [],
                tableDataRight: [],
                pieChartData: {},
                isDiscType: true,
                isRecType: false,
                showModal: false,
                formValidate: {
                    cottonPackingDate: toDay(),
                    prdCottonBlendingId: null,
                    packingAreaId: '',
                    name: '',
                    typeId: '',
                    versionNumber: '',
                    materialPacketQty: 1,
                    lapWastePacketQty: 1
                },
                ruleValidate: {
                    prdCottonBlendingId: [{ required: true, validator: validatePrdCottonBlendingId, trigger: 'change' }],
                    packingAreaId: [{ required: true, validator: validatePackingAreaId, trigger: 'change' }],
                    materialPacketQty: [{ required: true, validator: validateMaterialPacketQty, trigger: 'change' }],
                    lapWastePacketQty: [{ required: true, validator: validateLapWastePacketQty, trigger: 'change' }],
                    cottonPackingDate: [{ required: true, validator: validateCottonPackingDate, trigger: 'change' }]
                },
                confirmButtonLoading: false
            };
        },
        methods: {
            // 副产品的选中事件
            setCreviceMaterialValue (params, event) {
                if (event) {
                    params.row.byProductList.forEach((item) => {
                        if (item.id === event) {
                            params.row.msPrdCottonBlendingMaterialId = item.id;
                            params.row.msProductId = item.productId;
                            params.row.msProductName = item.productName;
                            params.row.msProductCode = item.productCode;
                            params.row.msBatchCode = item.batchCode;
                            params.row.packetWeight = item.packetWeight;
                            params.row.packetQty = item.packetQty;
                            // 赋值内外圈的缝
                            this.tableDataLeft.forEach(leftItem => {
                                leftItem.msPrdCottonBlendingMaterialId = item.id;
                                leftItem.msProductId = item.productId;
                                leftItem.msProductName = item.productName;
                                leftItem.msProductCode = item.productCode;
                                leftItem.msBatchCode = item.batchCode;
                                leftItem.packetWeight = item.packetWeight;
                                leftItem.packetQty = item.packetQty;
                            });
                            this.tableDataRight.forEach(rightItem => {
                                rightItem.msPrdCottonBlendingMaterialId = item.id;
                                rightItem.msProductId = item.productId;
                                rightItem.msProductName = item.productName;
                                rightItem.msProductCode = item.productCode;
                                rightItem.msBatchCode = item.batchCode;
                                rightItem.packetWeight = item.packetWeight;
                                rightItem.packetQty = item.packetQty;
                            });
                        };
                    });
                    this.creviceTableData[params.index] = params.row;
                    this.setChartColor();
                } else {
                    params.row.msPrdCottonBlendingMaterialId = null;
                    params.row.msProductId = null;
                    params.row.msProductName = '';
                    params.row.msProductCode = '';
                    params.row.msBatchCode = '';
                    params.row.packetWeight = null;
                    params.row.packetQty = null;
                    this.tableDataLeft.forEach(leftItem => {
                        leftItem.msPrdCottonBlendingMaterialId = null;
                        leftItem.msProductId = null;
                        leftItem.msProductName = '';
                        leftItem.msProductCode = '';
                        leftItem.msBatchCode = '';
                    });
                    this.tableDataRight.forEach(rightItem => {
                        rightItem.msPrdCottonBlendingMaterialId = '';
                        rightItem.msProductId = '';
                        rightItem.msProductName = '';
                        rightItem.msProductCode = '';
                        rightItem.msBatchCode = '';
                    });
                    this.creviceTableData[params.index] = params.row;
                    this.setChartColor();
                };
                this.calculateCrevicePacket();
            },
            // 计算副产品包数（根据种类）
            calculateCrevicePacket () {
                let leftIds = [];
                let rightIds = [];
                this.tableDataLeft.forEach(item => {
                    if (item.msPrdCottonBlendingMaterialId) {
                        leftIds.push(item.msPrdCottonBlendingMaterialId);
                    };
                });
                this.tableDataRight.forEach(item => {
                    if (item.msPrdCottonBlendingMaterialId) {
                        rightIds.push(item.msPrdCottonBlendingMaterialId);
                    };
                });
                setTimeout(() => {
                    this.$set(this.formValidate, 'lapWastePacketQty', Array.from(new Set([...leftIds, ...rightIds])).length);
                }, 0);
            },
            // 搜索按钮事件
            selectCottonMaterialModalSearchBtnEvent (e) {
                this.selectCottonMaterialModalPageTotal = 1;
                this.getCottonArchivesListRequest(e.name, 1);
            },
            // 分页
            selectCottonMaterialModalPageCodeChange (e) {
                this.getCottonArchivesListRequest(e.name, e.pageIndex);
            },
            // 获取配棉档案列表数据
            getCottonArchivesListRequest (name = '', pageIndex = 1) {
                return this.$call('prd.cotton.blending.list', {
                    auditState: 3,
                    versionNumber: name,
                    pageSize: setPage.pageSize,
                    pageIndex: pageIndex

                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.selectCottonMaterialModalTableLoading = false;
                        this.selectCottonMaterialModalPageTotal = res.data.count;
                        this.formValidate.cottonArchivesList = responseData;
                    };
                });
            },
            selectCottonMaterialModalConfirm (e) {
                this.isDiscType = false;
                this.formValidate.materialPacketQty = 0;
                this.formValidate.packingAreaId = '';
                this.formValidate.packAreaList = [];
                this.formValidate.lapWastePacketQty = 0;
                this.creviceTableData = [];
                this.tableDataLeft = [];
                this.tableDataRight = [];
                this.selectCottonMaterialState = false;
                this.formValidate.prdCottonBlendingId = e.id;
                this.formValidate.versionNumber = e.versionNumber;
                this.formValidate.workshopId = e.workshopId;
                this.formValidate.workshopName = e.workshopName;
                this.formValidate.batchCode = e.batchCode;
                this.formValidate.isPremix = e.isPremix;
                this.formValidate.cottonBlendingDetailList = [];
                this.getPackAreaListRequest();
            },
            // 搜索按钮事件
            searchCottonArchivesEvent () {
                this.selectCottonMaterialModalTableLoading = true;
                this.getCottonArchivesListRequest();
                this.selectCottonMaterialState = true;
            },
            // 监听选择配棉档案原料modal
            selectCottonMaterialModalStateChange (e) {
                this.selectCottonMaterialState = e;
            },
            // 获取排包区域列表数据
            getPackAreaListRequest () {
                this.$call('packing.area.list', {
                    prdCottonBlendingId: this.formValidate.prdCottonBlendingId, // 配棉档案id
                    getPrdCottonBlendingAreaId: this.cottonPackChartId, // 配棉排包图id
                    workshopId: this.formValidate.workshopId,
                    auditState: 3,
                    isPremix: this.formValidate.isPremix
                }).then(res => {
                    if (res.data.status === 200) {
                        this.formValidate.packAreaList = res.data.res;
                    };
                });
            },
            // 获取排包区域
            getPackingAreaEvent (e) {
                this.formValidate.cottonBlendingDetailList = [];
                if (e) {
                    if (this.formValidate.packingAreaId && this.formValidate.prdCottonBlendingId) {
                        this.validatorIfExist();
                    };
                } else {
                    this.formValidate.packingAreaId = null;
                    this.formValidate.packingAreaCode = '';
                    this.formValidate.packingAreaName = '';
                    this.formValidate.machineId = null;
                    this.formValidate.machineCode = '';
                    this.formValidate.machineName = '';
                };
            },
            // 获取配棉版本号(冗余，现在的作用是返回配棉档案的原料)
            getCottonVersionEvent (e) {
                this.formValidate.cottonBlendingDetailList = [];
                if (e) {
                    this.formValidate.materialPacketQty = 0;
                    this.formValidate.lapWastePacketQty = 0;
                    this.creviceTableData = [];
                    this.isDiscType = false;
                    this.formValidate.packingAreaId = '';
                    this.formValidate.packAreaList = [];
                    this.tableDataLeft = [];
                    this.tableDataRight = [];
                    this.formValidate.prdCottonBlendingId = e.value;
                    this.formValidate.versionNumber = e.label;
                    this.formValidate.cottonArchivesList.forEach(item => {
                        if (item.id === e.value) {
                            this.formValidate.isPremix = item.isPremix;
                            this.formValidate.workshopId = item.workshopId;
                            this.formValidate.workshopName = item.workshopName;
                            this.formValidate.batchCode = item.batchCode;
                        };
                    });
                    this.getPackAreaListRequest();
                } else {
                    this.formValidate.prdCottonBlendingId = null;
                    this.formValidate.versionNumber = '';
                };
            },
            // 根据排包区域赋值
            setValueOperations () {
                this.formValidate.packAreaList.forEach(item => {
                    if (item.id === this.formValidate.packingAreaId) {
                        this.initData = item;
                        this.formValidate.packingAreaCode = item.code;
                        this.formValidate.packingAreaName = item.name;
                        this.formValidate.machineId = item.machineId;
                        this.formValidate.machineCode = item.machineCode;
                        this.formValidate.machineName = item.machineName;
                        this.formValidate.typeId = item.typeId;
                        this.formValidate.typeName = item.typeName;
                        if (item.typeName.indexOf('圆盘式') !== -1) {
                            this.isDiscType = true;
                            this.isRecType = false;
                            this.formValidate.innerPacketNumber = item.innerPacketNumber;
                            this.formValidate.outerPacketNumber = item.outerPacketNumber;
                            this.tableHeaderLeft = JSON.parse(JSON.stringify(this.discOutTableHeader));
                            this.tableHeaderRight = JSON.parse(JSON.stringify(this.discInnerTableHeader));
                        };
                    };
                });
            },
            // 设置chart颜色
            setChartColor () {
                let outPacketColorList = [];
                let innerPacketColorList = [];
                // 内圈
                this.tableDataLeft.forEach((item, index) => {
                    // 包和缝都存在
                    if (item.mpProductId && item.msProductId) {
                        outPacketColorList.push('#2b85e4');
                        outPacketColorList.push('#ff9900');
                    } else {
                        // 包存在
                        item.mpProductId ? outPacketColorList.push('#2b85e4') : outPacketColorList.push('#fff');
                        // 缝存在
                        item.msProductId ? outPacketColorList.push('#ff9900') : outPacketColorList.push('#fff');
                    };
                });
                // 外圈
                this.tableDataRight.forEach((item, index) => {
                    // 包和缝都存在
                    if (item.mpProductId && item.msProductId) {
                        innerPacketColorList.push('#2b85e4');
                        innerPacketColorList.push('#ff9900');
                    } else {
                        // 包存在
                        item.mpProductId ? innerPacketColorList.push('#2b85e4') : innerPacketColorList.push('#fff');
                        // 缝存在
                        item.msProductId ? innerPacketColorList.push('#ff9900') : innerPacketColorList.push('#fff');
                    };
                });
                this.initData.innerPacketColorList = innerPacketColorList;
                this.initData.outPacketColorList = outPacketColorList;
                setTimeout(() => { this.pieChartData = JSON.parse(JSON.stringify(this.initData)); }, 0);
            },
            // 校验所选排包区域是否存在
            validatorIfExist () {
                this.$call('prd.cotton.blending.area.existVersionArea', {
                    prdCottonBlendingId: this.formValidate.prdCottonBlendingId,
                    packingAreaId: this.formValidate.packingAreaId,
                    id: this.cottonPackChartId
                }).then(res => {
                    if (res.data.status === 200) {
                        this.setValueOperations();
                        let responseData = res.data.res;
                        // 包数和缝相同的情况下
                        if (this.formValidate.innerPacketNumber === this.tableDataRight.length && this.formValidate.outerPacketNumber === this.tableDataLeft.length) {
                            this.setChartColor();
                        } else {
                            this.createChart(responseData);
                        };
                    };
                });
            },
            // 绘制chart
            createChart (responseData) {
                // 缝，存在副产品的情况下，默认第一个
                if (responseData.byProductList && responseData.byProductList.length !== 0) {
                    responseData.byProductList.forEach(item => {
                        item.msProductId = item.productId;
                        item.msProductCode = item.productCode;
                        item.msProductName = item.productName;
                    });
                    this.creviceTableData = [{
                        msPrdCottonBlendingMaterialId: responseData.byProductList[0].id,
                        msProductId: responseData.byProductList[0].productId,
                        msProductCode: responseData.byProductList[0].productCode,
                        mpProductName: responseData.byProductList[0].productName,
                        byProductList: responseData.byProductList,
                        packetWeight: responseData.byProductList[0].packetWeight,
                        packetQty: 1
                    }];
                    this.formValidate.lapWastePacketQty = 1;
                } else {
                    this.formValidate.lapWastePacketQty = 0;
                    this.creviceTableData = [];
                };
                responseData.msProductId = null;
                responseData.msProductCode = '';
                responseData.msProductName = '';
                responseData.mpProductId = null;
                responseData.mpProductCode = '';
                responseData.mpProductName = '';
                let innerPacketColorList = [];
                let outPacketColorList = [];
                let innerArr = this.createArrLength(this.formValidate.innerPacketNumber);
                let outArr = this.createArrLength(this.formValidate.outerPacketNumber);
                this.tableDataRight = [];
                this.tableDataLeft = [];
                // 外圈圈包数
                outArr.forEach((item, index) => {
                    // 设置包和缝的颜色
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 有副产品时，既有包又有缝
                        outPacketColorList.push('#2B85E4');// 外圈包颜色
                        outPacketColorList.push('#FF9900');// 外圈缝颜色
                    } else {
                        // 没有副产品时，只有包
                        outPacketColorList.push('#2B85E4');// 外圈包颜色
                    };
                    // 默认第一个原料
                    responseData.mpProductId = responseData.rawMaterialList[0].productId;
                    responseData.mpProductCode = responseData.rawMaterialList[0].productCode;
                    responseData.mpProductName = responseData.rawMaterialList[0].productName;
                    responseData.mpBatchCode = responseData.rawMaterialList[0].batchCode;
                    responseData.mpPrdCottonBlendingMaterialId = responseData.rawMaterialList[0].prdCottonBlendingMaterialId;
                    responseData.packetWeight = responseData.byProductList && responseData.byProductList.length !== 0 ? responseData.byProductList[0].packetWeight : 0;// ?????
                    responseData.packetQty = responseData.byProductList && responseData.byProductList.length !== 0 ? responseData.byProductList[0].packetQty : 0;// ?????
                    this.tableDataLeft.push(responseData);
                });
                // 内圈包数
                innerArr.forEach((item, index) => {
                    // 设置包和缝的颜色
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        // 有副产品时，既有包又有缝
                        innerPacketColorList.push('#2b85e4');// 内圈包颜色
                        innerPacketColorList.push('#FF9900');// 内圈缝颜色
                    } else {
                        // 没有副产品时，只有包
                        innerPacketColorList.push('#2b85e4');// 内圈包颜色
                    };
                    // 存在副产品的情况下，默认第一个
                    if (responseData.byProductList && responseData.byProductList.length !== 0) {
                        responseData.msProductId = responseData.byProductList[0].productId;
                        responseData.msProductCode = responseData.byProductList[0].productCode;
                        responseData.msProductName = responseData.byProductList[0].productName;
                        responseData.msBatchCode = responseData.byProductList[0].batchCode;
                        responseData.msPrdCottonBlendingMaterialId = responseData.byProductList[0].prdCottonBlendingMaterialId;
                        responseData.packetWeight = responseData.byProductList[0].packetWeight;
                        responseData.packetQty = responseData.byProductList[0].packetQty;
                    } else {
                        responseData.msProductId = null
                        responseData.msProductCode = '';
                        responseData.msProductName = '';
                        responseData.msBatchCode = '';
                        responseData.msPrdCottonBlendingMaterialId = null;
                        responseData.packetWeight = null;
                        responseData.packetQty = null;
                    };
                    this.tableDataRight.push(responseData);
                });
                this.initData.innerPacketColorList = innerPacketColorList;
                this.initData.outPacketColorList = outPacketColorList;
                // 如果没有副产品就没有缝
                this.initData.hasCrevice = responseData.byProductList && responseData.byProductList.length !== 0 ? true : false;
                this.calculatePacket();
                setTimeout(() => { this.pieChartData = JSON.parse(JSON.stringify(this.initData)); }, 0);
            },
            // 动态数组
            createArrLength (length) {
                return Array(length).fill(null).map((_, h) => h);
            },
            // 确认事件
            machinePackModalConfirmEvent () {
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {
                        this.confirmButtonLoading = true;
                        this.saveRequest();
                    } else {
                        noticeTips(this, 'unCompleteTips');
                    };
                });
            },
            // 计算包数（总包数）
            calculatePacket () {
                let materialPacketNum = 0; // 原料包数
                let lapWastePacketNum = 0;
                this.tableDataLeft.forEach((item, index) => {
                    if (item.mpProductCode) {
                        materialPacketNum = mathJsAdd(materialPacketNum, 1);
                    };
                });
                this.tableDataRight.forEach((item, index) => {
                    if (item.mpProductCode) {
                        lapWastePacketNum = mathJsAdd(lapWastePacketNum, 1);
                    };
                });
                this.formValidate.materialPacketQty = 0;
                setTimeout(() => {
                    this.$set(this.formValidate, 'materialPacketQty', mathJsAdd(lapWastePacketNum, materialPacketNum));
                }, 0);
            },
            // 保存的请求
            saveRequest () {
                this.tableDataLeft.forEach((item, index) => {
                    delete item.id;
                    item.serialNumber = index + 1;
                });
                this.tableDataRight.forEach((item, index) => {
                    delete item.id;
                    item.serialNumber = index + 1;
                });
                this.formValidate.outerPlaceList = this.tableDataLeft;
                this.formValidate.innerPlaceList = this.tableDataRight;
                this.formValidate.ranksPlaceList = [];
                this.formValidate.cottonPackingDate ? this.formValidate.cottonPackingDate = formatDate(this.formValidate.cottonPackingDate) : this.formValidate.cottonPackingDate = '';
                this.$call('prd.cotton.blending.area.save', this.formValidate).then(res => {
                    if (res.data.status === 200) {
                        noticeTips(this, 'saveTips');
                        this.$emit('on-confirm');
                    } else {
                        this.confirmButtonLoading = false;
                    };
                });
            },
            machinePackModalCancelEvent () {
                this.$emit('on-cancel');
                this.$refs['formValidate'].resetFields();
            },
            machinePackModalStateChangeEvent (e) {
                this.$emit('on-visible-change', e);
                if (e === false) {
                    this.pieChartData = {};
                    this.isDiscType = false;
                    this.isRecType = false;
                    this.confirmButtonLoading = false;
                    this.formValidate = {};
                    this.$refs['formValidate'].resetFields();
                };
            }
        },
        watch: {
            machinePackModalState (newVal, oldVal) {
                this.showModal = newVal;
            },
            machinePackModalData: {
                handler (newVal, oldVal) {
                    if (Object.keys(newVal).length !== 0) {
                        this.formValidate = JSON.parse(JSON.stringify(newVal));
                        this.formValidate.auditState ? this.formValidate.auditStateName = translateState(this.formValidate.auditState) : false;
                        if (newVal.typeName) {
                            if (newVal.typeName.indexOf('圆盘式') !== -1) {
                                this.isDiscType = true;
                                this.isRecType = false;
                                this.tableDataLeft = newVal.outerPlaceList;
                                this.tableDataRight = newVal.innerPlaceList;
                                newVal.creviceTableData.forEach(item => { item.packetQty = this.formValidate.lapWastePacketQty; });
                                this.creviceTableData = newVal.creviceTableData;
                                setTimeout(() => { this.pieChartData = newVal; }, 0);
                                this.initData = newVal;
                            } else {
                                this.isDiscType = false;
                                this.isRecType = true;
                            };
                        };
                    };
                },
                deep: true
            }
        }
    };
</script>
<style lang="less">
    .total-label-width {
        column-width:  40px;
        font-weight: bold;
    }
    .total-label {
        font-weight: bold;
    }
    .formItem-margin-0 {
        margin: 0;
    }
    .chart-param {
        display: flex;
        margin-top: 10px;
        .ivu-form-item-content {
            position: relative;
            line-height: 30px;
            font-size: 12px;
        }
        .ivu-table-small td {
            height: 30px;
        }
        .ivu-table-cell span{
            padding-left: 4px;
            padding-right: 0;
        }
        .ivu-table-tip table {
            width: auto;
        }
    }
    .flex-left .cell-item {
        width: 25px;
        height: 25px;
        background: #ff9900;
        border: solid 1px #fff;
    }
    .total-bar-border {
        border: 1px solid gainsboro;
        border-radius: 6px;
        padding: 4px;
    }
</style>

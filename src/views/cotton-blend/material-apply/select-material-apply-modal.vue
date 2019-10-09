<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择原料"
                :mask-closable="false"
                @on-visible-change="modalStateChangeEvent"
                width="1600"
        >
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectMaterialApplyConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Select clearable v-model="queryBarWorkshopId" placeholder="请选择生产车间" class="searchHurdles">
                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <DatePicker type="date" placeholder="请选择开始时间" class="searchHurdles padding-left-4" v-model="queryBarDateFrom"></DatePicker>
                    <DatePicker type="date" placeholder="请选择结束时间" class="searchHurdles padding-left-4" v-model="queryBarDateTo"></DatePicker>
                    <Input type="text" v-model="queryBarOrderCode" placeholder="请输入生产单号" class="searchHurdles padding-left-4"/>
                    <Input type="text" v-model="queryBarVersionNumber" class="searchHurdles queryBarMarginRight padding-left-4" placeholder="请输入配棉版本号"/>
                    <Button icon="ios-search" type="primary" @click="selectMaterialApplyModalSearchBtnEvent">搜索</Button>
                </Col>
            </Row>
            <Row class="tableMargin">
                <Col span="24">
                    <Table :loading="tableLoading" highlight-row @on-selection-change="getCheckRowEvent" :height="600" size="small" border :columns="tableHeader" :data="tableData"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="pageStyle">
                    <Page show-total :page-size="pageSize" :total="pageTotal" size="small" @on-change="getPageCodeEvent"></Page>
                </Col>
            </Row>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script>
    import { clearSpace, setPage, noticeTips, formatDay } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import moreOrder from '../archives/more-order';

    export default {
        components: { modalContentLoading, moreOrder },
        props: {
            selectedData: {
                type: Array
            },
            selectMaterialApplyModalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pageIndex: 0,
                pageSize: setPage.pageSize,
                pageTotal: 0,
                queryBarDateFrom: '',
                queryBarDateTo: '',
                queryBarOrderCode: '',
                queryBarVersionNumber: '',
                queryBarWorkshopId: null,
                queryBarWorkshopList: [],
                tableLoading: false,
                pageCount: null,
                checkRow: [],
                showModal: false,
                tableHeader: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '配棉日期',
                        key: 'date',
                        align: 'center',
                        width: 100
                    },
                    {
                        title: '配棉版本号',
                        key: 'versionNumber',
                        minWidth: 110,
                        align: 'left'
                    },
                    {
                        title: '物料',
                        key: 'productName',
                        align: 'left',
                        width: 200,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.productName ? `${params.row.productName}(${params.row.productCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '规格',
                        key: 'productModels',
                        minWidth: 80,
                        align: 'left'
                    },
                    {
                        title: '计量单位',
                        key: 'unitName',
                        minWidth: 80,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: params.row.unitName ? `${params.row.unitName}(${params.row.unitCode})` : ''
                                }
                            });
                        }
                    },
                    {
                        title: '平均包重',
                        key: 'packetWeight',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '配棉包数',
                        key: 'packetQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '已领包数',
                        key: 'usedPacketQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '未领包数',
                        key: 'unusedPacketQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '配棉重量',
                        key: 'weightQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '已领重量',
                        key: 'usedWeightQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '未领重量',
                        key: 'unusedWeightQty',
                        minWidth: 100,
                        align: 'center'
                    },
                    {
                        title: '生产订单号',
                        key: 'prdOrderCodes',
                        minWidth: 100,
                        render: (h, params) => {
                            let prdOrderCodesData = [];
                            if (params.row.prdOrderCodes) {
                                typeof params.row.prdOrderCodes === 'string' ? prdOrderCodesData = JSON.parse(params.row.prdOrderCodes) : prdOrderCodesData = params.row.prdOrderCodes;
                            } else {
                                prdOrderCodesData = [];
                            };
                            return h(moreOrder, {
                                props: {
                                    moreOrderData: prdOrderCodesData
                                }
                            });
                        }
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        minWidth: 90,
                        align: 'center'
                    }
                ],
                tableData: []
            };
        },
        methods: {
            getPageCodeEvent (pageIndex) {
                this.pageIndex = pageIndex;
                this.getCottonBlendingMaterialListRequest();
            },
            // 搜索按钮的点击事件
            selectMaterialApplyModalSearchBtnEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getCottonBlendingMaterialListRequest();
            },
            // 双击
            getCheckRowEvent (e) {
                this.checkRow = e;
                this.$emit('confirm-event', this.checkRow);
            },
            // 确认选择事件
            selectMaterialApplyConfirmEvent () {
                let unDisableData = [];
                this.checkRow.forEach(item => {
                    if (!item._disabled || item._disabled === false) {
                        unDisableData = [...unDisableData, item];
                    };
                });
                if (unDisableData && unDisableData.length !== 0) {
                    this.$emit('on-confirm', unDisableData);
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            modalStateChangeEvent (e) {
                if (e === false) {
                    this.queryBarVersionNumber = '';
                    this.checkRow = [];
                    this.queryBarOrderCode = '';
                    this.queryBarVersionNumber = '';
                    this.queryBarDateFrom = '';
                    this.queryBarDateTo = '';
                };
                this.$emit('on-visible-change', e);
            },
            // 配棉原料列表数据
            getCottonBlendingMaterialListRequest () {
                this.tableLoading = true;
                this.queryBarVersionNumber = clearSpace(this.queryBarVersionNumber);
                this.queryBarOrderCode = clearSpace(this.queryBarOrderCode);
                this.queryBarDateFrom ? this.queryBarDateFrom = formatDay(this.queryBarDateFrom) : '';
                this.queryBarDateTo ? this.queryBarDateTo = formatDay(this.queryBarDateTo) : '';
                return this.$call('prd.cotton.blending.material.list', {
                    dateFrom: this.queryBarDateFrom,
                    dateTo: this.queryBarDateTo,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    workshopId: this.queryBarWorkshopId,
                    versionNumber: this.queryBarVersionNumber,
                    prdOrderCode: this.queryBarOrderCode
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.selectedData.forEach(selectedItem => {
                            responseData.forEach(allItem => {
                                if (selectedItem.prdCottonBlendingMaterialId === allItem.prdCottonBlendingMaterialId) {
                                    allItem._checked = true;
                                    allItem._disabled = true;
                                };
                            });
                        });
                        this.tableData = responseData;
                        this.tableLoading = false;
                        this.pageTotal = res.data.count;
                    };
                });
            },
            getWorkshopRequest () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.queryBarWorkshopId = responseData.defaultDeptId;
                        this.queryBarWorkshopList = responseData.userData;
                    }
                });
            },
            async getDependencyData () {
                await this.getWorkshopRequest();
                await this.getCottonBlendingMaterialListRequest();
            }
        },
        watch: {
            selectMaterialApplyModalState (newData, oldData) {
                this.showModal = newData;
                if (newData) {
                    this.tableLoading = true;
                    this.getDependencyData();
                };
            }
        }
    };
</script>

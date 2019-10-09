<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择排包图"
                :mask-closable="false"
                @on-visible-change="modalStateChangeEvent"
                width="1250"
        >
            <Row type="flex" justify="space-between">
                <Col>
                    <Button type="success" @click="selectMaterialApplyConfirmEvent">确认选择</Button>
                </Col>
                <Col class="flex-left">
                    <Select clearable v-model="queryBarWorkshopId" placeholder="请选择生产车间" class="searchHurdles">
                        <Option v-for="item in queryBarWorkshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Input type="text" v-model="queryBarMachine" placeholder="请输入机台编号或名称" class="searchHurdles padding-left-4"/>
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
    import { clearSpace, setPage, noticeTips, formatDay, mathJsAdd } from '../../../libs/common';
    import modalContentLoading from '../../components/modal-content-loading';
    import moreOrder from '../archives/more-order';

    export default {
        components: { modalContentLoading, moreOrder },
        props: {
            selectedData: {
                type: Array
            },
            selectPackChartModalState: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                pageIndex: 0,
                pageSize: setPage.pageSize,
                pageTotal: 0,
                queryBarMachine: '',
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
                        fixed: 'left',
                        align: 'center'
                    },
                    {
                        title: '配棉日期',
                        key: 'date',
                        align: 'left',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 110
                    },
                    {
                        title: '配棉版本号',
                        key: 'versionNumber',
                        fixed: 'left',
                        sortable: true,
                        minWidth: 130,
                        align: 'left'
                    },
                    {
                        title: '生产车间',
                        key: 'workshopName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '机台名称',
                        key: 'machineName',
                        align: 'left',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '排包区域',
                        key: 'packingAreaName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '配棉包数',
                        key: 'packetQty',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '抓包方式',
                        key: 'typeName',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '已领包数',
                        key: 'usedPacketQty',
                        align: 'center',
                        minWidth: 110,
                        sortable: true
                    },
                    {
                        title: '圆盘包数',
                        key: 'usedPacketQty',
                        align: 'center',
                        minWidth: 110,
                        sortable: true,
                        render: (h, params) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: mathJsAdd(params.row.materialPacketQty, params.row.lapWastePacketQty)
                                }
                            })
                        }
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
            // 获取勾选的row
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
                    this.$call('prd.cotton.blending.area.listByIds', unDisableData.map(item => item.id)).then(res => {
                        if (res.data.status === 200) {
                            this.$emit('on-confirm', res.data.res);
                        };
                    });
                } else {
                    noticeTips(this, 'unCheckTips');
                };
            },
            modalStateChangeEvent (e) {
                if (e === false) {
                    this.queryBarVersionNumber = '';
                    this.checkRow = [];
                    this.queryBarMachine = '';
                    this.queryBarVersionNumber = '';
                };
                this.$emit('on-visible-change', e);
            },
            // 排包图列表数据
            getCottonBlendingMaterialListRequest () {
                this.tableLoading = true;
                this.queryBarVersionNumber = clearSpace(this.queryBarVersionNumber);
                this.queryBarMachine = clearSpace(this.queryBarMachine);
                return this.$call('prd.cotton.blending.area.list', {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    auditState: 3,
                    workshopId: this.queryBarWorkshopId,
                    versionNumber: this.queryBarVersionNumber,
                    machine: this.queryBarMachine
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.selectedData.forEach(selectedItem => {
                            responseData.forEach(allItem => {
                                // if (selectedItem.prdCottonBlendingMaterialId === allItem.prdCottonBlendingMaterialId) {
                                // 相同的版本号和排包区域不能再次选择
                                if (selectedItem.packingAreaId === allItem.packingAreaId && selectedItem.versionNumber === allItem.versionNumber) {
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
            selectPackChartModalState (newData, oldData) {
                this.showModal = newData;
                if (newData) {
                    this.tableLoading = true;
                    this.getDependencyData();
                };
            }
        }
    };
</script>

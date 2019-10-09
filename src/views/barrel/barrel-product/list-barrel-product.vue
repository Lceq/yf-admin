<template>
    <Card>
        <Row type="flex" justify="end">
            <Col class="flex-left">
                <Select clearable v-model="queryBarWorkshopId" placeholder="请选择车间" class="queryBarMarginRight searchHurdles">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Input v-model.trim="queryBarBarrel" placeholder="请输入条筒编号" class="queryBarMarginRight searchHurdles"/>
                <Input v-model.trim="queryBarProduct" placeholder="请输入产品编号或名称" class="queryBarMarginRight searchHurdles"/>
                <Input v-model.trim="queryBarMachine" placeholder="请输入机台编号或名称" class="queryBarMarginRight searchHurdles"/>
                <Button icon="ios-search" type="primary" @click="searchButtonClickEvent" class="queryButtonStyle">搜索</Button>
            </Col>
        </Row>
        <Row class="margin-top-10 tableOffsetTop margin-bottom-10">
            <Col>
                <Table :height="tableHeight" size="small" border :columns="tableHeader" :data="tableData"></Table>
            </Col>
        </Row>
        <Row class="pageHeight">
            <Col class="pageStyle">
                <Page :total="pageTotal" show-elevator :page-size-opts="pageOpts" :show-total="true" :page-size="pageSize" @on-change="getPage" :show-sizer="true" @on-page-size-change="pageChange"></Page>
            </Col>
        </Row>
    </Card>
</template>
<script>
    import { compClientHeight, noticeTips, translateState, emptyTips, setPage } from '../../../libs/common';
    export default {
        name: 'barrel-product',
        data () {
            return {
                pageTotal: null,
                pageSize: setPage.pageSize,
                pageOpts: setPage.pageOpts,
                pageIndex: 1,
                queryBarProduct: '',
                queryBarMachine: null,
                queryBarWorkshopId: null,
                machineList: [],
                workshopId: null,
                workshopName: '',
                workshopList: [],
                paramsTypeList: [
                    {
                        paramType: 1,
                        paramTypeName: '腰绳'
                    },
                    {
                        paramType: 2,
                        paramTypeName: '封包绳'
                    }
                ],
                queryBarBarrel: '',
                buttonLoading: false,
                tableHeight: 0,
                formValidate: {},
                tableHeader: [
                    {
                        title: '条筒编号',
                        key: 'barrelCode',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '产品编号',
                        key: 'productCode',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '产品名称',
                        key: 'productName',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '批号',
                        key: 'batchCode',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '上机状态',
                        key: 'onlineStatus',
                        sortable: true,
                        minWidth: 130,
                        render: (h, param) => {
                            return h('div', {
                                domProps: {
                                    innerHTML: param.row.onlineStatus ? '已上机' : '未上机'
                                }
                            });
                        }
                    },
                    {
                        title: '下机机台',
                        key: 'machineName',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '下机时间',
                        key: 'collectTime',
                        sortable: true,
                        minWidth: 130
                    },
                    {
                        title: '系统创建时间',
                        key: 'createTime',
                        sortable: true,
                        minWidth: 130
                    }
                ],
                tableData: []
            };
        },
        methods: {
            // 获取页码
            getPage (e) {
                this.pageIndex = e;
                this.getListRequest();
            },
            // 获取每页的条数
            pageChange (e) {
                this.pageIndex = 1;
                this.pageSize = e;
                this.getListRequest();
            },
            // 搜索事件
            searchButtonClickEvent () {
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getListRequest();
            },
            getListRequest () {
                this.$call('barrel.product.list', {
                    barrel: this.queryBarBarrel,
                    workshopId: this.queryBarWorkshopId,
                    machine: this.queryBarMachine,
                    product: this.queryBarProduct,
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = translateState(res.data.res);
                        this.pageTotal = res.data.count;
                    };
                });
            },
            calculationTableHeight () {
                let tableDom = document.getElementsByClassName('tableOffsetTop')[0];
                this.tableHeight = compClientHeight(tableDom.offsetTop + 200);
                window.onresize = () => {
                    this.tableHeight = compClientHeight(tableDom.offsetTop + 200);
                };
            },
            getWorkshopHttp (resolve, reject) {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.workshopId = responseData.defaultDeptId;
                        this.queryBarWorkshopId = responseData.defaultDeptId;
                        this.workshopName = responseData.defaultDeptName;
                        this.workshopList = responseData.userData;
                        resolve(res);
                    }
                });
            },
            getMachineListRequest (workshopId) {
                return this.$call('machine.cardingList', {workshopId: workshopId, typeId: 26, processCode: 'QH'});
            }
        },
        created () {
            let workshopList = new Promise((resolve, reject) => this.getWorkshopHttp(resolve, reject));
            Promise.all([workshopList]).then(res => {
                this.getMachineListRequest(this.workshopId).then(res => {
                    if (res.data.status === 200) { this.machineList = res.data.res; };
                });
                this.getListRequest();
            });
        },
        mounted () {
            this.$nextTick(() => { this.calculationTableHeight(); });
        }
    };
</script>

<template>
    <Card class="car-bar">
        <global-loading v-show="showGlobalLoading"></global-loading>
        <Row type="flex" justify="end">
            <Col class="flex-left">
                <div>
                    <Select v-model="workshopId" class="searchHurdles queryBarMarginRight">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                </div>
                <div>
                    <DatePicker :clearable="false" v-model="dateValue" type="month" placeholder="请选择日期" class="searchHurdles queryBarMarginRight"></DatePicker>
                </div>
                <Button icon="ios-search" type="primary" @click="queryBarSearchClickEvent" class="queryButtonStyle queryBarMarginRight">搜索</Button>
                <Button type="success" @click="exportEvent" class="queryButtonStyle">导出</Button>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col>
                <div class="table-title-bar">山东正凯入库产量进度表（1）</div>
                <Table border :columns="tableHeader" :data="stockList" size="small"></Table>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col>
                <div class="table-title-bar">山东正凯入库(折标)产量进度表（2）</div>
                <Table border :columns="tableHeader" :data="discountStockList" size="small"></Table>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col>
                <div class="table-title-bar">山东正凯细纱产量进度表（3）</div>
                <Table border :columns="tableHeader" :data="spunYarnList" size="small"></Table>
            </Col>
        </Row>
    </Card>
</template>
<script>
    import excel from '@/libs/excel'
    import { toDay, formatDate, mathJsAdd } from '../../libs/common';
    export default {
        data () {
            return {
                tableHeader: [],
                warehouseYieldTableHeader: [],
                workshopList: [],
                workshopId: null,
                dateValue: toDay(),
                showGlobalLoading: false,
                tableHeight: 0,
                discountStockList: [],
                spunYarnList: [],
                stockList: []
            };
        },
        methods: {
            exportEvent () {
                let dataList = [{title: '山东正凯入库产量进度表（1）'},...this.stockList, {}, {title: '山东正凯入库(折标)产量进度表（2）'}, ...this.discountStockList, {}, {title: '山东正凯细纱产量进度表（3）'}, ...this.spunYarnList];
                const params = {
                    title: this.tableHeader.map(item => item.title),
                    key: this.tableHeader.map(item => {
                        let keys = null;
                        if (item.key) {
                            keys = item.key;
                        } else if (item.children) {
                            keys = item.children[0].key;
                        };
                        return keys
                    }),
                    data: dataList,
                    autoWidth: true,
                    filename: '生产进度报表'
                };
                excel.export_array_to_excel(params)
            },
            queryBarSearchClickEvent () {
                this.getListRequest();
            },
            getWorkshopListRequest () {
                return this.$call('user.data.workshops2').then(res => {
                    if (res.data.status === 200) {
                        this.workshopId = res.data.res.defaultDeptId;
                        this.workshopList = res.data.res.userData;
                    };
                })
            },
            getListRequest () {
                this.dateValue ? this.dateValue = formatDate(this.dateValue).split(' ')[0] : this.dateValue = '';
                return this.$call('statistic.progress.chart', {
                    date: this.dateValue,
                    workshopId: this.workshopId
                }).then(res => {
                    if (res.data.status === 200) {
                        let responseData = res.data.res;
                        this.tableHeader = responseData.titleList.map((item, index) => {
                            let fixedDirection = '';
                            if (index === 0) {
                                fixedDirection = 'left';
                            } else if ( index >= responseData.titleList.length - 2) {
                                fixedDirection = 'right';
                            } else {
                                fixedDirection = '';
                            };
                            return {
                                title: index === 0 ? '项目/日期' : item,
                                fixed: fixedDirection,
                                key: item,
                                align: index === 0 || index === responseData.titleList.length - 2 ? 'left' : 'right',
                                minWidth: index === 0 || index >= responseData.titleList.length - 2 ? 150 : 100
                            };
                        });
                        this.stockList = responseData.stockList;
                        this.spunYarnList = responseData.spunYarnList;
                        this.discountStockList = responseData.discountStockList;
                        this.showGlobalLoading = false;
                    };
                });
            },
            // 获取依赖数据
            async getDependentDataHttp () {
                await this.getWorkshopListRequest();
                await this.getListRequest();
            },
            calculationTableHeight () {
                this.tableHeight = document.documentElement.clientHeight - 250;
                window.onresize = () => {
                    this.tableHeight = document.documentElement.clientHeight - 250;
                }
            }
        },
        created () {
            this.showGlobalLoading = true;
            this.getDependentDataHttp();
        },
        mounted () {
            this.$nextTick(() => this.calculationTableHeight());
        }
    };
</script>
<style>
    .table-title-bar {
        text-align: center;
        font: bold 18px/40px '';
    }
</style>

<template>
   <Card>
       <Row id="selectedHeight" class="endFlex">
           <Col>
               <span class="formSpanStyle">日期：</span>
               <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker> <span>-</span>
               <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
               <Select class="formEachStyle textLeft" placeholder="请选择车间" clearable v-model="workshopId">
                   <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
               </Select>
               <Select class="formEachStyle textLeft" placeholder="请选择班组" clearable v-model="groupId">
                   <Option v-for="item in groupList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
               </Select>
               <Select class="formEachStyle textLeft" placeholder="请选择数据状态" clearable v-model="packState">
                   <Option v-for="item in packStateList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
               </Select>
               <Input v-model="userName" placeholder="请输入员工姓名" class="formEachStyle"/>
               <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
           </Col>
       </Row>
       <Table class="marginBottom" border :height="tableHeight" :loading="packLoading" :data="packList" :columns="packColumns" size="small"></Table>
       <div class="endFlex">
           <p style="width: 110px; display: inline-block; text-align: right; padding-right: 20px;">合计：</p>
           <p style="width: 110px; display: inline-block; text-align: right; padding-right: 20px;">{{ reportQty }}</p>
       </div>
<!--       <Page class="textRight" :total="packTotal" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>-->
   </Card>
</template>

<script>
import {page, curDate} from '../../../libs/tools';

export default {
    name: 'pack-list',
    data () {
        return {
            reportQty: 0,
            userName: '',
            packState: '',
            dateFrom: curDate(),
            dateTo: curDate(),
            packStateList: [
                {
                    id: 0,
                    name: '提交'
                },
                {
                    id: 1,
                    name: '班长审核'
                },
                {
                    id: 2,
                    name: '主任审核'
                }
            ],
            tableHeight: '',
            workshopId: '',
            workshopList: [],
            groupList: [],
            groupId: '',
            packLoading: false,
            packList: [],
            packColumns: [
                {
                    title: '报工日期',
                    key: 'date',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '人员',
                    key: 'reporterName',
                    align: 'left',
                    minWidth: 80
                },
                {
                    title: '产品',
                    key: 'productName',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '员工产量(kg)',
                    key: 'reportQty',
                    width: 110,
                    fixed: 'right',
                    sortable: true,
                    align: 'right'
                },
                {
                    title: '订单号',
                    key: 'prdOrderCode',
                    align: 'left',
                    minWidth: 130
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '报工状态',
                    key: 'packState',
                    minWidth: 110,
                    sortable: true,
                    align: 'center',
                    render: (h, params) => {
                        return h('span', {}, params.row.packState === 0 ? '创建' : (params.row.packState === 1 ? '班长审核' : (params.row.packState === 2 ? '主任审核' : (params.row.packState === 3 ? '已入库' : (params.row.packState === 4 ? '已关闭' : '')))));
                    }
                },
                // {
                //     title: '报工产量(Kg)',
                //     key: 'totalQty',
                //     minWidth: 100,
                //     align: 'left'
                // },
                {
                    title: '车间',
                    key: 'workshopName',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            pageSize: page().pageSize,
            pageOpts: page().pageOpts,
            packTotal: 0
        };
    },
    methods: {
        getUserWorkshops () {
            this.$call('user/data/workshops2').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopId = content.res.defaultDeptId;
                    this.workshopList = content.res.userData;
                    this.getUserGroup();
                }
            });
        },
        getUserGroup () {
            this.$call('user/data/groups3', {parentId: this.workshopId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.groupId = content.res.defaultDeptId;
                    this.groupList = content.res.userData;
                }
            });
        },
        changeStartDate (val) {
            this.dateFrom = val;
        },
        changeEndDate (val) {
            this.dateTo = val;
        },
        searchResult () {
            this.pageIndex = 1;
            setTimeout(() => {
                this.pageTotal = 0;
            });
            this.getPackList();
        },
        getPackList () {
            let params = {
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                workshopId: this.workshopId,
                groupId: this.groupId,
                packState: this.packState,
                userName: this.userName
            };
            this.$call('pack.report.list4', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.packTotal = content.count;
                    this.reportQty = 0;
                    this.packList = content.res.map(x => {
                        this.reportQty += x.reportQty;
                        return x;
                    });
                } else {
                    this.packList = [];
                }
            });
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.getPackList();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.getPackList();
        }
    },
    mounted () {
        this.getUserWorkshops();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        });
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        };
    }
};
</script>

<style scoped>

</style>

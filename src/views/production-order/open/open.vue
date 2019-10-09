<template>
    <div>
        <Card>
            <Row id="searchHeight">
                <Col class="parentFlex">
                    <div class="flex-item">
                        <span class="formSpanStyle">计划开工日期：</span>
                        <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" placeholder="请选择日期" :value="curTimeFrom"></DatePicker><span class="formSpanStyle" style="margin-right: 10px;">-</span><DatePicker class="formEachStyle" @on-change="changeToTime" type="date" placeholder="请选择日期" :value="curTimeTo"></DatePicker>
                        <span class="formSpanStyle">生产车间：</span>
                        <Select class="formEachStyle textLeft" clearable v-model="modelWorkShop">
                            <Option v-for="item in workShopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <span class="formSpanStyle">生产通知单号：</span>
                        <Input class="formEachStyle" clearable v-model="code" placeholder="请输入生产通知单号" />
                        <span class="formSpanStyle">生产品种：</span>
                        <Input class="formEachStyle" clearable v-model="productCode" placeholder="请输入物料编码" />
                        <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    </div>
                </Col>
            </Row>
            <Row id="tableHeight">
                <Col class="marginBottom">
                    <Table border size="small" :loading="openTableLoading" :height="tableHeight" ref="selection" :columns="openColumns" :data="openTableData"></Table>
                </Col>
            </Row>
           <Row id="pageHeight">
               <Col class="textRight">
                   <Page :total="openTotalNum" :page-size="openPageSize" :page-size-opts="openPageSizeOpts" :placement="openDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize" show-sizer show-total show-elevator></Page>
               </Col>
           </Row>
        </Card>
    </div>
</template>
<script>
import modal from '../../public/modal';
import publicJs from '../../../libs/common';
export default {
    components: {
        modal
    },
    data () {
        return {
            modelWorkShop: '',
            workShopList: [],
            curTimeFrom: '',
            curTimeTo: '',
            code: '',
            productCode: '',
            openColumns: [
                {
                    title: '生产通知单号',
                    align: 'center',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 160,
                    key: 'code'
                },
                {
                    title: '生产车间',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
                    fixed: 'left',
                    key: 'workshopName'
                },
                {
                    title: '物料编码',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
                    key: 'productCode'
                },
                {
                    title: '物料名称',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'productName'
                },
                {
                    title: '单位',
                    minWidth: 100,
                    align: 'center',
                    sortable: true,
                    key: 'productUnitCode'
                },
                {
                    title: '生产数量',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'produceCount'
                },
                // {
                //     title: '完工数量',
                //     align: 'center',
                //     sortable: true,
                //     key: 'endNum'
                // },
                {
                    title: '计划开工时间',
                    align: 'center',
                    sortable: true,
                    minWidth: 160,
                    key: 'planFrom'
                },
                {
                    title: '计划完工时间',
                    align: 'center',
                    sortable: true,
                    minWidth: 160,
                    key: 'planTo'
                },
                {
                    title: '开台状态',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'openState'
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 160,
                    sortable: true,
                    render: (h, params) => {
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        // this.$store.state.curOpenSheet = params.row.id;
                                        let paramId = params.row.id;
                                        // Cookies.set('curOpenSheet', paramId);
                                        // debugger
                                        // Bus.$on('curmsgbb', (e) => {
                                        //     debugger
                                        // })
                                        // this.$router.push({path: 'openSheet/' + paramId});
                                        // bus.$emit('custTreeSay', this.model.id);
                                        // this.$router.push({path: 'openSheet', query: {id: paramId}});
                                        this.$router.push({path: 'openSheet', query: {id: paramId}});
                                        // this.machineId = this.$route.query.machineId
                                        // this.machineName = this.$route.query.machineName
                                    }
                                }
                            }, '品种开台')
                        ]);
                    }
                }
            ],
            openTableData: [],
            openTableLoading: false,
            openTotalNum: 1,
            openPageIndex: '',
            openPageSize: publicJs.pageSize,
            openPageSizeOpts: publicJs.pageOpts,
            openDirect: publicJs.pageUp,
            tableHeight: document.documentElement.clientHeight - 240,
            menuList: [],
            openModalShow: false,
            openLoading: false
        };
    },
    methods: {
        getStartDay () {
            var mydate = new Date();
            var y = mydate.getFullYear();
            var m = mydate.getMonth() + 1;
            var d = mydate.getDate();
            if (m < 10) {
                m = '0' + m;
            }
            if (d < 10) {
                d = '0' + d;
            }
            return this.curTimeFrom = '';
        },
        changeStartTime (val) {
            this.curTimeFrom = val;
        },
        changeToTime (val) {
            this.curTimeTo = val;
        },
        changePageIndex (val) {
            this.openPageIndex = val;
            this.getNoticeDateList();
        },
        changePageSize (val) {
            this.openPageSize = val;
            this.getNoticeDateList();
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    if (content.res === null) {
                        _this.modelWorkShop = _this.workShopList[0].id;
                    } else {
                        _this.modelWorkShop = content.res.id;
                    }
                    this.getNoticeDateList();
                };
            });
        },
        searchResult () {
            setTimeout(() => {
                this.openTotalNum = 1;
            });
            this.getNoticeDateList();
        },
        // 获取生产通知单号
        getNoticeDateList () {
            this.openTableLoading = true;
            this.$fetch('notice/sheet/list', {
                auditstate: 3,
                noticedatefrom: this.curTimeFrom,
                noticedateto: this.curTimeTo,
                workshopid: this.modelWorkShop,
                code: this.code,
                productcode: this.productCode,
                pageindex: this.openPageIndex,
                pagesize: this.openPageSize
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.openTotalNum = content.count;
                    this.openTableData = content.res.map(x => {
                        x.openState = x.openState === 2 ? '已开台' : (x.openState === 1 ? '部分开台' : (x.openState === 3 ? '已了机' : '未开台'));
                        return x;
                    });
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    this.openTableLoading = false;
                }
            });
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.curTimeTo = this.Today;
        this.getStartDay();
        // this.getNextDay(this.getStartDay());
    },
    mounted () {
        const _this = this;
        this.$fetch('dept/workshops').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                _this.workShopList = content.res;
                _this.getUserWorkshop();
            }
        });
        window.onresize = () => {
            let tableHeight = document.getElementById('tableHeight').offsetTop;
            // let searchHeight = document.getElementById('searchHeight');
            this.tableHeight = document.documentElement.clientHeight - tableHeight - 185;
            // console.log(this.tableHeight);
        };
    },
    computed: {
        curProcessId: () => {
            // console.log(this.$store.state.curProcessId);
            // debugger
            return this.$store.state.curProcessId;
        },
        Today: () => {
            const date = new Date();
            const seperator1 = '-';
            const year = date.getFullYear();
            const month = parseInt(date.getMonth() + 1) < 10 ? '0' + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
            const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            const currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + m + s;
            return currentdate;
        }
    }
};
</script>

<style scoped>
.verticalAlign{
    vertical-align: middle;
}
.verticalSpan{
    line-height: 32px;
    vertical-align: middle;
}
.formWidth {
    width: 160px;
    margin-bottom: 10px;
    vertical-align: middle;
}
.openPutStyle{
    width: 150px;
    margin-bottom: 10px;
    vertical-align: middle;
}
.spanWidth{
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    line-height: 32px;
}
</style>

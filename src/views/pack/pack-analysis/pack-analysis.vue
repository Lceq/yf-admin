<template>
    <Card id="pack-table">
        <Tabs v-model="name">
            <TabPane label="订单完成报表" name="name1">
                <div id="" class="parentFlexBetween marginBottom">
                    <div>
                        <span class="">车间：</span>
                        <Select class="formWidth textLeft" clearable v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                    </div>
                    <Button type="primary" shape="circle" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>
                </div>
                <xw-table-title
                        :name="isName1"
                        :fullFullCreen="fullFullCreen"
                        :height="tableHeight"
                        :tableList="tableList"
                        :tableTitle="tableTitle"
                ></xw-table-title>
            </TabPane>
            <TabPane label="人员产量统计表" name="name2">
                <div id="" class="parentFlexBetween marginBottom">
                    <div>
                        <span class="">车间：</span>
                        <Select class="formWidth textLeft" clearable v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                    </div>
                    <Button type="primary" shape="circle" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button>
                </div>
                <xw-table-title
                    :name="isName2"
                    :fullFullCreen="fullFullCreen"
                    :height="tableHeight"
                    :tableList="userList"
                    :tableTitle="userTitle"
                ></xw-table-title>
            </TabPane>
        </Tabs>
    </Card>
</template>

<script>
import xwTableTitle from '../../components/xw-table/xw-table-title';
import {curDate} from '../../../libs/tools';
var packAnalysis;
export default {
    name: 'pack-analysis',
    components: {
        xwTableTitle
    },
    data () {
        return {
            name: 'name1',
            workshopList: [],
            workshopId: '',
            tableTitle: [
                {
                    title: '订单号',
                    key: 'prdOrderCode',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '产品',
                    key: 'productCode',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '纸管颜色',
                    key: 'paperTubeName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '腰绳颜色',
                    key: 'waistRopeName',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '缝口颜色',
                    key: 'packingModeName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '编织袋规格',
                    key: 'packingBag',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '订单数量(Kg)',
                    key: 'productionQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '完成数量(Kg)',
                    key: 'completionQty',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '未完成数量(Kg)',
                    key: 'onCompletionQty',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '当班数量(Kg)',
                    key: 'totalQty',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            tableList: [],
            tableHeight: null,
            value: false,
            orderComponentList: [],
            userTitle: [
                {
                    title: '人员',
                    key: 'userName',
                    minWidth: 110,
                    sortable: true,
                    align: 'left'
                },
                {
                    title: '班组',
                    key: 'groupName',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '当班产量(Kg)',
                    key: 'date',
                    minWidth: 110,
                    align: 'center'
                },
                {
                    title: '本周产量(Kg)',
                    key: 'week',
                    minWidth: 100,
                    align: 'left'
                },
                {
                    title: '本月产量(Kg)',
                    key: 'month',
                    minWidth: 110,
                    align: 'center'
                }
            ],
            userList: [],
            orderOutputColumns: [],
            fullFullCreen: false,
            isName1: false,
            isName2: false
        };
    },
    methods: {
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getPackCompoment();
                this.getUserList();
            });
        },
        getPackCompoment () {
            let params = {
                workshopId: this.workshopId
            };
            this.$call('pack.report.list3', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.tableList = content.res.map(x => {
                        x.paperTubeName = x.prdOrderPackingEntity.paperTubeName;
                        x.waistRopeName = x.prdOrderPackingEntity.waistRopeName;
                        x.packingModeName = x.prdOrderPackingEntity.packingModeName;
                        x.packingBag = x.prdOrderPackingEntity.packingBag;
                        return x;
                    });
                }
            });
        },
        getUserList () {
            let params = {
                workshopId: this.workshopId,
                date: curDate()
            };
            this.$call('pack.report.statistical', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.userList = content.res;
                }
            });
        },
        getSetTime () {
            setTimeout(() => {
                this.name = 'name2';
                this.getUserList();
                // this.getPackCompoment();
                this.getSetTime2();
                this.isName1 = true;
                this.isName2 = false;
            }, 20000);
        },
        getSetTime2 () {
            setTimeout(() => {
                this.name = 'name1';
                // this.getUserList();
                this.getPackCompoment();
                this.getSetTime();
                this.isName1 = false;
                this.isName2 = true;
            }, 10000);
        },
        expandCharts () {
            // this.$router.push({ name: 'charts-top' });
            let main = document.getElementById('pack-table');
            if (this.value) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                // this.fullFullCreen = false;
                packAnalysis = false;
            } else {
                if (main.requestFullscreen) {
                    main.requestFullscreen();
                } else if (main.mozRequestFullScreen) {
                    main.mozRequestFullScreen();
                } else if (main.webkitRequestFullScreen) {
                    main.webkitRequestFullScreen();
                } else if (main.msRequestFullscreen) {
                    main.msRequestFullscreen();
                }
                // this.fullFullCreen = true;
                packAnalysis = true;
                // this.chartHeight = parseInt((document.documentElement.clientHeight - 100) / 2);
            }
            this.value = !this.value;
        }
    },
    mounted () {
        this.getUserWorkshop();
        this.getSetTime();
        packAnalysis = false;
        this.$nextTick(() => {
            // let H = document.getElementById('selectedHeight').clientHeight;
            if (packAnalysis) {
                this.tableHeight = window.screen.height - 180;
            } else {
                this.tableHeight = document.documentElement.clientHeight - 310;
            }
        });
        window.onresize = () => {
            // let H = document.getElementById('selectedHeight').clientHeight;
            if (packAnalysis) {
                this.tableHeight = window.screen.height - 180;
                this.fullFullCreen = true;
            } else {
                this.tableHeight = document.documentElement.clientHeight - 310;
                this.fullFullCreen = false;
            }
        };
    }
};
</script>

<style scoped>

</style>

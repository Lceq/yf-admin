<template>
    <div>
        <Card class="cardClass" :style="'height:' + tableHeight + 'px'">
            <Row>
                <Col class="">
                    <span class="formSpanStyle transfer-class">车间：</span>
                    <Select class="transfer-class formEachStyle textLeft transfer-class-name" v-model="workshopId">
                        <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle transfer-class">统计日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeTime" :value="dateFromTo" type="datetimerange" format="yyyy-MM-dd"  placeholder="请选择时间" style="width: 200px; margin-right: 10px;"></DatePicker>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                </Col>
            </Row>
            <Row class="marginBottom">
                <Col class="xw-chart-Table">
                    <Table border size="small" :data="renoveList" :columns="renoveColumns" :height="chartHeight"></Table>
                </Col>
            </Row>
            <Row>
                <Col class="mainColour" :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                    <renovate :renovateMath="renovateMath" :renovateList="renovateList" :height="chartHeight"></renovate>
                </Col>
            </Row>
        </Card>
        <machine-modal :qualityShow="qualityShow" @onClick="onClick" @onCancel="onCancel">
        </machine-modal>
    </div>
</template>
<script>
import renovate from './renove';
import machineModal from '../renovate/modal';
export default {
    name: 'chart',
    components: {
        renovate,
        machineModal
    },
    data () {
        return {
            qualityShow: false,
            workshopId: '',
            workshopList: [],
            renovateMath: null,
            renovateList: [],
            chartHeight: null,
            tableHeight: null,
            dateFromTo: [],
            renoveList: [],
            renoveColumns: [
                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    fixed: 'left',
                    width: 150,
                    render: (h, params) => {
                        return h('div', {}, [
                            h('Button', {
                                style: {
                                    marginRight: '5px'
                                },
                                props: {
                                    size: 'small'
                                },
                                on: {
                                    'click': () => {
                                        this.disposeId = params.row.id;
                                        this.qmTestId = params.row.qmTestId;
                                        this.qmTypeId = params.row.qmTypeId;
                                        this.qualityShow = true;
                                    }
                                }
                            }, '停车翻改')
                        ]);
                    }
                },
                {
                    title: '检验日期',
                    key: 'qmDate',
                    minWidth: 100,
                    fixed: 'left',
                    align: 'left'
                },
                {
                    title: '产品',
                    key: 'productName',
                    minWidth: 120,
                    fixed: 'left',
                    align: 'left'
                },
                {
                    title: '批号',
                    key: 'batchCode',
                    minWidth: 80,
                    align: 'left'
                },
                {
                    title: '质检类别',
                    key: 'qmTypeName',
                    minWidth: 90,
                    align: 'left'
                },
                {
                    title: '机台',
                    key: 'machineName',
                    minWidth: 90,
                    align: 'left'
                },
                {
                    title: '停车原因',
                    key: 'stopReason',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '翻改描述',
                    key: 'disposeDescription',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '工序',
                    key: 'processName',
                    minWidth: 80,
                    align: 'center'
                },
                {
                    title: '实验员',
                    key: 'inspectorName',
                    minWidth: 90,
                    align: 'right'
                },
                {
                    title: '通知时间',
                    key: 'qmDate',
                    minWidth: 100,
                    align: 'left'
                }
            ],
            disposeId: '',
            qmTestId: '',
            qmTypeId: ''
        };
    },
    methods: {
        onClick (val) {
            // debugger
            let param = {
                id: this.disposeId,
                qmTypeId: this.qmTypeId,
                disposeDescription: val,
                isDispose: true,
                workshopId: this.workshopId,
                qmTestId: this.qmTestId
            };
            this.$call('qm.stop.notice.save', param).then(res => {
                let content = res.data;
                this.qualityShow = false;
                if (content.status === 200) {
                    this.$Message.success('停车翻改');
                    this.getRenovateTableList();
                    this.getRenovateList();
                }
            });
        },
        onCancel () {
            this.qualityShow = false;
        },
        changeTime (val) {
            this.dateFromTo = val;
        },
        searchResult () {
            this.getRenovateTableList();
            this.getRenovateList();
        },
        getRenovateTableList () {
            // debugger
            let params = {
                dateFrom: this.dateFromTo[0],
                dateTo: this.dateFromTo[1],
                isDispose: 0,
                workshopId: this.workshopId
            };
            this.$call('qm.stop.notice.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.renoveList = content.res;
                }
            });
        },
        getRenovateList () {
            let params = {
                dateFrom: this.dateFromTo[0],
                dateTo: this.dateFromTo[0],
                workshopId: this.workshopId
            };
            this.$call('qm.inspection.num', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.renovateMath = Math.random();
                    this.renovateList = content.res;
                }
            });
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.getRenovateTableList();
                this.getRenovateList();
            });
        }
    },
    mounted () {
        // this.renovateMath = Math.random();
        this.getUserWorkshop();
        this.$nextTick(() => {
            this.tableHeight = document.documentElement.clientHeight - 130;
            this.chartHeight = (this.tableHeight - 85) / 2;
        });
        window.onresize = () => {
            this.tableHeight = document.documentElement.clientHeight - 130;
            this.chartHeight = (this.tableHeight - 85) / 2;
            this.renovateMath = Math.random();
        };
    }
};
</script>

<style scoped>
.main-charts{
    padding: 16px 16px 0 16px
}
.mainColour{
    background: #22272d;
    border:solid 1px #515970;
    border-radius:4px;
}
.transfer-class{
    color: #fff;
}
.cardClass{
    background-color: #22272d !important;
}
</style>

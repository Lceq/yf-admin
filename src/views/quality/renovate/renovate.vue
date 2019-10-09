<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'停车翻改'" :curTabStateId="curCompletionState" :stateList="orderStateList">
            <div slot="content">
                <Row id="selectedHeight">
                    <Col class="endFlex marginBottom">
                        <span class="formSpanWidth ">通知时间：</span>
                        <DatePicker class="formWidth " type="date" :value="dateFrom" @on-change="changeDateFrom" placeholder="开始时间"></DatePicker>
                        <DatePicker class="formWidth " type="date" :value="dateTo" @on-change="changeDateTo" placeholder="结束时间"></DatePicker>
                        <!--<span class="">生产车间：</span>-->
                        <Select class="formWidth textLeft" v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                        <Select clearable class="formWidth " v-model="processId" placeholder="请选择工序">
                            <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <Button icon="ios-search" class="" type="primary" @click="searchResult">搜索</Button>
                    </Col>
                </Row>
                <Row class="marginBottom">
                    <Col>
                        <Table border :height="tableHeight" size="small" :data="renovateList" :columns="renovationColumns"></Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Page class="textRight" :total="total" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                    </Col>
                </Row>
            </div>
        </layout>
        <renovate-modal :qualityShow="qualityShow" @onClick="onClick" @onCancel="onCancel">
        </renovate-modal>
    </div>
</template>

<script>
import layout from '../../layout/layout';
import renovateModal from './modal';
import {page} from '../../../libs/tools';
export default {
    name: 'renovate',
    components: {
        layout,
        renovateModal
    },
    data () {
        return {
            total: 0,
            pageIndex: 1,
            pageSize: page().pageSize,
            pageOpts: page().pageOpts,
            pageUp: page().pageUp,
            curCompletionState: 0,
            orderStateList: [],
            workshopId: '',
            tableHeight: '',
            dateFrom: '',
            dateTo: '',
            processId: '',
            processList: [],
            dateFromTo: [],
            workshopList: [],
            renovateList: [],
            disposeId: '',
            qmTestId: '',
            qmTypeId: '',
            qualityShow: false,
            renovationColumns: [],
            renovateColumns: [
                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    fixed: 'left',
                    width: 200,
                    render: (h, params) => {
                        return h('div', {}, [
                            h('Button', {
                                style: {
                                    marginRight: '5px'
                                },
                                props: {
                                    size: 'small',
                                    disabled: params.row.isStandard === true ? true : (params.row.isStopNotice === true ? true : false)
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
                    minWidth: 120,
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
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '质检类别',
                    key: 'qmTypeName',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '机台',
                    key: 'machineName',
                    minWidth: 120,
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
                    minWidth: 120,
                    align: 'center'
                },
                {
                    title: '实验员',
                    key: 'inspectorName',
                    minWidth: 120,
                    align: 'right'
                },
                {
                    title: '通知时间',
                    key: 'qmDate',
                    minWidth: 120,
                    align: 'left'
                }
            ]
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
                    this.qmStopNoticeNum();
                }
            });
        },
        onCancel () {
            this.qualityShow = false;
        },
        changePageIndex (val) {
            this.pageIndex = val;
            this.qmStopNoticeNum();
        },
        changePageSize (val) {
            this.pageSize = val;
            this.qmStopNoticeNum();
        },
        selectMenu (val) {
            this.curCompletionState = val.id;
            this.dateFrom = '';
            this.dateTo = '';
            this.processId = '';
            this.pageIndex = 1;
            this.qmStopNoticeNum();
            if (val.id === 0) {
                this.renovationColumns = this.renovateColumns;
            }
            if (val.id === 1) {
                this.renovationColumns = this.renovateColumns.filter(x => x.key !== 'operation');
            }
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.qmStopNoticeNum();
            });
        },
        qmStopNoticeNum () {
            let params = {
                workshopId: this.workshopId,
            };
            this.$call('qm.stop.notice.num', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.orderStateList = content.res;
                    this.getRenovateList();
                }
            });
        },
        searchResult () {
            this.qmStopNoticeNum();
        },
        getRenovateList () {
            let params = {
                dateFrom: this.dateFrom,
                dateTo: this.dateTo,
                isDispose: this.curCompletionState,
                workshopId: this.workshopId,
                processId: this.processId,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize
            };
            this.$call('qm.stop.notice.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.total = content.count;
                    this.renovateList = content.res;
                }
            });
        },
        changeDateFrom (val) {
            this.dateFrom = val;
        },
        changeDateTo (val) {
            this.dateTo = val;
        },
        // 获取工序
        getProcessList () {
            this.$api.process.getSearchProcessList().then(res => {
                this.processList = res.map(item => {
                    if (item.parentId !== 0) {
                        item.style = 'padding-left: 10px;'
                    }
                    return item;
                });
            });
        },
    },
    mounted () {
        (async () => {
            this.renovationColumns = this.renovateColumns;
            this.getProcessList();
            this.getUserWorkshop();
        }) ();
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 220;
        });
        window.onresize = () => {
            if (document.getElementById('selectedHeight')) {
                let Height = document.getElementById('selectedHeight').clientHeight;
                this.tableHeight = document.documentElement.clientHeight - Height - 220;
            }
        };
    }
};
</script>

<style scoped>
.formWidth{
    margin-right: 5px;
}
</style>

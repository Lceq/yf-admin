<template>
    <div>
        <Card class="cardClass" :style="'height:' + tableHeight + 'px'">
            <Row class="marginBottom">
                <Col>
                    <span class="transfer-class">车间：</span>
                    <Select class="formWidth textLeft transfer-class-name selectBackground" v-model="workshopId">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="transfer-class">工序：</span>
                    <Select class="formWidth textLeft transfer-class-name" clearable v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <DatePicker class="transfer-class-name" @on-change="changeTime" :value="dateFromTo" type="datetimerange" format="yyyy-MM-dd"  placeholder="请选择时间" style="width: 200px"></DatePicker>
                    <Button type="primary" @click="onSearch">搜索</Button>
                </Col>
            </Row>
            <Row class="marginBottom">
                <Col span="12" style="padding-right: 5px">
                    <div class="mainColour" :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                        <p class="moduleTitleBorder">故障统计</p>
                        <repair :repairMath="repairMath" :repairOrderList="repairOrderList" :height="chartHeight"></repair>
                    </div>
                </Col>
                <Col span="12" style="padding-left: 5px">
                    <div class="mainColour" :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                        <p class="moduleTitleBorder">保养统计</p>
                        <!--<repair :repairMath="repairMath" :repairOrderList="repairOrderList" :height="tableHeight / 2"></repair>-->
                        <keep :keepMath="keepMath" :keepOrderList="keepOrderList" :height="chartHeight"></keep>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col class="xw-chart-Table">
                   <div class="mainColour" :style="{height: chartHeight + 'px', 'padding': '10px'}">
                       <Table border :height="(chartHeight - 30)" size="small" :data="repairList" :columns="repairColumns"></Table>
                   </div>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="RepairMachineModalShow"
                :loading="RepairMachineModalLoading"
                :width="800"
                @cancel="RepairMachineModalCancel"
                @submit="RepairMachineModalSubmit"
                :isSubmit="isShowSaveCancel"
                :isCancel="isShowSaveCancel"
                :title="'维修清单'">
            <div slot="content">
                <div class="marginBottom padding">
                    <div class=" ">
                        <Row>
                            <Col span="8">
                                <p class=""><span class="spanTitle">维修单号：</span><span class="spanContent">{{ repairMachineDetail.code }}</span></p>
                            </Col>
                            <Col span="8">
                                <p class=""><span class="spanTitle">所属车间：</span><span class="spanContent">{{ repairMachineDetail.workshopName }}</span></p>
                            </Col>
                            <Col span="8">
                                <p class=""><span class="spanTitle">所属工序：</span><span class="spanContent">{{ repairMachineDetail.processName }}</span></p>
                            </Col>
                            <Col span="8">
                                <p class=""><span class="spanTitle">机台编号：</span><span class="spanContent">{{ repairMachineDetail.machineCode }}</span></p>
                            </Col>
                            <Col span="8">
                                <p class=""><span class="spanTitle">机台名称：</span><span class="spanContent">{{ repairMachineDetail.machineName }}</span></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <p class=""><span class="spanTitle">维修状态：</span><span class="spanContent">{{ repairMachineDetail.completionState }}</span></p>
                            </Col>
                            <Col span="8">
                                <p><span class="spanTitle">单据状态：</span><span class="spanContent">{{ repairMachineDetail.state }}</span></p>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div class="">
                    <p class="modal-title">§ 呼叫信息</p>
                    <div class="padding">
                        <div class="">
                            <Row>
                                <Col span="8">
                                    <p><span class="spanTitle">&nbsp;&nbsp;&nbsp;报修人：</span><span class="spanContent">{{ repairMachineDetail.createName }}</span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">报修时间：</span><span class="spanContent">{{ repairMachineDetail.createTime }}</span></p>
                                </Col>
                            </Row>
                        </div>
                        <div class="marginBottom">
                            <Row>
                                <Col>
                                    <p><span class="spanTitle">故障描述：</span><span class="spanContent">{{ repairMachineDetail.faultDescription }}</span></p>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                <div >
                    <p class="modal-title">§ 维修信息</p>
                    <div class="padding">
                        <Form :show-message="false">
                            <Row class="marginBottom">
                                <Col span="8">
                                    <p><span class="spanTitle">&nbsp;&nbsp;&nbsp;维修人：</span><span class="spanBlock spanContent">{{ repairmanName }}</span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">接单时间：</span><span class="spanBlock spanContent">{{ repairmanTime }}</span></p>
                                </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col span="8">
                                    <p><span class="spanTitle">开始时间：</span><span>
                                         <DatePicker clearable format="yyyy-MM-dd HH:mm:ss" :value="beginTime" class="formWidth" type="datetime" placeholder="..."></DatePicker>
                                    </span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">结束时间：</span><span>
                                          <DatePicker :disabled="isEndTime" :readonly="isEndTime" :value="endTime" class="formWidth" type="datetime" placeholder="..."></DatePicker>
                                    </span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">停机维修：</span><span>
                                        <Select clearable class="formWidth"  v-model="isShutdown">
                                            <Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col span="8">
                                    <p><span class="spanTitle">更换配件：</span><span>
                                        <Select class="formWidth"  v-model="isReplace">
                                            <Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">故障类型：</span><span>
                                         <Select class="formWidth"  v-model="faultTypeId" @on-change="changeFaultType">
                                            <Option v-for="(item, index) of faultCallTypeList" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">故障原因：</span><span>
                                        <Select clearable class="formWidth" v-model="faultCauseId">
                                            <Option v-for="(item, index) of faultCauseList" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col>
                                    <p class="spanTitle"><span class="spanDescription spanTitle">维修描述：</span><span>
                                       <Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />
                                    </span></p>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <other-message
                    :createName="createName"
                    :createTime="createTime"
                >
                </other-message>
                <!--</div>-->
            </div>
        </modal>
    </div>
</template>

<script>
import repair from './repair';
import keep from './keep';
import {curDate, curDatetime} from "../../../libs/tools";
import modal from '../../public/modal';
import otherMessage from '../../components/otherMessage';
import {completionState} from "../../../libs/utilState";

export default {
    name: 'chart',
    components: {
        modal,
        otherMessage,
        repair,
        keep
    },
    data () {
        return {
            chartHeight: null,
            tableHeight: null,
            dateFromTo: [curDate(), curDate()],
            workshopId: '',
            workshopList: [],
            repairOrderList: [],
            keepOrderList: [],
            repairMath: null,
            keepMath: null,
            processId: '',
            processList: [],
            repairList: [],
            repairColumns: [
                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    fixed: 'left',
                    width: 100,
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    size: 'small'
                                },
                                style: {
                                },
                                on: {
                                    'click': () => {
                                        // this.isShowMessage = true;
                                        this.curRepairMachineId = params.row.id;
                                        // this.repairmanTime = this.repairTime;
                                        this.isEndTime = true;
                                        this.endTime = '';
                                        this.isShowSaveCancel = true;
                                        this.clearData();
                                    }
                                }
                            }, '接单')
                        ])
                    }
                },
                {
                    title: '报修单号',
                    key: 'code',
                    align: 'left',
                    minWidth: 120,
                    fixed: 'left'
                },
                {
                    title: '设备名称',
                    key: 'machineName',
                    align: 'left',
                    minWidth: 100,
                    fixed: 'left'
                },
                {
                    title: '设备编号',
                    key: 'machineCode',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '车间',
                    key: 'workshopName',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '报修人',
                    key: 'createName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '报修时间',
                    key: 'createTime',
                    align: 'left',
                    minWidth: 150
                }
            ],
            RepairMachineModalShow: false,
            RepairMachineModalLoading: false,
            isShowSaveCancel: true,
            isShutdown: 1,
            isReplace: 1,
            repairMachineDetail: {},
            repairmanTime: '',
            repairmanName: '',
            beginTime: '',
            isEndTime: '',
            faultTypeId: '',
            faultCauseId: '',
            repairDescription: '',
            isStopMachine: [
                {
                    id: 1,
                    name: '是'
                },
                {
                    id: 0,
                    name: '否'
                }
            ],
            faultCallTypeList: [],
            faultCauseList: [],
            createName: '',
            createTime: '',
            endTime: '',
            curRepairMachineId: '',
            orderStateList: completionState,
        };
    },
    methods: {
        // 获取故障类型
        getFaultCallType () {
            this.$fetch('dict/list', {parentcode: 'fault_type'}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultCallTypeList = content.res;
                }
            });
        },
        // 改变故障类型
        changeFaultType (val) {
            this.getRepairCause(val);
            this.faultCauseId = '';
        },
        // 获取故障原因
        getRepairCause (id) {
            this.$api.fault.getFaultType({faultTypeId: id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultCauseList = content.res;
                }
            });
        },
        // 清空数据
        clearData () {
            this.repairmanName = '';
            this.repairmanId = '';
            this.beginTime = this.repairTime;
            this.isReplace = 0;
            this.isShutdown = 1;
            this.faultTypeId = '';
            this.faultCauseId = '';
            this.repairDescription = '';
            this.getRepairOrderDetail();
        },
        // 获取维修工单详情
        getRepairOrderDetail () {
            // debugger
            const _this = this;
            this.$api.repair.getRepairOrderDetail({'id': this.curRepairMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    _this.beginTime = curDatetime();
                    _this.repairMachineDetail = content.res;
                    _this.repairMachineDetail.state = content.res.auditState === 1 ? '创建' : '关闭';
                    _this.repairMachineDetail.completionState = _this.orderStateList.find(x => x.id === content.res.completionState).name;
                    _this.repairmanName = content.res.repairmanName;
                    _this.repairmanTime = curDatetime();
                    _this.repairmanId = content.res.repairmanId;
                    // _this.beginTime = content.res.beginTime === null ? this.beginTime : content.res.beginTime;
                    _this.endTime = content.res.endTime === null ? this.endTime : content.res.endTime;
                    // this.isEndTime = content.res.endTime === null ? true : false;
                    _this.isReplace = content.res.isReplace === null ? this.isReplace : content.res.isReplace;
                    _this.isShutdown = content.res.isShutdown === null ? this.isShutdown : content.res.isShutdown;
                    _this.faultTypeId = content.res.faultTypeId;
                    console.log(_this.faultCauseList);
                    _this.faultCauseId = content.res.faultCauseId === null ? '' : content.res.faultCauseId;
                    _this.repairDescription = content.res.repairDescription;
                    _this.createName = content.res.createName;
                    _this.reverseName = _this.curCompletionState === 0 ? '' : content.res.updateName;
                    _this.createTime = content.res.createTime;
                    _this.reverseTime = _this.curCompletionState === 0 ? '' : content.res.updateTime;
                    // 获取故障原因
                    _this.getRepairCause(content.res.faultTypeId);
                    // debugger
                }
            });
            this.RepairMachineModalShow = true;
        },
        RepairMachineModalSubmit () {
            let params = {
                id: this.curRepairMachineId,
                repairmanName: this.repairmanName,
                completionState: 0,
                repairmanId: this.repairmanId,
                machineId: this.repairMachineDetail.machineId,
                repairmanTime: this.repairTime,
                beginTime: this.beginTime,
                endTime: this.endTime,
                isShutdown: this.isShutdown,
                isReplace: this.isReplace,
                faultTypeId: this.faultTypeId,
                faultCauseId: this.faultCauseId,
                faultCauseName: this.faultCauseId === '' ? '' : this.faultCauseList.find(x => x.id === this.faultCauseId).name,
                repairDescription: this.repairDescription
            };
            this.RepairMachineModalLoading = true;
            this.$api.repair.getRepairOrderTake(params).then(res => {
                let content = res.data;
                this.RepairMachineModalLoading = false;
                // this.RepairMachineModalShow = false;
                this.RepairMachineModalShow = false;
                if (content.status === 200) {
                    this.getRepairList();
                    this.repairOrderNum();
                    this.$Message.success('保存成功');
                }
            });
        },
        RepairMachineModalCancel () {
            this.RepairMachineModalLoading = false;
            this.RepairMachineModalShow = false;
        },
        //  获取所有工序
        getProcess () {
            let params = {
                auditState: 3,
                state: 1
            };
            this.$call('process.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.processList = content.res;
                }
            });
        },
        changeTime (val) {
            this.dateFromTo = val;
            // debugger
            // this.keepOrderNum();
        },
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.workshopId = res.curWorkshopId;
                this.workshopList = res.workshopList;
                this.repairOrderNum();
                this.keepOrderNum();
                this.getRepairList();
            });
        },
        repairOrderNum () {
            let param = {
                dateFrom: this.dateFromTo[0],
                dateTo: this.dateFromTo[1],
                processId: this.processId,
                workshopId: this.workshopId
            };
            this.$call('repair.order.num', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.repairOrderList = content.res;
                    this.repairMath = Math.random();
                }
            });
        },
        keepOrderNum () {
            let param = {
                dateFrom: this.dateFromTo[0],
                dateTo: this.dateFromTo[1],
                processId: this.processId,
                workshopId: this.workshopId
            };
            this.$call('maintenance.plan.machine.num', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.keepOrderList = content.res;
                    this.keepMath = Math.random();
                }
            });
        },
        getRepairList () {
            let param = {
                completionState: 0,
                dateFrom: this.dateFromTo[0],
                dateTo: this.dateFromTo[1],
                processId: this.processId,
                workshopId: this.workshopId
            };
            this.$call('repair.order.list', param).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.repairList = content.res;
                    // debugger
                }
            })
        },
        onSearch () {
            this.repairOrderNum();
            this.keepOrderNum();
            this.getRepairList();
        }
    },
    created () {
    },
    mounted () {
        (async () => {
            await this.getFaultCallType();
            await this.getProcess();
            await this.getUserWorkshop();
        })();
        this.$nextTick(() => {
            this.tableHeight = document.documentElement.clientHeight - 130;
            this.chartHeight = (this.tableHeight - 85 ) / 2;
        });
        window.onresize = () => {
            this.tableHeight = document.documentElement.clientHeight - 130;
            this.chartHeight = (this.tableHeight - 85) / 2;
            this.keepMath = Math.random();
            this.repairMath = Math.random();
        };
    }
};
</script>

<style scoped>
/*.querySubBarMargin .ivu-input-icon-normal+.ivu-input {*/
    /*padding-right: 32px;*/
    /*background:#2f343d;*/
    /*border:solid 1px #50596f;*/
    /*color:#fff;*/
/*}*/
/*.querySubBarMargin{*/
    /*margin-right: 10px;*/
    /*margin-bottom:10px;*/
/*}*/
/*.flexAlignCenter{*/
    /*display: flex;*/
    /*align-items: center;*/
/*}*/
.transfer-class{
    color: #fff;
}
/*.selectBackground{*/
    /*background:#2f343d;*/
    /*color: #fff;*/
    /*width:200px;*/
/*}*/
/*.selectBackground .ivu-select-selection{*/
    /*background:#2f343d;*/
    /*color: #fff;*/
    /*border:solid 1px #50596f;*/
/*}*/
.transfer-class-name{
    /*background-color: #22272d !important;*/
    color: #2f343d;
    margin-right: 10px;
    /*background-color: transparent !important;*/
}
.transfer-class-name .ivu-select-selection{
    /*background-color: #22272d !important;*/
    color: #2f343d;
    background-color: transparent !important;
}
.cardClass{
    background-color: #22272d;
}
.chartClass{
    display: inline-block;
    width: 30%;
}
.main-charts{
    padding: 16px 16px 0 16px
}
.mainColour{
    background: #22272d;
    border:solid 1px #515970;
    border-radius:4px;
}
.queryTitle{
    color:#04eaff;
}
.moduleTitleBorder{
    border-bottom: solid 1px #515970;
    padding:14px 20px 14px 20px;
    color:#0bc6d9;
}
.spanTitle{
    /*vertical-align: top;*/
    /*line-height: 32px;*/
    font-size: 12px;
    font-weight: bold;
}
.spanDescription{
    position: relative;
    top: -8px;
}
.spanBlock{
    background-color: #f9f9f9;
    width: 152px;
    height: 32px;
    line-height: 32px;
    border-radius: 3px;
}
.spanContent{
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    display: inline-block;
    padding-left: 8px;
}
.formWidth{
    width: 152px;
}
.formItem{
    margin: 0;
}
.borderBottom{
    border-bottom: 1px solid #9b9b9b;
}
.padding{
    padding: 0 20px;
}
.border{
    border: 1px solid #999;
    border-radius: 5px;
}
.modal-title{
    padding: 5px 0px 5px 20px;
    display: inline-block;
    width: 100%;
    /*background-color: #f1f1f1;*/
    border-bottom: 1px solid #dddddd;
    font-size: 14px;
    margin:20px 10px 10px 0;
    font-weight: 600;
}
</style>

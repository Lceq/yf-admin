<template>
    <Card>
        <Row class="flexBetween">
            <Col class="leftFlex">
                <Button class="marginBottom" :disabled="isAcceptOrder" type="success" @click="handleReportOrder">接单</Button>
                <Button class="marginBottom marginButtonLeft" :disabled="isRepairing" type="primary" @click="finishFaultCall">维修完成</Button>
                <Button class="marginBottom marginButtonLeft" :disabled="isAcceptOrder" type="error" @click="cancelFaultCall">取消呼叫</Button>
                <Dropdown class="marginBottom marginButtonLeft" trigger="click">
                    <Button :disabled="isRepairComplete" type="info" href="javascript:void(0)">
                        业务操作
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem :disabled="isRepairClose" @click.native="handleClose">关闭</DropdownItem>
                        <DropdownItem :disabled="isRepairUnClose" @click.native="handleUnClose">反关闭</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Col>
            <Col>
                <Select class="formWidth marginBottom" v-model="repairMachineWorkshopId" placeholder="请选择车间">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="repairMachineProcessId" placeholder="请选择工序">
                    <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="orderStateTypeId" placeholder="请选择工单状态">
                    <Option v-for="item in orderStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input clearable v-model="code" placeholder="请输入保修单号" class="formWidth marginBottom" />
                <Input clearable v-model="repairMachineName" placeholder="请输入设备名称" class="formWidth marginBottom" />
                <Button class="marginBottom" type="primary" @click="searchMachine">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table class="marginBottom" :height="tableHeight" size="small" ref="selection" border :columns="repairMachineColumns" :data="repairMachineData"></Table>
                <Page class="textRight" :total="repairMachineTotal" show-elevator :page-size-opts="RepairMachinePageOpts" show-total :page-size="RepairMachinePageSize" @on-change="changePageIndexRepairMachine" show-sizer @on-page-size-change="changePageSizeRepairMachine"></Page>
            </Col>
        </Row>
        <modal
            :isShow="RepairMachineModalShow"
            :loading="RepairMachineModalLoading"
            :width="800"
            @cancel="RepairMachineModalCancel"
            @submit="RepairMachineModalSubmit"
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
                                   <!--<FormItem class="formItemMargin" label="接单时间：">-->
                                       <!--<p>{{ repairTime }}</p>-->
                                   <!--</FormItem>-->
                               </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col span="8">
                                    <p><span class="spanTitle">开始时间：</span><span>
                                         <DatePicker :clearable="false" format="yyyy-MM-dd HH:mm:ss" :value="beginTime" class="formWidth" type="datetime" placeholder="..."></DatePicker>
                                    </span></p>
                                   <!--<FormItem class="formItemMargin" label="开始时间：" prop="typeId">-->
                                      <!---->
                                   <!--</FormItem>-->
                               </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">结束时间：</span><span>
                                          <DatePicker :disabled="isEndTime" :readonly="isEndTime" :value="endTime" class="formWidth" type="datetime" placeholder="..."></DatePicker>
                                    </span></p>
                                    <!--<FormItem class="formItemMargin"  label="结束时间：">-->
                                        <!--<DatePicker :disabled="isEndTime" :readonly="isEndTime" :value="endTime" class="formWidth" type="datetime" placeholder="..."></DatePicker>-->
                                    <!--</FormItem>-->
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">停机维修：</span><span>
                                        <Select clearable class="formWidth"  v-model="isShutdown">
                                            <Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                    <!--<FormItem class="formItemMargin"  label="停机维修：">-->
                                        <!--<Select clearable class="formWidth"  v-model="isShutdown">-->
                                            <!--<Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>-->
                                        <!--</Select>-->
                                    <!--</FormItem>-->
                                </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col span="8">
                                    <p><span class="spanTitle">更换配件：</span><span>
                                        <Select class="formWidth"  v-model="isReplace">
                                            <Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                    <!--<FormItem class="formItemMargin"  label="更换配件：">-->
                                        <!--<Select class="formWidth"  v-model="isReplace">-->
                                            <!--<Option v-for="(item, index) of isStopMachine" :key="index" :value="item.id">{{ item.name }}</Option>-->
                                        <!--</Select>-->
                                    <!--</FormItem>-->
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">故障类型：</span><span>
                                         <Select class="formWidth"  v-model="faultTypeId" @on-change="changeFaultType">
                                            <Option v-for="(item, index) of faultCallTypeList" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                    <!--<FormItem class="formItemMargin"  label="故障类型：">-->
                                        <!--&lt;!&ndash;<Input :value="repairMachineDetail.faultTypeName" readonly class="formWidth" />&ndash;&gt;-->
                                        <!--<Select clearable class="formWidth"  v-model="faultTypeId">-->
                                            <!--<Option v-for="(item, index) of faultCallTypeList" :key="index" :value="item.id">{{ item.name }}</Option>-->
                                        <!--</Select>-->
                                    <!--</FormItem>-->
                                </Col>
                                <Col span="8">
                                    <p><span class="spanTitle">故障原因：</span><span>
                                        <Select clearable class="formWidth" v-model="faultCauseId">
                                            <Option v-for="(item, index) of faultCauseList" :key="index" :value="item.id">{{ item.name }}</Option>
                                        </Select>
                                    </span></p>
                                    <!--<FormItem class="formItemMargin" label="故障原因：">-->
                                        <!--<Select clearable class="formWidth" v-model="faultCauseId">-->
                                            <!--<Option v-for="(item, index) of faultCauseList" :key="index" :value="item.id">{{ item.name }}</Option>-->
                                        <!--</Select>-->
                                    <!--</FormItem>-->
                                </Col>
                            </Row>
                            <Row class="marginBottom">
                                <Col>
                                    <p class="spanTitle"><span class="spanDescription spanTitle">维修描述：</span><span>
                                       <Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />
                                    </span></p>
                                    <!--<FormItem class="formItemMargin"  label="维修描述：">-->
                                        <!--<Input style="width: 637px;" v-model="repairDescription" type="textarea" :rows="2" placeholder="..." />-->
                                    <!--</FormItem>-->
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
                <div class="padding">
                    <AboutTime
                            :createTime="createTime"
                            :createName="createName"
                            :reviseTime="reverseTime"
                            :reviseName="reverseName"
                            :isClose = "true"
                            :closeName="closeName"
                            :closeTime="closeTime"
                    ></AboutTime>
                </div>
            </div>
        </modal>
        <delete-warning
            :v-model="deleteWarnShow"
            :tipMsg="deleteWarnMsg"
            :loading="deleteWarnLoading"
            @cancel="deleteWarnCancel"
            @confirm="deleteWarnConfirm"
        ></delete-warning>
    </Card>
</template>
<script>
import deleteWarning from '../../public/deleteWarning';
import modal from '../../public/modal';
import AboutTime from '../../public/AboutTime';
import publicJs from '../../public/public-js/publiceJs';
export default {
    name: 'repair',
    components: {
        deleteWarning,
        modal,
        AboutTime
    },
    data () {
        return {
            // 提示
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            // 是否接单
            isEdit: false,
            isAcceptOrder: true,
            isRepairing: true,
            isRepairComplete: true,
            isRepairClose: true,
            isRepairUnClose: true,
            value6: '',
            code: '',
            tableHeight: document.documentElement.clientHeight - 240,
            repairMachineWorkshopId: '',
            workshopList: [],
            repairMachineProcessId: '',
            processList: '',
            repairMachineName: '',
            orderStateTypeId: '',
            orderStateList: [
                {
                    name: '未接单',
                    id: 0
                },
                {
                    name: '维修中',
                    id: 1
                },
                {
                    name: '已完成',
                    id: 2
                }
            ],
            repairMachineColumns: [
                {
                    title: '选择',
                    width: 70,
                    key: 'select',
                    align: 'center',
                    fixed: 'left',
                    render: (h, params) => {
                        const _this = this;
                        return h('div', [
                            h('Checkbox', {
                                props: {
                                    value: params.row.select
                                },
                                on: {
                                    'on-change': (val) => {
                                        if (val) {
                                            if (params.row.completionState === 0) {
                                                _this.isAcceptOrder = false;
                                                _this.isRepairing = true;
                                                _this.isRepairComplete = true;
                                            }
                                            if (params.row.completionState === 1) {
                                                _this.isAcceptOrder = true;
                                                _this.isRepairing = false;
                                                _this.isRepairComplete = true;
                                            }
                                            if (params.row.completionState === 2) {
                                                _this.isAcceptOrder = true;
                                                _this.isRepairing = true;
                                                _this.isRepairComplete = false;
                                                // debugger
                                                if (params.row.auditState === '创建') {
                                                    _this.isRepairClose = false;
                                                    _this.isRepairUnClose = true;
                                                } else {
                                                    _this.isRepairClose = true;
                                                    _this.isRepairUnClose = false;
                                                }
                                            }
                                        } else {
                                            _this.isAcceptOrder = true;
                                            _this.isRepairing = true;
                                            _this.isRepairComplete = true;
                                        }
                                        _this.repairMachineData.map(x => {
                                            x.select = false;
                                            return x;
                                        });
                                        _this.repairMachineData[params.index].select = val;
                                        _this.curRepairMachineId = params.row.id;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '设备名称',
                    key: 'machineName',
                    align: 'center',
                    fixed: 'left',
                    minWidth: 100
                },
                {
                    title: '维修状态',
                    key: 'state',
                    align: 'center',
                    fixed: 'left',
                    minWidth: 100
                },
                {
                    title: '关闭状态',
                    key: 'auditState',
                    align: 'center',
                    fixed: 'left',
                    minWidth: 100
                },
                {
                    title: '报修单号',
                    key: 'code',
                    align: 'center',
                    minWidth: 120
                },
                {
                    title: '设备编号',
                    key: 'machineCode',
                    align: 'center',
                    minWidth: 100,
                    fixed: 'left'
                },
                {
                    title: '车间',
                    key: 'workshopName',
                    align: 'center',
                    minWidth: 100
                },
                // {
                //     title: '工序',
                //     key: 'processName',
                //     align: 'center',
                //     minWidth: 100
                // },
                {
                    title: '报修人',
                    key: 'createName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '报修时间',
                    key: 'createTime',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '维修人',
                    key: 'repairmanName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '接单时间',
                    key: 'beginTime',
                    align: 'center',
                    minWidth: 150
                },
                {
                    title: '操作',
                    key: 'operation',
                    align: 'center',
                    width: 200,
                    render: (h, params) => {
                        return h('div', [
                            // h('Button', {
                            //     props: {
                            //         size: 'small'
                            //     },
                            //     style: {
                            //         marginRight: '4px'
                            //     },
                            //     on: {
                            //         'click': () => {
                            //         }
                            //     }
                            //
                            // }, '接单'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.completionState === 0
                                },
                                style: {
                                    marginRight: '4px'
                                },
                                on: {
                                    'click': () => {
                                        this.curRepairMachineId = params.row.id;
                                        this.isEdit = true;
                                        if (params.row.completionState === 2) {
                                            this.endTime = '';
                                            this.isEndTime = false;
                                        } else {
                                            this.isEndTime = true;
                                        }
                                        this.clearData();
                                        // this.getRepairOrderDetail();
                                    }
                                }

                            }, '编辑')
                            // h('Button', {
                            //     props: {
                            //         size: 'small'
                            //     },
                            //     style: {
                            //         marginRight: '4px'
                            //     },
                            //     on: {
                            //         'click': () => {
                            //         }
                            //     }
                            //
                            // }, '取消呼叫')
                        ]);
                    }
                }
            ],
            repairMachineData: [],
            repairMachineTotal: 0,
            RepairMachinePageOpts: publicJs.pageOpts,
            RepairMachinePageSize: publicJs.pageSize,
            RepairMachinePageIndex: 1,
            // modal
            RepairMachineModalShow: false,
            RepairMachineModalLoading: false,
            RepairMachineModalMessage: '',
            // model
            faultCallMachineModel: {
                time: '',
                user: '',
                isStop: '',
                describe: ''
            },
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
            createTime: '',
            createName: '',
            reverseTime: '',
            reverseName: '',
            closeName: '',
            closeTime: '',
            faultCauseList: [],
            repairmanId: '',
            repairmanName: '',
            repairmanTime: '',
            faultCauseId: '',
            isReplace: 1,
            isShutdown: 1,
            faultTypeId: '',
            repairDescription: '',
            repairMachineDetail: {},
            repairTime: '',
            beginTime: '',
            endTime: '',
            // 故障类型
            faultCallTypeList: [],
            curRepairMachineId: '',
            isEndTime: true,
            // 是否维修完成
            isFinishFaultCall: false,
            isReportOrder: false
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
        // 接单
        handleReportOrder () {
            this.repairmanTime = this.repairTime;
            this.isEndTime = true;
            this.endTime = '';
            this.isReportOrder = true;
            this.clearData();
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
        // 维修完成
        finishFaultCall () {
            this.isEndTime = false;
            this.endTime = this.repairTime;
            this.isFinishFaultCall = true;
            this.clearData();
        },
        // 取消呼叫
        cancelFaultCall () {
            this.deleteWarnShow = true;
            this.deleteWarnMsg = '确定要取消呼叫吗？';
        },
        // 关闭
        handleClose () {
            if (this.isRepairClose) {
                return false;
            }
            this.$post('repair/order/close', [this.curRepairMachineId]).then(res => {
                this.$Message.success('关闭成功');
                this.getRepairList();
            });
        },
        // 反关闭
        handleUnClose () {
            if (this.isRepairUnClose) {
                return false;
            }
            this.$post('repair/order/unclose', [this.curRepairMachineId]).then(res => {
                this.$Message.success('反关闭成功');
                this.getRepairList();
            });
        },
        // 获取维修工单详情
        getRepairOrderDetail () {
            const _this = this;
            this.$post('repair/order/detail', {'id': this.curRepairMachineId}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.repairMachineDetail = content.res;
                    _this.repairMachineDetail.state = content.res.auditState === 1 ? '创建' : '关闭';
                    _this.repairMachineDetail.completionState = _this.orderStateList.find(x => x.id === content.res.completionState).name;
                    _this.repairmanName = content.res.repairmanName;
                    _this.repairmanTime = content.res.repairmanTime === null ? _this.repairmanTime : content.res.repairmanTime;
                    _this.repairmanId = content.res.repairmanId;
                    _this.beginTime = content.res.beginTime === null ? this.beginTime : content.res.beginTime;
                    _this.endTime = content.res.endTime === null ? this.endTime : content.res.endTime;
                    // this.isEndTime = content.res.endTime === null ? true : false;
                    _this.isReplace = content.res.isReplace;
                    _this.isShutdown = content.res.isShutdown;
                    _this.faultTypeId = content.res.faultTypeId;
                    _this.faultCauseId = content.res.faultCauseId === null ? '' : content.res.faultCauseId;
                    _this.repairDescription = content.res.repairDescription;
                    _this.createName = content.res.createName;
                    _this.reverseName = _this.isReportOrder === true ? '' : content.res.updateName;
                    _this.createTime = content.res.createTime;
                    _this.reverseTime = _this.isReportOrder === true ? '' : content.res.updateTime;
                    // 获取故障原因
                    _this.getRepairCause(content.res.faultTypeId);
                }
            });
            this.RepairMachineModalShow = true;
        },
        // 获取工序
        getFaultCallProcess () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        },
        // 获取车间
        getFaultCallWorkshop () {
            this.$post('user/data/workshops').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopList = content.res;
                    if (content.res.length > 0) {
                        if (content.res.find(x => x.isDefault === 1)) {
                            this.repairMachineWorkshopId = content.res.find(x => x.isDefault === 1).deptId;
                        } else {
                            this.repairMachineWorkshopId = content.res[0].deptId;
                        }
                        this.getRepairList();
                    } else {
                        // 该用户没有权限访问
                        this.repairMachineData = [];
                    }
                }
            });
        },
        // 改变页数
        changePageIndexRepairMachine (val) {
            this.RepairMachinePageIndex = val;
        },
        // 改变页的数量
        changePageSizeRepairMachine (val) {
            this.RepairMachinePageSize = val;
        },
        // 获取维修数据
        getRepairList () {
            let params = {
                pageIndex: this.RepairMachinePageIndex,
                pageSize: this.RepairMachinePageSize,
                workshopId: this.repairMachineWorkshopId,
                processId: this.repairMachineProcessId,
                code: this.code,
                completionState: this.orderStateTypeId,
                machineName: this.repairMachineName
            };
            this.$post('repair/order/list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.repairMachineTotal = content.count;
                    this.repairMachineData = content.res.map(item => {
                        item.select = false;
                        item.state = this.orderStateList.find(x => x.id === item.completionState).name;
                        item.auditState = item.auditState === 1 ? '创建' : '已关闭';
                        return item;
                    });
                }
            });
        },
        changeFaultType (val) {
            this.getRepairCause(val);
            this.faultCauseId = '';
        },
        // 获取故障原因
        getRepairCause (id) {
            this.$fetch('fault/type/list', {faultTypeId: id}).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultCauseList = content.res;
                }
            });
        },
        // 搜索维修单
        searchMachine () {
            this.RepairMachinePageIndex = 1;
            setTimeout(() => {
                this.repairMachineTotal = 1;
            }, 0);
            this.getRepairList();
        },
        // 提示区域 ----开始
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnLoading = true;
            this.$post('repair/order/cancel', {id: this.curRepairMachineId}).then(res => {
                let content = res.data;
                this.deleteWarnLoading = false;
                this.deleteWarnShow = false;
                if (content.status === 200) {
                    this.$Message.success('取消成功');
                    this.getRepairList();
                }
            });
        },
        // 提示区域 ----结束
        // modal ----开始
        RepairMachineModalCancel () {
            this.RepairMachineModalShow = false;
        },
        RepairMachineModalSubmit () {
            // debugger;
            let params = {
                id: this.curRepairMachineId,
                repairmanName: this.repairmanName,
                repairmanId: this.repairmanId,
                machineId: this.repairMachineDetail.machineId,
                repairmanTime: this.repairTime,
                beginTime: this.beginTime,
                endTime: this.endTime,
                isShutdown: this.isShutdown,
                isReplace: this.isReplace,
                faultTypeId: this.faultTypeId,
                faultCauseId: this.faultCauseId,
                faultCauseName: this.faultCauseList.find(x => x.id === this.faultCauseId).name,
                repairDescription: this.repairDescription
            };
            if (this.isReportOrder) {
                this.isReportOrder = false;
                this.RepairMachineModalLoading = true;
                this.$post('repair/order/take', params).then(res => {
                    let content = res.data;
                    this.RepairMachineModalLoading = false;
                    this.RepairMachineModalShow = false;
                    if (content.status === 200) {
                        this.getRepairList();
                        this.$Message.success('保存成功');
                    }
                });
            }
            if (this.isEdit) {
                this.isEdit = false;
                this.RepairMachineModalLoading = true;
                this.$post('repair/order/save', params).then(res => {
                    let content = res.data;
                    this.RepairMachineModalLoading = false;
                    this.RepairMachineModalShow = false;
                    if (content.status === 200) {
                        this.getRepairList();
                        this.$Message.success('保存成功');
                    }
                });
            }
            if (this.isFinishFaultCall) {
                this.isFinishFaultCall = false;
                this.RepairMachineModalLoading = true;
                this.$post('repair/order/maintain', params).then(res => {
                    let content = res.data;
                    this.RepairMachineModalLoading = false;
                    this.RepairMachineModalShow = false;
                    if (content.status === 200) {
                        this.getRepairList();
                        this.$Message.success('维修完成');
                    }
                });
            }
            this.isAcceptOrder = true;
            this.isRepairing = true;
            this.isRepairComplete = true;
        },
        // modal ------ 结束
        getStartTime () {
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
            const h = mydate.getHours() < 10 ? '0' + mydate.getHours() + ':' : mydate.getHours() + ':';
            const mi = mydate.getMinutes() < 10 ? '0' + mydate.getMinutes() + ':' : mydate.getMinutes() + ':';
            const s = mydate.getSeconds() < 10 ? '0' + mydate.getSeconds() : mydate.getSeconds();
            return this.repairTime = y + '-' + m + '-' + d + ' ' + h + mi + s;
        }
    },
    created () {
        // 获取故障类型
        this.getFaultCallType();
        // 获取工序
        this.getFaultCallProcess();
        // 获取车间
        this.getFaultCallWorkshop();
    },
    mounted () {
        this.getStartTime();
        // this.repairMachineDetail.beginTime = this.Today;
    },
    computed: {
        // Today: () => {
        //     const date = new Date();
        //     const seperator1 = '-';
        //     const year = date.getFullYear();
        //     const month = parseInt(date.getMonth() + 1) < 10 ? '0' + parseInt(date.getMonth() + 1) : parseInt(date.getMonth() + 1);
        //     const strDate = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        //     const h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        //     const m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        //     const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        //     const currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + h + m + s;
        //     return currentdate;
        // }
    }
};
</script>

<style scoped>
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
    /*border-bottom: 1px solid #999;*/
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

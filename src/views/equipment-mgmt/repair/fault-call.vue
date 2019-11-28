<template>
    <Card>
        <Row class="flexBetween" id="selectedHeight">
            <Col class="leftFlex">
                <Button class="marginBottom" type="success" :disabled="isFaultCall" @click="handleFaultCall">故障呼叫</Button>
            </Col>
            <Col>
                <Select class="formWidth marginBottom" v-model="faultCallWorkshopId" placeholder="请选择车间">
                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="faultCallProcessId" placeholder="请选择工序">
                    <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input v-model="faultCallMachineCode" placeholder="请输设备编号" class="formWidth marginBottom" />
                <Button icon="ios-search" class="marginBottom" type="primary" @click="searchMachine">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table class="marginBottom" :height="tableHeight" border size="small" :data="FaultCallMachineData" :columns="FaultCallMachineColumns"></Table>
                <Page class="textRight" :total="FaultCallTotal" show-elevator :page-size-opts="FaultCallPageOpts" show-total :page-size="FaultCallPageSize" @on-change="changePageIndexFaultCall" show-sizer @on-page-size-change="changePageSizeFaultCall"></Page>
            </Col>
        </Row>
        <modal
            :isShow="FaultCallMachineModalShow"
            :loading="FaultCallMachineModalLoading"
            @cancel="FaultCallMachineModalCancel"
            @submit="FaultCallMachineModalSubmit"
            :title="'故障呼叫'"
        >
            <div slot="content">
                <Form :show-message="false"  ref="FaultCallItem" :model="FaultCallItem" :rules="ruleFaultCallItem" :label-width="100">
                    <Row>
                        <Col span="12">
                            <FormItem class="formItemMargin" label="车间：">
                                <p>{{ FaultCallItem.workshopName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem class="formItemMargin" label="工序：">
                                <p>{{ FaultCallItem.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem class="formItemMargin" label="设备编号：" prop="machineCode">
                                <p>{{ FaultCallItem.machineCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem class="formItemMargin" label="设备名称：" prop="machineName">
                                <p>{{ FaultCallItem.machineName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <!--<FormItem class="formItemMargin"  label="维修编码：">-->
                        <!--<Input type="text" readonly placeholder="维修编码自动生成"></Input>-->
                    <!--</FormItem>-->
                    <FormItem class="formItemMargin" prop="faultCallTypeId" label="故障类别：">
                        <Select v-model="FaultCallItem.faultCallTypeId" @on-change="changeFaultType">
                            <Option v-for="(item, index) of faultCallTypeList" :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="formItemMargin" prop="faultSubclassId"  label="故障小类：">
                        <Select v-model="FaultCallItem.faultSubclassId" @on-change="changeFaultSub">
                            <Option v-for="(item, index) of faultSubList" :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="formItemMargin" prop="faultId"  label="故障信息：">
                        <Select v-model="FaultCallItem.faultId">
                            <Option v-for="(item, index) of faultMesList" :key="index" :value="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="formItemMargin"  label="故障描述：">
                        <Input v-model="FaultCallItem.faultDescription" type="textarea" :rows="3" placeholder="..." />
                    </FormItem>
                </Form>
            </div>
        </modal>
    </Card>
</template>

<script>
import modal from '../../public/modal';
import publicJs, {clearSpace} from '../../../libs/common';
import xwValidate from '@/libs/xwValidate';
export default {
    name: 'fault-call',
    components: {
        modal
    },
    data () {
        return {
            faultMesList: [],
            faultSubList: [],
            // 是否呼叫
            isFaultCall: true,
            tableHeight: document.documentElement.clientHeight - 240,
            faultCallMachineCode: '',
            faultCallWorkshopId: '',
            workshopList: [],
            faultCallProcessId: '',
            processList: [],
            FaultCallMachineData: [
                {
                    select: false,
                    code: '123'
                },
                {
                    select: false,
                    code: '1234123'
                },
                {
                    select: false,
                    code: '451654'
                }
            ],
            FaultCallMachineColumns: [
                // {
                //     title: '操作',
                //     width: 150,
                //     fixed: 'left',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('Button', {
                //             props: {
                //                 size: 'small',
                //                 // ghost: true,
                //                 // type: 'primary',
                //                 disabled: params.row.faultState === '正常' ? false : true
                //             },
                //             on: {
                //                 'click': () => {
                //                     let id = params.row.id;
                //                     this.getFaultCallMachine(id);
                //                 }
                //             }
                //         }, '故障呼叫');
                //     }
                // },
                {
                    title: '选择',
                    width: 70,
                    key: 'select',
                    align: 'center',
                    fixed: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('Checkbox', {
                                props: {
                                    value: params.row.select
                                },
                                on: {
                                    'on-change': (val) => {
                                        if (val) {
                                            if (params.row.faultState === '正常') {
                                                this.isFaultCall = false;
                                            } else {
                                                this.isFaultCall = true;
                                            }
                                        } else {
                                            this.isFaultCall = true;
                                        }
                                        this.FaultCallMachineData.map(x => {
                                            x.select = false;
                                            return x;
                                        });
                                        this.FaultCallMachineData[params.index].select = val;
                                    }
                                }
                            })
                        ]);
                    }
                },
                {
                    title: '设备名称',
                    fixed: 'left',
                    key: 'name',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '设备编号',
                    fixed: 'left',
                    key: 'code',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '维修状态',
                    key: 'faultState',
                    fixed: 'left',
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
                    title: '工序',
                    key: 'processName',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '保养状态',
                    key: 'completionState',
                    align: 'center',
                    minWidth: 100
                },
                {
                    title: '当前品种',
                    key: 'productName',
                    align: 'left',
                    minWidth: 100
                },
                {
                    title: '当前批号',
                    key: 'batchCode',
                    align: 'left',
                    minWidth: 100
                }
            ],
            // 分页
            FaultCallTotal: 0,
            FaultCallPageOpts: publicJs.pageOpts,
            FaultCallPageSize: publicJs.pageSize,
            FaultCallPageIndex: 1,
            FaultCallItem: {
                processId: '',
                faultCallTypeId: '',
                faultId: '',
                faultSubclassId: ''
            },
            ruleFaultCallItem: {
                faultCallTypeId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                faultId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ],
                faultSubclassId: [
                    {required: true, validator: xwValidate.select, trigger: 'change'}
                ]
            },
            // modal
            faultCallTypeList: [],
            value6: '',
            FaultCallMachineModalShow: false,
            FaultCallMachineModalLoading: false,
            FaultCallMachineModalMessage: '',
            // 呼叫当前的机台数据
            curMachineData: []
        };
    },
    methods: {
        // 获取所有机台数据
        getFaultCallmachine () {
            this.faultCallMachineCode = clearSpace(this.faultCallMachineCode);
            let params = {
                pageIndex: this.FaultCallPageIndex,
                pageSize: this.FaultCallPageSize,
                workshopId: this.faultCallWorkshopId,
                processId: this.faultCallProcessId,
                code: this.faultCallMachineCode
            };
            this.$fetch('machine/maintenance/repair/list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.FaultCallTotal = content.count;
                    this.FaultCallMachineData = content.res.map(x => {
                        x.completionState = (x.completionState === 0 ? '正常' : '保养中');
                        x.faultState = (x.faultState === 0 ? '正常' : '已呼叫');
                        x.select = false;
                        return x;
                    });
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 故障呼叫
        handleFaultCall () {
            this.FaultCallItem.faultSubclassId = '';
            this.FaultCallItem.faultId = '';
            //
            this.FaultCallItem.faultCallTypeId = this.faultCallTypeList[0].id;
            this.getFaultSubList();
            this.FaultCallItem.faultDescription = '';
            let id = this.FaultCallMachineData.find(x => x.select === true).id;
            this.getFaultCallMachine(id);
        },
        getFaultCallMachine (id) {
            // debugger;
            this.$fetch('machine/detail/' + id).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.curMachineData = content.res;
                    this.FaultCallItem.machineCode = content.res.code;
                    this.FaultCallItem.machineName = content.res.name;
                    this.FaultCallItem.processName = content.res.processName;
                    this.FaultCallItem.processId = content.res.processId;
                    this.FaultCallItem.workshopName = content.res.deptName;
                    this.FaultCallMachineModalShow = true;
                }
            });
        },
        // 搜索机台
        searchMachine () {
            this.FaultCallPageIndex = 1;
            setTimeout(() => {
                this.FaultCallTotal = 1;
            }, 0);
            this.getFaultCallmachine();
        },
        // 改变页码
        changePageIndexFaultCall (val) {
            this.FaultCallPageIndex = val;
            this.getFaultCallmachine();
        },
        // 改变页数
        changePageSizeFaultCall (val) {
            this.FaultCallPageSize = val;
            this.getFaultCallmachine();
        },
        // 获取所有工序
        getFaultCallProcess () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        },
        getFaultCallWorkshop () {
            this.$post('/user/data/workshops').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.workshopList = content.res;
                    if (content.res.length > 0) {
                        if (content.res.find(x => x.isDefault === 1)) {
                            this.faultCallWorkshopId = content.res.find(x => x.isDefault === 1).deptId;
                        } else {
                            this.faultCallWorkshopId = content.res[0].deptId;
                        }
                        this.getFaultCallmachine();
                    } else {
                        // 该用户没有权限访问
                        this.FaultCallMachineData = [];
                    }
                }
            });
        },
        // modal
        FaultCallMachineModalCancel () {
            this.FaultCallMachineModalShow = false;
        },
        FaultCallMachineModalSubmit () {
            this.$refs['FaultCallItem'].validate((valid) => {
                if (valid) {
                    let params = {
                        machineId: this.curMachineData.id,
                        machineCode: this.curMachineData.code,
                        machineName: this.curMachineData.name,
                        workshopId: this.curMachineData.deptId,
                        processId: this.curMachineData.processId,
                        faultDescription: this.FaultCallItem.faultDescription,
                        faultTypeId: this.FaultCallItem.faultCallTypeId,
                        faultTypeName: this.faultCallTypeList.find(x => x.id === this.FaultCallItem.faultCallTypeId).name,
                        faultId: this.FaultCallItem.faultId,
                        faultCode: this.faultMesList.find(x => x.id === this.FaultCallItem.faultId).code,
                        faultName: this.faultMesList.find(x => x.id === this.FaultCallItem.faultId).name,
                        faultSubclassId: this.FaultCallItem.faultSubclassId,
                        faultSubclassCode: this.faultSubList.find(x => x.id === this.FaultCallItem.faultSubclassId).code,
                        faultSubclassName: this.faultSubList.find(x => x.id === this.FaultCallItem.faultSubclassId).name
                    };
                    this.FaultCallMachineModalLoading = true;
                    this.$call('repair.order.save', params).then(res => {
                        this.isFaultCall = true;
                        this.FaultCallMachineModalLoading = false;
                        let content = res.data;
                        if (content.status = 200) {
                            this.$Message.success('呼叫成功');
                            this.getFaultCallmachine();
                            this.FaultCallMachineModalShow = false;
                        }
                    });
                } else {
                    xwValidate.message();
                }
            });
        },
        changeFaultType () {
            this.FaultCallItem.faultSubclassId = '';
            this.FaultCallItem.faultId = '';
            this.getFaultSubList();
        },
        changeFaultSub () {
            this.FaultCallItem.faultId = '';
            this.getFaultMesList();
        },
        // 获取故障类型
        getFaultCallType () {
            this.$fetch('dict/list', {parentcode: 'fault_type'}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultCallTypeList = content.res;
                }
            });
        },
        // 获取故障小类
        getFaultSubList () {
            let params = {
                faultTypeId: this.FaultCallItem.faultCallTypeId,
                auditState: 3
            };
            this.$call('fault.subclass.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultSubList = content.res;
                }
            });
        },
        // 获取故障信息
        getFaultMesList () {
            let params = {
                faultSubclassId: this.FaultCallItem.faultSubclassId,
                processId: this.FaultCallItem.processId,
                auditState: 3
            };
            this.$call('fault.list', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.faultMesList = content.res;
                }
            });
        }
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        // 获取故障类型
        this.getFaultCallType();
        // 获取工序
        this.getFaultCallProcess();
        // 获取车间
        this.getFaultCallWorkshop();
        // 获取所有机台
    },
    updated () {
        let H = document.getElementById('selectedHeight').clientHeight;
        this.tableHeight = document.documentElement.clientHeight - H - 200;
    },
    mounted () {
        window.onresize = () => {
            let Height = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - Height - 200;
        };
    }
};
</script>

<style scoped>

</style>

<template>
    <div>
        <Card>
            <Row>
                <Col class="marginTwoBottom">
                    <span class="textRight marginSRight marginTBottom">生产通知单号：</span>
                    <!--<Input class="disForm" readonly v-model="code"></Input>-->
                    <span class="disForm">{{code}}</span>
                    <span class="textRight marginSRight marginTBottom">生产订单号：</span>
                    <span class="disForm">{{orderCode}}</span>
                    <!--<Input class="disForm" readonly v-model="orderCode"></Input>-->
                    <span class="textRight marginSRight marginTBottom">生产车间：</span>
                    <span class="disForm">{{workshopName}}</span>
                    <!--<Input class="disForm" readonly v-model="workshopName"></Input>-->
                    <br>
                    <span class="textRight marginSRight marginTBottom">产品编码：</span>
                    <span class="disForm">{{productCode}}</span>
                    <!--<Input class="disForm" readonly v-model="productCode"></Input>-->
                    <span class="textRight marginSRight marginTBottom">产品名称：</span>
                    <span class="disForm">{{productName}}</span>
                    <!--<Input class="disForm" readonly v-model="productName"></Input>-->
                    <span class="textRight marginSRight marginTBottom">批次：</span>
                    <span class="disForm">{{curProductionBatch}}</span>
                    <!--<Input class="disForm" readonly v-model="curProductionBatch"></Input>-->
                </Col>
            </Row>
            <Row id="tabHeight">
                <Col span="3">
                    <Menu class="menuWidth" @on-select="changeProcess" active-name="0">
                        <MenuItem v-for="(item, index) of menuList" :name="index + ''" :key="index">
                            {{item.name}}
                        </MenuItem>
                    </Menu>
                </Col>
                <Col span="21">
                    <Button class="marginBottom" type="success" @click="addNewOpenModal">品种开台</Button>
                    <!--<Button class="marginBottom" type="primary" @click="seeSpecParams">查看工艺参数</Button>-->
                    <!--<p class="marginBottom"><a > + 品种开台</a></p>-->
                    <Table border ref="selection"  size="small" :height="shiftOpenHeight" :loading="shiftOpenLoading" @on-selection-change="changeOpenData" :columns="shiftTableColumns" :data="shiftTableData"></Table>
                </Col>
                <!--<div>-->
                    <!--说明：<br>-->
                    <!--1、开台状态为未开台或了机状态，且设备状态为正常时，可以选择，否则不可选择。<br>-->
                    <!--2、点击“品种开台”按钮弹品种开台的具体操作。<br>-->
                    <!--3、开台状态：未开台、已开台、了机；设备状态：正常、维修中、保养中。-->
                <!--</div>-->
            </Row>
        </Card>
        <modal
                :isShow="openModalShow"
                :loading="openLoading"
                :width="1000"
                :title="'品种开台'"
                :WarnMsg="openWarnMessage"
                @cancel="cancelNewAddOpen"
                @submit="confirmNewAddOpen"
        >
            <div slot="content">
                <Row class="marginBottom">
                    <Col>
                        <span>开台时间：</span>
                        <DatePicker class="formWidth" format="yyyy-MM-dd HH:mm:ss" @on-change="changeOpenDate" :confirm="true" type="datetime" placeholder="请选择日期" :clearable="false" :value="Today"></DatePicker>
                        <span class="marginLeft">班次日期：</span>
                        <Input class="disForm" readonly v-model="belongDate"></Input>
                        <span class="marginLeft">开台班次：</span>
                        <Input class="disForm" readonly v-model="shiftName"></Input>
                        <!--<Select class="formWidth textLeft" v-model="shiftId">-->
                            <!--<Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                        <!--</Select>-->
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table ref="selection" size="small" height="600" border :columns="addNewOpenColumns" :data="addNewOpenData"></Table>
                        <!--<p style="margin-top: 20px;">创 建 人： 郭雷腾  创建日期： 2018-01-01</p>-->
                        <!--<about-time-->
                            <!--:isReverse="false"-->
                            <!--:createTime="createTime"-->
                            <!--:createName="createName"-->
                        <!--&gt;-->
                        <!--</about-time>-->
                        <!--<h3 class="textRight">-->
                            <!--说明：-->
                            <!--1、开台班次由开台时间确定的。-->
                        <!--</h3>-->
                    </Col>
                </Row>
            </div>
        </modal>
        <modal
            :isShow="specParamsShow"
            :loading="specParamsLoading"
            :width="1000"
            :title="'工艺参数'"
            :isSubmit="false"
            :isCancel="false"
            @cancel="specParamsCancel"
        >
            <div slot="content">
                查看工艺参数
            </div>
        </modal>
        <delete-warning
            :v-model="deleteWarnShow"
            :tipMsg="deleteWarnMsg"
            :loading="deleteWarnLoading"
            @cancel="deleteWarnCancel"
            @confirm="deleteWarnConfirm"
        ></delete-warning>
    </div>
</template>
<script>
import modal from '../../public/modal';
import deleteWarning from '../../public/deleteWarning';
import publicJs from '../../../libs/common';
export default {
    components: {
        modal,
        deleteWarning
        // AboutTime
    },
    data () {
        return {
            specParamsShow: false,
            specParamsLoading: false,
            specParamsMsg: '',
            openSheetShow: false,
            workshopName: '',
            workshopId: '',
            code: '',
            orderCode: '',
            productCode: '',
            productName: '',
            curProductionBatch: '',
            shiftTableColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '机台号',
                    align: 'center',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 120,
                    key: 'machineCode'
                },
                {
                    title: '设备状态',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
                    fixed: 'left',
                    key: 'machineState'
                },
                {
                    title: '开台状态',
                    align: 'center',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 120,
                    key: 'openState'
                },
                {
                    title: '产品',
                    align: 'center',
                    sortable: true,
                    minWidth: 100,
                    key: 'productName'
                },
                {
                    title: '批次',
                    align: 'center',
                    minWidth: 100,
                    sortable: true,
                    key: 'batchCode'
                },
                {
                    title: '排产数量',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'planOutput'
                },
                {
                    title: '完工数量',
                    align: 'center',
                    minWidth: 120,
                    sortable: true,
                    key: 'output'
                },
                {
                    title: '计划开工时间',
                    align: 'center',
                    minWidth: 160,
                    sortable: true,
                    key: 'planFrom'
                },
                {
                    title: '计划完工时间',
                    align: 'center',
                    minWidth: 160,
                    sortable: true,
                    key: 'planTo'
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 180,
                    render: (h, params) => {
                        return h('Div', [
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.openState === '未开台' ? true : (params.row.openState === '已关闭')
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    'click': () => {
                                        this.cancelOpenIds = Array.of(params.row.machineOpenId);
                                        this.deleteWarnMsg = '确定要取消开台吗？';
                                        this.isSureDelete = true;
                                        this.deleteWarnShow = true;
                                    }
                                }
                            }, '取消开台'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    disabled: params.row.openState !== '已关闭'
                                },
                                on: {
                                    'click': () => {
                                        // console.log(params.row);
                                        // debugger;
                                        this.isCancelClose = true;
                                        this.noticeMachineId = params.row.noticeMachineId;
                                        this.deleteWarnMsg = '确定要取消关闭，对该机台重新开台吗？';
                                        // this.isSureDelete = true;
                                        this.deleteWarnShow = true;
                                        // this.cancelOpenIds = Array.of(params.row.machineOpenId);
                                        // this.deleteWarnMsg = '确定要取消开台吗？';
                                        // this.isSureDelete = true;
                                        // this.deleteWarnShow = true;
                                    }
                                }
                            }, '取消关闭')
                        ]);
                    }
                }
            ],
            isCancelClose: false,
            noticeMachineId: '',
            shiftTableData: [],
            menuList: [{}],
            openModalShow: false,
            openLoading: false,
            addNewOpenColumns: [
                {
                    title: '工序',
                    align: 'center',
                    sortable: true,
                    width: 80,
                    key: 'processName'
                },
                {
                    title: '机台号',
                    align: 'center',
                    sortable: true,
                    key: 'machineCode'
                },
                {
                    title: '生产通知单号',
                    align: 'center',
                    sortable: true,
                    width: 140,
                    key: 'code'
                },
                {
                    title: '产品',
                    align: 'center',
                    sortable: true,
                    key: 'productName'
                },
                {
                    title: '批次',
                    align: 'center',
                    sortable: true,
                    key: 'batchCode'
                },
                {
                    title: '可用锭数',
                    align: 'center',
                    sortable: true,
                    key: 'spinAva'
                },
                {
                    title: '所用锭数',
                    align: 'center',
                    sortable: true,
                    key: 'SpinUse',
                    render: (h, params) => {
                        var vm = this;
                        return h('InputNumber', {
                            props: {
                                value: params.row.SpinUse
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.SpinUse = event;
                                    vm.addNewOpenData[params.index] = params.row;
                                }
                            }
                        });
                    }
                },
                {
                    title: '开台产量',
                    align: 'center',
                    sortable: true,
                    key: 'beginOutput',
                    render: (h, params) => {
                        var vm = this;
                        return h('Input', {
                            props: {
                                value: 0
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.beginOutput = event.target.value;
                                    vm.addNewOpenData[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            addNewOpenData: [],
            selectedOpenData: [],
            codeOrName: '',
            activeName: 1,
            workShopList: [],
            noticeSheetId: '',
            processDataList: [],
            openWarnMessage: '',
            curProcessId: '',
            shiftId: '',
            shiftName: '',
            belongDate: '',
            shiftList: [],
            curOpenTime: '',
            cancelOpenIds: [],
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            shiftOpenLoading: false,
            isSureDelete: false,
            shiftOpenHeight: document.documentElement.clientHeight - 340,
            sureTime: '',
            createTime: '',
            createName: ''
        };
    },
    computed: {
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
    },
    methods: {
        // 获取所有的工序列表
        getAllProcess () {
            this.$fetch('process/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.processDataList = content.res;
                    this.getSheetProcess();
                }
            });
        },
        // 获取该通知单下面的工序列表数据
        getSheetProcess () {
            const _this = this;
            this.$fetch('notice/process/list?sheetid=' + this.noticeSheetId).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    _this.menuList = content.res.map(item => {
                        return {
                            id: item.processId,
                            name: this.processDataList.find(x => x.id === item.processId).name
                        };
                    });
                    _this.curProcessId = this.menuList[0].id;
                    _this.getMachineOpenList();
                }
            });
        },
        getMachineOpenList () {
            this.shiftOpenLoading = true;
            this.$fetch('machine/open/to/open/list', {
                noticesheetid: this.noticeSheetId,
                processid: this.curProcessId
            }).then((res) => {
                let content = res.data;
                this.shiftOpenLoading = false;
                if (content.status === 200) {
                    this.shiftTableData = content.res.map(item => {
                        item._disabled = item.machineState === '已开台' ? true : (item.openState === '已关闭');
                        item.shutdownTime = item.shutdownTime;
                        return item;
                    });
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    this.$Loading.finish();
                    this.openSheetShow = true;
                }
            });
        },
        // 选择开台数据或者选择关闭数据
        changeOpenData (val) {
            this.addNewOpenIds = val.map(x => x.noticeMachineId);
            // this.addNewOpenData = val.map(item => {
            //     item.beginOutput = 0;
            //     item.processId = this.curProcessId;
            //     item.processName = this.menuList.find(x => x.id === this.curProcessId).name;
            //     item.code = this.code;
            //     item.spinAva = item.spinCount - item.spinUsed;
            //     item.SpinUse = item.spinAva;
            //     return item;
            // });
            // this.cancelOpenIds = val.map(x => x.machineOpenId);
        },
        // 点击开台
        addNewOpenModal () {
            // 这里的判断条件不足；
            if (this.addNewOpenIds.length === 0) {
                this.deleteWarnMsg = '请先选择机台';
                this.deleteWarnShow = true;
                return false;
            }
            // debugger;
            this.openWarnMessage = '';
            // this.addNewOpenData.map(x => {
            //     x.spinUse = 1;
            //     return x;
            // });
            this.getMachineOpen();
        },
        // 获取开台列表
        getMachineOpen () {
            this.$post('notice/machine/to/open', this.addNewOpenIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.addNewOpenData = content.res.map(item => {
                        item.spinAva = item.spinCount - item.spinUsed;
                        item.processId = this.curProcessId;
                        item.code = this.code;
                        item.SpinUse = item.spinAva;
                        item.processName = this.menuList.find(x => x.id === this.curProcessId).name;
                        return item;
                    });
                }
            });
            this.getShiftByDate();
            this.openModalShow = true;
        },
        // 根据据当前时间判断当前班次
        getShiftByDate () {
            const _this = this;
            this.$fetch('schedule/current/schedule?now=' + this.curOpenTime, {
                deptid: this.workshopId
            }).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.$Modal.warning({
                            title: '警告',
                            content: '<p>该时间段内还没有进行排班</p>'
                        });
                        _this.shiftName = '';
                        _this.belongDate = '';
                        _this.shiftId = '';
                        return false;
                    }
                    _this.shiftName = content.res.shiftName;
                    _this.shiftId = content.res.shiftId;
                    _this.belongDate = content.res.belongDate;
                }
            });
        },
        // 已被开台的样式
        // rowClassName (row, index) {
        //     if (row.openState !== '未开台') {
        //         return 'tableColor';
        //     } else {
        //         return '';
        //     }
        // },
        // 改变工序
        changeProcess (val) {
            this.curProcessId = this.menuList[val].id;
            this.getMachineOpenList();
            this.addNewOpenData = [];
        },
        // 开台取消
        cancelNewAddOpen () {
            this.openLoading = false;
            this.openModalShow = false;
        },
        changeOpenDate (val) {
            this.curOpenTime = val;
            // debugger
            this.getShiftByDate();
        },
        // 开台确定
        confirmNewAddOpen () {
            if (this.shiftId === '') {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '该时间段内还没有进行排班';
                // this.openWarnMessage = '请选择班次';
                return false;
            }
            let params = [];
            for (let info of this.addNewOpenData) {
                if (info.spinAva < info.SpinUse) {
                    this.deleteWarnShow = true;
                    this.deleteWarnMsg = '机台使用总锭数不能超过设定数';
                    // this.openWarnMessage = '机台使用总锭数不能超过设定数';
                    return false;
                }
                if (info.SpinUse === 0) {
                    this.deleteWarnShow = true;
                    this.deleteWarnMsg = '机台使用总锭数不能为0';
                    // this.openWarnMessage = '机台使用总锭数不能超过设定数';
                    return false;
                }
                params.push({
                    machineId: info.machineId,
                    machineCode: info.machineCode,
                    shiftId: this.shiftId,
                    startTime: this.curOpenTime,
                    endTime: '',
                    workshopId: this.workshopId,
                    processId: this.curProcessId,
                    spinUsed: info.SpinUse,
                    beginOutput: info.beginOutput,
                    endOutput: '',
                    noticeSheetCode: this.code,
                    productId: info.productId,
                    productName: info.productName,
                    productCode: info.productCode,
                    noticeSheetId: this.noticeSheetId,
                    batchCode: info.batchCode,
                    planOutput: info.planOutput,
                    planFrom: info.planFrom,
                    planTo: info.planTo
                });
            }
            this.openLoading = true;
            this.$post('machine/open/startup?noticeSheetId=' + this.noticeSheetId + '&belongdate=' + this.belongDate + '&shiftid=' + this.shiftId, params).then(res => {
                let content = res.data;
                this.openLoading = false;
                if (content.status === 200) {
                    this.$Message.success('开台成功');
                    this.addNewOpenData = [];
                    this.openModalShow = false;
                    this.getMachineOpenList();
                } else {
                    this.$Message.error('开台失败');
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
            this.deleteWarnLoading = false;
            this.isSureDelete = false;
            this.isCancelClose = false;
        },
        deleteWarnConfirm () {
            if (this.isSureDelete) {
                this.isSureDelete = false;
                this.deleteWarnLoading = true;
                this.$post('machine/open/delete', this.cancelOpenIds).then(res => {
                    let content = res.data;
                    this.deleteWarnLoading = false;
                    if (content.status === 200) {
                        this.isSureDelete = false;
                        this.getMachineOpenList();
                        this.$Message.success('取消成功');
                        this.deleteWarnShow = false;
                    }
                });
            } else if (this.isCancelClose) {
                this.isCancelClose = false;
                this.deleteWarnLoading = true;
                this.$post('notice/machine/cancelClose?id=' + this.noticeMachineId).then(res => {
                    let content = res.data;
                    this.deleteWarnLoading = false;
                    if (content.status === 200) {
                        // debugger;
                        // this.isSureDelete = false;
                        this.getMachineOpenList();
                        this.$Message.success('取消成功');
                        this.deleteWarnShow = false;
                    }
                });
            } else {
                this.deleteWarnShow = false;
            }
        },
        // 查看工艺参数
        seeSpecParams () {
            this.specParamsShow = true;
        },
        specParamsCancel () {
            // debugger
            this.specParamsShow = false;
        }
    },
    created () {
        // 获取所有班次列表
        // Bus.$emit('curmsgbb', '我要传给兄弟组件们，你收到没有');
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.$Loading.start();
        this.noticeSheetId = this.$route.query.id;
        this.openSheetShow = false;
        this.$fetch('notice/sheet/detail/' + this.noticeSheetId).then((res) => {
            let content = res.data;
            if (content.status === 200) {
                let obj = content.res.noticeSheet;
                this.workshopName = obj.workshopName;
                this.workshopId = obj.workshopId;
                this.code = obj.code;
                this.orderCode = obj.orderCode;
                this.productCode = obj.productCode;
                this.productName = obj.productName;
                this.curProductionBatch = obj.batchCode;
                this.getAllProcess();
                this.curOpenTime = this.Today;
            }
        });
    },
    mounted () {
        window.onresize = () => {
            // this.shiftOpenHeight = publicJs.compClientHeight(350);
            let tabHeight = document.getElementById('tabHeight').offsetTop;
            this.shiftOpenHeight = document.documentElement.clientHeight - tabHeight - 185;
            console.log(tabHeight);
            console.log(this.shiftOpenHeight);
        };
    }
};
</script>
<style scoped>
.marginSRight{
    width: 120px;
    font-weight: bold;
    display: inline-block;
}
.formWidth {
    width: 160px;
}
.spanWidth {
    width: 150px;
    display: inline-block;
    text-align: right;
    margin-bottom: 20px;
}
.marginTwoBottom{
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
    margin-bottom: 20px;
}
.marginTBottom{
    margin-bottom: 20px;
}
.disForm{
    width: 150px;
    display: inline-block;
}
.menuWidth{
    width: 90% !important;
    border-right: none;
}
</style>

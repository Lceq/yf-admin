<template>
    <div>
        <Card>
            <Row class="flexBetween">
                <Col class="leftFlex marginBottom marginRight">
                    <Button type="success" @click="closeMachine">品种了机</Button>
                    <!--<span >+品种了机</span>-->
                </Col>
                <Col>
                    <span class="formSpanStyle">生产车间：</span>
                    <Select class="formEachStyle textLeft" clearable v-model="modelWorkShop">
                        <Option v-for="item in workShopList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">工序：</span>
                     <Select class="formEachStyle textLeft" clearable v-model="modelProcessId">
                        <Option v-for="item in ProcessList" :value="item.id" :style="item.style" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">生产通知单号：</span>
                    <Input class="formEachStyle" clearable v-model="noticeSheetCode" placeholder="请输入生产通知单号" />
                    <span class="formSpanStyle">机台号：</span>
                    <Input class="formEachStyle" clearable v-model="machineCode" placeholder="请输入机台号" />
                    <Button class="marginBottom" @click="searchResult" type="primary">搜索</Button>
                </Col>
            </Row>
            <Row id="tableHeight">
                <Col>
                    <Table id="TableDataId" ref="selection" border  size="small" :height="closeTableHeight" :loading="closeTableLoading" @on-selection-change="selectCloseData" :data="closeData" :columns="closeColumns"></Table>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="closeShow"
                :loading="closeLoading"
                :width="1000"
                :title="'品种了机'"
                @cancel="closeCancel"
                @submit="closeSubmit"
        >
            <div slot="content">
                <Row>
                    <!--<Col span="5">-->
                        <!--<span class="spanClass marginRight">生产车间：一车间</span>-->
                    <!--</Col>-->
                    <Col class="">
                        <span  class="formSpanStyle">了机时间：</span>
                        <DatePicker class="formEachStyle" format="yyyy-MM-dd HH:mm:ss" @on-change="changeCloseTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="curCloseTime"></DatePicker>
                        <span class="formSpanStyle">班次日期：</span>
                        <Input class="formEachStyle" readonly v-model="belongDate"></Input>
                        <span  class="formSpanStyle">了机班次：</span>
                        <Input class="formEachStyle" readonly v-model="shiftName" />
                        <!--<Select class="formWidth textLeft" clearable v-model="shiftId">-->
                            <!--<Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                        <!--</Select>-->
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table class="marginBottom" size="small" :row-class-name="rowCloseClassName" :height="600" ref="selection" border :columns="closeModalColumns" :data="closeModalData"></Table>
                        <!--<AboutTime-->
                            <!--:createTime="createTime"-->
                            <!--:createName="createName"-->
                            <!--:reverseTime="reverseTime"-->
                            <!--:reverseName="reverseName"-->
                        <!--&gt;-->
                        <!--</AboutTime>-->
                        <!--<p>创 建 人： 郭雷腾 创建日期： 2018-01-01</p>-->
                        <!--<p class="textRight">说明：-->
                            <!--1、了机班次由了机时间确定的。</p>-->
                    </Col>
                </Row>
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
import AboutTime from '../../public/AboutTime';
import publicJs from '../../public/public-js/publiceJs';
import Cookies from 'js-cookie';
// import Bus from '../../public/bus';
export default {
    components: {
        modal,
        deleteWarning,
        AboutTime
    },
    data () {
        return {
            modelWorkShop: '',
            workShopList: [],
            machineCode: '',
            // len: document.getElementById('TableDataId').offsetTop,
            noticeSheetCode: '',
            modelProcessId: '',
            ProcessList: [],
            closeData: [],
            closeColumns: [
                {
                    type: 'selection',
                    align: 'center',
                    fixed: 'left',
                    width: 60
                },
                {
                    title: '工序',
                    align: 'center',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 100,
                    key: 'processName'
                },
                {
                    title: '机台号',
                    align: 'center',
                    minWidth: 100,
                    fixed: 'left',
                    sortable: true,
                    key: 'machineCode'
                },
                {
                    title: '生产通知单号',
                    align: 'center',
                    minWidth: 160,
                    sortable: true,
                    key: 'noticeSheetCode'
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
                    minWidth: 160,
                    sortable: true,
                    key: 'planOutput'
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
                    minWidth: 160,
                    sortable: true,
                    key: 'planFrom'
                },
                {
                    title: '实际开台时间',
                    align: 'center',
                    sortable: true,
                    minWidth: 160,
                    key: 'startTime'
                },
                {
                    title: '计划了机时间',
                    align: 'center',
                    minWidth: 160,
                    sortable: true,
                    key: 'planTo'
                }
            ],
            closeShow: false,
            closeLoading: false,
            closeModalColumns: [
                {
                    title: '工序',
                    align: 'center',
                    sortable: true,
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
                    key: 'noticeSheetCode'
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
                    title: '了机产量',
                    align: 'center',
                    sortable: true,
                    key: 'endOutput',
                    render: (h, params) => {
                        var vm = this;
                        return h('Input', {
                            props: {
                                value: params.row.endOutput
                            },
                            on: {
                                'on-change': (event) => {
                                    params.row.endOutput = event.target.value;
                                    vm.closeModalData[params.index] = params.row;
                                }
                            }
                        });
                    }
                }
            ],
            closeModalData: [{}],
            deleteWarnShow: false,
            deleteWarnMsg: '',
            deleteWarnLoading: false,
            shiftId: '',
            shiftName: '',
            belongDate: '',
            shiftList: [],
            closeTableLoading: false,
            curCloseTime: '',
            closeModalIds: [],
            closeTableHeight: document.documentElement.clientHeight - 240
        };
    },
    methods: {
        // 获取了机的数据
        getCloseData () {
            const _this = this;
            this.closeTableLoading = true;
            this.$fetch('machine/open/list', {
                workshopid: this.modelWorkShop,
                processid: this.modelProcessId,
                noticesheetcode: this.noticeSheetCode,
                machinecode: this.machineCode
            }).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    _this.closeData = content.res.map(item => {
                        item.processName = _this.ProcessList.find(x => x.id === item.processId).name;
                        item._checked = false;
                        return item;
                    });
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                    _this.closeTableLoading = false;
                }
            });
        },
        // 判断时都有默认车间
        getUserWorkshop () {
            const _this = this;
            this.$fetch('user/workshop').then(res => {
                let content = res.data;
                if (content.status === 200) {
                    if (content.res === null) {
                        _this.modelWorkShop = _this.workShopList[0].id;
                    } else {
                        _this.modelWorkShop = content.res.id;
                    }
                    this.getProcess();
                    // this.getShiftByDate();
                }
            });
        },
        // 获取工序列表
        getProcess () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.ProcessList = res;
                // if (_this.modelProcessId === '') {
                //     _this.modelProcessId = _this.ProcessList[0].id;
                // }
                _this.getCloseData();
            });
        },
        // 改变了机时间
        changeCloseTime (val) {
            this.curCloseTime = val;
            this.getShiftByDate();
        },
        // 查询
        searchResult () {
            this.getCloseData();
        },
        // 选择了机机台
        selectCloseData (val) {
            // this.closeModalData = val;
            this.closeModalData = val.map(x => {
                x.color = false;
                return x;
            });
        },
        // 根据mchine_id获取了机数据
        getShutDownMachines () {
            // this.closeModalIds = []
            const _this = this;
            this.$post('machine/open/to/shut', this.closeModalIds).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger
                    this.closeModalData = content.res.map(x => {
                        x.processName = _this.ProcessList.find(y => y.id === x.processId).name;
                        return x;
                    });
                    this.getShiftByDate();
                    this.closeShow = true;
                }
            });
        },
        // 根据据当前时间判断当前班次
        getShiftByDate () {
            const _this = this;
            this.$fetch('schedule/current/schedule?now=' + this.curCloseTime, {
                deptid: this.modelWorkShop
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
                    // _this.openModalShow = true;
                }
            });
        },
        // 点击了机
        closeMachine () {
            const _this = this;
            if (this.closeModalData.length === 0) {
                this.deleteWarnMsg = '请选择了机机台';
                this.deleteWarnShow = true;
                return false;
            } else {
                this.closeModalIds = this.closeModalData.map(x => x.id);
                // debugger;
                // this.closeModalData.map(x => {
                //     x.endOutput = 0;
                //     x.processName = _this.ProcessList.find(y => y.id === x.processId).name;
                //     return x;
                // });
                this.curCloseTime = this.Today;
                // this.closeModalData = this.closeModalData.map(x => {
                //     x.color = false;
                //     return x;
                // });
                this.getShutDownMachines();
            }
        },
        // 取消了机
        closeCancel () {
            this.closeShow = false;
            this.closeLoading = false;
        },
        rowCloseClassName (row, index) {
            if (row.color === true) {
                return 'tableColor';
            } else {
                return '';
            }
        },
        // 提交了机
        closeSubmit () {
            if (this.shiftId === '') {
                this.deleteWarnShow = true;
                this.deleteWarnMsg = '该时间段内还没有进行排班';
                // this.openWarnMessage = '请选择班次';
                return false;
            }
            this.closeModalData = this.closeModalData.map(x => {
                x.color = false;
                return x;
            });
            let params = [];
            for (let p of this.closeModalData) {
                let startTime = new Date(p.startTime).getTime();
                let endTime = new Date(this.curCloseTime).getTime();
                // p.color = false;
                let result = false;
                if (startTime > endTime) {
                    p.color = true;
                    result = true;
                    this.$Modal.warning({
                        title: '警告',
                        content: '<span>机台</span>' + p.machineCode + '<span>的了机时间小于开台时间</span>'
                    });
                }
                if (parseFloat(p.beginOutput) > parseFloat(p.endOutput)) {
                    p.color = true;
                    result = true;
                    this.$Modal.warning({
                        title: '警告',
                        content: '<span>机台</span>' + p.machineCode + '<span>的结束产量小于开台产量</span>'
                    });
                }
                if (result) {
                    // console.log(this.closeModalData);
                    return false;
                }
                params.push({
                    id: p.id,
                    endTime: this.curCloseTime,
                    machineId: p.machineId,
                    endOutput: parseFloat(p.endOutput)
                });
            }
            this.closeLoading = true;
            this.$post('machine/open/shutdown?belongdate=' + this.belongDate + '&shiftid=' + this.shiftId, params).then(res => {
                let content = res.data;
                this.closeLoading = false;
                if (content.status === 200) {
                    this.getCloseData();
                    this.closeShow = false;
                    this.closeModalData = [];
                    this.$Message.success('了机成功');
                }
            });
        },
        deleteWarnCancel () {
            this.deleteWarnShow = false;
        },
        deleteWarnConfirm () {
            this.deleteWarnShow = false;
        }
    },
    destroyed () {
        Cookies.set('curProcessId', this.modelProcessId);
    },
    mounted () {
        window.onresize = () => {
            let tableHeight = document.getElementById('tableHeight').offsetTop;
            this.closeTableHeight = document.documentElement.clientHeight - tableHeight - 140;
        };
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.modelProcessId = parseInt(Cookies.get('curProcessId'));
        if (isNaN(this.modelProcessId)) {
            this.modelProcessId = '';
        }
        this.curCloseTime = this.Today;
        const _this = this;
        this.$fetch('dept/workshops').then((res) => {
            let content = res.data;
            if (content.status === 200) {
                _this.workShopList = content.res;
                _this.getUserWorkshop();
            }
        });
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
    }
};
</script>
<style scoped>
    .flexBetween {
        display: -webkit-flex;
        display: flex;
        justify-content: space-between;
    }
    .formEachStyle{
        width: 160px;
        /*margin-right: 10px;*/
    }
    .leftFlex{
        display: -webkit-flex;
        display: flex;
    }
</style>

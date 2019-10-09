<template>
    <modal
        :isShow="showMachines"
        :loading="selectMachineLoading"
        :title="'选择机台'"
        :width="800"
        @submit="selectMachinesSubmit"
        @cancel="selectMachinesCancel"
    >
        <div slot="content">
            <div class="parentFlexBetween">
                <div>
                    <Select
                            ref="setStartQuery"
                            class="formMachine"
                            placeholder="开始机台..."
                            v-model="startMachineCode"
                            filterable
                            clearable
                            remote
                            :remote-method="remoteMethodStartMachine"
                            :loading="startMachineCodeLoading">
                        <Option v-for="(option, index) in startMachineData" :value="option.machineCode" :key="index">{{option.machineCode}}</Option>
                    </Select>
                    <Select
                            ref="setEndQuery"
                            class="formMachine"
                            placeholder="结束机台..."
                            v-model="endMachineCode"
                            filterable
                            clearable
                            remote
                            :remote-method="remoteMethodEndMachine"
                            :loading="endMachineCodeLoading">
                        <Option v-for="(option, index) in endMachineData" :value="option.machineCode" :key="index">{{option.machineCode}}</Option>
                    </Select>
                    <Button @click="submitBetweenMachine" type="primary">确认机台</Button>
                </div>
                <div class="marginBottom textRight">
                    <div class="formMachine" ><Input v-model="machineCode" @on-change="changeMachineCodeNameProcess" clearable placeholder="请输入设备编码" /></div>
                    <div class="formMachine" ><Input v-model="machineName" @on-change="changeMachineCodeNameProcess" clearable placeholder="请输入设备名称" /></div>
                    <div class="formMachine" ><Input v-model="machineProcess" @on-change="changeMachineCodeNameProcess" clearable placeholder="请输入工序" /></div>
                </div>
            </div>
            <Table border ref="selection" size="small" @on-select-cancel="selectCancelMachine" @on-selection-change="selectAllMachine" :row-class-name="rowClassName" :columns="userMachineColumns" :data="userMachineData" height="500"></Table>
        </div>
    </modal>
</template>
<script>
import modal from '../public/modal';
export default {
    name: 'select-machines',
    components: {
        modal
    },
    props: {
        showMachineData: {
            type: Object
        }
    },
    data () {
        return {
            startMachineCode: '',
            endMachineCode: '',
            startMachineCodeLoading: false,
            endMachineCodeLoading: false,
            startMachineData: [],
            endMachineData: [],
            userId: '',
            machineCode: '',
            machineName: '',
            machineProcess: '',
            userMachineColumns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '设备编码',
                    key: 'code',
                    sortable: true
                },
                {
                    title: '设备名称',
                    key: 'name',
                    sortable: true
                },
                {
                    title: '所属工序',
                    key: 'processName',
                    sortable: true
                },
                {
                    title: '开始锭号',
                    key: 'startSpinNumber',
                    width: 100,
                    sortable: true,
                    render: (h, params) => {
                        if (params.row._checked) {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.startSpinNumber,
                                    min: 1,
                                    max: params.row.spinCount,
                                    width: '100%'
                                },
                                style: {
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.startSpinNumber = val;
                                        params.row.openSpinCount = params.row.endSpinNumber - params.row.startSpinNumber + 1;
                                        this.userMachineData[params.index] = params.row;
                                    }
                                }
                            });
                        } else {
                            return h('span', {}, params.row.startSpinNumber);
                        }
                    }
                },
                {
                    title: '结束锭号',
                    key: 'endSpinNumber',
                    sortable: true,
                    render: (h, params) => {
                        if (params.row._checked) {
                            return h('InputNumber', {
                                props: {
                                    value: params.row.endSpinNumber,
                                    min: 1,
                                    max: params.row.spinCount,
                                    width: '100%'
                                },
                                style: {
                                },
                                on: {
                                    'on-change': (val) => {
                                        params.row.endSpinNumber = val;
                                        params.row.openSpinCount = params.row.endSpinNumber - params.row.startSpinNumber + 1;
                                        this.userMachineData[params.index] = params.row;
                                    }
                                }
                            });
                        } else {
                            return h('span', {}, params.row.endSpinNumber);
                        }
                    }
                },
                {
                    title: '锭数',
                    key: 'openSpinCount',
                    sortable: true
                }
            ],
            userMachineData: [],
            showMachines: false,
            selectMachineLoading: false,
            AllSelectedMachineData: []
        };
    },
    methods: {
        //
        remoteMethodStartMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.startMachineCodeLoading = true;
                setTimeout(() => {
                    _this.startMachineCodeLoading = false;
                    const list = _this.userMachineData.map(item => {
                        return {
                            machineCode: item.code
                        };
                    });
                    _this.startMachineData = list.filter(item => item.machineCode.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                _this.startMachineData = [];
            }
        },
        remoteMethodEndMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.endMachineCodeLoading = true;
                setTimeout(() => {
                    _this.endMachineCodeLoading = false;
                    const list = _this.userMachineData.map(item => {
                        return {
                            machineCode: item.code
                        };
                    });
                    _this.endMachineData = list.filter(item => item.machineCode.toLowerCase().indexOf(query.toLowerCase()) > -1);
                }, 200);
            } else {
                _this.endMachineData = [];
            }
        },
        submitBetweenMachine () {
            if (this.startMachineCode === '' || this.startMachineCode === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请输入开始机台号</p>'
                });
                return false;
            }
            if (this.endMachineCode === '' || this.endMachineCode === undefined) {
                this.$Modal.warning({
                    title: '提示',
                    content: '<p>请输入结束机台号</p>'
                });
                return false;
            }
            let isCheck = false;
            for (let i of this.AllMachineData) {
                if (i.code === this.startMachineCode) {
                    isCheck = true;
                }
                if (isCheck) {
                    i._checked = true;
                }
                if (i.code === this.endMachineCode) {
                    isCheck = false;
                }
            }
        },
        //
        changeMachineCodeNameProcess () {
            let machineCode = new RegExp(this.machineCode.trim(), 'i');
            let machineName = new RegExp(this.machineName.trim(), 'i');
            let machineProcess = new RegExp(this.machineProcess.trim(), 'i');
            let SelectC = [];
            let SelectN = [];
            let SelectP = [];
            for (let i of this.AllMachineData) {
                if (machineCode.test(i.code)) {
                    SelectC.push(i);
                }
            }
            for (let i of SelectC) {
                if (machineName.test(i.name)) {
                    SelectN.push(i);
                }
            }
            for (let i of SelectN) {
                if (machineProcess.test(i.processName)) {
                    SelectP.push(i);
                }
            }
            for (let select of this.AllSelectedMachineData) {
                if (this.userMachineData.map(x => x.id).includes(select.id)) {
                    this.userMachineData.find(x => x.id === select.id)._checked = true;
                }
            }
            this.userMachineData = SelectP;
        },
        selectCancelMachine (val, row) {
            this.AllMachineData.find(x => x.id === row.id)._checked = false;
        },
        selectAllMachine (val) {
            if (val.length === this.userMachineData.length) {
                for (let v of val) {
                    this.AllMachineData.find(x => x.id === v.id)._checked = true;
                }
            } else if (val.length === 0) {
                for (let v of this.userMachineData) {
                    this.AllMachineData.find(x => x.id === v.id)._checked = false;
                }
            } else {
                for (let v of val) {
                    this.AllMachineData.find(x => x.id === v.id)._checked = true;
                }
            }
        },
        selectMachinesSubmit () {
            let areturn = false;
            let data = this.AllMachineData.filter(x => x._checked === true);
            let params = data.map(x => {
                if (x.openSpinCount < 1) {
                    areturn = true;
                    this.$Message.warning('开台锭号不能大于结束锭号');
                }
                return {
                    machineId: x.id,
                    machineCode: x.code,
                    machineName: x.name,
                    startSpinNumber: x.startSpinNumber,
                    endSpinNumber: x.endSpinNumber,
                    openSpinCount: x.openSpinCount
                };
            });
            if (areturn) {
                return false;
            }
            let val = {
                userId: this.userId,
                userMachines: params
            };
            this.$emit('on-submit', val);
            this.showMachines = false;
        },
        selectMachinesCancel () {
            this.showMachines = false;
        },
        rowClassName (row, index) {
            if (row.color === true) {
                return 'tableColor';
            } else {
                return '';
            }
        },
        getWorkshopMachine (val) {
            const _this = this;
            let params = {
                auditState: 3,
                state: 1,
                typeId: 26,
                workshopId: val.workshopId,
                processId: val.processId
            };
            this.$api.machine.getMachineList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    var machineList = [];
                    var data = content.res;
                    machineList = data.map(item => {
                        item._checked = false;
                        item.color = false;
                        item.startSpinNumber = 1;
                        item.endSpinNumber = item.spinCount;
                        item.openSpinCount = item.spinCount;
                        return item;
                    });
                    _this.$api.userMachine.getUserMachineList2({userId: val.userId}).then(res => {
                        let content = res.data;
                        if (content.status === 200) {
                            for (let i of content.res) {
                                if (machineList.map(x => x.id).includes(i.machineId)) {
                                    machineList.find(x => x.id === i.machineId)._checked = true;
                                    machineList.find(x => x.id === i.machineId).startSpinNumber = i.startSpinNumber;
                                    machineList.find(x => x.id === i.machineId).endSpinNumber = i.endSpinNumber;
                                    machineList.find(x => x.id === i.machineId).openSpinCount = i.openSpinCount;
                                }
                            }
                            _this.AllSelectedMachineData = machineList.filter(x => x._checked === true);
                            _this.$api.userMachine.getUserMachineList3({processId: val.processId}).then(res => {
                                let content = res.data;
                                if (content.status === 200) {
                                    for (let c of content.res) {
                                        if (machineList.map(x => x.id).includes(c.machineId)) {
                                            machineList.find(x => x.id === c.machineId).color = true;
                                        }
                                    }
                                    _this.userMachineData = machineList;
                                    _this.AllMachineData = _this.userMachineData;
                                    _this.showMachines = true;
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    watch: {
        showMachineData (val) {
            const _this = this;
            if (val) {
                _this.userId = val.userId;
                _this.$refs.setStartQuery.clearSingleSelect();
                _this.$refs.setEndQuery.clearSingleSelect();
                _this.machineCode = '';
                _this.machineName = '';
                _this.machineProcess = '';
                _this.getWorkshopMachine(val);
            }
        }
    },
    mounted () {
        // 获取车间的所有机台
        // this.getWorkshopMachine();
    }
};
</script>
<style scoped>
    .formInput{
        width: 150px!important;
        z-index: 1;
        left: 14%;
        position: absolute;
        padding: 8px 10px;
        top: 25px;
        background-color: #fff;
        box-shadow: 0 0 6px #ddd;
    }
    .formInput input{
        border: 1px solid #ccc;
    }
    .fromWidth{
        display: inline-block;
        width: 150px;
    }
    .formMachine{
        width: 120px;
        /*float: left;*/
        /*padding: 0 10px;*/
        display: inline-block;
    }
    .spanWidth{
        width: 100px;
        line-height: 20px;
        margin-bottom: 20px;
        text-align: right;
        display: inline-block;
    }
    .spanPost{
        line-height: 40px;
    }
</style>

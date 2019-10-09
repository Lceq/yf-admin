<template>
    <div>
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
                <Table border ref="selection" size="small" @on-select-cancel="selectCancelMachine" @on-selection-change="selectAllMachine" :row-class-name="rowClassName" :columns="userMachineColumns" :loading="userMachineLoading" :data="userMachineList" height="500"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
export default {
    name: 'select-machines',
    components: {
        modal
    },
    props: {
        userMachineData: {
            type: Array,
            default: []
        },
        isShowSelectMachine: {
            type: Number
        },
        saveSuccess: {
            type: Number
        }
    },
    data () {
        return {
            showMachines: false,
            selectMachineLoading: false,
            startMachineCodeLoading: false,
            endMachineCodeLoading: false,
            userMachineLoading: false,
            startMachineCode: '',
            endMachineCode: '',
            startMachineData: [],
            endMachineData: [],
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
            userMachineList: [],
            isSwitch: false
        };
    },
    methods: {
        remoteMethodStartMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.startMachineCodeLoading = true;
                setTimeout(() => {
                    _this.startMachineCodeLoading = false;
                    const list = _this.userMachineList.map(item => {
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
                    const list = _this.userMachineList.map(item => {
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
            this.userMachineList = SelectP;
        },
        selectMachinesSubmit () {
            this.selectMachineLoading = true;
            this.$emit('cancel');
            this.$emit('submit', this.AllMachineData);
        },
        selectMachinesCancel () {
            this.showMachines = false;
            this.userMachineList = [];
            this.$emit('cancel');
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
        rowClassName (row, index) {
            if (row.color === true) {
                return 'tableColor';
            } else {
                return '';
            }
        },
        JudgeUserMachineList () {
            const _this = this;
            if (this.userMachineData.length !== 0) {
                _this.AllMachineData = _this.userMachineData;
                _this.userMachineList = _this.userMachineData;
                _this.userMachineLoading = false;
            } else {
                setTimeout(() => {
                    _this.JudgeUserMachineList();
                }, 100);
            }
        }
    },
    watch: {
        saveSuccess (val, oldData) {
            this.selectMachineLoading = false;
            this.userMachineList = [];
            this.showMachines = false;
        },
        isShowSelectMachine (newData, oldData) {
            this.showMachines = true;
            this.userMachineLoading = true;
            this.machineCode = '';
            this.machineName = '';
            this.machineProcess = '';
            this.JudgeUserMachineList();
        }
    }
};
</script>

<style scoped>
    .formMachine{
        width: 120px;
        /*float: left;*/
        /*padding: 0 10px;*/
        display: inline-block;
    }
</style>

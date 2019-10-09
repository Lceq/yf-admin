<template>
    <div>
        <modal
            :isShow="isShow"
            :loading="addMachinesLoading"
            :width="800"
            @cancel="addMachinesCancel"
            @submit="addMachinesSubmit"
            :title="'选择机台'">
            <div slot="content">
                <div class="parentFlexBetween">
                    <div>
                        <Select
                            class="addMachineFormWidth"
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
                            class="addMachineFormWidth"
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
                        <div class="addMachineFormWidth" ><Input v-model="machineCode" @on-change="changeMachineCode" clearable placeholder="请输入设备编码" /></div>
                        <div class="addMachineFormWidth" ><Input v-model="machineName" @on-change="changeMachineName" clearable placeholder="请输入设备名称" /></div>
                    </div>
                </div>
                <Table border ref="selection" size="small" @on-select="selectMachine" @on-select-cancel="selectCancelMachine" @on-selection-change="selectAllMachine" :row-class-name="rowClassName" :columns="machineColumns" :data="machineList" height="400"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
export default {
    name: 'addMachines',
    components: {
        modal
    },
    props: {
        addMachinesShow: {
            type: Boolean,
            default: false
        },
        processId: {
            type: String
        },
        workshopId: {
            type: String
        },
        selectedMachineList: {
            type: Array
        }
    },
    data () {
        return {
            isShow: false,
            addMachinesLoading: false,
            machineCode: '',
            machineName: '',
            machineProcess: '',
            machineColumns: [
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
                    title: '设备机型',
                    key: 'modelName',
                    sortable: true
                }
            ],
            machineList: [],
            allSelectedMachines: [],
            allMachineListData: [],
            startMachineCode: '',
            endMachineCode: '',
            startMachineCodeLoading: false,
            endMachineCodeLoading: false,
            startMachineData: [],
            endMachineData: []
        };
    },
    methods: {
        // 开始机台，远程搜索
        remoteMethodStartMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.startMachineCodeLoading = true;
                setTimeout(() => {
                    _this.startMachineCodeLoading = false;
                    const list = _this.machineList.map(item => {
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
        // 结束机台，远程搜索
        remoteMethodEndMachine (query) {
            const _this = this;
            if (query !== '') {
                _this.endMachineCodeLoading = true;
                setTimeout(() => {
                    _this.endMachineCodeLoading = false;
                    const list = _this.machineList.map(item => {
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
        // 已被选机器
        rowClassName (row, index) {
            if (row.color === true) {
                return 'tableSelectedColor';
            } else {
                return '';
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
            for (let i of this.allMachineListData) {
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
        // 改变机器编码筛选
        changeMachineCode () {
            this.filterMachine();
        },
        // 改变机器名称筛选
        changeMachineName () {
            this.filterMachine();
        },
        // 改变工序筛选
        changeMachineProcess () {
            this.filterMachine();
        },
        // 通过机器编码.机器名称,工序筛选
        filterMachine () {
            let machineCode = new RegExp(this.machineCode, 'i');
            let machineName = new RegExp(this.machineName, 'i');
            let machineProcess = new RegExp(this.machineProcess, 'i');
            let SelectC = [];
            let SelectN = [];
            let SelectP = [];
            for (let i of this.allMachineListData) {
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

            this.allSelectedMachines = this.allMachineListData.filter(item => item._checked === true);
            for (let select of this.allSelectedMachines) {
                if (this.machineList.map(x => x.id).includes(select.id)) {
                    this.machineList.find(x => x.id === select.id)._checked = true;
                }
            }
            this.machineList = SelectP;
        },
        selectMachine (val) {
            for (let v of val) {
                this.allMachineListData.find(x => x.id === v.id)._checked = true;
            }
        },
        selectCancelMachine (val, row) {
            this.allMachineListData.find(x => x.id === row.id)._checked = false;
        },
        selectAllMachine (val) {
            if (val.length === this.machineList.length) {
                for (let v of val) {
                    this.allMachineListData.find(x => x.id === v.id)._checked = true;
                }
            } else if (val.length === this.machineList.filter(x => x._disabled === true).length) {
                for (let v of this.machineList) {
                    this.allMachineListData.find(x => x.id === v.id)._checked = false;
                }
            } else {
                return false;
            }
        },
        addMachinesCancel () {
            this.allMachineListData = [];
            this.$emit('cancel');
            this.isShow = false;
        },
        addMachinesSubmit () {
            let selectedMachineList = this.allMachineListData.filter(item => item._checked === true && item._disabled === false);
            if (selectedMachineList.length === 0) {
                this.$Message.warning('请选择机台');
                return false;
            }
            this.$emit('submit', selectedMachineList);
            this.isShow = false;
        }
    },
    mounted () {
    },
    watch: {
        addMachinesShow (val) {
            const _this = this;
            this.machineCode='';
            this.machineName='';
            this.startMachineCode = '';
            this.endMachineCode = '';
            if (val) {
                this.isShow = val;
                let params = {
                    // auditState: 3,
                    // enableState: 1,
                    processId: this.processId,
                    workshopId: this.workshopId
                };
                // this.$api.machine.getMachineList(params).then(res => {
                this.$call('machine/listByType', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        _this.allMachineListData = [];
                        _this.allMachineListData = content.res.map(item => {
                            if (_this.selectedMachineList.map(x => x.machineId).includes(item.id)) {
                                item._checked = _this.selectedMachineList.find(x => x.machineId === item.id)._checked;
                                item._disabled = _this.selectedMachineList.find(x => x.machineId === item.id)._disabled;
                            } else {
                                item._checked = false;
                                item._disabled = false;
                            }
                            return item;
                        });
                        _this.machineList = _this.allMachineListData;
                    }
                });
            }
        }
    }
};
</script>
<style scoped>
</style>

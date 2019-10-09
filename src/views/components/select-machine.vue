<template>
    <div>
        <div class="select-product-search">
            <Select
                ref="setQuery"
                class="select-product-select"
                v-model="selectMachineId"
                filterable
                clearable
                remote
                @on-change="changeQueryMachine"
                :remote-method="remoteMethod"
                :loading="machineLoading">
                <Option v-for="(option, index) in curMachineList" :value="option.id" :key="index">{{option.machineCode}}</Option>
            </Select>
            <!--<Button @click="searchProductVal" class="select-product-icon-search" icon="ios-search"></Button>-->
            <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
            :isShow="selectMachineShow"
            :loading="selectMachineLoading"
            :width="800"
            :title="'选择产品'"
            @cancel="selectMachineCancel"
            @submit="selectMachineSubmit"
        >
            <div slot="content">
                <div class="endFlex marginBottom">
                    <Select clearable class="formWidth" @on-change="changeProcess" v-model="curProcessId" placeholder="请选择工序">
                        <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <div class="addMachineFormWidth marginButtonLeft" ><Input v-model="machineCode" @on-change="changeMachineCode" clearable placeholder="请输入设备编码" /></div>
                    <div class="addMachineFormWidth marginButtonLeft" ><Input v-model="machineName" @on-change="changeMachineName" clearable placeholder="请输入设备名称" /></div>
                </div>
                <Table highlight-row border :data="machineList" @on-row-dblclick="dbSelectMachine" @on-row-click="selectMachine" :columns="machineColumns" :height="500" size="small"></Table>
            </div>
        </modal>
    </div>
</template>
<script>
import modal from '../public/modal';
export default {
    name: 'select-machine',
    components: {
        modal
    },
    props: {
        machineWorkshopId: {
            type: Number
        },
        processList: {
            type: Array
        },
        isEditMachineCode: {
            type: String
        }
    },
    data () {
        return {
            machineList: [],
            machineColumns: [
                {
                    title: '设备编码',
                    key: 'machineCode',
                    sortable: true
                },
                {
                    title: '设备名称',
                    key: 'machineName',
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
            machineLoading: false,
            selectMachineId: '',
            curMachineList: [],
            selectMachineShow: false,
            selectMachineLoading: false,
            machineCode: '',
            machineName: '',
            curProcessId: '',
            curMachineOpenId: ''
        };
    },
    methods: {
        // 远程搜索
        remoteMethod (query) {
            const _this = this;
            if (query !== '') {
                this.machineLoading = true;
                setTimeout(() => {
                    _this.machineLoading = false;
                    const list = _this.machineList;
                    _this.curMachineList = list.filter(item => item.machineCode.toLowerCase().includes(query.toLowerCase()));
                }, 200);
            } else {
                _this.curMachineList = [];
            }
        },
        changeQueryMachine (val) {
            if (val === '' || val === undefined) {
                this.$emit('selectMachine', []);
            } else {
                this.curMachineOpenId = val;
                this.selectMachineSubmit();
            }
        },
        selectMachineCancel () {
            this.selectMachineShow = false;
        },
        // 改变工序
        changeProcess () {
            this.getMachineWorkshop();
        },
        // 填写机台编码
        changeMachineCode () {
            this.selectMachineList();
        },
        // 填写机台名称
        changeMachineName () {
            this.selectMachineList();
        },
        // 筛选出机台
        selectMachineList () {
            let machineCode = new RegExp(this.machineCode, 'i');
            let machineName = new RegExp(this.machineName, 'i');
            // let curProcessId = new RegExp(this.curProcessId, 'i');
            let SelectC = [];
            let SelectN = [];
            // let SelectP = [];
            for (let i of this.allMachineList) {
                if (machineCode.test(i.machineCode)) {
                    SelectC.push(i);
                }
            }
            for (let i of SelectC) {
                if (machineName.test(i.machineName)) {
                    SelectN.push(i);
                }
            }
            // for (let i of SelectN) {
            //     if (curProcessId.test(i.processId)) {
            //         SelectP.push(i);
            //     }
            // }
            this.machineList = SelectN;
        },
        // 确认
        selectMachineSubmit () {
            this.$call('prd.notice.machine.detail', {id: this.curMachineOpenId}).then((res) => {
            // this.$api.machineOpen.getMachineOpenDetail({id: this.curMachineOpenId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    this.$refs.setQuery.setQuery(content.res.machineCode + '');
                    // this.selectMachineId = content.res.machineId;
                    this.$emit('selectMachine', content.res);
                }
            });
            this.selectMachineShow = false;
        },
        // 点击图标
        searchProductVal () {
            this.selectMachineShow = true;
        },
        // 双击
        dbSelectMachine (val, index) {
            this.curMachineOpenId = val.id;
            this.selectMachineSubmit();
        },
        // 单机
        selectMachine (val, index) {
            this.curMachineOpenId = val.id;
        },
        // 获取数据
        getMachineWorkshop () {
            let params = {
                processId: this.curProcessId,
                workshopId: this.machineWorkshopId
            };
            this.$call('prd.notice.machine.list2', params).then(res => {
            // this.$api.machineOpen.getMachineOpenList(params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.allMachineList = content.res;
                    this.machineList = content.res;
                    this.selectMachineList();
                }
            });
        }
    },
    mounted () {
        this.getMachineWorkshop();
    },
    watch: {
        machineWorkshopId (newData, oldData) {
            if (newData === '' || newData === null || newData === undefined) {
                return false;
            }
            this.$refs.setQuery.clearSingleSelect();
            this.machineWorkshopId = newData;
            this.machineCode = '';
            this.machineName = '';
            this.curProcessId = '';
            this.getMachineWorkshop();
        },
        isEditMachineCode (newData, oldData) {
            if (newData && newData !== 'true') {
                this.$refs.setQuery.setQuery(newData);
            } else {
                this.$refs.setQuery.clearSingleSelect();
            }
        }
    }
};
</script>
<style scoped>
    .select-product-select{
        padding-right: 32px;
    }
    .select-product-search{
        width: 100%;
        position: relative;
        top: 0;
        left: 0
    }
    .select-product-icon-search{
        font-size: 14px;
        text-align: center;
        position: absolute;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        width: 34px;
        right: 0;
        top: 1px;
        border: 1px solid #dcdee2;
        border-left: none;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
</style>

<template>
    <div class="select-product">
        <div class="select-product-search">
            <Select
                ref="setQuery"
                class="select-product-select"
                placeholder="填写机台编码或名称"
                v-model="selectMachineCodeName"
                filterable
                clearable
                remote
                @on-change="changeMachine"
                :remote-method="remoteMethod"
                :loading="loading">
                <Option v-for="(option, index) in curMachineList" :value="option.codeName" :key="index">{{option.codeName}}</Option>
            </Select>
            <Icon @click="searchMachineVal" class="select-product-icon-search" type="ios-search" />
        </div>
        <modal
            :isShow="selectMachineShow"
            :loading="selectMachineLoading"
            :width="800"
            :title="'选择机台'"
            @cancel="selectProductCancel"
            @submit="selectMachineSubmit"
        >
            <div slot="content">
                <div class="endFlex marginBottom">
                    <Select clearable class="formWidth" @on-change="changeProcess" v-model="curProcessId" placeholder="请选择工序">
                        <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <div class="addMachineFormWidth marginButtonLeft" ><Input v-model="machineCode" @on-change="changeMachineNameCode" clearable placeholder="请输入设备编码" /></div>
                    <div class="addMachineFormWidth marginButtonLeft" ><Input v-model="machineName" @on-change="changeMachineNameCode" clearable placeholder="请输入设备名称" /></div>
                </div>
                <Table :highlight-row="true" @on-row-dblclick="dbClickSelectMachine" @on-row-click="clickRowMachine" class="marginBottom" size="small" :columns="selectMachineColumns" :data="selectMachineData" :height="420" border :loading="selectMachineLoading"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
    import {page} from '../../../libs/tools';
    import modal from '../../public/modal';
    export default {
        name: 'xw-select-machine-quality',
        components: {
            modal
        },
        props: {
            selectMachineCode: {
                // type: String
            },
            machineWorkshopId: {
                type: Number
            },
        },
        data () {
            return {
                value1: [],
                selectProductSize: page().pageSize,
                selectProductPageOpts: page().pageOpts,
                loading: false,
                selectMachineCodeName: '',
                curMachineList: [],
                processList: [],
                curProcessId: '',
                machineCode: '',
                machineName: '',
                codeName: '',
                selectMachineColumns: [
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
                    },
                    {
                        title: '在纺产品',
                        key: 'productName',
                        sortable: true
                    },
                    {
                        title: '生产通知单号',
                        key: 'prdNoticeCode',
                        sortable: true
                    }
                ],
                selectMachineData: [],
                selectMachineShow: false,
                selectMachineLoading: false,
                selectProductIndex: 1,
                selectProductTotal: 0,
                curMachineCodeName: '',
                curMachineRow: {},
                curCategoryId: '',
                middleSelectList: []
            };
        },
        methods: {
            remoteMethod (query) {
                const _this = this;
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        _this.loading = false;
                        const list = _this.selectMachineData;
                        _this.curMachineList = list.filter(item => item.codeName.toLowerCase().includes(query.toLowerCase()));
                    }, 200);
                } else {
                    _this.curMachineList = [];
                }
            },
            changeMachine (val) {
                if (!val) {
                    this.selectMachineCodeName = '';
                    this.$emit('selectMachineVal', {});
                    return false;
                } else {
                    this.selectMachineCodeName = val;
                    let value = this.selectMachineData.find(x => x.codeName === this.selectMachineCodeName);
                    this.sendMachineDetail(value.id)
                }
            },
            async searchMachineVal () {
                this.machineCode = '';
                this.machineName = '';
                this.curProcessId = '';
                await this.getMachineList();
                this.selectMachineShow = true;
            },
            // 改变工序
            async changeProcess () {
                await this.getMachineList();
                await this.selectMachineList();
            },
            // 填写机台编码
            changeMachineNameCode () {
                this.selectMachineList();
            },
            // 筛选出机台
            selectMachineList () {
                let machineCode = new RegExp(this.machineCode, 'i');
                let machineName = new RegExp(this.machineName, 'i');
                let SelectC = [];
                let SelectN = [];
                for (let i of this.middleSelectList) {
                    if (machineCode.test(i.machineCode)) {
                        SelectC.push(i);
                    }
                }
                for (let i of SelectC) {
                    if (machineName.test(i.machineName)) {
                        SelectN.push(i);
                    }
                }
                this.selectMachineData = SelectN;
            },
            dbClickSelectMachine (val, index) {
                // this.isdbClick = true;
                this.curMachineCodeName = val.codeName;
                this.selectMachineCodeName = val.codeName;
                //
                this.sendMachineDetail(this.curMachineRow.id)
            },
            clickRowMachine (val) {
                this.curMachineRow = val;
            },
            selectMachineSubmit () {
                if (!this.curMachineRow.id) {
                    this.$Message.warning('请选择机台');
                    return false;
                } else {
                    this.selectMachineCodeName = this.curMachineRow.codeName;
                    this.sendMachineDetail(this.curMachineRow.id)
                    // this.isdbClick = false;
                    this.selectMachineShow = false;
                    this.selectMachineLoading = false;
                    this.curMachineRow = {};
                    //
                    this.curMachineList = this.middleSelectList;
                    this.machineCode = '';
                    this.machineName = '';
                    this.curProcessId = '';
                }
            },

            selectProductCancel () {
                this.machineCode = '';
                this.machineName = '';
                this.curProcessId = '';
                //
                // this.isdbClick = false;
                this.curMachineList = this.middleSelectList;
                this.selectMachineShow = false;
                this.selectMachineLoading = false;
                this.curMachineRow = {};
            },
            // 确认
            sendMachineDetail (val) {
                this.$call('prd.notice.machine.detail', {id: val}).then((res) => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.$emit('selectMachineVal', content.res);
                    }
                });
                this.selectMachineShow = false;
            },
            // 获取工序
            getProcessList () {
                this.$api.process.getSearchProcessList().then(res => {
                    this.processList = res;
                });
            },
            async getMachineList () {
                let params = {
                    auditState: 3,
                    enableState: 1,
                    processId: this.curProcessId,
                    workshopId: this.machineWorkshopId
                };
                await this.$call('prd.notice.machine.list2', params).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        this.selectMachineData = content.res.map(x => {
                            x.codeName = x.machineName + ' (' + x.machineCode + ')';
                            return x;
                        });
                        this.middleSelectList = this.selectMachineData;
                        this.curMachineList = this.middleSelectList;
                    }
                });
            },
        },
        mounted () {
            // 获取所有的已经开台的机台
            this.getMachineList();
            // 获取所有的工序
            this.getProcessList();
            // 获取物料分类
        },
        watch: {
            selectMachineCode (newData, oldData) {
                if (newData === null || newData === undefined || newData === '' || typeof newData === "number") {
                    this.selectMachineCodeName = '';
                    this.$emit('selectMachineVal', {});
                } else {
                    this.selectMachineCodeName = newData;
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
        font-size: 12px;
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

<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择设备"
                :mask-closable="false"
                :width="800"
                @on-visible-change="selectMachineModalStateChangeEvent"
        >
            <div style="display: flex;justify-content: space-between;">
                <div>
                    <Button type="success" :loading="selectMachineConfirmLoading" @click="selectMachineModalConfirmEvent">确认选择</Button>
                    <!--<Button @click="selectMachineModalCancelEvent">取消</Button>-->
                </div>
                <div>
                    <Select clearable v-model="processValue" @on-change="selectMachineModalProcessEvent" class="formWidth" placeholder="请选择工序">
                        <Option v-for="item in selectMachineModalProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input v-model="machineCode" type="text" class="formWidth" placeholder="请输入设备编号"/>
                    <Button @click="selectMachineModalSearchEvent" icon="ios-search" type="primary">搜索</Button>
                </div>
            </div>
            <div class="tableMargin">
                <Table :loading="selectMachineTableLoading" :height="500" @on-row-click="singleClickRowEvent" @on-row-dblclick="doubleClickRowEvent" :row-class-name="rowClassNameEvent" highlight-row size="small" border :columns="selectMachineTableHeader" :data="selectMachineTableData"></Table>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import publiceJs from '../../../../libs/common';

    export default {
        props: {
            selectMachineConfirmLoading: {
                type: Boolean,
                default: false
            },
            selectMachineTableLoading: {
                type: Boolean,
                default: false
            },
            selectMachineModalState: {
                type: Boolean,
                default: false
            },
            selectMachineTableData: {
                type: Array
            },
            selectMachineModalProcessList: {
                type: Array
            }
        },
        data () {
            return {
                showModal: false,
                processValue: null,
                machineCode: '',
                checkMachineObj: null,
                checkMachineObjIndex: null,
                selectMachineTableHeader: [
                    {
                        title: '设备编号',
                        key: 'code',
                        sortable: true
                    },
                    {
                        title: '设备名称',
                        key: 'name',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '车间',
                        key: 'workshopName',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '工序',
                        key: 'processName',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '当前品种',
                        key: 'productName',
                        align: 'center',
                        sortable: true
                    },
                    {
                        title: '当前批号',
                        key: 'batchCode',
                        align: 'center',
                        sortable: true
                    }
                ]
            };
        },
        methods: {
            // 行样式
            rowClassNameEvent (row, index) {
                if (row.singleClickStyle !== undefined) {
                    if (row.singleClickStyle === true) {
                        return 'demo-table-info-row';
                    } else {
                        return 'demo-table-no-row';
                    };
                };
            },
            // 确认选择事件
            selectMachineModalConfirmEvent () {
                this.$emit('selectMachineModalConfirmEvent', this.checkMachineObj, this.checkMachineObjIndex);
            },
            // 取消事件
            selectMachineModalCancelEvent () {
                this.$emit('selectMachineModalCancelEvent');
            },
            // 单击事件
            singleClickRowEvent (e, index) {
                this.checkMachineObjIndex = index;
                this.checkMachineObj = e;
            },
            // 双击事件
            doubleClickRowEvent (e, index) {
                this.checkMachineObjIndex = index;
                this.checkMachineObj = e;
                this.$emit('selectMachineModalConfirmEvent', this.checkMachineObj, this.checkMachineObjIndex);
            },
            selectMachineModalStateChangeEvent (e) {
                if (e === false) {
                    this.processValue = null;
                    this.machineCode = '';
                    this.checkMachineObjIndex = null;
                    this.checkMachineObj = null;
                };
                this.$emit('selectMachineModalStateChangeEvent', e);
            },
            selectMachineModalProcessEvent (e) {
                let id = null;
                e === undefined ? id = null : id = e;
                this.$emit('selectMachineModalProcessEvent', id);
            },
            selectMachineModalSearchEvent () {
                this.machineCode = publiceJs.clearSpace(this.machineCode);
                this.$emit('selectMachineModalSearchEvent', {processId: this.processValue, machineCode: this.machineCode});
            }
        },
        watch: {
            selectMachineModalState (newData, oldData) {
                this.showModal = newData;
            }
        }
    };
</script>

<style>
    .ivu-table .demo-table-info-row td{
        background-color: #EBF7FF;
        color: red;
    }
    .ivu-table .demo-table-no-row td{
        color: #515a6e;
    }
</style>

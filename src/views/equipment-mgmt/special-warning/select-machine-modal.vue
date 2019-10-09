<template>
    <div>
        <Modal
                v-model="showModal"
                title="选择设备"
                :mask-closable="false"
                :width="900"
                @on-visible-change="selectMachineModalStateChangeEvent"
        >
            <div class="flex-between-center">
                <Button type="success" :loading="selectMachineConfirmLoading" @click="selectMachineModalConfirmEvent">确认选择</Button>
                <div>
                    <Select
                            clearable
                            v-model="processId"
                            class="formWidth"
                            placeholder="请选择工序">
                        <Option v-for="item in selectMachineModalProcessList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input v-model="machineCode" type="text" class="formWidth" placeholder="请输入设备编号"/>
                    <Button @click="selectMachineModalSearchEvent" icon="ios-search" type="primary">搜索</Button>
                </div>
            </div>
            <div class="margin-top-10">
                <Table
                        :loading="selectMachineTableLoading"
                        :height="650"
                        @on-row-click="singleClickRowEvent"
                        @on-row-dblclick="doubleClickRowEvent"
                        :row-class-name="rowClassNameEvent"
                        highlight-row size="small"
                        border
                        :columns="tableHeader"
                        :data="tableData"></Table>
            </div>
            <div slot="footer"></div>
            <div class="flex-right margin-top-10">
                <Page show-total :page-size="pageSize" :total="pageTotal" size="small" @on-change="getSelectPageCodeEvent"></Page>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { clearSpace, setPage } from '../../../libs/common';

    export default {
        props: {
            workshopId: {
                type: Number
            },
            selectMachineConfirmLoading: {
                type: Boolean,
                default: false
            },
            selectMachineModalState: {
                type: Boolean,
                default: false
            },
            selectMachineModalProcessList: {
                type: Array
            }
        },
        data () {
            return {
                tableData: [],
                showModal: false,
                processId: null,
                machineCode: '',
                checkRow: null,
                tableHeader: [
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
                ],
                pageSize: setPage.pageSize,
                pageTotal: 0,
                pageIndex: 1,
                selectMachineTableLoading: false
            };
        },
        methods: {
            // 获取页面
            getSelectPageCodeEvent (e) {
                this.pageIndex = e;
                this.getMachineListRequest();
            },
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
                this.$emit('on-confirm', this.checkRow);
            },
            // 单击事件
            singleClickRowEvent (e, index) {
                this.checkRow = e;
            },
            // 双击事件
            doubleClickRowEvent (e, index) {
                this.checkRow = e;
                this.$emit('on-confirm', this.checkRow);
            },
            selectMachineModalStateChangeEvent (e) {
                if (e === false) {
                    this.processId = null;
                    this.machineCode = '';
                    this.checkRow = null;
                };
                this.$emit('on-visible-change', e);
            },
            selectMachineModalSearchEvent () {
                this.selectMachineTableLoading = true;
                this.machineCode ? this.machineCode = clearSpace(this.machineCode) : false;
                this.pageIndex = 1;
                this.pageTotal = 1;
                this.getMachineListRequest();
            },
            // 获取设备列表数据（生产主机）
            getMachineListRequest () {
                this.$call('machine.list', {
                    auditState: 3,
                    enableState: 1,
                    pageIndex: this.pageIndex,
                    pageSize: setPage.pageSize,
                    name: this.machineCode,
                    processId: this.processId,
                    typeId: 26
                }).then(res => {
                    if (res.data.status === 200) {
                        this.tableData = res.data.res;
                        this.selectMachineTableLoading = false;
                        this.pageTotal = res.data.count;
                    };
                });
            }
        },
        watch: {
            selectMachineModalState (newData, oldData) {
                this.showModal = newData;
                if (newData) {
                    this.selectMachineTableLoading = true;
                    this.getMachineListRequest();
                };
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

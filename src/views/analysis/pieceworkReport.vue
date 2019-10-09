<template>
    <Card>
        <Row id="selectedHeight" class="parentFlex">
            <Col>
                <span class="formSpanStyle">开始日期：</span>
                <DatePicker class="formEachStyle" @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="beginTime"></DatePicker>
                <span class="formSpanStyle">结束日期：</span>
                <DatePicker class="formEachStyle"@on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="endTime"></DatePicker>
                <span class="formSpanStyle">选择车间：</span>
                <Select class="formEachStyle textLeft" v-model="currentWorkshopId">
                    <Option v-for="item in machineReportWorkshopList"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span class="formSpanStyle">设备机台：</span>
                <Input class="formEachStyle" v-model="machineReportMachineCode" placeholder="请输入设备机台" />
                <span class="formSpanStyle">工序：</span>
                <Select class="formEachStyle textLeft" v-model="machineReportProcessId">
                    <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <span class="formSpanStyle">品种：</span>
                <Input class="formEachStyle" v-model="machineReportProductCode" placeholder="请输入品种" />
                <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
            </Col>
        </Row>
        <Table border ref="selection" :height="tableHeight" size="small" @on-row-dblclick="handleUserMachine" :loading="pieceworkUserLoading" :columns="pieceworkOutputColumns" :data="pieceworkOutputData"></Table>
    </Card>
</template>

<script>
export default {
    name: 'pieceworkReport',
    data () {
        return {
            beginTime: '',
            endTime: '',
            processList: [],
            pieceworkOutputColumns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    key: 'userName',
                    align: 'center',
                    minWidth: 80,
                    title: '人员'
                },
                {
                    key: 'shiftName',
                    align: 'center',
                    minWidth: 80,
                    title: '班次'
                },
                {
                    key: 'groupName',
                    align: 'center',
                    minWidth: 90,
                    title: '班组'
                },
                // {
                //     key: 'shiftName',
                //     align: 'center',
                //     minWidth: 120,
                //     title: '班次'
                // },
                {
                    key: 'postName',
                    align: 'center',
                    minWidth: 100,
                    title: '岗位'
                },
                {
                    key: 'productName',
                    align: 'center',
                    minWidth: 80,
                    title: '产品'
                },
                {
                    key: 'computeOutput',
                    align: 'center',
                    minWidth: 116,
                    title: '计件产量(系统)'
                },
                // {
                //     key: 'computeoutputkg',
                //     align: 'center',
                //     minWidth: 116,
                //     title: '计件产量(公斤)'
                // },
                {
                    key: 'output',
                    align: 'center',
                    minWidth: 150,
                    title: '计件产量'
                    // render: (h, params) => {
                    //     const vm = this;
                    //     return h('inputNumber', {
                    //         props: {
                    //             value: params.row.output,
                    //             min: 0,
                    //             max: 999999999
                    //         },
                    //         style: {
                    //             width: '100px'
                    //         },
                    //         on: {
                    //             'on-change': (event) => {
                    //                 params.row.output = event;
                    //                 vm.pieceworkOutputData[params.index] = params.row;
                    //             }
                    //         }
                    //     });
                    // }
                },
                {
                    key: 'outputKg',
                    align: 'center',
                    minWidth: 150,
                    title: '计件产量(公斤)'
                }
            ],
            machineReportMachineCode: '',
            machineReportProcessId: '',
            machineReportProductCode: '',
            exportLoading: false,
            currentWorkshopId: '',
            pieceworkOutputData: [],
            machineReportWorkshopList: [],
            pieceworkUserLoading: false,
            tableHeight: ''
        };
    },
    methods: {
        changeStartDate () {},
        changeEndDate () {},
        searchResult () {},
        exportExcel () {},
        handleUserMachine () {}
    },
    mounted () {
        this.$http.get('user/output/list?workshopoutputid=225').then(res => {
            let content = res.data;
            if (content.status === 200) {
                this.pieceworkOutputData = content.res;
            }
        });
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 160;
        })
        window.onresize = () => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.tableHeight = document.documentElement.clientHeight - H - 160;
        };
    }
};
</script>

<style scoped>

</style>

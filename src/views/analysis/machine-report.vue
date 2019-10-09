<template>
    <div>
        <Card>
            <Row class="parentFlex">
                <Col>
                    <span class="formSpanStyle">开始日期：</span>
                    <DatePicker class="formEachStyle" @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                    <span class="formSpanStyle">结束日期：</span>
                    <DatePicker class="formEachStyle"@on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                    <span class="formSpanStyle">选择车间：</span>
                    <Select class="formEachStyle textLeft" v-model="currentWorkshopId">
                        <Option v-for="item in machineReportWorkshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <span class="formSpanStyle">设备机台：</span>
                    <Input class="formEachStyle" v-model="machineReportMachineCode" placeholder="请输入设备机台" />
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" v-model="machineReportProcessId">
                        <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">品种：</span>
                    <Input class="formEachStyle" v-model="machineReportProductCode" placeholder="请输入品种" />
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    <Button class="marginBottom" :loading="exportLoading" type="success" @click="exportExcel">导出</Button>
                </Col>
            </Row>
            <Row id="tableHeight" class="marginBottom">
                <Col>
                    <Table :height="machineReportHeight" ref="machineReportExcel" :loading="machineReportLoading" size="small" border :columns="machineReportColumns" :data="machineReportData"></Table>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import publicJs from '../../libs/common';
import excel from '../../libs/excel.js';
import {curDate} from "../../libs/tools";
import { reportList, getReportList } from './report-list';
export default {
    name: 'machineReport',
    data () {
        return {
            machineReportLoading: false,
            machineReportWorkshopList: [],
            currentWorkshopId: '',
            machineReportMachineCode: '',
            machineReportProcessId: '',
            machineReportProductCode: '',
            curShift: '',
            processList: [],
            shiftList: [],
            exportLoading: false,
            machineReportColumns: [
                {
                    title: '日期',
                    key: 'belongDate',
                    minWidth: 120,
                    align: 'left'
                },
                {
                    title: '车间',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
                    key: 'workshopName'
                },
                {
                    title: '工序',
                    align: 'center',
                    sortable: true,
                    minWidth: 90,
                    key: 'processName'
                },
                {
                    title: '设备编号',
                    align: 'center',
                    sortable: true,
                    minWidth: 120,
                    key: 'machineCode'
                },
                {
                    title: '品种',
                    align: 'center',
                    minWidth: 90,
                    sortable: true,
                    key: 'productName'
                },
                {
                    title: '产量(米)',
                    minWidth: 120,
                    align: 'center',
                    sortable: true,
                    key: 'machineMetres'
                },
                {
                    title: '产量(公斤)',
                    minWidth: 120,
                    align: 'center',
                    sortable: true,
                    key: 'machineOutputQty'
                }
            ],
            machineReportData: [
                {
                    workshopName: '',
                    productName: '',
                    processName: '',
                    machineCode: '',
                    machineMetres: null,
                    machineOutputQty: null
                }
            ],
            middleList: [],
            machineReportExcel: {},
            machineReportTotal: 6,
            machineReportPageIndex: 1,
            machineReportHeight: document.documentElement.clientHeight - 260,
            machineReportPageUp: publicJs.pageUp,
            machineReportPageSize: publicJs.pageSize,
            machineReportPageOpts: publicJs.pageOpts,
            dateFrom: curDate(),
            dateTo: curDate()
        };
    },
    methods: {
        // 判断是否有默认车间
        getUserWorkshop () {
            this.$api.dept.getUserWorkshop().then(res => {
                this.currentWorkshopId = res.curWorkshopId;
                this.machineReportWorkshopList = res.workshopList;
                this.machineReportData = this.getReportList();
                // console.log(this.machineReportData);
                // debugger
                this.middleList = this.machineReportData;
                this.getTotal();
            });
        },
        getTotal () {
            // let openNames = 0;
            let machineMetres = 0;
            let machineOutputQty = 0;
            // let valOutput = 0;
            this.machineReportData.map(x => {
                // openNames += x.openNames;
                machineMetres += x.machineMetres;
                machineOutputQty += x.machineOutputQty;
                // valOutput += x.valOutput;
            });
            return this.machineReportData.push({
                machineOutputQty: machineOutputQty.toFixed(2),
                machineMetres: machineMetres.toFixed(2)
            });
        },
        getProcess () {
            const _this = this;
            publicJs.processLevel().then(res => {
                _this.processList = res;
            });
        },
        getShift () {
            this.$fetch('shift/list').then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    let data = [];
                    for (let i of content.res) {
                        if (data.map(x => x.typeId) === undefined || !data.map(x => x.typeId).includes(i.typeId)) {
                            let obj = {
                                typeId: i.typeId,
                                typeName: i.typeName,
                                dataShift: []
                            };
                            for (let j of content.res) {
                                if (obj.typeId === j.typeId) {
                                    obj.dataShift.push({
                                        id: j.id,
                                        name: j.name
                                    });
                                }
                            }
                            data.push(obj);
                        }
                    }
                    this.shiftList = data;
                }
            });
        },
        changeStartDate (val) {
            this.dateFrom = val;
        },
        changeEndDate (val) {
            this.dateTo = val;
        },
        searchResult () {
            console.log(this.middleList);
            this.machineReportData = [];
            this.machineReportData = this.middleList.filter(x => x.date > this.dateFrom && x.date < this.dateTo && x.workshopId === this.currentWorkshopId);
        },
        exportExcel () {
            if (this.machineReportData.length) {
                this.exportLoading = true;
                const params = {
                    // title: ['一级分类', '二级分类', '三级分类'],
                    title: this.machineReportColumns.map(x => x.title),
                    // key: ['category1', 'category2', 'category3'],
                    key: this.machineReportColumns.map(x => x.key),
                    data: this.machineReportData,
                    autoWidth: true,
                    filename: '机台产量报表'
                };
                excel.export_array_to_excel(params);
                this.exportLoading = false;
            } else {
                this.$Message.info('表格数据不能为空！');
            }
        },
        getReportList () {
            let data = [];
            let List = getReportList();
            for (let i of List) {
                let obj = data.find(x => x.machineName === i.machineName && x.processName === i.processName && x.productName === i.productName);
                if (obj) {
                    obj.machineMetres = Math.floor((obj.metres + i.metres) * 100) / 100;
                    obj.machineOutputQty = Math.floor((obj.outputQty + i.outputQty) * 100) / 100;
                    // obj.metres = (obj.metres + i.metres).toFixed(2);
                    // obj.outputQty = (obj.outputQty + i.outputQty).toFixed(2);
                } else {
                    data.push(i);
                }
            }
            return data;
        }
    },
    computed: {
    },
    mounted () {
        this.getProcess();
        this.getShift();
        this.getUserWorkshop();
        window.onresize = () => {
            let tableHeight = document.getElementById('tableHeight').offsetTop;
            this.machineReportHeight = document.documentElement.clientHeight - tableHeight - 185;
            // let het = publicJs.compClientHeight(120);
            // this.orderTraceCardHeight = {height: het + 'px'};
        };
    },
    activated () {
    },
    created () {
        // 车间列表
        // const _this = this;
        // this.$fetch('dept/workshops').then((res) => {
        //     let content = res.data;
        //     if (content.status === 200) {
        //         // this.dateFrom = this.Today;
        //         // this.dateTo = this.Today;
        //         _this.machineReportWorkshopList = content.res;
        //     }
        // });
    }
};
</script>

<style scoped>
</style>

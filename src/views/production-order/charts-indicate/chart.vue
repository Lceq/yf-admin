<template>
    <div id="charts" class="mainColour main-charts">
        <Row class="parentFlexBetween">
            <Row class="leftFlex">
                <Col class="querySubBarMargin flexAlignCenter">
                    <div class="queryTitle">车间：</div>
                    <Select clearable v-model="workshop" class="selectBackground" placeholder="请选择车间">
                        <Option v-for="item in workshopList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <!--<Col class="querySubBarMargin flexAlignCenter">
                    <div class="queryTitle">工序：</div>
                    <Select clearable v-model="process" class="selectBackground" placeholder="请选择工序">
                        <Option v-for="item in processList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>
                <Col class="querySubBarMargin flexAlignCenter">
                    <div class="queryTitle">班组：</div>
                    <Select clearable v-model="groups" class="selectBackground" placeholder="请选择班组">
                        <Option v-for="item in groupsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Col>-->
                <Col class="querySubBarMargin flexAlignCenter">
                    <div class="queryTitle">日期：</div>
                    <DatePicker v-model="dateValue" @on-change="getDateEvent" type="daterange" split-panels placeholder="请选择日期范围" style="width: 200px"></DatePicker>
                </Col>
                <Col class="querySubBarMargin flexAlignCenter">
                    <Button type="primary">刷新</Button>
                </Col>
            </Row>
            <Row>
                <Col> <Button type="primary" shape="circle" @click="expandCharts" :icon="!value ? 'ios-expand' : 'ios-exit'"></Button></Col>
            </Row>
        </Row>
        <Row :gutter="16">
            <draggable>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="moduleTitleBorder">
                            机台产量
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <machine-chart></machine-chart>
                        </div>
                    </div>
                </Col>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="moduleTitleBorder">
                            班组产量
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <groups-output-chart></groups-output-chart>
                        </div>
                    </div>
                </Col>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="moduleTitleBorder">
                            品种产量
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <product-output-chart></product-output-chart>
                        </div>
                    </div>
                </Col>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="moduleTitleBorder">
                            人员编制
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <employee-chart></employee-chart>
                        </div>
                    </div>
                </Col>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="moduleTitleBorder">
                            品种结构
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <product-structure-chart></product-structure-chart>
                        </div>
                    </div>
                </Col>
                <Col :md="24" :lg="8" class="margin-bottom-10">
                    <div class="mainColour">
                        <p class="realTimeBar flexBetween">
                            <span class="queryTitle">机台实时数据</span>
                            <Select v-model="realTimeData" style="width:200px" placeholder="请选择品种" @on-change="getRealTimeChangeEvent">
                                <Option v-for="item in realTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                        <div :style="{height: chartHeight + 'px', 'paddingTop': '10px'}">
                            <speed-chart :xAxisData="xAxisData" :spindleSpeed="spindleSpeed" :spindleLength="spindleLength" :currentLength="currentLength"></speed-chart>
                        </div>
                    </div>
                </Col>
            </draggable>
        </Row>
    </div>
</template>

<script>
    import echarts from 'echarts';
    import machineChart from './components/machineChart.vue';
    import groupsOutputChart from './components/groupsChart.vue';
    import productOutputChart from './components/productChart.vue';
    import speedChart from './components/speedChart.vue';
    import productStructureChart from './components/productStructureChart.vue';
    import employeeChart from './components/employeeChart.vue';
    import draggable from 'vuedraggable';
    export default{
        components: {
            machineChart, groupsOutputChart, productOutputChart, speedChart, productStructureChart, employeeChart, draggable
        },
        data () {
            return {
                chartHeight: 0,
                dateValue: ['2018-11-05', '2018-11-18'],
                xAxisData: ['XS001', 'XS002', 'XS003', 'XS004', 'XS005', 'XS006', 'XS007', 'XS008', 'XS009', 'XS010', 'XS011', 'XS012', 'XS013', 'XS014', 'XS015', 'XS016', 'XS017', 'XS018', 'XS019', 'XS020', 'XS0021', 'XS012', 'XS023', 'XS024', 'XS025', 'XS026', 'XS027'],
                realTimeData: 'Ring 30S',
                realTimeList: [
                    {
                        value: 'Ring 30S',
                        label: 'Ring 30S'
                    },
                    {
                        value: 'Siro 30S',
                        label: 'Siro 30S'
                    },
                    {
                        value: 'Siro 40S',
                        label: 'Siro 40S'
                    }
                ],
                workshop: '一车间',
                process: '清花',
                groups: '前纺甲班',
                workshopList: [
                    {
                        value: '一车间',
                        label: '一车间'
                    },
                    {
                        value: '二车间',
                        label: '二车间'
                    },
                    {
                        value: '三车间',
                        label: '三车间'
                    }
                ],
                processList: [
                    {
                        value: '清花',
                        label: '清花'
                    },
                    {
                        value: '梳棉',
                        label: '梳棉'
                    },
                    {
                        value: '并条',
                        label: '并条'
                    }
                ],
                groupsList: [
                    {
                        value: '前纺甲班',
                        label: '前纺甲班'
                    },
                    {
                        value: '前纺乙班',
                        label: '前纺乙班'
                    },
                    {
                        value: '后纺甲班',
                        label: '后纺甲班'
                    },
                    {
                        value: '后纺乙班',
                        label: '后纺乙班'
                    }
                ],
                spindleSpeed: [],
                spindleLength: [],
                currentLength: [],
                chartsPositionWidth: '',
                chartsPositionHeight: '',
                value: false,
                chartsPost: {},
                chartsPosition: '',
                fullFullCreen: false
            };
        },
        methods: {
            expandCharts () {
                // this.$router.push({ name: 'charts-top' });
                let main = document.getElementById('charts');
                if (this.value) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.fullFullCreen = false;
                    this.chartHeight = parseInt((document.documentElement.clientHeight - 100 - 220) / 2);
                } else {
                    if (main.requestFullscreen) {
                        main.requestFullscreen();
                    } else if (main.mozRequestFullScreen) {
                        main.mozRequestFullScreen();
                    } else if (main.webkitRequestFullScreen) {
                        main.webkitRequestFullScreen();
                    } else if (main.msRequestFullscreen) {
                        main.msRequestFullscreen();
                    }
                    this.fullFullCreen = true;
                    this.chartHeight = parseInt((document.documentElement.clientHeight - 100) / 2);
                }
                this.value = !this.value;
            },
            getDateEvent (e) {
                // console.log(e)
            },
            randomNum (min, max) {
                switch (arguments.length) {
                    case 1:
                        return Math.floor(Math.random() * minNum + 1);
                        break;
                    case 2:
                        return Math.floor(Math.random() * (max - min + 1) + min);
                        break;
                    default:
                        return 0;
                        break;
                }
            },
            getRealTimeChangeEvent (e) {
                let arr = [];
                if (e === 'Ring 30S') {
                    arr = ['XS001', 'XS002', 'XS003', 'XS004', 'XS005', 'XS006', 'XS007', 'XS008', 'XS009', 'XS010', 'XS011', 'XS012', 'XS013', 'XS014', 'XS015', 'XS016', 'XS017', 'XS018', 'XS019', 'XS020', 'XS0021', 'XS012', 'XS023', 'XS024', 'XS025', 'XS026', 'XS027'];
                    this.xAxisData = arr;
                    this.spindleSpeed = [14000, 15500, 12500, 13478, 7145, 14268, 13375, 12644, 15500, 15500, 15215, 14069, 15000, 15413, 15357, 15000, 13607, 13500, 12500, 0, 15000, 13029, 15500, 12927, 13983, 14500, 13434];
                    this.spindleLength = [3300, 3300, 3300, 3300, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3400, 3300, 3300, 3300, 3300, 3300, 3300, 3200, 3200, 3300];
                    this.currentLength = [2604, 2184, 115, 617, 25, 585, 382, 129, 934, 1455, 2128, 523, 2561, 792, 1471, 2189, 596, 2037, 344, 0, 997, 219, 1748, 186, 706, 2456, 382];
                    /* this.spindleSpeed = []
                    this.spindleLength = []
                    this.currentLength = []
                    for(var i = 0;i < 27;i++){
                        this.spindleSpeed.push(this.randomNum(0,20000))
                        this.spindleLength.push(this.randomNum(0,5000))
                        this.currentLength.push(this.randomNum(0,5000))
                    } */
                } else if (e === 'Siro 30S') {
                    arr = ['XS028', 'XS029', 'XS030', 'XS031', 'XS032', 'XS033', 'XS034', 'XS035', 'XS036', 'XS037', 'XS038', 'XS039', 'XS040'];
                    this.xAxisData = arr;
                    this.spindleSpeed = [15000, 13618, 15000, 13719, 0, 12500, 13799, 13101, 0, 13000, 0, 13243, 9873];
                    this.spindleLength = [3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300];
                    this.currentLength = [2093, 506, 2349, 903, 0, 223, 2352, 1433, 0, 1724, 2454, 407, 40];

                    /* this.spindleSpeed = []
                    this.spindleLength = []
                    this.currentLength = []
                    for(var i = 0;i < 12;i++){
                        this.spindleSpeed.push(this.randomNum(0,20000))
                        this.spindleLength.push(this.randomNum(0,5000))
                        this.currentLength.push(this.randomNum(0,5000))
                    } */
                } else if (e === 'Siro 40S') {
                    arr = ['XS041', 'XS042', 'XS043', 'XS044', 'XS045', 'XS046', 'XS047', 'XS048', 'XS049', 'XS050'];
                    this.xAxisData = arr;
                    this.spindleSpeed = [14605, 14527, 11669, 13865, 13002, 14535, 14625, 14572, 12500, 12000];
                    this.spindleLength = [4200, 4200, 4200, 4200, 4200, 4200, 4200, 4200, 4200, 4200];
                    this.currentLength = [1632, 1272, 51, 825, 208, 1085, 1855, 1535, 534, 261];
                    /* this.spindleSpeed = []
                    this.spindleLength = []
                    this.currentLength = []
                    for(var i = 0;i < 9;i++){
                        this.spindleSpeed.push(this.randomNum(0,20000))
                        this.spindleLength.push(this.randomNum(0,5000))
                        this.currentLength.push(this.randomNum(0,5000))
                    } */
                }
            }
        },
        mounted () {
            this.spindleSpeed = [14000, 15500, 12500, 13478, 7145, 14268, 13375, 12644, 15500, 15500, 15215, 14069, 15000, 15413, 15357, 15000, 13607, 13500, 12500, 0, 15000, 13029, 15500, 12927, 13983, 14500, 13434];
            this.spindleLength = [3300, 3300, 3300, 3300, 3200, 3200, 3200, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3300, 3400, 3300, 3300, 3300, 3300, 3300, 3300, 3200, 3200, 3300];
            this.currentLength = [2604, 2184, 115, 617, 25, 585, 382, 129, 934, 1455, 2128, 523, 2561, 792, 1471, 2189, 596, 2037, 344, 0, 997, 219, 1748, 186, 706, 2456, 382];
            this.chartHeight = parseInt((document.documentElement.clientHeight - 100 - 220) / 2);
            window.onresize = () => {
                if (this.fullFullCreen) {
                    return false;
                }
                this.chartHeight = parseInt((document.documentElement.clientHeight - 100 - 220) / 2);
            };
        }
    };
</script>

<style>
    .realTimeBar{
        padding:8px 14px 9px 14px;
        border-bottom: solid 1px #515970;
    }
    .rowMargin{
        margin-top:10px;
    }
    .selectBackground{
        background:#2f343d;
        color: #fff;
        width:200px;
    }
    .selectBackground .ivu-select-selection{
        background:#2f343d;
        color: #fff;
        border:solid 1px #50596f;
    }
    .realTimeBar .ivu-select-selection{
        background:#2f343d;
        color: #fff;
        border:solid 1px #50596f;
    }
    .querySubBarMargin .ivu-input-icon-normal+.ivu-input {
        padding-right: 32px;
        background:#2f343d;
        border:solid 1px #50596f;
        color:#fff;
    }
    .main-charts{
        padding: 16px 16px 0 16px
    }
    .mainColour{
        background: #22272d;
        border:solid 1px #515970;
        border-radius:4px;
    }
    .queryTitle{
        color:#04eaff;
    }
    .moduleTitleBorder{
        border-bottom: solid 1px #515970;
        padding:14px 20px 14px 20px;
        color:#0bc6d9;
    }
    .chartsHeight{
        height:330px;
        padding-top:10px;
    }
    .querySubBarMargin{
        margin-right: 10px;
        margin-bottom:10px;
    }
    .flexAlignCenter{
        display: flex;
        align-items: center;
    }
    .chartsPost{
        position: absolute;
        left: 0;
        top: 0;
    }
</style>

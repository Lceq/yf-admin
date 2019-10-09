<template>
    <div>
        <Card :style="'height:' + cardHeight + 'px'">
            <Row class="marginButtonBottom">
                <Col>
                    <Button icon="md-add" @click="addReportSheet" type="success">新增</Button>
                    <Button icon="ios-create" v-show="auditState === 1" @click="editReport" type="primary">编辑</Button>
                    <Button icon="md-checkmark" @click="exitReport" type="primary">返回列表页</Button>
                    <Button icon="ios-undo" v-show="auditState === 2" @click="cancelReportSheet" type="warning">撤销提交</Button>
                    <Button icon="md-done-all" v-show="auditState === 2" @click="approveReportSheet"  type="primary">审核</Button>
                    <Button icon="md-refresh" v-show="auditState === 3" @click="unapproveReportSheet" type="warning">撤销审核</Button>
                    <Button icon="md-close" v-show="auditState === 3" @click="closeReportSheet" type="error">关闭</Button>
                    <Button icon="md-swap" v-show="auditState === 4" @click="uncloseReportSheet" type="warning">撤销关闭</Button>
                </Col>
            </Row>
            <Row id="selectedHeight">
                <Col>
                    <Form ref="formAddValidate" :model="formAddValidate" :rules="ruleAddValidate" :label-width="100">
                        <FormItem label="报工单号：" class="displayInlineBlock" prop="code">
                            <p class="modal-readonly formWidth">{{ formAddValidate.code }}</p>
                        </FormItem>
                        <FormItem label="报工日期：" class="displayInlineBlock" prop="reportDate">
                            <p class="modal-readonly formWidth">{{ formAddValidate.reportDate }}</p>
                        </FormItem>
                        <FormItem label="生产车间：" class="displayInlineBlock" prop="workshopName">
                            <p class="modal-readonly formWidth">{{ formAddValidate.workshopName }}</p>
                        </FormItem>
                        <FormItem label="报工班次：" class="displayInlineBlock" prop="shiftName">
                            <p class="modal-readonly formWidth">{{ formAddValidate.shiftName }}</p>
                        </FormItem>
                        <br>
                        <FormItem label="工序：" class="displayInlineBlock" prop="processName">
                            <p class="modal-readonly formWidth">{{ formAddValidate.processName }}</p>
                        </FormItem>
                        <!--<FormItem label="损耗率%：" class="displayInlineBlock"  prop="wasteRate">-->
                            <!--<p class="modal-readonly formWidth">{{ formAddValidate.wasteRate }}</p>-->
                        <!--</FormItem>-->
                        <!--<FormItem label="班次总产量：" class="displayInlineBlock" prop="shiftOutput">-->
                            <!--<p class="modal-readonly formWidth">{{ formAddValidate.shiftOutput }}</p>-->
                        <!--</FormItem>-->
                        <FormItem label="单据状态：" class="displayInlineBlock" prop="shiftOutput">
                            <p class="modal-readonly formWidth">{{ auditStateMean }}</p>
                        </FormItem>
                    </Form>
                    <!--<Row>-->
                        <!--<Col>-->
                            <!--<other-message-->
                                <!--:createName="createName"-->
                                <!--:createTime="createTime"-->
                                <!--:updateName="updateName"-->
                                <!--:updateTime="updateTime"-->
                                <!--:submitName="submitName"-->
                                <!--:submitTime="submitTime"-->
                            <!--&gt;-->
                            <!--</other-message>-->
                        <!--</Col>-->
                    <!--</Row>-->
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table border ref="selection" size="small" :height="reportModalHeight" class="marginBottom" :columns="reportModalColumns" :data="reportModalData"></Table>
                    <p class="totalPclass"><span class="totalClass">合计</span><span class="totalClass">{{differenceValue}}</span><span  class="totalClass">{{output}}</span><span  class="totalClass">{{outputKg}}</span></p>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import iView from 'iview';
import excel from '../../../libs/excel.js';
import AboutTime from '../../public/AboutTime';
import publicJs from '../../../libs/common';
import otherMessage from '../../components/otherMessage';
export default {
    components: {
        AboutTime,
        otherMessage
    },
    data () {
        return {
            differenceValue: '',
            output: '',
            outputKg: '',
            cardHeight: '',
            isSave: false,
            isSubmit: false,
            auditState: '',
            auditStateMean: '',
            reportSheetOutputKg: 0,
            inSertDisabled: false,
            outputList: [],
            defaultOutput: '',
            defaultWasteRate: '',
            saveDisabled: true,
            buttonAuditState: true,
            buttonUnAuditState: true,
            reportModalHeight: '',
            curReportId: '',
            shiftList: [],
            processList: [],
            workShopId: '',
            WorkShopList: [],
            ShiftList: [],
            formAddValidate: {
                code: '1',
                reportDate: '2018-8-16',
                workshopId: '1',
                shiftId: '2',
                processId: '3',
                wasteRate: 4,
                shiftOutput: '5'
            },
            ruleAddValidate: {
                reportDate: [
                    { required: true, trigger: 'blur' }
                ],
                workshopName: [
                    { required: true, trigger: 'blur' }
                ],
                shiftName: [
                    { required: true, trigger: 'blur' }
                ],
                processName: [
                    { required: true, trigger: 'blur' }
                ]
            },
            reportModalColumns: [
                {
                    title: '机台号',
                    align: 'left',
                    sortable: true,
                    fixed: 'left',
                    minWidth: 80,
                    key: 'machineCode'
                },
                {
                    title: '当班开台',
                    align: 'left',
                    minWidth: 90,
                    sortable: true,
                    key: 'currentMachineOpen'
                },
                {
                    title: '当班了机',
                    align: 'left',
                    minWidth: 90,
                    sortable: true,
                    key: 'currentMachineEnd'
                },
                {
                    title: '生产通知单号',
                    align: 'left',
                    minWidth: 120,
                    sortable: true,
                    key: 'prdNoticeCode'
                },
                {
                    title: '产品',
                    align: 'left',
                    minWidth: 100,
                    sortable: true,
                    key: 'productName'
                },
                {
                    title: '批号',
                    align: 'left',
                    minWidth: 90,
                    sortable: true,
                    key: 'batchCode'
                },
                {
                    title: '班组',
                    align: 'left',
                    sortable: true,
                    minWidth: 90,
                    key: 'groupName'
                },
                {
                    title: '运转效率%',
                    align: 'right',
                    sortable: true,
                    minWidth: 100,
                    key: 'efficiencyPercent'
                },
                {
                    title: '锭数',
                    align: 'right',
                    sortable: true,
                    minWidth: 65,
                    key: 'openSpinCount'
                },
                {
                    title: '开始能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'startElectricEnergy'
                },
                {
                    title: '结束能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'endElectricEnergy'
                },
                {
                    title: '当班能耗表数',
                    align: 'center',
                    width: 120,
                    sortable: true,
                    key: 'shiftElectricEnergy'
                },
                {
                    title: '开始产量表数',
                    align: 'right',
                    sortable: true,
                    minWidth: 120,
                    key: 'startOutput'
                },
                {
                    title: '结束产量表数',
                    align: 'right',
                    minWidth: 120,
                    sortable: true,
                    key: 'endOutput'
                },
                {
                    title: '当班产量表量',
                    align: 'right',
                    fixed: 'right',
                    width: 120,
                    sortable: true,
                    key: 'differenceValue'
                },
                {
                    title: '当班产量',
                    align: 'right',
                    width: 120,
                    fixed: 'right',
                    sortable: true,
                    key: 'shiftOutput'
                },
                {
                    title: '当班产量(KG)',
                    align: 'right',
                    width: 120,
                    fixed: 'right',
                    sortable: true,
                    key: 'shiftQty'
                }
            ],
            reportModalData: [],
            createTime: '',
            createName: '',
            updateTime: '',
            updateName: '',
            submitName: '',
            submitTime: ''
        };
    },
    methods: {
        addReportSheet () {
            this.$router.push({
                path: 'addReport'
            });
            this.$route.meta.keepAlive = false;
        },
        editReport () {
            this.$router.push({
                path: 'editReport',
                query: {
                    id: this.curReportId,
                    edit: true,
                    activated: true
                }
            });
            this.$route.meta.keepAlive = false;
        },
        exitReport () {
            this.$router.push({
                path: 'report'
            });
            this.$route.meta.keepAlive = false;
        },
        cancelReportSheet () {
            let ids = Number(this.curReportId);
            let params = [];
            params.push(ids);
            this.$call('prd.report.cancel', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.buttonAuditState = !this.buttonAuditState;
                    this.buttonUnAuditState = !this.buttonUnAuditState;
                    this.getReportOutDetail();
                    this.$Message.success('撤销成功');
                    this.saveDisabled = true;
                    this.$router.push({
                        path: 'editReport',
                        query: {
                            id: this.curReportId,
                            edit: true,
                            activated: true
                        }
                    });
                    this.$route.meta.keepAlive = false;
                }
            });
        },
        approveReportSheet () {
            let ids = Number(this.curReportId);
            let params = [];
            params.push(ids);
            this.$call('prd.report.approve', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.buttonAuditState = !this.buttonAuditState;
                    this.buttonUnAuditState = !this.buttonUnAuditState;
                    this.getReportOutDetail();
                    this.$Message.success('审核成功');
                    this.saveDisabled = true;
                }
            });
        },
        unapproveReportSheet () {
            let ids = Number(this.curReportId);
            let params = [];
            params.push(ids);
            this.$call('prd.report.unapprove', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.buttonAuditState = !this.buttonAuditState;
                    this.buttonUnAuditState = !this.buttonUnAuditState;
                    this.getReportOutDetail();
                    this.$Message.success('撤销审核成功');
                    this.saveDisabled = true;
                }
            });
        },
        closeReportSheet () {
            let ids = Number(this.curReportId);
            let params = [];
            params.push(ids);
            this.$call('prd.report.close', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.buttonAuditState = !this.buttonAuditState;
                    this.buttonUnAuditState = !this.buttonUnAuditState;
                    this.getReportOutDetail();
                    this.$Message.success('关闭成功');
                    this.saveDisabled = true;
                }
            });
        },
        uncloseReportSheet () {
            let ids = Number(this.curReportId);
            let params = [];
            params.push(ids);
            this.$call('prd.report.unclose', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    this.buttonAuditState = !this.buttonAuditState;
                    this.buttonUnAuditState = !this.buttonUnAuditState;
                    this.getReportOutDetail();
                    this.$Message.success('撤销关闭成功');
                    this.saveDisabled = true;
                }
            });
        },
        handleBeforeUpload (file) {
            const fileExt = file.name.split('.').pop().toLocaleLowerCase();
            if (fileExt === 'xlsx' || fileExt === 'xls') {
                this.readFile(file);
                this.file = file;
            } else {
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc: '文件：' + file.name + '不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。'
                });
            }
            return false;
        },
        // 导入数据
        insertExcel () {
            this.initUpload();
        },
        initUpload () {
            this.file = null;
            this.tableData = [];
        },
        // 读取文件
        readFile (file) {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadstart = e => {
                iView.LoadingBar.start();
            };
            reader.onprogress = e => {
                this.progressPercent = Math.round(e.loaded / e.total * 100);
            };
            reader.onerror = e => {
                this.$Message.error('文件读取出错');
            };
            reader.onload = e => {
                const _this = this;
                this.$Message.info('文件读取成功');
                const data = e.target.result;
                const {header, results} = excel.read(data, 'array');
                const tableTitle = header.map(item => {
                    return {title: item, key: item};
                });
                this.tableData = results;
                for (let data of this.reportModalData) {
                    let AllData = this.tableData.filter(x => x.machineCode.trim() === data.machineCode);
                    for (let i of AllData) {
                        if (data.noticeSheetCode === i.noticeSheetCode) {
                            data.startOutput = i.startOutput === undefined ? 0 : parseFloat(i.startOutput);
                            data.endOutput = i.endOutput === undefined ? 0 : parseFloat(i.endOutput);
                            if (i.shiftOutput === undefined) {
                                data.shiftOutput = data.endOutput - data.startOutput;
                                data.outputKg = _this.getMetreTurnKg(data.shiftOutput, data.gramWeight, data.metres, data.spinUsed);
                            } else {
                                data.shiftOutput = parseFloat(i.shiftOutput);
                                data.outputKg = _this.getMetreTurnKg(parseFloat(i.shiftOutput), data.gramWeight, data.metres, data.spinUsed);
                            }
                        }
                    }
                }
                if (this.auditStateChange === 1) {
                    this.saveDisabled = false;
                    this.buttonAuditState = true;
                }
                if (this.auditStateChange !== 1) {
                    this.saveDisabled = true;
                }
                this.getAllOutput();
                iView.LoadingBar.finish();
            };
        },
        getReportOutDetail () {
            const _this = this;
            this.$call('prd.report.detail', {id: this.curReportId}).then((res) => {
                let content = res.data;
                if (content.status === 200) {
                    let data = content.res;
                    _this.formAddValidate.code = data.code;
                    _this.formAddValidate.reportDate = data.belongDate;
                    _this.formAddValidate.workshopId = data.workshopId;
                    _this.formAddValidate.workshopName = data.workshopName;
                    _this.formAddValidate.shiftId = data.shiftId;
                    _this.formAddValidate.shiftName = data.shiftName;
                    _this.formAddValidate.processId = data.processId;
                    _this.formAddValidate.processName = data.processName;
                    _this.formAddValidate.wasteRate = data.wasteRate === null ? null : data.wasteRate;
                    _this.defaultWasteRate = data.wasteRate;
                    _this.formAddValidate.shiftOutput = data.shiftOutput;
                    _this.formAddValidate.reportSheetOutputKg = data.shiftQty;
                    _this.auditState = data.auditState;
                    _this.auditStateMean = data.auditState === 1 ? '待提交' : (data.auditState === 2 ? '待审核' : (data.auditState === 3 ? '已审核' : (data.auditState === 4 ? '已关闭' : '')));
                    _this.defaultOutput = data.shiftOutput;
                    _this.createName = data.createName;
                    _this.createTime = data.createTime;
                    _this.updateName = data.updateName;
                    _this.updateTime = data.updateTime;
                    _this.submitName = data.submitName;
                    _this.submitTime = data.submitTime;
                    if (data.auditState === 1) {
                        _this.auditStateChange = 1;
                        this.buttonAuditState = false;
                        this.buttonUnAuditState = true;
                        this.saveDisabled = true;
                    } else if (data.auditState === 3) {
                        _this.auditStateChange = 3;
                        this.buttonAuditState = true;
                        this.buttonUnAuditState = false;
                        this.saveDisabled = true;
                    } else {
                        _this.auditStateChange = 4;
                        this.saveDisabled = true;
                        this.buttonAuditState = true;
                        this.buttonUnAuditState = true;
                    }
                    this.reportModalData = content.res.prdReportMachineList.map(item => {
                        item.currentMachineOpen = item.isDutyOpen === true ? '是' : '否';
                        item.currentMachineEnd = item.isDutyEnd === true ? '是' : '否';
                        return item;
                    });
                    this.getAllOutput();
                    this.$store.dispatch({
                        type: 'hideLoading'
                    });
                }
            });
        },
        // 计算班次总产量
        getAllOutput () {
            let num = 0;
            let differenceValue = 0;
            let output = 0;
            let outputKg = 0;
            for (let k of this.reportModalData) {
                num += parseInt(k.shiftOutput);
                output += parseInt(k.shiftOutput);
                differenceValue += parseInt(k.differenceValue);
                outputKg += Number(k.shiftQty);
            }
            this.formAddValidate.shiftOutput = num;
            this.outputKg = outputKg.toFixed(2);
            this.differenceValue = differenceValue;
            this.output = output;
        }
    },
    mounted () {
        this.$nextTick(() => {
            let H = document.getElementById('selectedHeight').clientHeight;
            this.cardHeight = document.documentElement.clientHeight - 122;
            this.reportModalHeight = document.documentElement.clientHeight - H - 235;
        });
        // this.$nextTick(() => {
        //     let tableHeight = document.getElementById('tableHeight').offsetTop;
        //     this.tableHeight = document.documentElement.clientHeight - tableHeight - 160;
        // })
        window.onresize = () => {
            this.$nextTick(() => {
                let H = document.getElementById('selectedHeight').clientHeight;
                this.cardHeight = document.documentElement.clientHeight - 122;
                this.reportModalHeight = document.documentElement.clientHeight - H - 235;
            });
        };
    },
    activated () {
        this.curReportId = this.$route.query.id;
        this.$nextTick(() => {
            this.getReportOutDetail();
        });
    },
    created () {
        this.$store.dispatch({
            type: 'showLoading'
        });
        this.curReportId = this.$route.query.id;
        this.$nextTick(() => {
            this.getReportOutDetail();
        });
    }
};
</script>

<style scoped>
.displayInlineBlock{
    display: inline-block;
    line-height: 32px;
    margin-bottom: 0;
    vertical-align: middle;
}
.formWidth{
    vertical-align: middle;
    margin-bottom: 10px;
}
.marginButtonBottom{
    margin-bottom: 20px;
}
.dispalyTime{
    justify-content: flex-start;
}
.otherNameStyle{
    width: 150px;
}
.totalPclass{
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
}
.totalClass{
    width: 120px;
    display: inline-block;
    text-align: center;
    /*border-right: 1px solid red;*/
}
</style>

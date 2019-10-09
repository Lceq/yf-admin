<template>
    <div>
        <modal
            :title="title"
            :isShow="show"
            :width="800"
            @submit="submit"
            @cancel="cancel"
        >
            <div slot="content">
                <Form :label-width="98" :model="openMachineDetail" :rules="openMachineValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem  label="开台时间：" prop="name" class="formItemMargin">
                                <DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="openMachineDetail.curTime"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="班次日期：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.startBelongDate }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="开台班次：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.startShiftName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台机台：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.machineName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产工序：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.workshopName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台产品：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.productName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="批号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.batchCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="排产数量：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.productionQty }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="生产通知单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.prdNoticeCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产订单号：" prop="code" class="formItemMargin">
                                <Poptip trigger="hover" placement="bottom">
                                    <span  class="modal-readonly whiteSpace">{{ openMachineDetail.prdOrderCodes }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{openMachineDetail.prdOrderCodes}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="订单产品：" prop="code" class="formItemMargin">
                                <Poptip trigger="hover" placement="bottom">
                                    <span class="modal-readonly whiteSpace">{{ openMachineDetail.orderProductNames }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{openMachineDetail.orderProductNames}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="已使用锭号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineDetail.usedSpin }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="原开始锭号：" prop="code" class="formItemMargin">
                                <!--1-->
                                <!--<InputNumber v-show="!isDetail" @on-change="changeSpin" :min="1" :max="openMachineDetail.spinCount" style="width: 100%;" v-model="openMachineDetail.startSpinNumber"></InputNumber>-->
                                <p class="modal-readonly">{{ openMachineDetail.startSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="原结束锭号：" prop="code" class="formItemMargin">
                                <!---->
                                <!--<InputNumber v-show="!isDetail" @on-change="changeSpin" :min="1" :max="openMachineDetail.spinCount"  style="width: 100%;" v-model="openMachineDetail.endSpinNumber"></InputNumber>-->
                                <p class="modal-readonly">{{ openMachineDetail.endSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="原锭数：" prop="code" class="formItemMargin">
                                <p class="readonly">{{ openMachineDetail.openSpinCount }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="新开始锭号：" prop="code" class="formItemMargin">
                                <!--1-->
                                <InputNumber @on-change="changeSpin" :min="1" :max="openMachineDetail.spinCount" style="width: 100%;" v-model="openMachineDetail.newStartSpinNumber"></InputNumber>
                                <!--<p v-show="isDetail"  class="modal-readonly">{{ openMachineDetail.startSpinNumber }}</p>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="新结束锭号：" prop="code" class="formItemMargin">
                                <!---->
                                <InputNumber @on-change="changeSpin" :min="1" :max="openMachineDetail.spinCount"  style="width: 100%;" v-model="openMachineDetail.newEndSpinNumber"></InputNumber>
                                <!--<p v-show="isDetail"  class="modal-readonly">{{ openMachineDetail.endSpinNumber }}</p>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="新锭数：" prop="code" class="formItemMargin">
                                <p class="readonly">{{ newOpenSpinCount }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台产量表数：" prop="code" class="formItemMargin">
                                <InputNumber class="formWidth" v-model="openMachineDetail.startOutput" placeholder="请输入开台产量值"></InputNumber>
                                <!--<p v-show="isDetail" class="modal-readonly">{{ openMachineDetail.startOutput }}</p>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="开台能耗表数：" prop="code" class="formItemMargin">
                                <InputNumber class="formWidth" v-model="openMachineDetail.startElectricEnergy" placeholder="请输入能耗表数"></InputNumber>
                                <!--<p v-show="isDetail" class="modal-readonly">{{ openMachineDetail.startOutput }}</p>-->
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </modal>
    </div>
</template>

<script>
import modal from '../../public/modal';
import {curDatetime} from "../../../libs/tools";
export default {
    components: {
        modal
    },
    props: {
        // show: {
        //     type: Boolean,
        //     default: false
        // },
        workshopId: {
            type: Number
        },
        openMachineDetailId: {
            type: Number
        }
    },
    data () {
        return {
            show: false,
            title: '重新开台',
            curTime: curDatetime(),
            // openMachineDetail: {},
            openMachineValidate: {},
            newOpenSpinCount: 0,
            openMachineDetail: {
                newStartSpinNumber: '',
                newEndSpinNumber: '',
                openSpinCount: '',
                curTime: '',
                startBelongDate: '',
                startScheduleId: '',
                startShiftName: ''
            }
        };
    },
    mounted () {
        // this.getScheduleTime();
    },
    watch: {
        openMachineDetailId (newData, oldData) {
            if (newData) {
                this.$call('prd.notice.machine.opening.detail4', { id: this.openMachineDetailId }).then(res => {
                    let content = res.data;
                    if (content.status === 200) {
                        // debugger
                        this.openMachineDetail = content.res;
                        this.openMachineDetail.startScheduleId = content.res.startScheduleId;
                        this.openMachineDetail.curTime = curDatetime();
                        this.openMachineDetail.newStartSpinNumber = this.openMachineDetail.startSpinNumber;
                        this.openMachineDetail.newEndSpinNumber = this.openMachineDetail.endSpinNumber;
                        this.newOpenSpinCount = this.openMachineDetail.openSpinCount;
                        this.show = true;
                    }
                });
            } else {
                this.openMachineDetail.newStartSpinNumber = '';
                this.openMachineDetail.newEndSpinNumber = '';
                this.newOpenSpinCount = '';
                this.openMachineDetail.curTime = '';
            }
        }
    },
    methods: {
        changeSpin () {
            this.newOpenSpinCount = this.openMachineDetail.newEndSpinNumber - this.openMachineDetail.newStartSpinNumber + 1;
        },
        changeTime (val) {
            this.openMachineDetail.curTime = val;
            this.getScheduleTime();
        },
        submit () {
            this.openMachineDetail.newOpenSpinCount = this.newOpenSpinCount;
            // debugger
            this.show = false;
            this.$emit('submit', this.openMachineDetail);
        },
        cancel () {
            this.$emit('cancel');
            this.show = false;
        },
        getScheduleTime () {
            const _this = this;
            let params = {
                now: this.openMachineDetail.curTime,
                workshopId: this.workshopId
            };
            this.$call('schedule.current.schedule', params).then(res => {
                let content = res.data;
                if (content.status === 200) {
                    // debugger;
                    if (content.res === null) {
                        _this.$Modal.warning({
                            title: '提示',
                            content: '该时间点尚未排班，不能进行开台'
                        });
                        _this.openMachineDetail.startBelongDate = '';
                        _this.openMachineDetail.startShiftName = '';
                        _this.openMachineDetail.startScheduleId = '';
                        return false;
                    }
                    // debugger;
                    _this.openMachineDetail.startBelongDate = content.res.belongDate;
                    _this.openMachineDetail.startShiftName = content.res.shiftName;
                    _this.openMachineDetail.startScheduleId = content.res.id;
                }
            });
        }
    },
    name: 'open-detail'
};
</script>

<style scoped>

</style>

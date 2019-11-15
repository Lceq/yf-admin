<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'开台状态'" :curTabStateId="curCompletionState" :stateList="orderStateList">
            <div slot="content">
                <div>
                    <Row class="endFlex marginBottom" id="selectedHeight">
                        <Col class="">
                            <Row class="marginBottom">
                                <Col>
                                    <span v-show="!curCompletionState" class="formSpanStyle">预计开台时间：</span>
                                    <span v-show="curCompletionState" class="formSpanStyle">实际开台时间：</span>
                                    <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" :clearable="true" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                                    <DatePicker class="formEachStyle " @on-change="changeEndTime" :clearable="true"  type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                                    <Select class="formEachStyle textLeft" v-model="workshopId" placeholder="请选择车间">
                                        <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                    <Select class="formEachStyle textLeft" v-model="processId" placeholder="请选择工序" clearable>
                                        <Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row v-if="orderSelectedShow">
                                <Col>
                                    <span class="formSpanStyle">关键词搜索：</span>
                                    <Select class="formEachStyle textLeft" v-model="listStateId">
                                        <Option v-for="(item, index) in listState" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Input clearable class="formWidth" type="text" v-model="prdOrderNoticeCodeName" placeholder="请输入编码"/>
                                    <Input clearable class="formWidth" type="text" v-model="machineNameCode" placeholder="请输入生产机台"/>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="marginBottom">
                            <a @click="orderShow" class="cycle">···</a>
                            <Button icon="ios-search" @click="searchResult" class=" verticalMiddle" type="primary">搜索</Button>
                        </Col>
                    </Row>
                </div>
                <Table class="marginBottom" :height="tableHeight" :loading="processModificationLoading" size="small" ref="selection" border :columns="openMachineColumns" :data="openMachineData"></Table>
                <Page class="textRight" show-elevator show-sizer show-total :total="pageTotal" :page-size="pageSize" :page-size-opts="pageOpts" :placement="pageUp" @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
            </div>
        </layout>
        <modal
            :isShow="openMachineShow"
            :title="openMachineTitle"
            :width="800"
            :isSubmit="!isDetail"
            :isCancel="!isDetail"
            @submit="openMachineClick"
            @cancel="openMachineCancel"
        >
            <div slot="content">
                <Form :label-width="98" :model="openMachineModal" :rules="openMachineValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem v-show="!isDetail" label="开台时间：" prop="name" class="formItemMargin">
                                <DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="curTime"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col v-show="isDetail && curCompletionState === 0" span="8">
                            <FormItem  label="预计开台时间：" prop="name" class="formItemMargin">
                                <!--<DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="openMachineModal.planDateFrom"></DatePicker>-->
                                <p class="modal-readonly">{{ openMachineModal.planDateFrom }}</p>
                            </FormItem>
                        </Col>
                        <Col  v-show="isDetail && curCompletionState === 1" span="8">
                            <FormItem  label="实际开台时间：" prop="name" class="formItemMargin">
                                <!--<DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="openMachineModal.startTime"></DatePicker>-->
                                <p class="modal-readonly">{{ openMachineModal.startTime }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="isDetail && curCompletionState === 0" span="8">
                            <FormItem v-show="isDetail && curCompletionState === 0" label="预计了机时间：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.planDateTo }}</p>
                                <!--<DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="openMachineModal.planDateTo"></DatePicker>-->
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail || curCompletionState === 1" span="8">
                            <FormItem label="班次日期：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.scheduleBelongDate }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail || curCompletionState === 1"  span="8">
                            <FormItem label="开台班次：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.scheduleShiftName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台机台：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.machineName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产工序：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.workshopName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台产品：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.productName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="批号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.batchCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="排产数量：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.productionQty }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="生产通知单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.prdNoticeCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产订单号：" prop="code" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ openMachineModal.prdOrderCode }}</p>-->
                                <Poptip trigger="hover" placement="bottom">
                                    <span  class="modal-readonly whiteSpace">{{ openMachineModal.prdOrderCode }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{openMachineModal.prdOrderCode}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="订单产品：" prop="code" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ openMachineModal.orderProductCode }}</p>-->
                                <Poptip trigger="hover" placement="bottom">
                                    <span class="modal-readonly whiteSpace">{{ openMachineModal.orderProductNames }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{openMachineModal.orderProductNames}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-show="!isDetail && curCompletionState === 0">
                        <Col>
                            <FormItem label="已使用锭号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ openMachineModal.usedSpin }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-show="!isDetail || curCompletionState === 1">
                        <Col span="8">
                            <FormItem label="开始锭号：" prop="code" class="formItemMargin">
                                <!--1-->
                                <InputNumber v-show="!isDetail" @on-change="changeSpin" :min="1" :max="openMachineModal.spinCount" style="width: 100%;" v-model="openMachineModal.startSpinNumber"></InputNumber>
                                <p v-show="isDetail"  class="modal-readonly">{{ openMachineModal.startSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="结束锭号：" prop="code" class="formItemMargin">
                                <!---->
                                <InputNumber v-show="!isDetail" @on-change="changeSpin" :min="1" :max="openMachineModal.spinCount"  style="width: 100%;" v-model="openMachineModal.endSpinNumber"></InputNumber>
                                <p v-show="isDetail"  class="modal-readonly">{{ openMachineModal.endSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="锭数：" prop="code" class="formItemMargin">
                                <!--<InputNumber class="modal-readonly" v-model="openMachineModal.endSpinNumber"></InputNumber>-->
                                <p class="readonly">{{ openMachineModal.openSpinCount }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-show="!isDetail || curCompletionState === 1">
                        <Col span="8">
                            <FormItem label="开台产量表数：" prop="code" class="formItemMargin">
                                <InputNumber v-show="!isDetail" class="formWidth" v-model="openMachineModal.startOutput" placeholder="请输入开台产量值"></InputNumber>
                                <p v-show="isDetail" class="modal-readonly">{{ openMachineModal.startOutput }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="开台能耗表数：" prop="code" class="formItemMargin">
                                <InputNumber v-show="!isDetail" class="formWidth" v-model="openMachineModal.startElectricEnergy" placeholder="请输入能耗产量"></InputNumber>
                                <p v-show="isDetail" class="modal-readonly">{{ openMachineModal.startElectricEnergy }}</p>
                            </FormItem>
                        </Col>
                        <!--<Col span="8">-->
                            <!--<FormItem label="完工数量：" prop="code" class="formItemMargin">-->
                                <!--<p class="modal-readonly">{{ openMachineModal.completionQty }}</p>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
                    </Row>
                </Form>
            </div>
        </modal>
        <open-detail
            @cancel="cancel"
            @submit="submit"
            :workshopId="workshopId"
            :openMachineDetailId="openMachineDetailId"
        ></open-detail>
        <delete-warning
            :v-model="deleteWarnShow"
            :tipMsg="deleteWarnMsg"
            :loading="deleteWarnLoading"
            @cancel="deleteWarnCancel"
            @confirm="deleteWarnConfirm"
        ></delete-warning>
    </div>
</template>

<script>
import openMachine from './open-machine';
export default {
    ...openMachine
};
</script>

<style scoped>
    .formSpanStyle{
        width: 140px !important;
        display: inline-block;
        text-align: right;
        margin-bottom: 0;
    }
    .formEachStyle{
        margin-bottom: 0;
    }
</style>

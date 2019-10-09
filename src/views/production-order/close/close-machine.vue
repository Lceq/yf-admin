<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'开台状态'" :curTabStateId="curCompletionState" :stateList="orderStateList">
            <div slot="content">
                <div>
                    <Row class="endFlex marginBottom" id="selectedHeight">
                        <Col class="">
                            <Row class="marginBottom">
                                <Col>
                                    <span v-show="!curCompletionState"  class="formSpanStyle">预计了机时间：</span>
                                    <span v-show="curCompletionState" class="formSpanStyle">实际了机时间：</span>
                                    <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                                    <DatePicker class="formEachStyle " @on-change="changeEndTime" type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                                    <Select class="formEachStyle textLeft" v-model="workshopId" placeholder="请选择车间">
                                        <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                    <Select class="formEachStyle textLeft" v-model="processId" placeholder="请选择工序">
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
                <Table class="marginBottom" :height="tableHeight" :loading="processModificationLoading" size="small" ref="selection" border :columns="openMachineColumns" :data="closeMachineData"></Table>
                <Page class="textRight" show-elevator show-sizer show-total :total="pageTotal" :page-size="pageSize" :page-size-opts="pageOpts" :placement="pageUp" @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
            </div>
        </layout>
        <modal
            :isShow="openMachineShow"
            :title="'品种了机'"
            :width="800"
            :isSubmit="!isDetail"
            :isCancel="!isDetail"
            @submit="openMachineClick"
            @cancel="openMachineCancel"
        >
            <div slot="content">
                <Form :label-width="98" :model="closeMachineModal" :rules="openMachineValidate" :show-message="false">
                    <Row>
                        <Col span="8" v-show="isDetail">
                            <FormItem label="实际开台时间：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.startTime }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="isDetail && curCompletionState === 0" span="8">
                            <FormItem label="预计了机时间：" prop="name" class="formItemMargin">
                                <!--<DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="curTime"></DatePicker>-->
                                <p class="modal-readonly">{{ closeMachineModal.planDateTo }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="isDetail && curCompletionState === 1" span="8">
                            <FormItem label="实际了机时间：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.endTime }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail" span="8">
                            <FormItem label="了机时间：" prop="name" class="formItemMargin">
                                <DatePicker format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime" type="datetime" :clearable="false" placeholder="请选择日期" :value="curTime"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail"  span="8">
                            <FormItem label="班次日期：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.scheduleBelongDate }}</p>
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail"  span="8">
                            <FormItem label="了机班次：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.scheduleShiftName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="了机机台：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.machineName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产工序：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.workshopName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="了机产品：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.productName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="批号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.batchCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="排产数量：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.productionQty }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="生产通知单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{closeMachineModal.prdNoticeCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产订单号：" prop="code" class="formItemMargin">
                                <!--<p class="modal-readonly">{{closeMachineModal.prdOrderCode }}</p>-->
                                <Poptip trigger="hover" placement="bottom">
                                    <span class="modal-readonly whiteSpace">{{ closeMachineModal.prdOrderCode }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{closeMachineModal.prdOrderCode}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="订单产品：" prop="code" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ closeMachineModal.orderProductCode }}</p>-->
                                <Poptip trigger="hover" placement="bottom">
                                    <span class="modal-readonly whiteSpace">{{ closeMachineModal.orderProductNames }}</span>
                                    <div slot="content">
                                        <p class="codeWidth">{{closeMachineModal.orderProductNames}}</p>
                                    </div>
                                </Poptip>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开始锭号：" prop="code" class="formItemMargin">
                                <!--1-->
                                <p class="modal-readonly">{{ closeMachineModal.startSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="结束锭号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.endSpinNumber }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="锭数：" prop="code" class="formItemMargin">
                                <p class="readonly">{{ closeMachineModal.openSpinCount }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台产量表数：" prop="code" class="formItemMargin">
                                <!--<Input type="text" class="formModalWidth"  v-model=closeMachineModal.startOutput" placeholder="请输入开台产量值"/>-->
                                <p class="modal-readonly">{{ closeMachineModal.startOutput }}</p>
<!--                                <InputNumber v-show="!isDetail" class="formWidth" v-model="closeMachineModal.startOutput" placeholder="请输入开台产量值"></InputNumber>-->
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail || (isDetail && curCompletionState === 1)" span="8">
                            <FormItem label="了机产量表数：" prop="code" class="formItemMargin">
                                <!--<Input type="text" class="formModalWidth"  v-model=closeMachineModal.startOutput" placeholder="请输入开台产量值"/>-->
                                <p v-show="isDetail" class="modal-readonly">{{ closeMachineModal.endOutput }}</p>
                                <InputNumber v-show="!isDetail" class="formWidth" v-model="closeMachineModal.endOutput" placeholder="请输入开台产量值"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="完工数量：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ closeMachineModal.completionQty }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="开台能耗表数：" prop="code" class="formItemMargin">
                                <!--<Input type="text" class="formModalWidth"  v-model=closeMachineModal.startOutput" placeholder="请输入开台产量值"/>-->
                                <p class="modal-readonly">{{ closeMachineModal.startElectricEnergy }}</p>
                                <!--                                <InputNumber v-show="!isDetail" class="formWidth" v-model="closeMachineModal.startOutput" placeholder="请输入开台产量值"></InputNumber>-->
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail || (isDetail && curCompletionState === 1)" span="8">
                            <FormItem label="了机能耗表数：" prop="code" class="formItemMargin">
                                <!--<Input type="text" class="formModalWidth"  v-model=closeMachineModal.startOutput" placeholder="请输入开台产量值"/>-->
                                <p v-show="isDetail" class="modal-readonly">{{ closeMachineModal.endElectricEnergy }}</p>
                                <InputNumber v-show="!isDetail" @on-change="changeEndElectricEnergy" class="formWidth" v-model="closeMachineModal.endElectricEnergy" placeholder="请输入能耗值"></InputNumber>
                            </FormItem>
                        </Col>
                        <Col v-show="!isDetail || (isDetail && curCompletionState === 1)" span="8">
                            <FormItem label="生产耗电量：" prop="code" class="formItemMargin">
                                <!--<Input type="text" class="formModalWidth"  v-model=closeMachineModal.startOutput" placeholder="请输入开台产量值"/>-->
                                <p class="modal-readonly">{{ closeMachineModal.ElectricEnergy }}</p>
<!--                                <InputNumber v-show="!isDetail" class="formWidth" v-model="closeMachineModal.ElectricEnergy" placeholder="请输入能耗值"></InputNumber>-->
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </modal>
        <close-detail
            @cancel="cancel"
            @submit="submit"
            :workshopId="workshopId"
            :openMachineDetailId="openMachineDetailId"
        ></close-detail>
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
import closeMachine from './close-machine';
export default {
    ...closeMachine
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

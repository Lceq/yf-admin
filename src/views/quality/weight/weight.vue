<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewQmWeight" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            提交
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="submitQmWeight">提交</DropdownItem>
                            <DropdownItem @click.native="cancelQmWeight">撤销</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="ios-trash" @click="deleteQmWeight">删除</Button>
                </Col>
                <Col>
                    <Row class="flexBetween">
                        <Col class="columnFlex">
                            <Row>
                                <Col class="marginBottom">
                                   <span class="formSpanWidth">检验日期：</span>
                                   <DatePicker class="formWidth" type="date" :value="dateFrom" @on-change="changeDateFrom" placeholder="开始时间"></DatePicker>
                                   <DatePicker class="formWidth" type="date" :value="dateTo" @on-change="changeDateTo" placeholder="结束时间"></DatePicker>
                                   <Select class="formWidth" v-model="curWorkshopId" placeholder="请选择车间">
                                       <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                   </Select>
                                   <Select clearable class="formWidth" v-model="curQmWeightProcessId" placeholder="请选择工序">
                                       <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                   </Select>
                                </Col>
                            </Row>
                            <Row v-if="isShowWeight">
                                <Col>
                                    <span class="formSpanWidth"></span>
                                    <Select clearable class="formWidth marginBottom" v-model="curCheckoutTypeId" placeholder="请选择检验类型">
                                        <Option v-for="item in checkoutTypeList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Select clearable class="formWidth marginBottom" v-model="curSubmissionTypeId" placeholder="请选择数据状态">
                                        <Option v-for="item in submissionTypeList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Input class="formWidth marginBottom" type="text" v-model="productCodeName" placeholder="请输入产品编码或名称"/>
                                    <Input class="formWidth marginBottom" type="text" v-model="machineCodeName" placeholder="请输入机台编码或名称"/>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <div class="leftFlex">
                                <a @click="changeWeightShow" class="marginBottom marginButtonLeft cycle">···</a>
                                <Button icon="ios-search" class="marginBottom marginButtonLeft" type="primary" @click="searchQmWeight">搜索</Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectWeight" :height="tableHeight" ref="selection" size="small" border :columns="weightColumns" :data="weightData"></Table>
                    <Page class="textRight" :total="weightTotal" show-elevator :page-size-opts="weightPageOpts" show-total :page-size="weightPageSize" @on-change="changePageIndexWeight" show-sizer @on-page-size-change="changePageSizeWeight"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="weightShow"
            :saveLoading="weightSaveLoading"
            :saveSubmitLoading="weightSaveSubmitLoading"
            :title="weightTitle"
            :isSubmit="false"
            :width="800"
            :isCancel="false"
            :isSave="isShowSaveOrSubmit"
            :isSaveSubmit="isShowSaveOrSubmit"
            @save="weightSave"
            @cancel="weightCancel"
            @saveSubmit="weightSaveSubmit">
                <div slot="content">
                    <Form :label-width="100" ref="weightFormValidate" :model="weightFormValidate" :rules="weightRuleValidate" :show-message="false">
                        <Row>
                            <Col span="8">
                                <FormItem label="检验日期：" prop="code" class="formItemMargin">
                                    <p v-if="isEdit" class="modal-readonly">{{ testDate }}</p>
                                    <DatePicker v-else type="date" @on-change="changeTestDate" :clearable="false" :value="testDate" placeholder="选择日期"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="实验员：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.inspectorName }}</p>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="测试类型：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.testTypeMean }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="车间：" prop="code" class="formItemMargin">
                                    <p v-if="isEdit" class="modal-readonly">{{ weightFormValidate.workshopName }}</p>
                                    <Select v-else v-model="weightFormValidate.workshopId" @on-change="changeWorkshop" placeholder="请选择检验类型">
                                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="检验机台：" prop="code" class="formItemMargin">
                                    <p v-if="isEdit" class="modal-readonly">{{ weightFormValidate.machineCode }}</p>
                                    <!--<Input suffix="ios-search" v-model="weightFormValidate.machineId" placeholder="请选择检验机台" />-->
                                    <select-machine-quality
                                        v-else
                                        :machineWorkshopId="weightFormValidate.workshopId"
                                        @selectMachineVal="selectMachine"
                                        :selectMachineCode="selectMachineCode"
                                    >
                                    </select-machine-quality>
                                    <!--<select-machine-->
                                        <!--v-else-->
                                        <!--:processList="processList"-->
                                        <!--:machineWorkshopId="weightFormValidate.workshopId"-->
                                        <!--@selectMachine="confirmMachine"-->
                                        <!--:isEditMachineCode="isEditMachineCode"-->
                                    <!--&gt;</select-machine>-->
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="工序：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.processName }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="产品编码：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.productCode }}</p>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="产品名称：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.productName }}</p>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="批号：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.batchCode }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="标准克重：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.gramWeight }}</p>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="标准米长：" prop="code" class="formItemMargin">
                                    <p class="modal-readonly">{{ weightFormValidate.meters }}</p>
                                </FormItem>
                            </Col>
                            <!--<Col span="8">-->
                                <!--<FormItem label="号数：" prop="code" class="formItemMargin">-->
                                    <!--<p class="modal-readonly">{{ weightFormValidate.numbers }}</p>-->
                                <!--</FormItem>-->
                            <!--</Col>-->
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="公定回潮率%：" prop="code" class="formItemMargin">
                                    <InputNumber class="inputNumberWidth" @on-change="changeMoistureRegin" :max="100" :min="0" v-model="weightFormValidate.moistureRegain"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="克重偏差±%：" prop="code" class="formItemMargin">
                                    <InputNumber @on-change="testStandard" class="inputNumberWidth" :max="100" :min="0" v-model="weightFormValidate.gramDeviation"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="是否试纺：" prop="code" class="formItemMargin">
                                    <RadioGroup v-model="weightFormValidate.isTest">
                                        <Radio label="1">是</Radio>
                                        <Radio label="0">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="8">
                                <FormItem label="取样米数：" prop="code" class="formItemMargin">
                                    <InputNumber @on-change="changeSamplingMeters" class="inputNumberWidth"  :max="100" :min="0" v-model="weightFormValidate.samplingMeters"></InputNumber>
                                </FormItem>
                            </Col>
                            <Col span="8">
                                <FormItem label="每段米数：" prop="code" class="formItemMargin">
                                    <!--<InputNumber @on-change="changeTestMeters" class="inputNumberWidth" :max="100" :min="0" v-model="weightFormValidate.testMeters"></InputNumber>-->
                                    <p class="modal-readonly">{{ weightFormValidate.testMeters }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <Table class="marginBottom" :row-class-name="rowClassName" :height="320" ref="selection" size="small" border :columns="weightModalColumns" :data="weightModalData"></Table>
                    <other-message
                        :createName="createName"
                        :createTime="createTime"
                        :submitName="submitName"
                        :submitTime="submitTime"
                    >
                    </other-message>
                </div>
        </modal>
        <delete-warning
                :v-model="deleteWarnShow"
                :tipMsg="deleteWarnMsg"
                :loading="deleteWarnLoading"
                @cancel="deleteWarnCancel"
                @confirm="deleteWarnConfirm"
        ></delete-warning>
        <quality-modal :qualityShow="qualityShow" @onClick="onClick" @onCancel="onCancel"></quality-modal>
    </div>
</template>
<script>
import weight from './weight';
export default {
    ...weight,
    name: 'weight'
};
</script>

<style scoped>
.cycle{
    font-weight: bold;
    text-align: center;
    display: inline-block;
    line-height: 32px;
    vertical-align: middle;
    /*margin-left: 4px;*/
    margin-left: 8px;
    margin-right: 8px;
    /*margin: 8px 8px;*/
}
.weight-if-show{
    margin-left: 154px;
}
</style>

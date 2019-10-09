<template>
    <div>
        <Card>
            <div class="">
                <!--<Row class="leftFlex">-->
                    <!--<Col>-->
                        <!--<Button type="success" @click="skipTest">跳过质检</Button>-->
                    <!--</Col>-->
                <!--</Row>-->
                <Row class="endFlex marginBottom" id="selectedHeight">
                    <Col class="">
                        <Row class="marginBottom">
                            <Col>
                                <span class="formSpanStyle">预计开台时间：</span>
                                <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" :clearable="true" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                                <DatePicker class="formEachStyle " @on-change="changeEndTime" type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                                <Select class="formEachStyle textLeft" v-model="workshopId" placeholder="请选择车间">
                                    <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                                <Select class="formEachStyle textLeft" clearable v-model="processId" placeholder="请选择工序">
                                    <Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row v-if="orderSelectedShow">
                            <Col>
                                <span class="formSpanStyle">关键字搜索：</span>
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
            <Table class="marginBottom" :height="tableHeight" :loading="processModificationLoading" size="small" ref="selection" border :columns="processModificationColumns" :data="processModificationData"></Table>
            <Page class="textRight" show-elevator show-sizer show-total :total="pageTotal" :page-size="pageSize" :page-size-opts="pageOpts" :placement="pageUp" @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
        </Card>
        <modal
                :isShow="weightShow"
                :saveLoading="weightSaveLoading"
                :saveSubmitLoading="weightSaveSubmitLoading"
                :title="weightTitle"
                :isSubmit="false"
                :width="800"
                :isCancel="false"
                :isSaveSubmit="isShowSaveOrSubmit"
                @cancel="weightCancel"
                @saveSubmit="weightSaveSubmit">
            <!--@save="weightSave"-->
            <!--:isSave="isShowSaveOrSubmit"-->
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
                            <FormItem label="检验类型：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ weightFormValidate.testTypeMean }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="车间：" prop="code" class="formItemMargin">
                                <p v-if="isEdit" class="modal-readonly">{{ weightFormValidate.workshopName }}</p>
                                <Select v-else v-model="weightFormValidate.workshopId" placeholder="请选择检验类型">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="检验机台：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ weightFormValidate.machineCode }}</p>
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
                        <!--<Col span="8">-->
                            <!--<FormItem label="克重偏差±%：" prop="gramDeviation" class="formItemMargin">-->
                                <!--&lt;!&ndash;<p class="modal-readonly">{{ formQmProductModelValidate.gramDeviation }}</p>&ndash;&gt;-->
                                <!--<InputNumber :value="weightFormValidate.gramDeviation"></InputNumber>-->
                            <!--</FormItem>-->
                        <!--</Col>-->
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
                                <InputNumber class="inputNumberWidth" @on-change="changeMoistureRegin"  :max="100" :min="0" v-model="weightFormValidate.moistureRegain"></InputNumber>
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
            </div>
        </modal>
        <modal
                :isShow="testShow"
                :saveLoading="testSaveLoading"
                :saveSubmitLoading="testSaveSubmitLoading"
                :title="testTitle"
                :isSubmit="false"
                :spinShow="spinShow"
                :width="800"
                :isCancel="false"
                :isSaveSubmit="isShowSaveOrSubmit"
                @cancel="testCancel"
                @saveSubmit="testSaveSubmit">
            <div slot="content">
                <Form :label-width="100" ref="testFormValidate" :model="testFormValidate" :rules="testRuleValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="检验日期：" prop="code" class="formItemMargin">
                                <!--<p v-if="isEdit" class="modal-readonly">{{ testFormValidate.testDate }}</p>-->
                                <DatePicker type="date" @on-change="changeTestElseDate" :clearable="false" :value="testFormValidate.testDate" placeholder="选择日期"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="实验员：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.inspectorName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="质检类型：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.dataTypeName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="所属车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.workshopName }}</p>
                                <!--<Select v-model="testFormValidate.workshopId" @on-change="changeWorkshop" placeholder="请选择检验类型">-->
                                    <!--<Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>-->
                                <!--</Select>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="检验机台：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.machineCode }}</p>
                                <!--<select-machine-->
                                <!--v-else-->
                                <!--:processList="processList"-->
                                <!--:machineWorkshopId="curWorkshopId"-->
                                <!--@selectMachine="confirmMachine"-->
                                <!--:isEditMachineCode="isEditMachineCode"-->
                                <!--&gt;</select-machine>-->
                                <!--<select-machine-quality-->
                                        <!--v-else-->
                                        <!--:machineWorkshopId="curWorkshopId"-->
                                        <!--@selectMachineVal="selectMachine"-->
                                        <!--:selectMachineCode="selectMachineCode"-->
                                <!--&gt;-->
                                <!--</select-machine-quality>-->
                            </FormItem>
                        </Col>
                        <!--<Col span="8">-->
                        <!--<FormItem label="产量偏差：" prop="code" class="formItemMargin">-->
                        <!--<p class="modal-readonly">{{ testFormValidate.prdNoticeCode }}</p>-->
                        <!--</FormItem>-->
                        <!--</Col>-->
                        <Col span="8">
                            <FormItem label="生产通知单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.prdNoticeCode }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="所属工序：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="产品编码：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.productCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="产品名称：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.productName }}</p>
                            </FormItem>
                        </Col>

                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="批号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.batchCode }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="是否试纺：" prop="code" class="formItemMargin">
                                <RadioGroup v-model="testFormValidate.isTest">
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="测试类型：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.testTypeMean }}</p>
                                <!--<Input class="formWidth marginBottom" type="text" v-model="testFormValidate.testTypeMean" placeholder="请输入产品编码或名称"/>-->
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="是否合格：" prop="code" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ testFormValidate.isStandard }}</p>-->
                                <Select class="formWidth marginBottom" v-model="testFormValidate.isStandard" placeholder="是否合格">
                                    <Option v-for="item in isStandardTypeList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table class="marginBottom" :height="350" ref="selection" size="small" border :columns="testModalColumns" :data="testModalData"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import rialInspection from './rial-inspection';
export default {
    ...rialInspection,
    name: 'rial-inspection'
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

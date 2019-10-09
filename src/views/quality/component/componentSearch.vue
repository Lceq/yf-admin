<template>
    <div>
        <Row class="flexBetween" id="selectedHeight">
            <Col class="leftFlex">
                <Button icon="md-add" class="buttonBottom" @click="addNewQmSearch" type="success">新增</Button>
                <Dropdown class="marginButtonLeft" trigger="click">
                    <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                提交
                    <Icon type="ios-arrow-down"></Icon>
                </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem  @click.native="submitQmSearch">提交</DropdownItem>
                        <DropdownItem @click.native="cancelQmSearch">撤销</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="md-close" @click="deleteQmWeight">删除</Button>
            </Col>
            <Col>
                <Row class="flexBetween">
                    <Col class="columnFlex">
                        <Row>
                            <Col class="marginBottom">
                                <span class="formSpanWidth ">检验日期：</span>
                                <DatePicker class="formWidth " type="date" :value="dateFrom" @on-change="changeDateFrom" placeholder="开始时间"></DatePicker>
                                <DatePicker class="formWidth " type="date" :value="dateTo" @on-change="changeDateTo" placeholder="结束时间"></DatePicker>
                                <Select class="formWidth " v-model="curWorkshopId" placeholder="请选择车间">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                                <Select clearable class="formWidth " v-model="curQmSearchProcessId" placeholder="请选择工序">
                                    <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row v-if="isShowSearch">
                            <Col>
                                <span class="formSpanWidth marginBottom"></span>
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
                            <a @click="changeSearchShow" class="marginBottom marginButtonLeft cycle">···</a>
                            <Button class="marginBottom marginButtonLeft" type="primary" @click="searchQmSearch">搜索</Button>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table class="marginBottom" border @on-selection-change="selectSearch"  :columns="searchColumns" :data="searchData" :height="tableHeight" size="small"></Table>
                <Page class="textRight" :total="searchTotal" show-elevator :page-size-opts="searchPageOpts" show-total :page-size="searchPageSize" @on-change="changePageIndexSearch" show-sizer @on-page-size-change="changePageSizeSearch"></Page>
            </Col>
        </Row>
        <modal
            :isShow="testShow"
            :saveLoading="testSaveLoading"
            :saveSubmitLoading="testSaveSubmitLoading"
            :title="testTitle"
            :isSubmit="false"
            :width="800"
            :isCancel="false"
            :isSave="isShowSaveOrSubmit"
            :isSaveSubmit="isShowSaveOrSubmit"
            @save="testSave"
            @cancel="testCancel"
            @saveSubmit="testSaveSubmit">
            <div slot="content">
                <Form :label-width="100" ref="testFormValidate" :model="testFormValidate" :rules="testRuleValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="检验日期：" prop="code" class="formItemMargin">
                                <p v-if="isEdit" class="modal-readonly">{{ testDate }}</p>
                                <DatePicker v-else type="date" @on-change="changeTestDate" :clearable="false" :value="testDate" placeholder="选择日期"></DatePicker>
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
                            <FormItem label="车间：" prop="code" class="formItemMargin">
                                <p v-if="isEdit" class="modal-readonly">{{ testFormValidate.workshopName }}</p>
                                <Select v-else v-model="curWorkshopId" @on-change="changeWorkshop" placeholder="请选择检验类型">
                                <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="检验机台：" prop="code" class="formItemMargin">
                            <p v-if="isEdit" class="modal-readonly">{{ testFormValidate.machineCode }}</p>
                                <select-machine
                                v-else
                                :processList="processList"
                                :machineWorkshopId="curWorkshopId"
                                @selectMachine="confirmMachine"
                                :isEditMachineCode="isEditMachineCode"
                                ></select-machine>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="工序：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.processName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
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
                        <Col span="8">
                            <FormItem label="批次号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ testFormValidate.batchCode }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
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
import search from './search';
export default {
    ...search,
    name: 'componentSearch'
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
</style>

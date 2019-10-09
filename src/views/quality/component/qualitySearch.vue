<template>
  <div>
      <!--<Row class="flexBetween" id="selectedHeight">-->
          <!--<Col class="leftFlex">-->
              <!--<Button icon="md-add" class="buttonBottom" @click="addNewQmSearch" type="success">新增</Button>-->
              <!--<Dropdown class="marginButtonLeft" trigger="click">-->
                  <!--<Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">-->
                      <!--提交-->
                      <!--<Icon type="ios-arrow-down"></Icon>-->
                  <!--</Button>-->
                  <!--<DropdownMenu slot="list">-->
                      <!--<DropdownItem  @click.native="submitQmSearch">提交</DropdownItem>-->
                      <!--<DropdownItem @click.native="cancelQmSearch">撤销</DropdownItem>-->
                  <!--</DropdownMenu>-->
              <!--</Dropdown>-->
              <!--<Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="md-close" @click="deleteQmWeight">删除</Button>-->
          <!--</Col>-->
          <!--<Col>-->
              <!--<Row class="flexBetween">-->
                  <!--<Col class="columnFlex">-->
                      <!--&lt;!&ndash;<Row>&ndash;&gt;-->
                          <!--&lt;!&ndash;<Col class="marginBottom">&ndash;&gt;-->
                              <!--&lt;!&ndash;<span class="formSpanWidth ">检验日期：</span>&ndash;&gt;-->
                              <!--&lt;!&ndash;<DatePicker class="formWidth " type="date" :value="dateFrom" @on-change="changeDateFrom" placeholder="开始时间"></DatePicker>&ndash;&gt;-->
                              <!--&lt;!&ndash;<DatePicker class="formWidth " type="date" :value="dateTo" @on-change="changeDateTo" placeholder="结束时间"></DatePicker>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Select class="formWidth " v-model="curWorkshopId" placeholder="请选择车间">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>&ndash;&gt;-->
                              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Select clearable class="formWidth " v-model="curQmWeightProcessId" placeholder="请选择工序">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>&ndash;&gt;-->
                              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                          <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Row>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Row v-if="isShowSearch">&ndash;&gt;-->
                          <!--&lt;!&ndash;<Col>&ndash;&gt;-->
                              <!--&lt;!&ndash;<span class="formSpanWidth marginBottom"></span>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Select clearable class="formWidth marginBottom" v-model="curCheckoutTypeId" placeholder="请选择检验类型">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Option v-for="item in checkoutTypeList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>&ndash;&gt;-->
                              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Select clearable class="formWidth marginBottom" v-model="curSubmissionTypeId" placeholder="请选择数据状态">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Option v-for="item in submissionTypeList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>&ndash;&gt;-->
                              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Input class="formWidth marginBottom" type="text" v-model="productCodeName" placeholder="请输入产品编码或名称"/>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Input class="formWidth marginBottom" type="text" v-model="machineCodeName" placeholder="请输入机台编码或名称"/>&ndash;&gt;-->
                          <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Row>&ndash;&gt;-->
                  <!--</Col>-->
                  <!--&lt;!&ndash;<Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<div class="leftFlex">&ndash;&gt;-->
                          <!--&lt;!&ndash;<a @click="changeSearchShow" class="marginBottom marginButtonLeft cycle">···</a>&ndash;&gt;-->
                          <!--&lt;!&ndash;<Button class="marginBottom marginButtonLeft" type="primary" @click="searchQmSearch">搜索</Button>&ndash;&gt;-->
                      <!--&lt;!&ndash;</div>&ndash;&gt;-->
                  <!--&lt;!&ndash;</Col>&ndash;&gt;-->
              <!--</Row>-->
          <!--</Col>-->
      <!--</Row>-->
      <Row>
          <Col>
              <!--<Table class="marginBottom" border :columns="searchColumns" :data="searchData" :height="tableHeight" size="small"></Table>-->
              <!--<Page class="textRight" :total="searchTotal" show-elevator :page-size-opts="searchPageOpts" show-total :page-size="searchPageSize" @on-change="changePageIndexSearch" show-sizer @on-page-size-change="changePageSizeSearch"></Page>-->
          </Col>
      </Row>
      <!--<modal-->
          <!--:isShow="testShow"-->
          <!--:saveLoading="testSaveLoading"-->
          <!--:saveSubmitLoading="testSaveSubmitLoading"-->
          <!--:title="testTitle"-->
          <!--:isSubmit="false"-->
          <!--:width="800"-->
          <!--:isCancel="false"-->
          <!--:isSave="isShowSaveOrSubmit"-->
          <!--:isSaveSubmit="isShowSaveOrSubmit"-->
          <!--@save="testSave"-->
          <!--@cancel="testCancel"-->
          <!--@saveSubmit="testSaveSubmit"-->
      <!--&gt;-->
          <!--&lt;!&ndash;<div slot="content">&ndash;&gt;-->
              <!--&lt;!&ndash;<Form :label-width="100" ref="testFormValidate" :model="testFormValidate" :rules="testRuleValidate" :show-message="false">&ndash;&gt;-->
                  <!--&lt;!&ndash;<Row>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="检验日期：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p v-if="isEdit" class="modal-readonly">{{ testDate }}</p>&ndash;&gt;-->
                              <!--&lt;!&ndash;<DatePicker v-else type="date" @on-change="changeTestDate" :clearable="false" :value="testDate" placeholder="选择日期"></DatePicker>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="实验员：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.inspectorName }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="质检类型：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.testTypeMean }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                  <!--&lt;!&ndash;</Row>&ndash;&gt;-->
                  <!--&lt;!&ndash;<Row>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="车间：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p v-if="isEdit" class="modal-readonly">{{ testFormValidate.workshopName }}</p>&ndash;&gt;-->
                              <!--&lt;!&ndash;<Select v-else v-model="curWorkshopId" @on-change="changeWorkshop" placeholder="请选择检验类型">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>&ndash;&gt;-->
                              <!--&lt;!&ndash;</Select>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="检验机台：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p v-if="isEdit" class="modal-readonly">{{ testFormValidate.machineCode }}</p>&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;<select-machine&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;v-else&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;:processList="processList"&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;:machineWorkshopId="curWorkshopId"&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;:isShowMachineList = 'isShowMachineList'&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;@selectMachine="confirmMachine"&ndash;&gt;&ndash;&gt;-->
                                      <!--&lt;!&ndash;&lt;!&ndash;:isEditMachineCode="isEditMachineCode"&ndash;&gt;&ndash;&gt;-->
                              <!--&lt;!&ndash;&lt;!&ndash;&gt;</select-machine>&ndash;&gt;&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="工序：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.processName }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                  <!--&lt;!&ndash;</Row>&ndash;&gt;-->
                  <!--&lt;!&ndash;<Row>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="产品编码：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.productCode }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="产品名称：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.productName }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="批次号：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.batchCode }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                  <!--&lt;!&ndash;</Row>&ndash;&gt;-->
                  <!--&lt;!&ndash;<Row>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="是否试纺：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<RadioGroup v-model="testFormValidate.isTest">&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Radio label="1">是</Radio>&ndash;&gt;-->
                                  <!--&lt;!&ndash;<Radio label="0">否</Radio>&ndash;&gt;-->
                              <!--&lt;!&ndash;</RadioGroup>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="质检类型：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.testTypeMean }}</p>&ndash;&gt;-->
                          <!--&lt;!&ndash;</FormItem>&ndash;&gt;-->
                      <!--&lt;!&ndash;</Col>&ndash;&gt;-->
                      <!--&lt;!&ndash;<Col span="8">&ndash;&gt;-->
                          <!--&lt;!&ndash;<FormItem label="是否合格：" prop="code" class="formItemMargin">&ndash;&gt;-->
                              <!--&lt;!&ndash;<p class="modal-readonly">{{ testFormValidate.testTypeMean }}</p>&ndash;&gt;-->
                          <!--</FormItem>-->
                      <!--</Col>-->
                  <!--</Row>-->
              <!--</Form>-->
              <!--<Table class="marginBottom" :height="200" ref="selection" size="small" border :columns="testModalColumns" :data="testModalData"></Table>-->
          <!--</div>-->
      <!--</modal>-->
  </div>
</template>

<script>
import qualitySearch from './qualitySearch';
export default {
    ...qualitySearch,
    name: 'search'
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

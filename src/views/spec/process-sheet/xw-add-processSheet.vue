<template>
  <Card style="height: 100%">
      <Row>
          <Col class="marginBottom">
              <Button icon="md-add" class="screenButMarginLeft" type="primary" @click="newAddClick">新增</Button>
              <Button icon="md-checkmark" class="screenButMarginLeft" :disabled="!isShowProcessParams" type="primary" @click="saveClickEvent('formValidate', 'formSpecParams')">保存</Button>
              <Button icon="ios-create" :disabled="!isShowProcessParams" class="screenButMarginLeft" type="primary" @click="pushClickEvent('formValidate', 'formSpecParams')">提交</Button>
          </Col>
      </Row>
      <Row class="marginBottom">
          <Col>
              <Form :label-width="90" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                  <Row>
                      <Col :xs="6" :lg="5">
                          <FormItem label="工艺单号:" class="formItemMargin">
                              <p class="modal-readonly"> 自动生成工艺单号 </p>
                          </FormItem>
                      </Col>
                      <Col :xs="6" :lg="5">
                          <FormItem label="单据日期:" prop="curDate" class="formItemMargin">
                              <DatePicker :clearable="false" :editable="false" class="widthPercentage" :value="formValidate.curDate" type="date" placeholder="请选择日期" @on-change="changeTime"></DatePicker>
                          </FormItem>
                      </Col>
                      <Col :xs="6" :lg="5">
                          <FormItem label="工艺员:" prop="specUser" class="formItemMargin">
                              <Select
                                  ref="setQuery"
                                  v-model="formValidate.specUser"
                                  filterable
                                  remote
                                  clearable
                                  :remote-method="remoteMethod"
                                  :loading="remoteUserLoading"
                                  placeholder="请输入工艺员名称"
                              >
                                  <!--@on-change="selectSpecUserEvent"-->
                                  <Option v-for="(option, index) in curUserList" :value="option.codeName" :key="index">{{ option.codeName }}</Option>
                              </Select>
                          </FormItem>
                      </Col>
                      <Col :xs="6" :lg="5">
                          <FormItem label="产品:" prop="selectProductCode" class="formItemMargin">
                              <xw-select-product
                                  :selectProductCode="formValidate.selectProductCode"
                                  @selectProductVal="selectProduct"
                              >
                              </xw-select-product>
                          </FormItem>
                      </Col>
                  </Row>
                  <Row>
                      <Col :xs="6" :lg="5">
                          <FormItem label="规格:" class="formItemMargin">
                              <div class="modal-readonly">{{formValidate.productModels}}</div>
                          </FormItem>
                      </Col>
                      <Col :xs="6" :lg="5">
                          <FormItem label="生产工序:" class="formItemMargin">
                              <div class="modal-readonly">{{formValidate.processName}}</div>
                          </FormItem>
                      </Col>
                  </Row>
              </Form>
          </Col>
      </Row>
      <div v-show="formValidate.processName" class="marginBottom">
        <Row>
          <Col>
              <Tabs>
                  <TabPane :label="formValidate.processName">
                      <Form ref="formSpecParams" :model="formSpecParams" :rules="formRulesSpecParams" :label-width="100" :show-message="false">
                          <Row>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                          label="设备机型"
                                          prop="machineModelId"
                                          class="formItemMargin">
                                      <Select v-model="formSpecParams.machineModelId" placeholder="请选择设备机型">
                                          <Option v-for="item in machineModelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                      </Select>
                                  </FormItem>
                              </Col>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                      label="标准克重"
                                      prop="gramWeight"
                                      class="formItemMargin">
                                      <Row>
                                          <InputNumber :min="0" class="widthPercentage" type="text" v-model="formSpecParams.gramWeight"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                      label="标准米长"
                                      prop="meters"
                                      class="formItemMargin">
                                      <Row>
                                          <InputNumber :min="0" class="widthPercentage" type="text" v-model="formSpecParams.meters"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                          label="号数"
                                          class="formItemMargin"
                                          prop="numbers">
                                      <Row>
                                          <InputNumber :min="0"  class="widthPercentage" type="text" v-model="formSpecParams.numbers"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                          </Row>
                          <Row>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                      label="台时单产"
                                      class="formItemMargin"
                                      prop="hourYield">
                                      <Row>
                                          <InputNumber :min="0" class="widthPercentage" type="text" v-model="formSpecParams.hourYield"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                      label="公定回潮率%"
                                      class="formItemMargin"
                                      prop="moistureRegain">
                                      <Row>
                                          <InputNumber :min="0"  :max="100" class="widthPercentage" type="text" v-model="formSpecParams.moistureRegain"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                              <Col :xs="6" :lg="5">
                                  <FormItem
                                      label="运转效率%"
                                      class="formItemMargin"
                                      prop="efficiencyPercent">
                                      <Row>
                                          <InputNumber :min="0"  :max="100" class="widthPercentage" type="text" v-model="formSpecParams.efficiencyPercent"/>
                                      </Row>
                                  </FormItem>
                              </Col>
                          </Row>
                      </Form>
                      <Row>
                          <Col :xs="24" :lg="20">
                              <Table :height="520" size="small" border :columns="processParamColumns" :data="processParamList"></Table>
                          </Col>
                      </Row>
                  </TabPane>
              </Tabs>
              <tips-clear
                  :v-model="clearTipsStatus"
                  :tipMsg="clearTipsMsg"
                  @cancel="clearTipsCancel"
                  @confirm="clearTipsConfirm"
              >
              </tips-clear>
          </Col>
      </Row>
      </div>
  </Card>
</template>

<script>
import xwProcess from './xw-add';
export default {
    ...xwProcess,
    name: 'xw-add-processSheet'
};
</script>

<style scoped>

</style>

<template>
    <Card style="height: 100%">
        <Row>
            <Col class="marginBottom">
                <Button icon="md-add" class="screenButMarginLeft" type="primary" @click="newAddClick">新增</Button>
                <Button icon="ios-browsers" @click="copyClick" class="screenButMarginLeft" type="success">复制</Button>
                <Button icon="md-checkmark" v-show="isAuditStateVal <= 1" class="screenButMarginLeft" :disabled="!isShowProcessParams" type="primary" @click="saveClickEvent('formValidate', 'formSpecParams')">保存</Button>
                <Button icon="ios-create" v-show="isAuditStateVal <= 1" :disabled="!isShowProcessParams" class="screenButMarginLeft" type="primary" @click="pushClickEvent('formValidate', 'formSpecParams')">提交</Button>
                <Button icon="ios-undo" v-show="isAuditStateVal === 2" class="screenButMarginLeft" type="warning" @click="cancelClickEvent">撤销提交</Button>
                <Button icon="md-done-all" v-show="isAuditStateVal === 2" class="screenButMarginLeft" type="primary" @click="auditClickEvent">审核</Button>
                <Button icon="md-refresh" v-show="isAuditStateVal === 3" type="warning" class="screenButMarginLeft" @click="unAuditClickEvent">撤销审核</Button>
                <Button icon="md-lock" v-show="isAuditStateVal === 3 && isEnableStateVal" class="screenButMarginLeft" type="error" @click="disableClickEvent">禁用</Button>
                <Button icon="md-unlock" v-show="isAuditStateVal === 3 && !isEnableStateVal" class="screenButMarginLeft" type="info" @click="enableClickEvent">启用</Button>
            </Col>
        </Row>
        <Row class="marginBottom">
            <Col>
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col :xs="6" :lg="5">
                            <FormItem label="工艺单号:" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.code }} </p>
                            </FormItem>
                        </Col>
                        <Col :xs="6" :lg="5">
                            <FormItem label="单据日期:" prop="curDate" class="formItemMargin">
                                <p class="modal-readonly" v-if="isAuditState"> {{ formValidate.curDate }}</p>
                                <DatePicker v-else :clearable="false" :editable="false" class="widthPercentage" @on-change="changeTime" :value="formValidate.curDate" type="date" placeholder="请选择日期"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col :xs="6" :lg="5">
                            <FormItem label="工艺员:" prop="specUser" class="formItemMargin">
                                <p class="modal-readonly" v-if="isAuditState"> {{ formValidate.specUser }}</p>
                                <Select
                                    v-else
                                    ref="setQuery"
                                    v-model="formValidate.specUser"
                                    filterable
                                    remote
                                    clearable
                                    :remote-method="remoteMethod"
                                    :loading="remoteUserLoading"
                                    @on-change="selectSpecUserEvent"
                                    placeholder="请输入工艺员名称"
                                >
                                    <Option v-for="(option, index) in curUserList" :value="option.codeName" :key="index">{{option.codeName}}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col :xs="6" :lg="5">
                            <FormItem label="单据状态:" class="formItemMargin">
                                <div class="exhibitionInputBackground">{{formValidate.specSheetAuditState}}</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col :xs="6" :lg="5">
                            <FormItem label="产品:" prop="selectProductCode" class="formItemMargin">
                                <p class="modal-readonly" v-show="isAuditState"> {{ formValidate.selectProductCode }}</p>
                                <xw-select-product
                                    v-show="!isAuditState"
                                    :selectProductCode="formValidate.selectProductCode"
                                    @selectProductVal="selectProduct"
                                >
                                </xw-select-product>
                            </FormItem>
                            <!--<FormItem label="产品:" class="formItemMargin">-->
                                <!--<div class="modal-readonly">{{selectProductCode}}</div>-->
                            <!--</FormItem>-->
                        </Col>
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
                                            <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.machineModelName }}</p>
                                            <Select v-model="formSpecParams.machineModelId" v-else placeholder="请选择设备机型">
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
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.gramWeight }}</p>
                                                <InputNumber :min="0" v-else class="widthPercentage" type="text" v-model="formSpecParams.gramWeight"/>
                                            </Row>
                                        </FormItem>
                                    </Col>
                                    <Col :xs="6" :lg="5">
                                        <FormItem
                                                label="标准米长"
                                                prop="meters"
                                                class="formItemMargin">
                                            <Row>
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.meters }}</p>
                                                <InputNumber :min="0"  v-else class="widthPercentage" type="text" v-model="formSpecParams.meters"/>
                                            </Row>
                                        </FormItem>
                                    </Col>
                                    <Col :xs="6" :lg="5">
                                        <FormItem
                                                label="号数"
                                                class="formItemMargin"
                                                prop="numbers">
                                            <Row>
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.numbers }}</p>
                                                <InputNumber :min="0" v-else class="widthPercentage" type="text" v-model="formSpecParams.numbers"/>
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
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.hourYield }}</p>
                                                <InputNumber :min="0" v-else class="widthPercentage" type="text" v-model="formSpecParams.hourYield"/>
                                            </Row>
                                        </FormItem>
                                    </Col>
                                    <Col :xs="6" :lg="5">
                                        <FormItem
                                                label="公定回潮率%"
                                                class="formItemMargin"
                                                prop="moistureRegain">
                                            <Row>
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.moistureRegain }}</p>
                                                <InputNumber :min="0" :max="100" v-else class="widthPercentage" type="text" v-model="formSpecParams.moistureRegain"/>
                                            </Row>
                                        </FormItem>
                                    </Col>
                                    <Col :xs="6" :lg="5">
                                        <FormItem
                                                label="运转效率%"
                                                class="formItemMargin"
                                                prop="efficiencyPercent">
                                            <Row>
                                                <p class="modal-readonly" v-if="isAuditState"> {{ formSpecParams.efficiencyPercent }}</p>
                                                <InputNumber :min="0" :max="100" v-else class="widthPercentage" type="text" v-model="formSpecParams.efficiencyPercent"/>
                                            </Row>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <Row>
                                <Col :xs="24" :lg="20">
                                    <Table :height="480" size="small" border :columns="processParamColumns" :data="processParamList"></Table>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane label="其他信息" v-if="showOther">
                            <xw-operation-log
                                :createName="createName"
                                :createTime="createTime"
                                :updateName="updateName"
                                :updateTime="updateTime"
                                :operationList="operationList"
                            >
                            </xw-operation-log>
                        </TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
        <tips-clear
                :v-model="clearTipsStatus"
                :tipMsg="clearTipsMsg"
                @cancel="clearTipsCancel"
                @confirm="clearTipsConfirm"
        >
        </tips-clear>
    </Card>
</template>
<script>
import xwProcess from './xw-edit';
export default {
    ...xwProcess,
    name: 'xw-edit-processSheet'
};
</script>

<style scoped>

</style>

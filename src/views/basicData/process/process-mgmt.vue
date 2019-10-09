<template>
    <div>
        <Card>
            <!--<Tabs v-model="name" @on-click="clickProcessTab">-->
                <!--<TabPane label="一级工序管理" name="1">-->
                    <Row class="flexBetween" id='selectedHeight'>
                        <Col class="leftFlex">
                            <Button icon="md-add" class="buttonBottom" @click="addNewProcess('one')" type="primary">新增</Button>
                            <Dropdown class="marginButtonLeft" trigger="click">
                                <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                                    审核
                                    <Icon type="ios-arrow-down"></Icon>
                                </Button>
                                <DropdownMenu slot="list">
                                    <DropdownItem  @click.native="auditProcess('one')">审核</DropdownItem>
                                    <DropdownItem @click.native="unAuditProcess('one')">反审核</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Col>
                    </Row>
                    <Table class="marginBottom" :loading="tableLoading" @on-selection-change="selectProcess" :height="tableHeight" ref="selection" size="small" border :columns="processColumns" :data="processData"></Table>
                <!--</TabPane>-->
                <!--<TabPane label="二级工序管理" name="2">-->
                    <!--<Row class="flexBetween" id='selectedHeight'>-->
                        <!--<Col class="leftFlex">-->
                            <!--<Button icon="md-add" class="buttonBottom" @click="addNewProcess('two')" type="primary">新增</Button>-->
                            <!--<Dropdown class="marginButtonLeft" trigger="click">-->
                                <!--<Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">-->
                                    <!--审核-->
                                    <!--<Icon type="ios-arrow-down"></Icon>-->
                                <!--</Button>-->
                                <!--<DropdownMenu slot="list">-->
                                    <!--<DropdownItem  @click.native="auditProcess('two')">审核</DropdownItem>-->
                                    <!--<DropdownItem @click.native="unAuditProcess('two')">反审核</DropdownItem>-->
                                <!--</DropdownMenu>-->
                            <!--</Dropdown>-->
                        <!--</Col>-->
                    <!--</Row>-->
                    <!--<Table class="marginBottom" :loading="tableLoading" @on-selection-change="selectProcess" :height="tableHeight" ref="selection" size="small" border :columns="processColumns" :data="processData"></Table>-->
                <!--</TabPane>-->
            <!--</Tabs>-->
            <modal
                    :isShow="processShow"
                    :loading="processLoading"
                    :title="processTitle"
                    :isSubmit="isCouldSave"
                    :isCancel="isCouldSave"
                    @submit="processSubmit"
                    @cancel="processCancel"
                    :WarnMsg="processMsg">
                <div slot="content">
                    <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                        <Row>
                            <Col span="22">
                                <FormItem label="工序编码：" prop="code" class="formItemMargin">
                                    <Input v-if="isCouldSave" type="text" v-model="formValidate.code" placeholder="请输入工序编码"/>
                                    <p v-else class="modal-readonly">{{ formValidate.code }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="工序名称：" prop="name" class="formItemMargin">
                                    <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>-->
                                    <Input v-if="isCouldSave" type="text" v-model="formValidate.name" placeholder="请输入工序名称"/>
                                    <p v-else class="modal-readonly">{{ formValidate.name }}</p>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="isParentProcess">
                            <Col span="22">
                                <FormItem label="所属工段：" class="formItemMargin" prop="processType">
                                    <Select v-model="formValidate.processType">
                                        <Option v-for="item in processTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <!--<p v-else class="modal-readonly">{{ formValidate.processType }}</p>-->
                                </FormItem>
                            </Col>
                        </Row>
                        <Row v-if="!isParentProcess">
                            <Col span="22">
                                <FormItem label="上级工序：" class="formItemMargin" prop="parentProcessId">
                                    <Select v-model="formValidate.parentProcessId">
                                        <Option v-for="item in parentProcess" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <!--<p v-else class="modal-readonly">{{ formValidate.processType }}</p>-->
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="排序：" class="formItemMargin">
                                    <InputNumber :max="99999" :min="1" v-model="formValidate.sortNum"></InputNumber>
                                    <!--<p v-else class="modal-readonly">{{ formValidate.processType }}</p>-->
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="是否报工：" class="formItemMargin">
                                    <RadioGroup v-model="formValidate.isReport">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <!--<FormItem label="排序：" class="formItemMargin">-->
                                    <!--<InputNumber :max="10" :min="1" v-model="formValidate.sortNum"></InputNumber>-->
                                <!--</FormItem>-->
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="是否配棉：" class="formItemMargin">
                                    <RadioGroup v-model="formValidate.isFeeding">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <!--<FormItem label="排序：" class="formItemMargin">-->
                                <!--<InputNumber :max="10" :min="1" v-model="formValidate.sortNum"></InputNumber>-->
                                <!--</FormItem>-->
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="是否设定上机筒位：" class="formItemMargin">
                                    <RadioGroup v-model="formValidate.isPositionUpper">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span="22">
                                <FormItem label="是否设定下机筒位：" class="formItemMargin">
                                    <RadioGroup v-model="formValidate.isPositionLower">
                                        <Radio label="true">是</Radio>
                                        <Radio label="false">否</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row  v-if="isParentProcess">
                            <Col span="22">
                                <FormItem label="有/无子工序：" class="formItemMargin">
                                    <Checkbox v-model="formValidate.isChildren">有</Checkbox>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    <div v-if="isShowUserMessage">
                        <other-message
                                :createName="createName"
                                :createTime="createTime"
                                :updateName="updateName"
                                :updateTime="updateTime"
                                :auditName="auditName"
                                :auditTime="auditTime"
                        >
                        </other-message>
                    </div>
                </div>
            </modal>
            <delete-warning
                    :v-model="deleteWarnShow"
                    :tipMsg="deleteWarnMsg"
                    :loading="deleteWarnLoading"
                    @cancel="deleteWarnCancel"
                    @confirm="deleteWarnConfirm"
            ></delete-warning>
        </Card>
    </div>
</template>

<script>
import process from './process-mgmt';
export default {
    ...process,
    name: 'process-mgmt'
};
</script>

<style scoped>

</style>

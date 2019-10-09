<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewType" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="!selectedIds.length" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditType">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditType">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="!selectedIds.length"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteType">删除</Button>
                </Col>
                <Col>
                    <span class="formSpanStyle">故障类别：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="faultTypeId" placeholder="请选择故障类别">
                        <Option v-for="item in faultTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="auditState" placeholder="请选择数据状态">
                    <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="nameCode" placeholder="请输入故障小类编码或名称"/>
                    <Button class="marginBottom" type="primary" @click="searchTypeList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectType" :height="tableHeight" ref="selection" size="small" border :columns="typeColumns" :data="typeData"></Table>
                    <Page class="textRight" :total="typeTotal" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="typeShow"
            :loading="typeLoading"
            :title="typeTitle"
            :width="800"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="typeSubmit"
            @cancel="typeCancel"
            :WarnMsg="typeMsg">
            <div slot="content">
                <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="小类编码：" prop="code" class="formItemMargin">
                                <Input type="text" v-model="formValidate.code" placeholder="请输入小类编码"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="小类名称：" prop="name" class="formItemMargin">
                                <Input type="text" v-model="formValidate.name" placeholder="请输入小类名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="故障类别：" prop="faultTypeId" class="formItemMargin">
                                <Select class=" textLeft" :clearable="true" v-model="formValidate.faultTypeId" placeholder="请选择故障类别">
                                    <Option v-for="item in faultTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="是否数采：" prop="autoGather" class="formItemMargin">
                                <RadioGroup v-model="formValidate.autoGather">
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                   <Row>
                       <Col span="12">
                           <FormItem label="呼叫岗位：" prop="postIds" class="formItemMargin">
                               <Select class=" textLeft" :clearable="true" multiple label-in-value v-model="formValidate.postIds" placeholder="请选择呼叫岗位">
                                   <Option v-for="item in postList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                               </Select>
                           </FormItem>
                       </Col>
                       <Col span="12">
                           <FormItem label="状态：" prop="auditState" class="formItemMargin">
                               <p class="modal-readonly">{{ formValidate.auditState === 1 ? '创建' : '审核' }}</p>
                           </FormItem>
                       </Col>
                   </Row>
                </Form>
                <div v-if="isEdit">
                    <xw-operation-log
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :operationList="operationList"
                    >
                    </xw-operation-log>
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
    </div>
</template>

<script>
import fault from './fault-subclass';
export default {
    ...fault
};
</script>

<style scoped>

</style>

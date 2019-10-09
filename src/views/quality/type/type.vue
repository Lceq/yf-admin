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
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="processId">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <!--<Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">-->
                        <!--<Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <!--<Input class="formWidth marginBottom" type="text" v-model="typeCode" placeholder="输入产品色号或名称"/>-->
                    <Button class="marginBottom" type="primary" @click="searchTypeList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectType" :height="tableHeight" ref="selection" size="small" border :columns="typeColumns" :data="typeData"></Table>
                    <!--<Page class="textRight" :total="typeTotal" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>-->
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="typeShow"
            :loading="typeLoading"
            :title="typeTitle"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="typeSubmit"
            @cancel="typeCancel"
            :WarnMsg="typeMsg">
            <div slot="content">
                <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <FormItem label="工序：" prop="processId" class="formItemMargin">
                        <Select class=" textLeft" :clearable="true" v-model="formValidate.processId">
                            <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="质检类别：" prop="typeIds" class="formItemMargin">
                        <Select class=" textLeft" @on-change="changeType" multiple label-in-value :clearable="true" v-model="formValidate.typeIds">
                            <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="试纺质检类别：" prop="qmTypeIds" class="formItemMargin">
                        <Select class=" textLeft" @on-change="changeQmType" :clearable="true" multiple label-in-value v-model="formValidate.qmTypeIds">
                            <Option v-for="item in testTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
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
                    <!--<other-message-->
                        <!--:createName="createName"-->
                        <!--:auditName="auditName"-->
                        <!--:createTime="createTime"-->
                        <!--:auditTime="auditTime"-->
                    <!--&gt;-->
                    <!--</other-message>-->
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
import type from './type';
export default {
    ...type,
    name: 'type'
};
</script>

<style scoped>

</style>

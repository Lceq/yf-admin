<template>
    <Card>
        <Row class="flexBetween" id="selectedHeight">
            <Col class="leftFlex">
                <Button icon="md-add" class="marginBottom" type="primary" @click="addQualityParameter">新增</Button>
                <Dropdown class="marginBottom marginButtonLeft" trigger="click">
                    <Button :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem  @click.native="auditQualityParameter">审核</DropdownItem>
                        <DropdownItem @click.native="unAuditQualityParameter">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="ios-trash" @click="deleteQualityParameter">删除</Button>
            </Col>
            <Col>
                <Select clearable class="formWidth marginBottom" v-model="qualityParameterProcessId" placeholder="请选择工序">
                    <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="curEnableStateId" placeholder="请选择启用状态">
                    <Option v-for="item in enableStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">
                    <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Select clearable class="formWidth marginBottom" v-model="curQmTypeId" placeholder="请选择质检类别">
                    <Option v-for="item in qmTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                </Select>
                <Input clearable v-model="code" placeholder="请输入编码或名称" class="formWidth marginBottom" />
                <Button icon="ios-search" class="marginBottom" type="primary" @click="searchQualityParameter">搜索</Button>
            </Col>
        </Row>
        <Row>
            <Col>
                <Table class="marginBottom" border @on-selection-change="selectQualityParameter" :data="qualityParameterList" :columns="qualityParameterColumns" size="small" :loading="qualityParameterLoading" :height="tableHeight"></Table>
                <Page class="textRight" :total="qualityParameterTotal" show-elevator :page-size-opts="qualityParameterPageOpts" show-total :page-size="qualityParameterPageSize" @on-change="changePageIndexQualityParameter" show-sizer @on-page-size-change="changePageSizeQualityParameter"></Page>
            </Col>
        </Row>
        <modal
            :title="qualityParameterModalTitle"
            :isShow="qualityParameterModalShow"
            :loading="qualityParameterModalLoading"
            :isSubmit="isHaveAudit"
            :isCancel="isHaveAudit"
            @cancel="qualityParameterModalCancel"
            @submit="qualityParameterModalSubmit"
        >
            <div slot="content">
                <Row class="marginBottom">
                    <Col span="23">
                        <Form :label-width="90" ref="qualityParameterModal" :model="qualityParameterModal" :rules="qualityParameterModelValidate" :show-message="false">
                            <FormItem label="参数编码：" prop="code" class="formItemMargin">
                                <Input type="text" class="formModalWidth" v-model="qualityParameterModal.code" placeholder="请输入参数编码"/>
                            </FormItem>
                            <FormItem label="参数名称：" prop="name" class="formItemMargin">
                                <Input type="text" class="formModalWidth" v-model="qualityParameterModal.name" placeholder="请输入参数名称"/>
                            </FormItem>
                            <FormItem label="工序：" prop="processId" class="formItemMargin">
                                <Select class="formModalWidth"  v-model="qualityParameterModal.processId">
                                    <Option :style="item.style" v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="质检类别：" prop="qmTypeId" class="formItemMargin">
                                <Select class="formModalWidth"  v-model="qualityParameterModal.qmTypeId">
                                    <Option :style="item.style" v-for="item in qmTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="数据类型：" prop="dataType" class="formItemMargin">
                                <RadioGroup v-model="qualityParameterModal.dataType">
                                    <!--<Radio label="2">字符型</Radio>-->
                                    <Radio label="1">数值型</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="是否启用：" prop="isEnable" class="formItemMargin">
                                <RadioGroup v-model="qualityParameterModal.isEnable">
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="排序：" prop="sortNum" class="formItemMargin">
                                <InputNumber :min="1" v-model="qualityParameterModal.sortNum"></InputNumber>
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <div v-if="isShowUserMessage">
                    <other-message
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :auditName="auditName"
                        :auditTime="auditTime"
                    ></other-message>
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
</template>

<script>
import qualityParameter from './quality-parameter';
export default {
    ...qualityParameter,
    name: 'quality-parameter'
};
</script>

<style scoped>

</style>

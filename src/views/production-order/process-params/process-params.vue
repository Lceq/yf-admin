<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewProcessParams" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditProcessParams">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditProcessParams">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button class="marginBottom marginButtonLeft" :disabled="auditDisabled" type="error" icon="ios-trash" @click="deleteProcessParams">删除</Button>
                </Col>
                <Col>
                    <Select clearable class="formWidth marginBottom" v-model="curProcessParamsProcessId" placeholder="请选择工序">
                        <Option v-for="item in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="curProcessParamsParamsTypeId" placeholder="请选择项目类型">
                        <Option v-for="item in paramsTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="curProcessParamsAuditStateId" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="processParamsCode" placeholder="请输入产品编码或名称"/>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchProcessParams">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" border @on-selection-change="selectProcessParams" :data="processParamsList" :columns="processParamsColumns" size="small" :loading="processParamsLoading" :height="tableHeight"></Table>
                    <Page class="textRight" :total="processParamsTotal" show-elevator :page-size-opts="processParamsPageOpts" show-total :page-size="processParamsPageSize" @on-change="changePageIndexProcessParams" show-sizer @on-page-size-change="changePageSizeProcessParams"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="processParamsModalShow"
            :loading="processParamsModalLoading"
            :isCancel="isHaveAudit"
            :isSubmit="isHaveAudit"
            :width="800"
            @cancel="processParamsModalCancel"
            @submit="processParamsModalSubmit('formProcessParams')"
            :title="processParamsModalMessage"
        >
            <div slot="content">
                <Form :label-width="100" ref="formProcessParams" :model="formProcessParams" :rules="ruleProcessParamsValidate" :show-message="false">
                        <Row>
                            <Col span="23">
                                <FormItem label="项目编码：" prop="ParamsCode" class="formItemMargin">
                                    <p v-if="isEdit" class="modal-readonly">{{ formProcessParams.ParamsCode }}</p>
                                    <Input v-else type="text" v-model="formProcessParams.ParamsCode" placeholder="请输入参数编码"/>
                                </FormItem>
                                <FormItem label="项目名称：" prop="ParamsName" class="formItemMargin">
                                    <Input type="text" v-model="formProcessParams.ParamsName" placeholder="请输入参数名称"/>
                                </FormItem>
                                <FormItem label="所属工序：" class="formItemMargin" prop="processId">
                                    <Select @on-change="changeProcess" v-model="formProcessParams.processId">
                                        <Option v-for="(item,index) in processList" :style="item.style" :value="item.id+''" :key="index">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="项目类型：" prop="ParamsType" class="formItemMargin">
                                    <Select v-model="formProcessParams.paramType">
                                        <Option v-for="(item,index) in paramsTypeList" :value="item.id+''" :key="index">{{ item.name }}</Option>
                                    </Select>
                                </FormItem>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="翻改项目：" class="formItemMargin">
                                            <RadioGroup v-model="formProcessParams.businessParams">
                                                <Radio label="1">是</Radio>
                                                <Radio label="0">否</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="数据类型："  class="formItemMargin">
                                            <RadioGroup @on-change="changeDataType" v-model="formProcessParams.dataType">
                                                <Radio label="1">数值型</Radio>
                                                <Radio label="2">字符型</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <FormItem label="允许为空：" class="formItemMargin">
                                            <RadioGroup v-model="formProcessParams.isEmpty">
                                                <Radio label="1">是</Radio>
                                                <Radio label="0">否</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                    <Col v-show="isShowFormula" span="12">
                                        <FormItem label="计算项目：" class="formItemMargin">
                                            <RadioGroup @on-change="changeIsFormula" v-model="formProcessParams.isFormula">
                                                <Radio label="1">是</Radio>
                                                <Radio label="0">否</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <FormItem v-show="formulaShow" label="计算公式：" class="formItemMargin">
                                   <div @click="changeValue" @keyup="changeFormulaValue($event)" class="formula" id="editor" contenteditable="true">
                                       {{formProcessParams.formula }}
                                   </div>
                                </FormItem>
                                <FormItem v-show="!formulaShow" label="输入方式：" class="formItemMargin">
                                    <RadioGroup @on-change="changeSelectMode" v-model="formProcessParams.selectMode">
                                        <Radio label="1">Input输入框</Radio>
                                        <Radio label="2">Select输入框</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <Row v-show="selectMode">
                                    <Col span="18">
                                        <FormItem  label="选择值：" class="formItemMargin">
                                            <!--<Input v-model="formProcessParams.selectVal" type="textarea" placeholder="Enter something..." />-->
                                            <div class="modal-readonly" style="border: 1px solid #f1f1f1"> {{ formProcessParams.selectVal }} </div>
                                        </FormItem>
                                    </Col>
                                    <Col span="6" style="padding: 0 20px;">
                                        <Button type="default" @click="setModalVal">设定选项值</Button>
                                    </Col>
                                </Row>
                                <FormItem label="排序：" class="formItemMargin">
                                    <InputNumber :max="9999999" :min="0" v-model="formProcessParams.sortNum"></InputNumber>
                                </FormItem>
                            </Col>
                        </Row>
                    <div v-show="visible" :style="{left: contextLeft + 'px',width: contextWidth + 'px',top: contextTop + 'px'}" class="selectParams">
                        <input v-for="(item, index) of curProcessParams" class="selectParams-code" type="button" :value="item.name" @click="doSave(item); return false" maxlength="200">
                        <Icon @click="clickFormulaIcon" class="formulaIcon" type="ios-close-circle-outline" />
                    </div>
                    <div v-show="isShowUserMessage">
                        <other-message
                            :createName="createName"
                            :createTime="createTime"
                            :updateName="updateName"
                            :updateTime="updateTime"
                            :auditName="auditName"
                            :auditTime="auditTime"
                        ></other-message>
                    </div>
                </Form>
            </div>
        </modal>
        <delete-warning
            :v-model="deleteWarnShow"
            :tipMsg="deleteWarnMsg"
            :loading="deleteWarnLoading"
            @cancel="deleteWarnCancel"
            @confirm="deleteWarnConfirm"
        ></delete-warning>
        <modal
            :isShow="modalShow"
            :loading="modalLoading"
            @cancel="modalCancel"
            @submit="modalSubmit"
            :title="'设定属性值'"
        >
            <div slot="content">
                <Table border :data="modalData" :columns="modalColumns"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import processParams from './process-params';
export default {
    ...processParams,
    name: 'process-params'
};
</script>

<style scoped>
    .formula{
        border: 1px solid #dcdee2;
        font-size: 14px;
        padding: 0 5px;
        border-radius: 4px;
        overflow: hidden;
        height: 32px;
        white-space: nowrap;
    }
    .selectParams{
        line-height: 24px;
        position: absolute;
        margin: 0;
        padding: 15px 5px;
        background: #fff;
        z-index: 1000;
        list-style-type: none;
        border-radius: 2px;
        width: 100%;
        /*border: 1px solid #9b9b9b;*/
        box-shadow: 0 2px 4px #4a5161;
    }
    .selectParams-code{
        padding: 2px 5px;
        margin: 0 5px 5px;
        /*border-bottom: 1px solid #f1f1f1;*/
    }
    .selectParams-code:hover{
        /*background-color: #bcbcbc;*/
    }
    /*selectParams-code-hover{*/
        /*background-color: #9b9b9b;*/
    /*}*/
    .selectParams-code:last-child{
        /*border-bottom: 0 solid #c5c5c5;*/
    }
    .formulaIcon{
        cursor: pointer;
        position: absolute;
        border-radius: 50%;
        font-size: 20px;
        right: 5px;
        top: 3px;
    }
    .formulaIcon:hover{
        color: #9b9b9b;
    }
</style>

<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'审核状态'" :curTabStateId="curBatchAuditStateId" :stateList="batchAuditStateList">
            <div slot="content">
                <div id="selectedHeight">
                    <Row class="flexBetween">
                        <Col class="leftFlex">
                            <Button icon="md-add" v-show="curBatchAuditStateId === 1" class="buttonBottom" @click="addNewBatch" type="primary">新增</Button>
                            <Button icon="ios-create" v-show="curBatchAuditStateId === 1" class="buttonBottom marginButtonLeft" @click="changeAuditState('submit')" type="primary">提交</Button>
                            <Button icon="ios-undo" v-show="curBatchAuditStateId === 2" class="buttonBottom" @click="changeAuditState('unSubmit')" type="warning">撤销提交</Button>
                            <Button icon="md-done-all" v-show="curBatchAuditStateId === 2" class="buttonBottom marginButtonLeft" @click="changeAuditState('audit')" type="primary">审核</Button>
                            <Button icon="md-refresh" v-show="curBatchAuditStateId === 3" class="buttonBottom" @click="changeAuditState('unAudit')" type="warning">撤销审核</Button>
                            <Button icon="md-close" v-show="curBatchAuditStateId === 3" class="buttonBottom marginButtonLeft" @click="changeAuditState('close')" type="error">关闭</Button>
                            <Button icon="md-swap" v-show="curBatchAuditStateId === 4" class="buttonBottom" @click="changeAuditState('unClose')" type="warning">撤销关闭</Button>
                            <Button class="marginBottom marginButtonLeft" v-show="curBatchAuditStateId === 1" type="error" icon="ios-trash" @click="changeAuditState('delete')">删除</Button>
                        </Col>
                        <Col>
                            <Select class="formEachStyle textLeft" clearable v-model="processId" placeholder="请选择工序">
                                <Option v-for="(item, index) in processList" :value="item.id" :style="item.style" :key="item.id">{{ item.name }}</Option>
                            </Select>
                            <Select class="formEachStyle textLeft" clearable v-model="curBatchStateId" placeholder="请选择批号状态">
                                <Option v-for="(item, index) in batchStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                            <Input class="formWidth marginBottom" type="text" v-model="productNameCode" placeholder="请输入物料编码或名称"/>
                            <Input class="formWidth marginBottom" type="text" v-model="batchCode" placeholder="请输入批号"/>
                            <Button class="marginBottom" type="primary" @click="searchBatchList">搜索</Button>
                        </Col>
                    </Row>
                </div>
                <Row>
                    <Col class="marginBottom">
                        <Table @on-selection-change="selectionChangeEvent" :height="tableHeight" size="small" :loading="batchLoading" border ref="selection" :columns="batchColumns" :data="batchList"></Table>
                    </Col>
                    <Col class="textRight">
                        <Page :total="batchTotal" show-elevator :page-size-opts="batchOpts" :show-total="true" :page-size="batchSize" @on-change="changePageIndex" :show-sizer="true" @on-page-size-change="changePageSize"></Page>
                    </Col>
                </Row>
            </div>
        </layout>
        <modal
            :isShow="isBatchShow"
            :loading="isBatchLoading"
            :title="isBatchTitle"
            :width="600"
            :isSubmit="!isShowDetail"
            :isCancel="!isShowDetail"
            @submit="isBatchSubmit"
            @cancel="isBatchCancel"
        >
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="11">
                            <FormItem label="物料：" prop="selectProductCode" class="formItemMargin">
                                <p class="modal-readonly" v-show="isShowDetail">{{ formValidate.selectProductCode }}</p>
                                <div v-show="!isShowDetail" class="select-product-search">
                                    <Select
                                            ref="setQuery"
                                            class="select-product-select"
                                            placeholder="填写产品编码或名称"
                                            v-model="formValidate.selectProductCode"
                                            filterable
                                            clearable
                                            remote
                                            @on-change="changeProduct"
                                            @on-clear ="clearProduct"
                                            :remote-method="remoteMethod"
                                            :loading="loading">
                                        <Option v-for="(option, index) in curProductList" :value="option.codeName" :key="index">{{option.codeName}}</Option>
                                    </Select>
                                    <Icon @click="searchProductVal" class="select-product-icon-search" type="ios-search" />
                                </div>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="规格：" prop="models" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.productModels }}</p>
                                <!--<Input v-else type="text" v-model="formValidate.name" placeholder="请输入名称"/>-->
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="批号：" prop="batchCode" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ formValidate.batchCode }}</p>-->
                                <p class="modal-readonly" v-if="isShowDetail">{{ formValidate.batchCode }}</p>
                                <Input type="text" v-else v-model="formValidate.batchCode" placeholder="请输入批号"/>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="批号日期：" prop="batchDate" class="formItemMargin">
                                <!--<p class="modal-readonly">{{ formValidate.date }}</p>-->
                                <!--<Input type="text" v-model="formValidate.date" placeholder="请输入批号日期"/>-->
                                <p class="modal-readonly" v-if="isShowDetail">{{ formValidate.batchDate }}</p>
                                <DatePicker type="date" @on-change="changeBatchData" v-else :value="formValidate.batchDate" placeholder="请选择日期" style="width: 100%"></DatePicker>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                            <FormItem label="批号状态：" prop="batchState" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.batchStateName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="数据状态：" prop="auditState" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.auditStateName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                    <xw-operation-log
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :operationList="operationList"
                    >
                    </xw-operation-log>
                </Form>
            </div>
        </modal>
        <modal
                :isShow="selectProductShow"
                :loading="loading"
                :width="800"
                :title="'选择产品'"
                @cancel="selectProductCancel"
                @submit="selectProductSubmit"
        >
            <div slot="content">
                <div class="endFlex marginBottom">
                    <Cascader clearable change-on-select @on-change="changeProductCategory" v-model="value1" ref="CascaderType" class="formWidth textLeft" placeholder="请选择物料分类" :data="productCategoryList"></Cascader>
                    <Select clearable class="textLeft formWidth marginButtonLeft" @on-change="changeCascaderType" v-model="curProductTypeId" placeholder="请选择存货类型">
                        <Option v-for="item in stockTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input @on-change="changeProductCodeName" clearable class="formWidth textLeft marginButtonLeft" type="text" v-model="codeName" placeholder="请输入产品编码或名称"/>
                </div>
                <Table :highlight-row="true" @on-row-dblclick="dbClickSelectProduct" @on-row-click="clickRowProduct" class="marginBottom" size="small" :columns="selectProductColumns" :data="selectProductData" :height="420" border :loading="selectProductLoading"></Table>
                <!--<Page class="textRight" :total="selectProductTotal" show-elevator :page-size-opts="selectProductPageOpts" show-total :page-size="selectProductSize" @on-change="changePageIndexProduct" show-sizer @on-page-size-change="changePageSizeProduct"></Page>-->
            </div>
        </modal>
    </div>
</template>

<script>
import batch from './batch';
export default {
    ...batch,
    name: 'batch'
};
</script>

<style scoped>
    .select-product-select{
        padding-right: 32px;
    }
    .select-product-search{
        width: 100%;
        position: relative;
        top: 0;
        left: 0
    }
    .select-product-icon-search{
        font-size: 12px;
        text-align: center;
        position: absolute;
        line-height: 32px;
        height: 32px;
        display: inline-block;
        width: 34px;
        right: 0;
        top: 1px;
        border: 1px solid #dcdee2;
        border-left: none;
        cursor: pointer;
        border-bottom-right-radius: 4px;
        border-top-right-radius: 4px;
    }
</style>

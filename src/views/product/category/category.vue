<template>
    <div>
        <Card>
            <Row :gutter='16'>
                <Col span="4">
                    <Card  dis-hover>
                        <Tree :data="treeData" @on-select-change="handleTree"></Tree>
                    </Card>
                </Col>
                <Col span="20">
                    <Row class="flexBetween">
                        <Col class="leftFlex">
                            <Button icon="md-add" class="buttonBottom" @click="addNewMaterial" type="primary">新增</Button>
                            <Dropdown class="marginButtonLeft" trigger="click">
                                <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                                    审核
                                    <Icon type="ios-arrow-down"></Icon>
                                </Button>
                                <DropdownMenu slot="list">
                                    <DropdownItem  @click.native="auditMaterialType">审核</DropdownItem>
                                    <DropdownItem @click.native="unAuditMaterialType">反审核</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Button class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteMaterialType">删除</Button>
                        </Col>
                        <Col>
                            <Select clearable class="formWidth marginBottom" v-model="curStockTypeId" placeholder="请选择存货类型">
                                <Option v-for="item in stockTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                            <Button icon="ios-search" class="marginBottom" type="primary" @click="searchMaterialType">搜索</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Table border :height="tableHeight" @on-selection-change="changeProductCategory" size="small" :columns="tableColumns" :data="tableData"></Table>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="categoryShow"
            :loading="categoryLoading"
            :title="categoryTitle"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="categorySubmit('newFormValidate')"
            @cancel="categoryCancel"
            :WarnMsg="categoryMsg"
        >
            <div slot="content">
                <Form :label-width="90" ref="newFormValidate" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                    <FormItem label="上级分类：" class="formItemMargin" prop="parent">
                        <p v-if="!isCouldSave"> {{newFormValidate.parentName}} </p>
                        <span v-else>{{newFormValidate.parentName}}</span>
                    </FormItem>
                    <FormItem label="分类编码：" class="formItemMargin" prop="code">
                        <p v-if="!isCouldSave"> {{newFormValidate.code}} </p>
                        <Input v-else v-model="newFormValidate.code" style="ime-mode:disabled" placeholder="请输入编码"></Input>
                    </FormItem>
                    <FormItem label="分类名称：" class="formItemMargin" prop="name">
                        <p v-if="!isCouldSave"> {{newFormValidate.name}} </p>
                        <Input v-else v-model="newFormValidate.name" placeholder="请输入名称"></Input>
                    </FormItem>
                    <FormItem label="存货类型：" class="formItemMargin" prop="stockTypeId">
                        <p v-if="!isCouldSave"> {{newFormValidate.stockTypeName}} </p>
                        <Select v-else v-model="newFormValidate.stockTypeId" placeholder="请选择存货类型">
                            <Option v-for="(item, index) in stockTypeList" :value="item.id" :key="index">{{ item.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="物料属性：" class="formItemMargin">
                        <p v-if="!isCouldSave"> {{productPropertyItemNames}} </p>
                        <Select v-else  filterable multiple v-model="productPropertyItem" placeholder="请选择物料属性">
                            <Option v-for="(property, index) in productProperty" :value="property.id" :key="index">{{ property.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否配件：" class="formItemMargin" prop="isParts">
                        <p v-if="!isCouldSave"> {{newFormValidate.isParts ? '是' : '否'}} </p>
                        <Checkbox v-else v-model="newFormValidate.isParts">是否配件</Checkbox>
                    </FormItem>
                    <FormItem label="批号管理：" class="formItemMargin" prop="enableBatch">
                        <p v-if="!isCouldSave"> {{newFormValidate.enableBatch ? '是' : '否'}} </p>
                        <Checkbox v-else v-model="newFormValidate.enableBatch">启用</Checkbox>
                    </FormItem>
                </Form>
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
            :v-model="warnShow"
            :tipMsg="warnMessage"
            :loading="deleteLoading"
            @cancel="onCancelWarn"
            @confirm="onConfirmWarn"
        ></delete-warning>
    </div>
</template>
<script>
import category from './category';
export default {
    ...category,
    name: 'category'
};
</script>

<style scoped>

</style>

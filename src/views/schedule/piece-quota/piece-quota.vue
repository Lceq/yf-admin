<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="add" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="!selectIds.length" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="audit">审核</DropdownItem>
                            <DropdownItem @click.native="unAudit">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="!selectIds.length" class="marginBottom marginButtonLeft" type="error" @click="deleteList" icon="ios-trash">删除</Button>
                </Col>
                <Col>
                    <Select class="formWidth marginBottom" v-model="workshopId" placeholder="请选择车间">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="processId" placeholder="请选择工序">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="codeName" placeholder="请输入产品编码或名称"/>
                    <Button class="marginBottom" type="primary" @click="searchList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="select" :height="tableHeight" ref="selection" size="small" border :columns="columns" :data="list"></Table>
                    <Page class="textRight" :total="total" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="show"
            :loading="loading"
            :title="title"
            :width="1000"
            :isSubmit="isSave"
            :isCancel="isSave"
            @submit="submit"
            @cancel="cancel"
        >
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="日期：" prop="date" class="formItemMargin">
                                <DatePicker class="" clearable @on-change="changeDate" type="date" placeholder="请选择日期" :clearable="false" :value="formValidate.date"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                                <Select class=" marginBottom" v-model="formValidate.workshopId" placeholder="请选择车间">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="计件单位：" prop="pieceUnitId" class="formItemMargin">
                                <Select  class=" marginBottom" v-model="formValidate.pieceUnitId" placeholder="请选择岗位">
                                    <Option v-for="item in pieceUnitList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="产品：" prop="productNameCode" class="formItemMargin">
                                <p v-if="editId" class="modal-readonly"> {{ formValidate.productNameCode }} </p>
                                <xw-product-piece
                                    v-else
                                    :workshopId="formValidate.workshopId"
                                    :productMath="formValidate.productMath"
                                    :productList="productList"
                                    @submit="submitProduct"
                                >
                                </xw-product-piece>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="规格：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.models }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="所属工序：" prop="processName" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.processName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div class="marginBottom">
                    <Table :height="350" border :data="fixedList" :columns="fixedColumns"></Table>
                </div>
                <div v-if="editId">
                    <xw-operation-log-modal
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :operationList="operationList">
                    </xw-operation-log-modal>
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
import pieceQuota from './piece-quota';
export default {
    ...pieceQuota,
    name: 'piece-quota'
};
</script>

<style scoped>

</style>

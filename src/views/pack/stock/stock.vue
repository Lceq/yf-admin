<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'包装'" :curTabStateId="stateId" :stateList="stateList">
            <div slot="content">
                <Row class="parentFlexBetween" id="selectedHeight">
                    <Col class="leftFlex">
                        <Button  v-show="stateId === 1" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="primary" @click="audit">审核</Button>
                        <Button  v-show="stateId === 1" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="error" @click="deleteList">删除</Button>
                    </Col>
                    <Col>
                        <span class="formSpanStyle">日期：</span>
                        <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :value="dateFrom"></DatePicker>
                        <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :value="dateTo"></DatePicker>
                        <Select class="formEachStyle textLeft" clearable v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                        <Input clearable v-model="code" placeholder="请输入库申请单号" class="formWidth marginBottom" />
                        <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table border :data="list"  @on-selection-change="select" :columns="columns" :height="tableHeight"></Table>
                    </Col>
                </Row>
            </div>
        </layout>
        <modal
            :isShow="show"
            :loading="loading"
            :title="title"
            :width="800"
            :isSubmit="isSave"
            :isCancel="isSave"
            @submit="submit"
            @cancel="cancel"
            >
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="入库申请单号：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.code }}</p>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="申请日期：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.stockDate }}</p>
<!--                                <DatePicker class="formEachStyle" clearable  type="date" placeholder="请选择日期" :clearable="false" :value="formValidate.stockDate"></DatePicker>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产车间：" prop="code" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.workshopName }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table border :data="packInList" :columns="packInColumns" :height="300"></Table>
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
import stock from './stock';
export default {
    ...stock,
    name: 'stock'
};
</script>

<style scoped>

</style>

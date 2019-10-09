<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'包装'" :curTabStateId="stateId" :stateList="stateList">
            <div slot="content">
                <Row class="parentFlexBetween" id="selectedHeight">
                    <Col class="leftFlex">
                        <Button icon="md-add" v-show="stateId === 1" class="marginBottom margin-right-5" type="primary" @click="add">新增</Button>
                        <Button icon="ios-create" v-show="stateId === 1" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="primary" @click="refer">提交</Button>
                        <Button icon="ios-trash"  v-show="stateId === 1" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="error" @click="deleteList">删除</Button>
                        <Button icon="ios-undo" v-show="stateId === 2" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="warning" @click="unrefer">撤销提交</Button>
                        <Button icon="md-done-all" v-show="stateId === 2" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="primary" @click="audit">审核</Button>
                        <Button icon="md-refresh" v-show="stateId === 3" :disabled="!selectIds.length" class="marginBottom margin-right-5" type="warning" @click="unaudit">撤销审核</Button>
                    </Col>
                    <Col>
                        <span class="formSpanStyle">日期：</span>
                        <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                        <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                        <Select class="formEachStyle textLeft" v-model="workshopId">
                            <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                        </Select>
                        <Select clearable class="formWidth marginBottom" v-model="shiftId" placeholder="请选择班次">
                            <Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                        <Button icon="ios-search" class="marginBottom" type="primary" @click="searchResult">搜索</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table class="marginBottom" border :data="list"  @on-selection-change="select" :columns="columns" :height="tableHeight"></Table>
                        <Page class="textRight" :total="total" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                    </Col>
                </Row>
            </div>
        </layout>
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
                            <FormItem label="当班日期：" prop="date" class="formItemMargin">
                                <DatePicker class="formEachStyle" clearable @on-change="changeDate" type="date" placeholder="请选择日期" :clearable="false" :value="formValidate.date"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="生产车间：" prop="workshopId" class="formItemMargin">
                                <Select class="formEachStyle textLeft" @on-change="changeWorkshop" v-model="formValidate.workshopId">
                                    <Option v-for="item in workshopList"  :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="班次：" prop="shiftId" class="formItemMargin">
                                <Select clearable class="formWidth marginBottom" @on-change="changeShift" v-model="formValidate.shiftId" placeholder="请选择班次">
                                    <Option v-for="item in wShiftList" :value="item.shiftId" :key="item.shiftId">{{ item.shiftName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="备注：" prop="remarks" class="formItemMargin">
                                <Input v-model="formValidate.remarks" type="textarea" :rows="2" placeholder="输入..." />
                            </FormItem>
                            <!---->
                        </Col>
                    </Row>
                </Form>
                <Button type="success" @click="addList" class="marginBottom">添加计时明细</Button>
                <Table border :data="packInList" :columns="packInColumns" :height="300"></Table>
                <div class="endFlex">
                    <p class="result">合计:</p>
                    <p class="result">{{ hours }}</p>
                    <p class="result">{{ amount }}</p>
                </div>
                <div v-if="">
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
        <modal
            :isShow="userShow"
            :loading="userLoading"
            :title="userTitle"
            :width="1000"
            @submit="userSubmit"
            @cancel="userCancel"
        >
            <div slot="content">
                <Table border :data="userDataList" @on-selection-change="changeUserList" :columns="userColumns" :height="500"></Table>
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
import stock from './product-time';
export default {
    ...stock,
    name: 'stock'
};
</script>
<style scoped>
.result {
    width: 100px;
    text-align: right;
    padding-right: 30px;
    display: inline-block;
}
</style>

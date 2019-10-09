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
                    <span class="formSpanStyle">日期：</span>
                    <DatePicker class="formEachStyle" clearable @on-change="changeStartDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateFrom"></DatePicker>
                    <DatePicker class="formEachStyle" clearable @on-change="changeEndDate" type="date" placeholder="请选择日期" :clearable="false" :value="dateTo"></DatePicker>
                    <Select clearable class="formWidth marginBottom" v-model="workshopId" placeholder="请选择车间">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="shiftId" placeholder="请选择班次">
                        <Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <!--<Select clearable class="formWidth marginBottom" v-model="stateId" placeholder="请选择数据状态">-->
                        <!--<Option v-for="item in stateList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <!--<Input class="formWidth marginBottom" type="text" v-model="codeName" placeholder="输入区域编号或名称"/>-->
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
                :width="800"
                :isSubmit="isSave"
                :isCancel="isSave"
                @submit="submit"
                @cancel="cancel"
        >
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="区域编号：" prop="code" class="formItemMargin">
                                <Input class=" " type="text" v-model="formValidate.code" placeholder="输入区域编号或名称"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="区域名称：" prop="name" class="formItemMargin">
                                <Input class=" " type="text" v-model="formValidate.name" placeholder="输入区域编号或名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="所属车间：" prop="workshopId" class="formItemMargin">
                                <Select  class=" " v-model="formValidate.workshopId" placeholder="请选择岗位">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="所属工序：" prop="processId" class="formItemMargin">
                                <Select  class=" " v-model="formValidate.processId" placeholder="请选择工序">
                                    <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="备注：" prop="remark" class="formItemMargin">
                                <Input class=" " type="text" v-model="formValidate.remark" placeholder="备注"/>
                            </FormItem>
                        </Col>
                    </Row>
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
    </div>
</template>

<script>
import productTime from './product-time';
export default {
    ...productTime,
    name: 'enviroment'
};
</script>

<style scoped>

</style>

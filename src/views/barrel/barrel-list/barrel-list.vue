<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewBarrel" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditBarrel">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditBarrel">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="auditDisabled"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteBarrel">删除</Button>
                </Col>
                <Col>
                    <Select class="formWidth marginBottom" v-model="curWorkshopId" placeholder="车间...">
                        <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="codeName" placeholder="请输入机台编码、名称"/>
                    <Button class="marginBottom" type="primary" @click="searchBarrelList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectBarrel" :height="tableHeight" ref="selection" size="small" border :columns="barrelColumns" :data="barrelList"></Table>
                    <Page class="textRight" :total="barrelTotal" show-elevator :page-size-opts="barrelPageOpts" show-total :page-size="barrelPageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="isShow"
            :loading="loading"
            :title="title"
            :width="800"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="submit"
            @cancel="cancel"
            :WarnMsg="warnMsg">
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="条筒编码：" prop="code" class="formItemMargin">
                                <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.code }}</p>-->
                                <Input type="text" v-model="formValidate.code" placeholder="请输入编码"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="条筒名称：" prop="name" class="formItemMargin">
                                <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>-->
                                <Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="所属车间：" prop="curWorkshopId" class="formItemMargin">
                                <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>-->
                                <!--<Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>-->
                                <Select class="marginBottom" v-model="formValidate.curWorkshopId" placeholder="请选择数据状态">
                                    <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="数据状态：" prop="auditStateName" class="formItemMargin">
                                <p v-if="" class="modal-readonly">{{ formValidate.auditStateName }}</p>
                                <!--<Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>-->
                            </FormItem>
                        </Col>
                        <Col span="24">
                            <FormItem label="RFID标签编码：" prop="rfidCode" class="formItemMargin">
                                <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>-->
                                <Input v-model="formValidate.rfidCode" type="textarea" :rows="4" placeholder="RFID标签编码..." />
                                <!--<Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>-->
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <xw-operation-log-modal
                    :createName="createName"
                    :createTime="createTime"
                    :updateName="updateName"
                    :updateTime="updateTime"
                    :operationList="operationList">
                </xw-operation-log-modal>
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
import barrelJs from './barrel-list';
export default {
    ...barrelJs,
    name: 'barrel-list'
};
</script>

<style scoped>

</style>

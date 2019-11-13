<template>
    <div>
        <Card>
            <Row :gutter='16'>
                <Col>
                    <Row id="selectedHeight">
                        <Button icon="md-add" class="buttonBottom" @click="addNewRole" type="primary">新增</Button>
                        <Dropdown class="marginButtonLeft" trigger="click">
                            <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                                审核
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="auditShift">审核</DropdownItem>
                                <DropdownItem @click.native="unAuditShift">反审核</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Row>
                    <Row class="margin-top-10">
                        <Table :height="tableHeight" @on-selection-change="selectShift" size="small" :loading="tableLoading" border ref="selection" :columns="columns4" :data="tableData"></Table>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    <modal
                        :isShow="addEditShow"
                        :title="addEditData"
                        :loading="loading"
                        :isSubmit="isCouldSave"
                        :isCancel="isCouldSave"
                        @cancel="newAddLowerCancel"
                        @submit="submitAddSubordinate('newFormValidate')"
                    >
                        <div slot="content">
                            <Form :label-width="130" ref="newFormValidate" :model="newFormValidate" :rules="newFormValidateRules" :show-message="false">
                                <Row>
                                    <Col :span="20">
                                        <FormItem label="班制名称：" class="formItemMargin" prop="typeName">
                                            <p v-if="!isCouldSave" class="modal-readonly">{{ newFormValidate.typeName }}</p>
                                            <Select v-else v-model="newFormValidate.typeName">
                                                <Option v-for="item in shiftData" :value="item.typeId" :key="item.typeId">{{item.typeName}}</Option>
                                            </Select>
                                        </FormItem>
                                        <FormItem label="班次名称：" class="formItemMargin" prop="name">
                                            <p v-if="!isCouldSave" class="modal-readonly">{{ newFormValidate.name }}</p>
                                            <Input v-else v-model="newFormValidate.name" placeholder="请输入班次名称"></Input>
                                        </FormItem>

                                        <FormItem class="formItemMargin" prop="beginHour" label="开始时间：">
                                            <p v-if="!isCouldSave" class="modal-readonly">{{ newFormValidate.beginHour }}</p>
                                            <TimePicker v-else v-model="newFormValidate.beginHour" @on-change="getBeginTime" format="HH:mm" :value="beginHour" placeholder="请选择时间" style="width: 112px"></TimePicker>
                                        </FormItem>
                                        <FormItem class="formItemMargin" prop="endHour" label="结束时间：">
                                            <p v-if="!isCouldSave" class="modal-readonly">{{ newFormValidate.endHour }}</p>
                                            <TimePicker v-else  v-model="newFormValidate.endHour" @on-change="getEndTime" format="HH:mm" :value="endHour" placeholder="请选择时间" style="width: 112px"></TimePicker>
                                        </FormItem>
                                        <FormItem label="工时：" class="formItemMargin" prop="workingHours">
                                            <!--<p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.beginHour }}</p>-->
                                            <!--<Input v-model="newFormValidate.name" placeholder="请输入班组名称"></Input>-->
                                            <p class="modal-readonly">{{ newFormValidate.workingHours }}</p>
                                        </FormItem>
                                        <FormItem class="formItemMargin" prop="remark" label="备注：">
                                            <!--<p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.beginHour }}</p>-->
                                            <Input :disabled="!isCouldSave" v-model="newFormValidate.remark" type="textarea" :rows="4" placeholder="请输入..."></Input>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                            <xw-operation-log
                                :createName="createName"
                                :createTime="createTime"
                                :updateName="updateName"
                                :updateTime="updateTime"
                                :auditName="auditName"
                                :auditTime="auditTime"
                            >
                            </xw-operation-log>
                        </div>
                    </modal>
                    <delete-warning
                            :v-model="warnShow"
                            :tipMsg="warnMessage"
                            :loading="deleteLoading"
                            @cancel="onCancelWarn"
                            @confirm="onConfirmWarn"
                    ></delete-warning>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
import shift from './shift';
export default {
    ...shift,
    name: 'shift'
};
</script>

<style scoped>

</style>

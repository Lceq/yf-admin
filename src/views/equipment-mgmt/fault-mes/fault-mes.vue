<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewType" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="!selectedIds.length" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditType">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditType">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="!selectedIds.length"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteType">删除</Button>
                </Col>
                <Col>
                    <span class="formSpanStyle">工序：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="processId" placeholder="请选择工序">
                        <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">故障类别：</span>
                    <Select class="formEachStyle textLeft" @on-change="changeFaultType" :clearable="true" v-model="faultTypeId" placeholder="请选择故障类别">
                        <Option v-for="item in faultTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">故障小类：</span>
                    <Select class="formEachStyle textLeft" :clearable="true" v-model="faultSubId" placeholder="请选择故障小类">
                        <Option v-for="item in faultSubList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">状态：</span>
                    <Select clearable class="formWidth marginBottom" v-model="auditState" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <span class="formSpanStyle">名称/编码：</span>
                    <Input class="formWidth marginBottom" type="text" v-model="nameCode" placeholder="请输入故障小类编码或名称"/>
                    <Button class="marginBottom" type="primary" @click="searchTypeList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectType" :height="tableHeight" ref="selection" size="small" border :columns="typeColumns" :data="typeData"></Table>
                    <Page class="textRight" :total="typeTotal" show-elevator :page-size-opts="pageOpts" show-total :page-size="pageSize" @on-change="changePageIndex" show-sizer @on-page-size-change="changePageSize"></Page>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="typeShow"
                :loading="typeLoading"
                :title="typeTitle"
                :width="800"
                :isSubmit="isCouldSave"
                :isCancel="isCouldSave"
                @submit="typeSubmit"
                @cancel="typeCancel"
                :WarnMsg="typeMsg">
            <div slot="content">
                <Form :label-width="120" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="故障编码：" prop="code" class="formItemMargin">
                                <Input type="text" v-model="formValidate.code" placeholder="请输入故障编码"/>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="故障别名：" prop="alias" class="formItemMargin">
                                <Input type="text" v-model="formValidate.alias" placeholder="请输入故障别名"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="故障描述：" prop="name" class="formItemMargin">
                                <Input type="text" :rows="2" v-model="formValidate.name" placeholder="请输入故障描述"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="故障类别：" prop="faultTypeId" class="formItemMargin">
                                <Select class=" textLeft" @on-change="changeFaultTypeModal" placeholder="请选择故障类别" v-model="formValidate.faultTypeId">
                                    <Option v-for="item in faultTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="故障小类：" prop="faultSubclassId" class="formItemMargin">
                                <Select class="textLeft" v-model="formValidate.faultSubclassId"  placeholder="请选择故障小类">
                                    <Option v-for="item in formValidate.faultSubList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12">
                            <FormItem label="工序：" prop="processId" class="formItemMargin">
                                <Select class=" textLeft" :clearable="true" v-model="formValidate.processId" placeholder="请选择工序">
                                    <Option v-for="item in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="状态：" prop="auditState" class="formItemMargin">
                                <p class="modal-readonly">{{ formValidate.auditState === 1 ? '创建' : '审核' }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div v-if="isEdit">
                    <xw-operation-log
                            :createName="createName"
                            :createTime="createTime"
                            :updateName="updateName"
                            :updateTime="updateTime"
                            :operationList="operationList"
                    >
                    </xw-operation-log>
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
    import fault from './fault-mes';
    export default {
        ...fault
    };
</script>

<style scoped>

</style>

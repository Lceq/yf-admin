<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewPost" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditPost">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditPost">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="auditDisabled"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deletePost">删除</Button>
                    <Button type="success" @click="syncOrgEvent" class="marginBottom marginButtonLeft">同步</Button>
                </Col>
                <Col>
                    <Select class="formWidth textLeft marginBottom" placeholder="请选择岗位分类" clearable v-model="curPostType">
                        <Option v-for="(item, index) in postTypeList" :value="item.code" :key="item.index">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="marginBottom formWidth" v-model="curProcessId" placeholder="请选择工序">
                        <Option v-for="item in processList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="postCode" placeholder="请输入岗位编码或名称"/>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchPostList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectPost" :height="tableHeight" ref="selection" size="small" border :columns="postColumns" :data="postData"></Table>
                    <Page class="textRight" :total="postTotal" show-elevator :page-size-opts="postPageOpts" show-total :page-size="postPageSize" @on-change="changePageIndexPost" show-sizer @on-page-size-change="changePageSizePost"></Page>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="postShow"
                :loading="postLoading"
                :title="postTitle"
                :isSubmit="isCouldSave"
                :isCancel="isCouldSave"
                @submit="postSubmit('formValidate')"
                @cancel="postCancel"
                :WarnMsg="postMsg">
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="22">
                            <FormItem label="岗位编码：" prop="code" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.code }}</p>
                                <Input v-else type="text" v-model="formValidate.code" placeholder="请输入岗位编码"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="22">
                            <FormItem label="岗位名称：" prop="name" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.name }}</p>
                                <Input v-else type="text" v-model="formValidate.name" placeholder="请输入岗位名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="22">
                            <FormItem label="岗位分类：" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.typeName }}</p>
                                <Select v-else label-in-value v-model="formValidate.type">
                                    <Option v-for="item in postTypeList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                            <FormItem label="岗位属性：" class="formItemMargin">
                                <CheckboxGroup v-model="formValidate.property">
                                    <!--<Checkbox label="1">计件</Checkbox>-->
                                    <Checkbox :disabled="!isCouldSave" label="1">看台</Checkbox>
                                    <Checkbox :disabled="!isCouldSave" label="2">维修</Checkbox>
                                </CheckboxGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                            <FormItem label="工资核算方式：" class="formItemMargin">
                                <RadioGroup v-model="formValidate.wageType">
                                    <Radio :disabled="!isCouldSave" label="1">计件</Radio>
                                    <Radio :disabled="!isCouldSave" label="2">计台</Radio>
                                    <Radio :disabled="!isCouldSave" label="3">计时</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                            <FormItem label="所属工序：" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.processName }}</p>
                                <Select v-else clearable label-in-value v-model="formValidate.processId">
                                    <Option v-for="(item,index) in processList" :style="item.style" :value="item.id" :key="index">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormItem label="是否常日班：" prop="isRegularDaily" class="formItemMargin">
                                <RadioGroup v-model="formValidate.isRegularDaily">
                                    <Radio :disabled="!isCouldSave" label="1">是</Radio>
                                    <Radio :disabled="!isCouldSave" label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="18">
                            <FormItem label="排序：" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.sortNum }}</p>
                                <InputNumber v-else :max="100" :min="1" v-model="formValidate.sortNum"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div v-if="isEdit">
                    <other-message
                            :createName="createName"
                            :auditName="auditName"
                            :createTime="createTime"
                            :updateName="updateName"
                            :updateTime="updateTime"
                            :auditTime="auditTime"
                    >
                    </other-message>
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
        <sync-modal
                :modal-state="syncModalState"
                @on-visible-change="onSyncModalVisibleChangeEvent"
                @on-confirm="onSyncModalConfirmEvent"
        ></sync-modal>
    </div>
</template>

<script>
import post from './post';
export default {
    ...post,
    name: 'post'
};
</script>

<style scoped>

</style>

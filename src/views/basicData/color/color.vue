<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewColor" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditColor">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditColor">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="auditDisabled"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteColor">删除</Button>
                </Col>
                <Col>
                    <Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">
                        <Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Input class="formWidth marginBottom" type="text" v-model="colorCode" placeholder="输入产品色号或名称"/>
                    <Button class="marginBottom" type="primary" @click="searchColorList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectColor" :height="tableHeight" ref="selection" size="small" border :columns="colorColumns" :data="colorData"></Table>
                    <Page class="textRight" :total="colorTotal" show-elevator :page-size-opts="colorPageOpts" show-total :page-size="colorPageSize" @on-change="changePageIndexColor" show-sizer @on-page-size-change="changePageSizeColor"></Page>
                </Col>
            </Row>
        </Card>
        <modal
            :isShow="colorShow"
            :loading="colorLoading"
            :title="colorTitle"
            :isSubmit="isCouldSave"
            :isCancel="isCouldSave"
            @submit="colorSubmit('formValidate')"
            @cancel="colorCancel"
            :WarnMsg="colorMsg">
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="22">
                            <FormItem label="色号：" prop="code" class="formItemMargin">
                                <p v-if="isEdit" class="modal-readonly">{{ formValidate.code }}</p>
                                <Input v-else type="text" v-model="formValidate.code" placeholder="请输入色号"/>
                            </FormItem>

                            <FormItem label="名称：" prop="name" class="formItemMargin">
                                <p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>
                                <Input v-else type="text" v-model="formValidate.name" placeholder="请输入名称"/>
                            </FormItem>
                            <FormItem label="颜色值：" prop="color" class="formItemMargin">
                                <!--<Input type="text" v-model="formValidate.value" placeholder="请输入颜色值"/>-->
                                <ColorPicker :disabled="!isCouldSave" v-model="colorValue" /> <span class="marginLeft">{{ colorValue }}</span>
                                <!--<ColorPicker v-model="formValidate.color" />-->
                            </FormItem>
                            <!--<FormItem label="排序：" class="formItemMargin">-->
                                <!--<InputNumber :max="10" :min="1" v-model="formValidate.sortNum"></InputNumber>-->
                            <!--</FormItem>-->
                        </Col>
                    </Row>
                </Form>
                <div v-if="isEdit">
                    <other-message
                        :createName="createName"
                        :auditName="auditName"
                        :createTime="createTime"
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
    </div>
</template>

<script>
import color from './color';
export default {
    ...color,
    name: 'color'
};
</script>

<style scoped>

</style>

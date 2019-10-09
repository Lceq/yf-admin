<template>
    <card>
        <Row>
            <Col span="12" class="headerMargin">
                <Button icon="md-add" type="primary" @click="addUnitEvent">新增</Button>
                <Dropdown class="marginButtonLeft" trigger="click">
                    <Button class="" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                        审核
                        <Icon type="ios-arrow-down"></Icon>
                    </Button>
                    <DropdownMenu slot="list">
                        <DropdownItem  @click.native="auditUnit">审核</DropdownItem>
                        <DropdownItem @click.native="unAuditUnit">反审核</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Button icon="ios-trash" type="error" :disabled="auditDisabled"  @click="deleteUnitEvent">删除</Button>
            </Col>
        </Row>
        <Row>
            <Table :height="tableHeight"  size="small" ref="selection" border :columns="tableHeader" :data="tableData" @on-selection-change="selectUnit"></Table>
        </Row>
        <Row>
            <Col>
                <modal
                    :isShow="adEdModalState"
                    :title="measTitle"
                    :loading="buttonLoading"
                    :isSubmit="isCouldSave"
                    :isCancel="isCouldSave"
                    @submit="addConfirm('formValidate')"
                    @cancel="addCancel"
                >
                    <div slot="content">
                        <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                            <Row>
                                <Col span="22">
                                    <FormItem label="编码：" prop="code" class="formItemMargin">
                                        <!--<p v-if="!isCouldSave"  class="modal-readonly">{{ formValidate.code }}</p>-->
                                        <Input type="text" v-model="formValidate.code" placeholder="请输入编码"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="22">
                                    <FormItem label="名称：" prop="name" class="formItemMargin">
                                        <!--<p v-if="!isCouldSave"  class="modal-readonly">{{ formValidate.name }}</p>-->
                                        <!--<p v-if="isEdit" class="modal-readonly">{{ formValidate.name }}</p>-->
                                        <Input type="text" v-model="formValidate.name" placeholder="请输入名称"/>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="16">
                                    <FormItem label="小数位数：" class="formItemMargin">
                                        <!--<p v-if="!isCouldSave"  class="modal-readonly">{{ formValidate.preci }}</p>-->

                                        <InputNumber :disabled='!isCouldSave' :max="100" :min="0" v-model="formValidate.preci"></InputNumber>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="16">
                                    <FormItem label="基准计量单位：" class="formItemMargin">
                                        <RadioGroup v-model="formValidate.isBase">
                                            <Radio label="1">是</Radio>
                                            <Radio label="0">否</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span="16">
                                    <FormItem label="排序：" class="formItemMargin">
                                        <InputNumber :disabled='!isCouldSave' :max="100" :min="1" v-model="formValidate.sortNum"></InputNumber>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                        <xw-operation-log
                            :createName="createName"
                            :createTime="createTime"
                            :auditName="auditName"
                            :auditTime="auditTime"
                        >
                        </xw-operation-log>
                    </div>
                </modal>
            </Col>
        </Row>
        <Row>
            <Col>
                <tips-modal
                    :v-model="deleteTipsModalState"
                    :tipMsg="deleteTipsModalMsg"
                    :loading="deleteButtonLoading"
                    @cancel="deleteTipsModalCancel"
                    @confirm="deleteTipsModalConfirm"
                >
                </tips-modal>
            </Col>
        </Row>
    </card>
</template>

<script>
    import unit from './unit';
    export default {
        ...unit
    };
</script>

<style scoped>
    .formItemMargin{
        margin-bottom:10px;
    }
    .headerMargin{
        margin-bottom: 10px;
    }
</style>

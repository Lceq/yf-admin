<template>
    <div>
        <Card>
            <Row class="flexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button icon="md-add" class="buttonBottom" @click="addNewRoundel" type="primary">新增</Button>
                    <Dropdown class="marginButtonLeft" trigger="click">
                        <Button class="marginBottom" :disabled="auditDisabled" type="primary" href="javascript:void(0)">
                            审核
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem  @click.native="auditRoundel">审核</DropdownItem>
                            <DropdownItem @click.native="unAuditRoundel">反审核</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Button :disabled="auditDisabled"  class="marginBottom marginButtonLeft" type="error" icon="ios-trash" @click="deleteRoundel">删除</Button>
                </Col>
                <Col>
                    <!--<Select clearable class="formWidth marginBottom" v-model="curAuditStateId" placeholder="请选择数据状态">-->
                        <!--<Option v-for="item in auditStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                    <!--</Select>-->
                    <Input class="formWidth marginBottom" type="text" v-model="roundelNameCode" placeholder="请输入圆盘编码或名称"/>
                    <Button class="marginBottom" type="primary" @click="searchRoundelList">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table class="marginBottom" @on-selection-change="selectRoundel" :height="tableHeight" ref="selection" size="small" border :columns="roundelColumns" :data="roundelData"></Table>
                    <Page class="textRight" :total="roundelTotal" show-elevator :page-size-opts="roundelPageOpts" show-total :page-size="roundelPageSize" @on-change="changePageIndexRoundel" show-sizer @on-page-size-change="changePageSizeRoundel"></Page>
                </Col>
            </Row>
        </Card>
        <modal
                :isShow="roundelShow"
                :loading="roundelLoading"
                :title="roundelTitle"
                :isSubmit="isCouldSave"
                :isCancel="isCouldSave"
                :isPreview="true"
                @submit="roundelSubmit('formValidate')"
                @preview="roundelPreview"
                @cancel="roundelCancel">
            <div slot="content">
                <Form :label-width="100" ref="formValidate" :model="formValidate" :rules="ruleValidate" :show-message="false">
                    <Row>
                        <Col span="22">
                            <FormItem label="编码：" prop="code" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.code }}</p>
                                <Input v-else type="text" v-model="formValidate.code" placeholder="请输入编码"/>
                            </FormItem>

                            <FormItem label="名称：" prop="name" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.name }}</p>
                                <Input v-else type="text" v-model="formValidate.name" placeholder="请输入名称"/>
                            </FormItem>
                            <FormItem label="内圈包数：" prop="innerPacketNumber" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.innerPacketNumber }}</p>
                                <InputNumber v-else :max="100" :min="1" v-model="formValidate.innerPacketNumber"></InputNumber>
                            </FormItem>
                            <FormItem label="外圈包数：" prop="outerPacketNumber" class="formItemMargin">
                                <p v-if="!isCouldSave" class="modal-readonly">{{ formValidate.outerPacketNumber }}</p>
                                <InputNumber v-else :max="100" :min="1" v-model="formValidate.outerPacketNumber"></InputNumber>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div v-if="isEdit">
                    <xw-operation-log-modal
                        :createName="createName"
                        :createTime="createTime"
                        :updateName="updateName"
                        :updateTime="updateTime"
                        :operationList="operationList"
                    >
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
        <modal
            :isShow="roundelSeriesShow"
            :isSubmit="false"
            :isCancel="false"
            :isPreview="false"
            :width="640"
            :title="'清花圆盘图'"
            @cancel="roundelSeriesCancel"
        >
            <div slot="content" style="position: relative; height: 600px;" class="textCenter">
                <series-sh :roundelSeriesMath="roundelSeriesMath" :seriesList="seriesListOutSet" style=" position: absolute; left:0; top:0;"></series-sh>
                <div style="width: 400px; height: 400px;border-radius: 200px;overflow: hidden; position: absolute; left:100px; top:100px;">
                    <series-sh :roundelSeriesMath="roundelSeriesMath" :seriesList="seriesListInner"></series-sh>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import floralDisc from './floral-disc';
export default {
    ...floralDisc,
    name: 'floral-disc'
};
</script>

<style scoped>

</style>

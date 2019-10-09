<template>
    <Card>
        <Row id="selectedHeight">
            <Col>
                <Button icon="md-add" class="marginBottom" v-if="this.rightItems.add" @click="addAndEditProcessCombinate" type="primary">新增</Button>
            </Col>
        </Row>
        <Row id="TABLETOP">
            <Col>
                <Table :height="tableHeight" ref="selection" size="small" border :columns="processColumns" :data="processData"></Table>
            </Col>
        </Row>
        <modal
            :isShow="processCombinateModalShow"
            :loading="processCombinateModalLoading"
            :width="800"
            @cancel="processCombinateModalCancel"
            @submit="processCombinateModalSubmit('processCombinateItem')"
            :title="processCombinateModalMessage">
                <div slot="content">
                    <div>
                        <Form ref="processCombinateItem" :show-message="false" :model="processCombinateItem" :rules="ruleprocessCombinateItem" :label-width="110">
                            <FormItem class="formItemMargin" label="工序组合编码："  prop="code">
                                <Input v-if="!isReadonlyCode" :maxlength="100" @on-blur="blurProcessCombinateCode(processCombinateItem.code)" v-model="processCombinateItem.code" placeholder="请输入工序组合编码"></Input>
                                <p v-else class="modal-readonly">{{ processCombinateItem.code }}</p>
                            </FormItem>
                            <FormItem class="formItemMargin" style=""  label="工序组合名称："  prop="name">
                                <Input :maxlength="100" v-model="processCombinateItem.name" placeholder="请输入工序组合名称"></Input>
                            </FormItem>
                            <FormItem class="formItemMargin" style="width: 300px;" label="工序组合类别："  prop="typeId">
                                <Select v-model="processCombinateItem.typeId">
                                    <Option v-for="(item, index) of processTypeList" :key="index" :value="item.id">{{ item.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem class="formItemMargin"  label="工序组合排序：">
                                <InputNumber :max="99999" :min="1" v-model="processCombinateItem.sortNum"></InputNumber>
                            </FormItem>
                        </Form>
                    </div>
                    <Table class="marginBottom" size="small" border :height="200" :columns="processCombinateDetailColumns" :data="processCombinateDetailData"></Table>
                    <div v-if="isReadonlyCode">
                        <other-message
                                :createName="createName"
                                :createTime="createTime"
                                :updateName="reverseName"
                                :updateTime="reverseTime"
                                :closeTime="forbidName"
                                :closeName="forbidTime"
                        >
                        </other-message>
                    </div>
                </div>
        </modal>
        <delete-warning
                :v-model="warnProcessCombinateShow"
                :tipMsg="warnProcessCombinateMessage"
                :loading="deleteProcessCombinateLoading"
                @cancel="onCancelWarnProcessCombinate"
                @confirm="onConfirmWarnProcessCombinate"
        ></delete-warning>
    </Card>
</template>

<script>
import process from './process';
export default {
    ...process,
    name: 'process'
};
</script>

<style scoped>

</style>

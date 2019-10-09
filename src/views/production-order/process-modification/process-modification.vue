<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'维修状态'" :curTabStateId="curCompletionState" :stateList="orderStateList">
            <div slot="content">
                <div>
                    <Row class="endFlex marginBottom" id="selectedHeight">
                        <Col class="">
                            <Row class="marginBottom">
                                <Col>
                                    <span class="formSpanStyle">预计开台时间：</span>
                                    <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" :clearable="true" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                                    <DatePicker class="formEachStyle " @on-change="changeEndTime" type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                                    <Select class="formEachStyle textLeft" v-model="workshopId" placeholder="请选择车间">
                                        <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                    </Select>
                                    <Select class="formEachStyle textLeft" clearable v-model="processId" placeholder="请选择工序">
                                        <Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row v-if="orderSelectedShow">
                                <Col>
                                    <span class="formSpanStyle">关键字搜索：</span>
                                    <Select class="formEachStyle textLeft" v-model="listStateId">
                                        <Option v-for="(item, index) in listState" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Input clearable class="formWidth" type="text" v-model="prdOrderNoticeCodeName" placeholder="请输入编码"/>
                                    <Select class="formEachStyle textLeft" v-show="curCompletionState === 1" v-model="settingState" placeholder="请选工艺设定状态">
                                        <Option v-for="(item, index) in settingStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Select class="formEachStyle textLeft" v-show="curCompletionState === 0" v-model="replacementState" placeholder="请选择配件更换状态">
                                        <Option v-for="(item, index) in replacementStateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                    </Select>
                                    <Input clearable class="formWidth" type="text" v-model="machineNameCode" placeholder="请输入生产机台"/>
                                </Col>
                            </Row>
                        </Col>
                        <Col class="marginBottom">
                            <a @click="orderShow" class="cycle">···</a>
                            <Button icon="ios-search" @click="searchResult" class=" verticalMiddle" type="primary">搜索</Button>
                        </Col>
                    </Row>
                </div>
                <Table class="marginBottom" :height="tableHeight" :loading="processModificationLoading" size="small" ref="selection" border :columns="processModificationColumns" :data="processModificationData"></Table>
                <Page class="textRight" show-elevator show-sizer show-total :total="pageTotal" :page-size="pageSize" :page-size-opts="pageOpts" :placement="pageUp" @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
            </div>
        </layout>
        <modal
            :isShow="isProcessModification"
            :loading="isProcessModificationLoading"
            :width="1000"
            :title="isProcessModificationTitle"
            @cancel="processModificationCancel"
            @submit="processModificationSubmit"
        >
            <div slot="content">
                <Form :label-width="90" ref="processModificationForm" :rules="processModificationFormRule" :model="processModificationForm" :show-message="false">
                    <Row>
                        <Col span="8">
                            <FormItem label="设备机型:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.machineModelName }}</div>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="标准克重:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.gramWeight }}</div>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="标准米长:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.meters }}</div>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="台时单产:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.hourYield }}</div>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="公定回潮率%:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.moistureRegain }}</div>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="运转效率%:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.efficiencyPercent }}</div>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row v-if="!isChangeSpecSet">
                        <Col span="8">
                            <FormItem label="管圈类型:" class="formItemMargin" prop="tubeTypeId">
                                <Select class="formSWidth" @on-change="changeTubeType" clearable v-model="processModificationForm.tubeTypeId">
                                    <Option v-for="item in tubeType" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                                <!--<div class="modal-readonly">{{ processModificationForm.tubeTypeName }}</div>-->
                            </FormItem>
                        </Col>
                        <Col span="16">
                            <FormItem label="管圈颜色:" class="formItemMargin" prop="tubeColorIds">
                                <!--<Select class="formSWidth" v-model="processModificationForm.tubeColorIds" multiple>-->
                                    <!--<Option v-for="item in tubeColor" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                                <Select
                                    v-model="processModificationForm.tubeColorIds"
                                    multiple
                                    filterable
                                    remote
                                    :remote-method="remoteMethod2"
                                    @on-change="changeRemote"
                                    :loading="loading2">
                                    <Option v-for="(option, index) in options2" :value="option.id" :key="index">{{option.codeName}}</Option>
                                </Select>
                                <!--<div class="modal-readonly">{{ processModificationForm.tubeColorNames }}</div>-->
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <FormItem label="上机产品:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.productName }}</div>
                                <!--<Select class="formSWidth" v-model="processModificationForm.tubeTypeId">-->
                                    <!--<Option v-for="item in tubeType" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="改前产品:" class="formItemMargin">
                                <div class="modal-readonly">{{ processModificationForm.oldProductName }}</div>
                                <!--<Select class="formSWidth" v-model="processModificationForm.tubeColorIds" multiple>-->
                                    <!--<Option v-for="item in tubeColor" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <Table height="500" :loading="isProcessModificationModalLoading" size="small" ref="selection" border :columns="isProcessModificationColumns" :data="isProcessModificationData"></Table>
            </div>
        </modal>
    </div>
</template>

<script>
import processModification from './process-modification';
export default {
    ...processModification,
    name: 'process-modification'
};
</script>

<style scoped>
    .formSpanStyle{
        width: 140px !important;
        display: inline-block;
        text-align: right;
        margin-bottom: 0;
    }
    .formEachStyle{
        margin-bottom: 0;
    }
    .formSWidth{
        width: 100%;
    }
</style>

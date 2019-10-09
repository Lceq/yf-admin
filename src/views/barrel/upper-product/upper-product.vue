<template>
    <div>
        <layout @on-select="selectMenu" :tabTitle="'上机物料'" :curTabStateId="typeId" :stateList="typeList">
            <div slot="content">
                <Row class="endFlex marginBottom" id="selectedHeight">
                    <Col class="">
                        <Row class="">
                            <Col>
                                <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateFrom" :value="dateFrom" type="date" placeholder="请选择计划开工时间..."></DatePicker>
                                <span class="formEachStyle" style="vertical-align: middle; width:auto; display: inline-block; line-height: 32px;">-</span>
                                <DatePicker class="formEachStyle" :clearable="true" @on-change="changeDateTo" :value="dateTo" type="date" placeholder="请选择计划完工时间..."></DatePicker>
                                <Select class="formEachStyle textLeft" v-model="workshopId" placeholder="请选择车间">
                                    <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                                </Select>
                                <!--<Select class="formEachStyle textLeft" @on-change="changeProcessType"  v-model="processTypeId" placeholder="请选择工序类别">-->
                                    <!--<Option v-for="(item, index) in processTypeList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                                <!--<Select class="formEachStyle textLeft" v-model="processId" placeholder="请选择工序">-->
                                    <!--<Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>-->
                                <!--</Select>-->
                                <!--<Button icon="ios-search" type="primary" class="marginBottom" @click="searchProduct">搜索</Button>-->
                                <!--<Input class="formWidth " type="text" v-model="versionNumber" placeholder="请输入通知单号"/>-->
                                <!--<Input class="formWidth " type="text" v-model="versionNumber" placeholder="请输入生产单号"/>-->
                                <!--<Input class="formWidth " type="text" v-model="versionNumber" placeholder="请输入批号"/>-->
                            </Col>
                        </Row>
                        <Row v-if="orderSelectedShow" class="endFlex">
                            <Col>
                                <Input class="formWidth " type="text" v-model="code" placeholder="请输入通知单号"/>
                                <Input class="formWidth " type="text" v-model="prdOrderCode" placeholder="请输入生产单号"/>
                                <Input class="formWidth " type="text" v-model="batchCode" placeholder="请输入批号"/>
                                <Input class="formWidth " type="text" v-model="product" placeholder="请输入产品编码或名称"/>
                            </Col>
                        </Row>
                    </Col>
                    <Col class="marginBottom">
                        <a @click="orderShow" class="cycle">···</a>
                        <Button icon="ios-search" @click="searchProduct" class=" verticalMiddle" type="primary">搜索</Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table border ref="selection" :height="tableHeight" :loading="upperProductLoading" size="small" :columns="upperProductColumns" :data="upperProductList"></Table>
                    </Col>
                </Row>
                <Row class="textRight">
                    <Col>
                        <page show-elevator show-sizer show-total :page-size-opts="pageOpts" :total="pageTotal" :page-size="pageSize" :placement="pageDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize"></page>
                    </Col>
                </Row>
            </div>
        </layout>
        <modal
            :isShow="productShow"
            :title="productTitle"
            :width="800"
            @submit="productSubmit"
            @cancel="productCancel"
        >
            <div slot="content">
                <Form :label-width="98" :model="productModal" ref="productModal" :rules="productValidate" :show-message="false">
                    <Row>
                        <Col span="12">
                            <FormItem label="生产通知单号：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ productModal.code }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="生产工序：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ productModal.processName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="产品：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ productModal.productName }}</p>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="批号：" prop="name" class="formItemMargin">
                                <p class="modal-readonly">{{ productModal.batchCode }}</p>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
                <div>
                    <Row>
                        <Col :span="12">
                            <p style="font-weight: bold;">左侧上机筒位</p>
                            <Table size="small" border ref="leftTable" :data="leftProductList" :columns="leftProductColumns"></Table>
                        </Col>
                        <Col :span="12" style="padding-left: 10px;">
                            <p style="font-weight: bold;">右侧上机筒位</p>
                            <Table size="small" border ref="rightTable" :data="rightProductList" :columns="rightProductColumns"></Table>
                        </Col>
                    </Row>
                    <!--<div class="tableWidth">-->
                        <!---->
                    <!--</div>-->
                    <!--<div class="tableWidth" style="padding-left: 10px;">-->
                       <!---->
                    <!--</div>-->
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
import upperProduct from './upper-product';
export default {
    ...upperProduct,
    name: 'upper-product'
};
</script>

<style scoped>
.tableWidth{
    width: 48%;
    display: inline-block;
}
</style>

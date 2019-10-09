<template>
    <div>
        <Card>
            <Row class="marginBottom parentFlexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button type="success" @click="machineArrange">机台排产</Button>
                </Col>
                <Col class="">
                    <Row class="marginBottom">
                        <Col>
                            <span class="formSpanStyle">计划开工时间：</span>
                                <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                                <DatePicker class="formEachStyle " @on-change="changeEndTime" type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                            <span class="formSpanStyle">生产订单号：</span>
                            <Input clearable class="formWidth" type="text" v-model="orderCode" placeholder="请输入生产订单编号"/>
                            <span class="formSpanStyle">生产工序：</span>
                            <Select class="formEachStyle textLeft" clearable placeholder="请选择工序" v-model="curProcessId">
                                <Option v-for="(item, index) in processList" :value="item.id" :style="item.style" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row v-if="orderSelectedShow">
                        <Col>
                            <span class="formSpanStyle">产品：</span>
                            <!--<Input clearable class="formWidth" type="text" v-model="productNameCode" placeholder="请输入产品"/>-->
                            <xw-select-product-pre
                                style="display: inline-block; width: 312px;"
                                :processTypeId="curProcessTypeId"
                                :selectProductCode="productNameCode"
                                @selectProductVal="selectProduct"
                            >
                            </xw-select-product-pre>
                            <span class="formSpanStyle">批号：</span>
                            <Input clearable class="formWidth" type="text" v-model="batchCode" placeholder="请输入批号"/>
                            <span class="formSpanStyle">生产车间：</span>
                            <Select class="formEachStyle textLeft" v-model="curWorkShop">
                                <Option v-for="(item, index) in workShopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <a @click="orderShow" class="cycle">···</a>
                    <Button icon="ios-search" @click="searchResult" class=" verticalMiddle" type="primary">搜索</Button>
                </Col>
            </Row>
            <Row>
                <Col class="marginBottom">
                    <Table :columns="machineArrangeColumns" :data="machineArrangeData" border size="small" :loading="machineArrangeLoading" :height="tableHeight"></Table>
                </Col>
                <Page class="textRight" show-elevator show-sizer show-total :total="pageTotal" :page-size="pageSize" :page-size-opts="reportPageOpts" :placement="pageUp" @on-change="changePageIndex" @on-page-size-change="changePageSize"></Page>
            </Row>
        </Card>
    </div>
</template>
<script>
import machineArrange from './post-arrange';
export default ({
    ...machineArrange
});
</script>

<style scoped>
.formSpanStyle{
    width: 100px !important;
    display: inline-block;
    text-align: right;
    margin-bottom: 0;
}
.formEachStyle{
    margin-bottom: 0;
}
</style>

<template>
    <div>
        <Card>
            <Row class="marginBottom parentFlexBetween" id="selectedHeight">
                <Col class="leftFlex">
                    <Button type="success" @click="machineArrange">机台排产</Button>
                </Col>
                <Col class="">
                    <Row class="">
                        <Col>
                            <span class="formSpanStyle">BOM日期：</span>
                            <DatePicker class="formEachStyle" type="date" @on-change="changeStartTime" placeholder="请选择时间" :value="dateFrom"></DatePicker> <span class="formSpanStyle" style="text-align: center;margin-bottom: 10px; ;line-height: 32px; ">-</span>
                            <DatePicker class="formEachStyle " @on-change="changeEndTime" type="date" :value="dateTo" placeholder="请选择时间"></DatePicker>
                            <span class="formSpanStyle">生产车间：</span>
                            <Select class="formEachStyle textLeft" v-model="curWorkShop">
                                <Option v-for="(item, index) in workShopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                            </Select>
                            <span class="formSpanStyle">工序类型：</span>
                            <Select class="formEachStyle textLeft" v-model="curProcessTypeId" @on-change="changeProcessType">
                                <Option v-for="(item, index) in processTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                            <span class="formSpanStyle">工序：</span>
                            <Select class="formEachStyle textLeft" clearable placeholder="请选择工序" v-model="curProcessId">
                                <Option v-for="(item, index) in processList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row v-if="orderSelectedShow">
                        <Col>
                            <span class="formSpanStyle">BOM单号：</span>
                            <Input clearable class="formWidth" type="text" v-model="bomCode" placeholder="请输入BOM单号"/>
                            <span class="formSpanStyle">生产订单：</span>
                            <Input clearable class="formWidth" type="text" v-model="orderCode" placeholder="请输入生产订单编号"/>

                            <span class="formSpanStyle">产品：</span>
                            <Input clearable class="formWidth" type="text" v-model="productNameCode" placeholder="请输入产品"/>
                            <span class="formSpanStyle">生产批次：</span>
                            <Input clearable class="formWidth" type="text" v-model="batchCode" placeholder="请输入生产批次"/>
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
import machineArrange from './machine-arrange';
export default ({
    ...machineArrange
});
</script>

<style scoped>
.formSpanStyle{
    width: 75px !important;
    display: inline-block;
    text-align: right;
    margin-bottom: 0;
}
.formEachStyle{
    margin-bottom: 0;
}
</style>

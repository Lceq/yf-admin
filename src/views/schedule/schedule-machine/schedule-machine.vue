<template>
    <div>
        <Card>
            <Row class="endFlex" id="selectedHeight">
                <Col>
                    <DatePicker class="formEachStyle" @on-change="changeFromTime" :clearable="false" :value="dateFrom" type="date" placeholder="请选择时间..."></DatePicker>
                    <span class="formEachStyle date-interval">-</span>
                    <DatePicker class="formEachStyle" @on-change="changeToTime" :value="dateTo" type="date" placeholder="请选择时间..."></DatePicker>
                    <Select class="textLeft formEachStyle" @on-change="changeWorkShop" v-model="curWorkShopId" placeholder="请选择车间...">
                        <Option v-for="(item, index) in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Select class="textLeft formEachStyle" v-model="curShiftType" @on-change="changeShiftType" clearable placeholder="请选择班制...">
                        <Option v-for="item in shiftTypeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select class="textLeft formEachStyle" v-model="curShift" clearable placeholder="请选择班次...">
                        <Option v-for="item in shiftList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <Select class="textLeft formEachStyle" clearable v-model="curShiftGroup" placeholder="请选择班组...">
                        <Option v-for="item in shiftGroup" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                    </Select>
                    <Button icon="ios-search" class="marginBottom" type="primary" @click="searchScheduleMachineList">搜索</Button>
                </Col>
            </Row>
            <Table class="marginBottom" border ref="selection" :height="tableHeight" :loading="scheduleMachineLoading" size="small" :columns="scheduleMachineColumns" :data="scheduleMachineData"></Table>
            <page class="textRight" show-elevator show-sizer show-total :page-size-opts="scheduleMachineOpts" :total="scheduleMachineTotal" :page-size="scheduleMachinePageSize" :placement="pageDirect" @on-change="changePageIndex" @on-page-size-change="changePageSize"></page>
        </Card>
        <group-machine
            :curGroupData="curGroupData"
            :curWorkShopId="curWorkShopId"
        ></group-machine>
    </div>
</template>

<script>
import scheduleMachine from './schedule-machine';
export default {
    ...scheduleMachine,
    name: 'schedule-machine'
};
</script>

<style scoped>
</style>

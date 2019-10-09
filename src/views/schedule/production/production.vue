<template>
<div>
   <Card>
       <Row class="endFlex">
           <Col>
               <span class="formSpanStyle">日期：</span>
               <DatePicker class="formEachStyle" type="date" :clearable="false" @on-change="changeStartTime" placeholder="请选择时间" :value="curStartTime"></DatePicker> <span class="formSpanStyle">-</span>
               <DatePicker class="formEachStyle marginLeft-10" @on-change="changeEndTime" type="date" placeholder="请选择时间"></DatePicker>
               <span class="formSpanStyle">生产车间：</span>
               <Select class="formEachStyle textLeft" @on-change="changeWorkShop" v-model="curProductionWorkShopId">
                   <Option v-for="(item, index) in WorkShopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
               </Select>
               <Button icon="ios-search" @click="searchResult" class="marginBottom marginButtonLeft" type="primary">搜索</Button>
           </Col>
       </Row>
       <Row id="tableHeight">
           <Col class="marginBottom">
               <Table border ref="selection" size="small" :loading="dutyTableLoading" :height="tableHeight" :columns="columnOnDuty" :data="dataOnDuty"></Table>
           </Col>
           <!--<p>-->
               <!--说明：<br>-->
               <!--1、当班班组的部门负责人具有值班和取消值班的操作权限，其他无。<br>-->
               <!--2、值班操作完成后，需要生成相应的当班机台报工开始产量资料，信息包含：关联排班班组信息，工序、机台（取当前班次的当前班组人员分配的机台）、开始产量（如可以采集到则取最新采集的产量数据，否则为零）-->
           <!--</p>-->
           <Col class="textRight">
               <Page :total="dutyTotal" :placement="pageDirect" :page-size-opts="dutyPageOpts" :page-size="dutyPageSize" show-elevator show-sizer show-total @on-change="changeDutyPageIndex" @on-page-size-change="changeDutyPageSize"/>
           </Col>
       </Row>
       <modal
        :isShow="isProductionShow"
        :title="productionTitle"
        :isSubmit="false"
        :isCancel="false"
        @cancel="cancelProduction"
        :width="800"
       >
           <div slot="content">
               <div class="textRight marginBottom">
                   <Select class="formWidth textLeft" @on-change="changeProcessMachineCode" v-model="curProcessId">
                       <Option v-for="(item, index) in processList" :style="item.style" :value="item.id" :key="item.id">{{ item.name }}</Option>
                   </Select>
                   <Input class="formWidth" v-model="machineCode" placeholder="请输入机台编码" @on-change="changeProcessMachineCode" />
               </div>
               <Row>
                   <Col>
                       <can-edit-table
                               :dutyLoading="dutyMachineLoading"
                               class="marginBottom"
                               v-model="dataProduction"
                               @on-cell-change="handleCellChange"
                               @on-change="handleChange"
                               :editIncell="true"
                               :columns-list="columnProduction"
                       ></can-edit-table>
                       <Page class="textRight" :total="dutyMachineTotal" :placement="pageDirect" :page-size-opts="dutyPageOpts" :page-size="dutyMachinePageSize" show-elevator show-sizer show-total @on-change="changeDutyMachinePageIndex" @on-page-size-change="changeDutyMachinePageSize"/>
                   </Col>
               </Row>
           </div>
       </modal>
       <delete-warning
           :v-model="isDutyShow"
           :tipMsg="tipsMessage"
           :loading="DutyLoading"
           @confirm="confirmDuty"
           @cancel="cancelDuty"
       ></delete-warning>
   </Card>
</div>
</template>

<script>
import production from './production';
export default {
    ...production
};
</script>

<style scoped>
.spanBlockFlex{
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
}
.spanFlex{
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
}
.spanBold{
    /*width: 120px;*/
    /*text-align: right;*/
    font-weight: bold;
    margin-bottom: 10px;
    display: inline-block;
}
</style>

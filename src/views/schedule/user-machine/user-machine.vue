<template>
    <div>
       <Card>
           <Row class="endFlex" id="selectedHeight">
               <Col>
                   <Select class="textLeft formEachStyle" v-model="curWorkshopId" placeholder="请选择车间...">
                       <Option v-for="item in workshopList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                   </Select>
                   <Select class="textLeft formEachStyle" clearable v-model="curShiftGroup" placeholder="请选择班组...">
                       <Option v-for="item in shiftGroupList" :value="item.deptId" :key="item.deptId">{{ item.deptName }}</Option>
                   </Select>
                   <Select class="textLeft formEachStyle" v-model="curProcessId" clearable placeholder="请选择工序...">
                       <Option v-for="item in processList" :style="item.style"  :value="item.id" :key="item.id">{{ item.name }}</Option>
                   </Select>
                   <Select class="formEachStyle textLeft" placeholder="请选择岗位..." clearable v-model="curPostId">
                       <OptionGroup v-for="(pList, index) of postBasicList" :key="index" :label="pList.typeName">
                           <Option v-for="item in pList.data" :value="item.id" :key="item.id">{{ item.name }}</Option>
                       </OptionGroup>
                   </Select>
                   <Input clearable class="formEachStyle" v-model="curName" placeholder="请输入员工姓名" />
                   <Button icon="ios-search" type="primary" class="marginBottom" @click="searchUserName">搜索</Button>
               </Col>
           </Row>
           <Row>
               <Col>
                   <Table class="marginBottom" border ref="selection" :height="tableHeight" :loading="userMachineLoading" size="small" :columns="userMachineColumns" :data="userMachineData"></Table>
                   <Page class="textRight" :total="userMachineTotal" show-elevator :page-size-opts="userMachinePageOpts" show-total :page-size="userMachinePageSize" @on-change="changePageIndexUserMachine" show-sizer @on-page-size-change="changePageSizeUserMachine"></Page>
               </Col>
           </Row>
           <select-machines
               :showMachineData="showMachinesList"
               @on-submit="submitMachines"
           >
           </select-machines>
       </Card>
    </div>
</template>

<script>
import userMachine from './user-machine';
export default {
    ...userMachine,
    name: 'user-machine'
};
</script>

<style scoped>

</style>

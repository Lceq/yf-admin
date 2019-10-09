<template>
  <Drawer
    v-model="visible"
    :width="width+32"
    title="排程向导">
    <Steps :current="activeStep" style="padding-left:18%;margin-top:10px">
      <Step title="选择订单" content="选择需要排程的订单"></Step>
      <Step :title="manuallyTuneTitle" content="对自动排程结果手动调整"></Step>
      <Step title="排程成功" content="排程成功"></Step>
    </Steps>
    <div class="step-content" >
      <div v-if="activeStep == 0" style="margin: 50px 0 10px 0">
        <Form>
          <FormItem label="车间">
            <Select v-model="selectedWorkshop" style="width:180px" @on-change="fetchOrderList">
              <Option v-for="item in workshops" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Table border ref="selection" :max-width="1150"  :max-height="orderTableMaxHeight"
          :columns="orderSelectTableColumns" 
          :loading="loadingOrder"
          @on-selection-change="handleSelectionChange"
          :data="orderList">
        </Table>
      </div>
      <div v-else-if="activeStep == 1" :style="{width: width + 'px', position: 'relative', margin: '2px 0 0 0'}">
        <Form inline :model="scheduleParams" style="border-bottom:1px solid #dcdee2;">
          <FormItem style="margin-bottom:10px" label="条件筛选">
            <schedule-tasks 
              :guide-mode="true"
              style="margin-left:2px"
              :refreshing.sync="refreshing"
              :interval="selectedInterval" 
              :begin="dateFrom"
              :tasks="scheduleParams.tasks"
              @setPage="setPage"
              @loaded="loaded"
              @loading="loading=$event">
            </schedule-tasks>
          </FormItem>
          <FormItem style="margin-bottom:10px" label="日期">
            <DatePicker
              :clearable = false
              style="width:180px;margin-left:2px"
              :options="datePickerOptions"
              v-model="scheduleParams.begin"
              type="date"
              show-week-numbers
              @on-change="onDatePickerChange"
              placeholder="选择开始日期">
            </DatePicker>
          </FormItem>
          <FormItem style="margin-bottom:10px">
            <div style="margin-top:32px">
              <Button type="primary"  ghost custom-icon="fa fa-search-minus" 
                :disabled="scheduleParams.intervalIndex >= 4" 
                @click="scheduleParams.intervalIndex++">
                缩小
              </Button>
              <Button type="primary" ghost custom-icon="fa fa-search-plus" 
                :disabled="scheduleParams.intervalIndex <= 0"
                @click="scheduleParams.intervalIndex--">
                放大
              </Button>
              <Button type="primary" ghost custom-icon="fa fa-search" 
                @click="zoomFit">
                自适应
              </Button>
            </div>
          </FormItem>
          <FormItem style="margin-bottom:10px">
            <Button type="primary" icon="md-refresh"  style="margin-top:32px"
              :loading="refreshing"
              @click="refreshing = true">
              刷新
            </Button>
          </FormItem>
          <span style="float:right;margin-top:32px">
            <Form-item style="margin-bottom:10px">
              <Button type="primary" icon="ios-arrow-back" ghost :disabled="scheduleParams.page <= 0" @click="scheduleParams.page--"></Button>
              <Button type="primary" ghost @click="scheduleParams.page = 0">还原</Button>
              <Button type="primary" icon="ios-arrow-forward" ghost @click="scheduleParams.page++"></Button>
            </Form-item>
          </span>
        </Form>
        <div class="con">
          <div class="tag-list">
            <Tag type="dot" color="primary">共 {{ scheduleParams.orders.length }} 个通知单</Tag>
            <Tag type="dot" color="success">{{ scheduleParams.open }} 已开台 </Tag>
            <Tag type="dot" color="info">{{ scheduleParams.close }} 未开台 </Tag>
            <Tag type="dot" color="error" checkable @on-change="showFailedScheduleOrder = true">{{ scheduleParams.failedOrder.length }} 个订单无法排程</Tag>
            <Tag type="dot" color="warning" checkable @on-change="showDelayNotice = true">{{ scheduleParams.delayTasks.length }} 个任务超时</Tag>
          </div>
          <div>
            <scheduler-table 
              :resource-tasks="formattedTasks"
              :begin="scheduleParams.begin"
              :date-offset="scheduleParams.page"
              :date-from="dateFrom"
              :date-to="dateTo"
              :active-group="activeWorkCenterName"
              :max-table-height="scheduleTableHeight"
              @tun="tunning"
              @split="split"
              :interval="selectedInterval">
            </scheduler-table>
          </div>
          <Drawer title="超时任务" :width="755"  v-model="showDelayNotice">
            <Table :columns="delayTaskColumns" :data="scheduleParams.delayTasks"></Table>
          </Drawer>
          <Drawer title="排程失败订单" :width="1075"  v-model="showFailedScheduleOrder">
            <Table border
              :columns="orderSelectTableColumns.filter((item, index) => index != 0)" 
              :data="scheduleParams.failedOrder">
            </Table>
          </Drawer>
        </div>
        <Spin size="large" fix v-if="spining" style="z-index:1000">
          <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
          <div>{{ spinText }}</div>
        </Spin>
      </div>
      <div v-else-if="activeStep == 2" style="text-align:center;margin: 70px 0 10px 0">
        <Icon type="md-checkmark-circle" :size="48" color="#19be6b" />
        <div style="font-size:20px;color:#515a6e;margin-top:10px">排程成功</div>
      </div>
    </div>
    <div class="footer">
      <Button v-if="activeStep == 1 && this.scheduledProcess.length > 1" style="margin-right:8px" @click="scheduleRollback">上一步</Button>
      <Button type="primary" v-if="activeStep == 1 && !scheduleFinish" @click="continueSchedule">继续下一工序</Button>
      <Button type="primary" v-if="activeStep == 1 && scheduleFinish" @click="completeSchedule">结束排程</Button>
      <Button type="primary" v-if="activeStep == 0" @click="autoSchedule">自动排程</Button>
      <Button v-if="activeStep == 2" @click="visible = false">关闭</Button>
    </div>

    <Spin size="large" fix v-if="scheduling">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>排程中</div>
    </Spin>
  </Drawer>
</template>

<script>
import { orderAdd, processSchedule, orderList, completeOrder, processSelect, tunningManually, orderFailList } from './api'
import { addHours, today, dateDurationHour, dateBegin, formatYMDHMS, currentHour } from './util'
import { formatMachineTasks } from './business'
import schedulerTable from './scheduler-table'
import scheduleTasks from './schedule-tasks'
export default {
  data() {
    return {
      visible: this.show,
      activeStep: 0,
      orderList: [],
      scheduledProcess: [],
      scheduleFinish: false,
      loadingOrder: false,
      selectedWorkshop: this.workshop,
      selectedOrder: [],
      orderTableMaxHeight: 300,
      orderSelectTableColumns: [
        { type: 'selection', width: 60, align: 'center' },
        { title: '订单号', key: 'code', width: 120 },
        { title: '产品名称', key: 'productName', width: 150 },
        { title: '工艺路线', key: 'specPathName', width: 150 },
        { title: '产量', key: 'productionQty', width: 100, align: 'center'},
        { title: '日供货量', key: 'dailySupplyQty', width: 100, align: 'center'},
        { title: '单位', key: 'unitName', width: 60, align: 'center' },
        { title: '下单日期', key: 'orderDate', width: 120 },
        { title: '开始交付日期', key: 'deliveryDateFrom', width: 120 },
        { title: '最后交付日期', key: 'deliveryDateTo', width: 120 },
      ],
      scheduling: false,
      loading: false,
      rescheduling: false,
      resetParam: false,
      refreshing: false,
      scheduleParams: {
        begin: today(),
        tasks: {
          workshop: null,
          process: null,
          workCenter: null,
          processMachines: [],
          minDate: null,
          maxDate: null,
          workShops: [],
          runningList: [],
          workCenters: [],
        },
        intervalIndex: 3,
        initIntervalIndex: 3,
        orders: [],
        delayTasks: [],
        page: 0,
        open: 0,
        close: 0,
        failedOrder: []
      },
      formattedTasks: [],
      showDelayNotice: false,
      showFailedScheduleOrder: false,
      delayTaskColumns: [
        { title: '机器名', key: 'machineName', width: 120 },
        { title: '通知单号', key: 'prdNoticeCode', width: 150 },
        { title: '产品名称', key: 'productName', width: 150 },
        { title: '计划开始时间', key: 'planDateFrom', width: 150 },
        { title: '计划结束时间', key: 'planDateTo', width: 150 },
      ],
      intervalOptions: ['01H', '08H', '12H', '24H', '48H'],
    }
  },
  components: {
    schedulerTable,
    scheduleTasks,
  },
  created() {
  },
  computed: {
    activeProcessName() {
      const { runningList } = this.scheduleParams.tasks
      if (runningList.length > 0) {
        return runningList[0].name
      }
      return ''
    },
    activeWorkCenterName() {
      const { workCenter, workCenters } = this.scheduleParams.tasks
      if (workCenter == null || workCenters.length === 0) {
        return ''
      }
      const selectedWorkCenter = workCenters.find(({ id }) => id === workCenter)
      if (selectedWorkCenter) {
        return selectedWorkCenter.name
      }
      return ''
    },
    processMachines() {
      return this.scheduleParams.tasks.processMachines
    },
    dateFrom() {
      const interval = this.selectedInterval
      const now = currentHour()
      
      // 用户设置的begin date优先级最高
      if (dateDurationHour(now, this.scheduleParams.begin) > 0) {
        return formatYMDHMS(addHours(new Date(this.scheduleParams.begin),  this.scheduleParams.page * interval))
      }
      const h = now.getHours()
      const gap =  -this.scheduleParams.page * interval + h % interval

      return formatYMDHMS(addHours(now, -gap))
    },
    dateTo() {
      const begin = new Date(this.dateFrom)
      const dur = this.selectedInterval * 31
      begin.setHours(begin.getHours() + dur)
      return formatYMDHMS(begin)
    },
    datePickerOptions() {
      return {
        disabledDate: (date) => {
          return date && dateDurationHour(date, dateBegin(today())) > 0
        }
      }
    },
    selectedInterval() {
      return this.intervalOptions[this.scheduleParams.intervalIndex].substr(0, 2)
    },
    spining() {
      return this.loading || this.rescheduling
    },
    spinText() {
      if (this.rescheduling) {
        return '重新排程中'
      }
      if (this.loading) {
        return 'Loading'
      }
      return ''
    },
    manuallyTuneTitle() {
      if (this.activeProcessName) {
        return `手动调整『${this.activeProcessName}』`
      }
      return `手动调整`
    },
  },
  props: ['show', 'width', 'workshop', 'workshops', 'scheduleTableHeight'],
  methods: {
    loaded() {
      this.resetParam = true
      const tasks = this.scheduleParams.tasks
      tasks.processMachines = [...tasks.processMachines]
    },
    async autoSchedule() {
      if (this.selectedOrder.length === 0) {
        this.$Message.warning('至少选择一个订单')
        return 
      }
      try {
        this.scheduling = true
        let ok = await this.addOrder()
        if (!ok) {
          return
        }
        ok = await this.continueSchedule()
        if (!ok) {
          return
        }
        this.activeStep = 1
      } finally {
        this.scheduling = false
      }
    },
    async scheduleRollback() {
      try {
        this.scheduling = true
        let ok = await this.schedule(this.scheduledProcess[this.scheduledProcess.length - 2])
        if (!ok) {
          return false
        }
        this.fetchScheduleFailedOrder()

        this.scheduleParams.tasks = {
          workshop: null,
          process: null,
          workCenter: null,
          processMachines: [],
          minDate: null,
          maxDate: null,
          workShops: [this.workshops.find(({ id }) => id === this.selectedWorkshop)],
          runningList: [this.scheduledProcess[this.scheduledProcess.length - 2]],
          workCenters: [],
        }
        this.scheduleFinish = false
        this.scheduledProcess.pop()
    
        return true
      } finally {
        this.scheduling = false
      }
    },
    async continueSchedule() {
      try {
        this.scheduling = true
        let { ok, process, finish } = await this.selectProcess()
        this.scheduleFinish = finish
        if (!ok) {
          return false
        }
        ok = await this.schedule(process)
        if (!ok) {
          return false
        }
        this.fetchScheduleFailedOrder()
        this.scheduledProcess.push(process)

        this.scheduleParams.tasks = {
          workshop: null,
          process: null,
          workCenter: null,
          processMachines: [],
          minDate: null,
          maxDate: null,
          workShops: [this.workshops.find(({ id }) => id === this.selectedWorkshop)],
          runningList: [process],
          workCenters: [],
        }
        return true
      } finally {
        this.scheduling = false
      }
    },
    async addOrder() {
      try {
        if (this.selectedOrder.length == 0) {
          return true
        }
        const { res, status, message } = await orderAdd(this.selectedOrder)
        if (status !== 200) {
          this.$Message.error(`添加排程订单出错, ${message}`)
          return false
        }
        return true
      } catch(e) {
        this.$Message.error(`添加排程订单出错, ${e.message}`)
        return false
      }
    },
    async fetchScheduleFailedOrder() {
      this.scheduleParams.failedOrder = []
      try {
        const { res, status, message } = await orderFailList(this.selectedWorkshop)
        if (status !== 200) {
          this.$Message.error(`获取排程失败订单出错, ${message}`)
          return false
        }
        this.scheduleParams.failedOrder = res
        
      } catch(e) {
        this.$Message.error(`获取排程失败订单出错，${e.message}`)
      }
    },
    async completeSchedule() {
      try {
        const { res, status, message } = await completeOrder(this.selectedWorkshop)
        if (status !== 200) {
          this.$Message.error(`结束排程失败, ${message}`)
          return false
        }
        this.activeStep = 2
        return true
      } catch(e) {
        this.$Message.error(`结束排程失败, ${e.message}`)
        return false
      }
    },
    async schedule(process) {
      try {
        const { res, status, message } = await processSchedule(this.selectedWorkshop, process.id)
        if (status !== 200) {
          this.$Message.error(`自动排程出错, ${message}`)
          return false
        }
        return true
      } catch(e) {
        this.$Message.error(`自动排程出错, ${e.message}`)
        return false
      }
    },
    async selectProcess() {
      try {
        const { res, status, message } = await processSelect(this.selectedWorkshop, this.scheduleParams.tasks.process)
        if (status !== 200) {
          this.$Message.error(`获取排程工序出错, ${message}`)
          return { ok: false, process: null, finish: false }
        }
        if (res) {
          return { ok: true, process: res, finish: false }
        } else {
          this.$Message.success(`已完成全部工序排程`)
          return { ok: false, process: null, finish: true }
        }
      } catch(e) {
        this.$Message.error(`获取排程工序出错, ${e.message}`)
        return { ok: false, process: null, finish: false }
      } 
    },
     split({ editingTask }) {
      const { splitQty, productionQty, separableQty, planDateFrom, preparationHours, resourceIndex, index, hourYield, id } = editingTask

      const tasks = this.scheduleParams.tasks
      const task = tasks.processMachines.find(item => id === item.id )
      let newProcessMachines = tasks.processMachines.filter(item => id !== item.id )

      task.productionQty = productionQty - splitQty
      const duration =  Math.ceil(task.productionQty / hourYield) + preparationHours
      task.planDateTo = formatYMDHMS(addHours(new Date(planDateFrom), duration))
      const insertTask = { ...task }
      insertTask.productionQty = splitQty
      insertTask.preparationHours = 0
      insertTask.planDateFrom = task.planDateTo
      insertTask.openingState = 0
      insertTask.completionQty = 0
      insertTask.planDateTo = formatYMDHMS(addHours(new Date(insertTask.planDateFrom), Math.ceil(splitQty / hourYield) ))
      insertTask.parentId = insertTask.id
      insertTask.id = new Date().valueOf()

      newProcessMachines = [...newProcessMachines, { ...task }, insertTask]

      tasks.processMachines = newProcessMachines
    },
    async fetchOrderList() {
      try {
        this.loadingOrder = true
        const { res, status, message } = await orderList(this.selectedWorkshop)
        if (status !== 200) {
          this.$Message.error(`获取排程订单出错, ${message}`)
          this.orderList = []
          return false
        }
        this.orderList = res
        return true
      } catch(e) {
        this.orderList = []
        this.$Message.error(`获取排程订单出错, ${e.message}`)
        return false
      } finally {
        this.loadingOrder = false
      }
    },
    async onDatePickerChange() {
      this.scheduleParams.page = 0
    },
    handleSelectionChange(selection) {
      this.selectedOrder = selection.map(({ id }) => id)
    },
    reset() {
      this.activeStep = 0
      this.selectedOrder = []
      this.scheduleParams = {
        begin: today(),
        tasks: {
          workshop: null,
          process: null,
          workCenter: null,
          processMachines: [],
          minDate: null,
          maxDate: null,
          workShops: [],
          runningList: [],
          workCenters: [],
        },
        intervalIndex: 3,
        initIntervalIndex: 3,
        orders: [],
        delayTasks: [],
        failedOrder: [],
        page: 0,
      }
    },
    async tunning({ sourceId, quantity, afterNoticeId, onMachineId, deleteMachineId }) {
      try {
        this.rescheduling = true
        const { status, message, res } = await tunningManually({
          source_id: sourceId,
          quantity: quantity,
          after_notice_machine_id: afterNoticeId,
          on_machine_id: onMachineId,
        })
        if (status != 200) {
          this.$Message.error(`手动排程失败，${message}`)
          return
        }
        this.update(res, onMachineId, deleteMachineId)

      } catch(e) {
        this.$Message.error(`手动排程失败，${e.message}`)
      } finally {
        this.rescheduling = false
      }
    },  
    update(res, onMachineId, deleteMachineId) {
      const tasks = this.scheduleParams.tasks
      let newProcessMachines = tasks.processMachines.filter(({ machineId }) => machineId !== onMachineId && machineId !== deleteMachineId)
      newProcessMachines = [...newProcessMachines, ...res]
      if (onMachineId !== deleteMachineId) {
        if (res.findIndex(({ machineId }) => machineId === deleteMachineId) === -1) {
          const { machineId, machineName } = tasks.processMachines.find(({ machineId }) => machineId === deleteMachineId )
          newProcessMachines.push({ machineId, machineName})
        }
      }
      tasks.processMachines = newProcessMachines
    },
    updateOrderTableMaxHeight() {
      this.orderTableMaxHeight = window.innerHeight - 300
    },
    zoomFit() {
      this.scheduleParams.begin = dateBegin(today())
      this.scheduleParams.intervalIndex = this.scheduleParams.initIntervalIndex
      this.scheduleParams.page = 0
    },

    setPage(index) {
      this.scheduleParams.page = index * 31
      this.scheduleParams.begin = dateBegin(today())
    }

  },
  watch: {
    activeStep() {
      if (this.activeStep === 0 && this.visible) {
        this.fetchOrderList()
      }
    },
    show() {
      if (this.show) {
        this.reset()
        this.visible = this.show
        this.fetchOrderList()
        this.updateOrderTableMaxHeight()
      }
     
    },
    processMachines() {
      const tasks = this.scheduleParams.tasks
      const { initIntervalIndex, minDate, maxDate, orders, delayTasks, open, close, tasks:formattedTasks } = formatMachineTasks(tasks.processMachines)
      this.formattedTasks = formattedTasks
      this.scheduleParams.initIntervalIndex = initIntervalIndex
      this.scheduleParams.orders = orders
      this.scheduleParams.delayTasks = delayTasks
      this.scheduleParams.open = open
      this.scheduleParams.close = close
      tasks.minDate = minDate
      tasks.maxDate = maxDate
    
      if (this.resetParam) {
        this.scheduleParams.begin = today()
        this.scheduleParams.intervalIndex = initIntervalIndex
        this.scheduleParams.page = 0
        this.resetParam = false
      }
    },
    visible() {
      this.$emit('update:show', this.visible)
    }
  }
}
</script>

<style scoped>
  .step-content {
    display:flex;
    flex-direction:column;
    align-items:center;
    flex: 1;
    overflow: hidden;
  }

  .con {
    position:relative;
    flex:1;
    overflow-y:hidden;
    display: flex;
    flex-direction: column;
  }

  .tag-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 5px 0;
  }

  .footer{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e8e8e8;
    box-sizing: border-box;
    padding: 10px 16px;
    text-align: right;
    background: #fff;
  }

  .spin-icon-load{
      animation: ani-spin 1s linear infinite;
    }
    @keyframes ani-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
 
</style>
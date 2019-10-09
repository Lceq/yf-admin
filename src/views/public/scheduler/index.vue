<template>
  <div style="display:flex;flex-direction:column;height:100%;width:100%" ref="scheduler">
    <Form inline :model="scheduleParams" style="border-bottom:1px solid #dcdee2">
       <FormItem label="条件筛选">
        <schedule-tasks 
          :interval="selectedInterval" 
          :begin="dateFrom"
          :tasks="scheduleParams.tasks"
          :date-from="dateFrom"
          @loaded="loaded"
          @setPage="setPage"
          :initializing.sync="initializing"
          :refreshing.sync="refreshing"
          @loading="loading=$event">
        </schedule-tasks>
      </FormItem>
      <FormItem label="日期">
        <DatePicker
          :clearable = false
          style="width:180px"
          :options="datePickerOptions"
          v-model="scheduleParams.begin"
          type="date"
          show-week-numbers
          @on-change="onDatePickerChange"
          placeholder="选择开始日期">
        </DatePicker>
      </FormItem>
      <FormItem>
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
      <FormItem>
        <div style="margin-top:32px">
          <Button type="primary" icon="md-refresh" 
            :loading="refreshing"
            @click="refreshing = true">
            刷新
          </Button>
        </div>
      </FormItem>
      <span style="float:right;margin-top:32px">
        <Form-item>
          <Button type="primary" ghost @click="schedulePrepare">排程准备</Button>
          <Button type="primary" @click="openScheduleGuide" ghost>排程向导</Button>
        </Form-item>
        <Form-item>
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
      <div style="flex:1;overflow:hidden" ref="schedulerTableWrapper">
        <scheduler-table 
          :resource-tasks="formattedTasks"
          :begin="scheduleParams.begin"
          :date-offset="scheduleParams.page"
          :date-from="dateFrom"
          :date-to="dateTo"
          :active-group="activeWorkCenterName"
          :max-table-height="tableHeight"
          @tun="tunning"
          @split="split"
          :interval="selectedInterval">
        </scheduler-table>
      </div>
      <Drawer title="超时任务" :width="755"  v-model="showDelayNotice">
        <Table :columns="taskColumns" :data="scheduleParams.delayTasks"></Table>
      </Drawer>
      <Drawer title="排程失败订单" :width="1075"  v-model="showFailedScheduleOrder">
        <Table border ref="selection"
          :columns="orderSelectTableColumns" 
          :data="scheduleParams.failedOrder">
        </Table>
      </Drawer>
      <schedule-guide v-if="scheduleParams.tasks.workshop"
        :show.sync="showGuide" 
        :width="tableWidth" 
        :schedule-table-height="tableHeight"
        :workshop="scheduleParams.tasks.workshop"
        :workshops="scheduleParams.tasks.workShops">
      </schedule-guide>
    </div>
    <Spin size="large" fix v-if="spining" style="z-index:1000">
      <Icon type="ios-loading" size=18 class="spin-icon-load"></Icon>
      <div>{{ spinText }}</div>
    </Spin>
  </div>
</template>

<script>
import { addHours, dateDurationHour, formatYMD, formatYM, demoData, today, addDays, dateBegin, formatYMDHMS, currentHour } from './util'
import { formatMachineTasks, filterMachineTask } from './business'
import { tunningManually, schedulePrepare, orderFailList } from './api'
import schedulerTable from './scheduler-table'
import scheduleGuide from './schedule-guide'
import scheduleTasks from './schedule-tasks'
import { debounce } from 'throttle-debounce'

export default {
  data() {
    return {
      initializing: false,
      loading: false,
      rescheduling: false,
      refreshing: false,
      resetParam: false,
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
        failedOrder: [],
        open: 0,
        close: 0,
      },
      formattedTasks: [],
      intervalOptions: ['01H', '08H', '12H', '24H', '48H'],
    
      tableHeight: -1,
      tableWidth: 256,
      resizeDebounce: debounce(500, this.updateTableSize),
      showDelayNotice: false,
      showFailedScheduleOrder: false,
      showGuide: false,
      taskColumns: [
        { title: '机器名', key: 'machineName', width: 120 },
        { title: '通知单号', key: 'prdNoticeCode', width: 150 },
        { title: '产品名称', key: 'productName', width: 150 },
        { title: '计划开始时间', key: 'planDateFrom', width: 150 },
        { title: '计划结束时间', key: 'planDateTo', width: 150 },
      ],
      orderSelectTableColumns: [
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
    }
  },
  async created() {
  },
  computed: {
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
    activeWorkshop() {
      return this.scheduleParams.tasks.workshop
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
    selectedInterval() {
      return this.intervalOptions[this.scheduleParams.intervalIndex].substr(0, 2)
    },
    datePickerOptions() {
      return {
        disabledDate: (date) => {
          return date && dateDurationHour(date, dateBegin(today())) > 0
        }
      }
    },
   
    spining() {
      return this.loading || this.rescheduling
    },
    spinText() {
      if (this.rescheduling) {
        return '重新排程中'
      }
      if (this.loading ) {
        return 'Loading'
      }
      
      return ''
    },
   
  },
  components: {
    schedulerTable,
    scheduleGuide,
    scheduleTasks,
  },
  mounted() {
    setTimeout(() => this.updateTableSize(), 500)
    window.addEventListener("resize", this.resizeDebounce)
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeDebounce)
  },
  methods: {
    loaded() {
      this.resetParam = true
      const tasks = this.scheduleParams.tasks
      tasks.processMachines = [...tasks.processMachines]
    },
    openScheduleGuide() {
      this.tableWidth = this.$refs.scheduler.offsetWidth
      this.showGuide = true
    },
    async schedulePrepare() {
      if (!this.scheduleParams.tasks.workshop) {
        return
      }
      try {
        const { res, status, message } = await schedulePrepare()
        if (status !== 200) {
          this.$Message.error(`排程准备失败, ${message}`)
          return false
        }
        this.$Message.success('排程准备成功')
        setTimeout(() => this.refreshing = true, 500)
        return true
      } catch(e) {
        this.$Message.error(`排程准备失败, ${message}`)
      }
    },
    async onDatePickerChange() {
      this.scheduleParams.page = 0
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
      insertTask.completionQty = 0
      insertTask.openingState = 0
      insertTask.planDateTo = formatYMDHMS(addHours(new Date(insertTask.planDateFrom), Math.ceil(splitQty / hourYield) ))
      insertTask.parentId = insertTask.id
      insertTask.id = new Date().valueOf()

      newProcessMachines = [...newProcessMachines, { ...task }, insertTask]

      tasks.processMachines = newProcessMachines
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
    updateTableSize() {
      this.tableHeight = this.$refs.schedulerTableWrapper.clientHeight 
    },
    zoomFit() {
      this.scheduleParams.begin =  today()
      this.scheduleParams.intervalIndex = this.scheduleParams.initIntervalIndex
      this.scheduleParams.page = 0
    },
    setPage(index) {
      this.scheduleParams.page = index * 31
      this.scheduleParams.begin = today()
    }
  },
  props: [],
  watch: {
    showGuide() {
      if (!this.showGuide) {
        this.initializing = true
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
    async activeWorkshop() {
      this.scheduleParams.failedOrder = []
      try {
        const { res, status, message } = await orderFailList(this.activeWorkshop)
        if (status !== 200) {
          this.$Message.error(`获取排程失败订单出错, ${message}`)
          return false
        }
        this.scheduleParams.failedOrder = res
        
      } catch(e) {
        this.$Message.error(`获取排程失败订单出错，${e.message}`)
      }
    }
  },
}
</script>

<style scoped>
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

  .spin-icon-load{
    animation: ani-spin 1s linear infinite;
  }
  @keyframes ani-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
  
  [v-cloak]
    {display:none}
</style>

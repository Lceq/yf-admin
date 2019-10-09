<template>
  <div class="aps-schedule-tasks">
    <Dropdown placement="bottom-start">
      <Button type="default" style="width:200px">
        {{ target }}
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
      <div style="width:560px;padding:16px;">
        <Row>
          <Col span="4" style="font-weight:700">车间</Col>
          <Col span="20">
            <Tag v-for="item in scheduleTasks.workShops" :key="item.id" :name="item.id" 
              :checkable="scheduleTasks.workshop !== item.id"
              :color="scheduleTasks.workshop === item.id ? 'primary' : 'default'"
              @on-change="onWorkshopChange"
              style="margin-right:15px"
              type="border">
              {{ item.name }}
            </Tag>
          </Col>
        </Row>
        <Divider size="small" dashed/>
        <Row> 
          <Col span="4" style="font-weight:700">工序</Col>
          <Col span="20">
            <Tag v-for="item in scheduleTasks.runningList" :key="item.id" :name="item.id"	checkable
              :color="scheduleTasks.process === item.id ? 'primary' : 'default'"
              @on-change="onProcessChange"
              style="margin-right:15px"
              type="border">
              {{ item.name }}
            </Tag>
          </Col>
        </Row>
        <Divider size="small" dashed/>
        <Row> 
          <Col span="4" style="font-weight:700">工作中心</Col>
          <Col span="20">
            <Tag v-for="item in scheduleTasks.workCenters" :key="item.id" :name="item.id" checkable	
              :color="scheduleTasks.workCenter === item.id ? 'primary' : 'default'"
              @on-change="onWorkCenterChange"
              style="margin-right:15px"
              type="border">
              {{ item.name }}
            </Tag>
          </Col>
        </Row>
        <Divider size="small" dashed/>
        <Row>
          <Col span="4" style="font-weight:700">区间</Col>
          <Col span="20"> 
            <Tag v-for="item in intervalSegments" :key="item.id" :name="item.id" checkable	
              :color="intervalSegmentColor(item)"
              style="margin-right:15px"
              @on-change="$emit('setPage', item.id)"
              type="border">
              {{ item.name }}
            </Tag>
          </Col>
        </Row>
      </div>
      </DropdownMenu>
    </Dropdown>

  </div>
</template>

<script>
import { workshopList, processRunningList, workcenterList, machineRunningList } from './api'
import { addHours, dateDurationHour, formatYMDHMS, formatMDH, currentHour  } from './util';
export default {
  data() {
    return {
      scheduleTasks: this.tasks,
      loading: false,
    }
  },
  computed: {
    target() {
      if (this.loading) {
        return '正在加载中'
      }
      const result = []
      const { workshop, process, workCenter, workShops} = this.scheduleTasks
      const selectWorkshop = workShops.find(({ id }) => id === workshop)
      if (selectWorkshop) {
        result.push(selectWorkshop.name)
      }
      const selectProcess = this.scheduleTasks.runningList.find(({ id }) => id === process)
      if (selectProcess) {
        result.push(selectProcess.name)
      }
      const selectWorkCenter = this.scheduleTasks.workCenters.find(({ id }) => id === workCenter)
      if (selectWorkCenter) {
        result.push(selectWorkCenter.name)
      }
      if (result.length == 0) {
        return '请选择'
      }
      return result.join(' / ')
    },
    intervalSegments() {
      const { maxDate } = this.scheduleTasks
      
      if (!maxDate) {
        return []
      }
      const now = currentHour()
      const h = now.getHours()
      const gap =  h % this.interval

      const intervalSegments = []
      let start = addHours(now, -gap)
      let page = 0
      do {
        const end = addHours(new Date(start), 31 * this.interval)
        
        intervalSegments.push({ name: `${formatMDH(start)} ~ ${formatMDH(end)}`, start, end, id: page })
        start = end
        page++
      } while(dateDurationHour(start, maxDate) > 0)   
      return intervalSegments
    },
  },
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      this.loading = true
      this.$emit('loading', true)
      if (!this.guideMode)
        await this.fetchWorkshops()
      if (this.scheduleTasks.workShops.length > 0) {
        await this.onWorkshopChange(true, this.scheduleTasks.workShops[0].id)
      } else {
        await this.onWorkshopChange(true, null)
      }
      this.$emit('update:initializing', false)
    },
    async onWorkshopChange(checked, id) {
      this.loading = true
      this.$emit('loading', true)
      this.scheduleTasks.workshop = id
      if (!this.guideMode)
        await this.fetchRunningList() 
      if (this.scheduleTasks.runningList.length > 0) {
        let item = this.scheduleTasks.runningList.find(({ name }) => name === '细纱')
        if (!item) {
          item = this.scheduleTasks.runningList[0]
        }
        await this.onProcessChange(true, item.id)
      } else {
        await this.onProcessChange(true, null)
      }
    },

    async onProcessChange(checked, id) {
      this.scheduleTasks.process = id
      this.loading = true
      this.$emit('loading', true)
      const ok = await this.fetchWorkcenterList()
      if (this.scheduleTasks.workCenters.length > 0) {
        return await this.onWorkCenterChange(true, this.scheduleTasks.workCenters[0].id)
      } else {
        return await this.onWorkCenterChange(true, null)
      }
    },

    async onWorkCenterChange(checked, id) {
      this.scheduleTasks.workCenter = id 
      this.loading = true
      this.$emit('loading', true)
      await this.fetchMachineList() 

      this.scheduleTasks.minDate = null
      this.scheduleTasks.maxDate = null
      this.scheduleTasks.processMachines.forEach(({ planDateFrom, planDateTo }) => {
        const { minDate, maxDate } = this.scheduleTasks
        if (planDateFrom) {
          if (!minDate || dateDurationHour(new Date(planDateFrom), minDate) > 0) {
            this.scheduleTasks.minDate = new Date(planDateFrom)
          }
        }
        if (planDateTo) {
          if (!maxDate || dateDurationHour(maxDate, new Date(planDateTo)) > 0) {
            this.scheduleTasks.maxDate = new Date(planDateTo)
          }
        }
      }) 
      this.$emit('loaded')
      this.loading = false
      this.$emit('loading', false)
    },
    async refresh() {
      const { workshop, process, workCenter } = this.scheduleTasks
      if (workshop == null) {
        return await this.initialize()
      }

      if (process == null) {
        this.scheduleTasks.workshop = null
        return await this.onWorkshopChange(true, workshop)
      }

      if (workCenter == null) {
        this.scheduleTasks.process = null
        return await this.onProcessChange(true, process)
      }
      this.scheduleTasks.workCenter = null
      await this.onWorkCenterChange(true, workCenter)
      this.$emit("update:refreshing", false)
    },

    async fetchWorkshops() {
      try {
        const { res, status, message } = await workshopList()
        if (status !== 200) {
          this.$Message.error(`获取车间列表出错, ${message}`)
          return false
        }
        this.scheduleTasks.workShops = res
        return true
      } catch(e) {
        this.$Message.error(`获取车间列表出错, ${e.message}`)
        return false
      }
    },

    async fetchRunningList() {
      try {
        if (this.scheduleTasks.workshop == null) {
          this.scheduleTasks.runningList = []
          return true
        }
        const { res, status, message } = await processRunningList(this.scheduleTasks.workshop)
        if (status !== 200) {
          this.$Message.error(`获取车间工序出错, ${message}`)
          return false
        }
        this.scheduleTasks.runningList = res || []
        this.scheduleTasks.runningList.reverse()
        return true
      } catch(e) {
        this.$Message.error(`获取车间工序出错, ${e.message}`)
        return false
      }
    },

     async fetchWorkcenterList() {
      try {
        if (this.scheduleTasks.workshop == null || this.scheduleTasks.process == null)  {
          this.scheduleTasks.workCenters = []
          return true
        }
        const { res, status, message } = await workcenterList(this.scheduleTasks.workshop, this.scheduleTasks.process)
        if (status !== 200) {
          this.$Message.error(`获取工作中心出错, ${message}`)
          this.scheduleTasks.workCenters = []
          return false
        }
        this.scheduleTasks.workCenters = res.filter(({ id }) => id != null)
        return true
      } catch(e) {
        this.scheduleTasks.workCenters = []
        this.$Message.error(`获取工作中心出错, ${e.message}`)
        return false
      }
    },

    async fetchMachineList() {
      try {
        if (this.scheduleTasks.process == null || this.scheduleTasks.workCenter == null) {
          this.scheduleTasks.processMachines = []
          return true
        }
        const { res, status, message } = await machineRunningList(this.scheduleTasks.process, this.scheduleTasks.workCenter)
        if (status !== 200) {
          this.$Message.error(`获取机器列表出错, ${message}`)
          this.scheduleTasks.processMachines = []
          return false
        }
        this.scheduleTasks.processMachines = res
        return true
      } catch(e) {
        this.scheduleTasks.processMachines = []
        this.$Message.error(`获取机器列表出错, ${e.message}`)
        return false
      }
    },
    intervalSegmentColor({ start, end}) {
      if (dateDurationHour(start, new Date(this.begin)) >= 0 && dateDurationHour(new Date(this.begin), end) > 0) {
        return 'primary'
      }
      return 'default'
    },
  },
  props: ['begin', 'interval', 'tasks', 'dateFrom', 'guideMode', 'refreshing', 'initializing'],
  watch: {
    tasks() {
      this.scheduleTasks = this.tasks
      this.initialize()
    },
    refreshing() {
      if (this.refreshing) {
        this.refresh()
      }
    },
    initializing() {
      if (this.initializing) {
        this.initialize()
      }
    }
  }
}
</script>

<style>

  .aps-schedule-tasks {
    display: inline-block;
  }

  .aps-schedule-tasks .ivu-divider-horizontal {
    margin: 16px 0;
  }

</style>
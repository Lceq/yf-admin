<template>
  <div>
    <div class="scheduler-table-wrapper"> 
      <div class="task-bars__fixed" :class="{'task-bars_scroll-x': isScrollingX}" :style="{width: `${fixedBodyWidth}px`}">
        <div class="task-bars__fixed-header task-bars__cell task-bars__header-cell">
          <div style="position:relative">
            机台
            <div style="position:absolute;left:26px;top:0px">
              <span class="ivu-table-sort">
                <i class="ivu-icon ivu-icon-md-arrow-dropup" :class="{'on': machineAscend === true}" @click="machineAscend = true"></i> 
                <i class="ivu-icon ivu-icon-md-arrow-dropdown" :class="{'on': machineAscend === false}" @click="machineAscend = false"></i>
              </span>
              <Poptip placement="bottom" transfer>
                <span class="ivu-table-filter">
                  <i class="ivu-icon ivu-icon-ios-funnel" :class="{'on': filterMachine != null && filterMachine != ''}"></i>
                </span>
                <div slot="content" style="padding:5px 0">
                  <div style="padding-bottom: 10px">机台定位</div>
                  <AutoComplete style="width:180px" placeholder="请输入机台名称" clearable transfer
                    v-model="filterMachine">
                    <div style="max-height:185px;min-height:25px">
                      <Option v-for="item in taskMachines" :value="item" :key="item" >{{ item }}</Option>
                    </div>
                  </AutoComplete>
                </div>
              </Poptip>
            </div>

          </div>
          <div v-if="activeGroup">（{{ activeGroup }}）</div>
        </div>
        <div ref="taskMachines" class="task-bars__fixed-body" v-if="tasks.length > 0" :style="{maxHeight: `${ contentHeight }px`}">
          <div v-for="({ resource }, index) in tasks" :key="index" 
            class="task-bars__cell task-bars__fixed-machine" 
            :style="{width: `${fixedBodyWidth}px`}">
            {{ resource }}
          </div>
        </div>
      </div>
      <div class="task-bars-wrapper" ref="taskBarsWrapper">
        <div class="task-bars-thead" ref="taskBarsThead">
          <div class="task-bars-thead__row" :style="{marginLeft: `${fixedBodyWidth}px`, width: `${1664 - fixedBodyWidth}px`}">
            <div class="task-bars-thead__row-cell task-bars__cell task-bars__header-cell" v-for="({date, span}, index) in firstLevelDateOptions" :key="index" :style="{ width: 48 * span + 'px'}">{{ firstLevelDate(span, date) }}</div>
          </div>
          <div class="task-bars-thead__row" :style="{marginLeft: `${fixedBodyWidth}px`, width: `${1664 - fixedBodyWidth}px`}">
            <div class="task-bars-thead__row-cell task-bars__cell task-bars__header-cell" v-for="(date, index) in secondLevelDateOptions" :key="index">{{ date }}</div>
          </div>
        </div>
        <div class="task-bars"  ref="taskBars" :style="taskBarsWrapHeight">
          <div class="task-bars--has-content"  v-if="tasks.length > 0" :style="{marginLeft: `${fixedBodyWidth}px`}">
            <div class="today-marker" :style="todayMarkerStyle">
              <!-- <div class="today-marker__content"><span>当前时间</span></div> -->
            </div>
            <Container group-name="1" v-for="({ resource, schedule, offset }, resourceIndex) in tasks"
              :get-child-payload="getChildPayload(resourceIndex)"
              @drop="onDrop(resourceIndex, $event)"
              @drag-leave="onDragLeave"
              :key="resource"
              orientation="horizontal"
              :style="{
                height: '25px',
                minHeight: '25px',
                display: 'block',
                whiteSpace: 'nowrap',
                left: `${offset*unitHourWidth}px`,
              }">
              <Draggable v-for="(task, index) in schedule"
                :style="{display: task.visible ? 'inline-block' : 'none'}"
                :key="task.key" >
                <scheduler-task-bar
                  @click.native="editTask(task, resourceIndex, index)"
                  @hover="handleHover"
                  @leave="handleLeave"
                  :task="task"
                  :offset="task.offset"
                  :date-from="dateFrom"
                  :scrolling="scrolling"
                  :unitHourWidth="unitHourWidth">
                </scheduler-task-bar>
              </Draggable>
            </Container>
          </div>
          <div class="task-bars--no-content" v-else>
            <span>暂无数据</span>
          </div>
        </div>
      </div>
    </div>

    <Tooltip placement="top-start" always :disabled="!showTooltip"  :style="{position: 'fixed', left: tooltipX + 'px', top: tooltipY + 'px', zIndex: '2000'}">
        <div slot="content">
          <p><i>生产批号：</i>{{ hoverTask.batchCode }}</p>
          <p><i>通知单：</i>{{ hoverTask.prdNoticeCode }}</p>
          <p><i>产品名称：</i>{{ hoverTask.productName }}</p>
          <p><i>台时产量：</i>{{ hoverTask.hourYield }}kg</p>
          <p><i>计划产量：</i>{{ hoverTask.productionQty }}kg</p>
          <p><i>完成产量：</i>{{ hoverTask.completionQty }}kg</p>
          <p><i>完成进度：</i>{{  hoverTask.progress }}%</p>
          <p><i>计划开始：</i>{{ hoverTask.planDateFrom }}</p>
          <p><i>计划结束：</i>{{ hoverTask.planDateTo }}</p>
          <p><i>准备时长：</i>{{ hoverTask.preparationHours }}h</p>
          <p><i>持续时间：</i>{{ hoverTask.duration }}</p>
      </div>
    </Tooltip>
    <Modal
      v-model="taskEditDialogVisible"
      title="拆分工单">
      <Form :model="editingTask" :label-width="100">
        <FormItem label="生产批号：" style="margin-bottom:10px">{{ editingTask.batchCode }}</FormItem>
        <FormItem label="产品名称：" style="margin-bottom:10px">{{ editingTask.productName }}</FormItem>
        <FormItem label="台时产量：" style="margin-bottom:10px">{{ editingTask.hourYield }}</FormItem>
        <FormItem label="计划产量：" style="margin-bottom:10px">{{ editingTask.productionQty }}</FormItem>
        <FormItem label="完成产量：" style="margin-bottom:10px">{{ editingTask.completionQty }}</FormItem>
        <FormItem label="计划开始：" style="margin-bottom:10px">{{ editingTask.planDateFrom }}</FormItem>
        <FormItem label="实际开始：" style="margin-bottom:10px">{{ editingTask.startTime }}</FormItem>
        <FormItem label="计划结束：" style="margin-bottom:10px">{{ editingTask.planDateTo }}</FormItem>
        <FormItem label="可拆分产量：" style="margin-bottom:10px">
            <Slider v-model="editingTask.splitQty" :min="0" :max="editingTask.separableQty" show-input></Slider>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="taskEditDialogVisible = false">取消</Button>  
        <Button type="primary" @click="split" >确定</Button>      
      </div>
    </Modal>
  </div>
</template>

<script>
import schedulerTaskBar from './scheduler-task-bar'
import { addDays, addHours, formatYM, formatHM, formatMD, formatYMDHMS, dateDurationHour, getScrollbarWidth } from './util'
import { filterMachineTask } from './business'
import { debounce } from 'throttle-debounce'
export default {
  data() {
    return {
      filterMachine: '',
      isScrollingX: false,
      scrollBarWidth: 15,
      scrolling: false,
      dragging: false,
      dropResults: {addItem: null, deleteItem: null},
      tasks: [],
      machineAscend: true,
      editingTask: {},
      hoverTask: {},
      tooltipX: 0,
      tooltipY: 0,
      showTooltip: false,
      taskEditDialogVisible: false,
      spliting: false,
    }
  },
  created() {
    this.tasks = filterMachineTask(this.resourceTasks, this.dateFrom, this.dateTo, this.machineAscend)
    this.scrollBarWidth = getScrollbarWidth()
  },
  mounted() {
    this.$refs.taskBars.addEventListener('scroll', () => {
      this.showTooltip = false
      window.requestAnimationFrame(() => {
        const { scrollTop, scrollLeft } = this.$refs.taskBars
        if (this.$refs.taskMachines) {
          this.$refs.taskMachines.scrollTop = scrollTop
        }
        this.$refs.taskBarsThead.scrollLeft = scrollLeft
        if (scrollLeft > 0) {
          this.isScrollingX = true
        } else {
          this.isScrollingX = false
        }
      })
    })
  },
  computed: {
    contentHeight() {
      if (this.maxTableHeight > 0) {
        let div = this.maxTableHeight - 64 - 2
        if (document.body.clientWidth < 1920) {
          div -= this.scrollBarWidth
        }
        return div - div % 25
      } else {
        return 400
      }
    },
    taskBarsWrapHeight() {
      if (document.body.clientWidth < 1920) {
        return {
          maxHeight: `${this.contentHeight + this.scrollBarWidth}px`
        }
      } else {
        return {
          maxHeight: `${this.contentHeight}px`
        }
      }  
    },
    fixedBodyWidth() {
      return 1664 - 1488 - this.scrollBarWidth
    },
    firstLevelDateOptions() {
      const options = []
      const t = new Date(this.dateFrom)
      const interval = this.interval.substr(0, 2)

      switch(this.interval) {
        case '01':
        case '08':
        case '12':
          for (let i = 0; i < 31; i++) {
            const item = options.find(({ date }) => date === formatMD(t))
            if (item) {
              item.span++
            } else {
              options.push({ date: formatMD(t), span: 1 })
            }
            addHours(t, this.interval.substr(0, 2))

          }
          break
        case '24':
        case '48':
          for (let i = 0; i < 31; i++) {
            for (let j = 0; j < interval / 24; j++) {
              const item = options.find(({ date }) => date === formatYM(t))
              if (item) {
                item.span += 24 / interval
              } else {
                options.push({ date: formatYM(t), span: 24 / interval })
              }
              addDays(t, 1)
            }
          }
          break
      }
      return options
    },
    secondLevelDateOptions() {
      const options = []
      const t = new Date(this.dateFrom)
      switch(this.interval) {
        case '01':
        case '08':
        case '12':
          for (let i = 0; i < 31; i++) {
            options.push(`${formatHM(t)}`)
            addHours(t, this.interval.substr(0, 2))

          }
          break
        case '24':
        case '48':
          for (let i = 0; i < 31; i++) {
            options.push(`${t.getDate()}`)
            addDays(t, this.interval.substr(0, 2) / 24)

          }
          break
      }
      return options
    },
    taskMachines() {
      const machines = []

      this.tasks.forEach(({ resource }) => {
        if (this.filterMachine == '' || this.filterMachine == null) {
          machines.push(resource)
          return 
        }
        if (resource.startsWith(this.filterMachine)) {
          machines.push(resource)
        }
      })
      return machines
    },
    todayMarkerStyle() {
      const duration = dateDurationHour(new Date(this.dateFrom), new Date())
      if (duration <= 0) {
        return {
          display: 'none'
        }
      }
      return {
        left: `${this.unitHourWidth * duration}px`
      }
    },
    unitHourWidth() {
      return 48 / this.interval.substr(0, 2)
    },
  },
  components: {
    schedulerTaskBar,
  },
  methods: {
    handleHover(task) {
      if (this.dragging) {
        return 
      }
      this.hoverTask = task
      this.tooltipX = task.evt.clientX - 20
      this.tooltipY = task.evt.clientY - 20
      this.showTooltip = true
    },
    handleLeave() {
      this.showTooltip = false
    },
    editTask(task, resourceIndex, index) {
      if (this.spliting) {
        this.$Message.info('请先调整分割后的通知单')
        return
      }
      const separableQty = task.productionQty - task.completionQty
      this.editingTask = { splitQty: 0, separableQty, resourceIndex, index, ...task }
      this.taskEditDialogVisible = true
    },
    split() {
      const { splitQty, separableQty } = this.editingTask
      if (splitQty === 0 || splitQty === separableQty) {
        return 
      }
      this.$emit('split', { editingTask: this.editingTask })
      
      this.spliting = true
      this.taskEditDialogVisible = false
    },
    getChildPayload(resouceIndex) {
      return (index) => {
        const payload = this.tasks[resouceIndex].schedule[index]
      }
    },
    resourceTasksStyle(tasks) {
      let minDate = null
      tasks.forEach(({ begin }) => {
        if (minDate == null) {
          minDate = begin
          return
        }
        if (begin.getTime() < minDate.getTime()) {
          minDate = begin
        }
      })
      return {
        position: 'relative',
        width: `${dateDurationHour(minDate, this.axisEndDate) * this.unitHourWidth}px`,
        left: `${-dateDurationHour(minDate, this.beginDate) * this.unitHourWidth}px`,
      }
    },
    firstLevelDate(span, date) {
      if (span <= 1) {
        return ''
      }
      return date
    },
    applyDrag() {
      const {addItemIndex, addResourceIndex, deleteItemIndex, deleteResourceIndex, payload} = this.dropResults

      if (addResourceIndex === deleteResourceIndex && addItemIndex === deleteItemIndex) {
        return { ok: false }
      }
      if (payload.openingState == 1) {
        this.$Message.warning('不能移动已完成或生产中的工单')
        return { ok: false }
      }
      const itemToAdd = { ...payload }
      itemToAdd.id = 0
      let addResource = [...this.tasks[addResourceIndex].schedule]
      let deleteResource = [...this.tasks[deleteResourceIndex].schedule]
      let afterNoticeId = null

      deleteResource.splice(deleteItemIndex, 1)
      if (addResourceIndex === deleteResourceIndex) {
        addResource = deleteResource
      }

      if (addResource[addItemIndex]) {
        if (addResource[addItemIndex].openingState == 1) {
          this.$Message.warning('不能移动至已完成或生产中的工单前')
          return { ok: false }
        } 
      }
      if (addItemIndex > 0) {
        afterNoticeId = addResource[addItemIndex-1].id
      }
      addResource.splice(addItemIndex, 0, itemToAdd)
      this.tasks[addResourceIndex].schedule = addResource
      this.tasks[deleteResourceIndex].schedule = deleteResource

      const result = { ok: true, afterNoticeId, sourceId: payload.parentId || payload.id, quantity: payload.productionQty, onMachineId: this.tasks[addResourceIndex].id, deleteMachineId: this.tasks[deleteResourceIndex].id}
      this.spliting = false
      return result
    },
    onDragLeave(dragResult) {
      this.dragging = true
      this.showTooltip = false
      this.dropResults = {addItemIndex: null, addResourceIndex: null,  deleteItemIndex: null, deleteResourceIndex: null, dropCount: 0, payload: null, success: true}
    },
    onDrop(index, dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult
      if (addedIndex != null) {
        this.dropResults.addItemIndex = addedIndex
        this.dropResults.addResourceIndex = index
      }
      if (removedIndex != null) {
        this.dropResults.deleteItemIndex = removedIndex
        this.dropResults.deleteResourceIndex = index
        this.dropResults.payload = this.tasks[index].schedule[removedIndex]
      }
      this.dropResults.dropCount++
      if (this.dropResults.dropCount === this.tasks.length) {
        const dragResult = this.applyDrag()
        this.dragging = false
        if (!dragResult.ok) {
          return 
        }
        this.$emit('tun', dragResult)
      }
    },
  },
  props: ['activeGroup', 'resourceTasks', 'interval', 'begin', 'dateFrom', 'dateTo', 'dateOffset', 'maxTableHeight', 'name' ],
  watch: {
    dateFrom() {
      this.tasks = filterMachineTask(this.resourceTasks, this.dateFrom, this.dateTo, this.machineAscend)
    },
    resourceTasks() {
      this.tasks = filterMachineTask(this.resourceTasks, this.dateFrom, this.dateTo, this.machineAscend)
    },
    machineAscend() {
      this.tasks = filterMachineTask(this.resourceTasks, this.dateFrom, this.dateTo, this.machineAscend)
    },
    filterMachine() {
      const index = this.tasks.findIndex(({ resource }) => resource === this.filterMachine)
      if (index != -1) {
        this.$refs.taskBars.scrollTop = 25 * index
        this.scroll()
      }
    }

  }
}
</script>

<style scoped>
  .scheduler-table-wrapper {
    position: relative;
    font-size: 12px; 
    overflow: hidden;
    border: 1px solid #dcdee2;
  }

  .task-bars__cell {
    border-bottom: 1px solid #e8eaec;
    border-right: 1px solid #e8eaec;
    box-sizing: border-box;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
  }

  .task-bars__header-cell {
    background-color: #f8f8f9;
    color: #515a6e;
    font-weight: 700;   
  }

  .task-bars__fixed {
    width:159px;
    position:absolute;
    top:0;
    left:0;
    text-align: center;
    z-index: 2;
    overflow-x: hidden;
    overflow-y: hidden;
    box-sizing: border-box;
  }  

  .task-bars__fixed-header {
    height: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .task-bars__fixed-body {
    max-height: 400px;
    overflow: hidden;
  }

  .task-bars__fixed-machine {
    width: 159px;
    height: 25px;
    line-height: 25px;
    background: #fff;
  }

  .task-bars_scroll-x {
    box-shadow: 2px 0 6px -2px rgba(0,0,0,.2);
  }

  .task-bars-thead {
    width: 100%;
    background-color: #f8f8f9;
    overflow: hidden;
  }

  .task-bars-thead__row {
    height: 32px;
    width: 1505px;
    margin-left: 159px;
  }

  .task-bars-thead__row-cell {
    width: 48px;
    height: 32px;
    line-height: 32px; 
    display: inline-block;
  }

  .task-bars {
    overflow: auto;
    width: 100%;
  }

  .task-bars--has-content {
    background: url(./border.png) repeat local;
    width: 1488px;
    box-sizing: border-box;
    overflow: hidden;
    margin-left: 159px;
    position: relative;
  }

  .today-marker {
    position: absolute;
    width: 2px;
    top: 0;
    bottom: 0;
    position: absolute;
    z-index: 1;
    text-align: center;
    background-color: rgba(255,0,0,.4);
    box-sizing: border-box;
  }

  .today-marker__content {
    padding: 5px;
    background: inherit;
    color: #fff;
    position: absolute;
    font-size: 12px;
    line-height: 12px;
    opacity: .8;
    white-space:nowrap;
  }

  .task-bars--no-content {
    width: 1664px;
    height: 160px;
    line-height:160px;
    text-align:center;
  }

  .pagniation {
    text-align: right;
    padding-top: 10px;
    padding-bottom: 1px;
    font-size: 14px;
  }

</style>
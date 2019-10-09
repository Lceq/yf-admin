<template>
  <div class="scheduler-task-bar-wrap" :style="wrapStyle"  @mousemove="hanedleMouseMove" @mouseleave="handleMouseLeave">
    <div class="scheduler-task-bar" :style="taskBarStyle">
      <Progress class="progress-bar" hide-info :percent="progress" :stroke-width="5" stroke-color="#19be6b"  v-if="progress > 0" />
    </div>
    <div class="scheduler-task-bar__content" :style="contentStyle">
       <div style="padding:0 5px">
          <div class="hint">
            <span class="state-tag" :style="stateStyle"></span>
            <span>{{ hint }}</span>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { addHours, formatUnixTimestamp, dateDurationDH, dateDurationHour } from './util'
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      formatUnixTimestamp: formatUnixTimestamp,
    }
  },
  mounted() {
  },
  computed: {
    wrapStyle() {
      const { duration, preparationHours, productColor } = this.task
      return {
        width: `${(duration)*this.unitHourWidth - 2}px`,
        paddingLeft: `${(preparationHours)*this.unitHourWidth}px`,
        left: `${this.offset*this.unitHourWidth}px`,
      }
    },
    taskBarStyle() {
      const { productColor } = this.task
      return {
        backgroundColor: productColor || '#17b2fb'
      }
    },
    progress() {
      const { completionQty, productionQty } = this.task
      if (productionQty == 0) {
        return 0
      }
      const d = completionQty/productionQty
      if (d >= 1) {
        return 100
      }
      return Number((d*100).toFixed(2))
    },
    progressBarStyle() {
      if (this.progress > 0) {
        return {
          width: `${this.progress}%`,
        }
      } else {
        return {
          width: '0'
        }
      }
    },
    stateStyle() {
      const { openingState, delay } = this.task
      if (delay) {
        return {
          backgroundColor: '#ff9900'
        }
      }
      if (this.progress > 0) {
        return {
          backgroundColor: '#19be6b'
        }
      }
      if (openingState == 1) {
        return {
          backgroundColor: '#19be6b'
        }
      } else {
        return {
          backgroundColor: '#e6ebf1'
        }
      }
    },
    contentStyle() {
      const { duration, preparationHours, planDateFrom, planDateTo } = this.task
      let leftHour = preparationHours
      if (dateDurationHour(new Date(planDateFrom), new Date(this.dateFrom)) > 0 && dateDurationHour(new Date(this.dateFrom), new Date(planDateTo)) > 0) {
        const dur = dateDurationHour(new Date(planDateFrom), new Date(this.dateFrom))
        if (dur > leftHour) {
          leftHour = dur
        }
      }

      return {
        width: `${(duration - leftHour) * this.unitHourWidth - 4}px`,
        left: `${ leftHour * this.unitHourWidth }px`,
        margin: '0 2px',
      }
    },
    duration() {
      const { planDateFrom, planDateTo, preparationHours } = this.task
      return dateDurationDH(addHours(new Date(planDateFrom), preparationHours), new Date(planDateTo))
    },
    hint() {
      const { batchCode, productName } = this.task
      return `${ batchCode} / ${productName} (${this.duration})`
    }
  },
  props: ['task', 'offset', 'unitHourWidth', 'scrolling', 'dateFrom'],
  methods: {
    handleMouseEnter(evt) {
    },
    hanedleMouseMove(evt) {
      this.$emit('hover', { ...this.task, duration: this.duration, progress: this.progress, evt })
    },
    handleMouseLeave() {
      this.$emit('leave')
    }
  }
}
</script>

<style scoped>
  .scheduler-task-bar-wrap {
    cursor: pointer;
    height: 18px;
    box-sizing: border-box;
    position: relative;
    font-size: 0;
    margin: 0 1px;
    border: 1px solid #049ae1;
    border-radius: 2px;
    background-color: #e8eaec;
  }

  .scheduler-task-bar {
    box-shadow: border-box;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    /* background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNEE4NEUwREFFQTYxMUUzOEMzREFBRTVCQjg1NkI5NiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowNEE4NEUwRUFFQTYxMUUzOEMzREFBRTVCQjg1NkI5NiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjA0QTg0RTBCQUVBNjExRTM4QzNEQUFFNUJCODU2Qjk2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA0QTg0RTBDQUVBNjExRTM4QzNEQUFFNUJCODU2Qjk2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+u/+i7gAAACRJREFUeNpidD34mwEMLn1kYIKzgIAFQgGBHj9MBsgCAoAAAwAVeQfO2h1NhwAAAABJRU5ErkJggg==); */

  }

  .scheduler-task-bar__content {
    position: absolute;  
    font-size: 12px;
    top: 0;
    color:#fff;
    overflow: hidden;
    white-space:nowrap;
    text-overflow: ellipsis;
  }
  .progress-bar {
    position: absolute;
    left: 0;
    bottom: -6px;
    height: 5px;
    line-height: 5px;
  }

  .state-tag {
    width:12px;
    height:12px;
    border-radius:6px;
    display:inline-block;
    position:relative;
    margin-right: 3px;
    top: 2px;
  }

  .hint {
    line-height: 16px;
    height: 16px;
    text-overflow:ellipsis;
    overflow:hidden;
    vertical-align: middle;
  }
</style>
import { dateDurationHour, today } from './util'

export function schedulerInitParam(tasks) {
  let maxDuration = 0
  let initIntervalIndex = 3
  let orders = []
  let delayTasks = []
  let minDate = null
  let maxDate = null
  let open = 0
  let close = 0
  tasks.forEach(({ schedule }) => {
  
    if (schedule && schedule[0]) {
      let opening = false
      schedule.forEach((task, index) => {
        const item = orders.find(({ prdNoticeId }) => prdNoticeId === task.prdNoticeId) 
        if (!item) {
          orders.push(task)
        }
        if (task.delay) {
          delayTasks.push(task)
        }
        if (task.openingState === 1) 
          opening = true
        task.key =`${task.machineCode}-${index}`
        const { planDateFrom, planDateTo, duration } = task
        if (index == 0) {
          if (!minDate || dateDurationHour(minDate, new Date(planDateFrom)) < 0) {
            minDate = new Date(planDateFrom)
          }
          if (duration > maxDuration) {
            maxDuration = duration
          }
        }
        if (!maxDate || dateDurationHour(maxDate, new Date(planDateTo)) > 0) {
          maxDate = new Date(planDateTo)
        }
      })
      if (opening) {
        open++
      } else {
        close++
      }
    } else {
      close++
    }
  })
  if (maxDuration > 25 * 24) {
    initIntervalIndex = 4
  }
  if (maxDuration < 15 * 24) {
    initIntervalIndex = 2
  }
  return { initIntervalIndex, minDate, maxDate, orders, delayTasks, open, close, tasks }
}

export function formatMachineTasks(machines) {
  const tasks = []
  machines.forEach(machine => {
    const { planDateFrom, planDateTo, machineName, machineId } = machine 
   
    machine.duration = dateDurationHour(new Date(planDateFrom), new Date(planDateTo)) 
    const index = tasks.findIndex(({ resource }) => resource == machineName)
    if (index !== -1) {
      if (!planDateFrom) {
        return
      }
      const { schedule } = tasks[index]
      let i = 0
      for (i = 0; i < schedule.length; i++) {
        if (dateDurationHour(new Date(schedule[i].planDateFrom), new Date(machine.planDateFrom)) < 0) {
          break
        }
      }
      schedule.splice(i, 0, machine)
    } else {
      if (planDateFrom)
        tasks.push({ resource: machineName, schedule: [machine], id: machineId })
      else 
        tasks.push({ resource: machineName, schedule: [], id: machineId })
    }
  })

  
  return schedulerInitParam(tasks)
}

export function filterMachineTask(tasks, dateFrom, dateTo, machineAscend) {
  const filteredTasks = []
  tasks.forEach(task => {
    const { schedule, resource, id } = task
    const filteredTask = { schedule: [], resource, id, offset: 0 }
    if (schedule.length === 0) {
      filteredTasks.push(filteredTask)
      return
    }
    let i = 0
    schedule.forEach(task => {
      const { planDateFrom, planDateTo } = task
      if (dateDurationHour(new Date(dateFrom), new Date(planDateTo)) > 0 && 
        dateDurationHour(new Date(planDateFrom), new Date(dateTo)) > 0 ) {
        if (i === 0) {
          filteredTask.offset = dateDurationHour(new Date(dateFrom), new Date(planDateFrom))
          task.offset = 0
        } else {
          task.offset = filteredTask.schedule[i-1].offset + dateDurationHour(new Date(filteredTask.schedule[i-1].planDateTo), new Date(planDateFrom)) 
        }
        task.visible = true
        filteredTask.schedule.push(task)
        i++
      } 
    })
    
    filteredTasks.push(filteredTask)
  })


  if (machineAscend) 
    filteredTasks.sort((a, b) => {
      if (a.schedule.length > 0 && b.schedule.length === 0) {
        return -1
      }
      if (a.schedule.length === 0 && b.schedule.length > 0) {
        return 1
      }
      return a.id - b.id
    })
  else 
    filteredTasks.sort((a, b) => {
      if (a.schedule.length > 0 && b.schedule.length === 0) {
        return -1
      }
      if (a.schedule.length === 0 && b.schedule.length > 0) {
        return 1
      }

      return b.id - a.id
    })


  return filteredTasks
  
}

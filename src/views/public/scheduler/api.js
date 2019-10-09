import { proxy } from '@/ajax/http'

async function baseHttpConfig(timeout = 600000) {
  return {
    timeout,
  }
}

function handleErr(err) {
  if (err.response && err.response.status === 401) {
    return { data: 'redirect', ok: false, message: '认证失败，请重新登陆'}
  }
  throw err
}

export async function workshopList() {
  return proxy.call(`workshop.list`, {}, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export  async function workcenterList(workshop_id, process_id) {
  return proxy.call(`workcenter.list`, { workshop_id, process_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export  async function processRunningList(workshop_id) {
  return proxy.call(`process.running.list`, { workshop_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async  function machineRunningList(process_id, workcenter_id) {
  return proxy.call(`machine.running.list`, { workcenter_id, process_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async function tunningManually(data) {
  return proxy.call(`tunning.manually`, data, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async function orderList(workshop_id) {
  return proxy.call(`order.list`, { workshop_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export function orderFailList(workshop_id) {
  return proxy.call(`order.faillist`, { workshop_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async  function orderAdd(order) {
  return proxy.call(`order.add`, order, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async function processSelect(workshop_id, last_process_id) {
  const body = { workshop_id }
  if (last_process_id) {
    body.last_process_id = last_process_id
  }
  return proxy.call(`process.select`, body, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async  function processSchedule(workshop_id, process_id) {
  return proxy.call(`schedule.run`, { workshop_id, process_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export async function completeOrder(workshop_id) {
  return proxy.call(`order.complete`, { workshop_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}

export  async function schedulePrepare(workshop_id) {
  return proxy.call(`schedule.prepare`, { workshop_id }, baseHttpConfig())
      .then(({ data }) => data)
      .catch(err => handleErr(err))
}


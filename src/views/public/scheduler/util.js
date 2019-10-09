export function calcPercent (value, total) {
  if (total == 0) {
    return '0.00%'
  }
  let p = value / total * 100
  return `${p.toFixed(2)}%`
}

export function formatPercent(value) {
  return value + '%'
}

export function addTimestampToUrl (url) {
  if (url.indexOf('?') !== -1) {
    return `${url}&${new Date().getTime()}`
  }
  return `${url}?${new Date().getTime()}`
}

export function formatFilesize (size) {
  if (size < 1024) {
    return size + 'BYTE';
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB';
  }

  if (size < 1024 * 1024 * 1024) {
    return  (size / 1024 / 1024).toFixed(2) + 'MB';
  }
}

export function isDev() {
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  return false
}

export function hostByEnv() {
  if (isDev()) {
    return '127.0.0.1:8080'
  }
  return window.location.host
}

export function today() {
  const date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export function currentHour() {
  const date = new Date()
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

export function dateBegin(date) {
  const d = new Date(date)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export function formatYMDHMS(t) {
  let y,m,d,h,i,s
	y = t.getFullYear();
	m = t.getMonth()+1;
	d = t.getDate();
	h = t.getHours();
	i = t.getMinutes();
	s = t.getSeconds();

  return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+' '+(h<10?'0'+h:h)+':'+(i<10?'0'+i:i)+':'+(s<10?'0'+s:s)
}

export function formatMDH(t) {
  let y,m,d,h,i,s
	y = t.getFullYear();
	m = t.getMonth()+1;
	d = t.getDate();
	h = t.getHours();
	i = t.getMinutes();
	s = t.getSeconds();

  return (m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+'/'+(h<10?'0'+h:h) 
}

export function formatUnixTimestamp(ts) {
	t = new Date(ts)
	return formatYMDHMS(t)
}

export function formatMD(date) {
  let m, d
 
	m = date.getMonth()+1;
  d = date.getDate();
  
  return (m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)
}

export function formatHM(date) {
  let h, m;
  h = date.getHours()
  m = date.getMinutes()
  
 return  (h<10?'0'+h:h)+':'+(m<10?'0'+m:m)

}

export function formatYM(date) {
  let y, m
 
  y = date.getFullYear();
	m = date.getMonth()+1;
  
  return y+'-'+(m<10?'0'+m:m)
}


export function dateDurationHour(start, end) {
  const duration = end.getTime() - start.getTime()
  return Math.floor(duration / 3600000)
}

export function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 3600000)
  return date
}

export function addDays(date, days) {
  date.setTime(date.getTime() + days * 24 * 3600000)
  return date
}

export function dateDurationDH(start, end) {
  const duration = dateDurationHour(start, end)
  if (duration <= 24) {
    return `${duration}H`
  }
  return `${Math.floor(duration / 24)}天${Math.round(duration % 24)}小时`
}

// 计算滚动条宽度的方法
// 新建一个带有滚动条的 div 元素，通过该元素的 offsetWidth 和 clientWidth 的差值即可获得
export function getScrollbarWidth() {
  var scrollDiv = document.createElement("div");
  scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}


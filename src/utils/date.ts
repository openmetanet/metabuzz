import { isString } from './is'

export const parseTimestamp = (date: string | Date): number => {
  if (isString(date) === true) {
    date = date.toString().replace(/-/g, '/')
  }
  return date ? new Date(date).getTime() : 0
}
// interface timeObj {
//   'M+': number; // 月份
//   'D+': number; // 日
//   'h+': number; // 小时
//   'm+': number; // 分
//   's+': number; // 秒
//   'q+': number; // 季度
//   'S': number
// }
// 格式化日期 实例 common.formatDate(date, 'YYYY-MM-DD hh:mm')
export const formatDate = (date: any, fmt = ''): Date | string | number => {
  if (!date) return ''
  if (typeof date === 'string') {
    date = date.replace(/-/g, '/')
  }
  let dateTemp: Date
  if (date > 0) {
    let dateNum = Number(date)
    if (dateNum.toString().length < 11) {
      dateNum *= 1000
    }
    dateTemp = new Date(dateNum)
  } else {
    dateTemp = new Date(date)
  }
  if (dateTemp.toString() === 'Invalid Date') {
    dateTemp = new Date(date.toString().replace(/-/g, '/'))
    if (dateTemp.toString() === 'Invalid Date') {
      return date
    }
    return date
  } else {
    date = dateTemp
  }
  const o: ObjTypes<number> = {
    'M+': date.getMonth() + 1, // 月份
    'D+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k].toString() : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

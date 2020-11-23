/* eslint @typescript-eslint/no-explicit-any: off */
export const getType = (value: any): string => {
  const result = /\s(.*)\]$/.exec(toString.call(value))
  if (result) return result[1]
  return ''
}

export const isProd = (): boolean => process.env.TYPE === 'prod'
export const isFunction = (value: any): boolean => getType(value) === 'Function'

export const isArray = (value: any): boolean => getType(value) === 'Array'

export const isNumber = (value: any): boolean => getType(value) === 'Number'

export const isNumberStr = (value: any, decimal = 10): boolean => {
  return [''].includes(value) === false && new RegExp('^(([\-|1-9]{1}\\d*)|([0]{1}))(\\.{0,1}(\\d){0,' + decimal + '})?$').test(value)
}

export const isBoolean = (value: any): boolean => getType(value) === 'Boolean'

export const isString = (value: any): boolean => getType(value) === 'String'

export const isObject = (value: any): boolean => getType(value) === 'Object'

export const isDate = (value: any): boolean => getType(value) === 'Date'

export const isEmpty = (value: any): boolean => {
  if (['Object', 'Array'].indexOf(getType(value)) > -1) {
    return Object.keys(value).length === 0
  }
  if (!value) return true
  return false
}

export const isNotEmpty = (value: any): boolean => !isEmpty(value)

export const isWindows = (function(): boolean {
  return /windows|win32/i.test(navigator.userAgent)
})()

const _isSupportedBrowser = (): boolean => {
  let supportCounter = 0
  if (window.Object) {
    // 是否支持 Object.keys
    if ('keys' in window.Object === false) {
      supportCounter++
      console.warn('Not support Object.keys')
    } else if ('assign' in window.Object === false) {
      // 是否支持 Object.assign
      supportCounter++
      console.warn('Not support Object.assign')
    } else if ('values' in window.Object === false) {
      // 是否支持 Object.values
      supportCounter++
      console.warn('Not support Object.values')
    }
  }
  if ('includes' in [] === false) {
    // 是否支持 includes
    supportCounter++
    console.warn('Not support [].includes')
  } else if (!window.Promise) {
    // 是否支持 Promise
    supportCounter++
    console.warn('Not support Promise')
  } else if (!(window.CSS && window.CSS.supports && window.CSS.supports('flex', '1'))) {
    // 是否支持css var
    supportCounter++
    console.warn('Not support css var')
  }
  return supportCounter === 0
}
const UA = window.navigator.userAgent.toLowerCase()
export const isIE = UA && /msie|trident/.test(UA)
export const isIE9 = UA && UA.indexOf('msie 9.0') > 0
export const isEdge = UA && UA.indexOf('edge/') > 0
export const isAndroid = (UA && UA.indexOf('android') > 0)
export const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA))
export const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
export const isMobile = isIOS || isAndroid
// 判断浏览器是否支持css js html5特性
export const isSupportedBrowser = _isSupportedBrowser() || isMobile

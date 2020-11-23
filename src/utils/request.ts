import Vue from 'vue'
import { CustomError } from './error'
import { getLocal, setLocal } from './storage'
// import { Decimal } from 'decimal.js'
// import * as LosslessJSON from 'lossless-json'

// const LosslessJSON = require('lossless-json')
// const reviver = (key, value: any) => {
//   if (value && value.isLosslessNumber) {
//     return new Decimal(value.toString())
//   } else {
//     return value
//   }
// }

/**
 * @description: 枚举出请求数据格式类型
 * @param {type} 枚举类型
 * @return:
 */
export enum ContentType {
  json = 'application/json;charset=UTF-8',
  form = 'application/x-www-form-urlencoded; charset=UTF-8'
}
/**
* @description: 枚举request请求的method方法
* @param {type} 枚举类型
* @return:
*/
enum HttpMethod {
  get = 'GET',
  post = 'POST'
}

/**
 * @description: 声明请求头header的类型
 * @param {type}
 * @return:
 */
interface Header {
  Accept?: string;
  'Content-Type': string;
  [propName: string]: any;
}
/**
* @description: 声明fetch请求参数配置
* @param {type}
* @return:
*/
interface ReqConfig {
  method?: string;
  credentials?: string;
  headers?: Header;
  body?: any;
}
interface Http {
  getFetch<R, P= {}>(url: string, params?: P, options?: RequestInit): Promise<R>;
  // getFetchJsonp<R,P>(url: string, params?:P, options?:RequestInit): Promise<R>;
  postFetch<R, P={}>(url: string, params?: P): Promise<R>;
}
export interface ApiRequestTypes {
  // method: string;
  url: string;
  options?: ReqConfig;
  params?: any;
}
export interface ApiParamsTypes {
  a: string; // jwt token
  n: number; // 随机数
  t: number; // 时间戳
  d?: any; // 参数
}
export interface ApiResultTypes {
  c: number;
  m?: string;
  d?: any;
}

export class HttpRequests implements Http {
  public handleUrl = (url: string) => (params: any): string => {
    if (params && typeof params === 'object') {
      const paramsArray: string[] = []
      Object.keys(params).forEach((key) =>
        paramsArray.push(key + '=' + encodeURIComponent(params[key]))
      )
      if (url.search(/\?/) === -1) {
        url += '?' + paramsArray.join('&')
      } else {
        url += '&' + paramsArray.join('&')
      }
    }
    return url
  }

  public async getFetch<R, P={}>(url: string, params?: P, options?: RequestInit): Promise<R> {
    options = {
      method: HttpMethod.get,
      credentials: 'omit',
      headers: {
        'Content-Type': ContentType.json
      }
    }
    const res = await fetch(this.handleUrl(url)(params), options).then<R>((response: any) => {
      if (response.ok) {
        return response.json()
      } else {
        // alert("服务器繁忙，请稍后再试！");
      }
    }).then<R>((response) => {
      // response.code：是与服务器端约定code：200表示请求成功，非200表示请求失败，message：请求失败内容
      if (response) {
        return response
      } else {
        // 非 200，错误处理
        return response
      }
    }).catch<R>((error) => {
      return error
    })
    return res
  }
  public async postFetch<R, P={}>(url: string, params?: ObjTypes<any>, config?: ReqConfig): Promise<R> {
    // const formData = new FormData()
    const formBody: string[] = []
    if (typeof params === 'object') {
      // Object.keys(params).forEach((key) => formData.append(key, params[key]))
      Object.keys(params).forEach((key) => {
        const encodeKey = encodeURIComponent(key)
        const encodeValue = encodeURIComponent(params[key])
        formBody.push([encodeKey, encodeValue].join('='))
      })
    }
    const options: RequestInit = {
      method: HttpMethod.post,
      // credentials: 'include',
      headers: Object.assign({
        'Content-Type': ContentType.json
      }, config?.headers),
      body: JSON.stringify(params)
    }
    if (options.headers['Content-Type'] === ContentType.form) {
      options.body = formBody.join('&')
    }
    const res = await fetch(url, options).then<R>(async (response: any) => {
      if (response.ok) {
        // 返回数字精度处理
        const resText = await response.text()
        const fmtText = resText.replace(/("[^"]*"\s*:\s*)(\d{16,})/g, '$1"$2"')
        return JSON.parse(fmtText)
        // return LosslessJSON.parse(resText, reviver)
      // } else if (response.status === 400) {
      //   Vue.toasted.error('Unauthorized！').goAway(3000)
      //   throw new Error('Unauthorized！')
      // } else if (response.status === 401) {
      //   Vue.toasted.error('Unauthorized！').goAway(3000)
      //   throw new Error('Unauthorized！')
      } else {
        // console.log(response)
        // alert("服务器繁忙，请稍后再试；\r\nCode:" + response.status);
        // Vue.toasted.error('服务器繁忙，请稍后再试；\r\nCode:' + response.status)
        throw new CustomError(response.status, response)
      }
    }).then<R>((response) => {
      // response.code：是与服务器端约定code：200表示请求成功，非200表示请求失败，message：请求失败内容
      // console.log(response)
      return response
    }).catch<R>((error) => {
      // alert("当前网络不可用，请检查网络设置！");
      if (error.code === 400) {
        Vue.toasted.error('Unauthorized！').goAway(3000)
      } else if (error.code === 401) {
        Vue.toasted.error('Unauthorized！').goAway(3000)
      } else if (error.code === 500) {
        Vue.toasted.error('网络请求失败！').goAway(3000)
      } else {
        Vue.toasted.error('当前网络不可用，请检查网络设置！').goAway(3000)
      }
      return error
    })
    return res
  }
}

export const callApi = async (config: ApiRequestTypes): Promise<ApiResultTypes> => {
  const Http = new HttpRequests()
  const url = config.url
  const accessToken = getLocal('accessToken')
  const params: ApiParamsTypes = {
    d: config.params,
    n: +new Date(),
    a: accessToken,
    t: +new Date(),
  }
  const res = await Http.postFetch<ApiResultTypes>(url, params)
  if (res.c === 200) {
    return res
  } else if (res.c === 409) {
    setLocal('accessToken', '')
    // Vue.toasted.error('登录信息已过期，请重新登录。').goAway(3000)
    setTimeout(() => {
      window.location.replace('/user/login')
    }, 3000)
    return res
  } else {
    if (res.m) {
      // Vue.toasted.error(res.m).goAway(3000)
    }
    throw res
  }
}

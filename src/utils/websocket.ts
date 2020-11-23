import config from '@/config/index';
import { isEmpty } from './is';
import { pageHidden, onVisibilitychange } from './event';
import atob from 'atob';
// export interface SocketResponce {
//   channel: string;
//   datas: { data: number [][] };
//   des: string;
//   isSuc: boolean;
// }
interface SocketCallBack {
  (res: any): void;
}
export interface WebsocketQueryParams {
  binary: boolean;
  channel: string;
  event: 'addChannel' | 'removeChannel';
  isZip: boolean;
  [key: string]: any;
}

export interface WebsocketObserve {
  subscriberId: number | string;
  channel: string;
  event: string;
  requestParams: WebsocketQueryParams;
  callback: SocketCallBack | null;
  subscribe(cb: Function | null): WebsocketObserve;
  unsubscribe(isUnsubscribe?: boolean): void;
}

let websocketInstance: WebSocket | null = null,
  notifyList: ObjTypes<WebsocketObserve> = {},
  tempQuery: WebsocketQueryParams[] = [],
  idCounter = 1,
  timer: number,
  isGzip = true;
let arr: Function[] = [], eventType = '';
// 现货交易 websocket
export const webSocketUrl = config.klineWebsocketPath + '/websocket';
function _closeWebsocket(): Promise<void> {
  return new Promise((resolve): void => {
    eventType = 'socketClose';
    if (websocketInstance) {
      arr.push(resolve);
      websocketInstance.onclose = (): void => {
        let re = null;
        while ((re = arr.shift())) {
          re();
          re = null;
        }
        websocketInstance = null;
      };
      websocketInstance.close();
      return;
    }
    resolve();
  });
}
const _getNewSocket = async (): Promise<WebSocket | null> => {
  let path = webSocketUrl;
  if (websocketInstance && path !== websocketInstance.url) {
    await _closeWebsocket();
  }
  // websocket正在连接或者已经open直接返回单例对象
  if (websocketInstance && [0, 1].indexOf(websocketInstance.readyState) > -1) {
    return websocketInstance;
  }
  if ('WebSocket' in window) {
    websocketInstance = new WebSocket(path);
  } else {
    console.error(new Error('Your browser does not support websocket.'));
  }
  return websocketInstance;
};
// eslint-disable-next-line
async function ungzip(data: any): Promise<any> {
  try {
    let pako = await import(/* webpackChunkName: 'pako' */'pako/dist/pako_inflate');
    if (data.indexOf('channel') >= 0) {
      return data; // 数据未压缩
    }
    try {
      var strData = atob(data);
      var charData = strData.split('').map(function (x: string): number { return x.charCodeAt(0); });
      var binData = new Uint8Array(charData);
      return String.fromCharCode.apply(null, new Uint16Array(pako.inflate(binData)) as never);
    } catch (e) {
      return data;
    }
  } catch (_) {
    return data;
  }
}
// eslint-disable-next-line
function dispatchData(result: any): void {
  let channel: string = result.channel; // 推送返回频道处理
  if (!channel) {
    channel = result[0] ? result[0].channel : '';
  }
  Object.values(notifyList).map((item): void => {
    // if (item.channel === 'top_all_usdt') {
    //   console.log(item, channel);
    // }
    if (item.channel === channel) {
      item.callback && item.callback(result);
    }
  });
}
// websocket消息订阅
class Observe implements WebsocketObserve {
  public subscriberId: string | number = 0;
  public channel: string = '';
  public event: string = '';
  public subscribers = [];
  public requestParams: WebsocketQueryParams;
  public socketType: string = '';
  public callback: SocketCallBack | null = null;
  public constructor(requestParams: WebsocketQueryParams) {
    this.subscriberId = idCounter++ + '';
    this.channel = requestParams.channel;
    this.event = requestParams.event;
    this.requestParams = requestParams;
  }
  public subscribe(cb: SocketCallBack | null): WebsocketObserve {
    notifyList[this.subscriberId] = this;
    this.callback = cb;
    return this;
  }
  /**
   * 取消订阅
   */
  public unsubscribe(isUnsubscribe?: boolean): void {
    if (isUnsubscribe === true) {
      if (websocketInstance && websocketInstance.readyState === websocketInstance.OPEN) {
        let has = Object.keys(notifyList).filter((id: string): boolean => {
          return notifyList[id].channel === this.channel;
        });
        // 如果只有1个或者0个订阅则发送取消订阅请求
        if (has.length <= 1) {
          websocketInstance.send(
            JSON.stringify({
              event: 'removeChannel',
              channel: this.channel
            })
          );
        }
      }
    }
    // 删除订阅者
    delete notifyList[this.subscriberId];
    timer && window.clearTimeout(timer);
    timer = window.setTimeout((): void => {
      // 删除订阅参数
      if (isEmpty(notifyList) === true) {
        _closeWebsocket();
      }
    }, 3000);
  }
}
/**
 * @param {*} params 请求数据数据
 * @param {*} eventType 订阅数据类型(trade_statistic, K, AE, T), 若该值为空则会收到服务器推送的数据尽管数据不是你想要的
 * @param {currency | margin} socketType 合约交易或者现货交易
 */
export const send = async (params: WebsocketQueryParams, callback: SocketCallBack | null, subscriberId?: number | string): Promise<WebsocketObserve | undefined> => {
  let newParams = Object.assign({}, params);
  newParams.isZip = newParams.isZip || isGzip;
  try {
    await _getNewSocket();
    if (websocketInstance === null) return;
    let has = Object.keys(notifyList).filter((id: string): boolean => {
      return notifyList[id].channel === params.channel;
    });
    // 判断是否有相关频道, 有则不发送订阅消息
    if (has.length === 0 || eventType === 'socketClose') {
      // 初始化完毕直接发送请求
      if (websocketInstance.readyState === 1) {
        websocketInstance.send(JSON.stringify(newParams));
      } else {
        // websocket未初始化完毕, 暂存消息队列
        tempQuery.push(newParams);
      }
    }
    websocketInstance.onopen = (): void => {
      let query = null;
      // 执行消息队列查询
      while ((query = tempQuery.shift())) {
        websocketInstance && websocketInstance.send(JSON.stringify(query));
      }
      eventType = '';
    };
    websocketInstance.onerror = (e): void => {
      console.log(e);
    };
    window.onbeforeunload = (): void => {
      _closeWebsocket();
    };
    // [ 市场ID, 当前成交价, 最高价，最低价, 24小时成交量，24小时涨跌幅, 分时量（按小时统计）]
    websocketInstance.onmessage = ({ data }): void => {
      if (pageHidden() === true) {
        return;
      }
      if (data instanceof Blob) {
        var reader = new FileReader();
        reader.readAsText(data);
        // 当读取操作成功完成时调用.
        // eslint-disable-next-line
        reader.onload = async function (evt: any): Promise<void> {
          if (evt.target.readyState === FileReader.DONE) {
            let result = await ungzip(evt.target.result);
            // 直接处理为json对象
            if (result.indexOf('(') !== 0) {
              // eslint-disable-next-line
              result = eval('(' + result + ')');
            } else {
              // eslint-disable-next-line
              result = eval(result);
            }
            dispatchData(result);
          }
        };
      } else {
        try {
          let result = JSON.parse(data);
          dispatchData(result);
        } catch (err) {
          dispatchData([]);
        }
      }
    };
    let notify: WebsocketObserve;
    if (subscriberId) {
      if (notifyList[subscriberId]) {
        notify = notifyList[subscriberId];
      } else {
        notify = new Observe(newParams);
        notify.subscriberId = subscriberId;
      }
    } else {
      notify = new Observe(newParams);
    }
    notify.subscribe(callback);
    return notify;
  } catch (err) {
    window.ExceptionCatch(err);
  }
};
onVisibilitychange((isHidden: boolean): void => {
  if (isHidden === true) {
    _closeWebsocket();
  } else {
    Object.keys(notifyList).map((subscriberId: string): void => {
      let item = notifyList[subscriberId];
      send(item.requestParams, item.callback, subscriberId);
    });
  }
});

// 检测页面是否进入后台运行模式
// eslint-disable-next-line
export const pageHidden = (): boolean => ['hidden', 'webkitHidden', 'mozHidden'].some((item: string): boolean => !!(window.document as ObjTypes<any>)[item]);

/* istanbul ignore next */
export const on = function (element: Element | Document | Window, event: string, handler: EventListenerOrEventListenerObject): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
};
/* istanbul ignore next */
export const off = function (element: Element | Document | Window, event: string, handler: EventListenerOrEventListenerObject): void {
  if (element && event) {
    element.removeEventListener(event, handler, false);
  }
};

/* istanbul ignore next */
export const once = function (el: Element | Document | Window, event: string, fn: EventListenerOrEventListenerObject): void {
  // eslint-disable-next-line
  var listener = function (this: any, ...args: any[]) {
    if (fn) {
      (fn as Function).apply(this, ...args);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/*
let i = 0;
let offEvent = onVisibilitychange((isHidden) => {
  console.log(isHidden);
  // removeEvent
  if (i++ > 2) offEvent();
});
*/
/* istanbul ignore next */
interface VisibleChnageCallBackType {
  (isHide: boolean): void;
}
export const onVisibilitychange = (function (): Function {
  let events: ObjTypes<string> = {
    'hidden': 'visibilitychange',
    'mozHidden': 'mozvisibilitychange',
    'webkitHidden': 'webkitvisibilitychange',
    'msHidden': 'msvisibilitychange'
  };
  let ableEventKey: string = Object.keys(events).find((eventName): boolean => eventName in document) || '';
  return function (handler: VisibleChnageCallBackType): Function {
    const callback = (): void => {
      handler(pageHidden());
    };
    on(document, events[ableEventKey], callback);
    return function(): void {
      off(document, events[ableEventKey], callback);
    };
  };
})();

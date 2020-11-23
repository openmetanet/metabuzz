type ValueType = string | number | boolean | object;
type ObjectType = ObjTypes<ValueType>;
// 将url中的query部分转成对象形式
export const parseUrlObj = (url: string): ObjectType => {
  if (!url) {
    console.error(new Error('url is empty. parse error.'));
    return {};
  }
  if (url.indexOf('?') > -1) url = url.slice(url.indexOf('?') + 1);
  let obj: ObjTypes<number | string | boolean> = {},
    reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
  while (reg.exec(url)) {
    obj[RegExp.$1] = RegExp.$2;
  }
  return obj;
};
// 获取url中指定key对应的值
export const parseUrlValue = (url: string, key: string): ValueType => (parseUrlObj(url)[key] || {});
// 判断url是否带协议
export const hasProtocol = (url: string): boolean =>
  ['http', '//'].some((c): boolean => url.indexOf(c) === 0);
// 对象转url &连接格式
export const toUrl = (obj: ObjTypes<number | string | boolean>): string => {
  let str = '';
  Object.keys(obj).map((item): void => {
    str += `${item}=${obj[item]}&`;
  });
  return str.slice(0, -1);
};
// 对象转url &连接格式, 对值进行转码, 以防签名异常
export const toEncodeUrl = (obj: any): string => {
  let str = '';
  Object.keys(obj).map((item): void => {
    str += `${item}=${obj[item]}&`;
  });
  return str.slice(0, -1)
    .replace(/\+/g, '%2B')
    .replace(/\"/g, '%22')
    .replace(/\'/g, '%27')
    .replace(/\//g, '%2F');
};

export const getBaseDomain = (): string => {
  return window.location.host ? window.location.host.split('.').slice(1, 3).join('.') : 'zb.com';
};

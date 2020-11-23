type stringOrNumber = string | number;

// 科学计数法转字符串
export function convertNumToString(num: number): string {
  // 处理非数字
  if (isNaN(num)) {
    return num + '';
  }
  // 处理不需要转换的数字
  var str = '' + num;
  if (!/e/i.test(str)) {
    return num + '';
  }
  return num.toFixed(18).replace(/\.?0+$/, '');
}
// js小数位数安全转换
export const toPrecision = (num: stringOrNumber, precision: number = 18): string => {
  num = Number(num);
  if (isNaN(num)) {
    console.warn(new Error('toPrecision error: ' + num));
    return '0';
  }
  num = +parseFloat(num.toPrecision(precision));
  return convertNumToString(num);
};
/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
export function digitLength(num: stringOrNumber): number {
  // Get digit length of e
  var eSplit = num.toString().split(/[eE]/);
  var len = (eSplit[0].split('.')[1] || '').length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
export function float2Fixed(num: stringOrNumber): string {
  if (num.toString().indexOf('e') === -1) {
    return num.toString().replace('.', '');
  }
  var dLen = digitLength(num);
  return (Number(dLen) > 0 ? Number(num) * Math.pow(10, Number(dLen)) : num).toString();
}
/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
export function checkBoundary(num: stringOrNumber): void {
  if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
    console.warn(
      num +
      ' is beyond boundary when transfer to integer, the results may not be accurate'
    );
  }
}
/**
 * 精确乘法
 */
export function multiply(num1: stringOrNumber, num2: stringOrNumber): string {
  var num1Changed = float2Fixed(num1);
  var num2Changed = float2Fixed(num2);
  var baseNum = digitLength(num1) + digitLength(num2);
  var leftValue = Number(num1Changed) * Number(num2Changed);
  return toPrecision(leftValue / Math.pow(10, Number(baseNum)));
}

export const fixNumber = (num: stringOrNumber, unit: number): string => {
  let value = Number(num).toFixed(15);
  unit = unit || 0;
  var isInt = value.indexOf('.') === -1;
  var intNum = value.split('.')[0];
  var floatNum = !isInt ? value.split('.')[1] : '0';
  var floatArry = floatNum.split('');
  var newFloatNum = '.';
  for (var i = 0; i < unit; i++) {
    if (!floatArry[i]) {
      newFloatNum += '0';
    } else {
      newFloatNum += floatArry[i];
    }
  }
  if (unit > 0) {
    return parseFloat(intNum + newFloatNum).toFixed(unit);
  }
  return '0';
};
// 非严格的小数位控制方法，末位如果是0则省略,最多返回unit位小数
// value接受数字、字符串，返回数字或字符串类型
export const fixDecimal = (value: stringOrNumber, unit: number): string => {
  var result = fixNumber(value, unit);
  if (unit > 0) {
    result = parseFloat(result).toString();
  } else {
    result = parseInt(result).toString();
  }
  if (Number(result) > 0 && Number(result) < 0.000001) {
    // 解决科学计数法显示问题，转为字符串
    result = fixNumber(value, unit);
  }
  return result;
};
/**
 * 精确加法
 */
export function plus(num1: stringOrNumber, num2: stringOrNumber): string {
  var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  return (Number(multiply(num1, baseNum)) + Number(multiply(num2, baseNum))) / baseNum + '';
}
/**
 * 精确减法
 */
export function minus(num1: stringOrNumber, num2: stringOrNumber): stringOrNumber {
  var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
  var newNum = (Number(multiply(num1, baseNum)) - Number(multiply(num2, baseNum))) / baseNum;
  return toPrecision(newNum);
}
/**
 * 精确除法
 */
export function divide(num1: stringOrNumber, num2: stringOrNumber): string {
  var num1Changed = Number(float2Fixed(num1));
  var num2Changed = Number(float2Fixed(num2)) || 1;
  checkBoundary(num1Changed);
  checkBoundary(num2Changed);
  return multiply(
    num1Changed / num2Changed,
    Math.pow(10, digitLength(num2) - digitLength(num1))
  );
}
/**
 * 四舍五入
 */
export function round(num: stringOrNumber, ratio: number): string {
  var base = Math.pow(10, ratio);
  return divide(Math.round(Number(multiply(num, base))), base);
}

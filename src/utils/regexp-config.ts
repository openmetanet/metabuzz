// 邮箱
export const isEmail = (str: string): boolean => {
  var emailReg = /^([a-zA-Z0-9]+[_|_|.|/-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+.[a-zA-Z]{2,4}$/;
  return emailReg.test(str);
};
// 手机
export const isPhone = (str: string): boolean => {
  return /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{3})(( x| ext)\d{1,5}){0,1}$/.test(str);
};
// 密码验证（至少包含 大写字母， 数字， 特殊字符中的两个, 8~20位）
export const checkPwd = (pwd: string): boolean => {
  var pwdReg = /^((?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)|((?=.*[A-Z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$)$/;
  return pwdReg.test(pwd);
};
// 全数字
export const isAllNumber = (str: string): boolean => {
  var regExp = new RegExp('^[0-9]*$');
  return regExp.test(str);
};

// 新加坡或美国的国际代码
// TODO: maintain a list of disallowed countries
export const isCountryCodeNotAllowed = (str: string): boolean => {
  return str === '+1' || str === '+65';
};

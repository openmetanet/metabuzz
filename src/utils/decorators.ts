import Toast from 'vant/lib/toast/Toast.js';
import store from '@/store/store';
import Vue from 'vue';
interface DescriptionTypes {
  configurable: boolean;
  enumerable: boolean;
  value: Function;
  writable: boolean;
}
/**
 * @param targetSelector 1.传入选择器(仅支持class及id). 2.true: 全屏 loading, false 当前组件loading.
 * @param theme 'light' | 'dark'
 */
export const Loading = (): Function => {
  return (_: any, __: string, des: DescriptionTypes): void => {
    let oldFun = des.value;
    des.value = function (this: any, ...args: any[]): void {
      Vue.nextTick(async (): Promise<void> => {
        Toast.loading({
          mask: true
        });
        await oldFun.apply(this, args);
        Vue.nextTick((): void => {
          Toast.clear();
        });
      });
    };
  };
};

export const Catch = (): Function => {
  return (_: any, __: string, des: DescriptionTypes): void => {
    let oldFun = des.value;
    des.value = async function (this: any, ...args: any[]): Promise<void> {
      try {
        await oldFun.apply(this, args);
      } catch (err) {
        console.log(err);
      }
    };
  };
};
export const NeedLogin = (): Function => {
  return (_: any, __: string, des: DescriptionTypes): void => {
    let oldFun = des.value;
    des.value = async function (this: any, ...args: any[]): Promise<void> {
      if (!store.getters['user/isLogin']) return Vue.prototype.$toast.fail('请先登录');
      await oldFun.apply(this, args);
    };
  };
};

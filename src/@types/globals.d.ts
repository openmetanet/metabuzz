import {
  VueConstructor
} from 'vue'

declare global {
  interface Window {
    Vue: VueConstructor;
  }

  interface HTMLElement {
    _clickOutside?: EventListenerOrEventListenerObject;
  }
}

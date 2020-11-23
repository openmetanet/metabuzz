import Vue, { Component, VueConstructor, DirectiveOptions } from 'vue'
import * as components from '@comps/components'
import Toast from '@comps/toast/index.js'

interface InstallUseOptions {
  transitions?: Record<string, VueConstructor>;
  directives?: Record<string, DirectiveOptions>;
  components?: Record<string, Component>;
}

const install = function (Vue: VueConstructor, args: InstallUseOptions = {}): void {
  const components = args.components || {}
  for (const key in components) {
    const component = components[key]
    Vue.component(key, component as typeof Vue)
  }

  Vue.use(Toast)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(Vue, {
    components,
  })
}

export { install, Toast }

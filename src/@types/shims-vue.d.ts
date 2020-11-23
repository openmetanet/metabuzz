import Vue from 'vue'
import MetaIdJs from 'metaidjs'
import { ConfigTypes } from '@/config/metasv-buzz'
declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  interface VueConstructor {
    AppConfig: ConfigTypes;
    $metaidjs: MetaIdJs;
  }
}

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import Toasted from 'vue-toasted'
import VueConfirmDialog from 'vue-confirm-dialog'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import MetaIdJs from 'metaidjs'
import cnCommonLang from '@cn/common.json'
import enCommonLang from '@en/common.json'
import cnHomeLang from '@cn/buzz.json'
import enHomeLang from '@en/buzz.json'
import router from '@/router/metasv-buzz'
import store from '@/store/metasv-buzz'
import '@scss/metasv-buzz.scss'
import AppConfig from '@/config/metasv-buzz'
import MetaIdDataAdapter from '@/utils/metaIdDataAdapter'
import { getUserFollowData } from '@/api/metasv-buzz'
import { strEqual } from '@/utils/common'

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(Toasted, {
  router,
  duration: 2000,
  position: 'top-center',
  fullWidth: true,
  fitToScreen: true,
})
Vue.use(VueConfirmDialog)
Vue.component('vue-confirm-dialog', VueConfirmDialog.default)

const cnLang = Object.assign({}, cnCommonLang, cnHomeLang)
const enLang = Object.assign({}, enCommonLang, enHomeLang)
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'cn': cnLang,
    'en': enLang
  }
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

Vue.prototype.AppConfig = AppConfig
Vue.prototype.NProgress = NProgress.configure({ showSpinner: false })
Vue.prototype.$MetaIdDataAdapter = new MetaIdDataAdapter()
Vue.prototype.strEqual = strEqual
Vue.prototype.$bus = new Vue({
  el: '#app',
  router,
  i18n,
  store,
  data: {
    metaidjs: {
      isLoaded: false
    }
  },
  beforeCreate() {
    store.commit('initAccessToken')
  },
  created() {
    store.watch(() => this.$store.getters.isLogined, isLogin => {
      // console.log('watched isLlogin: ', isLogin)
      if (isLogin) {
        const metaidjs = new MetaIdJs({
          baseUri: AppConfig.showMoneyUrl,
          oauthSettings: AppConfig.oauthSettings,
          onError: (error: any) => {
            if (error.code === 201 || error.code === 202) {
              store.dispatch('logout')
            }
            Vue.prototype.$toasted.error(error.data.message)
          }
        })
        // const refreshToken = this.$store.getters.refresh
        Vue.prototype.$metaidjs = this.metaidjs = metaidjs
        store.watch(() => metaidjs.isLoaded, isLoaded => {
          // console.log('watched isLoaded: ', isLoaded)
          if (isLoaded) {
            metaidjs.getUserInfo({
              accessToken: store.state.accessToken || '',
              callback: (res: any) => {
                if (res.code === 200) {
                  const userInfo = res.data
                  this.$MetaIdDataAdapter.getUserInfo(userInfo.showId).then(async (newUserInfo) => {
                    const followData = await getUserFollowData(userInfo.showId)
                    // console.log('userInfo', Object.assign(newUserInfo, followData))
                    store.dispatch('updateUserInfo', Object.assign(newUserInfo, followData))
                    store.dispatch('updateMetaIdJsStatus', true)
                  })
                } else {
                  this.$toasted.error('User authentication failed')
                  store.dispatch('logout')
                }
              }
            })
          }
        }, { immediate: true })
      }
    }, { immediate: true })
  }
  // mounted() {
  // }
})

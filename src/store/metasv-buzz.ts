import { UserInfoTypes } from '@/@types/metaid-types'
import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { setLocal, getLocal } from '@/utils/storage'
import Config from '@/config/metasv-buzz'
// import user from './metasv-buzz/user'

interface RootState {
  accessToken: string | undefined;
  refreshToken: string | undefined;
  userInfo: UserInfoTypes;
  isMetaIdJsLoaded: boolean;
  isMobile: boolean;
}
interface TokenTypes {
  accessToken: string;
  refreshToken: string;
}
Vue.use(Vuex)

const accessTokenKey = `${Config.oauthSettings.clientId}_access_token`
const refreshTokenKey = `${Config.oauthSettings.clientId}_refresh_token`

const store: StoreOptions<RootState> = {
  strict: true,
  state: {
    accessToken: undefined,
    refreshToken: undefined,
    isMetaIdJsLoaded: false,
    isMobile: false,
    userInfo: {
      metaId: '',
      metaIdTag: 'metaid',
      protocolTxId: '',
      infoTxId: '',
      name: '',
      phone: '',
      email: '',
      avatar: '',
      avatarTxId: '',
      follower: [],
      following: [],
    }
  },
  getters: {
    isLogined(state): boolean {
      return !!state.accessToken
      // const localToken = getLocal(tokenKey)
      // return (!!state.accessToken && state.accessToken !== '') || (!!localToken && localToken !== '')
    },
    isMetaIdJsLoaded(state): boolean {
      return state.isMetaIdJsLoaded
    },
    isMobile(state): boolean {
      return state.isMobile
    },
    accessToken(state): string {
      if (state.accessToken) {
        return state.accessToken
      } else if (getLocal(accessTokenKey)) {
        return getLocal(accessTokenKey)
      } else {
        return ''
      }
    },
    refreshToken(state): string {
      if (state.refreshToken) {
        return state.refreshToken
      } else if (getLocal(refreshTokenKey)) {
        return getLocal(refreshTokenKey)
      } else {
        return ''
      }
    },
    userInfo(state): UserInfoTypes {
      return state.userInfo
    }
  },
  modules: {
    // user,
  },
  mutations: {
    // 从本地存储读取 token
    initAccessToken(state) {
      if (getLocal(accessTokenKey)) {
        state.accessToken = getLocal(accessTokenKey)
      }
      if (getLocal(refreshTokenKey)) {
        state.refreshToken = getLocal(refreshTokenKey)
      }
    },
    updateAccessToken(state, tokens: TokenTypes) {
      state.accessToken = tokens.accessToken
      state.refreshToken = tokens.refreshToken
      setLocal(accessTokenKey, tokens.accessToken)
      setLocal(refreshTokenKey, tokens.refreshToken)
    },
    updateMetaIdJsStatus(state, isLoaded: boolean) {
      state.isMetaIdJsLoaded = isLoaded
    },
    updateIsMobileStatus(state, isMobile: boolean) {
      state.isMobile = isMobile
    },
    updateUserInfo(state, info: UserInfoTypes): void {
      Object.assign(state.userInfo, info)
    },
  },
  actions: {
    updateAccessToken({ commit }, tokens: TokenTypes) {
      commit('updateAccessToken', tokens)
    },
    updateMetaIdJsStatus({ commit }, isLoaded: boolean) {
      commit('updateMetaIdJsStatus', isLoaded)
    },
    updateIsMobileStatus({ commit }, isMobile: boolean) {
      commit('updateIsMobileStatus', isMobile)
    },
    updateUserInfo({ commit }, info: UserInfoTypes) {
      commit('updateUserInfo', info)
    },
    logout({ commit }) {
      console.log('logout')
      commit('updateAccessToken', '')
    }
  },
}

const storeInstance = new Vuex.Store<RootState>(store)
export default storeInstance

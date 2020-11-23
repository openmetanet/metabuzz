<template>
  <div id="buzz-home" :class="{isMobile}">
    <headerBox />
    <router-view />
    <vue-confirm-dialog></vue-confirm-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import headerBox from '@comps/metasv-buzz/header.vue'
import AppConfig from '@/config/metasv-buzz'
import { getToken } from '@/api/metasv-buzz'

@Component({
  components: {
    headerBox
  }
})
export default class BuzzIndex extends Vue {
  code: string | undefined
  @Getter('isLogined') isLogined: boolean
  @Getter('isMobile') isMobile: boolean
  @Getter('refreshToken') refreshToken: string

  @Action('updateAccessToken') updateAccessToken: Function
  @Action('updateIsMobileStatus') updateIsMobileStatus: Function
  @Action('logout') logout: Function
  async getAccessToken() {
    await getToken({
      'grant_type': 'authorization_code',
      code: this.code,
      // 'client_id': id,
      'redirect_uri': AppConfig.oauthSettings.redirectUri,
      'scope': 'app',
      'client_id': AppConfig.oauthSettings.clientId,
      'client_secret': AppConfig.oauthSettings.clientSecret
    }).then(res => {
      if (res.access_token) {
        this.updateAccessToken({
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        })
        // window.location.reload()
      } else if (res.error_description) {
        this.$toasted.error(res.error_description)
      }
    })
  }
  async refreshAccessToken() {
    await getToken({
      'grant_type': 'refresh_token',
      // 'client_id': id,
      // 'redirect_uri': AppConfig.oauthSettings.redirectUri,
      // 'scope': 'app',
      'refresh_token': this.refreshToken,
      'client_id': AppConfig.oauthSettings.clientId,
      'client_secret': AppConfig.oauthSettings.clientSecret
    }).then(res => {
      if (res.access_token) {
        // this.updateAccessToken(res.access_token)
        this.updateAccessToken({
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        })
        // window.location.reload()
      } else if (res.error_description) {
        window.localStorage.clear()
        this.$toasted.error(res.error_description)
      }
    })
  }
  async created() {
    const result = window.matchMedia('(max-width:418px)')
    this.code = this.$route.query.code
    if (this.isLogined && this.refreshToken) {
      await this.refreshAccessToken()
    }
    if (result.matches) {
      this.updateIsMobileStatus(true)
    }
    if (this.$route.path === '/') {
      if (this.code) {
        await this.getAccessToken()
      }
      this.$router.push({ path: 'list', query: { type: this.isLogined ? 'user' : 'new' } })
    }
  }
}
</script>

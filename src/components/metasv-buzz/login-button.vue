<template>
  <button @click='goAuth' class="btn-login">
    登录
  </button>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { goAuth } from '@/api/metasv-buzz'
@Component({
  components: {
  },
})
export default class LoginButton extends Vue {
  @Getter('isLogined') isLogined: boolean

  goAuth() {
    goAuth()
  }
}
</script>

<style lang="scss">
</style>

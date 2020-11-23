<template>
  <div class="action-btn follow-btn" @click.stop="doFollow">
    <template class="label-text">{{isFollowed ? '已关注' : '关注'}}</template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types.d.ts'
import { goAuth } from '@/api/metasv-buzz'

interface BuzzTypes extends MetaIdDataTypes {
  likes?: MetaIdDataTypes[];
  comments?: MetaIdDataTypes[];
  userInfo?: UserInfoTypes;
}
@Component({
  components: {
  },
})
export default class FollowButton extends Vue {
  @Prop({
    type: Object,
  })
  user: UserInfoTypes
  @Prop({
    type: Function,
  })
  callback: Function
  @Prop({
    type: [String, Number],
    default: '关注'
  })
  text: string | number

  @Getter('isLogined') isLogined: boolean
  @Getter('accessToken') accessToken: string
  @Getter('userInfo') currentUser: UserInfoTypes
  get isFollowed() {
    return this.currentUser.following.indexOf(this.user.metaId) !== -1
  }

  doFollow() {
    if (!this.isLogined) {
      return this.$confirm(
        {
          message: `Please sign in?`,
          button: {
            no: 'Cancel',
            yes: 'Sign in'
          },
          callback: confirm => {
            if (confirm) {
              goAuth()
            }
          }
        }
      )
    }
    if (this.isFollowed) return
    const followParams = {
      nodeName: 'PayFollow',
      metaIdTag: this.AppConfig.metaIdTag,
      brfcId: '8f23b51a047b',
      accessToken: this.accessToken,
      payCurrency: this.AppConfig.payCurrency,
      payTo: [
        { amount: this.AppConfig.payFollowAmount, address: buzzItem.userInfo.address },
        { amount: this.AppConfig.payFollowFee, address: this.AppConfig.projectAddress },
      ],
      dataType: 'applicaition/json',
      path: '/Protocols/PayFollow',
      data: JSON.stringify({
        createTime: new Date().getTime(),
        MetaID: this.user.metaId,
        pay: this.AppConfig.payFollowAmount,
        payTo: this.user.address
      }),
      callback: this.handleFollowed
    }
    this.$metaidjs.sendMetaDataTx(followParams)
  }
  handleFollowed(res) {
    if (typeof this.callback === 'function') {
      this.callback(res)
    }
  }
}
</script>

<style lang="scss">
  .action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i, span {
      display: inline-block;
      margin-right: 8px;
    }
    i svg {
      width: 16px;
      height: 16px;
    }
    &:hover{
      color: #24b898;
    }
  }
  .follow-btn {
    margin-top: 12px;
    max-height: 40px;
    max-width: 110px;
    padding: 9px 39px;
    text-align: center;
    color: #fff;
    background: #24b898;
    border-radius: 20px;
    font-size: 16px;
  }
</style>

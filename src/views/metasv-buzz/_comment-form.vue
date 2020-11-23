<template>
  <div class="comment-form">
    <div class="publish" v-if="isLogined && isMetaIdJsLoaded">
      <avatar v-if="showAvatar" :tx="currentUser.avatarTxId" :size="56" />
      <input type="text" v-model="comment" />
      <button @click="commentSubmit" :disabled="comment === ''">评论</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types'
import Avatar from '@comps/avatar.vue'
// import buzzItem from '@views/metasv-buzz/_buzz-item.vue'
@Component({
  components: {
    Avatar
  },
})
export default class CommentForm extends Vue {
  @Prop({
    type: Object,
    required: true,
    default: {}
  })
  buzz: MetaIdDataTypes
  @Prop({
    type: Boolean,
    default: true
  })
  showAvatar: boolean
  @Prop({
    type: Function,
  })
  callback: Function

  @Getter('isLogined') isLogined: boolean
  @Getter('accessToken') accessToken: string
  @Getter('isMetaIdJsLoaded') isMetaIdJsLoaded: boolean
  @Getter('userInfo') currentUser: UserInfoTypes

  comment = ''

  commentSubmit() {
    const buzzItem = this.buzz
    const commentParams = {
      nodeName: 'PayComment',
      metaIdTag: this.AppConfig.env === 'prod' ? 'MetaId' : 'TestShowID',
      brfcId: 'ff515b313d27',
      accessToken: this.accessToken,
      dataType: 'application/json',
      encrypt: 0,
      payCurrency: 'usd',
      payTo: [
        { amount: this.AppConfig.payCommentAmount, address: buzzItem.userInfo.address },
        { amount: this.AppConfig.payCommentFee, address: this.AppConfig.projectAddress },
      ],
      path: '/Protocols/PayComment',
      data: JSON.stringify({
        createTime: new Date().getTime(),
        MetaID: buzzItem.userInfo.metaId,
        pay: this.AppConfig.payCommentAmount,
        payTo: buzzItem.userInfo.address,
        content: this.comment, // 评论内容
        contentType: 'text/plain',
        commentTo: buzzItem.txId, // tx
      }),
      callback: this.handleCommentSuccess
    }
    this.$metaidjs.sendMetaDataTx(commentParams)
  }
  handleCommentSuccess(payload) {
    const buzzItem = this.buzz
    if (payload.code === 200) {
      const dummyComment = {
        userInfo: this.currentUser,
        data: {
          createTime: new Date().getTime(),
          content: this.comment,
          commentTo: buzzItem.txId, // tx
        },
        parentNodeName: 'PayComment',
        txId: payload.data.txId,
        rootTxId: this.currentUser.metaId,
        ShowLike: 0,
        isComment: 0,
        isQuery: true,
        isLike: false,
        timestamp: new Date().getTime(),
      }
      this.comment = ''
      this.$toasted.success('发布成功!')
      if (typeof this.callback === 'function') {
        this.callback(dummyComment)
      }
    } else {
      this.$toasted.error('发布失败!')
    }
  }
}
</script>

<style lang='scss'>
.comment-form {
  background: #2f374a;
  .publish {
    display: flex;
    padding: 25px 0;
    align-items: center;
    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }
    input {
      margin: 0 16px;
      padding-left: 10px;
      color: #FFF;
      background: #474f62;
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      border-radius: 6px;
      flex-grow: 1;
      border: 0;
    }
    button {
      width: 120px;
      height: 40px;
      color: #FFF;
      background: #24b898;
      border-radius: 6px;
      font-size: 16px;
      line-height: 40px;
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
        opacity: .5;
      }
    }
  }
}
</style>

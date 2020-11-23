<template>
  <div class="comment-box">
    <comment-form v-if="!isCommentBuzz(targetBuzz) && isLogined" :buzz="targetBuzz" :callback="handleCommentSuccess" />
    <div class="found" v-if="!isCommentBuzz(targetBuzz) && (!targetBuzz.comments || (targetBuzz.comments && !targetBuzz.comments.length))">
      <h2>MetaBuzz</h2>
      <p>还没有人评论，赶快抢个沙发</p>
    </div>
    <div v-else class="comment-list">
      <div class="comment-item" v-for="comment in targetBuzz.comments" :key="comment.txId">
        <buzz-item :buzz="comment" :isDetail="true" :show-relation="true" :has-comment-form="true" :show-footer="!isCommentBuzz(targetBuzz)" :show-avatar="!isCommentBuzz(targetBuzz)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfoTypes } from '@/store/metasv-buzz'
import { MetaIdDataTypes } from '@/@types/metaid-types.d.ts'
import { hexToBase64Img } from '@/utils/metaid'
import Avatar from '@comps/avatar.vue'
import CommentForm from '@views/metasv-buzz/_comment-form.vue'
@Component({
  components: {
    Avatar,
    CommentForm,
    buzzItem: () => import('@views/metasv-buzz/_buzz-item.vue')
  },
})
export default class CommentBox extends Vue {
  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  targetBuzz: MetaIdDataTypes

  @Getter('isLogined') isLogined: boolean
  @Getter('accessToken') accessToken: string
  @Getter('isMetaIdJsLoaded') isMetaIdJsLoaded: boolean
  @Getter('userInfo') userInfo: UserInfoTypes

  comment = ''
  defaultAvatar = 'https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png'

  avatarUrl(data: string) {
    return data ? hexToBase64Img(data) : this.defaultAvatar
  }
  handleCommentSuccess(comment: MetaIdDataTypes) {
    this.targetBuzz.comments.splice(0, 0, comment)
  }
  isCommentBuzz(buzz: MetaIdDataTypes) {
    return buzz.parentNodeName.toLowerCase() === 'paycomment'
  }
  created() {
    // this.$toasted.error('发布失败!', {
    //   position: 'top-center',
    //   fullWidth: true,
    //   fitToScreen: true,
    // })
  }
}
</script>

<style lang='scss'>
.comment-box {
  background: #2f374a;
  border-radius: 0 0 6px 6px;
  .relevant {
    .publish {
      display: flex;
      padding: 25px 16px;
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
  > .comment-form {
    border-bottom: 1px solid #474f62;
  }
  .found {
    height: 189px;
    border-top: 1px solid #474f62;
    margin: 0 16px;
    h2 {
      margin-top: 58px;
      font-size: 32px;
      color: #474f62;
      text-align: center;
    }
    p {
      margin-top: 16px;
      text-align: center;
      color: #7d90aa;
      font-size: 16px;
    }
  }
  .comment-item {
    border-top: 1px solid #474f62;
    display: flex;
    padding: 18px 0;
    .buzz-item {
      width: 100%;
      background: #2F374A;
      margin: 0 0 1px 0;
      border-radius: 0;
      .tab-content {
        padding: 0;
      }
      .item-head {
        .avatar-wrapper {
          width: 46px;
          height: 46px;
        }
        .user-info {
          h4 {
            color: #24B898;
          }
          span {
            font-size: 14px;
            font-weight: 200;
          }
        }
      }
      .item-container {
        padding: 0;
      }
      .item-content {
        padding: 10px;
        margin-left: 50px;
      }
      .dropdown {
        color: #7D90AA;
      }
      .buzz-footer .actions-wrap {
        justify-content: flex-end;
        .info-btn, .btn-box {
          width: auto;
          padding: 3px 16px;
          margin: 0;
          border-right: 1px solid #5E667A;
          &:last-child {
            border-right: 0;
          }
          &.active::after {
            display: none;
          }
          i {
            font-size: 18px;
          }
        }
      }
      .comment-box {
        margin-left: 56px;
      }
      .comment-item {
        border: 0;
        padding: 0;
        &:first-child {
          .buzz-item {
            border-radius: 6px 6px 0 0;
          }
        }
        &:last-child {
          .buzz-item {
            border-radius: 0 0 6px 6px;
          }
        }
        .buzz-item {
          margin-left: 0;
          background: #474F62;
          .item-container {
            padding: 16px;
          }
          .item-content {
            margin-left: 0;
            padding: 0;
          }
        }
      }
    }
    .comment-form {
      margin-left: 42px;
    }
  }
}
</style>

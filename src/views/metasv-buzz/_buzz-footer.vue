<template>
  <div class="buzz-footer">
    <div class="actions-wrap" @click="handleFooterClick">
      <div
        class="btn-box"
        :class="{ active: isDetail && relationTab === 'comments' }"
        @click="changeTab('comments')"
      >
        <div class="action-btn comment-btn" @click.stop="handleCommentClick">
          <i class="svg-icon">
            <svg
              class="bi bi-chat-square-text"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3821"
              width="1em"
              height="1em"
            >
              <path
                d="M864 96H160c-52.93 0-96 43.07-96 96v448c0 52.93 43.07 96 96 96h357.49c8.55 0 16.58 3.33 22.63 9.37l173.25 173.26c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37c12.5-12.5 12.5-32.76 0-45.26L585.37 700.12C567.24 681.99 543.13 672 517.49 672H160c-17.65 0-32-14.36-32-32V192c0-17.65 14.35-32 32-32h704c17.64 0 32 14.35 32 32v448c0 17.64-14.36 32-32 32h-96c-17.67 0-32 14.33-32 32s14.33 32 32 32h96c52.93 0 96-43.07 96-96V192c0-52.93-43.07-96-96-96z"
                fill-rule="evenodd"
                p-id="3822"
              ></path>
              <path
                d="M256 352h512c17.67 0 32-14.33 32-32s-14.33-32-32-32H256c-17.67 0-32 14.33-32 32s14.33 32 32 32zM256 544h512c17.67 0 32-14.33 32-32s-14.33-32-32-32H256c-17.67 0-32 14.33-32 32s14.33 32 32 32z"
                fill-rule="evenodd"
                p-id="3823"
              ></path>
            </svg>
          </i>
          <span class="num">{{ buzz.comments.length }}</span>
        </div>
      </div>
      <div
        class="btn-box"
        :class="{ active: isDetail && relationTab === 'forward' }"
        @click="changeTab('forward')"
      >
        <forward-button
          :disabled="!isDetail || !isLogined"
          :text="buzz.reposts.length"
          :item="buzz"
          :callback="handleForwardCallback"
        />
      </div>
      <div
        class="btn-box"
        :class="{ active: isDetail && relationTab === 'likes' }"
        @click="changeTab('likes')"
      >
        <like-button
          :text="buzz.likes.length"
          :item="buzz"
          :callback="handleLikeCallback"
          :class="{ active: isDetail && relationTab === 'like' }"
        />
      </div>
    </div>

    <transition name="fade">
      <div class="tab-content" v-if="isDetail && relationTab === 'comments'">
        <transition name="slide">
          <comment-form
            v-if="showCommentForm"
            :buzz="buzz"
            :show-avatar="false"
            :callback="handleCommentSuccess"
          />
        </transition>
        <div
          v-if="isDetail && buzz.isRelationLoaded && showRelation"
          class="relation-data"
        >
          <comment-box :target-buzz="buzz" />
        </div>
      </div>
      <div class="tab-content" v-if="isDetail && relationTab === 'forward'">
        <div v-if="buzz.reposts.length" class="repost-list">
          <buzz-lite
            :buzz="repost"
            v-for="repost in buzz.reposts"
            :key="repost.txId"
          />
        </div>
        <div v-else class="empty-list">
          <h2>MetaBuzz</h2>
          <p>还没有人转发，赶快转发一个吧！</p>
        </div>
      </div>
      <div class="tab-content" v-if="isDetail && relationTab === 'likes'">
        <div v-if="buzz.likes.length" class="liked-users">
          <user-item
            v-for="node in buzz.likes"
            :key="node.txId"
            :meta-id="node.rootTxId"
          />
        </div>
        <div v-else class="empty-list">
          <h2>MetaBuzz</h2>
          <p>还没有人点赞，赶快点个赞吧！</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types'
import LikeButton from '@comps/metasv-buzz/like-button.vue'
import ForwardButton from '@comps/metasv-buzz/forward-button.vue'
import CommentForm from '@views/metasv-buzz/_comment-form.vue'
import CommentBox from '@views/metasv-buzz/_comment-box.vue'
import UserItem from '@views/metasv-buzz/_user-item.vue'
import BuzzLite from '@views/metasv-buzz/_buzz-lite.vue'
// import buzz from '@views/metasv-buzz/_buzz-item.vue'
@Component({
  components: {
    LikeButton,
    ForwardButton,
    CommentBox,
    CommentForm,
    UserItem,
    BuzzLite,
  },
})
export default class BuzzFooter extends Vue {
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
  isDetail: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  showRelation: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  hasCommentForm: boolean

  @Getter('isLogined') isLogined: boolean
  @Getter('userInfo') currentUser: UserInfoTypes

  relationTab = 'comments'
  showCommentForm = false

  changeTab(tab) {
    this.relationTab = tab
  }
  handleFooterClick() {
    if (!this.isDetail) {
      this.$router.push({ path: `/detail/${this.buzz.txId}` }).catch(() => { return false })
    }
  }
  handleCommentClick() {
    if (this.isDetail) {
      this.showCommentForm = !this.showCommentForm && this.hasCommentForm
    } else {
      this.$router.push({ path: `/detail/${this.buzz.txId}` }).catch(() => { return false })
    }
  }
  handleForwardCallback(payload) {
    console.log(payload)
  }
  handleLikeCallback(payload) {
    // console.log(payload)
    const buzzItem = this.buzz
    if (payload.code === 200) {
      this.$toasted.success('发布成功!')
      const dummyNode = {
        userInfo: this.currentUser,
        data: {
          createTime: new Date().getTime(),
          isLike: '1',
          likeTo: buzzItem.txId,
        },
        parentNodeName: 'PayLike',
        txId: payload.data.txId,
        rootTxId: this.currentUser.metaId,
        ShowLike: 0,
        isComment: 0,
        isQuery: true,
        isLike: false,
        timestamp: new Date().getTime(),
      }
      buzzItem.likes.splice(0, 0, dummyNode)
    }
  }
  handleCommentSuccess(comment: MetaIdDataTypes) {
    this.showCommentForm = false
    this.buzz.comments.splice(0, 0, comment)
  }
}
</script>

<style lang='scss'>
.buzz-footer {
  .actions-wrap {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid #2f374a;
    padding: 10px 0;
    .info-btn,
    .btn-box {
      color: #7d90aa;
      border-right: 1px solid #2f374a;
      padding: 8px 0;
      margin: 0 16px;
      width: 33.33%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      &.active::after {
        content: ' ';
        position: absolute;
        left: 50%;
        top: 100%;
        margin-left: -5px;
        margin-top: 2px;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #2f374a;
      }
      &:last-child {
        border-right: 0;
      }
      i {
        font-size: 24px;
        margin-right: 8px;
      }
    }
  }
  .tab-content {
    background: #2f374a;
    padding: 0 30px 0;
    .empty-list {
      text-align: center;
      padding: 50px 0;
      color: #7d90aa;
      h2 {
        font-size: 32px;
        margin: 16px 0;
        color: #474f62;
      }
    }
    .user-item {
      .follow-data {
        display: none;
      }
    }
  }
}
</style>

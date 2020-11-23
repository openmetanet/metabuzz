<template>
  <div class="forward-item" :class="[`buzz-${buzzData.parentNodeName}`, buzzData.data.rePostComment !== '' ? 'has-comment' : '']">
    <div v-if="buzzData.userInfo" class="item-container">
      <template v-if="buzzData.data.rePostComment !== ''">
        <div class="item-head">
          <router-link tag="div" :to="`/user/${buzzData.rootTxId}/buzz`" class="user-container" v-if="isLoaded">
            <avatar :tx="buzzData.userInfo.avatarTxId" :size="56" />
            <div class="user-info">
              <h4>
                {{buzzData.userInfo.name}}
                <span>{{buzzData.rootTxId.substr(0, 6)}}</span>
              </h4>
              <p>{{buzzData.timestamp | datetime}}</p>
            </div>
          </router-link>

          <div class="user-options">
            <i class="iconfont iconicon-arrow-bottom2"></i>
            <div class="item-options">
              <span>查看TX</span>
              <span>翻译</span>
              <span>分享</span>
            </div>
          </div>
        </div>
        <div class="item-content" @click="viewDetail(buzzData.txId)" >
          <p v-if="this.buzz.parentNodeName.toLowerCase() === 'paycomment' && buzzData.originalNode &&  buzzData.originalNode.userInfo">回复 <span class="user-name">@{{buzzData.originalNode.userInfo.name}}</span></p>
          <p>{{buzzData.data.rePostComment}} {{buzzData.data.content}}</p>
        </div>
      </template>
      <div v-else class="forward-mark">
        <router-link tag="div" :to="`/user/${buzzData.rootTxId}/buzz`" class="user-container" v-if="isLoaded">
          <i class="svg-icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-up-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"/>
            </svg>
          </i>
          <avatar :tx="buzzData.userInfo.avatarTxId" :size="9" />
          <span>
            {{buzzData.userInfo.name}} 转发了
          </span>
        </router-link>
      </div>
    </div>
    <div class="item-original" v-if="buzzData.originalNode">
      <buzz-item v-if="buzzData.originalNode.encrypt === '0'" :buzz="buzzData.originalNode" :show-footer="buzzData.data.rePostComment === ''" :show-avatar="buzzData.data.rePostComment === ''" />
      <div v-else class="content-reject">内容无权访问</div>
    </div>
    <buzz-footer :buzz="buzzData" :is-detail="isDetail"  v-if="showFooter && buzzData.data.rePostComment !== '' && buzzData.isRelationLoaded " />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
// import { hexToBase64Img } from '@/utils/metaid'
import { formatDate } from '@/utils/date'
// import { MetaIdDataTypes } from '@/@types/metaid-types.d.ts'
// import { UserInfoTypes } from '@/store/metasv-buzz.ts'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types'
import { getBuzzRelationData, getBuzzDetail } from '@/api/metasv-buzz'
import Avatar from '@comps/avatar.vue'
import Metafile from '@comps/metafile.vue'
import BuzzItem from '@views/metasv-buzz/_buzz-item.vue'
import BuzzFooter from '@views/metasv-buzz/_buzz-footer.vue'
// import optionModule from '@views/metaSV/module/optionModule.vue'
@Component({
  components: {
    Avatar,
    BuzzFooter,
    BuzzItem,
    Metafile,
    // optionModule
  },
  filters: {
    datetime(val) {
      return formatDate(val, 'YYYY-MM-DD hh:mm:ss')
    }
  }
})
export default class QuoteItem extends Vue {
  @Prop({
    type: Object,
    required: true,
    default: {}
  })
  buzz: MetaIdDataTypes
  @Prop(Boolean)
  isDetail: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  hasLink: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  showFooter: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  isGetRelation: boolean
  @Prop({
    type: Boolean,
    default: true
  })
  showRelation: boolean

  @Getter('userInfo') userInfo: UserInfoTypes
  defaultAvatar = 'https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png'
  relationTab = 'comments'
  buzzData = {
    txId: '',
    parentNodeName: '',
    data: {
      rePostComment: '',
      attachments: []
    },
    userInfo: {
      avatarTxId: ''
    },
    originalNode: null,
    isRelationLoaded: false,
    comments: [],
    likes: [],
    reposts: [],
    iisRelationLoaded: false,
  }

  get isLoaded() {
    return this.buzzData.userInfo.metaId || this.buzzData.userInfo.showId
  }

  viewDetail() {
    if (this.isDetail || !this.hasLink) return
    this.$router.push({ path: `/detail/${this.buzzData.txId}` }).catch(() => { return false })
  }
  async created() {
    this.buzzData = Object.assign(this.buzzData, this.buzz)
    const userInfo = await this.$MetaIdDataAdapter.getUserInfo(this.buzz.rootTxId)
    this.buzzData.userInfo = userInfo
    // 获取关联信息
    const relationDataRes = await getBuzzRelationData(this.buzz.txId)
    this.buzzData.isRelationLoaded = true
    if (relationDataRes.code === 200 && relationDataRes.result.data.length) {
      const list = relationDataRes.result.data
      list.forEach(data => {
        if (data.parentNodeName.toLowerCase() === 'paylike') {
          this.buzzData.likes.push(data)
        } else if (data.parentNodeName.toLowerCase() === 'paycomment') {
          this.buzzData.comments.push(data)
        } else if (data.parentNodeName.toLowerCase() === 'simplerepost') {
          this.buzzData.reposts.push(data)
        }
      })
    }
    const parentNodeName = this.buzz.parentNodeName?.toLowerCase()
    if (['simplerepost', 'paycomment'].indexOf(parentNodeName) !== -1) {
      // console.log(parentNodeName)
      const id = parentNodeName === 'simplerepost' ? this.buzz.data.rePostTx : this.buzz.data.commentTo
      getBuzzDetail(id).then(async (res) => {
        let originalNode = res.result.data[0]
        if (originalNode) {
          originalNode.userInfo = await this.$MetaIdDataAdapter.getUserInfo(originalNode.rootTxId)
        } else {
          originalNode = {}
        }
        this.buzzData.originalNode = originalNode
      })
    }
  }
}
</script>

<style lang="scss">
.forward-item {
  background: #474f62;
  margin-bottom: 10px;
  border-radius: 6px;
  .forward-mark {
    color: #24B898;
    padding: 16px 0 0 0;
    .avatar-wrapper{
      width: 18px;
      height: 18px;
    }
    span{
      vertical-align: top;
    }
  }
  .item-container {
    padding: 30px;
    padding-bottom: 0;
    >p {
      i, span {
        color: #24B898;
      }
      margin-left: 45px;
    }
  }
  .item-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-container {
      display: flex;
      align-items: center;
      .avatar-wrapper {
        margin-right: 16px;
        width: 56px;
        height: 56px;
      }
    }
    .user-info {
      h4 {
        font-size: 18px;
        line-height: 1.8;
        span {
          color: #7d90aa;
          margin-left: 10px;
        }
      }
      p {
        color: #7d90aa;
        font-size: 14px;
      }
    }
  }
  .item-original {
    .buzz-item {
      .item-head .user-container .avatar-wrapper {
        width: 42px;
        height: 42px;
      }
      .item-container {
        padding: 16px 30px 16px 30px;
      }
      .item-footer {
        background: #474f62;
      }
    }
    .content-reject {
      padding: 30px;
      background: #2f374a;
      border-radius: 0 0 6px 6px;
    }
  }
  &.has-comment {
    .item-original {
      .buzz-item {
        border-radius: 0;
        background: #2F374A;
        margin-bottom: 0;
        padding-left: 20px;
        .item-container {
          padding-top: 32px;
        }
      }
    }
  }
  .user-options {
    position: relative;
    .item-options {
      display: none;
      position: absolute;
      background: #fff;
      width: 88px;
      text-align: center;
      border-radius: 5px;
      right: 0;
      span {
        color: #2f374a;
        font-size: 12px;
        height: 33px;
        line-height: 33px;
        display: block;
        cursor: pointer;
      }
    }
    &:hover .item-options {
      display: block;
    }
  }
  .item-content {
    padding: 16px 0;
    cursor: pointer;
    p {
      line-height: 1.5;
      font-size: 18px;
      margin: 8px 0;
      .user-name {
        color: #24B898;
        margin: 0 5px;
      }
    }
  }
  .item-footer {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-top: 1px solid #2F374A;
    padding: 10px 0;
    .info-btn,
    .action-btn {
      color: #7D90AA;
      border-right: 1px solid  #2F374A ;
      padding:  8px 0;
      margin: 0 16px;
      width: 33.33%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
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
        border-bottom: 10px solid #2F374A;
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
}
</style>

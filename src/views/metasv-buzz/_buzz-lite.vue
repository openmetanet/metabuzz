<template>
  <div class="buzz-item" :class="'buzz-' + buzzItem.parentNodeName" >
    <div v-if="buzzItem.userInfo" class="item-container">
      <div class="item-head">
        <router-link tag="div" :to="`/user/${buzzItem.userInfo.metaId}/buzz`" class="user-container" v-if="isLoaded">
          <avatar v-if="showAvatar" :tx="buzzItem.userInfo.avatarTxId" :size="56" />
          <div class="user-info">
            <h4>
              {{buzzItem.userInfo.name}}
              <span>{{buzzItem.rootTxId.substr(0, 6)}}</span>
            </h4>
            <p>{{buzzItem.timestamp | datetime}}</p>
          </div>
        </router-link>

        <div class="user-options">
          <dropdown>
            <i class="svg-icon">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
              </svg>
            </i>
            <div slot="content" class="buzz-act-popup">
              <div class="item-options" >
                <a :href="`https://whatsonchain.com/tx/${buzzItem.txId}`" target="_blank">查看TX</a>
                <!-- <span>翻译</span> -->
                <span @click="coming">分享</span>
              </div>
            </div>
          </dropdown>
        </div>
      </div>
      <div class="item-content" @click="viewDetail" >
        <!-- <p v-if="strEqual(buzzItem.parentNodeName, 'metanote')">发布了笔记</p> -->
        <div v-html="displayContent(buzzItem)" :class="{'markdown-body': buzzItem.data.contentType === 'text/markdown'}"></div>
        <div class="images-wrapper" v-if="buzzItem.parentNodeName.toLowerCase() === 'simplemicroblog' && buzzItem.data.attachments " :class="[{multi: buzzItem.data.attachments.length > 2}, `attachments-count-${buzzItem.data.attachments.length}`]">
          <!-- <metafile :src="metafile" v-for="(metafile, index) in buzzItem.data.attachments" :key="index" /> -->
          <meta-image v-show="metafile !== ''" :src="getImageUrl(metafile)" :preview-src-list="getPreviewList(buzzItem.data.attachments)"  v-for="(metafile, index) in buzzItem.data.attachments" :key="index" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import MarkdownIt from 'markdown-it'
// import { Getter } from 'vuex-class'
// import { hexToBase64Img } from '@/utils/metaid'
import { formatDate } from '@/utils/date'
import { MetaIdDataTypes } from '@/@types/metaid-types'
// import { getBuzzRelationData, getBuzzDetail } from '@/api/metasv-buzz'
import Avatar from '@comps/avatar.vue'
import Metafile from '@comps/metafile.vue'
import Dropdown from '@comps/dropdown.vue'
import MetaImage from '@comps/image/index.vue'
// import optionModule from '@views/metaSV/module/optionModule.vue'
@Component({
  components: {
    Avatar,
    Dropdown,
    Metafile,
    MetaImage,
    // optionModule
  },
  filters: {
    datetime(val) {
      return formatDate(val, 'YYYY-MM-DD hh:mm:ss')
    },
  }
})
export default class BuzzLite extends Vue {
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
  showAvatar: boolean
  @Prop({
    type: Boolean,
    default: true
  })

  buzzItem = {
    txId: '',
    parentNodeName: '',
    rootTxId: '',
    data: {
      attachments: []
    },
    userInfo: {
      avatarTxId: ''
    },
    isRelationLoaded: false,
    comments: [],
    likes: [],
    reposts: [],
  }

  get isLoaded() {
    return this.buzzItem.userInfo.metaId || this.buzzItem.userInfo.showId
  }
  get isMetaNote() {
    return this.strEqual(this.buzzItem.parentNodeName, 'metanote')
  }
  get isRepost() {
    return this.strEqual(this.buzzItem.parentNodeName, 'simplerepost')
  }

  avatarUrl(txId: string) {
    return txId && txId !== '' ? `https://showman.showpay.io/metafile/${txId}` : this.defaultAvatar
  }
  getImageUrl(src) {
    const srcArray = src.split('://')
    const fileId = srcArray[1]
    let url = src
    if (srcArray[0] === 'metafile') {
      url = fileId && fileId !== '' ? `${this.AppConfig.showManUrl}/metafile/${fileId}` : null
    }
    return url
  }
  getPreviewList(files: string[]) {
    const fileList = []
    if (files && files.length) {
      files.forEach(file => {
        fileList.push(this.getImageUrl(file))
      })
    }
    return fileList
  }
  displayContent(buzz) {
    if (this.isMetaNote && this.isDetail) {
      const md = new MarkdownIt({
        html: true
      })
      const html = md.render(buzz.data.content)
      return html
    } else if (this.isRepost) {
      let content = buzz.data.rePostComment || ''
      content = content === '' ? '快速转发' : this.handleHashTags(content)
      return content.replace(/\\n/g, '<br />')
    } else if (this.isMetaNote && !this.isDetail) {
      return `发布了笔记《${buzz.data.title}》`
    } else if (!this.isDetail) {
      let content = buzz.data.content || ''
      if (content.length > 140) {
        content = content.substring(0, 140) + '...<span class="more">全文</span>'
      }
      content = this.handleHashTags(content)
      return content.replace(/(?:\r\n|\r|\n|\\n)/g, '<br />')
    } else {
      let content = buzz.data.content || ''
      content = this.handleHashTags(content)
      return content.replace(/(?:\r\n|\r|\n|\\n)/g, '<br />')
    }
  }
  handleHashTags(val) {
    const html = val.replace(/#([\u4e00-\u9fa5_\w-]+)#/g, '<a href="' + this.$router.options.base + 'list?tag=$1">$&</a> ')
    return html
  }
  coming() {
    this.$confirm(
      {
        message: `Coming soon`,
        button: {
          yes: 'OK'
        },
      }
    )
  }
  viewDetail() {
    if (this.isDetail || !this.hasLink) return
    this.$router.push({ path: `/detail/${this.buzzItem.txId}` }).catch(() => { return false })
  }
  async created() {
    const buzzItem = Object.assign(this.buzzItem, this.buzz)
    const userInfo = await this.$MetaIdDataAdapter.getUserInfo(this.buzzItem.rootTxId)
    buzzItem.userInfo = userInfo
    this.buzzItem = buzzItem
  }
}
</script>

<style lang="scss">
.buzz-item {
  background: #474f62;
  margin-bottom: 10px;
  border-radius: 6px;
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
    .iconicon-arrow-bottom2 {
      font-size: 14px;
      color: #7d90aa;
    }
  }
  .user-options {
    position: relative;
  }
  .item-content {
    padding: 16px 0;
    line-height: 1.5;
    .more {
      color: #24b898;
    }
    p {
      font-size: 18px;
    }
    a {
      color: #24B898;
      margin: 0 3px;
      &:hover{
        text-decoration: underline;
      }
    }
    .markdown-body {
      padding: 10px 0;
    }
    .images-wrapper {
      display: flex;
      margin: 10px 0;
      overflow: hidden;
      flex-wrap: wrap;
      justify-content: center;
      .metafile-viewer {
        max-height: 450px;
        flex-grow: 1;
        display: inline-flex;
        align-items: center;
        flex-basis: 45%;
        margin: 5px;
        border-radius: 6px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
        }
      }
      &.multi {
        .image-placeholder,
        .metafile-viewer {
          width: 210px;
          max-width: 210px;
          height: 210px;
          flex-basis: 210px;
          margin: 6px;
          border-radius: 3px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: #414859;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      &.attachments-count-2,
      &.attachments-count-4 {
        .image-placeholder,
        .metafile-viewer {
          max-width: 324px;
          width: 324px;
          height: 324px;
          flex-basis: 324px;
        }
      }
    }
  }
}
.buzz-act-popup {
  .item-options {
    background: #fff;
    width: 88px;
    text-align: center;
    border-radius: 5px;
    overflow: hidden;
    span, a {
      color: #2f374a;
      font-size: 12px;
      height: 33px;
      line-height: 33px;
      display: block;
      cursor: pointer;
      text-decoration: none;
      &:hover{
        background-color: #EFF3F6;
      }
    }
  }
}
.slide-enter-active {
  transition-duration: .5s;
  transition-timing-function: ease-in;
}
.slide-leave-active {
  transition-duration: .5s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}
.slide-enter-to, .slide-leave {
   max-height: 10000px;
   overflow: hidden;
}
.slide-enter, .slide-leave-to {
   overflow: hidden;
   max-height: 0;
}
</style>

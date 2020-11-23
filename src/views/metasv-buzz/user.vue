<template>
  <div id="user-buzz-list" sticky-container>
    <sticky-box top="66px" class="sidebar-left">
      <sidebar :meta-id="userId" :active-nav="dataType" :show-user-info="false" />
    </sticky-box>
    <!-- <div class="sidebar-wrapper" v-sticky sticky-offset="{top: 66}" sticky-side="top" on-stick="onStick" >
    </div> -->
    <div class="container">
      <div class="user-banner">
        <user-item :meta-id="userId" />
      </div>
      <!-- <div class="sidebar-wrapper" v-sticky sticky-offset="{top: 66}" sticky-side="top" on-stick="onStick" >
        <sidebar :meta-id="userId" :active-nav="dataType" :show-user-info="false" />
      </div> -->
      <Media v-if="dataType == 'media' && userInfo.metaId" :user="userInfo" />
      <div class="index-content" v-else>
        <!-- <publish-box /> -->
        <div class="list-wrapper">
          <div v-for="buzz in metaBuzzList" :key="buzz.txId">
            <quote-item
              v-if="
                ['simplerepost', 'paycomment'].indexOf(
                  buzz.parentNodeName.toLowerCase()
                ) !== -1
              "
              :buzz="buzz"
            />
            <buzz-item v-else-if="buzz.encrypt === '0' || (buzz.encrypt === '1' && buzz.rootTxId === currentUser.metaId)" :buzz="buzz" />
          </div>
        </div>
        <div class="loading-more" v-if="loadingMore">加载更多...</div>
        <div class="no-more" v-if="isEnd">没有更多了</div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types.d.ts'
import { queryMetaIdData } from '@/api/metasv-buzz'
// import scroll from '@comps/scroll.vue'
import StickyBox from '@/components/sticky-box.vue'
import Sticky from '@/directives/sticky.js'
import Sidebar from './_sidebar.vue'
import AsideBox from './_aside.vue'
import BuzzItem from './_buzz-item.vue'
import QuoteItem from './_quote-item.vue'
import PublishBox from './_publish-box.vue'
import UserItem from './_user-item.vue'
import Media from './media.vue'
@Component({
  components: {
    // scroll,
    Sidebar,
    AsideBox,
    BuzzItem,
    QuoteItem,
    PublishBox,
    StickyBox,
    UserItem,
    Media,
  },
  directives: {
    Sticky
  },
})
export default class UserBuzzList extends Vue {
  code: string | undefined
  pageNum = 1
  pageSize: 20
  metaBuzzList: MetaIdDataTypes[] = []
  loadingMore = false
  isEnd = false

  userId: string
  userInfo: UserInfoTypes = {}
  dataType: string

  @Getter('isLogined') isLogined!: boolean
  @Getter('userInfo') currentUser: UserInfoTypes
  @Watch('$route', { immediate: true })
  onRouteChange(to, from) {
    if (to.fullPath !== from?.fullPath) {
      this.metaBuzzList = []
      this.pageNum = 1
      this.loadingMore = false
      this.userId = to.params.metaId
      this.dataType = to.params.type
      this.getUserInfo(to.params.metaId)
      this.getBuzzList()
    }
  }
  // @Watch('dataType', { immediate: true })
  // handleTypeChange(type) {
  //   console.log(type)
  //   this.getBuzzList()
  // }

  async getUserInfo(userId: string) {
    const userInfo = await this.$MetaIdDataAdapter.getUserInfo(userId, false)
    this.userInfo = userInfo
  }

  async getBuzzList() {
    if (this.loadingMore || this.isEnd) return
    const params = {
      find: {
        // $and: [
        //   {
        //     $or: [
        //       // {
        //       //   parentNodeName: 'ShowText'
        //       // },
        //       {
        //         parentNodeName: 'SimpleMicroblog'
        //       },
        //       {
        //         parentNodeName: 'SimpleRePost'
        //       },
        //       // {
        //       //   parentNodeName: 'metanode',
        //       //   'data.isPrivate': 0
        //       // },
        //     ],
        //   },
        // ],
        metaId: this.AppConfig.metaIdTag,
        isNew: true,
        rootTxId: '',
      },
      sort: {
        timestamp: -1
      },
      skip: this.pageNum,
      limit: this.pageSize
    }
    if (this.dataType === 'buzz') {
      params.find.rootTxId = this.userId
      params.find['$or'] = [
        { parentNodeName: 'SimpleMicroblog' },
        { parentNodeName: 'metanote' },
      ]
      // params.find.parentNodeName = 'SimpleMicroblog'
    } else if (this.dataType === 'comments') {
      params.find.rootTxId = this.userId
      params.find.parentNodeName = 'PayComment'
    } else if (this.dataType === 'likes') {
      params.find.rootTxId = this.userId
      params.find.parentNodeName = 'PayLike'
    } else if (this.dataType === 'forwards') {
      params.find.rootTxId = this.userId
      params.find.parentNodeName = 'SimpleRePost'
    } else {

    }
    this.loadingMore = true
    this.NProgress.start()
    const res = await queryMetaIdData(params)
    if (res?.code === 200) {
      const list = res.result.data
      // 是否已经没有更多了
      if (list.length < this.pageSize) {
        this.isEnd = true
      }
      this.metaBuzzList = this.metaBuzzList.concat(list)
      window.scrollTo({
        top: window.pageYOffset - 10,
        behavior: 'smooth'
      })
      this.NProgress.done()
      setTimeout(() => {
        this.loadingMore = false
      }, 3000)
    } else {
      this.$toasted.error('获取数据失败.')
      this.loadingMore = false
      this.NProgress.remove()
    }
  }
  handleScroll() {
    const dom = document.getElementById('app')
    const scrollHeight = Math.max(dom.scrollHeight, document.documentElement.scrollHeight)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    const innerHeight = window.innerHeight
    // console.log(scrollTop, window.innerHeight, scrollHeight)
    if (innerHeight + scrollTop >= scrollHeight && !this.loadingMore && !this.isEnd) {
      this.pageNum += 1
      this.getBuzzList()
      // console.log('loading more')
    }
  }
  onSticky() {
    console.log('sticky')
  }
  created() {
    // this.getUserInfo(this.userId)
    // this.getBuzzList()
    window.addEventListener('scroll', this.handleScroll, true)
  }
}
</script>
<style lang="scss">
#user-buzz-list {
  min-height: calc(100vh - 50px);
  max-width: 1200px;
  padding: 0 10px;
  width: 100%;
  padding-top: 25px;
  margin: 0 auto;
  // display: flex;
  // flex-direction: column;
  .sidebar-left {
    float: left;
    margin: 388px 16px 0 16px;
  }
  .user-banner {
    width: 100%;
    max-width: 736px;
    display: flex;
    justify-content: center;
    .user-item {
      max-width: 360px;
      flex-direction: column;
      border-bottom: 0;
      text-align: center;
      padding: 30px 0;
      .info {
        display: flex;
        flex-direction: column;
        padding: 0;
        .avatar-wrapper {
          width: 140px;
          height: 140px;
        }
        .user-name {
          line-height: 160%;
          margin: 8px auto;
          text-align: center;
        }
      }
      .follow-data {
        margin: 10px auto;
      }
    }
  }
  .container {
    display: flex;
    justify-content: center;
    position: relative;
    flex-direction: column;
  }
  .index-content {
    max-width: 736px;
    width: 100%;
    margin: 0 15px;
  }
  .list-wrapper {
    margin-top: 16px;
    .buzz-item {
      cursor: pointer;
    }
  }
  .loading-more,
  .no-more {
    text-align: center;
    padding: 30px 0;
  }
}
</style>

<template>
  <div id="buzz-list">
    <sidebar
      v-if="isLogined"
      :meta-id="userInfo.metaId"
      :show-user-info="true"
    />
    <div class="index-content">
      <publish-box v-if="isLogined && !this.isMobile" />
      <div class="tag-title" :class="{ login: isLogined, nolgin: !isLogined }" v-if="listTag">
        <h6>#{{ listTag }}#</h6>
      </div>
      <div
        v-else
        class="list-tabs"
        :class="{ login: isLogined, nolgin: !isLogined }"
      >
        <router-link
          v-if="isLogined"
          tag="div"
          class="tab"
          :class="{ active: listType === 'user' }"
          :to="{ path: 'list', query: { type: 'user' } }"
          >关注</router-link
        >
        <router-link
          tag="div"
          class="tab"
          :class="{ active: listType === 'new' }"
          :to="{ path: 'list', query: { type: 'new' } }"
          >最新</router-link
        >
        <router-link
          tag="div"
          class="tab"
          :class="{ active: listType === 'hot' }"
          :to="{ path: 'list', query: { type: 'hot' } }"
          >热门</router-link
        >
      </div>
      <div class="list-wrapper">
        <div
          class="no-following"
          v-if="
            !listTag &&
            listType === 'user' &&
            !loadingMore &&
            !userInfo.following.length
          "
        >
          <div class="inner">
            <p>暂时没有关注其它用户</p>
            <router-link
              :to="{ name: 'users', params: { type: 'recommand' } }"
              class="btn btn-recommand-users"
              >关注用户</router-link
            >
          </div>
        </div>
        <div v-for="(buzz, index) in metaBuzzList" :key="buzz.txId + index">
          <quote-item
            v-if="buzz.parentNodeName.toLowerCase() === 'simplerepost'"
            :buzz="buzz"
            :show-footer="true"
          />
          <buzz-item
            v-else
            :buzz="buzz"
            :show-footer="buzz.parentNodeName.toLowerCase() !== 'metanote'"
          />
        </div>
      </div>
      <div class="loading-more" v-if="loadingMore">加载更多...</div>
    </div>
    <asideBox />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types'
import { queryMetaIdData, getTagBuzzIds } from '@/api/metasv-buzz'
// import scroll from '@comps/scroll.vue'
import Sidebar from './_sidebar.vue'
import AsideBox from './_aside.vue'
import BuzzItem from './_buzz-item.vue'
import QuoteItem from './_quote-item.vue'
import PublishBox from './_publish-box.vue'

@Component({
  components: {
    // scroll,
    Sidebar,
    AsideBox,
    BuzzItem,
    QuoteItem,
    PublishBox,
  }
})
export default class BuzzList extends Vue {
  code: string | undefined
  pageNum = 1
  pageSize = 20
  listType = 'new'
  listTag: string | null = null
  metaBuzzList: MetaIdDataTypes[] = []
  loadingMore = false
  isEnd = false
  @Getter('isLogined') isLogined!: boolean
  @Getter('userInfo') userInfo: UserInfoTypes
  @Getter('isMobile') isMobile: boolean
  @Watch('$route', { immediate: true })
  onRouteChange(to, from) {
    if (to.fullPath !== from?.fullPath) {
      this.loadingMore = false
      this.metaBuzzList = []
      this.pageNum = 1
      if (to.query.tag) {
        this.listTag = to.query.tag
      } else if (to.query.type) {
        this.listTag = null
        this.listType = to.query.type
      }
      this.handleGetBuzzList()
    }
  }
  @Watch('userInfo.following', { immediate: true })
  onFollowingChange() {
    // console.log(newVal, oldVal)
    this.handleGetBuzzList()
  }

  handleGetBuzzList() {
    if (this.listTag) {
      this.getTagBuzz()
    } else {
      if (this.listType === 'hot') {
        this.getHotBuzz()
      } else {
        this.getBuzzList(this.listType)
      }
    }
  }
  async getBuzzList(type) {
    if (this.loadingMore || (type === 'user' && !this.userInfo.following.length)) return
    const params = {
      find: {
        $and: [
          {
            $or: [
              // {
              //   parentNodeName: 'ShowText'
              // },
              {
                parentNodeName: 'SimpleMicroblog',
                encrypt: '0',
              },
              {
                parentNodeName: 'SimpleRePost'
              },
              {
                parentNodeName: 'metanote',
                'data.isPrivate': 0
              },
            ],
          },
        ],
        metaId: this.AppConfig.metaIdTag,
        encrypt: '0',
        isNew: true,
      },
      sort: {
        timestamp: -1
      },
      skip: this.pageNum,
      limit: this.pageSize
    }
    if (type === 'user') {
      params.find['$or'] = [
        { rootTxId: this.userInfo.metaId },
      ]
      const following = this.userInfo.following
      // following.push(this.userInfo.metaId)
      following.forEach(user => {
        params.find['$or'].push({ rootTxId: user })
      })
    } else {
      delete params.$or
    }
    this.loadingMore = true
    this.NProgress.start()
    // console.log('query params', params)
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
      }, 5000)
    } else {
      this.$toasted.error('获取数据失败.')
      this.loadingMore = false
      this.NProgress.remove()
    }
  }
  async getHotBuzz() {
    const hotIds = this.AppConfig.hotBuzz || []
    if (!hotIds.length || this.metaBuzzList.length) return
    const list = await this.getBuzzByIds(hotIds)
    this.metaBuzzList = this.metaBuzzList.concat(list)
  }
  // 获取hashtag内容
  async getTagBuzz() {
    // 未做分页，有数据就不再请求
    if (this.metaBuzzList.length) return
    const idRes = await getTagBuzzIds(this.listTag)
    if (idRes.code === 0 && idRes.data.length) {
      const ids = idRes.data
      const list = await this.getBuzzByIds(ids)
      this.metaBuzzList = list.filter(buzz => {
        return ['simplemicroblog', 'metanote'].indexOf(buzz.parentNodeName.toLowerCase()) !== -1
      })
    }
  }
  async getBuzzByIds(ids: string[]) {
    const params = {
      find: {
        $or: []
      }
    }
    ids.forEach(txId => {
      params.find['$or'].push({ txId: txId })
    })
    return queryMetaIdData(params).then(res => {
      const list = res.result.data
      return list
    }).catch(error => {
      console.error(error)
      return []
    })
  }
  handleScroll() {
    const dom = document.getElementById('app')
    const scrollHeight = Math.max(dom.scrollHeight, document.documentElement.scrollHeight)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    const innerHeight = window.innerHeight
    // console.log(scrollTop, window.innerHeight, scrollHeight)
    if (innerHeight + scrollTop >= scrollHeight && !this.loadingMore && !this.isEnd) {
      this.pageNum += 1
      this.handleGetBuzzList()
      // console.log('loading more')
    }
  }
  created() {
    // const listType: string | undefined = this.$route.query.type
    // const listTag: string | undefined = this.$route.query.tag
    // this.listType = listType
    // this.listTag = listTag
    // this.handleGetBuzzList()
    window.addEventListener('scroll', this.handleScroll, true)
  }
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="scss">
#buzz-list {
  // min-height: calc(100vh - 50px);
  max-width: 1200px;
  padding: 0 10px;
  width: 736px;
  padding-top: 12px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  .sidebar {
    position: fixed;
    left: 50%;
    margin: 0 0 0 -570px;
  }
  .index-content {
    max-width: 736px;
    width: 100%;
    margin: 0;
  }
  .tag-title {
    margin-top: 10px;
    color: #24b898;
    background: #474f62;
    padding: 16px;
    border-radius: 5px 5px 0 0;
    border-bottom: 1px solid #131929;
    &.login {
      margin-top: 10px;
    }
  }
  .list-tabs {
    display: flex;
    justify-content: space-evenly;
    color: #fff;
    background: #474f62;
    border-bottom: 1px solid #131929;
    height: 49px;
    margin-top: 0;
    border-radius: 6px 6px 0 0;
    &.login {
      margin-top: 10px;
    }
    .tab {
      height: 49px;
      flex-grow: 1;
      display: inline-flex;
      position: relative;
      justify-content: center;
      align-items: center;
      position: relative;
      cursor: pointer;
      &:hover{
        color: #24b898;
      }
      a {
        text-decoration: none;
        color: #fff;
      }
      &.active {
        color: #24b898;
        &::after {
          content: ' ';
          height: 2px;
          position: absolute;
          left: 0;
          top: 100%;
          right: 0;
          background: #24b898;
        }
      }
    }
  }
  .list-wrapper {
    > div:first-of-type {
      .buzz-item,
      .forward-item {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        overflow: hidden;
      }
      .buzz-item {
        // margin-bottom: 0;
      }
    }
    .buzz-item {
      cursor: pointer;
      overflow: hidden;
      .markdown-body {
        color: #24b898;
      }
    }
    > .buzz-item {
      &:first-child {
        border-radius: 0 0 6px 6px;
      }
    }
  }
  .no-following {
    background: #474f62;
    min-height: 260px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    p {
      margin: 20px auto;
    }
    .btn-recommand-users {
      border: 1px solid #24b898;
      color: #24b898;
      display: inline-block;
      padding: 10px 16px;
      border-radius: 20px;
      text-decoration: none;
      cursor: pointer;
    }
  }
  .loading-more {
    text-align: center;
    padding: 30px 0;
  }
}
</style>

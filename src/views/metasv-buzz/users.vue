<template>
  <div class="user-list-page" :class="`user-list-${type}`">
    <div class="user-banner" v-if="type !== 'recommand'">
      <user-item :meta-id="metaId" />
    </div>
    <div class="container">
      <sidebar v-if="isLogined" :meta-id="currentUser.metaId" />
      <div class="page-content">
        <div class="page-title">
          <h6>
            {{ pageTitle }}
          </h6>
        </div>
        <div class="user-list">
          <div class="empty-list" v-if="!userList.length">
            <h2>MetaSV</h2>
            <p>
              <template v-if="type === 'follower'">还没有关注TA的人</template>
              <template v-if="type === 'following'">TA还没有关注的人</template>
            </p>
          </div>
          <div v-else class="item-wrap" v-for="user in userList" :key="user">
            <user-item :meta-id="user" v-if="user !== currentUser.metaId" />
          </div>
        </div>
      </div>
      <asideBox v-if="type === 'recommand'" />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfoTypes } from '@/@types/metaid-types'
import { getUserFollowData } from '@/api/metasv-buzz'
import Sidebar from './_sidebar.vue'
import AsideBox from './_aside.vue'
import UserItem from './_user-item.vue'

@Component({
  components: {
    Sidebar,
    AsideBox,
    UserItem
  },
})

export default class Users extends Vue {
  @Getter('isLogined') isLogined!: boolean
  @Getter('userInfo') currentUser: UserInfoTypes
  type = 'recommand'
  metaId: string | null = null
  userList: string[] = []

  @Watch('$route', { immediate: true })
  onRouteChange(to) {
    if (to.params.type) {
      this.type = to.params.type
    }
    if (to.query.metaId) {
      this.metaId = to.query.metaId
    }
    this.getUserList()
  }
  get pageTitle() {
    switch (this.type) {
      case 'following':
        return '已关注的用户'
      case 'follower':
        return '被这些用户关注'
      default:
        return '发现用户'
    }
  }
  // 获取用户列表，可以根据不同的类型请求不同的方法
  getUserList() {
    if (this.type === 'recommand') {
      this.getRecommandUsers()
    } else {
      this.getUserFollowData()
    }
  }

  getRecommandUsers() {
    const userList = this.AppConfig.recommandUsers || []
    this.userList = userList
  }
  async getUserFollowData() {
    // let userInfo = await this.$MetaIdDataAdapter.getUserInfo(this.metaId)
    getUserFollowData(this.metaId).then(data => {
      if (!this.metaId) return
      console.log(data)
      if (this.type === 'follower') {
        this.userList = data.follower
      } else if (this.type === 'following') {
        this.userList = data.following
      }
    })
  }
}
</script>
<style lang="scss">
.user-list-page {
  .sidebar {
    .sidebar-header {
      display: none;
    }
  }
  &.user-list-recommand {
    .sidebar {
      .sidebar-header {
        display: block;
      }
    }
  }
  .user-banner {
    width: 100%;
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
    margin-top: 12px;
  }
  .empty-list {
    text-align: center;
    padding: 50px 0;
    color: #7D90AA;
    h2 {
      font-size: 32px;
      margin: 16px 0;
      color: #5d616a;
    }
  }
  .page-content {
    max-width: 736px;
    width: 736px;
    margin: 0 15px;
  }
  .page-title {
    background: #474f62;
    padding: 16px;
    border-radius: 5px 5px 0 0;
    border-bottom: 1px solid #131929;
  }
  .user-list {
    .user-item {
      .follow-data {
        display: none;
      }
    }
  }
}
.user-list {
  padding: 0 30px 0;
  background: #474f62;
  border-radius: 0 0 6px 6px;
}
</style>

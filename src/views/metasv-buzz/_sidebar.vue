<template>
  <div class="sidebar" :class="{ active: showSideBar }">
    <div class="sidebar-header" v-if="showUserInfo || isMobile">
      <template v-if="metaId">
        <!-- <div class="user-info">
          <avatar :tx="userInfo.avatarTxId" />
          <div class="name">
            <h4 :title="userInfo.name"> {{userInfo.name}} </h4>
            <p> {{metaId.substr(0, 6)}} </p>
          </div>
        </div>
        <div class="my-follow">
          <div>
            {{userFollowData.following.length}} 关注
          </div>
          <div>
            {{userFollowData.follower.length}} 粉丝
          </div>
        </div> -->
        <user-item :meta-id="metaId" />
        <dropdown v-if="isMobile">
          <svg
            v-if="isMobile"
            t="1603863399282"
            class="icon setting"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6011"
            width="30"
            height="30"
          >
            <path
              d="M362.474667 128.375467h303.317333a123.349333 123.349333 0 0 1 106.824533 61.696l151.658667 262.749866a123.400533 123.400533 0 0 1 0 123.370667l-151.658667 262.7584a123.349333 123.349333 0 0 1-106.824533 61.691733h-303.317333a123.349333 123.349333 0 0 1-106.824534-61.696l-151.658666-262.754133a123.400533 123.400533 0 0 1 0-123.370667l151.658666-262.754133a123.349333 123.349333 0 0 1 106.824534-61.696z m0 64a59.349333 59.349333 0 0 0-51.396267 29.6832L159.419733 484.821333a59.400533 59.400533 0 0 0 0 59.383467L311.082667 806.954667a59.349333 59.349333 0 0 0 51.396266 29.687466h303.317334a59.349333 59.349333 0 0 0 51.396266-29.687466l151.658667-262.754134a59.400533 59.400533 0 0 0 0-59.383466L717.184 222.058667a59.349333 59.349333 0 0 0-51.396267-29.6832h-303.317333zM512 661.333333c-82.474667 0-149.333333-66.858667-149.333333-149.333333s66.858667-149.333333 149.333333-149.333333 149.333333 66.858667 149.333333 149.333333-66.858667 149.333333-149.333333 149.333333z m0-64c47.1296 0 85.333333-38.203733 85.333333-85.333333s-38.203733-85.333333-85.333333-85.333333-85.333333 38.203733-85.333333 85.333333 38.203733 85.333333 85.333333 85.333333z"
              p-id="6012"
              fill="#ffffff"
            ></path>
          </svg>
          <div slot="content" class="head-user-popup">
            <nav class="user-nav">
              <a :href="showmoneyUrl + '/user'">编辑资料</a>
              <a :href="showmoneyUrl">我的钱包</a>
              <a @click="doLogout">退出登录</a>
            </nav>
          </div>
        </dropdown>
        <svg
          v-if="isMobile"
          t="1603863535177"
          class="icon close"
          @click="showSideBar = false"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8163"
          width="30"
          height="30"
        >
          <path
            d="M566.97558594 521.09667969L856.8828125 231.18945312c14.63378906-14.63378906 14.63378906-38.75976563 0-53.39355468l-1.58203125-1.58203125c-14.63378906-14.63378906-38.75976563-14.63378906-53.39355469 0L512 466.51660156 222.09277344 176.21386719c-14.63378906-14.63378906-38.75976563-14.63378906-53.39355469 0l-1.58203125 1.58203125c-15.02929688 14.63378906-15.02929688 38.75976563 0 53.39355469l289.90722656 289.90722656L167.1171875 811.00390625c-14.63378906 14.63378906-14.63378906 38.75976563 0 53.39355469l1.58203125 1.58203125c14.63378906 14.63378906 38.75976563 14.63378906 53.39355469 0L512 576.07226563 801.90722656 865.97949219c14.63378906 14.63378906 38.75976563 14.63378906 53.39355469 0l1.58203125-1.58203125c14.63378906-14.63378906 14.63378906-38.75976563 0-53.39355469L566.97558594 521.09667969z"
            fill="#ffffff"
            p-id="8164"
          ></path>
        </svg>
      </template>
      <spinner v-else />
    </div>
    <div class="my-nav" v-if="metaId">
      <router-link
        v-if="metaId === currentUserInfo.metaId"
        :to="`/list?type=user`"
      >
        首页
      </router-link>
      <router-link :to="`/user/${metaId}/buzz`">
        {{ metaId === currentUserInfo.metaId ? '我的帖子' : 'TA的帖子' }}
      </router-link>
      <router-link :to="`/user/${metaId}/comments`">
        {{ metaId === currentUserInfo.metaId ? '我的回复' : 'TA的回复' }}
      </router-link>
      <router-link :to="`/user/${metaId}/likes`">
        {{ metaId === currentUserInfo.metaId ? '我的点赞' : 'TA的点赞' }}
      </router-link>
      <router-link :to="`/user/${metaId}/forwards`">
        {{ metaId === currentUserInfo.metaId ? '我的转发' : 'TA的转发' }}
      </router-link>
      <router-link :to="`/user/${metaId}/media`">
        {{ metaId === currentUserInfo.metaId ? '我的媒体' : 'TA的媒体' }}
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
// import { hexToBase64Img } from '@/utils/metaid'
import { UserInfoTypes } from '@/@types/metaid-types'
import { getUserFollowData } from '@/api/metasv-buzz'
import Avatar from '@comps/avatar.vue'
import Dropdown from '@comps/dropdown.vue'
import Spinner from '@comps/spinner.vue'
import UserItem from './_user-item.vue'
@Component({
  components: {
    Avatar,
    Spinner,
    UserItem,
    Dropdown
  },
  directives: {
  },
})
export default class SideBar extends Vue {
  @Prop({
    type: String,
  })
  metaId: string
  @Prop({
    type: Boolean,
    default: true,
  })
  showUserInfo: boolean
  @Prop({
    type: String,
  })
  activeNav: string

  userInfo: UserInfoTypes = {}

  showSideBar = false
  metaidjs = this.$metaidjs
  userFollowData = {
    follower: [],
    following: []
  }
  showmoneyUrl = this.AppConfig.showMoneyUrl
  // @Getter('isLogined') isLogined: boolean
  @Getter('isShowmoneyLoaded') isShowmoneyLoaded: boolean
  @Getter('isMobile') isMobile: boolean
  @Getter('userInfo') currentUserInfo: UserInfoTypes
  @Watch('metaId', { immediate: true })
  async userUpdate(metaId) {
    if (metaId) {
      this.userInfo = await this.$MetaIdDataAdapter.getUserInfo(metaId)
      getUserFollowData(metaId).then(data => {
        this.userFollowData = data
      })
    }
  }
  @Watch('$route', { immediate: true })
  async closeSideBar() {
    if (this.isMobile) {
      this.showSideBar = false
    }
  }
  created() {
    this.$bus.$on('toggleSideBar', () => {
      this.showSideBar = !this.showSideBar
    })
  }
  doLogout() {
    this.$confirm(
      {
        message: `Are you sure?`,
        button: {
          no: 'Cancel',
          yes: 'Logout'
        },
        callback: confirm => {
          if (confirm) {
            this.logout()
          }
        }
      }
    )
  }
}
</script>

<style lang='scss'>
.sidebar {
  width: 190px;
  // position: fixed;
  // left: 50%;
  // margin: 0 0 0 -570px;
  border-radius: 0 2.778vw 2.778vw 0;
  transition: all 0.3s ease-in-out;
  .sidebar-header {
    padding: 0 0 24px;
    position: relative;
    min-height: 100px;
    .icon {
      position: absolute;
      top: 7.222vw;
      right: 5.926vw;
      &.setting {
        right: 17.259vw;
      }
    }
    .user-item {
      flex-direction: column;
      border-bottom: 0;
      .info {
        padding-top: 0;
        width: 100%;
        .name {
          width: 120px;
        }
      }
      .action-wrap {
        display: none;
      }
    }
  }
  .my-nav {
    padding-bottom: 16px;
    margin-bottom: 16px;
    > a {
      display: block;
      line-height: 40px;
      color: #5e667a;
      text-decoration: none;
      &:hover{
        color: #24b898;
      }
      &.router-link-active {
        color: #24b898;
        outline: none;
      }
    }
  }
}
</style>

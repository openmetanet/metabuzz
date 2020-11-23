<template>
  <div class="metaSV-head">
    <div class="header-container">
      <svg
        v-if="isLogined && isMetaIdJsLoaded && isMobile && !needback"
        @click="$bus.$emit('toggleSideBar')"
        t="1603769181784"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="15019"
        width="30"
        height="30"
      >
        <path
          d="M384.31 162.15c8.82 0 16 7.18 16 16v224c0 8.82-7.18 16-16 16h-224c-8.82 0-16-7.18-16-16v-224c0-8.82 7.18-16 16-16h224m0-64h-224c-44.18 0-80 35.82-80 80v224c0 44.18 35.82 80 80 80h224c44.18 0 80-35.82 80-80v-224c0-44.18-35.82-80-80-80zM383.79 607.69c8.82 0 16 7.18 16 16v224c0 8.82-7.18 16-16 16h-224c-8.82 0-16-7.18-16-16v-224c0-8.82 7.18-16 16-16h224m0-64h-224c-44.18 0-80 35.82-80 80v224c0 44.18 35.82 80 80 80h224c44.18 0 80-35.82 80-80v-224c0-44.18-35.82-80-80-80zM909.08 174H582.09c-17.67 0-32 14.33-32 32s14.33 32 32 32h326.99c17.67 0 32-14.33 32-32s-14.33-32-32-32zM912.21 582H585.22c-17.67 0-32 14.33-32 32s14.33 32 32 32h326.99c17.67 0 32-14.33 32-32s-14.32-32-32-32zM912.08 786H585.09c-17.67 0-32 14.33-32 32s14.33 32 32 32h326.99c17.67 0 32-14.33 32-32s-14.33-32-32-32zM910.18 378H583.19c-17.67 0-32 14.33-32 32s14.33 32 32 32h326.99c17.67 0 32-14.33 32-32s-14.32-32-32-32z"
          p-id="15020"
          fill="#ffffff"
        ></path>
      </svg>
      <svg
        @click="$router.back()"
        v-else-if="needback && isMobile"
        t="1604025136777"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3235"
        width="30"
        height="30"
      >
        <path
          d="M695.04 840.32 399.36 541.44l285.44-295.04c12.16-12.8 12.16-33.28 0-45.44-12.16-12.8-32-12.8-44.16 0l-309.76 320c-12.16 12.8-12.16 33.28 0 45.44C333.44 568.96 336 570.24 339.2 572.16l311.04 314.24c12.8 12.8 32.64 12.8 45.44 0C707.2 873.6 707.2 853.12 695.04 840.32z"
          p-id="3236"
          fill="#ffffff"
        ></path>
      </svg>
      <h2 v-else>
        <router-link
          :to="{
            name: 'buzzList',
            query: { type: isLogined ? 'user' : 'new' },
          }"
          >MetaBuzz</router-link
        >
      </h2>
      <div class="user-container">
        <spinner size="28" v-if="isLogined && !isMetaIdJsLoaded" />
        <div class="user-info" v-if="isLogined && isMetaIdJsLoaded">
          <dropdown v-if="!isMobile">
            <avatar :tx="userInfo.avatarTxId" :size="56" />
            <!-- <div class="avatar-wrapper">
              <img v-if="userInfo.headUrl" :src="hexToBase64Img(userInfo.headUrl)" alt="avatar">
            </div> -->
            <span>
              {{ userInfo.name }}
            </span>
            <div slot="content" class="head-user-popup">
              <nav class="user-nav">
                <a :href="showmoneyUrl + '/user'">编辑资料</a>
                <a :href="showmoneyUrl">我的钱包</a>
                <a @click="doLogout">退出登录</a>
              </nav>
            </div>
          </dropdown>
          <button
            v-if="isMetaIdJsLoaded"
            @click="newBuzz"
            :class="{ login: isMetaIdJsLoaded }"
          >
            <span v-if="isLogined && isMetaIdJsLoaded && !isMobile"
              ><svg
                t="1604547710330"
                class="icon forward"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                fill="#ffffff"
                width="1.1em"
                height="1.1em"
              >
                <path
                  d="M896 352c-17.67 0-32 14.33-32 32v448c0 17.64-14.36 32-32 32H192c-17.64 0-32-14.36-32-32V192c0-17.65 14.36-32 32-32h448c17.67 0 32-14.33 32-32s-14.33-32-32-32H192c-52.93 0-96 43.07-96 96v640c0 52.93 43.07 96 96 96h640c52.93 0 96-43.07 96-96V384c0-17.67-14.33-32-32-32z"
                  fill="#ffffff"
                  p-id="1213"
                ></path>
                <path
                  d="M425.37 598.63c6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37l448-448c12.5-12.5 12.5-32.76 0-45.25-12.5-12.5-32.76-12.5-45.26 0l-448 448c-12.49 12.49-12.49 32.75 0 45.25z"
                  fill="#ffffff"
                  p-id="1214"
                ></path></svg
              >发帖</span
            >
            <span v-else>+</span>
          </button>
        </div>
        <login-button v-if="!isLogined" />
      </div>
    </div>
    <transition name="fade">
      <div class="publish-popup" v-if="showPublishBox">
        <div class="mask" @click="showPublishBox = false"></div>
        <publish-box />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import { UserInfoTypes } from '@/store/metasv-buzz'
import loginButton from '@comps/metasv-buzz/login-button.vue'
import Avatar from '@comps/avatar.vue'
import spinner from '@comps/spinner.vue'
import Dropdown from '@comps/dropdown.vue'
import PublishBox from '@/views/metasv-buzz/_publish-box.vue'
import ClickOutside from '@/directives/click-outside'
@Component({
  components: {
    loginButton,
    Avatar,
    spinner,
    Dropdown,
    PublishBox,
  },
  directives: {
    ClickOutside
  },
})
export default class Header extends Vue {
  defaultAvatar = 'https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png'
  // metaidjs = this.$metaidjs
  isLoaded = false
  showPublishBox = false
  needback = false
  showmoneyUrl = this.AppConfig.showMoneyUrl

  @Getter('isLogined') isLogined: boolean
  @Getter('isMetaIdJsLoaded') isMetaIdJsLoaded: boolean
  @Getter('isMobile') isMobile: boolean
  @Getter('accessToken') accessToken: string
  @Getter('userInfo') userInfo: UserInfoTypes
  @Action('logout') logout
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
  @Watch('$route', { immediate: true })
  onRouteChange(to) {
    if (to.name === 'buzzDetail') {
      this.needback = true
    } else {
      this.needback = false
    }
  }
  handleClickOutside() {
    // this.showPublishBox = false
  }
  newBuzz() {
    // 统一显示弹窗
    this.showPublishBox = true
    // if (this.$route.name === 'buzzList' && !this.isMobile) {
    //   window.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: 'smooth'
    //   })
    //   // setTimeout 确保先滚动到顶部
    //   setTimeout(() => {
    //     const el = document.getElementById('index-buzz-input')
    //     el.focus()
    //   }, 500)
    // } else {
    //   this.showPublishBox = true
    // }
  }
}
</script>

<style lang="scss">
.metaSV-head {
  background: #2f374a;
  height: 50px;
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 1;
  .forward.icon {
    vertical-align: text-top;
    margin-right: 8px;
  }
  .header-container {
    max-width: 1200px;
    width: 100%;
    padding: 0 10px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    h2 {
      font-size: 32px;
      a {
        color: #fff;
        text-decoration: none;
      }
    }
    .user-container {
      display: flex;
      align-items: center;
      position: relative;
      margin-right: -16px;
      & > div,
      .dropdown {
        display: flex;
        align-items: center;
      }
      .dropdown {
        cursor: pointer;
      }
      .avatar-wrapper {
        width: 32px;
        height: 32px;
        background: #eee;
        border-radius: 50%;
        overflow: hidden;
        img {
          max-width: 100%;
        }
      }
      span {
        margin: 0 15px 0 15px;
      }
      button {
        height: 32px;
        padding: 0 15px;
        text-align: center;
        color: #fff;
        background: #24b898;
        cursor: pointer;
        line-height: 32px;
        min-width: 80px;
        border-radius: 16px;
        font-size: 12px;
        &:hover {
          background: #5bb6a2;
        }
      }
    }
  }
  .publish-popup {
    position: relative;
    height: 100vh;
    .mask {
      background: rgba(0, 0, 0, 0.8);
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
    }
    .publish-container {
      max-width: 760px;
      width: 700px;
      margin: 0 auto;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: -120px 0 0 -350px;
    }
  }
  .slide-enter-active {
    transition-duration: 0.3s;
    transition-timing-function: ease-in;
  }
  .slide-leave-active {
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
  }
  .slide-enter-to,
  .slide-leave {
    max-height: 210px;
    overflow: hidden;
  }

  .slide-enter,
  .slide-leave-to {
    overflow: hidden;
    max-height: 0;
  }
}
.head-user-popup {
  width: 120px;
  background: #fff;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
  a {
    display: block;
    cursor: pointer;
    padding: 6px 10px;
    text-align: center;
    color: #333;
    text-decoration: none;
    &:hover {
      background: #eff3f6;
    }
  }
}
</style>

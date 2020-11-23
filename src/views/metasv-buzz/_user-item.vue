<template>
  <div class="user-item">
    <div class="info">
      <router-link :to="`/user/${metaId}/buzz`" class="avatar-link">
        <avatar :tx="userInfo.avatarTxId" :size="56" />
      </router-link>
      <div class="user-name">
        <span class="name">{{ userInfo.name }}</span>
        <span class="mataid">{{ metaId.substr(0, 6) }}</span>
      </div>
    </div>

    <div class="follow-data">
      <router-link
      class="follow"
        :to="{
          name: 'users',
          params: { type: 'following' },
          query: { metaId: metaId },
        }"
      >
        {{ userInfo.following.length }} 关注
      </router-link>
      <router-link
        :to="{
          name: 'users',
          params: { type: 'follower' },
          query: { metaId: metaId },
        }"
      >
        {{ userInfo.follower.length }} 粉丝
      </router-link>
    </div>
    <div class="action-wrap">
      <a class="btn-edit" v-if="isMyself" :href="showmoneyUrl + '/user'"
        >编辑资料</a
      >
      <follow-button
        :class="{ followed: isFollowed }"
        v-else
        :user="userInfo"
        :callback="handleFollowed"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { UserInfoTypes } from '@/store/metasv-buzz'
import { getUserFollowData } from '@/api/metasv-buzz'
import Avatar from '@comps/avatar.vue'
import FollowButton from '@comps/metasv-buzz/follow-button.vue'
@Component({
  components: {
    Avatar,
    FollowButton,
  },
})
export default class UserItem extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  metaId: string

  userInfo: UserInfoTypes = {
    following: [],
    follower: [],
  }

  showmoneyUrl = this.AppConfig.showMoneyUrl

  @Getter('isLogined') isLogined: boolean
  @Getter('userInfo') currentUser: UserInfoTypes
  @Action('updateUserInfo') updateUserInfo

  get isFollowed() {
    return this.currentUser.following.indexOf(this.metaId) !== -1
  }
  get isMyself() {
    return this.currentUser.metaId === this.metaId
  }
  async getUserInfo() {
    let userInfo = await this.$MetaIdDataAdapter.getUserInfo(this.metaId)
    getUserFollowData(this.metaId).then(data => {
      userInfo = Object.assign(userInfo, data)
      this.userInfo = userInfo
    })
  }
  handleFollowed(res) {
    if (res.code === 200) {
      this.currentUser.following.splice(0, 0, this.metaId)
      // this.updateUserInfo(this.currentUser)
    }
  }

  created() {
    this.getUserInfo()
  }
}
</script>

<style lang='scss'>
.user-item:last-of-type {
  border-bottom: none;
}
.user-item {
  border-bottom: 1px solid #5e667a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .info {
    position: relative;
    display: flex;
    padding: 18px 0;
    .avatar-wrapper {
      width: 56px;
      height: 56px;
      flex-basis: 56px;
    }
    .user-name {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      text-align: left;
      margin-left: 16px;
      .name {
        font-size: 18px;
        color: #ffffff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .mataid {
        font-size: 14px;
        color: #7d90aa;
      }
    }
  }
  .follow-data {
    width: 100%;
    .follow{
      margin-right: 28px;
    }
    > a {
      font-size: 16px;
      flex-grow: 1;
      display: inline-block;
      color: #fff;
      &:hover{
        color: #24b898;
      }
    }
    s {
      display: block;
      background: #7d90aa;
      width: 1px;
      height: 16px;
    }
  }
  .follow-btn.followed {
    opacity: 0.7;
    background-color: #5E667A;
    cursor: not-allowed;
  }
  .action-wrap {
    margin: 10px;
    .btn-edit {
      color: #fff;
      background: #24b898;
      padding: 10px 40px;
      border-radius: 60px;
      display: inline-block;
      &:hover{
        background: #5bb6a2;
      }
    }
  }
}
</style>

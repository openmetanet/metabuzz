<template>
  <div class='aside'>
    <div class="topic" v-if="tagList.length">
      <h4>
        热门话题
      </h4>
      <div class="topic-list">
        <p v-for="(tag, index) in tagList" :key="index">
          <router-link :to="{name: 'buzzList', query: {tag: tag}}">
            #{{tag}}#
          </router-link>
        </p>
      </div>
      <button v-if="false">
        查看更多&gt;&gt;
      </button>
    </div>
    <div class="notice" v-if="false">
      <h4>
        公告栏
      </h4>
      <div class="notice-list">
        <title>
          《 带你认识 MetaID 到底是何妨神圣 》
        </title>
        <title>
          《 如何注册MetaID 》
        </title>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfoTypes } from '@/store/metasv-buzz'
import { getTagList } from '@/api/metasv-buzz'
@Component({
  components: {
  },
})
export default class Aside extends Vue {
  tagList = []
  @Getter('isLogined') isLogined: boolean
  @Getter('userInfo') userInfo: UserInfoTypes

  getTagList() {
    getTagList({
      page: '1',
      pageSize: '10'
    }).then(res => {
      if (res.code === 0) {
        this.tagList = res.data
        // console.log('tagList', this.tagList)
      }
    })
  }

  created() {
    this.getTagList()
  }
}
</script>

<style lang='scss'>
  .aside {
    width: 240px;
    position: fixed;
    right: 50%;
    margin: 0 -618px 0 0;
    .topic, .notice {
      padding: 16px;
      background: #474F62;
      margin: 0 0 10px 0;
      border-radius: 6px;
      h4 {
        font-size: 16px;
      }
      .topic-list, .notice-list {
        padding: 8px 0;
        margin: 16px 0 0;
        min-height: 100px;
        border-top: 1px solid #131929;
        // border-bottom: 1px solid #2F374A;
        p {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          margin: 16px 0;
          a {
            color: #FFF;
            text-decoration: none;
            &:hover{
              color:#24b898;
            }
          }
          s {
            color: #7D90AA;
          }
        }
      }
      .notice-list {
        border-radius: 6px;
        border-bottom: none;
      }
      button {
        color: #7D90AA;
        text-align: center;
        display: block;
        width: 100%;
        cursor: pointer;
      }
      title {
        color: #24B898;
        margin: 16px 0;
        display: block;
      }
    }
  }
</style>

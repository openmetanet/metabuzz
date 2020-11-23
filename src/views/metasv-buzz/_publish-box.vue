<template>
  <div class="publish-container">
    <div class="publish-content">
      <textarea id="index-buzz-input" placeholder="请输入内容" @click="checkAuth" v-model="content" />
    </div>
    <div class="operation-container">
      <metafile-uploader ref="uploader" @change="handleMetafileChange" @close="handleMetafileClose" />
      <div class="pull-right">
        <div class="dropdown-wrap">
          <dropdown>
            <a class="privacy-selector">
              <span>{{privaceSelected.name}}</span>
              <i class="svg-icon">
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                </svg>
              </i>
            </a>
            <div slot="content" class="privacy-dropdown">
              <div class="dropdown-item" @click="handlePrivacyChange(item)" v-for="item in privacyOptions" :key="item.value">{{item.name}}</div>
            </div>
          </dropdown>
        </div>
        <button class="btn-submit" @click="publishBuzz" :disabled="!isLogined">发布</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { UserInfoTypes } from '@/store/metasv-buzz'
import { goAuth } from '@/api/metasv-buzz'
import Dropdown from '@comps/dropdown.vue'
import MetafileUploader from '@comps/metafile-uploader.vue'
@Component({
  components: {
    Dropdown,
    MetafileUploader,
  },
})
export default class Publish extends Vue {
  @Getter('isLogined') isLogined: boolean
  @Getter('accessToken') accessToken: string
  @Getter('userInfo') userInfo: UserInfoTypes
  content = ''
  attachments = []
  privacyOptions = [
    {
      name: '所有人可见',
      value: '0'
    },
    {
      name: '仅自己可见',
      value: '1'
    },
  ]
  privaceSelected = {
    name: '所有人可见',
    value: '0'
  }

  checkAuth() {
    if (!this.isLogined) {
      return this.$confirm(
        {
          message: `Please sign in?`,
          button: {
            no: 'Cancel',
            yes: 'Sign in'
          },
          callback: confirm => {
            if (confirm) {
              goAuth()
            }
          }
        }
      )
    }
  }
  handlePrivacyChange(payload) {
    this.privaceSelected = payload
  }
  handleMetafileChange(files) {
    this.attachments = files
  }
  handleMetafileClose() {
    this.attachments = []
  }
  publishBuzz() {
    this.checkAuth()
    if (this.content === '') {
      return this.$toasted.error('内容不能为空')
    }
    const buzzData = {
      createTime: new Date().getTime(),
      content: this.content,
      contentType: 'text/plain',
      attachments: this.attachments.map((item, index) => { return `![metafile](${index})` }),
      mention: []
    }
    const payto = [
      { amount: this.AppConfig.simpleBlogFee, address: this.AppConfig.projectAddress },
    ]
    const metaParams = {
      nodeName: 'SimpleMicroblog',
      metaIdTag: this.AppConfig.metaIdTag,
      brfcId: '9e73d8935669',
      accessToken: this.accessToken,
      encrypt: this.privaceSelected.value,
      payCurrency: this.AppConfig.payCurrency,
      payTo: payto,
      path: '/Protocols/SimpleMicroblog',
      dataType: 'application/json',
      attachments: this.attachments,
      data: JSON.stringify(buzzData),
      // checkOnly: true,
      callback: this.handlePublishBuzz
    }
    this.$metaidjs.sendMetaDataTx(metaParams)
  }
  handlePublishBuzz(payload) {
    if (payload.code === 200) {
      this.$toasted.success('发布成功!')
    }
    const dummyBuzz = {
      userInfo: this.userInfo,
      data: {
        createTime: new Date().getTime(),
        content: this.content,
        contentType: 'text/plain',
        quoteTx: '',
        attachments: [
        ],
        mention: []
      },
      parentNodeName: 'SimpleMicroblog',
      txId: payload.data.txId,
      rootTxId: this.userInfo.metaId,
      ShowLike: 0,
      isComment: 0,
      isQuery: true,
      isLike: false,
      timestamp: new Date().getTime(),
    }
    this.$refs.uploader.closePopup()
    this.content = ''
    this.attachments = []
    this.$parent.showPublishBox = false
    if (this.privaceSelected.value === '0' && (this.$route.name === 'buzzList' && this.$parent.listType !== 'hot' && !this.$parent.listTag)) {
      this.$parent.metaBuzzList.splice(0, 0, dummyBuzz)
    } else {
      this.$router.push({ name: 'buzzList', query: { type: 'user' } })
    }
  }
}
</script>

<style lang="scss">
.privacy-dropdown {
  color: #333;
  width: 120px;
  background: #FFF;
  border-radius: 3px;
  .dropdown-item {
    cursor: pointer;
    padding: 8px;
    text-align: center;
  }
}
.publish-container {
  padding: 16px;
  background: #474F62;
  border-radius: 6px;
  .publish-content {
    textarea {
      font-size: 18px;
      font-family: Arial, Helvetica, sans-serif;
      color: #FFF;
      width: 97%;
      background: #2F374A;
      border: 1px solid #2F374A;
      padding: 8px;
      resize: none;
      min-height: 90px;
    }
  }
  .operation-container {
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .add-img {
      i {
        font-size: 24px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        margin-left: 5px;
      }
    }
    .pull-right {
      display: inline-flex;
      align-items: center;
      .privacy-selector {
        padding: 10px 0;
        cursor: pointer;
      }
      .btn-submit {
        cursor: pointer;
        font-size: 18px;
        color: #FFF;
        background:  #24B898;
        padding: 10px 40px;
        margin-left: 16px;
        opacity: .7;
        border-radius: 4px;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
</style>

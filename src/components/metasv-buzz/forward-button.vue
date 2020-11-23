<template>
  <div class="action-btn forward-btn">
    <dropdown placement="top" :show-mask="true" :disabled="disabled">
      <a>
        <i class="svg-icon">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg> -->
          <svg
            t="1604482376683"
            class="bi bi-box-arrow-up-right"
            viewBox="0 0 1024 1024"
            fill="currentColor"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
          >
            <path
              d="M896 480c-17.67 0-32 14.33-32 32v320c0 17.64-14.36 32-32 32H192c-17.64 0-32-14.36-32-32V192c0-17.65 14.36-32 32-32h320c17.67 0 32-14.33 32-32s-14.33-32-32-32H192c-52.93 0-96 43.07-96 96v640c0 52.93 43.07 96 96 96h640c52.93 0 96-43.07 96-96V512c0-17.67-14.33-32-32-32z"
              fill-rule="evenodd"
              p-id="3548"
            ></path>
            <path
              d="M832 96H640c-17.67 0-32 14.33-32 32s14.33 32 32 32h178.74L425.37 553.37c-12.5 12.5-12.5 32.76 0 45.26 6.25 6.25 14.44 9.37 22.63 9.37s16.38-3.12 22.63-9.37L864 205.26V384c0 17.67 14.33 32 32 32s32-14.33 32-32V192c0-52.93-43.07-96-96-96z"
              fill-rule="evenodd"
              p-id="3549"
            ></path>
          </svg>
        </i>
        <span class="label-text">{{ text }}</span>
      </a>
      <div
        slot="content"
        class="forward-dropdown"
        :class="`forward-${item.parentNodeName}`"
      >
        <a @click="doForward">转发</a>
        <a @click="showCommentBox = true">带评论转发</a>
        <a>取消</a>
      </div>
    </dropdown>
    <modal v-if="showCommentBox" @close="showCommentBox = false">
      <div class="card forward-card">
        <div class="card-header">
          <h4>转发帖子</h4>
        </div>
        <div class="card-body">
          <div class="forward-form">
            <!-- <avatar :src="hexToBase64Img(userInfo.headUrl)" :size="40" /> -->
            <avatar :tx="userInfo.avatarTxId" :size="40" />
            <div class="field">
              <textarea v-model="content" placeholder="添加评论" />
            </div>
          </div>
          <div class="forward-buzz">
            <buzz-item
              :buzz="item"
              :show-footer="false"
              :show-relation="false"
            />
          </div>
        </div>
        <div class="card-footer">
          <button
            class="btn-submit"
            @click="doForward"
            :disabled="this.content === ''"
          >
            转发
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { MetaIdDataTypes, UserInfoTypes } from '@/@types/metaid-types.d.ts'
import { goAuth } from '@/api/metasv-buzz'
import { hexToBase64Img } from '@/utils/metaid'
import Dropdown from '@comps/dropdown.vue'
import Modal from '@comps/modal.vue'
import Avatar from '@comps/avatar.vue'

interface BuzzTypes extends MetaIdDataTypes {
  likes?: MetaIdDataTypes[];
  comments?: MetaIdDataTypes[];
  userInfo?: UserInfoTypes;
}
@Component({
  components: {
    // 循环引用，要使用动态加载
    BuzzItem: () => import('@views/metasv-buzz/_buzz-item.vue'),
    Dropdown,
    Modal,
    Avatar,
  },
})
export default class ForwardButton extends Vue {
  @Prop({
    type: Object,
  })
  item: BuzzTypes
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled: boolean
  @Prop({
    type: Function,
  })
  callback: Function
  @Prop({
    type: [String, Number],
  })
  text: string | number

  showCommentBox = false
  content = ''

  @Getter('isLogined') isLogined: boolean
  @Getter('accessToken') accessToken: string
  @Getter('userInfo') userInfo: UserInfoTypes

  hexToBase64Img(hex: string) {
    return hexToBase64Img(hex)
  }
  doForward() {
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
    const forwardParams = {
      nodeName: 'SimpleRePost',
      metaIdTag: this.AppConfig.metaIdTag,
      brfcId: 'b51e23269c75',
      accessToken: this.accessToken,
      encrypt: 0,
      payCurrency: this.AppConfig.payCurrency,
      payTo: [
        { amount: this.AppConfig.rePostAmount, address: buzzItem.userInfo.address },
        { amount: this.AppConfig.rePostFee, address: this.AppConfig.projectAddress },
      ],
      dataType: 'applicaition/json',
      path: '/Protocols/SimpleRePost',
      data: JSON.stringify({
        createTime: new Date().getTime(),
        rePostTx: this.item.txId, // tx
        rePostProtocol: '', // this.dialogData.nodeName,
        rePostComment: this.content // 评论内容
      }),
      callback: this.handleForward
    }
    this.$metaidjs.sendMetaDataTx(forwardParams)
  }
  handleForward(res) {
    this.content = ''
    this.showCommentBox = false
    if (typeof this.callback === 'function') {
      this.callback(res)
    }
  }
}
</script>

<style lang="scss">
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  i,
  span {
    display: inline-block;
    margin-right: 8px;
  }
  i svg {
    width: 18px;
    height: 18px;
  }
}
.forward-dropdown {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  margin-bottom: 24px;
  width: 180px;
  > a {
    color: #000;
    cursor: pointer;
    padding: 16px;
    display: block;
    text-align: center;
  }
}
.forward-PayComment {
  background: #131929;
  width: 160px;
}
.forward-card {
  width: 700px;
  .card-body {
    max-width: 100%;
    .buzz-item .item-container {
      max-height: 200px;
      overflow-y: auto;
      .images-wrapper .metafile-viewer {
        width: 180px;
        height: 180px;
        max-width: 180px;
      }
    }
  }
  .card-footer {
    justify-content: flex-end;
    padding: 0 20px 16px 20px;
    button {
      background: #24b898;
      color: #fff;
      border-radius: 3px;
      padding: 8px 30px;
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
  }
}
.forward-form {
  padding: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .avatar-wrapper {
    width: 40px;
    height: 40px;
    flex-basis: 40px;
  }
  .field {
    display: flex;
    flex-grow: 1;
  }
  textarea {
    border: 0;
    background: #495166;
    color: #eee;
    resize: none;
    width: 95%;
    padding: 5px;
    margin-left: 10px;
    outline: none;
    &:focus {
      color: #fff;
    }
  }
}
.forward-buzz {
  padding: 8px;
  .buzz-item {
    background: #2f374a;
  }
}
.card {
  color: #fff;
  .card-header {
    padding: 18px 20px;
    border-bottom: 1px solid #131929;
    box-sizing: border-box;
  }
  .card-body {
    padding: 10px;
  }
  .card-footer {
    display: flex;
    padding: 16px;
  }
}
</style>

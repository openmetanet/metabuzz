<template>
  <div class="avatar-wrapper" :class="shape" >
    <img :src="avatarUrl" alt="avatar image" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component({
  components: {
  },
})
export default class Avatar extends Vue {
  @Prop({
    type: String,
    default: ''
  })
  tx: string
  @Prop({
    type: String,
    default: ''
  })
  src: string

  @Prop({
    type: Number,
    default: 32
  })
  size: number

  @Prop({
    type: String,
    default: 'circle'
  })
  shape: string

  defaultAvatar = 'https://showjob.oss-cn-hangzhou.aliyuncs.com/index/img_photo_default.png'
  get inlineStyle() {
    const styleObj = {
      width: this.size + 'px',
      height: this.size + 'px'
    }
    if (this.shape === 'circle') {
      styleObj['border-radius'] = '50%'
    }
    return styleObj
  }
  get avatarUrl() {
    let avatar = this.defaultAvatar
    if (this.src && this.src !== '') {
      avatar = this.src
    } else if (this.tx && this.tx !== '') {
      avatar = `${this.AppConfig.metaFileServiceUrl}/metafile/${this.tx}`
    }
    return avatar
  }
}
</script>

<style lang="scss">
  .avatar-wrapper {
    display: inline-flex;
    overflow: hidden;
    background: #EEE;
    width: 40px;
    height: 40px;
    justify-content: center;
    align-items: center;
    &.circle {
      border-radius: 9999rem;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      width: 100%;
      // object-fit: cover;
    }
  }
</style>

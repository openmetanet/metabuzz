<template>
  <transition name="viewer-fade">
    <div tabindex="-1" ref="image-viewer__wrapper" class="image-viewer__wrapper" :style="{ 'z-index': zIndex }">
      <div class="image-viewer__mask"></div>
      <!-- CLOSE -->
      <span class="image-viewer__btn image-viewer__close" @click="hide">
        <i class="svg-icon">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
          <!-- <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg> -->
        </i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="image-viewer__btn image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="svg-icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </i>
        </span>
        <span
          class="image-viewer__btn image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="svg-icon">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
          </i>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="image-viewer__btn image-viewer__actions">
        <div class="image-viewer__actions__inner">
          <i class="icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="image-viewer__actions__divider"></i>
          <i class="icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="icon-refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="image-viewer__canvas">
        <img
          v-for="(url, i) in urlList"
          v-show="i === index"
          ref="img"
          class="image-viewer__img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError" >
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'icon-c-scale-to-original'
  }
}

@Component({
})

export default class ImageViewer extends Vue {
  @Prop({
    type: Array,
    default: () => []
  })
  urlList: string[]
  @Prop({
    type: Number,
    default: 2000
  })
  zIndex: number
  @Prop({
    type: Number,
    default: 0
  })
  initialIndex: number
  @Prop({
    type: Function,
    default: () => { return true }
  })
  onSwitch: Function
  @Prop({
    type: Function,
    default: () => { return true }
  })
  onClose: Function

  index = this.initialIndex
  isShow = false
  infinite = true
  loading = false
  mode = Mode.CONTAIN
  transform = {
    scale: 1,
    deg: 0,
    offsetX: 0,
    offsetY: 0,
    enableTransition: false,
  }

  get isSingle() {
    return this.urlList.length <= 1
  }
  get isFirst() {
    return this.index === 0
  }
  get isLast() {
    return this.index === this.urlList.length - 1
  }
  get currentImg() {
    return this.urlList[this.index]
  }
  get imgStyle() {
    const { scale, deg, offsetX, offsetY, enableTransition } = this.transform
    const style = {
      transform: `scale(${scale}) rotate(${deg}deg)`,
      transition: enableTransition ? 'transform .3s' : '',
      'margin-left': `${offsetX}px`,
      'margin-top': `${offsetY}px`,
      maxWidth: 'auto',
      maxHeight: 'auto',
    }
    if (this.mode === Mode.CONTAIN) {
      style.maxWidth = style.maxHeight = '100%'
      style['object-fit'] = 'contain'
    }
    return style
  }

  @Watch('index')
  handleIndexChange(val) {
    this.reset()
    this.onSwitch(val)
  }
  @Watch('currentImg')
  handleImgChange() {
    this.$nextTick(() => {
      const $img = this.$refs.img[0]
      if (!$img.complete) {
        this.loading = true
      }
    })
  }

  hide() {
    this.onClose()
  }
  handleImgLoad() {
    this.loading = false
  }
  handleImgError(e) {
    this.loading = false
    e.target.alt = '加载失败'
  }
  reset() {
    this.transform = {
      scale: 1,
      deg: 0,
      offsetX: 0,
      offsetY: 0,
      enableTransition: false,
    }
  }
  toggleMode() {
    if (this.loading) return
    const modeNames = Object.keys(Mode)
    const modeValues = Object.values(Mode)
    const index = modeValues.indexOf(this.mode)
    const nextIndex = (index + 1) % modeNames.length
    this.mode = Mode[modeNames[nextIndex]]
    this.reset()
  }
  prev() {
    if (this.isFirst && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index - 1 + len) % len
  }
  next() {
    if (this.isLast && !this.infinite) return
    const len = this.urlList.length
    this.index = (this.index + 1) % len
  }
  handleActions(action, options = {}) {
    if (this.loading) return
    const { zoomRate, rotateDeg, enableTransition } = {
      zoomRate: 0.2,
      rotateDeg: 90,
      enableTransition: true,
      ...options
    }
    const { transform } = this
    switch (action) {
      case 'zoomOut':
        if (transform.scale > 0.2) {
          transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3))
        }
        break
      case 'zoomIn':
        transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3))
        break
      case 'clocelise':
        transform.deg += rotateDeg
        break
      case 'anticlocelise':
        transform.deg -= rotateDeg
        break
    }
    transform.enableTransition = enableTransition
  }
}
</script>

<style lang="scss">
.image-viewer__wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  .image-viewer__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: .8;
    background: #000;
  }
  .image-viewer__btn {
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: .8;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
    .svg-icon {
      display: inline-flex;
      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
  .image-viewer__close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    background-color: #606266;
  }
  .image-viewer__next,
  .image-viewer__prev {
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    border-color: #fff;
  }
  .image-viewer__next {
    right: 40px;
    text-indent: 2px;
  }
  .image-viewer__prev {
    left: 40px;
  }
  .image-viewer__canvas {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

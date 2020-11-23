<template>
  <div class="metafile-viewer">
    <slot v-if="loading" name="placeholder">
      <div class="image-placeholder"></div>
    </slot>
    <slot v-else-if="error" name="error">
      <div class="image-error">图片加载错误</div>
    </slot>
    <img
      v-else
      class="image"
      v-bind="$attrs"
      @click="clickHandler"
      :src="src"
      :style="imageStyle"
      :class="{ 'image-center': alignCenter, 'image-preview': preview }">
    <template v-if="preview">
      <image-viewer :z-index="zIndex" :initial-index="imageIndex" v-if="showViewer" :on-close="closeViewer" :url-list="previewSrcList"/>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ImageViewer from './image-viewer.vue'

enum ObjectFit {
  NONE = 'none',
  CONTAIN = 'contain',
  COVER = 'cover',
  FILL = 'fill',
  SCALE_DOWN = 'scale-down',
}
const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined
let prevOverflow = ''
@Component({
  components: {
    ImageViewer
  },
  directives: {
  }
})

// let prevOverflow = ''

export default class MetaImage extends Vue {
  @Prop({
    type: String
  })
  src: string
  @Prop({
    type: String
  })
  fit: string
  @Prop({
    type: Object
  })
  scrollContainer: object
  @Prop({
    type: Array,
    default: () => []
  })
  previewSrcList: string[]
  @Prop({
    type: Number,
    default: 2000
  })
  zIndex: number

  loading = true
  error = false
  imageWidth = 0
  imageHeight = 0
  showViewer = false

  get imageStyle() {
    const { fit } = this
    if (fit) {
      return isSupportObjectFit() ? { 'object-fit': fit } : this.getImageStyle(fit)
    }
    return {}
  }
  get alignCenter() {
    return !isSupportObjectFit() && this.fit !== ObjectFit.FILL
  }
  get preview() {
    const { previewSrcList } = this
    return Array.isArray(previewSrcList) && previewSrcList.length > 0
  }
  get imageIndex() {
    let previewIndex = 0
    const srcIndex = this.previewSrcList.indexOf(this.src)
    if (srcIndex >= 0) {
      previewIndex = srcIndex
    }
    return previewIndex
  }
  // @Watch('src')
  // handleSrcChange(val) {
  //   // this.loadImage()
  // }

  loadImage() {
    this.loading = true
    this.error = false
    const img = new Image()
    img.onload = e => this.handleLoad(e, img)
    img.onerror = this.handleError.bind(this)
    Object.keys(this.$attrs).forEach((key) => {
      const value = this.$attrs[key]
      img.setAttribute(key, value)
    })
    img.src = this.src
  }
  handleLoad(e, img) {
    this.imageWidth = img.width
    this.imageHeight = img.height
    this.loading = false
    this.error = false
  }
  handleError(e) {
    this.loading = false
    this.error = true
    this.$emit('error', e)
  }
  getImageStyle(fit) {
    const { imageWidth, imageHeight } = this
    const {
      clientWidth: containerWidth,
      clientHeight: containerHeight
    } = this.$el
    if (!imageWidth || !imageHeight || !containerWidth || !containerHeight) return {}
    const vertical = imageWidth / imageHeight < 1
    if (fit === ObjectFit.SCALE_DOWN) {
      const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight
      fit = isSmaller ? ObjectFit.NONE : ObjectFit.CONTAIN
    }

    switch (fit) {
      case ObjectFit.NONE:
        return { width: 'auto', height: 'auto' }
      case ObjectFit.CONTAIN:
        return vertical ? { width: 'auto' } : { height: 'auto' }
      case ObjectFit.COVER:
        return vertical ? { height: 'auto' } : { width: 'auto' }
      default:
        return {}
    }
  }
  clickHandler() {
    console.log('click', this.preview)
    // don't show viewer when preview is false
    if (!this.preview) {
      return
    }
    // prevent body scroll
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    this.showViewer = true
  }
  closeViewer() {
    document.body.style.overflow = prevOverflow
    this.showViewer = false
  }
  mounted() {
    this.loadImage()
  }
}
</script>

<style lang="scss">
.metafile-viewer {
  .image-preview {
    cursor: pointer;
  }
}
.viewer-fade-enter-active {
  animation: viewer-fade-in .3s;
}

.viewer-fade-leave-active {
  animation: viewer-fade-out .3s;
}

@keyframes viewer-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes viewer-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>

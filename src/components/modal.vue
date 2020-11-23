<template>
    <transition name="modal">
        <div class="">
            <div ref="mask" class="modal-wrapper"></div>
            <div ref="modal" class="modal-inner" :style="[{'max-width':xWidth}]">
                <div class="zoom" v-if="canClose">
                    <a class="close-btn" @click="close">
                        <i class="svg-icon">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                            </svg>
                        </i>
                    </a>
                </div>
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
  name: 'modal',
  props: {
    mWidth: {
      type: String,
      default: '450px'
    },
    xWidth: {
      type: String,
      default: '800px'
    },
    mDate: {
      type: Array,
      default() {
        return []
      }
    },
    canClose: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    mDate() {
      this.$nextTick(function() {
        this.initSize()
      })
    }
  },
  methods: {
    close() {
      if (this.canClose) {
        document.body.classList.remove('modal-open')
        this.$emit('close')
      }
    },
    keydown(e) {
      if (e.keyCode === 27) {
        this.close()
      }
    },
    initSize() {
      // 垂直居中，水平居中
      const width = this.$refs.modal.clientWidth
      const height = this.$refs.modal.clientHeight
      // const top = document.documentElement.scrollTop;
      // const left = document.documentElement.scrollLeft;
      const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      // this.$refs.modal.style.left = `${left + (w/2 - width/2)}px`;
      // this.$refs.modal.style.top = `${top + (h/2 - height/2)}px`;
      this.$refs.modal.style.left = `${w / 2 - width / 2}px`
      this.$refs.modal.style.top = `${h / 2 - height / 2}px`
      document.body.classList.add('modal-open')
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.initSize()
      this.$refs.mask.addEventListener('click', this.close, true)
      window.addEventListener('resize', this.initSize, true)
      document.addEventListener('keydown', this.keydown, true)
    })
  },
  beforeDestroy() {
    this.$refs.mask.removeEventListener('click', this.close, true)
    window.removeEventListener('resize', this.initSize, true)
    document.removeEventListener('keydown', this.keydown, true)
    this.close()
  }
}
</script>

<style>
    .modal-open{
        overflow: hidden;
    }

    .modal-wrapper {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .3);
        z-index: 9998;
        transition: opacity .1s ease
    }

    .modal-enter,
    .modal-leave-to {
        opacity: 0;
    }

    .modal-inner{
        position: fixed;
        /* padding: 20px 20px 20px; */
        font-size: 16px;
        text-align: left;
        line-height: 180%;
        color: #666;
        min-height: 150px;
        word-wrap: break-word;
        box-shadow: 0 0 20px 6px rgba(78, 76, 76, 0.46);
        border-radius: 6px;
        background-color: #474F62;
        z-index: 9998;
    }

    .modal-inner .zoom{
        width: 30px;
        height: 30px;
        text-align: right;
        position: absolute;
        top: 15px;
        right: 15px;
    }

    .modal-inner .zoom .close-btn {
        display: inline-block;
        color: #FFF;
        width: 30px;
        height: 30px;
        line-height: 30px;
        /* border-radius: 50%; */
        position: relative;
        /* background: #fff; */
        cursor: pointer;
        transition: all .2s;
    }
    .modal-inner .zoom .svg-icon svg {
        width: 24px;
        height: 24px;
    }
    .modal-inner .zoom .close-btn:hover{
        /* transform: rotate(180deg); */
    }
    .modal-inner .zoom .close-btn:after {
        content: "";
        display: block;
        position: absolute;
        top: 7px;
        left: 7px;
        width: 36px;
        height: 36px;
        /* border-radius: 50%; */
        /* border: 1px solid #FDC4BD; */
        /* background: url(/src/images/common/modal-ico-close.png) no-repeat center center #FDF2F1;
        background-size: 50% 50%; */
    }
</style>

<template>
  <div class="dropdown">
    <slot></slot>
    <transition name="fade">
      <div class="popover popper-dropdown" ref="popper" v-show="isShow" :style="popperStyle">
        <div class="popover-content dropdown-content" @click="handleDropdownClick">
          <slot name="content"><div v-text="content"></div></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import PopperMixin from './popover/popperMixin'
export default {
  mixins: [PopperMixin],
  props: {
    title: {
      type: String,
      default: '',
    },
    trigger: {
      type: String,
      default: 'click',
    },
    width: {
      type: Number,
    },
    placement: {
      type: String,
      default: 'bottom',
    },
  },
  methods: {
    // add delay
    hidePopper() {
      if (this.trigger !== 'hover') this.isShow = false
      this.timer = setTimeout(() => {
        this.isShow = false
        this.popperTimer = setTimeout(() => {
          this.popper.destroy() // destroy popper when hide
          this.popper = null
        }, 300)
      }, 300)
    },
    handleDropdownClick(event) {
      this.$emit('click', event)
    }
  },
  computed: {
    popperStyle() {
      if (this.width && this.width !== 276) {
        return { width: `${this.width}px`, maxWidth: 'none' }
      }
      return null
    },
  },
}
</script>
<style lang="scss">
.popper-dropdown{
  // border-radius: 3px;
  background: transparent;
  .menu-list a i{
    margin-right: 5px;
  }
}
.popper-dropdown[x-placement^="bottom"]{
  margin-top: 5px;
}
</style>

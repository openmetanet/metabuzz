<template>
  <snackbar
    :timeout="timeout"
    :color="color"
    :bottom="y === 'bottom'"
    :top="y === 'top'"
    :left="x === 'left'"
    :right="x === 'right'"
    :multi-line = "multiLine"
    :vertical = "vertical"
    v-model="active"
    class="v-application vts"
    :class="classes"
    @click="dismiss"
    role="alert"
  >

    <div class="vts__message" :class="{ 'vts__message--padded': showClose && !closeText }">
      <div v-html="message"></div>
      <slot></slot>
    </div>
  </snackbar>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Snackbar, Overlay } from '@comps/components'
// import * as test from '@comps/components'
@Component({
  components: {
    Snackbar,
    Overlay,
  },
})
export default class Toast extends Vue {
  @Prop({ default: 'right' }) x?: string
  @Prop({ default: 'bottom' }) y?: string
  @Prop({ default: 'info' }) color?: string
  @Prop({ default: '' }) icon?: string
  @Prop({ default: '' }) iconColor?: string
  @Prop({ default: '' }) classes?: string | object | Array<string>
  @Prop({ default: '' }) message?: string
  @Prop({ default: 3000 }) timeout?: number
  @Prop({ default: true }) dismissable?: boolean
  @Prop({ default: false }) multiLine?: boolean
  @Prop({ default: false }) vertical?: boolean
  @Prop({ default: false }) showClose?: boolean
  @Prop({ default: '' }) closeText?: string
  @Prop({ default: 'close' }) closeIcon?: string
  @Prop({ default: '' }) closeColor?: string

  active = false

  @Watch('active')
  onChangeValue(isActive: boolean, wasActive: boolean) {
    this.$emit('statusChange', isActive, wasActive)
  }

  mounted() {
    this.$nextTick(() => this.show())
  }

  show() {
    this.active = true
  }
  close() {
    this.active = false
  }
  dismiss() {
    if (this.dismissable) {
      this.close()
    }
  }
}
</script>

<style>
  .vts {
    max-width: none !important;
    width: auto !important;
  }
  .vts .v-snack__content {
    justify-content: flex-start;
  }
  .vts__icon {
    margin-right: 12px;
  }
  .vts__message {
    margin-right: auto;
  }
  .vts__close {
    margin: 0 -8px 0 24px !important;
    justify-self: flex-end;
  }
  .vts.v-snack--vertical .vts__icon {
    margin: 0 0 12px !important;
  }
  .vts.v-snack--vertical .v-snack__content {
    padding-bottom: 16px !important;
  }
  .vts.v-snack--vertical .vts__message--padded {
    padding: 12px 0 0;
  }
  .vts.v-snack--vertical .vts__icon + .vts__message {
    padding-top: 0;
  }
  .vts.v-snack--vertical .vts__close {
    margin: 12px 0 -8px !important;
  }
  .vts.v-snack--vertical .vts__close--icon {
    margin: 0 !important;
    position: absolute;
    right: 4px;
    top: 4px;
    transform: scale(0.75);
    padding: 4px !important;
  }
</style>

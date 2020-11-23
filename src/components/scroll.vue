<template>
	<div class="my-scroll" :class="[canScroll ? 'prohibit':'allow']" ref="myScroll" @scroll.passive="onScroll($event)" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)"  >
		<div class="scroll-top" :style="{height:top+'px'}">
			<div v-if="direction === 1">
				<p v-if="state === 6">
					下拉刷新
				</p>
				<p v-if=" state === 1 ">
					刷新中
				</p>
				<p v-if="state === 2">松开刷新</p>
				<p v-if="state === 3">
					刷新完成
				</p>
			</div>
		</div>
		<!-- top -->
		<div class="scroll-list" :style="{ transform: 'translate3d(0, ' + top + 'px, 0)'}">
			<slot name='scrollList'></slot>
			<div class="scroll-bottom">
				<div v-if="state === 4">加载中</div>
				<div v-if="state === 5">加载完成</div>
				<div v-if="state === 7">没有更多</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

enum Direction {
  Up,
  Down,
  Left,
  Right,
}
@Component({
  components: {
  },
})
export default class Scroll extends Vue {
  @Prop({
    type: Object,
  })
  page: object

  // 顶部回调
  @Prop({
    type: Function,
  })
  onTop: Function

  // 底部回调
  @Prop({
    type: Function,
  })
  onBottom: Function

  // 是否可滑动
  @Prop({
    type: Boolean,
    default: true
  })
  canScroll: boolean

  pageX = 0
  pageY = 0
  top = 0
  state = 0
  scrollPosition = 0
  myScroll = null
  myScrollList = null
  direction = Direction.Down

  scrollTop(top) {
    this.myScroll.scrollTop = top
  }
  /*
  * 修改状态
  * 刷新中：1
  * 松开刷新：2
  * 刷新完成：3
  * 加载中：4
  * 加载完成：5
  * 下拉刷新：6
  * 没有更多：7
  */
  setState(index) {
    this.state = index
  }
  // 触摸事件
  touchStart(e) {
    this.pageX = e.targetTouches[0].pageX
    this.pageY = e.targetTouches[0].pageY
  }
  // 触摸滑动事件
  touchMove(e) {
    this.scrollPosition = this.myScroll.scrollTop // 获取滚动条位置
    if (this.canScroll && e.targetTouches[0].pageY > this.pageY) { // 向上滑动
      this.direction = Direction.Down
      if (this.myScroll.scrollTop === 0) {
        const diff = e.targetTouches[0].pageY - this.pageY - this.scrollPosition
        this.top = Math.pow(diff, 0.9)
        const ranget = diff / document.body.clientHeight * 100 // 计算在屏幕上滑动了多少
        if (ranget > 20) {
          this.state = 2
        } else if (ranget < 15) {
          this.state = 6
        }
        e.preventDefault()
      }
    } else if (this.canScroll && this.state !== 4) {
      this.direction = Direction.Up
    }
  }
  touchEnd(e) {
    if (this.direction === Direction.Down && (this.state === 2 || this.state === 1)) { // 上拉处理
      this.top = 100
      this.state = 1
      this.topCallback()
    } else if (this.direction === Direction.Down) {
      this.state = 0
      this.top = 0
    }
  }
  onScroll(e) {
    const listHeight = this.myScrollList.offsetHeight // 列表总高度
    const listScrollTop = e.target.scrollTop + this.myScroll.offsetHeight // 当前滚动条位置
    if (this.state === 0 && listHeight - listScrollTop < 100) {
      this.bottomCallback()
    }
    // if (this.getScrollTop) this.getScrollTop(e.target.scrollTop) // 返回X，Y
  }
  topCallback() { // 刷新回调
    this.onTop(this.state)
  }
  bottomCallback() {
    if (this.state !== 7) {
      this.state = 4
      this.onBottom(this.state)
    }
  }
  mounted() {
    this.myScroll = this.$refs.myScroll
    this.myScrollList = this.myScroll.children[1]
  }
}
</script>

<style lang="scss">
  .allow {
		overflow:hidden;
		height: auto;
	}
	.prohibit {
		max-width: 100%;
		max-height: 100%;
	  height: 100%;
		overflow:hidden;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		will-change: transform;
	  transition: all 450ms;
	  backface-visibility: hidden;
	  perspective: 1000;
	}
	.my-scroll {
	  position: relative;
		color: #fff;
	  .scroll-top {
      text-align: center;
      display:flex;
      position:absolute;
      top:0;
      left:0;
			width:100%;
			overflow: hidden;
      div {
        display:flex;
        height:auto;
        width:100%;
        justify-content: center;
        align-items:center;
        flex-wrap: wrap;
        i {
          flex:1 0 100%;
          display:block;
          height: 0.4rem;
        }
        img {
          width:0.6rem;
        }
        p {
          flex:1 0 100%;
        }
      }
    }
		.scroll-list {
			overflow:hidden;
			min-height: 100%;
		}
		.scroll-bottom {
			text-align: center;
			line-height: 40px;
		}
	}
</style>

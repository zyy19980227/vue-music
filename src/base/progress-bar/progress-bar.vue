<template>
  <div class="progress-bar" ref="progressBar" @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="btn" @touchstart.prevent='progressTouchStart' @touchmove.prevent='progressTouchMove' @touchend.prevent='progressTouchEnd'>
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from '../../common/js/dom'
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: { // 接受父组件传递来的百分比，通过百分比来改变进度条的位置
    percent: {
      type: Number,
      default: 0
    }
  },
  created () {
    this.touch = {} // 在cerated生命周期函数创建一个触摸的类来存放和触摸相关的信息
  },
  watch: {
    percent (newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) { // 当播放时间百分比发生变化且进度条容器没有被触摸的时候执行函数
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条容器总长度为bar的长度减去圆形按钮btn的直径
        const offsetWidth = newPercent * barWidth // 偏移位置为播放歌曲时间百分百乘以进度条容器总长度
        this._offset(offsetWidth) // 改变进度条样式函数
      }
    }
  },
  methods: {
    progressTouchStart (e) { // 开始触摸时
      this.touch.initiated = true // 是否被触摸的标志位置为true
      this.touch.startX = e.touches[0].pageX // 记录开始触摸的位置
      this.touch.left = this.$refs.progress.clientWidth // 记录当前进度条的长度
    },
    progressTouchMove (e) {
      if (!this.touch.initiated) { // 如果没有是否触摸标志位或者是否触摸标志位位false，则什么都不做
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX // 触摸移动的距离为手指移动到的当前位置减去值钱记录的开始触摸的位置
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX)) // 偏移距离最长为进度条容器总长度，最小为0，偏移距离为触摸前进度条长度加上触摸移动的距离
      this._offset(offsetWidth) // 改变进度条样式函数
    },
    progressTouchEnd () {
      this.touch.initiated = false // 是否触摸标记为置为false
      this._triggerPercent() // 将移动的百分比传递给父组件
    },
    progressClick (e) {
      const rect = this.$refs.progressBar.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      this._offset(offsetWidth)
      this._triggerPercent()
    },
    _offset (offsetWidth) { //  进度条改变函数
      this.$refs.progress.style.width = `${offsetWidth}px` // 改变进度条长度
      this.$refs.btn.style[transform] = `translate3d(${offsetWidth}px,0,0)` // 改变圆形按钮位置
    },
    _triggerPercent () { // 父组件监听子组件，子组件将移动百分比传递给父组件
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条容器总长度
      const percent = this.$refs.progress.clientWidth / barWidth // 计算当前进度条百分比为进度条长度除以进度条容器总长度
      this.$emit('percentchange', percent) // 将百分比传递给父组件，父组件监听percentchange事件
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>

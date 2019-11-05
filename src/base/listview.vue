<template>
    <scroll class="listview" :probeType='probeType' :data='data' ref="listview" :listenScroll='listenScroll' @scroll='scroll'>
        <ul>
            <li v-for="(group, index) of data" :key="index" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="(item,index) of group.items" :key="index" class="list-group-item" @click='selectItem(item)'>
                        <img v-lazy="item.avatar" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent='onShortcutTouchMove'>
          <ul>
            <li v-for="(item,index) of shortcutList" :key="index" class="item" :data-index='index' :class="{'current': currentIndex === index}">{{item}}</li>
          </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
          <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <div v-show="!data.length" class="loading-container">
          <loading></loading>
        </div>
    </scroll>
</template>

<script>
import Scroll from './scroll'
import loading from './loading/loading'
import { getData } from '../common/js/dom'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30 // title的高度
export default {
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  components: {
    Scroll,
    loading
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title.substr(0, 1)
      })
    },
    fixedTitle () {
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  watch: {
    data () {
      setTimeout(() => {
        this._calculateHight()
      }, 20)
    },
    scrollY (newY) { // newY是距离顶部总滚动的距离
      const listHeight = this.listHeight
      // 当滚动到顶部，newY大于0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i] // 当前所处li顶部的高度
        let height2 = listHeight[i + 1] // 下一个li顶部的高度
        if (-newY >= height1 && -newY < height2) { // 当newY处于两者之间时，currentIndex为当前的li的排序号i
          this.currentIndex = i
          this.diff = height2 + newY // diff为页面顶部与下一个li顶部的距离
          return
        }
      }
      // 滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2 // 索引从0开始，所以要减一，因为_calculateHeight函数里添加了第一个元素0，所以要再减一
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? (newVal - TITLE_HEIGHT) : 0 // 向下滚动时，当fixedtop大于等于title高度时，它的值为页面顶部与下一个li的距离减去title的高度，是一个负数
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)` // 向下滚动时，当fixedtop大于等于title高度时，使title向上偏移，因为fixedTop是一个负数，所以是向上偏移
    }
  },
  methods: {
    onShortcutTouchStart (e) { // 监听点击函数
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) { // 监听触摸移动函数
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    refresh () {
      this.$refs.listview.refresh()
    },
    _scrollTo (index) {
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      console.log(index)
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHight () { // 计算高度函数
      this.listHeight = []
      const list = this.$refs.listGroup // 获取li元素
      let height = 0
      this.listHeight.push(height) // 0是listheight的第一个元素
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height) // 把li的高度逐个添加到listheight中
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

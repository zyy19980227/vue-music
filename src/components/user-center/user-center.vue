<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches :switches='switches' :currentIndex='currentIndex' @switch='switchItem'></switches>
      </div>
      <div class="play-btn" ref="playbtn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listwrapper">
        <scroll v-show="currentIndex===0" :data='favoriteList' class="list-scroll" ref="scroll1">
          <div class="list-inner">
            <songlist :songs='favoriteList' @select='selectSong'></songlist>
          </div>
        </scroll>
        <scroll v-show="currentIndex===1" :data='playHistory' class="list-scroll" ref="scroll2">
          <div class="list-inner">
            <songlist :songs='playHistory' @select='selectSong'></songlist>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <noresult :title="noResultDesc"></noresult>
      </div>
    </div>
  </transition>
</template>

<script>
import switches from '../../base/switches/switches'
import Scroll from '../../base/scroll'
import songlist from '../../base/song-list/song-list'
import { mapGetters, mapActions } from 'vuex'
import Song from '../../common/js/song'
import { playlistMixin } from '../../common/js/mixin'
import noresult from '../../base/no-result/no-result'
export default {
  data () {
    return {
      currentIndex: 0,
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ]
    }
  },
  mixins: [playlistMixin],
  components: {
    switches,
    Scroll,
    songlist,
    noresult
  },
  computed: {
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ]),
    noResult () {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length
      } else {
        return !this.playHistory.length
      }
    },
    noResultDesc () {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲'
      } else {
        return '你还没有听过歌曲'
      }
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.listwrapper.style.bottom = bottom
      if (this.currentIndex === 0) {
        this.$refs.scroll1.refresh()
      }
      if (this.currentIndex === 1) {
        this.$refs.scroll2.refresh()
      }
    },
    back () {
      this.$router.back()
    },
    random () {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
      if (list.length === 0) {
        return
      }
      list = list.map((song) => {
        return new Song(song)
      })
      this.randomPlay({
        list
      })
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song) {
      this.insertSong(new Song(song))
    },
    ...mapActions([
      'insertSong',
      'randomPlay'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

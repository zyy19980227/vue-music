<template>
  <scroll class="suggest" :data='result' :pullup='pullup' :before-scroll='beforeScroll' @scrollToEnd='searchMore' ref="suggest" @beforeScroll='listScroll'>
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) of result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconClass(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <noresullt :title="title"></noresullt>
    </div>
  </scroll>
</template>

<script>
import { search } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { createSong } from '../../common/js/song'
import Scroll from '../../base/scroll'
import loading from '../../base/loading/loading'
import Singer from '../../common/js/singer'
import { mapMutations, mapActions } from 'vuex'
import noresullt from '../../base/no-result/no-result'

const TYPE = 'singer'
const PERPAGE = 20
export default {
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      title: '抱歉，暂无搜索结果',
      beforeScroll: true
    }
  },
  components: {
    Scroll,
    loading,
    noresullt
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    query () {
      this.search()
    }
  },
  methods: {
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () {
      this.$emit('listScroll')
    },
    search () {
      this.hasMore = true
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._normalizeSongs(res.data.song.list))
          this._checkMore(res.data)
        }
      })
    },
    selectItem (item) {
      if (item.type === TYPE) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ]),
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    _genResult (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs (list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    getIconClass (item) {
      if (item.type === TYPE) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.type === TYPE) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

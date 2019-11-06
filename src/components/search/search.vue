<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox ref="searchbox" @query='onQueryChange'></searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcuntWrapper">
      <scroll class="shortcut" :data='shortcut' ref="scroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item,index) of hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <searchlist :searches='searchHistory' @select="addQuery" @delete="deleteSearchHistory"></searchlist>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query='query' @listScroll='blurInput' @select='saveSearch' ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" :text="text" :confirmBtnText="confirmBtnText" @confirm='clearSearchHistory'></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import searchbox from '../../base/search-box'
import searchlist from '../../base/search-list/search-list'
import confirm from '../../base/confirm/confirm'
import { getHotKey } from '../../api/search'
import { ERR_OK } from '../../api/config'
import { playlistMixin } from '../../common/js/mixin'
import suggest from '../../components/suggest/suggest'
import Scroll from '../../base/scroll'
import { mapActions, mapGetters } from 'vuex'
export default {
  data () {
    return {
      hotKey: [],
      query: '',
      text: '是否清空所有搜索历史',
      confirmBtnText: '清空'
    }
  },
  components: {
    searchbox,
    suggest,
    searchlist,
    confirm,
    Scroll
  },
  mixins: [playlistMixin],
  computed: {
    ...mapGetters([
      'searchHistory'
    ]),
    shortcut () {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  watch: {
    query (newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    }
  },
  created () {
    this._getHotKey()
  },
  methods: {
    addQuery (query) {
      this.$refs.searchbox.setQuery(query)
    },
    onQueryChange (query) {
      this.query = query
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    blurInput () {
      this.$refs.searchbox.blur()
    },
    saveSearch () {
      this.saveSearchHistory(this.query)
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.shortcuntWrapper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.scroll.refresh()
      this.$refs.suggest.refresh()
    },
    _getHotKey () {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

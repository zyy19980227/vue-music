<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import mheader from './components/m-header/m-header'
import tab from './components/tab/tab'
import player from './components/player/player'
export default {
  name: 'App',
  components: {
    mheader,
    tab,
    player
  }
}
</script>

<style lang="stylus" scoped>
  @import './common/stylus/variable'

    #app
      color $color-theme
</style>

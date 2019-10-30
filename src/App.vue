<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import mheader from './components/m-header/m-header'
import tab from './components/tab/tab'
export default {
  name: 'App',
  components: {
    mheader,
    tab
  }
}
</script>

<style lang="stylus" scoped>
  @import './common/stylus/variable'

    #app
      color $color-theme
</style>

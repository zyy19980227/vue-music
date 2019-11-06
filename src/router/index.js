import Vue from 'vue'
import Router from 'vue-router'
import rank from '../components/rank/rank'
import recommend from '../components/recommend/recommend'
import search from '../components/search/search'
import singer from '../components/singer/singer'
import singerDetail from '../components/singer-detail/singer-detail'
import Disc from '../components/disc/disc'
import toplist from '../components/top-list/top-list'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/recommend',
      component: recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: singer,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: rank,
      children: [
        {
          path: ':id',
          component: toplist
        }
      ]
    },
    {
      path: '/search',
      component: search,
      children: [
        {
          path: ':id',
          component: singerDetail
        }
      ]
    },
    {
      path: '/',
      redirect: '/recommend'
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const recommend = resolve => {
  import('../components/rank/rank').then((module) => {
    resolve(module)
  })
}
const singer = resolve => {
  import('../components/singer/singer').then((module) => {
    resolve(module)
  })
}
const rank = resolve => {
  import('../components/rank/rank').then((module) => {
    resolve(module)
  })
}
const search = resolve => {
  import('../components/search/search').then((module) => {
    resolve(module)
  })
}
const singerDetail = resolve => {
  import('../components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
const Disc = resolve => {
  import('../components/disc/disc').then((module) => {
    resolve(module)
  })
}
const toplist = resolve => {
  import('../components/top-list/top-list').then((module) => {
    resolve(module)
  })
}
const usercenter = resolve => {
  import('../components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

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
    },
    {
      path: '/user',
      component: usercenter
    }
  ]
})

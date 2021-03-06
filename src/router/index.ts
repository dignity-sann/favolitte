import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/pages/Home.vue'
import TwitterView from '@/components/pages/TwitterView.vue'
import Group from '@/components/pages/Group.vue'
import JoinGroup from '@/components/pages/JoinGroup.vue'
import FavSummery from '@/components/pages/FavSummery.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/twitter',
    name: 'Twitter',
    component: TwitterView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fav/create',
    name: 'Manage | group',
    component: Group,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fav/join',
    name: 'Manage | join',
    component: JoinGroup,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/fav/watch',
    name: 'fav',
    component: FavSummery,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

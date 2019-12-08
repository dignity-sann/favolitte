import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/pages/Home.vue'
import TwitterView from '@/components/pages/TwitterView.vue'
import Group from '@/components/pages/manage/Group.vue'

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
    path: '/manage/group',
    name: 'Manage | group',
    component: Group
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

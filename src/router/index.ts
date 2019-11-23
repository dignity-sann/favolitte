import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/pages/Home.vue'
import TwitterView from '@/components/pages/TwitterView.vue'
import Signin from '@/components/pages/Signin.vue'

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
      icon: '[fab, twitter]'
    }
  },
  {
    path: '/signin',
    name: 'signin',
    component: Signin,
    meta: {
      icon: '[fab, twitter]'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

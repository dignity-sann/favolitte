import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAnalytics from 'vue-analytics'

import Firebase from './firebase'
Firebase.init()

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
  router
})

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)){
    // 認証必要メニュー
    if (!store.getters.isSignedIn) {
      // ユーザ認証なし
      await Firebase.signin();
      const unwatch = store.watch(
        (state, getters) => {
          return state.status
        },
        (newVal, oldVal) => {
          if (newVal) {
            // 全て取得完了後に遷移先へ
            next({path: to.path})
          }
        }
      )
      // とりあえずTOPに戻す
      if (from.path !== '/') {
        next({path: '/'})
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    // 認証不要メニュー
    next()
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

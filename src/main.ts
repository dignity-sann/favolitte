import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'

import Firebase from './firebase'
Firebase.init()

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.requiresAuth)){
    // 認証必要メニュー
    if (!store.getters.isSignedIn) {
      // ユーザ認証なし
      Firebase.signin();
      next({
        path: '/home'
      })
    }
    next()
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

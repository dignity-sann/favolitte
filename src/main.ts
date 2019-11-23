import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
import Firebase from 'firebase'

Firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: "favolitte.firebaseapp.com",
  databaseURL: "https://favolitte.firebaseio.com",
  projectId: "favolitte",
  storageBucket: "favolitte.appspot.com",
  messagingSenderId: "219894010770",
  appId: "1:219894010770:web:87bdc58f910e495924674b",
  measurementId: "G-E18QH1VKG6"
})

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

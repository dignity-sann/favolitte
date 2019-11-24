import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    status: false
  },
  mutations: {
    onAuthStateChanged(state, user) {
      // firebaseが返したユーザー情報
      state.user = user;
    },
    onUserStatusChanged(state, status) {
      // ログインしてるかどうか true or false
      state.status = status;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    }
  }
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    userTw: {},
    status: false
  },
  mutations: {
    onAuthStateChanged(state, user) {
      // firebaseが返したユーザー情報
      state.user = user;
    },
    onUserTwChanged(state, userTw) {
      // twitteのユーザー情報
      state.userTw = userTw;
    },
    onUserStatusChanged(state, status) {
      // ログインしてるかどうか true or false
      state.status = status;
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
    userTw(state) {
      return state.userTw;
    },
  }
})

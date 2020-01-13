import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    userTw: {},
    userTwAcessToken: '',
    userTwTokenSecret: '',
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
    onUserTwAcessTokenChanged(state, userTwAcessToken) {
      state.userTwAcessToken = userTwAcessToken;
    },
    onUserTwTokenSecretChanged(state, userTwTokenSecret) {
      state.userTwTokenSecret = userTwTokenSecret;
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
    userTwAcessToken(state) {
      return state.userTwAcessToken;
    },
    userTwTokenSecret(state) {
      return state.userTwTokenSecret;
    },
  }
})

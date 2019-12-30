import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import store from "./store";
import axios from "axios";

export default {
  init() {
    firebase.initializeApp({
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.VUE_APP_FIREBASE_DATA_BASE_URL,
      projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.VUE_APP_FIREBASE_APP_ID,
      measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
    });
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  },
  async signin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithPopup(provider);
  },
  async signout() {
    firebase.auth().signOut()
  },
  onAuth() {
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        store.commit('onAuthStateChanged', null);
        store.commit('onUserStatusChanged', false);
        store.commit('onUserTwChanged', null);
      } else {
        store.commit('onAuthStateChanged', user);
        store.commit('onUserStatusChanged', true);
        if (user.providerData.length > 0) {
          const userInfo: (firebase.UserInfo | null) = user.providerData[0]
          let uid = ''
          if (userInfo !== null) {
            uid = userInfo.uid
          }
          const twuser: any = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
            params: {
                endpoint: 'users/show',
                param: {
                    user_id: uid
                }
            }
          })
          store.commit('onUserTwChanged', twuser);
        } else {
          store.commit('onUserTwChanged', null);
        }
      }
    });
  },
  firestore() {
    return firebase.firestore()
  }
};

import firebase from 'firebase/app';
import 'firebase/auth';
import store from "./store";

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
  signin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithPopup(provider);
  },
  signout() {
    firebase.auth().signOut()
  },
  onAuth() {
    firebase.auth().onAuthStateChanged(user => {
      store.commit('onAuthStateChanged', user);
      if (user) {
        store.commit('onUserStatusChanged', true);
      } else {
        store.commit('onUserStatusChanged', false);
      }
    });
  }
};

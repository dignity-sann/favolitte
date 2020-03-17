import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/analytics';
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
    firebase.analytics();
  },
  async signin() {
    const provider = new firebase.auth.TwitterAuthProvider()
    firebase.auth().signInWithPopup(provider).then(async function(result: any) {
      if (result.credential) {
        const firestore = firebase.firestore()
        firestore
          .collection('platform_users')
          .doc(result.user.uid)
          .set({
            access_token: result.credential.accessToken,
            token_secret: result.credential.secret
          })
      }
    });
  },
  async signout() {
    const firestore = firebase.firestore()
    const user: (firebase.UserInfo | null) = firebase.auth().currentUser
    if (user) {
      await firestore
        .collection('platform_users')
        .doc(user.uid)
        .set({
          access_token: '',
          token_secret: ''
        })
    }
    firebase.auth().signOut()
  },
  onAuth() {
    firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        store.commit('onAuthStateChanged', null);
        store.commit('onUserTwChanged', null);
        store.commit('onUserTwAcessTokenChanged', '');
        store.commit('onUserTwTokenSecretChanged', '');
        store.commit('onUserStatusChanged', false);
      } else {
        const firestore = firebase.firestore()
        let firebaseUserinfo: any
        await firestore
          .collection('platform_users')
          .doc(user.uid)
          .get()
          .then((documentSnapshot) => {
            firebaseUserinfo = documentSnapshot.data()
          })
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
              access_token: firebaseUserinfo.access_token,
              token_secret: firebaseUserinfo.token_secret,    
              endpoint: 'users/show',
              param: {
                user_id: uid
              }
            }
          })
          store.commit('onUserTwAcessTokenChanged', firebaseUserinfo.access_token);
          store.commit('onUserTwTokenSecretChanged', firebaseUserinfo.token_secret);  
          store.commit('onUserTwChanged', twuser);
        }
      }
    });
  },
  firestore() {
    return firebase.firestore()
  }
};

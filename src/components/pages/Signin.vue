<template>
  <div>
   <v-btn class="mx-2" fab dark small color="primary" @click="signin()">
      <v-icon dark>mdi-minus</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import firebase from 'firebase/app'

export default {
  data(){
    return {
    }
  },
  methods: {
    signin: function () {
      console.log('st')
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().signInWithRedirect(provider).then((result :any) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = result.credential.accessToken;
        const secret = result.credential.secret;
        // The signed-in user info.
        const user = result.user;
      }).catch((error :any) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
      })
    }
  }
}
</script>

<style scoped>
</style>
<template>
  <div class="text-center">
    <v-menu
      :close-on-content-click="false"
      :nudge-width="200"
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          fav
          icon
          v-on="on"
        >
          <v-avatar color="indigo" size="36">
            <v-icon dark v-if="!$store.getters.isSignedIn">mdi-account-circle</v-icon>
            <img v-else
              :src="$store.getters.user.photoURL"
              :alt="$store.getters.user.displayName"
            >
          </v-avatar>
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item v-if="$store.getters.isSignedIn && $store.getters.userTw.data">
            <v-list-item-avatar>
              <img
                :src="$store.getters.userTw.data.profile_image_url"
              >
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $store.getters.userTw.data.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ '@'.concat($store.getters.userTw.data.screen_name) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else>
            <v-list-item-content>
              <v-list-item-title>Sign in required</v-list-item-title>
            </v-list-item-content>
          </v-list-item> 
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="!$store.getters.isSignedIn" text @click="signin()" color="primary">
            Sign in
          </v-btn>
          <v-btn v-if="$store.getters.isSignedIn" text @click="signout()" color="primary">
            Sign Out
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import firebase from '@/firebase.ts'

export default {
  name: 'Account',
  data(){
    return {
    }
  },
  methods: {
    signin: async function () {
      await firebase.signin();
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
    signout: async function() {
      await firebase.signout();
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
  },
  created: function() {
    firebase.onAuth();
  }
}
</script>

<style scoped>
</style>
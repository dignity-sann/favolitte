<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on }">
        <v-btn
          fav
          icon
          v-on="on"
        >
          <v-avatar color="indigo" size="36" @click="on">
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
          <v-list-item>
            <v-list-item-avatar v-if="$store.getters.isSignedIn">
              <img
                :src="$store.getters.user.photoURL"
                :alt="$store.getters.user.displayName"
              >
            </v-list-item-avatar>
            <v-list-item-content v-if="$store.getters.isSignedIn">
              <v-list-item-title>{{ $store.getters.user.displayName }}</v-list-item-title>
              <v-list-item-subtitle>Account IDを載せたい</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn v-if="!$store.getters.isSignedIn" text @click="signin()" color="primary">
            サインイン
          </v-btn>
          <v-btn v-if="$store.getters.isSignedIn" text @click="signout()" color="primary">
            サインアウト
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import firebase from '@/firebase.ts'
import axios from 'axios'

export default {
  data(){
    return {
      menu: []
    }
  },
  methods: {
    signin: function () {
      firebase.signin();
    },
    signout: function() {
      firebase.signout();
    },
  },
  created: function() {
    firebase.onAuth();
  }
}
</script>

<style scoped>
</style>
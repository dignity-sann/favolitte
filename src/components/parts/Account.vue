<template>
  <v-list dense>
    <v-subheader>Account</v-subheader>

    <v-list-item two-line v-if="$store.getters.isSignedIn">
      <v-list-item-avatar>
        <img :src="$store.getters.user.photoURL">
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ $store.getters.user.displayName }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item>
      <v-list-item-action>
        <v-switch
          value
          :input-value="$store.getters.isSignedIn"
          v-on:change="$store.getters.isSignedIn ? signout() : signin()"
        >
        </v-switch>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          Singin/out
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import firebase from '@/firebase.ts'

export default {
  data(){
    return {
    }
  },
  methods: {
    signin: function () {
      firebase.signin();
    },
    signout: function() {
      firebase.signout();
    }
  },
  created: function() {
    firebase.onAuth();
  },
  mounted () {

  }
}
</script>

<style scoped>
</style>
<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      temporary
      app
    >
      <v-list dense>
        <v-subheader>Menu</v-subheader>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense>
        <v-subheader>Settings</v-subheader>
        <v-list-item>
          <v-list-item-action>
            <v-checkbox
              v-model="$vuetify.theme.dark"
            ></v-checkbox>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>Darkmode</v-list-item-title>
            <v-list-item-subtitle>画面を暗くするよ</v-list-item-subtitle>
          </v-list-item-content>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="true"
      app
    >
      <v-app-bar-nav-icon
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-toolbar-title>fovolitte</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer
      padless
      app
    >
      <v-row
        justify="center"
        no-gutters
      >
        <v-col
          class="py-1 text-center"
          cols="12"
        >
          {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
  components: {
  },
  data: () => ({
    primaryDrawer: {
      model: null,
    },
    items: [
      {
        title: 'Home',
        icon: 'home',
        path: '/'
      },
      {
        title: 'twitter見るやつ',
        icon: 'cake',
        path: '/twitter'
      },
      {
        title: 'About',
        icon: 'info',
        path: '#'
      },
    ],
  }),
});
</script>
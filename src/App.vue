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
          v-for="(item, index) in filtering()"
          :key="index"
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
            <v-list-item-subtitle>
              {{ item.description }}
            </v-list-item-subtitle>
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
            <v-list-item-title>
              Darkmode
            </v-list-item-title>
            <v-list-item-subtitle>
              画面を暗くするよ
            </v-list-item-subtitle>
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
    menus: [
      {
        title: 'Home',
        icon: 'home',
        path: '/',
        order: 0
      },
      {
        title: 'test',
        description: 'test',
        icon: 'work',
        path: '/twitter',
        order: 10
      },
      {
        title: '認証(twitter OAuth)',
        icon: 'info',
        path: '/',
        order: -1
      },
      {
        title: 'リスト作成',
        description: '共有できるリストを作成',
        icon: 'info',
        path: '/',
        order: -1
      },
    ],
  }),
  methods: {
    filtering: function () {
      return this.menus.filter((menu) => {
        return menu.order !== undefined && menu.order !== -1
      }).sort((a, b) => {
        if (a.order > b.order) {
          return 1
        } else if (a.order < b.order) {
          return -1
        } else {
          return 0
        }
      })
    }
  },
});
</script>
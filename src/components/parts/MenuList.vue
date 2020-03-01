<template>
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
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  components: {
  },
  data: () => ({
    menus: [
      {
        title: 'Home',
        description: 'App home',
        icon: 'home',
        path: '/',
        order: 0
      },
      {
        title: 'create favlist',
        description: 'favlist creating',
        icon: 'create',
        path: '/fav/create',
        order: 20
      },
      {
        title: 'join favlist',
        description: 'created favlist join',
        icon: 'settings',
        path: '/fav/join',
        order: 20
      },
      {
        title: 'watch fav',
        description: 'fav list watch view',
        icon: 'list',
        path: '/fav/watch',
        order: 30
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
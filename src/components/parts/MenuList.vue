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
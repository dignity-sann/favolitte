<template>
  <v-list dense>
    <v-subheader>メニュー</v-subheader>
    <v-list-item
      v-for="(item, index) in filtering()"
      :key="index"
      :to="item.path"
      link
    >
      <v-list-item-icon>
        <v-icon v-text="item.icon" />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title class="caption" v-text="item.title" />
        <v-list-item-subtitle class="overline" v-text="item.description" />
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
        title: 'イイねウォッチリスト作成',
        description: '良質ファボをする人のリストを作ります',
        icon: 'mdi-format-list-bulleted',
        path: '/fav/create',
        order: 20
      },
      {
        title: 'アクティブリスト設定',
        description: 'よくみるリストを設定します',
        icon: 'mdi-arrow-down-bold-outline',
        path: '/fav/join',
        order: 20
      },
      {
        title: 'リストウォッチ',
        description: 'アクティブリストの画像をリスト表示',
        icon: 'mdi-cards-heart',
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
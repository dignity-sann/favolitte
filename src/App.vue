<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      temporary
      app
    >
      <v-divider></v-divider>
      <MenuList></MenuList>
      <SettingsList></SettingsList>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="true"
      app
    >
      <v-app-bar-nav-icon
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-toolbar-title>favolitte</v-toolbar-title>
      <v-spacer></v-spacer>
      <Account
        @showMessage="showMessage"
      ></Account>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <!-- If using vue-router -->
        <!-- TODO commponet間のsnackbar連携がダサい・・・直して・・・ -->
        <router-view
          @showMessage="showMessage"
        >
        </router-view>
        <SnackBar ref="snackbar"></SnackBar>
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
          {{ new Date().getFullYear() }} — <strong>favolitte</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Account from '@/components/parts/Account.vue';
import MenuList from '@/components/parts/MenuList.vue';
import SettingsList from '@/components/parts/SettingsList.vue';
import SnackBar from '@/components/parts/SnackBar.vue';

export default Vue.extend({
  name: 'App',
  components: {
    MenuList,
    SettingsList,
    Account,
    SnackBar,
  },
  data () {
    return {
      primaryDrawer: {
        model: null,
      }
    }
  },
  methods: {
    showMessage(message) {
      this.$refs.snackbar.showMessage(message)
    }
  },
});
</script>
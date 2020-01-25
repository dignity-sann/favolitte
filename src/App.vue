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
        <router-view
          @showMessage="showMessage"
        >
        </router-view>
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
    <SnackBar
      :message="message"
      :dummy="dummy"
      :color="color"
    >
    </SnackBar>
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
      },
      message: '',
      dummy: '',
      color: ''
    }
  },
  methods: {
    showMessage(type) {
      if (type.message) {
        this.message = type.message
      }
      if (type.color) {
        this.color = type.color
      } else {
        this.color = 'info'
      }
      this.dummy = Date.now()
    }
  },
});
</script>
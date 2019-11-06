<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :temporary="true"
      app
    />

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
        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="10">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <span>Scheme</span>
                    <v-switch
                      v-model="$vuetify.theme.dark"
                      primary
                      label="Dark"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer app>
      <span class="px-4">&copy; {{ new Date().getFullYear() }}</span>
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
    }
  }),
});
</script>
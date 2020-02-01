<template>
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
          ダークテーマ
        </v-list-item-title>
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
  }),
  methods: {
  },
});
</script>
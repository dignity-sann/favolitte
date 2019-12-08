<template>
  <div>
    <v-card v-for="tw of tweets" :key="tw.id" class="mx-auto tw-card" max-width="600">
      <v-img v-if="tw.entities.media" :src="tw.entities.media[0].media_url" height="800px"></v-img>

      <v-card-title>{{tw.user.name}}</v-card-title>

      <v-card-subtitle>{{tw.text}}</v-card-subtitle>

      <v-card-actions>
        <v-list-item-avatar color="grey darken-3">
          <v-img class="elevation-6" :src="tw.user.profile_image_url"></v-img>
        </v-list-item-avatar>

        <v-btn text>Share</v-btn>

        <v-btn color="purple" text>Explore</v-btn>

        <v-spacer></v-spacer>

        <v-btn icon @click="show = !show">
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>I'm a thing. But, like most politicians, he promised more than he could deliver. You won't have time for sleeping, soldier, not with all the bed making you'll be doing. Then we'll go with that data file! Hey, you add a one and two zeros to that or we walk! You're going to do his laundry? I've got to find a way to escape.</v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
    <infinite-loading v-if="userInfo !== null" @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
import axios from "axios";
import * as user from "./../../core/tw-user";
import InfiniteLoading from 'vue-infinite-loading';

export default {
  components: {
    InfiniteLoading,
  },
  data() {
    return {
      tweets: [],
      show: false,
      userInfo: null,
      maxId: null
    };
  },
  async mounted() {
    console.log("start: fetch userInfo")
    console.log(this.$store.getters.user.providerData[0].uid)
    this.userInfo = await user.getUser(this.$store.getters.user.providerData[0].uid)
    console.log(this.userInfo)
    console.log("finish")
  },
  methods: {
    infiniteHandler($state) {
      const count = 20
      let params = {
          endpoint: "favorites/list",
          param: {
            screen_name: this.userInfo.data.screen_name,
            count: count + 1
          }
      }
      if (this.tweets.length > 0) {
        params.param['max_id'] = this.maxId
      }
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: params
      }).then((res) => {
        this.maxId = res.data[res.data.length - 1].id
        res.data.pop
        this.tweets.push(...res.data);
        $state.loaded();
      });
    },
  }
};
</script>

<style scoped>
.tw-card {
  margin-top: 4px;
}
</style>
<template>
  <div>
    <v-row justify="space-around" align="center">
      <v-col cols="12">
        <v-chip
          v-for="(group, index) in groups"
          :key="index"
          :input-value="group.state"
          color="primary"
          class="ma-2"
          filter
          filter-icon="mdi-minus"
          @click="() => group.state = !group.state"
        >
          {{ group.name }}
        </v-chip>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col
        cols='4'
        v-for="(tw, index) in filterOnlyImage()"
        :key="index"
      >
        <v-card
          class="mx-auto tw-card"
          max-width="600"
          @click="showModal(tw.entities.media[0].media_url)"
        >
          <v-img
            :src="tw.entities.media[0].media_url"
            max-width="1200"
            max-height="800"
          >
            <template v-slot:placeholder>
              <v-row
                class="fill-height ma-0"
                align="center"
                justify="center"
              >
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <v-card-actions>
            <v-list-item class="grow">
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="tw.user.profile_image_url"
                >
                </v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ tw.user.name }}</v-list-item-title>
              </v-list-item-content>

              <v-row
                align="center"
                justify="end"
              >
                <v-btn icon>
                  <v-icon class="mr-1">mdi-heart</v-icon>
                </v-btn>
                <span class="subheading mr-2">{{ tw.favorite_count }}</span>
                <span class="mr-1"></span>
                <v-btn icon>
                  <v-icon class="mr-1">mdi-twitter-retweet</v-icon>
                </v-btn>
                <span class="subheading">{{ tw.retweet_count }}</span>
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
      <infinite-loading @infinite="infiniteHandler"></infinite-loading>
    </v-row>
    <OriginalImageDialog ref="modal"></OriginalImageDialog>
  </div>
</template>

<script>
import axios from "axios";
import InfiniteLoading from 'vue-infinite-loading';
import firebase from '@/firebase.ts'
import OriginalImageDialog from '@/components/parts/OriginalImageDialog.vue';

export default {
  name: 'FavSummery',
  components: {
    InfiniteLoading,
    OriginalImageDialog,
  },
  data() {
    return {
      user: {},
      groups: [],
      tweets: [],
      show: false,
      maxId: null
    };
  },
  async mounted() {
    const firestore = firebase.firestore()
    // firestore requests
    firestore
      .collection('users')
      .doc(this.$store.getters.userTw.data.screen_name)
      .get()
      .then((documentSnapshot) => {
        console.log(documentSnapshot)
        console.log(documentSnapshot.data())
        this.user = documentSnapshot.data()
        this.user.groups.forEach(group => {
          console.log(group)
          this.groups.push({
            name: group,
            state: false
          })
        })
      })
    // initial data
    await this.fetchData(this.$store.getters.userTw.data.screen_name)
      .then((res) => {
        this.maxId = res.data[res.data.length - 1].id
        res.data.pop
        this.tweets.push(...res.data);
      })
  },
  methods: {
    infiniteHandler($state) {
      this.fetchData(this.$store.getters.userTw.data.screen_name)
        .then((res) => {
          this.maxId = res.data[res.data.length - 1].id
          res.data.pop
          this.tweets.push(...res.data);
          $state.loaded();
        })
    },
    async fetchData(screenName) {
      const count = 20
      let params = {
          endpoint: "favorites/list",
          param: {
            screen_name: screenName,
            count: count + 1
          }
      }
      // すでにデータが存在
      if (this.tweets.length > 0) {
        params.param['max_id'] = this.maxId
      }
      return axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call/mock`, {
        params: params
      })
    },
    filterOnlyImage() {
      return this.tweets.filter((v) => {
        return (v.entities.media) && v.entities.media.length > 0
      })
    },
    showModal(imageUrl) {
      this.$refs.modal.showModal(imageUrl)
    },
  }
};
</script>

<style scoped>
.tw-card {
  margin-top: 4px;
}
</style>
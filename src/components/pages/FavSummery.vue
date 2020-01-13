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
        lg='2' md='3' sm='6' xs='12'
        v-for="(tw, index) in filterOnlyImage()"
        class="d-flex child-flex"
        :key="index"
      >
        <v-card
          class="mx-auto tw-card"
        >
          <v-img
            :src="tw.entities.media[0].media_url"
            class="d-flex"
            height="360"
            @click="showModal(tw.entities.media[0].media_url)"
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
          <v-card-actions class="ma-0 pa-0">
            <v-list-item class="grow px-3">
              <v-list-item-avatar color="grey darken-3 mx-1">
                <v-img
                  class="elevation-6"
                  :src="tw.user.profile_image_url"
                >
                </v-img>
              </v-list-item-avatar>
              <v-list-item-content class="ml-2">
                <v-list-item-title class="caption text-truncate">
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 150px;"
                  >
                    {{ tw.user.name }}
                  </span>
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 150px;"
                  >
                    {{ '@'.concat(tw.user.screen_name) }}
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>  
          </v-card-actions>
          <v-divider/>
          <v-card-actions class="">
            <v-list-item class="grow">
              <v-row
                align="center"
                justify="end"
              >
                <v-btn icon @click="doPushFav(tw.id_str)">
                  <v-icon
                    class="mr-1"
                    small
                  >
                    mdi-heart
                  </v-icon>
                </v-btn>
                <span class="caption mr-2" v-text="tw.favorite_count"></span>
                <span class="mr-1"></span>
                <v-btn icon @click="doPushRetweet(tw.id_str)">
                  <v-icon
                    class="mr-1"
                    small
                  >
                    mdi-twitter-retweet
                  </v-icon>
                </v-btn>
                <span class="caption" v-text="tw.retweet_count"></span>
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
    async doPushFav(tweetId) {
      console.log(`doPushFav tweetid => ${tweetId}`)
      axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call/post`, {
        params: {
          endpoint: "favorites/create",
          param: {
            id: tweetId
          }
        }
      })
    },
    async doPushRetweet(tweetId) {
      console.log(`doPushRetweet tweetid => ${tweetId}`)
    },
  }
};
</script>

<style scoped>
.tw-card {
  margin-top: 4px;
}
</style>
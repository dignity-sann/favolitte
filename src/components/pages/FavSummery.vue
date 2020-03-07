<template>
  <div>
    <v-row justify="space-around" align="center">
      <v-col cols="12">
        <v-chip
          v-for="(group, index) in myGroups"
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
    <v-row v-if="!isLoading">
      <v-col
        lg='2' md='3' sm='6' xs='12'
        v-for="(tw, index) in filterOnlyImageAndSort()"
        class="d-flex child-flex"
        :key="index"
      >
        <v-card
          class="mx-auto tw-card"
        >
          <v-img
            v-if="tw.extended_entities.media.length === 1"
            :src="tw.extended_entities.media[0].media_url + '?name=small'"
            class="d-flex"
            height="360"
            @click="showModal(tw.entities.media)"
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
          <v-carousel
            v-if="tw.extended_entities.media.length > 1"
            :show-arrows="false"
            height="360"
          >
            <v-carousel-item
              v-for="(media, index) in tw.extended_entities.media" :key="index"
            >
              <v-img
                :src="media.media_url + '?name=small'"
                class="d-flex"
                height="360"
                @click="showModal(tw.extended_entities.media)"
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
            </v-carousel-item>
          </v-carousel>
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
                <v-btn
                  icon
                  @click="doPushFav(tw.id_str, myFavs.some(v => v === tw.id_str))"
                  :color="myFavs.some(v => v === tw.id_str) ? 'pink' : ''"
                >
                  <v-icon
                    small
                  >
                    mdi-heart
                  </v-icon>
                </v-btn>
                <span class="caption mr-2" v-text="tw.favorite_count"></span>
                <!-- <span class="mr-1"></span>
                <v-btn icon @click="doPushRetweet(tw.id_str)">
                  <v-icon
                    class="mr-1"
                    small
                  >
                    mdi-twitter-retweet
                  </v-icon>
                </v-btn>
                <span class="caption" v-text="tw.retweet_count"></span> -->
              </v-row>
            </v-list-item>
          </v-card-actions>
        </v-card>
      </v-col>
      <infinite-loading v-if="isPageNation" @infinite="infiniteHandler"></infinite-loading>
    </v-row>
    <OriginalImageDialog ref="modal"></OriginalImageDialog>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
      userIds: [],
      myGroups: [],
      myFavs: [],
      groupInnerUsers:[],
      tweets: [],
      show: false,
      maxId: null,
      isPageNation: false,
      isLoading: true
    };
  },
  async mounted() {
    this.isLoading = true
    const firestore = firebase.firestore()
    // get my group 
    await firestore
      .collection('users')
      .doc(this.$store.getters.userTw.data.id_str)
      .get()
      .then((documentSnapshot) => {
        documentSnapshot.data().list_ids.forEach(id => {
          this.myGroups.push({
            id: id,
            state: false
          })
        })
      })

    // get group inner user
    await firestore
      .collection('lists')
      .where('list_id', 'in', this.myGroups.map(v => v.id))
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.groupInnerUsers.push(...doc.data().members)
        })
      })

    // initial group tweet data
    for (const user of this.groupInnerUsers) {
      const param = {
        user_id: user,
        count: 40
      }
      await this.fetchDataNoPageNation(param)
        .then((res) => {
          this.tweets.push(...res.data);
        })
    }

    // initial tweet distinct
    const tmp = this.tweets.reduce((acc, cur, index) => {
      if (acc.length === 0) {
        acc.push(cur)
      } else if (!acc.some(v => v.id_str === cur.id_str)) {
        acc.push(cur)
      }
      return acc
    }, [])
    this.tweets = tmp

    // initial group tweet tweetid min, max
    const min = this.tweets.reduce((a, b) => a.id > b.id ? b : a).id_str
    const max = this.tweets.reduce((a, b) => a.id > b.id ? a : b).id_str

    // my tweet data
    const param = {
      user_id: this.$store.getters.userTw.data.id_str,
      since_id: min,
      max_id: max,
      count: 200
    }
    await this.fetchDataNoPageNation(param)
      .then((res) => {
        this.myFavs.push(...res.data.map(v => v.id_str));
      })
    this.isLoading = false
  },
  methods: {
    infiniteHandler($state) {
      this.fetchData(this.$store.getters.userTw.data.id_str)
        .then((res) => {
          this.maxId = res.data[res.data.length - 1].id
          res.data.pop
          this.tweets.push(...res.data);
          $state.loaded();
        })
    },
    async fetchData(userId) {
      const count = 50
      let params = {
          endpoint: "favorites/list",
          access_token: this.$store.getters.userTwAcessToken,
          token_secret: this.$store.getters.userTwTokenSecret,
          param: {
            user_id: screenName,
            count: count + 1
          }
      }
      // すでにデータが存在
      if (this.tweets.length > 0) {
        params.param['max_id'] = this.maxId
      }
      return axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: params
      })
    },
   async fetchDataNoPageNation(param) {
      let params = {
          endpoint: "favorites/list",
          access_token: this.$store.getters.userTwAcessToken,
          token_secret: this.$store.getters.userTwTokenSecret,
          param: param
      }
      return axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: params
      })
    },
    filterOnlyImageAndSort() {
      return this.tweets.filter((v) => {
        return (v.entities.media) && v.entities.media.length > 0
      }).sort((a, b) => {
        if (new Date(a.created_at).getTime() < new Date(b.created_at).getTime()) {
          return 1
        } else if (new Date(a.created_at).getTime() > new Date(b.created_at).getTime()) {
          return -1
        } else {
          return 0
        } 
      })
    },
    showModal(media) {
      this.$refs.modal.showModal(media)
    },
    async doPushFav(tweetId, state) {
      console.log(`doPushFav tweetid => ${tweetId}`)
      if (!state) {
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call/post`, {
          params: {
            endpoint: "favorites/create",
            access_token: this.$store.getters.userTwAcessToken,
            token_secret: this.$store.getters.userTwTokenSecret,
            param: {
              id: tweetId
            }
          }
        })
        this.myFavs.push(tweetId)
      } else {
        await axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call/post`, {
          params: {
            endpoint: "favorites/destroy",
            access_token: this.$store.getters.userTwAcessToken,
            token_secret: this.$store.getters.userTwTokenSecret,
            param: {
              id: tweetId
            }
          }
        })
        this.myFavs = this.myFavs.filter(v => {
          return v !== tweetId
        })
      }
    },
    // async doPushRetweet(tweetId) {
    //   console.log(`doPushRetweet tweetid => ${tweetId}`)
    // },
  }
};
</script>

<style scoped>
.tw-card {
  margin-top: 4px;
}
</style>
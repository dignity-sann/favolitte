<template>
  <div>
    <v-row>
      <v-tabs
        v-model="tab"
        background-color="blue lighten-4"
        grow
      >
        <v-tab
          v-for="list in myLists"
          :key="list.list_id"
          @click="listChanged(list.list_id)"
        >
          {{ list.name }}
        </v-tab>
      </v-tabs>
    </v-row>
    <v-row v-if="isLoading">
      <v-col
        lg='2' md='3' sm='6' xs='12'
        v-for="(i) in 15"
        class="d-flex child-flex"
        :key="i"
      >
      <v-skeleton-loader
        class="mx-auto"
        type="card-avatar"
        max-height="530"
      ></v-skeleton-loader>
      </v-col>
    </v-row>
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
              <v-skeleton-loader
                type="image"
                height="360"
                class="d-flex"
              ></v-skeleton-loader>
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
                  <v-skeleton-loader
                    type="image"
                    height="360"
                    class="d-flex"
                  ></v-skeleton-loader>
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
                  :color="myFavs.some(v => v === tw.id_str) ? 'yellow' : ''"
                >
                  <v-icon
                    small
                  >
                    mdi-star
                  </v-icon>
                </v-btn>
                <span class="caption mr-2" v-text="tw.favorite_count"></span>
                <span class="mr-1"></span>
                <v-btn icon @click="doPushRetweet(tw.id_str)">
                  <v-icon
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
    </v-row>
    <OriginalImageDialog ref="modal"></OriginalImageDialog>
  </div>
</template>

<script>
import axios from "axios";
import firebase from '@/firebase.ts'
import OriginalImageDialog from '@/components/parts/OriginalImageDialog.vue';

export default {
  name: 'FavSummery',
  components: {
    OriginalImageDialog
  },
  data() {
    return {
      tab: '',
      activeList: '',
      myLists: [],
      myFavs: [],
      tweets: [],
      tabCache: [],
      isLoading: true,
    };
  },
  async mounted() {
    this.isLoading = true
    try {
      const firestore = firebase.firestore()
      // get my listids
      let myListids = []
      await firestore
        .collection('users')
        .doc(this.$store.getters.userTw.data.id_str)
        .get()
        .then((documentSnapshot) => {
          myListids = documentSnapshot.data().list_ids
        })
      if (myListids.length <= 0){
        this.$emit('showMessage', {
          message: 'acctive watch List empty.',
          color: 'error'
        })
        return false
      }

      // get my groups
      await firestore
        .collection('lists')
        .where('list_id', 'in', myListids)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.myLists.push(doc.data())
          })
        })
      if (this.myLists.length <= 0){
        this.$emit('showMessage', {
          message: 'Favorite List not found. ',
          color: 'error'
        })
        return false
      }

      // first get
      this.activeList = this.myLists.find(() => true)
      this.tab = this.activeList.list_id
      // initial group tweet data
      let tweetData = []
      for (const member of this.activeList.members) {
        if (!member) {
          continue
        }
        if (member === this.$store.getters.userTw.data.id_str) {
          continue
        }
        const param = {
          user_id: member,
          count: 40
        }
        await this.fetchDataNoPageNation(param)
          .then((res) => {
            tweetData.push(...res.data);
          })
      }
      // initial tweet distinct
      const tmp = tweetData.reduce((acc, cur, index) => {
        if (acc.length === 0) {
          acc.push(cur)
        } else if (!acc.some(v => v.id_str === cur.id_str)) {
          acc.push(cur)
        }
        return acc
      }, [])
      this.tweets = tmp
      // cache
      this.tabCache.push({
        tab: this.activeList.list_id,
        data: this.tweets
      })
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
      this.fetchDataNoPageNation(param)
        .then((res) => {
          this.myFavs.push(...res.data.map(v => v.id_str));
        })
    } finally {
      this.isLoading = false
    } 
  },
  methods: {
    async listChanged(listId) {
      try {
        if (this.activeList.list_id === listId) {
          return false
        }
        if (this.tabCache.some(v => v.tab === listId)) {
          this.activeList = this.myLists.find(v => v.list_id === listId)
          this.tweets = this.tabCache.find(v => v.tab === listId).data
          return true
        }
        // active get
        this.activeList = this.myLists.find(v => v.list_id === listId)
        this.isLoading = true
        this.myFavs = []
        this.tweets = []
        // initial group tweet data
        let tweetData = []
        for (const member of this.activeList.members) {
          if (!member) {
            continue
          }
          if (member === this.$store.getters.userTw.data.id_str) {
            continue
          }
          const param = {
            user_id: member,
            count: 40
          }
          await this.fetchDataNoPageNation(param)
            .then((res) => {
              tweetData.push(...res.data);
            })
        }
        // initial tweet distinct
        const tmp = tweetData.reduce((acc, cur, index) => {
          if (acc.length === 0) {
            acc.push(cur)
          } else if (!acc.some(v => v.id_str === cur.id_str)) {
            acc.push(cur)
          }
          return acc
        }, [])
        this.tweets = tmp
        // cache
        this.tabCache.push({
          tab: this.activeList.list_id,
          data: this.tweets
        })
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
      } finally {
        this.isLoading = false
      } 
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
    async doPushRetweet(tweetId) {
      console.log(`doPushRetweet tweetid => ${tweetId}`)
    },
  }
};
</script>
<style scoped>

</style>
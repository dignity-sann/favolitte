<template>
  <v-container>
    <!-- top section -->
    <v-row>
      <v-col cols="12">
        <h2>Join FavList</h2>
        <p class='d-none d-md-flex'>Created groups for monitoring your favorites. Add your favorite users &#x1f389;</p>
      </v-col>
    </v-row>

    <v-btn
      outlined
      color="primary"
      @click="updateList()"
    >
      update
    </v-btn>
    <v-row>
      <v-col cols='6'>
        <div class="mt-4">
          <v-card class="mx-auto" outlined>
            <v-list-item-group color="primary">
              <v-subheader>
                <v-icon class="mr-1">list</v-icon>Select FavList
              </v-subheader>
              <v-list-item
                v-for="group of selectGroups"
                :key="group.id"
              >
                <v-list-item-avatar>
                  <v-img :src="group.creater_profile_image_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="group.name"/>
                  <v-list-item-subtitle v-text="'creater @'.concat(group.creater_screen_name)"/>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row>
                    <v-btn icon @click="refMember(group)">
                      <v-icon color="green">mdi-layers-search</v-icon>
                    </v-btn>
                    <v-btn icon @click="joinedList(group)">
                      <v-icon color="error">mdi-plus</v-icon>
                    </v-btn>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-card>
        </div>
      </v-col>

      <v-col cols='6'>
        <div class="mt-4">
          <v-card class="mx-auto" outlined>
            <v-list-item-group color="primary">
              <v-subheader>
                <v-icon class="mr-1">list</v-icon>Joined FavList
              </v-subheader>
              <v-list-item
                v-for="group of joinGroups"
                :key="group.id"
              >
                <v-list-item-avatar>
                  <v-img :src="group.creater_profile_image_url"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="group.name"/>
                  <v-list-item-subtitle v-text="'creater @'.concat(group.creater_screen_name)"/>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row>
                    <v-btn icon @click="refMember(group)">
                      <v-icon color="green">mdi-layers-search</v-icon>
                    </v-btn>
                    <v-btn icon @click="removedList(group)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-card>
        </div>
      </v-col>
      <v-col cols="12">
        <div class="mt-2">
          <v-card class="mx-auto" outlined>
            <v-list-item-group color="primary">
              <v-subheader>
                <v-icon class="mr-1">list</v-icon>Members
              </v-subheader>
              <v-list-item
                v-for="user of members"
                :key="user.id_str"
              >
                <v-list-item-avatar>
                  <v-img :src="user.profile_image_url"/>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="user.name"></v-list-item-title>
                  <v-list-item-subtitle v-text="'@'.concat(user.screen_name)"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import axios from "axios";
import firebase from '@/firebase.ts'

export default {
  name: 'JoinGroup',
  data() {
    return {
      joinGroups: [],
      selectGroups: [],
      members: [],
      isLoading: false,
    }
  },
  async mounted () {
    const firestore = firebase.firestore()
    // get my group
    let listIds = []
    await firestore
      .collection('users')
      .doc(this.$store.getters.userTw.data.id_str)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.data()) {
          listIds = documentSnapshot.data().list_ids
        }
      })

    // get joined group
    for (const listId of listIds) {
      await firestore
        .collection('lists')
        .doc(listId)
        .get()
        .then((documentSnapshot) => {
          this.joinGroups.push(documentSnapshot.data())
          this.joinGroups[this.joinGroups.length -1].id = listId
        })
    }
    let temp = []
    // get my group
    await firestore
      .collection('lists')
      .where('creater_id', '==', this.$store.getters.userTw.data.id_str)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
          temp.push(doc.data())
          temp[temp.length -1].id = doc.id
        })
      })
    // get public group
    await firestore
      .collection('lists')
      .where('is_public_list', '==', true)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
          temp.push(doc.data())
          temp[temp.length -1].id = doc.id
        })
      })
    // initial tweet distinct
    const tmp = temp.reduce((acc, cur, index) => {
      if (acc.length === 0) {
        acc.push(cur)
      } else if (!acc.some(v => v.id === cur.id)) {
        acc.push(cur)
      }
      return acc
    }, [])
    this.selectGroups = tmp
  },
  methods: {
    joinedList: function (group) {
      if (this.joinGroups.some(v => v.id === group.id)) {
        this.$emit('showMessage', {
          message: 'Already exists at destination.',
          color: 'error'
        })
        return false
      }
      this.joinGroups.push(group)
    },
    removedList: function (group) {
      this.joinGroups.splice(this.joinGroups.findIndex(v => v.id === group.id), 1)
    },
    refMember: async function (group) {
      this.isLoading = true
      try {
        // get group inner user
        let twitterIds = group.members
        if (twitterIds.length > 0) {
          // get twitter user info 
          await this.fetchTwitterUserDatas(twitterIds)
            .then((res) => {
              this.members = res.data;
            })
        }
      } finally {
        this.isLoading = false
      }
    },
    updateList: async function() {
      if (this.joinGroups.length <= 0) {
        this.$emit('showMessage', {
          message: 'list must be more than 1.',
          color: 'error'
        })
        return false
      }
      let pushData = {
        list_ids: this.joinGroups.map(v => v.id)
      }
      const firestore = firebase.firestore()
      await firestore
        .collection('users')
        .doc(this.$store.getters.userTw.data.id_str)
        .set(pushData)
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
    fetchTwitterUserDatas: async function (userIds) {
      const params = {
          endpoint: "users/lookup",
          access_token: this.$store.getters.userTwAcessToken,
          token_secret: this.$store.getters.userTwTokenSecret,
          param: {
            user_id: userIds.join(',')
          }
      }
      return axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: params
      })
    },
  },
};
</script>

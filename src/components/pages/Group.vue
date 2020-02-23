<template>
  <v-container>
    <!-- top section -->
    <v-row>
      <v-col cols="12">
        <h1>Group Maintenace</h1>
        <p class='d-none d-md-flex'>Create groups for monitoring your favorites. Add your favorite users &#x1f389;</p>
      </v-col>
    </v-row>

    <!-- exists group list on left section -->
    <v-row>
      <v-col
        md='6' xs='12'
      >
        <v-row>
          <v-col cols="6">
            <h3>Group</h3>
          </v-col>
          <v-col cols="6">
            <div class="text-right">
              <v-chip
                class="ma-2"
                label
                disabled
              >
                {{ (group.id.value) ? 'update' : 'regist' }}
              </v-chip>
            </div>
          </v-col>
        </v-row>
        <v-form
          ref="form"
          v-model="group.valid"
          lazy-validation
        >
          <v-text-field
            label="Name"
            v-model="group.name.value"
            :rules="group.name.rules"
            :counter="group.name.maxLength"
            :error-messages="group.name.error"
            required
          ></v-text-field>
          <v-textarea
            label="Description"
            class="mt-2"
            outlined
            v-model="group.desc.value"
            :rules="group.desc.rules"
            :error-messages="group.desc.error"
            :counter="group.desc.maxLength"
          ></v-textarea>
          <v-row>
            <v-col class="texr-left">
              <v-btn
                fab small
                class="mx-2"
                color="info"
                @click="resetGroup"
              >
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            <v-col class="text-right">
              <v-btn
                fab small
                class="mx-2"
                color="error"
                :disabled="!(group.id.value)"
                @click="removeGroup"
              >
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
              <v-btn
                fab small
                class="mx-2"
                color="primary"
                @click="updateGroup"
              >
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>

      <v-col
        md='6' xs='12'
      >
        <v-row>
          <!-- add group form on right section -->
          <v-col cols="12">
            <h3>
              <v-icon class="mr-1">list</v-icon>Groups
            </h3>
            <div class="mt-4">
              <v-card class="mx-auto" tile>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="group of groups"
                    :key="group.id"
                    @click="open(group)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ group.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ group.desc }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-card>
            </div>
          </v-col>
          <!-- add group form on right section -->
          <v-col cols="12">
            <h3>
              <v-icon class="mr-1">list</v-icon>Users
            </h3>
            <div class="mt-4">
              <v-card class="mx-auto" tile>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="user of group.users"
                    :key="user.id_str"
                  >
                    <v-list-item-avatar>
                      <v-img
                        :src="user.profile_image_url"
                      >
                      </v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title v-text="user.name"></v-list-item-title>
                      <v-list-item-subtitle v-text="'@'.concat(user.screen_name)"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn icon>
                        <v-icon color="error">mdi-delete</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-card>
            </div>
          </v-col>
        </v-row>
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
  name: 'Group',
  data() {
    return {
      group: {
        valid: true,
        id: {
          value: ''
        },
        name: {
          value: '',
          maxLength: 20,
          rules: [
            v => !!v || "Name is required",
            v => (v && v.length <= 20) || `Description must be less than 20 characters`
          ],
          error: ''
        },
        desc: {
          value: '',
          maxLength: 120,
          rules: [
            v =>  {
              if (v) {
                (v.length <= 120) || `Description must be less than 120 characters`
              }
            }
          ],
          error: ''
        },
        users: [],
      },
      groups: [],
      isLoading: false
    };
  },
  async mounted () {
    const firestore = firebase.firestore()
    // get group
    await firestore
      .collection('groups')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {  
          this.groups.push(doc.data())
          this.groups[this.groups.length -1].id = doc.id
        })
      })
  },
  methods: {
    updateGroup: async function() {
      if (this.$refs.form.validate()) {
        let pushData = {
          name: this.group.name.value,
          desc: this.group.desc.value
        }
        const firestore = firebase.firestore()
        if (this.group.id.value) {
          await firestore
            .collection('groups')
            .doc(this.group.id.value)
            .set(pushData)
          this.groups.find(v => v.id === this.group.id.value).name = pushData.name
          this.groups.find(v => v.id === this.group.id.value).desc = pushData.desc
        } else {
          await firestore
            .collection('groups')
            .add(pushData)
            .then(doc => {
              pushData.id = doc.id
            })
          this.groups.push(pushData)
        }
        this.$refs.form.reset()
        this.group.id.value = ''
        this.group.name.value = ''
        this.group.desc.value = ''
        this.group.users = []
        this.$emit('showMessage', {
          message: 'Success.',
          color: 'success'
        })
      }
    },
    removeGroup: async function () {
      const firestore = firebase.firestore()
      await firestore
        .collection('groups')
        .doc(this.group.id.value)
        .delete()
      this.groups.splice(this.groups.findIndex(v => v.id === this.group.id.value), 1)
      this.$refs.form.reset()
      this.group.id.value = ''
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
    resetGroup: function () {
      this.$refs.form.reset()
      this.group.id.value = ''
      this.group.name.value = ''
      this.group.desc.value = ''
      this.group.users = []
    },
    open: async function(group) {
      this.isLoading = true
      try {
        const firestore = firebase.firestore()
        this.group.id.value = group.id
        this.group.name.value = group.name
        this.group.desc.value = group.desc
        this.group.users = []
        // get group inner user
        let twitterIds = []
        await firestore
          .collection('users')
          .where('groups', 'array-contains', group.id)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              twitterIds.push(doc.id)
            })
          })
        // get twitter user info 
        await this.fetchTwitterUserDatas(twitterIds)
          .then((res) => {
            this.group.users = res.data;
          })
      } finally {
        this.isLoading = false
      }
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

<template>
  <v-container>
    <!-- top section -->
    <v-row>
      <v-col cols="12">
        <h2>Create Watch FavList</h2>
        <p class='d-none d-md-flex'>Create groups for monitoring your favorites. Add your favorite users &#x1f389;</p>
      </v-col>
    </v-row>

    <!-- exists group list on left section -->
    <v-stepper v-model="currentStep">
      <v-stepper-header>
        <v-stepper-step step="1" editable>
          Select or Create FavList
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="2" :editable="!!(group.id.value) || (!(group.id.value) && currentStep > 2)" :rules="[() => group.valid]">
          FavList Settings
          <small v-if="!group.valid">form input invalid</small>
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3" :editable="!!(group.id.value)" :rules="[() => group.step3_valid]">
          FavList Assign Member
          <small v-if="!group.step3_valid">user must be more than 1</small>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-btn
            outlined
            color="primary"
            @click="createGroup()"
          >
            Create
          </v-btn>
          <div class="mt-4">
            <v-card class="mx-auto" outlined>
              <v-list-item-group color="primary">
                <v-subheader>
                  <v-icon class="mr-1">list</v-icon>FavList
                </v-subheader>
                <v-list-item
                  v-for="group of groups"
                  :key="group.id"
                >
                  <v-list-item-avatar>
                    <v-img :src="group.creater_profile_image_url"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content @click="openGroup(group)">
                    <v-list-item-title v-text="group.name"/>
                    <v-list-item-subtitle v-text="'creater @'.concat(group.creater_screen_name)"/>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="removeConfirm(group.id)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-card>
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-form
            ref="form"
            v-model="group.valid"
            lazy-validation
          >
            <v-text-field
              label="FavList Name"
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
            <v-checkbox
              label="PublicList"
              class="ml-2"
              :disabled="group.creater_id.value !== $store.getters.userTw.data.id_str"
              outlined
              v-model="group.isPublicList.value"
              :rules="group.isPublicList.rules"
              :error-messages="group.isPublicList.error"
            ></v-checkbox>
            <v-btn
              outlined
              color="primary"
              @click="assignMember()"
            >
              Assign Member
            </v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="mt-2">
            <v-autocomplete
              :loading="isSugestLoading"
              :search-input.sync="sugestInput"
              hide-no-data
              hide-selected
              label="Twitter User Search"
              placeholder="User Search Query..."
              prepend-icon="mdi-twitter"
              return-object
            ></v-autocomplete>
            <v-expand-transition>
              <v-list v-if="twSearchUsers.length > 0">
                <v-list-item
                  v-for="(searchUser, i) in twSearchUsers" :key="i"
                >
                  <v-list-item-avatar>
                    <v-img :src="searchUser.profile_image_url"/>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="searchUser.name"></v-list-item-title>
                    <v-list-item-subtitle v-text="'@'.concat(searchUser.screen_name)"></v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="() => group.users.push(searchUser)">
                      <v-icon color="success">mdi-plus</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-expand-transition>
          </div>
          <div class="mt-2">
            <v-card class="mx-auto" outlined>
              <v-list-item-group color="primary">
                <v-subheader>
                  <v-icon class="mr-1">list</v-icon>Members
                </v-subheader>
                <v-list-item
                  v-for="user of group.users"
                  :key="user.id_str"
                >
                  <v-list-item-avatar>
                    <v-img :src="user.profile_image_url"/>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-text="user.name"></v-list-item-title>
                    <v-list-item-subtitle v-text="'@'.concat(user.screen_name)"></v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon @click="() => group.users.splice(group.users.findIndex(v => v.id_str === user.id_str), 1)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-card>
            <v-btn
              class="mt-4"
              color="primary"
              outlined
              @click="updateGroup()"
              v-text="`update`"
            />
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <v-dialog
      v-model="isRemoveConfirm"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline"
          primary-title
        >
          Remove List ?
        </v-card-title>
        <v-card-text v-text="'Delete list? Deleting cannot be undone!'"/>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            class="gray"
            outlined
            @click="isRemoveConfirm = false, tempRemoveListId = ''"
            v-text="`cansel`"
          />
          <v-btn
            color="red"
            outlined
            @click="removeGroup(tempRemoveListId)"
            v-text="`remove`"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        step3_valid: true,
        creater_id: {
          value: ''
        },
        creater_screen_name: {
          value: ''
        },
        creater_profile_image_url: {
          value: ''
        },
        id: {
          value: ''
        },
        name: {
          value: '',
          maxLength: 20,
          rules: [
            v => !!v || "FavList Name is required",
            v => (v && v.length <= 20) || `FavList Name must be less than 20 characters`
          ],
          error: ''
        },
        desc: {
          value: '',
          maxLength: 120,
          rules: [
            true
          ],
          error: ''
        },
        isPublicList: {
          value: false,
          rules: [
            v =>  {
              return true
            }
          ],
          error: ''
        },
        users: [],
      },
      groups: [],
      isLoading: false,
      currentStep: 1,
      twSearchUsers: [],
      isSugestLoading: false,
      sugestInput: '',
      isRemoveConfirm: false,
      tempRemoveListId: ''
    };
  },
  watch: {
    sugestInput (val) {
      // reset
      this.twSearchUsers = []
      // val empty
      if (!val) return

      // Items have already been requested
      if (this.isSugestLoading) return

      this.isSugestLoading = true
  
      // Lazily load input items
      this.searchTwitterUserDatas(val)
        .then((res) => {
          this.twSearchUsers = res.data;
        })
        .finally(() => {
          this.isSugestLoading = false
        })
    },
  },
  async mounted () {
    const firestore = firebase.firestore()
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
    this.groups = tmp
  },
  methods: {
    removeConfirm: function (id) {
      this.tempRemoveListId = id
      this.isRemoveConfirm = true
    },
    updateGroup: async function() {
      if (!this.$refs.form.validate()) {
        return false
      }
      if (this.group.users.length <= 0) {
        this.group.step3_valid = false
        return false
      }
      this.group.step3_valid = true
      let pushData = {
        name: this.group.name.value,
        desc: this.group.desc.value,
        members: this.group.users.map(v => v.id_str),
        is_public_list: this.group.isPublicList.value,
        updater_id: this.$store.getters.userTw.data.id_str,
        updater_screen_name: this.$store.getters.userTw.data.screen_name,
        updater_profile_image_url: this.$store.getters.userTw.data.profile_image_url,
        creater_id: this.group.creater_id.value,
        creater_screen_name: this.group.creater_screen_name.value,
        creater_profile_image_url: this.group.creater_profile_image_url.value,
      }
      const firestore = firebase.firestore()
      if (this.group.id.value) {
        await firestore
          .collection('lists')
          .doc(this.group.id.value)
          .set(pushData)
        this.groups.find(v => v.id === this.group.id.value).name = pushData.name
        this.groups.find(v => v.id === this.group.id.value).desc = pushData.desc
        this.groups.find(v => v.id === this.group.id.value).isPublicList = pushData.is_public_list
      } else {
        await firestore
          .collection('lists')
          .add(pushData)
          .then(doc => {
            pushData.id = doc.id
          })
        this.groups.push(pushData)
      }
      this.$refs.form.reset()
      this.group.creater_id.value = ''
      this.group.creater_screen_name.value = ''
      this.group.creater_profile_image_url.value = ''
      this.group.id.value = ''
      this.group.name.value = ''
      this.group.desc.value = ''
      this.group.isPublicList.value = false
      this.group.users = []
      this.currentStep = 1
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
    removeGroup: async function (id) {
      this.tempRemoveListId = ''
      this.isRemoveConfirm = false
      const firestore = firebase.firestore()
      await firestore
        .collection('lists')
        .doc(id)
        .delete()
      this.groups.splice(this.groups.findIndex(v => v.id === id), 1)
      this.$refs.form.reset()
      this.group.creater_id.value = ''
      this.group.creater_screen_name.value = ''
      this.group.creater_profile_image_url.value = ''
      this.group.id.value = ''
      this.group.name.value = ''
      this.group.desc.value = ''
      this.group.isPublicList.value = false
      this.group.users = []
      this.currentStep = 1
      this.$emit('showMessage', {
        message: 'Success.',
        color: 'success'
      })
    },
    openGroup: async function(group) {
      this.group.creater_id.value = group.creater_id
      this.group.creater_screen_name.value = group.creater_screen_name
      this.group.creater_profile_image_url.value = group.creater_profile_image_url
      this.group.id.value = group.id
      this.group.name.value = group.name
      this.group.desc.value = group.desc
      this.group.isPublicList.value = group.is_public_list
      this.group.users = []
      this.isLoading = true
      try {
        // get group inner user
        let twitterIds = group.members
        if (twitterIds.length > 0) {
          // get twitter user info 
          await this.fetchTwitterUserDatas(twitterIds)
            .then((res) => {
              this.group.users = res.data;
            })
        }
      } finally {
        this.isLoading = false
      }
      this.currentStep = 2
    },
    createGroup: function() {
      this.$refs.form.reset()
      this.group.creater_id.value = this.$store.getters.userTw.data.id_str
      this.group.creater_screen_name.value = this.$store.getters.userTw.data.screen_name
      this.group.creater_profile_image_url.value = this.$store.getters.userTw.data.profile_image_url
      this.group.id.value = ''
      this.group.name.value = ''
      this.group.desc.value = ''
      this.group.isPublicList.value = false
      this.group.users = []
      this.currentStep = 2
    },
    assignMember: async function() {
      this.currentStep = 3
    },
    searchTwitterUserDatas: async function (query) {
      const params = {
          endpoint: "users/search",
          access_token: this.$store.getters.userTwAcessToken,
          token_secret: this.$store.getters.userTwTokenSecret,
          param: {
            q: query,
            count: 5
          }
      }
      return axios.get(`${process.env.VUE_APP_API_BASE_URL}/twitter/api/call`, {
        params: params
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

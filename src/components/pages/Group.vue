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
      <v-col cols="6">
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
        </v-form>
        <v-row>
          <v-col class="text-left">
            <v-btn
              class="primary ma-2"
              @click="resetGroup"
              :rounded="true"
            >
              reset
            </v-btn>          
          </v-col>
          <v-col class="text-right">
            <v-btn
              class="primary ma-2"
              @click="updateGroup"
              :rounded="true"
            >
              update
            </v-btn>          
            <v-btn
              class="error ma-2"
              @click="removeGroup"
              :rounded="true"
              :disabled="!(group.id.value)"
            >
              remove
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <!-- add group form on right section -->
      <v-col cols="6">
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
    </v-row>
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
            v => (v && v.length <= 120) || `Description must be less than 120 characters`
          ],
          error: ''
        },
      },
      groups: []
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
    },
    open: function(group) {
      this.group.id.value = group.id
      this.group.name.value = group.name
      this.group.desc.value = group.desc
    }
  },
};
</script>

<template>
  <v-container>
    <!-- top section -->
    <v-row>
      <v-col cols="12">
        <h1>Manage - group</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro, quas voluptas ea id aut sit voluptates debitis ratione eum facilis?</p>
        <p>Tempore quidem alias tempora neque fugit quia eius magni ea itaque suscipit repudiandae odit debitis in animi, explicabo voluptates error minima enim incidunt perspiciatis sit vitae nesciunt. Quas vel nobis eum est et eaque molestiae alias a nam, maiores quisquam quibusdam delectus non totam debitis hic eos harum, maxime illum rem omnis atque accusamus perspiciatis. Aliquid quisquam aliquam delectus rerum voluptatibus voluptatum quod similique numquam saepe fuga, doloribus sed iure cum ipsam.</p>
      </v-col>
    </v-row>

    <!-- exists group list on left section -->
    <v-row>
      <v-col cols="6">
        <h3>Create group</h3>
        <form>
          <v-text-field
            v-model="groupName"
            label="Group name"
            :error-messages="errors.groupName"
            :counter="20"
            required
          ></v-text-field>
          <v-textarea
            outlined
            v-model="groupDesc"
            label="Description"
            :error-messages="errors.groupDesc"
            :counter="120"
            class="mt-2"
          ></v-textarea>
          <v-btn class="primary" @click="addGroup" :rounded="true">create</v-btn>
        </form>
      </v-col>

      <!-- add group form on right section -->
      <v-col cols="6">
        <h3><v-icon>list</v-icon> Groups</h3>
        <div class="mt-4">
          <v-card class="mx-auto" tile>
            <v-list-item v-for="group of groups" :key="group.id">
              <v-list-item-content>
                <v-list-item-title>{{group.name}}</v-list-item-title>
                <v-list-item-subtitle>{{group.desc}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      groupName: "",
      groupDesc: "",
      errors: {
        groupName: "",
        groupDesc: ""
      },
      groups: [
        {
          id: 1,
          name: "Momiyade group",
          desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
        },
        {
          id: 2,
          name: "Shiomi group",
          desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
        },
        {
          id: 3,
          name: "Frederica group",
          desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
        },
        {
          id: 4,
          name: "Ichinose group",
          desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
        },
        {
          id: 5,
          name: "Jogasaki group",
          desc: "Lorem ipsum dolor sit amet consectetur, adipisicing elit."
        }
      ]
    };
  },
  methods: {
    addGroup: function() {
      const id = this.groups.length + 1;
      this.groups.push({id:id, name:this.groupName, desc:this.groupDesc})
      this.groupName = ""
      this.groupDesc = ""
    }
  }
};
</script>

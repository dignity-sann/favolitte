<template>
  <v-dialog
    v-model="dialog"
  >
    <v-card class="d-flex">
      <v-img
        :src="imageUrl"
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
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        imageUrl: '',
      }
    },
    methods: {
      showModal (imageUrl) {
        this.dialog = true
        this.imageUrl = imageUrl
      }
    }
  }
</script>
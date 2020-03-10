<template>
  <v-dialog
    v-model="dialog"
    scrollable
  >
      <v-img
        v-if="medias.length === 1"
        :src="medias[0].media_url"
        contain
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
        v-if="medias.length > 1"
      >
        <v-carousel-item
          v-for="(media, index) in medias" :key="index"
          tag="div"
          :src="media.media_url"
          contain
        >
        </v-carousel-item>
      </v-carousel>
  </v-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
        medias: [],
      }
    },
    methods: {
      showModal (medias) {
        this.dialog = true
        this.medias = medias
      }
    }
  }
</script>

<style scoped>

</style>
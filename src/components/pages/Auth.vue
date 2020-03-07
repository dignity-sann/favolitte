<template>
  <v-overlay :value="true">
    <v-progress-circular indeterminate size="64"></v-progress-circular>
  </v-overlay>
</template>
<script>
import firebase from '@/firebase.ts'

export default {
  name: 'Auth',
  data() {
    return {
    }
  },
  async mounted() {
    await firebase.signin()
    console.log(this.$route.query.redirect)
    this.$router.push(this.$route.query.redirect)
  }
}
</script>

<style scoped>
</style>
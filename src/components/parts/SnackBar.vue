<template>
  <div class="text-center">
    <v-snackbar
      :color="color ? color : 'info'"
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ showMessage }}
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    name: 'SnackBar',
    props: [
      'message',
      'color',
      'dummy'
    ],
    data () {
      return {
        snackbar: false,
        timeout: 5000,
      }
    },
    computed: {
      showMessage: function () {
        return this.message
      },
      showToggle: function () {
        return this.dummy
      }
    },
    watch: {
      showToggle: function () {
        this.snackbar = true
      }
    }
  }
</script>

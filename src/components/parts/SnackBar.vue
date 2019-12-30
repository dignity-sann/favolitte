<template>
  <div class="text-center">
    <v-snackbar
      color="success"
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ message }}
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    name: 'SnackBar',
    data () {
      return {
        snackbar: false,
        timeout: 5000,
        message: ''
      }
    },
    methods: {
      showMessage (message) {
        this.snackbar = true
        this.message = message
      }
    }
  }
</script>

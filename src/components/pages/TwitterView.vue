<template>
  <div>
    <v-card class="mx-auto" max-width="344">
      <v-card-text>
        <div>Word of the Day</div>
        <p class="display-1 text--primary">be•nev•o•lent</p>
        <p>adjective</p>
        <div class="text--primary">
          well meaning and kindly.
          <br />"a benevolent smile"
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="deep-purple accent-4">Learn More</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  mounted () {
    axios
      .get('https://gist.githubusercontent.com/ne-peer/b00023de73a1c4c6789eb06231b60439/raw/mello-yello_member-list.json')
      .then(response => (console.log(response)))
  }
};
</script>

<style scoped>
</style>
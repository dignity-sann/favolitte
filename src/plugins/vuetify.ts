
// add Material Design Icons
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
// add Material Icons
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
});

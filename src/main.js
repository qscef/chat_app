import Vue from 'vue'
import Chatik from './Chatik.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(Chatik)
}).$mount('#app')

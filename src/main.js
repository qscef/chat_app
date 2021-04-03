import Vue from 'vue'
import Chatik from './Chatik.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Chatik),
}).$mount('#app')

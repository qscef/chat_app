import Vue from 'vue'
import VueRouter from "vue-router";
import Vuex from 'vuex';
import vuetify from './plugins/vuetify';
import routes from './routes.js'
import { store } from './store.js'

import Chatik from './Chatik.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history",
});

Vue.use(Vuex);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(Chatik)
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
 
export const store = new Vuex.Store({
  state: {
    settings: [],
    isOpennedMenu: false,
    user: null,
    countNewMessage: 0,
    alertMessage: null,
  },
   
  getters: {},
   
  mutations: {
    SET_SETTINGS: (state, settings) => {
      state.settings = settings;
    },
    SET_ISOPENNEDMENU: (state, payload) => {
      state.isOpennedMenu = payload;
    },
    SET_USER: (state, payload) => {
      state.user = payload;
    },
    SET_COUNTNEWMESSAGE: (state, payload) => {
      state.countNewMessage = payload;
    },
    SET_ALERTMESSAGE: (state, payload) => {
      state.alertMessage = payload;
    },
  },
   
  actions: {
    GET_SETTINGS: async (context) => {
      axios.post('https://nane.tada.team/api/settings')
        .then((response) => {
          context.commit('SET_SETTINGS', response.data.result)
        })
        .catch(error => {
          console.log(error);
        });
    },
    SET_ISOPENNEDMENU : (context, payload) => {
      context.commit('SET_ISOPENNEDMENU', payload)
    },
    SET_USER : (context, payload) => {
      context.commit('SET_USER', payload)
    },
    SET_COUNTNEWMESSAGE: (context, payload) => {
      context.commit('SET_COUNTNEWMESSAGE', payload)
    },
    SET_ALERTMESSAGE: (context, payload) => {
      context.commit('SET_ALERTMESSAGE', payload)
    }, 
  }
})
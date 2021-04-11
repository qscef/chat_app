import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex);
 
export const store = new Vuex.Store({
  state: {
    settings: [],
    isOpennedMenu: false,
  },
   
  getters: {
    ISOPENNEDMENU : () => {
      this.$store.getters.TODOS;
    }
  },
   
  mutations: {
    SET_SETTINGS: (state, settings) => {
      state.settings = settings;
    },
    SET_ISOPENNEDMENU: (state, payload) => {
      state.isOpennedMenu = payload;
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
          // add to vuex state errorMessage
          // this.showAlert(`Ошибка соединения с сервером ${error}`, 1500);
        });
    },
    SET_ISOPENNEDMENU : (context, payload) => {
      context.commit('SET_ISOPENNEDMENU', payload)
    },
  }
})
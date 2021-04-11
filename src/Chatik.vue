<template>
  <div id="app">
    <v-app id="inspire">
      <router-view @showAlert="showAlert($event)" /> 
      <div class="alert" v-if="alertMessage">
        <v-alert border="top" color="red lighten-2" dark>{{ alertMessage }}</v-alert>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'Chatik',
  created () {
    this.$store.dispatch('GET_SETTINGS');
    if (localStorage.getItem('chatikUser') !== null) {
      this.$store.dispatch('SET_USER', localStorage.getItem('chatikUser'));
    }
  },
  computed: {
    alertMessage () {
      return this.$store.state.alertMessage;
    },
  },
  watch: {
    alertMessage() {
      this.showAlert()
    }
  },
  methods: {
    showAlert() {
      setTimeout(() => { this.$store.dispatch('SET_ALERTMESSAGE', null) } , 1500);
    },
  },
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
  
  .v-application {
    font-family: 'Playfair Display', serif;
  }

  h1,h2,h3,h4,h5,h6 {
    font-family: 'Press Start 2P', cursive;
  }

  .alert {
    position: absolute;
    z-index: 2;
    right: 20px;
    bottom: 20px;
  }
</style>

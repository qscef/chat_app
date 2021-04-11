<template>
  <v-form class="authorization-container" @submit.prevent="authorization">
    <v-card class="authorization-container__block" max-width="400">
      <v-card-text>Залогинься чтобы пользоваться</v-card-text>
      <v-text-field label="login" placeholder="quest" filled v-model="user" autofocus></v-text-field>
      <div class="authorization-container__button">
        <v-btn elevation="3" color="primary" type="submit">
          Войти
        </v-btn>
      </div>
    </v-card>
  </v-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: null,
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings;
    },
  },
  methods: {
    authorization() {
      console.log('setting', this.settings)
      if (!this.user) {
        this.$emit('showAlert', { message: 'Логин не может быть пустым', time: 1500 });
      } else if (this.settings.max_username_length && this.user.length > this.settings.max_username_length) {
        this.$emit('showAlert', { message: `Логин не может быть больше ${this.settings.max_username_length} символов`, time: 1500 });
      } else {
        localStorage.setItem('chatikUser', this.user);
        this.$router.push({ name: 'chats', params: { user: this.user, settings: this.settings } })
      }
    },
  },
}
</script>

<style lang="scss">
  .authorization-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .authorization-container__block {
      width: 400px;
      height: 200px;
      padding: 10px 20px;
    }

    .authorization-container__button {
      display: flex;
      justify-content: center;
    }
  }
</style>
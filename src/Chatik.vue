<template>
  <div id="app">
    <v-app id="inspire">
      <div class="authorization-container" v-if="!userAuthorization">
        <v-card class="authorization-container__block" max-width="400">
          <v-card-text>Залогинься чтобы пользоваться</v-card-text>
          <v-text-field
            label="login"
            placeholder="quest"
            filled
            v-model="user"
          ></v-text-field>
          <div class="authorization-container__button">
            <v-btn elevation="3" color="primary" @click="authorization">
              Войти
            </v-btn>
          </div>
        </v-card>
      </div>
      <div class="main-container" v-else>
        <div class="left-sidebar-menu">
          <v-btn icon color="primary">
            <v-icon @click="isOpennedMenu=true">mdi-menu</v-icon>
          </v-btn>
        </div>
        <div class="left-sidebar-menu__openned" :class="isOpennedMenu ? 'open' : 'hidden'">
          <div class="left-sidebar-menu__close">
            <v-icon color="primary" @click="closeMenu">mdi-arrow-left-bold-outline </v-icon>
          </div>
          <div class="left-sidebar-menu__title">
            <h1 class="left-sidebar-menu__company-name">CHATIK 2.0</h1>
          </div>
          <div class="left-sidebar-menu__user">
            <div>Вы авторизованы как<span class="left-sidebar-menu__user-name">{{ user }}</span></div>
            <div class="left-sidebar-menu__logout" @click="logOut">Не ваш аккаунт?</div>
          </div>
          <span class="left-sidebar-menu__rooms-title">Комнаты:</span>
          <ul>
            <div class="left-sidebar-menu__rooms-container">
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
              <li>комната 1</li>
              <li>комната 2</li>
            </div>
          </ul>
          <v-btn block elevation="3" color="primary" class="left-sidebar-menu__new-rooms" @click="createNewRoom">
            Создать новую комнату
          </v-btn>
        </div>
        <div class="chat-container" @click="closeMenu">
          1
        </div>
      </div>
      <div class="alert" v-if="alertMessage">
        <v-alert border="top" color="red lighten-2" dark>{{ alertMessage }}</v-alert>
      </div>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'Chatik',
  data() {
    return {
      isOpennedMenu: false,
      user: null,
      alertMessage: null,
      userAuthorization: false,
    }
  },
  created() {
    if (localStorage.getItem('chatikUser') !== null) {
      this.user = localStorage.getItem('chatikUser');
      this.userAuthorization = true;
    }
  },
  methods: {
    closeMenu() {
      if (this.isOpennedMenu) 
        this.isOpennedMenu = false;
    },
    logOut() {
      this.userAuthorization = false;
      this.user = null;
      this.isOpennedMenu = false
      localStorage.removeItem('chatikUser');
    },
    authorization() {
      if (!this.user) {
        this.alertMessage = 'Логин не может быть пустым';
        setTimeout(() => { this.alertMessage = null } ,1500);
      } else {
        this.userAuthorization = true;
        localStorage.setItem('chatikUser', this.user);
      }
    },
    createNewRoom() {
      console.log('create new room');
    },
  },
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
  
  body {
    font-family: 'Playfair Display', serif;
  }

  h1,h2,h3,h4,h5,h6 {
    font-family: 'Press Start 2P', cursive;
  }

  $background-color: #d8f1f1;
  $background-accent-color: #aebfda;
  $title-color: #1a3e73;

  .authorization-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .authorization-container__block {
    width: 400px;
    height: 200px;
    padding: 10px 20px;
  }

  .authorization-container__button {
    display: flex;
    justify-content: center;
  }

  .main-container {
    position: relative;
    display: flex;
    height: 100%;
  }

  .left-sidebar-menu {
    display: flex;
    flex-direction: column;
    width: 70px;
    background: $background-color;
    align-items: center;
  }

  .left-sidebar-menu__openned {
    position: absolute;
    max-width: 500px;
    width: 30%;
    min-width: 400px;
    height: 100%;
    background: $background-color;
    padding: 30px;
    
    &.open {
      transition: all .8s ease-in-out;
      transform: translateX(0)
    }

    &.hidden {
      transition: all .8s ease-in-out;
      transform: translateX(-100%)
    }

    .left-sidebar-menu__close {
      position: absolute;
      top: 15px;
      right: 15px;
      cursor: pointer;
    }

    .left-sidebar-menu__title {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    .left-sidebar-menu__company-name {
      color: $title-color;
    }

    .left-sidebar-menu__user {
      margin-bottom: 10px;
    }

    .left-sidebar-menu__user-name {
      font-family: cursive;
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }

    .left-sidebar-menu__logout {
      text-decoration: underline;
      cursor: pointer;
      text-align: end;
    }

    .left-sidebar-menu__rooms-title {
      font-size: 20px;
      font-weight: bold;
    }

    .left-sidebar-menu__rooms-container {
      height: calc(100vh - 300px);
      overflow-y: auto;

      // firefox
      scrollbar-width: thin;
      scrollbar-color: $background-accent-color $background-color ;

      // Chrome/Edge/Safari
      &::-webkit-scrollbar {
        width: 12px;
      }
      &::-webkit-scrollbar-track {
        background: $background-color;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $background-accent-color;
        border-radius: 20px;
        border: 3px solid $background-color;
      }

      li {
        min-height: 30px;
        margin: 10px 0;
        padding: 0 20px;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid $background-accent-color;

        &:hover {
          background: $background-accent-color;
        }
      }
    }

    .left-sidebar-menu__new-rooms {
      margin-top: 40px;
    }
  }

  .chat-container {
    width: 100%;
  }

  .alert {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
</style>

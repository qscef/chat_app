<template>
  <div class="left-sidebar-menu-container">
    <div class="left-sidebar-menu">
      <div class="button-menu">
        <v-btn icon color="primary">
          <v-icon @click="$store.dispatch('SET_ISOPENNEDMENU', true)">mdi-menu</v-icon>
        </v-btn>
        <div class="notification-new-message" v-if="$store.state.countNewMessage > 0"></div>
      </div>
    </div>
    <div class="left-sidebar-menu__openned" :class="isOpennedMenu ? 'open' : 'hidden'">
      <div class="left-sidebar-menu__close">
        <v-icon color="primary" @click="$store.dispatch('SET_ISOPENNEDMENU', false)">mdi-arrow-left-bold-outline </v-icon>
      </div>
      <div class="left-sidebar-menu__title">
        <h1 class="left-sidebar-menu__company-name">CHATIK 2.1</h1>
      </div>
      <div class="left-sidebar-menu__user">
        <div>Вы авторизованы как
          <div class="left-sidebar-menu__user-name">
            <v-icon color="primary">mdi-account </v-icon> 
            {{ user }}
          </div>
        </div>
        <div class="left-sidebar-menu__logout" @click="logOut">Не ваш аккаунт?</div>
      </div>
      <span class="left-sidebar-menu__rooms-title">Комнаты:</span>
      <ul>
        <div class="left-sidebar-menu__rooms-container">
          <li @click="$router.push({ name: 'chat', params: { opennedRoom: room.name } })" v-for="room in rooms" :key="room.name">
            комната {{room.name}}
            <span class="notification-in-room" v-if="room.notification">{{ room.notification }}</span>
          </li>
        </div>
      </ul>
      <v-btn block elevation="3" color="primary" class="left-sidebar-menu__new-rooms" @click="$emit('createRoom')">
        Создать новую комнату
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rooms: { type: Array, default: () => [] },
  },
  computed: {
    isOpennedMenu() {
      return this.$store.state.isOpennedMenu;
    },
    settings() {
      return this.$store.state.settings;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch('SET_USER', null);
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      localStorage.removeItem('chatikUser');
      this.$router.push({ name: 'login', params: { settings: this.settings } })
    },
  },
}
</script>

<style lang="scss">
  $background-color: #9aceec;
  $title-color: #1a3e73;
  $background-accent-color: #204682;

  .left-sidebar-menu {
    display: flex;
    flex-direction: column;
    width: 70px;
    height: 100%;
    background: $background-color;
    align-items: center;

    .button-menu {
      position: relative;

      .notification-new-message {
        position: absolute;
        width: 7px;
        height: 7px;
        top: 7px;
        right: 7px;
        background: red;
        border-radius: 50%;
        animation: notification-new-message infinite 2s linear;
      }

      @keyframes notification-new-message {
        0% {
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    }
  }

  .left-sidebar-menu__openned {
    position: absolute;
    top: 0;
    left: 0;
    max-width: 500px;
    width: 30%;
    min-width: 400px;
    height: 100%;
    background: $background-color;
    padding: 30px;
    z-index: 1;
    
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
        position: relative;
        min-height: 30px;
        margin: 10px 0;
        padding: 0 20px;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid $background-accent-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          background: $background-accent-color;
          color: white;
        }

        .notification-in-room {
          font-family: "Roboto", sans-serif;
          position: absolute;
          right: 3px;
          top: 2px;
          font-size: 14px;
          font-weight: bold;
          color: white;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: notification-in-room infinite 1s linear;
        }

        @keyframes notification-in-room {
          0% {
            background: rgb(131, 90, 90);
          }
          50% {
            background: red;
          }
          100% {
            background: rgb(131, 90, 90);
          }
        }
      }
    }

    .left-sidebar-menu__new-rooms {
      margin-top: 40px;
    }
  }
</style>
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
              <li @click="connectToRoom(room.name)" v-for="room in rooms" :key="room.name">комната {{room.name}}</li>
            </div>
          </ul>
          <v-btn block elevation="3" color="primary" class="left-sidebar-menu__new-rooms" @click="createNewRoom">
            Создать новую комнату
          </v-btn>
        </div>
        <div class="chat-container" @click="closeMenu">
          <div class="chat-container__null" v-if="!messages">
            <span>Выберите существующую комнату или создайте свою, чтобы начать общение.</span>
          </div>
          <div class="chat-container__content" v-else>
            <div class="chat-container__title"> 
              <span>Вы в комнате:</span>
              <span class="chat-container__room-name">{{opennedRoom}} </span>
            </div>
            <div class="chat-container__messages">
              <div class="chat-container__message" v-for="message in messages" :key="message.created">
                <div class="message__icon">
                  <span class="message__icon-text">{{ message.sender.username[0] }}</span>
                </div>
                <div>
                  <div class="message__header">
                    <span class="message__user">{{ message.sender.username }}</span>
                    <span class="message__time">{{ messageDate(message.created) }}</span>
                  </div>
                  <div class="message__text">{{ message.text }}</div>
                </div>
              </div>
            </div>
            <div class="chat-container__controls">
              <div class="chat-container__textfield">
                 <v-text-field label="Сообщение" v-model="newMessage"></v-text-field>
              </div>
              <div class="chat-container__buttonSend">
                <v-btn elevation="3" color="primary">
                  Отправить
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="alert" v-if="alertMessage">
        <v-alert border="top" color="red lighten-2" dark>{{ alertMessage }}</v-alert>
      </div>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Chatik',
  data() {
    return {
      isOpennedMenu: false,
      user: null,
      alertMessage: null,
      userAuthorization: false,
      connection: null,
      rooms: null,
      settings: null,
      messages: null,
      newMessage: null,
      opennedRoom: null,
    }
  },
  created() {
    if (localStorage.getItem('chatikUser') !== null) {
      this.user = localStorage.getItem('chatikUser');
      this.userAuthorization = true;
      this.takeListRooms();
    }
    axios.post('https://nane.tada.team/api/settings')
        .then(response => (this.settings = response.data.result))
        .catch(error => {
          console.log(error);
          this.showAlert(`Ошибка соединения с сервером ${error}`, 1500);
        });
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
        this.showAlert('Логин не может быть пустым', 1500);
      } else if (this.settings.max_username_length && this.user.length > this.settings.max_username_length) {
        this.showAlert(`Логин не может быть больше ${this.settings.max_username_length} символов`, 1500);
      } else {
        this.userAuthorization = true;
        localStorage.setItem('chatikUser', this.user);
        this.takeListRooms();
      }
    },
    createNewRoom() {
      console.log('create new room');
    },
    takeListRooms() {
      axios.post('https://nane.tada.team/api/rooms')
        .then(response => (this.rooms = response.data.result))
        .catch(error => {
          console.log(error);
          this.showAlert(`Ошибка соединения с сервером ${error}`, 1500);
        });
    },
    connectToRoom(roomName) {
      this.isOpennedMenu = false;
      this.opennedRoom = roomName;
      axios.post(`https://nane.tada.team/api/rooms/${roomName}/history`)
        .then(response => {
          this.messages = response.data.result
          // скролим чат к самому новому сообщению но после обновления dom
          this.$nextTick(function () {
            let block = document.querySelector(".chat-container__messages");
            block.scrollTop = block.scrollHeight;
          })
        })
        .catch(error => {
          console.log(error);
          this.showAlert(`Ошибка соединения с сервером ${error}`, 1500);
        });
    },
    messageDate(date) {
      const temp = new Date (date);
      return `${temp.getHours() < 10 ? '0' + temp.getHours(): temp.getHours()}:${temp.getMinutes() < 10 ? '0' + temp.getMinutes(): temp.getMinutes()} ${temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate() }.${temp.getMonth() < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth() + 1}.${temp.getFullYear()} `;
    },
    sendMessage() {
      console.log('start connect');
      this.connection = new WebSocket(`wss://nane.tada.team/ws?username=${1}`);
      this.connection.onopen = function (event) {
        console.log(event);
        console.log('success');
      }
      this.connection.onmessage = function(event) {
        console.log(event);
      }
    },
    showAlert(message, time) {
      this.alertMessage = message;
      setTimeout(() => { this.alertMessage = null } , time);
    }
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

  $background-color: #9aceec;
  $background-accent-color: #204682;
  $title-color: #1a3e73;
  $transparent-color: rgba(0, 0, 0, 0);

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
      }
    }

    .left-sidebar-menu__new-rooms {
      margin-top: 40px;
    }
  }

  .chat-container {
    width: 100%;
    background: linear-gradient(270deg, #EECFBA, #C5DDE8);

    .chat-container__null {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      
      span {
        padding: 20px 15px;
        max-width: 250px;
        border: 1px solid #204682;
        border-radius: 40px;
        text-align: center;
      }
    }

    .chat-container__content {
      .chat-container__title {
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #204682;
        white-space: nowrap;
        padding: 0 40px;

        .chat-container__room-name {
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .chat-container__messages {
        height: calc(100vh - 100px);
        overflow-y: auto;
        padding: 30px;

        // firefox
        scrollbar-width: thin;
        scrollbar-color: $background-accent-color $transparent-color ;

        // Chrome/Edge/Safari
        &::-webkit-scrollbar {
          width: 8px;
        }
        &::-webkit-scrollbar-track {
          background: $transparent-color;
        }
        &::-webkit-scrollbar-thumb {
          background-color: $background-accent-color;
          border-radius: 20px;
        }

        .chat-container__message {
          width: 80%;
          min-height: 30px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;

          &:last-child {
            margin-bottom: 0;
          }

          .message__icon {
            position: relative;
            width: 30px;
            height: 30px;
            min-width: 30px;
            min-height: 30px;
            background: #c5c5c5;
            margin-right: 10px;
            border-radius: 50%;

            .message__icon-text {
              position: absolute;
              font-size: 18px;
              color: black;
              width: 30px;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }

          .message__header {
            display: flex;
            align-items: center;

            .message__user {
              font-weight: bold;
              margin-right: 10px;
            }

            .message__time {
              font-size: 12px;
            }
          }

          .message__text {
            font-size: 14px;
          }
        }
      }

      .chat-container__controls {
        display: flex;
        height: 70px;
        margin: 0 20px;

        .chat-container__textfield {
          width: 80%;
        }

        .chat-container__buttonSend {
          width: 20%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
  }

  .alert {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
</style>

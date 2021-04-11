<template>
  <div class="main-container">
    <!-- is-openned-menu-state add to vuex -->
    <Menu :user="user" :rooms="rooms" :rooms-with-new-message="roomsWithNewMessage" />
    <div class="chat-container" @click="$store.dispatch('SET_ISOPENNEDMENU', false)">
      <div class="chat-container__null" v-if="!opennedRoom">
        <span>Выберите существующую комнату или создайте свою, чтобы начать общение.</span>
      </div>
      <div class="chat-container__content" v-else>
        <div class="chat-container__title"> 
          <span>Вы в комнате:</span>
          <span class="chat-container__room-name">{{opennedRoom}} </span>
        </div>
        <div class="chat-container__messages" >
          <div class="chat-container__null" v-if="!messages">
            <span>Начните общение просто отправив сообщение</span>
          </div>
          <div class="chat-container__message" v-else v-for="message in messages" :key="message.created">
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
        <v-form class="chat-container__controls" @submit.prevent="sendMessage">
          <div class="chat-container__textfield">
              <v-text-field label="Сообщение" autofocus v-model="newMessage"></v-text-field>
          </div>
          <div class="chat-container__buttonSend">
            <v-btn elevation="3" color="primary" type="submit">
              Отправить
            </v-btn>
          </div>
        </v-form>
      </div>
    </div>
  </div>
      <!-- <v-dialog v-model="showModalCreateNewRoom" max-width="500px">
        <v-form @submit.prevent="createNewRoom">
          <v-card class="modal-new-room">
            <v-card-title>
              <span>Введите название комнаты</span>
            </v-card-title>
            <v-text-field label="Название комнаты" v-model="newRoom" autofocus></v-text-field>
            <v-card-actions>
              <v-btn color="primary" type="submit">Создать</v-btn>
              <v-btn color="primary" text @click="newRoom=null;showModalCreateNewRoom = false">Закрыть</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog> -->
</template>

<script>
import axios from 'axios';
import Menu from '../components/Menu'

export default {
  name: 'Chats',
  components: {
    Menu,
  },
  data() {
    return {
      user: null,
      connection: null,
      rooms: null,
      messages: null,
      newMessage: null,
      opennedRoom: null,
      showModalCreateNewRoom: false,
      newRoom: null,
      roomsWithNewMessage: {},
    }
  },
  mounted() {
    if (!this.user && localStorage.getItem('chatikUser') === null) {
      this.$router.push({ name: 'login', params: { settings: this.settings } })
    } else {
      if (!this.user) {
        this.user = localStorage.getItem('chatikUser')
      }
      this.takeListRooms()
    }
  },
  destroyed() {
    if (this.connection) {
      this.connection.close(1000);
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings;
    },
  },
  methods: {
    takeListRooms() {
      axios.post('https://nane.tada.team/api/rooms')
        .then(response => (this.rooms = response.data.result))
        .catch(error => {
          console.log(error);
          this.showAlert(`Ошибка соединения с сервером ${error}`, 1500);
        });
      this.connection = new WebSocket(`wss://nane.tada.team/ws?username=${this.user}`);
      this.connection.onopen = (event) => {
        console.log(event);
        console.log('success');
      }
      this.connection.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        console.log(newData);
        if (newData.room === this.opennedRoom) {
          console.log('add new');
          if (this.messages === null) {
            this.messages = [];
          }
          this.messages.push(newData);
          this.$nextTick(function () {
            const containerMessages = document.querySelector(".chat-container__messages");
            containerMessages.scrollTop = containerMessages.scrollHeight;
          })
        } else {
          if (this.roomsWithNewMessage[newData.room]) {
            this.$set(this.roomsWithNewMessage, newData.room, this.roomsWithNewMessage[newData.room] + 1)
          } else {
            this.$set(this.roomsWithNewMessage, newData.room, 1)
          }
        }
      }

      this.connection.onclose = (event) => {
        if (event.wasClean) {
          this.showAlert(`Соединение закрыто чисто, код=${event.code} причина=${event.reason}`, 1500);
        } else {
          this.showAlert(`Соединение разорвано`, 1500);
        }
      };

      this.connection.onerror = (error) => {
        this.showAlert(`Соединение разорвано ${error.message}`, 1500);
      };
    },
    sendMessage() {
      if (this.newMessage === null) {
        this.showAlert('Нельзя отправить пустое сообщение', 1500);
        return;
      }
      console.log('send message');
      this.connection.send(`{"room" : "${this.opennedRoom}", "text": "${this.newMessage}"}`)
      this.newMessage = null;
    },
  },
}
</script>

<style lang="scss">
  $background-color: #9aceec;
  $background-accent-color: #204682;
  $title-color: #1a3e73;
  $transparent-color: rgba(0, 0, 0, 0);

  .main-container {
    position: relative;
    display: flex;
    height: 100%;
  }

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
          margin-left: 5px;
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

  .modal-new-room {
    padding: 0 20px;
  }
</style>

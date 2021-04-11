<template>
  <div class="left-sidebar-menu-container">
    <div class="left-sidebar-menu">
      <div class="button-menu">
        <v-btn icon color="primary">
          <v-icon @click="$store.dispatch('SET_ISOPENNEDMENU', true)">mdi-menu</v-icon>
        </v-btn>
        <div class="notification-new-message" v-if="Object.keys(roomsWithNewMessage).length > 0"></div>
      </div>
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
          <li @click="connectToRoom(room.name)" v-for="room in rooms" :key="room.name">
            комната {{room.name}}
            <span class="notification-in-room" v-if="roomsWithNewMessage[room.name]">{{ roomsWithNewMessage[room.name] }}</span>
          </li>
        </div>
      </ul>
      <v-btn block elevation="3" color="primary" class="left-sidebar-menu__new-rooms" @click="showModalCreateNewRoom = true">
        Создать новую комнату
      </v-btn>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: {
    user: { type: String, default: null },
    rooms: { type: Array, default: () => [] },
    roomsWithNewMessage: {type: Object, default: () => ({}) },
  },
  data() {
    return {
      opennedRoom: null,
      showModalCreateNewRoom: false,
    }
  },
  computed: {
    isOpennedMenu() {
      return this.$store.state.isOpennedMenu;
    },
    settings() {
      console.log(this.$store.state.settings)
      return this.$store.state.settings;
    },
  },
  methods: {
    closeMenu() {
      if (this.isOpennedMenu) 
        this.$store.dispatch('SET_ISOPENNEDMENU', false)
    },
    logOut() {
      // vuex this.user = null;
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      localStorage.removeItem('chatikUser');
      this.$router.push({ name: 'login', params: { settings: this.settings } })
    },
    createNewRoom() {
      if (this.settings.max_room_title_length && this.newRoom.length > this.settings.max_room_title_length) {
        this.showAlert(`Логин не может быть больше ${this.settings.max_room_title_length} символов`, 1500);
      }
      this.rooms.forEach(room => {
        if (this.newRoom === room.name) {
          this.connectToRoom(this.newRoom)
          return
        }
      });
      this.showModalCreateNewRoom = false;
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      this.opennedRoom = this.newRoom;
      this.messages = null;
      this.newRoom = null;
    },
    connectToRoom(roomName) {
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      this.opennedRoom = roomName;
      axios.post(`https://nane.tada.team/api/rooms/${roomName}/history`)
        .then(response => {
          this.messages = response.data.result
          // скролим чат к самому новому сообщению но после обновления dom
          this.$nextTick(function () {
            const containerMessages = document.querySelector(".chat-container__messages");
            containerMessages.scrollTop = containerMessages.scrollHeight;
            this.$delete(this.roomsWithNewMessage, roomName);
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
  },
}
</script>

<style lang="scss">
</style>
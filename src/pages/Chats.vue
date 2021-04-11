<template>
  <div class="main-container">
    <Menu :rooms="rooms" @createRoom="showModalCreateNewRoom=true"/>
    <div class="chat-container" @click="$store.dispatch('SET_ISOPENNEDMENU', false)">
      <div class="chat-container__null" v-if="!opennedRoom">
        <span>Выберите существующую комнату или создайте свою, чтобы начать общение.</span>
      </div>
      <Dialog :room-name="opennedRoom" :messages="messages" :connection="connection" v-else/>
    </div>
    <v-dialog v-model="showModalCreateNewRoom" max-width="500px">
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
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import Menu from '../components/Menu'
import Dialog from '../components/Dialog'

export default {
  name: 'Chats',
  props: {
    opennedRoom: { type: String, default: null }
  },
  components: {
    Menu, Dialog,
  },
  data() {
    return {
      connection: null,
      rooms: null,
      messages: null,
      showModalCreateNewRoom: false,
      newRoom: null,
    }
  },
  mounted() {
    if (!this.user) {
      this.$router.push({ name: 'login' })
    } else {
      this.takeListRooms()
      if (this.opennedRoom) {
        this.connectToRoom()
      }
    }
  },
  destroyed() {
    if (this.connection) {
      this.connection.close(1000);
    }
  },
  watch: {
    opennedRoom() {
      this.connectToRoom()
    }
  },
  computed: {
    settings () {
      return this.$store.state.settings;
    },
    user () {
      return this.$store.state.user;
    },
  },
  methods: {
    takeListRooms() {
      axios.post('https://nane.tada.team/api/rooms')
        .then(response => (this.rooms = response.data.result))
        .catch(error => {
          console.log(error);
          this.$store.dispatch('SET_ALERTMESSAGE', `Ошибка соединения с сервером ${error}` );
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
          this.rooms.forEach(room => {
            if (room.name === newData.room) {
              room.notification = room.notification ? (room.notification + 1) : 1
              this.$store.dispatch('SET_COUNTNEWMESSAGE', this.$store.state.countNewMessage + 1)
            }
          });
        }
      }
      this.connection.onclose = (event) => {
        if (event.wasClean) {
          console.log(`Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
          console.log('Соединение разорвано');
        }
      };

      this.connection.onerror = (error) => {
        console.log(`Соединение разорвано ${error.message}`);
      };
    },
    connectToRoom() {
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      console.log('axios')
      axios.post(`https://nane.tada.team/api/rooms/${this.opennedRoom}/history`)
        .then(response => {
          this.messages = response.data.result
          // скролим чат к самому новому сообщению но после обновления dom
          this.$nextTick(function () {
            const containerMessages = document.querySelector(".chat-container__messages");
            containerMessages.scrollTop = containerMessages.scrollHeight;
            this.rooms.forEach(room => {
              if (room.name === this.opennedRoom) {
                this.$store.dispatch('SET_COUNTNEWMESSAGE', this.$store.state.countNewMessage - room.notification )
                this.$delete(room, 'notification');
              }
            });
          })
        })
        .catch(error => {
          console.log(error);
        });
    },
    createNewRoom() {
      if (!this.newRoom) {
        this.$store.dispatch('SET_ALERTMESSAGE', `Название комнаты не должно быть пустым`);
      }
      if (this.settings.max_room_title_length && this.newRoom.length > this.settings.max_room_title_length) {
        this.$store.dispatch('SET_ALERTMESSAGE', `Название комнаты не может быть больше ${this.settings.max_room_title_length} символов`);
      }
      this.showModalCreateNewRoom = false;
      this.$store.dispatch('SET_ISOPENNEDMENU', false)
      this.messages = null;
      let isNewRoom = true;
      this.rooms.forEach(room => {
        if (room.name === this.opennedRoom) {
          isNewRoom = false
        }
      });
      if (isNewRoom) {
        this.rooms.push({"name": this.newRoom});
      }
      this.$router.push({ name: 'chat', params: { opennedRoom: this.newRoom } });
      this.newRoom = null;
    },
  },
}
</script>

<style lang="scss">
  .main-container {
    position: relative;
    display: flex;
    height: 100%;
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
  }

  .modal-new-room {
    padding: 0 20px;
  }
</style>

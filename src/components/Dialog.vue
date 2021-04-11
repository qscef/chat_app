<template>
  <div class="chat-container__content">
    <div class="chat-container__title"> 
      <span>Вы в комнате:</span>
      <span class="chat-container__room-name">{{roomName}} </span>
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
        <v-textarea autocomplete="off" label="Сообщение" autofocus v-model="newMessage"></v-textarea>
      </div>
      <div class="chat-container__buttonSend">
        <v-btn elevation="3" color="primary" type="submit">
          Отправить
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
export default {
  props:{
    roomName: { type: String, default: '' },
    messages: { type: Array, default: () => [] },
    connection: { type: WebSocket, default: null },
  },
  data() {
    return {
      newMessage: null,
    }
  },
  methods: {
    messageDate(date) {
      const temp = new Date (date);
      let result = ''
      result += (temp.getHours() < 10 ? '0' + temp.getHours() : temp.getHours()) + ':'
      result += (temp.getMinutes() < 10 ? '0' + temp.getMinutes() : temp.getMinutes()) + ' '
      result += (temp.getDate() < 10 ? '0' + temp.getDate() : temp.getDate()) + '.'
      result += (temp.getMonth() < 10 ? '0' + (temp.getMonth() + 1) : temp.getMonth()) + '.'
      result += temp.getFullYear()
      return result
    },
    sendMessage() {
      if (this.newMessage === null) {
        this.$store.dispatch('SET_ALERTMESSAGE', `Нельзя отправить пустое сообщение`);
        return;
      }
      console.log('send message');
      this.connection.send(`{"room" : "${this.roomName}", "text": "${this.newMessage}"}`)
      this.newMessage = null;
    },
  }
}
</script>

<style lang="scss">
  $background-accent-color: #204682;
  $transparent-color: rgba(0, 0, 0, 0);

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
      height: calc(100vh - 145px);
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
      align-items: flex-end;
      margin: 20px;

      .chat-container__textfield {
        width: 80%;
        margin-right: 15px;

        .v-text-field__details {
          display: none;
        }

        .v-text-field__slot {
          max-height: 50px;

          textarea {
            resize: none;
            line-height: 18px;
            font-size: 14px;
            font-family: "Roboto", sans-serif;

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
          }
        }
      }

      .chat-container__buttonSend {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
</style>
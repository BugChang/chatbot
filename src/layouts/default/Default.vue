<template>
  <v-app>
    <v-navigation-drawer width="350" color="blue-lighten-4">

      <v-btn color="primary" class="mx-4 mt-4">
        新建聊天
        <v-dialog v-model="dialog" activator="parent" width="auto">
          <v-card>
            <v-card-text>
              <v-btn color="primary" class="mx-2" @click="newChat(1)">
                通义千问
              </v-btn>
              <v-btn color="secondary" class="mx-2" @click="newChat(2)">
                文心一言
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
      <v-card class="ma-4 pa-2 rounded-lg" border="2" v-for="[key, value] in chats" :key="key" :to="'/' + value.chatId"
        :color="calcColor(value.chatId)">
        <v-card-title>
          {{ value.title === '' ? '新的聊天' : value.title }}
        </v-card-title>
        <v-card-subtitle>
          <!-- 0条对话 和  2023/12/12 分布左右两侧 -->
          <v-row>
            <v-col cols="5">
              {{ value.messages?.length }}条对话
            </v-col>
            <v-col cols="7" class="text-right">
              <!-- 格式化日期 -->
              {{ value.time }}

            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>

    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-title>
        <v-icon icon="mdi-circle-slice-4" />
        {{ currentProviderText }}
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <router-view :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>
<script>
import { mapState } from 'vuex';
export default {
  mounted() {
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapState(['currentProvider', 'chats', 'providers', 'currentChatId']),
    currentProviderText() {
      if (this.currentProvider) {
        return this.providers.find((item) => item.id == this.currentProvider).text;
      } else {
        return '';
      }
    },
    calcColor() {
      return (chatId)=>{
        return this.currentChatId == chatId ? 'blue' : 'grey';
      }
    },
  },
  methods: {
    async newChat(provider) {
      this.$store.commit('setCurrentProvider', provider);
      this.dialog = false;
      // 跳转至当前路由，但是带上chatId参数
      this.$router.push({ name: 'Chat', params: { chatId: undefined } });
    },
  },
  scrollToBottom() {
    this.$nextTick(() => {
      let container = this.$el.querySelector('.chat-container');
      container.scrollTop = container.scrollHeight;
    });
  },
};
</script>


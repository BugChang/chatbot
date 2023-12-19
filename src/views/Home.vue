<template>
    <v-container class="fill-height">
        <v-row style="height: 100%;">
            <v-col cols="12" class="chat-list" ref="chatList">
                <chat-component :messages="messages" :show-loading="showLoading" />
            </v-col>
            <v-col cols="12" class="chat-input">
                <v-text-field class="chat-input" v-model="newMessage" variant="outlined" label="Message" type="text">
                    <template v-slot:append-inner>
                        <v-btn flat color="primary" @click="sendMessage" :disabled="!readySend">
                            发送
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import ChatComponent from '@/components/ChatComponent.vue';
import { mapState } from 'vuex';
import axios from 'axios';
export default {
    props: ['chatId'],
    components: {
        ChatComponent,
    },
    mounted() {
        console.log('this.chatId', this.currentProvider); // 访问路由参数
        if (!this.chatId) {
            console.log('生成uuid'); // 访问路由参数
            // 生成uuid
            var chatId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            // 跳转至当前路由，但是带上chatId参数
            this.$router.push({ name: 'Chat', params: { chatId: chatId } });
        } else {
            console.log('initData'); // 访问路由参数
            this.initData();
            this.scrollToBottom();
        }

    },

    data() {
        return {
            newMessage: '',
            readySend: true,
            showLoading: false
        };
    },
    methods: {
        async sendMessage() {
            if (this.newMessage.trim() !== '') {
                this.readySend = false;
                // 存储到vuex中
                if (this.currentChat.title === '') {
                    let newChat = this.currentChat;
                    // 截取10个字符串，超出用...代替
                    newChat.title = this.newMessage.length > 10 ? this.newMessage.substring(0, 10) + '...' : this.newMessage;
                    this.$store.commit('setChat', newChat);
                }
                this.$store.commit('addMessage', { text: this.newMessage, user: 'user' });
                this.showLoading = true;
                let tempMessage = this.newMessage;
                this.newMessage = '';
                this.scrollToBottom();
                // 发送消息到ChatGPT或其他后端进行处理
                var text = await this.getAnswer(this.currentProvider, tempMessage);
                // 处理后的回复消息应添加到this.messages数组中
                this.$store.commit('addMessage', { text: text, user: 'bot' });
                this.readySend = true;
                this.showLoading = false;
                this.scrollToBottom();
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                document.getElementsByClassName('chat-list')[0].scrollTop = document.getElementsByClassName('chat-list')[0].scrollHeight;
            });
        },
        async getAnswer(provider, newMessage) {
            switch (provider) {
                case 1:
                    return await this.requestQianwen(newMessage);
                case 2:
                    return await this.requestWenxin();
                default:
                    return await this.requestQianwen(newMessage);
            }
        },
        async requestQianwen(newMessage) {
            try {
                const response = await axios({
                    method: 'post',
                    url: '/api/v1/services/aigc/text-generation/generation',
                    headers: {
                        'Authorization': 'Bearer sk-6229e26d027547dab2578fad4999e7ba',
                        'Content-Type': 'application/json'
                    },
                    data: {
                        "model": "qwen-turbo",
                        "input": {
                            "prompt": newMessage
                        },
                        "parameters": {
                        }
                    }
                });

                console.log(response.data);
                let answer = response.data.output.text;
                return answer;
            } catch (error) {
                console.error(error);
            }
        },
        async requestWenxin() {
            if (!this.wenxinToken || this.wenxinToken == null || this.wenxinToken == '' || this.wenxinToken == 'null') {
                let wenxinToken = await this.getWenXinToken();
                this.$store.commit('setWenxinToken', wenxinToken);
            }
            try {

                let messages = this.currentChat.messages.map((item) => {
                    return { "role": item.user === 'bot' ? 'assistant' : 'user', "content": item.text }
                });
                messages = messages.slice(1);
                const response = await axios.post(`/wxyy/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${this.wenxinToken}`,
                    {
                        // 将currentChat中的messages数组转换为messages数组
                        "messages": messages
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });

                console.log(response.data);
                let answer = response.data.result;
                return answer;
            } catch (error) {
                console.error(error);
            }
        },
        async getWenXinToken() {
            try {
                const response = await axios.get('/wxyy/oauth/2.0/token', {
                    params: {
                        grant_type: 'client_credentials',
                        client_id: 'lijGlokZeWRuP0G95GZv982y', // 你的API Key
                        client_secret: '5rh3ZklCTHZYBY7MtFCeNdIMMWfj4LYu', // 你的Secret Key
                    },
                });

                console.log(response.data);
                let token = response.data.access_token;
                return token;
            } catch (error) {
                console.error(error);
            }
        },
        initData() {
            console.log('currentChat', this.currentChat)
            if (!this.currentChat) {
                this.initNewChat()
            }
            this.$store.commit('setCurrentChatId', this.chatId);
            this.$store.commit('setCurrentProvider', this.currentChat.provider);
            console.log(this.chatId);

        },
        initNewChat() {

            console.log(this.chatId);
            var helloText = `Hello,我是${this.currentProviderText}，有什么可以帮助!`
            var chat = {
                chatId: this.chatId,
                title: '',
                time: new Date(),
                provider: this.currentProvider,
                messages: [{ text: helloText, user: 'bot' }]
            }
            this.$store.commit('setChat', chat);
            this.$store.commit('setCurrentChatId', this.chatId);
        }

    },
    computed: {
        ...mapState(['chats', 'providers', 'wenxinToken', 'currentProvider']),
        currentChat() {
            return this.chats.get(this.chatId);
        },
        messages() {
            if (this.currentChat) {
                return this.currentChat.messages;
            } else {
                return [];
            }
        },
        currentProviderText() {
            if (this.currentProvider) {
                return this.providers.find((item) => item.id == this.currentProvider).text;
            } else {
                return '';
            }

        },
    }
}
</script>
<style>
.chat-list {
    height: calc(100vh - 200px);
    overflow-y: scroll;
}
</style >
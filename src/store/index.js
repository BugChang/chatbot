// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        chats: new Map(),
        currentChatId: null,
        currentProvider: 1,
        wenxinToken: null,
        providers: [
            {
                'id': 1,
                'text': '通义千问',
            }, {
                'id': 2,
                'text': '文心一言',
            }
        ],

    },
    mutations: {
        // 在这里添加你的mutations
        setChat(state, payload) {
            // chats是字典集合，key是chatId，value是payload
            console.log('payload.chatId', payload.chatId);
            state.chats.set(payload.chatId, payload)
        },
        setChats(state, payload) {
            console.log('setChats', payload);
            state.chats = payload;
        },
        setCurrentChatId(state, chatId) {
            console.log('setCurrentChatId', chatId)
            state.currentChatId = chatId;
        },
        addMessage(state, payload) {
            console.log('state.currentChatId', state.currentChatId);
            let currentChat = state.chats.get(state.currentChatId)
            currentChat.messages.push(payload)
        },
        setCurrentProvider(state, payload) {
            console.log('setcurrentProvider', payload);
            state.currentProvider = payload;
        },
        setWenxinToken(state, payload) {
            console.log('setWenxinToken', payload);
            state.wenxinToken = payload;
        }
    },
    actions: {
        // 在这里添加你的actions
    },
    modules: {
        // 在这里添加你的modules
    },
    plugins: [
        // 在这里添加你的插件
        // 存储到LocalStorage
        (store) => {
            store.subscribe((mutation, state) => {
                console.log('mutation', mutation);
                console.log('state', state);
                localStorage.setItem('chats', JSON.stringify(Array.from(state.chats.entries())));
                localStorage.setItem('currentChatId', state.currentChatId);
                localStorage.setItem('currentProvider', state.currentProvider);
                localStorage.setItem('wenxinToken', state.wenxinToken);

            })
        },
        // 从LocalStorage读取
        (store) => {
            let chats = localStorage.getItem('chats');
            console.log('chats', chats);
            let currentChatId = localStorage.getItem('currentChatId');
            if (chats) {
                store.commit('setCurrentChatId', currentChatId);
                const parsedChats = new Map(JSON.parse(chats));
                store.commit('setChats', parsedChats);
                store.commit('setCurrentProvider', localStorage.getItem('currentProvider'));
                store.commit('setWenxinToken', localStorage.getItem('wenxinToken'));
            }
        }
    ]
});
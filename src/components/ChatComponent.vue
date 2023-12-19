
<template>
    <v-card class="ma-4" v-for="message in messages" :key="message"
        :color="message.user == 'bot' ? 'teal-lighten-4' : 'grey-lighten-4'">
        <v-card-title>
            {{ message.user }}
        </v-card-title>
        <v-card-text>
            {{ message.text }}
        </v-card-text>
    </v-card>
    <v-card class="ma-4 text-center" color="teal-lighten-4" v-if="showLoading" width="100">
        <v-progress-circular class="pa-4" color="primary" indeterminate size="50"></v-progress-circular>
    </v-card>
</template>
  
<script>
export default {
    props: {
        showLoading: {
            type: Boolean,
            default: false,
        },
        messages: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            overlay: true
        };
    },
};
</script>
  
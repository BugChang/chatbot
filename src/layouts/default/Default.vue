<template>
  <v-app>
    <v-navigation-drawer width="350" color="blue-lighten-4">
      <v-card class="ma-4 pa-2 rounded-lg" border="2" v-for="i in 10" :key="i">
        <v-card-title>
          新的聊天
        </v-card-title>
        <v-card-subtitle>
          <!-- 0条对话 和  2023/12/12 分布左右两侧 -->
          <v-row>
            <v-col cols="5">
              0条对话
            </v-col>
            <v-col cols="7" class="text-right">
              2023/12/12
            </v-col>
          </v-row>
        </v-card-subtitle>
      </v-card>
    </v-navigation-drawer>
    <v-app-bar>
      <v-app-bar-title>
        <v-icon icon="mdi-circle-slice-4" />
        通义千问
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <!-- 聊天历史气泡界面 -->
      <div class="mx-auto my-2 pl-4" style="max-width: 80%;">
        左右结构的聊天气泡怎么实现
      </div>
      <v-card color="green" max-width="80%" class="mx-auto">
        <!-- 机器人图标带文字，文字在图标右侧 -->





        <v-card-text>
          首先，创建一个包含左右两部分的容器元素：
          html
          <div class="chat-bubble">
            <div class="bubble-content">
              这是聊天内容
            </div>
            <div class="bubble-arrow"></div>
          </div>
          接下来，为这两个部分编写CSS样式：
          css
          .chat-bubble {
          display: inline-block;
          position: relative;
          background-color: #f5f5f5; /* 聊天气泡的颜色 */
          border-radius: 10px; /* 气泡的圆角 */
          padding: 10px 20px; /* 内边距 */
          }

          .bubble-content {
          display: inline-block;
          max-width: 70%; /* 可根据需要调整内容区域的最大宽度 */
          word-wrap: break-word; /* 自动换行 */
          }

          .bubble-arrow {
          width: 0;
          height: 0;
          border-top: 10px solid transparent; /* 箭头的高度和透明度 */
          border-bottom: 10px solid transparent; /* 箭头的高度和透明度 */
          border-left: 10px solid #f5f5f5; /* 箭头的颜色和宽度 */
          position: absolute;
          right: -10px; /* 箭头与气泡的右边缘的距离，应等于箭头的宽度 */
          top: 50%;
          transform: translateY(-50%); /* 让箭头垂直居中 */
          }
          这个例子中，.chat-bubble 是整个气泡的容器，包含 .bubble-content（内容区域）和
          .bubble-arrow（箭头）。箭头通过创建一个零宽度和零高度的元素，并使用不同的边框颜色和宽度来模拟三角形形状。通过 position: absolute 和相关的 top, right
          属性，我们可以将箭头定位在气泡的右边缘。

          请注意，这只是一个基础的实现，你可能需要根据具体的设计需求进行调整，例如改变颜色、大小、圆角、箭头位置等。
        </v-card-text>

      </v-card>

      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
</script>

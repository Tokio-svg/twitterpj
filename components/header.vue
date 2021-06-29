<template>
  <header>
    <img v-bind:src="logoImage" class="header_logo">
    <div class="header_link">
      <div class="header_link-content">
        <NuxtLink to="/register">新規登録</NuxtLink>
      </div>
      <div class="header_link-content">
        <NuxtLink to="/login">ログイン</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      logoImage: require('@/assets/img/logo.png'),
    }
  }
}
</script>

<style scoped>
header {
  height: 10%;
  width: 100%;
  background: rgba(0, 0, 0, 1);
  display: flex;
  justify-content: space-between;
}
.header_logo {
  height: 60%;
  margin: auto 20px;
}
.header_link {
  height: fit-content;
  margin: auto 100px;
  display: flex;
}
.header_link-content {
  margin-right: 30px;
}
</style>
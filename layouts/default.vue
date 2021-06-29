<template>
  <div class="default_container">
    <Header />
    <Nuxt />
  </div>
</template>

<script>
import Header from "../components/header.vue";
export default {
  components: {
    Header
  }
};
</script>

<style src="~/assets/css/reset.css">
</style>

<style>
  html,body,#__nuxt,#__layout,.default_container {
    height: 100%;
  }
.default_container {
  min-height: 100%;
}
a {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
</style>

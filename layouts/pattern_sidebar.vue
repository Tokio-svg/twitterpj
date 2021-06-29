<template>
  <div class="layout_container">
    <Aside />
    <Nuxt />
  </div>
</template>

<script>
import Aside from "../components/sidebar.vue";
export default {
  components: {
    Aside
  },
};
</script>

<style src="~/assets/css/reset.css">
</style>

<style scoped>
  html,body,#__nuxt,#__layout,.layout_container {
    min-height: 100%;
  }

  .layout_container {
    display: flex;
    /* height: 100%; */
  }
  a {
    text-decoration: none;
    color: white;
    cursor: pointer;
  }
</style>
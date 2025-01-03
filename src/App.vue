<script setup>
import { RouterLink, RouterView } from 'vue-router'
import sidebar from './components/sidebar.vue';


</script>

<template>
  <sidebar />
  <RouterView />
</template>

<style lang="scss">
@import "./assets/scss/all.scss";
</style>

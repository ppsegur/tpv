<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script setup>
import NavBar from './components/Nav-bar.vue'
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}
</style>
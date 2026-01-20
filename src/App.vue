<template>
  <div class="container">
    <NavBar 
      :aria-expanded="menuOpen"
      @click="menuOpen = !menuOpen"
      :class="{ open: menuOpen }">
    </NavBar>
    <router-view />
  </div>
</template>

<script setup>
import NavBar from './components/Nav-bar.vue';

const menuOpen = ref(false);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.open {
  /* Add your responsive styles here */
}
</style>
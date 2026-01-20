<template>
  <div id="app">
    <NavBar :class="{'menu-open': menuOpen}" @toggle-menu="toggleMenu" />
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
  },
};
</script>

<style scoped>
#app {
  /* Removed fixed min-width layout and made this responsive */
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}
</style>
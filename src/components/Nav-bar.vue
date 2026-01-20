<template>
  <nav>
    <div @click.outside="closeMenu">
      <img :src="logo" alt="Logo" />
      <button @click="toggleMenu" :aria-expanded="menuOpen">Menu</button>
      <ul v-if="menuOpen">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/historial">Historial</router-link></li>
        <li><router-link to="/gestion">Gestión</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';

const menuOpen = ref(false);
const logo = '/azazahrLogo.png';
const router = useRouter();

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

const handleRouteChange = () => {
  closeMenu();
};

const closeOnOutsideClick = (event) => {
  const target = event.target;
  if (target.closest('nav') === null) {
    closeMenu();
  }
};

const applyListeners = () => {
  document.addEventListener('click', closeOnOutsideClick, true);
  document.addEventListener('touchstart', closeOnOutsideClick, true);
};

// Close menu on route change
router.afterEach(handleRouteChange);
// Set up listeners on component mount
applyListeners();

// Clean up listeners on unmount
onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick, true);
  document.removeEventListener('touchstart', closeOnOutsideClick, true);
});
</script>

<style scoped>
nav {
  background-color: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--ui-radius);
  box-shadow: var(--ui-shadow);
}
ul {
  background-color: var(--ui-surface);
  color: var(--ui-text);
}
</style>
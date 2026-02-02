<template>
  <header ref="navRoot" class="navbar">
    <router-link to="/" class="brand" @click="closeMenu">
      <img src="/azazahrLogo.png" alt="El Azahar" class="logo-icon" />
      <span class="brand-text">El Azahar</span>
    </router-link>

    <button
      class="menu-toggle"
      type="button"
      aria-label="Abrir/cerrar menú"
      :aria-expanded="menuOpen ? 'true' : 'false'"
      aria-controls="primary-nav"
      @click.stop="toggleMenu"
    >
      <span class="bar" :class="{ active: menuOpen }"></span>
      <span class="bar" :class="{ active: menuOpen }"></span>
      <span class="bar" :class="{ active: menuOpen }"></span>
    </button>

    <nav id="primary-nav" class="nav-links" :class="{ open: menuOpen }">
      <router-link to="/" @click="closeMenu">Inicio</router-link>
      <router-link to="/historial" @click="closeMenu">Historial</router-link>
      <router-link to="/arqueo" @click="closeMenu">Arqueo</router-link>
      <router-link to="/gestion" @click="closeMenu">Gestión</router-link>
    </nav>
  </header>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const navRoot = ref(null)
const menuOpen = ref(false)
const route = useRoute()

const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

const onGlobalPointer = (event) => {
  if (!menuOpen.value) return
  const root = navRoot.value
  if (!root) return
  if (!root.contains(event.target)) closeMenu()
}

onMounted(() => {
  document.addEventListener('click', onGlobalPointer, true)
  document.addEventListener('touchstart', onGlobalPointer, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onGlobalPointer, true)
  document.removeEventListener('touchstart', onGlobalPointer, true)
})

watch(() => route.fullPath, () => closeMenu())
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 12px 16px;
  background: var(--ui-surface);
  color: var(--ui-text);
  border-bottom: 1px solid var(--ui-border);
  box-shadow: var(--ui-shadow);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ui-text);
  text-decoration: none;
  font-weight: 800;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-links a {
  color: var(--ui-text);
  text-decoration: none;
  font-weight: 600;
  padding: 8px 10px;
  border-radius: 10px;
}

.nav-links a:hover {
  background: rgba(124, 58, 237, 0.12);
  color: var(--ui-primary);
}

.nav-links a.router-link-active {
  background: rgba(124, 58, 237, 0.16);
  color: var(--ui-primary);
}

.menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  border: 1px solid var(--ui-border);
  border-radius: 12px;
  background: var(--ui-surface);
  cursor: pointer;

  align-items: center;
  justify-content: center;
  gap: 4px;
  flex-direction: column;
}

.bar {
  width: 20px;
  height: 2px;
  background: var(--ui-text);
  border-radius: 999px;
  transition: transform 180ms ease, opacity 180ms ease;
}

.menu-toggle .bar:nth-child(1).active { transform: translateY(6px) rotate(45deg); }
.menu-toggle .bar:nth-child(2).active { opacity: 0; }
.menu-toggle .bar:nth-child(3).active { transform: translateY(-6px) rotate(-45deg); }

@media (max-width: 768px) {
  .menu-toggle { display: flex; }

  .nav-links {
    position: absolute;
    top: calc(100% + 8px);
    left: 16px;
    right: 16px;

    display: none;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;

    padding: 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow);
  }

  .nav-links.open { display: flex; }
}
</style>
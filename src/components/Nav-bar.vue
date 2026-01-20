<template>
  <nav>
    <div class="logo">
      <img src="/azazahrLogo.png" alt="Logo" />
    </div>
    <button class="hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span class="bar"></span>
    </button>
    <ul class="nav-links">
      <li><router-link to="/" aria-label="Inicio">Inicio</router-link></li>
      <li><router-link to="/historial" aria-label="Historial">Historial</router-link></li>
      <li><router-link to="/gestion" aria-label="Gesti��n">Gestión</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style scoped>
nav {
  background: var(--ui-surface);
  color: var(--ui-text);
}

.nav-links a {
  color: var(--ui-text);
  text-decoration: none;
}

.nav-links a:hover,
.nav-links a:active {
  color: var(--ui-primary);
}
</style>
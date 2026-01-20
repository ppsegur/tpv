<template>
  <nav>
    <div class="navbar">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <div class="menu-toggle" @click="toggleMenu">
        <div :class="{'open': menuOpen}"></div>
      </div>
      <ul :class="{'active': menuOpen}">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/historial">Historial</router-link></li>
        <li><router-link to="/gestion">Gestión</router-link></li>
      </ul>
    </div>
  </nav>
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
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--ui-background);
  padding: 1rem;
}

.logo {
  height: 40px;
}

.menu-toggle {
  cursor: pointer;
  display: none;
}

ul {
  display: flex;
  list-style: none;
}

li {
  margin: 0 1rem;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  ul {
    display: none;
    flex-direction: column;
  }
  ul.active {
    display: block;
  }
}
</style>
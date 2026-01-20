<template>
  <nav>
    <button class="hamburger" @click="toggleMenu">☰</button>
    <div :class="{'open': menuOpen}" class="nav-links">
      <router-link v-for="link in links" :key="link.text" :to="link.href">{{ link.text }}</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      links: [
        { text: 'Home', href: '/' },
        { text: 'About', href: '/about' },
        { text: 'Contact', href: '/contact' },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      this.$emit('toggle-menu', this.menuOpen);
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  background: var(--bg-color);
  border-radius: var(--border-radius);
}
.hamburger {
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
}
.nav-links {
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}
.nav-links.open {
  display: block;
}
.nav-links a {
  color: var(--link-color);
  padding: 10px;
  text-decoration: none;
}
.nav-links a:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--focus-color);
}
</style>
<template>
  <nav>
    <router-link to="/" class="logo">
      <img src="/azazahrLogo.png" alt="Logo" />
    </router-link>
    <div class="hamburger" @click="toggleMenu">
      <div :class="{'active': menuOpen}" class="line"></div>
      <div :class="{'active': menuOpen}" class="line"></div>
      <div :class="{'active': menuOpen}" class="line"></div>
    </div>
    <div v-if="menuOpen" class="menu">
      <router-link v-for="item in menuItems" :key="item.name" :to="item.path" @click="handleMenuClick">
        {{ item.name }}
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      menuItems: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    handleMenuClick() {
      this.menuOpen = false;
    },
    closeMenuOnOutsideClick(event) {
      if (this.menuOpen && !this.$el.contains(event.target)) {
        this.menuOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.closeMenuOnOutsideClick);
    this.$router.afterEach(() => {
      this.menuOpen = false;
    });
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeMenuOnOutsideClick);
  },
};
</script>

<style scoped>
nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--ui-background);
  padding: var(--ui-padding);
}
.logo img {
  max-width: 100px;
}
.hamburger {
  cursor: pointer;
}
.line {
  width: 30px;
  height: 3px;
  background-color: var(--ui-color);
  margin: 5px 0;
  transition: all 0.3s;
}
.line.active {
  background-color: var(--ui-active-color);
}
.menu {
  display: flex;
  flex-direction: column;
}
.menu a {
  padding: var(--ui-link-padding);
}
</style>

<template>
  <nav class="nav-bar" :class="{ 'is-open': menuOpen }" @click.self="handleOutsideClick">
    <div class="logo">
      <img :src="logoSrc" alt="Logo" />
    </div>
    <button 
      class="menu-toggle" 
      @click="toggleMenu" 
      :aria-expanded="menuOpen"
    >
      Menu
    </button>
    <ul v-if="menuOpen" class="menu">
      <li v-for="item in menuItems" :key="item.id">
        <a :href="item.link">{{ item.label }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      menuOpen: false,
      logoSrc: '/azazahrLogo.png',
      menuItems: [
        { id: 1, label: 'Home', link: '#' },
        { id: 2, label: 'About', link: '#' },
        { id: 3, label: 'Services', link: '#' },
        { id: 4, label: 'Contact', link: '#' },
      ],
    };
  },

  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },

    handleOutsideClick(event) {
      if (this.menuOpen && !this.$el.contains(event.target)) {
        this.menuOpen = false;
      }
    },
  },
};
</script>

<style scoped>
.nav-bar {
  --ui-background: #fff;
  --ui-text: #333;
  --ui-border: #ccc;
}

.nav-bar.is-open {
  --ui-background: #f0f0f0;
}

.menu-toggle {
  cursor: pointer;
}

.menu {
  display: flex;
  flex-direction: column;
}
</style>

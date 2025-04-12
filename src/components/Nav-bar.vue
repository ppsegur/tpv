<template>
    <header class="navbar">
        <div class="logo">
      <img src="../../public/azazahrLogo.png" alt="El Azahar" class="logo-icon" />
      EL Azahar
    </div>
      <nav class="nav-links">
        <router-link to="/">Inicio</router-link>
        <router-link to="/historial">Historial de tickets</router-link>
        <router-link to="/gestion">Gestion de productos</router-link>

    </nav>
    </header>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  const menuOpen = ref(false)
  </script>
  
  <style scoped>
  .navbar {
    background: linear-gradient(90deg, #ffc8dd, #fab0cc);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    position: relative;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
  }
  .logo {
  display: flex;
  align-items: center;
  gap: 10px; /* Espacio entre el ícono y el texto */
}

.logo-icon {
  width: 40px; /* Ajusta el tamaño del ícono */
  height: 40px;
  border-radius: 50%; /* Opcional: redondear el ícono */
}
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
    transition: transform 0.3s ease-in-out;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    position: relative;
  }
  
  .nav-links a::after {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    left: 0;
    bottom: -3px;
    background: white;
    transition: width 0.3s ease;
  }
  
  .nav-links a:hover::after {
    width: 100%;
  }
  
  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .menu-toggle span {
    width: 25px;
    height: 3px;
    background: white;
    transition: all 0.3s ease;
    border-radius: 2px;
  }
  
  .bar1.active {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .bar2.active {
    opacity: 0;
  }
  
  .bar3.active {
    transform: rotate(-45deg) translate(5px, -5px);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: linear-gradient(90deg, #ffb347, #ffcc33);
      flex-direction: column;
      padding: 1rem 2rem;
      transform: translateY(-200%);
      z-index: 10;
    }
  
    .nav-links.open {
      transform: translateY(0%);
    }
  
    .menu-toggle {
      display: flex;
    }
  }
  </style>
  
<script setup>
import MesasView from './views/MesasView.vue';
import ProductList from './components/ProductList.vue';
import FormManagement from './components/FormManagement.vue';
</script>
<template>
  <div class="container">
    <!-- Sección de Mesas estilo NavBar -->
    <nav class="mesas-navbar">
      <MesasView />
    </nav>

    <!-- Layout principal con Sidebar y Productos -->
    <div class="main-layout">
      <!-- Sidebar: Formularios de gestión -->
      <aside class="sidebar">
      <FormManagement />
      </aside>

      <!-- Sección de Productos -->
      <main class="productos">
        <!-- Barra de búsqueda y filtros -->
        <ProductList />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor general */
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Navbar de Mesas */
.mesas-navbar {
  display: flex;
  justify-content: center;
  gap: 10px;
  background-color: #f8f9fa;
  padding: 10px;
  border-bottom: 2px solid #ddd;
  flex-wrap: wrap;
}

/* Layout Principal con Sidebar y Productos */
.main-layout {
  display: grid;
  grid-template-columns: 300px 1fr; /* Sidebar de 300px, resto del espacio para productos */
  gap: 20px;
  padding: 20px;
}

/* Sidebar con los formularios */
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
}

/* Contenedor de los productos */
.productos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>

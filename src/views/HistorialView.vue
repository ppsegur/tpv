<template>
    <div class="historial">
      <h1>Historial de Compras</h1>
      <input type="date" v-model="fechaFiltro" @change="filtrarHistorial" />
      <ul>
        <li v-for="ticket in historialFiltrado" :key="ticket.fecha + ticket.mesaId">
          <h3>Mesa {{ ticket.mesaId }} - {{ new Date(ticket.fecha).toLocaleString() }}</h3>
          <ul>
            <li v-for="producto in ticket.productos" :key="producto.id">
              {{ producto.name }} (x{{ producto.cantidad }}) - {{ (producto.price * producto.cantidad).toFixed(2) }}€
            </li>
          </ul>
          <p><strong>Total:</strong> {{ ticket.total.toFixed(2) }}€</p>
        </li>
      </ul>
      <aside class="totales">
        <h2>Totales</h2>
        <p><strong>Total del día:</strong> {{ totalDelDia.toFixed(2) }}€</p>
        <p><strong>Total del mes:</strong> {{ totalDelMes.toFixed(2) }}€</p>
        <p><strong>Total acumulado:</strong> {{ totalAcumulado.toFixed(2) }}€</p>
      </aside>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useMesasStore } from '../stores/mesas';
  
  const mesasStore = useMesasStore();
  const fechaFiltro = ref('');
  
  // Definir las variables de fecha que faltaban
  const hoy = new Date(); // Fecha actual
  const inicioDelMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Primer día del mes actual
  
  const historialFiltrado = computed(() => {
    if (!fechaFiltro.value) return mesasStore.historial;
    return mesasStore.obtenerHistorialPorFecha(fechaFiltro.value);
  });
  
  // Calcular el total del día
  const totalDelDia = computed(() => {
    return mesasStore.historial
      .filter(ticket => new Date(ticket.fecha).toDateString() === hoy.toDateString())
      .reduce((sum, ticket) => sum + ticket.total, 0);
  });
  
  // Calcular el total del mes
  const totalDelMes = computed(() => {
    return mesasStore.historial
      .filter(ticket => new Date(ticket.fecha) >= inicioDelMes)
      .reduce((sum, ticket) => sum + ticket.total, 0);
  });
  
  // Calcular el total acumulado
  const totalAcumulado = computed(() => {
    return mesasStore.historial.reduce((sum, ticket) => sum + ticket.total, 0);
  });
  
  const filtrarHistorial = () => {
    // Trigger computed property recalculation
  };
  </script>
  
  <style>
  .historial {
    padding: 20px;
  }
  
  .historial ul {
    list-style: none;
    padding: 0;
  }
  
  .historial li {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .historial h3 {
    margin: 0 0 10px;
  }
  
  .historial p {
    margin: 10px 0 0;
  }
  
  .totales {
    flex: 1; /* Ocupa menos espacio */
    background: #f8f9fa;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 20px;
  }
  
  .totales h2 {
    margin-top: 0;
  }
  
  .totales p {
    margin: 10px 0;
    font-size: 1.1rem;
  }
  </style>
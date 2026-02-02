<template>
  <div class="arqueo">
    <h1>Arqueo de Caja</h1>
    
    <div class="filtros">
      <div class="filtro-fecha">
        <label for="fecha">Filtrar por fecha:</label>
        <input 
          id="fecha"
          type="date" 
          v-model="fechaFiltro" 
        />
        <button @click="mostrarHoy" class="btn-hoy">Hoy</button>
      </div>
    </div>

    <div class="resumen">
      <div class="resumen-card">
        <h3>Tickets del día</h3>
        <p class="numero">{{ ticketsFiltrados.length }}</p>
      </div>
      <div class="resumen-card total">
        <h3>Total del día</h3>
        <p class="numero">{{ totalDelDia.toFixed(2) }}€</p>
      </div>
    </div>

    <div class="tickets-list">
      <h2>Tickets ({{ ticketsFiltrados.length }})</h2>
      
      <div v-if="ticketsFiltrados.length === 0" class="no-tickets">
        <p>No hay tickets para la fecha seleccionada</p>
      </div>

      <div 
        v-for="(ticket, index) in ticketsFiltrados" 
        :key="`${ticket.fecha}-${ticket.mesaId}-${index}`"
        class="ticket-card"
        @click="abrirFormularioFactura(ticket)"
      >
        <div class="ticket-header">
          <h3>Mesa {{ ticket.mesaId }}</h3>
          <span class="fecha">{{ formatearFecha(ticket.fecha) }}</span>
        </div>
        
        <ul class="productos-list">
          <li v-for="producto in ticket.productos" :key="producto.id">
            {{ producto.name }} (x{{ producto.cantidad }}) - 
            {{ (producto.price * producto.cantidad).toFixed(2) }}€
          </li>
        </ul>
        
        <div class="ticket-footer">
          <strong>Total: {{ ticket.total.toFixed(2) }}€</strong>
          <span class="generar-factura-hint">Click para generar factura →</span>
        </div>
      </div>
    </div>

    <!-- Modal para generar factura -->
    <InvoiceForm 
      v-if="ticketSeleccionado"
      :ticket="ticketSeleccionado"
      @close="cerrarFormulario"
      @factura-generada="onFacturaGenerada"
    />

    <!-- Listado de facturas generadas -->
    <div v-if="facturas.length > 0" class="facturas-generadas">
      <h2>Facturas Generadas ({{ facturas.length }})</h2>
      <div 
        v-for="factura in facturas" 
        :key="factura.id"
        class="factura-card"
      >
        <div class="factura-header">
          <h3>{{ factura.tipo }} #{{ factura.id }}</h3>
          <span class="fecha">{{ formatearFecha(factura.fecha) }}</span>
        </div>
        <div class="factura-cliente">
          <p><strong>Cliente:</strong> {{ factura.cliente.nombre }}</p>
          <p><strong>DNI:</strong> {{ factura.cliente.dni }}</p>
        </div>
        <div class="factura-total">
          <strong>Total: {{ factura.total.toFixed(2) }}€</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMesasStore } from '../stores/mesas';
import InvoiceForm from '../components/InvoiceForm.vue';

const mesasStore = useMesasStore();
const fechaFiltro = ref('');
const ticketSeleccionado = ref(null);
const facturas = ref([]);

// Establecer fecha de hoy por defecto
const hoy = new Date();
fechaFiltro.value = hoy.toISOString().split('T')[0];

const ticketsFiltrados = computed(() => {
  if (!fechaFiltro.value) return mesasStore.historial;
  return mesasStore.obtenerHistorialPorFecha(fechaFiltro.value);
});

const totalDelDia = computed(() => {
  return ticketsFiltrados.value.reduce((sum, ticket) => sum + ticket.total, 0);
});

const mostrarHoy = () => {
  const hoy = new Date();
  fechaFiltro.value = hoy.toISOString().split('T')[0];
};

// Computed property updates automatically, no manual filtering needed

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const abrirFormularioFactura = (ticket) => {
  ticketSeleccionado.value = ticket;
};

const cerrarFormulario = () => {
  ticketSeleccionado.value = null;
};

const onFacturaGenerada = (factura) => {
  facturas.value.push(factura);
  // TODO: Replace alert with proper toast notification system
  alert(`Factura ${factura.tipo} generada correctamente para ${factura.cliente.nombre}`);
};
</script>

<style scoped>
.arqueo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.arqueo h1 {
  margin-bottom: 20px;
  color: #333;
}

.filtros {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filtro-fecha {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filtro-fecha label {
  font-weight: 600;
  color: #555;
}

.filtro-fecha input[type="date"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.btn-hoy {
  padding: 8px 16px;
  background: #7c3aed;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-hoy:hover {
  background: #6d28d9;
}

.resumen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.resumen-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.resumen-card h3 {
  margin: 0 0 10px;
  color: #666;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
}

.resumen-card .numero {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
}

.resumen-card.total .numero {
  color: #059669;
}

.tickets-list h2 {
  margin-bottom: 15px;
  color: #333;
}

.no-tickets {
  background: white;
  padding: 40px;
  border-radius: 8px;
  text-align: center;
  color: #999;
}

.ticket-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
}

.ticket-card:hover {
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  transform: translateY(-2px);
  border: 1px solid #7c3aed;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e0e0e0;
}

.ticket-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.fecha {
  color: #666;
  font-size: 13px;
}

.productos-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.productos-list li {
  padding: 5px 0;
  color: #555;
  font-size: 14px;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #e0e0e0;
  margin-top: 10px;
}

.ticket-footer strong {
  color: #333;
  font-size: 16px;
}

.generar-factura-hint {
  color: #7c3aed;
  font-size: 13px;
  font-weight: 600;
}

.facturas-generadas {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.facturas-generadas h2 {
  margin-bottom: 15px;
  color: #333;
}

.factura-card {
  background: #f0fdf4;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 4px solid #059669;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.factura-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.factura-header h3 {
  margin: 0;
  color: #059669;
  font-size: 16px;
}

.factura-cliente {
  margin: 10px 0;
}

.factura-cliente p {
  margin: 5px 0;
  color: #555;
  font-size: 14px;
}

.factura-total {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #bbf7d0;
}

.factura-total strong {
  color: #059669;
  font-size: 16px;
}

@media (max-width: 768px) {
  .arqueo {
    padding: 15px;
  }

  .filtro-fecha {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-fecha input[type="date"],
  .btn-hoy {
    width: 100%;
  }

  .resumen {
    grid-template-columns: 1fr;
  }
}
</style>

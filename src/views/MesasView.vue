<template>
  <div class="mesas">
    <h1>Gestión de Mesas</h1>
    <div 
      v-for="mesa in mesasStore.mesas" 
      :key="mesa.id" 
      class="mesa-card"
      :class="{ selected: mesa.id === mesasStore.selectedMesaId }" 
      @click="selectMesa(mesa.id)"
    >
      <div class="mesa-content">
        <h2>Mesa {{ mesa.id }}</h2>
        <p>{{ mesa.ocupada || mesa.productos.length > 0 ? 'Ocupada' : 'Libre' }}</p>
        <button @click.stop="mesasStore.ocuparMesa(mesa.id)">
          {{ mesa.ocupada || mesa.productos.length > 0 ? 'Liberar' : 'Ocupar' }}
        </button>
        <button @click.stop="openModal(mesa.id)">
          Ver Productos
        </button>
      </div>
    </div>
  </div>

  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>Productos de la Mesa {{ selectedMesaId }}</h2>
      <ul>
        <li v-for="(producto, index) in selectedProductos" :key="index">
          {{ producto.name }} (x{{ producto.cantidad }}) - {{ (producto.price * producto.cantidad).toFixed(2) }}€ 
          <button @click.stop="removeProduct(index)">Eliminar</button>
        </li>
      </ul>
      <p>Total: {{ totalPrice.toFixed(2) }}€</p>
      <button @click.stop="clearProducts">Liberar Mesa</button>
      <button @click.stop="closeModal">Cerrar</button>
    </div>
  </div>
</template>
<script setup>
import { useMesasStore } from '../stores/mesas'; 
import { ref, computed } from 'vue'; 

const mesasStore = useMesasStore();
const showModal = ref(false);
const selectedMesaId = ref(null);

// Usamos computed para reactividad
const selectedProductos = computed(() => {
  if (!selectedMesaId.value) return [];
  const mesa = mesasStore.mesas.find(m => m.id === selectedMesaId.value);
  return mesa ? [...mesa.productos] : [];
});

const totalPrice = computed(() => {
  return selectedProductos.value.reduce((sum, p) => sum + (p.price * p.cantidad || 0), 0); // Multiplicar precio por cantidad
});

const selectMesa = (id) => {
  mesasStore.seleccionarMesa(id);
};

const openModal = (id) => {
  selectedMesaId.value = id;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedMesaId.value = null;
};

const removeProduct = (index) => {
  if (selectedMesaId.value) {
    mesasStore.eliminarProductoDeMesa(selectedMesaId.value, index); // Disminuir cantidad o eliminar
  }
};

const clearProducts = () => {
  if (selectedMesaId.value) {
    mesasStore.limpiarProductosMesa(selectedMesaId.value); // Cambiado a limpiarProductosMesa
    closeModal();
  }
};
</script>

<style>
.mesas {
  display: flex;
  flex-wrap: nowrap; /* Evita que las mesas se envuelvan */
  overflow-x: auto; /* Permite desplazamiento horizontal si es necesario */
  gap: 10px; /* Espaciado entre las mesas */
}

.mesa-card {
  flex: 0 0 auto; /* Evita que las mesas se reduzcan o crezcan */
  border: 1px solid #ccc;
  padding: 10px;
  width: 150px;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.mesa-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mesa-card.selected {
  border-color: #86dfcc;
  color: black;
  background-color: #e6f7ff;
}

.mesa-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Darker background for better contrast */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  color: black; /* Ensure text is visible */
}

.modal-content ul {
  list-style: none;
  padding: 0;
}

.modal-content li {
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #2d8cf0;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.modal-content button:hover {
  background-color: #1a73e8;
}
</style>

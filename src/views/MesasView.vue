<template>
  <div class="mesas">
    <h1>Gestión de Mesas</h1>
    <div
      v-for="mesa in mesasStore.mesas"
      :key="mesa.id"
      class="mesa-card"
      :class="{
        selected: mesa.id === mesasStore.selectedMesaId,
        ocupada: mesa.ocupada || mesa.productos.length > 0
      }"
      @click="selectMesa(mesa.id)"
    >
      <div class="mesa-content">
        <input
          type="text"
          v-model="mesa.nombre"
          placeholder="Nombre de la mesa"
          class="mesa-nombre-input"
          @blur="updateMesaNombre(mesa.id, mesa.nombre)"
        />
        <h2>{{ mesa.nombre || `Mesa ${mesa.id}` }}</h2>
        <p>{{ mesa.ocupada || mesa.productos.length > 0 ? 'Ocupada' : 'Libre' }}</p>
        <div class="mesa-actions">
          <button @click.stop="mesasStore.ocuparMesa(mesa.id)">
            {{ mesa.ocupada || mesa.productos.length > 0 ? 'Liberar' : 'Ocupar' }}
          </button>
          <button @click.stop="openModal(mesa.id)">
            Ver Productos
          </button>
        </div>
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
      <div class="modal-buttons">
        <button @click.stop="clearProducts">Liberar Mesa</button>
        <button @click.stop="closeModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMesasStore } from '../stores/mesas';
import { ref, computed } from 'vue';

const mesasStore = useMesasStore();
const showModal = ref(false);
const selectedMesaId = ref(null);

const selectedProductos = computed(() => {
  if (!selectedMesaId.value) return [];
  const mesa = mesasStore.mesas.find(m => m.id === selectedMesaId.value);
  return mesa ? [...mesa.productos] : [];
});

const totalPrice = computed(() => {
  return selectedProductos.value.reduce((sum, p) => sum + (p.price * p.cantidad || 0), 0);
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
    mesasStore.eliminarProductoDeMesa(selectedMesaId.value, index);
  }
};

const clearProducts = () => {
  if (selectedMesaId.value) {
    mesasStore.limpiarProductosMesa(selectedMesaId.value);
    closeModal();
  }
};

const updateMesaNombre = (id, nuevoNombre) => {
  mesasStore.cambiarNombreMesa(id, nuevoNombre);
};
</script>

<style>
.mesas {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Forzar 3 columnas */
  overflow-x: auto;
  gap: 10px;
  padding: 20px;
}

.mesa-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer; /* Asegúrate de que el cursor indique que es interactivo */
  background-color: #f8f9fa; /* Color de fondo por defecto (libre) */
}

.mesa-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mesa-card.selected {
  border-color: #86dfcc;
  color: black;
  background-color: #e6f7ff; /* Color de fondo cuando está seleccionada */
}

.mesa-card.ocupada {
  background-color: #ffe0b2; /* Color de fondo anaranjado para mesas ocupadas */
  border-color: #ffb347;
}
.mesa-card.ocupada-seleccionada {
  background-color: #d6b3ff; /* Morado claro */
  border-color: #a673ff; /* Borde morado más oscuro */
  color: white; /* Texto blanco para mejor contraste */
}

.mesa-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.mesa-nombre-input {
  width: 100%;
  padding: 8px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  text-align: center;
}

.mesa-content h2 {
  margin-top: 5px;
  font-size: 1.2rem;
}

.mesa-content p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.mesa-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.mesa-actions button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.mesa-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.mesa-actions button:last-child {
  background-color: #28a745;
  color: white;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  color: black;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 15px;
}

.modal-content ul {
  list-style: none;
  padding: 0;
  margin-bottom: 15px;
}

.modal-content li {
  margin-bottom: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content li:last-child {
  border-bottom: none;
}

.modal-content li button {
  padding: 5px 10px;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.modal-content li button:hover {
  background-color: #c82333;
}

.modal-content p {
  font-weight: bold;
  margin-bottom: 15px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.modal-buttons button:first-child {
  background-color: #6c757d;
  color: white;
}

.modal-buttons button:first-child:hover {
  background-color: #5a6268;
}

.modal-buttons button:last-child {
  background-color: #007bff;
  color: white;
}

.modal-buttons button:last-child:hover {
  background-color: #0056b3;
}
</style>
<template>
  <div class="mesas-container">
    <h1>Gestión de Mesas</h1>
    <div class="mesas-grid">
      <div
        v-for="mesa in mesasStore.mesas"
        :key="mesa.id"
        class="mesa-card"
        :class="{
          selected: mesa.id === mesasStore.selectedMesaId,
          ocupada: mesa.ocupada || mesa.productos.length > 0,
          'selected-ocupada': (mesa.id === mesasStore.selectedMesaId) && (mesa.ocupada || mesa.productos.length > 0)
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
          <p :class="{
            'text-ocupada': mesa.ocupada || mesa.productos.length > 0,
            'text-libre': !mesa.ocupada && mesa.productos.length === 0
          }">
            {{ mesa.ocupada || mesa.productos.length > 0 ? 'Ocupada' : 'Libre' }}
          </p>
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
  </div>
  <ProductList/>
</template>
<script setup>
import { useMesasStore } from '../stores/mesas';
import { ref, computed } from 'vue';
import ProductList from '../components/ProductList.vue';
import FormManagement from '../components/FormManagement.vue';

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
<style scoped>
/* Contenedor principal */
.mesas-container {
  padding: 20px;
  text-align: center; /* Centrar el título */
}

/* Estilo del título */
.mesas-container h1 {
  margin-bottom: 20px; /* Espacio entre el título y las mesas */
  font-size: 2rem; /* Tamaño del título */
  color: #333; /* Color del texto */
}

/* Contenedor de las mesas */
.mesas-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr)); /* 3 columnas con ancho mínimo de 250px */
  gap: 20px; /* Espacio entre las mesas */
  justify-content: center; /* Centrar las mesas horizontalmente */
  padding: 20px;
  width: 100%; /* Ocupar todo el ancho disponible */
  max-width: 1200px; /* Limitar el ancho máximo para pantallas grandes */
  margin: 0 auto; /* Centrar el contenedor */
}

/* Tarjetas de las mesas */
.mesa-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  height: 100%; /* Asegurar que todas las tarjetas tienen la misma altura */
  min-height: 180px; /* Altura mínima para las tarjetas */
  background-color: #fff; /* Fondo blanco */
}

/* Contenido de las tarjetas */
.mesa-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100%;
}

/* Input para el nombre de la mesa */
.mesa-nombre-input {
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.1rem;
  text-align: center;
}

/* Título dentro de las tarjetas */
.mesa-content h2 {
  margin-top: 8px;
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #333;
}

/* Texto de estado (Libre/Ocupada) */
.mesa-content p {
  font-size: 1rem;
  margin-bottom: 15px;
}

.text-ocupada {
  font-weight: bold;
  color: #d63384 !important; /* Rosa para texto "Ocupada" */
}

.text-libre {
  font-weight: bold;
  color: #28a745 !important; /* Verde para texto "Libre" */
}

/* Botones dentro de las tarjetas */
.mesa-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
  margin-top: auto; /* Empujar los botones hacia abajo */
}

.mesa-actions button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.mesa-actions button:first-child {
  background-color: #007bff;
  color: white;
}

.mesa-actions button:last-child {
  background-color: #28a745;
  color: white;
}

/* Estilo para mesas seleccionadas */
.mesa-card.selected {
  background-color: #007bff; /* Color de fondo para la mesa seleccionada */
  color: white; /* Cambiar el color del texto */
  border-color: #0056b3; /* Cambiar el color del borde */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Añadir un efecto de sombra */
}

/* Estilo para mesas ocupadas */
.mesa-card.ocupada {
  background-color: #ffc107; /* Amarillo para mesas ocupadas */
  color: black;
  border-color: #e0a800;
}

/* Estilo para mesas ocupadas y seleccionadas */
.mesa-card.selected-ocupada {
  background-color: #dc3545; /* Rojo para mesas ocupadas y seleccionadas */
  color: white;
  border-color: #bd2130;
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

.mesa-card.ocupada h2,
.mesa-card.ocupada p {
  color: black;
}

.mesa-card.selected h2,
.mesa-card.selected p,
.mesa-card.selected-ocupada h2,
.mesa-card.selected-ocupada p {
  color: white;
}

/* Efectos hover */
.mesa-card:hover {
  transform: scale(1.02); /* Aumentar ligeramente el tamaño */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Añadir sombra */
}

/* Responsive para pantallas más pequeñas */
@media (max-width: 900px) {
  .mesas-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas medianas */
  }
}

@media (max-width: 600px) {
  .mesas-grid {
    grid-template-columns: 1fr; /* 1 columna en pantallas pequeñas */
  }
}
</style>
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
            <button @click.stop="openModal(mesa.id)">Ver Productos</button>
            <button @click.stop="clearProducts">Limpiar Productos</button>
            <button @click.stop="liberarMesa(mesa.id)">Liberar Mesa</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Productos de la Mesa {{ selectedMesaId }}</h2>
        <ul>
          <li v-for="(producto, index) in selectedProductos" :key="index">
            {{ producto.name }} -
            <span v-if="producto.categoria === 'Chacinas'">
              {{ producto.gramos }}g = €{{ (producto.precioPor100g * (producto.gramos / 100)).toFixed(2) }}
              <input type="number" v-model.number="producto.gramos" min="1" step="5" @change="actualizarPrecioPorGramos(producto)" />
            </span>
            <span v-else>
              Cantidad: {{ producto.cantidad }} - €{{ (producto.price * producto.cantidad).toFixed(2) }}
              <button @click="decreaseQuantity(index)">-</button>
              <button @click="increaseQuantity(index)">+</button>
            </span>
            <button @click="removeProduct(index)">Eliminar</button>
            <button @click.stop="() => { liberarMesa(selectedMesaId); closeModal(); }">Liberar Mesa</button>
          </li>
        </ul>

        <p>Total: €{{ totalPrice.toFixed(2) }}</p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <button @click="addMesa" style="padding: 10px 20px; font-size: 1rem; background-color: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer;">
        ➕ Añadir Mesa
      </button>
    </div>

    <ProductList @productoSeleccionado="agregarProductoAMesa" />
  </div>
</template>

<script setup>
import { useMesasStore } from '../stores/mesas';
import { ref, computed } from 'vue';
import ProductList from '../components/ProductList.vue';

const mesasStore = useMesasStore();
const showModal = ref(false);
const selectedMesaId = ref(null);

const liberarMesa = (id) => {
  mesasStore.limpiarProductosMesa(id);
};

const selectedProductos = computed(() => {
  if (!selectedMesaId.value) return [];
  const mesa = mesasStore.mesas.find(m => m.id === selectedMesaId.value);
  return mesa ? mesa.productos : [];
});

const totalPrice = computed(() => {
  return selectedProductos.value.reduce((sum, p) => {
    if (p.categoria === 'Chacinas') {
      return sum + (p.precioPor100g * (p.gramos / 100));
    } else {
      return sum + (p.price * p.cantidad);
    }
  }, 0);
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

const increaseQuantity = (index) => {
  const mesa = mesasStore.mesas.find(m => m.id === selectedMesaId.value);
  if (mesa && mesa.productos[index]) {
    mesa.productos[index].cantidad += 1;
  }
};

const decreaseQuantity = (index) => {
  const mesa = mesasStore.mesas.find(m => m.id === selectedMesaId.value);
  if (mesa && mesa.productos[index].cantidad > 1) {
    mesa.productos[index].cantidad -= 1;
  }
};

const addMesa = () => {
  const nuevaMesa = {
    id: mesasStore.mesas.length + 1,
    nombre: '',
    productos: [],
    ocupada: false
  };
  mesasStore.mesas.push(nuevaMesa);
};

const agregarProductoAMesa = (producto) => {
  const mesa = mesasStore.mesas.find(m => m.id === mesasStore.selectedMesaId);
  if (!mesa) return;

  if (producto.categoria === 'Chacinas') {
    mesa.productos.push({
      ...producto,
      gramos: 100, // valor por defecto
      precioPor100g: producto.price // suponiendo que el precio original es por 100g
    });
  } else {
    const existente = mesa.productos.find(p => p.id === producto.id && p.categoria !== 'Chacinas');
    if (existente) {
      existente.cantidad += 1;
    } else {
      mesa.productos.push({ ...producto, cantidad: 1 });
    }
  }
  mesa.ocupada = true;
};

const actualizarPrecioPorGramos = (producto) => {
  // No es necesario hacer nada aquí si usamos `totalPrice` dinámico
  // Pero podrías validar el valor si lo deseas
  if (producto.gramos < 1) producto.gramos = 1;
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
  color: #fe3398 !important; /* Rosa para texto "Ocupada" */
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
  background-color: #8eb2d8; /* Color de fondo para la mesa seleccionada */
  color: white; /* Cambiar el color del texto */
  border-color: #0056b3; /* Cambiar el color del borde */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Añadir un efecto de sombra */
}

/* Estilo para mesas ocupadas */
.mesa-card.ocupada {
  background-color: #f0d78dc8; /* Amarillo para mesas ocupadas */
  color: black;
  border-color: #caa844d5;
}

/* Estilo para mesas ocupadas y seleccionadas */
.mesa-card.selected-ocupada {
  background-color: #de5765ae; /* Rojo para mesas ocupadas y seleccionadas */
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
/* Estilos del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
}

.modal ul li button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.modal ul li button:first-child {
  background-color: #dc3545; /* Rojo para disminuir */
  color: white;
}

.modal ul li button:nth-child(2) {
  background-color: #28a745; /* Verde para aumentar */
  color: white;
}

.modal ul li button:last-child {
  background-color: #007bff; /* Azul para eliminar */
  color: white;
}
</style>
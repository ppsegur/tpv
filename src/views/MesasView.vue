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
          'selected-ocupada': (mesa.id === mesasStore.selectedMesaId) && (mesa.ocupada || mesa.productos.length > 0),
          'not-selected': mesasStore.selectedMesaId && mesa.id !== mesasStore.selectedMesaId
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
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Productos de la Mesa {{ selectedMesaId }}</h2>
          <button class="close-icon" @click="closeModal" aria-label="Cerrar">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="selectedProductos.length === 0" class="empty-state">
            <p>No hay productos en esta mesa</p>
          </div>
          
          <div v-else class="productos-list">
            <div v-for="(producto, index) in selectedProductos" :key="index" class="producto-item">
              <div class="producto-info">
                <h3>{{ producto.name }}</h3>
                <span v-if="producto.categoria === 'Chacinas'" class="producto-details">
                  <div class="weight-control">
                    <label>Peso (g):</label>
                    <input 
                      type="number" 
                      v-model.number="producto.gramos" 
                      min="1" 
                      step="5" 
                      @change="actualizarPrecioPorGramos(producto)" 
                      class="weight-input"
                    />
                  </div>
                  <span class="precio">€{{ (producto.precioPor100g * (producto.gramos / 100)).toFixed(2) }}</span>
                </span>
                <span v-else class="producto-details">
                  <div class="quantity-control">
                    <button class="qty-btn" @click="decreaseQuantity(index)" aria-label="Disminuir">−</button>
                    <span class="cantidad">{{ producto.cantidad }}</span>
                    <button class="qty-btn" @click="increaseQuantity(index)" aria-label="Aumentar">+</button>
                  </div>
                  <span class="precio">€{{ (producto.price * producto.cantidad).toFixed(2) }}</span>
                </span>
              </div>
              <div class="producto-actions">
                <button class="btn-eliminar" @click="removeProduct(index)">
                  <span>🗑️</span> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <div class="total-section">
            <span class="total-label">Total:</span>
            <span class="total-price">€{{ totalPrice.toFixed(2) }}</span>
          </div>
          <div class="footer-actions">
            <button class="btn-secondary" @click="closeModal">Cerrar</button>
            <button 
              v-if="selectedProductos.length > 0" 
              class="btn-primary" 
              @click.stop="() => { liberarMesa(selectedMesaId); closeModal(); }"
            >
              Liberar Mesa
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <button @click="addMesa" class="btn-add-mesa">
        <span class="icon">➕</span> Añadir Mesa
      </button>
    </div>

    <div v-if="!mesasStore.selectedMesaId" class="no-table-selected">
      <p>👆 Selecciona una mesa para ver los productos disponibles</p>
    </div>

    <ProductList v-if="mesasStore.selectedMesaId" @productoSeleccionado="agregarProductoAMesa" />
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
  if (confirm('¿Estás seguro de que quieres liberar esta mesa?')) {
    mesasStore.limpiarProductosMesa(id);
    mesasStore.actualizarStockAlLiberarMesa(id); // Actualiza el stock
  }
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
  if (mesasStore.selectedMesaId) {
    mesasStore.limpiarProductosMesa(mesasStore.selectedMesaId);
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
  const nuevoId = Date.now(); // o usa una librería como uuid
  mesasStore.mesas.push({
    id: nuevoId,
    nombre: '',
    productos: [],
    ocupada: false
  });
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
  margin-bottom: 30px; /* Espacio entre el título y las mesas */
  font-size: 2.5rem; /* Tamaño del título */
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%; /* Asegurar que todas las tarjetas tienen la misma altura */
  min-height: 180px; /* Altura mínima para las tarjetas */
  background-color: #fff; /* Fondo blanco */
}

/* Efecto transparente/vidrio para mesas no seleccionadas */
.mesa-card.not-selected {
  opacity: 0.4;
  filter: blur(1px);
  transform: scale(0.98);
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
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mesa-actions button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.mesa-actions button:active {
  transform: translateY(0);
}

.mesa-actions button:first-child {
  background-color: #0d6efd;
  color: white;
}

.mesa-actions button:first-child:hover {
  background-color: #0b5ed7;
}

.mesa-actions button:nth-child(2) {
  background-color: #ffc107;
  color: #212529;
}

.mesa-actions button:nth-child(2):hover {
  background-color: #ffb300;
}

.mesa-actions button:last-child {
  background-color: #198754;
  color: white;
}

.mesa-actions button:last-child:hover {
  background-color: #157347;
}

/* Estilo para mesas seleccionadas */
.mesa-card.selected {
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%); /* Gradiente azul para la mesa seleccionada */
  color: white; /* Cambiar el color del texto */
  border: 3px solid #0056b3; /* Borde más grueso */
  box-shadow: 0 8px 24px rgba(0, 86, 179, 0.4), 0 0 20px rgba(74, 144, 226, 0.3); /* Sombra más prominente con brillo */
  transform: scale(1.05); /* Aumentar ligeramente el tamaño */
}

/* Estilo para mesas ocupadas */
.mesa-card.ocupada {
  background-color: #f0d78dc8; /* Amarillo para mesas ocupadas */
  color: black;
  border-color: #caa844d5;
}

/* Estilo para mesas ocupadas y seleccionadas */
.mesa-card.selected-ocupada {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); /* Gradiente rojo para mesas ocupadas y seleccionadas */
  color: white;
  border: 3px solid #bd2130;
  box-shadow: 0 8px 24px rgba(220, 53, 69, 0.4), 0 0 20px rgba(231, 76, 60, 0.3);
  transform: scale(1.05);
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
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.mesa-card.not-selected:hover {
  opacity: 0.6;
  filter: blur(0.5px);
  transform: scale(0.98); /* Mantener escala reducida */
}

.mesa-card.selected:hover,
.mesa-card.selected-ocupada:hover {
  transform: scale(1.08);
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
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 600px;
  max-width: 95%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 2px solid #e9ecef;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #212529;
}

.close-icon {
  background: none;
  border: none;
  font-size: 2rem;
  color: #6c757d;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  padding: 0;
  line-height: 1;
}

.close-icon:hover {
  background-color: #f8f9fa;
  color: #dc3545;
}

.modal-body {
  padding: 24px 28px;
  overflow-y: auto;
  flex: 1;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

.productos-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.producto-item {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.producto-item:hover {
  border-color: #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.producto-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.producto-info h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
}

.producto-details {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.weight-control,
.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weight-control label {
  font-size: 0.95rem;
  color: #495057;
  font-weight: 500;
}

.weight-input {
  width: 90px;
  padding: 6px 12px;
  border: 2px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.weight-input:focus {
  outline: none;
  border-color: #0d6efd;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background-color: #0d6efd;
  color: white;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-weight: 600;
  padding: 0;
}

.qty-btn:hover {
  background-color: #0b5ed7;
  transform: scale(1.05);
}

.qty-btn:active {
  transform: scale(0.95);
}

.cantidad {
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  color: #212529;
}

.precio {
  font-size: 1.15rem;
  font-weight: 700;
  color: #198754;
  margin-left: auto;
}

.producto-actions {
  display: flex;
  gap: 8px;
}

.btn-eliminar {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-eliminar:hover {
  background-color: #bb2d3b;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.btn-eliminar:active {
  transform: translateY(0);
}

.modal-footer {
  padding: 20px 28px;
  border-top: 2px solid #e9ecef;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.total-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.total-label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #495057;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #198754;
}

.footer-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #198754;
  color: white;
}

.btn-primary:hover {
  background-color: #157347;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5c636a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-primary:active,
.btn-secondary:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .modal {
    width: 100%;
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .producto-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .producto-actions {
    width: 100%;
  }

  .btn-eliminar {
    width: 100%;
    justify-content: center;
  }

  .footer-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}

/* Botón añadir mesa */
.btn-add-mesa {
  padding: 14px 28px;
  font-size: 1.1rem;
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(23, 162, 184, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-add-mesa:hover {
  background: linear-gradient(135deg, #138496 0%, #117a8b 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.4);
}

.btn-add-mesa:active {
  transform: translateY(0);
}

.btn-add-mesa .icon {
  font-size: 1.2rem;
}

/* Mensaje cuando no hay mesa seleccionada */
.no-table-selected {
  text-align: center;
  margin: 40px auto;
  padding: 30px;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  animation: fadeIn 0.5s ease;
}

.no-table-selected p {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1976d2;
  margin: 0;
}
</style>
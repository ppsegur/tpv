<template>
  <div class="products-management">
    <!-- Encabezado con filtros -->
    <div class="filters-header">
      <h2>Gestión de Productos</h2>
      <div class="filters">
        <input 
          v-model="productSearch" 
          placeholder="Buscar producto..."
          class="search-input"
        >
      </div>

      <!-- Botones de categoría en lugar de select -->
      <div class="category-buttons">
        <button 
          :class="{ active: selectedCategory === '' }" 
          @click="selectedCategory = ''"
        >
          Todas las categorías
        </button>
        <button 
          v-for="categoria in productStore.categories" 
          :key="categoria.id"
          :class="{ active: selectedCategory === categoria.name }"
          @click="selectedCategory = categoria.name"
        >
          {{ categoria.name }}
        </button>
      </div>
    </div>

    <!-- Lista de productos -->
    <div class="products-grid">
      <div 
        v-for="product in filteredProducts" 
        :key="product.id" 
        class="product-card"
        :style="{ backgroundColor: getCategoryColor(product.categoryId) }"
      >
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="category">{{ productStore.getCategoryName(product.categoryId) }}</p>
          <p class="price">€{{ product.price.toFixed(2) }}</p>
        </div>
        <div class="product-actions">
          <button @click.stop="openQuantityModal(product)" class="action-btn add-btn">
            Añadir a Mesa
          </button>
          <button @click.stop="deleteProduct(product.id)" class="action-btn delete-btn">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para seleccionar cantidad -->
    <div v-if="showQuantityModal" class="modal-overlay" @click.self="closeQuantityModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Selecciona la cantidad</h2>
          <button class="close-icon" @click="closeQuantityModal" aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body">
          <p class="product-name">{{ selectedProduct.name }}</p>
          <div class="quantity-grid">
            <button 
              v-for="quantity in 9" 
              :key="quantity" 
              @click="addProductToMesa(quantity)"
              class="quantity-btn"
            >
              {{ quantity }}
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeQuantityModal" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
    
    <!-- Modal para productos por peso -->
    <div v-if="showWeightModal" class="modal-overlay" @click.self="closeWeightModal">
      <div class="modal">
        <div class="modal-header">
          <h2>Introduce el peso</h2>
          <button class="close-icon" @click="closeWeightModal" aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body">
          <p class="product-name">{{ selectedProduct.name }}</p>
          <div class="weight-input-container">
            <label for="weight-input">Peso en gramos:</label>
            <input 
              id="weight-input"
              type="number" 
              v-model="enteredWeight" 
              min="1" 
              placeholder="Ej: 250" 
              class="weight-input"
              @keyup.enter="addProductByWeight"
              autofocus
            />
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeWeightModal" class="btn-cancel">Cancelar</button>
          <button @click="addProductByWeight" class="btn-accept">Aceptar</button>
        </div>
      </div>
    </div>


    <!-- Mensaje de confirmación -->
    <div v-if="showConfirmation" class="confirmation-message">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script setup>
import { useMesasStore } from '../stores/mesas.js'; 
import { useProductStore } from '../stores/productStore.js';
import { ref, computed } from 'vue';

const productStore = useProductStore();
const mesasStore = useMesasStore();

const productSearch = ref('');
const selectedCategory = ref('');

const showQuantityModal = ref(false);
const selectedProduct = ref(null);

const showWeightModal = ref(false);
const enteredWeight = ref('');

const confirmationMessage = ref('');
const showConfirmation = ref(false);

const displayConfirmation = (message) => {
  confirmationMessage.value = message;
  showConfirmation.value = true;
  setTimeout(() => {
    showConfirmation.value = false;
    confirmationMessage.value = '';
  }, 3000);
};

const openQuantityModal = (product) => {
  selectedProduct.value = product;

  const categoryName = productStore.getCategoryName(product.categoryId).toLowerCase();
  const isByWeight = categoryName.includes('chacina'); // Puedes cambiar esto según el nombre exacto

  if (isByWeight) {
    showWeightModal.value = true;
    enteredWeight.value = '';
  } else {
    showQuantityModal.value = true;
  }
};


const closeQuantityModal = () => {
  selectedProduct.value = null;
  showQuantityModal.value = false;
};

const addProductToMesa = (quantity) => {
  if (!mesasStore.selectedMesaId) {
    alert('Por favor, selecciona una mesa primero.');
    closeQuantityModal();
    return;
  }

  mesasStore.agregarProducto({ 
    ...selectedProduct.value, 
    cantidad: quantity 
  });

  const mesaId = mesasStore.selectedMesaId;
  displayConfirmation(`"${selectedProduct.value.name}" añadido correctamente a la mesa número ${mesaId} (${quantity} veces)`);
  closeQuantityModal();
};

const filteredProducts = computed(() => {
  let result = [...productStore.products];

  if (selectedCategory.value) {
    const category = productStore.categories.find(c => 
      c.name.toLowerCase() === selectedCategory.value.toLowerCase()
    );
    if (category) {
      result = result.filter(p => p.categoryId === category.id);
    } else {
      result = [];
    }
  }

  if (productSearch.value) {
    const searchTerm = productSearch.value.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchTerm) || 
      productStore.getCategoryName(p.categoryId).toLowerCase().includes(searchTerm)
    );
  }

  return result;
});

const deleteProduct = (productId) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    productStore.deleteProduct(productId);
  }
};

const getCategoryColor = (categoryId) => {
  const colors = {
    1: '#d1e7dd',
    2: '#cfe2ff',
    3: '#f8d7da',
    4: '#fff3cd',
    5: '#d9edf7',
    6: '#e2e3e5',
  };
  return colors[categoryId] || '#ffffff';
};


const addProductByWeight = () => {
  const grams = parseFloat(enteredWeight.value);

  if (isNaN(grams) || grams <= 0) {
    alert('Por favor, introduce un peso válido.');
    return;
  }

  const precioPorGramo = selectedProduct.value.price / 1000;
  const precioFinal = +(precioPorGramo * grams).toFixed(2);

  mesasStore.agregarProducto({
    ...selectedProduct.value,
    cantidad: 1,
    peso: grams,
    precioFinal: precioFinal
  });

  const mesaId = mesasStore.selectedMesaId;
  displayConfirmation(`"${selectedProduct.value.name}" añadido a mesa ${mesaId} (${grams}g - €${precioFinal})`);
  closeWeightModal();
};
const closeWeightModal = () => {
  showWeightModal.value = false;
  selectedProduct.value = null;
  enteredWeight.value = '';
};

</script>

<style scoped>
.products-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.filters-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filters {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-input {
  padding: 10px 15px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-width: 300px;
  flex: 2;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.category-buttons button {
  padding: 8px 15px;
  border: none;
  background-color: #f0f0f0;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.category-buttons button:hover {
  background-color: #d6eaff;
  color: inherit;
}

.category-buttons button.active {
  background-color: #0d6efd;
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  padding: 15px;
  border-radius: 8px;
  color: #333;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-info h3 {
  margin: 0 0 5px;
}

.category {
  font-size: 0.9rem;
  color: #666;
}

.price {
  font-weight: bold;
  margin-top: 5px;
}

.product-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
}

.add-btn {
  background-color: #198754;
  color: white;
}

.add-btn:hover {
  background-color: #157347;
  box-shadow: 0 4px 8px rgba(25, 135, 84, 0.3);
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #bb2d3b;
  box-shadow: 0 4px 8px rgba(220, 53, 69, 0.3);
}

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
  z-index: 999;
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
  width: 500px;
  max-width: 95%;
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
  font-size: 1.4rem;
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
  padding: 28px;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0d6efd;
  margin: 0 0 24px 0;
  text-align: center;
}

.quantity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.quantity-btn {
  padding: 16px;
  background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
  border: none;
  color: white;
  border-radius: 12px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.2);
}

.quantity-btn:hover {
  background: linear-gradient(135deg, #0b5ed7 0%, #0a58ca 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.4);
}

.quantity-btn:active {
  transform: translateY(0);
}

.weight-input-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.weight-input-container label {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
}

.weight-input {
  padding: 14px 16px;
  font-size: 1.1rem;
  border: 2px solid #ced4da;
  border-radius: 10px;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.weight-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

.modal-footer {
  padding: 20px 28px;
  border-top: 2px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-accept {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5c636a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-accept {
  background-color: #198754;
  color: white;
}

.btn-accept:hover {
  background-color: #157347;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 135, 84, 0.3);
}

.btn-cancel:active,
.btn-accept:active {
  transform: translateY(0);
}

@media (max-width: 576px) {
  .quantity-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .quantity-btn {
    padding: 14px;
    font-size: 1.1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-accept {
    width: 100%;
  }
}

.confirmation-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-size: 1.2rem;
  text-align: center;
  font-weight: bold;
}
</style>

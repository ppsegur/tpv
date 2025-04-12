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
    <div v-if="showQuantityModal" class="modal-overlay">
      <div class="modal">
        <h2>Selecciona la cantidad para "{{ selectedProduct.name }}"</h2>
        <div class="quantity-options">
          <button 
            v-for="quantity in 9" 
            :key="quantity" 
            @click="addProductToMesa(quantity)"
            class="quantity-btn"
          >
            {{ quantity }}
          </button>
        </div>
        <button @click="closeQuantityModal" class="close-btn">Cancelar</button>
      </div>
    </div>
    <!-- Modal para productos por peso -->
<div v-if="showWeightModal" class="modal-overlay">
  <div class="modal">
    <h2>Introduce el peso (en gramos) para "{{ selectedProduct.name }}"</h2>
    <input type="number" v-model="enteredWeight" min="1" class="search-input" />
    <div style="margin-top: 20px;">
      <button @click="addProductByWeight" class="quantity-btn">Aceptar</button>
      <button @click="closeWeightModal" class="close-btn">Cancelar</button>
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
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background-color: #28a745;
  color: white;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
}

.quantity-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin: 20px 0;
}

.quantity-btn {
  padding: 10px 15px;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}

.close-btn {
  background-color: #6c757d;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
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
